import { CODE_NOIR_TECHNIQUES } from "./codeNoirData.js";

/**
 * Définitions statiques des achievements Code Noir.
 *
 * Évaluation = pure function à partir de la liste des progressions actuelles
 * + la dernière kill. Une fois débloqué (row dans code_noir_achievements),
 * un achievement reste débloqué pour toujours.
 */

export type AchievementDef = {
  slug: string;
  title: string;
  description: string;
  /** "common" | "rare" | "epic" | "legendary" (pour l'affichage couleur) */
  rarity: "common" | "rare" | "epic" | "legendary";
  /** Icon glyph pour la card */
  icon: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    slug: "first-kill",
    title: "First Kill",
    description: "Capture ta première technique du Code Noir.",
    rarity: "common",
    icon: "▶",
  },
  {
    slug: "sub-5min",
    title: "Speedrun · Sub-5min",
    description: "Killer une technique en moins de 5 minutes.",
    rarity: "rare",
    icon: "⚡",
  },
  {
    slug: "sub-1min",
    title: "Sniper · Sub-1min",
    description: "Killer une technique en moins de 60 secondes. Réservé aux pros.",
    rarity: "legendary",
    icon: "🎯",
  },
  {
    slug: "perfect-quiz",
    title: "Perfect Quiz",
    description: "100% au quiz d'une technique.",
    rarity: "rare",
    icon: "✓",
  },
  {
    slug: "triple-kill",
    title: "Triple Kill",
    description: "3 techniques killed en moins de 24h.",
    rarity: "rare",
    icon: "⇋",
  },
  {
    slug: "rampage",
    title: "Rampage · 5 in a day",
    description: "5 techniques killed en moins de 24h. T'es chaud.",
    rarity: "epic",
    icon: "🔥",
  },
  {
    slug: "module-clean-m01",
    title: "M01 Cleaned",
    description: "Toutes les techniques M01 killed.",
    rarity: "rare",
    icon: "⚑",
  },
  {
    slug: "offensive-arsenal",
    title: "Offensive Arsenal",
    description: "5 techniques de type ⚔ offensive killed.",
    rarity: "rare",
    icon: "⚔",
  },
  {
    slug: "defensive-arsenal",
    title: "Defensive Arsenal",
    description: "5 techniques de type 🛡 defensive killed.",
    rarity: "rare",
    icon: "🛡",
  },
  {
    slug: "duo-virtuoso",
    title: "Duo Virtuoso",
    description: "10 techniques de type ⇋ duo killed.",
    rarity: "epic",
    icon: "⇋",
  },
  {
    slug: "halfway-noir",
    title: "Halfway Noir",
    description: "16 techniques killed (la moitié du Code Noir).",
    rarity: "epic",
    icon: "◐",
  },
  {
    slug: "noir-master",
    title: "Noir Master",
    description: "Toutes les 32 techniques killed. Tu es le Code Noir.",
    rarity: "legendary",
    icon: "★",
  },
];

export type ProgressSnapshot = {
  techniqueSlug: string;
  status: "in_progress" | "mastered";
  quizScore: number | null;
  bestTimeMs: number | null;
  firstKillAt: Date | null;
};

/**
 * Évalue tous les achievements et retourne ceux qui devraient être débloqués
 * à partir d'un snapshot de progression. Ne touche pas à la DB — le caller
 * filtre avec les achievements déjà unlocked.
 */
export function evaluateAchievements(
  progress: ProgressSnapshot[],
): string[] {
  const mastered = progress.filter((p) => p.status === "mastered");
  const masteredCount = mastered.length;
  const unlocked: string[] = [];

  // first-kill : au moins 1 mastered
  if (masteredCount >= 1) unlocked.push("first-kill");

  // sub-5min : au moins un bestTimeMs < 300_000
  if (
    mastered.some((p) => p.bestTimeMs !== null && p.bestTimeMs < 5 * 60 * 1000)
  ) {
    unlocked.push("sub-5min");
  }

  // sub-1min : bestTimeMs < 60_000
  if (
    mastered.some((p) => p.bestTimeMs !== null && p.bestTimeMs < 60 * 1000)
  ) {
    unlocked.push("sub-1min");
  }

  // perfect-quiz : quizScore = 100 sur au moins une
  if (progress.some((p) => p.quizScore === 100)) {
    unlocked.push("perfect-quiz");
  }

  // triple-kill / rampage : 3 / 5 mastered dans les dernières 24h
  const now = Date.now();
  const within24h = mastered.filter((p) => {
    if (!p.firstKillAt) return false;
    return now - p.firstKillAt.getTime() < 24 * 60 * 60 * 1000;
  });
  if (within24h.length >= 3) unlocked.push("triple-kill");
  if (within24h.length >= 5) unlocked.push("rampage");

  // module-clean-m01 : toutes les techniques M01 killed
  const m01Slugs = CODE_NOIR_TECHNIQUES.filter(
    (t) => t.moduleNumber === 1,
  ).map((t) => t.slug);
  const m01Killed = m01Slugs.every((s) =>
    mastered.some((p) => p.techniqueSlug === s),
  );
  if (m01Slugs.length > 0 && m01Killed) unlocked.push("module-clean-m01");

  // offensive / defensive / duo arsenals
  const kindBySlug = new Map(
    CODE_NOIR_TECHNIQUES.map((t) => [t.slug, t.kind]),
  );
  const offensiveKilled = mastered.filter(
    (p) => kindBySlug.get(p.techniqueSlug) === "offensive",
  ).length;
  const defensiveKilled = mastered.filter(
    (p) => kindBySlug.get(p.techniqueSlug) === "defensive",
  ).length;
  const duoKilled = mastered.filter(
    (p) => kindBySlug.get(p.techniqueSlug) === "duo",
  ).length;

  if (offensiveKilled >= 5) unlocked.push("offensive-arsenal");
  if (defensiveKilled >= 5) unlocked.push("defensive-arsenal");
  if (duoKilled >= 10) unlocked.push("duo-virtuoso");

  // Halfway / Master
  if (masteredCount >= 16) unlocked.push("halfway-noir");
  if (masteredCount >= CODE_NOIR_TECHNIQUES.length) unlocked.push("noir-master");

  return unlocked;
}
