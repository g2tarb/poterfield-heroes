/**
 * Sprint B + C — contenu pédagogique markdown + ressources externes
 * pour les 6 premiers skills de M00 (Big-O ×3 + Recursion ×3).
 *
 * Les 12 autres skills (arrays-internals, linked-lists, ...) restent avec
 * contentMarkdown = null. Erwin clique "▶ Générer cette leçon" et Claude
 * Sonnet les écrit à la volée via /api/skills/:id/generate-lesson.
 */
import type { NewExternalResource } from "../../schema/content";

// =============================================================
// Contenu pédagogique markdown (Sprint B)
// Indexé par skill slug — appliqué via UPDATE skills SET content_markdown
// =============================================================
export const m00LessonContent: Record<string, string> = {
  "big-o-intuition": `## L'intuition avant la formule

Avant d'apprendre la notation, il faut **sentir** la complexité. Sinon Big-O reste une abstraction théorique.

### L'analogie de la pile de fiches

Tu as une pile de **1000 fiches** sur ton bureau et tu dois en trouver UNE précise.

- **Méthode A** : tu prends fiche par fiche du haut de la pile. Au pire, tu regardes les 1000.
- **Méthode B** : la pile est triée par nom. Tu ouvres au milieu, tu compares, tu jettes une moitié, tu recommences. Tu fais ~10 comparaisons max.
- **Méthode C** : tu as une boîte indexée alphabétiquement. Tu ouvres directement le bon tiroir. 1 action.

Ces 3 méthodes vont s'appeler **O(n)**, **O(log n)**, **O(1)**. Mais la formule n'est pas le sujet maintenant — **l'intuition c'est que la quantité d'effort n'a pas la même relation à la taille de l'input selon ce que tu fais.**

\`\`\`js
// O(1) — l'effort est INDÉPENDANT de la taille de l'array
function premierElement(arr) {
  return arr[0]; // 1 action, qu'il y ait 5 ou 5 millions d'éléments
}

// O(n) — l'effort GRANDIT proportionnellement à la taille
function contient(arr, x) {
  for (const e of arr) {  // pire cas : on regarde tout
    if (e === x) return true;
  }
  return false;
}
\`\`\`

### Pièges classiques

- **Ne confonds pas vitesse réelle et complexité.** Un O(n²) sur 10 éléments est plus rapide qu'un O(n log n) sur le même array. Big-O décrit le comportement **quand n grandit beaucoup**.
- **Ne raisonne pas en secondes.** O(n) ne dit pas "ça prend n secondes" — ça dit "le temps croît linéairement avec n".
- **Le pire cas n'est pas la moyenne.** Quicksort = O(n log n) en moyenne mais O(n²) sur un input adversarial.

### À écrire dans ton carnet

> Sans regarder, donne 2 exemples d'algos O(1), 2 exemples d'algos O(n), 2 exemples d'algos O(n²) que tu utilises au quotidien en JS.
`,

  "big-o-notation": `## La notation formelle Big-O

Big-O décrit **comment le coût d'un algorithme évolue quand la taille de l'input tend vers l'infini**. On ignore les constantes et les termes négligeables — on garde juste l'ordre de grandeur dominant.

### La hiérarchie à connaître par cœur

Du plus rapide au plus lent (n=1000 entre parenthèses) :

| Notation | Nom | Opérations pour n=1000 | Exemple |
|---|---|---|---|
| **O(1)** | Constant | 1 | \`arr[i]\`, \`map.get(k)\` |
| **O(log n)** | Logarithmique | ~10 | Binary search |
| **O(n)** | Linéaire | 1 000 | Boucle simple |
| **O(n log n)** | Linéarithmique | ~10 000 | Merge sort, Quicksort moyen |
| **O(n²)** | Quadratique | 1 000 000 | Boucles imbriquées naïves |
| **O(2ⁿ)** | Exponentiel | 10³⁰⁰ (univers) | Fibonacci récursif naïf |
| **O(n!)** | Factoriel | inutilisable | Brute force permutations |

### Règles de simplification

\`\`\`js
// 3n + 5 → O(n)             (on jette les constantes)
// n² + 10n → O(n²)          (le terme dominant gagne)
// O(2n) → O(n)              (la constante 2 ne change pas l'ordre)
// O(log₂ n) = O(log₁₀ n)    (la base du log ne compte pas en Big-O)
\`\`\`

### Pourquoi log n est presque comme constant

\`log₂(1 000 000) ≈ 20\`. \`log₂(1 milliard) ≈ 30\`. Doubler l'input ajoute **1 seule opération**. C'est pour ça que les structures équilibrées (B-trees, hashmaps, heaps) sont partout en prod.

### Pourquoi O(n²) casse vite

Sur 100 éléments → 10 000 ops (instantané). Sur 10 000 éléments → 100 millions ops (~1 seconde JS). Sur 1 million → 10¹² ops (~3 jours). C'est pour ça qu'on évite les boucles imbriquées sur des inputs utilisateur.

### Pièges classiques

- **Ne mélange pas temps et espace.** Un algo peut être O(n) en temps et O(n²) en mémoire (ou inversement).
- **Best/average/worst case ne sont pas la même chose.** Quicksort est O(n log n) en moyenne mais O(n²) sur un input adversarial.
- **Big-O = borne supérieure** (Big-Ω = borne inférieure, Big-Θ = bornes serrées). En entretien on parle toujours de Big-O, mais sache que les autres existent.

### À écrire dans ton carnet

> Pour chaque méthode JavaScript suivante, donne sa complexité : \`arr.push()\`, \`arr.unshift()\`, \`arr.includes()\`, \`map.set()\`, \`Object.keys(obj)\`, \`arr.sort()\`.
`,

  "analyze-complexity": `## Analyser un algorithme donné

Compétence ultra-pratique : on te jette 10 lignes de code, tu sors la complexité en 30 secondes.

### La méthode en 3 étapes

1. **Identifier la structure de contrôle dominante** (boucles, récursion, calls).
2. **Compter combien de fois chaque opération s'exécute** en fonction de \`n\` (la taille de l'input).
3. **Ne garder que le terme dominant** quand \`n → ∞\`.

### Exemples concrets

\`\`\`js
// Exemple 1 — boucle simple
function somme(arr) {
  let total = 0;          // O(1)
  for (const x of arr) {  // n itérations
    total += x;           // O(1) à chaque
  }
  return total;           // O(1)
}
// → O(1) + O(n) × O(1) + O(1) = O(n)

// Exemple 2 — boucles imbriquées
function trouvePaire(arr, target) {
  for (let i = 0; i < arr.length; i++) {        // n itérations
    for (let j = i + 1; j < arr.length; j++) {  // ~n itérations en moyenne
      if (arr[i] + arr[j] === target) return [i, j];
    }
  }
}
// → O(n) × O(n) = O(n²)

// Exemple 3 — boucles séquentielles (PAS imbriquées)
function process(arr) {
  for (const x of arr) doA(x);   // O(n)
  for (const x of arr) doB(x);   // O(n)
}
// → O(n) + O(n) = O(2n) = O(n)   (séquentiel = somme, pas produit !)
\`\`\`

### Le piège du O(n log n) qu'on rate souvent

\`\`\`js
function suspect(arr) {
  for (let i = 0; i < arr.length; i++) {    // O(n)
    const trie = [...arr].sort();           // O(n log n)
  }
}
// → O(n × n log n) = O(n² log n)   ← AÏE
\`\`\`

L'opération à l'intérieur de la boucle n'est PAS O(1) — c'est un sort en O(n log n). Toujours regarder le coût réel de chaque appel à l'intérieur d'une boucle.

### Complexité spatiale

Même méthode, mais on compte la **mémoire allouée**, pas le temps.

\`\`\`js
function double(arr) {
  return arr.map(x => x * 2); // O(n) temps + O(n) espace (nouvel array de taille n)
}

function doubleInPlace(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] *= 2; // O(n) temps + O(1) espace (modifie en place)
  }
}
\`\`\`

### Pièges classiques

- **La récursion consomme de la mémoire (call stack).** Une fonction récursive de profondeur \`n\` est O(n) en espace, même si elle a l'air "légère".
- **Les opérations cachées sur strings.** \`str + char\` en JS recréé une nouvelle string. Concaténer \`n\` fois = O(n²).
- **Les méthodes built-in ne sont pas magiques.** \`arr.includes()\` est O(n), \`set.has()\` est O(1). Choisis la bonne structure.

### À écrire dans ton carnet

> Prends ces 3 snippets et donne leur complexité temporelle ET spatiale :
> 1. \`arr.reverse()\` (en JS)
> 2. \`[...new Set(arr)]\` (dédupe)
> 3. \`arr.flat(Infinity)\` (aplatir un array imbriqué)
`,

  "recursion-mental-model": `## La récursion expliquée enfin

La récursion = une fonction qui s'appelle elle-même sur un **problème plus petit**, jusqu'à atteindre un **cas de base** qui retourne directement.

Si tu n'as jamais "cliqué" sur la récursion, c'est probablement parce qu'on t'a montré le code sans expliquer le **modèle mental**. On va corriger ça.

### Le modèle mental : la pile de plateaux

Imagine que tu travailles dans une cantine. On te passe une pile de 100 plateaux, on te dit "rends-les un par un en ordre inverse".

\`\`\`
function rendre(pile) {
  if (pile.estVide()) return;     // ← BASE CASE : on s'arrête
  const plateau = pile.pop();     // ← Tu enlèves UN plateau
  rendre(pile);                    // ← Tu passes le reste à toi-même
  console.log(plateau);            // ← Tu rends ce plateau APRÈS le retour
}
\`\`\`

Ce qui se passe dans ta tête :
1. Tu prends 1 plateau, tu le mets de côté
2. Tu te dis "le problème est maintenant : rendre 99 plateaux"
3. Tu refais l'étape 1 : tu prends 1 plateau, tu le mets sur celui d'avant
4. ... jusqu'à pile vide
5. Tu redescends la chaîne : tu rends les plateaux dans l'ordre inverse

C'est exactement comment la **call stack** du langage fonctionne.

### Les 2 questions à se poser à chaque récursion

\`\`\`js
function factoriel(n) {
  if (n <= 1) return 1;          // Q1 : quel est le BASE CASE ?
  return n * factoriel(n - 1);   // Q2 : comment je RÉDUIS le problème ?
}
\`\`\`

**Si tu ne sais pas répondre aux deux, ta récursion plantera** (boucle infinie ou stack overflow).

### Tracer mentalement factoriel(4)

\`\`\`
factoriel(4)
  → 4 * factoriel(3)
       → 3 * factoriel(2)
            → 2 * factoriel(1)
                 → 1               ← BASE CASE atteint
            → 2 * 1 = 2
       → 3 * 2 = 6
  → 4 * 6 = 24
\`\`\`

Note la forme en sablier : on descend (calls), on touche le fond (base), on remonte (returns).

### Pièges classiques

- **Pas de base case ou base case inatteignable** → stack overflow (\`RangeError: Maximum call stack size exceeded\` en JS, dur d'arrêt en C).
- **Réduction qui ne réduit pas vraiment.** \`factoriel(n)\` qui appelle \`factoriel(n)\` au lieu de \`factoriel(n-1)\` = boucle infinie.
- **Confondre récursion et itération.** Une récursion peut presque toujours être réécrite en boucle (et inversement). La récursion est plus lisible mais consomme la call stack — pas adapté pour des profondeurs > 10 000 en JS.

### À écrire dans ton carnet

> Écris à la main (sans IDE), une fonction \`sommeListe(arr, i = 0)\` qui retourne la somme des éléments via récursion. Trace mentalement \`sommeListe([3, 7, 2, 8])\` étape par étape avant de la coder.
`,

  "recursion-patterns": `## Les patterns récursifs classiques

Une fois la récursion comprise, tu reconnais 3-4 patterns qui reviennent partout. Quand tu vois un problème, tu te demandes : "lequel de ces patterns colle ?".

### Pattern 1 — Réduction linéaire (factoriel, somme, longueur)

> Le problème de taille n se résout en faisant 1 opération + appel sur taille n-1.

\`\`\`js
function factoriel(n) {
  if (n <= 1) return 1;
  return n * factoriel(n - 1);
}
// Complexité : O(n) temps, O(n) espace (call stack)
\`\`\`

### Pattern 2 — Divide & conquer (merge sort, binary search)

> Le problème de taille n se résout en le **divisant en 2 sous-problèmes de taille n/2**, puis en combinant.

\`\`\`js
function maxArray(arr, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];              // base : 1 élément
  const mid = Math.floor((left + right) / 2);
  const leftMax  = maxArray(arr, left, mid);         // moitié gauche
  const rightMax = maxArray(arr, mid + 1, right);    // moitié droite
  return Math.max(leftMax, rightMax);                 // combine
}
// Complexité : T(n) = 2T(n/2) + O(1) → O(n) temps
\`\`\`

### Pattern 3 — Récursion multiple (Fibonacci naïf, Tower of Hanoi)

> Le problème dépend de **plusieurs** sous-problèmes — souvent exponentiel.

\`\`\`js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);   // 2 appels par niveau
}
// Complexité : O(2ⁿ) — ramasse à n=40
\`\`\`

C'est ce pattern qui te ramène à la **mémoïsation** (skill suivant) pour le rendre praticable.

### Pattern 4 — Traversée d'arbre / graphe

> Le problème se résout en visitant la racine + appel récursif sur chaque enfant.

\`\`\`js
function compteFeuilles(node) {
  if (!node) return 0;
  if (!node.left && !node.right) return 1;          // base : c'est une feuille
  return compteFeuilles(node.left) + compteFeuilles(node.right);
}
\`\`\`

Tu retrouveras ce pattern dans BFS/DFS, parsing JSON imbriqué, traversée DOM, etc.

### Tower of Hanoi — l'exemple culte

3 piquets, n disques sur le 1er (du plus grand en bas au plus petit en haut). Déplace tous les disques sur le 3e piquet, sans jamais poser un grand sur un petit.

\`\`\`js
function hanoi(n, from = "A", via = "B", to = "C") {
  if (n === 0) return;
  hanoi(n - 1, from, to, via);   // déplace n-1 disques de A vers B (via C)
  console.log(\`\${from} → \${to}\`);
  hanoi(n - 1, via, from, to);    // déplace n-1 disques de B vers C (via A)
}
// hanoi(3) → 7 mouvements (2³-1)
// hanoi(64) → 18 millions d'années à 1 mvt/seconde — c'est dans la légende
\`\`\`

### Pièges classiques

- **Identifier le mauvais pattern.** Un problème de traversée d'arbre attaqué comme un divide & conquer ne marchera pas (pas de "milieu").
- **Réécrire en boucle quand la profondeur dépasse 1000-10000.** JS limite la call stack à ~10 000. Python à ~1000 (modifiable).
- **Oublier que la récursion multiple explose.** Si tu vois 2 appels récursifs sans mémoïsation, attends-toi à du O(2ⁿ).

### À écrire dans ton carnet

> Classe ces problèmes par pattern (1/2/3/4) : "calculer 2ⁿ", "trouver un mot dans un dictionnaire trié", "lister tous les fichiers d'un dossier récursivement", "générer toutes les permutations d'une string".
`,

  "memoization-basics": `## Mémoïsation : tuer la récursion exponentielle

La récursion naïve est élégante mais peut exploser en O(2ⁿ). La mémoïsation est l'astuce qui transforme un algo "inutilisable" en O(n) sans changer la logique. C'est aussi ta première approche du **DP top-down**.

### Le problème : Fibonacci naïf

\`\`\`js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

fib(40); // ~30 secondes en JS
fib(50); // tu n'auras pas la patience
\`\`\`

Pourquoi si lent ? Trace l'arbre d'appels de \`fib(5)\` :

\`\`\`
fib(5)
├─ fib(4)
│  ├─ fib(3)            ← calculé une fois
│  │  ├─ fib(2)         ← calculé une fois
│  │  └─ fib(1)
│  └─ fib(2)            ← RECALCULÉ
│     ├─ fib(1)
│     └─ fib(0)
└─ fib(3)               ← RECALCULÉ
   ├─ fib(2)            ← RE-RECALCULÉ
   └─ ...
\`\`\`

Chaque sous-problème est résolu **plusieurs fois**. C'est pour ça que c'est O(2ⁿ).

### La solution : on se souvient

\`\`\`js
function fib(n, cache = {}) {
  if (n < 2) return n;
  if (cache[n] !== undefined) return cache[n];   // ← déjà calculé, on retourne
  cache[n] = fib(n - 1, cache) + fib(n - 2, cache);
  return cache[n];
}

fib(50);   // < 1 ms
fib(500);  // < 1 ms (limité par la précision JS pas par le temps)
\`\`\`

Chaque \`fib(k)\` est calculé **une seule fois**. Le 2e appel retourne instantanément depuis le cache. → O(n).

### Variantes de mémoïsation

\`\`\`js
// 1. Cache externe (réutilisable entre appels)
const cache = new Map();
function fib(n) {
  if (n < 2) return n;
  if (cache.has(n)) return cache.get(n);
  cache.set(n, fib(n - 1) + fib(n - 2));
  return cache.get(n);
}

// 2. Closure (cache encapsulé)
const fib = (() => {
  const cache = {};
  return function f(n) {
    if (n < 2) return n;
    return cache[n] ??= f(n - 1) + f(n - 2);
  };
})();
\`\`\`

### Mémoïsation vs DP itératif (bottom-up)

Pour Fibonacci, on peut aussi faire :

\`\`\`js
function fib(n) {
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
// O(n) temps, O(1) espace ← encore mieux !
\`\`\`

**Règle générale** : itératif > récursif mémoïsé quand l'ordre de calcul est évident. Mais le mémoïsé est parfois plus lisible (problèmes avec arbres d'appels complexes).

### Pièges classiques

- **Cache partagé entre appels qui ne devrait pas l'être.** Si ta fonction prend plusieurs arguments mais que tu caches par 1 seul, tu auras des collisions silencieuses.
- **Mémoïser des fonctions impures.** Mémoïser une fonction qui dépend du temps ou d'un état externe = bugs nightmare.
- **Mémoïsation excessive.** Cacher une fonction O(1) ou rapidement réévaluée ralentit (tu paies le hash de la clé pour rien).

### À écrire dans ton carnet

> Réécris \`function climbStairs(n)\` (combien de façons de monter n marches en sautant 1 ou 2 marches à la fois) dans les 3 versions : naïve récursive, mémoïsée, itérative O(1) espace. Quelle est la complexité de chaque ?
`,
};

// =============================================================
// Ressources externes (Sprint C)
// =============================================================
export const m00Resources: Omit<NewExternalResource, "id">[] = [
  // Big-O
  {
    kind: "doc",
    provider: "Big-O Cheat Sheet",
    title: "Big-O Cheat Sheet — toutes les complexités à portée de main",
    url: "https://www.bigocheatsheet.com/",
    language: "en",
    level: "beginner",
    whyThisOne:
      "La référence visuelle absolue. Toutes les structures et algos classiques avec leur Big-O. À garder ouvert pendant tes premières semaines.",
    estimatedMinutes: 10,
  },
  {
    kind: "article",
    provider: "freeCodeCamp",
    title: "Big O Notation in JavaScript — A Beginner's Guide",
    url: "https://www.freecodecamp.org/news/big-o-notation-simply-explained-with-illustrations-and-video-87d5a71c0174/",
    language: "en",
    level: "beginner",
    whyThisOne:
      "Article qui couvre les bases avec des illustrations. Bon complément du cours vidéo.",
    estimatedMinutes: 15,
  },
  {
    kind: "doc",
    provider: "MDN",
    title: "Array — méthodes et complexités",
    url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array",
    language: "fr",
    level: "beginner",
    whyThisOne:
      "Pour analyser la complexité de ton code JS, tu dois connaître le coût de chaque méthode Array native (push, unshift, splice, sort, includes...).",
    estimatedMinutes: 20,
  },

  // Recursion
  {
    kind: "doc",
    provider: "MDN",
    title: "Récursivité — glossaire MDN",
    url: "https://developer.mozilla.org/fr/docs/Glossary/Recursion",
    language: "fr",
    level: "beginner",
    whyThisOne: "Définition concise en français. À lire avant la vidéo principale.",
    estimatedMinutes: 5,
  },
  {
    kind: "article",
    provider: "freeCodeCamp",
    title: "Recursion in Programming — Concepts and Examples",
    url: "https://www.freecodecamp.org/news/recursion-in-javascript/",
    language: "en",
    level: "beginner",
    whyThisOne:
      "Plusieurs exemples concrets en JS. Excellente écriture, claire et progressive.",
    estimatedMinutes: 20,
  },
  {
    kind: "exercise",
    provider: "LeetCode",
    title: "Recursion problems — easy collection",
    url: "https://leetcode.com/problem-list/recursion/",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "Liste de problèmes filtrés sur le tag récursion. Commence par Easy avant Medium.",
    estimatedMinutes: 60,
  },

  // Structures
  {
    kind: "course",
    provider: "Visualgo",
    title: "Visualgo — animations interactives des structures et algos",
    url: "https://visualgo.net/en",
    language: "en",
    level: "beginner",
    whyThisOne:
      "Visualisations étape par étape de TOUS les algos (sorts, search, BST, BFS, DFS, hash, etc.). À ouvrir à chaque concept abstrait.",
    estimatedMinutes: 30,
  },
  {
    kind: "doc",
    provider: "MDN",
    title: "Map — l'objet hashmap natif de JS",
    url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map",
    language: "fr",
    level: "beginner",
    whyThisOne:
      "Référence complète sur Map en JS. Avec les complexités implicites (get/set/has en O(1)).",
    estimatedMinutes: 15,
  },
  {
    kind: "article",
    provider: "freeCodeCamp",
    title: "Linked Lists in JavaScript — comparé aux Arrays",
    url: "https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "Implémentation à la main d'une linked list en JS. Indispensable pour comprendre les pointeurs avant les arbres et graphes.",
    estimatedMinutes: 30,
  },

  // Sorting + search
  {
    kind: "course",
    provider: "Visualgo",
    title: "Visualgo — Sorting algorithms (bubble, insertion, merge, quick, heap)",
    url: "https://visualgo.net/en/sorting",
    language: "en",
    level: "beginner",
    whyThisOne:
      "Lance chaque sort sur le même input et regarde-les fonctionner en parallèle. Le mental model rentre tout seul.",
    estimatedMinutes: 30,
  },
  {
    kind: "article",
    provider: "freeCodeCamp",
    title: "Binary Search in JavaScript — sans bugs",
    url: "https://www.freecodecamp.org/news/binary-search-in-javascript/",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "Couvre les 3 pièges classiques (off-by-one, mid overflow, boucle infinie). Lis ça AVANT d'écrire ton binary search.",
    estimatedMinutes: 15,
  },

  // Trees & graphs
  {
    kind: "course",
    provider: "Visualgo",
    title: "Visualgo — Binary Search Tree",
    url: "https://visualgo.net/en/bst",
    language: "en",
    level: "intermediate",
    whyThisOne: "Visualise les insertions/suppressions et le rééquilibrage AVL en live.",
    estimatedMinutes: 20,
  },
  {
    kind: "course",
    provider: "Visualgo",
    title: "Visualgo — Graph traversal (BFS, DFS)",
    url: "https://visualgo.net/en/dfsbfs",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "BFS vs DFS sur le même graphe, côte à côte. Comprends la différence en 5 minutes.",
    estimatedMinutes: 15,
  },

  // Prep entretiens
  {
    kind: "course",
    provider: "NeetCode",
    title: "NeetCode 150 — la roadmap LeetCode best-in-class",
    url: "https://neetcode.io/practice",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "150 problèmes LeetCode classés par pattern (arrays, two pointers, sliding window, stack, binary search, trees, etc.). LE standard prep entretiens FAANG.",
    estimatedMinutes: 200 * 60,
  },
  {
    kind: "exercise",
    provider: "LeetCode",
    title: "LeetCode — explore card Algorithms",
    url: "https://leetcode.com/explore/learn/card/recursion-i/",
    language: "en",
    level: "intermediate",
    whyThisOne:
      "Parcours guidé par concept avec exercices et explications. Plus structuré que de pioche dans la masse.",
    estimatedMinutes: 240,
  },

  // 42 prep
  {
    kind: "doc",
    provider: "42 Norm",
    title: "42 Norme et règles de codage en C",
    url: "https://github.com/42School/norminette",
    language: "en",
    level: "advanced",
    whyThisOne:
      "Si tu vises 42, tu dois coder dans cette norme à la lettre. Le linter officiel.",
    estimatedMinutes: 30,
  },
  {
    kind: "exercise",
    provider: "C Programming",
    title: "C Programming — exercises from the K&R book",
    url: "https://www.tutorialspoint.com/cprogramming/c_programming_examples.htm",
    language: "en",
    level: "advanced",
    whyThisOne:
      "Avant la piscine 42 : refais les exercices basiques de Kernighan & Ritchie en C. Compile en local avec gcc.",
    estimatedMinutes: 600,
  },

  // Misc
  {
    kind: "video",
    provider: "Michael Sambol",
    title: "Big-O Notation in 5 Minutes — quick recap",
    url: "https://www.youtube.com/watch?v=__vX2sjlpXU",
    language: "en",
    level: "beginner",
    whyThisOne:
      "À garder en favoris pour relire 1 minute avant un entretien blanc.",
    estimatedMinutes: 5,
  },
];

// Mapping skill slug → titres des resources liées (dans l'ordre d'affichage)
// Permet d'attacher chaque resource à 1-N skills.
export const m00SkillResourceLinks: Array<{
  skillSlug: string;
  resourceTitles: string[];
}> = [
  {
    skillSlug: "big-o-intuition",
    resourceTitles: [
      "Big-O Cheat Sheet — toutes les complexités à portée de main",
      "Big-O Notation in 5 Minutes — quick recap",
      "Big O Notation in JavaScript — A Beginner's Guide",
    ],
  },
  {
    skillSlug: "big-o-notation",
    resourceTitles: [
      "Big-O Cheat Sheet — toutes les complexités à portée de main",
      "Big O Notation in JavaScript — A Beginner's Guide",
      "Big-O Notation in 5 Minutes — quick recap",
    ],
  },
  {
    skillSlug: "analyze-complexity",
    resourceTitles: [
      "Array — méthodes et complexités",
      "Big-O Cheat Sheet — toutes les complexités à portée de main",
    ],
  },
  {
    skillSlug: "recursion-mental-model",
    resourceTitles: [
      "Récursivité — glossaire MDN",
      "Recursion in Programming — Concepts and Examples",
    ],
  },
  {
    skillSlug: "recursion-patterns",
    resourceTitles: [
      "Recursion in Programming — Concepts and Examples",
      "Recursion problems — easy collection",
    ],
  },
  {
    skillSlug: "memoization-basics",
    resourceTitles: ["Recursion problems — easy collection", "NeetCode 150 — la roadmap LeetCode best-in-class"],
  },
  {
    skillSlug: "arrays-internals",
    resourceTitles: ["Array — méthodes et complexités"],
  },
  {
    skillSlug: "linked-lists",
    resourceTitles: ["Linked Lists in JavaScript — comparé aux Arrays"],
  },
  {
    skillSlug: "stacks",
    resourceTitles: ["Visualgo — animations interactives des structures et algos"],
  },
  {
    skillSlug: "queues",
    resourceTitles: ["Visualgo — animations interactives des structures et algos"],
  },
  {
    skillSlug: "hashmaps",
    resourceTitles: [
      "Map — l'objet hashmap natif de JS",
      "Visualgo — animations interactives des structures et algos",
    ],
  },
  {
    skillSlug: "binary-search",
    resourceTitles: [
      "Binary Search in JavaScript — sans bugs",
      "Visualgo — animations interactives des structures et algos",
    ],
  },
  {
    skillSlug: "sorting-elementary",
    resourceTitles: ["Visualgo — Sorting algorithms (bubble, insertion, merge, quick, heap)"],
  },
  {
    skillSlug: "sorting-merge",
    resourceTitles: ["Visualgo — Sorting algorithms (bubble, insertion, merge, quick, heap)"],
  },
  {
    skillSlug: "sorting-quick",
    resourceTitles: ["Visualgo — Sorting algorithms (bubble, insertion, merge, quick, heap)"],
  },
  {
    skillSlug: "trees-bst",
    resourceTitles: [
      "Visualgo — Binary Search Tree",
      "NeetCode 150 — la roadmap LeetCode best-in-class",
    ],
  },
  {
    skillSlug: "bfs-dfs-trees",
    resourceTitles: [
      "Visualgo — Graph traversal (BFS, DFS)",
      "NeetCode 150 — la roadmap LeetCode best-in-class",
    ],
  },
  {
    skillSlug: "bfs-dfs-graphs",
    resourceTitles: [
      "Visualgo — Graph traversal (BFS, DFS)",
      "LeetCode — explore card Algorithms",
    ],
  },
];
