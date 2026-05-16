import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M17_ID = "m17-fastify-rest-api";

export const m17Module: NewModule = {
  id: M17_ID,
  moduleNumber: 17,
  phase: 5,
  title: "API REST avec Fastify (backend pro TS)",
  subtitle: "Le framework HTTP de référence Node en 2026. 2x plus rapide qu'Express.",
  pourquoi:
    "Tu sais créer un serveur node:http natif. En vrai projet, jamais. Tu as besoin d'un framework : routing, parsing, validation, error handling, logger, plugins. Fastify s'impose en 2026 : 2x plus rapide qu'Express, TS-first, JSON Schema/Zod intégrée, écosystème solide. C'est aussi ta stack actuelle (Flaynn). Piège : copier-coller un boilerplate sans comprendre lifecycle hooks, plugin system, decorators, schema validation.",
  objectives: [
    "Ce qu'apporte un framework (routing, parsing, validation, errors, logs, hooks)",
    "Alternatives (Fastify vs Express vs Hono vs Koa vs NestJS) — pourquoi Fastify",
    "Setup TS + tsx watch + ESM",
    "Création serveur (Fastify({ logger }), app.listen)",
    "Routing (get/post/put/patch/delete, params, querystring, regex)",
    "Schemas validation (body, params, querystring, headers) + serialization output",
    "TypeBox vs Zod (cohérent avec frontend = Zod)",
    "Inférer types TS depuis schemas Zod (single source of truth)",
    "Lifecycle hooks (onRequest, preValidation, preHandler, onSend, onResponse, onError)",
    "Plugin system + fastify-plugin + decorators",
    "Plugins essentiels (cors, helmet, sensible, jwt, cookie, rate-limit, multipart, static, swagger)",
    "Error handling (setErrorHandler, codes HTTP, format cohérent)",
    "Logger Pino (JSON prod, redaction secrets)",
    "REST : verbes, status codes (200/201/204/400/401/403/404/422/500), idempotence",
    "Architecture en couches (routes → controllers → services → repositories)",
    "Swagger/OpenAPI auto depuis schemas",
    "Tests via app.inject (pas besoin de listen)",
    "Déploiement Render/Railway/Coolify",
  ],
  prerequisites: "Modules 13 (TS), 16 (Node)",
  estimatedHours: 40,
  estimatedWeeks: 3,
  stackAllowed: [
    "Node 20+ + Fastify 5 + TS strict + ESM",
    "Zod + fastify-type-provider-zod",
    "JWT + Pino + Vitest",
  ],
  prereqModuleId: "m16-nodejs-runtime",
  unlockSrsMatureRatio: 80,
};

export const m17Skills: NewSkill[] = [
  { moduleId: M17_ID, slug: "framework-why", label: "Pourquoi framework HTTP (routing, parsing, validation)", displayOrder: 1, weight: 1 },
  { moduleId: M17_ID, slug: "fastify-vs-others", label: "Fastify vs Express/Hono/NestJS — pourquoi en 2026", displayOrder: 2, weight: 1 },
  { moduleId: M17_ID, slug: "setup", label: "Setup Fastify + TS strict + tsx watch + ESM", displayOrder: 3, weight: 2 },
  { moduleId: M17_ID, slug: "routing", label: "Routing (get/post/put/patch/delete, params, query)", displayOrder: 4, weight: 3 },
  { moduleId: M17_ID, slug: "schemas-zod", label: "Validation Zod (body/params/query) + serialization", displayOrder: 5, weight: 3 },
  { moduleId: M17_ID, slug: "ts-inference", label: "Inférer types TS depuis schemas Zod", displayOrder: 6, weight: 3 },
  { moduleId: M17_ID, slug: "lifecycle-hooks", label: "Lifecycle hooks (onRequest, preHandler, onSend)", displayOrder: 7, weight: 3 },
  { moduleId: M17_ID, slug: "plugins", label: "Plugin system + fastify-plugin + decorators", displayOrder: 8, weight: 3 },
  { moduleId: M17_ID, slug: "core-plugins", label: "Plugins (cors, helmet, jwt, cookie, rate-limit, swagger)", displayOrder: 9, weight: 2 },
  { moduleId: M17_ID, slug: "error-handler", label: "Error handler global + format cohérent", displayOrder: 10, weight: 3 },
  { moduleId: M17_ID, slug: "logger-pino", label: "Pino logger JSON + redaction", displayOrder: 11, weight: 2 },
  { moduleId: M17_ID, slug: "rest-conventions", label: "REST verbes + status codes + idempotence", displayOrder: 12, weight: 2 },
  { moduleId: M17_ID, slug: "layers", label: "Architecture en couches (routes/controllers/services/repos)", displayOrder: 13, weight: 3 },
  { moduleId: M17_ID, slug: "swagger", label: "Swagger/OpenAPI auto", displayOrder: 14, weight: 1 },
  { moduleId: M17_ID, slug: "app-inject", label: "Tests via app.inject (pas de listen)", displayOrder: 15, weight: 2 },
  { moduleId: M17_ID, slug: "deploy", label: "Déploiement Render/Coolify + healthcheck + graceful shutdown", displayOrder: 16, weight: 1 },
];

export const m17SkillAxisRules = m17Skills.map((s) => ({ skillSlug: s.slug, axisId: "backend", contribution: 100 }));

export const m17Videos: NewVideo[] = [
  {
    moduleId: M17_ID,
    isPrimary: 1,
    title: "Fastify Crash Course / Build REST API with Fastify + TS + Zod",
    creator: "YouTube tutorials récents 2024-2026",
    language: "en",
    durationSeconds: 4 * 60 * 60,
    whyThisOne: "Stack moderne complète (Fastify + TS + Zod + JWT). Cherche les vidéos 2024+ pour avoir Fastify 5.",
    coversSkills: ["setup", "routing", "schemas-zod", "plugins"],
    displayOrder: 1,
  },
  {
    moduleId: M17_ID,
    isPrimary: 0,
    title: "Documentation officielle Fastify (à lire en entier)",
    creator: "Fastify team",
    externalUrl: "https://fastify.dev/docs",
    language: "en",
    whyThisOne: "Une des meilleures docs du JS moderne. Sections : Getting Started, Routes, Hooks, Plugins, Validation, Errors, TypeScript.",
    coversSkills: ["lifecycle-hooks", "plugins", "error-handler"],
    displayOrder: 2,
  },
  {
    moduleId: M17_ID,
    isPrimary: 0,
    title: "REST API Best Practices 2024",
    creator: "Microsoft API Guidelines",
    externalUrl: "https://github.com/microsoft/api-guidelines",
    language: "en",
    whyThisOne: "Référence pour nommer, status codes, idempotence, pagination, versioning. Standards de l'industrie.",
    coversSkills: ["rest-conventions"],
    displayOrder: 3,
  },
];

export const m17Exercises: NewExercise[] = [
  {
    moduleId: M17_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : Fastify lifecycle + Zod",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Status code pour POST réussi qui crée une ressource ?",
        options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
        correctIndex: 1,
        explanation: "201 = ressource créée. 200 = succès générique. 204 = succès sans body (DELETE). 422 = validation fail. 409 = conflict (duplicate).",
      },
      {
        question: "fastify-plugin (fp) — pourquoi ?",
        options: [
          "Décoration",
          "Skip l'encapsulation : decorators/hooks du plugin sont visibles dans le scope parent (sinon scopés au plugin uniquement)",
          "Plus rapide",
          "Obsolète",
        ],
        correctIndex: 1,
        explanation: "Fastify encapsule par défaut chaque register. fp() retire ça → decorators (app.authenticate) sont partagés. Indispensable pour les plugins qui exposent des utilities globales.",
      },
    ],
    skillSlugs: ["rest-conventions", "plugins"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M17_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "API Forge — backend MiniBoard complet (Fastify + Zod + JWT)",
    statement: `Backend complet du MiniBoard (M15) en Fastify + TS strict.

**Setup pro**
- Fastify 5 + plugins (cors, helmet, sensible, jwt, cookie, rate-limit, swagger)
- fastify-type-provider-zod (validation runtime + types TS)
- Pino logger JSON + redaction secrets
- Architecture en couches : routes → controllers → services → repos (mock data Map en mémoire, Drizzle au M19)

**Endpoints CRUD**
- Auth : POST /auth/register, /auth/login, /auth/logout, GET /auth/me + JWT
- Users, Boards, Lists, Cards : GET (list + détail), POST, PATCH, DELETE
- Permissions (owner/admin/member/viewer)
- Pagination ?page=1&limit=20

**Error handling**
- Classes custom (NotFoundError, UnauthorizedError, ForbiddenError, ValidationError)
- setErrorHandler global : ZodError → 422, AppError → status custom, autre → 500 (pas de stack en prod)

**Sécurité**
- bcrypt password hash
- JWT secret env + expires 7d
- Rate limit 100 req/min global, 5 req/min /auth/login
- CORS strict (domain frontend)
- Helmet headers

**Doc + Tests**
- Swagger UI auto sur /docs
- Tests app.inject : 1 test par endpoint minimum
- Healthcheck /health (DB ping)

**Déploiement**
- Render/Coolify avec env vars
- MiniBoard frontend (M15) pointe vers ce backend en prod`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["routing", "schemas-zod", "plugins", "error-handler", "layers", "deploy"],
    passThresholdPct: 100,
    estimatedMinutes: 45 * 60,
    displayOrder: 2,
  },
];
