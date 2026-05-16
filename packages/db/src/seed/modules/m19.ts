import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M19_ID = "m19-drizzle-orm";

export const m19Module: NewModule = {
  id: M19_ID,
  moduleNumber: 19,
  phase: 6,
  title: "ORM (Drizzle, alternative Prisma)",
  subtitle: "Le pont entre objets TS et tables SQL. Sans réécrire 50 lignes par endpoint.",
  pourquoi:
    "Tu sais du SQL pur depuis Node. 3 problèmes : queries pas typées (any[]), schéma SQL et types TS en parallèle (bugs garantis), pas de migrations propres. Un ORM résout ça : schéma unique génère types TS + valide queries à compile + système migrations pro. Piège 1 : sauter sur Prisma sans SQL = requêtes lentes en cascade. Piège 2 : croire qu'ORM remplace SQL. Non, il aide à écrire du SQL plus sûr.",
  objectives: [
    "Qu'est-ce qu'un ORM (Object-Relational Mapper)",
    "Drizzle vs Prisma vs TypeORM (philosophies)",
    "Quand ORM vs SQL brut vs query builder léger",
    "Setup Drizzle dans Fastify + TS",
    "Schéma Drizzle en TS pur (pgTable, types, contraintes, indexes)",
    "Query builder Drizzle (select/insert/update/delete, where, joins, orderBy)",
    "Relations (one, many, junction tables)",
    "Relational Queries API (with: { ... }) → évite N+1",
    "Transactions Drizzle (db.transaction)",
    "Migrations Drizzle Kit (generate, migrate, push, studio)",
    "Repository pattern (isoler logique data dans repos)",
    "Prepared statements (perf)",
    "drizzle-zod (Zod schemas auto depuis tables)",
    "Lire SQL généré par Drizzle (logger)",
    "Connaître Prisma (lire schema.prisma, prisma generate)",
    "Patterns avancés (soft delete, audit trail, optimistic locking)",
  ],
  prerequisites: "Modules 13 (TS), 16, 17, 18",
  estimatedHours: 35,
  estimatedWeeks: 3,
  stackAllowed: ["Fastify + Drizzle ORM + Postgres + TS strict + drizzle-zod"],
  prereqModuleId: "m18-sql-postgresql",
  unlockSrsMatureRatio: 80,
};

export const m19Skills: NewSkill[] = [
  { moduleId: M19_ID, slug: "orm-concept", label: "ORM = pont objets TS ↔ tables SQL", displayOrder: 1, weight: 1 },
  { moduleId: M19_ID, slug: "drizzle-vs-prisma", label: "Drizzle (query builder TS) vs Prisma (data mapper)", displayOrder: 2, weight: 1 },
  { moduleId: M19_ID, slug: "setup-drizzle", label: "Setup Drizzle + drizzle-kit + postgres-js", displayOrder: 3, weight: 2 },
  { moduleId: M19_ID, slug: "schema-ts", label: "Schéma Drizzle TS (pgTable, types, contraintes)", displayOrder: 4, weight: 3 },
  { moduleId: M19_ID, slug: "query-builder", label: "Query builder (select, insert, update, delete)", displayOrder: 5, weight: 3 },
  { moduleId: M19_ID, slug: "drizzle-joins", label: "JOIN avec Drizzle (innerJoin, leftJoin)", displayOrder: 6, weight: 2 },
  { moduleId: M19_ID, slug: "relations", label: "Relations (one, many) pour la RQB", displayOrder: 7, weight: 3 },
  { moduleId: M19_ID, slug: "relational-queries", label: "Relational Queries API (with: nested)", displayOrder: 8, weight: 3 },
  { moduleId: M19_ID, slug: "transactions-drizzle", label: "db.transaction (async tx)", displayOrder: 9, weight: 3 },
  { moduleId: M19_ID, slug: "drizzle-kit", label: "drizzle-kit (generate, migrate, push, studio)", displayOrder: 10, weight: 3 },
  { moduleId: M19_ID, slug: "repo-pattern", label: "Repository pattern (isoler accès data)", displayOrder: 11, weight: 2 },
  { moduleId: M19_ID, slug: "prepared", label: "Prepared statements (perf)", displayOrder: 12, weight: 1 },
  { moduleId: M19_ID, slug: "drizzle-zod", label: "drizzle-zod (Zod auto depuis tables)", displayOrder: 13, weight: 2 },
  { moduleId: M19_ID, slug: "logger-sql", label: "Logger SQL pour debug + détecter N+1", displayOrder: 14, weight: 2 },
  { moduleId: M19_ID, slug: "prisma-readonly", label: "Prisma (lire schema.prisma, naviguer projet existant)", displayOrder: 15, weight: 1 },
  { moduleId: M19_ID, slug: "advanced-patterns", label: "Soft delete, audit trail, optimistic locking", displayOrder: 16, weight: 1 },
];

export const m19SkillAxisRules = m19Skills.map((s) => ({ skillSlug: s.slug, axisId: "database", contribution: 100 }));

export const m19Videos: NewVideo[] = [
  {
    moduleId: M19_ID,
    isPrimary: 1,
    title: "Drizzle ORM Crash Course (2024+)",
    creator: "Web Dev Cody / Theo",
    language: "en",
    durationSeconds: 3 * 60 * 60,
    whyThisOne: "Drizzle évolue vite (v1.0 2025). Cherche tutos fin 2024+ pour avoir la version actuelle.",
    coversSkills: ["setup-drizzle", "schema-ts", "query-builder", "drizzle-kit"],
    displayOrder: 1,
  },
  {
    moduleId: M19_ID,
    isPrimary: 0,
    title: "Documentation officielle Drizzle ORM",
    creator: "Drizzle team",
    externalUrl: "https://orm.drizzle.team",
    language: "en",
    whyThisOne: "Excellente doc, structurée. Lire toute la section PostgreSQL est non-négociable.",
    coversSkills: ["schema-ts", "relations", "relational-queries"],
    displayOrder: 2,
  },
  {
    moduleId: M19_ID,
    isPrimary: 0,
    title: "Drizzle vs Prisma 2026 (article)",
    creator: "Makerkit / Encore",
    externalUrl: "https://makerkit.dev/blog/tutorials/drizzle-vs-prisma",
    language: "en",
    whyThisOne: "Comparaison sobre des trade-offs pour faire un choix éclairé.",
    coversSkills: ["drizzle-vs-prisma"],
    displayOrder: 3,
  },
];

export const m19Exercises: NewExercise[] = [
  {
    moduleId: M19_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : Drizzle + Repository pattern",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "drizzle-kit push vs migrate ?",
        options: [
          "Identiques",
          "push = applique direct sans fichier migration (dev only). migrate = applique les fichiers générés (prod safe + traçable).",
          "push est obsolète",
          "migrate est plus rapide",
        ],
        correctIndex: 1,
        explanation: "push = quick iteration en dev (perd l'historique). generate (en dev) → fichier SQL → migrate (en CI/prod) = workflow propre versionné.",
      },
      {
        question: "Relational Queries API (with: { lists: { with: { cards } } }) — utilité ?",
        options: [
          "Plus court à écrire",
          "Évite N+1 : 1-2 requêtes au lieu de N+1 (1 fetch par parent), et retourne données nested propres",
          "Plus rapide à la frappe",
          "Obsolète",
        ],
        correctIndex: 1,
        explanation: "findFirst + boucle findMany = N+1 query problem (1 query pour la list + 1 par item). RQB groupe tout. Équivalent du include de Prisma.",
      },
    ],
    skillSlugs: ["drizzle-kit", "relational-queries"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M19_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "ORM Forge — refonte MiniBoard avec Drizzle (replace pg raw)",
    statement: `Reprendre l'API MiniBoard (M17) + DB Postgres (M18) et remplacer le driver pg brut par Drizzle ORM.

**A. Setup**
- packages/db/ avec schema Drizzle TS (10+ tables)
- drizzle.config.ts (schema, out: ./drizzle, dialect: postgresql)
- Plugin Fastify database.ts décore app.db

**B. Schéma Drizzle**
- Toutes les tables M18 retypées en TS (pgTable, uuid, varchar, timestamp, jsonb)
- Relations définies (relations() pour RQB)
- Types inférés ($inferSelect, $inferInsert)

**C. Migrations**
- pnpm drizzle-kit generate → fichier SQL
- Comparer au schéma M18, ajuster
- pnpm drizzle-kit migrate → applique
- Drizzle Studio sur :4983 pour explorer

**D. Refactor services**
- Repository pattern : boards.repository.ts, lists.repository.ts, etc.
- 0 pool.query dans services métier (que Drizzle)
- ≥ 3 transactions multi-tables
- ≥ 5 Relational Queries (with: ...)
- Logger Drizzle activé pour vérifier 0 N+1

**E. drizzle-zod**
- createInsertSchema/createSelectSchema pour chaque table
- Schemas Zod utilisés dans routes Fastify
- Single source of truth : schema Drizzle → tables + types + Zod

**F. Annexe Prisma**
- Mini-projet séparé prisma-discovery
- schema.prisma + 5 queries (findMany/include/transaction)
- Comparer philosophies

**Critères**
- 0 pool.query brut dans services
- ≥ 3 transactions, ≥ 5 RQB
- Migrations versionnées dans /drizzle/
- 0 N+1 (vérifié via logger)`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["schema-ts", "relational-queries", "transactions-drizzle", "drizzle-kit", "repo-pattern", "drizzle-zod"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
