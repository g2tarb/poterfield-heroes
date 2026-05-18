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

export async function generateSkillQuestion(
  db: Database,
  input: {
    skillLabel: string;
    moduleTitle: string;
    moduleNumber: number;
    phase: number;
    skillId?: string;
  },
): Promise<SkillQuestion> {
  const system = buildSkillQuestionSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `Module : "${input.moduleTitle}" (M${String(input.moduleNumber).padStart(2, "0")}, phase ${input.phase})
Compétence à valider : "${input.skillLabel}"

Génère UNE question de validation. JSON strict.`;

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
  },
): Promise<SkillValidation> {
  const system = buildSkillValidationSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `Compétence : "${input.skillLabel}"

Question posée : ${input.question}

Réponse attendue (référence interne) : ${input.expectedAnswer}

Réponse d'Erwin :
${input.userAnswer}

Évalue. JSON strict.`;

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
