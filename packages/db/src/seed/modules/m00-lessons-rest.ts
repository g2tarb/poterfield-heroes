/**
 * M00 — Leçons in-app markdown pour les 12 skills restants.
 *
 * Complète m00LessonContent (m00-extras.ts) qui couvre les 6 premiers skills
 * (big-o-intuition, big-o-notation, analyze-complexity, recursion-mental-model,
 * recursion-patterns, memoization-basics).
 *
 * Même gabarit de style : analogie d'ouverture, schéma ASCII, implem commentée
 * JS (+ Python si utile), complexité temps ET espace, encart pièges, encart
 * carnet. Indexé par skill slug — appliqué via UPDATE skills SET content_markdown.
 */
export const m00LessonContentRest: Record<string, string> = {
  "arrays-internals": `## Tableaux dynamiques : sous le capot

Un \`Array\` JS ou une \`list\` Python a l'air magique : tu \`push\` autant que tu veux, ça grandit tout seul. Mais en mémoire, un tableau est un **bloc contigu de taille fixe**. Alors comment ça grandit ?

### L'analogie du parking

Imagine un parking de 4 places (capacité). Tu as garé 3 voitures (taille). Tant qu'il reste de la place, garer une voiture de plus = instantané. Mais quand le parking est plein et qu'une 5e voiture arrive, tu dois **louer un parking 2× plus grand, déplacer toutes les voitures, puis garer la nouvelle**. Ce déménagement coûte cher — mais il est rare.

### Capacité vs taille

\`\`\`
capacité = 8 (place réservée en mémoire)
taille   = 5 (cases réellement utilisées)

index :  0    1    2    3    4    5    6    7
       [ 10 | 23 | 7  | 99 | 4  | __ | __ | __ ]
                              ↑ taille          ↑ capacité
\`\`\`

### Croissance par doublement = append amorti O(1)

Quand le tableau est plein, on alloue un bloc **2× plus grand** et on recopie. Le coût d'une recopie est O(n), mais elle n'arrive que toutes les n insertions. Réparti (amorti) sur toutes les insertions, ça donne **O(1) amorti** par \`push\`.

\`\`\`js
// Mini-implem pour comprendre (un vrai Array JS est en C++ optimisé)
class DynArray {
  constructor() {
    this.capacity = 1;
    this.length = 0;
    this.data = new Array(this.capacity);
  }
  push(value) {
    if (this.length === this.capacity) {
      this.capacity *= 2;                       // double la capacité
      const bigger = new Array(this.capacity);
      for (let i = 0; i < this.length; i++) {   // O(n) recopie (rare)
        bigger[i] = this.data[i];
      }
      this.data = bigger;
    }
    this.data[this.length] = value;             // O(1) la plupart du temps
    this.length++;
  }
  get(i) { return this.data[i]; }               // O(1) accès direct par index
}
\`\`\`

### Le tableau des coûts

| Opération | Complexité | Pourquoi |
|---|---|---|
| Accès par index \`arr[i]\` | **O(1)** | adresse = base + i × taille_élément |
| Append \`push\` | **O(1) amorti** | doublement rare |
| Insertion au milieu | **O(n)** | décaler tous les éléments à droite |
| Suppression au milieu | **O(n)** | décaler tous les éléments à gauche |
| \`unshift\` (ajout en tête) | **O(n)** | tout décaler vers la droite |
| Recherche \`includes\` | **O(n)** | parcours linéaire |

Espace : **O(n)** (plus un peu de capacité inutilisée, au pire ~2n).

### Pièges classiques

- **\`unshift\` et \`splice\` au milieu sont O(n).** Si tu insères souvent en tête, une linked list ou un deque est meilleur.
- **Pré-alloue si tu connais la taille.** \`new Array(1000)\` évite plusieurs doublements/recopies.
- **Les \`Array\` JS "trous" (sparse) sont un piège perf.** \`arr[1000] = x\` sur un array de taille 3 le rend sparse → le moteur sort du mode "fast array".
- **Ne confonds pas index O(1) et recherche O(n).** Accéder à \`arr[i]\` est instantané ; trouver *où* est une valeur ne l'est pas.

### À écrire dans ton carnet

> Pourquoi le doublement de capacité est-il O(1) amorti et pas le triplement ou l'ajout de +10 cases ? Calcule le coût total de n insertions dans chaque stratégie.
`,

  "linked-lists": `## Linked lists : simple, double, circulaire

Un tableau range ses éléments **côte à côte** en mémoire. Une linked list les éparpille n'importe où, et chaque élément (un *node*) garde un **pointeur** vers le suivant. C'est ce qui change tout sur les coûts d'insertion.

### L'analogie de la chasse au trésor

Un tableau, c'est une rangée de cases numérotées : tu sautes direct à la case 47. Une linked list, c'est une chasse au trésor : chaque indice te dit où trouver le suivant. Pour atteindre le 47e, tu dois suivre 46 indices. Mais glisser un nouvel indice au milieu de la chaîne ne dérange personne d'autre.

### Schéma : liste simplement chaînée

\`\`\`
head
 │
 ▼
┌────┬───┐   ┌────┬───┐   ┌────┬───┐
│ 10 │ ●─┼──▶│ 23 │ ●─┼──▶│ 7  │ ✗ │   (✗ = null)
└────┴───┘   └────┴───┘   └────┴───┘
\`\`\`

Liste **doublement** chaînée : chaque node a aussi un pointeur \`prev\` (navigation arrière, suppression en O(1) si on tient le node). Liste **circulaire** : le dernier node pointe vers \`head\` au lieu de \`null\`.

### Implémentation JS (simplement chaînée)

\`\`\`js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  prepend(value) {            // ajout en TÊTE — O(1)
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }
  get(index) {                // accès — O(n), il faut parcourir
    let cur = this.head;
    for (let i = 0; i < index && cur; i++) cur = cur.next;
    return cur ? cur.value : undefined;
  }
  delete(value) {             // suppression — O(n) pour trouver
    if (!this.head) return;
    if (this.head.value === value) { this.head = this.head.next; this.size--; return; }
    let cur = this.head;
    while (cur.next && cur.next.value !== value) cur = cur.next;
    if (cur.next) { cur.next = cur.next.next; this.size--; }  // on "saute" le node
  }
}
\`\`\`

### Implémentation Python (équivalente)

\`\`\`python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, value):       # O(1)
        node = Node(value)
        node.next = self.head
        self.head = node

    def get(self, index):           # O(n)
        cur, i = self.head, 0
        while cur and i < index:
            cur, i = cur.next, i + 1
        return cur.value if cur else None
\`\`\`

### Array vs Linked list

| Opération | Array | Linked list |
|---|---|---|
| Accès par index | **O(1)** | **O(n)** |
| Insert/delete en tête | O(n) | **O(1)** |
| Insert/delete au milieu | O(n) | O(n) trouver + **O(1)** relier |
| Mémoire | compacte | +1 pointeur par node |
| Cache CPU | excellent (contigu) | mauvais (éparpillé) |

Espace : **O(n)** dans les deux cas, mais la linked list paie un pointeur (ou deux) par élément.

### Cas d'usage réel : LRU cache

Un LRU cache combine une **hashmap** (lookup O(1)) et une **liste doublement chaînée** (déplacer un élément en tête en O(1) quand on l'utilise, éjecter la queue en O(1) quand c'est plein). C'est LE classique d'entretien où la linked list brille.

### Pièges classiques

- **Perdre le \`head\`.** Si tu réassignes \`head\` sans garder l'ancien, tu perds toute la liste (le GC la ramasse). Garde un temp.
- **Off-by-one dans \`delete\`.** Pour supprimer, tu dois t'arrêter sur le node *précédent* la cible, pas sur la cible.
- **Oublier le cas tête vide / suppression de la tête.** Gère \`head === null\` et \`head.value === target\` séparément.
- **Croire que c'est plus rapide qu'un array "en général".** Le parcours est plus lent (cache misses). La linked list gagne *uniquement* sur insert/delete fréquents aux extrémités.

### À écrire dans ton carnet

> Code à la main \`reverse()\` qui inverse une liste simplement chaînée en O(n) temps et O(1) espace (3 pointeurs : prev, cur, next). C'est LE problème d'entretien linked list le plus fréquent.
`,

  "stacks": `## Stack (LIFO) — implem + applications

Une stack (pile) c'est **Last In, First Out** : le dernier entré est le premier sorti. Comme une pile d'assiettes — tu poses sur le dessus, tu reprends par le dessus.

### L'analogie du Ctrl+Z

Chaque action que tu fais est *poussée* sur une pile. Quand tu fais "annuler", tu *dépiles* la dernière action. La pile est partout où il faut "revenir en arrière dans l'ordre inverse".

### Schéma

\`\`\`
   push(4)             pop() → 4
  ┌───┐               ┌───┐
  │ 4 │ ◀── top        │ 9 │ ◀── top
  ├───┤               ├───┤
  │ 9 │               │ 7 │
  ├───┤               └───┘
  │ 7 │
  └───┘
\`\`\`

### Les 3 opérations (toutes O(1))

- **push(x)** : ajoute x au sommet
- **pop()** : retire et retourne le sommet
- **peek()** : regarde le sommet sans le retirer

### Implémentation JS

\`\`\`js
class Stack {
  constructor() { this.items = []; }
  push(x)  { this.items.push(x); }                 // O(1) amorti
  pop()    { return this.items.pop(); }            // O(1)
  peek()   { return this.items[this.items.length - 1]; } // O(1)
  isEmpty(){ return this.items.length === 0; }
  get size(){ return this.items.length; }
}
// En JS un Array fait déjà tout ça : push/pop sont O(1) amorti.
\`\`\`

### Implémentation Python

\`\`\`python
class Stack:
    def __init__(self):
        self.items = []
    def push(self, x): self.items.append(x)   # O(1) amorti
    def pop(self):     return self.items.pop()  # O(1) (pop sans index !)
    def peek(self):    return self.items[-1]
    def is_empty(self): return not self.items
# Piège Python : list.pop(0) est O(n). Pour une stack on pop() la fin = O(1).
\`\`\`

### Application phare : parenthèses équilibrées

\`\`\`js
function isBalanced(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);                          // ouvrante → on empile
    } else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false; // fermante → doit matcher le top
    }
  }
  return stack.length === 0;                    // tout doit être refermé
}
// isBalanced("([]{})") → true ; isBalanced("([)]") → false
// O(n) temps, O(n) espace (au pire toutes ouvrantes)
\`\`\`

### Autres applications

- **Undo/redo** (deux stacks : une pour annuler, une pour rétablir)
- **DFS itératif** (la stack remplace la récursion)
- **Évaluation d'expressions** (infix → postfix, calcul postfix)
- **Call stack** : le langage lui-même utilise une stack pour les appels de fonctions

### Pièges classiques

- **\`pop()\` sur stack vide.** En JS \`[].pop()\` renvoie \`undefined\` silencieusement → bug masqué. Vérifie \`isEmpty()\` avant.
- **\`list.pop(0)\` en Python = O(n).** Pour une stack tu pop *la fin*. Si tu veux pop le début, c'est une queue → utilise \`collections.deque\`.
- **Confondre LIFO et FIFO.** Stack = dernier entré sort en premier. Queue = premier entré sort en premier.

### À écrire dans ton carnet

> Implémente \`MinStack\` : une stack qui, en plus de push/pop, retourne le minimum en **O(1)**. Indice : garde une seconde stack des minimums. C'est un classique d'entretien.
`,

  "queues": `## Queue (FIFO) — simple, double-ended, priorité

Une queue (file) c'est **First In, First Out** : le premier entré est le premier servi. Comme une file d'attente à la boulangerie — premier arrivé, premier servi.

### Schéma

\`\`\`
   dequeue()                      enqueue(8)
   sort ici ◀── front    rear ──▶ entre ici
            ┌───┬───┬───┬───┐
            │ 3 │ 7 │ 1 │ 8 │
            └───┴───┴───┴───┘
              ↑front       ↑rear
\`\`\`

### Le piège de l'implem naïve

Un \`Array\` JS marche, MAIS \`shift()\` (retirer en tête) est **O(n)** car il décale tout. Pour une vraie queue O(1) il faut une **linked list** (head/tail) ou un **ring buffer** (tableau circulaire avec deux indices).

### Implémentation JS via linked list (enqueue/dequeue O(1))

\`\`\`js
class Queue {
  constructor() { this.head = null; this.tail = null; this.size = 0; }
  enqueue(value) {                         // ajoute en QUEUE — O(1)
    const node = { value, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;                 // queue était vide
    this.tail = node;
    this.size++;
  }
  dequeue() {                              // retire en TÊTE — O(1)
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;      // queue devient vide
    this.size--;
    return value;
  }
  peek() { return this.head ? this.head.value : undefined; }
}
\`\`\`

### Implémentation Python (la bonne façon)

\`\`\`python
from collections import deque
q = deque()
q.append(3)         # enqueue — O(1)
q.append(7)
front = q.popleft() # dequeue — O(1)  → 3
# NE PAS utiliser list.pop(0) : c'est O(n) !
\`\`\`

### Variante : Deque (double-ended queue)

On peut enqueue/dequeue **aux deux bouts** en O(1). Utile pour : sliding window maximum, undo/redo, et toute structure où on traite par les deux extrémités. En JS, simule avec une linked list doublement chaînée ; en Python, \`collections.deque\` fait tout.

### Aperçu : Priority Queue (heap)

Une priority queue sert l'élément de **plus haute priorité** d'abord, pas le plus ancien. Implémentée avec un **heap** (tas binaire) : \`insert\` et \`extractMin\` en **O(log n)**, \`peek\` en O(1). C'est le moteur de Dijkstra, des schedulers OS, et de "les k plus grands éléments". (Le heap aura sa propre leçon dans un sprint ultérieur.)

\`\`\`
Min-heap (parent ≤ enfants) :
        1
       / \\
      3   5
     / \\
    8   4
extractMin() → 1, puis on rééquilibre. O(log n).
\`\`\`

### Complexité (queue simple, bien implémentée)

| Opération | Complexité |
|---|---|
| enqueue | O(1) |
| dequeue | O(1) |
| peek | O(1) |
| Espace | O(n) |

### Applications

- **BFS** (parcours en largeur) — la queue est le cœur de l'algo
- **Scheduling** de tâches, files d'impression
- **Message brokers** (RabbitMQ, Kafka : producteur enqueue, consommateur dequeue)
- **Rate limiting**, buffers entre threads

### Pièges classiques

- **Array + \`shift()\` = O(n) par dequeue.** Une boucle de n dequeue devient O(n²). Utilise linked list / deque / ring buffer.
- **Oublier de remettre \`tail\` à null** quand la queue se vide après le dernier dequeue → bug à la prochaine enqueue.
- **Confondre queue (FIFO) et priority queue.** La PQ ne sert pas dans l'ordre d'arrivée mais par priorité.

### À écrire dans ton carnet

> Implémente une queue avec **deux stacks**. Pourquoi le dequeue est-il O(1) *amorti* malgré le transfert O(n) occasionnel ? (Classique d'entretien : "Implement Queue using Stacks".)
`,

  "hashmaps": `## Hashmaps — hash, collisions, load factor

Comment \`map.get(key)\` peut-il être O(1) alors que la map a 1 million d'entrées ? La réponse : une **fonction de hachage** transforme la clé en un index de tableau. Tu vas directement à la bonne case, sans chercher.

### L'analogie du vestiaire

Au vestiaire, ton ticket porte un numéro. Tu ne fouilles pas tous les crochets : le numéro te mène directement au tien. La **hash function**, c'est la machine qui transforme ton manteau en numéro de crochet.

### Le mécanisme

\`\`\`
clé "erwin" ──hash()──▶ 8472913 ──% capacity (8)──▶ bucket 1

buckets :
  0 │ ∅
  1 │ ("erwin" → 42)        ← go direct ici, pas de parcours
  2 │ ∅
  3 │ ("ada" → 7)
  ...
\`\`\`

1. **hash(key)** → un grand entier (déterministe : même clé → même hash).
2. **hash % capacity** → un index dans le tableau de buckets.
3. On stocke/lit la paire (clé, valeur) à cet index. → O(1).

### Les collisions (deux clés, même bucket)

Inévitable (principe des tiroirs). Deux stratégies :

**Chaining** — chaque bucket est une petite liste. On y range toutes les paires qui collisionnent.

\`\`\`
bucket 1 │ ("erwin" → 42) → ("bob" → 9)   (les deux ont hashé vers 1)
\`\`\`

**Open addressing** — si le bucket est pris, on cherche le prochain bucket libre (linear/quadratic probing).

### Load factor et resize

\`load factor = nombre d'entrées / capacité\`. Quand il dépasse un seuil (~0.7), trop de collisions ⇒ on **double la capacité et on re-hash tout** (O(n), rare). C'est ça qui maintient le O(1) amorti.

### Implémentation JS (chaining, pour comprendre)

\`\`\`js
class HashMap {
  constructor(capacity = 8) {
    this.buckets = Array.from({ length: capacity }, () => []);
    this.size = 0;
  }
  _hash(key) {
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) | 0; // 31 = classique
    return Math.abs(h) % this.buckets.length;
  }
  set(key, value) {
    const bucket = this.buckets[this._hash(key)];
    const pair = bucket.find(p => p[0] === key);
    if (pair) pair[1] = value;            // clé existante → maj
    else { bucket.push([key, value]); this.size++; } // sinon → ajout
    // (un vrai impl resize ici si load factor trop haut)
  }
  get(key) {
    const bucket = this.buckets[this._hash(key)];
    const pair = bucket.find(p => p[0] === key);
    return pair ? pair[1] : undefined;
  }
}
// En vrai : utilise Map (JS) ou dict (Python), ultra-optimisés en natif.
\`\`\`

### Complexité

| Opération | Moyenne | Pire cas |
|---|---|---|
| get / set / has / delete | **O(1) amorti** | O(n) (tout dans 1 bucket) |
| Espace | O(n) | O(n) |

Le pire cas O(n) arrive si la hash function est mauvaise ou en cas d'**attaque hash flooding** (un attaquant forge des clés qui collisionnent toutes).

### Pièges classiques

- **Objets/arrays comme clés en JS.** \`map.set([1,2], x)\` ne marche pas comme tu crois : l'égalité est par référence, pas par valeur. Deux arrays \`[1,2]\` distincts sont des clés différentes. Sérialise (JSON.stringify) ou utilise un tuple en Python.
- **Hash function maison faible.** Une mauvaise distribution tue le O(1). N'invente pas ta hash function en prod.
- **Itération non garantie.** L'ordre d'itération varie (en JS \`Map\` préserve l'ordre d'insertion, l'objet aussi en gros ; en Python \`dict\` préserve l'ordre depuis 3.7 — mais ne *compte* pas dessus pour de la logique).
- **Confondre Set et Map.** Set = clés sans valeurs (test d'appartenance O(1)). Map = clés → valeurs.

### À écrire dans ton carnet

> "Two Sum" en O(n) : trouve deux indices dont la somme vaut \`target\`. Pourquoi une hashmap fait passer de O(n²) (double boucle) à O(n) ? Code-le.
`,

  "binary-search": `## Binary search — l'algo le plus important du quotidien

Tu cherches un mot dans un dictionnaire de 100 000 pages. Tu ne tournes pas page par page : tu ouvres au milieu, tu vois si ton mot est avant ou après, et tu **élimines la moitié** d'un coup. C'est binary search. **Prérequis absolu : l'input doit être trié.**

### Pourquoi c'est si rapide

À chaque étape tu divises l'espace de recherche par 2. Sur 1 000 000 éléments : 1M → 500k → 250k → ... → 1, soit **~20 étapes**. C'est \`log₂(n)\`. Doubler l'input n'ajoute qu'**une seule** comparaison.

### Schéma : chercher 7 dans [1, 3, 5, 7, 9, 11]

\`\`\`
[ 1   3   5   7   9   11 ]
  L           M        R     mid=5 < 7 → cherche à droite, L = M+1
[ 1   3   5   7   9   11 ]
              L   M    R     mid=9 > 7 → cherche à gauche, R = M-1
[ 1   3   5   7   9   11 ]
              LM R          mid=7 == 7 → trouvé ! index 3
\`\`\`

### Implémentation JS (itérative, sans piège)

\`\`\`js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;            // borne INCLUSIVE
  while (left <= right) {                // <= : sinon on rate le dernier élément
    const mid = left + Math.floor((right - left) / 2); // évite tout overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;   // +1 : sinon boucle infinie
    else right = mid - 1;                     // -1 : idem
  }
  return -1;                             // absent
}
\`\`\`

### Implémentation Python

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

### Variantes utiles (lower / upper bound)

\`lower_bound\` = index du **premier** élément ≥ target. \`upper_bound\` = index du premier élément > target. Indispensable pour compter les occurrences dans un tableau trié, ou insérer en gardant le tri.

\`\`\`js
function lowerBound(arr, target) {       // premier index où arr[i] >= target
  let left = 0, right = arr.length;      // borne EXCLUSIVE ici
  while (left < right) {                 // < (pas <=) avec borne exclusive
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] < target) left = mid + 1;
    else right = mid;                    // on garde mid comme candidat
  }
  return left;
}
\`\`\`

### Complexité

- **Temps : O(log n)** — divise par 2 à chaque tour.
- **Espace : O(1)** pour la version itérative. La version récursive est O(log n) à cause de la call stack — préfère l'itérative.

### ⚠️ Pièges classiques (les 3 bugs cultes)

- **Off-by-one sur les bornes.** Avec \`right = length - 1\` (inclusive) il faut \`while (left <= right)\`. Avec \`right = length\` (exclusive) il faut \`while (left < right)\`. Mélanger les deux conventions = bug garanti.
- **Boucle infinie.** Si tu fais \`left = mid\` (au lieu de \`mid + 1\`) quand \`arr[mid] < target\`, et que \`left === mid\`, tu boucles à l'infini. Toujours **rétrécir strictement** l'intervalle.
- **Overflow du mid.** \`(left + right) / 2\` peut déborder en C/Java sur de gros indices. \`left + (right - left) / 2\` ne déborde jamais. (En JS pas critique, mais prends l'habitude.)
- **Oublier que l'input DOIT être trié.** Sur un tableau non trié, binary search renvoie n'importe quoi sans planter.

### À écrire dans ton carnet

> Code à la main, 5 fois sans regarder : (1) binary search classique, (2) lower_bound, (3) "first bad version" (trouve le premier \`true\` dans \`[false, false, true, true]\`). Le but : que l'index ne te fasse plus jamais peur en entretien.
`,

  "sorting-elementary": `## Tris élémentaires : bubble, insertion, selection

Avant les tris "intelligents" en O(n log n), il faut maîtriser les trois tris naïfs en **O(n²)**. Pas pour les utiliser en prod, mais parce qu'ils ancrent les patterns (comparaison, échange, invariant) et qu'**insertion sort bat parfois les grands tris** sur petits inputs.

### Bubble sort — les bulles remontent

À chaque passe, on compare les paires adjacentes et on échange si elles sont dans le désordre. Le plus grand "remonte" en fin de tableau à chaque passe.

\`\`\`
[5, 2, 4, 1]  comparer (5,2) → swap → [2,5,4,1]
[2,5,4,1]     comparer (5,4) → swap → [2,4,5,1]
[2,4,5,1]     comparer (5,1) → swap → [2,4,1,5]  ← 5 en place
... on recommence sur le reste
\`\`\`

\`\`\`js
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {   // -i : la fin est déjà triée
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];       // swap
        swapped = true;
      }
    }
    if (!swapped) break;            // déjà trié → sortie anticipée → O(n) best case
  }
  return a;
}
\`\`\`

### Insertion sort — comme trier des cartes en main

Tu prends les éléments un par un et tu les insères à leur place dans la partie déjà triée à gauche.

\`\`\`
trié | non-trié
[2,5] | 4 1   → insère 4 : [2,4,5] | 1
[2,4,5] | 1   → insère 1 : [1,2,4,5]
\`\`\`

\`\`\`js
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {  // décale vers la droite tant que > key
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;                 // insère key au bon endroit
  }
  return a;
}
\`\`\`

### Selection sort — chercher le min, le poser

À chaque tour, on trouve le minimum du reste et on le place au début non-trié. Fait le **moins d'échanges** (n échanges) mais toujours O(n²) comparaisons.

\`\`\`python
def selection_sort(arr):
    a = arr[:]
    for i in range(len(a)):
        min_idx = i
        for j in range(i + 1, len(a)):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]  # un seul swap par tour
    return a
\`\`\`

### Comparaison

| Tri | Best | Avg | Worst | Espace | Stable ? |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | oui |
| Insertion | **O(n)** | O(n²) | O(n²) | O(1) | oui |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | non |

Tous **in-place** (O(1) espace). "Stable" = deux éléments égaux gardent leur ordre relatif d'origine (important si tu tries des objets sur une clé).

### Quand insertion sort gagne vraiment

- **Petits tableaux (n < 10-50)** : moins d'overhead que merge/quicksort. C'est pourquoi les vrais \`sort()\` (Timsort, introsort) basculent sur insertion sort pour les petits sous-tableaux.
- **Tableau presque trié** : O(n) — chaque élément est déjà presque à sa place.

### ⚠️ Pièges classiques

- **Oublier le \`-1 - i\` dans bubble.** Re-comparer la fin déjà triée n'est pas faux mais gaspille.
- **Croire que selection sort est stable.** Il ne l'est pas (le swap longue distance casse l'ordre des égaux).
- **Comparateur instable sur objets.** En JS, \`arr.sort()\` par défaut convertit en string (\`[10, 2].sort()\` → \`[10, 2]\`... non : \`[10, 2]\`). Toujours passer un comparateur \`(a,b) => a - b\` pour des nombres.

### À écrire dans ton carnet

> Lance bubble, insertion et selection sur le **même** tableau presque trié \`[1,2,3,5,4]\` et compte les comparaisons et les swaps de chacun. Lequel gagne et pourquoi ?
`,

  "sorting-merge": `## Merge sort — divide & conquer

Merge sort applique le principe **diviser pour régner** : couper le tableau en deux, trier chaque moitié récursivement, puis **fusionner** les deux moitiés triées. Résultat : **O(n log n) garanti** dans tous les cas, et **stable**.

### L'intuition

Fusionner deux paquets de cartes *déjà triés* est facile et rapide (O(n)) : tu compares les deux cartes du dessus et tu prends la plus petite. Merge sort exploite ça en triant d'abord des paquets minuscules (taille 1, triviallement triés), puis en les fusionnant en paquets de plus en plus grands.

### Schéma de l'arbre de récursion

\`\`\`
            [5, 2, 4, 1, 3]
           /              \\
      [5, 2]            [4, 1, 3]          ← diviser (log n niveaux)
      /    \\           /       \\
   [5]    [2]       [4]      [1, 3]
                              /    \\
                            [1]    [3]
   ───────────────── puis FUSIONNER en remontant ─────────────────
   [2, 5]            [1, 3, 4]
           \\              /
            [1, 2, 3, 4, 5]                ← chaque niveau de merge = O(n)
\`\`\`

\`log n\` niveaux × \`O(n)\` de fusion par niveau = **O(n log n)**.

### Implémentation JS

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;                 // base case : déjà trié
  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));      // trie la moitié gauche
  const right = mergeSort(arr.slice(mid));         // trie la moitié droite
  return merge(left, right);                       // fusionne
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]); // <= : garde la STABILITÉ
    else result.push(right[j++]);
  }
  // un des deux est épuisé : on colle le reste (déjà trié)
  while (i < left.length)  result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}
\`\`\`

### Implémentation Python

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

### Complexité

- **Temps : O(n log n)** dans TOUS les cas (best = avg = worst). Pas de pire cas vicieux comme quicksort.
- **Espace : O(n)** — on alloue des tableaux temporaires pour fusionner. C'est son défaut vs quicksort (in-place).
- **Stable** : les éléments égaux gardent leur ordre (grâce au \`<=\` dans merge).

### Merge sort externe (fichiers trop gros pour la RAM)

Si tu dois trier 100 Go avec 8 Go de RAM : découpe le fichier en morceaux qui tiennent en RAM, trie chacun, écris-les sur disque, puis **fusionne les fichiers triés** par un k-way merge (on lit un peu de chaque fichier à la fois). C'est exactement le \`merge\` ci-dessus, généralisé à k flux. C'est ainsi que les bases de données trient sur disque.

### ⚠️ Pièges classiques

- **Oublier le base case.** Sans \`length <= 1\`, récursion infinie / stack overflow.
- **Utiliser \`<\` au lieu de \`<=\` dans merge** → casse la stabilité (les égaux peuvent s'inverser).
- **Oublier de vider le reste.** Après la boucle principale, un des deux sous-tableaux a encore des éléments : il FAUT les ajouter.
- **Croire que c'est in-place.** Merge sort classique paie O(n) mémoire. Si la mémoire est critique, regarde heap sort ou quicksort.

### À écrire dans ton carnet

> Modifie \`merge\` pour qu'il **compte les inversions** (paires (i, j) avec i<j mais arr[i]>arr[j]). C'est le problème "Count Inversions", résolu en O(n log n) grâce à merge sort.
`,

  "sorting-quick": `## Quicksort — partition et randomisation

Quicksort est le tri par défaut de la plupart des langages. L'idée : choisir un **pivot**, **partitionner** le tableau en "plus petits que le pivot" / "plus grands", puis trier récursivement chaque côté. **In-place** (O(log n) mémoire) et rapide en pratique — mais **O(n²) au pire**.

### Le principe de la partition

\`\`\`
pivot = 5
[3, 7, 5, 1, 9, 2, 8]
        ↓ partition
[3, 1, 2] [5] [7, 9, 8]
 < pivot       > pivot
\`\`\`

Après une partition, le pivot est **à sa place définitive**. On recommence sur les deux sous-tableaux.

### Schéma de récursion

\`\`\`
[3,7,5,1,9,2,8]   pivot 5 → [3,1,2] 5 [7,9,8]
   /                              \\
[3,1,2] pivot 2 → [1] 2 [3]     [7,9,8] pivot 8 → [7] 8 [9]
\`\`\`

### Implémentation JS (Lomuto, pivot = dernier élément)

\`\`\`js
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;                  // base : 0 ou 1 élément
  const p = partition(arr, lo, hi);          // place le pivot, renvoie son index
  quickSort(arr, lo, p - 1);                 // trie la gauche
  quickSort(arr, p + 1, hi);                 // trie la droite
  return arr;
}

function partition(arr, lo, hi) {
  // randomisation : évite le pire cas sur tableau déjà trié
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[r], arr[hi]] = [arr[hi], arr[r]];
  const pivot = arr[hi];
  let i = lo - 1;                            // frontière des "< pivot"
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];   // pousse l'élément côté gauche
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]; // pivot à sa place finale
  return i + 1;
}
\`\`\`

### Lomuto vs Hoare

- **Lomuto** (ci-dessus) : pivot = dernier élément, un seul index qui avance. Simple à coder, mais fait plus de swaps.
- **Hoare** : deux indices qui partent des extrémités et se rejoignent. Moins de swaps, plus efficace en pratique, mais plus subtil (le pivot ne finit pas forcément à sa place exacte). C'est la variante d'origine de Tony Hoare.

### Pourquoi randomiser le pivot

Si tu prends toujours le premier/dernier élément comme pivot et que le tableau est **déjà trié**, chaque partition ne retire qu'un seul élément → profondeur n → **O(n²)** + stack overflow. La randomisation (ou pivot "médiane de trois") rend ce pire cas quasi impossible en pratique.

### Complexité

| Cas | Temps | Pourquoi |
|---|---|---|
| Best / Average | **O(n log n)** | partitions équilibrées |
| Worst | **O(n²)** | pivot toujours min/max (rare si randomisé) |
| Espace | **O(log n)** | profondeur de la récursion (in-place) |

Quicksort n'est **pas stable** (les swaps longue distance cassent l'ordre des égaux).

### Quicksort vs Merge sort

| | Quicksort | Merge sort |
|---|---|---|
| Temps moyen | O(n log n) | O(n log n) |
| Pire cas | O(n²) | O(n log n) |
| Espace | O(log n) in-place | O(n) |
| Stable | non | oui |
| En pratique | souvent + rapide (cache-friendly) | prévisible, sûr |

Les libs réelles utilisent souvent un hybride (**introsort** : quicksort qui bascule sur heap sort si la profondeur explose, + insertion sort sur les petits sous-tableaux).

### ⚠️ Pièges classiques

- **Pas de randomisation → O(n²) sur input trié/adversarial.** L'erreur classique en entretien.
- **\`lo >= hi\` comme base case.** Avec \`lo > hi\` seul tu peux boucler sur des sous-tableaux de taille 1.
- **Index de partition mal renvoyé** → un élément est zappé ou trié deux fois.
- **Récursion sur le plus grand côté d'abord** = call stack O(n) au pire. Astuce : récurse sur le petit côté, itère sur le grand (tail-call manuel).

### À écrire dans ton carnet

> Implémente \`quickselect\` (trouver le k-ième plus petit élément en **O(n) moyen**) : c'est quicksort qui ne récurse que du côté contenant k. Classique d'entretien ("Kth Largest Element").
`,

  "trees-bst": `## Arbres binaires + BST

Un arbre est une structure **hiérarchique** : un node racine, qui a des enfants, qui ont des enfants... sans cycle. Un **arbre binaire** : chaque node a au plus 2 enfants (left, right). Un **BST** (Binary Search Tree) ajoute une règle qui rend la recherche logarithmique.

### Vocabulaire

\`\`\`
            (8)         ← root (racine)
           /   \\
        (3)     (10)    ← (3) et (10) sont des enfants de (8)
        / \\        \\
     (1) (6)       (14) ← (1),(6),(14) sont des feuilles (leaf, pas d'enfant)
\`\`\`

- **root** : le node tout en haut. **leaf** : node sans enfant.
- **depth** d'un node : distance depuis la racine (root = 0).
- **height** de l'arbre : profondeur de la feuille la plus basse.

### La propriété BST (invariant)

> Pour tout node : **tout le sous-arbre gauche < node < tout le sous-arbre droit**.

C'est ce qui permet de chercher en élaguant une moitié à chaque node — exactement comme binary search, mais sur un arbre.

### Implémentation JS

\`\`\`js
class TreeNode {
  constructor(value) { this.value = value; this.left = null; this.right = null; }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (value < cur.value) {               // va à gauche
        if (!cur.left) { cur.left = node; return; }
        cur = cur.left;
      } else {                               // va à droite
        if (!cur.right) { cur.right = node; return; }
        cur = cur.right;
      }
    }
  }

  search(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right; // élague une moitié
    }
    return false;
  }
}
\`\`\`

### Les 4 traversées (à connaître par cœur)

\`\`\`
        (8)
       /   \\
     (3)   (10)
     / \\      \\
   (1) (6)    (14)
\`\`\`

| Traversée | Ordre | Résultat sur l'arbre |
|---|---|---|
| **In-order** (G, node, D) | gauche → node → droite | 1, 3, 6, 8, 10, 14 ← **TRIÉ !** |
| **Pre-order** (node, G, D) | node → gauche → droite | 8, 3, 1, 6, 10, 14 |
| **Post-order** (G, D, node) | gauche → droite → node | 1, 6, 3, 14, 10, 8 |
| **Level-order** (BFS) | niveau par niveau | 8, 3, 10, 1, 6, 14 |

\`\`\`js
function inOrder(node, out = []) {
  if (!node) return out;          // base case
  inOrder(node.left, out);        // 1. tout le sous-arbre gauche
  out.push(node.value);           // 2. le node lui-même
  inOrder(node.right, out);       // 3. tout le sous-arbre droit
  return out;                     // sur un BST → liste triée
}
\`\`\`

In-order sur un BST sort les valeurs **triées** : c'est le test mental pour vérifier qu'un arbre est un BST valide.

### Suppression (le cas délicat)

Trois cas : (1) feuille → on la retire ; (2) un enfant → on remonte l'enfant ; (3) **deux enfants** → on remplace par le **successeur in-order** (le plus petit du sous-arbre droit), puis on supprime ce successeur.

### Complexité

| Opération | Équilibré | Dégénéré (peigne) |
|---|---|---|
| insert / search / delete | **O(log n)** | **O(n)** |
| Espace (récursion) | O(log n) | O(n) |
| Stockage | O(n) | O(n) |

Un BST **dégénère** en linked list si tu insères des valeurs déjà triées (1,2,3,4...) → height = n → tout devient O(n). Les arbres **auto-équilibrés** (AVL, Red-Black) corrigent ça (sprint ultérieur).

### ⚠️ Pièges classiques

- **Oublier le base case \`if (!node) return\`** dans les traversées → crash sur null.
- **BST dégénéré sur input trié.** Sans rééquilibrage, l'avantage O(log n) disparaît.
- **Confondre les 3 traversées.** Mnémo : le préfixe (pre/in/post) = **quand** on visite le node (avant/entre/après les enfants).
- **Suppression bâclée.** Le cas "deux enfants" est le piège : il faut le successeur in-order, pas n'importe quel enfant.

### À écrire dans ton carnet

> Écris \`isValidBST(root)\` qui vérifie la propriété BST. Piège : il ne suffit PAS de comparer chaque node à ses enfants directs — il faut propager un intervalle [min, max] autorisé à chaque descente.
`,

  "bfs-dfs-trees": `## BFS et DFS sur arbres

Deux façons de visiter tous les nodes d'un arbre. **BFS** (Breadth-First) explore **niveau par niveau**, en largeur. **DFS** (Depth-First) plonge **à fond dans une branche** avant de remonter. Le choix dépend de ce que tu cherches.

### Schéma de l'arbre exemple

\`\`\`
            (A)
           /   \\
        (B)     (C)
        / \\       \\
     (D) (E)      (F)
\`\`\`

- **BFS** visite : A, B, C, D, E, F  (un étage à la fois, gauche→droite)
- **DFS** visite : A, B, D, E, C, F  (descend B à fond avant C)

### BFS = une QUEUE, niveau par niveau

\`\`\`js
function bfs(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];                 // FIFO
  while (queue.length) {
    const node = queue.shift();         // défile le plus ancien (front)
    result.push(node.value);
    if (node.left)  queue.push(node.left);   // enfile les enfants
    if (node.right) queue.push(node.right);
  }
  return result;
}
// (en prod, remplace l'array+shift O(n) par une vraie queue / index pointer)
\`\`\`

Variante "par niveau" (très demandée en entretien) : à chaque tour de \`while\`, traite \`queue.length\` nodes d'un coup = un niveau complet.

### DFS = la RÉCURSION (ou une stack)

\`\`\`js
// Récursif (pre-order) — la call stack EST la pile
function dfs(node, result = []) {
  if (!node) return result;        // base case
  result.push(node.value);         // visite le node
  dfs(node.left, result);          // plonge à gauche
  dfs(node.right, result);         // puis à droite
  return result;
}

// Itératif avec une stack explicite (utile si profondeur > limite call stack)
function dfsIter(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];                 // LIFO
  while (stack.length) {
    const node = stack.pop();           // dépile le dernier
    result.push(node.value);
    // push droite AVANT gauche → gauche traité en premier (LIFO)
    if (node.right) stack.push(node.right);
    if (node.left)  stack.push(node.left);
  }
  return result;
}
\`\`\`

### Version Python (BFS)

\`\`\`python
from collections import deque

def bfs(root):
    if not root: return []
    result, q = [], deque([root])
    while q:
        node = q.popleft()        # O(1) — pas list.pop(0) !
        result.append(node.value)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return result
\`\`\`

### Le lien clé : BFS↔queue, DFS↔stack

\`\`\`
BFS : on traite le plus ANCIEN découvert → FIFO → queue → en largeur
DFS : on traite le plus RÉCENT découvert → LIFO → stack → en profondeur
\`\`\`

C'est littéralement la même boucle ; seul le conteneur (queue vs stack) change la stratégie.

### Quand choisir lequel

- **BFS** : plus court chemin en nombre d'arêtes, traitement par niveaux, "le node le plus proche de la racine qui vérifie X".
- **DFS** : explorer toutes les branches, traversées in/pre/post-order, problèmes récursifs (height, somme des chemins), moins de mémoire si l'arbre est large mais peu profond.

### Complexité (pour les deux)

- **Temps : O(n)** — chaque node visité une fois.
- **Espace : BFS O(w)** où w = largeur max d'un niveau (au pire ~n/2 pour le dernier niveau d'un arbre complet). **DFS O(h)** où h = hauteur (O(log n) si équilibré, O(n) si dégénéré).

### ⚠️ Pièges classiques

- **\`queue.shift()\` en JS est O(n).** Sur un gros arbre, BFS devient O(n²). Utilise un pointeur d'index ou une vraie queue.
- **Ordre d'empilement en DFS itératif.** Pour visiter gauche d'abord, pousse **droite avant gauche** (LIFO inverse).
- **Oublier le base case \`if (!node)\`** → crash.
- **Sur un arbre, pas besoin de visited set** (pas de cycle). Sur un GRAPHE, si — c'est la leçon suivante.

### À écrire dans ton carnet

> Code \`maxDepth(root)\` (DFS récursif) ET \`levelOrder(root)\` qui renvoie un tableau de tableaux, un par niveau (BFS par couches). Ce sont les deux exos d'arbre les plus fréquents en entretien.
`,

  "bfs-dfs-graphs": `## BFS et DFS sur graphes

Un graphe = des nodes reliés par des arêtes, **avec possibilité de cycles** et de plusieurs chemins vers un même node. BFS et DFS marchent comme sur les arbres, mais avec **une différence vitale** : un **visited set**, sinon tu boucles à l'infini.

### Arbre vs graphe : la différence qui change tout

\`\`\`
Arbre (acyclique, 1 seul chemin) :   Graphe (cycles, plusieurs chemins) :

      A                                   A ─── B
     / \\                                  │  ╲  │
    B   C                                 │    ╲│
                                          C ─── D   (A-B-D-C-A = cycle !)
\`\`\`

Sans visited set sur le graphe : A → B → D → C → A → B → ... à l'infini.

### Représentations d'un graphe

\`\`\`js
// Adjacency list (la plus courante) — pour chaque node, ses voisins
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C"],
};
// Espace O(V + E). Idéal pour graphes creux (peu d'arêtes).

// Adjacency matrix — matrix[i][j] = 1 si arête i→j
//      A  B  C  D
//  A [ 0, 1, 1, 0 ]
//  B [ 1, 0, 0, 1 ]
// ... Espace O(V²). Idéal pour graphes denses, test d'arête en O(1).
\`\`\`

### BFS sur graphe (queue + visited)

\`\`\`js
function bfs(graph, start) {
  const visited = new Set([start]);     // ← LA différence clé
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {     // ne re-visite jamais
        visited.add(neighbor);          // marque AVANT d'enfiler (évite doublons en queue)
        queue.push(neighbor);
      }
    }
  }
  return order;
}
\`\`\`

### DFS sur graphe (récursif + visited)

\`\`\`js
function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);                   // marque dès l'entrée
  order.push(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, order);  // plonge
    }
  }
  return order;
}
\`\`\`

### Version Python (DFS itératif avec stack)

\`\`\`python
def dfs(graph, start):
    visited, stack, order = set(), [start], []
    while stack:
        node = stack.pop()
        if node in visited:
            continue                  # déjà vu → ignore
        visited.add(node)
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return order
\`\`\`

### BFS = plus court chemin (graphe non pondéré)

Comme BFS explore par couches (distance 1, puis 2, puis 3...), **le premier moment où il atteint un node = le plus court chemin en nombre d'arêtes**. Garde un \`dist\`/\`parent\` map pour reconstruire le chemin.

\`\`\`
start=A, BFS atteint :  A(0) → B,C(1) → D(2)
→ plus court A→D = 2 arêtes (via B ou C)
\`\`\`

(Pour un graphe **pondéré**, BFS ne suffit plus → Dijkstra, sprint ultérieur.)

### Détection de cycle

\`\`\`js
// Graphe NON orienté : un cycle si on atteint un node déjà visité
// QUI N'EST PAS le parent direct.
function hasCycle(graph, node, visited, parent) {
  visited.add(node);
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      if (hasCycle(graph, neighbor, visited, node)) return true;
    } else if (neighbor !== parent) {   // visité ET pas le parent → cycle
      return true;
    }
  }
  return false;
}
\`\`\`

(Graphe **orienté** : on détecte un cycle si on retombe sur un node *en cours de visite* — couleur grise, via un second set "en cours".)

### Complexité (BFS et DFS)

- **Temps : O(V + E)** — chaque node et chaque arête visités une fois (avec adjacency list).
- **Espace : O(V)** — le visited set + la queue/stack.

### ⚠️ Pièges classiques

- **Oublier le visited set = boucle infinie.** LA différence n°1 avec les arbres. Sur tout graphe potentiellement cyclique, visited est obligatoire.
- **Marquer visited trop tard (BFS).** Marque un node **au moment où tu l'enfiles**, pas quand tu le défiles — sinon il peut être ajouté plusieurs fois à la queue.
- **Graphe déconnecté.** Un seul BFS/DFS depuis un start ne couvre qu'une composante. Pour tout visiter, lance depuis chaque node non encore visité.
- **\`shift()\` O(n) en JS** : même piège qu'en BFS d'arbre, dégrade en O(V·E). Utilise une vraie queue.
- **Détection de cycle orienté ≠ non orienté.** Ne réutilise pas la logique "parent" sur un graphe orienté.

### À écrire dans ton carnet

> Code "Number of Islands" (compter les composantes connexes dans une grille de 0/1) en BFS *et* en DFS. Puis "shortest path in a maze" en BFS. Ce sont les deux applications graphe les plus testées en entretien.
`,
};
