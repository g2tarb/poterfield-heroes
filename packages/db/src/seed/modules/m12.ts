import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M12_ID = "m12-javascript-avance";

export const m12Module: NewModule = {
  id: M12_ID,
  moduleNumber: 12,
  phase: 3,
  title: "JavaScript avancé (closures, this, prototypes, patterns)",
  subtitle: "Le rite de passage junior → mid-level. Court mais dense.",
  pourquoi:
    "Tu sais écrire du JS qui marche. Ce module t'apprend POURQUOI ça marche, et surtout pourquoi parfois pas. Closures, this, prototypes : les mécaniques sous le capot que tout senior maîtrise et que les juniors ignorent. Sans ça : tu galéreras sur les bugs subtils de React (hooks reposent sur closures), tu rateras 80% des questions d'entretien.",
  objectives: [
    "Execution context (création + exécution)",
    "Scope chain (lexical scoping)",
    "Hoisting (var hoisted, let/const TDZ, function hoisted)",
    "Closures (fonction capture variables du scope englobant)",
    "Patterns closures : counter, factory, module, currying, memoization",
    "this dans 5 contextes (global, method, arrow, new, call/apply/bind)",
    "Arrow this lexical vs function this dynamique",
    "Prototypes (__proto__, prototype, chain, Object.create)",
    "Classes ES6 = sucre sur prototypes",
    "Héritage prototypal (extends, super, composition vs héritage)",
    "Memoization, retry, debounce/throttle, queue de tâches",
    "Microtasks vs macrotasks (queueMicrotask, requestIdleCallback)",
    "Garbage collection + memory leaks",
    "Pure functions, immutability, higher-order, composition, currying",
    "ES2022+ : #private fields, top-level await, error.cause",
    "Lire code d'une lib npm et comprendre",
  ],
  prerequisites: "Modules 8-11 à 100%",
  estimatedHours: 26,
  estimatedWeeks: 2,
  stackAllowed: ["Node 20 + JS pur"],
  prereqModuleId: "m11-javascript-async",
  unlockSrsMatureRatio: 80,
};

export const m12Skills: NewSkill[] = [
  { moduleId: M12_ID, slug: "execution-context", label: "Execution context (call stack)", displayOrder: 1, weight: 2 },
  { moduleId: M12_ID, slug: "lexical-scope", label: "Lexical scoping + scope chain", displayOrder: 2, weight: 3 },
  { moduleId: M12_ID, slug: "hoisting", label: "Hoisting (var, function, let/const TDZ)", displayOrder: 3, weight: 2 },
  { moduleId: M12_ID, slug: "closures", label: "Closures (concept + usages)", displayOrder: 4, weight: 3 },
  { moduleId: M12_ID, slug: "closure-patterns", label: "Patterns : counter, factory, module, currying", displayOrder: 5, weight: 2 },
  { moduleId: M12_ID, slug: "this-contexts", label: "this dans 5 contextes (global, method, arrow, new, call/bind)", displayOrder: 6, weight: 3 },
  { moduleId: M12_ID, slug: "arrow-vs-function", label: "Arrow this lexical vs function this dynamique", displayOrder: 7, weight: 3 },
  { moduleId: M12_ID, slug: "prototypes", label: "Prototypes (__proto__, prototype, chain)", displayOrder: 8, weight: 3 },
  { moduleId: M12_ID, slug: "classes-prototypes", label: "Classes ES6 = sucre sur prototypes", displayOrder: 9, weight: 2 },
  { moduleId: M12_ID, slug: "inheritance", label: "Héritage (extends, super, composition vs héritage)", displayOrder: 10, weight: 2 },
  { moduleId: M12_ID, slug: "currying", label: "Currying + partial application", displayOrder: 11, weight: 1 },
  { moduleId: M12_ID, slug: "memoization", label: "Memoization + caching", displayOrder: 12, weight: 2 },
  { moduleId: M12_ID, slug: "gc", label: "Garbage collection + memory leaks", displayOrder: 13, weight: 1 },
  { moduleId: M12_ID, slug: "functional", label: "Pure functions, immutability, higher-order, composition", displayOrder: 14, weight: 3 },
  { moduleId: M12_ID, slug: "es2022", label: "ES2022+ : #private, top-level await, error.cause", displayOrder: 15, weight: 1 },
  { moduleId: M12_ID, slug: "read-libs", label: "Lire le code d'une lib npm", displayOrder: 16, weight: 1 },
];

export const m12SkillAxisRules = m12Skills.map((s) => ({ skillSlug: s.slug, axisId: "javascript", contribution: 100 }));

export const m12Videos: NewVideo[] = [
  {
    moduleId: M12_ID,
    isPrimary: 1,
    title: "JavaScript: The Hard Parts (Closures, Promises, async/await)",
    creator: "Will Sentance (Frontend Masters preview)",
    language: "en",
    durationSeconds: 8 * 60 * 60,
    whyThisOne: "LA référence pour comprendre vraiment les internals JS. Closures, this, prototypes en profondeur.",
    coversSkills: ["closures", "this-contexts", "prototypes"],
    displayOrder: 1,
  },
  {
    moduleId: M12_ID,
    isPrimary: 0,
    title: "JavaScript Closures Tutorial (Explained in detail)",
    creator: "Web Dev Simplified",
    language: "en",
    durationSeconds: 12 * 60,
    whyThisOne: "Closures en 12 min clair. À revoir 2-3 fois pour ancrer.",
    coversSkills: ["closures", "closure-patterns"],
    displayOrder: 2,
  },
  {
    moduleId: M12_ID,
    isPrimary: 0,
    title: "You Don't Know JS Yet (gratuit GitHub)",
    creator: "Kyle Simpson",
    externalUrl: "https://github.com/getify/You-Dont-Know-JS",
    language: "en",
    whyThisOne: "La bible absolue. Lis 'Scope & Closures' et 'this & Object Prototypes' à fond. C'est le contenu qui te transforme.",
    coversSkills: ["closures", "this-contexts", "prototypes", "lexical-scope"],
    displayOrder: 3,
  },
];

export const m12Exercises: NewExercise[] = [
  {
    moduleId: M12_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : closures + this + prototypes",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 100)` affiche quoi ?",
        options: ["0 1 2", "3 3 3", "0 1 2 3", "Erreur"],
        correctIndex: 1,
        explanation: "var = scope fonction, partagé. La closure capture la VARIABLE (pas la valeur). Quand setTimeout exécute, i vaut déjà 3. Avec let → 0 1 2 (let crée nouveau scope par itération).",
      },
      {
        question: "`obj.method()` vs `const fn = obj.method; fn()` — que vaut `this` ?",
        options: [
          "obj dans les 2 cas",
          "obj puis undefined/window (this perdu)",
          "TypeError",
          "Toujours window",
        ],
        correctIndex: 1,
        explanation: "this dépend de COMMENT la fonction est appelée. obj.method() → this = obj. fn() seul → this = undefined (strict) ou window. Pour préserver : .bind(obj) ou arrow function.",
      },
      {
        question: "Différence `__proto__` (sur instance) vs `prototype` (sur Function) ?",
        options: [
          "Synonymes",
          "instance.__proto__ === Constructor.prototype. prototype = sur fonction, défini les propriétés héritées. __proto__ = pointer instance vers son prototype.",
          "__proto__ est obsolète",
          "prototype n'existe pas",
        ],
        correctIndex: 1,
        explanation: "Function.prototype = template des instances. instance.__proto__ pointe vers ce template. La résolution des méthodes remonte cette chaîne (instance → Constructor.prototype → Object.prototype → null).",
      },
    ],
    skillSlugs: ["closures", "this-contexts", "prototypes"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M12_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "javascript",
    title: "JS Internals — réimplémente 8 utilitaires (myMap, myBind, etc.)",
    statement: `Pour ancrer la compréhension profonde, réimplémente à la main des fonctions/patterns que les libs te donnent gratuitement. Classique d'entretien senior.

**Les 8 défis**

1. **myMap, myFilter, myReduce** sur Array.prototype (avec thisArg, value/index/array)
2. **myBind** sur Function.prototype (partial application + new Bound())
3. **debounce + throttle** canoniques (.cancel(), .flush(), options leading/trailing)
4. **memoize(fn)** avec Map + clé sérialisée des args (bonus: TTL)
5. **EventEmitter** : on/off/emit/once + Map de listeners
6. **deepClone** avec WeakMap pour références circulaires (compare à structuredClone)
7. **pipe + compose** : pipe(f,g,h)(x) = h(g(f(x))). Bonus : asyncPipe avec Promises
8. **PromiseQueue** : new PromiseQueue(3), queue.add(fn) limite à 3 promises en parallèle

**Critères**
- 0 dep externe, tout en JS pur
- Compatibilité avec les versions natives (mêmes inputs → mêmes outputs)
- README qui explique pour chaque défi : closures utilisées, this, prototypes
- Tu peux refaire chaque défi de mémoire 1 semaine après`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["closures", "closure-patterns", "memoization", "functional"],
    passThresholdPct: 100,
    estimatedMinutes: 28 * 60,
    displayOrder: 2,
  },
];
