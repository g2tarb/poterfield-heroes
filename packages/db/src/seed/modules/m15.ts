import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M15_ID = "m15-react-ecosysteme";

export const m15Module: NewModule = {
  id: M15_ID,
  moduleNumber: 15,
  phase: 4,
  title: "React écosystème (Router, Query, Zustand, RHF+Zod, shadcn/ui)",
  subtitle: "React seul ne suffit pas. La stack complète qui te rend opérationnel pro.",
  pourquoi:
    "React vanilla = base. Mais en prod, tu as besoin : routing (TanStack Router), data fetching/cache (TanStack Query), state global (Zustand), forms (React Hook Form + Zod), composants (shadcn/ui), animations (Framer Motion). Cette stack 2026 = ce que tout projet React commence par installer. La connaître = livrer 5x plus vite.",
  objectives: [
    "TanStack Router (type-safe routing, params, search params)",
    "TanStack Query (queries, mutations, cache, optimistic updates)",
    "Zustand (state global léger, sans Redux)",
    "React Hook Form + Zod (formulaires + validation typée)",
    "shadcn/ui : copy-paste components",
    "Framer Motion (animations React, gestures)",
    "Code splitting + lazy loading React.lazy + Suspense",
    "Error boundaries (catch errors render)",
    "React DevTools + Profiler",
    "React Compiler (auto-memoization)",
    "Patterns architecturaux (hooks layer, services, repositories)",
    "Auth flow basique (login, protected routes, refresh tokens)",
    "i18n (react-i18next)",
  ],
  prerequisites: "Module 14 (React fundamentals)",
  estimatedHours: 40,
  estimatedWeeks: 3,
  stackAllowed: [
    "Vite + React 19 + TS",
    "@tanstack/react-router",
    "@tanstack/react-query",
    "Zustand",
    "react-hook-form + zod",
    "shadcn/ui",
    "framer-motion",
  ],
  prereqModuleId: "m14-react-composants-hooks",
  unlockSrsMatureRatio: 80,
};

export const m15Skills: NewSkill[] = [
  { moduleId: M15_ID, slug: "tanstack-router", label: "TanStack Router (type-safe, file-based)", displayOrder: 1, weight: 3 },
  { moduleId: M15_ID, slug: "router-params", label: "Route params + search params typés", displayOrder: 2, weight: 2 },
  { moduleId: M15_ID, slug: "tanstack-query", label: "TanStack Query (queries, cache, stale time)", displayOrder: 3, weight: 3 },
  { moduleId: M15_ID, slug: "mutations", label: "Mutations + optimistic updates", displayOrder: 4, weight: 3 },
  { moduleId: M15_ID, slug: "zustand", label: "Zustand (state global léger)", displayOrder: 5, weight: 2 },
  { moduleId: M15_ID, slug: "rhf", label: "React Hook Form (uncontrolled, perf)", displayOrder: 6, weight: 3 },
  { moduleId: M15_ID, slug: "zod-forms", label: "Zod schemas + RHF resolver", displayOrder: 7, weight: 3 },
  { moduleId: M15_ID, slug: "shadcn", label: "shadcn/ui : copy-paste + customisation", displayOrder: 8, weight: 2 },
  { moduleId: M15_ID, slug: "framer-motion", label: "Framer Motion (animations, gestures, layout)", displayOrder: 9, weight: 2 },
  { moduleId: M15_ID, slug: "code-splitting", label: "React.lazy + Suspense", displayOrder: 10, weight: 1 },
  { moduleId: M15_ID, slug: "error-boundaries", label: "Error boundaries", displayOrder: 11, weight: 2 },
  { moduleId: M15_ID, slug: "devtools-profiler", label: "React DevTools + Profiler (mesurer avant memoizer)", displayOrder: 12, weight: 1 },
  { moduleId: M15_ID, slug: "compiler", label: "React Compiler (auto-memoization en 2026)", displayOrder: 13, weight: 1 },
  { moduleId: M15_ID, slug: "patterns", label: "Patterns archi (hooks, services, repositories)", displayOrder: 14, weight: 2 },
  { moduleId: M15_ID, slug: "auth-flow", label: "Auth flow (login, protected routes, refresh tokens)", displayOrder: 15, weight: 2 },
  { moduleId: M15_ID, slug: "i18n", label: "i18n (react-i18next)", displayOrder: 16, weight: 1 },
];

export const m15SkillAxisRules = m15Skills.map((s) => ({ skillSlug: s.slug, axisId: "react", contribution: 100 }));

export const m15Videos: NewVideo[] = [
  {
    moduleId: M15_ID,
    isPrimary: 1,
    title: "React Complete Setup 2026 (Vite + TanStack + Zustand + RHF + shadcn)",
    creator: "Brian Holt / Theo (chercher version récente)",
    language: "en",
    durationSeconds: 6 * 60 * 60,
    whyThisOne: "Stack moderne 2026 complète. Brian Holt et Theo couvrent cette stack en profondeur sur Frontend Masters / leurs chaînes.",
    coversSkills: ["tanstack-router", "tanstack-query", "zustand", "shadcn"],
    displayOrder: 1,
  },
  {
    moduleId: M15_ID,
    isPrimary: 0,
    title: "TanStack Query — Complete Course",
    creator: "TkDodo Blog (Dominik Dorfmeister)",
    externalUrl: "https://tkdodo.eu/blog",
    language: "en",
    whyThisOne: "Maintainer principal TanStack Query. Articles indispensables : Practical React Query, Status Checks, Mutations.",
    coversSkills: ["tanstack-query", "mutations"],
    displayOrder: 2,
  },
  {
    moduleId: M15_ID,
    isPrimary: 0,
    title: "shadcn/ui Tutorial",
    creator: "Theo / Web Dev Cody",
    externalUrl: "https://ui.shadcn.com",
    language: "en",
    whyThisOne: "Lib de composants la plus populaire 2024-2026. Modèle copy-paste vs lib classique = changement de paradigme.",
    coversSkills: ["shadcn"],
    displayOrder: 3,
  },
  {
    moduleId: M15_ID,
    isPrimary: 0,
    title: "React Hook Form + Zod Tutorial",
    creator: "Web Dev Simplified / Theo",
    language: "en",
    whyThisOne: "Stack form 2026 standard. RHF (perf, uncontrolled) + Zod (validation typée) + zodResolver = la combo gagnante.",
    coversSkills: ["rhf", "zod-forms"],
    displayOrder: 4,
  },
];

export const m15Exercises: NewExercise[] = [
  {
    moduleId: M15_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : Query + RHF + Zustand",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "TanStack Query — pourquoi mieux que fetch dans useEffect ?",
        options: [
          "Aucun avantage",
          "Cache automatique, dedup requests, refetch on focus, optimistic updates, retry intégré, devtools, status flags (isLoading, isError, isStale)",
          "Plus rapide",
          "Plus court à taper",
        ],
        correctIndex: 1,
        explanation: "fetch + useEffect = 50 lignes de boilerplate par endpoint (cache, loading, error, dedup, refetch). TanStack Query = useQuery(['users'], fetchUsers) → tout géré.",
      },
      {
        question: "Zustand vs Redux/Context — quand utiliser ?",
        options: [
          "Toujours Redux",
          "Zustand = state global léger sans boilerplate. Redux = projets très complexes avec time-travel. Context = state qui change peu (theme, auth) — sinon re-render tout l'arbre.",
          "Identiques",
          "Context toujours",
        ],
        correctIndex: 1,
        explanation: "Zustand = ~1KB, API simpliste (create + hook). Context = re-render TOUS les consumers à chaque update. Pour state global mutable fréquent : Zustand. Pour theme/auth : Context.",
      },
      {
        question: "RHF + Zod — pourquoi 'controlled' = piège classique ?",
        options: [
          "Aucun piège",
          "RHF est uncontrolled par design (refs internes) = pas de re-render à chaque keypress. Le piège : utiliser <input value={watch('name')} onChange={...}> casse la perf.",
          "Zod est obsolète",
          "RHF est lent",
        ],
        correctIndex: 1,
        explanation: "RHF utilise ref pour collecter les valeurs sans re-render. Si tu fais value={watch} → re-render à chaque keypress (perf -10x). Préférer register() ou Controller uniquement quand besoin.",
      },
    ],
    skillSlugs: ["tanstack-query", "zustand", "rhf"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M15_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "MiniBoard — clone Trello mini avec stack complète",
    statement: `App Trello-like complète qui exerce toute la stack 2026.

**Setup**
- Vite + React 19 + TS strict
- TanStack Router (file-based)
- TanStack Query (avec devtools)
- Zustand pour UI state global
- React Hook Form + Zod
- shadcn/ui (init + composants : Button, Dialog, Card, Input, Tabs, Toast)
- Framer Motion pour animations cards drag
- Tailwind v4 + design tokens

**Features**
- Routes : / (boards list), /board/:id (vue board), /board/:id/card/:cardId (modal détail)
- Création/édition board (RHF + Zod : title 3-50 chars, color enum)
- Drag & drop cards entre lists (framer-motion)
- Mutations optimistic via TanStack Query
- Modal détail card avec onglets (description, comments, activity)
- Mock backend : JSON Server + MSW (mocks tests aussi)
- Auth simple (connecté/déconnecté, protected routes)
- Toast notifications (shadcn Toaster)
- Loading skeletons via Suspense + React.lazy

**Critères**
- 0 useState pour data serveur (que TanStack Query)
- 0 prop drilling à plus de 2 niveaux (Zustand pour ça)
- Formulaires : 100% RHF, 0 controlled input
- shadcn/ui customisé (pas brut, théming + variants ajoutées)
- Lighthouse ≥ 90
- 0 warning React DevTools`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["tanstack-router", "tanstack-query", "mutations", "zustand", "rhf", "shadcn", "framer-motion"],
    passThresholdPct: 100,
    estimatedMinutes: 60 * 60,
    displayOrder: 2,
  },
];
