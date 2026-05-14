import {
  pgTable,
  uuid,
  varchar,
  integer,
  jsonb,
  boolean,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
import { moduleStatusEnum, skillStatusEnum } from "./enums.js";
import { modules, skills, videos, exercises } from "./content.js";

// =============================================================
// MODULE PROGRESS (1 row par module visité)
// =============================================================
export const moduleProgress = pgTable(
  "module_progress",
  {
    moduleId: varchar("module_id", { length: 64 })
      .primaryKey()
      .references(() => modules.id, { onDelete: "cascade" }),
    status: moduleStatusEnum("status").notNull().default("locked"),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    secondsSpent: integer("seconds_spent").notNull().default(0),
    currentStepKey: varchar("current_step_key", { length: 64 }), // ex: "video_main", "quiz_activation", "practice"
  },
  (table) => ({
    statusIdx: index("idx_module_progress_status").on(table.status),
  }),
);

// =============================================================
// SKILL PROGRESS (1 row par skill)
// =============================================================
export const skillProgress = pgTable(
  "skill_progress",
  {
    skillId: uuid("skill_id")
      .primaryKey()
      .references(() => skills.id, { onDelete: "cascade" }),
    status: skillStatusEnum("status").notNull().default("discovering"),
    masteryPct: integer("mastery_pct").notNull().default(0), // 0-100
    srsMatureAt: timestamp("srs_mature_at", { withTimezone: true }), // quand toutes les cartes liées sont mature
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    masteredAt: timestamp("mastered_at", { withTimezone: true }),
  },
  (table) => ({
    statusIdx: index("idx_skill_progress_status").on(table.status),
  }),
);

// =============================================================
// VIDEO PROGRESS (positions vues)
// =============================================================
export const videoProgress = pgTable(
  "video_progress",
  {
    videoId: uuid("video_id")
      .primaryKey()
      .references(() => videos.id, { onDelete: "cascade" }),
    lastPositionSeconds: integer("last_position_seconds").notNull().default(0),
    watchedSeconds: integer("watched_seconds").notNull().default(0), // cumul réel vu
    completedAt: timestamp("completed_at", { withTimezone: true }),
    checkpoints: jsonb("checkpoints").$type<number[]>(), // timestamps de quiz injectés
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

// =============================================================
// EXERCISE ATTEMPTS (chaque essai)
// =============================================================
export const exerciseAttempts = pgTable(
  "exercise_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    attemptNumber: integer("attempt_number").notNull(), // 1, 2, 3...
    submittedCode: text("submitted_code"),
    quizAnswers: jsonb("quiz_answers").$type<
      Array<{ questionIndex: number; answer: string | number; isCorrect: boolean }>
    >(),
    scorePct: integer("score_pct"), // 0-100
    passed: boolean("passed").notNull().default(false),
    durationMs: integer("duration_ms"),
    runOutput: text("run_output"),
    runError: text("run_error"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    exerciseIdx: index("idx_attempts_exercise").on(table.exerciseId),
    passedIdx: index("idx_attempts_passed").on(table.passed),
  }),
);

// === Types ===
export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type NewModuleProgress = typeof moduleProgress.$inferInsert;

export type SkillProgress = typeof skillProgress.$inferSelect;
export type NewSkillProgress = typeof skillProgress.$inferInsert;

export type VideoProgress = typeof videoProgress.$inferSelect;
export type NewVideoProgress = typeof videoProgress.$inferInsert;

export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type NewExerciseAttempt = typeof exerciseAttempts.$inferInsert;
