import { anthropic, MODEL_SONNET } from "../lib/anthropic.js";
import { AppError } from "../lib/errors.js";

const QUESTION_SYSTEM = `Tu es un examinateur senior dans l'atelier privé d'apprentissage d'Erwin (Porterfield Heroes).

# Mission
Générer UNE seule question de validation pour une compétence précise. La question doit prouver que la compétence est *vraiment* acquise, pas juste comprise en surface.

# Critères de bonne question
- Demande une explication conceptuelle OU un mini-snippet de code à écrire (max 5 lignes attendues).
- Pointue mais pas piège. Ne porte pas sur un détail obscur.
- Doit avoir UNE bonne réponse claire (pas vague).

# Format de retour (JSON strict, rien d'autre)
{
  "question": "<la question, 1-3 phrases max>",
  "expectedAnswer": "<la réponse attendue ou ses caractéristiques clés, pour l'évaluation>"
}

# Ton
Direct, factuel, pas de bla-bla. Pas de "bonne chance" ou "tu y arrives".`;

const VALIDATION_SYSTEM = `Tu es l'évaluateur de cette même question. Tu juges si la réponse d'Erwin prouve la maîtrise de la compétence.

# Verdict
- "mastered" : la réponse est juste, montre une vraie compréhension.
- "practicing" : la réponse est partielle, montre un début de compréhension mais reste fragile. Continuer à pratiquer.
- "discovering" : la réponse est incorrecte ou hors sujet. Revenir aux fondamentaux.

# Format de retour (JSON strict, rien d'autre)
{
  "verdict": "mastered" | "practicing" | "discovering",
  "feedback": "<markdown court 2-4 lignes : ce qui est juste, ce qui manque, sans donner la solution>"
}

# Ton
Direct, sans flatterie. Si Erwin est juste, le dire et passer. Si bancal, expliquer ce qui cloche.`;

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
  phase: number;
}): Promise<SkillQuestion> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing");
  }

  const prompt = `Module : "${input.moduleTitle}" (phase ${input.phase})
Compétence à valider : "${input.skillLabel}"

Génère UNE question de validation. Réponds en JSON strict, rien d'autre.`;

  const response = await anthropic.messages.create({
    model: MODEL_SONNET,
    max_tokens: 512,
    system: QUESTION_SYSTEM,
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
}): Promise<SkillValidation> {
  if (!anthropic) {
    throw new AppError(503, "ANTHROPIC_API_KEY missing");
  }

  const prompt = `Compétence : "${input.skillLabel}"

Question posée : ${input.question}

Réponse attendue (référence interne) : ${input.expectedAnswer}

Réponse d'Erwin :
${input.userAnswer}

Évalue. JSON strict.`;

  const response = await anthropic.messages.create({
    model: MODEL_SONNET,
    max_tokens: 512,
    system: VALIDATION_SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AppError(502, "Claude returned no text");
  }

  return extractJson<SkillValidation>(textBlock.text);
}
