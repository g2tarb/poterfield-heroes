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
import { codeReviewSeverityEnum } from "./enums";
import { modules } from "./content";

// =============================================================
// GITHUB REPOS (repos trackés, liés à un module ou un projet portfolio)
// =============================================================
export const githubRepos = pgTable(
  "github_repos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    owner: varchar("owner", { length: 100 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    fullName: varchar("full_name", { length: 320 }).notNull().unique(), // "owner/name"
    moduleId: varchar("module_id", { length: 64 }).references(
      () => modules.id,
      { onDelete: "set null" },
    ),
    purpose: varchar("purpose", { length: 80 }), // "module_project" | "portfolio" | "exercice"
    defaultBranch: varchar("default_branch", { length: 80 })
      .notNull()
      .default("main"),
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleIdx: index("idx_repos_module").on(table.moduleId),
  }),
);

// =============================================================
// GITHUB PUSHES (events webhook)
// =============================================================
export const githubPushes = pgTable(
  "github_pushes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    repoId: uuid("repo_id")
      .notNull()
      .references(() => githubRepos.id, { onDelete: "cascade" }),
    branch: varchar("branch", { length: 80 }).notNull(),
    headSha: varchar("head_sha", { length: 40 }).notNull(),
    beforeSha: varchar("before_sha", { length: 40 }),
    commitsCount: integer("commits_count").notNull().default(1),
    commitsPayload: jsonb("commits_payload"), // payload GitHub brut
    detectedAt: timestamp("detected_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewStartedAt: timestamp("review_started_at", { withTimezone: true }),
    reviewCompletedAt: timestamp("review_completed_at", { withTimezone: true }),
  },
  (table) => ({
    repoIdx: index("idx_pushes_repo").on(table.repoId),
    detectedIdx: index("idx_pushes_detected").on(table.detectedAt),
  }),
);

// =============================================================
// CODE REVIEWS (review IA d'un push)
// =============================================================
export const codeReviews = pgTable(
  "code_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pushId: uuid("push_id")
      .notNull()
      .references(() => githubPushes.id, { onDelete: "cascade" }),
    overallSeverity: codeReviewSeverityEnum("overall_severity")
      .notNull()
      .default("info"),
    overallSummary: text("overall_summary").notNull(),
    annotations: jsonb("annotations")
      .$type<
        Array<{
          file: string;
          line: number;
          severity: "info" | "suggestion" | "warning" | "critical";
          message: string;
          suggestedFix?: string;
        }>
      >()
      .notNull(),
    criteriaScores: jsonb("criteria_scores").$type<Record<string, number>>(), // 20+ critères 0-100
    model: varchar("model", { length: 64 }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    costCents: integer("cost_cents"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pushIdx: index("idx_reviews_push").on(table.pushId),
  }),
);

export type GithubRepo = typeof githubRepos.$inferSelect;
export type NewGithubRepo = typeof githubRepos.$inferInsert;

export type GithubPush = typeof githubPushes.$inferSelect;
export type NewGithubPush = typeof githubPushes.$inferInsert;

export type CodeReview = typeof codeReviews.$inferSelect;
export type NewCodeReview = typeof codeReviews.$inferInsert;
