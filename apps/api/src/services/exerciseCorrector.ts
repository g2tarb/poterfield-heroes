import type { Database } from "@ph/db";
import { MODEL_HAIKU } from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";
import { callClaude } from "../lib/claudeCall.js";
import { buildExerciseCorrectionSystemPrompt } from "../lib/modulePersonas.js";

export type CorrectionVerdict = "correct" | "partial" | "incorrect";

export type CorrectionResult = {
  verdict: CorrectionVerdict;
  scorePct: number;
  feedback: string;
  suggestions: string | null;
  costCents: number;
};

export async function correctExercise(
  db: Database,
  input: {
    statement: string;
    solutionCode: string | null;
    expectedOutput: string | null;
    language: string | null;
    kind: string;
    title: string;
    userAnswer: string;
    moduleNumber: number;
    phase: number;
    exerciseId?: string;
  },
): Promise<CorrectionResult> {
  const lang = input.language ?? "text";
  const system = buildExerciseCorrectionSystemPrompt({
    moduleNumber: input.moduleNumber,
    phase: input.phase,
  });

  const prompt = `## Énoncé : ${input.title}
${input.statement}

${input.solutionCode ? `## Solution de référence\n\`\`\`${lang}\n${input.solutionCode}\n\`\`\`\n` : ""}${input.expectedOutput ? `## Output attendu\n\`\`\`\n${input.expectedOutput}\n\`\`\`\n` : ""}
## Réponse d'Erwin
\`\`\`${lang}
${input.userAnswer}
\`\`\`

Évalue. Réponds en JSON strict, rien d'autre.`;

  const { text, costCents } = await callClaude({
    db,
    category: "exercise_correction",
    model: MODEL_HAIKU,
    system,
    messages: [{ role: "user", content: prompt }],
    maxTokens: 1024,
    sourceRef: input.exerciseId ? `exercise:${input.exerciseId}` : null,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new AppError(502, "Claude response did not contain JSON");
  }

  let parsed: {
    verdict: CorrectionVerdict;
    scorePct: number;
    feedback: string;
    suggestions?: string | null;
  };
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new AppError(502, "Claude returned invalid JSON");
  }

  return {
    verdict: parsed.verdict,
    scorePct: Math.max(0, Math.min(100, parsed.scorePct ?? 0)),
    feedback: parsed.feedback ?? "",
    suggestions: parsed.suggestions ?? null,
    costCents,
  };
}

// Correction locale pour quiz à choix multiples (pas besoin d'IA)
export function correctQuiz(input: {
  quizQuestions: Array<{
    question: string;
    options?: string[];
    correctIndex?: number;
    correctText?: string;
    explanation: string;
  }>;
  userAnswers: Array<{ questionIndex: number; answer: string | number }>;
}): CorrectionResult {
  const total = input.quizQuestions.length;
  if (total === 0) {
    return {
      verdict: "incorrect",
      scorePct: 0,
      feedback: "Aucune question dans ce quiz.",
      suggestions: null,
      costCents: 0,
    };
  }

  const details: string[] = [];
  let correctCount = 0;

  for (const ua of input.userAnswers) {
    const q = input.quizQuestions[ua.questionIndex];
    if (!q) continue;

    let isCorrect = false;
    if (q.correctIndex !== undefined && typeof ua.answer === "number") {
      isCorrect = ua.answer === q.correctIndex;
    } else if (q.correctText !== undefined && typeof ua.answer === "string") {
      isCorrect =
        ua.answer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
    }

    if (isCorrect) correctCount++;
    details.push(
      `**Q${ua.questionIndex + 1}** ${isCorrect ? "✓" : "✗"} — ${q.explanation}`,
    );
  }

  const scorePct = Math.round((correctCount / total) * 100);
  const verdict: CorrectionVerdict =
    scorePct >= 85 ? "correct" : scorePct >= 50 ? "partial" : "incorrect";

  return {
    verdict,
    scorePct,
    feedback: `${correctCount}/${total} bonnes réponses (${scorePct}%).\n\n${details.join("\n\n")}`,
    suggestions: scorePct < 100
      ? "Relis les explications ci-dessus, retente quand tu te sens prêt."
      : null,
    costCents: 0,
  };
}
