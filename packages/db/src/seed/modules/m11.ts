import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M11_ID = "m11-javascript-async";

export const m11Module: NewModule = {
  id: M11_ID,
  moduleNumber: 11,
  phase: 3,
  title: "JavaScript asynchrone (callbacks, promises, async/await, fetch)",
  subtitle: "Le module le plus piégeux. Débloque tout le reste : API, Node, IA.",
  pourquoi:
    "Tout ce que tu as codé est synchrone. Mais le web vit dans l'async : appels API 200ms, click utilisateur qui arrive un jour ou jamais. Sans maîtriser : `console.log(data)` affiche undefined parce que data pas encore arrivée. Comprendre l'event loop sous le capot, gérer les erreurs réseau, paralléliser correctement, éviter callback hell. Le plus piégeux de la phase JS, mais débloque tout : API, React Query, Node, n8n, Claude API.",
  objectives: [
    "Single-threaded mais event loop",
    "Event loop : call stack, Web APIs, microtask queue, macrotask queue",
    "Callbacks et callback hell",
    "Promises (pending, fulfilled, rejected, .then, .catch, .finally, chaining)",
    "Promise.all / Promise.allSettled / Promise.race / Promise.any",
    "async/await + try/catch",
    "fetch : response.ok, response.json, error réseau vs 4xx/5xx",
    "POST/PUT/DELETE avec headers + body JSON",
    "AbortController (timeout, navigation, debounce)",
    "Microtasks vs macrotasks (Promise.then vs setTimeout)",
    "Retry avec backoff exponentiel",
    "Debounce + throttle",
    "setTimeout, setInterval, requestAnimationFrame",
  ],
  prerequisites: "Modules 8, 9, 10",
  estimatedHours: 28,
  estimatedWeeks: 2,
  stackAllowed: ["HTML + CSS + JS ES6+ + Vite", "fetch natif (pas axios/ky)"],
  prereqModuleId: "m10-javascript-moderne-es6",
  unlockSrsMatureRatio: 80,
};

export const m11Skills: NewSkill[] = [
  { moduleId: M11_ID, slug: "single-threaded", label: "JS single-threaded mais async via event loop", displayOrder: 1, weight: 3 },
  { moduleId: M11_ID, slug: "event-loop", label: "Event loop : call stack + queues", displayOrder: 2, weight: 3 },
  { moduleId: M11_ID, slug: "callbacks", label: "Callbacks + callback hell", displayOrder: 3, weight: 1 },
  { moduleId: M11_ID, slug: "promises", label: "Promises (pending/fulfilled/rejected, then/catch/finally)", displayOrder: 4, weight: 3 },
  { moduleId: M11_ID, slug: "promise-static", label: "Promise.all / allSettled / race / any", displayOrder: 5, weight: 3 },
  { moduleId: M11_ID, slug: "async-await", label: "async/await + try/catch", displayOrder: 6, weight: 3 },
  { moduleId: M11_ID, slug: "fetch", label: "fetch : response.ok, response.json, erreurs", displayOrder: 7, weight: 3 },
  { moduleId: M11_ID, slug: "fetch-post", label: "POST/PUT/DELETE + body JSON", displayOrder: 8, weight: 2 },
  { moduleId: M11_ID, slug: "abort-controller", label: "AbortController pour timeout/cancel", displayOrder: 9, weight: 3 },
  { moduleId: M11_ID, slug: "microtasks", label: "Microtasks (Promise) > macrotasks (setTimeout)", displayOrder: 10, weight: 2 },
  { moduleId: M11_ID, slug: "retry-backoff", label: "Retry avec backoff exponentiel", displayOrder: 11, weight: 2 },
  { moduleId: M11_ID, slug: "debounce-throttle", label: "Debounce vs throttle", displayOrder: 12, weight: 3 },
  { moduleId: M11_ID, slug: "timers", label: "setTimeout, setInterval, requestAnimationFrame", displayOrder: 13, weight: 1 },
];

export const m11SkillAxisRules = m11Skills.map((s) => ({ skillSlug: s.slug, axisId: "javascript", contribution: 100 }));

export const m11Videos: NewVideo[] = [
  {
    moduleId: M11_ID,
    isPrimary: 1,
    title: "JavaScript Tutorial Full Course (sections Promises + async/await)",
    creator: "SuperSimpleDev",
    youtubeId: "EerdGm-ehJQ",
    language: "en",
    durationSeconds: 4 * 60 * 60,
    whyThisOne: "Continuité. Animations event loop, puis Promises + async/await avec fetch d'API concret.",
    coversSkills: ["promises", "async-await", "fetch"],
    displayOrder: 1,
  },
  {
    moduleId: M11_ID,
    isPrimary: 0,
    title: "What the heck is the event loop anyway?",
    creator: "Philip Roberts (JSConf EU 2014)",
    youtubeId: "8aGhZQkoFbQ",
    language: "en",
    durationSeconds: 26 * 60,
    whyThisOne: "LE talk de référence (10M+ vues). Animation visuelle de l'event loop. À voir absolument, c'est le déclic mental qui rend tout évident.",
    coversSkills: ["single-threaded", "event-loop", "microtasks"],
    displayOrder: 2,
  },
  {
    moduleId: M11_ID,
    isPrimary: 0,
    title: "Loupe — Visualiseur Event Loop interactif",
    creator: "Philip Roberts",
    externalUrl: "http://latentflip.com/loupe",
    language: "en",
    whyThisOne: "OBLIGATOIRE : tu colles ton code, tu vois le call stack et la queue en temps réel. Passe 1h dessus.",
    coversSkills: ["event-loop"],
    displayOrder: 3,
  },
];

export const m11Exercises: NewExercise[] = [
  {
    moduleId: M11_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : event loop + Promises + fetch",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "`fetch('/api/users')` retourne une URL qui renvoie 404. La Promise resolve ou reject ?",
        options: [
          "reject (erreur)",
          "resolve (avec response.ok = false). Promise reject uniquement sur erreur réseau",
          "TypeError",
          "Renvoie null",
        ],
        correctIndex: 1,
        explanation: "Piège classique. fetch resolve même sur 4xx/5xx. Toujours `if (!res.ok) throw new Error(...)` avant `res.json()`.",
      },
      {
        question: "`Promise.all` vs `Promise.allSettled` ?",
        options: [
          "Identiques",
          "all : tous doivent réussir, sinon reject immédiat. allSettled : attend tous, ne reject jamais (array de {status, value/reason}).",
          "allSettled est obsolète",
          "all est plus rapide",
        ],
        correctIndex: 1,
        explanation: "all = 'tout ou rien' (utile quand A et B sont liés). allSettled = 'tout, je résume après' (utile pour résultats partiels, dashboards).",
      },
      {
        question: "Comment annuler une requête fetch après 5s ?",
        options: [
          "Impossible",
          "AbortController + setTimeout 5000 + controller.abort() + fetch({ signal })",
          "Promise.race avec setTimeout",
          "Les deux marchent (B et C)",
        ],
        correctIndex: 3,
        explanation: "AbortController est le pattern moderne (annule vraiment la requête réseau). Promise.race(fetch, timeout) marche aussi mais ne stoppe pas le fetch sous-jacent.",
      },
    ],
    skillSlugs: ["fetch", "promise-static", "abort-controller"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M11_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "javascript",
    title: "Async Lab — client API complet (4 sections)",
    statement: `Mini-app qui consomme JSONPlaceholder + PokéAPI. Démontre Promises, async/await, parallel, debounce, retry, AbortController.

**Utils**
- sleep(ms), debounce(fn, delay), throttle(fn, delay), retry(fn, retries, backoff), fetchWithTimeout(url, timeoutMs)

**Section 1 — Série vs parallèle**
- 2 boutons : await sequentiel vs Promise.all
- Affiche le temps pour démontrer la différence (~10x)

**Section 2 — Search debounce**
- Input : debounce 300ms
- Spinner pendant load
- AbortController : nouvelle recherche annule l'ancienne

**Section 3 — Cascade requêtes**
- user → posts → comments par post
- Mode séquentiel vs optimisé parallèle
- Temps comparé

**Section 4 — Gestion erreurs**
- 404 fetch → afficher proprement
- Erreur réseau → afficher
- Test retry : URL qui fail 2x puis succeed
- Test timeout : URL volontairement lente → AbortError après 5s

**Critères**
- 100% async/await (pas .then.catch chains)
- try/catch partout
- Au moins 1 Promise.all + 1 AbortController
- debounce + throttle codés à la main (pas lodash)
- App reste réactive pendant chargements`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["async-await", "fetch", "abort-controller", "retry-backoff", "debounce-throttle"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
