import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import {
  exerciseKindEnum,
  sandboxKindEnum,
  programmingLanguageEnum,
} from "./enums";

// =============================================================
// MASTERY AXES (12 axes du radar de progression)
// =============================================================
export const masteryAxes = pgTable("mastery_axes", {
  id: varchar("id", { length: 32 }).primaryKey(), // ex: "javascript", "backend"
  label: varchar("label", { length: 80 }).notNull(),
  description: text("description").notNull(),
  colorHex: varchar("color_hex", { length: 7 }).notNull(),
  displayOrder: integer("display_order").notNull(),
});

// =============================================================
// LEVELS (12 paliers nommés avec projets exemples)
// =============================================================
export const levels = pgTable("levels", {
  id: integer("id").primaryKey(), // 1 à 12
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(), // ex: "Dev fullstack junior"
  icon: varchar("icon", { length: 8 }), // emoji ou symbole
  xpRequired: integer("xp_required").notNull(),
  description: text("description").notNull(),
  projectExamples: jsonb("project_examples").$type<string[]>().notNull(), // 3-5 projets que tu peux désormais construire
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =============================================================
// MODULES (les 25 modules de la roadmap)
// =============================================================
export const modules = pgTable(
  "modules",
  {
    id: varchar("id", { length: 64 }).primaryKey(), // ex: "m01-comment-fonctionne-le-web"
    moduleNumber: integer("module_number").notNull().unique(), // 1..25
    phase: integer("phase").notNull(), // 1..8 (Phase 1 à Phase 8)
    title: varchar("title", { length: 200 }).notNull(),
    subtitle: varchar("subtitle", { length: 300 }),
    pourquoi: text("pourquoi").notNull(),
    objectives: jsonb("objectives").$type<string[]>().notNull(), // liste des objectifs d'apprentissage
    prerequisites: text("prerequisites"),
    estimatedHours: integer("estimated_hours").notNull(),
    estimatedWeeks: integer("estimated_weeks"),
    stackAllowed: jsonb("stack_allowed").$type<string[]>(),
    prereqModuleId: varchar("prereq_module_id", { length: 64 }).references(
      (): AnyPgColumn => modules.id,
    ),
    unlockSrsMatureRatio: integer("unlock_srs_mature_ratio").notNull().default(80), // % cartes mature requis
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleNumberIdx: index("idx_modules_number").on(table.moduleNumber),
    phaseIdx: index("idx_modules_phase").on(table.phase),
  }),
);

// =============================================================
// SKILLS (compétences cibles, ~10-16 par module)
// =============================================================
export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 64 })
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 80 }).notNull(),
    label: text("label").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull(),
    weight: integer("weight").notNull().default(1), // pondération XP
    // Vidéos YouTube par skill : [{ youtubeId, title?, channel?, lang: "fr"|"en" }]
    videos: jsonb("videos")
      .$type<
        Array<{
          youtubeId: string;
          title?: string;
          channel?: string;
          lang: "fr" | "en";
        }>
      >()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleIdx: index("idx_skills_module").on(table.moduleId),
    moduleSlugUq: index("uq_skills_module_slug").on(table.moduleId, table.slug),
  }),
);

// =============================================================
// SKILL ↔ MASTERY AXES (junction : 1 skill contribue à N axes)
// =============================================================
export const skillAxes = pgTable(
  "skill_axes",
  {
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    axisId: varchar("axis_id", { length: 32 })
      .notNull()
      .references(() => masteryAxes.id, { onDelete: "cascade" }),
    contribution: integer("contribution").notNull().default(100), // 0-100, pondération sur l'axe
  },
  (table) => ({
    pk: primaryKey({ columns: [table.skillId, table.axisId] }),
  }),
);

// =============================================================
// VIDEOS (principale + additionnelles par module)
// =============================================================
export const videos = pgTable(
  "videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 64 })
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    isPrimary: integer("is_primary").notNull().default(0), // 1 = vidéo principale, 0 = additionnelle
    title: text("title").notNull(),
    creator: varchar("creator", { length: 160 }),
    youtubeId: varchar("youtube_id", { length: 32 }),
    externalUrl: text("external_url"),
    language: varchar("language", { length: 8 }).notNull().default("en"),
    durationSeconds: integer("duration_seconds"),
    startSeconds: integer("start_seconds"),
    endSeconds: integer("end_seconds"),
    whyThisOne: text("why_this_one"), // justification "pourquoi celle-ci"
    coversSkills: jsonb("covers_skills").$type<string[]>(), // skill slugs
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleIdx: index("idx_videos_module").on(table.moduleId),
  }),
);

// =============================================================
// EXERCISES (quiz activation, vérification, code, projet)
// =============================================================
export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 64 })
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    kind: exerciseKindEnum("kind").notNull(),
    sandbox: sandboxKindEnum("sandbox").notNull().default("browser"),
    language: programmingLanguageEnum("language"),
    title: text("title").notNull(),
    statement: text("statement").notNull(), // énoncé markdown
    starterCode: text("starter_code"),
    solutionCode: text("solution_code"),
    expectedOutput: text("expected_output"),
    testsCode: text("tests_code"), // tests JS/Python à exécuter en sandbox
    quizQuestions: jsonb("quiz_questions").$type<
      Array<{
        question: string;
        options?: string[];
        correctIndex?: number;
        correctText?: string;
        explanation: string;
      }>
    >(),
    skillSlugs: jsonb("skill_slugs").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    passThresholdPct: integer("pass_threshold_pct").notNull().default(80),
    estimatedMinutes: integer("estimated_minutes"),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    moduleIdx: index("idx_exercises_module").on(table.moduleId),
    kindIdx: index("idx_exercises_kind").on(table.kind),
  }),
);

// =============================================================
// TYPES INFÉRÉS
// =============================================================
export type MasteryAxis = typeof masteryAxes.$inferSelect;
export type NewMasteryAxis = typeof masteryAxes.$inferInsert;

export type Level = typeof levels.$inferSelect;
export type NewLevel = typeof levels.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type SkillAxis = typeof skillAxes.$inferSelect;
export type NewSkillAxis = typeof skillAxes.$inferInsert;

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
