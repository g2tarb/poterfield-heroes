import type { Database } from "@ph/db";
import { MODEL_HAIKU } from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";
import { callClaude } from "../lib/claudeCall.js";
import {
  buildSkillQuestionSystemPrompt,
  buildSkillValidationSystemPrompt,
} from "../lib/modulePersonas.js";

export type SkillQuestion = {
  question: string;
  expectedAnswer: string;
};

export type SkillValidation = {
  verdict: "mastered" | "practicing" | "discovering";
  feedback: string;
};

function extractJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new AppError(502, "Claude returned no JSON");
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    throw new AppError(502, "Claude returned invalid JSON");
  }
}

function buildGroundingBlock(input: {
  skillDescription?: string | null;
  lessonContent?: string | null;
  objectives?: string[] | null;
}): string {
  const parts: string[] = [];

  if (input.skillDescription && input.skillDescription.trim().length > 0) {
    parts.push(`## Détail de la compétence\n${input.skillDescription.trim()}`);
  }

  if (input.lessonContent && input.lessonContent.trim().length > 0) {
    parts.push(
      `## Contenu de la leçon (SOURCE DE VÉRITÉ — ne sors pas de ce périmètre)\n${input.lessonContent.trim()}`,
    );
  } else {
    parts.push(
      `## Contenu de la leçon\n_(Aucune leçon générée. Base-toi sur le label de la compétence + les objectifs ci-dessous, et reste au niveau le plus simple cohérent avec ce module — n'introduis aucune notion avancée non listée.)_`,
    );
  }

  if (input.objectives && input.objectives.length > 0) {
    parts.push(
      `## Objectifs du module (cadre de niveau — ne dépasse pas ce périmètre)\n${input.objectives
        .map((o) => `- ${o}`)
        .join("\n")}`,
    );
  }

  return parts.join("\n\n");
}

export async function generateSkillQuestion(
  db: Database,
  input: {
    skillLabel: string;
    moduleTitle: string;
    moduleNumber: number;
    phase: number;
    skillId?: string;
    skillDescription?: string | null;
    lessonContent?: string | null;
    objectives?: string[] | null;
  },
): Promise<SkillQuestion> {
  const system = buildSkillQuestionSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `Module : "${input.moduleTitle}" (M${String(input.moduleNumber).padStart(2, "0")}, phase ${input.phase})
Compétence à valider : "${input.skillLabel}"

${buildGroundingBlock(input)}

Génère UNE question de validation portant UNIQUEMENT sur le contenu ci-dessus. JSON strict.`;

  const { text } = await callClaude({
    db,
    category: "skill_question",
    model: MODEL_HAIKU,
    system,
    messages: [{ role: "user", content: prompt }],
    maxTokens: 512,
    sourceRef: input.skillId ? `skill:${input.skillId}` : null,
  });

  return extractJson<SkillQuestion>(text);
}

export async function validateSkillAnswer(
  db: Database,
  input: {
    skillLabel: string;
    question: string;
    expectedAnswer: string;
    userAnswer: string;
    moduleNumber: number;
    phase: number;
    skillId?: string;
    skillDescription?: string | null;
    lessonContent?: string | null;
    objectives?: string[] | null;
  },
): Promise<SkillValidation> {
  const system = buildSkillValidationSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `Compétence : "${input.skillLabel}"

${buildGroundingBlock(input)}

Question posée : ${input.question}

Réponse attendue (référence interne) : ${input.expectedAnswer}

Réponse d'Erwin :
${input.userAnswer}

Évalue par rapport au contenu enseigné ci-dessus, sans exiger de notions absentes de la leçon. JSON strict.`;

  const { text } = await callClaude({
    db,
    category: "skill_validation",
    model: MODEL_HAIKU,
    system,
    messages: [{ role: "user", content: prompt }],
    maxTokens: 512,
    sourceRef: input.skillId ? `skill:${input.skillId}` : null,
  });

  return extractJson<SkillValidation>(text);
}
