import {
  anthropic,
  MODEL_HAIKU,
  computeCostCents,
  extractCacheTokens,
} from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";

export type CorrectionVerdict = "correct" | "partial" | "incorrect";

export type CorrectionResult = {
  verdict: CorrectionVerdict;
  scorePct: number;
  feedback: string;
  suggestions: string | null;
  costCents: number;
};

const CORRECTION_SYSTEM = `Tu es le correcteur senior d'Erwin (alias Scory), dev fullstack en apprentissage avancé sur Porterfield Heroes.

# Mission
Évaluer la réponse d'Erwin à un exercice en comparant à l'énoncé et à la solution attendue. Verdict + feedback dense.

# Verdict
- "correct" : la réponse est juste, complète, idiomatique. scorePct 85-100.
- "partial" : la réponse marche mais a des défauts (sub-optimal, manque un edge case, mauvais nommage, etc.). scorePct 50-84.
- "incorrect" : la réponse ne marche pas ou rate l'objectif principal. scorePct 0-49.

# Format de retour (JSON strict, rien d'autre)
{
  "verdict": "correct" | "partial" | "incorrect",
  "scorePct": <0-100>,
  "feedback": "<markdown court, 3-6 lignes, explique ce qui va et ne va pas>",
  "suggestions": "<optionnel markdown, pistes d'amélioration concrètes ou null>"
}

# Ton
- Direct, senior à senior. Pas de flatterie ("super effort !", "presque !").
- Si correct, dire ce qui est bien et UNE piste d'amélioration s'il y a.
- Si partial, pointer LE défaut principal sans donner la solution.
- Si incorrect, expliquer ce qui foire SANS donner la solution complète.
- Markdown autorisé : code blocks, listes, **bold**. Pas de headers H1/H2.

# Limites
- Tu ne lances pas le code, tu le lis et raisonnes dessus.
- Si la réponse fait quelque chose de différent mais qui marche aussi, c'est valide → "correct".
- Si Erwin a oublié de gérer un cas mentionné dans l'énoncé → "partial".`;

export async function correctExercise(input: {
  statement: string;
  solutionCode: string | null;
  expectedOutput: string | null;
  language: string | null;
  kind: string;
  title: string;
  userAnswer: string;
}): Promise<CorrectionResult> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing — correction disabled");
  }

  const lang = input.language ?? "text";

  const prompt = `## Énoncé : ${input.title}
${input.statement}

${input.solutionCode ? `## Solution de référence\n\`\`\`${lang}\n${input.solutionCode}\n\`\`\`\n` : ""}${input.expectedOutput ? `## Output attendu\n\`\`\`\n${input.expectedOutput}\n\`\`\`\n` : ""}
## Réponse d'Erwin
\`\`\`${lang}
${input.userAnswer}
\`\`\`

Évalue. Réponds en JSON strict, rien d'autre.`;

  const response = await anthropic.messages.create({
    model: MODEL_HAIKU,
    max_tokens: 1024,
    system: CORRECTION_SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AppError(502, "Claude returned no text response");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
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

  const usage = response.usage;
  const cache = extractCacheTokens(usage);
  const costCents = computeCostCents(
    MODEL_HAIKU,
    usage.input_tokens,
    usage.output_tokens,
    cache.cacheReadInputTokens,
    cache.cacheCreationInputTokens,
  );

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
