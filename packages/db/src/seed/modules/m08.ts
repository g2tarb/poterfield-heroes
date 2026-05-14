import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M08_ID = "m08-javascript-fondamental";

export const m08Module: NewModule = {
  id: M08_ID,
  moduleNumber: 8,
  phase: 3,
  title: "JavaScript fondamental",
  subtitle: "Le langage qui domine le web depuis 30 ans. Investis-toi.",
  pourquoi:
    "JS = ton ticket d'entrée pour interactivité, React, Node, Three.js, n8n, Claude API. 'Maîtriser' ne veut pas dire copier-coller Stack Overflow, ça veut dire comprendre types, scope, contexte d'exécution, hoisting, coercion. M8-M12 sont les modules les plus importants de la roadmap.",
  objectives: [
    "Qu'est-ce que JS (interprété, dynamique, faiblement typé)",
    "Exécuter JS (console, <script>, node)",
    "8 types primitifs (string, number, boolean, null, undefined, bigint, symbol, object)",
    "null vs undefined",
    "Opérateurs (arithmétiques, comparaison, logiques, affectation, ternaire)",
    "Coercion (1 + '1' = '11', 1 - '1' = 0) → toujours === pas ==",
    "Structures de contrôle (if/else, switch, ternaire, try/catch)",
    "Boucles (for, while, for...of, for...in, break, continue)",
    "Fonctions (déclaration, expression, arrow, defaults, rest)",
    "Primitives (par valeur) vs objets (par référence)",
    "Strings et méthodes (length, slice, split, replace, template literals)",
    "Numbers et méthodes (toFixed, parseInt, Math.*)",
    "Scopes (global, function, block avec let/const)",
    "var vs let vs const (jamais var en 2026)",
    "Hoisting (var hoisted, let/const TDZ)",
    "Lisibilité (nommage, indentation, séparation)",
  ],
  prerequisites: "Modules 1-7",
  estimatedHours: 33,
  estimatedWeeks: 2,
  stackAllowed: ["Node.js 20", "JS pur (pas de framework, pas de TS)"],
  prereqModuleId: "m07-css-avance-tailwind",
  unlockSrsMatureRatio: 80,
};

export const m08Skills: NewSkill[] = [
  { moduleId: M08_ID, slug: "types-primitifs", label: "8 types primitifs JS", displayOrder: 1, weight: 2 },
  { moduleId: M08_ID, slug: "null-undefined", label: "null vs undefined (quand chacun apparaît)", displayOrder: 2, weight: 2 },
  { moduleId: M08_ID, slug: "coercion", label: "Coercion (== vs === toujours)", displayOrder: 3, weight: 3 },
  { moduleId: M08_ID, slug: "operators", label: "Opérateurs (arithmétiques, comparaison, logiques, ??, ?.)", displayOrder: 4, weight: 2 },
  { moduleId: M08_ID, slug: "control-flow", label: "if/else/switch/ternaire/try-catch", displayOrder: 5, weight: 2 },
  { moduleId: M08_ID, slug: "loops", label: "Boucles (for, while, for...of, for...in)", displayOrder: 6, weight: 2 },
  { moduleId: M08_ID, slug: "functions", label: "Fonctions (decl/expr/arrow, defaults, rest, return)", displayOrder: 7, weight: 3 },
  { moduleId: M08_ID, slug: "value-vs-reference", label: "Primitives par valeur, objets par référence", displayOrder: 8, weight: 3 },
  { moduleId: M08_ID, slug: "strings", label: "Strings (length, slice, split, replace, template literals)", displayOrder: 9, weight: 2 },
  { moduleId: M08_ID, slug: "numbers", label: "Numbers (toFixed, parseInt, Math, NaN)", displayOrder: 10, weight: 1 },
  { moduleId: M08_ID, slug: "scope", label: "Scope (global, function, block)", displayOrder: 11, weight: 3 },
  { moduleId: M08_ID, slug: "var-let-const", label: "var vs let vs const (jamais var en 2026)", displayOrder: 12, weight: 3 },
  { moduleId: M08_ID, slug: "hoisting", label: "Hoisting + TDZ", displayOrder: 13, weight: 2 },
  { moduleId: M08_ID, slug: "truthy-falsy", label: "Truthy/Falsy values", displayOrder: 14, weight: 2 },
];

export const m08SkillAxisRules = m08Skills.map((s) => ({ skillSlug: s.slug, axisId: "javascript", contribution: 100 }));

export const m08Videos: NewVideo[] = [
  {
    moduleId: M08_ID,
    isPrimary: 1,
    title: "JavaScript Tutorial Full Course – Beginner to Pro (sections 1-7)",
    creator: "SuperSimpleDev (Simon Liang)",
    youtubeId: "EerdGm-ehJQ",
    language: "en",
    durationSeconds: 8 * 60 * 60,
    whyThisOne: "Référence anglophone la plus complète et pédagogique. Lenteur et clarté inégalées. Sections 1-7 = ~8h pour ce module.",
    coversSkills: ["types-primitifs", "operators", "control-flow", "loops", "functions"],
    displayOrder: 1,
  },
  {
    moduleId: M08_ID,
    isPrimary: 0,
    title: "Le Tutoriel JavaScript Moderne (FR)",
    creator: "javascript.info",
    externalUrl: "https://fr.javascript.info",
    language: "fr",
    whyThisOne: "THE référence textuelle JS en français. Lis en parallèle des vidéos pour version 'lecture/référence'.",
    coversSkills: ["coercion", "scope", "hoisting"],
    displayOrder: 2,
  },
  {
    moduleId: M08_ID,
    isPrimary: 0,
    title: "== vs === in JavaScript (in 2 minutes)",
    creator: "Fireship",
    language: "en",
    durationSeconds: 2 * 60,
    whyThisOne: "Coercion JS et son chaos ([] == ![] est true). À voir absolument pour comprendre pourquoi ===.",
    coversSkills: ["coercion"],
    displayOrder: 3,
  },
];

export const m08Exercises: NewExercise[] = [
  {
    moduleId: M08_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : types, scope, hoisting",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "`null == undefined` retourne quoi ?",
        options: ["true", "false", "TypeError", "Dépend du navigateur"],
        correctIndex: 0,
        explanation: "Avec == (coercion), null et undefined sont considérés égaux. Avec === (strict), null === undefined est false. Toujours préférer ===.",
      },
      {
        question: "`0.1 + 0.2` vaut quoi en JS ?",
        options: ["0.3", "0.30000000000000004 (float IEEE 754)", "TypeError", "0.3000001"],
        correctIndex: 1,
        explanation: "Les floats IEEE 754 sont approximatifs. Pour de l'argent : stocker en centimes (INTEGER) ou utiliser BigInt/Decimal.",
      },
      {
        question: "`const arr = [1,2,3]; const b = arr; b.push(4);` — que vaut `arr` ?",
        options: ["[1,2,3]", "[1,2,3,4]", "TypeError (const)", "Erreur"],
        correctIndex: 1,
        explanation: "Les objets/arrays sont passés par référence. b et arr pointent vers le même tableau. const empêche la réassignation, pas la mutation. Pour copier : [...arr].",
      },
    ],
    skillSlugs: ["coercion", "value-vs-reference", "var-let-const"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M08_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "javascript",
    title: "5 mini-projets console JS pur",
    statement: `Créer un repo \`js-fundamentals-toolkit\` avec 5 mini-projets en JS pur (Node.js).

1. **fizzbuzz.js** : 1-100, Fizz/Buzz/FizzBuzz. Bonus : paramétrable [[3,"Fizz"],[5,"Buzz"]].
2. **calculatrice.js** : 4 fonctions add/subtract/multiply/divide + calculate(a, op, b). Gérer division/0. Tests 10 cas.
3. **mot-de-passe.js** : validatePassword(p) retourne {valid, errors[]}. Règles : 8+ chars, maj, min, chiffre, spécial.
4. **stats-tableau.js** : getStats(nums) = {min,max,sum,average,median,mode,count}. Sans libs.
5. **juste-prix.js** : nombre aléatoire 1-100, prompt user, "trop grand/petit", compteur essais.

**Critères**
- 0 var (que const/let)
- 0 == (que ===, !==)
- Template literals (pas de concaténation)
- Chaque ligne expliquable de tête
- Stack : Node 20, JS pur, pas de méthodes Module 10 (.map/.filter/.reduce interdits)`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["functions", "control-flow", "loops", "strings"],
    passThresholdPct: 100,
    estimatedMinutes: 22 * 60,
    displayOrder: 2,
  },
];
