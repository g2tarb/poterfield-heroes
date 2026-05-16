import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M22_ID = "m22-devops-deploiement";

export const m22Module: NewModule = {
  id: M22_ID,
  moduleNumber: 22,
  phase: 7,
  title: "DevOps : Docker, CI/CD, déploiement",
  subtitle: "Livrer en prod sans drame. Push → tests → deploy automatique.",
  pourquoi:
    "Tu sais coder, tester, sécuriser. Comment livrer en prod sans drame ? Comment éviter 'ça marche chez moi' ? Piège 1 : croire que DevOps = K8s + AWS + microservices. Non, pour 99% : Docker + PaaS (Render/Railway/Coolify) + GitHub Actions suffit. Piège 2 : deploy manuel (scp, FTP) → un humain oublie 1/10. CI/CD élimine ça.",
  objectives: [
    "Pourquoi Docker (reproductibilité, isolation, portabilité)",
    "Dockerfile, layers, cache, multi-stage build, .dockerignore",
    "docker build/run/exec/logs",
    "Docker Compose (orchestrer plusieurs services, healthchecks, volumes)",
    "Optimiser Dockerfile (alpine, multi-stage : 1.5GB → 200MB)",
    "Registries (Docker Hub, GHCR)",
    "GitHub Actions (workflows YAML, triggers, jobs, matrix)",
    "Secrets + variables GitHub Actions",
    "Pipeline CI complet (lint → typecheck → test → coverage gate)",
    "Pipeline CD (sur main → build → push registry → deploy)",
    "PaaS managées (Render, Railway, Fly.io, Vercel, Cloudflare, Coolify self-host)",
    "Déploiement Fastify sur Render/Coolify + Postgres managé",
    "Déploiement Next.js sur Vercel + preview deployments",
    "Migrations DB en CI/CD (Drizzle drizzle-kit migrate)",
    "Environnements (dev/staging/prod, branches Git)",
    "Healthchecks + graceful shutdown (SIGTERM, app.close)",
    "Stratégies déploiement (rolling, blue-green, canary)",
    "Monitoring (Sentry errors, BetterStack/Axiom logs, UptimeRobot)",
    "Backups Postgres auto (pg_dump → S3/R2)",
    "DNS + HTTPS (Cloudflare, Let's Encrypt)",
    "Twelve-Factor App (12factor.net)",
  ],
  prerequisites: "Modules 16-21",
  estimatedHours: 45,
  estimatedWeeks: 3,
  stackAllowed: [
    "Docker + Docker Compose",
    "GitHub Actions",
    "Render OU Railway OU Coolify self-host",
    "Vercel pour frontend",
    "Sentry + BetterStack",
    "Cloudflare DNS + R2 backups",
  ],
  prereqModuleId: "m21-tests",
  unlockSrsMatureRatio: 80,
};

export const m22Skills: NewSkill[] = [
  { moduleId: M22_ID, slug: "docker-why", label: "Docker (reproductibilité, isolation, portabilité)", displayOrder: 1, weight: 2 },
  { moduleId: M22_ID, slug: "dockerfile", label: "Dockerfile + layers + cache + .dockerignore", displayOrder: 2, weight: 3 },
  { moduleId: M22_ID, slug: "multi-stage", label: "Multi-stage build (builder + runtime minimal)", displayOrder: 3, weight: 3 },
  { moduleId: M22_ID, slug: "docker-cli", label: "docker build/run/exec/logs/ps", displayOrder: 4, weight: 2 },
  { moduleId: M22_ID, slug: "compose", label: "Docker Compose (services, healthchecks, volumes)", displayOrder: 5, weight: 3 },
  { moduleId: M22_ID, slug: "registries", label: "Docker Hub + GHCR + tagging semver", displayOrder: 6, weight: 1 },
  { moduleId: M22_ID, slug: "github-actions", label: "GitHub Actions (workflows, triggers, jobs)", displayOrder: 7, weight: 3 },
  { moduleId: M22_ID, slug: "secrets-vars", label: "Secrets + variables GitHub Actions", displayOrder: 8, weight: 2 },
  { moduleId: M22_ID, slug: "ci-pipeline", label: "Pipeline CI (lint, typecheck, test, coverage)", displayOrder: 9, weight: 3 },
  { moduleId: M22_ID, slug: "cd-pipeline", label: "Pipeline CD (build, push, deploy)", displayOrder: 10, weight: 3 },
  { moduleId: M22_ID, slug: "paas", label: "PaaS (Render, Railway, Fly, Vercel, Coolify)", displayOrder: 11, weight: 2 },
  { moduleId: M22_ID, slug: "deploy-fastify", label: "Déploiement Fastify + Postgres managé", displayOrder: 12, weight: 3 },
  { moduleId: M22_ID, slug: "deploy-nextjs", label: "Next.js sur Vercel + previews", displayOrder: 13, weight: 2 },
  { moduleId: M22_ID, slug: "migrations-ci", label: "Migrations Drizzle en CI/CD", displayOrder: 14, weight: 3 },
  { moduleId: M22_ID, slug: "environments", label: "Environnements dev/staging/prod", displayOrder: 15, weight: 2 },
  { moduleId: M22_ID, slug: "healthcheck-shutdown", label: "Healthcheck + graceful shutdown SIGTERM", displayOrder: 16, weight: 3 },
  { moduleId: M22_ID, slug: "monitoring", label: "Sentry errors + BetterStack logs + uptime", displayOrder: 17, weight: 2 },
  { moduleId: M22_ID, slug: "backups", label: "Backups Postgres auto (pg_dump → S3/R2)", displayOrder: 18, weight: 2 },
  { moduleId: M22_ID, slug: "12factor", label: "Twelve-Factor App (12factor.net)", displayOrder: 19, weight: 1 },
];

export const m22SkillAxisRules = m22Skills.map((s) => ({ skillSlug: s.slug, axisId: "devops", contribution: 100 }));

export const m22Videos: NewVideo[] = [
  {
    moduleId: M22_ID,
    isPrimary: 1,
    title: "Docker Tutorial for Beginners (TechWorld with Nana)",
    creator: "Nana Janashia",
    language: "en",
    durationSeconds: 3 * 60 * 60,
    whyThisOne: "Référence Docker. Couvre Dockerfile, Compose, networks, volumes, multi-stage.",
    coversSkills: ["dockerfile", "compose", "multi-stage", "docker-cli"],
    displayOrder: 1,
  },
  {
    moduleId: M22_ID,
    isPrimary: 0,
    title: "GitHub Actions Tutorial (Nana)",
    creator: "Nana Janashia",
    language: "en",
    durationSeconds: 2 * 60 * 60,
    whyThisOne: "Workflows YAML, triggers, secrets, matrix. Pour bâtir une CI complète.",
    coversSkills: ["github-actions", "ci-pipeline", "cd-pipeline"],
    displayOrder: 2,
  },
  {
    moduleId: M22_ID,
    isPrimary: 0,
    title: "The Twelve-Factor App",
    creator: "Heroku",
    externalUrl: "https://12factor.net",
    language: "en",
    whyThisOne: "12 règles d'or pour apps cloud-native (config in env, stateless, port binding, etc.). À lire en entier.",
    coversSkills: ["12factor", "environments"],
    displayOrder: 3,
  },
  {
    moduleId: M22_ID,
    isPrimary: 0,
    title: "Self-host with Coolify",
    creator: "Coolify",
    externalUrl: "https://coolify.io/docs",
    language: "en",
    whyThisOne: "Pour ton VPS Hostinger. Coolify = alternative open-source à Render/Vercel. Déploie via Docker, HTTPS auto via Let's Encrypt.",
    coversSkills: ["paas", "deploy-fastify"],
    displayOrder: 4,
  },
];

export const m22Exercises: NewExercise[] = [
  {
    moduleId: M22_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : Docker + CI/CD + healthcheck",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Multi-stage Dockerfile — gain ?",
        options: [
          "Aucun",
          "Image finale ne contient que les artefacts (pas devDeps, compilers, tests). 1.5GB → 200MB.",
          "Plus rapide à build",
          "Obsolète",
        ],
        correctIndex: 1,
        explanation: "Stage 'builder' lourd (devDeps, npm install, build). Stage 'runtime' minimal (alpine + node + dist). COPY --from=builder. Image finale 5-10x plus petite + surface d'attaque réduite.",
      },
      {
        question: "Healthcheck endpoint — pourquoi ?",
        options: [
          "Pas utile",
          "Render/K8s/load balancer ping /health pour savoir si le container est vivant. Retourne 503 si DB down → load balancer enlève le container du pool.",
          "Plus lent",
          "Sécurité",
        ],
        correctIndex: 1,
        explanation: "Sans healthcheck, le balancer envoie du trafic à un container qui démarre encore → 502 user. /health teste DB + ressources critiques. Si fail → retiré du load balancer + redémarrage auto.",
      },
      {
        question: "Migration DB en CI/CD — forward-only ?",
        options: [
          "Toujours rollback",
          "Oui forward-only : pas de rollback de migration en prod. Si problème, on écrit une nouvelle migration corrective. (Expand-then-contract pour drop colonne)",
          "Aucune différence",
          "Migration impossible en CI",
        ],
        correctIndex: 1,
        explanation: "Rollback migration = drama (versions app vs DB désynchronisées). Forward-only = sécurise. Pour drop colonne : (1) ajouter nouvelle, (2) deploy code qui utilise les 2, (3) deploy code qui ignore l'ancienne, (4) drop. 3-4 deploys, jamais d'un coup.",
      },
    ],
    skillSlugs: ["multi-stage", "healthcheck-shutdown", "migrations-ci"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M22_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title: "Deploy Forge — pipeline CI/CD complet pour MiniBoard",
    statement: `Pipeline CI/CD complet : push main → tests → deploy < 5min sans intervention.

**A. Dockerfile multi-stage Fastify**
- Stage builder : pnpm install + pnpm build
- Stage runtime : alpine + node + dist only
- User non-root (nodejs:1001)
- Healthcheck inline
- Image < 250MB

**B. docker-compose.yml local**
- postgres:16-alpine (avec pgvector si besoin) + redis:7-alpine + api
- Healthchecks + depends_on conditional
- Volumes persistants

**C. GitHub Actions CI**
- Triggers : push main + PR
- Jobs parallèles : lint, typecheck, test:unit, test:integration (avec service postgres)
- Coverage upload
- Branch protection main : no merge sans CI verte

**D. GitHub Actions CD**
- Sur main après CI verte → trigger deploy Render via webhook
- Vercel deploy auto via intégration GitHub
- Migrations Drizzle au build : pnpm drizzle-kit migrate

**E. Monitoring**
- Sentry (@sentry/node + @sentry/react)
- Logs JSON Pino → BetterStack (gratuit)
- Uptime check (UptimeRobot)
- Test : provoquer une erreur, vérifier qu'elle apparaît dans Sentry

**F. Backups**
- GitHub Action scheduled cron 3h matin
- pg_dump → upload Cloudflare R2
- Garde 30 derniers backups
- Restore testé une fois (drop staging → restore)

**G. Runbook**
- RUNBOOK.md (1 page) : redémarrer, voir logs, DB down, contacts

**Critères**
- Push main → prod en < 5min
- Image < 250MB
- CI < 10min
- Lighthouse Performance ≥ 90 prod
- Tu peux rollback en < 2min (revert commit + push)`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["multi-stage", "compose", "github-actions", "ci-pipeline", "cd-pipeline", "monitoring", "backups"],
    passThresholdPct: 100,
    estimatedMinutes: 45 * 60,
    displayOrder: 2,
  },
];
