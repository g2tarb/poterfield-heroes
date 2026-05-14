import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import type { Database } from "@ph/db";
import { skills, modules, srsCards, notebookEntries } from "@ph/db";
import {
  anthropic,
  MODEL_HAIKU,
  computeCostCents,
  extractCacheTokens,
} from "../lib/anthropic.js";
import { AppError, NotFoundError } from "../lib/errors.js";

const cardsSchema = z.object({
  cards: z
    .array(
      z.object({
        front: z.string().min(5).max(500),
        back: z.string().min(5).max(1500),
        keywords: z.array(z.string()).max(8).optional(),
      }),
    )
    .min(1)
    .max(5),
});

export type GenerateResult = {
  cardsCreated: number;
  costCents: number;
};

/**
 * Generate 2-3 SRS cards for a given skill via Claude Haiku.
 * Uses tool_use to force structured output.
 */
export async function generateCardsForSkill(
  db: Database,
  args: { skillId: string },
): Promise<GenerateResult> {
  if (!anthropic) throw new AppError(503, "Anthropic not configured");

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.id, args.skillId))
    .limit(1);
  if (!skill) throw new NotFoundError("Skill");

  const [mod] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, skill.moduleId))
    .limit(1);
  if (!mod) throw new NotFoundError("Module");

  // Gather context: skill label + module pourquoi + recent notes
  const recentNotes = await db
    .select()
    .from(notebookEntries)
    .where(eq(notebookEntries.moduleId, mod.id))
    .orderBy(desc(notebookEntries.updatedAt))
    .limit(3);

  const notesText =
    recentNotes.length > 0
      ? recentNotes
          .map((n) => `### ${n.title}\n${n.contentMarkdown.slice(0, 1000)}`)
          .join("\n\n")
      : "_(Pas de notes disponibles. Génère à partir du contexte module + skill.)_";

  const prompt = `Tu génères des cartes SRS (recto/verso) pour la révision espacée d'Erwin.

## Contexte
- Module : ${mod.title}
- Compétence à mémoriser : ${skill.label}
${skill.description ? `- Détail : ${skill.description}` : ""}

## Notes existantes sur ce module
${notesText}

## Règles
1. Génère **2 cartes** (3 max si concept multi-facettes).
2. **Recto = question courte et précise**, pas générique ("Qu'est-ce que X" → trop large). Préférer "Pourquoi X échoue dans Y situation ?" ou "Donne 2 différences entre A et B".
3. **Verso = réponse complète et autonome** (l'apprenant doit pouvoir comprendre la réponse sans relire le module). Avec exemples concrets si pertinent.
4. Pour les questions techniques : utiliser code blocks markdown si nécessaire dans le verso.
5. Pas de cartes redondantes. Chaque carte teste un angle différent.
6. Évite les questions "liste tous les X" qui sont impossibles à rater bêtement.

Appelle l'outil \`emit_cards\` avec ta sortie.`;

  const tool = {
    name: "emit_cards",
    description: "Emit generated SRS cards for the requested skill.",
    input_schema: {
      type: "object" as const,
      properties: {
        cards: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              front: { type: "string" },
              back: { type: "string" },
              keywords: { type: "array", items: { type: "string" } },
            },
            required: ["front", "back"],
          },
        },
      },
      required: ["cards"],
    },
  };

  const response = await anthropic.messages.create({
    model: MODEL_HAIKU,
    max_tokens: 2048,
    tools: [tool],
    tool_choice: { type: "tool", name: "emit_cards" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUseBlock = response.content.find(
    (b) => b.type === "tool_use" && b.name === "emit_cards",
  );
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new AppError(502, "Claude did not return structured cards");
  }

  const parsed = cardsSchema.safeParse(toolUseBlock.input);
  if (!parsed.success) {
    throw new AppError(
      502,
      `Invalid card format from Claude: ${parsed.error.message}`,
    );
  }

  const cacheTokens = extractCacheTokens(response.usage);
  const costCents = computeCostCents(
    MODEL_HAIKU,
    response.usage.input_tokens,
    response.usage.output_tokens,
    cacheTokens.cacheReadInputTokens,
    cacheTokens.cacheCreationInputTokens,
  );

  const rows = parsed.data.cards.map((c) => ({
    skillId: skill.id,
    moduleId: mod.id,
    front: c.front,
    back: c.back,
    answerKeywords: c.keywords ?? null,
    state: "new" as const,
  }));

  if (rows.length > 0) {
    await db.insert(srsCards).values(rows);
  }

  return { cardsCreated: rows.length, costCents };
}
