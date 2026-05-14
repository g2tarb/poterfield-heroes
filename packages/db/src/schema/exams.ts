import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// =============================================================
// WEEKLY EXAMS (contrôle vendredi 18h, auto-généré)
// =============================================================
export const weeklyExams = pgTable(
  "weekly_exams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    weekStartDate: text("week_start_date").notNull().unique(), // YYYY-MM-DD du lundi
    moduleIdsCovered: jsonb("module_ids_covered")
      .$type<string[]>()
      .notNull(),
    skillIdsCovered: jsonb("skill_ids_covered").$type<string[]>().notNull(),
    questions: jsonb("questions").$type<
      Array<
        | {
            kind: "qcm";
            question: string;
            options: string[];
            correctIndex: number;
            explanation: string;
            skillId?: string;
          }
        | {
            kind: "code";
            prompt: string;
            language: string;
            starterCode?: string;
            testsCode?: string;
            expectedBehavior: string;
            skillId?: string;
          }
      >
    >().notNull(),
    timeLimitMinutes: integer("time_limit_minutes").notNull().default(60),
    generatedAt: timestamp("generated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    generationModel: text("generation_model"),
    generationCostCents: integer("generation_cost_cents"),
  },
  (table) => ({
    weekIdx: index("idx_exams_week").on(table.weekStartDate),
  }),
);

// =============================================================
// EXAM SUBMISSIONS (réponses du user)
// =============================================================
export const examSubmissions = pgTable(
  "exam_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => weeklyExams.id, { onDelete: "cascade" }),
    answers: jsonb("answers").$type<
      Array<{
        questionIndex: number;
        answer: string | number;
        isCorrect: boolean;
        partialPct?: number;
      }>
    >().notNull(),
    scorePct: integer("score_pct").notNull(), // 0-100
    durationSeconds: integer("duration_seconds").notNull(),
    feedback: text("feedback"), // analyse coach post-soumission
    cardsReset: jsonb("cards_reset").$type<string[]>(), // ids cartes SRS reset suite à fail
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    examIdx: index("idx_submissions_exam").on(table.examId),
  }),
);

export type WeeklyExam = typeof weeklyExams.$inferSelect;
export type NewWeeklyExam = typeof weeklyExams.$inferInsert;

export type ExamSubmission = typeof examSubmissions.$inferSelect;
export type NewExamSubmission = typeof examSubmissions.$inferInsert;
