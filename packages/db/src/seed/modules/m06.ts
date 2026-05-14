import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M06_ID = "m06-css3-fondamentaux";

export const m06Module: NewModule = {
  id: M06_ID,
  moduleNumber: 6,
  phase: 2,
  title: "CSS3 (fondamentaux + responsive)",
  subtitle: "L'habillage. Apprendre les mécaniques sous-jacentes, pas un dictionnaire.",
  pourquoi:
    "CSS paraît facile au début, puis t'écrase quand tu veux centrer verticalement, gérer le mobile ou faire 3 colonnes qui ne casse pas. La vraie maîtrise = comprendre flux normal, box model, cascade, spécificité, héritage. Apprends les mécaniques, pas un dictionnaire de propriétés.",
  objectives: [
    "3 façons d'inclure CSS (inline, internal, external)",
    "Sélecteurs (type, classe, id, attribut, descendant, pseudo-classes, pseudo-éléments)",
    "Cascade et spécificité (calculer un score)",
    "Héritage (color hérité, padding non)",
    "Box model + box-sizing: border-box",
    "Unités (px, %, em, rem, vh, vw, ch, fr)",
    "Flux normal et display (block, inline, inline-block, none)",
    "Positionnement (static, relative, absolute, fixed, sticky)",
    "Flexbox à 100% (Flexbox Froggy obligatoire)",
    "CSS Grid à 100% (CSS Grid Garden obligatoire)",
    "Quand Flexbox vs Grid (1D vs 2D)",
    "Responsive design (mobile-first, breakpoints 640/768/1024/1280)",
    "Images responsive (max-width: 100%, object-fit, aspect-ratio)",
    "Typographies web (Google Fonts, line-height, letter-spacing)",
    "Couleurs modernes (HEX, RGB, HSL, OKLCH, gradients)",
    "DevTools CSS (inspecteur, computed, layout debugger)",
  ],
  prerequisites: "Module 5 (HTML5 maîtrisé)",
  estimatedHours: 42,
  estimatedWeeks: 2,
  stackAllowed: ["HTML5", "CSS3 pur", "Flexbox Froggy", "CSS Grid Garden"],
  prereqModuleId: "m05-html5",
  unlockSrsMatureRatio: 80,
};

export const m06Skills: NewSkill[] = [
  { moduleId: M06_ID, slug: "selectors", label: "Sélecteurs CSS (type, classe, id, attribut, pseudo)", displayOrder: 1, weight: 2 },
  { moduleId: M06_ID, slug: "cascade", label: "Cascade + spécificité (calculer score)", displayOrder: 2, weight: 3 },
  { moduleId: M06_ID, slug: "inheritance", label: "Héritage (quelles props sont héritées)", displayOrder: 3, weight: 2 },
  { moduleId: M06_ID, slug: "box-model", label: "Box model + box-sizing: border-box", displayOrder: 4, weight: 3 },
  { moduleId: M06_ID, slug: "units", label: "Unités CSS (px, em, rem, vh, vw, fr, ch)", displayOrder: 5, weight: 2 },
  { moduleId: M06_ID, slug: "display", label: "display: block/inline/inline-block/flex/grid", displayOrder: 6, weight: 2 },
  { moduleId: M06_ID, slug: "position", label: "position: static/relative/absolute/fixed/sticky", displayOrder: 7, weight: 3 },
  { moduleId: M06_ID, slug: "flexbox", label: "Flexbox 1D maîtrisé (justify, align, gap, flex-grow)", displayOrder: 8, weight: 3 },
  { moduleId: M06_ID, slug: "grid", label: "CSS Grid 2D (template-columns, grid-area, repeat, auto-fit)", displayOrder: 9, weight: 3 },
  { moduleId: M06_ID, slug: "flex-vs-grid", label: "Quand Flexbox vs Grid", displayOrder: 10, weight: 2 },
  { moduleId: M06_ID, slug: "responsive", label: "Responsive mobile-first (breakpoints, media queries)", displayOrder: 11, weight: 3 },
  { moduleId: M06_ID, slug: "responsive-images", label: "Images responsive (max-width 100%, object-fit, aspect-ratio)", displayOrder: 12, weight: 1 },
  { moduleId: M06_ID, slug: "typography", label: "Typographies (Google Fonts, line-height, letter-spacing)", displayOrder: 13, weight: 1 },
  { moduleId: M06_ID, slug: "colors", label: "Couleurs modernes (HEX/RGB/HSL/OKLCH, gradients)", displayOrder: 14, weight: 1 },
  { moduleId: M06_ID, slug: "css-vars", label: "Variables CSS (custom properties) + design tokens", displayOrder: 15, weight: 2 },
  { moduleId: M06_ID, slug: "devtools-css", label: "DevTools CSS (inspecteur, computed, layout debug)", displayOrder: 16, weight: 1 },
];

export const m06SkillAxisRules = m06Skills.map((s) => ({ skillSlug: s.slug, axisId: "html_css", contribution: 100 }));

export const m06Videos: NewVideo[] = [
  {
    moduleId: M06_ID,
    isPrimary: 1,
    title: "Cours complet HTML et CSS (sections CSS 36-71)",
    creator: "Pierre Giraud",
    externalUrl: "https://www.pierre-giraud.com/html-css-apprendre-coder-cours/",
    language: "fr",
    durationSeconds: 10 * 60 * 60,
    whyThisOne: "Continuité parfaite avec M5. Pierre Giraud couvre CSS dans la même série avec exercices interactifs.",
    coversSkills: ["selectors", "box-model", "position", "typography", "colors"],
    displayOrder: 1,
  },
  {
    moduleId: M06_ID,
    isPrimary: 0,
    title: "Flexbox Froggy (FR)",
    creator: "Thomas Park",
    externalUrl: "https://flexboxfroggy.com",
    language: "fr",
    whyThisOne: "Jeu interactif pour ancrer Flexbox via 24 niveaux. OBLIGATOIRE, ~2h, fais-le en entier.",
    coversSkills: ["flexbox"],
    displayOrder: 2,
  },
  {
    moduleId: M06_ID,
    isPrimary: 0,
    title: "CSS Grid Garden (FR)",
    creator: "Thomas Park",
    externalUrl: "https://cssgridgarden.com",
    language: "fr",
    whyThisOne: "Équivalent pour CSS Grid via 28 niveaux. OBLIGATOIRE, ~2h.",
    coversSkills: ["grid"],
    displayOrder: 3,
  },
  {
    moduleId: M06_ID,
    isPrimary: 0,
    title: "Modern CSS Fundamentals",
    creator: "Kevin Powell (YouTube)",
    externalUrl: "https://www.youtube.com/@KevinPowell",
    language: "en",
    whyThisOne: "Le référent CSS du moment : custom properties, container queries, :has(), modern color, logical properties.",
    coversSkills: ["css-vars", "responsive"],
    displayOrder: 4,
  },
];

export const m06Exercises: NewExercise[] = [
  {
    moduleId: M06_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : cascade, box model, flex/grid",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Différence entre `em` et `rem` ?",
        options: ["Aucune", "`em` = relatif au parent (compose). `rem` = relatif au html racine (constant)", "`em` est obsolète", "`rem` est en pixels"],
        correctIndex: 1,
        explanation: "em = compose avec le font-size parent → effets cumulés. rem = constant, relatif uniquement au root html (16px par défaut). Préférer rem partout sauf cas spéciaux.",
      },
      {
        question: "Quand utiliser Flexbox vs Grid ?",
        options: ["Aucune différence", "Flexbox = 1D (ligne OU colonne). Grid = 2D (lignes ET colonnes). Composants 1D = Flex, layouts globaux = Grid.", "Grid est obsolète", "Flexbox seulement pour les images"],
        correctIndex: 1,
        explanation: "Flexbox brille pour aligner des éléments sur 1 axe (nav, footer, cards). Grid brille pour layouts 2D (page entière, dashboard, magazine).",
      },
      {
        question: "`position: sticky` ne marche pas. Le piège classique ?",
        options: [
          "sticky est obsolète",
          "Le parent a `overflow: hidden/auto/scroll` qui bloque sticky, OU le parent n'a pas de hauteur définie",
          "Il faut un polyfill",
          "Il faut `position: fixed` à la place",
        ],
        correctIndex: 1,
        explanation: "sticky a besoin d'un parent scrollable bien défini. Si overflow ≠ visible sur un ancêtre, sticky se comporte comme relative. Vérifier la chaîne overflow.",
      },
    ],
    skillSlugs: ["units", "flex-vs-grid", "position"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M06_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "html",
    title: "CV stylisé + landing page",
    statement: `Reprendre le CV du Module 5 et le styler en CSS pur (responsive, accessible, beau). Puis créer une landing produit qui exerce Flexbox + Grid + responsive + variables CSS.

**Partie A — Refonte CSS du CV**
- Variables CSS au :root (palette 5 couleurs, espacements --space-1 à --space-8, typo)
- Reset CSS moderne (Josh Comeau)
- Flexbox : header, nav, cards d'expérience
- Grid : layout général sidebar+main, grille projets (3/2/1 colonnes)
- Mobile-first (< 640px, ≥ 768px, ≥ 1024px)
- Sticky header au scroll
- Dark mode auto via prefers-color-scheme
- Focus visible sur tous les éléments interactifs

**Partie B — Landing produit fictif**
- 7 sections : hero, features, comment ça marche, témoignages, pricing, CTA, footer
- 100% CSS pur (pas Tailwind = M7)
- Au moins 5 utilisations Flexbox + 5 utilisations Grid
- Responsive parfait du mobile au 4K
- Transitions hover sur boutons/cards (200ms)

**Critères de réussite**
- 0 unité px pour padding/margin (rem ou variables)
- Au moins 10 variables CSS au :root
- Lighthouse ≥ 95 sur les 4 catégories
- Déployé GitHub Pages ou Netlify
- Tu peux expliquer pourquoi Flex ou Grid à chaque section`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["flexbox", "grid", "responsive", "css-vars"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
