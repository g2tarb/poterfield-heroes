/**
 * M00 — Exercices pratiques supplémentaires (code in-app).
 *
 * Complète m00-algo.ts (qui contient déjà binary search + fibonacci mémoïsé)
 * avec 7 exercices de code LeetCode-grade qui tournent dans le navigateur
 * (sandbox "browser" : WebWorker JS + Pyodide Python).
 *
 * Couvre les skills sans exo dédié, du plus simple au plus difficile :
 *  20 — reverse linked list        (linked-lists)            JS
 *  21 — valid parentheses          (stacks)                  JS
 *  22 — two-sum                    (hashmaps)                JS
 *  23 — queue via 2 stacks         (queues, stacks)          Python
 *  24 — merge sort                 (sorting-merge)           JS
 *  25 — group anagrams             (hashmaps)                Python
 *  26 — BST insert + inorder       (trees-bst)               JS
 *  27 — number of islands (BFS)    (bfs-dfs-graphs)          JS
 *
 * displayOrder ≥ 20 pour passer APRÈS les exos existants (1..5).
 * Tous : kind "code_exercise", sandbox "browser", passThresholdPct 80.
 * skillSlugs = slugs RÉELS de m00Skills (m00-algo.ts).
 */
import type { NewExercise } from "../../schema/content";
import { M00_ID } from "./m00-algo";

export const m00ExtraExercises: NewExercise[] = [
  // ===========================================================
  // 20 — Reverse a linked list (linked-lists) — JS — facile
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Reverse Linked List — inverser une liste chaînée",
    statement: `Inverse une liste chaînée simple et retourne la nouvelle tête.

Un nœud est un objet \`{ val, next }\` où \`next\` pointe vers le nœud suivant (ou \`null\` à la fin). On te donne deux helpers : \`buildList(arr)\` qui construit la liste à partir d'un tableau, et \`toArray(head)\` qui la reconvertit en tableau pour vérifier.

Implémente \`reverseList(head)\`.

**Exemple :**
\`\`\`
Input : 1 -> 2 -> 3 -> 4 -> 5 -> null
Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
\`\`\`

**Contraintes :**
- O(n) temps, O(1) mémoire supplémentaire (version itérative à 3 pointeurs \`prev\`, \`curr\`, \`next\`).
- Une liste vide (\`null\`) retourne \`null\`.
- Une liste à un seul élément reste inchangée.

**Tests attendus :**
\`\`\`js
toArray(reverseList(buildList([1, 2, 3, 4, 5]))) // [5, 4, 3, 2, 1]
toArray(reverseList(buildList([42])))            // [42]
toArray(reverseList(buildList([])))              // []
\`\`\``,
    starterCode: `// Helpers fournis — ne les modifie pas
function buildList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
  return head;
}
function toArray(head) {
  const out = [];
  for (let n = head; n !== null; n = n.next) out.push(n.val);
  return out;
}

function reverseList(head) {
  // Ton implem ici (3 pointeurs : prev, curr, next)
  return head;
}

// Tests
console.log(JSON.stringify(toArray(reverseList(buildList([1, 2, 3, 4, 5]))))); // [5,4,3,2,1]
console.log(JSON.stringify(toArray(reverseList(buildList([42])))));            // [42]
console.log(JSON.stringify(toArray(reverseList(buildList([])))));              // []
`,
    solutionCode: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    expectedOutput: "[5,4,3,2,1]\n[42]\n[]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["linked-lists", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 20,
    displayOrder: 20,
  },

  // ===========================================================
  // 21 — Valid Parentheses (stacks) — JS — facile
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Valid Parentheses — équilibrage avec une stack",
    statement: `On te donne une chaîne \`s\` ne contenant que les caractères \`()[]{}\`. Détermine si les parenthèses sont **bien équilibrées** : chaque ouvrante est fermée par la bonne fermante, dans le bon ordre.

Implémente \`isValid(s)\` qui retourne un booléen.

**Exemples :**
\`\`\`
isValid("()")     -> true
isValid("()[]{}") -> true
isValid("(]")     -> false
isValid("([)]")   -> false   // mauvais ordre d'imbrication
isValid("{[]}")   -> true
isValid("(")      -> false   // jamais fermée
\`\`\`

**Contraintes :**
- O(n) temps, O(n) mémoire (la stack).
- Utilise une **stack** : push chaque ouvrante, pop+vérifie à chaque fermante.
- Chaîne vide \`""\` -> \`true\`.

**Tests attendus :**
\`\`\`js
isValid("()")     === true
isValid("()[]{}") === true
isValid("(]")     === false
isValid("([)]")   === false
isValid("{[]}")   === true
isValid("(")      === false
isValid("")       === true
\`\`\``,
    starterCode: `function isValid(s) {
  // Ton implem ici (stack + map fermante->ouvrante)
  return false;
}

// Tests
console.log(isValid("()"));     // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true
console.log(isValid("("));      // false
console.log(isValid(""));       // true
`,
    solutionCode: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
    expectedOutput: "true\ntrue\nfalse\nfalse\ntrue\nfalse\ntrue",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["stacks", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 20,
    displayOrder: 21,
  },

  // ===========================================================
  // 22 — Two Sum (hashmaps) — JS — facile/moyen
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Two Sum — la hashmap qui transforme O(n²) en O(n)",
    statement: `On te donne un tableau d'entiers \`nums\` et un entier \`target\`. Retourne les **indices** des deux nombres dont la somme vaut \`target\`. Il y a exactement une solution, et tu ne peux pas utiliser deux fois le même élément.

Implémente \`twoSum(nums, target)\` qui retourne un tableau \`[i, j]\` (i < j).

**Exemples :**
\`\`\`
twoSum([2, 7, 11, 15], 9)  -> [0, 1]   // 2 + 7 = 9
twoSum([3, 2, 4], 6)       -> [1, 2]   // 2 + 4 = 6
twoSum([3, 3], 6)          -> [0, 1]
\`\`\`

**Contraintes :**
- L'approche naïve à double boucle est O(n²) — **interdite ici**.
- Vise **O(n)** en un seul passage avec une hashmap (\`Map\` ou objet) \`valeur -> index\`.
- Pour chaque \`x\`, cherche si \`target - x\` a déjà été vu.

**Tests attendus :**
\`\`\`js
twoSum([2, 7, 11, 15], 9)  // [0, 1]
twoSum([3, 2, 4], 6)       // [1, 2]
twoSum([3, 3], 6)          // [0, 1]
\`\`\``,
    starterCode: `function twoSum(nums, target) {
  // Ton implem ici (un seul passage, hashmap valeur->index)
  return [];
}

// Tests
console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9))); // [0,1]
console.log(JSON.stringify(twoSum([3, 2, 4], 6)));      // [1,2]
console.log(JSON.stringify(twoSum([3, 3], 6)));         // [0,1]
`,
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map(); // valeur -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    expectedOutput: "[0,1]\n[1,2]\n[0,1]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["hashmaps", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 20,
    displayOrder: 22,
  },

  // ===========================================================
  // 23 — Queue via 2 stacks (queues, stacks) — PYTHON — moyen
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Queue avec deux stacks — FIFO à partir de LIFO (Python)",
    statement: `Implémente une **file (FIFO)** en n'utilisant que **deux piles (LIFO)**. Une pile Python = une \`list\` avec \`.append(x)\` (push) et \`.pop()\` (pop du dernier).

Complète la classe \`MyQueue\` avec :
- \`push(x)\` : ajoute \`x\` à l'arrière de la file
- \`pop()\` : retire et retourne l'élément de l'avant de la file
- \`peek()\` : retourne (sans retirer) l'élément de l'avant
- \`empty()\` : \`True\` si la file est vide

**Idée clé :** une pile \`in_stack\` pour les push, une pile \`out_stack\` pour les pop. Quand \`out_stack\` est vide et qu'on veut pop/peek, on **transvase** tout \`in_stack\` dedans (ce qui inverse l'ordre -> le plus ancien se retrouve au sommet).

**Contraintes :**
- \`push\` en O(1).
- \`pop\`/\`peek\` en O(1) **amorti** (chaque élément n'est transvasé qu'une fois).

**Exemple :**
\`\`\`
q = MyQueue()
q.push(1); q.push(2)
q.peek()   # 1
q.pop()    # 1
q.empty()  # False
q.pop()    # 2
q.empty()  # True
\`\`\``,
    starterCode: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x):
        # Ton implem ici
        pass

    def _transfer(self):
        # Transvase in_stack -> out_stack si out_stack est vide
        pass

    def pop(self):
        # Ton implem ici
        pass

    def peek(self):
        # Ton implem ici
        pass

    def empty(self):
        # Ton implem ici
        return True


# Tests
q = MyQueue()
q.push(1)
q.push(2)
print(q.peek())   # 1
print(q.pop())    # 1
print(q.empty())  # False
print(q.pop())    # 2
print(q.empty())  # True
`,
    solutionCode: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x):
        self.in_stack.append(x)

    def _transfer(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self):
        self._transfer()
        return self.out_stack.pop()

    def peek(self):
        self._transfer()
        return self.out_stack[-1]

    def empty(self):
        return not self.in_stack and not self.out_stack`,
    expectedOutput: "1\n1\nFalse\n2\nTrue",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["queues", "stacks", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 23,
  },

  // ===========================================================
  // 24 — Merge Sort (sorting-merge) — JS — moyen
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Merge Sort — divide & conquer à la main",
    statement: `Implémente le tri fusion. Tu écris deux fonctions :

1. \`merge(a, b)\` : fusionne deux tableaux **déjà triés** en un seul tableau trié.
2. \`mergeSort(arr)\` : trie \`arr\` récursivement (divise en deux moitiés, trie chacune, fusionne).

**Exemple :**
\`\`\`
mergeSort([5, 2, 9, 1, 5, 6]) -> [1, 2, 5, 5, 6, 9]
merge([1, 4, 7], [2, 3, 8])   -> [1, 2, 3, 4, 7, 8]
\`\`\`

**Contraintes :**
- O(n log n) garanti (c'est tout l'intérêt vs bubble sort O(n²)).
- Ne mute pas \`arr\` : retourne un **nouveau** tableau trié.
- Cas de base : un tableau de longueur ≤ 1 est déjà trié.
- Le tri doit être **stable** (l'ordre relatif des éléments égaux est préservé).

**Tests attendus :**
\`\`\`js
mergeSort([5, 2, 9, 1, 5, 6]) // [1, 2, 5, 5, 6, 9]
mergeSort([])                 // []
mergeSort([42])               // [42]
mergeSort([3, 2, 1])          // [1, 2, 3]
\`\`\``,
    starterCode: `function merge(a, b) {
  // Fusionne deux tableaux triés -> un tableau trié
  return [];
}

function mergeSort(arr) {
  // Cas de base + split + recursion + merge
  return arr;
}

// Tests
console.log(JSON.stringify(mergeSort([5, 2, 9, 1, 5, 6]))); // [1,2,5,5,6,9]
console.log(JSON.stringify(mergeSort([])));                 // []
console.log(JSON.stringify(mergeSort([42])));               // [42]
console.log(JSON.stringify(mergeSort([3, 2, 1])));          // [1,2,3]
`,
    solutionCode: `function merge(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    expectedOutput: "[1,2,5,5,6,9]\n[]\n[42]\n[1,2,3]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["sorting-merge", "recursion-patterns", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 24,
  },

  // ===========================================================
  // 25 — Group Anagrams (hashmaps) — PYTHON — moyen
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Group Anagrams — regrouper avec une clé canonique (Python)",
    statement: `On te donne une liste de mots. Regroupe ensemble ceux qui sont **anagrammes** les uns des autres (mêmes lettres, ordre différent).

Implémente \`group_anagrams(words)\` qui retourne une **liste de groupes**. Pour rendre la sortie déterministe (testable), respecte ce contrat :
- chaque groupe est **trié alphabétiquement** (\`sorted(group)\`),
- la liste de groupes est **triée** elle aussi (\`sorted(...)\`).

**Idée clé :** la **clé canonique** d'un mot est ses lettres triées. \`"eat"\`, \`"tea"\`, \`"ate"\` partagent toutes la clé \`"aet"\`. Une hashmap \`clé -> liste de mots\` fait le regroupement en un passage.

**Exemple :**
\`\`\`
group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
-> [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
\`\`\`

**Contraintes :**
- O(n * k log k) où k = longueur moyenne d'un mot (le \`sorted\` de la clé).
- Utilise un \`dict\` (ou \`collections.defaultdict\`).

**Tests attendus :**
\`\`\`python
group_anagrams(["eat","tea","tan","ate","nat","bat"])
# [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
group_anagrams([""])   # [['']]
group_anagrams(["a"])  # [['a']]
\`\`\``,
    starterCode: `def group_anagrams(words):
    # Indice : cle = "".join(sorted(mot)) ; dict cle -> liste de mots
    # Retourne sorted([sorted(group) for group in groups.values()])
    return []


# Tests
print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
# [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
print(group_anagrams([""]))   # [['']]
print(group_anagrams(["a"]))  # [['a']]
`,
    solutionCode: `def group_anagrams(words):
    groups = {}
    for word in words:
        key = "".join(sorted(word))
        groups.setdefault(key, []).append(word)
    return sorted(sorted(group) for group in groups.values())`,
    expectedOutput:
      "[['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]\n[['']]\n[['a']]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["hashmaps", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 25,
  },

  // ===========================================================
  // 26 — BST insert + inorder (trees-bst) — JS — moyen/difficile
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "BST — insertion + parcours in-order trié",
    statement: `Construis un **arbre binaire de recherche** (BST) puis lis-le dans l'ordre.

Un nœud = \`{ val, left, right }\`. La **propriété BST** : pour tout nœud, tout ce qui est à gauche est plus petit, tout ce qui est à droite est plus grand.

Implémente deux fonctions :
1. \`insert(root, val)\` : insère \`val\` au bon endroit et retourne la racine de l'arbre.
2. \`inorder(root)\` : retourne un tableau des valeurs en parcours **in-order** (gauche, racine, droite).

**Propriété magique à découvrir :** un parcours in-order d'un BST sort toujours les valeurs **triées par ordre croissant**. C'est gratuit.

**Exemple :**
\`\`\`
On insère 5, 3, 8, 1, 4, 7, 9 dans un arbre vide.
inorder(root) -> [1, 3, 4, 5, 7, 8, 9]
\`\`\`

**Contraintes :**
- \`insert\` en O(h) où h = hauteur (O(log n) si équilibré).
- \`inorder\` récursif, O(n).
- Insérer dans un arbre vide (\`null\`) crée la racine.

**Tests attendus :**
\`\`\`js
let root = null;
for (const v of [5, 3, 8, 1, 4, 7, 9]) root = insert(root, v);
inorder(root) // [1, 3, 4, 5, 7, 8, 9]

let r2 = null;
for (const v of [2, 1, 3]) r2 = insert(r2, v);
inorder(r2)   // [1, 2, 3]
\`\`\``,
    starterCode: `function insert(root, val) {
  // Si root est null, crée { val, left: null, right: null }
  // Sinon descends à gauche/droite selon val, puis retourne root
  return root;
}

function inorder(root) {
  // Parcours gauche -> racine -> droite, retourne un tableau
  return [];
}

// Tests
let root = null;
for (const v of [5, 3, 8, 1, 4, 7, 9]) root = insert(root, v);
console.log(JSON.stringify(inorder(root))); // [1,3,4,5,7,8,9]

let r2 = null;
for (const v of [2, 1, 3]) r2 = insert(r2, v);
console.log(JSON.stringify(inorder(r2)));   // [1,2,3]
`,
    solutionCode: `function insert(root, val) {
  if (root === null) return { val, left: null, right: null };
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}

function inorder(root) {
  if (root === null) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}`,
    expectedOutput: "[1,3,4,5,7,8,9]\n[1,2,3]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["trees-bst", "recursion-mental-model", "analyze-complexity"],
    passThresholdPct: 80,
    estimatedMinutes: 35,
    displayOrder: 26,
  },

  // ===========================================================
  // 27 — Number of Islands (BFS) (bfs-dfs-graphs) — JS — difficile
  // ===========================================================
  {
    moduleId: M00_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "javascript",
    title: "Number of Islands — BFS sur une grille (graphe implicite)",
    statement: `On te donne une grille 2D de \`"1"\` (terre) et \`"0"\` (eau). Compte le nombre d'**îles**. Une île = un groupe de cases terre connectées **horizontalement ou verticalement** (pas en diagonale). Les bords de la grille sont entourés d'eau.

Implémente \`numIslands(grid)\` (tableau 2D de chaînes \`"0"\`/\`"1"\`).

**Idée clé :** la grille est un **graphe implicite** — chaque case terre est un nœud, ses voisins haut/bas/gauche/droite sont les arêtes. On scanne la grille ; à chaque terre non encore visitée, on incrémente le compteur et on **noie toute l'île** (BFS ou DFS depuis cette case en marquant visité). Le \`visited\` est indispensable — sinon boucle infinie.

**Exemple :**
\`\`\`
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"],
]
numIslands(grid) -> 3
\`\`\`

**Contraintes :**
- O(m * n) : chaque case visitée une seule fois.
- Utilise un \`Set\` de clés \`\\\`\${r},\${c}\\\`\` (ou mute la grille en posant \`"0"\`) pour le visited.
- Voisins : seulement les 4 directions cardinales.

**Tests attendus :**
\`\`\`js
numIslands([["1","0"],["0","1"]])           // 2
numIslands([["1","1"],["1","1"]])           // 1
numIslands([["0","0"],["0","0"]])           // 0
\`\`\``,
    starterCode: `function numIslands(grid) {
  // Indice BFS : pour chaque "1" non visite, count++ puis BFS qui
  // marque toute l'ile via une queue et un Set de cles \`\${r},\${c}\`.
  // Voisins : [[-1,0],[1,0],[0,-1],[0,1]]
  return 0;
}

// Tests
console.log(numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"],
])); // 3
console.log(numIslands([["1","0"],["0","1"]])); // 2
console.log(numIslands([["1","1"],["1","1"]])); // 1
console.log(numIslands([["0","0"],["0","0"]])); // 0
`,
    solutionCode: `function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set();
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let count = 0;

  const bfs = (sr, sc) => {
    const queue = [[sr, sc]];
    visited.add(\`\${sr},\${sc}\`);
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = \`\${nr},\${nc}\`;
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          grid[nr][nc] === "1" &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1" && !visited.has(\`\${r},\${c}\`)) {
        count++;
        bfs(r, c);
      }
    }
  }
  return count;
}`,
    expectedOutput: "3\n2\n1\n0",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["bfs-dfs-graphs", "queues", "hashmaps"],
    passThresholdPct: 80,
    estimatedMinutes: 40,
    displayOrder: 27,
  },
];
