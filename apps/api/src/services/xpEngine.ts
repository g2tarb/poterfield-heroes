import type { Database } from "@ph/db";
import { eq, gt, lte, desc, asc, and, sql } from "drizzle-orm";
import { userState, xpEvents, levels } from "@ph/db";

export const XP_VALUES = {
  exercise_passed: 10,
  quiz_verification_passed: 30,
  project_validation: 100,
  module_completed: 200,
  skill_mastered: 25,
  exam_passed: 20,
  exam_perfect: 50,
  streak_milestone_7: 50,
  streak_milestone_30: 200,
  github_push_reviewed: 5,
} as const;

export type XpKind =
  | "module_completed"
  | "skill_mastered"
  | "exam_passed"
  | "exam_perfect"
  | "streak_milestone"
  | "project_validated"
  | "github_push_reviewed";

export async function awardXp(
  db: Database,
  args: {
    kind: XpKind;
    amount: number;
    sourceRef?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<{
  totalXp: number;
  leveledUp: boolean;
  newLevel?: { id: number; slug: string; name: string };
}> {
  await db.insert(xpEvents).values({
    kind: args.kind,
    xpAmount: args.amount,
    sourceRef: args.sourceRef ?? null,
    metadata: args.metadata ?? null,
  });

  // Increment user_state.currentXp
  const [state] = await db
    .update(userState)
    .set({
      currentXp: sql`${userState.currentXp} + ${args.amount}`,
      lastActiveAt: new Date(),
    })
    .where(eq(userState.id, 1))
    .returning({
      currentXp: userState.currentXp,
      currentLevelId: userState.currentLevelId,
    });

  if (!state) {
    return { totalXp: args.amount, leveledUp: false };
  }

  // Check for level up : find the highest level whose xpRequired <= currentXp
  const [highest] = await db
    .select({
      id: levels.id,
      slug: levels.slug,
      name: levels.name,
    })
    .from(levels)
    .where(lte(levels.xpRequired, state.currentXp))
    .orderBy(desc(levels.xpRequired))
    .limit(1);

  if (!highest) return { totalXp: state.currentXp, leveledUp: false };

  const leveledUp = state.currentLevelId !== highest.id;
  if (leveledUp) {
    await db
      .update(userState)
      .set({ currentLevelId: highest.id })
      .where(eq(userState.id, 1));
  }

  return {
    totalXp: state.currentXp,
    leveledUp,
    ...(leveledUp ? { newLevel: highest } : {}),
  };
}

export async function getProgressionSnapshot(db: Database) {
  const [state] = await db
    .select()
    .from(userState)
    .where(eq(userState.id, 1))
    .limit(1);

  if (!state) {
    return null;
  }

  const [currentLevel] = state.currentLevelId
    ? await db
        .select()
        .from(levels)
        .where(eq(levels.id, state.currentLevelId))
        .limit(1)
    : [undefined];

  const [nextLevel] = await db
    .select()
    .from(levels)
    .where(gt(levels.xpRequired, state.currentXp))
    .orderBy(asc(levels.xpRequired))
    .limit(1);

  const xpToNext = nextLevel ? nextLevel.xpRequired - state.currentXp : 0;
  const progressPct =
    currentLevel && nextLevel
      ? Math.round(
          ((state.currentXp - currentLevel.xpRequired) /
            (nextLevel.xpRequired - currentLevel.xpRequired)) *
            100,
        )
      : 100;

  return {
    user: {
      displayName: state.displayName,
      avatarUrl: state.avatarUrl,
      currentXp: state.currentXp,
      streakDays: state.streakDays,
      longestStreak: state.longestStreak,
      startedAt: state.startedAt,
    },
    currentLevel: currentLevel ?? null,
    nextLevel: nextLevel ?? null,
    xpToNext,
    progressPct: Math.min(100, Math.max(0, progressPct)),
  };
}
