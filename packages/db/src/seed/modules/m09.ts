import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M09_ID = "m09-javascript-dom";

export const m09Module: NewModule = {
  id: M09_ID,
  moduleNumber: 9,
  phase: 3,
  title: "JavaScript & le DOM (interactivité)",
  subtitle: "La vraie magie du web : du HTML statique → l'app dynamique.",
  pourquoi:
    "Le DOM est l'API qui te permet de lire et modifier ton HTML depuis JS. Tout React, Vue, Svelte que tu utiliseras repose sur le DOM en sous-marin. Comprendre ça en pur JS d'abord évite de devenir framework-dépendant incapable de débugger.",
  objectives: [
    "Qu'est-ce que le DOM (arborescent, document)",
    "Node vs Element vs Text node",
    "Sélection (getElementById, querySelector, querySelectorAll)",
    "HTMLCollection (live) vs NodeList (static)",
    "Modifier contenu (textContent, innerHTML risque XSS, innerText)",
    "Attributs (setAttribute, propriétés directes)",
    "Classes CSS (classList add/remove/toggle/contains)",
    "Navigation arbre (parentElement, children, siblings)",
    "Créer/ajouter/supprimer (createElement, append, remove)",
    "Events (addEventListener, types courants)",
    "Event object (target vs currentTarget, preventDefault, stopPropagation)",
    "Bubbling/capturing + délégation d'événements",
    "Formulaires (value, checked, submit, validation HTML5)",
    "localStorage + sessionStorage (JSON.stringify/parse)",
    "Chargement (load, DOMContentLoaded, defer)",
  ],
  prerequisites: "Modules 5 (HTML), 6 (CSS), 8 (JS de base)",
  estimatedHours: 28,
  estimatedWeeks: 1,
  stackAllowed: ["HTML + CSS + JS pur (pas de framework)"],
  prereqModuleId: "m08-javascript-fondamental",
  unlockSrsMatureRatio: 80,
};

export const m09Skills: NewSkill[] = [
  { moduleId: M09_ID, slug: "dom-tree", label: "Le DOM comme arbre (document, nodes)", displayOrder: 1, weight: 2 },
  { moduleId: M09_ID, slug: "selectors-js", label: "querySelector, getElementById, querySelectorAll", displayOrder: 2, weight: 3 },
  { moduleId: M09_ID, slug: "content-modification", label: "textContent vs innerHTML (XSS) vs innerText", displayOrder: 3, weight: 3 },
  { moduleId: M09_ID, slug: "attributes", label: "Manipuler attributs (setAttribute, props directes)", displayOrder: 4, weight: 2 },
  { moduleId: M09_ID, slug: "classlist", label: "classList (add, remove, toggle, contains)", displayOrder: 5, weight: 2 },
  { moduleId: M09_ID, slug: "tree-nav", label: "Navigation arbre (parent, children, siblings)", displayOrder: 6, weight: 1 },
  { moduleId: M09_ID, slug: "create-insert-remove", label: "createElement, append, remove, insertBefore", displayOrder: 7, weight: 2 },
  { moduleId: M09_ID, slug: "events", label: "addEventListener + types (click, submit, input, keydown)", displayOrder: 8, weight: 3 },
  { moduleId: M09_ID, slug: "event-object", label: "event.target vs currentTarget, preventDefault, stopPropagation", displayOrder: 9, weight: 3 },
  { moduleId: M09_ID, slug: "bubbling", label: "Bubbling, capturing, phases d'un événement", displayOrder: 10, weight: 2 },
  { moduleId: M09_ID, slug: "delegation", label: "Délégation d'événements (un listener pour N enfants)", displayOrder: 11, weight: 3 },
  { moduleId: M09_ID, slug: "forms", label: "Formulaires (FormData, value, validation, submit)", displayOrder: 12, weight: 2 },
  { moduleId: M09_ID, slug: "storage", label: "localStorage + sessionStorage + JSON", displayOrder: 13, weight: 2 },
  { moduleId: M09_ID, slug: "script-loading", label: "defer, DOMContentLoaded, ordre de chargement", displayOrder: 14, weight: 1 },
];

export const m09SkillAxisRules = m09Skills.map((s) => ({ skillSlug: s.slug, axisId: "javascript", contribution: 100 }));

export const m09Videos: NewVideo[] = [
  {
    moduleId: M09_ID,
    isPrimary: 1,
    title: "JavaScript Tutorial Full Course (sections 9-10 : DOM)",
    creator: "SuperSimpleDev",
    youtubeId: "EerdGm-ehJQ",
    language: "en",
    durationSeconds: 3 * 60 * 60,
    whyThisOne: "Continuité avec M8. Le DOM avec projets concrets (calculatrice, todo) qui pratiquent immédiatement.",
    coversSkills: ["dom-tree", "selectors-js", "events", "forms"],
    displayOrder: 1,
  },
  {
    moduleId: M09_ID,
    isPrimary: 0,
    title: "Event Delegation in JavaScript",
    creator: "Web Dev Simplified",
    language: "en",
    whyThisOne: "Délégation = pro pour gérer 100 éléments dynamiques avec UN SEUL listener. SuperSimpleDev effleure.",
    coversSkills: ["delegation", "bubbling"],
    displayOrder: 2,
  },
  {
    moduleId: M09_ID,
    isPrimary: 0,
    title: "innerHTML vs textContent vs innerText",
    creator: "WebDev YouTube",
    language: "en",
    whyThisOne: "Pourquoi innerHTML est dangereux (XSS). Crucial avant React où on apprend que c'est auto-escapé.",
    coversSkills: ["content-modification"],
    displayOrder: 3,
  },
];

export const m09Exercises: NewExercise[] = [
  {
    moduleId: M09_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : DOM + events + délégation",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Différence entre `textContent` et `innerHTML` ?",
        options: [
          "Identiques",
          "textContent = texte brut sécurisé. innerHTML = interprète HTML, vulnérable XSS avec contenu user.",
          "innerHTML est obsolète",
          "textContent est plus lent",
        ],
        correctIndex: 1,
        explanation: "innerHTML interprète : si tu mets du contenu utilisateur dedans (<script>...) → XSS. Toujours textContent sauf besoin avéré + sanitization (DOMPurify).",
      },
      {
        question: "Délégation d'événements = ?",
        options: [
          "Un listener par bouton",
          "UN listener sur le parent qui filtre via event.target.matches('.btn') → gère ajouts dynamiques + perf",
          "Synonyme de event bubbling",
          "Pas utile",
        ],
        correctIndex: 1,
        explanation: "Au lieu de 100 listeners sur 100 buttons, 1 listener sur ul parent. Marche aussi pour éléments ajoutés après mount. Pattern obligatoire pour listes dynamiques.",
      },
    ],
    skillSlugs: ["content-modification", "delegation"],
    passThresholdPct: 80,
    estimatedMinutes: 8,
    displayOrder: 1,
  },
  {
    moduleId: M09_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "javascript",
    title: "Le Quartet — 4 mini-apps DOM (todo, calc, form, memory)",
    statement: `4 mini-applications interactives en vanilla JS pur (aucun framework). Chacune dans son dossier dans le repo \`dom-quartet\`.

**App 1 — Todo moderne**
- Add/edit/delete tâches avec localStorage
- 3 filtres (Toutes/Actives/Terminées)
- Délégation d'événements (un seul listener sur <ul>)
- Animation CSS fade-in/out

**App 2 — Calculatrice graphique**
- UI iOS-like, support clavier (keydown)
- Pas de eval() (sécu) → logique calcul à la main
- Gérer div/0, chiffres trop longs (notation sci.)

**App 3 — Formulaire inscription validation temps réel**
- Validation live sur chaque input (event input)
- Email regex, password force (faible/moyen/fort)
- Submit disabled tant que pas valide

**App 4 — Memory 4×4**
- Algo Fisher-Yates pour mélanger 8 paires
- Animation flip 3D rotate
- Chrono + compteur coups
- Modal victoire + best score localStorage

**Critères**
- 0 jQuery, 0 framework, 0 lodash
- 0 var
- Délégation d'événements (todo + memory)
- localStorage (todo + memory)
- Déployé sur GitHub Pages`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["selectors-js", "events", "delegation", "storage", "create-insert-remove"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
