// M06 — L'environnement du développeur
// Outillage pratique : VS Code, Node.js, pnpm, nvm, debug, dotfiles.
// prereq : M05 Git (on versionne ses dotfiles).

import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content.js";

export const M06_ID = "m06-env-dev";

export const m06Module: NewModule = {
  id: M06_ID,
  moduleNumber: 4,
  phase: 4,
  title: "L'environnement du développeur",
  subtitle:
    "VS Code, Node.js, nvm, pnpm, linter, debugger et dotfiles — le poste configuré une fois, utilisé partout.",
  pourquoi: `Un dev passe des centaines d'heures dans son éditeur. Un éditeur mal configuré, c'est des erreurs non signalées, des bugs que le linter aurait trouvés, un formatage incohérent qui pollue les diffs Git, un debugger inutilisé parce que personne ne l'a jamais montré.

**nvm est indispensable dès qu'on touche plusieurs projets.** Un projet Node 18, un autre Node 20, un client qui exige Node 16 — sans nvm tu jongleras entre des installations globales qui se cassent mutuellement. Le .nvmrc, c'est ce qui rend un projet reproductible sur n'importe quelle machine.

**pnpm n'est pas "npm avec un p".** C'est un gestionnaire de paquets qui stocke les modules une fois et crée des liens symboliques, ce qui divise l'espace disque par 3 et accélère les installs. Son support des workspaces monorepo est natif et plus solide que npm.

**Le debugger VS Code change tout.** La plupart des devs débutants déboguent avec console.log. Un breakpoint, un watch de variable, un call stack visuel — c'est 10× plus rapide et ça force à comprendre l'état de l'application au lieu de l'inférer depuis des logs.

**Les dotfiles sont ta mémoire de configuration.** Quand tu changes de machine ou que tu configures un serveur, tu veux ta config zsh, ton .gitconfig, tes settings VS Code — en 5 minutes. Sans dotfiles versionnés, tu passes des heures à tout reconfigurer.`,
  objectives: [
    "Installer et configurer VS Code avec les extensions essentielles (ESLint, Prettier, GitLens, Error Lens)",
    "Gérer plusieurs versions de Node.js avec nvm et .nvmrc par projet",
    "Utiliser pnpm pour gérer les dépendances et comprendre les workspaces",
    "Configurer ESLint et Prettier avec format-on-save dans VS Code",
    "Manipuler les variables d'environnement avec .env et .env.example",
    "Utiliser le debugger VS Code avec launch.json, breakpoints et watch variables",
    "Configurer le terminal intégré VS Code avec zsh et aliases utiles",
    "Créer et maintenir un repo dotfiles versionnés sur GitHub",
    "Lancer des services locaux avec Docker et docker-compose",
  ],
  prerequisites: [
    "Git & GitHub (pour versionner ses dotfiles)",
    "Terminal de base",
  ],
  prereqModuleId: "m05-git-github",
  estimatedHours: 17,
};

export const m06Skills: NewSkill[] = [
  {
    moduleId: M06_ID,
    slug: "vscode-setup",
    label: "VS Code — installation & configuration de base",
    description:
      "Installer VS Code, configurer le thème (Dark+, One Dark Pro), la police JetBrains Mono avec ligatures, settings.json (editor.formatOnSave, tabSize, wordWrap), et les raccourcis clavier essentiels (Ctrl+P, Ctrl+Shift+P, Ctrl+` pour le terminal).",
    displayOrder: 1,
    weight: 2,
    prereqSkillSlugs: [],
  },
  {
    moduleId: M06_ID,
    slug: "vscode-extensions",
    label: "Extensions VS Code indispensables",
    description:
      "ESLint (intégration lint), Prettier (formatage), GitLens (git blame inline, historique), Error Lens (erreurs inline), REST Client ou Thunder Client (test API sans Postman), Tailwind CSS IntelliSense, et comment les configurer sans les laisser ralentir l'éditeur.",
    displayOrder: 2,
    weight: 2,
    prereqSkillSlugs: ["vscode-setup"],
  },
  {
    moduleId: M06_ID,
    slug: "nvm-node",
    label: "Node.js avec nvm",
    description:
      "Installer nvm (Node Version Manager), comprendre pourquoi ne PAS installer Node globalement. nvm install, nvm use, nvm alias default. Le fichier .nvmrc pour figer la version Node par projet. nvm + zsh (sourcing dans .zshrc).",
    displayOrder: 3,
    weight: 3,
    prereqSkillSlugs: [],
  },
  {
    moduleId: M06_ID,
    slug: "pnpm-npm-scripts",
    label: "pnpm & npm scripts",
    description:
      "pnpm vs npm vs yarn : différences de stockage (store global + liens symboliques). pnpm install/add/remove/run. Scripts dans package.json (dev, build, test, lint). npx pour exécuter sans install global. pnpm workspaces pour monorepos.",
    displayOrder: 4,
    weight: 3,
    prereqSkillSlugs: ["nvm-node"],
  },
  {
    moduleId: M06_ID,
    slug: "env-files",
    label: "Variables d'environnement & .env",
    description:
      ".env et process.env en Node.js. .env.example comme template versionné. Ne JAMAIS committer .env (l'ajouter dans .gitignore). dotenv pour charger les variables. Variables d'env dans les scripts CI/CD (secrets GitHub Actions).",
    displayOrder: 5,
    weight: 2,
    prereqSkillSlugs: ["pnpm-npm-scripts"],
  },
  {
    moduleId: M06_ID,
    slug: "linter-formatter",
    label: "ESLint & Prettier",
    description:
      "Différence linter (qualité du code) vs formatter (style). Configurer ESLint avec eslint.config.js (flat config). Configurer Prettier avec .prettierrc. Intégration VS Code : format on save, erreurs lint inline. Script lint dans package.json.",
    displayOrder: 6,
    weight: 3,
    prereqSkillSlugs: ["vscode-extensions", "pnpm-npm-scripts"],
  },
  {
    moduleId: M06_ID,
    slug: "debug-vscode",
    label: "Debugger VS Code",
    description:
      "Configurer .vscode/launch.json pour Node.js. Poser des breakpoints, les conditions et les logpoints. Watch expressions, call stack, variables locales/globales. Debug d'un serveur en cours d'exécution (Attach). Pourquoi console.log est insuffisant pour déboguer.",
    displayOrder: 7,
    weight: 3,
    prereqSkillSlugs: ["vscode-setup"],
  },
  {
    moduleId: M06_ID,
    slug: "terminal-integre",
    label: "Terminal intégré & shell productif",
    description:
      "Terminal intégré VS Code (Ctrl+`), split panes. Configurer zsh comme shell par défaut. oh-my-zsh ou Starship pour un prompt informatif. Aliases utiles dans .zshrc (g pour git, ll pour ls -la, ...). Auto-completion et history search (Ctrl+R).",
    displayOrder: 8,
    weight: 2,
    prereqSkillSlugs: ["vscode-setup"],
  },
  {
    moduleId: M06_ID,
    slug: "dotfiles",
    label: "Dotfiles — versionner sa config",
    description:
      "Créer un repo dotfiles sur GitHub. Versionner .zshrc, .gitconfig, .vscode/settings.json, .prettierrc. Deux approches : symlinks manuels ou GNU stow. README avec instructions de restore. L'objectif : nouvelle machine opérationnelle en < 10 minutes.",
    displayOrder: 9,
    weight: 3,
    prereqSkillSlugs: ["terminal-integre"],
  },
  {
    moduleId: M06_ID,
    slug: "docker-basics",
    label: "Docker — bases pour le dev local",
    description:
      "Images vs conteneurs. docker run, docker ps, docker stop, docker rm. Volumes pour la persistance. Port mapping (-p 5432:5432). docker-compose.yml pour orchestrer plusieurs services (app + DB). Docker Desktop vs CLI. Quand utiliser Docker en dev.",
    displayOrder: 10,
    weight: 3,
    prereqSkillSlugs: [],
  },
];

export const m06SkillAxisRules = [
  { skillSlug: "vscode-setup", axisId: "shell_systems", contribution: 3 },
  { skillSlug: "vscode-extensions", axisId: "shell_systems", contribution: 2 },
  { skillSlug: "nvm-node", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "pnpm-npm-scripts", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "env-files", axisId: "shell_systems", contribution: 3 },
  { skillSlug: "linter-formatter", axisId: "shell_systems", contribution: 3 },
  { skillSlug: "debug-vscode", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "terminal-integre", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "dotfiles", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "docker-basics", axisId: "shell_systems", contribution: 6 },
];

export const m06Videos: NewVideo[] = [
  {
    moduleId: M06_ID,
    isPrimary: 1,
    title: "VS Code — Tutoriel complet pour débutants (Grafikart)",
    creator: "Grafikart.fr",
    youtubeId: "VqCgcpAypFQ",
    externalUrl: null,
    language: "fr",
    durationSeconds: 60 * 60,
    whyThisOne:
      "Le cours VS Code complet en français. Grafikart couvre l'interface, les extensions, le terminal intégré et la config. Idéal pour configurer l'éditeur une bonne fois pour toutes en comprenant ce qu'on fait.",
    coversSkills: ["vscode-setup", "vscode-extensions", "terminal-integre"],
    displayOrder: 1,
  },
  {
    moduleId: M06_ID,
    isPrimary: 0,
    title: "Docker in 100 Seconds",
    creator: "Fireship",
    youtubeId: "Gjnup-PuquQ",
    externalUrl: null,
    language: "en",
    durationSeconds: 100,
    whyThisOne:
      "Le modèle mental Docker en 100 secondes. Images vs conteneurs vs volumes, en animations claires. Le meilleur point d'entrée avant de configurer un docker-compose.",
    coversSkills: ["docker-basics"],
    displayOrder: 2,
  },
  {
    moduleId: M06_ID,
    isPrimary: 0,
    title: "You should use NVM (Node Version Manager)",
    creator: "Fireship",
    youtubeId: "ohBFbA0O6Bs",
    externalUrl: null,
    language: "en",
    durationSeconds: 6 * 60,
    whyThisOne:
      "Fireship explique en 6 minutes pourquoi ne pas installer Node globalement et comment nvm résout le problème. Concret, direct, avec les commandes essentielles.",
    coversSkills: ["nvm-node"],
    displayOrder: 3,
  },
];

export const m06Exercises: NewExercise[] = [
  {
    moduleId: M06_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de plonger : ton environnement de dev actuel",
    statement:
      "Quiz pour situer où tu en es avec ton outillage de dev. Pas de jugement — l'objectif est de savoir ce qu'on va configurer ensemble.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Comment tu gères plusieurs projets qui requièrent des versions Node différentes ?",
        options: [
          "Je réinstalle Node à chaque fois",
          "J'utilise nvm avec un .nvmrc par projet",
          "Je n'ai jamais eu ce problème",
          "Aucune idée de ce qu'est nvm",
        ],
        correctIndex: 1,
        explanation:
          "nvm install + .nvmrc est la solution standard. nvm use lit automatiquement .nvmrc si tu configures zsh correctement avec `autoload -U add-zsh-hook` et un hook chpwd.",
      },
      {
        question: "Quelle différence entre ESLint et Prettier ?",
        options: [
          "Ce sont deux noms pour le même outil",
          "ESLint trouve les erreurs de code (qualité), Prettier formate le style (indentation, virgules, guillemets) — ils sont complémentaires",
          "Prettier lint, ESLint formate",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "ESLint = qualité (variables inutilisées, erreurs logiques). Prettier = style (comment le code est mis en forme). Les deux ensemble + format on save = zéro friction sur le style en équipe.",
      },
      {
        question: "Quand tu as un bug, tu utilises :",
        options: [
          "console.log partout jusqu'à trouver",
          "Le debugger VS Code avec breakpoints",
          "Un mélange des deux selon le cas",
          "Je renvoie l'erreur et j'espère que le message est assez clair",
        ],
        correctIndex: 2,
        explanation:
          "console.log est valide pour du diagnostic rapide. Le debugger VS Code est irremplaçable pour les bugs complexes avec état — tu peux inspecter chaque variable au moment exact où ça casse.",
      },
    ],
    displayOrder: 1,
  },
  {
    moduleId: M06_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "bash",
    title: "Créer son repo dotfiles",
    statement:
      "Crée un repo `dotfiles` sur GitHub. Versionne au minimum : ton .zshrc (ou .bashrc), ton .gitconfig, et un .vscode/settings.json. Ajoute un README.md qui explique comment restaurer la config sur une nouvelle machine en < 10 minutes.",
    starterCode:
      "# Structure recommandée :\n# dotfiles/\n#   .zshrc\n#   .gitconfig\n#   .vscode/\n#     settings.json\n#   README.md\n#   install.sh  (optionnel: crée les symlinks)\n\nmkdir dotfiles && cd dotfiles\ngit init",
    solutionCode:
      "# Créer la structure\nmkdir -p .vscode\ncp ~/.zshrc .zshrc\ncp ~/.gitconfig .gitconfig\ncp ~/.config/Code/User/settings.json .vscode/settings.json\ngit add . && git commit -m 'feat: initial dotfiles'\ngit remote add origin git@github.com:TON_USER/dotfiles.git\ngit push -u origin main",
    expectedOutput: "Repo dotfiles pushé sur GitHub avec les 3 fichiers de config",
    testsCode: null,
    quizQuestions: null,
    displayOrder: 2,
  },
  {
    moduleId: M06_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Debugger un bug avec VS Code (pas de console.log)",
    statement:
      "La fonction ci-dessous a un bug. Utilise le debugger VS Code (breakpoint sur la ligne du return, watch sur `total`) pour trouver et corriger l'erreur. Règle : zéro console.log autorisé.",
    starterCode:
      "// Bug ici — trouve-le avec le debugger\nfunction sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n\nconsole.log(sumArray([1, 2, 3])); // devrait afficher 6, affiche NaN",
    solutionCode:
      "function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) { // i <= → i <\n    total += arr[i];\n  }\n  return total;\n}\n\nconsole.log(sumArray([1, 2, 3])); // 6",
    expectedOutput: "6",
    testsCode: null,
    quizQuestions: null,
    displayOrder: 3,
  },
];
