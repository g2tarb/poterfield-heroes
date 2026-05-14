import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content.js";

export const M02_ID = "m02-terminal-shell";

export const m02Module: NewModule = {
  id: M02_ID,
  moduleNumber: 2,
  phase: 1,
  title: "Terminal & Shell (Bash)",
  subtitle: "Le clavier du musicien du dev. Sans terminal, pas de prod.",
  pourquoi:
    "Le terminal est le clavier de musicien du dev. Tout ce qui se passe en backend, en serveur, en déploiement, en CI/CD, en Docker, en Git — tout vit dans un terminal. Si tu cliques pour gérer tes fichiers, tu ne pourras jamais déboguer un serveur Linux à 3h du matin. Maîtriser le shell, c'est apprendre à parler au système d'exploitation directement, automatiser le répétitif, et lire les scripts des autres devs. C'est le module qui sépare ceux qui suivent un tuto de ceux qui résolvent des problèmes.",
  objectives: [
    "Naviguer dans une arborescence Unix (cd, pwd, ls)",
    "Manipuler fichiers et dossiers en CLI (cp, mv, rm, mkdir, touch, ln)",
    "Lire et filtrer du texte (cat, less, head, tail, grep, wc)",
    "Comprendre les permissions Unix (rwx, chmod symbolique et octal)",
    "Utiliser pipes | et redirections > >> < 2>&1",
    "Manipuler les variables d'environnement ($PATH, $HOME, .bashrc)",
    "Écrire un script bash avec shebang, variables, conditions, boucles",
    "Passer des arguments ($1, $2, $@, $#) et lire l'entrée utilisateur",
    "Comprendre codes de retour ($?), set -e, set -u, trap",
    "Utiliser sed, awk et grep pour manipuler du texte",
    "Gérer les processus (ps, top, htop, kill, jobs, &, nohup)",
    "Utiliser SSH (scp, rsync) pour serveur distant",
    "Automatiser une tâche récurrente via cron",
    "Maîtriser 5+ raccourcis clavier qui changent la vie (Ctrl+R, Ctrl+A, !!)",
  ],
  prerequisites:
    "Module 1 (notion de système d'exploitation). Setup machine fait (terminal + WSL2 si Windows).",
  estimatedHours: 35,
  estimatedWeeks: 2,
  stackAllowed: ["bash", "Utilitaires Unix natifs", "ShellCheck"],
  prereqModuleId: "m01-comment-fonctionne-le-web",
  unlockSrsMatureRatio: 80,
};

export const m02Skills: NewSkill[] = [
  {
    moduleId: M02_ID,
    slug: "navigation",
    label: "Naviguer une arborescence Unix (cd, pwd, ls -lah)",
    displayOrder: 1,
    weight: 1,
  },
  {
    moduleId: M02_ID,
    slug: "files",
    label: "Manipuler fichiers (cp, mv, rm, mkdir, touch, ln, find)",
    displayOrder: 2,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "text",
    label: "Lire et filtrer du texte (cat, grep, head, tail, less, wc)",
    displayOrder: 3,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "permissions",
    label: "Comprendre les permissions Unix (rwx, chmod, chown, umask)",
    displayOrder: 4,
    weight: 3,
  },
  {
    moduleId: M02_ID,
    slug: "pipes-redirect",
    label: "Maîtriser pipes et redirections (|, >, >>, <, 2>&1, tee)",
    displayOrder: 5,
    weight: 3,
  },
  {
    moduleId: M02_ID,
    slug: "env",
    label: "Variables d'environnement ($PATH, .bashrc, export)",
    displayOrder: 6,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "scripting",
    label: "Écrire un script bash robuste (shebang, set -euo pipefail)",
    displayOrder: 7,
    weight: 3,
  },
  {
    moduleId: M02_ID,
    slug: "args",
    label: "Arguments script ($1..$@, $#, getopts) et entrée user (read)",
    displayOrder: 8,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "exit-codes",
    label: "Codes de retour ($?), gestion d'erreurs (set -e, trap)",
    displayOrder: 9,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "text-tools",
    label: "Manipuler texte avancé (sed, awk, sort, uniq, cut)",
    displayOrder: 10,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "processes",
    label: "Gérer les processus (ps, top, htop, kill, jobs, nohup)",
    displayOrder: 11,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "ssh",
    label: "SSH, scp, rsync pour accès distant",
    displayOrder: 12,
    weight: 2,
  },
  {
    moduleId: M02_ID,
    slug: "cron",
    label: "Automatiser via cron (crontab -e)",
    displayOrder: 13,
    weight: 1,
  },
  {
    moduleId: M02_ID,
    slug: "shortcuts",
    label: "Raccourcis clavier vitaux (Ctrl+R, Ctrl+A, !!, Tab)",
    displayOrder: 14,
    weight: 1,
  },
];

export const m02SkillAxisRules: Array<{
  skillSlug: string;
  axisId: string;
  contribution: number;
}> = m02Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "fundamentals",
  contribution: 100,
}));

export const m02Videos: NewVideo[] = [
  {
    moduleId: M02_ID,
    isPrimary: 1,
    title: "The Complete Bash Scripting Course – Full Length Guide",
    creator: "Dave Eddy / ysap.sh",
    youtubeId: "Sx9zG7wa4FA",
    language: "en",
    durationSeconds: 7 * 60 * 60,
    whyThisOne:
      "Dave Eddy est un vétéran qui a écrit des milliers de scripts bash en production. Dense, sans bullshit, du débutant à l'avancé. Référence YouTube actuelle.",
    coversSkills: [
      "navigation",
      "files",
      "text",
      "pipes-redirect",
      "scripting",
      "args",
      "exit-codes",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M02_ID,
    isPrimary: 0,
    title: "Formation Linux pour débuter (FR)",
    creator: "Xavki",
    externalUrl:
      "https://www.youtube.com/playlist?list=PLn6POgpklwWp1yRsq3-PyyisSIDg94ct9",
    language: "fr",
    whyThisOne:
      "Couvre toute la base Linux + bash en français par un sysadmin reconnu. Format court (5-15 min), idéal pour suivre en codant.",
    coversSkills: ["navigation", "files", "permissions"],
    displayOrder: 2,
  },
  {
    moduleId: M02_ID,
    isPrimary: 0,
    title: "Linux File Permissions Explained (chmod, chown, umask, SUID...)",
    creator: "TechWorld with Nana",
    youtubeId: "Z3_4RmYTO7s",
    language: "en",
    durationSeconds: 12 * 60,
    whyThisOne:
      "Dave Eddy survole les permissions. Or elles te feront le plus galérer en prod (SSH refusées, web qui ne sert pas, scripts non exécutables).",
    coversSkills: ["permissions"],
    displayOrder: 3,
  },
  {
    moduleId: M02_ID,
    isPrimary: 0,
    title: "Linux Crash Course – sed & awk",
    creator: "Learn Linux TV",
    language: "en",
    durationSeconds: 40 * 60,
    whyThisOne:
      "sed et awk sont les armes secrètes pour parser des logs, transformer fichiers, chirurgie JSON/CSV.",
    coversSkills: ["text-tools"],
    displayOrder: 4,
  },
  {
    moduleId: M02_ID,
    isPrimary: 0,
    title: "SSH Tutorial for Beginners",
    creator: "NetworkChuck",
    language: "en",
    durationSeconds: 30 * 60,
    whyThisOne:
      "SSH, clés publiques/privées, scp, rsync utilisés chaque jour pour accéder à tes VPS Render/Hostinger.",
    coversSkills: ["ssh"],
    displayOrder: 5,
  },
];

export const m02Exercises: NewExercise[] = [
  {
    moduleId: M02_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant le bain : que sais-tu du terminal ?",
    statement: "Quiz d'activation rapide pour calibrer.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "À ton avis, que fait `ls -lah` ? Cite au moins 2 différences avec un simple `ls`.",
        explanation:
          "`-l` = format long (permissions, taille, date, owner). `-a` = inclut les fichiers cachés (commençant par .). `-h` = tailles human-readable (K, M, G au lieu d'octets bruts).",
      },
      {
        question:
          "Tu lances une commande qui plante. Comment savoir si elle a réussi ou échoué sans relire l'output ?",
        options: [
          "Regarder dans /var/log",
          "Utiliser echo $? juste après",
          "Relancer la commande",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Chaque commande retourne un code de sortie (0 = succès, ≠0 = erreur). $? contient le dernier. C'est la base du chaînage et du flow control.",
      },
    ],
    skillSlugs: ["navigation", "exit-codes"],
    passThresholdPct: 0,
    estimatedMinutes: 5,
    displayOrder: 1,
  },
  {
    moduleId: M02_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification post-vidéo",
    statement: "Quiz sur les concepts clés. Seuil : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Que signifient les permissions `rwxr-x---` en octal ?",
        options: ["750", "755", "740", "770"],
        correctIndex: 0,
        explanation:
          "rwx = 7 (user). r-x = 5 (group). --- = 0 (other). Donc 750.",
      },
      {
        question: "Quelle est la différence entre `>` et `>>` ?",
        options: [
          "Aucune, alias",
          "`>` écrase le fichier, `>>` ajoute à la fin",
          "`>` redirige stdout, `>>` redirige stderr",
          "`>>` est plus rapide",
        ],
        correctIndex: 1,
        explanation:
          "`>` truncate puis écrit (écrase). `>>` append (ajoute en fin). Source de drama si confondus.",
      },
      {
        question:
          "Comment faire qu'un script bash s'arrête à la première erreur ?",
        options: [
          "set -e",
          "set -x",
          "exit 1 en haut",
          "set --abort",
        ],
        correctIndex: 0,
        explanation:
          "`set -e` (errexit) stoppe au premier exit code non-zéro. Combiné avec `-u` (unset vars) et `-o pipefail`, c'est le strict mode bash recommandé.",
      },
      {
        question:
          "Tu veux exécuter `mon-script.sh` qui n'est pas exécutable. Que fais-tu ?",
        options: [
          "chmod +x mon-script.sh puis ./mon-script.sh",
          "bash mon-script.sh",
          "Les deux marchent",
          "Aucun",
        ],
        correctIndex: 2,
        explanation:
          "chmod +x donne le droit d'exécution (préféré pour usage récurrent). `bash script.sh` exécute via l'interpréteur sans avoir besoin du flag exécutable. Les 2 sont valides selon contexte.",
      },
    ],
    skillSlugs: [
      "permissions",
      "pipes-redirect",
      "scripting",
      "exit-codes",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 2,
  },
  {
    moduleId: M02_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "bash",
    title: "Mon premier toolkit shell — 5 scripts utiles",
    statement: `Créer un repo \`mon-toolkit-shell\` contenant 5 scripts bash autonomes qui résolvent des problèmes réels de dev. Tous robustes (\`set -euo pipefail\`), documentés, ShellCheck-clean.

**Scripts à coder :**

1. **backup.sh** — prend un dossier source + destination, crée une archive .tar.gz horodatée. Vérifie les chemins. Affiche taille.

2. **cleanup-downloads.sh** — analyse ~/Downloads, liste fichiers > 30 jours, demande confirmation, déplace dans ~/.cleanup-trash/[date]/. Compte fichiers + espace récupéré.

3. **server-health.sh** — mini-dashboard système : uptime, charge CPU, RAM, disque /, top 5 process CPU. Sortie colorée (vert/orange/rouge).

4. **bulk-rename.sh** — prend un dossier, renomme selon pattern. Gère espaces, dry-run par défaut, flag --apply pour exécuter.

5. **log-summary.sh** — prend un access log (style Apache/Nginx), sort résumé : total requêtes, top 10 IPs, top 10 URLs, répartition status codes 2xx/3xx/4xx/5xx. Utilise grep + awk + sort + uniq.

**Critères de réussite :**
- Shebang \`#!/usr/bin/env bash\` + \`set -euo pipefail\` sur les 5
- Fonction \`usage()\` qui s'affiche si pas d'args ou -h
- ShellCheck passe sans warning
- README documente chaque script
- chmod +x sur les 5
- Tu peux expliquer chaque ligne de tête

**Stack imposée :** bash + utilitaires Unix natifs uniquement. Pas de Python, pas de Node.`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "scripting",
      "args",
      "exit-codes",
      "text-tools",
      "pipes-redirect",
    ],
    passThresholdPct: 100,
    estimatedMinutes: 15 * 60,
    displayOrder: 3,
  },
];
