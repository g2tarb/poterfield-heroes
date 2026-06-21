import type { NewExercise } from "../../schema/content";
import { M01_ID } from "./m01";

/**
 * M01 — Exercices SUPPLÉMENTAIRES (Réseau & Protocoles).
 *
 * Ajout d'exercices au module Réseau sans dupliquer ceux de m01.ts
 * (qui contient déjà : 1 quiz_activation, 1 quiz_verification, 2 code_exercise
 * "external", 1 project_validation, displayOrder 1→5).
 *
 * Comme le réseau ne s'exécute pas dans un navigateur, on combine :
 *  - quiz IN-APP (sandbox "browser") pour les compétences purement
 *    conceptuelles et calculatoires (lecture de trame, calcul de sous-réseau,
 *    flags TCP, identification de couche) ;
 *  - exos pratiques GUIDÉS (sandbox "external", language "bash") à réaliser
 *    en local sur le terminal de l'apprenant, avec critères de validation
 *    explicites et CADRE LÉGAL rappelé pour tout ce qui scanne/sniffe.
 *
 * Tous les displayOrder commencent à 20 pour s'insérer APRÈS l'existant.
 * Les passThresholdPct sont à 80 (consigne).
 *
 * skillSlugs valides (extraits de m01.ts) :
 *  osi-tcpip-models, encapsulation-pdu, ethernet-arp, ipv4-ipv6-subnetting,
 *  icmp-diagnostics, tcp-handshake-states, udp-transport, ports-sockets,
 *  dns-deep, http-versions, http-anatomy, tls-pki, nat-firewalls,
 *  packet-analysis, network-scanning-nmap, netcat.
 *
 * CADRE LÉGAL : on ne scanne/sniffe QUE ce qu'on possède ou pour quoi on a
 * une autorisation écrite (sa machine, son réseau, une VM en lab,
 * scanme.nmap.org). Sinon : délit (France, art. 323-1 et s. du Code pénal).
 */
export const m01ExtraExercises: NewExercise[] = [
  // ============================================================
  // QUIZ 1 (in-app) — Couches, encapsulation, lecture de trame,
  // ARP, ICMP, UDP/NAT. Seuil 80%, 6 questions.
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification — lire la pile : couches, trame, ARP, ICMP",
    statement:
      "Quiz approfondi : identifier la couche d'un protocole, lire une trame, comprendre ARP/ICMP et le choix UDP. Aucune question identique au quiz du tronc — on creuse la lecture concrète. Seuil de passage : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu observes dans Wireshark : `Ethernet II` → `Internet Protocol Version 4` → `User Datagram Protocol` → `Domain Name System`. À quelle couche OSI vit chacun de ces 4 protocoles, dans l'ordre ?",
        options: [
          "Liaison (2) → Réseau (3) → Transport (4) → Application (7)",
          "Réseau (3) → Liaison (2) → Transport (4) → Session (5)",
          "Transport (4) → Réseau (3) → Liaison (2) → Application (7)",
          "Physique (1) → Réseau (3) → Transport (4) → Présentation (6)",
        ],
        correctIndex: 0,
        explanation:
          "Ethernet = couche 2 (liaison), IP = couche 3 (réseau), UDP = couche 4 (transport), DNS = couche 7 (application). Lire une capture, c'est lire l'encapsulation de la couche basse vers la couche haute.",
      },
      {
        question:
          "Dans une trame Ethernet, l'en-tête contient (dans l'ordre) : MAC destination (6 octets), MAC source (6 octets), puis un champ EtherType de 2 octets valant `0x0800`. Que signifie `0x0800` ?",
        options: [
          "Le payload est un paquet IPv4",
          "Le payload est une requête ARP",
          "La trame fait 0x0800 octets de long",
          "Le payload est un paquet IPv6",
        ],
        correctIndex: 0,
        explanation:
          "EtherType `0x0800` = IPv4, `0x0806` = ARP, `0x86DD` = IPv6. C'est ce champ qui dit à la couche 2 à quel protocole de couche 3 remettre le payload. La MAC destination en premier, c'est ce que le switch lit d'abord.",
      },
      {
        question:
          "Sur ton LAN, ta machine veut joindre `192.168.1.10` mais ne connaît pas sa MAC. Que fait ARP concrètement ?",
        options: [
          "Elle envoie une requête ARP en broadcast (MAC dest ff:ff:ff:ff:ff:ff) « qui a 192.168.1.10 ? », et l'hôte concerné répond en unicast avec sa MAC",
          "Elle interroge le serveur DNS pour obtenir la MAC de 192.168.1.10",
          "Elle envoie un paquet IP directement, le routeur ajoutera la MAC",
          "Elle envoie un ICMP echo request pour découvrir la MAC",
        ],
        correctIndex: 0,
        explanation:
          "ARP request = broadcast L2 (ff:ff:ff:ff:ff:ff), ARP reply = unicast. C'est ce mécanisme que l'ARP spoofing détourne (réponses ARP forgées) pour se placer en MITM — d'où l'intérêt de le connaître pour le détecter.",
      },
      {
        question:
          "Tu lances `traceroute example.com` et tu vois apparaître les routeurs un par un. Quel mécanisme ICMP/IP rend ça possible ?",
        options: [
          "Des paquets envoyés avec un TTL croissant (1, 2, 3…) ; chaque routeur qui décrémente le TTL à 0 renvoie un ICMP Time Exceeded, révélant son IP",
          "Un broadcast ICMP qui force tous les routeurs à répondre simultanément",
          "Une requête DNS inverse sur chaque saut",
          "Un scan SYN sur le port 33434 de chaque routeur",
        ],
        correctIndex: 0,
        explanation:
          "traceroute exploite le TTL : TTL=1 expire au 1er routeur (ICMP Time Exceeded), TTL=2 au 2e, etc. Chaque « Time Exceeded » révèle l'IP du saut. Quand on atteint la cible, elle répond (echo reply ou port unreachable selon l'implémentation).",
      },
      {
        question:
          "Un ICMP `Destination Unreachable` avec le code `Port Unreachable` est typiquement renvoyé quand…",
        options: [
          "Un datagramme UDP arrive sur un port où aucun service n'écoute",
          "Une connexion TCP est refusée (le serveur envoie ce code)",
          "Le câble réseau est débranché",
          "Le TTL d'un paquet atteint 0",
        ],
        correctIndex: 0,
        explanation:
          "UDP n'a pas de handshake : un port UDP fermé se signale via ICMP Port Unreachable. Côté TCP, un port fermé répond par un segment RST, pas par de l'ICMP. C'est cette différence qu'exploitent les scans UDP (plus lents/incertains).",
      },
      {
        question:
          "Pour un flux de visioconférence en direct, pourquoi UDP est-il souvent préféré à TCP ?",
        options: [
          "Parce qu'un paquet perdu vaut mieux jeté que retransmis en retard : la retransmission TCP arriverait trop tard et créerait du lag/jitter",
          "Parce qu'UDP chiffre nativement le flux",
          "Parce qu'UDP garantit l'ordre des paquets, indispensable à la vidéo",
          "Parce que TCP ne peut pas dépasser 64 Ko/s",
        ],
        correctIndex: 0,
        explanation:
          "En temps réel, la fraîcheur prime sur la complétude : une image perdue est dépassée avant même d'être retransmise. UDP (latence minimale, pas de retransmission) est donc adapté ; l'app gère la perte. C'est aussi la logique de QUIC/HTTP3.",
      },
    ],
    skillSlugs: [
      "osi-tcpip-models",
      "encapsulation-pdu",
      "ethernet-arp",
      "icmp-diagnostics",
      "udp-transport",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 20,
  },

  // ============================================================
  // QUIZ 2 (in-app) — Subnetting/CIDR (CALCUL), TCP flags,
  // NAT/firewall. Seuil 80%, 6 questions.
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification — calcul de sous-réseau, flags TCP, NAT/firewall",
    statement:
      "Quiz calculatoire : pose le masque, l'adresse réseau, le broadcast et la plage d'hôtes en CIDR, lis des flags TCP, raisonne NAT/pare-feu. Prends un papier pour les calculs binaires. Seuil de passage : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Pour le réseau `192.168.1.0/26`, combien y a-t-il d'adresses d'hôtes UTILISABLES par sous-réseau ?",
        options: ["62", "64", "30", "126"],
        correctIndex: 0,
        explanation:
          "/26 → 32 − 26 = 6 bits d'hôte → 2^6 = 64 adresses totales, moins l'adresse réseau et le broadcast = 62 hôtes utilisables. Astuce : hôtes = 2^(32−préfixe) − 2.",
      },
      {
        question:
          "L'adresse `10.0.5.130/25` appartient à quel sous-réseau, et quelle est son adresse de broadcast ?",
        options: [
          "Réseau 10.0.5.128, broadcast 10.0.5.255",
          "Réseau 10.0.5.0, broadcast 10.0.5.127",
          "Réseau 10.0.5.128, broadcast 10.0.5.191",
          "Réseau 10.0.5.130, broadcast 10.0.5.254",
        ],
        correctIndex: 0,
        explanation:
          "/25 = masque 255.255.255.128 → blocs de 128 sur le dernier octet : 0–127 et 128–255. 130 tombe dans le bloc 128–255 → réseau .128, broadcast .255, plage utilisable .129 à .254.",
      },
      {
        question:
          "Quel masque décimal correspond au préfixe `/22`, et combien d'adresses totales couvre-t-il ?",
        options: [
          "255.255.252.0 — 1024 adresses",
          "255.255.255.192 — 64 adresses",
          "255.255.254.0 — 512 adresses",
          "255.255.252.0 — 512 adresses",
        ],
        correctIndex: 0,
        explanation:
          "/22 = 22 bits réseau. Sur le 3e octet : 8 bits masqués − 2 restants = motif 11111100 = 252. Donc 255.255.252.0. Hôtes : 2^(32−22) = 2^10 = 1024 adresses totales (1022 utilisables).",
      },
      {
        question:
          "Dans une capture, tu vois un segment TCP avec UNIQUEMENT le flag `RST` levé, envoyé par le serveur juste après ton SYN. Que s'est-il passé ?",
        options: [
          "Le port est fermé : aucun service n'écoute, le serveur refuse la connexion (RST)",
          "Le handshake a réussi, la connexion est établie",
          "Le serveur demande une retransmission",
          "Un pare-feu a silencieusement droppé le paquet (filtered)",
        ],
        correctIndex: 0,
        explanation:
          "SYN → RST = port closed (l'hôte répond mais rien n'écoute). SYN → SYN/ACK = open. SYN → (aucune réponse) = filtered (un pare-feu drop sans répondre). C'est exactement la grille de lecture d'un scan nmap.",
      },
      {
        question:
          "Le teardown propre d'une connexion TCP utilise typiquement quelle séquence de flags ?",
        options: [
          "FIN → ACK → FIN → ACK (chaque côté ferme son sens, 4 segments)",
          "RST → RST (les deux côtés envoient un reset)",
          "SYN → FIN → ACK",
          "FIN → SYN/ACK → ACK",
        ],
        correctIndex: 0,
        explanation:
          "TCP est full-duplex : chaque sens se ferme indépendamment. A envoie FIN, B ACK, puis B envoie FIN, A ACK (souvent 4 segments, parfois 3 si FIN+ACK groupés). Le RST, lui, coupe brutalement sans teardown.",
      },
      {
        question:
          "Derrière une box en NAT (source NAT / PAT), pourquoi un serveur que tu lances sur ton PC (`nc -l 8080`) n'est-il PAS joignable depuis Internet sans config supplémentaire ?",
        options: [
          "Le NAT n'a pas d'entrée de traduction pour une connexion entrante non sollicitée : il faut un port forwarding explicite vers ton IP privée:port",
          "Parce que le port 8080 est réservé par le système",
          "Parce qu'un pare-feu chiffre automatiquement le trafic entrant",
          "Parce que TCP interdit les connexions entrantes en IPv4 privée",
        ],
        correctIndex: 0,
        explanation:
          "Le NAT crée une entrée de traduction pour le trafic SORTANT (il sait à qui renvoyer la réponse). Une connexion entrante non sollicitée n'a aucune entrée → la box ne sait pas vers quelle IP privée la router, et la jette. D'où le port forwarding. C'est aussi un effet « pare-feu de facto ».",
      },
    ],
    skillSlugs: [
      "ipv4-ipv6-subnetting",
      "tcp-handshake-states",
      "nat-firewalls",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 21,
  },

  // ============================================================
  // CODE EXERCISE 1 (external/bash) — FACILE
  // Disséquer une résolution DNS avec dig +trace.
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Disséquer une résolution DNS (dig +trace)",
    statement: `**Objectif :** suivre une résolution DNS de la racine jusqu'au serveur autoritatif et savoir lire chaque section d'un \`dig\`.

> **Cadre légal :** interroger le DNS public, c'est l'usage normal du réseau. Tu n'attaques rien, tu observes la résolution de noms publics. Rien de sensible ici.

**Étapes (à exécuter dans ton terminal) :**
1. Résous l'enregistrement A, puis AAAA, puis MX d'un domaine public (ex : \`wikipedia.org\`).
2. Lance une résolution ITÉRATIVE complète avec \`dig +trace\` et observe le chemin : serveurs racine → TLD (.org) → autoritatif.
3. Compare le résultat via deux resolvers différents (ton resolver système vs un resolver public comme \`1.1.1.1\`) et note le TTL renvoyé par chacun.
4. Fais une résolution INVERSE (PTR) sur une IP que tu viens d'obtenir.

**À observer / rapporter (dans \`dns.md\`) :**
- L'IP (A) et le TTL retournés ; le TTL change-t-il entre deux appels rapprochés ? Pourquoi ?
- Le rôle de chaque section d'un \`dig\` : QUESTION, ANSWER, AUTHORITY, ADDITIONAL.
- Le chemin observé dans \`+trace\` (combien de niveaux : root, TLD, autoritatif).
- La différence récursif (ton resolver fait le travail) vs itératif (tu suis les renvois toi-même).

**Critères de validation :**
- \`dns.md\` répond aux 4 points ci-dessus.
- Tu identifies au moins un enregistrement A et un MX et tu expliques la différence.
- Tu sais expliquer pourquoi le TTL décroît dans un cache puis se réinitialise.`,
    starterCode: `#!/usr/bin/env bash
# Étape 1 — enregistrements de base (remplace par un domaine public de ton choix)
# dig wikipedia.org A
# dig wikipedia.org AAAA
# dig wikipedia.org MX

# Étape 2 — résolution itérative complète (root -> TLD -> autoritatif)
# dig +trace wikipedia.org

# Étape 3 — comparer deux resolvers et leur TTL
# dig wikipedia.org A              # resolver système
# dig @1.1.1.1 wikipedia.org A     # resolver public Cloudflare

# Étape 4 — résolution inverse (PTR) sur une IP obtenue
# dig -x <IP_obtenue>
`,
    solutionCode: `#!/usr/bin/env bash
set -euo pipefail
DOMAIN="wikipedia.org"

echo "== A ==";    dig +noall +answer "$DOMAIN" A
echo "== AAAA =="; dig +noall +answer "$DOMAIN" AAAA
echo "== MX ==";   dig +noall +answer "$DOMAIN" MX

echo "== +trace (itératif) =="
dig +trace "$DOMAIN"

echo "== resolver système vs 1.1.1.1 (compare le TTL) =="
dig +noall +answer "$DOMAIN" A
dig @1.1.1.1 +noall +answer "$DOMAIN" A

echo "== PTR (résolution inverse) =="
IP="$(dig +short "$DOMAIN" A | head -n1)"
echo "IP retenue: $IP"
dig -x "$IP" +noall +answer
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["dns-deep", "udp-transport", "ports-sockets"],
    passThresholdPct: 80,
    estimatedMinutes: 45,
    displayOrder: 22,
  },

  // ============================================================
  // CODE EXERCISE 2 (external/bash) — FACILE→MOYEN
  // Inspecter un handshake TLS (openssl s_client / curl -v).
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Inspecter un handshake TLS (openssl s_client / curl -v)",
    statement: `**Objectif :** ouvrir le capot d'une connexion HTTPS : voir la version TLS négociée, la cipher suite, et remonter la chaîne de certificats jusqu'à la CA racine.

> **Cadre légal :** tu te connectes à des serveurs HTTPS publics que tu consultes normalement et tu inspectes TON propre trafic sortant. Aucune interception d'un tiers. RAS côté légal.

**Étapes :**
1. Avec \`curl -v\` sur un site HTTPS public, repère dans la sortie : l'établissement TCP, la ligne \`SSL connection using TLSx.x / <cipher>\`, le sujet et l'émetteur du certificat, puis la requête/réponse HTTP.
2. Avec \`openssl s_client\`, connecte-toi au port 443 et lis : \`Protocol\`, \`Cipher\`, le bloc \`Certificate chain\` (qui signe qui), et \`Verify return code\`.
3. Affiche le certificat « feuille » décodé (sujet, émetteur, dates de validité, SAN) avec \`openssl x509 -text\`.
4. (Bonus) Force une version basse (ex : \`-tls1_1\`) et observe le refus du serveur moderne — preuve que les vieilles versions sont désactivées.

**À observer / rapporter (dans \`tls.md\`) :**
- La version TLS et la cipher suite négociées (note l'échange de clés, ex : ECDHE → forward secrecy).
- La chaîne de confiance : feuille → intermédiaire(s) → racine. Qui est la CA racine ?
- Les dates de validité du certificat feuille et les noms couverts (SAN).
- 3 phrases : pourquoi un sniffer voit le SNI et le DNS mais PAS le contenu HTTP une fois TLS établi ?

**Critères de validation :**
- \`tls.md\` nomme la version TLS, la cipher suite et la CA racine du site testé.
- Tu sais expliquer la différence entre certificat feuille / intermédiaire / racine.
- Tu sais dire ce que TLS protège (confidentialité, intégrité, authentification) et ce qu'il NE cache pas (DNS, SNI, IP/port).`,
    starterCode: `#!/usr/bin/env bash
HOST="wikipedia.org"

# Étape 1 — curl verbeux : TCP + TLS + HTTP en une commande
# curl -v "https://$HOST" -o /dev/null

# Étape 2 — handshake et chaîne de certificats
# openssl s_client -connect "$HOST:443" -servername "$HOST" </dev/null

# Étape 3 — décoder le certificat feuille
# openssl s_client -connect "$HOST:443" -servername "$HOST" </dev/null \\
#   | openssl x509 -noout -text

# Étape 4 (bonus) — tenter une vieille version TLS (devrait échouer)
# openssl s_client -connect "$HOST:443" -servername "$HOST" -tls1_1 </dev/null
`,
    solutionCode: `#!/usr/bin/env bash
set -uo pipefail
HOST="wikipedia.org"

echo "== curl -v (TCP + TLS + HTTP) =="
curl -v "https://$HOST" -o /dev/null

echo "== handshake + chaîne de certificats =="
openssl s_client -connect "$HOST:443" -servername "$HOST" </dev/null 2>/dev/null \\
  | sed -n '/Certificate chain/,/---/p'

echo "== version TLS + cipher négociés =="
openssl s_client -connect "$HOST:443" -servername "$HOST" </dev/null 2>/dev/null \\
  | grep -E 'Protocol|Cipher|Verify return code'

echo "== certificat feuille décodé (sujet, émetteur, dates, SAN) =="
openssl s_client -connect "$HOST:443" -servername "$HOST" </dev/null 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

echo "== bonus : TLS 1.1 doit être refusé par un serveur moderne =="
openssl s_client -connect "$HOST:443" -servername "$HOST" -tls1_1 </dev/null 2>&1 \\
  | grep -Ei 'alert|error|protocol' || echo "(refus attendu)"
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["tls-pki", "http-anatomy", "tcp-handshake-states", "dns-deep"],
    passThresholdPct: 80,
    estimatedMinutes: 60,
    displayOrder: 23,
  },

  // ============================================================
  // CODE EXERCISE 3 (external/bash) — MOYEN
  // Lab client/serveur netcat + capture tcpdump (loopback).
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Lab netcat client/serveur + capture tcpdump (loopback)",
    statement: `**Objectif :** monter une socket TCP à la main avec netcat, échanger des données, puis CAPTURER et LIRE l'échange pour voir le handshake, les données en clair et le teardown.

> **⚠️ CADRE LÉGAL :** ce lab tourne **exclusivement sur TA machine** (interface loopback : \`lo\` sous Linux, \`lo0\` sous macOS) ou ton réseau local. Tu captures **ton propre trafic**. Ne sniffe jamais une interface ou un réseau qui n'est pas le tien sans autorisation écrite : c'est un délit (France, art. 323-1 et s. du Code pénal).

**Étapes :**
1. **Serveur** (terminal 1) : écoute sur un port haut, ex : \`nc -l 4444\`.
2. **Client** (terminal 2) : connecte-toi en loopback : \`nc 127.0.0.1 4444\`. Tape des messages dans les deux sens : c'est un mini-chat sur socket TCP brute.
3. **Capture** (terminal 3, AVANT de discuter) : \`sudo tcpdump -i lo0 -w lab.pcap port 4444\` (\`lo0\` macOS / \`lo\` Linux). Discute, puis Ctrl+C.
4. **Lecture** : relis la capture avec \`tcpdump -r lab.pcap -A\` (option \`-A\` = payload en ASCII) ou ouvre \`lab.pcap\` dans Wireshark et fais « Follow TCP Stream ».
5. **Bonus transfert de fichier** : \`nc -l 4444 > recu.txt\` côté récepteur, \`nc 127.0.0.1 4444 < envoi.txt\` côté émetteur ; vérifie \`diff envoi.txt recu.txt\`.

**À observer / rapporter (dans \`netcat-lab.md\`) :**
- Le 3-way handshake dans la capture (SYN, SYN/ACK, ACK).
- Le fait que tes messages apparaissent EN CLAIR dans le payload (puisque netcat ne chiffre rien).
- Le teardown (FIN/ACK) quand tu coupes une extrémité.
- Une phrase : pourquoi ce contenu est lisible alors que du HTTPS ne le serait pas (= la valeur de TLS).

**Critères de validation :**
- \`netcat-lab.md\` montre le chat fonctionnel + l'analyse de \`lab.pcap\`.
- Tu identifies handshake, données en clair et teardown dans la capture.
- Le lab tourne bien sur loopback / ton réseau (cible explicitement la tienne).`,
    starterCode: `#!/usr/bin/env bash
# Adapte l'interface loopback : lo0 (macOS) ou lo (Linux)
PORT=4444

# Terminal 1 — serveur en écoute
# nc -l "$PORT"

# Terminal 2 — client (loopback : ta propre machine)
# nc 127.0.0.1 "$PORT"

# Terminal 3 — capture AVANT de discuter (ton trafic, ton interface)
# sudo tcpdump -i lo0 -w lab.pcap port "$PORT"

# Lecture de la capture (payload ASCII)
# tcpdump -r lab.pcap -A

# Bonus transfert de fichier
# nc -l "$PORT" > recu.txt            # récepteur
# nc 127.0.0.1 "$PORT" < envoi.txt    # émetteur
# diff envoi.txt recu.txt && echo "transfert OK"
`,
    solutionCode: `#!/usr/bin/env bash
# Démonstration non-interactive du lab (3-way handshake + données + teardown
# visibles dans la capture). À lancer sur TA machine uniquement.
set -uo pipefail
PORT=4444
# Interface loopback selon l'OS
IFACE="lo"; [ "$(uname)" = "Darwin" ] && IFACE="lo0"

# 1) Capture en arrière-plan
sudo tcpdump -i "$IFACE" -w lab.pcap "port $PORT" &
TCPDUMP_PID=$!
sleep 1

# 2) Serveur netcat en arrière-plan (renvoie une bannière puis lit)
printf 'salut du serveur\\n' | nc -l "$PORT" &
sleep 1

# 3) Client : envoie un message (handshake + data + teardown)
printf 'salut du client\\n' | nc 127.0.0.1 "$PORT"
sleep 1

# 4) Stoppe la capture et relis-la (payload en clair, flags TCP)
sudo kill "$TCPDUMP_PID" 2>/dev/null || true
sleep 1
echo "== relecture : handshake (S), données en clair, teardown (F) =="
tcpdump -r lab.pcap -A 2>/dev/null

# 5) Bonus transfert de fichier vérifié
printf 'contenu de test\\n' > envoi.txt
nc -l "$PORT" > recu.txt &
sleep 1
nc 127.0.0.1 "$PORT" < envoi.txt
sleep 1
diff envoi.txt recu.txt && echo "transfert OK : contenu identique"
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "netcat",
      "ports-sockets",
      "tcp-handshake-states",
      "packet-analysis",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 75,
    displayOrder: 24,
  },

  // ============================================================
  // CODE EXERCISE 4 (external/bash) — DIFFICILE
  // Scan nmap + capture tcpdump corrélés (cible AUTORISÉE).
  // ============================================================
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Scan nmap corrélé à une capture (cible AUTORISÉE)",
    statement: `**Objectif :** cartographier un hôte avec nmap, puis corréler chaque état de port (open/closed/filtered) avec les flags TCP réellement observés dans une capture. C'est l'exercice de synthèse réseau + sécu du module.

> **⚠️ CADRE LÉGAL — À LIRE AVANT TOUTE COMMANDE :**
> - **Cibles autorisées UNIQUEMENT :** \`scanme.nmap.org\` (fourni par le projet nmap pour l'entraînement), ta propre machine (\`127.0.0.1\`), ou une VM dans un lab isolé.
> - **Ne scanne JAMAIS** un hôte ou un réseau tiers sans autorisation écrite. En France, c'est puni par les **art. 323-1 et suivants du Code pénal**.
> - **Le scope avant le scan** : c'est la première discipline d'un pentester. En cas de doute, ne scanne pas.

**Étapes :**
1. **Découverte d'hôte** : \`nmap -sn scanme.nmap.org\` (l'hôte répond-il ?).
2. **Scan de ports** : scan par défaut, puis SYN scan furtif (\`sudo nmap -sS\`), puis détection de versions (\`-sV\`). Note les ports \`open\` et les services.
3. **Capture corrélée** (TON trafic) : lance \`sudo tcpdump\` filtré sur la cible et un petit jeu de ports pendant que tu scannes ces mêmes ports.
4. **Lecture** : dans la capture, pour un port \`open\` repère SYN → SYN/ACK ; pour un port \`closed\` repère SYN → RST ; pour un port \`filtered\` repère l'absence de réponse. Filtre Wireshark utile : \`tcp.flags.syn==1 || tcp.flags.reset==1\`.

**À observer / rapporter (dans \`nmap-scan.md\`) :**
- La liste des ports ouverts + service détecté sur la cible autorisée.
- La différence \`-sS\` (SYN/half-open, furtif) vs \`-sT\` (connect, handshake complet), illustrée par ta capture.
- La correspondance états nmap ↔ flags observés : open=SYN/ACK, closed=RST, filtered=silence.
- **Une phrase obligatoire sur la légalité :** quelle cible as-tu scannée et pourquoi c'était autorisé.

**Critères de validation :**
- \`nmap-scan.md\` complet, cible **explicitement autorisée** et justifiée.
- Tu corrèles correctement les états nmap aux flags TCP de ta capture.
- Tu sais expliquer pourquoi un SYN scan est plus furtif qu'un connect scan.`,
    starterCode: `#!/usr/bin/env bash
# CIBLE AUTORISÉE UNIQUEMENT : scanme.nmap.org, 127.0.0.1, ou ta VM de lab.
TARGET="scanme.nmap.org"
PORTS="22,80,443,9929"

# 1) L'hôte est-il up ?
# nmap -sn "$TARGET"

# 2) Scan de ports : défaut, SYN furtif, détection de versions
# nmap "$TARGET"
# sudo nmap -sS "$TARGET"
# nmap -sV -p "$PORTS" "$TARGET"

# 3) Capture corrélée (ton trafic) — lance AVANT le scan ciblé
# sudo tcpdump -i any -w nmap.pcap "host $TARGET and tcp"

# 4) Relecture : repère SYN/ACK (open), RST (closed), silence (filtered)
# tcpdump -r nmap.pcap 'tcp[tcpflags] & (tcp-syn|tcp-rst) != 0'
`,
    solutionCode: `#!/usr/bin/env bash
# CIBLE AUTORISÉE UNIQUEMENT. Ici scanme.nmap.org (autorisé par le projet nmap).
set -uo pipefail
TARGET="scanme.nmap.org"
PORTS="22,80,443,9929"

echo "== 1) host discovery =="
nmap -sn "$TARGET"

echo "== 3) lance la capture de TON trafic en arrière-plan =="
sudo tcpdump -i any -w nmap.pcap "host $TARGET and tcp" &
TCPDUMP_PID=$!
sleep 1

echo "== 2) scans =="
nmap -p "$PORTS" "$TARGET"          # connect scan implicite si non-root
sudo nmap -sS -p "$PORTS" "$TARGET" # SYN scan (half-open, furtif) — root requis
sudo nmap -sV -p "$PORTS" "$TARGET" # détection de versions

sleep 1
sudo kill "$TCPDUMP_PID" 2>/dev/null || true
sleep 1

echo "== 4) corrélation : SYN/ACK=open, RST=closed, silence=filtered =="
tcpdump -r nmap.pcap -nn 'tcp[tcpflags] & (tcp-syn|tcp-rst) != 0' 2>/dev/null

echo "Cible scannée : $TARGET — autorisée par le projet nmap pour l'entraînement."
`,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "network-scanning-nmap",
      "tcp-handshake-states",
      "packet-analysis",
      "nat-firewalls",
      "ports-sockets",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 120,
    displayOrder: 25,
  },
];
