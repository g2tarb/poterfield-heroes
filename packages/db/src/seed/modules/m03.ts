import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

export const M03_ID = "m03-git-github";

export const m03Module: NewModule = {
  id: M03_ID,
  moduleNumber: 3,
  phase: 1,
  title: "Git & GitHub",
  subtitle: "La machine à voyager dans le temps de ton code.",
  pourquoi:
    "Git est la machine à voyager dans le temps de ton code. Sans Git, tu ne peux pas travailler en équipe, contribuer à de l'open source, déployer en CI/CD, faire du code review, ni revenir en arrière. GitHub est la place de marché du dev moderne — ton profil GitHub est ton vrai CV.",
  objectives: [
    "Différencier Git (outil) de GitHub (plateforme)",
    "Cycle complet : status, diff, add, commit, push",
    "Branches : create, switch, merge, rebase",
    "Résoudre conflits de merge à la main",
    "Pull Request : créer, review, merge",
    "Récupération : reset (soft/mixed/hard), revert, reflog",
    "Manipuler historique : log, rebase -i, squash",
    "Stash, cherry-pick, tags",
    "SSH GitHub sans mot de passe",
    "Convention de commits (Conventional Commits)",
    ".gitignore strict (jamais commit .env / node_modules / clés)",
    "Trunk-based vs GitFlow",
    "Récupération de désastre (effacer un secret de l'historique)",
    "Workflow fork → PR → review → merge",
    "Tags + releases GitHub",
    "git bisect pour identifier un commit fautif",
  ],
  prerequisites: "Module 1 (notion de serveur) et Module 2 (terminal CLI)",
  estimatedHours: 24,
  estimatedWeeks: 2,
  stackAllowed: ["git", "GitHub", "Learn Git Branching", "Oh My Git"],
  prereqModuleId: "m02-terminal-shell",
  unlockSrsMatureRatio: 80,
};

export const m03Skills: NewSkill[] = [
  { moduleId: M03_ID, slug: "git-vs-github", label: "Distinguer Git (outil) et GitHub (plateforme)", displayOrder: 1, weight: 1 },
  { moduleId: M03_ID, slug: "three-zones", label: "Comprendre les 3 zones : working dir, staging, repo", displayOrder: 2, weight: 3 },
  { moduleId: M03_ID, slug: "basic-cycle", label: "Cycle status → diff → add → commit → push", displayOrder: 3, weight: 3 },
  { moduleId: M03_ID, slug: "commit-messages", label: "Conventional Commits (feat, fix, refactor)", displayOrder: 4, weight: 2 },
  { moduleId: M03_ID, slug: "branches", label: "Branches : create, switch, merge, delete", displayOrder: 5, weight: 3 },
  { moduleId: M03_ID, slug: "merge-vs-rebase", label: "Différence merge / rebase + quand utiliser quoi", displayOrder: 6, weight: 3 },
  { moduleId: M03_ID, slug: "conflicts", label: "Résoudre un conflit de merge à la main", displayOrder: 7, weight: 3 },
  { moduleId: M03_ID, slug: "remotes", label: "Travailler avec remotes : fetch, pull, push, tracking", displayOrder: 8, weight: 2 },
  { moduleId: M03_ID, slug: "pull-requests", label: "Workflow Pull Request (fork → PR → review → merge)", displayOrder: 9, weight: 3 },
  { moduleId: M03_ID, slug: "undo", label: "Récupération : reset (soft/mixed/hard), revert, restore", displayOrder: 10, weight: 3 },
  { moduleId: M03_ID, slug: "reflog", label: "git reflog = parachute ultime", displayOrder: 11, weight: 2 },
  { moduleId: M03_ID, slug: "rewrite-history", label: "rebase -i : squash, reword, edit, drop", displayOrder: 12, weight: 2 },
  { moduleId: M03_ID, slug: "stash-cherry", label: "stash, cherry-pick, tag", displayOrder: 13, weight: 1 },
  { moduleId: M03_ID, slug: "ssh-keys", label: "Configurer SSH GitHub", displayOrder: 14, weight: 1 },
  { moduleId: M03_ID, slug: "gitignore", label: ".gitignore et secrets à JAMAIS commit", displayOrder: 15, weight: 3 },
  { moduleId: M03_ID, slug: "remove-secrets", label: "Effacer un secret de l'historique (git filter-repo)", displayOrder: 16, weight: 2 },
];

export const m03SkillAxisRules = m03Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "git",
  contribution: 100,
}));

export const m03Videos: NewVideo[] = [
  {
    moduleId: M03_ID,
    isPrimary: 1,
    title: "Comprendre Git — Formation complète",
    creator: "Grafikart (Jonathan Boyer)",
    externalUrl: "https://grafikart.fr/formations/git",
    language: "fr",
    durationSeconds: 3 * 60 * 60 + 30 * 60,
    whyThisOne:
      "LA référence francophone du dev web. Série Git pas-à-pas avec exemples concrets et débit pédagogique idéal pour débutant.",
    coversSkills: ["basic-cycle", "branches", "merge-vs-rebase", "conflicts", "pull-requests"],
    displayOrder: 1,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Git for Professionals – Free Version Control Course",
    creator: "Tobias Günther / freeCodeCamp",
    youtubeId: "Uszj_k0DGsg",
    language: "en",
    durationSeconds: 60 * 60 + 9 * 60,
    whyThisOne:
      "Passe de 'j'utilise Git' à 'je comprends Git'. Crafting perfect commit, branching strategies, rebase interactif.",
    coversSkills: ["rewrite-history", "merge-vs-rebase", "undo"],
    displayOrder: 2,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Learn Git Branching (FR)",
    creator: "Peter Cottle",
    externalUrl: "https://learngitbranching.js.org/?locale=fr_FR",
    language: "fr",
    whyThisOne:
      "OBLIGATOIRE : visualiseur interactif Git. Tu tapes des commandes Git réelles, tu vois les branches bouger. Tous les niveaux locaux avant le projet.",
    coversSkills: ["branches", "merge-vs-rebase", "rewrite-history"],
    displayOrder: 3,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Comparing Git Workflows (Trunk-based, GitFlow)",
    creator: "Atlassian",
    externalUrl: "https://www.atlassian.com/git/tutorials/comparing-workflows",
    language: "en",
    whyThisOne:
      "Pour comprendre pourquoi telle équipe travaille comme ça. Lecture 30min, incontournable.",
    coversSkills: ["pull-requests"],
    displayOrder: 4,
  },
];

export const m03Exercises: NewExercise[] = [
  {
    moduleId: M03_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : reset, revert, rebase, merge",
    statement: "Quiz sur les zones grises. Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Tu as fait 3 commits non poussés. Tu veux supprimer les 2 derniers mais garder le premier. Commande ?",
        options: ["git reset --hard HEAD~2", "git revert HEAD~2", "git rebase -i HEAD~3 puis drop", "git reset --soft HEAD~2"],
        correctIndex: 0,
        explanation: "reset --hard HEAD~2 reset le HEAD 2 commits en arrière ET détruit les modifs. Si tu veux garder les modifs en staging, --soft. revert crée un commit d'annulation (safe pour branches partagées). rebase -i marche aussi mais plus complexe.",
      },
      {
        question: "Différence merge vs rebase ?",
        options: ["Aucune", "merge crée un commit de merge, rebase rejoue tes commits sur l'autre branche (historique linéaire)", "rebase est plus rapide", "merge supprime les branches"],
        correctIndex: 1,
        explanation: "merge préserve l'historique réel (avec commit de merge). rebase réécrit l'historique pour le rendre linéaire. JAMAIS rebase une branche partagée.",
      },
      {
        question: "Tu as accidentellement supprimé une branche locale avec 2 jours de travail. Récupérable ?",
        options: ["Non, perdu", "Oui via git reflog", "Oui via git restore", "Seulement si poussée"],
        correctIndex: 1,
        explanation: "git reflog garde TOUTES tes actions Git locales (jusqu'à 90 jours). Tu retrouves le SHA du dernier commit de la branche et tu fais git checkout -b <branche> <SHA>.",
      },
    ],
    skillSlugs: ["undo", "merge-vs-rebase", "reflog"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M03_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "bash",
    title: "Mon repo de la vraie vie + team simulation",
    statement: `Deux repos :

**A. apprentissage-dev-fullstack** (à garder à vie)
- Repo public, journal des modules
- Dossier par module avec fichiers produits
- .gitignore propre (.DS_Store, node_modules, .env)

**B. git-team-simulation** (le vrai test)
1. app.js simple avec fonction de calcul
2. 4 branches : feature/login, feature/dashboard, bugfix/typo, hotfix/critical
3. Provoquer des conflits volontaires avec main
4. Merger chaque branche via PR (description, self-review, merge)
5. feature/dashboard : rebase -i pour squash 3 commits en 1 avant merge
6. hotfix/critical : résoudre conflit à la main
7. git revert sur un commit déjà mergé sur main
8. git cherry-pick d'un commit
9. \`git log --oneline --graph --all\` screenshot dans README

**C. Récupération de désastre**
1. Commit volontaire d'un secret (\`API_KEY=fake_secret_123\`)
2. Push
3. Nettoyer l'historique (git filter-repo ou rebase -i)
4. Force-push (avec --force-with-lease)
5. Vérifier que \`git log -p | grep API_KEY\` ne retourne rien

Stack imposée : Git CLI uniquement.`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["pull-requests", "conflicts", "rewrite-history", "remove-secrets"],
    passThresholdPct: 100,
    estimatedMinutes: 14 * 60,
    displayOrder: 2,
  },
];
