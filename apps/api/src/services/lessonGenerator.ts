import { z } from "zod";
import { eq } from "drizzle-orm";
import type { Database } from "@ph/db";
import { skills, modules } from "@ph/db";
import {
  anthropic,
  MODEL_SONNET,
  computeCostCents,
  extractCacheTokens,
} from "../lib/anthropic.js";
import { AppError, NotFoundError } from "../lib/errors.js";

const lessonSchema = z.object({
  contentMarkdown: z.string().min(200).max(8000),
});

export type GenerateLessonResult = {
  contentMarkdown: string;
  costCents: number;
  cached: boolean;
};

/**
 * Génère le contenu pédagogique markdown d'un skill (Sprint B).
 * Appelle Claude Sonnet (qualité contenu > coût) avec tool_use forcé.
 * Persiste dans skills.content_markdown — idempotent : si déjà rempli,
 * retourne le contenu existant sans appel API.
 */
export async function generateLessonForSkill(
  db: Database,
  args: { skillId: string; force?: boolean },
): Promise<GenerateLessonResult> {
  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.id, args.skillId))
    .limit(1);
  if (!skill) throw new NotFoundError("Skill");

  // Idempotent : si déjà généré et pas force=true, retourner le cache
  if (skill.contentMarkdown && !args.force) {
    return {
      contentMarkdown: skill.contentMarkdown,
      costCents: 0,
      cached: true,
    };
  }

  if (!anthropic) throw new AppError(503, "Anthropic not configured");

  const [mod] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, skill.moduleId))
    .limit(1);
  if (!mod) throw new NotFoundError("Module");

  const prompt = `Tu rédiges UNE leçon markdown pour Erwin (dev fullstack en formation autodidacte, 12 mois pour atteindre niveau senior IA).

## Module
**${mod.title}** · Phase ${mod.phase}
${mod.subtitle ? `_${mod.subtitle}_` : ""}

## Skill à enseigner
**${skill.label}**
${skill.description ? skill.description : ""}

## Format obligatoire de la leçon

La leçon DOIT contenir, dans cet ordre :

1. **Une intro punchy (2-3 lignes)** qui dit *pourquoi* ce concept compte. Pas de "Dans cette leçon nous allons voir...". Direct : le problème que ce concept résout.

2. **Le concept expliqué simplement** avec une analogie concrète si possible (vie courante, métier autre que dev). 1-2 paragraphes.

3. **Un exemple de code minimal en JavaScript** (\`\`\`js bloc) qui illustre le concept. 5-15 lignes, commenté. Si Python est plus naturel, utiliser \`\`\`python.

4. **Les 2-3 pièges classiques** ("Attention : ...") que les débutants tombent dessus. Format liste à puces.

5. **Une question de réflexion** à la fin pour vérifier la compréhension (qu'Erwin peut écrire dans son carnet).

## Règles strictes

- Tutoiement direct (Erwin est l'apprenant solo, ton de senior à dev). Pas de "vous", pas de formules creuses.
- Markdown propre : titres niveau ##, listes, code blocks avec langage.
- 400-700 mots **maximum**. Si tu peux dire en 400 mots, fais 400.
- Pas de "j'espère que c'est clair", pas de meta-commentaires.
- Pas de liens externes (les ressources externes sont gérées séparément).
- Code IMPECCABLE : tests mentaux des snippets avant de les écrire.

Appelle l'outil \`emit_lesson\` avec UN seul champ \`contentMarkdown\` contenant ta leçon complète.`;

  const tool = {
    name: "emit_lesson",
    description:
      "Emit the structured markdown lesson for the requested skill.",
    input_schema: {
      type: "object" as const,
      properties: {
        contentMarkdown: {
          type: "string",
          description:
            "Leçon markdown complète : intro, explication, exemple code, pièges, question réflexion.",
        },
      },
      required: ["contentMarkdown"],
    },
  };

  const response = await anthropic.messages.create({
    model: MODEL_SONNET,
    max_tokens: 3000,
    tools: [tool],
    tool_choice: { type: "tool", name: "emit_lesson" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUseBlock = response.content.find(
    (b) => b.type === "tool_use" && b.name === "emit_lesson",
  );
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new AppError(502, "Claude did not return a structured lesson");
  }

  const parsed = lessonSchema.safeParse(toolUseBlock.input);
  if (!parsed.success) {
    throw new AppError(
      502,
      `Invalid lesson format from Claude: ${parsed.error.message}`,
    );
  }

  const cacheTokens = extractCacheTokens(response.usage);
  const costCents = computeCostCents(
    MODEL_SONNET,
    response.usage.input_tokens,
    response.usage.output_tokens,
    cacheTokens.cacheReadInputTokens,
    cacheTokens.cacheCreationInputTokens,
  );

  await db
    .update(skills)
    .set({ contentMarkdown: parsed.data.contentMarkdown })
    .where(eq(skills.id, skill.id));

  return {
    contentMarkdown: parsed.data.contentMarkdown,
    costCents,
    cached: false,
  };
}
