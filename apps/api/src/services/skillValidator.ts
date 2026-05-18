import { anthropic, MODEL_HAIKU } from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";
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

export async function generateSkillQuestion(input: {
  skillLabel: string;
  moduleTitle: string;
  moduleNumber: number;
  phase: number;
}): Promise<SkillQuestion> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing");
  }

  const system = buildSkillQuestionSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `Module : "${input.moduleTitle}" (M${String(input.moduleNumber).padStart(2, "0")}, phase ${input.phase})
Compétence à valider : "${input.skillLabel}"

Génère UNE question de validation. JSON strict.`;

  const response = await anthropic.messages.create({
    model: MODEL_HAIKU,
    max_tokens: 512,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AppError(502, "Claude returned no text");
  }

  return extractJson<SkillQuestion>(textBlock.text);
}

export async function validateSkillAnswer(input: {
  skillLabel: string;
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  moduleNumber: number;
  phase: number;
}): Promise<SkillValidation> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing");
  }

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

  const response = await anthropic.messages.create({
    model: MODEL_HAIKU,
    max_tokens: 512,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AppError(502, "Claude returned no text");
  }

  return extractJson<SkillValidation>(textBlock.text);
}
