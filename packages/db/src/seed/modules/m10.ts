import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M10_ID = "m10-javascript-moderne-es6";

export const m10Module: NewModule = {
  id: M10_ID,
  moduleNumber: 10,
  phase: 3,
  title: "JavaScript moderne (ES6+) & méthodes de tableaux",
  subtitle: "Sans ES6+ tu ne peux pas lire ni écrire du code 2026. Fondation du reste.",
  pourquoi:
    "ES6 a transformé JS en langage utilisable. Avec ES6+ tu écris 3x plus court, plus expressif, plus sûr. Toute base de code moderne (React, Vue, Next, Node) repose à 100% sur cette syntaxe. Sans la maîtriser, tu ne peux pas lire le code 2026. C'est aussi le moment où tu domines tableaux et objets : map, filter, reduce, destructuring, spread/rest. 80% de ce que fait un dev frontend.",
  objectives: [
    "Arrow functions (concise, body implicite, this lexical)",
    "Template literals (multi-lignes, expressions)",
    "Paramètres par défaut",
    "Rest operator (...args collecte)",
    "Spread operator (...arr déploie)",
    "Destructuring d'objets (renommage, defaults, nested)",
    "Destructuring de tableaux + skip",
    "Shorthand properties ({name, age})",
    "Méthodes tableaux essentielles (forEach, map, filter, reduce, find, findIndex, some, every, includes, flat, flatMap)",
    "Méthodes mutantes vs non-mutantes (sort vs toSorted, etc.)",
    "Méthodes objets (Object.keys/values/entries/fromEntries)",
    "Modules ES (export/import, named vs default)",
    "CommonJS vs ESM",
    "Classes ES6 (constructor, héritage, getters, static, #private)",
    "Opérateurs modernes (??, ?., ??=, ||=, &&=)",
    "Map, Set, WeakMap, WeakSet (quand utiliser)",
  ],
  prerequisites: "Modules 8 et 9",
  estimatedHours: 30,
  estimatedWeeks: 2,
  stackAllowed: ["JS ES6+ pur", "Vite optionnel", "Pas de lodash, tout natif"],
  prereqModuleId: "m09-javascript-dom",
  unlockSrsMatureRatio: 80,
};

export const m10Skills: NewSkill[] = [
  { moduleId: M10_ID, slug: "arrow-functions", label: "Arrow functions (concise, this lexical)", displayOrder: 1, weight: 3 },
  { moduleId: M10_ID, slug: "template-literals", label: "Template literals (multi-lignes, expressions)", displayOrder: 2, weight: 2 },
  { moduleId: M10_ID, slug: "defaults-rest", label: "Defaults + rest parameters (...args)", displayOrder: 3, weight: 2 },
  { moduleId: M10_ID, slug: "spread", label: "Spread operator (...arr, ...obj)", displayOrder: 4, weight: 3 },
  { moduleId: M10_ID, slug: "destructuring-obj", label: "Destructuring d'objets (renommage, defaults, nested)", displayOrder: 5, weight: 3 },
  { moduleId: M10_ID, slug: "destructuring-arr", label: "Destructuring de tableaux + skip", displayOrder: 6, weight: 2 },
  { moduleId: M10_ID, slug: "map-filter-reduce", label: "map / filter / reduce maîtrisés", displayOrder: 7, weight: 3 },
  { moduleId: M10_ID, slug: "find-some-every", label: "find / findIndex / some / every / includes", displayOrder: 8, weight: 2 },
  { moduleId: M10_ID, slug: "flat-flatmap", label: "flat, flatMap, toSorted (ES2023 immutables)", displayOrder: 9, weight: 1 },
  { moduleId: M10_ID, slug: "mutating-vs-not", label: "Mutating (sort, splice, push) vs non-mutating (map, filter)", displayOrder: 10, weight: 3 },
  { moduleId: M10_ID, slug: "object-methods", label: "Object.keys / values / entries / fromEntries", displayOrder: 11, weight: 2 },
  { moduleId: M10_ID, slug: "modules-es", label: "Modules ES (export/import, named vs default)", displayOrder: 12, weight: 3 },
  { moduleId: M10_ID, slug: "cjs-vs-esm", label: "CommonJS vs ESM", displayOrder: 13, weight: 1 },
  { moduleId: M10_ID, slug: "classes-es6", label: "Classes ES6 (constructor, extends, super, #private)", displayOrder: 14, weight: 2 },
  { moduleId: M10_ID, slug: "modern-operators", label: "?? optional chaining ?. logical assignment", displayOrder: 15, weight: 3 },
  { moduleId: M10_ID, slug: "map-set", label: "Map, Set, WeakMap, WeakSet", displayOrder: 16, weight: 1 },
];

export const m10SkillAxisRules = m10Skills.map((s) => ({ skillSlug: s.slug, axisId: "javascript", contribution: 100 }));

export const m10Videos: NewVideo[] = [
  {
    moduleId: M10_ID,
    isPrimary: 1,
    title: "JavaScript Tutorial Full Course (sections 11-12 : Arrays + Advanced Functions)",
    creator: "SuperSimpleDev",
    youtubeId: "EerdGm-ehJQ",
    language: "en",
    durationSeconds: 6 * 60 * 60,
    whyThisOne: "Continuité. Arrow functions, callbacks, méthodes tableaux en profondeur avec exos.",
    coversSkills: ["arrow-functions", "map-filter-reduce", "destructuring-obj", "destructuring-arr"],
    displayOrder: 1,
  },
  {
    moduleId: M10_ID,
    isPrimary: 0,
    title: "JavaScript Array Methods (11 méthodes en 11 min)",
    creator: "Fireship",
    language: "en",
    durationSeconds: 11 * 60,
    whyThisOne: "11 méthodes essentielles condensées. Format dense, à revoir 3-4 fois pour ancrer.",
    coversSkills: ["map-filter-reduce", "find-some-every", "flat-flatmap"],
    displayOrder: 2,
  },
  {
    moduleId: M10_ID,
    isPrimary: 0,
    title: "Reduce Explained Step by Step",
    creator: "Web Dev Simplified",
    language: "en",
    whyThisOne: "reduce = LA méthode la plus puissante mais la plus mal comprise. À regarder 2 fois.",
    coversSkills: ["map-filter-reduce"],
    displayOrder: 3,
  },
  {
    moduleId: M10_ID,
    isPrimary: 0,
    title: "Optional Chaining and Nullish Coalescing",
    creator: "Fireship",
    language: "en",
    whyThisOne: "?? et ?. te font gagner 30% de code par rapport aux vérifications manuelles.",
    coversSkills: ["modern-operators"],
    displayOrder: 4,
  },
];

export const m10Exercises: NewExercise[] = [
  {
    moduleId: M10_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : ES6+ + array methods",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Différence entre `map` et `forEach` ?",
        options: [
          "Aucune",
          "`map` retourne un nouveau tableau transformé. `forEach` ne retourne rien (juste side-effects).",
          "forEach est plus rapide",
          "map est obsolète",
        ],
        correctIndex: 1,
        explanation: "map = transformation pure (input → output array). forEach = boucle pour side-effect (console.log, mutations externes). Confondre = code cassé.",
      },
      {
        question: "`?? ` vs `||` ?",
        options: [
          "Identiques",
          "|| fallback sur tout falsy (0, '', false). ?? fallback uniquement sur null/undefined.",
          "?? est plus rapide",
          "|| est obsolète",
        ],
        correctIndex: 1,
        explanation: "`count || 10` retourne 10 même si count vaut 0 (bug). `count ?? 10` retourne 0 (correct). ?? quand zero/empty string sont des valeurs valides.",
      },
      {
        question: "`[1,2,3].sort()` retourne quoi ? Et `arr` après ?",
        options: [
          "Retourne nouveau tableau, arr inchangé",
          "Mute arr ET retourne arr (la même réf)",
          "TypeError",
          "Retourne undefined",
        ],
        correctIndex: 1,
        explanation: "sort() MUTE le tableau original ET retourne la même réf. Préférer [...arr].sort() ou arr.toSorted() (ES2023) pour ne pas muter.",
      },
    ],
    skillSlugs: ["map-filter-reduce", "modern-operators", "mutating-vs-not"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M10_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "javascript",
    title: "Data Cruncher — manipulation pure de 300 users",
    statement: `Mini-app qui charge un JSON de 300 utilisateurs et permet filtrer/trier/agréger via UI. Le but : map/filter/reduce intensifs.

**Setup**
- Vite + modules ES (\`<script type="module">\`)
- 300 users : id, firstName, lastName, email, age, country, gender, salary, skills[], isActive, joinedAt
- Structure modulaire : data.js, filters.js, stats.js, render.js, user.js (class)

**Features**
- Filtres combinables : search texte, genre, tranche d'âge, pays multi, compétences, actif only
- Tris : nom, âge, salaire, date inscription
- Dashboard stats : count, age min/max/avg/median, salaire total/avg, top 5 pays, top 5 skills, répartition genre %, actifs vs inactifs
- Class User avec methods getFullName, isAdult, monthlySalary, static fromJson
- Export JSON + CSV (Blob + URL.createObjectURL)
- Persistance filtres en localStorage

**Critères**
- 0 boucle for classique (que map/filter/reduce/forEach/find)
- 0 variable intermédiaire pour stats (que reduce)
- Au moins 5 destructurings différents
- Au moins 5 spread operators
- Au moins 3 optional chaining (?.) ou nullish (??)
- 0 lodash, tout natif`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["map-filter-reduce", "destructuring-obj", "spread", "classes-es6", "modules-es"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
