import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M04_ID = "m04-env-dev";

export const m04Module: NewModule = {
  id: M04_ID,
  moduleNumber: 4,
  phase: 1,
  title: "L'environnement du dev (VS Code, Node, pnpm, nvm)",
  subtitle:
    "Ton atelier. Mal configuré, tu travailles à 30% de vitesse. Configuré, tu gagnes 1-2h par jour.",
  pourquoi:
    "Ton éditeur et ton runtime sont les outils que tu touches 8h/jour pendant des années. Mal configurés = scie mal affûtée. Maîtriser VS Code te fait gagner 1-2h/jour. Maîtriser Node/pnpm/nvm évite des heures de 'ça marche chez moi'.",
  objectives: [
    "Configurer VS Code (settings.json, theme, font, format on save)",
    "Maîtriser 20+ raccourcis clavier essentiels",
    "Installer extensions de base (Prettier, ESLint, GitLens, Error Lens)",
    "Utiliser le debugger : breakpoints, step, watch, call stack",
    "Comprendre Node, npm, npx, pnpm, nvm/fnm",
    "Installer Node via nvm/fnm (jamais en direct)",
    "Initialiser un projet : pnpm init, package.json",
    "Versioning sémantique (^1.2.3, ~1.2.3, 1.2.3)",
    "Lockfile : pourquoi committer pnpm-lock.yaml",
    "Configurer Prettier + ESLint + EditorConfig",
    "Créer ses snippets VS Code",
    "Multi-curseur, palette de commandes, Go to definition",
    "Lancer scripts via pnpm run",
    "Distinguer deps globales vs locales",
  ],
  prerequisites: "Modules 1, 2, 3",
  estimatedHours: 17,
  estimatedWeeks: 1,
  stackAllowed: ["VS Code", "Node.js 20+", "pnpm", "fnm/nvm", "Git"],
  prereqModuleId: "m03-git-github",
  unlockSrsMatureRatio: 80,
};

export const m04Skills: NewSkill[] = [
  { moduleId: M04_ID, slug: "vscode-config", label: "Configurer VS Code (settings.json, font, theme)", displayOrder: 1, weight: 2 },
  { moduleId: M04_ID, slug: "shortcuts", label: "20+ raccourcis clavier sans toucher la souris", displayOrder: 2, weight: 3 },
  { moduleId: M04_ID, slug: "extensions", label: "Extensions essentielles : Prettier, ESLint, GitLens, Error Lens", displayOrder: 3, weight: 2 },
  { moduleId: M04_ID, slug: "debugger", label: "Debugger : breakpoints, step over/into/out, watch", displayOrder: 4, weight: 2 },
  { moduleId: M04_ID, slug: "snippets", label: "Créer ses snippets VS Code", displayOrder: 5, weight: 1 },
  { moduleId: M04_ID, slug: "node-vs-npm", label: "Distinguer Node, npm, npx, pnpm, nvm", displayOrder: 6, weight: 2 },
  { moduleId: M04_ID, slug: "nvm-fnm", label: "Installer Node via nvm/fnm, gérer plusieurs versions", displayOrder: 7, weight: 2 },
  { moduleId: M04_ID, slug: "pkg-json", label: "package.json : scripts, deps, devDeps, engines", displayOrder: 8, weight: 3 },
  { moduleId: M04_ID, slug: "semver", label: "Versioning sémantique ^1.2.3 vs ~1.2.3 vs 1.2.3", displayOrder: 9, weight: 2 },
  { moduleId: M04_ID, slug: "lockfile", label: "Lockfile (pnpm-lock.yaml) à committer toujours", displayOrder: 10, weight: 3 },
  { moduleId: M04_ID, slug: "global-vs-local", label: "Deps globales vs locales, quand utiliser quoi", displayOrder: 11, weight: 1 },
  { moduleId: M04_ID, slug: "scripts", label: "pnpm run dev/build/test, scripts custom", displayOrder: 12, weight: 1 },
  { moduleId: M04_ID, slug: "format-lint", label: "Prettier + ESLint + EditorConfig au niveau projet", displayOrder: 13, weight: 2 },
  { moduleId: M04_ID, slug: "dotfiles", label: "Repo dotfiles pour réinstaller en 10min", displayOrder: 14, weight: 1 },
];

export const m04SkillAxisRules = m04Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "fundamentals",
  contribution: 100,
}));

export const m04Videos: NewVideo[] = [
  {
    moduleId: M04_ID,
    isPrimary: 1,
    title: "Apprendre Visual Studio Code (série de tutoriels)",
    creator: "Grafikart",
    externalUrl: "https://grafikart.fr/tutoriels/visual-studio-code",
    language: "fr",
    durationSeconds: 3 * 60 * 60,
    whyThisOne:
      "Usage réel de VS Code par un dev pro. Format découpé en sous-vidéos thématiques.",
    coversSkills: ["vscode-config", "extensions", "snippets", "shortcuts"],
    displayOrder: 1,
  },
  {
    moduleId: M04_ID,
    isPrimary: 0,
    title: "25 VS Code Productivity Tips and Speed Hacks",
    creator: "Fireship",
    language: "en",
    durationSeconds: 8 * 60,
    whyThisOne:
      "25 tricks que les pros utilisent quotidiennement. Format dense, à revoir 3-4 fois.",
    coversSkills: ["shortcuts"],
    displayOrder: 2,
  },
  {
    moduleId: M04_ID,
    isPrimary: 0,
    title: "Understanding Node.js, npm, nvm, npx",
    creator: "Ronak Navadia (dev.to)",
    externalUrl:
      "https://dev.to/ronak_navadia/getting-started-with-nodejs-understanding-node-npm-nvm-and-npx-and-how-to-install-nodejs-1dc4",
    language: "en",
    whyThisOne:
      "Clarifie la confusion classique entre tous ces outils avec analogies simples.",
    coversSkills: ["node-vs-npm", "nvm-fnm"],
    displayOrder: 3,
  },
];

export const m04Exercises: NewExercise[] = [
  {
    moduleId: M04_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : Node ecosystem",
    statement: "Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Que signifie ^1.2.3 dans package.json ?",
        options: [
          "Version exacte 1.2.3",
          "Compatible MAJOR.MINOR (>= 1.2.3 < 1.3.0)",
          "Compatible MAJOR (>= 1.2.3 < 2.0.0)",
          "N'importe quelle version",
        ],
        correctIndex: 2,
        explanation: "^ = compatible si MAJOR identique (1.x.x). ~ = compatible si MINOR identique (1.2.x). 1.2.3 = exact.",
      },
      {
        question: "Pourquoi node_modules dans .gitignore mais pnpm-lock.yaml committé ?",
        options: [
          "node_modules = installé localement par pnpm depuis le lockfile. Le lockfile garantit que tout le monde a les mêmes versions exactes.",
          "Aucune raison",
          "Pour gagner de l'espace",
          "Le lockfile n'est pas nécessaire",
        ],
        correctIndex: 0,
        explanation: "node_modules = 500MB pas portable. Le lockfile (~100KB) reproduit l'installation à l'identique sur n'importe quelle machine.",
      },
      {
        question: "Différence entre `pnpm add pkg` et `pnpm add -D pkg` ?",
        options: [
          "Aucune",
          "-D installe globalement",
          "-D = devDependency (pas inclus en prod build)",
          "-D = version dev",
        ],
        correctIndex: 2,
        explanation: "deps = nécessaires en prod (runtime). devDeps = nécessaires pour développer (types, tests, build tools). En prod : pnpm install --prod ignore les devDeps.",
      },
    ],
    skillSlugs: ["semver", "lockfile", "pkg-json"],
    passThresholdPct: 80,
    estimatedMinutes: 8,
    displayOrder: 1,
  },
  {
    moduleId: M04_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title: "Mon environnement de dev cousu main",
    statement: `Configure ton setup complet + documente dans un repo \`dotfiles\` clonable.

**A. Configuration globale**
- fnm + Node 20 LTS + pnpm via Corepack
- Git config (user.name, email, init.defaultBranch=main, editor=code --wait)

**B. VS Code**
- Settings Sync activé via GitHub
- settings.json minimal : format on save, font JetBrains Mono, theme, autoSave
- 7 extensions obligatoires (Prettier, ESLint, EditorConfig, GitLens, Error Lens, Path Intellisense, Spell Checker)
- 3 snippets perso

**C. Mini-projet \`tools-cli\`**
- pnpm init, engines >= 20
- Scripts dev/start avec --watch
- Deps : chalk, prompts, dayjs
- index.js : demande prénom, dit bonjour avec couleur selon heure (matin=jaune, après-midi=vert, soir=bleu)
- .nvmrc + .gitignore propre

**D. Repo \`dotfiles\`**
- vscode-settings.json
- vscode-extensions.txt (\`code --list-extensions\`)
- gitconfig (sans secrets)
- zshrc/bashrc avec alias
- README qui explique réinstallation en 10min`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["vscode-config", "extensions", "node-vs-npm", "nvm-fnm", "dotfiles"],
    passThresholdPct: 100,
    estimatedMinutes: 10 * 60,
    displayOrder: 2,
  },
];
