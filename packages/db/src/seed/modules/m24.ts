import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M24_ID = "m24-python-scripting-data";

export const m24Module: NewModule = {
  id: M24_ID,
  moduleNumber: 4,
  phase: 4,
  title: "Python (scripting, scraping, data)",
  subtitle: "Le langage de l'outillage : scripting, parsing, scapy, automatisation offensive/défensive.",
  pourquoi:
    "JS/TS dominent le web. Python domine 3 territoires : (1) automatisation/scripting rapide (plus concis), (2) scraping + data wrangling (BeautifulSoup, pandas, polars), (3) IA appliquée (LangChain, LlamaIndex, SDK OpenAI/Anthropic 6-12 mois en avance sur TS). En 2026 : dev fullstack moderne maîtrise Python a minima. Pas pour backend (Fastify > FastAPI pour toi), mais pour automatiser, scraper, prototyper agents, manipuler CSV 1M lignes en 2s.",
  objectives: [
    "Python interprété, dynamique, batteries included",
    "Setup moderne 2026 : Python 3.12+, uv (gestionnaire paquets/venvs Rust), Ruff (linter/formatter)",
    "Syntaxe (variables, types, conditions, boucles, range, enumerate, zip)",
    "Structures data (list, tuple, dict, set, frozenset)",
    "List/dict/set comprehensions ([x*2 for x in arr if x > 0])",
    "Fonctions (positional, keyword, defaults, *args, **kwargs, lambdas)",
    "Classes (__init__, methods, héritage, @property, @classmethod, dataclasses)",
    "Modules et packages (import, __init__.py, if __name__ == '__main__')",
    "Type hints (list[int], Optional, Union ou |, Callable, TypedDict, Literal, Protocol)",
    "mypy ou pyright pour validation",
    "pathlib (vs os.path)",
    "File I/O (open, with, CSV, JSON)",
    "requests / httpx (async-first moderne)",
    "asyncio (event loop manuel, await asyncio.run, gather, as_completed)",
    "BeautifulSoup + Playwright Python (scraping)",
    "pandas (DataFrame, groupby, plot)",
    "polars (10-100x plus rapide, syntaxe stricte)",
    "pytest (plus simple et puissant que unittest)",
    "Environnements virtuels (uv le fait par défaut)",
    "typer / click (CLI moderne)",
    "Jupyter Notebooks (exploration data)",
  ],
  prerequisites: "Module C (m03) recommandé. À l'aise en terminal (m02) et en algo de base (m00).",
  estimatedHours: 40,
  estimatedWeeks: 3,
  stackAllowed: [
    "Python 3.12+ + uv + Ruff + pyright/mypy",
    "pytest + typer + httpx + BeautifulSoup",
    "pandas/polars + Jupyter + Pydantic",
  ],
  prereqModuleId: "m03-c-bas-niveau",
  unlockSrsMatureRatio: 80,
};

export const m24Skills: NewSkill[] = [
  { moduleId: M24_ID, slug: "python-vs-js", label: "Python vs JS (mapping rapide)", displayOrder: 1, weight: 1 },
  { moduleId: M24_ID, slug: "uv-ruff", label: "uv (paquets) + Ruff (lint/format) — standard 2026", displayOrder: 2, weight: 3 },
  { moduleId: M24_ID, slug: "syntax", label: "Syntaxe (indentation, range, enumerate, zip)", displayOrder: 3, weight: 2 },
  { moduleId: M24_ID, slug: "data-structures", label: "list, tuple, dict, set (mutable vs immutable)", displayOrder: 4, weight: 2 },
  { moduleId: M24_ID, slug: "comprehensions", label: "List/dict/set comprehensions", displayOrder: 5, weight: 3 },
  { moduleId: M24_ID, slug: "functions-py", label: "Fonctions (*args, **kwargs, lambdas)", displayOrder: 6, weight: 2 },
  { moduleId: M24_ID, slug: "classes-py", label: "Classes + dataclasses", displayOrder: 7, weight: 2 },
  { moduleId: M24_ID, slug: "modules-py", label: "Modules + packages + if __name__ == '__main__'", displayOrder: 8, weight: 1 },
  { moduleId: M24_ID, slug: "type-hints", label: "Type hints + mypy/pyright", displayOrder: 9, weight: 3 },
  { moduleId: M24_ID, slug: "pathlib", label: "pathlib (vs os.path)", displayOrder: 10, weight: 2 },
  { moduleId: M24_ID, slug: "io-csv-json", label: "File I/O + CSV + JSON", displayOrder: 11, weight: 2 },
  { moduleId: M24_ID, slug: "httpx", label: "httpx async-first (vs requests)", displayOrder: 12, weight: 2 },
  { moduleId: M24_ID, slug: "asyncio", label: "asyncio (event loop, gather, as_completed)", displayOrder: 13, weight: 2 },
  { moduleId: M24_ID, slug: "scraping", label: "BeautifulSoup + Playwright Python", displayOrder: 14, weight: 2 },
  { moduleId: M24_ID, slug: "pandas-polars", label: "pandas + polars (data manipulation)", displayOrder: 15, weight: 2 },
  { moduleId: M24_ID, slug: "pytest", label: "pytest (tests Python)", displayOrder: 16, weight: 2 },
  { moduleId: M24_ID, slug: "venv", label: "Environnements virtuels (uv venv)", displayOrder: 17, weight: 2 },
  { moduleId: M24_ID, slug: "typer-cli", label: "typer (CLI moderne)", displayOrder: 18, weight: 1 },
  { moduleId: M24_ID, slug: "jupyter", label: "Jupyter Notebooks (exploration data)", displayOrder: 19, weight: 1 },
];

export const m24SkillAxisRules = m24Skills.map((s) => ({ skillSlug: s.slug, axisId: "python", contribution: 100 }));

export const m24Videos: NewVideo[] = [
  {
    moduleId: M24_ID,
    isPrimary: 1,
    title: "Learn Python — Full Course for Beginners",
    creator: "freeCodeCamp / Mike Dane",
    youtubeId: "rfscVS0vtbw",
    language: "en",
    durationSeconds: 4 * 60 * 60 + 30 * 60,
    whyThisOne: "Bases proprement, sans perte de temps. Mike Dane extrêmement pédagogue.",
    coversSkills: ["syntax", "data-structures", "functions-py", "classes-py"],
    displayOrder: 1,
  },
  {
    moduleId: M24_ID,
    isPrimary: 0,
    title: "uv — The Astral Python Package Manager",
    creator: "Astral",
    externalUrl: "https://docs.astral.sh/uv",
    language: "en",
    whyThisOne: "Standard 2026. 10-100x plus rapide que pip/poetry. Écrit en Rust.",
    coversSkills: ["uv-ruff", "venv"],
    displayOrder: 2,
  },
  {
    moduleId: M24_ID,
    isPrimary: 0,
    title: "Automate the Boring Stuff with Python (3ᵉ éd. gratuite)",
    creator: "Al Sweigart",
    externalUrl: "https://automatetheboringstuff.com",
    language: "en",
    whyThisOne: "OBLIGATOIRE pour automatisations concrètes (renommer fichiers, scraper, Excel, emails).",
    coversSkills: ["scraping", "io-csv-json", "pathlib"],
    displayOrder: 3,
  },
];

export const m24Exercises: NewExercise[] = [
  {
    moduleId: M24_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : list comprehension, type hints, async",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Équivalent Python de JS `arr.filter(x => x > 0).map(x => x * 2)` ?",
        options: [
          "Identique",
          "`[x*2 for x in arr if x > 0]` (list comprehension, plus pythonique)",
          "Impossible",
          "Avec for classique",
        ],
        correctIndex: 1,
        explanation: "List comprehension = idiom Python. Plus court, plus rapide, plus lisible. map/filter existent mais pythonistes préfèrent comprehensions.",
      },
      {
        question: "`def fn(arr=[]):` — piège ?",
        options: [
          "Aucun",
          "Default mutable partagé entre tous les appels (la même liste). Bug subtil. Préférer `def fn(arr=None): arr = arr or []`",
          "Syntaxe invalide",
          "Plus rapide",
        ],
        correctIndex: 1,
        explanation: "Mutable default = piège classique Python. La liste est créée 1 fois à la définition de la fonction, pas à chaque appel. Pattern : `arr=None` puis `arr = arr or []` en début de fonction.",
      },
      {
        question: "Équivalent JS `Promise.all([a, b])` en Python ?",
        options: [
          "Promise.all",
          "await asyncio.gather(a, b) (avec a, b = coroutines)",
          "asyncio.parallel",
          "Impossible",
        ],
        correctIndex: 1,
        explanation: "asyncio.gather(*coros) = équivalent. Note : Python event loop est EXPLICITE (asyncio.run() au top-level), contrairement à Node où c'est auto.",
      },
    ],
    skillSlugs: ["comprehensions", "functions-py", "asyncio"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M24_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "python",
    title: "Python Forge — 4 outils utiles (CLI + scraper + data + async)",
    statement: `4 outils Python qui t'aident vraiment dans ton workflow réel.

**Setup**
- uv init python-forge + Ruff config + pyright strict
- CI GitHub Actions : lint + typecheck + tests à chaque push

**Tool 1 — cli-pdf-merger** (concret pour Flaynn)
- typer CLI : fusionne N PDFs en 1
- Options : --sort, --password, --page-range
- Install global via uv tool install

**Tool 2 — ba-scraper** (massivement pertinent Flaynn)
- httpx async + BeautifulSoup + Playwright Python
- pydantic models pour valider BusinessAngel extracted
- Respect robots.txt, throttle 1 req/s, User-Agent identifiable
- Export CSV + JSON nettoyés (importables Flaynn DB)
- Éthique : pas de scraping derrière auth, juste enrichissement données existantes

**Tool 3 — data-analyzer** (scoring + analytics)
- Notebook Jupyter qui charge CSV dossiers Flaynn scorés
- pandas + polars : stats par pilier, distributions, top/bottom 10
- matplotlib/plotly : histogramme scores, heatmap pillar × secteur, scatter
- Rapport HTML auto-généré (Jinja2)
- Comparer perf pandas vs polars sur 100k lignes

**Tool 4 — async-api-client**
- async client pour orchestrer Claude + OpenAI + Mistral en parallèle
- asyncio.gather + httpx
- CLI : prompt → 3 LLMs → tableau comparatif (temps, coût)
- Bonus : caching local SQLite

**Critères**
- Python 3.12+ + type hints partout + 0 erreur pyright strict
- Ruff lint clean
- ≥ 5 tests pytest par outil
- README clair + exemples`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["uv-ruff", "type-hints", "httpx", "asyncio", "scraping", "pandas-polars"],
    passThresholdPct: 100,
    estimatedMinutes: 30 * 60,
    displayOrder: 2,
  },
];
