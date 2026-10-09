// M05 — Git & GitHub
// Outillage pratique : versionner, collaborer, travailler en équipe.
// prereq : M02 Shell (on pilote git depuis le terminal).

import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content.js";

export const M05_ID = "m05-git-github";

export const m05Module: NewModule = {
  id: M05_ID,
  moduleNumber: 3,
  phase: 3,
  title: "Git & GitHub",
  subtitle:
    "Versionner, collaborer, survivre aux désastres — le contrôle de version comme un pro.",
  pourquoi: `Tout projet qui dure plus d'une semaine accumule des versions, des erreurs, des idées abandonnées. Sans Git, tu jongleras avec des dossiers "v1", "v2-final", "v2-final-VRAIMENT" — jusqu'au jour où tu écrases six heures de travail sans pouvoir revenir en arrière.

**Git n'est pas "un outil de sauvegarde".** C'est un graphe orienté acyclique de snapshots, avec des pointeurs mobiles (branches) et un index (staging area) qui te donne un contrôle chirurgical sur ce qui entre dans chaque commit. Comprendre le modèle de données, c'est la différence entre subir Git et le piloter.

**GitHub est la couche sociale.** Pull Requests, code review, Issues, Actions CI/CD — tout le travail collaboratif passe par là. Un dev qui ne sait pas ouvrir une PR propre ou résoudre un conflit ne peut pas travailler en équipe.

**La récupération de désastres s'apprend avant le désastre.** git reflog, cherry-pick, rebase interactif — ces commandes semblent obscures jusqu'au jour où tu en as absolument besoin. Ce module te les fait pratiquer dans un contexte contrôlé, pas sous pression.`,
  objectives: [
    "Initialiser un dépôt, comprendre la structure .git et le modèle de données Git",
    "Maîtriser le staging area : git add -p, git diff --cached, .gitignore",
    "Créer des branches, switcher, et comprendre HEAD comme pointeur mobile",
    "Merger (fast-forward vs recursive) et rebaser (linéariser l'historique)",
    "Résoudre des conflits de merge en lisant les marqueurs et choisissant les changements",
    "Configurer et utiliser des remotes : push, pull, fetch, tracking branches",
    "Ouvrir une Pull Request, faire une code review, merger sur GitHub",
    "Lire l'historique avec git log --oneline --graph, git blame, git show",
    "Sauvegarder du travail avec git stash et annuler des commits (reset, revert)",
    "Récupérer des commits perdus via git reflog et cherry-pick",
    "Mettre en place un workflow feature branch et des hooks pre-commit",
  ],
  prerequisites: [
    "Manier un terminal (navigation, commandes de base)",
    "Comprendre les fichiers et dossiers",
  ],
  prereqModuleId: "m02-terminal-shell",
  estimatedHours: 24,
};

export const m05Skills: NewSkill[] = [
  {
    moduleId: M05_ID,
    slug: "git-init-clone",
    label: "Initialiser et cloner un dépôt",
    description:
      "git init, git clone, la structure du dossier .git (objects/, refs/, HEAD). Comprendre qu'un dépôt est un graphe de blobs, trees et commits.",
    displayOrder: 1,
    weight: 2,
    prereqSkillSlugs: [],
  },
  {
    moduleId: M05_ID,
    slug: "staging-commit",
    label: "Staging area & commits atomiques",
    description:
      "git add (entier, partiel avec -p), git status, git diff / git diff --cached, git commit -m. Le .gitignore : patterns, dossiers, fichiers sensibles. Écrire des messages selon Conventional Commits.",
    displayOrder: 2,
    weight: 3,
    prereqSkillSlugs: ["git-init-clone"],
  },
  {
    moduleId: M05_ID,
    slug: "branches",
    label: "Branches et HEAD",
    description:
      "git branch, git checkout -b / git switch -c, git branch -d. HEAD comme pointeur mobile. Visualiser le graphe des commits avec git log --oneline --graph --all.",
    displayOrder: 3,
    weight: 3,
    prereqSkillSlugs: ["staging-commit"],
  },
  {
    moduleId: M05_ID,
    slug: "merge-rebase",
    label: "Merge & Rebase",
    description:
      "git merge (fast-forward vs recursive vs squash). git rebase pour linéariser l'historique. Rebase interactif (git rebase -i) : squash, reword, drop. Quand utiliser merge vs rebase.",
    displayOrder: 4,
    weight: 4,
    prereqSkillSlugs: ["branches"],
  },
  {
    moduleId: M05_ID,
    slug: "conflicts",
    label: "Résolution de conflits",
    description:
      "Lire les marqueurs <<<<<<<, =======, >>>>>>>. Choisir les changements manuellement ou avec un outil (VS Code merge editor). Finaliser le merge après résolution.",
    displayOrder: 5,
    weight: 3,
    prereqSkillSlugs: ["merge-rebase"],
  },
  {
    moduleId: M05_ID,
    slug: "remote-push-pull",
    label: "Remote : push, pull, fetch",
    description:
      "git remote add origin, git push -u origin main, git pull (= fetch + merge), git fetch. Tracking branches. Gérer plusieurs remotes.",
    displayOrder: 6,
    weight: 3,
    prereqSkillSlugs: ["branches"],
  },
  {
    moduleId: M05_ID,
    slug: "github-pr",
    label: "GitHub & Pull Requests",
    description:
      "Fork vs clone. Créer une PR, écrire une description utile, demander une review. Lire et donner du feedback de code. Merge via GitHub (merge commit, squash, rebase). Issues et labels.",
    displayOrder: 7,
    weight: 3,
    prereqSkillSlugs: ["remote-push-pull"],
  },
  {
    moduleId: M05_ID,
    slug: "git-log-history",
    label: "Lire l'historique",
    description:
      "git log --oneline --graph --all --decorate, git show <hash>, git blame pour trouver l'auteur d'une ligne, git diff HEAD~1 pour voir les changements du dernier commit.",
    displayOrder: 8,
    weight: 2,
    prereqSkillSlugs: ["staging-commit"],
  },
  {
    moduleId: M05_ID,
    slug: "stash-reset-revert",
    label: "Stash, Reset & Revert",
    description:
      "git stash push/pop/list pour mettre du travail de côté. git reset --soft/--mixed/--hard pour défaire des commits locaux. git revert pour annuler un commit déjà pushé (propre pour l'historique partagé).",
    displayOrder: 9,
    weight: 3,
    prereqSkillSlugs: ["staging-commit"],
  },
  {
    moduleId: M05_ID,
    slug: "git-workflows",
    label: "Workflows : feature branch & trunk-based",
    description:
      "GitHub Flow (feature branch → PR → merge main). Trunk-based development (commits directs sur main avec feature flags). Conventional Commits + CHANGELOG automatisé. Quand utiliser quoi.",
    displayOrder: 10,
    weight: 2,
    prereqSkillSlugs: ["github-pr"],
  },
  {
    moduleId: M05_ID,
    slug: "git-hooks-ci",
    label: "Hooks Git & CI basique",
    description:
      "pre-commit hook (linter, formatter, tests rapides). commit-msg hook (valider Conventional Commits). GitHub Actions : workflow hello world qui lance les tests sur chaque push.",
    displayOrder: 11,
    weight: 2,
    prereqSkillSlugs: ["git-workflows"],
  },
  {
    moduleId: M05_ID,
    slug: "disaster-recovery",
    label: "Récupération de désastres",
    description:
      "git reflog pour voir TOUT ce que HEAD a pointé (même après un reset --hard). Récupérer un commit perdu. cherry-pick pour appliquer un commit spécifique sur une autre branche. Revenir d'un rebase raté.",
    displayOrder: 12,
    weight: 3,
    prereqSkillSlugs: ["stash-reset-revert"],
  },
];

export const m05SkillAxisRules = [
  { skillSlug: "git-init-clone", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "staging-commit", axisId: "shell_systems", contribution: 6 },
  { skillSlug: "branches", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "merge-rebase", axisId: "shell_systems", contribution: 6 },
  { skillSlug: "conflicts", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "remote-push-pull", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "github-pr", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "git-log-history", axisId: "shell_systems", contribution: 3 },
  { skillSlug: "stash-reset-revert", axisId: "shell_systems", contribution: 5 },
  { skillSlug: "git-workflows", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "git-hooks-ci", axisId: "shell_systems", contribution: 4 },
  { skillSlug: "disaster-recovery", axisId: "shell_systems", contribution: 5 },
];

export const m05Videos: NewVideo[] = [
  {
    moduleId: M05_ID,
    isPrimary: 1,
    title: "Git & GitHub — Cours complet (Grafikart)",
    creator: "Grafikart.fr",
    youtubeId: "rH3zE7VlIMs",
    externalUrl: null,
    language: "fr",
    durationSeconds: 80 * 60,
    whyThisOne:
      "Le cours Git complet en français de référence. Grafikart couvre init → branches → merge → remotes avec des exemples concrets. En français, aucun cours gratuit ne fait mieux sur Git pur.",
    coversSkills: [
      "git-init-clone",
      "staging-commit",
      "branches",
      "merge-rebase",
      "remote-push-pull",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M05_ID,
    isPrimary: 0,
    title: "Git in 100 Seconds",
    creator: "Fireship",
    youtubeId: "hwP7WQkmECE",
    externalUrl: null,
    language: "en",
    durationSeconds: 100,
    whyThisOne:
      "La vue d'ensemble de Git en 100 secondes chrono. Parfait comme révision express ou pour visualiser rapidement le modèle mental avant de plonger.",
    coversSkills: ["git-init-clone", "staging-commit"],
    displayOrder: 2,
  },
  {
    moduleId: M05_ID,
    isPrimary: 0,
    title: "Git Branches & Merging Tutorial",
    creator: "Fireship",
    youtubeId: "S9Do2p4PwtE",
    externalUrl: null,
    language: "en",
    durationSeconds: 8 * 60,
    whyThisOne:
      "Focus sur les branches et le merge — les deux opérations qui font peur aux débutants. Fireship va droit au but avec des exemples visuels clairs.",
    coversSkills: ["branches", "merge-rebase", "conflicts"],
    displayOrder: 3,
  },
];

export const m05Exercises: NewExercise[] = [
  {
    moduleId: M05_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de plonger : tes intuitions sur Git",
    statement:
      "Quiz d'activation pour situer ce que tu sais déjà de Git avant la théorie. Pas de mauvaise réponse — c'est pour calibrer.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Quelle est la différence entre git add et git commit ?",
        options: [
          "git add sauvegarde, git commit envoie sur GitHub",
          "git add prépare les changements dans la staging area, git commit crée un snapshot dans l'historique local",
          "Ce sont deux noms pour la même opération",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "La staging area (index) est une zone intermédiaire : tu choisis ce qui entre dans le prochain commit avec git add. git commit crée un nœud immuable dans le graphe.",
      },
      {
        question: "À quoi sert une branche Git ?",
        options: [
          "À créer une copie du projet dans un nouveau dossier",
          "À pointer vers un commit spécifique — les branches sont juste des pointeurs mobiles dans le graphe",
          "À sauvegarder sur un serveur distant",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Une branche est un simple fichier texte qui contient un hash de commit. Ce n'est pas une copie du projet — c'est un pointeur. HEAD pointe vers la branche courante.",
      },
      {
        question: "Tu as fait git reset --hard et perdu des commits. Que fais-tu ?",
        options: [
          "C'est perdu définitivement",
          "git reflog montre tous les états passés de HEAD — tu peux retrouver le hash et cherry-picker le commit",
          "git pull récupère tout depuis GitHub",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "git reflog est ta bouée de sauvetage. Git ne supprime pas immédiatement les objets orphelins — ils restent accessibles via reflog jusqu'au prochain garbage collect (30j par défaut).",
      },
    ],
    displayOrder: 1,
  },
  {
    moduleId: M05_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "bash",
    title: "Premier workflow complet",
    statement:
      "Crée un dépôt git local, ajoute un README.md, fais un premier commit `feat: initial commit`, crée une branche `feat/hello`, ajoute un hello.js, fais 2 commits sur cette branche, puis merge dans main. Vérifie que git log --oneline --graph affiche l'historique complet.",
    starterCode:
      "# Dans ton terminal :\nmkdir mon-projet && cd mon-projet\ngit init\n# Continue...",
    solutionCode:
      "git init\necho '# Mon Projet' > README.md\ngit add README.md\ngit commit -m 'feat: initial commit'\ngit switch -c feat/hello\necho 'console.log(\"hello\")' > hello.js\ngit add hello.js\ngit commit -m 'feat: add hello script'\ngit switch main\ngit merge feat/hello\ngit log --oneline --graph",
    expectedOutput: "* feat: add hello script\n* feat: initial commit",
    testsCode: null,
    quizQuestions: null,
    displayOrder: 2,
  },
  {
    moduleId: M05_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "bash",
    title: "Récupération via reflog",
    statement:
      "Fais 3 commits dans un dépôt, puis git reset --hard HEAD~2 pour 'perdre' 2 commits. Ensuite retrouve-les avec git reflog et cherry-pick le dernier commit perdu sur main.",
    starterCode:
      "# Simule le désastre\ngit init && echo a > a.txt && git add . && git commit -m 'A'\necho b > b.txt && git add . && git commit -m 'B'\necho c > c.txt && git add . && git commit -m 'C'\ngit reset --hard HEAD~2\n# Maintenant récupère C...",
    solutionCode:
      "# git reflog pour trouver le hash de C\ngit reflog\n# Copier le hash, puis :\ngit cherry-pick <hash-de-C>",
    expectedOutput: "C récupéré dans l'historique",
    testsCode: null,
    quizQuestions: null,
    displayOrder: 3,
  },
];
