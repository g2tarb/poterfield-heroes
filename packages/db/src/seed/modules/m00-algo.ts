import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

/**
 * M00 — Algorithmie & Structures de Données (MODULE TRANSVERSAL).
 *
 * Particularités :
 * - moduleNumber: 0 → préfixe symbolique "fondation parallèle", placé EN TÊTE,
 *   avant M01. Anti-procrastination : tu ne le repousses pas à plus tard.
 * - phase: 9 → convention "transversal", hors zigzag chaîné.
 * - prereqModuleId: null → accessible dès J1, en parallèle des autres modules.
 * - 18 skills cette livraison (bases solides ~250h). Le reste (DP avancé,
 *   graphes complets, sliding window, KMP, segment trees, prep 42/C natif)
 *   sera ajouté dans des sprints suivants.
 *
 * Sandbox : JS/TS et Python disponibles (cohérent avec le reste de Porterfield).
 * La sandbox C arrive plus tard (Docker éphémère + gcc). En attendant, les
 * exos C de la prep 42 se font localement avec ton gcc.
 */
export const M00_ID = "m00-algo-structures-donnees";

export const m00Module: NewModule = {
  id: M00_ID,
  moduleNumber: 0,
  phase: 9,
  title: "Algorithmie & Structures de Données",
  subtitle:
    "Module transversal — à travailler en parallèle des autres dès J1. Bases solides pour entretiens tech et prep 42.",
  pourquoi: `Les 25 autres modules t'apprennent à **construire** des applications. Celui-ci t'apprend à **raisonner** sur ce que tu construis.

Sans algo, tu codes au feeling, tes solutions marchent par chance, et tu te fais éclater en entretien dès qu'on te demande "et si on a 10 millions d'éléments au lieu de 100 ?". Sans algo, tu ne passes pas la piscine 42, tu ne franchis pas les filtres de Stripe / Datadog / Google. Sans algo, tu codes du O(n²) en pensant que c'est du O(n) et tes serveurs ramassent à 18h chaque jour sans que tu saches pourquoi.

**Ce module est volontairement transversal** : tu le commences dès le jour 1 et il t'accompagne pendant 12 mois en parallèle des autres. Pas de verrouillage. 1 skill par semaine, c'est l'objectif minimal. Plus si tu as un entretien dans 3 mois.

L'objectif **n'est pas** de devenir un Codeforces grandmaster. C'est de :
1. Comprendre la complexité de ton propre code (analyse Big-O en lisant du JS quotidien)
2. Choisir la bonne structure de données pour un problème (array vs set vs map vs heap)
3. Implémenter à la main les algos classiques (sorts, search, BFS/DFS) pour intégrer les patterns
4. Passer les entretiens techniques sans trembler (LeetCode Easy + Medium, 30 minutes)
5. Préparer la piscine 42 si tu vises cette école (la 2e partie de ce module ajoutera du C natif)

**Format** : 18 skills cette livraison (bases ~250h), 30-40 au total à terme (cursus 42-grade ~600h).`,
  objectives: [
    "Analyser la complexité Big-O d'un algorithme donné en lisant du JS",
    "Maîtriser O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!) et leur hiérarchie",
    "Écrire une fonction récursive avec base case correct et trace mentale du call stack",
    "Mémoïser une récursion exponentielle pour la rendre linéaire",
    "Implémenter à la main : tableau dynamique, linked list, stack, queue, hashmap",
    "Implémenter et choisir entre : bubble, insertion, merge, quick, heap sort",
    "Implémenter binary search correctement (sans off-by-one ni infinite loop)",
    "Implémenter un BST avec insert, search, delete, traversal in/pre/post/level",
    "Implémenter BFS et DFS sur arbres et graphes (récursif + itératif)",
    "Détecter un cycle dans un graphe via visited set",
    "Choisir entre récursion / iteration / DP selon le problème",
    "Résoudre 30 problèmes LeetCode Easy sans aide en moins de 20 min chacun",
    "Justifier oralement la complexité spatiale et temporelle de ta solution",
  ],
  prerequisites:
    "Aucun. À démarrer en parallèle de M1 dès J1. 1 skill / semaine minimum. Crayon + papier recommandés pour les premiers tracés mentaux.",
  estimatedHours: 250,
  estimatedWeeks: 30,
  stackAllowed: [
    "JavaScript / TypeScript (sandbox CodeMirror+Worker)",
    "Python (sandbox Pyodide)",
    "Pseudo-code (carnet)",
    "Crayon / papier (tracés de récursion et arbres)",
  ],
  prereqModuleId: null,
  unlockSrsMatureRatio: 80,
};

export const m00Skills: NewSkill[] = [
  {
    moduleId: M00_ID,
    slug: "big-o-intuition",
    label: "Sentir la complexité avant de la calculer",
    description:
      "Avant la notation : développer l'intuition. Si tu doubles l'input, est-ce que ton algo prend 2× plus, 4× plus, ou la même chose ? L'analogie de l'élève qui range ses fiches.",
    displayOrder: 1,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "big-o-notation",
    label: "Notation Big-O formelle et hiérarchie",
    description:
      "O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!). Pourquoi log n est presque comme constant. Pourquoi n² casse à 10 000 éléments. Pourquoi 2ⁿ casse à 30.",
    displayOrder: 2,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "analyze-complexity",
    label: "Analyser la complexité d'un code donné",
    description:
      "Compter les boucles. Boucles imbriquées = produit. Récursion = arbre d'appels. Calculer la complexité temporelle ET spatiale d'un snippet.",
    displayOrder: 3,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "recursion-mental-model",
    label: "Modèle mental de la récursion",
    description:
      "Call stack, base case, problème plus petit. Pourquoi la récursion fonctionne. Comment tracer mentalement un appel récursif. Les 2 questions à se poser à chaque récursion.",
    displayOrder: 4,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "recursion-patterns",
    label: "Patterns récursifs classiques",
    description:
      "Factorielle, Fibonacci, Tower of Hanoi, traversées d'arbre. Reconnaître le pattern divide & conquer.",
    displayOrder: 5,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "memoization-basics",
    label: "Mémoïsation : tuer la récursion exponentielle",
    description:
      "Fibonacci naïf = O(2ⁿ). Avec mémoïsation = O(n). Le top-down DP en 5 minutes. Introduction conceptuelle au DP avant le module avancé.",
    displayOrder: 6,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "arrays-internals",
    label: "Tableaux dynamiques : sous le capot",
    description:
      "Comment Array de JS / list de Python fonctionnent réellement. Capacité vs taille. Croissance par doublement = append amorti O(1). Accès O(1) par index, insertion au milieu O(n).",
    displayOrder: 7,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "linked-lists",
    label: "Linked lists : simple, double, circulaire",
    description:
      "Différence array vs liste chaînée. Implémenter en JS et Python. Insertion / suppression en O(1) à la tête, O(n) ailleurs. Cas d'usage réels (LRU cache).",
    displayOrder: 8,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "stacks",
    label: "Stack (LIFO) — implem + applications",
    description:
      "Push / pop / peek en O(1). Applications : équilibrage de parenthèses, undo/redo, conversion infix→postfix, DFS itératif. Implem à la main en JS et Python.",
    displayOrder: 9,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "queues",
    label: "Queue (FIFO) — simple, double-ended, priorité",
    description:
      "Enqueue / dequeue en O(1) (avec linked list ou ring buffer). Applications : BFS, scheduling, message broker. Variante Deque. Aperçu Priority Queue (heap).",
    displayOrder: 10,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "hashmaps",
    label: "Hashmaps — hash, collisions, load factor",
    description:
      "Comment Map de JS / dict de Python fonctionnent. Hash function, distribution, collisions. Chaining vs open addressing. Load factor et resize. Pourquoi get/set = O(1) amorti.",
    displayOrder: 11,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "binary-search",
    label: "Binary search — l'algo le plus important du quotidien",
    description:
      "Prérequis : input trié. O(log n). Les 3 erreurs classiques (off-by-one, mid overflow, infinite loop). Variantes (lower_bound, upper_bound). Coder à la main 5 fois sans aide.",
    displayOrder: 12,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "sorting-elementary",
    label: "Tris élémentaires : bubble, insertion, selection",
    description:
      "Tous en O(n²). Implem à la main pour intégrer les patterns. Quand insertion sort bat O(n log n) (petits inputs, presque trié). Stable vs unstable.",
    displayOrder: 13,
    weight: 2,
  },
  {
    moduleId: M00_ID,
    slug: "sorting-merge",
    label: "Merge sort — divide & conquer",
    description:
      "O(n log n) garanti, stable. Demande O(n) mémoire supplémentaire. Implem complète + version externe pour les fichiers trop gros pour la RAM.",
    displayOrder: 14,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "sorting-quick",
    label: "Quicksort — partition et randomisation",
    description:
      "Avg O(n log n), worst O(n²). In-place. Pourquoi la randomisation du pivot. Implem Lomuto vs Hoare. C'est l'algo de sort par défaut dans la plupart des langages.",
    displayOrder: 15,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "trees-bst",
    label: "Arbres binaires + BST",
    description:
      "Vocabulaire : root, leaf, height, depth. BST property. Insertion / search / delete en O(log n) si équilibré, O(n) si dégénéré. Traversals : pre-order, in-order, post-order, level-order.",
    displayOrder: 16,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "bfs-dfs-trees",
    label: "BFS et DFS sur arbres",
    description:
      "BFS = queue, niveau par niveau. DFS = stack ou récursion, branche par branche. Implem itératif ET récursif des deux. Quand choisir l'un ou l'autre.",
    displayOrder: 17,
    weight: 3,
  },
  {
    moduleId: M00_ID,
    slug: "bfs-dfs-graphs",
    label: "BFS et DFS sur graphes",
    description:
      "Différence clé : visited set (sinon boucle infinie). Représentations : adjacency list vs matrix. Détection de cycle. BFS = shortest path en nombre d'arêtes.",
    displayOrder: 18,
    weight: 3,
  },
];

// Toutes les skills algo pointent à 100% vers le mastery axis "algorithms"
export const m00SkillAxisRules: Array<{
  skillSlug: string;
  axisId: string;
  contribution: number;
}> = m00Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "algorithms",
  contribution: 100,
}));

// =============================================================
// VIDÉOS — module principale + curation FR/EN
// IDs YouTube : vérifiés au mieux mais à valider d'un coup d'œil.
// Si une vidéo ne charge pas, c'est qu'elle a été dépubliée — remplace
// par une autre du même créateur ou laisse youtubeId: null avec externalUrl.
// =============================================================
export const m00Videos: NewVideo[] = [
  {
    moduleId: M00_ID,
    isPrimary: 1,
    title: "Data Structures and Algorithms in Python - Full Course",
    creator: "freeCodeCamp.org",
    youtubeId: "pkYVOmU3MgA",
    language: "en",
    durationSeconds: 12 * 60 * 60, // ~12h, demi-cursus en une vidéo
    whyThisOne:
      "Cours complet gratuit ~12h qui couvre toutes les bases ET du intermédiaire. Code en Python (lisible même si tu codes JS). Référence inattaquable.",
    coversSkills: [
      "big-o-notation",
      "arrays-internals",
      "linked-lists",
      "stacks",
      "queues",
      "hashmaps",
      "binary-search",
      "sorting-elementary",
      "sorting-merge",
      "sorting-quick",
      "trees-bst",
      "bfs-dfs-trees",
      "bfs-dfs-graphs",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M00_ID,
    isPrimary: 0,
    title: "Big-O Notation in 5 Minutes",
    creator: "Michael Sambol",
    youtubeId: "__vX2sjlpXU",
    language: "en",
    durationSeconds: 5 * 60,
    whyThisOne:
      "Si t'as 5 minutes pour comprendre Big-O et tu débloques 90% des cas pratiques. Animations claires. Idéal en première intro.",
    coversSkills: ["big-o-intuition", "big-o-notation"],
    displayOrder: 2,
  },
  {
    moduleId: M00_ID,
    isPrimary: 0,
    title: "Algorithms and Data Structures Tutorial - Full Course",
    creator: "freeCodeCamp.org / Pasan Premaratne, Jay McGavren",
    youtubeId: "8hly31xKli0",
    language: "en",
    durationSeconds: 5 * 60 * 60 + 22 * 60,
    whyThisOne:
      "Alternative complète (~5h) si la vidéo principale Python te lourde. Couvre tout en JS et exemples concrets.",
    coversSkills: [
      "big-o-notation",
      "analyze-complexity",
      "recursion-mental-model",
      "binary-search",
      "sorting-elementary",
      "sorting-merge",
      "sorting-quick",
    ],
    displayOrder: 3,
  },
  {
    moduleId: M00_ID,
    isPrimary: 0,
    title: "Recursion in Programming - Full Course",
    creator: "freeCodeCamp.org / Mike Dane",
    youtubeId: "IJDJ0kBx2LM",
    language: "en",
    durationSeconds: 1 * 60 * 60 + 39 * 60,
    whyThisOne:
      "Cours dédié récursion ~1h40. Tu en sors avec le mental model solide. Indispensable avant d'attaquer les arbres et graphes.",
    coversSkills: [
      "recursion-mental-model",
      "recursion-patterns",
      "memoization-basics",
    ],
    displayOrder: 4,
  },
  {
    moduleId: M00_ID,
    isPrimary: 0,
    title: "La récursivité expliquée simplement",
    creator: "Une Bière et Du Code",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=une+bi%C3%A8re+et+du+code+r%C3%A9cursivit%C3%A9",
    language: "fr",
    durationSeconds: 10 * 60,
    whyThisOne:
      "Source FR rapide pour ceux qui préfèrent réviser en français. Vérifie l'ID si tu le trouves.",
    coversSkills: ["recursion-mental-model", "recursion-patterns"],
    displayOrder: 5,
  },
];

// =============================================================
// EXERCISES — quiz + exos code
// =============================================================
export const m00Exercises: NewExercise[] = [
  {
    moduleId: M00_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de lire : tes intuitions sur la complexité",
    statement:
      "Petit quiz pour situer ton intuition avant de te plonger dans Big-O. Pas de bonne ou mauvaise réponse — c'est pour calibrer.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu cherches un nom dans un annuaire papier de 1000 pages. Tu connais 2 méthodes : feuilleter page par page, OU ouvrir au milieu et chercher dans la moitié pertinente. Combien de pages tu regardes au pire dans chaque cas ?",
        options: [
          "1000 vs 500",
          "1000 vs ~10",
          "1000 vs 100",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Linear search = 1000 pages. Binary search = log₂(1000) ≈ 10. C'est pour ça que les annuaires triés et binary search sont si efficaces — tu verras ça en détail.",
      },
      {
        question:
          "Si ton algo prend 1 seconde sur 100 éléments et 100 secondes sur 1000 éléments, à ton avis c'est :",
        options: [
          "O(n)",
          "O(n²)",
          "O(log n)",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "10× plus d'input → 100× plus de temps = O(n²). Si c'était O(n), 10× → 10×. Si O(log n), 10× → ~+30%.",
      },
      {
        question:
          "Tu dois trier 1 million de cartes à la main. Tu choisirais plutôt :",
        options: [
          "Comparer chaque paire (bubble sort)",
          "Découper en piles, trier chaque pile, fusionner (merge sort)",
          "Aucune idée mais ça va prendre longtemps",
        ],
        correctIndex: 1,
        explanation:
          "Merge sort fait n log n ≈ 20 millions d'opérations. Bubble sort fait n² = 10¹² opérations. C'est la différence entre 10 minutes et 10 années sur la même machine.",
      },
    ],
    skillSlugs: ["big-o-intuition", "binary-search", "sorting-merge"],
    passThresholdPct: 0,
    estimatedMinutes: 5,
    displayOrder: 1,
  },
  {
    moduleId: M00_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : as-tu intégré les bases ?",
    statement:
      "Quiz post-pratique sur Big-O, structures de base et récursion. Seuil 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Quelle est la complexité de `arr.includes(x)` sur un Array JS de taille n ?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 2,
        explanation:
          "`includes` parcourt linéairement. Pour du O(1) lookup, utilise un Set ou une Map.",
      },
      {
        question:
          "Combien d'appels récursifs naïfs fait `fib(30)` sans mémoïsation ?",
        options: [
          "Environ 30",
          "Environ 900",
          "Environ 1 million",
          "Environ 1 milliard",
        ],
        correctIndex: 2,
        explanation:
          "Fib naïf = O(2ⁿ). 2³⁰ ≈ 1,07 milliard. Mais en pratique l'arbre est moins équilibré, ~1,3 million d'appels. Avec mémoïsation : 30 appels.",
      },
      {
        question:
          "Pour vérifier si une chaîne `(())` a ses parenthèses équilibrées, quelle structure utilises-tu ?",
        options: ["Hashmap", "Stack", "Queue", "Linked list"],
        correctIndex: 1,
        explanation:
          "Stack : tu push à chaque '(' et pop à chaque ')'. Si stack vide à la fin et jamais un pop sur vide = équilibré.",
      },
      {
        question:
          "Quelle est la complexité moyenne d'un `get(key)` sur une hashmap (Map JS / dict Python) ?",
        options: ["O(1)", "O(log n)", "O(n)", "Ça dépend du langage"],
        correctIndex: 0,
        explanation:
          "O(1) amorti grâce au hash. Worst case O(n) si toutes les clés finissent dans le même bucket (collisions, attaque hash flooding), mais en pratique O(1).",
      },
      {
        question:
          "Binary search marche sur un tableau de 1 048 576 éléments triés. Au pire, combien de comparaisons ?",
        options: ["20", "1000", "1 048 576", "Ça dépend de l'input"],
        correctIndex: 0,
        explanation:
          "log₂(2²⁰) = 20. C'est la magie de log : 1 million → 20 comparaisons. Doubler l'input ajoute 1 comparaison.",
      },
      {
        question: "Quel sort est stable, in-place et garantit O(n log n) ?",
        options: [
          "Bubble sort",
          "Quicksort",
          "Merge sort (version classique)",
          "Heap sort",
          "Aucun des trois — il y a un trade-off",
        ],
        correctIndex: 4,
        explanation:
          "Trade-off classique : Merge sort = stable + O(n log n) mais PAS in-place (O(n) mémoire). Heap sort = in-place + O(n log n) mais PAS stable. Quicksort = in-place + souvent stable, mais worst O(n²). Pas d'algo parfait sur les 3 critères.",
      },
      {
        question:
          "BFS sur un graphe non-pondéré trouve quel type de chemin ?",
        options: [
          "Le plus court en nombre d'arêtes",
          "Le plus court en distance pondérée",
          "Un chemin random",
          "Tous les chemins possibles",
        ],
        correctIndex: 0,
        explanation:
          "BFS niveau par niveau = shortest path en nombre d'arêtes. Pour shortest path pondéré : Dijkstra (à venir dans un sprint ultérieur).",
      },
      {
        question:
          "Tu veux la médiane des 100 derniers éléments d'un flux. Quelle structure ?",
        options: [
          "Array",
          "Hashmap",
          "Deux heaps (max + min)",
          "Linked list",
        ],
        correctIndex: 2,
        explanation:
          "Problème classique d'entretien. Max-heap pour la moitié basse, min-heap pour la moitié haute, équilibrer. Insert et getMedian en O(log n). Heaps seront vus dans le sprint suivant.",
      },
    ],
    skillSlugs: [
      "big-o-notation",
      "analyze-complexity",
      "recursion-mental-model",
      "memoization-basics",
      "stacks",
      "hashmaps",
      "binary-search",
      "sorting-merge",
      "sorting-quick",
      "bfs-dfs-graphs",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 2,
  },
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Binary search — implem propre, 0 piège",
    statement: `Implémente \`binarySearch(arr, target)\` qui retourne l'index de \`target\` dans \`arr\` (déjà trié croissant), ou \`-1\` si absent.

**Contraintes :**
- O(log n) complexité temporelle
- O(1) complexité spatiale (pas de récursion, version itérative)
- Pas d'overflow sur \`mid\` (utilise \`left + Math.floor((right - left) / 2)\`, pas \`(left + right) / 2\`)
- Pas de boucle infinie sur arr de taille 1

**Tests attendus :**
\`\`\`js
binarySearch([1, 3, 5, 7, 9], 7) === 3
binarySearch([1, 3, 5, 7, 9], 1) === 0
binarySearch([1, 3, 5, 7, 9], 9) === 4
binarySearch([1, 3, 5, 7, 9], 4) === -1
binarySearch([], 5) === -1
binarySearch([42], 42) === 0
\`\`\`

**Critères de validation :**
- Tous les tests passent
- Complexité O(log n) (le coach va vérifier ta logique)
- Code lisible (variables \`left\`, \`right\`, \`mid\` claires)`,
    starterCode: `function binarySearch(arr, target) {
  // Ton implem ici
  return -1;
}

// Tests
console.log(binarySearch([1, 3, 5, 7, 9], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9], 1)); // 0
console.log(binarySearch([1, 3, 5, 7, 9], 9)); // 4
console.log(binarySearch([1, 3, 5, 7, 9], 4)); // -1
console.log(binarySearch([], 5));               // -1
console.log(binarySearch([42], 42));            // 0
`,
    solutionCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    expectedOutput: "3\n0\n4\n-1\n-1\n0",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["binary-search", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 25,
    displayOrder: 3,
  },
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Fibonacci mémoïsé — passer de 2ⁿ à n",
    statement: `Implémente \`fib(n)\` qui retourne le n-ième nombre de Fibonacci.

**3 versions à écrire (commenter les 2 premières en haut, garder la 3e active) :**

1. **Naïve récursive** : \`fib(n) = fib(n-1) + fib(n-2)\`. Marche mais ramasse à n=40.
2. **Mémoïsée (top-down DP)** : avec un cache \`{}\`.
3. **Itérative (bottom-up DP)** : 2 variables, O(1) mémoire.

**Mesure ton chrono :**
\`\`\`js
console.time("fib(40)"); fib(40); console.timeEnd("fib(40)");
\`\`\`

**Attendu :**
- Naïve : plusieurs secondes pour fib(40)
- Mémoïsée : < 1 ms pour fib(40)
- Itérative : < 1 ms pour fib(1000)

**Critères :**
- Les 3 versions retournent la même valeur pour n=0..30
- fib(50) doit terminer en < 1 seconde avec la mémoïsée
- fib(1000) doit terminer en < 1 seconde avec l'itérative
- Tu sais expliquer la complexité de chaque version`,
    starterCode: `// Version 1 — Naïve récursive (lente)
function fibNaive(n) {
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Version 2 — Mémoïsée (top-down DP)
function fibMemo(n, cache = {}) {
  // Ton implem ici
  return 0;
}

// Version 3 — Itérative (bottom-up DP, O(1) mémoire)
function fibIter(n) {
  // Ton implem ici
  return 0;
}

// Tests
console.log(fibNaive(20)); // 6765
console.log(fibMemo(50));  // 12586269025
console.log(fibIter(100)); // 354224848179261915075
console.time("memo");
fibMemo(40);
console.timeEnd("memo");
`,
    solutionCode: `function fibMemo(n, cache = {}) {
  if (n < 2) return n;
  if (cache[n] != null) return cache[n];
  cache[n] = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  return cache[n];
}

function fibIter(n) {
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "recursion-mental-model",
      "recursion-patterns",
      "memoization-basics",
      "analyze-complexity",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 4,
  },
  {
    moduleId: M00_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title: "Projet de validation : 30 LeetCode Easy + journal d'analyse",
    statement: `**Objectif :** Résoudre 30 problèmes LeetCode Easy en autonomie (tu peux regarder les hints, pas la solution), en mode chrono 20 min max par problème.

**À faire :**

1. **Sélectionner 30 problèmes LeetCode Easy** dans ces catégories (5 par cat) :
   - Arrays (ex: Two Sum, Best Time to Buy Stock, Move Zeroes, Contains Duplicate, Plus One)
   - Strings (ex: Valid Palindrome, Reverse String, First Unique Char, Roman to Integer)
   - Linked Lists (ex: Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle)
   - Stacks (ex: Valid Parentheses, Implement Queue using Stacks)
   - Hash Tables (ex: Two Sum, Group Anagrams, Valid Anagram)
   - Binary Search (ex: Binary Search, First Bad Version, Sqrt(x))

2. **Pour chaque problème, rédiger dans \`leetcode-journal.md\` :**
   - Titre + URL
   - Ton premier reflexe (avant de coder)
   - Ta solution (en JS, code + complexité)
   - Le temps que ça t'a pris
   - 1 ligne : ce que tu as appris

3. **Implémenter en bonus en JS pur (sans librairie) :**
   - Bubble sort
   - Insertion sort
   - Merge sort
   - Quicksort
   - Binary search (déjà fait dans l'exo précédent — copie-le)

4. **Refaire les mêmes 5 algos en Python** (sandbox Pyodide ou environnement local).

**Critères de validation :**
- \`leetcode-journal.md\` couvre les 30 problèmes
- Au moins 25/30 résolus sans regarder la solution
- 5 sorts implem en JS + Python (10 fichiers)
- Tu sais expliquer oralement la complexité de chaque solution
- Temps moyen ≤ 25 min par problème (signe que les patterns rentrent)

**Durée estimée :** 20-30h sur 4 semaines.`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "big-o-notation",
      "analyze-complexity",
      "arrays-internals",
      "linked-lists",
      "stacks",
      "hashmaps",
      "binary-search",
      "sorting-elementary",
      "sorting-merge",
      "sorting-quick",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 25 * 60,
    displayOrder: 5,
  },
];
