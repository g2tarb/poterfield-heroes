import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  real,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { srsCardStateEnum } from "./enums";
import { skills, modules } from "./content";

// =============================================================
// SRS CARDS (FSRS state-of-art 2024, mieux que SM-2)
// =============================================================
export const srsCards = pgTable(
  "srs_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    moduleId: varchar("module_id", { length: 64 })
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    front: text("front").notNull(), // question
    back: text("back").notNull(), // réponse / explication
    answerKeywords: jsonb("answer_keywords").$type<string[]>(), // mots-clés pour auto-eval coach
    state: srsCardStateEnum("state").notNull().default("new"),
    // FSRS algorithm fields
    stability: real("stability").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    intervalDays: integer("interval_days").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    lastReviewAt: timestamp("last_review_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    dueIdx: index("idx_srs_cards_due").on(table.dueAt),
    stateIdx: index("idx_srs_cards_state").on(table.state),
    skillIdx: index("idx_srs_cards_skill").on(table.skillId),
    moduleIdx: index("idx_srs_cards_module").on(table.moduleId),
  }),
);

// =============================================================
// SRS REVIEWS (historique : 1 row par révision)
// =============================================================
export const srsReviews = pgTable(
  "srs_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => srsCards.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // FSRS rating: 1=Again, 2=Hard, 3=Good, 4=Easy
    elapsedDays: real("elapsed_days").notNull(),
    scheduledDays: real("scheduled_days").notNull(),
    stabilityBefore: real("stability_before").notNull(),
    stabilityAfter: real("stability_after").notNull(),
    difficultyBefore: real("difficulty_before").notNull(),
    difficultyAfter: real("difficulty_after").notNull(),
    durationMs: integer("duration_ms"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    cardIdx: index("idx_srs_reviews_card").on(table.cardId),
    reviewedAtIdx: index("idx_srs_reviews_at").on(table.reviewedAt),
  }),
);

export type SrsCard = typeof srsCards.$inferSelect;
export type NewSrsCard = typeof srsCards.$inferInsert;

export type SrsReview = typeof srsReviews.$inferSelect;
export type NewSrsReview = typeof srsReviews.$inferInsert;
