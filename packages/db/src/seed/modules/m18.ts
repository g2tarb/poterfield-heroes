import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M18_ID = "m18-sql-postgresql";

export const m18Module: NewModule = {
  id: M18_ID,
  moduleNumber: 18,
  phase: 6,
  title: "SQL & PostgreSQL",
  subtitle: "Apprends SQL d'abord. ORM ensuite. Pas l'inverse.",
  pourquoi:
    "Postgres = base par défaut en 2026 (open, fiable, JSON natif, full-text, géo, supportée partout). Piège 1 : sauter sur Prisma/Drizzle avant SQL → tu écris des requêtes catastrophiques sans le savoir. Piège 2 : croire que SQL = SELECT *. Un dev qui maîtrise JOIN, GROUP BY, window functions, indexes, transactions vaut 3x plus.",
  objectives: [
    "Base relationnelle (tables, lignes, schémas, FK, normalisation)",
    "SQL vs NoSQL — pourquoi Postgres en 2026",
    "Installer Postgres (Docker/Postgres.app/Homebrew) + client GUI",
    "psql en CLI (\\l, \\c, \\dt, \\d)",
    "DDL (CREATE/ALTER/DROP TABLE, CREATE INDEX)",
    "DML (SELECT, INSERT, UPDATE, DELETE, UPSERT ON CONFLICT)",
    "Types (INTEGER, UUID, TEXT, BOOLEAN, TIMESTAMPTZ, JSONB, NUMERIC)",
    "Contraintes (PK, FK, UNIQUE, NOT NULL, CHECK, DEFAULT)",
    "JOIN (INNER, LEFT, RIGHT, FULL, CROSS, SELF)",
    "Agrégations (COUNT, SUM, AVG, MIN, MAX) + GROUP BY + HAVING",
    "Sous-requêtes (WHERE, FROM, SELECT)",
    "CTE (WITH AS, récursives)",
    "Window functions (ROW_NUMBER, RANK, LAG, LEAD, OVER PARTITION BY)",
    "Transactions (BEGIN/COMMIT/ROLLBACK, isolation, FOR UPDATE)",
    "Indexes (B-tree, GIN pour JSONB/full-text, partial, composite)",
    "EXPLAIN ANALYZE (seq scan vs index scan)",
    "Normalisation 1NF/2NF/3NF + dénormalisation intentionnelle",
    "Driver pg (paramètres préparés anti SQL injection)",
    "Migrations versionnées (concept)",
  ],
  prerequisites: "Modules 16 et 17",
  estimatedHours: 40,
  estimatedWeeks: 3,
  stackAllowed: ["Postgres 16+", "Docker ou Postgres.app", "TablePlus/Beekeeper/psql", "pg driver"],
  prereqModuleId: "m17-fastify-rest-api",
  unlockSrsMatureRatio: 80,
};

export const m18Skills: NewSkill[] = [
  { moduleId: M18_ID, slug: "relational-concept", label: "Tables, FK, normalisation, ACID", displayOrder: 1, weight: 2 },
  { moduleId: M18_ID, slug: "setup-pg", label: "Installer Postgres + client GUI + psql", displayOrder: 2, weight: 1 },
  { moduleId: M18_ID, slug: "ddl", label: "DDL : CREATE/ALTER/DROP TABLE, indexes", displayOrder: 3, weight: 3 },
  { moduleId: M18_ID, slug: "dml-basic", label: "DML basique : SELECT/INSERT/UPDATE/DELETE", displayOrder: 4, weight: 3 },
  { moduleId: M18_ID, slug: "types", label: "Types Postgres (UUID, TIMESTAMPTZ, JSONB, NUMERIC)", displayOrder: 5, weight: 2 },
  { moduleId: M18_ID, slug: "constraints", label: "Contraintes (PK, FK ON DELETE CASCADE, UNIQUE, CHECK)", displayOrder: 6, weight: 3 },
  { moduleId: M18_ID, slug: "joins", label: "JOIN (INNER, LEFT, RIGHT, FULL, SELF)", displayOrder: 7, weight: 3 },
  { moduleId: M18_ID, slug: "aggregations", label: "GROUP BY + HAVING + agrégations", displayOrder: 8, weight: 3 },
  { moduleId: M18_ID, slug: "subqueries", label: "Sous-requêtes (WHERE, FROM, SELECT)", displayOrder: 9, weight: 2 },
  { moduleId: M18_ID, slug: "cte", label: "CTE (WITH AS, récursives)", displayOrder: 10, weight: 2 },
  { moduleId: M18_ID, slug: "window", label: "Window functions (ROW_NUMBER, RANK, LAG, OVER)", displayOrder: 11, weight: 3 },
  { moduleId: M18_ID, slug: "transactions", label: "Transactions (BEGIN, COMMIT, FOR UPDATE)", displayOrder: 12, weight: 3 },
  { moduleId: M18_ID, slug: "indexes", label: "Indexes (B-tree, GIN, partial, composite)", displayOrder: 13, weight: 3 },
  { moduleId: M18_ID, slug: "explain", label: "EXPLAIN ANALYZE (lire plan d'exécution)", displayOrder: 14, weight: 2 },
  { moduleId: M18_ID, slug: "normalization", label: "Normalisation 1NF/2NF/3NF", displayOrder: 15, weight: 2 },
  { moduleId: M18_ID, slug: "pg-driver", label: "Driver pg (paramètres préparés anti injection)", displayOrder: 16, weight: 3 },
  { moduleId: M18_ID, slug: "jsonb", label: "JSONB queries + jsonb_set + GIN index", displayOrder: 17, weight: 1 },
];

export const m18SkillAxisRules = m18Skills.map((s) => ({ skillSlug: s.slug, axisId: "database", contribution: 100 }));

export const m18Videos: NewVideo[] = [
  {
    moduleId: M18_ID,
    isPrimary: 1,
    title: "PostgreSQL Tutorial for Beginners",
    creator: "freeCodeCamp",
    youtubeId: "SpfIwlAYaKk",
    language: "en",
    durationSeconds: 4 * 60 * 60 + 30 * 60,
    whyThisOne: "Installation, SQL de base, JOIN, GROUP BY, sous-requêtes, indexes. Pédagogique avec projet pratique.",
    coversSkills: ["setup-pg", "ddl", "joins", "aggregations"],
    displayOrder: 1,
  },
  {
    moduleId: M18_ID,
    isPrimary: 0,
    title: "Formation PostgreSQL 18 — De débutant à avancé (FR)",
    creator: "Nicolas DEOUX",
    externalUrl: "https://github.com/NDXDeveloper/formation-postgresql-18",
    language: "fr",
    whyThisOne: "Seule formation PostgreSQL complète en français, à jour. 21 chapitres + 7 annexes. Excellente pour digérer en profondeur.",
    coversSkills: ["transactions", "indexes", "explain", "jsonb"],
    displayOrder: 2,
  },
  {
    moduleId: M18_ID,
    isPrimary: 0,
    title: "Use The Index, Luke!",
    creator: "Markus Winand",
    externalUrl: "https://use-the-index-luke.com",
    language: "en",
    whyThisOne: "Référence absolue sur indexes et performance SQL (gratuit en ligne).",
    coversSkills: ["indexes", "explain"],
    displayOrder: 3,
  },
];

export const m18Exercises: NewExercise[] = [
  {
    moduleId: M18_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : JOIN, transactions, indexes",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "INNER JOIN vs LEFT JOIN ?",
        options: [
          "Identiques",
          "INNER = intersection (lignes match des 2 côtés). LEFT = tout de gauche + matches droite (NULL si non match).",
          "INNER est obsolète",
          "LEFT est plus rapide",
        ],
        correctIndex: 1,
        explanation: "INNER pour 'données qui existent dans les 2 tables'. LEFT pour 'toutes les lignes de A, même si pas de match dans B' (ex: tous les users, même ceux sans commande).",
      },
      {
        question: "Pourquoi `TIMESTAMPTZ` plutôt que `TIMESTAMP` ?",
        options: [
          "Plus rapide",
          "TIMESTAMPTZ stocke en UTC + applique la timezone client. Évite les bugs de timezone en prod multi-pays.",
          "TIMESTAMP est obsolète",
          "Plus court à taper",
        ],
        correctIndex: 1,
        explanation: "TIMESTAMP sans TZ = drama dès qu'on déploie dans un autre pays. Toujours TIMESTAMPTZ sauf cas vraiment local pur.",
      },
      {
        question: "SQL injection — comment l'éviter ?",
        options: [
          "Échapper manuellement",
          "Paramètres préparés ($1, $2) — driver pg gère l'échappement",
          "Ne pas accepter d'input",
          "Utiliser un ORM",
        ],
        correctIndex: 1,
        explanation: "`pool.query('SELECT ... WHERE email = $1', [email])` — le driver sépare le SQL des données. Jamais de concaténation. L'ORM aide mais ne suffit pas (raw queries restent dangereuses).",
      },
    ],
    skillSlugs: ["joins", "types", "pg-driver"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M18_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "sql",
    title: "DB Forge — base MiniBoard en SQL pur + 20 requêtes",
    statement: `Schéma MiniBoard complet en SQL pur (pas ORM), connecté à l'API Fastify M17.

**Setup**
- Postgres 16+ via Docker
- Client GUI (TablePlus/Beekeeper)

**Schéma (10+ tables)**
users, boards, board_members, lists, cards, card_assignees, card_labels, comments, activity_log
- UUID PK, TIMESTAMPTZ, ENUM, JSONB pour metadata
- FK avec ON DELETE CASCADE/SET NULL
- Indexes sur toutes FK + composites + GIN sur JSONB
- Trigger updated_at auto

**20 requêtes** dans queries.sql
- 5 faciles (filtres, count, due_date < now)
- 5 moyennes (JOIN multiples, GROUP BY, sous-requêtes)
- 5 avancées (CTE, window functions, RANK, cumul)
- 5 spécifiques (JSONB, full-text trigram, transactions multi-tables)

**Optimisation**
- 3 requêtes EXPLAIN ANALYZE avec notes optimization-notes.md
- Identifier Seq Scan → ajouter index → re-mesurer

**Connexion Fastify**
- Plugin pg pool (10 connexions)
- Transactions pour création complète d'un board
- Paramètres préparés partout (anti SQLi)

**Critères**
- 0 SELECT * en prod
- Au moins 1 CTE, 1 window function, 1 transaction multi-tables
- pg_dump → drop → restore testé`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["ddl", "joins", "cte", "window", "transactions", "indexes", "explain"],
    passThresholdPct: 100,
    estimatedMinutes: 35 * 60,
    displayOrder: 2,
  },
];
