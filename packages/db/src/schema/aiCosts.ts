import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Tracking persistant de TOUS les appels IA (Claude API) au-delà du coach.
// Permet cost cap mensuel + analytics par catégorie.
export const aiCosts = pgTable(
  "ai_costs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Catégorie pour analytics: 'coach', 'exercise_correction', 'skill_question',
    // 'skill_validation', 'exam_generation', 'github_review', 'srs_generation',
    // 'code_noir', 'memory_embedding'
    category: text("category").notNull(),
    model: text("model").notNull(), // claude-haiku-4-5, claude-sonnet-4-6, etc.
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    cacheReadTokens: integer("cache_read_tokens").notNull().default(0),
    cacheWriteTokens: integer("cache_write_tokens").notNull().default(0),
    costCents: integer("cost_cents").notNull().default(0),
    // Référence à la ressource source (ex: exercise:UUID, skill:UUID, etc.)
    sourceRef: text("source_ref"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_ai_costs_category").on(table.category),
    createdAtIdx: index("idx_ai_costs_created_at").on(table.createdAt),
  }),
);

export type AiCost = typeof aiCosts.$inferSelect;
export type NewAiCost = typeof aiCosts.$inferInsert;
