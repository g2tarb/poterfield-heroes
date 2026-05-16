import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M13_ID = "m13-typescript";

export const m13Module: NewModule = {
  id: M13_ID,
  moduleNumber: 13,
  phase: 4,
  title: "TypeScript",
  subtitle: "90% des offres frontend l'exigent. Sans TS strict, tu ne peux pas lire le code 2026.",
  pourquoi:
    "En 2026, JS pur en projet sérieux = rare. TS domine. 90% offres frontend l'exigent. Les bugs se voient à l'écriture, IDE brillant, code auto-documenté. Piège : croire que TS = ': string'. Non, système de types complet (generics, unions, narrowing, mapped, conditional). Piège 2 : `any` partout = faux TS, bugs reviennent.",
  objectives: [
    "Superset de JS, compilation, vérification statique (compile-time, pas runtime)",
    "Setup tsconfig.json (target, module, strict)",
    "Types primitifs (string, number, boolean, null, undefined, bigint, symbol, void, never)",
    "Types complexes (Array, tuple, objet, fonction)",
    "Interfaces vs type aliases",
    "Union (|) et intersection (&)",
    "Literal types ('success' | 'error')",
    "Type narrowing (typeof, instanceof, in, predicates)",
    "any vs unknown vs never",
    "Generics + contraintes (T extends, defaults)",
    "Utility types (Partial, Pick, Omit, Record, Parameters, ReturnType, Awaited, NonNullable)",
    "Types avancés (conditional, mapped, template literal)",
    "keyof, typeof, as const",
    "TS dans projet React (Vite + TS)",
    "Lire types d'une lib npm + publier les siens",
    "ESLint + TS strict mode",
  ],
  prerequisites: "Modules 8-12 à 100%",
  estimatedHours: 30,
  estimatedWeeks: 2,
  stackAllowed: ["TypeScript 5+", "Vite + TS"],
  prereqModuleId: "m12-javascript-avance",
  unlockSrsMatureRatio: 80,
};

export const m13Skills: NewSkill[] = [
  { moduleId: M13_ID, slug: "what-is-ts", label: "TS = superset de JS, types statiques compile-time", displayOrder: 1, weight: 1 },
  { moduleId: M13_ID, slug: "tsconfig", label: "tsconfig.json (target, module, strict)", displayOrder: 2, weight: 2 },
  { moduleId: M13_ID, slug: "primitives", label: "Types primitifs + void + never", displayOrder: 3, weight: 2 },
  { moduleId: M13_ID, slug: "complex", label: "Array<T>, tuples, objets typés, fonctions", displayOrder: 4, weight: 2 },
  { moduleId: M13_ID, slug: "interface-vs-type", label: "interface vs type alias (quand quoi)", displayOrder: 5, weight: 2 },
  { moduleId: M13_ID, slug: "union-intersection", label: "Union (|) et intersection (&)", displayOrder: 6, weight: 3 },
  { moduleId: M13_ID, slug: "literal-types", label: "Literal types ('success' | 'error')", displayOrder: 7, weight: 2 },
  { moduleId: M13_ID, slug: "narrowing", label: "Type narrowing (typeof, in, predicates, discriminated unions)", displayOrder: 8, weight: 3 },
  { moduleId: M13_ID, slug: "any-unknown-never", label: "any vs unknown vs never", displayOrder: 9, weight: 3 },
  { moduleId: M13_ID, slug: "generics", label: "Generics + contraintes (T extends)", displayOrder: 10, weight: 3 },
  { moduleId: M13_ID, slug: "utility-types", label: "Partial, Pick, Omit, Record, Parameters, ReturnType", displayOrder: 11, weight: 3 },
  { moduleId: M13_ID, slug: "advanced-types", label: "Conditional, mapped, template literal types", displayOrder: 12, weight: 1 },
  { moduleId: M13_ID, slug: "keyof-typeof", label: "keyof, typeof, as const", displayOrder: 13, weight: 2 },
  { moduleId: M13_ID, slug: "ts-react", label: "TS dans projet React (Vite + TS template)", displayOrder: 14, weight: 2 },
  { moduleId: M13_ID, slug: "lib-types", label: "Lire types lib npm + publier les siens (.d.ts)", displayOrder: 15, weight: 1 },
  { moduleId: M13_ID, slug: "strict-mode", label: "ESLint + TS strict + noUncheckedIndexedAccess", displayOrder: 16, weight: 2 },
];

export const m13SkillAxisRules = m13Skills.map((s) => ({ skillSlug: s.slug, axisId: "typescript", contribution: 100 }));

export const m13Videos: NewVideo[] = [
  {
    moduleId: M13_ID,
    isPrimary: 1,
    title: "TypeScript Full Course – From Beginner to Advanced",
    creator: "ColorCode",
    youtubeId: "H91aqUHn8sE",
    language: "en",
    durationSeconds: 3 * 60 * 60 + 50 * 60,
    whyThisOne: "Structure claire : types primitifs → generics → utility types → projet final.",
    coversSkills: ["primitives", "complex", "generics", "utility-types"],
    displayOrder: 1,
  },
  {
    moduleId: M13_ID,
    isPrimary: 0,
    title: "Total TypeScript Tips",
    creator: "Matt Pocock (YouTube)",
    externalUrl: "https://www.youtube.com/@mattpocockuk",
    language: "en",
    whyThisOne: "LA référence TS du moment. Patterns avancés en 2-5 min : as const, satisfies, generics avancés.",
    coversSkills: ["advanced-types", "keyof-typeof"],
    displayOrder: 2,
  },
  {
    moduleId: M13_ID,
    isPrimary: 0,
    title: "TypeScript Generics Workshop (interactif gratuit)",
    creator: "Total TypeScript",
    externalUrl: "https://github.com/total-typescript/typescript-generics-workshop",
    language: "en",
    durationSeconds: 10 * 60 * 60,
    whyThisOne: "OBLIGATOIRE. Meilleure ressource gratuite mondiale sur generics. Exercices avec tests.",
    coversSkills: ["generics"],
    displayOrder: 3,
  },
];

export const m13Exercises: NewExercise[] = [
  {
    moduleId: M13_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : any/unknown, generics, utility types",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "`any` vs `unknown` — lequel est sûr ?",
        options: [
          "any (plus flexible)",
          "unknown (impossible à utiliser sans narrow → sécurisé)",
          "Identiques",
          "never",
        ],
        correctIndex: 1,
        explanation: "any coupe le typage (trahison de TS). unknown force le narrowing avant usage. Préférer toujours unknown + narrow.",
      },
      {
        question: "Que fait `Pick<User, 'id' | 'name'>` ?",
        options: [
          "Supprime id et name",
          "Crée un type avec uniquement id et name de User",
          "Convertit en string",
          "Erreur de syntaxe",
        ],
        correctIndex: 1,
        explanation: "Pick = sélectionne des clés. Omit = inverse (toutes sauf). Partial = toutes optionnelles. Required = toutes obligatoires. Record<K,V> = { [k]: V }.",
      },
      {
        question: "Discriminated union — pourquoi puissant ?",
        options: [
          "Aucun avantage",
          "TS narrow auto avec switch sur le champ discriminant (type)",
          "Plus rapide",
          "Synonyme d'union",
        ],
        correctIndex: 1,
        explanation: "`type Action = {kind:'a'} | {kind:'b'; value:number}` + `switch(action.kind)` → TS connaît value uniquement dans le case 'b'. Exhaustiveness check gratuit.",
      },
    ],
    skillSlugs: ["any-unknown-never", "utility-types", "narrowing"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M13_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "TypeScript Toolkit (Data Cruncher TS + lib tiny-utils + type challenges)",
    statement: `Trois sous-projets pour ancrer TypeScript.

**A. Data Cruncher TS** (refonte du M10)
- vanilla-ts template Vite, tsconfig strict + noUncheckedIndexedAccess
- Types/interfaces : User, Filter, SortKey, etc. — literal unions
- class User avec types params + return
- Fonctions stats typées avec generics
- 0 any dans tout le code

**B. lib npm tiny-utils**
- Reprendre 5 utilitaires M12 (debounce, throttle, retry, memoize, pipe) typés TS
- Generics partout (Parameters<T>, ReturnType<T>)
- Configurer package.json pour publier types (.d.ts)
- Tests Vitest pour chaque
- Bonus : publier sur npm (@tonpseudo/tiny-utils)

**C. Type Challenges**
- 5 challenges Easy + 3 Medium sur github.com/type-challenges
- Bonus : 1 Hard

**Critères**
- Mode strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes
- 0 any dans Data Cruncher (sauf docs)
- tiny-utils publie ses types (test : import dans autre projet → autocomplete)
- ≥ 5 utility types utilisés`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["generics", "utility-types", "narrowing", "strict-mode"],
    passThresholdPct: 100,
    estimatedMinutes: 35 * 60,
    displayOrder: 2,
  },
];
