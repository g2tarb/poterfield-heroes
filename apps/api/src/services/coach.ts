import type { Database } from "@ph/db";
import {
  coachSessions,
  coachMessages,
  modules,
  skills,
  notebookEntries,
} from "@ph/db";
import { and, asc, desc, eq } from "drizzle-orm";
import {
  anthropic,
  MODEL_SONNET,
  computeCostCents,
  type ModelId,
} from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";
import { retrieveRelevant } from "./memory.js";

const SYSTEM_PROMPT = `Tu es le coach personnel d'Erwin (alias Scory) au sein de Porterfield Heroes — son atelier privé d'apprentissage dev fullstack.

# Ton
- Direct, senior-à-senior. Pas de flatterie ("super question !", "excellent !"). Pas de baby-talk.
- Tu pushes back franchement quand Erwin se trompe. Tu acceptes qu'il pushe back en retour.
- Concis. Une réponse courte qui répond > une réponse longue qui survole.
- Quand tu donnes du code, tu donnes le code. Quand tu donnes une explication, elle est dense.
- Pas d'emojis sauf si déjà présents dans la conversation ou pour structurer un palier.

# Rôle
- Tu connais sa roadmap (25 modules, ~1500h, du web fundamentals à l'IA appliquée).
- Tu n'es pas un assistant générique : tu sais où il en est dans le module courant.
- Tu peux : expliquer, donner des hints, reviewer du code, proposer un exercice complémentaire, recadrer si il dérive.
- Tu ne fais pas l'exercice à sa place. Tu ne donnes pas la solution complète sauf demande explicite.
- Si Erwin est bloqué depuis longtemps sur le même point, propose un angle différent.

# Format
- Markdown. Code blocks avec langage explicite. Headers H3 max.
- Quand tu réponds à une question conceptuelle : 1) la réponse en 2-3 phrases, 2) un exemple, 3) un piège classique à connaître.
- Quand tu reviews du code : pointe le problème, explique le pourquoi, suggère la correction.

# Limites
- Tu n'as pas accès à Internet ni à GitHub. Si tu as besoin d'une info externe, dis-le.
- Tu n'inventes pas les caractéristiques d'API ou de libs récentes que tu ne connais pas — tu demandes à Erwin de te coller la doc.
- Tu refuses poliment les questions sans rapport avec son apprentissage dev.`;

export type CoachContext = {
  moduleId?: string | undefined;
  sessionId?: string | undefined;
};

type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "text";
      text: string;
      cache_control: { type: "ephemeral" };
    };

async function buildModuleContext(
  db: Database,
  moduleId: string,
): Promise<string> {
  const [mod] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, moduleId))
    .limit(1);
  if (!mod) return "";

  const skillsList = await db
    .select()
    .from(skills)
    .where(eq(skills.moduleId, moduleId))
    .orderBy(asc(skills.displayOrder));

  const recentNotes = await db
    .select()
    .from(notebookEntries)
    .where(eq(notebookEntries.moduleId, moduleId))
    .orderBy(desc(notebookEntries.updatedAt))
    .limit(5);

  const skillsText = skillsList
    .map((s, i) => `  ${i + 1}. ${s.label}`)
    .join("\n");

  const notesText =
    recentNotes.length > 0
      ? recentNotes
          .map(
            (n) =>
              `### ${n.title}\n${n.contentMarkdown.slice(0, 600)}${n.contentMarkdown.length > 600 ? "…" : ""}`,
          )
          .join("\n\n")
      : "_(Aucune note dans le carnet pour ce module.)_";

  return `# Module en cours : M${String(mod.moduleNumber).padStart(2, "0")} — ${mod.title}

## Pourquoi ce module
${mod.pourquoi}

## Compétences à valider (${skillsList.length})
${skillsText}

## Notes carnet récentes
${notesText}`;
}

async function getRecentMessages(db: Database, sessionId: string) {
  return db
    .select()
    .from(coachMessages)
    .where(eq(coachMessages.sessionId, sessionId))
    .orderBy(asc(coachMessages.createdAt))
    .limit(20);
}

export async function startOrResumeSession(
  db: Database,
  moduleId: string | undefined,
  existingSessionId?: string | undefined,
): Promise<string> {
  if (existingSessionId) {
    const [row] = await db
      .select({ id: coachSessions.id })
      .from(coachSessions)
      .where(eq(coachSessions.id, existingSessionId))
      .limit(1);
    if (row) return row.id;
  }
  const [inserted] = await db
    .insert(coachSessions)
    .values({ moduleId: moduleId ?? null })
    .returning({ id: coachSessions.id });
  if (!inserted) throw new AppError(500, "Failed to create coach session");
  return inserted.id;
}

export type StreamCallbacks = {
  onChunk: (text: string) => void;
  onUsage: (usage: {
    model: ModelId;
    inputTokens: number;
    outputTokens: number;
    cachedReadTokens: number;
    cachedWriteTokens: number;
    costCents: number;
  }) => void;
  onError: (err: Error) => void;
};

/**
 * Stream a coach response. Persists messages + usage in DB.
 */
export async function streamCoachResponse(
  db: Database,
  args: {
    sessionId: string;
    userMessage: string;
    moduleId?: string | undefined;
    model?: ModelId | undefined;
  },
  callbacks: StreamCallbacks,
): Promise<void> {
  if (!anthropic) {
    throw new AppError(503, "Coach unavailable: ANTHROPIC_API_KEY not set");
  }

  const model: ModelId = args.model ?? MODEL_SONNET;

  // Persist user message
  await db.insert(coachMessages).values({
    sessionId: args.sessionId,
    role: "user",
    content: args.userMessage,
  });

  // Build cached system + module context (cache_control = ephemeral, 5min TTL)
  const systemBlocks: ContentBlock[] = [
    {
      type: "text",
      text: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ];

  if (args.moduleId) {
    const ctx = await buildModuleContext(db, args.moduleId);
    if (ctx) {
      systemBlocks.push({
        type: "text",
        text: ctx,
        cache_control: { type: "ephemeral" },
      });
    }
  }

  // RAG : retrieve top-K memories relevant to the user message.
  // NOT cached (changes per query) — appended as a regular system block.
  const retrieved = await retrieveRelevant(db, {
    query: args.userMessage,
    moduleId: args.moduleId ?? null,
    limit: 5,
  });
  if (retrieved.length > 0) {
    const memText = retrieved
      .map((m, i) => {
        const label = m.source === "note" ? "Note carnet" : m.source;
        return `## [${i + 1}] ${label}\n${m.contentSummary ?? m.content.slice(0, 800)}`;
      })
      .join("\n\n");
    systemBlocks.push({
      type: "text",
      text: `# Mémoires pertinentes pour cette question\n\n${memText}\n\nUtilise ces souvenirs pour personnaliser ta réponse. Ne les cite pas littéralement.`,
    });
  }

  // Recent message history
  const history = await getRecentMessages(db, args.sessionId);
  const messages = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  let accumulated = "";
  let usage = {
    inputTokens: 0,
    outputTokens: 0,
    cachedReadTokens: 0,
    cachedWriteTokens: 0,
  };

  try {
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 4096,
      system: systemBlocks,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        accumulated += event.delta.text;
        callbacks.onChunk(event.delta.text);
      }
      if (event.type === "message_delta" && event.usage) {
        usage.outputTokens = event.usage.output_tokens ?? usage.outputTokens;
      }
      if (event.type === "message_start" && event.message.usage) {
        const u = event.message.usage;
        usage.inputTokens = u.input_tokens;
        usage.cachedReadTokens = u.cache_read_input_tokens ?? 0;
        usage.cachedWriteTokens = u.cache_creation_input_tokens ?? 0;
      }
    }

    const costCents = computeCostCents(
      model,
      usage.inputTokens,
      usage.outputTokens,
      usage.cachedReadTokens,
      usage.cachedWriteTokens,
    );

    // Persist assistant message + usage
    await db.insert(coachMessages).values({
      sessionId: args.sessionId,
      role: "assistant",
      content: accumulated,
      model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cachedTokens: usage.cachedReadTokens,
    });

    // Update session totals
    await db
      .update(coachSessions)
      .set({
        lastMessageAt: new Date(),
        totalInputTokens: usage.inputTokens,
        totalOutputTokens: usage.outputTokens,
        totalCostCents: costCents,
      })
      .where(eq(coachSessions.id, args.sessionId));

    callbacks.onUsage({ model, ...usage, costCents });
  } catch (err) {
    callbacks.onError(err as Error);
    throw err;
  }
}
