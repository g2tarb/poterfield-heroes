import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M07_ID = "m07-css-avance-tailwind";

export const m07Module: NewModule = {
  id: M07_ID,
  moduleNumber: 7,
  phase: 2,
  title: "CSS avancé (animations, méthodologies, Tailwind CSS)",
  subtitle: "Livrer comme un pro. Animations, design systems, Tailwind v4.",
  pourquoi:
    "M6 = mécanique CSS. M7 = livrer comme un pro : animations qui font la différence entre amateur et premium, méthodologies pour pas finir avec 5000 lignes de spaghetti, Tailwind pour livrer 5x plus vite. Grosse erreur : sauter sur Tailwind sans maîtriser CSS pur.",
  objectives: [
    "Transitions CSS (property, duration, easing, delay)",
    "Animations CSS (@keyframes, fill-mode, iteration)",
    "Transforms 2D + 3D (translate, scale, rotate, perspective)",
    "Performance des animations (compositor vs layout/paint)",
    "prefers-reduced-motion (a11y)",
    "scroll-driven animations + view transitions API",
    "Méthodologies (BEM, ITCSS, atomic, utility-first)",
    "CSS-in-JS, CSS Modules, utility-first — trade-offs",
    "Tailwind CSS v4 (utility classes, prefixes responsive/states)",
    "Configuration Tailwind v4 avec Vite",
    "shadcn/ui philosophy (copy-paste vs lib)",
    "Design system minimal (tokens + composants)",
    "Optimisation CSS prod (purge, minification, critical)",
  ],
  prerequisites: "Module 5 (HTML5) et Module 6 (CSS3) maîtrisés à 100%",
  estimatedHours: 35,
  estimatedWeeks: 2,
  stackAllowed: ["Tailwind v4", "Vite", "shadcn/ui (optionnel)"],
  prereqModuleId: "m06-css3-fondamentaux",
  unlockSrsMatureRatio: 80,
};

export const m07Skills: NewSkill[] = [
  { moduleId: M07_ID, slug: "transitions", label: "Transitions CSS (property, duration, easing)", displayOrder: 1, weight: 2 },
  { moduleId: M07_ID, slug: "keyframes", label: "@keyframes + animation properties", displayOrder: 2, weight: 2 },
  { moduleId: M07_ID, slug: "transforms", label: "Transforms 2D et 3D (translate, scale, rotate)", displayOrder: 3, weight: 2 },
  { moduleId: M07_ID, slug: "perf-animations", label: "Animer transform/opacity vs width/top (compositor)", displayOrder: 4, weight: 3 },
  { moduleId: M07_ID, slug: "reduced-motion", label: "prefers-reduced-motion respecté", displayOrder: 5, weight: 2 },
  { moduleId: M07_ID, slug: "modern-animations", label: "Scroll-driven animations + view transitions API", displayOrder: 6, weight: 1 },
  { moduleId: M07_ID, slug: "bem", label: "BEM methodology (block__element--modifier)", displayOrder: 7, weight: 1 },
  { moduleId: M07_ID, slug: "utility-first", label: "Utility-first philosophy (Tailwind)", displayOrder: 8, weight: 2 },
  { moduleId: M07_ID, slug: "tailwind-classes", label: "Tailwind utility classes + responsive prefixes", displayOrder: 9, weight: 3 },
  { moduleId: M07_ID, slug: "tailwind-states", label: "État prefixes (hover:, focus:, dark:, group, peer)", displayOrder: 10, weight: 3 },
  { moduleId: M07_ID, slug: "tailwind-config", label: "Configuration Tailwind v4 (theme, custom)", displayOrder: 11, weight: 2 },
  { moduleId: M07_ID, slug: "shadcn", label: "shadcn/ui : copy-paste components", displayOrder: 12, weight: 1 },
  { moduleId: M07_ID, slug: "design-system", label: "Design system minimal (tokens + composants)", displayOrder: 13, weight: 2 },
  { moduleId: M07_ID, slug: "css-perf-prod", label: "CSS prod : purge, minification, critical CSS", displayOrder: 14, weight: 1 },
];

export const m07SkillAxisRules = m07Skills.map((s) => ({ skillSlug: s.slug, axisId: "html_css", contribution: 100 }));

export const m07Videos: NewVideo[] = [
  {
    moduleId: M07_ID,
    isPrimary: 1,
    title: "Tailwind CSS v4 for Beginners | Full Course 2026",
    creator: "Net Ninja / équivalent",
    youtubeId: "9I3JQ1q4IMk",
    language: "en",
    durationSeconds: 2 * 60 * 60 + 30 * 60,
    whyThisOne: "Tailwind v4 a changé installation et config. Cette vidéo couvre la version actuelle, pas v3 obsolète.",
    coversSkills: ["tailwind-classes", "tailwind-states", "tailwind-config"],
    displayOrder: 1,
  },
  {
    moduleId: M07_ID,
    isPrimary: 0,
    title: "MASTER CSS Transitions in 2024",
    creator: "Online Tutorials",
    youtubeId: "hleg4zmjQ-o",
    language: "en",
    durationSeconds: 45 * 60,
    whyThisOne: "Transitions/animations en profondeur. Kevin Powell est aussi excellent sur ce sujet.",
    coversSkills: ["transitions", "keyframes", "transforms"],
    displayOrder: 2,
  },
  {
    moduleId: M07_ID,
    isPrimary: 0,
    title: "Animations Performance — Compositor vs Paint vs Layout",
    creator: "Paul Lewis (YouTube search)",
    language: "en",
    whyThisOne: "Pourquoi animer transform/opacity et pas width/top. Comprendre le rendering pipeline pour faire du 60fps.",
    coversSkills: ["perf-animations"],
    displayOrder: 3,
  },
];

export const m07Exercises: NewExercise[] = [
  {
    moduleId: M07_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : animations + Tailwind",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Pourquoi `transform: translateX(100px)` est plus performant que `left: 100px` ?",
        options: [
          "Aucune différence",
          "transform/opacity sont calculés sur GPU (compositor only) → 60fps. left/top redéclenchent layout + paint → coûteux.",
          "transform est plus rapide à taper",
          "left est obsolète",
        ],
        correctIndex: 1,
        explanation: "Pipeline rendering : Style → Layout → Paint → Composite. transform/opacity sautent Layout et Paint → quasi-gratuit. Animer width/top force tout le pipeline.",
      },
      {
        question: "Philosophie Tailwind vs Bootstrap ?",
        options: [
          "Identiques",
          "Bootstrap = composants pré-stylés (.btn-primary). Tailwind = briques bas niveau, tu construis tes propres composants.",
          "Tailwind est plus lent",
          "Bootstrap est mort",
        ],
        correctIndex: 1,
        explanation: "Bootstrap impose un design system. Tailwind donne des utility classes (p-4, bg-blue-500) qu'on compose. Bootstrap = rapide pour MVP générique, Tailwind = identité custom.",
      },
    ],
    skillSlugs: ["perf-animations", "utility-first"],
    passThresholdPct: 80,
    estimatedMinutes: 8,
    displayOrder: 1,
  },
  {
    moduleId: M07_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "html",
    title: "Refonte landing en Tailwind v4 + animations + design system",
    statement: `Reprendre la landing du M6, la réécrire en Tailwind CSS v4 avec animations + microinteractions, transformée en design system documenté.

**Setup Tailwind v4**
- Vite + Tailwind v4 (doc officielle)
- Palette custom (5 couleurs × scale 50-900)
- Typo : 2 font-families (display + body)
- Dark mode strategy 'class' avec toggle JS

**Animations**
- Hero : fade-in-up au load (@keyframes)
- Boutons : hover translateY(-2px) + shadow grandit, transition 200ms
- Cards features : hover scale 1.02, icône rotate 15°
- Cards pricing : "Populaire" pulse subtilement
- Scroll reveal via scroll-driven animations CSS pures
- Toggle dark mode : transition 300ms smooth
- prefers-reduced-motion respecté (motion-reduce: variants)

**Design system**
- design-system.html documentant : palette, typo, espacements, composants (Button 3 variants × 3 sizes, Card, Input, Badge), animations

**Validation**
- 100% utility classes (sauf exceptions documentées)
- ≥ 5 animations custom dans la config
- Lighthouse ≥ 95 sur les 4
- DevTools Performance montre compositor-only (pas de layout thrashing)
- Déployé Vercel/Netlify`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["tailwind-classes", "tailwind-states", "keyframes", "perf-animations", "design-system"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
