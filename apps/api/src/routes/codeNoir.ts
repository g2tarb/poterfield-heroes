import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { modules, moduleProgress, codeNoirProgress } from "@ph/db";
import { anthropic, MODEL_HAIKU, MODEL_SONNET } from "../lib/anthropic.js";
import { callClaude } from "../lib/claudeCall.js";
import {
  CODE_NOIR_TECHNIQUES,
  getUnlockedTechniques,
  getLockedTechniques,
  type CodeNoirTechnique,
} from "../lib/codeNoirData.js";
import { buildCodeNoirSystemPrompt } from "../lib/codeNoirPersona.js";
import { AppError, NotFoundError } from "../lib/errors.js";
import { trackAiCost } from "../services/costTracker.js";

// Détermine le module actif d'Erwin via la cascade
async function getCurrentModuleNumber(app: FastifyInstance): Promise<number> {
  const rows = await app.db
    .select({
      moduleNumber: modules.moduleNumber,
      status: moduleProgress.status,
    })
    .from(modules)
    .leftJoin(moduleProgress, eq(moduleProgress.moduleId, modules.id))
    .orderBy(asc(modules.moduleNumber));

  // Le module actif = le premier non-completed
  for (const r of rows) {
    if (r.status === "completed") continue;
    return r.moduleNumber;
  }
  return rows.length; // tout fini → tout débloqué
}

type QuizQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(5),
        choices: z.array(z.string().min(1)).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string().min(5),
      }),
    )
    .length(3),
});

// Cache mémoire des quizzes générés (clé = slug). V1 simple sans DB.
const quizCache = new Map<string, QuizQuestion[]>();

function findTechnique(slug: string): CodeNoirTechnique | undefined {
  return CODE_NOIR_TECHNIQUES.find((t) => t.slug === slug);
}

function pickSectionText(
  t: CodeNoirTechnique,
  section: "hack" | "antiHack" | "oneLiner",
): string {
  if (section === "hack") return t.hack;
  if (section === "antiHack") return t.antiHack;
  return t.oneLiner;
}

function sectionLabel(
  section: "hack" | "antiHack" | "oneLiner",
): string {
  if (section === "hack") return "HACK (offensive)";
  if (section === "antiHack") return "ANTI-HACK (défense)";
  return "TL;DR";
}

const codeNoirRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /code-noir/state — techniques débloquées + verrouillées (téasers)
  a.get(
    "/code-noir/state",
    { preHandler: [app.authenticate] },
    async () => {
      const currentModule = await getCurrentModuleNumber(app);
      const unlocked = getUnlockedTechniques(currentModule);
      const locked = getLockedTechniques(currentModule);

      // Enrichit chaque technique débloquée avec sa progression
      const progressRows = await app.db.select().from(codeNoirProgress);
      const progressBySlug = new Map<
        string,
        {
          status: "in_progress" | "mastered";
          quizScore: number | null;
          masteredAt: string | null;
        }
      >();
      for (const row of progressRows) {
        progressBySlug.set(row.techniqueSlug, {
          status: row.status as "in_progress" | "mastered",
          quizScore: row.quizScore,
          masteredAt: row.masteredAt ? row.masteredAt.toISOString() : null,
        });
      }

      const unlockedWithProgress = unlocked.map((t) => {
        const p = progressBySlug.get(t.slug);
        return {
          ...t,
          progress: p ?? null,
        };
      });

      return {
        currentModule,
        totalTechniques: CODE_NOIR_TECHNIQUES.length,
        unlocked: unlockedWithProgress,
        locked,
      };
    },
  );

  // POST /code-noir/ask — chat one-shot avec Black Hat Mentor
  a.post(
    "/code-noir/ask",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          question: z.string().min(1).max(2000),
        }),
      },
    },
    async ({ body }) => {
      const currentModule = await getCurrentModuleNumber(app);
      const unlocked = getUnlockedTechniques(currentModule);
      const system = buildCodeNoirSystemPrompt({
        currentModuleNumber: currentModule,
        unlocked,
      });

      const { text } = await callClaude({
        db: app.db,
        category: "code_noir",
        model: MODEL_SONNET,
        system,
        messages: [{ role: "user", content: body.question }],
        maxTokens: 1200,
      });

      return {
        answer: text,
        currentModule,
        unlockedCount: unlocked.length,
      };
    },
  );

  // GET /code-noir/technique/:slug — retourne la technique + status user
  a.get(
    "/code-noir/technique/:slug",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          slug: z.string().min(1).max(120),
        }),
      },
    },
    async ({ params }) => {
      const technique = findTechnique(params.slug);
      if (!technique) throw new NotFoundError("Technique");

      const currentModule = await getCurrentModuleNumber(app);
      const unlocked = technique.moduleNumber <= currentModule;
      if (!unlocked) {
        throw new AppError(
          403,
          `Technique verrouillée — débloquée à M${String(technique.moduleNumber).padStart(2, "0")} (tu es à M${String(currentModule).padStart(2, "0")}).`,
        );
      }

      const [progressRow] = await app.db
        .select()
        .from(codeNoirProgress)
        .where(eq(codeNoirProgress.techniqueSlug, params.slug))
        .limit(1);

      return {
        technique,
        currentModule,
        progress: progressRow
          ? {
              status: progressRow.status as "in_progress" | "mastered",
              quizScore: progressRow.quizScore,
              masteredAt: progressRow.masteredAt
                ? progressRow.masteredAt.toISOString()
                : null,
            }
          : null,
      };
    },
  );

  // POST /code-noir/vulgarize — version ELI5 d'une section
  a.post(
    "/code-noir/vulgarize",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          slug: z.string().min(1).max(120),
          section: z.enum(["hack", "antiHack", "oneLiner"]),
        }),
      },
    },
    async ({ body }) => {
      const technique = findTechnique(body.slug);
      if (!technique) throw new NotFoundError("Technique");

      const currentModule = await getCurrentModuleNumber(app);
      if (technique.moduleNumber > currentModule) {
        throw new AppError(403, "Technique verrouillée.");
      }

      const sourceText = pickSectionText(technique, body.section);
      const label = sectionLabel(body.section);

      const system = `Tu es un vulgarisateur tech. L'utilisateur apprend la sécurité informatique. Reformule l'explication technique fournie en utilisant une analogie concrète du monde réel (cambriolage, café, courrier, etc.) — sans perdre la rigueur technique. 4 paragraphes max. Aucun jargon non expliqué. Termine par une phrase choc qui résume "pourquoi c'est dangereux".`;

      const userMessage = `Technique : **${technique.title}** (${label})

Texte à vulgariser :

${sourceText}`;

      const { text } = await callClaude({
        db: app.db,
        category: "code_noir_eli5",
        model: MODEL_HAIKU,
        system,
        messages: [{ role: "user", content: userMessage }],
        maxTokens: 800,
        sourceRef: `code_noir_eli5:${body.slug}:${body.section}`,
      });

      return { vulgarized: text };
    },
  );

  // POST /code-noir/quiz/:slug — génère 3 QCM via Claude tool_use
  a.post(
    "/code-noir/quiz/:slug",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          slug: z.string().min(1).max(120),
        }),
        body: z
          .object({
            regenerate: z.boolean().optional(),
          })
          .optional(),
      },
    },
    async ({ params, body }) => {
      const technique = findTechnique(params.slug);
      if (!technique) throw new NotFoundError("Technique");

      const currentModule = await getCurrentModuleNumber(app);
      if (technique.moduleNumber > currentModule) {
        throw new AppError(403, "Technique verrouillée.");
      }

      const regenerate = body?.regenerate === true;
      if (!regenerate) {
        const cached = quizCache.get(params.slug);
        if (cached) {
          return { questions: cached, cached: true };
        }
      }

      if (!anthropic) {
        throw new AppError(503, "Anthropic not configured");
      }

      const prompt = `Tu génères un quiz de révision pour Erwin sur une technique de sécurité Code Noir.

## Technique
- Titre : ${technique.title}
- Module : M${String(technique.moduleNumber).padStart(2, "0")}
- One-liner : ${technique.oneLiner}

## HACK (offensive)
${technique.hack}

## ANTI-HACK (défense)
${technique.antiHack}

## Règles
1. **Exactement 3 QCM** progressifs : 1 facile (rappel notion), 1 moyen (mécanique d'attaque), 1 dur (défense / nuance / piège classique).
2. Chaque question : **4 choix**, **1 seul correct** (correctIndex 0..3).
3. Les mauvais choix doivent être plausibles (pas évidemment faux). Pas de "Toutes les réponses" ni "Aucune".
4. **explanation** : 2-4 lignes denses, explique pourquoi la bonne est bonne ET pourquoi les pièges sont faux.
5. Ton : technique précis, pas pédant. Référence au payload / défense quand pertinent.

Appelle l'outil \`emit_quiz\` avec ta sortie.`;

      const tool = {
        name: "emit_quiz",
        description: "Emit the generated Code Noir quiz (3 QCM).",
        input_schema: {
          type: "object" as const,
          properties: {
            questions: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  choices: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 4,
                  },
                  correctIndex: {
                    type: "integer",
                    minimum: 0,
                    maximum: 3,
                  },
                  explanation: { type: "string" },
                },
                required: ["question", "choices", "correctIndex", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      };

      const response = await anthropic.messages.create({
        model: MODEL_HAIKU,
        max_tokens: 2400,
        tools: [tool],
        tool_choice: { type: "tool", name: "emit_quiz" },
        messages: [{ role: "user", content: prompt }],
      });

      const toolUse = response.content.find(
        (b) => b.type === "tool_use" && b.name === "emit_quiz",
      );
      if (!toolUse || toolUse.type !== "tool_use") {
        throw new AppError(502, "Claude did not return a quiz");
      }

      const parsed = quizSchema.safeParse(toolUse.input);
      if (!parsed.success) {
        throw new AppError(
          502,
          `Invalid quiz format: ${parsed.error.message}`,
        );
      }

      await trackAiCost(app.db, {
        category: "code_noir_quiz",
        model: MODEL_HAIKU,
        usage: response.usage,
        sourceRef: `code_noir_quiz:${params.slug}`,
      });

      quizCache.set(params.slug, parsed.data.questions);

      return { questions: parsed.data.questions, cached: false };
    },
  );

  // GET /code-noir/progress — Record<slug, { status, quizScore, masteredAt }>
  a.get(
    "/code-noir/progress",
    { preHandler: [app.authenticate] },
    async () => {
      const rows = await app.db.select().from(codeNoirProgress);
      const byslug: Record<
        string,
        {
          status: "in_progress" | "mastered";
          quizScore: number | null;
          masteredAt: string | null;
        }
      > = {};
      for (const row of rows) {
        byslug[row.techniqueSlug] = {
          status: row.status as "in_progress" | "mastered",
          quizScore: row.quizScore,
          masteredAt: row.masteredAt ? row.masteredAt.toISOString() : null,
        };
      }
      return { progress: byslug };
    },
  );

  // POST /code-noir/progress — upsert
  a.post(
    "/code-noir/progress",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          slug: z.string().min(1).max(120),
          status: z.enum(["in_progress", "mastered"]),
          quizScore: z.number().int().min(0).max(100).optional(),
        }),
      },
    },
    async ({ body }) => {
      const technique = findTechnique(body.slug);
      if (!technique) throw new NotFoundError("Technique");

      const currentModule = await getCurrentModuleNumber(app);
      if (technique.moduleNumber > currentModule) {
        throw new AppError(403, "Technique verrouillée.");
      }

      const masteredAt = body.status === "mastered" ? new Date() : null;
      const updatedAt = new Date();

      const [existing] = await app.db
        .select()
        .from(codeNoirProgress)
        .where(eq(codeNoirProgress.techniqueSlug, body.slug))
        .limit(1);

      if (existing) {
        await app.db
          .update(codeNoirProgress)
          .set({
            status: body.status,
            quizScore: body.quizScore ?? existing.quizScore ?? null,
            masteredAt:
              body.status === "mastered"
                ? (existing.masteredAt ?? masteredAt)
                : null,
            updatedAt,
          })
          .where(eq(codeNoirProgress.techniqueSlug, body.slug));
      } else {
        await app.db.insert(codeNoirProgress).values({
          techniqueSlug: body.slug,
          status: body.status,
          quizScore: body.quizScore ?? null,
          masteredAt,
          updatedAt,
        });
      }

      return {
        ok: true,
        progress: {
          slug: body.slug,
          status: body.status,
          quizScore: body.quizScore ?? existing?.quizScore ?? null,
          masteredAt:
            body.status === "mastered"
              ? (existing?.masteredAt ?? masteredAt)?.toISOString() ?? null
              : null,
        },
      };
    },
  );
};

export default codeNoirRoutes;
