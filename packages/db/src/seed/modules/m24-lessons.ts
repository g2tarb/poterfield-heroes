/**
 * M24 — Python (scripting, scraping, data) : contenu pédagogique markdown.
 * Une leçon par skill slug. Public : dev JS/TS confirmé (Erwin) qui apprend
 * Python pour l'OUTILLAGE (scripting, parsing, réseau, automatisation
 * offensive/défensive). Chaque leçon ouvre par l'équivalence JS→Python.
 *
 * Appliqué via UPDATE skills SET content_markdown WHERE slug = key.
 */
export const m24LessonContent: Record<string, string> = {
  "python-vs-js": `## Python vu depuis JS : le mapping de survie

Tu sais déjà programmer. Apprendre Python, ce n'est pas réapprendre les concepts (variables, fonctions, boucles, objets), c'est **réapprendre l'orthographe**. On va donc traduire ce que tu connais déjà.

### L'analogie : deux dialectes de la même famille

JS et Python sont tous deux **interprétés, dynamiques, à garbage collector, multi-paradigme**. Pense Python comme un cousin de JS qui aurait grandi dans le monde scientifique : moins de cérémonie syntaxique (pas de \`;\`, pas de \`{}\`), plus de "batteries incluses" (lib standard énorme). Là où JS optimise pour le navigateur, Python optimise pour le **script qu'on écrit en 10 lignes et qu'on jette le soir même**.

### Le tableau de correspondance fondamental

| Concept | JavaScript | Python |
|---|---|---|
| Déclaration | \`const x = 1\` / \`let\` | \`x = 1\` (rien) |
| Bloc | \`{ ... }\` | \`:\` + **indentation** |
| Nul | \`null\` / \`undefined\` | \`None\` |
| Vrai/faux | \`true\` / \`false\` | \`True\` / \`False\` |
| Égalité valeur | \`===\` | \`==\` |
| Identité (ref) | \`===\` sur objets | \`is\` |
| ET / OU / NON | \`&&\` \`||\` \`!\` | \`and\` \`or\` \`not\` |
| Tableau | \`[1, 2]\` (Array) | \`[1, 2]\` (list) |
| Objet/map | \`{}\` / \`Map\` | \`dict\` \`{}\` |
| Template string | \`\\\`Hi \${name}\\\`\` | \`f"Hi {name}"\` |
| Comment | \`// foo\` | \`# foo\` |
| Print debug | \`console.log(x)\` | \`print(x)\` |
| Longueur | \`arr.length\` | \`len(arr)\` |
| Ternaire | \`a ? b : c\` | \`b if a else c\` |

### Le premier vrai changement mental : l'indentation EST la syntaxe

\`\`\`python
def saluer(nom: str) -> str:
    if nom:                      # le ":" ouvre le bloc
        return f"Salut {nom}"    # l'indentation (4 espaces) = le corps
    return "Salut inconnu"       # désindenter = sortir du if
\`\`\`

Pas d'accolades. Un mauvais alignement = \`IndentationError\` ou pire, un bug logique silencieux. C'est le contraire de JS où le formatage est cosmétique.

### Le deuxième : tout est expression-orienté mais sans \`return\` implicite

En Python pas d'\`undefined\` retourné : une fonction sans \`return\` renvoie \`None\`. Et le typage est dynamique mais **fortement typé** : \`"3" + 5\` lève une \`TypeError\` (contrairement à JS qui coerce en \`"35"\`). C'est une bonne nouvelle pour l'outillage : moins de bugs de coercition sournois.

### ⚠️ Pièges

- **\`is\` vs \`==\`** : \`==\` compare les valeurs, \`is\` compare l'identité mémoire. Utilise \`is\` UNIQUEMENT pour \`None\` / \`True\` / \`False\` (\`if x is None:\`). \`a == b\` partout ailleurs.
- **Pas de \`++\`** : Python n'a pas d'incrément. C'est \`i += 1\`.
- **Vérité Python** : \`0\`, \`""\`, \`[]\`, \`{}\`, \`None\` sont *falsy* — comme en JS, mais \`if liste:\` est l'idiome pour "liste non vide", pas \`if len(liste) > 0\`.
- **Pas de \`var\`/\`let\`/\`const\`** : la portée est par **fonction**, pas par bloc. Une variable créée dans un \`if\` survit après le \`if\`.

### À retenir

> Tu n'apprends pas un nouveau langage, tu transposes. Garde ce tableau sous les yeux la première semaine et le reste devient mécanique.
`,

  "uv-ruff": `## uv + Ruff : la chaîne d'outils Python 2026

En JS tu as \`npm\`/\`pnpm\` pour les paquets et \`eslint\`/\`prettier\` pour le lint+format. En Python 2026, l'équivalent moderne tient en deux binaires écrits en Rust : **uv** (paquets + venvs + Python lui-même) et **Ruff** (linter + formatter).

### L'analogie : oublie pip/poetry, comme tu as oublié npm pour pnpm

Historiquement Python = \`pip\` + \`virtualenv\` + \`pip-tools\` + \`black\` + \`flake8\` + \`isort\`... un patchwork lent. \`uv\` et \`Ruff\` (même éditeur, Astral) remplacent tout ça, 10 à 100× plus vite.

### Correspondances JS ↔ Python

| Besoin | JS (pnpm) | Python (uv) |
|---|---|---|
| Init projet | \`pnpm init\` | \`uv init mon-outil\` |
| Ajouter dépendance | \`pnpm add httpx\` | \`uv add httpx\` |
| Dev dépendance | \`pnpm add -D\` | \`uv add --dev pytest\` |
| Installer tout | \`pnpm install\` | \`uv sync\` |
| Lancer un script | \`pnpm exec\` | \`uv run script.py\` |
| Lockfile | \`pnpm-lock.yaml\` | \`uv.lock\` |
| Manifeste | \`package.json\` | \`pyproject.toml\` |
| Outil CLI global | \`pnpm add -g\` | \`uv tool install ruff\` |

### Workflow type de zéro

\`\`\`bash
uv init scanner           # crée pyproject.toml + .venv + structure
cd scanner
uv add httpx              # ajoute la dépendance + met à jour le lock
uv add --dev ruff pytest  # outils de dev
uv run python main.py     # exécute DANS le venv (pas besoin d'activer)
\`\`\`

\`uv run\` est la clé : il garantit que le code tourne dans l'environnement du projet, **sans activation manuelle du venv**. Fini les "ça marche pas, ah j'avais pas activé".

### Ruff : lint + format en une commande

\`\`\`bash
uv run ruff check .          # lint (équiv. eslint)
uv run ruff check --fix .    # auto-fix
uv run ruff format .         # format (équiv. prettier/black)
\`\`\`

Config dans \`pyproject.toml\` :

\`\`\`toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]  # erreurs, pyflakes, imports, upgrade, bugbear
\`\`\`

### ⚠️ Pièges

- **Ne jamais \`pip install\` dans un projet uv** : tu désynchronises le lockfile. Toujours \`uv add\`.
- **\`uv run\` > activer le venv** : pour les scripts ponctuels et la CI, \`uv run\` est plus robuste (pas d'état de shell oublié).
- **Ruff format ≠ Ruff check** : ce sont deux sous-commandes distinctes. Le format ne corrige pas les bugs de lint et vice-versa.
- **uv gère aussi Python** : \`uv python install 3.12\` télécharge l'interpréteur. Plus besoin de pyenv.

### À retenir

> uv = pnpm de Python, Ruff = eslint+prettier de Python. Deux binaires Rust, zéro config initiale, et tu repars sur du connu.
`,

  "syntax": `## Syntaxe Python : les boucles et l'itération idiomatique

En JS tu écris \`for (let i = 0; i < arr.length; i++)\` ou \`for (const x of arr)\`. Python n'a qu'**une** boucle \`for\`, et elle itère toujours sur quelque chose — comme le \`for...of\` de JS, jamais comme le \`for(;;)\`.

### L'analogie : Python n'a pas de boucle "à compteur"

Pour avoir un compteur, tu n'incrémentes pas une variable : tu génères une séquence avec \`range()\`, puis tu itères dessus. C'est un changement de réflexe.

\`\`\`python
# JS : for (let i = 0; i < 5; i++) console.log(i)
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

# range(début, fin, pas) — fin EXCLUE, comme en JS
for i in range(2, 10, 2): # 2, 4, 6, 8
    print(i)
\`\`\`

### Les trois outils d'itération à connaître par cœur

\`enumerate\`, \`zip\`, \`range\` remplacent 90 % de tes \`for\` indexés JS.

\`\`\`python
fruits = ["pomme", "kiwi", "mangue"]

# enumerate = JS .entries() / index + valeur
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")          # 0: pomme ...

# zip = parcourir 2+ listes en parallèle (JS n'a pas d'équivalent natif)
prix = [1.2, 0.8, 2.5]
for fruit, p in zip(fruits, prix):
    print(f"{fruit} coûte {p}€")
\`\`\`

### Tableau de correspondance

| JS | Python |
|---|---|
| \`for (const x of arr)\` | \`for x in arr:\` |
| \`for (const [i, x] of arr.entries())\` | \`for i, x in enumerate(arr):\` |
| \`for (const k in obj)\` | \`for k in dico:\` (clés) |
| \`Object.entries(obj)\` | \`dico.items()\` |
| \`while (cond)\` | \`while cond:\` |
| \`break\` / \`continue\` | identiques |
| \`arr.length\` | \`len(arr)\` |

### Le \`for...else\` : exotique mais utile en outillage

\`\`\`python
# Le bloc else s'exécute si la boucle finit SANS break
for port in [22, 80, 443]:
    if port == 8080:
        print("trouvé")
        break
else:
    print("port 8080 absent de la liste")  # s'exécute ici
\`\`\`

Pratique pour les recherches : "j'ai tout parcouru sans trouver".

### Conditions et match

\`\`\`python
x = 5
if x > 10:
    cat = "grand"
elif x > 3:            # elif, pas "else if"
    cat = "moyen"
else:
    cat = "petit"

# match (Python 3.10+) = switch boosté
match cmd:
    case "scan": run_scan()
    case "list" | "ls": run_list()      # plusieurs valeurs
    case _: print("inconnu")            # _ = default
\`\`\`

### ⚠️ Pièges

- **\`range(n)\` est paresseux** : ce n'est pas une liste. \`list(range(5))\` pour matérialiser.
- **Indentation = bloc** : un \`for\` ou \`if\` mal indenté change le sens du code. 4 espaces, jamais de tabs mélangés.
- **\`for k in dico\` itère les CLÉS**, pas les paires. Utilise \`dico.items()\` pour clé+valeur.
- **Pas de \`i++\`** dans la boucle : tu n'en as pas besoin, \`for\` gère l'itération.

### À retenir

> Oublie \`for(let i=...)\`. En Python tu itères toujours sur une séquence : \`range\`, \`enumerate\`, \`zip\` sont tes trois leviers.
`,

  "data-structures": `## list, tuple, dict, set : les conteneurs Python

JS te donne \`Array\`, \`Object\`, \`Map\`, \`Set\`. Python a quatre types built-in qui couvrent les mêmes besoins, avec une distinction nette **mutable vs immutable** que JS ne formalise pas.

### L'analogie

\`\`\`python
ma_liste  = [1, 2, 3]          # list  ≈ Array (mutable, ordonnée)
mon_tuple = (1, 2, 3)          # tuple ≈ Array figée (immutable)
mon_dict  = {"a": 1, "b": 2}   # dict  ≈ Map / objet (mutable)
mon_set   = {1, 2, 3}          # set   ≈ Set (mutable, sans doublons)
\`\`\`

### Tableau de correspondance

| JS | Python | Mutable ? |
|---|---|---|
| \`[1,2,3]\` | \`list\` \`[1,2,3]\` | oui |
| (pas d'équiv direct) | \`tuple\` \`(1,2,3)\` | **non** |
| \`{}\` / \`Map\` | \`dict\` \`{}\` | oui |
| \`new Set()\` | \`set\` \`{1,2}\` | oui |
| (figé) | \`frozenset\` | **non** |
| \`arr.push(x)\` | \`liste.append(x)\` | — |
| \`arr.includes(x)\` | \`x in liste\` (O(n)) | — |
| \`set.has(x)\` | \`x in mon_set\` (O(1)) | — |
| \`Object.keys(o)\` | \`dico.keys()\` | — |
| \`map.get(k)\` | \`dico[k]\` ou \`dico.get(k)\` | — |

### list : ton couteau suisse

\`\`\`python
ports = [22, 80, 443]
ports.append(8080)        # push
ports.extend([3306, 5432])# concat in-place
ports.pop()               # retire et renvoie le dernier
ports[0]                  # 22
ports[-1]                 # 5432 (index négatif = depuis la fin !)
ports[1:3]                # [80, 443] (slicing : début inclus, fin exclue)
\`\`\`

Le **slicing** \`liste[a:b:pas]\` et les **index négatifs** n'existent pas en JS et changent la vie : \`liste[::-1]\` inverse une liste.

### tuple : l'immuable qui sert de clé et de retour multiple

\`\`\`python
def min_max(nums: list[int]) -> tuple[int, int]:
    return min(nums), max(nums)   # retourne un tuple

bas, haut = min_max([3, 9, 1])    # unpacking, comme la destructuration JS

# Un tuple peut être clé de dict (une list ne peut PAS)
cache: dict[tuple[str, int], str] = {}
cache[("192.168.0.1", 80)] = "ouvert"
\`\`\`

### dict et set : O(1) pour la dédup et le lookup

\`\`\`python
# dédoublonner une liste (idiome outillage classique)
ips = ["1.1.1.1", "8.8.8.8", "1.1.1.1"]
uniques = set(ips)                # {"1.1.1.1", "8.8.8.8"}

# compter des occurrences
from collections import Counter
Counter(ips)                      # Counter({"1.1.1.1": 2, "8.8.8.8": 1})
\`\`\`

### ⚠️ Pièges

- **\`is\` vs \`==\`** : \`[1] == [1]\` est \`True\` (valeurs), mais \`[1] is [1]\` est \`False\` (objets différents).
- **dict/set ne sont pas ordonnés... sauf que si** : depuis 3.7 les dict gardent l'ordre d'insertion. Les set, **non** : ne compte jamais sur l'ordre d'un set.
- **Copie superficielle** : \`b = a\` copie la *référence*, pas la liste. \`b = a.copy()\` ou \`b = a[:]\` pour une vraie copie superficielle ; \`copy.deepcopy(a)\` pour profonde.
- **\`{}\` est un dict vide, pas un set** : un set vide s'écrit \`set()\`.

### À retenir

> list = Array, dict = Map, set = Set, tuple = Array figée et hashable. Le slicing et les index négatifs sont les deux superpouvoirs que JS n'a pas.
`,

  "comprehensions": `## Comprehensions : le map/filter pythonique

En JS tu chaînes \`arr.filter(x => x > 0).map(x => x * 2)\`. En Python l'idiome équivalent — et préféré — est la **list comprehension** : \`[x*2 for x in arr if x > 0]\`. Une fois le réflexe acquis, c'est plus court et plus lisible.

### L'analogie : lis-la de droite à gauche... presque

\`\`\`python
# JS  : arr.filter(x => x > 0).map(x => x * 2)
# Py  : [ x*2   for x in arr   if x > 0 ]
#         ^^^      ^^^^^^^^^      ^^^^^^
#       transform  source        filtre
\`\`\`

La structure est toujours : \`[EXPRESSION for ÉLÉMENT in SOURCE if CONDITION]\`. La condition est optionnelle.

### Les trois variantes

\`\`\`python
nums = [1, -2, 3, -4, 5]

# list comprehension
[x * 2 for x in nums if x > 0]        # [2, 6, 10]

# dict comprehension (JS : Object.fromEntries(...))
{x: x**2 for x in range(4)}           # {0: 0, 1: 1, 2: 4, 3: 9}

# set comprehension (dédoublonne automatiquement)
{x % 3 for x in range(10)}            # {0, 1, 2}
\`\`\`

### Tableau de correspondance

| JS | Python |
|---|---|
| \`arr.map(f)\` | \`[f(x) for x in arr]\` |
| \`arr.filter(p)\` | \`[x for x in arr if p(x)]\` |
| \`arr.filter(p).map(f)\` | \`[f(x) for x in arr if p(x)]\` |
| \`Object.fromEntries(pairs)\` | \`{k: v for k, v in pairs}\` |
| \`new Set(arr.map(f))\` | \`{f(x) for x in arr}\` |

### Cas outillage concret : parser une sortie

\`\`\`python
raw = "22:open\\n80:closed\\n443:open\\n8080:open"

# extraire les ports ouverts en une ligne
ouverts = [
    int(ligne.split(":")[0])
    for ligne in raw.splitlines()
    if ligne.endswith("open")
]
# [22, 443, 8080]
\`\`\`

### Comprehension imbriquée et générateur

\`\`\`python
# aplatir une matrice (JS : arr.flat())
matrice = [[1, 2], [3, 4]]
[x for ligne in matrice for x in ligne]   # [1, 2, 3, 4]

# generator expression : parenthèses au lieu de crochets
#  → paresseux, pas de liste en mémoire (crucial pour gros fichiers)
total = sum(int(l.split(":")[0]) for l in raw.splitlines())
\`\`\`

### ⚠️ Pièges

- **Ne pas tout fourrer dedans** : si la logique a plusieurs \`if\`/\`else\` ou des effets de bord, une vraie boucle \`for\` est plus lisible. La comprehension est pour *transformer*, pas pour *agir*.
- **\`if\` après / \`if/else\` avant** : filtre = \`[x for x in a if cond]\` ; transformation conditionnelle = \`[x if cond else 0 for x in a]\`. Position différente !
- **Generator vs list** : \`(...)\` est paresseux et **consommable une seule fois**. \`[...]\` matérialise tout en mémoire. Pour 10 M de lignes, utilise le générateur.
- **Fuite de variable** : la variable de boucle d'une comprehension ne fuit pas (contrairement à un \`for\` classique). Bon point.

### À retenir

> \`[transform for x in source if filtre]\`. C'est map+filter en une expression. Pour les gros volumes, remplace \`[]\` par \`()\` et tu gagnes un générateur paresseux.
`,

  "functions-py": `## Fonctions Python : args, kwargs, lambdas, defaults

Les fonctions JS et Python se ressemblent beaucoup, mais Python ajoute des **arguments nommés** (keyword args) de première classe et la fameuse syntaxe \`*args\` / \`**kwargs\` — beaucoup plus puissante que le \`...rest\` de JS.

### L'analogie

\`\`\`python
# JS : function add(a, b = 0) { return a + b }
def add(a: int, b: int = 0) -> int:   # defaults + type hints
    return a + b

add(3)          # 3
add(3, 4)       # 7
add(a=3, b=4)   # appel par mot-clé — toujours possible en Python
add(b=4, a=3)   # ordre libre quand on nomme
\`\`\`

### \*args et \*\*kwargs : le rest/spread de Python sous stéroïdes

\`\`\`python
def log(*args, **kwargs):
    print("positionnels:", args)     # tuple de tous les args sans nom
    print("nommés:", kwargs)         # dict de tous les args nommés

log(1, 2, level="warn", tag="net")
# positionnels: (1, 2)
# nommés: {'level': 'warn', 'tag': 'net'}
\`\`\`

\`*\` capture/déballe les positionnels, \`**\` capture/déballe les nommés. Côté appel, le même \`*\`/\`**\` *déballe* :

\`\`\`python
nums = [3, 4]
add(*nums)                  # = add(3, 4)
config = {"a": 3, "b": 4}
add(**config)               # = add(a=3, b=4)
\`\`\`

### Tableau de correspondance

| JS | Python |
|---|---|
| \`(a, b = 0) => ...\` | \`def f(a, b=0):\` |
| \`(...rest) => ...\` | \`def f(*args):\` |
| \`f(...arr)\` (spread) | \`f(*arr)\` |
| \`{...obj}\` (objet) | \`{**dico}\` |
| \`x => x * 2\` | \`lambda x: x * 2\` |
| fonction nommée | \`def\` |

### Lambdas : volontairement bridées

\`\`\`python
double = lambda x: x * 2          # une seule expression, pas de bloc
sorted(ips, key=lambda ip: ip.count("."))   # usage typique : tri/clé
\`\`\`

Les lambdas Python ne contiennent **qu'une expression** (pas de \`if\`/boucle/\`return\`). Pour plus, utilise un vrai \`def\`. C'est un choix de design : Python pousse vers les fonctions nommées.

### Arguments keyword-only (utile pour les CLIs/outils)

\`\`\`python
def scan(host: str, *, timeout: float = 2.0, verbose: bool = False):
    ...                            # tout après * DOIT être nommé
scan("10.0.0.1", timeout=5)        # OK
scan("10.0.0.1", 5)                # TypeError : timeout est keyword-only
\`\`\`

### ⚠️ Pièges

- **Argument par défaut MUTABLE** — le piège #1 de Python :
\`\`\`python
def ajoute(item, panier=[]):       # ❌ la liste est créée UNE fois
    panier.append(item)
    return panier
ajoute("a")    # ['a']
ajoute("b")    # ['a', 'b']  ← la même liste persiste entre appels !

def ajoute(item, panier=None):     # ✅ pattern correct
    if panier is None:
        panier = []
    panier.append(item)
    return panier
\`\`\`
- **Lambda mono-expression** : pas de \`;\`, pas de bloc. Si tu galères, c'est que tu veux un \`def\`.
- **Closures et boucles** : comme en JS, attention à la capture tardive de variable dans une boucle (utilise un default arg ou \`functools.partial\`).

### À retenir

> \`*args\`/\`**kwargs\` = rest/spread surpuissants. JAMAIS de default mutable (\`=[]\`, \`={}\`) : mets \`=None\` et initialise dans le corps.
`,

  "classes-py": `## Classes + dataclasses : les objets en Python

Les classes Python ressemblent aux classes ES6, avec deux différences qui surprennent : le \`self\` explicite en premier paramètre, et \`__init__\` à la place de \`constructor\`. Et pour les objets "porteurs de données", il y a mieux : les **dataclasses**.

### L'analogie

\`\`\`python
# JS : class Host { constructor(ip) { this.ip = ip } scan() {...} }
class Host:
    def __init__(self, ip: str):    # constructor
        self.ip = ip                # this.ip = ip

    def scan(self) -> bool:         # self EXPLICITE en 1er param
        return ping(self.ip)

h = Host("10.0.0.1")                # pas de "new"
h.scan()
\`\`\`

### Tableau de correspondance

| JS | Python |
|---|---|
| \`constructor\` | \`__init__\` |
| \`this\` | \`self\` (explicite) |
| \`new Foo()\` | \`Foo()\` (pas de \`new\`) |
| \`class B extends A\` | \`class B(A):\` |
| \`super()\` | \`super().__init__()\` |
| \`get prop()\` | \`@property\` |
| \`static method\` | \`@staticmethod\` / \`@classmethod\` |
| \`toString()\` | \`__str__\` / \`__repr__\` |

### dataclasses : la classe "données" sans boilerplate

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class ScanResult:
    host: str
    port: int
    open: bool = False
    banners: list[str] = field(default_factory=list)  # ⚠ pas = []

r = ScanResult("10.0.0.1", 80, True)
print(r)        # ScanResult(host='10.0.0.1', port=80, open=True, banners=[])
r == ScanResult("10.0.0.1", 80, True)   # True — __eq__ généré gratuitement
\`\`\`

\`@dataclass\` génère \`__init__\`, \`__repr__\`, \`__eq__\` automatiquement. C'est l'équivalent d'un type/interface JS mais avec une vraie instance et des méthodes. Pour de l'outillage, c'est ton choix par défaut pour modéliser des résultats.

### @property : un getter qui se lit comme un attribut

\`\`\`python
class Host:
    def __init__(self, ip: str):
        self._ip = ip

    @property
    def is_private(self) -> bool:
        return self._ip.startswith(("10.", "192.168.", "172."))

Host("10.0.0.1").is_private   # True — pas de () , c'est un getter
\`\`\`

### @classmethod et @staticmethod

\`\`\`python
@dataclass
class Host:
    ip: str

    @classmethod
    def from_url(cls, url: str) -> "Host":   # constructeur alternatif
        return cls(url.split("//")[1].split("/")[0])

    @staticmethod
    def is_valid(ip: str) -> bool:           # ne touche ni self ni cls
        return ip.count(".") == 3
\`\`\`

### ⚠️ Pièges

- **Oublier \`self\`** : toute méthode prend \`self\` en 1er. L'oublier donne une \`TypeError\` cryptique.
- **Default mutable dans une dataclass** : \`= []\` lève une erreur ; utilise \`field(default_factory=list)\`.
- **Attribut de classe vs instance** : un \`x = []\` au niveau de la classe (hors \`__init__\`) est **partagé entre toutes les instances** — même piège que le default mutable.
- **\`__str__\` vs \`__repr__\`** : \`__str__\` = lisible humain, \`__repr__\` = pour le debug (ce que tu vois dans le REPL). Une dataclass remplit \`__repr__\` pour toi.

### À retenir

> \`self\` explicite, pas de \`new\`. Pour modéliser de la donnée : \`@dataclass\` te donne init/repr/eq gratis. Et toujours \`default_factory\` pour les valeurs mutables.
`,

  "modules-py": `## Modules, packages et \`if __name__ == "__main__"\`

En JS un fichier = un module ESM avec \`export\`/\`import\`. En Python c'est plus simple encore : **tout fichier \`.py\` est un module** dont chaque variable/fonction de premier niveau est automatiquement "exportée" (importable).

### L'analogie

\`\`\`python
# fichier utils.py
def scan(host): ...
SECRET = 42

# fichier main.py
import utils                      # import * du module
utils.scan("10.0.0.1")

from utils import scan, SECRET    # import nommé
from utils import scan as do_scan # alias (JS : import { scan as ... })
\`\`\`

### Tableau de correspondance

| JS (ESM) | Python |
|---|---|
| \`import x from "./m"\` | \`import m\` |
| \`import { a, b } from "./m"\` | \`from m import a, b\` |
| \`import { a as c }\` | \`from m import a as c\` |
| \`import * as m\` | \`import m\` |
| \`export\` (implicite) | tout symbole top-level est importable |
| \`package.json\` "main" | \`__init__.py\` |
| sous-dossier de modules | **package** (dossier avec \`__init__.py\`) |

### Packages : un dossier qui regroupe des modules

\`\`\`
scanner/
  __init__.py        # marque le dossier comme package (peut être vide)
  net.py             # → import scanner.net
  parse.py           # → from scanner.parse import extract
  main.py
\`\`\`

\`\`\`python
# dans main.py
from scanner.net import ping
from scanner.parse import extract_ports
\`\`\`

### Le bloc magique : \`if __name__ == "__main__"\`

C'est l'idiome Python le plus reconnaissable, et il n'a pas vraiment d'équivalent JS direct.

\`\`\`python
def main() -> None:
    print("je tourne en tant que script")

if __name__ == "__main__":   # vrai SEULEMENT si lancé directement
    main()
\`\`\`

- \`python main.py\` → \`__name__ == "__main__"\` → le bloc s'exécute.
- \`import main\` depuis un autre fichier → \`__name__ == "main"\` → le bloc **ne** s'exécute **pas**.

C'est ce qui permet à un fichier d'être **à la fois** un script exécutable ET une bibliothèque importable, sans déclencher d'effets de bord à l'import. Le proche cousin de \`if (require.main === module)\` côté Node.

### ⚠️ Pièges

- **Imports circulaires** : \`a\` importe \`b\` qui importe \`a\` → \`ImportError\` partiel. Restructure ou importe localement dans la fonction.
- **Oublier le bloc \`__main__\`** : ton code de script s'exécute à chaque \`import\` du module — effets de bord surprise.
- **Imports relatifs vs absolus** : dans un package, \`from .net import ping\` (relatif) ou \`from scanner.net import ping\` (absolu). Le relatif ne marche que si le fichier est exécuté **comme partie d'un package** (\`python -m scanner.main\`), pas \`python scanner/main.py\`.
- **\`__pycache__\`** : Python met en cache le bytecode. À ajouter au \`.gitignore\` (comme \`node_modules\`/\`dist\`).

### À retenir

> Fichier = module, tout est exportable, dossier+\`__init__.py\` = package. Et \`if __name__ == "__main__":\` rend ton fichier importable sans déclencher son code de script.
`,

  "type-hints": `## Type hints + mypy/pyright : du TS dans Python

Tu viens de TS : tu vas adorer. Python a un système d'annotations de types, vérifié statiquement par **mypy** ou **pyright** (le même moteur que Pylance dans VS Code). La grande différence : à l'exécution, **les types sont ignorés** — c'est purement du tooling, comme TS qui s'efface au build.

### L'analogie : TS, mais la syntaxe est dans le langage

\`\`\`python
# TS : function add(a: number, b: number): number
def add(a: int, b: int) -> int:
    return a + b

nom: str = "scory"
ports: list[int] = [22, 80]
config: dict[str, int] = {"timeout": 5}
\`\`\`

### Tableau de correspondance TS ↔ Python

| TypeScript | Python (3.12+) |
|---|---|
| \`number\` | \`int\` / \`float\` |
| \`string\` | \`str\` |
| \`boolean\` | \`bool\` |
| \`T[]\` / \`Array<T>\` | \`list[T]\` |
| \`[A, B]\` (tuple) | \`tuple[A, B]\` |
| \`Record<K, V>\` | \`dict[K, V]\` |
| \`T \\| null\` | \`T \\| None\` (ou \`Optional[T]\`) |
| \`A \\| B\` | \`A \\| B\` |
| \`(x: T) => R\` | \`Callable[[T], R]\` |
| \`interface\` (forme) | \`TypedDict\` / \`Protocol\` |
| \`enum\` / littéraux | \`Literal["a", "b"]\` |
| \`any\` | \`Any\` |

### Les types avancés utiles en outillage

\`\`\`python
from typing import Optional, Callable, Literal, TypedDict, Protocol

# Optional[T] == T | None
def find(host: str) -> Optional[dict]: ...

# Literal : valeurs exactes autorisées (comme une union de littéraux TS)
def set_mode(m: Literal["tcp", "udp"]) -> None: ...

# TypedDict : la forme d'un dict (≈ interface TS)
class Result(TypedDict):
    host: str
    open: bool

# Protocol : duck typing structurel (≈ interface implicite TS)
class Scanner(Protocol):
    def scan(self, host: str) -> bool: ...
\`\`\`

### Vérifier : mypy ou pyright

\`\`\`bash
uv add --dev mypy           # ou : uv add --dev pyright
uv run mypy .               # vérifie tout le projet
uv run pyright .            # pyright = strict par défaut, recommandé
\`\`\`

\`\`\`toml
# pyproject.toml — mode strict
[tool.pyright]
typeCheckingMode = "strict"
\`\`\`

### ⚠️ Pièges

- **Les types ne sont PAS vérifiés à l'exécution** : \`add("a", "b")\` ne plante pas à cause des hints — c'est mypy/pyright qui le signale *avant*. Pour valider des données runtime (entrées réseau, JSON), utilise **Pydantic**, pas les hints seuls.
- **\`list[int]\` vs \`List[int]\`** : depuis 3.9+ utilise les génériques builtin minuscules (\`list\`, \`dict\`, \`tuple\`). Le \`from typing import List\` est legacy.
- **\`Optional[T]\` ≠ argument optionnel** : \`Optional[T]\` veut dire "peut valoir None", pas "peut être omis". Un argument omissible a une valeur par défaut.
- **\`Any\` désactive le typage** : comme \`any\` en TS, c'est une porte de sortie. Préfère \`object\` ou un type précis.

### À retenir

> C'est du TS avec une syntaxe native. Annote tes signatures, lance pyright en strict, et pour les données venant du réseau valide-les avec Pydantic — les hints seuls ne protègent pas au runtime.
`,

  "pathlib": `## pathlib : manipuler les chemins comme des objets

En Node tu fais \`path.join(dir, "file")\` et \`fs.readFileSync(p)\`. Python a deux écoles : l'ancienne \`os.path\` (strings) et la moderne **pathlib** (objets \`Path\`). Pour tout nouveau code : pathlib, point final.

### L'analogie : un chemin est un objet, pas une string

\`\`\`python
from pathlib import Path

base = Path("/var/log")
fichier = base / "scan.txt"        # l'opérateur / remplace path.join !
print(fichier)                      # /var/log/scan.txt
print(fichier.name)                 # scan.txt
print(fichier.suffix)               # .txt
print(fichier.parent)               # /var/log
\`\`\`

Le \`/\` surchargé pour joindre des chemins est l'idiome signature de pathlib.

### Tableau de correspondance

| Node (path/fs) | pathlib |
|---|---|
| \`path.join(a, b)\` | \`Path(a) / b\` |
| \`path.basename(p)\` | \`p.name\` |
| \`path.dirname(p)\` | \`p.parent\` |
| \`path.extname(p)\` | \`p.suffix\` |
| \`fs.existsSync(p)\` | \`p.exists()\` |
| \`fs.readFileSync(p, "utf8")\` | \`p.read_text()\` |
| \`fs.writeFileSync(p, s)\` | \`p.write_text(s)\` |
| \`fs.mkdirSync(p, {recursive})\` | \`p.mkdir(parents=True, exist_ok=True)\` |
| \`fs.readdirSync(d)\` | \`p.iterdir()\` |
| glob | \`p.glob("*.log")\` / \`p.rglob("*.py")\` |

### Lire/écrire en une ligne

\`\`\`python
config = Path("config.json")
contenu = config.read_text(encoding="utf-8")   # lecture complète
Path("out.txt").write_text("résultat\\n")       # écriture complète
\`\`\`

### Parcourir une arborescence (cas outillage : trouver des fichiers)

\`\`\`python
from pathlib import Path

# tous les .log récursivement, plus gros que 1 Mo
logs = Path("/var/log")
gros = [
    p for p in logs.rglob("*.log")
    if p.is_file() and p.stat().st_size > 1_000_000
]
for p in gros:
    print(p, p.stat().st_size)
\`\`\`

\`rglob\` (recursive glob) est l'équivalent d'un \`find\`/\`fast-glob\` intégré : parfait pour scripter du nettoyage, de l'inventaire ou de la collecte de fichiers.

### ⚠️ Pièges

- **\`Path\` n'est pas une string** : pour concaténer dans une string, fais \`str(p)\` ou \`f"{p}"\`. Beaucoup d'API anciennes attendent une str.
- **\`read_text\` charge TOUT en mémoire** : pour un fichier de plusieurs Go, itère ligne par ligne avec \`with p.open() as f: for line in f:\`.
- **Encoding** : précise \`encoding="utf-8"\` explicitement. Le défaut dépend de l'OS et te mordra sur les accents (Windows surtout).
- **\`mkdir\` sans \`exist_ok\`** lève \`FileExistsError\` si le dossier existe. Mets \`exist_ok=True\` pour un comportement idempotent.

### À retenir

> Un chemin est un objet \`Path\`, on le joint avec \`/\`, on lit/écrit avec \`read_text\`/\`write_text\`, on cherche avec \`rglob\`. Oublie \`os.path\` pour le nouveau code.
`,

  "io-csv-json": `## File I/O + CSV + JSON : lire et écrire des données

En Node tu fais \`fs.readFile\` + \`JSON.parse\`. Python a un \`open()\` plus ergonomique grâce au \`with\` (gestion auto de la fermeture), et des modules \`json\` et \`csv\` dans la lib standard — zéro dépendance.

### L'analogie : le \`with\` remplace le try/finally de fermeture

\`\`\`python
# JS : const f = fs.openSync(...); ... ; fs.closeSync(f)
with open("data.txt", "r", encoding="utf-8") as f:   # ouverture
    contenu = f.read()
# ← le fichier est fermé AUTOMATIQUEMENT en sortant du bloc
\`\`\`

Le \`with\` (context manager) garantit la fermeture même en cas d'exception. C'est l'équivalent d'un \`try { } finally { close() }\` mais en une ligne.

### Tableau de correspondance

| Node | Python |
|---|---|
| \`fs.readFileSync(p, "utf8")\` | \`open(p, encoding="utf-8").read()\` |
| \`JSON.parse(s)\` | \`json.loads(s)\` |
| \`JSON.stringify(o)\` | \`json.dumps(o)\` |
| \`JSON.parse(fs.readFile)\` | \`json.load(f)\` (depuis un fichier) |
| lecture ligne par ligne | \`for line in f:\` |
| csv-parse | module \`csv\` (stdlib) |

### JSON : \`loads\`/\`dumps\` (string) vs \`load\`/\`dump\` (fichier)

Le **s** = "string". Retiens : \`s\` pour string, sans \`s\` pour file object.

\`\`\`python
import json

# depuis/vers une string
data = json.loads('{"host": "1.1.1.1", "open": true}')   # true → True
texte = json.dumps(data, indent=2, ensure_ascii=False)   # accents OK

# depuis/vers un fichier
with open("hosts.json", encoding="utf-8") as f:
    hosts = json.load(f)
with open("out.json", "w", encoding="utf-8") as f:
    json.dump(hosts, f, indent=2)
\`\`\`

### CSV : DictReader, l'idiome qui rend tout simple

\`\`\`python
import csv
from pathlib import Path

# lire un CSV comme une liste de dicts (header = clés)
with open("scan.csv", newline="", encoding="utf-8") as f:
    for ligne in csv.DictReader(f):
        print(ligne["host"], ligne["port"])

# écrire un CSV depuis des dicts
rows = [{"host": "1.1.1.1", "port": 80, "open": True}]
with open("out.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["host", "port", "open"])
    w.writeheader()
    w.writerows(rows)
\`\`\`

### Mini-outil concret : convertir un log en JSON

\`\`\`python
import json
from pathlib import Path

# parse "host:port:status" → liste de dicts → JSON
lignes = Path("scan.log").read_text(encoding="utf-8").splitlines()
results = []
for l in lignes:
    host, port, status = l.split(":")
    results.append({"host": host, "port": int(port), "open": status == "open"})

Path("scan.json").write_text(
    json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
)
print(f"{len(results)} entrées exportées")
\`\`\`

### ⚠️ Pièges

- **Oublier \`newline=""\` pour le csv** : sur Windows tu obtiens des lignes vides intercalées. Toujours \`open(..., newline="")\` avec le module csv.
- **Encoding manquant** : précise \`encoding="utf-8"\` ; le défaut système te casse les accents.
- **\`ensure_ascii=True\` par défaut** : \`json.dumps\` échappe les accents en \`\\uXXXX\`. Mets \`ensure_ascii=False\` pour du JSON lisible.
- **csv lit tout en str** : \`ligne["port"]\` est une string, pas un int. Convertis explicitement.
- **Charger un gros fichier d'un coup** : \`.read()\` met tout en RAM. Pour des fichiers énormes, itère \`for line in f:\` (paresseux, ligne par ligne).

### À retenir

> \`with open(...) as f:\` ferme tout seul. \`json.load\`/\`dump\` pour fichiers, \`loads\`/\`dumps\` pour strings. \`csv.DictReader\` transforme un CSV en liste de dicts — l'idiome le plus pratique pour l'outillage data.
`,

  "httpx": `## httpx : le client HTTP moderne (async-first)

En Node tu utilises \`fetch\` ou \`axios\`. En Python l'ancien standard était \`requests\` (synchrone). Le standard 2026 est **httpx** : même API que requests, mais **async-first** — idéal pour faire des centaines de requêtes en parallèle (recon, enrichissement, scan applicatif).

### L'analogie

\`\`\`python
import httpx

# version synchrone (≈ requests, ≈ fetch await)
r = httpx.get("https://httpbin.org/get", timeout=5)
print(r.status_code)          # 200
print(r.json())               # parsing JSON intégré
print(r.headers["server"])
\`\`\`

### Tableau de correspondance

| JS (fetch/axios) | Python (httpx) |
|---|---|
| \`await fetch(url)\` | \`httpx.get(url)\` (sync) |
| \`res.json()\` | \`r.json()\` |
| \`res.status\` | \`r.status_code\` |
| \`res.text()\` | \`r.text\` |
| \`fetch(url, {method:"POST", body})\` | \`httpx.post(url, json=...)\` |
| \`new AbortController()\` (timeout) | \`timeout=5\` |
| \`axios.create({baseURL})\` | \`httpx.Client(base_url=...)\` |
| \`Promise.all([...])\` | \`asyncio.gather(...)\` (voir async) |

### POST, headers, params

\`\`\`python
r = httpx.post(
    "https://httpbin.org/post",
    json={"user": "scory"},                  # corps JSON (auto-serialize)
    headers={"User-Agent": "porterfield-tool/1.0"},
    params={"q": "test"},                    # query string
    timeout=10,
)
r.raise_for_status()                         # lève si 4xx/5xx
\`\`\`

### Le Client : réutiliser la connexion (perf)

\`\`\`python
with httpx.Client(base_url="https://api.example.com", timeout=5) as client:
    a = client.get("/users")
    b = client.get("/posts")     # réutilise la connexion TCP (keep-alive)
\`\`\`

### Mini-outil concret : sonde de disponibilité (sync)

\`\`\`python
import httpx

def check(urls: list[str]) -> dict[str, int | str]:
    """Retourne {url: status_code ou erreur} pour une liste de cibles."""
    out: dict[str, int | str] = {}
    with httpx.Client(timeout=5, follow_redirects=True) as client:
        for u in urls:
            try:
                out[u] = client.get(u).status_code
            except httpx.RequestError as e:
                out[u] = f"ERR {type(e).__name__}"
    return out

print(check(["https://example.com", "https://httpbin.org/status/503"]))
\`\`\`

### 🔒 Cadre légal

Une requête HTTP, même bénigne, touche un système distant. Avant tout sondage automatisé :
- **N'interroge que des cibles t'appartenant ou pour lesquelles tu as une autorisation écrite** (scope d'un bug bounty, pentest mandaté, tes propres serveurs).
- **Respecte les CGU et le rate limit** : un balayage massif non sollicité peut être qualifié d'atteinte à un STAD (art. 323-1 et suiv. du Code pénal en France).
- **User-Agent identifiable** et débit raisonnable : ne te fais pas passer pour autre chose, ne sature pas la cible.

### ⚠️ Pièges

- **Pas de redirections par défaut** : contrairement à requests/fetch, httpx ne suit pas les 3xx sans \`follow_redirects=True\`.
- **\`r.json()\` lève si ce n'est pas du JSON** : entoure d'un try ou vérifie le \`Content-Type\`.
- **Toujours un \`timeout\`** : httpx a un timeout par défaut, mais fixe-le explicitement pour de l'outillage réseau (sinon une cible lente bloque ton script).
- **Client async ≠ Client sync** : \`httpx.AsyncClient\` s'utilise avec \`async with\` et \`await\` (voir la leçon asyncio).

### À retenir

> httpx = requests + async. API identique à fetch dans l'esprit. Réutilise un \`Client\`, mets toujours un timeout, et pour le parallélisme massif, passe en \`AsyncClient\` + asyncio.gather.
`,

  "asyncio": `## asyncio : l'async/await de Python (mais l'event loop est explicite)

Tu maîtrises \`async\`/\`await\` en JS. Bonne nouvelle : Python a exactement les mêmes mots-clés. La différence majeure : en Node l'event loop tourne tout seul ; en Python **tu dois la démarrer explicitement** avec \`asyncio.run()\`.

### L'analogie

\`\`\`python
import asyncio

async def fetch(n: int) -> int:        # async function => async def
    await asyncio.sleep(1)             # await fonctionne pareil
    return n * 2

async def main() -> None:
    x = await fetch(21)                # await dans un contexte async
    print(x)

asyncio.run(main())                    # ⚠ DÉMARRE l'event loop (top-level)
\`\`\`

Sans \`asyncio.run()\`, appeler \`main()\` ne fait que créer une **coroutine** non exécutée — rien ne se passe. C'est le piège n°1 pour les devs JS.

### Tableau de correspondance

| JS | Python |
|---|---|
| \`async function f()\` | \`async def f():\` |
| \`await p\` | \`await coro\` |
| \`Promise.all([a, b])\` | \`asyncio.gather(a, b)\` |
| \`Promise.allSettled\` | \`gather(..., return_exceptions=True)\` |
| \`Promise.race\` | \`asyncio.wait(..., FIRST_COMPLETED)\` |
| (auto au top-level) | \`asyncio.run(main())\` |
| \`setTimeout\` (await) | \`await asyncio.sleep(s)\` |
| (chaque \`fetch\` est concurrent) | \`asyncio.create_task(coro)\` |

### Parallélisme : gather et as_completed

\`\`\`python
import asyncio, httpx

async def fetch_status(client: httpx.AsyncClient, url: str) -> tuple[str, int]:
    r = await client.get(url)
    return url, r.status_code

async def main(urls: list[str]) -> None:
    async with httpx.AsyncClient(timeout=5) as client:
        # gather = Promise.all : attend TOUT, ordre préservé
        tasks = [fetch_status(client, u) for u in urls]
        for url, code in await asyncio.gather(*tasks):
            print(url, code)

        # as_completed = traiter dès qu'un résultat tombe (le plus rapide d'abord)
        for fut in asyncio.as_completed([fetch_status(client, u) for u in urls]):
            url, code = await fut
            print("arrivé:", url, code)
\`\`\`

### Limiter la concurrence (crucial en outillage réseau)

\`\`\`python
sem = asyncio.Semaphore(10)            # max 10 requêtes simultanées

async def bounded(client, url):
    async with sem:                    # n'entre que si un "jeton" est libre
        return await fetch_status(client, url)
\`\`\`

### 🔒 Cadre légal

asyncio permet de lancer des milliers de requêtes en quelques secondes. Cette puissance impose la prudence :
- **N'effectue de sondage parallèle massif que sur des cibles autorisées** (tes serveurs, scope de test explicite). Un balayage non sollicité peut tomber sous le coup de l'atteinte aux STAD.
- **Toujours un Semaphore et un délai** : un \`gather\` sur 10 000 URLs sans limite équivaut à un mini déni de service involontaire.

### ⚠️ Pièges

- **GIL** : asyncio ne donne PAS de parallélisme CPU. C'est de la concurrence I/O (réseau, disque). Pour du calcul lourd parallèle, il faut \`multiprocessing\`, pas asyncio.
- **Oublier \`await\`** : \`coro()\` sans \`await\` crée une coroutine jamais exécutée (warning "coroutine was never awaited"). En JS un \`async fn()\` non awaité tourne quand même — pas en Python.
- **Bloquer l'event loop** : un \`time.sleep()\` ou un gros calcul synchrone gèle TOUTES les tâches. Utilise \`asyncio.sleep\` ou \`run_in_executor\`.
- **\`asyncio.run\` une seule fois** : ne l'appelle pas à l'intérieur d'une coroutine ni deux fois — il crée et ferme la loop.

### À retenir

> Mêmes mots-clés que JS, mais l'event loop se démarre à la main (\`asyncio.run\`). \`gather\` = Promise.all. Mets un Semaphore pour borner la concurrence, et souviens-toi : c'est de l'I/O concurrent, pas du calcul parallèle (GIL).
`,

  "scraping": `## Scraping : BeautifulSoup (HTML statique) + Playwright (JS rendu)

En JS tu scrapes avec cheerio (HTML statique) ou Playwright (pages dynamiques). En Python c'est exactement le même duo : **BeautifulSoup** pour parser du HTML déjà rendu, **Playwright Python** pour piloter un vrai navigateur quand le contenu est généré côté client.

### L'analogie

\`\`\`python
import httpx
from bs4 import BeautifulSoup

html = httpx.get("https://example.com").text
soup = BeautifulSoup(html, "html.parser")     # ≈ cheerio.load(html)

print(soup.title.text)                        # texte du <title>
print(soup.select_one("h1").text)             # 1er h1 (sélecteur CSS)
liens = [a["href"] for a in soup.select("a[href]")]   # tous les hrefs
\`\`\`

### Tableau de correspondance

| JS (cheerio/DOM) | Python (BeautifulSoup) |
|---|---|
| \`cheerio.load(html)\` | \`BeautifulSoup(html, "html.parser")\` |
| \`$("h1").text()\` | \`soup.select_one("h1").text\` |
| \`$("a")\` (tous) | \`soup.select("a")\` |
| \`$el.attr("href")\` | \`el["href"]\` |
| \`querySelector\` | \`select_one(css)\` |
| \`querySelectorAll\` | \`select(css)\` |
| \`getElementsByTagName\` | \`find_all("tag")\` |

### Quand BeautifulSoup ne suffit pas : Playwright

Si le contenu est injecté par du JS (SPA React/Vue), httpx ne récupère que la coquille vide. Il faut un vrai navigateur.

\`\`\`python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://example.com")
    page.wait_for_selector(".result")          # attend le rendu JS
    titres = page.locator("h2").all_inner_texts()
    browser.close()
\`\`\`

L'API Playwright Python est quasi identique à la version JS — tu réutilises tout ton savoir.

### Mini-outil concret : extraire un tableau de prix

\`\`\`python
import httpx, csv
from bs4 import BeautifulSoup
from pathlib import Path

def scrape_table(url: str) -> list[dict[str, str]]:
    resp = httpx.get(url, headers={"User-Agent": "porterfield-bot/1.0"}, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    rows = []
    for tr in soup.select("table.prices tr")[1:]:    # saute l'en-tête
        cols = [td.text.strip() for td in tr.select("td")]
        if len(cols) >= 2:
            rows.append({"produit": cols[0], "prix": cols[1]})
    return rows

# export CSV propre
data = scrape_table("https://example.com/tarifs")
with open("prix.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["produit", "prix"])
    w.writeheader()
    w.writerows(data)
\`\`\`

### 🔒 Cadre légal

Le scraping touche directement au droit. Avant d'automatiser quoi que ce soit :
- **Respecte \`robots.txt\`** et les CGU du site. Beaucoup interdisent explicitement l'aspiration automatisée.
- **Ne scrape jamais derrière une authentification** ni de données personnelles sans base légale (RGPD : un nom + email = donnée perso).
- **Throttle** : 1 requête/seconde max, User-Agent identifiable, pas de contournement de protection anti-bot (le contournement peut constituer une atteinte à un STAD).
- En cas de doute : **demande l'autorisation** ou cherche une API officielle. L'enrichissement de tes propres données existantes est plus sûr que l'aspiration de masse.

### ⚠️ Pièges

- **\`select_one\` peut renvoyer \`None\`** : \`.text\` sur \`None\` lève \`AttributeError\`. Vérifie avant : \`if (el := soup.select_one(...)) :\`.
- **html.parser vs lxml** : \`lxml\` est plus rapide et tolérant (\`uv add lxml\` puis \`BeautifulSoup(html, "lxml")\`).
- **Playwright a besoin d'installer les navigateurs** : \`uv run playwright install chromium\` après l'\`uv add\`.
- **Contenu dynamique** : si \`soup.select(...)\` est vide alors que le contenu existe dans le navigateur, c'est du JS rendu → passe à Playwright.

### À retenir

> BeautifulSoup = cheerio (HTML statique, sélecteurs CSS), Playwright = pages JS rendues. Sélecteurs CSS partout. Et avant de scraper quoi que ce soit : robots.txt, CGU, RGPD, throttle. Le droit prime sur la technique.
`,

  "pandas-polars": `## pandas + polars : manipuler des données tabulaires

Imagine devoir traiter un CSV de 1 million de lignes : grouper, filtrer, agréger. En JS tu galérerais avec des boucles. En Python, **pandas** (le standard historique) et **polars** (le challenger 10-100× plus rapide, écrit en Rust) font ça en quelques lignes et quelques millisecondes.

### L'analogie : un DataFrame = un tableau Excel programmable

Pense un \`DataFrame\` comme un \`Array\` d'objets JS, mais columnar et vectorisé : les opérations s'appliquent à des colonnes entières d'un coup, sans boucle explicite.

\`\`\`python
import pandas as pd

df = pd.read_csv("scan.csv")          # charge le CSV en DataFrame
df.head()                             # 5 premières lignes
df.shape                              # (lignes, colonnes)
df["port"]                            # une colonne (Series)
df[df["open"] == True]                # filtre (≈ arr.filter)
df["port"].value_counts()             # compte les occurrences
\`\`\`

### Correspondances JS ↔ pandas

| JS (Array d'objets) | pandas |
|---|---|
| \`arr.filter(r => r.x > 0)\` | \`df[df["x"] > 0]\` |
| \`arr.map(r => r.x * 2)\` | \`df["x"] * 2\` (vectorisé) |
| \`arr.length\` | \`len(df)\` |
| group by + reduce | \`df.groupby("k")["v"].sum()\` |
| \`arr.sort((a,b)=>...)\` | \`df.sort_values("col")\` |
| nouvelle colonne | \`df["c"] = df["a"] + df["b"]\` |

### groupby : l'agrégation puissante

\`\`\`python
# nb de ports ouverts par host
df[df["open"]].groupby("host")["port"].count().sort_values(ascending=False)

# stats multiples d'un coup
df.groupby("host").agg(
    ports=("port", "count"),
    premier=("port", "min"),
)
\`\`\`

### polars : la même chose, en plus rapide et plus strict

\`\`\`python
import polars as pl

df = pl.read_csv("scan.csv")
(
    df.filter(pl.col("open"))                  # filtre
      .group_by("host")                        # groupe
      .agg(pl.col("port").count().alias("n"))  # agrège
      .sort("n", descending=True)              # trie
)
\`\`\`

La syntaxe polars est **expression-based** (proche d'un query builder SQL chaîné) : plus verbeuse mais explicite, lazy-evaluable, et multi-thread par défaut. Sur 1 M+ lignes, polars écrase pandas en perf.

### Mini-outil concret : top 10 des IPs les plus actives dans un log

\`\`\`python
import polars as pl

logs = pl.read_csv("access.csv")          # colonnes: ip, status, bytes
top = (
    logs.group_by("ip")
        .agg([
            pl.len().alias("hits"),
            pl.col("bytes").sum().alias("total_bytes"),
        ])
        .sort("hits", descending=True)
        .head(10)
)
print(top)
\`\`\`

### ⚠️ Pièges

- **\`SettingWithCopyWarning\` (pandas)** : modifier une "vue" d'un DataFrame est ambigu. Utilise \`.loc[mask, "col"] = val\` pour assigner proprement.
- **Boucler sur les lignes (\`iterrows\`) est lent** : c'est l'anti-pattern n°1. Vectorise (opérations colonne entière) au lieu de boucler.
- **pandas charge tout en RAM** : un CSV de 5 Go = 5+ Go de RAM (ton Mac 8 Go va souffrir). polars (lazy + \`scan_csv\`) ou le chunking sont tes amis pour les gros volumes.
- **pandas vs polars sur la mutabilité** : polars est plus strict (immuable, pas d'index magique). Ne mélange pas les deux mental models.

### À retenir

> DataFrame = tableau vectorisé : filtre/groupe/agrège sans boucle. pandas pour l'écosystème et les petits volumes, polars pour la vitesse et les gros fichiers. Et ne JAMAIS boucler ligne par ligne — vectorise.
`,

  "pytest": `## pytest : tester en Python (plus simple que tu ne crois)

En JS tu écris des tests avec Vitest/Jest : \`describe\`, \`it\`, \`expect(x).toBe(y)\`. Python a \`unittest\` dans la stdlib (verbeux, à la JUnit) mais le standard de fait est **pytest** : pas de classe, pas de \`expect\`, juste des fonctions et le mot-clé natif \`assert\`.

### L'analogie : un test = une fonction qui commence par \`test_\`

\`\`\`python
# fichier test_scan.py
def add(a, b):
    return a + b

def test_add():               # découvert automatiquement (préfixe test_)
    assert add(2, 3) == 5     # pas de expect(), juste assert
    assert add(-1, 1) == 0
\`\`\`

\`\`\`bash
uv run pytest                 # découvre et lance tous les test_*.py
uv run pytest -v              # verbeux
uv run pytest -k "scan"       # filtre par nom (≈ vitest -t)
\`\`\`

### Tableau de correspondance

| JS (Vitest/Jest) | pytest |
|---|---|
| \`it("...", () => {})\` | \`def test_...():\` |
| \`expect(x).toBe(y)\` | \`assert x == y\` |
| \`expect(x).toEqual(obj)\` | \`assert x == obj\` |
| \`expect(fn).toThrow()\` | \`with pytest.raises(Err):\` |
| \`beforeEach\` | fixture (\`@pytest.fixture\`) |
| \`test.each([...])\` | \`@pytest.mark.parametrize\` |
| \`vi.fn()\` / mock | \`monkeypatch\` / \`unittest.mock\` |

### Tester les exceptions

\`\`\`python
import pytest

def parse_port(s: str) -> int:
    p = int(s)
    if not 0 < p < 65536:
        raise ValueError("port hors plage")
    return p

def test_port_invalide():
    with pytest.raises(ValueError, match="hors plage"):
        parse_port("99999")
\`\`\`

### Paramétrer : un test, plusieurs cas

\`\`\`python
@pytest.mark.parametrize("entree, attendu", [
    ("80", 80),
    ("443", 443),
    ("1", 1),
])
def test_parse_port_ok(entree, attendu):
    assert parse_port(entree) == attendu
\`\`\`

### Fixtures : le setup réutilisable (≈ beforeEach + injection)

\`\`\`python
@pytest.fixture
def client():
    c = httpx.Client(base_url="https://httpbin.org")
    yield c              # ce qui est avant yield = setup, après = teardown
    c.close()

def test_status(client):          # pytest injecte la fixture par son nom
    assert client.get("/status/200").status_code == 200
\`\`\`

### ⚠️ Pièges

- **Le préfixe \`test_\` est obligatoire** : fonctions \`test_*\` dans des fichiers \`test_*.py\`. Sinon pytest ne les découvre pas.
- **\`assert\` est désactivé avec \`python -O\`** : ne mets pas de logique métier dans un \`assert\` en prod. Dans les tests, c'est parfait (pytest réécrit les asserts pour des messages détaillés).
- **Fixtures vs imports** : une fixture est injectée par son nom en paramètre, pas importée. Place les fixtures partagées dans \`conftest.py\`.
- **Tests qui dépendent de l'ordre** : chaque test doit être isolé. Un état partagé entre tests = bugs intermittents.

### À retenir

> Un test = une fonction \`test_*\` avec un \`assert\` natif. \`pytest.raises\` pour les erreurs, \`parametrize\` pour les cas multiples, fixtures pour le setup injecté. Plus léger que Vitest, même philosophie.
`,

  "venv": `## Environnements virtuels : isoler les dépendances par projet

En Node, \`node_modules\` est local au projet par nature : chaque dossier a ses dépendances. En Python, par défaut, \`pip install\` pollue l'installation **globale** — un cauchemar de conflits de versions. La solution : le **virtual environment** (venv), un \`node_modules\` mental pour Python.

### L'analogie : un venv = un node_modules + son propre Python

Un venv est un dossier (\`.venv/\`) contenant une copie isolée de l'interpréteur et des paquets, **propre à ce projet**. Deux projets peuvent ainsi utiliser httpx 0.27 et httpx 0.25 sans se marcher dessus.

\`\`\`bash
# méthode moderne (uv le fait pour toi)
uv venv                    # crée .venv/ avec le bon Python
uv add httpx               # installe DANS le venv + met à jour le lock
uv run python main.py      # exécute dans le venv, sans activation

# méthode classique (stdlib, à connaître)
python -m venv .venv       # crée le venv
source .venv/bin/activate  # ACTIVE (macOS/Linux) — prompt change
pip install httpx          # installe dans le venv actif
deactivate                 # sort du venv
\`\`\`

### Tableau de correspondance

| Node | Python (venv) |
|---|---|
| \`node_modules/\` (auto) | \`.venv/\` (explicite) |
| \`package.json\` | \`pyproject.toml\` |
| lockfile | \`uv.lock\` / \`requirements.txt\` |
| \`npx\` (sans installer) | \`uvx\` / \`uv tool run\` |
| dépendances locales | venv activé ou \`uv run\` |
| global | install système (à ÉVITER) |

### Pourquoi c'est non négociable pour l'outillage

Tes scripts offensifs/défensifs ont des dépendances précises (httpx, scapy, bs4...). Sans venv :
- tu casses d'autres projets en upgradant un paquet ;
- tu ne peux pas reproduire ton environnement sur une autre machine ;
- \`sudo pip install\` peut corrompre le Python du système.

### Reproduire l'environnement ailleurs

\`\`\`bash
# avec uv (recommandé) : le lock garantit les versions exactes
uv sync                    # recrée .venv à l'identique depuis uv.lock

# méthode classique
pip freeze > requirements.txt    # fige les versions
pip install -r requirements.txt  # réinstalle à l'identique
\`\`\`

### ⚠️ Pièges

- **Oublier d'activer le venv** (ou d'utiliser \`uv run\`) : tu installes/exécutes dans le Python global et tu te demandes pourquoi "ça marche pas". Le réflexe \`uv run\` élimine ce piège.
- **Committer \`.venv/\`** : comme \`node_modules\`, ça n'a rien à faire dans git. Ajoute-le au \`.gitignore\` ; le \`uv.lock\` suffit à reproduire.
- **\`sudo pip install\`** : ne fais JAMAIS ça. Ça installe en global avec les droits root et peut casser des outils système qui dépendent du Python de l'OS.
- **Mélanger les venvs** : un venv créé avec Python 3.11 ne devient pas magiquement 3.12. Recrée-le si tu changes de version d'interpréteur.

### À retenir

> Un venv isole Python + paquets par projet, comme \`node_modules\`. Avec uv : \`uv venv\` + \`uv add\` + \`uv run\`, et tu n'as même plus à penser à l'activation. Jamais de \`sudo pip\`, jamais de \`.venv/\` dans git.
`,

  "typer-cli": `## typer : des CLIs propres à partir de type hints

En JS tu construis une CLI avec commander ou yargs : tu déclares options et arguments à la main. Python a **typer** (par le créateur de FastAPI) : il génère la CLI — parsing, validation, aide \`--help\`, autocomplétion — **directement depuis les type hints** de ta fonction.

### L'analogie : ta fonction EST la CLI

\`\`\`python
import typer

app = typer.Typer()

@app.command()
def scan(host: str, port: int = 80, verbose: bool = False):
    """Scanne un host sur un port donné."""    # = le texte du --help
    typer.echo(f"Scan de {host}:{port} (verbose={verbose})")

if __name__ == "__main__":
    app()
\`\`\`

\`\`\`bash
python cli.py 10.0.0.1                 # host requis (positionnel)
python cli.py 10.0.0.1 --port 443      # option typée (int validé)
python cli.py --help                   # aide auto-générée !
python cli.py 10.0.0.1 --verbose       # bool → flag --verbose/--no-verbose
\`\`\`

typer lit les hints : \`host: str\` → argument positionnel ; \`port: int = 80\` → option \`--port\` avec défaut et **validation int automatique** ; \`verbose: bool\` → flag.

### Tableau de correspondance

| JS (commander) | typer |
|---|---|
| \`.argument("<host>")\` | param sans défaut : \`host: str\` |
| \`.option("--port <n>")\` | param avec défaut : \`port: int = 80\` |
| \`.option("--verbose")\` | \`verbose: bool = False\` |
| validation manuelle | déduite du type hint |
| \`--help\` à écrire | docstring → \`--help\` auto |
| sous-commandes | plusieurs \`@app.command()\` |

### Options riches (aide, prompts, validation)

\`\`\`python
from typing import Annotated
import typer

@app.command()
def export(
    fichier: Annotated[str, typer.Option(help="Chemin de sortie")] = "out.csv",
    workers: Annotated[int, typer.Option(min=1, max=50)] = 10,
    token: Annotated[str, typer.Option(prompt=True, hide_input=True)] = "",
):
    """workers borné entre 1 et 50, token demandé en saisie masquée."""
    ...
\`\`\`

### Mini-outil concret : CLI multi-commandes

\`\`\`python
import typer

app = typer.Typer(help="Boîte à outils réseau")

@app.command()
def ping(host: str, count: int = 4):
    typer.echo(f"ping {host} x{count}")

@app.command()
def resolve(domaine: str):
    import socket
    typer.echo(socket.gethostbyname(domaine))

if __name__ == "__main__":
    app()
# usage: python tool.py ping 1.1.1.1 --count 2
#        python tool.py resolve example.com
\`\`\`

### ⚠️ Pièges

- **\`uv tool install\` pour le rendre global** : packagé proprement, \`uv tool install .\` met ta CLI dans le PATH (≈ \`npm i -g\`).
- **\`typer.echo\` plutôt que \`print\`** : gère mieux les couleurs et l'encodage cross-plateforme.
- **Les hints sont obligatoires** : sans annotation de type, typer ne peut pas inférer le parsing. Un param non typé = comportement par défaut (str).
- **Annotated pour les options avancées** : help, prompt, bornes passent par \`Annotated[T, typer.Option(...)]\` en 3.12 (l'ancien style \`= typer.Option(...)\` existe mais Annotated est recommandé).

### À retenir

> typer transforme une fonction typée en CLI complète : parsing, validation, --help, le tout gratis depuis les hints. Une fonction = une commande, une docstring = l'aide. \`uv tool install\` pour l'avoir dans le PATH.
`,

  "jupyter": `## Jupyter Notebooks : l'atelier d'exploration data

Il n'y a pas vraiment d'équivalent JS grand public : imagine un REPL JS où chaque "cellule" garde son résultat affiché (tableaux, graphiques) et où tu réexécutes des bouts de code à volonté sans relancer tout le script. C'est **Jupyter** : l'outil pour explorer des données de façon interactive et itérative.

### L'analogie : un script découpé en cellules, chacune exécutable seule

Un notebook (\`.ipynb\`) est une suite de **cellules** (code ou markdown). Tu exécutes une cellule (Maj+Entrée), son résultat s'affiche dessous, et l'**état (variables) persiste** entre les cellules. Idéal pour le cycle "charge → regarde → ajuste → regarde" sur de la donnée.

\`\`\`python
# Cellule 1 — exécutée une fois
import polars as pl
df = pl.read_csv("scan.csv")
df.head()                       # le résultat s'affiche sous la cellule

# Cellule 2 — réutilise df sans recharger le CSV
df.filter(pl.col("open")).group_by("host").agg(pl.len())
\`\`\`

### Lancer Jupyter avec uv

\`\`\`bash
uv add --dev jupyterlab
uv run jupyter lab            # ouvre l'interface dans le navigateur
\`\`\`

VS Code lit aussi les \`.ipynb\` nativement (extension Jupyter) — pratique pour rester dans ton éditeur.

### À quoi ça sert concrètement (pour ton outillage)

- **Explorer un dataset** avant d'écrire le script final : tester des filtres/agrégations sur un CSV de logs, voir la forme des données.
- **Visualiser** : un \`df.plot()\` ou matplotlib affiche le graphe inline, sous la cellule.
- **Prototyper** un parsing ou un appel API et inspecter la réponse pas à pas, sans relancer tout le programme.

\`\`\`python
import matplotlib.pyplot as plt
counts = df["port"].value_counts()
counts.plot(kind="bar")        # histogramme affiché directement dans le notebook
plt.show()
\`\`\`

### Du notebook au script

Le notebook est un **brouillon d'exploration**, pas du code de production. Une fois ta logique trouvée, extrais-la dans un \`.py\` propre (typé, testé, lintable). Jupyter sert à *découvrir*, pas à *livrer*.

### ⚠️ Pièges

- **L'état caché (out-of-order)** : tu peux exécuter les cellules dans le désordre, ce qui crée un état impossible à reproduire. Réflexe : "Restart & Run All" avant de faire confiance à un résultat.
- **Variable fantôme** : une variable d'une cellule supprimée reste en mémoire (le kernel l'a toujours). Un "Restart" remet à zéro.
- **Diffs git illisibles** : un \`.ipynb\` est un gros JSON avec les outputs — les diffs sont pénibles. Outils comme \`jupytext\` ou \`nbstripout\` aident ; ou versionne le \`.py\` extrait.
- **Pas pour la prod / les longs traitements** : le notebook n'est pas fait pour tourner en CI ou en tâche planifiée. Migre vers un script.
- **Secrets dans les cellules** : ne hardcode pas de token/clé dans un notebook que tu pourrais committer (les outputs aussi peuvent fuiter des données).

### À retenir

> Jupyter = REPL persistant en cellules pour explorer la donnée interactivement (charge → inspecte → ajuste → visualise). Parfait pour découvrir, jamais pour livrer : extrais la logique validée dans un \`.py\` testé. Et "Restart & Run All" avant de croire un résultat.
`,
};
