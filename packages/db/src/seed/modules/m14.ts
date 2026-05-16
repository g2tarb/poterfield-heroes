import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M14_ID = "m14-react-composants-hooks";

export const m14Module: NewModule = {
  id: M14_ID,
  moduleNumber: 14,
  phase: 4,
  title: "React (composants, JSX, hooks)",
  subtitle: "Le framework UI dominant. ~70% des offres frontend l'exigent.",
  pourquoi:
    "React = framework UI dominant 2026 (Meta, Netflix, Airbnb, Stripe, Vercel, Anthropic). ~70% des offres frontend. Piège 1 : croire que React = HTML + JS dans le même fichier. Non, modèle mental différent (déclaratif, unidirectional data flow, composants comme fonctions pures). Piège 2 : sauter sur Next.js avant React vanilla. Sans comprendre re-render et hooks, tu craches des bugs en cascade.",
  objectives: [
    "Qu'est-ce que React (lib UI, virtual DOM, déclaratif)",
    "Setup Vite + React + TS",
    "JSX = JS pas HTML (className, htmlFor, expressions {})",
    "Composants fonctionnels typés",
    "Props (passage, destructuring, types, children)",
    "useState (state local, updater function)",
    "useEffect (dépendances, cleanup, pièges)",
    "useRef (ref DOM, valeur mutable sans re-render)",
    "useContext (Provider, consumer)",
    "useMemo + useCallback (quand utiliser, quand NE PAS)",
    "Rendering conditionnel (&&, ternaire, early return)",
    "Listes avec key (stable, unique, pas l'index)",
    "Formulaires contrôlés vs non-contrôlés",
    "React 19 features (Actions, useActionState, useOptimistic, useFormStatus, use())",
    "Rendering lifecycle (pourquoi React re-render)",
    "Règles des hooks (en haut, pas dans conditions)",
    "Custom hooks (useLocalStorage, useDebounce, useFetch)",
  ],
  prerequisites: "Modules 8-13 + TS",
  estimatedHours: 47,
  estimatedWeeks: 3,
  stackAllowed: ["Vite + React 19 + TypeScript + Tailwind"],
  prereqModuleId: "m13-typescript",
  unlockSrsMatureRatio: 80,
};

export const m14Skills: NewSkill[] = [
  { moduleId: M14_ID, slug: "react-concept", label: "React = lib UI, virtual DOM, déclaratif", displayOrder: 1, weight: 1 },
  { moduleId: M14_ID, slug: "vite-react-setup", label: "Setup Vite + React + TS", displayOrder: 2, weight: 1 },
  { moduleId: M14_ID, slug: "jsx", label: "JSX = JS (className, htmlFor, expressions)", displayOrder: 3, weight: 2 },
  { moduleId: M14_ID, slug: "components", label: "Composants fonctionnels typés (React.FC ou function)", displayOrder: 4, weight: 3 },
  { moduleId: M14_ID, slug: "props", label: "Props (passage, destructuring, types, children)", displayOrder: 5, weight: 3 },
  { moduleId: M14_ID, slug: "use-state", label: "useState (updater function obligatoire)", displayOrder: 6, weight: 3 },
  { moduleId: M14_ID, slug: "use-effect", label: "useEffect (déps, cleanup, anti-patterns)", displayOrder: 7, weight: 3 },
  { moduleId: M14_ID, slug: "use-ref", label: "useRef (DOM ref, valeur mutable)", displayOrder: 8, weight: 2 },
  { moduleId: M14_ID, slug: "use-context", label: "useContext (anti prop drilling)", displayOrder: 9, weight: 2 },
  { moduleId: M14_ID, slug: "memo-callback", label: "useMemo/useCallback (quand utiliser, mesurer d'abord)", displayOrder: 10, weight: 2 },
  { moduleId: M14_ID, slug: "conditional-render", label: "Rendering conditionnel (&&, ternaire, early return)", displayOrder: 11, weight: 2 },
  { moduleId: M14_ID, slug: "lists-key", label: "Listes avec key stable (jamais l'index sauf statique)", displayOrder: 12, weight: 3 },
  { moduleId: M14_ID, slug: "forms", label: "Formulaires contrôlés vs non-contrôlés", displayOrder: 13, weight: 2 },
  { moduleId: M14_ID, slug: "react19-actions", label: "React 19 : Actions, useActionState, useFormStatus, useOptimistic, use()", displayOrder: 14, weight: 2 },
  { moduleId: M14_ID, slug: "rerender", label: "Pourquoi React re-render + comment éviter", displayOrder: 15, weight: 3 },
  { moduleId: M14_ID, slug: "hooks-rules", label: "Règles des hooks (haut, pas conditions)", displayOrder: 16, weight: 3 },
  { moduleId: M14_ID, slug: "custom-hooks", label: "Custom hooks (useLocalStorage, useDebounce, useFetch)", displayOrder: 17, weight: 3 },
];

export const m14SkillAxisRules = m14Skills.map((s) => ({ skillSlug: s.slug, axisId: "react", contribution: 100 }));

export const m14Videos: NewVideo[] = [
  {
    moduleId: M14_ID,
    isPrimary: 1,
    title: "React Tutorial Full Course – Beginner to Pro (React 19, 2025)",
    creator: "SuperSimpleDev",
    youtubeId: "TtPXvEcE11E",
    language: "en",
    durationSeconds: 10 * 60 * 60,
    whyThisOne: "Continuité M8. Même créateur, même style ultra-pédagogique. Couvre React 19 + exos pratiques.",
    coversSkills: ["jsx", "components", "props", "use-state", "use-effect"],
    displayOrder: 1,
  },
  {
    moduleId: M14_ID,
    isPrimary: 0,
    title: "React Documentation Officielle (Learn React)",
    creator: "Meta",
    externalUrl: "https://react.dev/learn",
    language: "en",
    whyThisOne: "La meilleure doc de framework, ever. Tutoriels interactifs. À lire en parallèle des vidéos.",
    coversSkills: ["rerender", "hooks-rules", "use-effect"],
    displayOrder: 2,
  },
  {
    moduleId: M14_ID,
    isPrimary: 0,
    title: "You Might Not Need useEffect",
    creator: "react.dev (Meta)",
    externalUrl: "https://react.dev/learn/you-might-not-need-an-effect",
    language: "en",
    whyThisOne: "À LIRE absolument. Anti-patterns useEffect = piège n°1 des juniors React. Réécrit ton mental model.",
    coversSkills: ["use-effect"],
    displayOrder: 3,
  },
];

export const m14Exercises: NewExercise[] = [
  {
    moduleId: M14_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : hooks + re-render + key",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Pourquoi un composant React re-render ?",
        options: [
          "Aléatoirement",
          "Quand son state OU ses props changent, OU son parent re-render",
          "Toutes les secondes",
          "Au scroll",
        ],
        correctIndex: 1,
        explanation: "3 causes : state change (useState setter), props change (parent re-render avec nouvelles props), context change. Memoization (memo, useMemo, useCallback) coupe le 3e cas.",
      },
      {
        question: "`key={index}` dans une liste — piège ?",
        options: [
          "Aucun",
          "Si la liste peut être réordonnée/insérée au milieu, React confond les composants → state lié à la mauvaise ligne",
          "Plus lent",
          "Erreur React",
        ],
        correctIndex: 1,
        explanation: "key sert à identifier un item entre renders. Index = position, pas identité. Si tu supprimes l'item 0, l'item 1 hérite de l'état du 0. Toujours un ID stable.",
      },
      {
        question: "`useEffect(() => { setData(...); }, [data])` — problème ?",
        options: [
          "Aucun",
          "Boucle infinie (setData déclenche re-render → useEffect re-run → setData → ...)",
          "Trop lent",
          "TypeScript bug",
        ],
        correctIndex: 1,
        explanation: "Setter dans useEffect avec sa dep en deps = loop. Mauvais pattern. Souvent : tu cherches à dériver state d'un autre → calcule directement dans le render.",
      },
    ],
    skillSlugs: ["rerender", "lists-key", "use-effect"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M14_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "React Lab — 4 apps React + TS strict",
    statement: `4 mini-apps dans repo \`react-lab\`. Pas de framework UI au début (pas de shadcn/MUI). Tailwind OK.

**App 1 — Todo React**
- Reprendre la todo du M9 en React + TS strict
- Composants : App, TodoList, TodoItem, TodoInput, TodoFilters, TodoStats
- State partagé via useState + useContext
- Custom hook useLocalStorage<T>(key, initial)
- Custom hook useDebounce<T>(value, delay)
- 0 any, transitions CSS fade in/out

**App 2 — Pokemon Explorer**
- PokéAPI : liste paginée 20/page + recherche debounce + page détail
- Custom hook useFetch<T>(url) avec {data, isLoading, error}
- Cache simple en useRef pour pas refetch
- Cleanup fetch via AbortController dans useEffect

**App 3 — Form multi-step**
- 3 étapes : infos perso, adresse, préférences
- Navigation (prev/next), barre progression
- State global via useReducer
- React 19 : useActionState pour submit, useFormStatus pour disabled pendant envoi
- Discriminated union pour les étapes

**App 4 — Canvas Excalidraw mini**
- Outils : pinceau, gomme, formes, texte
- useRef<HTMLCanvasElement> + useEffect pour listeners
- Historique undo/redo (state stack)
- Export PNG (download)

**Critères**
- React 19 + TS strict, 0 any
- ≥ 3 custom hooks
- ≥ 1 useReducer (form)
- ≥ 1 useContext (todo)
- ≥ 1 React 19 Action
- 0 warning React DevTools
- 0 "Maximum update depth exceeded"`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["components", "use-state", "use-effect", "custom-hooks", "react19-actions"],
    passThresholdPct: 100,
    estimatedMinutes: 40 * 60,
    displayOrder: 2,
  },
];
