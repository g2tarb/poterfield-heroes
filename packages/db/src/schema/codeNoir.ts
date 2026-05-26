import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Progression Code Noir mono-user. Source de vérité Drizzle.
// Bootstrap helper SQL pour fresh installs : infra/postgres/init/02-code-noir-progress.sql.
// Une ligne par technique slug, status = in_progress | mastered.
export const codeNoirProgress = pgTable("code_noir_progress", {
  id: serial("id").primaryKey(),
  techniqueSlug: text("technique_slug").notNull().unique(),
  status: text("status", { enum: ["in_progress", "mastered"] }).notNull(),
  quizScore: integer("quiz_score"),
  masteredAt: timestamp("mastered_at", { withTimezone: true }),
  // Paroxysme : killcount + best time per technique
  firstKillAt: timestamp("first_kill_at", { withTimezone: true }),
  bestTimeMs: integer("best_time_ms"),
  killCount: integer("kill_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type CodeNoirProgress = typeof codeNoirProgress.$inferSelect;
export type NewCodeNoirProgress = typeof codeNoirProgress.$inferInsert;

// Achievements débloqués (un row par achievement slug une fois débloqué)
export const codeNoirAchievements = pgTable("code_noir_achievements", {
  slug: text("slug").primaryKey(), // ex: "first-kill", "sub-1min", "noir-master"
  unlockedAt: timestamp("unlocked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  context: text("context"), // ex: technique_slug qui l'a déclenché, ou metadata libre
});

export type CodeNoirAchievement = typeof codeNoirAchievements.$inferSelect;
export type NewCodeNoirAchievement = typeof codeNoirAchievements.$inferInsert;
