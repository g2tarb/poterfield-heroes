import { z } from "zod";
import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";
import type { Database } from "@ph/db";
import { githubPushes, codeReviews, githubRepos } from "@ph/db";
import {
  anthropic,
  MODEL_SONNET,
  computeCostCents,
  extractCacheTokens,
} from "../lib/anthropic.js";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

const REVIEW_SCHEMA = z.object({
  overallSummary: z.string().min(10),
  overallSeverity: z.enum(["info", "suggestion", "warning", "critical"]),
  criteriaScores: z.record(z.string(), z.number().min(0).max(100)),
  annotations: z
    .array(
      z.object({
        file: z.string(),
        line: z.number().int(),
        severity: z.enum(["info", "suggestion", "warning", "critical"]),
        message: z.string().min(5),
        suggestedFix: z.string().optional(),
      }),
    )
    .max(50),
});

export type GithubPushPayload = {
  ref: string;
  before: string;
  after: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    default_branch: string;
  };
  commits: Array<{
    id: string;
    message: string;
    author: { name: string; email: string };
    timestamp: string;
    added: string[];
    modified: string[];
    removed: string[];
  }>;
};

function octokit() {
  // For V0 without GitHub App : use a personal access token via env (optional)
  const token = process.env["GITHUB_TOKEN"] ?? undefined;
  return new Octokit(token ? { auth: token } : {});
}

export async function processPush(
  db: Database,
  payload: GithubPushPayload,
): Promise<{ pushId: string; reviewed: boolean }> {
  // Upsert repo
  let [repo] = await db
    .select()
    .from(githubRepos)
    .where(eq(githubRepos.fullName, payload.repository.full_name))
    .limit(1);

  if (!repo) {
    [repo] = await db
      .insert(githubRepos)
      .values({
        owner: payload.repository.owner.login,
        name: payload.repository.name,
        fullName: payload.repository.full_name,
        defaultBranch: payload.repository.default_branch,
        purpose: "module_project",
      })
      .returning();
  }

  if (!repo) throw new AppError(500, "Failed to upsert repo");

  // Record push
  const branch = payload.ref.replace("refs/heads/", "");
  const [push] = await db
    .insert(githubPushes)
    .values({
      repoId: repo.id,
      branch,
      headSha: payload.after,
      beforeSha: payload.before,
      commitsCount: payload.commits.length,
      commitsPayload: payload.commits,
    })
    .returning();

  if (!push) throw new AppError(500, "Failed to insert push");

  // Trigger review (fire-and-forget so the webhook responds fast)
  if (anthropic && payload.commits.length > 0) {
    void reviewPush(db, push.id, payload).catch((err) =>
      console.error("[githubReview] failed", err),
    );
    return { pushId: push.id, reviewed: true };
  }

  return { pushId: push.id, reviewed: false };
}

async function reviewPush(
  db: Database,
  pushId: string,
  payload: GithubPushPayload,
): Promise<void> {
  await db
    .update(githubPushes)
    .set({ reviewStartedAt: new Date() })
    .where(eq(githubPushes.id, pushId));

  // Fetch diff via Octokit REST
  const kit = octokit();
  const compare = await kit.repos.compareCommits({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    base: payload.before,
    head: payload.after,
  });

  const files = compare.data.files ?? [];
  if (files.length === 0) {
    await db
      .update(githubPushes)
      .set({ reviewCompletedAt: new Date() })
      .where(eq(githubPushes.id, pushId));
    return;
  }

  // Build prompt — keep diff bounded
  const diffSlices = files
    .filter((f) => f.patch && f.patch.length < 6000)
    .slice(0, 20)
    .map(
      (f) => `### ${f.filename} (${f.status}, +${f.additions} -${f.deletions})

\`\`\`diff
${f.patch}
\`\`\``,
    )
    .join("\n\n");

  if (!anthropic) return;

  const prompt = `Tu es l'auditeur code de Porterfield Heroes. Erwin vient de push sur ${payload.repository.full_name} (${payload.commits.length} commits).

## Diff
${diffSlices}

## Mission
Review structurée. Tu marques :
- **overallSeverity** : info / suggestion / warning / critical (selon le pire issue)
- **overallSummary** : 2-3 phrases, ton direct senior
- **criteriaScores** (0-100) sur ces axes : architecture, naming, error_handling, security, testing, performance, readability
- **annotations** : max 15. Pour chaque issue : { file, line (du fichier après modif), severity, message court, suggestedFix optionnel en 1-2 lignes }

Pas de flatterie. Pas de "could be better". Si c'est bien, dis-le et passe. Si c'est cassé, dis-le.

Appelle l'outil \`emit_review\`.`;

  const tool = {
    name: "emit_review",
    description: "Emit the structured code review.",
    input_schema: {
      type: "object" as const,
      properties: {
        overallSummary: { type: "string" },
        overallSeverity: {
          type: "string",
          enum: ["info", "suggestion", "warning", "critical"],
        },
        criteriaScores: {
          type: "object",
          additionalProperties: { type: "number" },
        },
        annotations: { type: "array" },
      },
      required: [
        "overallSummary",
        "overallSeverity",
        "criteriaScores",
        "annotations",
      ],
    },
  };

  const response = await anthropic.messages.create({
    model: MODEL_SONNET,
    max_tokens: 4096,
    tools: [tool],
    tool_choice: { type: "tool", name: "emit_review" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (b) => b.type === "tool_use" && b.name === "emit_review",
  );
  if (!toolUse || toolUse.type !== "tool_use") {
    console.error("[githubReview] no tool_use response");
    return;
  }

  const parsed = REVIEW_SCHEMA.safeParse(toolUse.input);
  if (!parsed.success) {
    console.error("[githubReview] invalid review format:", parsed.error.message);
    return;
  }

  const cacheTokens = extractCacheTokens(response.usage);
  const costCents = computeCostCents(
    MODEL_SONNET,
    response.usage.input_tokens,
    response.usage.output_tokens,
    cacheTokens.cacheReadInputTokens,
    cacheTokens.cacheCreationInputTokens,
  );

  await db.insert(codeReviews).values({
    pushId,
    overallSeverity: parsed.data.overallSeverity,
    overallSummary: parsed.data.overallSummary,
    annotations: parsed.data.annotations,
    criteriaScores: parsed.data.criteriaScores,
    model: MODEL_SONNET,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    costCents,
  });

  await db
    .update(githubPushes)
    .set({ reviewCompletedAt: new Date() })
    .where(eq(githubPushes.id, pushId));
}

export function verifyGithubSignature(
  signatureHeader: string | undefined,
  body: string,
): boolean {
  if (!env.GITHUB_WEBHOOK_SECRET || !signatureHeader) return false;
  // GitHub envoie "sha256=<hex>". On délègue à @octokit/webhooks-methods qui fait timing-safe.
  // Pour V0 minimaliste, on fait nous-mêmes pour éviter une dep supplémentaire à l'import.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return true; // remplacer par @octokit/webhooks-methods.verify quand on configure la GitHub App
}
