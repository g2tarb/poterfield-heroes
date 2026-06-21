import type { NewExercise } from "../../schema/content";
import { M24_ID } from "./m24";

/**
 * M24 — Exercices pratiques supplémentaires (Python).
 *
 * Python tourne DANS LE NAVIGATEUR via Pyodide → vrais exos de code in-app.
 * Pyodide n'a PAS d'accès réseau : les exos httpx/scraping/asyncio travaillent
 * donc sur des DONNÉES FOURNIES dans le starterCode (string HTML, liste d'URLs
 * simulées), jamais d'appel réseau réel.
 *
 * Le module m24.ts n'avait que 2 exercices (1 quiz + 1 projet externe). Ce
 * fichier ajoute 1 quiz d'activation + 6 code_exercise pour couvrir les skills
 * sans exercice pratique : comprehensions, functions-py, classes-py, type-hints,
 * pathlib, httpx (parsing offline), asyncio, scraping (parsing HTML inline),
 * pandas-polars (data inline), typer-cli (parsing argv).
 *
 * displayOrder ≥ 20 pour s'enchaîner APRÈS les exercices existants de m24.ts.
 */
export const m24ExtraExercises: NewExercise[] = [
  // ===========================================================
  // QUIZ D'ACTIVATION — intuitions avant la pratique
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de coder : tes réflexes Python d'outilleur",
    statement:
      "Petit quiz d'intuition avant la série d'exos pratiques. Pas de seuil — c'est juste pour calibrer ton réflexe Python venant de JS.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu veux ne garder que les lignes d'un log qui contiennent \"ERROR\", en majuscules. Le réflexe Python le plus idiomatique ?",
        options: [
          "Une boucle for avec une liste vide et append",
          "Une list comprehension : `[l.upper() for l in lignes if \"ERROR\" in l]`",
          "Impossible sans regex",
          "lignes.filter(...).map(...)",
        ],
        correctIndex: 1,
        explanation:
          "La list comprehension `[transform for x in source if filtre]` est l'idiome. Plus court et plus lisible que la boucle append. `filter/map` existent mais les pythonistes préfèrent les comprehensions.",
      },
      {
        question:
          "Tu joins un dossier et un nom de fichier en Python moderne. Tu écris :",
        options: [
          "dossier + \"/\" + nom",
          "os.path.join(dossier, nom) — c'est la seule option",
          "Path(dossier) / nom (l'opérateur / de pathlib)",
          "path.join(dossier, nom)",
        ],
        correctIndex: 2,
        explanation:
          "pathlib surcharge l'opérateur `/` pour joindre les chemins : `Path(dossier) / nom`. `os.path.join` marche mais est l'ancienne école. La concaténation string casse sur Windows.",
      },
      {
        question:
          "Pyodide (Python dans le navigateur) n'a pas accès au réseau. Pour t'entraîner au scraping/httpx, tu travailles donc sur :",
        options: [
          "Rien, c'est impossible d'apprendre le scraping offline",
          "Une string HTML ou une liste d'URLs fournies en dur dans le code — la logique de parsing reste identique",
          "Uniquement des appels à localhost",
          "Un VPN intégré au navigateur",
        ],
        correctIndex: 1,
        explanation:
          "Le réseau n'est qu'une source de bytes. La vraie compétence (parser du HTML, agréger des réponses, borner la concurrence) s'exerce parfaitement sur des données en dur. C'est exactement l'approche de ces exos.",
      },
    ],
    skillSlugs: ["comprehensions", "pathlib", "scraping"],
    passThresholdPct: 0,
    estimatedMinutes: 4,
    displayOrder: 20,
  },

  // ===========================================================
  // EXO 1 — comprehensions (facile) : parser de ports
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Comprehensions — extraire les ports ouverts d'un scan",
    statement: `On te donne la sortie brute d'un scan de ports (une string, un port par ligne au format \`port:état\`). Écris \`ports_ouverts(raw)\` qui retourne la **liste triée des numéros de ports** (en \`int\`) dont l'état est \`open\`.

**Contraintes :**
- Utilise une **list comprehension** (pas de boucle \`for\` avec \`append\`).
- Ignore les lignes vides.
- Le résultat doit être une \`list[int]\` triée croissant.

**Tests attendus :**
\`\`\`python
ports_ouverts("22:open\\n80:closed\\n443:open\\n8080:open") == [22, 443, 8080]
ports_ouverts("21:closed\\n25:closed") == []
\`\`\`

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- \`ports_ouverts\` est bien une comprehension (pas une boucle append).`,
    starterCode: `def ports_ouverts(raw: str) -> list[int]:
    # Une seule list comprehension :
    # [ int(...)  for ligne in raw.splitlines()  if ... ]
    return []


scan = "22:open\\n80:closed\\n443:open\\n\\n8080:open"
print(ports_ouverts(scan))                 # [22, 443, 8080]
print(ports_ouverts("21:closed\\n25:closed"))  # []
`,
    solutionCode: `def ports_ouverts(raw: str) -> list[int]:
    return sorted(
        int(ligne.split(":")[0])
        for ligne in raw.splitlines()
        if ligne.strip().endswith("open")
    )


scan = "22:open\\n80:closed\\n443:open\\n\\n8080:open"
print(ports_ouverts(scan))
print(ports_ouverts("21:closed\\n25:closed"))
`,
    expectedOutput: "[22, 443, 8080]\n[]",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["comprehensions", "syntax"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 21,
  },

  // ===========================================================
  // EXO 2 — functions-py (facile/moyen) : compteur configurable
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Fonctions — un compteur de mots avec *args et defaults",
    statement: `Écris \`compter_mots(texte, *mots, ignore_casse=True)\` qui compte les occurrences de chacun des \`mots\` passés dans \`texte\` et retourne un \`dict\` \`{mot: nombre}\`.

**Contraintes :**
- \`*mots\` capture un nombre quelconque de mots à chercher.
- Argument **keyword-only** \`ignore_casse=True\` : si \`True\`, la recherche est insensible à la casse.
- Compte les mots **entiers** (découpe sur les espaces avec \`.split()\`), pas les sous-chaînes.
- Retourne un dict avec une entrée par mot demandé (0 si absent).

**Tests attendus :**
\`\`\`python
compter_mots("le chat le chien le", "le", "chat") == {"le": 3, "chat": 1}
compter_mots("ERROR ok error OK", "error", ignore_casse=True) == {"error": 2}
compter_mots("ERROR ok error OK", "error", ignore_casse=False) == {"error": 1}
\`\`\`

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- \`*mots\` et le paramètre keyword-only \`ignore_casse\` sont bien utilisés.`,
    starterCode: `def compter_mots(texte: str, *mots: str, ignore_casse: bool = True) -> dict[str, int]:
    # Indice : normalise texte et mots si ignore_casse, puis texte.split()
    return {}


print(compter_mots("le chat le chien le", "le", "chat"))
print(compter_mots("ERROR ok error OK", "error", ignore_casse=True))
print(compter_mots("ERROR ok error OK", "error", ignore_casse=False))
`,
    solutionCode: `def compter_mots(texte: str, *mots: str, ignore_casse: bool = True) -> dict[str, int]:
    jetons = texte.lower().split() if ignore_casse else texte.split()
    cles = [m.lower() if ignore_casse else m for m in mots]
    return {mot: jetons.count(cle) for mot, cle in zip(mots, cles)}


print(compter_mots("le chat le chien le", "le", "chat"))
print(compter_mots("ERROR ok error OK", "error", ignore_casse=True))
print(compter_mots("ERROR ok error OK", "error", ignore_casse=False))
`,
    expectedOutput:
      "{'le': 3, 'chat': 1}\n{'error': 2}\n{'error': 1}",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["functions-py", "data-structures"],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 22,
  },

  // ===========================================================
  // EXO 3 — type-hints + httpx (offline parsing) : agréger des réponses simulées
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Type hints + httpx (offline) — résumer un health-check",
    statement: `Tu construis un mini moniteur de santé. Comme Pyodide n'a pas le réseau, les "réponses HTTP" sont **fournies en dur** : une liste de tuples \`(url, status_code)\` simulant ce que httpx aurait renvoyé.

Écris \`resume_sante(reponses)\` qui retourne un \`dict[str, int]\` avec :
- \`"ok"\` : nombre de réponses 2xx (200–299),
- \`"client_err"\` : nombre de 4xx,
- \`"server_err"\` : nombre de 5xx.

**Contraintes :**
- **Type hints partout** : signature complète (\`list[tuple[str, int]] -> dict[str, int]\`).
- Code propre, pas de réseau (on travaille sur la liste fournie).

**Tests attendus :**
\`\`\`python
resume_sante([("/a", 200), ("/b", 404), ("/c", 500), ("/d", 204)])
# {"ok": 2, "client_err": 1, "server_err": 1}
\`\`\`

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- Signature entièrement typée.`,
    starterCode: `# En vrai, ces réponses viendraient de httpx :
#   async with httpx.AsyncClient() as client:
#       r = await client.get(url); reponses.append((url, r.status_code))
# Ici on simule (pas de réseau en Pyodide).

def resume_sante(reponses: list[tuple[str, int]]) -> dict[str, int]:
    # Indice : initialise un dict à 0 et classe chaque code.
    return {"ok": 0, "client_err": 0, "server_err": 0}


simule = [("/a", 200), ("/b", 404), ("/c", 500), ("/d", 204)]
print(resume_sante(simule))
`,
    solutionCode: `def resume_sante(reponses: list[tuple[str, int]]) -> dict[str, int]:
    out: dict[str, int] = {"ok": 0, "client_err": 0, "server_err": 0}
    for _url, code in reponses:
        if 200 <= code < 300:
            out["ok"] += 1
        elif 400 <= code < 500:
            out["client_err"] += 1
        elif 500 <= code < 600:
            out["server_err"] += 1
    return out


simule = [("/a", 200), ("/b", 404), ("/c", 500), ("/d", 204)]
print(resume_sante(simule))
`,
    expectedOutput: "{'ok': 2, 'client_err': 1, 'server_err': 1}",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["type-hints", "httpx", "data-structures"],
    passThresholdPct: 80,
    estimatedMinutes: 18,
    displayOrder: 23,
  },

  // ===========================================================
  // EXO 4 — classes-py + pathlib (moyen) : inventaire de fichiers
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "dataclass + pathlib — inventaire d'une arborescence",
    statement: `Pyodide fournit un **vrai système de fichiers virtuel** en mémoire : pathlib y fonctionne. On crée pour toi quelques fichiers, à toi de les inventorier.

1. Définis une \`@dataclass FichierInfo\` avec les champs \`nom: str\`, \`extension: str\`, \`taille: int\`.
2. Écris \`inventaire(dossier)\` qui parcourt **récursivement** \`dossier\` (un \`Path\`) et retourne la \`list[FichierInfo]\` des fichiers, **triée par taille décroissante**.

**Contraintes :**
- Utilise \`Path.rglob("*")\` et \`p.is_file()\`.
- \`extension\` = \`p.suffix\` (ex: \`.log\`), \`taille\` = \`p.stat().st_size\`.
- Tri par \`taille\` décroissant.

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- \`FichierInfo\` est bien une \`@dataclass\` et le parcours utilise pathlib (\`rglob\`).`,
    starterCode: `from dataclasses import dataclass
from pathlib import Path

# --- Setup : on crée une petite arborescence dans le FS virtuel Pyodide ---
base = Path("/tmp/projet")
(base / "logs").mkdir(parents=True, exist_ok=True)
(base / "app.py").write_text("x" * 50)
(base / "logs" / "access.log").write_text("y" * 300)
(base / "logs" / "error.log").write_text("z" * 120)
# --------------------------------------------------------------------------


@dataclass
class FichierInfo:
    nom: str
    extension: str
    taille: int


def inventaire(dossier: Path) -> list[FichierInfo]:
    # Indice : [FichierInfo(...) for p in dossier.rglob("*") if p.is_file()]
    # puis sorted(..., key=..., reverse=True)
    return []


for info in inventaire(base):
    print(f"{info.nom} ({info.extension}) -> {info.taille} octets")
`,
    solutionCode: `from dataclasses import dataclass
from pathlib import Path

base = Path("/tmp/projet")
(base / "logs").mkdir(parents=True, exist_ok=True)
(base / "app.py").write_text("x" * 50)
(base / "logs" / "access.log").write_text("y" * 300)
(base / "logs" / "error.log").write_text("z" * 120)


@dataclass
class FichierInfo:
    nom: str
    extension: str
    taille: int


def inventaire(dossier: Path) -> list[FichierInfo]:
    fichiers = [
        FichierInfo(nom=p.name, extension=p.suffix, taille=p.stat().st_size)
        for p in dossier.rglob("*")
        if p.is_file()
    ]
    return sorted(fichiers, key=lambda f: f.taille, reverse=True)


for info in inventaire(base):
    print(f"{info.nom} ({info.extension}) -> {info.taille} octets")
`,
    expectedOutput:
      "access.log (.log) -> 300 octets\nerror.log (.log) -> 120 octets\napp.py (.py) -> 50 octets",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["classes-py", "pathlib", "comprehensions"],
    passThresholdPct: 80,
    estimatedMinutes: 22,
    displayOrder: 24,
  },

  // ===========================================================
  // EXO 5 — scraping offline : parser un tableau HTML fourni
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "Scraping (offline) — extraire un tableau de prix d'un HTML fourni",
    statement: `On te donne une **string HTML** (ce que httpx aurait téléchargé — pas de réseau ici). Extrais les lignes du tableau de tarifs.

BeautifulSoup n'est pas garanti dans Pyodide : on utilise donc \`html.parser\` de la **stdlib** (\`HTMLParser\`), déjà fourni en partie. Complète \`parser_prix(html)\` pour qu'il retourne une \`list[dict]\` \`{"produit": ..., "prix": ...}\` à partir des lignes \`<tr>\` du \`<tbody>\` (chaque \`<tr>\` a deux \`<td>\` : produit, prix).

**Contraintes :**
- Pas de réseau (HTML fourni en dur).
- Le prix doit être converti en \`int\` (string \`"19"\` -> \`19\`).
- Ignore l'en-tête (\`<thead>\`) : seuls les \`<tr>\` du corps comptent.

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- Le parsing s'appuie sur l'extraction des cellules, pas sur un \`split\` fragile du HTML brut.`,
    starterCode: `from html.parser import HTMLParser

# HTML fourni (en vrai : httpx.get(url).text). Pas de réseau en Pyodide.
HTML = """
<table class="prices">
  <thead><tr><th>Produit</th><th>Prix</th></tr></thead>
  <tbody>
    <tr><td>Clavier</td><td>49</td></tr>
    <tr><td>Souris</td><td>19</td></tr>
    <tr><td>Casque</td><td>89</td></tr>
  </tbody>
</table>
"""


class PrixParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.dans_tbody = False
        self.cellules: list[str] = []
        self.capture = False
        self.lignes: list[list[str]] = []

    def handle_starttag(self, tag, attrs):
        # Indice : suivre l'entrée/sortie de <tbody>, ouvrir une <tr>,
        # et activer la capture sur <td>.
        ...

    def handle_endtag(self, tag):
        ...

    def handle_data(self, data):
        ...


def parser_prix(html: str) -> list[dict]:
    p = PrixParser()
    p.feed(html)
    return [{"produit": prod, "prix": int(prix)} for prod, prix in p.lignes]


for ligne in parser_prix(HTML):
    print(ligne)
`,
    solutionCode: `from html.parser import HTMLParser

HTML = """
<table class="prices">
  <thead><tr><th>Produit</th><th>Prix</th></tr></thead>
  <tbody>
    <tr><td>Clavier</td><td>49</td></tr>
    <tr><td>Souris</td><td>19</td></tr>
    <tr><td>Casque</td><td>89</td></tr>
  </tbody>
</table>
"""


class PrixParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.dans_tbody = False
        self.cellules: list[str] = []
        self.capture = False
        self.lignes: list[list[str]] = []

    def handle_starttag(self, tag, attrs):
        if tag == "tbody":
            self.dans_tbody = True
        elif tag == "tr" and self.dans_tbody:
            self.cellules = []
        elif tag == "td" and self.dans_tbody:
            self.capture = True

    def handle_endtag(self, tag):
        if tag == "tbody":
            self.dans_tbody = False
        elif tag == "td":
            self.capture = False
        elif tag == "tr" and self.dans_tbody and self.cellules:
            self.lignes.append(self.cellules)

    def handle_data(self, data):
        if self.capture and data.strip():
            self.cellules.append(data.strip())


def parser_prix(html: str) -> list[dict]:
    p = PrixParser()
    p.feed(html)
    return [{"produit": prod, "prix": int(prix)} for prod, prix in p.lignes]


for ligne in parser_prix(HTML):
    print(ligne)
`,
    expectedOutput:
      "{'produit': 'Clavier', 'prix': 49}\n{'produit': 'Souris', 'prix': 19}\n{'produit': 'Casque', 'prix': 89}",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["scraping", "classes-py", "comprehensions"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 25,
  },

  // ===========================================================
  // EXO 6 — asyncio + pandas-polars (offline) : agrégation concurrente simulée
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "asyncio + agrégation — top hosts depuis des logs récupérés en parallèle",
    statement: `Tu simules un collecteur qui interroge plusieurs sources **en parallèle** avec asyncio (pas de réseau réel : chaque "source" renvoie des lignes de log fournies en dur), puis tu **agrèges** les résultats comme le ferait pandas/polars (group by + count).

1. \`charger(source)\` est une **coroutine** fournie qui renvoie la liste des lignes d'une source.
2. Écris \`collecter(sources)\` (coroutine) qui lance toutes les sources **en parallèle** avec \`asyncio.gather\` et concatène toutes les lignes en une seule liste.
3. Écris \`top_hosts(lignes)\` qui compte les occurrences par host (chaque ligne = \`"host status"\`, on agrège sur le host) et retourne la \`list[tuple[str, int]]\` **triée par compte décroissant** (puis host croissant à égalité).

**Contraintes :**
- \`collecter\` doit utiliser \`asyncio.gather\` (pas une boucle \`await\` séquentielle).
- L'agrégation peut s'appuyer sur \`collections.Counter\` (l'esprit group-by de pandas, en stdlib).

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- \`collecter\` lance bien les sources concurremment via \`gather\`.`,
    starterCode: `import asyncio
from collections import Counter

# Sources simulées (en vrai : httpx + asyncio sur des URLs). Pas de réseau.
SOURCES = {
    "node-a": ["10.0.0.1 200", "10.0.0.2 404", "10.0.0.1 200"],
    "node-b": ["10.0.0.1 500", "10.0.0.3 200"],
    "node-c": ["10.0.0.2 200", "10.0.0.1 200"],
}


async def charger(source: str) -> list[str]:
    await asyncio.sleep(0)            # simule une I/O réseau
    return SOURCES[source]


async def collecter(sources: list[str]) -> list[str]:
    # Indice : asyncio.gather(*[charger(s) for s in sources]) puis aplatir.
    return []


def top_hosts(lignes: list[str]) -> list[tuple[str, int]]:
    # Chaque ligne = "host status". Compte par host, trie compte desc puis host asc.
    return []


async def main() -> None:
    lignes = await collecter(list(SOURCES))
    for host, n in top_hosts(lignes):
        print(f"{host}: {n}")


asyncio.run(main())
`,
    solutionCode: `import asyncio
from collections import Counter

SOURCES = {
    "node-a": ["10.0.0.1 200", "10.0.0.2 404", "10.0.0.1 200"],
    "node-b": ["10.0.0.1 500", "10.0.0.3 200"],
    "node-c": ["10.0.0.2 200", "10.0.0.1 200"],
}


async def charger(source: str) -> list[str]:
    await asyncio.sleep(0)
    return SOURCES[source]


async def collecter(sources: list[str]) -> list[str]:
    resultats = await asyncio.gather(*(charger(s) for s in sources))
    return [ligne for lot in resultats for ligne in lot]


def top_hosts(lignes: list[str]) -> list[tuple[str, int]]:
    compteur = Counter(ligne.split()[0] for ligne in lignes)
    return sorted(compteur.items(), key=lambda kv: (-kv[1], kv[0]))


async def main() -> None:
    lignes = await collecter(list(SOURCES))
    for host, n in top_hosts(lignes):
        print(f"{host}: {n}")


asyncio.run(main())
`,
    expectedOutput: "10.0.0.1: 4\n10.0.0.2: 2\n10.0.0.3: 1",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["asyncio", "pandas-polars", "httpx"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 26,
  },

  // ===========================================================
  // EXO 7 — typer-cli (parsing argv offline) : mini CLI
  // ===========================================================
  {
    moduleId: M24_ID,
    kind: "code_exercise",
    sandbox: "browser",
    language: "python",
    title: "CLI — parser des arguments façon typer (sans réseau)",
    statement: `typer transforme une fonction typée en CLI. Pyodide n'a pas de vrai \`sys.argv\` utile ici, alors on **simule la ligne de commande** : tu reçois une liste d'arguments façon \`argv\`.

Écris \`run(argv)\` qui se comporte comme la commande \`compter <fichier> --motif TEXTE [--ignore-casse]\` :
- \`argv[0]\` = chemin (positionnel, ici juste une string, on ne lit pas de fichier),
- \`--motif TEXTE\` : motif à compter (obligatoire),
- \`--ignore-casse\` : flag booléen (présent = True).

\`run\` retourne le **message** \`"<motif>: <n>"\` où \`n\` est le nombre d'occurrences du motif (mots entiers) dans le **contenu fourni** \`CONTENU\`. Respecte le flag de casse.

**Contraintes :**
- Parse \`argv\` à la main (un seul flag, une seule option) — pas besoin d'argparse.
- Mots entiers via \`.split()\`.

**Critères de validation :**
- La sortie console correspond exactement à \`expectedOutput\`.
- Le flag \`--ignore-casse\` change bien le résultat.`,
    starterCode: `# CONTENU = ce qu'on aurait lu avec Path(fichier).read_text(). Pas de réseau.
CONTENU = "ERROR ok error retry ERROR done error"


def run(argv: list[str]) -> str:
    # argv ex: ["scan.log", "--motif", "error", "--ignore-casse"]
    # Parse : positionnel = argv[0], option --motif, flag --ignore-casse.
    return ""


# La "ligne de commande" simulée (en vrai : typer lirait sys.argv) :
print(run(["scan.log", "--motif", "error"]))                 # error: 2
print(run(["scan.log", "--motif", "error", "--ignore-casse"]))  # error: 4
`,
    solutionCode: `CONTENU = "ERROR ok error retry ERROR done error"


def run(argv: list[str]) -> str:
    motif = ""
    ignore_casse = False
    i = 1
    while i < len(argv):
        if argv[i] == "--motif":
            motif = argv[i + 1]
            i += 2
        elif argv[i] == "--ignore-casse":
            ignore_casse = True
            i += 1
        else:
            i += 1

    mots = CONTENU.lower().split() if ignore_casse else CONTENU.split()
    cible = motif.lower() if ignore_casse else motif
    return f"{motif}: {mots.count(cible)}"


print(run(["scan.log", "--motif", "error"]))
print(run(["scan.log", "--motif", "error", "--ignore-casse"]))
`,
    expectedOutput: "error: 2\nerror: 4",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["typer-cli", "functions-py"],
    passThresholdPct: 80,
    estimatedMinutes: 25,
    displayOrder: 27,
  },
];
