import type { NewExercise } from "../../schema/content";
import { M02_ID } from "./m02";

/**
 * M02 — Terminal & Shell (Bash) — EXERCICES SUPPLÉMENTAIRES.
 *
 * Le module M02 n'avait que 3 exos (2 quiz + 1 gros projet) et AUCUN exo de
 * code court. Comme le shell ne tourne pas (encore) dans le navigateur, on mixe :
 *   - 2 quiz "quiz_verification" (sandbox "browser") qui couvrent les skills
 *     peu testés : navigation, files, text, env, args, exit-codes, text-tools,
 *     processes, ssh, shortcuts.
 *   - 5 "code_exercise" (sandbox "external", language "bash") : de vrais petits
 *     scripts à écrire et tester EN LOCAL dans un terminal, avec critères de
 *     validation exacts. Progression facile → difficile.
 *
 * displayOrder ≥ 20 pour se placer après les 3 exos existants (1, 2, 3) sans
 * collision. skillSlugs : uniquement des slugs réels de m02.ts.
 *
 * Toute recon/sécu est cadrée : on ne touche QUE sa propre machine.
 */
export const m02ExtraExercises: NewExercise[] = [
  // =============================================================
  // QUIZ 1 — Naviguer, manipuler, lire (le quotidien)
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérif — Navigation, fichiers, texte & environnement",
    statement:
      "Quiz sur le socle quotidien : se déplacer, manipuler des fichiers, filtrer du texte et gérer les variables d'environnement. Lis bien les sorties de commande. Seuil : 80 %.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu es dans `/home/erwin/dev/porterfield-heroes/packages/db`. Quelle commande te ramène EN UNE FOIS dans `/home/erwin/dev` ?",
        options: ["cd ..", "cd ../..", "cd ../../..", "cd ~/db"],
        correctIndex: 2,
        explanation:
          "De `packages/db` il faut remonter 3 niveaux : db → packages → porterfield-heroes → dev. Donc `cd ../../..`. `cd ..` ne remonte que d'un cran (vers `packages`).",
      },
      {
        question:
          "Tu lances `ls` dans un dossier et ton fichier `.env` n'apparaît pas. Pourquoi ?",
        options: [
          "Le fichier a été supprimé",
          "`ls` cache les fichiers commençant par un point ; il faut `ls -a`",
          "`.env` n'est pas un vrai fichier",
          "Il faut être root pour le voir",
        ],
        correctIndex: 1,
        explanation:
          "Les fichiers dont le nom commence par `.` (dotfiles) sont masqués par défaut. `ls -a` (ou `-A`) les affiche. C'est pour ça qu'on ne voit pas `.git`, `.env`, `.bashrc` sans le flag.",
      },
      {
        question:
          "Tu veux créer d'un coup l'arborescence `src/api/v1/handlers` (les dossiers intermédiaires n'existent pas). Quelle commande ?",
        options: [
          "mkdir src/api/v1/handlers",
          "mkdir -p src/api/v1/handlers",
          "touch -p src/api/v1/handlers",
          "mkdir -r src/api/v1/handlers",
        ],
        correctIndex: 1,
        explanation:
          "`mkdir -p` crée toute la chaîne de dossiers parents au besoin et ne râle pas s'ils existent déjà. Sans `-p`, `mkdir` échoue car `src/api/v1` n'existe pas encore.",
      },
      {
        question:
          "Sur un access log Nginx, que compte exactement `grep -c \" 404 \" access.log` ?",
        options: [
          "Le nombre total de lignes du fichier",
          "Le nombre de lignes contenant \" 404 \"",
          "Le nombre de fois où \"404\" apparaît, même plusieurs fois par ligne",
          "Les 404 ET les 4xx en général",
        ],
        correctIndex: 1,
        explanation:
          "`grep -c` compte le nombre de LIGNES qui matchent, pas le nombre d'occurrences. Une ligne avec deux \"404\" compte pour 1. Pour compter les occurrences il faudrait `grep -o ... | wc -l`.",
      },
      {
        question:
          "Dans un script enfant lancé depuis ton shell, la variable n'est PAS visible. Tu l'avais définie comment ?",
        options: [
          "export MA_VAR=\"x\"",
          "MA_VAR=\"x\" (sans export)",
          "declare -x MA_VAR=\"x\"",
          "MA_VAR=\"x\" puis source",
        ],
        correctIndex: 1,
        explanation:
          "Sans `export`, la variable reste locale au shell courant et n'est PAS héritée par les processus enfants (scripts, node...). Il faut `export MA_VAR=\"x\"` pour la propager.",
      },
      {
        question:
          "Quelle commande te dit QUEL `node` sera réellement exécuté quand tu tapes `node` (le premier trouvé dans le PATH) ?",
        options: ["echo $PATH", "which node", "ls -l node", "find / -name node"],
        correctIndex: 1,
        explanation:
          "`which node` (ou `type node`) résout le chemin du binaire qui sera lancé en parcourant `$PATH` dans l'ordre. `type -a node` liste TOUS les `node` du PATH si tu soupçonnes un doublon.",
      },
      {
        question:
          "Tu fais `cp dossier/ backup/` et ça échoue ou copie mal. Quelle est la cause / le fix ?",
        options: [
          "Il faut sudo",
          "`cp` sur un dossier exige le flag récursif : `cp -r dossier/ backup/`",
          "Il faut d'abord créer `backup/`",
          "`cp` ne copie jamais les dossiers, il faut `mv`",
        ],
        correctIndex: 1,
        explanation:
          "Pour copier un dossier et son contenu, `cp` a besoin de `-r` (récursif). Réflexe : dossier = penser récursif (`cp -r`, comme `rm -r`).",
      },
    ],
    skillSlugs: ["navigation", "files", "text", "env"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 20,
  },

  // =============================================================
  // QUIZ 2 — Outils texte, codes retour, processus, SSH, raccourcis
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérif — Texte avancé, codes retour, process, SSH & raccourcis",
    statement:
      "Quiz sur l'artillerie : sed/awk/sort/uniq, codes de retour & quoting, gestion des processus, SSH et raccourcis clavier. Concentre-toi sur les sorties exactes. Seuil : 80 %.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu veux le classement des IPs les plus fréquentes dans un log (1 IP par ligne). Quel pipeline ?",
        options: [
          "sort ips.txt | uniq -c | sort -rn",
          "uniq -c ips.txt | sort",
          "sort -rn ips.txt | uniq",
          "uniq ips.txt | wc -l",
        ],
        correctIndex: 0,
        explanation:
          "`uniq -c` ne compte que des lignes ADJACENTES → il faut `sort` AVANT. Puis `uniq -c` compte, et `sort -rn` (numérique inversé) classe du plus fréquent au moins fréquent. C'est l'idiome universel \"compter par fréquence\".",
      },
      {
        question:
          "Une commande affiche `127` comme code de retour (`echo $?`). Que s'est-il passé ?",
        options: [
          "Succès",
          "Mauvais usage des arguments",
          "Command not found",
          "Trouvée mais pas exécutable (permission)",
        ],
        correctIndex: 2,
        explanation:
          "127 = command not found (binaire absent du PATH ou faute de frappe). 126 = trouvé mais pas exécutable (permission/flag x manquant). 0 = succès, 2 = mauvais usage, 130 = Ctrl+C.",
      },
      {
        question:
          "Sur un CSV séparé par des virgules, quelle commande extrait UNIQUEMENT la 2e colonne ?",
        options: [
          "cut -f2 data.csv",
          "cut -d',' -f2 data.csv",
          "awk '{ print $2 }' data.csv",
          "grep ',' data.csv | head -2",
        ],
        correctIndex: 1,
        explanation:
          "`cut -d',' -f2` : `-d','` fixe la virgule comme délimiteur, `-f2` prend le 2e champ. `cut -f2` seul utilise la TABULATION par défaut (ne marchera pas sur des virgules). `awk '{print $2}'` découpe sur les espaces, pas les virgules (il faudrait `awk -F','`).",
      },
      {
        question:
          "Pourquoi `commande 2>&1 > fichier.log` n'envoie-t-il PAS les erreurs dans le fichier ?",
        options: [
          "C'est un bug de bash",
          "L'ordre compte : `2>&1` copie stderr vers l'ANCIEN stdout (l'écran) AVANT que stdout ne soit redirigé. Il faut `> fichier.log 2>&1`",
          "Il manque un pipe",
          "Il faut `&>` à la place",
        ],
        correctIndex: 1,
        explanation:
          "Les redirections sont évaluées de gauche à droite. `2>&1` fait pointer stderr là où pointe stdout À CET INSTANT (encore l'écran). Le `> fichier.log` qui suit ne déplace que stdout. L'ordre correct : `> fichier.log 2>&1` (ou `&> fichier.log` en bash moderne).",
      },
      {
        question:
          "Ton serveur Node refuse de démarrer : `EADDRINUSE: port 3000 already in use`. Quel couple de commandes règle ça ?",
        options: [
          "kill -9 3000",
          "lsof -i :3000 puis kill <PID>",
          "ps aux | grep 3000",
          "netstat -r | grep 3000",
        ],
        correctIndex: 1,
        explanation:
          "`lsof -i :3000` identifie le process qui écoute sur le port (et son PID), puis `kill <PID>` (SIGTERM d'abord) l'arrête. `kill -9 3000` est faux : 3000 est le PORT, pas un PID — tu tuerais peut-être un process innocent.",
      },
      {
        question:
          "Pourquoi SSH refuse-t-il ta clé privée avec `Permissions 0644 are too open` ?",
        options: [
          "Le fichier est corrompu",
          "Une clé privée doit être lisible par son seul propriétaire : `chmod 600 ~/.ssh/id_ed25519`",
          "Il faut la mettre en 777",
          "Le serveur est mal configuré",
        ],
        correctIndex: 1,
        explanation:
          "SSH REFUSE volontairement une clé privée lisible par d'autres (group/other). C'est une protection. Le fix : `chmod 600 ~/.ssh/id_ed25519` (rw-------) et `chmod 700 ~/.ssh`. Surtout PAS 777, qui aggraverait la fuite.",
      },
      {
        question:
          "Tu viens de taper une longue commande qui a échoué pour droit manquant. Comment la relancer préfixée de `sudo` SANS la retaper ?",
        options: ["sudo !$", "sudo !!", "sudo Ctrl+R", "!sudo"],
        correctIndex: 1,
        explanation:
          "`!!` réinsère la commande PRÉCÉDENTE entière. `sudo !!` la relance avec sudo. (`!$` ne reprend que le dernier argument.) Relis quand même ce que `!!` expanse avant Entrée : ça peut relancer une commande destructrice en root.",
      },
    ],
    skillSlugs: [
      "text-tools",
      "exit-codes",
      "pipes-redirect",
      "processes",
      "ssh",
      "shortcuts",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 21,
  },

  // =============================================================
  // CODE 1 (facile) — One-liner find + grep
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "One-liner : retrouver les TODO oubliés dans le code",
    statement: `Écris **UNE seule commande** (un one-liner, pas un script) qui liste tous les commentaires \`TODO\` traînant dans ton code source, avec le **nom du fichier** et le **numéro de ligne**.

**Contraintes :**
- Cherche **récursivement** sous le dossier courant.
- Ne cherche QUE dans les fichiers \`.ts\`, \`.js\`, \`.tsx\`, \`.jsx\` (pas dans les images, pas dans les binaires).
- **Insensible à la casse** (\`TODO\`, \`todo\`, \`ToDo\`).
- **Exclut** \`node_modules\` et \`.git\` (sinon tu noies le résultat).
- Affiche le **chemin du fichier** ET le **numéro de ligne**.

**Teste en local (terminal) :**
1. Crée un mini-dossier de test avec quelques fichiers \`.ts\` contenant des \`// TODO: ...\`, dont un dans un faux \`node_modules/\`.
2. Lance ta commande depuis ce dossier.
3. Vérifie qu'AUCUN résultat ne vient de \`node_modules/\`.

**Critères de validation EXACTS :**
- La sortie contient une ligne par occurrence, au format \`chemin:numéro:contenu\` (le format \`grep -rn\`).
- Aucune ligne ne provient de \`node_modules\` ou de \`.git\`.
- Les fichiers non concernés (\`.png\`, \`.md\`, \`.lock\`...) sont ignorés.
- La commande tient sur UNE ligne logique.

**Indice :** \`grep -rin\` fait déjà presque tout. \`--include\` et \`--exclude-dir\` finissent le travail. (Variante \`find ... -print0 | xargs -0 grep\` acceptée si tu préfères.)`,
    starterCode: `#!/usr/bin/env bash
# But : lister tous les TODO (fichier + numéro de ligne) dans le code source.
# Écris ci-dessous TON one-liner. Exemple de squelette à compléter :

grep -rin "TODO" .   # <-- trop large : ajoute --include et --exclude-dir
`,
    solutionCode: `#!/usr/bin/env bash
# Solution principale (grep récursif ciblé) :
grep -rin "TODO" . \\
  --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" \\
  --exclude-dir="node_modules" --exclude-dir=".git"

# Variante équivalente avec find (gère les espaces dans les noms) :
# find . -type d \\( -name node_modules -o -name .git \\) -prune -o \\
#   -type f \\( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \\) -print0 \\
#   | xargs -0 grep -in "TODO"
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["files", "text"],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 22,
  },

  // =============================================================
  // CODE 2 (facile-moyen) — Backup robuste set -euo pipefail
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "backup.sh — archive horodatée, strict mode",
    statement: `Écris \`backup.sh\` : un script robuste qui archive un dossier source en \`.tar.gz\` **horodaté**.

**Contraintes :**
- Shebang \`#!/usr/bin/env bash\` + \`set -euo pipefail\` en tête.
- Argument 1 = **dossier source** (obligatoire). Argument 2 = **dossier de destination** (défaut : \`./backups\`).
- Affiche un \`usage()\` clair sur stderr et \`exit 1\` si aucun argument.
- Vérifie que la source **existe et est un dossier** ; sinon erreur explicite + \`exit 1\`.
- Crée le dossier de destination s'il manque (\`mkdir -p\`).
- Le nom de l'archive contient un **timestamp** \`AAAAMMJJ-HHMMSS\` (ex : \`backup-20260621-143015.tar.gz\`).
- En fin, affiche \`OK -> <chemin>\` et la **taille** de l'archive (ex via \`du -h\`).
- **Toutes** les variables sont quotées (\`"$source"\`).

**Teste en local (terminal) :**
\`\`\`bash
chmod +x backup.sh
./backup.sh                 # doit afficher l'usage + sortir en code 1
./backup.sh /dossier/inexistant   # doit refuser proprement (code 1)
mkdir -p demo && echo hi > demo/a.txt
./backup.sh demo            # crée ./backups/backup-<timestamp>.tar.gz
tar -tzf backups/backup-*.tar.gz   # vérifie le contenu de l'archive
echo \$?                     # 0 attendu sur le cas nominal
\`\`\`

**Critères de validation EXACTS :**
- Sans argument : message d'usage sur stderr, code de sortie 1.
- Source inexistante : message d'erreur, code de sortie 1.
- Cas nominal : un fichier \`backups/backup-<timestamp>.tar.gz\` est créé et \`tar -tzf\` liste bien le contenu.
- La dernière ligne affiche \`OK -> ...\` avec la taille.
- \`shellcheck backup.sh\` ne renvoie aucun warning.`,
    starterCode: `#!/usr/bin/env bash
#
# backup.sh — archive un dossier en .tar.gz horodaté.
#
set -euo pipefail

readonly SOURCE="\${1:-}"
readonly DEST="\${2:-./backups}"
readonly STAMP="$(date +%Y%m%d-%H%M%S)"

usage() {
  echo "Usage: $0 <dossier_source> [dossier_dest]" >&2
  exit 1
}

main() {
  # TODO : valider SOURCE (non vide + dossier existant)
  # TODO : mkdir -p "$DEST"
  # TODO : tar -czf "<archive>" "$SOURCE"
  # TODO : afficher OK -> ... avec la taille (du -h)
  :
}

main "$@"
`,
    solutionCode: `#!/usr/bin/env bash
#
# backup.sh — archive un dossier en .tar.gz horodaté.
#
set -euo pipefail

readonly SOURCE="\${1:-}"
readonly DEST="\${2:-./backups}"
readonly STAMP="$(date +%Y%m%d-%H%M%S)"

usage() {
  echo "Usage: $0 <dossier_source> [dossier_dest]" >&2
  exit 1
}

main() {
  [[ -n "$SOURCE" ]] || usage
  [[ -d "$SOURCE" ]] || { echo "Erreur: '$SOURCE' n'est pas un dossier" >&2; exit 1; }

  mkdir -p "$DEST"
  local archive="$DEST/backup-$STAMP.tar.gz"
  tar -czf "$archive" "$SOURCE"
  echo "OK -> $archive ($(du -h "$archive" | cut -f1))"
}

main "$@"
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["scripting", "args", "exit-codes"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 23,
  },

  // =============================================================
  // CODE 3 (moyen) — Parser de logs avec awk/sort/uniq
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "log-summary.sh — résumer un access log (awk + sort + uniq)",
    statement: `Écris \`log-summary.sh\` : un script qui prend un **access log** style Nginx/Apache (format \"combined\") et en sort un résumé.

Rappel du format combined (champs séparés par des espaces) :
\`\`\`
IP - - [date] "METHOD /url HTTP/1.1" STATUS taille "referer" "ua"
$1                              $7        $9
\`\`\`

**Contraintes :**
- Shebang + \`set -euo pipefail\`.
- Argument 1 = chemin du log (obligatoire ; sinon usage + \`exit 1\`).
- Vérifie que le fichier existe (\`[[ -f ... ]]\`).
- Affiche, dans cet ordre, avec ces titres EXACTS :
  1. \`== Total requetes ==\` puis le **nombre de lignes** du log.
  2. \`== Top 5 IPs ==\` puis les 5 IPs les plus fréquentes (format \`<count> <ip>\`).
  3. \`== Top 5 URLs ==\` puis les 5 URLs les plus demandées (champ 7).
  4. \`== Status codes ==\` puis la répartition des codes (champ 9), du plus fréquent au moins fréquent.
- Utilise impérativement le combo \`awk\` (extraction de colonne) + \`sort\` + \`uniq -c\` + \`sort -rn\` + \`head\`.

**Teste en local (terminal) :** crée un faux log déterministe puis lance le script.
\`\`\`bash
cat > access.log <<'EOF'
10.0.0.1 - - [x] "GET /home HTTP/1.1" 200 12 "-" "ua"
10.0.0.1 - - [x] "GET /home HTTP/1.1" 200 12 "-" "ua"
10.0.0.2 - - [x] "GET /login HTTP/1.1" 404 0 "-" "ua"
EOF
chmod +x log-summary.sh
./log-summary.sh access.log
\`\`\`

**Critères de validation EXACTS** (avec le log ci-dessus) :
- \`Total requetes\` = 3.
- \`Top 5 IPs\` : \`10.0.0.1\` en tête avec un count de 2, \`10.0.0.2\` avec 1.
- \`Top 5 URLs\` : \`/home\` (2) avant \`/login\` (1).
- \`Status codes\` : \`200\` (2) avant \`404\` (1).
- Fichier inexistant ou aucun argument : message d'erreur + code de sortie 1.`,
    starterCode: `#!/usr/bin/env bash
#
# log-summary.sh — résumé d'un access log Nginx/Apache (combined).
#
set -euo pipefail

log="\${1:-}"
[[ -n "$log" ]]   || { echo "Usage: $0 <access.log>" >&2; exit 1; }
[[ -f "$log" ]]   || { echo "Erreur: fichier introuvable: $log" >&2; exit 1; }

echo "== Total requetes =="
# TODO : nombre de lignes (wc -l < "$log")

echo "== Top 5 IPs =="
# TODO : awk '{ print $1 }' "$log" | sort | uniq -c | sort -rn | head -5

echo "== Top 5 URLs =="
# TODO : champ 7

echo "== Status codes =="
# TODO : champ 9
`,
    solutionCode: `#!/usr/bin/env bash
#
# log-summary.sh — résumé d'un access log Nginx/Apache (combined).
#
set -euo pipefail

log="\${1:-}"
[[ -n "$log" ]]   || { echo "Usage: $0 <access.log>" >&2; exit 1; }
[[ -f "$log" ]]   || { echo "Erreur: fichier introuvable: $log" >&2; exit 1; }

echo "== Total requetes =="
wc -l < "$log"

echo "== Top 5 IPs =="
awk '{ print $1 }' "$log" | sort | uniq -c | sort -rn | head -5

echo "== Top 5 URLs =="
awk '{ print $7 }' "$log" | sort | uniq -c | sort -rn | head -5

echo "== Status codes =="
awk '{ print $9 }' "$log" | sort | uniq -c | sort -rn
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["text-tools", "pipes-redirect", "scripting"],
    passThresholdPct: 80,
    estimatedMinutes: 35,
    displayOrder: 24,
  },

  // =============================================================
  // CODE 4 (moyen-difficile) — getopts CLI
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "greet.sh — une vraie CLI avec getopts",
    statement: `Écris \`greet.sh\` : un petit outil en ligne de commande qui salue un utilisateur, avec de **vraies options** parsées par \`getopts\`.

**Contraintes :**
- Shebang + \`set -euo pipefail\`.
- Usage : \`greet.sh [-u] [-n N] [-h] <nom>\`
  - \`<nom>\` : argument positionnel **obligatoire**.
  - \`-u\` : affiche le nom en **MAJUSCULES**.
  - \`-n N\` : répète le message **N fois** (N prend une valeur ; défaut 1).
  - \`-h\` : affiche l'usage et sort en code 0.
- Une option inconnue OU \`-n\` sans valeur → message d'erreur sur stderr + \`exit 1\`.
- \`exit 1\` + usage si aucun nom positionnel après les options.
- Pense au \`shift $((OPTIND - 1))\` pour récupérer le nom après les options.

**Teste en local (terminal) :**
\`\`\`bash
chmod +x greet.sh
./greet.sh Erwin            # -> Bonjour Erwin
./greet.sh -u Erwin         # -> Bonjour ERWIN
./greet.sh -n 3 Erwin       # -> "Bonjour Erwin" sur 3 lignes
./greet.sh -u -n 2 erwin    # -> "Bonjour ERWIN" x2
./greet.sh                  # -> usage sur stderr, code 1
./greet.sh -x Erwin         # -> option inconnue, code 1
echo \$?
\`\`\`

**Critères de validation EXACTS :**
- \`./greet.sh Erwin\` affiche exactement \`Bonjour Erwin\`.
- \`-u\` met le nom en majuscules.
- \`-n 3\` produit 3 lignes identiques.
- Les options se combinent (\`-u -n 2\`).
- Aucun nom → usage sur stderr + code 1 ; option inconnue → code 1.`,
    starterCode: `#!/usr/bin/env bash
#
# greet.sh — salue un utilisateur, options gérées par getopts.
#
set -euo pipefail

upper=0
times=1

usage() { echo "Usage: $0 [-u] [-n N] [-h] <nom>" >&2; exit 1; }

# TODO : boucle getopts ":un:h" pour remplir upper / times et gérer -h, \\?, :
# TODO : shift $((OPTIND - 1))
# TODO : récupérer <nom>, vérifier qu'il est non vide
# TODO : si upper=1, passer le nom en MAJUSCULES
# TODO : boucle qui affiche "Bonjour <nom>" $times fois
`,
    solutionCode: `#!/usr/bin/env bash
#
# greet.sh — salue un utilisateur, options gérées par getopts.
#
set -euo pipefail

upper=0
times=1

usage() { echo "Usage: $0 [-u] [-n N] [-h] <nom>" >&2; exit 1; }

while getopts ":un:h" opt; do
  case "$opt" in
    u) upper=1 ;;
    n) times="$OPTARG" ;;
    h) echo "Usage: $0 [-u] [-n N] [-h] <nom>"; exit 0 ;;
    \\?) echo "Option inconnue: -$OPTARG" >&2; usage ;;
    :)  echo "Option -$OPTARG attend une valeur" >&2; usage ;;
  esac
done
shift $((OPTIND - 1))

name="\${1:-}"
[[ -n "$name" ]] || usage

if [[ "$upper" -eq 1 ]]; then
  name="\${name^^}"   # bash 4+ : passe en majuscules
fi

for ((i = 0; i < times; i++)); do
  echo "Bonjour $name"
done
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["args", "scripting", "exit-codes"],
    passThresholdPct: 80,
    estimatedMinutes: 35,
    displayOrder: 25,
  },

  // =============================================================
  // CODE 5 (difficile) — Script idempotent avec trap + mktemp + lock
  // =============================================================
  {
    moduleId: M02_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "safe-sync.sh — idempotent, lock + trap de nettoyage",
    statement: `Écris \`safe-sync.sh\` : un script qui copie le contenu d'un dossier source vers un dossier cible de façon **idempotente** (le relancer ne casse rien) et **sûr** (nettoyage garanti même en cas de crash ou Ctrl+C).

**Contraintes :**
- Shebang + \`set -euo pipefail\`.
- Argument 1 = source (dossier existant), argument 2 = cible. Usage + \`exit 1\` si manquants.
- **Lock anti-concurrence :** crée un fichier de lock \`/tmp/safe-sync.lock\`. Si une autre instance tourne (lock présent), affiche un message et \`exit 1\` SANS supprimer le lock de l'autre.
- **trap de nettoyage :** un \`trap ... EXIT\` doit **toujours** retirer le lock à la sortie (succès, erreur, ou Ctrl+C). Sur \`INT\`, affiche \`Interrompu\` puis sort.
- **Fichier temporaire :** crée un \`mktemp\` pour un journal des fichiers copiés, et garantis sa suppression via le trap (pas de secret/temp qui traîne).
- **Idempotence :** utilise \`rsync -a\` (ou \`cp -a\`) pour ne (re)copier que ce qui change ; relancer le script deux fois de suite ne doit produire aucune erreur.
- Crée la cible si absente (\`mkdir -p\`). Quote toutes les variables.

**Teste en local (terminal) :**
\`\`\`bash
chmod +x safe-sync.sh
mkdir -p src && echo a > src/a.txt && echo b > src/b.txt
./safe-sync.sh src dst        # 1re fois : copie a.txt et b.txt
./safe-sync.sh src dst        # 2e fois : aucune erreur, idempotent
echo \$?                       # 0
ls -la /tmp/safe-sync.lock 2>/dev/null   # le lock NE doit PAS subsister
# Test Ctrl+C : relance et fais Ctrl+C pendant le run -> "Interrompu", lock retiré
\`\`\`

**Critères de validation EXACTS :**
- Après exécution, le lock \`/tmp/safe-sync.lock\` n'existe plus (vérifié par le trap EXIT).
- Lancer le script deux fois d'affilée renvoie code 0 les deux fois (idempotent).
- Si tu lances une 2e instance pendant qu'une 1re tourne, la 2e refuse avec un message + code 1 et ne supprime pas le lock de la 1re.
- Le fichier \`mktemp\` est supprimé en sortie.
- \`shellcheck safe-sync.sh\` sans warning.

🔒 **Sécu :** le lock dans \`/tmp\` doit refuser de s'exécuter si un autre process détient déjà le lock (évite les corruptions). Le \`mktemp\` (nom imprévisible) + nettoyage via trap évite de laisser des données sensibles sur le disque.`,
    starterCode: `#!/usr/bin/env bash
#
# safe-sync.sh — copie idempotente avec lock + trap de nettoyage.
#
set -euo pipefail

readonly SRC="\${1:-}"
readonly DST="\${2:-}"
readonly LOCK="/tmp/safe-sync.lock"

usage() { echo "Usage: $0 <source> <cible>" >&2; exit 1; }

# TODO : valider SRC (dossier) et DST (non vide)
# TODO : si [[ -e "$LOCK" ]] -> "déjà en cours" + exit 1 (NE PAS supprimer le lock d'autrui)
# TODO : créer le lock, créer un tmp via mktemp
# TODO : trap qui retire lock + tmp sur EXIT, et affiche "Interrompu" sur INT
# TODO : mkdir -p "$DST" ; rsync -a "$SRC"/ "$DST"/   (idempotent)
`,
    solutionCode: `#!/usr/bin/env bash
#
# safe-sync.sh — copie idempotente avec lock + trap de nettoyage.
#
set -euo pipefail

readonly SRC="\${1:-}"
readonly DST="\${2:-}"
readonly LOCK="/tmp/safe-sync.lock"

usage() { echo "Usage: $0 <source> <cible>" >&2; exit 1; }

[[ -n "$SRC" && -n "$DST" ]] || usage
[[ -d "$SRC" ]] || { echo "Erreur: source '$SRC' n'est pas un dossier" >&2; exit 1; }

# Anti-concurrence : si le lock existe déjà, une autre instance tourne.
if [[ -e "$LOCK" ]]; then
  echo "Une synchro est deja en cours (lock: $LOCK)" >&2
  exit 1
fi
touch "$LOCK"

# Fichier temporaire (journal). mktemp = nom imprevisible.
tmp="$(mktemp)"

cleanup() {
  rm -f "$LOCK" "$tmp"
}
on_int() {
  echo "Interrompu" >&2
  exit 130
}
trap cleanup EXIT      # nettoyage garanti (succes, erreur, signal)
trap on_int INT        # message propre sur Ctrl+C (puis EXIT -> cleanup)

mkdir -p "$DST"

# rsync -a : idempotent, ne (re)copie que ce qui a change.
rsync -a "$SRC"/ "$DST"/ | tee "$tmp"

echo "Synchro OK : $SRC -> $DST"
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["scripting", "exit-codes", "files", "ssh"],
    passThresholdPct: 80,
    estimatedMinutes: 45,
    displayOrder: 26,
  },
];
