import { z } from "zod";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import type { Database } from "@ph/db";
import {
  weeklyExams,
  skillProgress,
  skills,
  modules,
} from "@ph/db";
import {
  anthropic,
  MODEL_SONNET,
  computeCostCents,
} from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";

const examSchema = z.object({
  questions: z
    .array(
      z.discriminatedUnion("kind", [
        z.object({
          kind: z.literal("qcm"),
          question: z.string().min(10),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().int().min(0).max(3),
          explanation: z.string().min(5),
          skillId: z.string().uuid().optional(),
        }),
        z.object({
          kind: z.literal("code"),
          prompt: z.string().min(20),
          language: z.enum(["javascript", "python", "bash"]),
          starterCode: z.string().optional(),
          testsCode: z.string().optional(),
          expectedBehavior: z.string().min(10),
          skillId: z.string().uuid().optional(),
        }),
      ]),
    )
    .min(5)
    .max(15),
});

function isoWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - day + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function generateWeeklyExam(
  db: Database,
  args: { weekStartDate?: string; force?: boolean } = {},
): Promise<{ examId: string; created: boolean; cost: number }> {
  if (!anthropic) throw new AppError(503, "Anthropic not configured");

  const weekStart = args.weekStartDate ?? isoWeekStart();

  // Idempotency : if exam already exists, return it.
  const [existing] = await db
    .select({ id: weeklyExams.id })
    .from(weeklyExams)
    .where(eq(weeklyExams.weekStartDate, weekStart))
    .limit(1);
  if (existing && !args.force) {
    return { examId: existing.id, created: false, cost: 0 };
  }

  // Gather skills practiced this week
  const weekStartDate = new Date(weekStart + "T00:00:00Z");
  const practicingSkills = await db
    .select({
      id: skills.id,
      label: skills.label,
      moduleId: skills.moduleId,
      moduleTitle: modules.title,
      moduleNumber: modules.moduleNumber,
    })
    .from(skillProgress)
    .innerJoin(skills, eq(skills.id, skillProgress.skillId))
    .innerJoin(modules, eq(modules.id, skills.moduleId))
    .where(
      and(
        gte(skillProgress.firstSeenAt, weekStartDate),
        sql`${skillProgress.status} IN ('practicing', 'mastered')`,
      ),
    )
    .orderBy(desc(skillProgress.firstSeenAt))
    .limit(20);

  if (practicingSkills.length === 0) {
    throw new AppError(
      400,
      "Aucune compétence pratiquée cette semaine. Rien à examiner.",
    );
  }

  const skillsText = practicingSkills
    .map(
      (s) =>
        `- (M${String(s.moduleNumber).padStart(2, "0")}) [${s.id}] ${s.label}`,
    )
    .join("\n");

  const prompt = `Tu génères le contrôle hebdomadaire d'Erwin pour Porterfield Heroes.

## Compétences pratiquées cette semaine (à examiner)
${skillsText}

## Format imposé
- **10 QCM** (4 options chacun, 1 seule correcte). Difficulté progressive (5 faciles, 3 moyennes, 2 dures).
- **1 exo code** : un défi pratique qui combine 2+ compétences, en javascript de préférence. Énoncé clair, expectedBehavior précis.

## Règles
1. Les QCM testent du **vrai savoir**, pas des facts triviaux. Préférer "Que se passe-t-il si X ?", "Quelle est la conséquence de Y ?".
2. Les explanations sont denses (3-5 lignes), pas juste "C'est ça parce que c'est ça".
3. Le code exo doit pouvoir être validé objectivement (output mesurable).
4. Inclure skillId quand pertinent pour relier la question à une skill.

Appelle l'outil \`emit_exam\` avec ta sortie.`;

  const tool = {
    name: "emit_exam",
    description: "Emit the generated weekly exam.",
    input_schema: {
      type: "object" as const,
      properties: {
        questions: {
          type: "array",
          items: { type: "object" },
        },
      },
      required: ["questions"],
    },
  };

  const response = await anthropic.messages.create({
    model: MODEL_SONNET,
    max_tokens: 8000,
    tools: [tool],
    tool_choice: { type: "tool", name: "emit_exam" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (b) => b.type === "tool_use" && b.name === "emit_exam",
  );
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new AppError(502, "Claude did not return an exam");
  }

  const parsed = examSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new AppError(
      502,
      `Invalid exam format: ${parsed.error.message}`,
    );
  }

  const costCents = computeCostCents(
    MODEL_SONNET,
    response.usage.input_tokens,
    response.usage.output_tokens,
    response.usage.cache_read_input_tokens ?? 0,
    response.usage.cache_creation_input_tokens ?? 0,
  );

  const moduleIds = [...new Set(practicingSkills.map((s) => s.moduleId))];
  const skillIds = practicingSkills.map((s) => s.id);

  if (existing && args.force) {
    await db.delete(weeklyExams).where(eq(weeklyExams.id, existing.id));
  }

  const [inserted] = await db
    .insert(weeklyExams)
    .values({
      weekStartDate: weekStart,
      moduleIdsCovered: moduleIds,
      skillIdsCovered: skillIds,
      questions: parsed.data.questions,
      timeLimitMinutes: 60,
      generationModel: MODEL_SONNET,
      generationCostCents: costCents,
    })
    .returning({ id: weeklyExams.id });

  if (!inserted) throw new AppError(500, "Failed to insert exam");
  return { examId: inserted.id, created: true, cost: costCents };
}

/**
 * Cron tick: check si vendredi 18h+ et exam pas encore généré.
 * À appeler depuis setInterval(1h) au boot de l'API.
 */
export async function maybeGenerateThisWeekExam(db: Database): Promise<void> {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri
  const hour = now.getHours();
  if (day !== 5 || hour < 18) return;

  const weekStart = isoWeekStart(now);
  const [existing] = await db
    .select({ id: weeklyExams.id })
    .from(weeklyExams)
    .where(eq(weeklyExams.weekStartDate, weekStart))
    .limit(1);
  if (existing) return;

  try {
    await generateWeeklyExam(db, { weekStartDate: weekStart });
  } catch (err) {
    console.error("[examGenerator] weekly tick failed:", err);
  }
}
