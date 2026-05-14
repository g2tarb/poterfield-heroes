import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  vector,
  index,
} from "drizzle-orm/pg-core";
import { coachRoleEnum, memorySourceEnum } from "./enums";
import { modules, exercises } from "./content";

// =============================================================
// COACH SESSIONS (conversations groupées)
// =============================================================
export const coachSessions = pgTable(
  "coach_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 64 }).references(
      () => modules.id,
      { onDelete: "set null" },
    ),
    title: text("title"), // résumé auto généré par le coach
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    totalInputTokens: integer("total_input_tokens").notNull().default(0),
    totalOutputTokens: integer("total_output_tokens").notNull().default(0),
    totalCostCents: integer("total_cost_cents").notNull().default(0),
  },
  (table) => ({
    moduleIdx: index("idx_coach_sessions_module").on(table.moduleId),
    lastMsgIdx: index("idx_coach_sessions_last_msg").on(table.lastMessageAt),
  }),
);

// =============================================================
// COACH MESSAGES (turns de la conversation)
// =============================================================
export const coachMessages = pgTable(
  "coach_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => coachSessions.id, { onDelete: "cascade" }),
    role: coachRoleEnum("role").notNull(),
    content: text("content").notNull(),
    toolName: varchar("tool_name", { length: 64 }),
    toolInput: jsonb("tool_input"),
    toolOutput: jsonb("tool_output"),
    model: varchar("model", { length: 64 }), // ex: "claude-sonnet-4-6"
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    cachedTokens: integer("cached_tokens"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sessionIdx: index("idx_coach_messages_session").on(table.sessionId),
  }),
);

// =============================================================
// MEMORY EMBEDDINGS (RAG long-terme du coach)
// =============================================================
export const memoryEmbeddings = pgTable(
  "memory_embeddings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: memorySourceEnum("source").notNull(),
    sourceId: uuid("source_id"), // référence vers exercise_attempt / notebook_entry / etc.
    moduleId: varchar("module_id", { length: 64 }).references(
      () => modules.id,
      { onDelete: "set null" },
    ),
    exerciseId: uuid("exercise_id").references(() => exercises.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(), // texte original indexé
    contentSummary: text("content_summary"), // résumé court
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    embedding: vector("embedding", { dimensions: 1024 }).notNull(), // Voyage AI text-embedding-3 = 1024d
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sourceIdx: index("idx_memory_source").on(table.source),
    moduleIdx: index("idx_memory_module").on(table.moduleId),
    // Index HNSW pour recherche vectorielle rapide (créé via raw SQL en migration)
    embeddingIdx: index("idx_memory_embedding_hnsw").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export type CoachSession = typeof coachSessions.$inferSelect;
export type NewCoachSession = typeof coachSessions.$inferInsert;

export type CoachMessage = typeof coachMessages.$inferSelect;
export type NewCoachMessage = typeof coachMessages.$inferInsert;

export type MemoryEmbedding = typeof memoryEmbeddings.$inferSelect;
export type NewMemoryEmbedding = typeof memoryEmbeddings.$inferInsert;
