/**
 * M02 — Terminal & Shell (Bash) — contenu pédagogique markdown in-app.
 *
 * Une leçon par skill slug du module (cf. m02.ts → m02Skills).
 * Indexé par slug — appliqué via UPDATE skills SET content_markdown.
 * Public : dev JS/TS confirmé qui veut MAÎTRISER bash (scripting robuste,
 * pièges, sécu défensive). Ton direct senior, pas de baby-talk.
 */
export const m02LessonContent: Record<string, string> = {
  navigation: `## Naviguer une arborescence Unix

Un système Unix, c'est **un seul arbre**. Pas de \`C:\\\`, pas de \`D:\\\`. Tout part de la racine \`/\` et descend. Une clé USB, un disque réseau, ton home : tout est "monté" quelque part dans ce même arbre. Apprends à te déplacer dedans les yeux fermés, parce que 90 % de ton temps en terminal c'est juste "où suis-je et qu'est-ce qu'il y a ici ?".

### Les 3 commandes qui répondent à "où / quoi"

\`\`\`bash
pwd                 # Print Working Directory : où suis-je ?
# /home/erwin/dev/porterfield-heroes

ls                  # liste le dossier courant
cd packages/db      # change de dossier (Change Directory)
\`\`\`

### Les chemins : absolu vs relatif

Un chemin **absolu** commence par \`/\` (depuis la racine). Un chemin **relatif** part de là où tu es.

\`\`\`bash
cd /home/erwin/dev          # absolu : marche d'où que tu sois
cd dev                      # relatif : "dev" depuis le dossier courant
cd ..                       # remonte d'un niveau (parent)
cd ../..                    # remonte de deux niveaux
cd ~                        # ton home (raccourci de /home/erwin)
cd -                        # revient au dossier PRÉCÉDENT (toggle, très pratique)
cd                          # sans argument = home aussi
\`\`\`

Mémo des raccourcis : \`.\` = dossier courant, \`..\` = parent, \`~\` = home, \`-\` = dernier dossier visité.

### ls, la commande que tu vas taper 50 fois par jour

\`\`\`bash
ls -lah
\`\`\`

Décortiquons la sortie :

\`\`\`
drwxr-xr-x  4 erwin staff   128 Jun 20 14:32 .
drwxr-xr-x 12 erwin staff   384 Jun 19 09:10 ..
-rw-r--r--  1 erwin staff   2.1K Jun 20 14:32 package.json
drwxr-xr-x  8 erwin staff   256 Jun 20 11:05 src
\`\`\`

- 1er caractère : \`d\` = dossier, \`-\` = fichier, \`l\` = lien symbolique.
- \`-l\` : format long (permissions, owner, taille, date).
- \`-a\` : affiche les fichiers cachés (ceux qui commencent par \`.\` comme \`.git\`, \`.env\`).
- \`-h\` : tailles human-readable (\`2.1K\` au lieu de \`2148\`).

Ajoute \`-t\` pour trier par date (le plus récent en haut), \`-r\` pour inverser. \`ls -lahtr\` = "montre-moi tout, le dernier modifié tout en bas" : parfait pour retrouver ce que tu viens de créer.

### Tab, ton meilleur ami

Tape les 2-3 premières lettres d'un nom puis **Tab** : le shell complète. Double-Tab : il liste les possibilités. Tu ne devrais quasiment jamais taper un chemin en entier à la main.

⚠️ **Pièges**

- \`cd dossier avec espaces\` échoue : le shell voit deux arguments. Échappe (\`cd dossier\\ avec\\ espaces\`) ou quote (\`cd "dossier avec espaces"\`).
- \`cd /\` t'envoie à la racine système, pas au home. Erreur classique quand on confond \`/\` et \`~\`.
- Un \`cd\` dans un script ne change PAS le dossier de ton shell parent : le script s'exécute dans un sous-processus. Pour changer ton dossier courant via un script il faut le \`source\` (\`. ./script.sh\`), pas l'exécuter.
- \`ls\` seul cache les fichiers en \`.\` — si ton \`.env\` "n'existe pas", c'est juste qu'il te manque le \`-a\`.

### À écrire dans ton carnet

> Depuis \`/home/erwin/dev/porterfield-heroes/packages/db\`, écris LE chemin relatif ET le chemin absolu pour atteindre \`/home/erwin/dev/objectifs\`. Puis reviens au point de départ en une seule commande.
`,

  files: `## Manipuler fichiers et dossiers

Le filesystem est ton terrain de jeu, mais aussi le seul endroit où une commande peut détruire des heures de travail en une fraction de seconde. On manipule des fichiers tous les jours ; on apprend les garde-fous une fois.

### Créer

\`\`\`bash
touch notes.md                  # crée un fichier vide (ou met à jour sa date)
mkdir logs                      # crée un dossier
mkdir -p src/api/v1/handlers    # -p crée toute la chaîne de dossiers d'un coup
\`\`\`

### Copier et déplacer

\`\`\`bash
cp source.txt dest.txt          # copie un fichier
cp -r dossier/ backup/          # -r = récursif, indispensable pour les dossiers
mv ancien.txt nouveau.txt       # déplace OU renomme (c'est la même commande)
mv fichier.txt ~/Documents/     # déplace dans un dossier existant
\`\`\`

\`mv\` = rename ET move. Renommer un fichier = le "déplacer" vers le même dossier avec un autre nom.

### Supprimer — la zone rouge

\`\`\`bash
rm fichier.txt                  # supprime un fichier (PAS de corbeille, définitif)
rm -r dossier/                  # supprime un dossier et son contenu
rm -i *.log                     # -i demande confirmation pour chaque fichier
\`\`\`

Il n'y a **pas de Ctrl+Z** dans un terminal. \`rm\` ne met rien dans une corbeille : le fichier est délié, point.

### Les liens : raccourcis vs alias profonds

\`\`\`bash
ln -s /chemin/reel/config.json config.json   # lien symbolique (symlink)
\`\`\`

Un **symlink** (\`ln -s\`) est un panneau qui pointe vers un autre chemin. Si la cible disparaît, le lien est cassé (dangling). C'est ce que tu utilises 99 % du temps (ex : \`node_modules/.bin\`). Le hard link (\`ln\` sans \`-s\`) pointe vers les mêmes données sur le disque — plus rare, à connaître sans plus.

### find : retrouver et agir en masse

\`\`\`bash
find . -name "*.test.ts"                 # tous les fichiers de test sous le dossier courant
find . -type d -name "node_modules"      # tous les DOSSIERS node_modules
find . -name "*.log" -mtime +30          # logs modifiés il y a plus de 30 jours
find . -name "*.tmp" -delete             # trouve ET supprime
find . -type f -size +100M               # fichiers de plus de 100 Mo
\`\`\`

\`find\` est récursif par défaut. \`-type f\` = fichiers, \`-type d\` = dossiers, \`-mtime +30\` = plus vieux que 30 jours, \`-mtime -1\` = modifié dans les dernières 24 h.

### Action sécurisée sur les résultats de find

\`\`\`bash
# Mauvais : casse sur les noms avec espaces
find . -name "*.log" | xargs rm

# Bon : -print0 + -0 gèrent les espaces/retours à la ligne
find . -name "*.log" -print0 | xargs -0 rm

# Encore mieux pour vérifier d'abord : remplace rm par echo, regarde, puis exécute
find . -name "*.log" -print0 | xargs -0 echo
\`\`\`

⚠️ **Pièges**

- **\`rm -rf\` est l'arme nucléaire.** \`rm -rf /\` ou \`rm -rf "$VAR"/\` avec \`$VAR\` vide cible la racine. Toujours \`echo\` la commande avant si une variable est en jeu. Ne jamais lancer \`rm -rf\` "au cas où".
- \`mv a.txt b.txt\` **écrase** \`b.txt\` sans demander. Ajoute \`-i\` pour les fichiers précieux.
- \`cp\` sans \`-r\` sur un dossier échoue (ou copie mal). Réflexe : dossier = penser récursif.
- \`mkdir dossier\` échoue s'il existe déjà ; \`mkdir -p\` ne râle pas — pratique dans un script.

🔒 **Réflexe sécu** : avant tout \`rm -rf\` impliquant une variable, fais \`set -u\` (voir skill exit-codes) pour que bash plante si la variable est vide au lieu de supprimer la racine. Et garde le réflexe "dry-run d'abord" : remplace l'action destructrice par un \`echo\`, lis la sortie, puis seulement exécute.

### À écrire dans ton carnet

> Écris une commande \`find\` qui liste tous les fichiers \`.tmp\` de plus de 7 jours sous \`~/dev\`, en AFFICHANT ce qu'elle ferait, sans rien supprimer. Puis la version qui supprime, en gérant les espaces dans les noms.
`,

  text: `## Lire et filtrer du texte

En backend, "voir ce qui se passe" = lire du texte : logs, configs, sorties de commandes. Le terminal est un orchestre d'outils minuscules qui ne savent faire qu'une chose, mais parfaitement. Apprends à choisir le bon selon ce que tu veux : tout voir, défiler, le début, la fin, ou chercher un motif.

### Afficher : cat, less, head, tail

\`\`\`bash
cat config.json            # balance TOUT le contenu d'un coup (petit fichier)
less serveur.log           # ouvre un pager : flèches, /recherche, q pour quitter
head -n 20 access.log      # les 20 PREMIÈRES lignes
tail -n 20 access.log      # les 20 DERNIÈRES lignes
tail -f serveur.log        # SUIT le fichier en temps réel (-f = follow)
\`\`\`

\`cat\` sur un fichier de 500 000 lignes va inonder ton terminal — utilise \`less\`. \`tail -f\` est l'outil pour regarder un log défiler pendant que ton serveur tourne ; \`Ctrl+C\` pour arrêter.

### grep : chercher un motif

\`grep\` filtre les lignes qui matchent. C'est l'outil que tu vas le plus utiliser.

\`\`\`bash
grep "ERROR" serveur.log              # lignes contenant ERROR
grep -i "error" serveur.log           # -i = insensible à la casse
grep -n "TODO" src/index.ts           # -n = affiche le numéro de ligne
grep -r "useState" src/               # -r = récursif dans tout un dossier
grep -v "DEBUG" serveur.log           # -v = INVERSE : lignes SANS "DEBUG"
grep -c "404" access.log              # -c = COMPTE les lignes qui matchent
grep -A 3 "Exception" serveur.log     # -A 3 = la ligne + 3 lignes APRÈS (contexte)
\`\`\`

Combine : \`grep -rin "todo" src/\` = cherche "todo" partout dans \`src\`, insensible à la casse, avec numéros de ligne.

### grep avec des expressions régulières

\`\`\`bash
grep -E "^[0-9]+" data.txt            # -E = regex étendue ; lignes commençant par un chiffre
grep -E "(error|fatal|panic)" log     # un de ces 3 mots
grep -oE "[0-9]{1,3}(\\.[0-9]{1,3}){3}" log   # -o = n'affiche QUE l'IP matchée
\`\`\`

\`-o\` ne sort que la partie qui matche, pas la ligne entière. Idéal pour extraire des IPs, des emails, des dates.

### wc : compter

\`\`\`bash
wc -l access.log           # nombre de LIGNES
wc -w article.md           # nombre de mots
grep "404" access.log | wc -l   # combien de 404 ? (classique)
\`\`\`

### Le combo qui résume tout

\`\`\`bash
# "Combien d'erreurs uniques dans le dernier million de lignes de log ?"
tail -n 1000000 serveur.log | grep "ERROR" | wc -l
\`\`\`

⚠️ **Pièges**

- **\`grep\` sans quotes** : \`grep ERROR *.log\` peut casser si un fichier contient un caractère spécial, et un motif avec espace (\`grep two words\`) sera mal interprété. Toujours quoter le motif : \`grep "two words"\`.
- Les **regex grep** par défaut sont "basic" : \`+\`, \`?\`, \`|\` ne sont PAS spéciaux sans \`-E\` (ou faut les échapper). En cas de doute, \`-E\` (regex étendue).
- \`cat fichier_enorme\` fige ton terminal. \`less\` pagine, \`head\`/\`tail\` échantillonnent.
- \`tail -f\` ne s'arrête jamais seul. C'est normal, \`Ctrl+C\`.
- \`grep -r\` parcourt AUSSI \`node_modules\` et \`.git\` si tu pointes sur la racine du projet : ajoute \`--exclude-dir=node_modules\` ou cible \`src/\`.

### À écrire dans ton carnet

> Avec un access log Nginx, écris UNE ligne qui compte le nombre de requêtes ayant renvoyé un code 5xx. Puis une variante qui affiche les 10 dernières lignes contenant "POST", avec leur numéro de ligne.
`,

  permissions: `## Les permissions Unix

Sur un serveur partagé, "qui a le droit de faire quoi" n'est pas une option : c'est gravé dans chaque fichier. Comprendre les permissions, c'est arrêter de subir les "Permission denied" et les "ça marche en local mais pas en prod". C'est aussi la première couche de sécurité que tu déploieras toi-même.

### Le modèle : 3 catégories × 3 droits

Chaque fichier appartient à un **user** (owner) et un **group**. Les permissions se lisent en 3 blocs : **u**ser, **g**roup, **o**ther.

\`\`\`
-rwxr-xr--   1 erwin staff  ...  deploy.sh
 │└┬┘└┬┘└┬┘
 │ u  g  o
 │
 type (- fichier, d dossier, l lien)
\`\`\`

- \`r\` (read = 4) : lire le fichier / lister le dossier.
- \`w\` (write = 2) : modifier le fichier / créer-supprimer dans le dossier.
- \`x\` (execute = 1) : exécuter le fichier / **traverser** le dossier (entrer dedans).

Ici : owner = \`rwx\` (tout), group = \`r-x\` (lire + exécuter), other = \`r--\` (lire seulement).

### chmod symbolique : lisible

\`\`\`bash
chmod +x deploy.sh           # ajoute le droit d'exécution (à tous)
chmod u+x deploy.sh          # x pour le owner seulement
chmod g-w fichier            # retire write au groupe
chmod o-rwx secret.env       # retire TOUT aux "others" (les inconnus)
chmod u=rw,go= fichier       # owner lit/écrit, groupe et autres : rien
\`\`\`

### chmod octal : rapide

Chaque bloc est un chiffre de 0 à 7 (somme de r=4, w=2, x=1).

\`\`\`
rwx = 4+2+1 = 7
rw- = 4+2   = 6
r-x = 4+0+1 = 5
r-- = 4     = 4
\`\`\`

\`\`\`bash
chmod 755 deploy.sh     # rwxr-xr-x : owner tout, le reste lit+exécute (scripts, binaires)
chmod 644 config.json   # rw-r--r-- : owner lit/écrit, le reste lit (fichiers normaux)
chmod 600 ~/.ssh/id_ed25519   # rw------- : owner SEUL (clés privées, secrets)
chmod 700 ~/.ssh        # rwx------ : dossier privé (toi seul peux y entrer)
\`\`\`

Mémo : **755** pour ce qui s'exécute, **644** pour les fichiers, **600/700** pour les secrets.

### chown : changer le propriétaire

\`\`\`bash
sudo chown erwin fichier            # change l'owner
sudo chown erwin:staff fichier      # owner ET groupe
sudo chown -R www-data:www-data /var/www   # récursif, classique pour un site web
\`\`\`

### umask : les permissions par défaut

\`umask\` définit ce qui est **retiré** aux nouveaux fichiers. \`umask 022\` (défaut courant) → fichiers créés en 644, dossiers en 755. Tu n'y touches que rarement, mais sache que c'est lui qui explique pourquoi un fichier neuf n'est pas exécutable.

🔒 **Réflexe sécu**

- **Clés SSH et secrets en 600.** SSH REFUSE d'utiliser une clé privée lisible par d'autres (\`Permissions 0644 are too open\`). C'est une feature, pas un bug.
- **Méfie-toi du \`chmod 777\`.** "Ça résout le permission denied" — oui, en ouvrant le fichier au monde entier en lecture/écriture/exécution. C'est le réflexe paresseux qui crée les failles. Donne le droit minimal nécessaire (principe de moindre privilège).
- **SUID/SGID (recon défensive).** Un bit \`s\` (\`-rwsr-xr-x\`) fait tourner le binaire avec les droits du *propriétaire*, pas de l'appelant. En audit de TA machine, lister les binaires SUID est sain : \`find / -perm -4000 -type f 2>/dev/null\`. Un SUID inattendu sur un binaire bizarre = signal d'alerte. Reste sur ta propre machine : scanner un système qui n'est pas le tien sort du cadre légal.

⚠️ **Pièges**

- \`chmod -R 777\` sur un projet = trou de sécu + Git qui voit tous les modes changer. Ne le fais jamais "pour débloquer".
- Sur un **dossier**, sans \`x\` tu ne peux pas y entrer même avec \`r\`. \`r\` sans \`x\` = tu vois les noms mais ne peux rien ouvrir.
- \`chmod 644 script.sh\` rend ton script non exécutable — puis \`./script.sh\` → "Permission denied". Il faut le \`x\`.
- \`chown\` demande presque toujours \`sudo\` (tu ne peux pas donner TON fichier à quelqu'un d'autre sans privilèges).

### À écrire dans ton carnet

> Pour ces 3 fichiers, donne le \`chmod\` octal idéal : (1) un script de déploiement, (2) un \`.env\` contenant des secrets, (3) une clé privée SSH. Justifie chaque choix en une phrase.
`,

  "pipes-redirect": `## Pipes et redirections

C'est LA mécanique qui transforme une poignée de petites commandes en machine d'usinage de données. La philosophie Unix : chaque outil fait UNE chose ; tu les branches en chaîne avec un tuyau. Maîtrise les pipes et les redirections et tu écris en une ligne ce que d'autres font en 30 lignes de script.

### Les 3 flux standards

Chaque processus a 3 canaux numérotés :

\`\`\`
 0  stdin   (entrée)        ← ce qu'on lui donne
 1  stdout  (sortie)        → résultat normal
 2  stderr  (erreurs)       → messages d'erreur
\`\`\`

Comprendre ces numéros = comprendre toutes les redirections.

### Rediriger la sortie vers un fichier

\`\`\`bash
echo "hello" > fichier.txt      # > ÉCRASE le fichier (truncate puis écrit)
echo "world" >> fichier.txt     # >> AJOUTE à la fin (append)
ls -lah > listing.txt           # capture la sortie dans un fichier
\`\`\`

### Le pipe | : brancher des commandes

Le pipe envoie le **stdout** de gauche dans le **stdin** de droite.

\`\`\`bash
cat access.log | grep "404" | wc -l
#  ↑ contenu      ↑ filtre     ↑ compte
# = "combien de 404 dans ce log ?"

ps aux | grep node               # tous les process, on garde les "node"
history | grep git | tail -20    # mes 20 dernières commandes git
\`\`\`

### Gérer stderr (le canal 2)

\`\`\`bash
commande 2> erreurs.log          # envoie SEULEMENT les erreurs dans un fichier
commande > sortie.log 2>&1       # stdout dans le fichier ET stderr AU MÊME ENDROIT
commande 2>/dev/null             # JETTE les erreurs (le trou noir)
commande &>/dev/null             # jette TOUT (stdout + stderr), bash moderne
\`\`\`

\`2>&1\` se lit "redirige le canal 2 vers là où pointe le canal 1". \`/dev/null\` est le trou noir : tout ce qu'on y envoie disparaît.

### tee : voir ET enregistrer en même temps

\`\`\`bash
npm run build | tee build.log            # affiche À L'ÉCRAN et écrit dans build.log
npm run build 2>&1 | tee build.log       # capture AUSSI les erreurs
echo "config" | sudo tee /etc/app.conf   # astuce : écrire dans un fichier root via sudo
\`\`\`

\`tee\` duplique le flux : un vers l'écran, un vers le fichier. La dernière ligne est l'astuce classique pour écrire dans un fichier protégé (parce que \`sudo echo > /etc/...\` ne marche PAS — la redirection est faite par TON shell non-root).

### Mini-démo commentée

\`\`\`bash
# Top 5 des IPs qui frappent le plus le serveur, en une ligne
cat access.log \\
  | grep -oE "^[0-9]+(\\.[0-9]+){3}" \\
  | sort \\
  | uniq -c \\
  | sort -rn \\
  | head -5
#   → extrait l'IP, trie, compte les doublons, retrie par nombre, garde le top 5
\`\`\`

⚠️ **Pièges**

- **\`>\` écrase sans prévenir.** \`commande > important.txt\` sur un fichier non vide = contenu perdu. \`>>\` pour ajouter.
- **L'ordre de \`> fichier 2>&1\` compte.** \`2>&1 > fichier\` n'envoie PAS les erreurs dans le fichier (2 part vers l'ancien stdout = l'écran, AVANT que 1 ne soit redirigé). Toujours \`> fichier 2>&1\` dans cet ordre.
- **\`sudo cmd > /root/x\` échoue** : la redirection est exécutée par ton shell (non-root). Utilise \`| sudo tee /root/x > /dev/null\`.
- **Un pipe lance un sous-shell.** \`echo x | read VAR\` ne remplit pas \`VAR\` dans ton shell courant (le \`read\` tourne dans le sous-shell du pipe). Piège classique en scripting.
- **grep avale stdin du pipe précédent**, mais une commande qui n'attend pas stdin (genre \`ls | rm\`) ne fait rien d'utile : tout ne se branche pas à tout.

### À écrire dans ton carnet

> Écris une commande qui lance \`npm test\`, affiche tout à l'écran ET enregistre stdout + stderr dans \`test.log\`. Puis une variante qui ne garde QUE les lignes contenant "FAIL" dans un fichier, sans rien afficher.
`,

  env: `## Variables d'environnement

Les variables d'environnement sont la "mémoire ambiante" de ton shell et de chaque programme qu'il lance : qui es-tu (\`$USER\`), où est ton home (\`$HOME\`), où le système cherche les commandes (\`$PATH\`), et tes secrets d'app (\`$DATABASE_URL\`). Comprendre comment elles se propagent, c'est arrêter de te demander pourquoi "ma commande n'est pas trouvée" ou "mon \`.env\` n'est pas lu".

### Lire et créer une variable

\`\`\`bash
echo "$HOME"            # /home/erwin
echo "$USER"            # erwin
MA_VAR="bonjour"        # crée une variable de SHELL (locale, pas exportée)
echo "$MA_VAR"          # bonjour
\`\`\`

⚠️ **Pas d'espaces autour du \`=\`** : \`MA_VAR = "x"\` est interprété comme une commande \`MA_VAR\` avec des arguments. C'est \`MA_VAR="x"\`, collé.

### Shell variable vs variable d'environnement : export

\`\`\`bash
MA_VAR="local"          # visible dans CE shell seulement
export MA_VAR="global"  # visible aussi dans les processus ENFANTS (node, scripts...)
export NODE_ENV=production
\`\`\`

Sans \`export\`, un programme lancé depuis ton shell ne verra PAS la variable. C'est exactement pourquoi un script enfant ne "voit" pas une variable que tu as juste assignée sans exporter.

### Variable juste pour une commande

\`\`\`bash
NODE_ENV=production node server.js    # NODE_ENV n'existe QUE pour cette commande
\`\`\`

C'est l'idiome propre : pas de pollution de ton environnement, la variable meurt avec la commande.

### $PATH : où le shell cherche les commandes

Quand tu tapes \`node\`, le shell parcourt les dossiers listés dans \`$PATH\`, dans l'ordre, et prend le premier \`node\` trouvé.

\`\`\`bash
echo "$PATH"
# /usr/local/bin:/usr/bin:/bin:/home/erwin/.local/bin

which node              # OÙ est le node qui sera exécuté ?
# /usr/local/bin/node

type -a node            # TOUS les node dans le PATH (utile en cas de doublon)
\`\`\`

Ajouter un dossier au PATH (souvent dans \`.bashrc\`/\`.zshrc\`) :

\`\`\`bash
export PATH="$HOME/.local/bin:$PATH"   # AJOUTE au début, priorité à ton dossier
\`\`\`

### Les fichiers de config : .bashrc, .profile, .zshrc

- \`~/.bashrc\` : exécuté à chaque shell **interactif** bash. C'est là que vont tes alias, exports, fonctions.
- \`~/.zshrc\` : pareil pour zsh (le shell par défaut sur macOS).
- \`~/.profile\` / \`~/.bash_profile\` : shells de **login** (SSH, session).

\`\`\`bash
alias gs="git status"
alias ll="ls -lah"
export EDITOR=nano
\`\`\`

Après édition : \`source ~/.bashrc\` (ou \`. ~/.bashrc\`) pour recharger sans rouvrir le terminal.

### Charger un fichier .env dans ton shell

\`\`\`bash
set -a              # tout ce qui suit sera exporté automatiquement
source .env         # charge le fichier (format CLÉ=valeur)
set +a              # on coupe l'auto-export
\`\`\`

🔒 **Réflexe sécu**

- **Ne commit JAMAIS un \`.env\`.** Mets-le dans \`.gitignore\` dès la création du repo. Un secret poussé sur GitHub est compromis pour toujours (même après suppression : il reste dans l'historique).
- **Les variables d'env d'un process sont lisibles** par le même user via \`/proc/<pid>/environ\` (Linux) ou \`ps eww\`. Pour des secrets très sensibles, préfère un fichier en \`chmod 600\` chargé à la volée plutôt qu'un export global persistant.
- **\`env\` et \`printenv\` dumpent tout** : pratique pour débugger, mais ne colle jamais le résultat dans un ticket/issue public sans masquer les secrets.

⚠️ **Pièges**

- **Variable non quotée = word splitting + glob.** \`rm $FICHIER\` avec \`FICHIER="a b"\` supprime \`a\` et \`b\`. Toujours \`rm "$FICHIER"\`.
- **\`$PATH\` cassé = "command not found" partout.** Si tu fais \`PATH="/mon/dossier"\` (en écrasant au lieu d'ajouter \`:$PATH\`), plus aucune commande système ne marche. Toujours \`export PATH="...:$PATH"\`.
- **Modifier \`.bashrc\` n'agit pas rétroactivement** : il faut \`source\` ou rouvrir le terminal.
- **Variable d'env vs argument** : un programme ne lit une variable que s'il a été codé pour. \`export DEBUG=1\` ne fait rien si l'app n'écoute pas \`DEBUG\`.

### À écrire dans ton carnet

> Explique en 2 phrases la différence entre \`MA_VAR=x\` et \`export MA_VAR=x\` vis-à-vis d'un script enfant. Puis écris la ligne pour ajouter \`~/scripts\` à ton PATH de façon persistante.
`,

  scripting: `## Écrire un script bash robuste

Un script bash "qui marche sur ta machine un mardi" et un script bash robuste sont deux animaux différents. Le second part du principe que **tout peut échouer** : un fichier manque, une variable est vide, une commande dans un pipe plante. Le strict mode \`set -euo pipefail\` est la ceinture de sécurité que tout script sérieux porte dès la première ligne.

### Le squelette d'un script propre

\`\`\`bash
#!/usr/bin/env bash
#
# backup.sh — archive un dossier en .tar.gz horodaté
#
set -euo pipefail        # strict mode (détaillé plus bas)
IFS=$'\\n\\t'              # découpage sûr (espaces dans les noms gérés)

# --- Variables ---
readonly SOURCE="\${1:-}"            # 1er argument, vide si absent
readonly DEST="\${2:-./backups}"     # 2e argument, défaut ./backups
readonly STAMP="$(date +%Y%m%d-%H%M%S)"

# --- Fonctions ---
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
  echo "OK → $archive ($(du -h "$archive" | cut -f1))"
}

main "$@"
\`\`\`

### Le shebang : #!/usr/bin/env bash

La 1re ligne dit au système quel interpréteur utiliser. \`#!/usr/bin/env bash\` est préféré à \`#!/bin/bash\` parce qu'il cherche bash dans le \`$PATH\` (portable entre Linux et macOS, où bash peut être ailleurs).

### Le strict mode, ligne par ligne

\`\`\`bash
set -e          # errexit : stoppe le script à la 1re commande qui échoue
set -u          # nounset : plante si on utilise une variable NON définie
set -o pipefail # un pipe échoue si N'IMPORTE quelle commande du pipe échoue
\`\`\`

\`set -euo pipefail\` combine les trois. Sans \`pipefail\`, \`grep x fichier | sort\` réussit même si \`grep\` échoue (seul le code du dernier maillon compte). Avec, le pipe entier remonte l'erreur.

### Variables et substitution

\`\`\`bash
nom="Erwin"
echo "Bonjour $nom"                 # interpolation
echo "Date: $(date +%H:%M)"         # $(...) = command substitution
fichiers=$(ls *.txt)                # capture une sortie
chemin="\${HOME}/dev"                # \${...} pour délimiter clairement
\`\`\`

### Conditions : [[ ]] est ton ami

\`\`\`bash
if [[ -f "$fichier" ]]; then echo "fichier existe"; fi
if [[ -d "$dossier" ]]; then echo "dossier existe"; fi
if [[ -z "$var" ]]; then echo "var vide"; fi          # -z = zero length
if [[ -n "$var" ]]; then echo "var non vide"; fi      # -n = non-empty
if [[ "$a" == "$b" ]]; then echo "égaux"; fi
if [[ "$n" -gt 10 ]]; then echo "plus grand que 10"; fi
\`\`\`

### Boucles

\`\`\`bash
for f in *.log; do
  echo "Traite $f"
done

while read -r ligne; do
  echo "→ $ligne"
done < fichier.txt          # lit ligne par ligne, -r préserve les backslashes
\`\`\`

🔒 **Réflexe sécu**

- **Quote TOUTES tes variables** dans un script : \`"$var"\`. Une variable non quotée contrôlée par un attaquant (nom de fichier, argument) peut injecter des options ou des mots. C'est la base de l'injection en shell.
- **Jamais \`eval\` sur de l'input externe.** \`eval "$user_input"\` = exécution de code arbitraire. Si tu crois avoir besoin d'\`eval\`, tu as presque toujours une meilleure solution (tableaux, \`case\`).
- **Valide les chemins avant d'agir** (\`[[ -d "$dir" ]]\`), surtout avant un \`rm -rf "$dir"/\`. Combiné à \`set -u\`, ça évite le \`rm -rf /\` sur variable vide.

⚠️ **Pièges**

- **\`[ ]\` (test POSIX) vs \`[[ ]]\` (bash).** \`[ $a == $b ]\` casse si \`$a\` est vide ou contient des espaces ; \`[[ ]]\` est plus sûr (pas de word splitting dedans) et gère \`&&\`, \`||\`, \`=~\` (regex). En bash, préfère \`[[ ]]\`.
- **\`set -e\` a des angles morts.** Il n'arrête PAS sur une commande dans un \`if\`, dans un \`||\`, ou en partie gauche d'un pipe sans \`pipefail\`. Ne t'y fie pas aveuglément.
- **\`local\` réinitialise \`set -e\`** : \`local x="$(commande_qui_echoue)"\` ne déclenche pas errexit (le code de \`local\` masque celui de la commande). Sépare déclaration et affectation pour les commandes critiques.
- **Oublier \`-r\` dans \`read\`** mange les backslashes des données. \`while read -r ligne\` quasi toujours.

### À écrire dans ton carnet

> Reprends le squelette \`backup.sh\` ci-dessus et explique, ligne par ligne, ce que fait chaque maillon du strict mode. Puis ajoute une vérification : refuser de tourner si \`tar\` n'est pas installé (\`command -v tar\`).
`,

  args: `## Arguments et entrée utilisateur

Un script sans arguments est un script figé. Les arguments le rendent réutilisable : un seul \`deploy.sh\` qui prend l'environnement en paramètre vaut dix scripts copiés-collés. Bash expose les arguments via des variables spéciales, et \`getopts\` te donne de vraies options façon CLI (\`-v\`, \`-o fichier\`).

### Les variables d'arguments

\`\`\`bash
#!/usr/bin/env bash
echo "Nom du script : $0"
echo "1er argument  : $1"
echo "2e argument   : $2"
echo "Nombre d'args : $#"
echo "Tous les args : $@"
\`\`\`

\`\`\`bash
$ ./demo.sh alpha beta
Nom du script : ./demo.sh
1er argument  : alpha
2e argument   : beta
Nombre d'args : 2
Tous les args : alpha beta
\`\`\`

### "$@" vs "$*" — la nuance qui sauve

\`\`\`bash
for a in "$@"; do echo "[$a]"; done   # CHAQUE argument séparé (presque toujours ça)
for a in "$*"; do echo "[$a]"; done   # TOUS collés en UNE seule chaîne
\`\`\`

Avec les arguments \`"un deux" trois\` : \`"$@"\` donne \`[un deux]\` puis \`[trois]\` (correct) ; \`"$*"\` donne \`[un deux trois]\` (tout collé). Retiens : **toujours \`"$@"\` entre guillemets** pour préserver les arguments tels quels.

### Valeurs par défaut et obligation

\`\`\`bash
ENV="\${1:-dev}"          # si $1 absent/vide → "dev"
PORT="\${2:?port requis}" # si $2 absent → message d'erreur + sortie
NAME="\${3:-$USER}"       # défaut = valeur d'une autre variable
\`\`\`

### Vérifier le nombre d'arguments

\`\`\`bash
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <fichier>" >&2
  exit 1
fi
\`\`\`

### read : demander à l'utilisateur

\`\`\`bash
read -r -p "Nom du projet : " projet
echo "Tu as choisi : $projet"

read -r -s -p "Mot de passe : " pass    # -s = silencieux (n'affiche pas la saisie)
echo

read -r -p "Confirmer ? [o/N] " rep
[[ "$rep" =~ ^[oO]$ ]] || { echo "Annulé."; exit 0; }
\`\`\`

\`-p\` affiche un prompt, \`-r\` préserve les backslashes, \`-s\` masque (mots de passe).

### getopts : des vraies options de CLI

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

verbose=0
output=""

usage() { echo "Usage: $0 [-v] [-o fichier] <input>" >&2; exit 1; }

while getopts ":vo:h" opt; do
  case "$opt" in
    v) verbose=1 ;;
    o) output="$OPTARG" ;;          # le ':' après 'o' dit que -o prend une valeur
    h) usage ;;
    \\?) echo "Option inconnue: -$OPTARG" >&2; usage ;;
    :)  echo "Option -$OPTARG attend une valeur" >&2; usage ;;
  esac
done
shift $((OPTIND - 1))               # retire les options traitées, laisse les args

input="\${1:-}"
[[ -n "$input" ]] || usage

[[ $verbose -eq 1 ]] && echo "Mode verbeux ON"
echo "Input=$input Output=\${output:-stdout}"
\`\`\`

\`\`\`bash
$ ./tool.sh -v -o out.txt data.csv
Mode verbeux ON
Input=data.csv Output=out.txt
\`\`\`

\`getopts\` parse les options courtes standard, gère les valeurs (\`o:\`), et \`shift $((OPTIND-1))\` laisse les arguments positionnels restants dans \`$1\`, \`$2\`...

⚠️ **Pièges**

- **\`$@\` sans guillemets** subit le word splitting : un argument \`"a b"\` devient deux. Toujours \`"$@"\`.
- **\`$10\` n'existe pas** comme tu crois : bash lit \`$1\` suivi de \`0\`. Pour le 10e argument : \`\${10}\`.
- **\`read var\` mange les espaces de tête/fin** et interprète les backslashes sans \`-r\`. Réflexe : \`read -r\`.
- **\`getopts\` ne gère QUE les options courtes** (\`-v\`), pas les longues (\`--verbose\`). Pour les longues, il faut parser à la main ou un autre outil.
- **Oublier \`shift $((OPTIND-1))\`** : après \`getopts\`, tes arguments positionnels sont encore "cachés" derrière les options.

### À écrire dans ton carnet

> Écris un mini-script \`greet.sh\` qui prend un nom en argument (défaut : \`$USER\`), accepte une option \`-u\` pour mettre le nom en MAJUSCULES, et affiche "Bonjour <nom>". Gère le cas où aucun nom n'est fourni.
`,

  "exit-codes": `## Codes de retour et gestion d'erreurs

Chaque commande Unix laisse un reçu : un **code de sortie**. 0 = "tout va bien", tout le reste = "il y a eu un problème". Ce nombre invisible est le système nerveux du shell : c'est lui qui décide si \`&&\` continue, si ton \`if\` est vrai, si ton script s'arrête. Sans le maîtriser, tes scripts échouent en silence et continuent à dérouler comme si de rien n'était — le pire scénario.

### Lire le dernier code de retour

\`\`\`bash
ls /existe
echo $?          # 0  → succès

ls /nexiste-pas
echo $?          # 2  → erreur (le code exact dépend de la commande)
\`\`\`

\`$?\` contient le code de la **dernière** commande. Lis-le tout de suite (la commande suivante l'écrase).

### Convention des codes

\`\`\`
0        succès
1        erreur générique
2        mauvais usage (arguments)
126      trouvé mais pas exécutable (permission)
127      command not found
130      interrompu par Ctrl+C (128 + signal 2)
\`\`\`

Dans tes scripts, \`exit 0\` pour succès, \`exit 1\` (ou un code dédié) pour une erreur.

### Chaînage conditionnel : && et ||

\`\`\`bash
npm run build && npm run deploy        # deploy SEULEMENT si build réussit
npm test || echo "Tests en échec !"    # message SEULEMENT si test échoue
mkdir -p logs && cd logs               # enchaîne tant que ça réussit
\`\`\`

\`&&\` = "et si succès". \`||\` = "ou si échec". C'est de la logique sur les codes de retour.

### set -e : s'arrêter à la première erreur

\`\`\`bash
set -e
commande_qui_echoue      # le script s'arrête ICI
echo "jamais affiché"
\`\`\`

Sans \`set -e\`, un script continue après une erreur — souvent en empilant les dégâts. Avec, il s'arrête net. (Rappel des angles morts : voir le skill scripting.)

### trap : nettoyer quoi qu'il arrive

\`trap\` exécute une commande quand le script reçoit un signal ou se termine. Indispensable pour nettoyer les fichiers temporaires même en cas de crash.

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

tmp="$(mktemp)"                          # fichier temporaire
trap 'rm -f "$tmp"' EXIT                 # SERA exécuté à la sortie, quoi qu'il arrive

echo "données" > "$tmp"
# ... traitement ...
# même si ça plante ici, le trap nettoie "$tmp"
\`\`\`

Signaux utiles : \`EXIT\` (toute sortie), \`INT\` (Ctrl+C), \`TERM\` (kill), \`ERR\` (sur erreur, avec \`set -e\`).

### Mini-script : déploiement avec gestion d'erreurs

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

readonly LOCK="/tmp/deploy.lock"

cleanup() { rm -f "$LOCK"; }
trap cleanup EXIT                        # libère le lock à la sortie

fail() { echo "ÉCHEC: $*" >&2; exit 1; }

[[ -e "$LOCK" ]] && fail "déploiement déjà en cours"
touch "$LOCK"

npm ci            || fail "install raté"
npm run build     || fail "build raté"
npm run deploy    || fail "deploy raté"

echo "Déploiement OK"
\`\`\`

🔒 **Réflexe sécu** : un \`trap ... EXIT\` qui nettoie un fichier temporaire évite de laisser traîner des secrets sur le disque après un crash. Crée toujours tes fichiers sensibles avec \`mktemp\` (nom imprévisible, dans un dossier protégé) plutôt qu'un \`/tmp/monfichier\` fixe qu'un autre user pourrait pré-créer ou lire.

⚠️ **Pièges**

- **\`$?\` est volatil** : \`echo "ok"; echo $?\` te donne le code du \`echo\`, pas de ta vraie commande. Capture-le immédiatement : \`code=$?\`.
- **\`set -e\` + commande dans \`if\`** : un échec dans la condition d'un \`if\` n'arrête PAS le script (c'est voulu, mais surprenant).
- **Un pipe masque les erreurs sans \`pipefail\`** : \`commande_qui_plante | tee log\` renvoie 0 (le code de \`tee\`). Active \`set -o pipefail\`.
- **\`exit\` sans code** renvoie le code de la dernière commande, pas forcément 0. Sois explicite : \`exit 0\`.
- **trap qui écrase un trap précédent** : un seul \`trap\` par signal. Si tu en poses deux sur \`EXIT\`, le second remplace le premier.

### À écrire dans ton carnet

> Explique la différence de comportement entre \`a && b\`, \`a || b\` et \`a ; b\` selon que \`a\` réussit ou échoue. Puis écris un \`trap\` qui supprime un fichier temporaire ET affiche "Interrompu" si l'utilisateur fait Ctrl+C.
`,

  "text-tools": `## Manipuler du texte en chirurgie (sed, awk, sort, uniq, cut)

\`grep\` filtre. Mais quand il faut **transformer** (remplacer, extraire une colonne, calculer une somme, dédupliquer), tu passes à l'artillerie : \`sed\` (édition de flux), \`awk\` (mini-langage par colonnes), plus le trio \`sort\`/\`uniq\`/\`cut\`. Ce sont tes scalpels pour parser des logs, nettoyer des CSV, faire de la chirurgie sur du texte sans ouvrir d'éditeur.

### cut : extraire des colonnes

\`\`\`bash
cut -d',' -f1,3 data.csv        # colonnes 1 et 3, séparées par des virgules
cut -d':' -f1 /etc/passwd       # 1re colonne (les noms d'utilisateurs)
echo "a:b:c" | cut -d':' -f2    # b
\`\`\`

\`-d\` = délimiteur, \`-f\` = champ(s).

### sort et uniq : trier et dédupliquer

\`\`\`bash
sort fichier.txt                # tri alphabétique
sort -n nombres.txt             # tri NUMÉRIQUE (sinon "10" < "9")
sort -rn nombres.txt            # numérique inversé (décroissant)
sort -u fichier.txt             # tri + supprime les doublons

uniq doublons.txt               # supprime les doublons ADJACENTS (d'où le sort avant)
sort access.log | uniq -c       # compte les occurrences de chaque ligne
sort access.log | uniq -c | sort -rn   # classement par fréquence
\`\`\`

\`uniq\` ne déduplique que des lignes **consécutives** → on \`sort\` toujours avant.

### sed : remplacer dans un flux

\`\`\`bash
sed 's/foo/bar/' fichier.txt          # remplace la 1re occurrence par ligne
sed 's/foo/bar/g' fichier.txt         # g = toutes les occurrences
sed 's/foo/bar/gi' fichier.txt        # i = insensible à la casse
sed -n '10,20p' fichier.txt           # affiche SEULEMENT les lignes 10 à 20
sed '/^#/d' config.conf               # SUPPRIME les lignes commençant par #
sed -E 's/[0-9]+/NUM/g' log.txt       # -E = regex étendue
\`\`\`

\`s/motif/remplacement/flags\` est le pattern à connaître. \`sed -i\` modifie le fichier **en place** (attention, voir pièges).

### awk : le couteau suisse des colonnes

\`awk\` découpe chaque ligne en champs (\`$1\`, \`$2\`...) et exécute du code dessus.

\`\`\`bash
awk '{ print $1 }' access.log              # 1re colonne de chaque ligne
awk '{ print $1, $4 }' access.log          # colonnes 1 et 4
awk -F',' '{ print $2 }' data.csv          # -F',' = séparateur virgule
awk '$3 > 100 { print $1 }' data.txt       # filtre : lignes où colonne 3 > 100
awk '{ sum += $1 } END { print sum }' nombres.txt   # SOMME de la 1re colonne
awk 'NR==1 { next } { print }' data.csv    # saute la 1re ligne (en-tête CSV)
\`\`\`

\`$0\` = ligne entière, \`$1..$n\` = champs, \`NR\` = numéro de ligne, \`NF\` = nombre de champs, \`END { }\` = après la dernière ligne.

### Le combo réel : résumer un access log

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
log="\${1:?Usage: $0 <access.log>}"

echo "== Total requêtes =="
wc -l < "$log"

echo "== Top 10 IPs =="
awk '{ print $1 }' "$log" | sort | uniq -c | sort -rn | head -10

echo "== Top 10 URLs =="
awk '{ print $7 }' "$log" | sort | uniq -c | sort -rn | head -10

echo "== Répartition status codes =="
awk '{ print $9 }' "$log" | sort | uniq -c | sort -rn
\`\`\`

Chaque ligne : \`awk\` extrait la colonne, \`sort\` regroupe, \`uniq -c\` compte, \`sort -rn\` classe, \`head\` garde le top. C'est l'idiome universel "compter par fréquence".

⚠️ **Pièges**

- **\`sed -i\` modifie le fichier SANS sauvegarde.** Une regex foireuse détruit le fichier. Teste d'abord sans \`-i\` (affichage), puis \`sed -i.bak 's/.../.../' f\` qui garde un \`.bak\`. NB : \`sed -i\` n'a PAS la même syntaxe sur macOS (BSD) que Linux (GNU) — sur macOS il faut \`sed -i '' '...'\`.
- **\`uniq\` sans \`sort\` avant** ne déduplique que les lignes adjacentes : tu crois avoir dédupliqué, il reste des doublons.
- **\`sort\` est alphabétique par défaut** : \`"100"\` arrive avant \`"9"\`. Pour des nombres : \`sort -n\`.
- **Les regex de \`sed\` sont "basic"** par défaut (\`+\`, \`?\`, \`(\` à échapper) : utilise \`-E\` pour la syntaxe étendue.
- **\`cut\` ne gère pas les multi-espaces** comme délimiteur ; pour des colonnes séparées par des espaces variables, \`awk\` est plus robuste.

### À écrire dans ton carnet

> À partir d'un CSV \`prix.csv\` (colonnes : produit,prix,quantité, avec une ligne d'en-tête), écris UNE commande \`awk\` qui calcule le chiffre d'affaires total (somme de prix×quantité), en ignorant la ligne d'en-tête.
`,

  processes: `## Gérer les processus

Un programme qui tourne = un **processus**, avec un identifiant unique (PID). Ton serveur Node, ton \`npm run dev\`, ton éditeur : autant de processus que le système jongle. Savoir les lister, voir ce qui mange ton CPU/RAM, et en tuer un proprement, c'est la différence entre "je redémarre la machine" et "je règle le problème en 10 secondes".

### Lister les processus

\`\`\`bash
ps aux                          # TOUS les processus du système (snapshot)
ps aux | grep node              # filtre sur node
pgrep -fl node                  # liste les PID + commandes qui matchent "node"
\`\`\`

Colonnes utiles de \`ps aux\` : \`USER\`, \`PID\`, \`%CPU\`, \`%MEM\`, \`COMMAND\`.

### top / htop : le moniteur en temps réel

\`\`\`bash
top                             # moniteur live (q pour quitter)
htop                            # version améliorée (couleurs, scroll, tri à la souris)
\`\`\`

Dans \`top\` : tape \`M\` pour trier par mémoire, \`P\` par CPU, \`k\` pour tuer un process. \`htop\` (à installer) est plus agréable : F9 pour kill, F6 pour trier.

### Tuer un processus

\`\`\`bash
kill 12345                      # envoie SIGTERM (demande polie de s'arrêter)
kill -9 12345                   # SIGKILL (brutal, non négociable, dernier recours)
kill -15 12345                  # SIGTERM explicite (= kill simple)
pkill -f "node server.js"       # tue par nom de commande
killall node                    # tue TOUS les process "node" (attention !)
\`\`\`

**Toujours \`kill\` (SIGTERM) d'abord.** Il laisse le programme se fermer proprement (sauver, fermer les connexions). \`kill -9\` (SIGKILL) coupe net : à n'utiliser que si le process est vraiment bloqué, car il peut laisser des fichiers corrompus ou des locks.

### Foreground, background, jobs

\`\`\`bash
npm run dev                     # tourne au PREMIER plan, occupe ton terminal
npm run dev &                   # & = lance en ARRIÈRE-plan, rend la main
jobs                            # liste les jobs de ce shell
fg %1                           # ramène le job 1 au premier plan
bg %1                           # relance le job 1 en arrière-plan
\`\`\`

- \`Ctrl+C\` : tue le process au premier plan.
- \`Ctrl+Z\` : le SUSPEND (le met en pause) → puis \`bg\` pour le relancer en fond, ou \`fg\` pour le reprendre.

### nohup : survivre à la fermeture du terminal

\`\`\`bash
nohup node server.js > server.log 2>&1 &
\`\`\`

Par défaut, fermer le terminal tue ses process enfants (signal SIGHUP). \`nohup\` les détache : le serveur continue après ta déconnexion SSH. \`> server.log 2>&1 &\` capture les sorties et lance en fond. (Pour de la vraie prod, on préfère \`systemd\` ou \`pm2\`, mais \`nohup\` dépanne.)

### Trouver et libérer un port occupé

\`\`\`bash
lsof -i :3000                   # quel process écoute sur le port 3000 ?
kill $(lsof -t -i :3000)        # tue ce process (-t = juste le PID)
\`\`\`

LE réflexe quand \`EADDRINUSE: port 3000 already in use\`.

🔒 **Réflexe sécu**

- **\`ps aux\` est aussi un outil de recon défensive** : sur TA machine ou un serveur que tu administres, repérer un process inconnu qui consomme du CPU ou écoute sur un port étrange est sain. Un process au nom anodin (\`[kworker]\`, \`cron\`) lancé depuis un chemin bizarre = signal à creuser.
- **Attention aux LOLBins** (Living-Off-the-Land Binaries) : des outils légitimes (\`curl\`, \`bash\`, \`nc\`) détournés pour de la malveillance. Voir un \`bash -i\` connecté à une IP externe dans \`ps\` n'est pas normal sur un serveur d'app.
- **\`kill -9\` à l'aveugle est dangereux** : tuer le mauvais PID (base de données, init) peut casser le système. Vérifie toujours QUI tu tues (\`ps -p <pid>\`) avant. Ne touche qu'à tes propres processus / tes propres machines : surveiller ou tuer des process sur un système qui n'est pas le tien sort du cadre légal.

⚠️ **Pièges**

- **\`kill -9\` ne laisse aucune chance de cleanup** : connexions non fermées, fichiers à moitié écrits. Réserve-le aux process zombies/bloqués.
- **\`killall\` est ambigu selon l'OS** : sur Linux il tue par nom, sur certains Unix il tue TOUT. Préfère \`pkill -f\` (plus précis sur la commande complète).
- **\`&\` seul ne survit pas à la fermeture du terminal** : il faut \`nohup\` ou \`disown\`.
- **Un \`grep\` se voit lui-même** : \`ps aux | grep node\` affiche aussi la ligne du \`grep node\`. Astuce : \`ps aux | grep '[n]ode'\` (la classe \`[n]\` empêche grep de matcher sa propre commande).

### À écrire dans ton carnet

> Ton \`npm run dev\` renvoie "port 3000 already in use". Écris la commande qui identifie le process coupable, puis celle qui le tue proprement (SIGTERM d'abord). Pourquoi éviter \`kill -9\` ici ?
`,

  ssh: `## SSH, scp et rsync : le travail à distance

Tes apps ne tournent pas sur ton laptop : elles vivent sur des VPS, des serveurs Hostinger/Render/Coolify. SSH est le tunnel chiffré qui te donne un terminal SUR cette machine distante, comme si tu y étais. \`scp\` et \`rsync\` transportent des fichiers dans ce tunnel. C'est le socle de tout déploiement, toute admin serveur, tout debug de prod.

### Se connecter

\`\`\`bash
ssh erwin@203.0.113.10              # user@host
ssh erwin@monserveur.com -p 2222    # -p si le port SSH n'est pas 22
ssh erwin@host "uptime"            # exécute UNE commande à distance puis se déconnecte
\`\`\`

### Les clés SSH : oublie les mots de passe

Une paire de clés = une privée (\`~/.ssh/id_ed25519\`, **jamais partagée**) + une publique (\`.pub\`, qu'on copie sur le serveur).

\`\`\`bash
ssh-keygen -t ed25519 -C "erwin@porterfield"   # génère une paire (ed25519 = moderne)
ssh-copy-id erwin@host                          # copie ta clé publique sur le serveur
ssh erwin@host                                  # désormais : connexion sans mot de passe
\`\`\`

\`ssh-copy-id\` ajoute ta clé publique dans le \`~/.ssh/authorized_keys\` du serveur. Ensuite, l'authentification se fait par cryptographie : plus de mot de passe à taper, plus de risque de brute-force.

### Le fichier ~/.ssh/config : des alias propres

\`\`\`
# ~/.ssh/config
Host prod
    HostName 203.0.113.10
    User erwin
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
\`\`\`

Puis simplement : \`ssh prod\`. Fini de retenir les IPs et les ports.

### scp : copier des fichiers

\`\`\`bash
scp fichier.txt erwin@host:~/             # local → distant (dans le home)
scp erwin@host:~/log.txt ./              # distant → local
scp -r dossier/ erwin@host:/var/www/      # -r pour un dossier entier
\`\`\`

La syntaxe distante est toujours \`user@host:chemin\`.

### rsync : la copie intelligente

\`rsync\` ne transfère que les **différences** : idéal pour synchroniser un gros dossier ou redéployer (il ne renvoie pas ce qui n'a pas changé).

\`\`\`bash
rsync -avz dist/ erwin@host:/var/www/app/
#       │││
#       ││└ z = compresse pendant le transfert
#       │└─ v = verbeux
#       └── a = mode archive (récursif + préserve permissions, dates, liens)

rsync -avz --delete dist/ erwin@host:/var/www/app/   # --delete = miroir exact (supprime côté distant ce qui n'est plus en local)
rsync -avzn dist/ host:/var/www/app/                  # n = DRY-RUN : montre sans rien faire
\`\`\`

### Mini-script de déploiement

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

readonly HOST="prod"                       # alias de ~/.ssh/config
readonly REMOTE_DIR="/var/www/app"

echo "Build..."
npm run build

echo "Dry-run (vérifie ce qui sera envoyé)..."
rsync -avzn --delete dist/ "$HOST:$REMOTE_DIR/"

read -r -p "Confirmer le déploiement ? [o/N] " ok
[[ "$ok" =~ ^[oO]$ ]] || { echo "Annulé."; exit 0; }

rsync -avz --delete dist/ "$HOST:$REMOTE_DIR/"
ssh "$HOST" "cd $REMOTE_DIR && systemctl restart app"
echo "Déployé."
\`\`\`

🔒 **Réflexe sécu**

- **Clé privée en 600, dossier ~/.ssh en 700.** SSH refuse une clé trop permissive (\`Permissions 0644 are too open\`). C'est volontaire — ne contourne pas en mettant 777.
- **Désactive l'auth par mot de passe sur le serveur** une fois tes clés en place (\`PasswordAuthentication no\` dans \`sshd_config\`) : ça ferme la porte au brute-force, l'attaque la plus courante sur le port 22.
- **Ne stocke jamais ta clé privée sur un serveur partagé ou dans un repo.** Une clé privée fuitée = accès total. Utilise une **passphrase** sur la clé (chiffre la clé au repos) + \`ssh-agent\` pour ne la taper qu'une fois par session.
- **Cadre légal** : tu ne te connectes qu'à des machines qui t'appartiennent ou pour lesquelles tu as une autorisation explicite. Tenter de se connecter à un serveur tiers (même "pour tester") est une intrusion, point.

⚠️ **Pièges**

- **\`rsync source/ dest\` vs \`rsync source dest\`** : le slash final sur la SOURCE change tout. \`source/\` copie le *contenu* de source dans dest ; \`source\` (sans slash) copie le *dossier* source DANS dest. Source de déploiements mal placés.
- **\`rsync --delete\` est destructeur** : il supprime côté distant tout ce qui n'est plus en local. Toujours un \`-n\` (dry-run) avant.
- **\`scp -r\` ne synchronise pas** : il recopie tout à chaque fois. Pour des transferts répétés, \`rsync\` est bien plus rapide.
- **Premier accès à un host** : SSH demande de confirmer l'empreinte (\`fingerprint\`). Ne tape pas \`yes\` mécaniquement sur une machine sensible — c'est ta protection contre le man-in-the-middle.

### À écrire dans ton carnet

> Explique en une phrase la différence entre \`rsync -avz dist/ host:/app\` et \`rsync -avz dist host:/app\`. Puis écris la commande qui synchronise \`dist/\` vers le serveur en mode miroir, mais en DRY-RUN d'abord.
`,

  cron: `## Automatiser avec cron

Tout ce que tu fais manuellement et régulièrement (sauvegarder, nettoyer, envoyer un rapport, renouveler un certificat) peut être confié à \`cron\` : un planificateur qui dort dans le système et réveille tes scripts à l'heure dite. C'est le "réveille-matin" du serveur. Le concept est simple ; les pièges (PATH, environnement minimal, chemins relatifs) font perdre des heures à ceux qui ne les connaissent pas.

### Éditer ses tâches

\`\`\`bash
crontab -e          # édite TA crontab (ouvre l'éditeur)
crontab -l          # liste tes tâches
crontab -r          # SUPPRIME toute ta crontab (attention, pas de confirmation)
\`\`\`

### La syntaxe des 5 champs

\`\`\`
* * * * *  commande
│ │ │ │ │
│ │ │ │ └─ jour de la semaine (0-7, 0 et 7 = dimanche)
│ │ │ └─── mois (1-12)
│ │ └───── jour du mois (1-31)
│ └─────── heure (0-23)
└───────── minute (0-59)
\`\`\`

\`\`\`bash
0 3 * * *        /home/erwin/backup.sh          # tous les jours à 3h00
*/15 * * * *     /home/erwin/check.sh           # toutes les 15 minutes
0 9 * * 1        /home/erwin/rapport.sh         # tous les lundis à 9h00
0 0 1 * *        /home/erwin/facture.sh         # le 1er de chaque mois à minuit
30 2 * * 1-5     /home/erwin/job.sh             # à 2h30, du lundi au vendredi
\`\`\`

\`*/15\` = "toutes les 15", \`1-5\` = intervalle, \`1,15\` = liste. Outil mental : [crontab.guru] pour vérifier une expression.

### Le piège numéro 1 : l'environnement de cron

cron tourne avec un environnement **minimal**. Ton \`$PATH\` n'est pas celui de ton shell interactif, tes alias et ton \`.bashrc\` ne sont PAS chargés. Un script qui marche en le lançant à la main peut échouer en cron pour ces seules raisons.

\`\`\`bash
# MAUVAIS dans une crontab : "node" peut être introuvable, "backup.sh" relatif
*/5 * * * * node app.js

# BON : chemins ABSOLUS partout + PATH défini en tête de crontab
PATH=/usr/local/bin:/usr/bin:/bin
*/5 * * * * /usr/local/bin/node /home/erwin/app/app.js
\`\`\`

### Capturer la sortie (sinon tu es aveugle)

Par défaut, cron envoie la sortie par mail local (que tu ne lis jamais). Redirige toujours vers un fichier de log :

\`\`\`bash
0 3 * * * /home/erwin/backup.sh >> /home/erwin/logs/backup.log 2>&1
\`\`\`

\`>> ... 2>&1\` ajoute stdout ET stderr dans un fichier daté par le script. Sans ça, quand ça plante la nuit, tu n'as aucune trace.

### Script cron-safe (bonnes pratiques intégrées)

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# 1) Ne JAMAIS dépendre du dossier courant : on le fixe
cd "$(dirname "$0")"

# 2) PATH explicite au cas où cron ne le fournit pas
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# 3) Log horodaté
log() { echo "[$(date '+%F %T')] $*"; }

log "Début sauvegarde"
tar -czf "/home/erwin/backups/db-$(date +%F).tar.gz" /var/lib/data
log "Fin sauvegarde OK"
\`\`\`

🔒 **Réflexe sécu**

- **Une crontab d'utilisateur ne devrait jamais lancer de script modifiable par d'autres** : si \`backup.sh\` est en \`777\`, n'importe quel user de la machine peut y injecter du code qui s'exécutera avec TES droits à 3h du matin. Garde tes scripts cron en \`700\` (toi seul).
- **Recon défensive** : les crontabs (\`crontab -l\`, et au niveau système \`/etc/cron.*\`, \`/etc/crontab\`) sont un endroit classique de **persistance** pour un malware. Sur TA machine, savoir lister et auditer les tâches planifiées est un réflexe sain : une entrée cron qui télécharge et exécute un script depuis une IP externe = drapeau rouge.
- **Secrets** : ne mets pas de mots de passe en clair dans la crontab (ils apparaissent dans \`ps\` et les logs). Charge-les depuis un fichier en \`600\` dans le script.

⚠️ **Pièges**

- **PATH minimal** : \`command not found\` en cron alors que ça marche en interactif → mets les chemins absolus ou définis \`PATH\` en haut de la crontab.
- **Chemins relatifs** : un \`./fichier\` dans un script cron pointe vers le home (ou \`/\`) de cron, pas vers ton dossier de travail. Fixe le dossier avec \`cd "$(dirname "$0")"\`.
- **Le \`%\` est spécial dans la crontab** : il faut l'échapper (\`\\%\`). Piège classique avec \`date +%F\` mis DIRECTEMENT dans la ligne crontab — mets-le dans le script à la place.
- **Pas de \`.bashrc\`** : tes alias et fonctions custom n'existent pas pour cron.
- **\`crontab -r\` sans confirmation** efface TOUT. Très proche de \`crontab -e\` au clavier : attention au doigt.

### À écrire dans ton carnet

> Écris la ligne de crontab qui lance \`/home/erwin/cleanup.sh\` tous les dimanches à 4h, en journalisant stdout+stderr dans un fichier. Cite les 2 raisons les plus fréquentes pour lesquelles ce script échouerait en cron alors qu'il marche à la main.
`,

  shortcuts: `## Les raccourcis qui changent la vie

La vitesse au terminal ne vient pas de la frappe rapide, mais de l'**économie de frappe** : ne jamais retaper ce que tu as déjà tapé, te déplacer dans la ligne sans flèches, rappeler une commande de la semaine dernière en 3 touches. Ces raccourcis (hérités d'Emacs/readline) sont les mêmes dans bash, zsh, et même dans beaucoup de prompts (psql, node REPL). Les automatiser dans tes doigts, c'est gagner des heures sur l'année.

### Navigation dans la ligne courante

\`\`\`
Ctrl+A     aller au DÉBUT de la ligne
Ctrl+E     aller à la FIN de la ligne
Alt+B      reculer d'un MOT
Alt+F      avancer d'un MOT
Ctrl+XX    basculer entre début de ligne et position actuelle
\`\`\`

Bien plus rapide que de maintenir la flèche gauche sur une longue commande.

### Édition rapide

\`\`\`
Ctrl+U     coupe du curseur jusqu'au DÉBUT (efface tout à gauche)
Ctrl+K     coupe du curseur jusqu'à la FIN (efface tout à droite)
Ctrl+W     efface le MOT précédent
Ctrl+Y     COLLE ce que tu viens de couper (yank)
Alt+.      réinsère le DERNIER argument de la commande précédente
\`\`\`

\`Ctrl+U\` est ton "tout effacer" instantané. \`Alt+.\` est magique : après \`mkdir mon-projet\`, tape \`cd\` puis \`Alt+.\` → \`cd mon-projet\`.

### LE raccourci : Ctrl+R (recherche dans l'historique)

\`\`\`
Ctrl+R     recherche INCRÉMENTALE dans l'historique
           tape quelques lettres → la dernière commande matchante apparaît
           Ctrl+R encore → commande matchante PRÉCÉDENTE
           Entrée pour exécuter, → ou Ctrl+E pour éditer avant
\`\`\`

\`\`\`
(reverse-i-search)\`dock': docker compose up -d --build
\`\`\`

Tu cherches la grosse commande Docker de mardi dernier ? \`Ctrl+R\`, tape "dock", elle revient. C'est probablement le raccourci qui te fera gagner le plus de temps de toute ta carrière.

### Les expansions d'historique : !!, !$, !*

\`\`\`bash
sudo !!            # relance la commande précédente PRÉFIXÉE de sudo (le grand classique)
!$                 # = le DERNIER argument de la commande précédente
!*                 # = TOUS les arguments de la commande précédente
!docker            # relance la dernière commande qui commençait par "docker"
!:gs/foo/bar       # relance la précédente en remplaçant foo par bar
\`\`\`

\`\`\`bash
$ mkdir /var/www/app
mkdir: cannot create directory: Permission denied
$ sudo !!                          # → sudo mkdir /var/www/app
\`\`\`

### Tab : autocomplétion (rappel, mais vital)

\`\`\`
Tab            complète le nom (commande, fichier, dossier)
Tab Tab        liste toutes les possibilités si ambigu
\`\`\`

Combiné au reste, tu ne tapes plus jamais un chemin long en entier.

### Contrôle du terminal

\`\`\`
Ctrl+C     interrompt le process en cours
Ctrl+Z     suspend le process (puis bg/fg)
Ctrl+D     EOF / ferme le shell (logout) ou termine une saisie
Ctrl+L     efface l'écran (= clear, sans perdre l'historique)
\`\`\`

⚠️ **Pièges**

- **\`Alt\`/\`Meta\` sur macOS** : les raccourcis \`Alt+B\`, \`Alt+F\`, \`Alt+.\` nécessitent souvent d'activer "Use Option as Meta key" dans les préférences de Terminal/iTerm, sinon \`Alt\` insère un caractère accentué.
- **\`Ctrl+S\` gèle ton terminal** (XON/XOFF, hérité des téléscripteurs) : l'écran semble figé. Ce n'est pas un crash → \`Ctrl+Q\` le débloque. Piège classique qui fait croire à un terminal planté.
- **\`!!\` exécute IMMÉDIATEMENT** la commande précédente : \`sudo !!\` peut relancer une commande destructrice avec des droits root. Relis ce que \`!!\` va expanser avant d'appuyer sur Entrée.
- **\`Ctrl+D\` sur une ligne vide ferme le shell** (et ta session SSH) : surprise quand on voulait juste "annuler".
- Les raccourcis dépendent du **mode readline** : si tu as activé le mode \`vi\` (\`set -o vi\`), les raccourcis Emacs ci-dessus ne marchent pas pareil. Par défaut c'est le mode Emacs.

### À écrire dans ton carnet

> Tu viens de taper une longue commande \`npm install --save-dev @types/node eslint prettier\` et elle a échoué pour un droit manquant. Quel raccourci/expansion utilises-tu pour la relancer avec \`sudo\` sans la retaper ? Et pour retrouver la commande \`docker run ...\` d'il y a 3 jours ?
`,
};
