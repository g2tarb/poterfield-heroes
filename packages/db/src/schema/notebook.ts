import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notebookSourceEnum } from "./enums";
import { modules, skills } from "./content";

// =============================================================
// NOTEBOOK ENTRIES (carnet markdown : entrées coach + libres + system)
// =============================================================
export const notebookEntries = pgTable(
  "notebook_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 64 }).references(
      () => modules.id,
      { onDelete: "set null" },
    ),
    skillId: uuid("skill_id").references(() => skills.id, {
      onDelete: "set null",
    }),
    source: notebookSourceEnum("source").notNull(),
    title: text("title").notNull(),
    contentMarkdown: text("content_markdown").notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    starred: integer("starred").notNull().default(0), // 0/1 = épinglé
    // Ancrage vidéo (notes prises pendant la lecture YouTube — Sprint E)
    videoYoutubeId: varchar("video_youtube_id", { length: 32 }),
    videoTimestampSeconds: integer("video_timestamp_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleIdx: index("idx_notebook_module").on(table.moduleId),
    sourceIdx: index("idx_notebook_source").on(table.source),
    starredIdx: index("idx_notebook_starred").on(table.starred),
    videoIdx: index("idx_notebook_video").on(table.videoYoutubeId),
  }),
);

export type NotebookEntry = typeof notebookEntries.$inferSelect;
export type NewNotebookEntry = typeof notebookEntries.$inferInsert;
