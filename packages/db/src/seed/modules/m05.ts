import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content.js";

export const M05_ID = "m05-html5";

export const m05Module: NewModule = {
  id: M05_ID,
  moduleNumber: 5,
  phase: 2,
  title: "HTML5 (sémantique, formulaires, accessibilité)",
  subtitle: "Le squelette. Si tu le bâcles, ton CSS et JS deviennent un cauchemar.",
  pourquoi:
    "HTML est le squelette de toute page web. Sans HTML solide, ton CSS sera un cauchemar, ton JS fragile, ton SEO catastrophique, ton site inaccessible aux 15% en situation de handicap. Le piège : croire que HTML c'est 'facile' et le bâcler.",
  objectives: [
    "Structure HTML5 (DOCTYPE, html lang, head, body)",
    "Balises sémantiques (header, nav, main, section, article, aside, footer)",
    "Hiérarchie des titres (h1-h6, un seul h1)",
    "Block vs inline vs inline-block",
    "Formulaire complet (form, input, select, textarea, label, fieldset)",
    "Types d'inputs HTML5 (text, email, password, number, date, file, range, color)",
    "Attributs de validation (required, pattern, min/max, minlength/maxlength)",
    "Médias : img (alt, srcset), video, audio, picture, figure",
    "Tableaux corrects (table, thead, tbody, tr, th, td, caption, scope)",
    "Balises de contenu (a, strong, em, small, mark, time, address, blockquote)",
    "Meta SEO (title, description, viewport, Open Graph, Twitter Cards)",
    "Accessibilité (ARIA, alt text, focus, navigation clavier)",
    "Validation W3C",
    "DOM comme représentation arborescente",
  ],
  prerequisites: "Modules 1-4",
  estimatedHours: 26,
  estimatedWeeks: 2,
  stackAllowed: ["HTML5 pur (pas de CSS, pas de JS)"],
  prereqModuleId: "m04-env-dev",
  unlockSrsMatureRatio: 80,
};

export const m05Skills: NewSkill[] = [
  { moduleId: M05_ID, slug: "structure", label: "Structure HTML5 (DOCTYPE, html lang, head, body)", displayOrder: 1, weight: 1 },
  { moduleId: M05_ID, slug: "semantic", label: "Balises sémantiques (header, nav, main, section, article, aside, footer)", displayOrder: 2, weight: 3 },
  { moduleId: M05_ID, slug: "headings", label: "Hiérarchie h1-h6 (un seul h1, jamais sauter de niveau)", displayOrder: 3, weight: 2 },
  { moduleId: M05_ID, slug: "block-inline", label: "Block / inline / inline-block", displayOrder: 4, weight: 1 },
  { moduleId: M05_ID, slug: "forms", label: "Formulaires complets avec label, fieldset, legend", displayOrder: 5, weight: 3 },
  { moduleId: M05_ID, slug: "input-types", label: "Types d'inputs HTML5 (email, tel, date, color, range...)", displayOrder: 6, weight: 2 },
  { moduleId: M05_ID, slug: "validation", label: "Validation native (required, pattern, min/max)", displayOrder: 7, weight: 2 },
  { moduleId: M05_ID, slug: "media", label: "img avec alt + srcset, video, audio, picture, figure", displayOrder: 8, weight: 2 },
  { moduleId: M05_ID, slug: "tables", label: "Tableaux avec caption, thead, tbody, scope", displayOrder: 9, weight: 1 },
  { moduleId: M05_ID, slug: "inline-content", label: "Balises sémantiques inline (strong, em, time, mark, code)", displayOrder: 10, weight: 1 },
  { moduleId: M05_ID, slug: "meta-seo", label: "Meta SEO (description, Open Graph, Twitter Cards)", displayOrder: 11, weight: 2 },
  { moduleId: M05_ID, slug: "a11y", label: "Accessibilité (ARIA roles, alt text, focus, clavier)", displayOrder: 12, weight: 3 },
  { moduleId: M05_ID, slug: "validation-w3c", label: "Validation W3C (validator.w3.org)", displayOrder: 13, weight: 1 },
  { moduleId: M05_ID, slug: "dom-tree", label: "DOM comme arbre (parent/enfant/frère)", displayOrder: 14, weight: 2 },
];

export const m05SkillAxisRules = m05Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "html_css",
  contribution: 100,
}));

export const m05Videos: NewVideo[] = [
  {
    moduleId: M05_ID,
    isPrimary: 1,
    title: "Cours complet HTML et CSS (sections HTML 1-35)",
    creator: "Pierre Giraud",
    externalUrl:
      "https://www.pierre-giraud.com/html-css-apprendre-coder-cours/",
    language: "fr",
    durationSeconds: 6 * 60 * 60,
    whyThisOne:
      "LA référence francophone HTML/CSS pour débutants. Cours structuré pédagogiquement, support écrit synchronisé, quiz et exercices.",
    coversSkills: ["structure", "semantic", "forms", "tables", "media"],
    displayOrder: 1,
  },
  {
    moduleId: M05_ID,
    isPrimary: 0,
    title: "Learn Accessibility – Full a11y Tutorial",
    creator: "Kevin Powell / freeCodeCamp",
    youtubeId: "e2nkq3h1P68",
    language: "en",
    durationSeconds: 60 * 60 + 33 * 60,
    whyThisOne:
      "L'accessibilité en profondeur (contraste, alt text, ARIA, semantic HTML, screen readers). Critique en 2026 avec RGAA + European Accessibility Act.",
    coversSkills: ["a11y", "semantic"],
    displayOrder: 2,
  },
  {
    moduleId: M05_ID,
    isPrimary: 0,
    title: "Responsive Images — The Full Course",
    creator: "Kevin Powell",
    language: "en",
    whyThisOne:
      "<picture>, srcset, sizes en profondeur. Les images sont 70% du poids d'une page web — savoir les optimiser change la perf.",
    coversSkills: ["media"],
    displayOrder: 3,
  },
];

export const m05Exercises: NewExercise[] = [
  {
    moduleId: M05_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : sémantique + a11y",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Différence entre <section>, <article>, et <div> ?",
        options: [
          "Aucune, juste du style",
          "<article> = contenu autonome partageable (post, news), <section> = regroupement thématique de la page, <div> = pas de sens, conteneur générique",
          "<section> est obsolète",
          "<div> est sémantique",
        ],
        correctIndex: 1,
        explanation: "<article> = indépendant (peut être extrait et avoir du sens hors page). <section> = section thématique. <div> = pas de sens, dernier recours. Mauvais choix = SEO et a11y détruits.",
      },
      {
        question: "Image purement décorative (vague de fond). Quel alt ?",
        options: ['alt="image"', 'alt="vague de fond décorative"', 'alt="" (vide)', "Pas d'alt"],
        correctIndex: 2,
        explanation: "alt=\"\" = décoratif, screen reader skip. alt absent = erreur. alt descriptif = inutile car ça pollue (la vague n'apporte pas d'info).",
      },
      {
        question: "Pourquoi <input type=\"email\"> > <input type=\"text\"> ?",
        options: [
          "Aucune raison",
          "Clavier email sur mobile, validation native du format, autocomplete email, sémantique pour screen readers",
          "Plus rapide",
          "Obligatoire HTML5",
        ],
        correctIndex: 1,
        explanation: "4 raisons : (1) keyboard email sur mobile, (2) validation native via formulaire, (3) autocomplete email, (4) screen readers savent c'est un email.",
      },
    ],
    skillSlugs: ["semantic", "a11y", "input-types"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M05_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "html",
    title: "Mon CV en HTML pur (zéro CSS, zéro JS)",
    statement: `Créer ton CV personnel en HTML5 PUR. Lisible et structuré même sans aucun style. Test de la sémantique pure.

**Structure obligatoire**
- DOCTYPE + html lang="fr"
- head : charset, viewport, title, description, Open Graph (og:title, og:description, og:image, og:url, og:type), favicon
- header : nom (h1), titre/métier, coordonnées (address)
- nav : ancres internes vers chaque section
- main : 4-5 sections (Expériences, Formations, Compétences, Projets, Contact)
  - Expériences : chaque dans article + h3 (poste) + time (dates)
  - Projets : 3 projets dans figure + figcaption + lien avec rel="noopener noreferrer"
  - Contact : form complet avec fieldset, legend, label/input matching for/id, validation native
- aside + footer

**Validation**
- validator.w3.org → 0 erreur, 0 warning
- wave.webaim.org → 0 erreur a11y
- Navigation 100% au clavier (Tab, Shift+Tab, Enter)
- VoiceOver / Narrator lit correctement

**Bonus**
- Table récapitulative avec caption, scope="col"/"row"
- Video ou audio libre de droits
- Déployé sur GitHub Pages`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["semantic", "forms", "a11y", "meta-seo", "validation-w3c"],
    passThresholdPct: 100,
    estimatedMinutes: 12 * 60,
    displayOrder: 2,
  },
];
