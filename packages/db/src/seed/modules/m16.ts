import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M16_ID = "m16-nodejs-runtime";

export const m16Module: NewModule = {
  id: M16_ID,
  moduleNumber: 16,
  phase: 5,
  title: "Node.js (le runtime serveur)",
  subtitle: "Bienvenue dans le backend. JS hors navigateur.",
  pourquoi:
    "Node = JS hors navigateur avec accès au système (fs, http, processus). Sans Node, pas de Vite, npm, Next.js, n8n. Piège : sauter sur Fastify sans comprendre Node lui-même → handlers async qui leak, fs.readFileSync bloquant, erreurs non-catchées qui crashent le process. Ce module pose les fondamentaux : event loop côté Node, modules CJS vs ESM, fs/http/streams, error handling async.",
  objectives: [
    "Node = V8 + libuv + bindings système (runtime, pas langage)",
    "Différences navigateur (DOM, window) vs Node (process, fs, Buffer)",
    "REPL Node + scripts (node script.mjs)",
    "CommonJS (require) vs ESM (import) — pourquoi ESM en 2026",
    "package.json (engines, scripts, deps, type)",
    "Modules core (fs, path, http, os, process, url, crypto, stream, events, util, child_process)",
    "fs/promises (jamais fs sync ni callbacks)",
    "path (join, resolve, dirname, __dirname ESM)",
    "http natif (serveur basique sans framework)",
    "process (env, argv, exit, signaux SIGINT/SIGTERM)",
    "Variables env via --env-file (Node 20+) ou dotenv",
    "Event loop Node (6 phases : timers, pending, idle, poll, check, close)",
    "process.nextTick > Promise > setTimeout (microtasks/macrotasks)",
    "EventEmitter (pub/sub, base de http)",
    "Streams (Readable, Writable, Duplex, Transform, pipe)",
    "Buffer (binaires, encoding)",
    "Erreurs async (try/catch, uncaughtException, unhandledRejection)",
    "Setup TS + tsx (pas de build complexe)",
  ],
  prerequisites: "Modules 8-12 (JS), 11 (async), 13 (TS)",
  estimatedHours: 30,
  estimatedWeeks: 2,
  stackAllowed: ["Node 20+", "TypeScript", "tsx (runtime TS)"],
  prereqModuleId: "m15-react-ecosysteme",
  unlockSrsMatureRatio: 80,
};

export const m16Skills: NewSkill[] = [
  { moduleId: M16_ID, slug: "what-is-node", label: "Node = V8 + libuv + bindings (pas un langage)", displayOrder: 1, weight: 1 },
  { moduleId: M16_ID, slug: "browser-vs-node", label: "Différences navigateur vs Node", displayOrder: 2, weight: 1 },
  { moduleId: M16_ID, slug: "cjs-vs-esm", label: "CommonJS (require) vs ESM (import)", displayOrder: 3, weight: 2 },
  { moduleId: M16_ID, slug: "package-json", label: "package.json (type, engines, scripts)", displayOrder: 4, weight: 2 },
  { moduleId: M16_ID, slug: "fs-promises", label: "fs/promises (jamais Sync en serveur)", displayOrder: 5, weight: 3 },
  { moduleId: M16_ID, slug: "path", label: "path + __dirname en ESM (fileURLToPath)", displayOrder: 6, weight: 2 },
  { moduleId: M16_ID, slug: "http-natif", label: "Serveur http natif (sans framework)", displayOrder: 7, weight: 2 },
  { moduleId: M16_ID, slug: "process", label: "process (env, argv, signals, exit codes)", displayOrder: 8, weight: 2 },
  { moduleId: M16_ID, slug: "env-vars", label: "Variables env (--env-file ou dotenv)", displayOrder: 9, weight: 2 },
  { moduleId: M16_ID, slug: "event-loop-node", label: "Event loop Node : 6 phases", displayOrder: 10, weight: 3 },
  { moduleId: M16_ID, slug: "next-tick", label: "nextTick > Promise > setTimeout", displayOrder: 11, weight: 2 },
  { moduleId: M16_ID, slug: "event-emitter", label: "EventEmitter (pub/sub)", displayOrder: 12, weight: 2 },
  { moduleId: M16_ID, slug: "streams", label: "Streams (Readable, Writable, pipe)", displayOrder: 13, weight: 2 },
  { moduleId: M16_ID, slug: "buffer", label: "Buffer (binaires, encoding)", displayOrder: 14, weight: 1 },
  { moduleId: M16_ID, slug: "error-async", label: "Erreurs async (try/catch, uncaughtException)", displayOrder: 15, weight: 3 },
  { moduleId: M16_ID, slug: "node-prefix", label: "import 'node:fs' (préfixe explicite)", displayOrder: 16, weight: 1 },
];

export const m16SkillAxisRules = m16Skills.map((s) => ({ skillSlug: s.slug, axisId: "backend", contribution: 100 }));

export const m16Videos: NewVideo[] = [
  {
    moduleId: M16_ID,
    isPrimary: 1,
    title: "Node.js Tutorial Français (Cours complet 8h)",
    creator: "Le Codeur Senior",
    youtubeId: "NRxzvpdduvQ",
    language: "fr",
    durationSeconds: 8 * 60 * 60,
    whyThisOne: "Seul cours Node complet en français en accès libre. Bases (modules, fs, http, EventEmitter, streams) avec pédagogie claire.",
    coversSkills: ["fs-promises", "http-natif", "event-emitter", "streams"],
    displayOrder: 1,
  },
  {
    moduleId: M16_ID,
    isPrimary: 0,
    title: "A Complete Visual Guide to the Node.js Event Loop",
    creator: "Lydia Hallie (Builder.io blog)",
    externalUrl: "https://www.builder.io/blog/visual-guide-to-nodejs-event-loop",
    language: "en",
    whyThisOne: "OBLIGATOIRE. Article visuel exceptionnel sur les phases du event loop côté Node. Plus subtil que browser.",
    coversSkills: ["event-loop-node", "next-tick"],
    displayOrder: 2,
  },
  {
    moduleId: M16_ID,
    isPrimary: 0,
    title: "Node.js Best Practices (GitHub)",
    creator: "Yoni Goldberg",
    externalUrl: "https://github.com/goldbergyoni/nodebestpractices",
    language: "en",
    whyThisOne: "Best practices prod par un vétéran. Sécurité, perf, error handling, testing — incontournable avant prod.",
    coversSkills: ["error-async"],
    displayOrder: 3,
  },
];

export const m16Exercises: NewExercise[] = [
  {
    moduleId: M16_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : ESM, event loop, fs",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Pourquoi `fs.readFileSync` est interdit dans un serveur HTTP prod ?",
        options: ["Aucune raison", "Bloque l'event loop pendant la lecture → tous les autres requests gelés", "Plus lent", "Obsolète"],
        correctIndex: 1,
        explanation: "Node single-threaded. Sync = bloque tout. fs/promises.readFile = async, libuv lit en background. Sync OK pour scripts CLI ou startup, jamais dans un handler.",
      },
      {
        question: "ESM `__dirname` — comment le récupérer ?",
        options: [
          "Pareil que CJS",
          "import.meta.url + fileURLToPath + dirname",
          "Impossible",
          "Variable globale",
        ],
        correctIndex: 1,
        explanation: "Pattern : `const __dirname = dirname(fileURLToPath(import.meta.url))`. Toujours nécessaire en ESM strict.",
      },
    ],
    skillSlugs: ["fs-promises", "cjs-vs-esm"],
    passThresholdPct: 80,
    estimatedMinutes: 8,
    displayOrder: 1,
  },
  {
    moduleId: M16_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "Node Forge — 4 outils CLI + serveur HTTP natif",
    statement: `4 outils CLI + 1 mini serveur HTTP from scratch, tout en TS strict + ESM + tsx, sans framework.

1. **file-organizer** : organise un dossier par type (Images/, Documents/, Code/) avec --dry-run
2. **static-site-builder** : .md → .html avec front-matter YAML, mode --watch
3. **log-analyzer** : fichier 100MB via createReadStream + readline, top IPs/URLs/status codes
4. **mini-cron** : config JSON, child_process.exec, SIGINT graceful, log fichier
5. **mini-http-server** : node:http natif (PAS Fastify), GET/POST/PUT/DELETE /api/users, parse JSON manuel, CORS, .env

**Critères**
- TS strict + ESM, 0 any
- fs/promises partout (jamais Sync ni callbacks)
- log-analyzer traite 100MB sans crash mémoire (streams)
- mini-cron gère SIGINT proprement
- Aucun framework HTTP (Express/Fastify interdits), aucune lib HTTP (axios/ky interdits)`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["fs-promises", "streams", "http-natif", "event-emitter"],
    passThresholdPct: 100,
    estimatedMinutes: 25 * 60,
    displayOrder: 2,
  },
];
