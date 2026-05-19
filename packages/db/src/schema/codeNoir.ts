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
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type CodeNoirProgress = typeof codeNoirProgress.$inferSelect;
export type NewCodeNoirProgress = typeof codeNoirProgress.$inferInsert;
