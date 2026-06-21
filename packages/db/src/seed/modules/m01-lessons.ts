/**
 * M01 — Réseau & Protocoles : contenu pédagogique markdown (une leçon par skill).
 *
 * Même rôle que m00LessonContent : indexé par skill slug, appliqué via
 * UPDATE skills SET content_markdown. Public : Erwin, dev JS/TS confirmé mais
 * novice en réseau bas niveau et sécu. Chaque leçon est autonome (analogie,
 * théorie juste, schéma ASCII, commandes commentées, encart Pièges, et encart
 * Cadre légal pour les skills à teneur offensive).
 *
 * Les 16 clés correspondent EXACTEMENT aux slugs de m01Skills (m01.ts).
 */
export const m01LessonContent: Record<string, string> = {
  "osi-tcpip-models": `## Le réseau, c'est un empilement de menteurs polis

Quand tu fais un \`fetch("https://api.exemple.com")\`, tu crois parler à un serveur. En réalité tu parles à une **couche** juste en dessous de toi, qui parle à la couche en dessous d'elle, etc. Chaque couche fait semblant de discuter directement avec son homologue de l'autre côté, alors qu'en vrai tout descend jusqu'au câble puis remonte. C'est un empilement d'abstractions — exactement comme ton code appelle une lib qui appelle le kernel qui appelle le matériel.

### Pourquoi découper en couches ?

Pour pouvoir **remplacer une couche sans toucher aux autres**. Tu passes du wifi à la fibre (couche physique) sans réécrire ton serveur HTTP. Tu passes de HTTP/1.1 à HTTP/3 sans changer ta carte réseau. C'est de la séparation des responsabilités, version protocole.

### Les deux modèles

OSI (théorique, 7 couches) est l'outil pour *raisonner* et *nommer* les problèmes. TCP/IP (pratique, 4 couches) est ce qui *tourne réellement*.

\`\`\`
  MODÈLE OSI (7)              MODÈLE TCP/IP (4)        EXEMPLES
 ┌──────────────────┐       ┌──────────────────┐
 │ 7 Application     │       │                  │  HTTP, DNS, TLS*
 │ 6 Présentation   │  ───► │   Application    │  (chiffrement, encodage)
 │ 5 Session        │       │                  │
 ├──────────────────┤       ├──────────────────┤
 │ 4 Transport      │  ───► │   Transport      │  TCP, UDP   (ports)
 ├──────────────────┤       ├──────────────────┤
 │ 3 Réseau         │  ───► │   Internet       │  IP, ICMP   (adresses IP)
 ├──────────────────┤       ├──────────────────┤
 │ 2 Liaison        │  ───► │   Accès réseau   │  Ethernet, ARP, wifi
 │ 1 Physique       │       │                  │  câble, signal, MAC
 └──────────────────┘       └──────────────────┘
\`\`\`

(*) TLS est techniquement à cheval session/présentation — en pratique on le range "au-dessus du transport".

### La phrase mnémo (couche 1 → 7)

> **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way
> Physique, Données(liaison), Network, Transport, Session, Présentation, Application.

### Ce qu'il faut vraiment retenir

- **Couche 2 (liaison)** = adresse **MAC**, périmètre = ton réseau local (le switch).
- **Couche 3 (réseau)** = adresse **IP**, périmètre = Internet entier (routée de saut en saut).
- **Couche 4 (transport)** = **port** + fiabilité (TCP) ou pas (UDP).
- **Couche 7 (appli)** = ce que tu codes déjà (HTTP, DNS…).

Quand un truc casse, la première question d'un pro c'est : *"à quelle couche ?"*. Le câble est débranché (1) ? L'IP est fausse (3) ? Le port est fermé (4) ? Le certificat est invalide (7) ? Sans le modèle en couches, tu débugges à l'aveugle.

### ⚠️ Pièges
- **OSI n'est pas implémenté tel quel.** Personne n'écrit "du code couche 5". C'est une grille de lecture, pas une API.
- **Une couche ne saute pas une autre.** Ton HTTP ne touche jamais directement Ethernet ; ça traverse forcément transport + réseau.
- **MAC ≠ IP.** Erreur classique : croire que la MAC sert à router sur Internet. Non : la MAC ne sort jamais du réseau local, elle est réécrite à chaque saut.
- **"Le web" n'est pas une couche.** Le web (HTTP) n'est qu'une appli parmi d'autres au-dessus de la même pile.
`,

  "encapsulation-pdu": `## Des poupées russes qui voyagent

Tu veux envoyer une lettre confidentielle. Tu l'écris (les **données**), tu la mets dans une enveloppe avec le nom du destinataire (le **transport**), puis dans un colis avec une adresse postale (le **réseau**), puis tu le confies à un coursier qui sait juste "aller jusqu'au prochain relais" (la **liaison**). À chaque niveau, on **ajoute une couche d'emballage avec ses propres infos**, sans jamais ouvrir ce qu'il y a dedans. C'est l'encapsulation.

### Le vocabulaire : PDU

Chaque couche manipule une unité de données qu'on appelle **PDU** (Protocol Data Unit). Le nom change à chaque couche — et c'est important de les connaître pour lire une capture :

| Couche | PDU | Ce qu'on ajoute |
|---|---|---|
| Application | **Données** (data) | le message HTTP/DNS brut |
| Transport | **Segment** (TCP) / Datagramme (UDP) | en-tête avec **ports** + seq/ack |
| Réseau | **Paquet** (packet) | en-tête avec **IP** source/destination + TTL |
| Liaison | **Trame** (frame) | en-tête avec **MAC** src/dst + checksum |
| Physique | **Bits** | signal électrique / optique / radio |

### Le voyage : descente puis remontée

\`\`\`
ÉMISSION (ta machine)                RÉCEPTION (le serveur)
 ┌─────────────┐                      ┌─────────────┐
 │   DONNÉES   │  GET / HTTP/1.1      │   DONNÉES   │
 └──────┬──────┘                      └──────▲──────┘
 [+ en-tête TCP]                       [- en-tête TCP]
 ┌──────▼──────────┐                  ┌──────┴──────────┐
 │ TCP │  DONNÉES  │  = SEGMENT       │ TCP │  DONNÉES  │
 └──────┬──────────┘                  └──────▲──────────┘
 [+ en-tête IP]                        [- en-tête IP]
 ┌──────▼─────────────────┐           ┌──────┴─────────────────┐
 │ IP │ TCP │  DONNÉES    │ = PAQUET  │ IP │ TCP │  DONNÉES    │
 └──────┬─────────────────┘           └──────▲─────────────────┘
 [+ en-tête + queue Ethernet]          [- Ethernet]
 ┌──────▼──────────────────────┐      ┌──────┴──────────────────────┐
 │ETH│ IP │ TCP │ DONNÉES │FCS │      │ETH│ IP │ TCP │ DONNÉES │FCS │
 └──────┬──────────────────────┘      └──────▲──────────────────────┘
        │  = TRAME → 010110... bits         │
        └──────────────► réseau ────────────┘
\`\`\`

L'émission **descend** la pile (on emballe, *encapsulation*). La réception **remonte** (on déballe, *désencapsulation*). Chaque couche lit SON en-tête, le retire, et passe le reste à la couche du dessus sans regarder dedans.

### Le point clé : chaque en-tête est lu par son pair

Le routeur intermédiaire ouvre jusqu'à la couche IP (pour router), pas plus haut. Le switch n'ouvre que la couche Ethernet. Seul le serveur final remonte jusqu'au HTTP. C'est ce qui rend Internet *scalable* : un routeur n'a pas besoin de comprendre ton HTTP pour l'acheminer.

### Le voir en vrai

\`\`\`bash
# tcpdump en mode verbeux montre l'empilement, couche par couche :
sudo tcpdump -i any -v -c 1 'tcp port 443'
# Sortie (annotée) :
#   IP (tos 0x0, ttl 64, ...) 192.168.1.20.52344 > 93.184.x.x.443:   ← couche 3 (IP) + 4 (ports)
#       Flags [S], seq 123456, win 65535, ...                        ← détail TCP (couche 4)
\`\`\`

Wireshark fait ça visuellement : il t'affiche un arbre dépliable Ethernet → IP → TCP → HTTP, exactement les poupées russes.

### ⚠️ Pièges
- **L'ordre compte.** En émission : Données → Segment → Paquet → Trame. L'inverse (Trame → … → Données) c'est la réception. Inverser les deux est l'erreur de QCM classique.
- **La MAC change à chaque saut, l'IP non.** À chaque routeur traversé, l'en-tête Ethernet est jeté et reconstruit ; l'en-tête IP source/destination reste intact de bout en bout.
- **La taille a une limite (MTU).** Une trame Ethernet ≈ 1500 octets max de charge utile. Au-delà, IP fragmente (ou TCP segmente plus finement). D'où les bugs MTU/MSS sur VPN.
- **Le FCS est en QUEUE, pas en tête.** Ethernet a un en-tête ET une queue (checksum). C'est la seule couche avec un suffixe.
`,

  "ethernet-arp": `## Le réseau local, c'est une salle de réunion qui crie

Imagine une salle où tout le monde s'entend. Pour parler à "Marc", tu cries son **badge** (son adresse MAC), tout le monde l'entend mais seul Marc répond. Problème : tu connais souvent l'**adresse IP** de ta cible, pas son badge. Alors tu cries : *"Qui a l'IP 192.168.1.1 ? Donne-moi ton badge !"* — c'est **ARP**. Et si un menteur répond *"c'est moi !"* alors que c'est faux… il intercepte tout. C'est l'ARP spoofing.

### La trame Ethernet et l'adresse MAC

L'adresse MAC fait **48 bits** (6 octets), écrite \`a4:83:e7:2b:1c:90\`. Les 3 premiers octets = **OUI**, identifient le constructeur (Apple, Intel…). Elle est censée être unique au monde et **ne sort jamais du réseau local** : à chaque routeur, l'en-tête Ethernet est réécrit.

\`\`\`
 TRAME ETHERNET
 ┌────────────┬────────────┬──────┬───────────────┬──────┐
 │ MAC dest   │ MAC source │ Type │   Charge      │ FCS  │
 │ 6 octets   │ 6 octets   │ 2 o. │   (IP, ARP…)  │ 4 o. │
 └────────────┴────────────┴──────┴───────────────┴──────┘
   à qui          de qui     0x0800=IP   les données   checksum
                             0x0806=ARP
\`\`\`

### Le switch et sa table CAM

Un **switch** apprend "telle MAC est branchée sur tel port physique" et range ça dans sa **table CAM**. Du coup il n'envoie plus à tout le monde : il aiguille directement vers le bon port. (Un vieux *hub*, lui, répétait à tous → tout le monde entendait tout.)

### ARP : résoudre IP locale → MAC

\`\`\`
 Ta machine veut envoyer à 192.168.1.1 mais ne connaît pas sa MAC :

 1) BROADCAST  ──► tout le LAN
    "Who has 192.168.1.1 ? Tell 192.168.1.20"   (ARP Request, dest MAC = ff:ff:ff:ff:ff:ff)

 2) RÉPONSE    ◄── la passerelle seule
    "192.168.1.1 is at a4:83:e7:2b:1c:90"        (ARP Reply, en unicast)

 3) Ta machine met ça dans son CACHE ARP et envoie la trame.
\`\`\`

\`\`\`bash
# Voir le cache ARP (qui sait quelle MAC pour quelle IP) :
arp -a
#   ? (192.168.1.1) at a4:83:e7:2b:1c:90 on en0 ifscope [ethernet]
ip neigh        # équivalent Linux moderne
\`\`\`

### L'attaque : ARP spoofing / cache poisoning → MITM

ARP est **naïf** : aucune authentification. N'importe qui peut envoyer une réponse ARP non sollicitée disant *"192.168.1.1, c'est MA MAC"*. Les victimes mettent ça en cache et t'envoient leur trafic. Tu te places **au milieu** (Man-In-The-Middle) entre la victime et la passerelle, et tu relaies en lisant tout ce qui passe en clair.

\`\`\`
 NORMAL :   Victime ───────────────► Passerelle ──► Internet
 SPOOFÉ :   Victime ──► ATTAQUANT ──► Passerelle ──► Internet
                          │
                          └─ lit/modifie tout le trafic non chiffré
\`\`\`

C'est exactement pourquoi **TLS existe** : même au milieu, l'attaquant ne voit que du chiffré.

### 🔒 Cadre légal
- **On ne teste l'ARP spoofing que sur SON propre réseau / une VM en lab isolé.** Intercepter le trafic d'autrui (wifi du voisin, du café…) est un délit (France : art. 226-15 et 323-1 et s. du Code pénal).
- **Le but ici est défensif** : comprendre l'attaque pour la **détecter** et la **bloquer**.
- **Réflexe défensif** : \`arpwatch\` (alerte sur changement IP↔MAC), entrées ARP **statiques** pour la passerelle, **Dynamic ARP Inspection (DAI)** sur switchs managés, et… **chiffrer** (TLS) pour que l'interception soit inutile.

### ⚠️ Pièges
- **ARP ne route pas.** Il ne fonctionne que dans le réseau local (couche 2). Pour sortir du LAN, on passe par la passerelle (et c'est sa MAC qu'ARP résout).
- **ARP n'est qu'en IPv4.** En IPv6, c'est **NDP** (Neighbor Discovery) qui joue ce rôle.
- **Un cache ARP empoisonné survit quelques minutes.** Vider le cache ou poser des entrées statiques restaure la situation.
- **Le broadcast Request, mais l'Reply en unicast.** Confondre les deux est une erreur fréquente.
`,

  "ipv4-ipv6-subnetting": `## Une adresse IP, c'est une adresse postale en deux parties

Une adresse comme \`192.168.1.20/24\` se lit comme "12 rue des Lilas". Il y a une partie **"la rue"** (le réseau) et une partie **"le numéro"** (l'hôte). Le **masque** (le \`/24\`) dit où couper entre les deux. Tous les voisins de la même rue se parlent directement ; pour aller dans une autre rue, il faut passer par la **passerelle**.

### IPv4 : 32 bits

Quatre octets, donc 4 nombres de 0 à 255. \`192.168.1.20\` =

\`\`\`
 192      . 168      . 1        . 20
 11000000   10101000   00000001   00010100   (32 bits)
\`\`\`

**Privées (RFC 1918)** — non routables sur Internet, réutilisées dans chaque LAN :
\`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`. (C'est pour ça que ta box et celle du voisin ont toutes deux \`192.168.1.1\` — le NAT démêle ça, autre leçon.)

### CIDR et masque : où couper ?

\`/24\` = "les **24 premiers bits** = le réseau, les 8 restants = l'hôte". Le masque équivalent est \`255.255.255.0\`.

\`\`\`
 IP        192.168.1 . 20
 /24       ─────────── │ ────
           NETWORK    │  HOST
 Masque    255.255.255.0   (24 bits à 1, 8 à 0)
\`\`\`

### Calculer un sous-réseau (le réflexe à avoir)

Pour \`192.168.1.20/24\` :

\`\`\`
 Bits hôte         = 32 - 24            = 8
 Adresses totales  = 2^8               = 256
 Adresse réseau    = ...1.0   (tous les bits hôte à 0)   ← NON assignable
 Broadcast         = ...1.255 (tous les bits hôte à 1)   ← NON assignable
 Plage d'hôtes     = ...1.1  →  ...1.254
 Hôtes utilisables = 256 - 2          = 254
\`\`\`

La règle générale : **hôtes utilisables = 2^(32−préfixe) − 2** (on retire réseau + broadcast).

| CIDR | Masque | Hôtes utilisables |
|---|---|---|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /30 | 255.255.255.252 | 2 (liens point-à-point) |

### IPv6 : 128 bits, parce qu'on a épuisé l'IPv4

Il n'y a "que" ~4,3 milliards d'IPv4 → pénurie. IPv6 = 128 bits = un nombre astronomique. Notation hexadécimale en 8 groupes :

\`\`\`
 Complet  : 2001:0db8:0000:0000:0000:ff00:0042:8329
 Abrégé   : 2001:db8::ff00:42:8329
   • on retire les zéros de tête de chaque groupe
   • on remplace UNE seule suite de groupes nuls par ::
 Loopback : ::1        (équivaut au 127.0.0.1 d'IPv4)
\`\`\`

### Le voir en vrai

\`\`\`bash
ip addr        # Linux : tes IP + préfixes CIDR
ifconfig       # macOS/BSD
ipcalc 192.168.1.20/24   # affiche réseau, broadcast, plage, masque
#   Network:   192.168.1.0/24
#   Broadcast: 192.168.1.255
#   HostMin:   192.168.1.1   HostMax: 192.168.1.254
\`\`\`

### ⚠️ Pièges
- **Réseau et broadcast ne sont pas assignables.** D'où le "−2". Un /31 et /32 sont des cas spéciaux (liens et hôte unique).
- **Le \`::\` IPv6 ne s'utilise qu'une fois.** Sinon l'adresse est ambiguë (impossible de savoir combien de groupes nuls de chaque côté).
- **Préfixe plus grand = réseau plus petit.** Un /26 est plus petit qu'un /24 (contre-intuitif : plus de bits réseau = moins d'hôtes).
- **IP privée ≠ sécurisée.** Une IP privée n'est juste pas routable sur Internet ; elle reste joignable depuis ton LAN (et donc sniffable).
`,

  "icmp-diagnostics": `## ICMP, c'est le service après-vente du réseau

IP livre des paquets sans accusé de réception — comme une poste qui ne te prévient jamais d'un échec. **ICMP** est le canal de **signalisation** qui comble ce trou : "ta cible est injoignable", "le délai a expiré", "es-tu vivant ?". Ce n'est pas du transport (pas de port, pas de données applicatives) — c'est de la **plomberie de la couche réseau**, juste au-dessus d'IP.

### Le mécanisme : ping = echo request / reply

\`\`\`
 Ta machine                          Cible
    │  ICMP type 8  (Echo Request)     │
    │ ───────────────────────────────► │
    │  ICMP type 0  (Echo Reply)       │
    │ ◄─────────────────────────────── │
    │                                  │
   RTT = temps aller-retour mesuré
\`\`\`

\`\`\`bash
ping -c 3 example.com
# 64 bytes from 93.184.x.x: icmp_seq=0 ttl=56 time=11.2 ms
#   • icmp_seq : numéro de la sonde (détecte les pertes)
#   • ttl=56   : ce qu'il reste du TTL → indice du nb de sauts traversés
#   • time     : le RTT (latence aller-retour)
\`\`\`

### TTL + traceroute : le hack le plus élégant du réseau

Chaque paquet IP a un **TTL** (Time To Live) décrémenté de 1 à **chaque routeur**. À 0, le routeur jette le paquet et renvoie un ICMP **"Time Exceeded" (type 11)**. \`traceroute\` exploite ça :

\`\`\`
 envoie TTL=1 ─► routeur 1 décrémente à 0 ─► renvoie "Time Exceeded"  → on apprend R1
 envoie TTL=2 ─► R1(→1) ─► R2 décrémente à 0 ─► "Time Exceeded"        → on apprend R2
 envoie TTL=3 ─► ... ─► R3 ...                                          → on apprend R3
 ...jusqu'à atteindre la cible (qui répond Echo Reply, pas Time Exceeded)
\`\`\`

\`\`\`bash
traceroute example.com
#  1  192.168.1.1     1.0 ms      ← ta box
#  2  10.x.x.x        9.3 ms      ← réseau de ton FAI
#  3  * * *                       ← ce saut filtre l'ICMP (ne répond pas)
#  4  93.184.x.x     11.5 ms      ← la cible
\`\`\`

### Les autres messages utiles

- **Destination Unreachable (type 3)** : avec un *code* précis — réseau injoignable, hôte injoignable, ou **port unreachable** (sert au scan UDP de nmap !).
- **Echo (8/0)** : le ping.
- **Time Exceeded (11)** : la base de traceroute.

### Pourquoi des hôtes bloquent l'ICMP

Beaucoup de firewalls droppent l'ICMP par "sécurité" (réduire la surface, éviter le ping flood). Conséquence : un \`ping\` qui ne répond pas **ne prouve pas** que l'hôte est éteint — il peut juste filtrer. C'est un piège récurrent en diagnostic et en scan (\`nmap -Pn\` existe justement pour "ne te fie pas au ping").

### ⚠️ Pièges
- **"Pas de réponse au ping" ≠ "hôte mort".** L'ICMP est souvent filtré ; vérifie un vrai port TCP avant de conclure.
- **ICMP n'a pas de port.** C'est un protocole de couche 3, pas 4 ; tu ne "ouvres" pas un port ICMP.
- **Les \`* * *\` de traceroute = filtrage, pas forcément un problème.** Certains routeurs ne répondent pas aux TTL expirés, c'est normal.
- **Windows met TTL=128 par défaut, Linux/macOS 64.** Un TTL "bizarre" en réponse renseigne sur l'OS et le nombre de sauts.
`,

  "tcp-handshake-states": `## TCP, c'est deux personnes qui se serrent la main avant de parler

Avant une vraie conversation au téléphone, on fait : "Allô ?" — "Oui allô, tu m'entends ?" — "Oui je t'entends." Trois échanges pour vérifier que **les deux sens marchent**. C'est exactement le **3-way handshake** de TCP. Une fois la poignée de main faite, TCP garantit que tout arrive, **dans l'ordre**, sans perte — contrairement à un \`fetch\` où tu vois juste "ça marche", ici on ouvre le capot de cette fiabilité.

### Le 3-way handshake

\`\`\`
 CLIENT                                      SERVEUR
   │   SYN  seq=x                              │   "je veux ouvrir, mon numéro de départ = x"
   │ ───────────────────────────────────────► │
   │                                           │
   │   SYN/ACK  seq=y, ack=x+1                  │   "OK ; mon numéro = y ; j'ai bien reçu jusqu'à x"
   │ ◄─────────────────────────────────────── │
   │                                           │
   │   ACK  ack=y+1                            │   "reçu ton y ; on est connectés"
   │ ───────────────────────────────────────► │
   │ ============ ESTABLISHED ================ │   échange de données possible
\`\`\`

Trois paquets parce qu'il faut prouver que **chaque sens** fonctionne. Les **numéros de séquence** (seq) numérotent les octets : c'est ça qui permet de réordonner et de détecter les pertes.

### Les flags (8 bits dans l'en-tête TCP)

| Flag | Rôle |
|---|---|
| **SYN** | ouvre la connexion (synchronise les numéros de séquence) |
| **ACK** | accuse réception (présent sur presque tout sauf le 1er SYN) |
| **FIN** | demande la fermeture propre |
| **RST** | coupe brutalement ("ce port est fermé / dégage") |
| **PSH** | "remonte les données à l'appli tout de suite" |
| **URG** | données urgentes (quasi inutilisé) |

### La machine à états (extraits)

\`\`\`
 Serveur:  LISTEN ──(reçoit SYN)──► SYN_RCVD ──(ACK)──► ESTABLISHED
 Client:   (envoie SYN) SYN_SENT ──(SYN/ACK reçu, envoie ACK)──► ESTABLISHED
\`\`\`

### Le teardown (fermeture propre) et le RST

\`\`\`
 CLIENT                         SERVEUR
   │  FIN  ────────────────────►│
   │  ◄──────────────────  ACK  │
   │  ◄──────────────────  FIN  │
   │  ACK  ────────────────────►│
   │ TIME_WAIT (attend ~2×MSL)  │   ← évite qu'un paquet retardataire pollue une future connexion
\`\`\`

Le **RST**, lui, c'est la coupure violente : si tu tentes de te connecter à un port fermé, le serveur répond \`RST\` immédiatement. (C'est cette différence SYN/ACK vs RST que nmap exploite pour dire "open" vs "closed".)

### La fiabilité de TCP en 3 mots

- **Retransmission** : pas d'ACK reçu à temps → on renvoie.
- **Contrôle de flux** (*window*) : le récepteur annonce combien il peut absorber, l'émetteur n'inonde pas.
- **Contrôle de congestion** : TCP ralentit s'il détecte des pertes (le réseau est saturé).

### Le voir en vrai

\`\`\`bash
# Établir et observer une connexion :
curl -v https://example.com -o /dev/null
#   * Connected to example.com ... port 443   ← le handshake vient de finir

# Voir les connexions et leurs états :
ss -tan
#   State      Recv-Q Send-Q  Local Address:Port   Peer Address:Port
#   ESTAB      0      0        192.168.1.20:52344   93.184.x.x:443
#   TIME-WAIT  0      0        192.168.1.20:52210   93.184.x.x:443

# Capturer un handshake :
sudo tcpdump -i any 'tcp[tcpflags] & (tcp-syn|tcp-rst) != 0'
\`\`\`

### ⚠️ Pièges
- **L'ordre du handshake est SYN → SYN/ACK → ACK.** Toute autre séquence en QCM est un piège.
- **TIME_WAIT n'est pas un bug.** Voir plein de TIME_WAIT côté client après des connexions courtes est normal ; ça protège les connexions futures.
- **RST ≠ FIN.** FIN = fermeture polie négociée ; RST = "stop tout de suite" (port fermé, ou crash applicatif).
- **TCP garantit la livraison, pas la sécurité.** Fiable ne veut pas dire chiffré : sans TLS, tout est en clair dans les segments.
`,

  "udp-transport": `## UDP, c'est la carte postale ; TCP, le colis suivi

Avec un colis suivi (TCP), tu as la preuve de livraison, le réacheminement en cas de perte, l'ordre garanti — mais ça prend du temps à mettre en place. Avec une carte postale (UDP), tu écris, tu jettes dans la boîte, et basta : pas de poignée de main, pas d'accusé, ça part *vite*. Si elle se perd, tant pis. Pour certains usages, "vite et tant pis" bat "lent et garanti".

### UDP vs TCP en un coup d'œil

| | TCP | UDP |
|---|---|---|
| Connexion | handshake 3-way | aucune (fire-and-forget) |
| Fiabilité | retransmission, ACK | aucune |
| Ordre | garanti | non garanti |
| En-tête | 20 octets+ | **8 octets** |
| Latence | plus élevée | minimale |
| Usage | web, mail, fichiers | DNS, VoIP, jeux, vidéo live, QUIC |

### L'en-tête UDP : minuscule

\`\`\`
 ┌───────────────┬───────────────┐
 │ Port source   │ Port dest     │   (2 + 2 octets)
 ├───────────────┼───────────────┤
 │ Longueur      │ Checksum      │   (2 + 2 octets)
 └───────────────┴───────────────┘
 = 8 octets, puis directement les données. C'est tout.
\`\`\`

Pas de seq, pas d'ack, pas de window : c'est *toute* la différence avec les ~20 octets de TCP.

### Le contraste visuel

\`\`\`
 TCP : [SYN]→ [←SYN/ACK] [ACK]→ ... [data]→ [←ack] [data]→ [←ack] ... [FIN]
        \\___ ouverture ___/        \\__ chaque envoi accusé __/

 UDP : [data]→  [data]→  [data]→     (et on espère que ça arrive)
        rien avant, rien après, rien entre
\`\`\`

### Quand la perte est acceptable… ou pas

- **Acceptable** : VoIP / visio — si un échantillon audio de 20 ms se perd, mieux vaut continuer que figer l'appel pour le retransmettre (il serait déjà obsolète).
- **Acceptable** : jeu en ligne — la position d'il y a 30 ms ne sert à rien, on veut la *prochaine*, vite.
- **Pas acceptable** : un virement bancaire, un fichier — là TCP s'impose, chaque octet doit arriver intact.
- **DNS** : une petite requête/réponse → UDP par défaut (rapide), bascule sur TCP si la réponse est trop grosse.

### QUIC : le malin

HTTP/3 tourne sur **QUIC**, qui est bâti **sur UDP** — mais réimplémente *par-dessus* la fiabilité, l'ordre et le chiffrement, en espace utilisateur. Pourquoi pas TCP ? Parce que TCP est figé dans les noyaux/équipements ; UDP est un canal "brut" que les devs peuvent faire évoluer librement. (Détail en leçon HTTP/3.)

### Le voir en vrai

\`\`\`bash
# Une requête DNS = de l'UDP sur le port 53. Capture-la :
sudo tcpdump -i any -n 'udp port 53'
#   192.168.1.20.51000 > 1.1.1.1.53:  A? example.com.   ← requête, AUCUN handshake avant
#   1.1.1.1.53 > 192.168.1.20.51000:  A 93.184.x.x      ← réponse directe

# Tester un port UDP avec netcat (-u) :
nc -u 1.1.1.1 53
\`\`\`

### ⚠️ Pièges
- **"Pas de réponse UDP" est ambigu.** Pas d'ACK en UDP → impossible de distinguer "port ouvert mais silencieux" de "paquet perdu". C'est pour ça que le scan UDP est lent et peu fiable.
- **UDP ne veut pas dire "moins sûr".** DoH/DoT et QUIC chiffrent au-dessus d'UDP ; la sécurité est une couche du dessus, pas une propriété du transport.
- **Pas d'ordre garanti.** Si ton appli UDP a besoin d'ordre, c'est À TOI de le gérer (numéros de séquence applicatifs).
- **UDP n'a pas de contrôle de congestion natif.** Une appli UDP mal conçue peut saturer le réseau ; à toi de te limiter.
`,

  "ports-sockets": `## Le port, c'est le numéro d'appartement ; l'IP, l'immeuble

L'IP t'amène jusqu'à la bonne machine (l'immeuble). Mais sur cette machine tournent dix services en même temps (web, SSH, base de données…). Le **port** dit *à quel appartement* livrer. La paire **(IP, port)** identifie un point de communication précis — c'est ce qu'on appelle une **socket**. Quand tu fais \`app.listen(3000)\` en Node, tu réserves l'appart n°3000.

### Les ports : 0 à 65535

\`\`\`
 0     ───────── 1023 ──────── 49151 ──────────── 65535
 │   well-known   │  registered  │   ephemeral / dynamiques │
 │   (root requis) │             │   (choisis au hasard      │
 │   80=HTTP       │  3000, 5432  │    pour le côté CLIENT)   │
 │   443=HTTPS     │  8080...     │                           │
 │   22=SSH 53=DNS │              │                           │
\`\`\`

- **Well-known (0–1023)** : services standards ; sous Unix il faut être root pour écouter dessus.
- **Registered (1024–49151)** : applis (Postgres 5432, ton serveur Fastify 3000…).
- **Ephemeral (49152–65535)** : le **client** s'en attribue un au hasard pour chaque connexion sortante.

### Une connexion = un quadruplet unique

Ce qui identifie *une* connexion TCP, ce n'est pas juste le port serveur (sinon un seul client à la fois !), c'est **4 valeurs** :

\`\`\`
 ( IP source , port source , IP dest , port dest )

 Client A : (192.168.1.20, 52344) → (93.184.x.x, 443)
 Client A : (192.168.1.20, 52345) → (93.184.x.x, 443)   ← 2e onglet, port src différent
 Client B : (192.168.1.99, 60011) → (93.184.x.x, 443)
\`\`\`

Le serveur n'écoute que sur :443, mais distingue chaque client grâce au quadruplet. C'est ça qui permet à un serveur de gérer des milliers de connexions sur un seul port.

### Le modèle socket BSD

C'est l'API historique (en C) qui sous-tend *tout* — y compris ton \`http.createServer\` Node, qui n'en est qu'un emballage.

\`\`\`
 SERVEUR                              CLIENT
 socket()   crée le point de comm.    socket()    crée le point
 bind()     attache (IP, port)        connect()   ──► lance le 3-way handshake
 listen()   passe en mode écoute
 accept()   ◄── bloque, attend ─────  (handshake établi)
 read()/write()  ◄══ données ══►  read()/write()
 close()                              close()
\`\`\`

Tu coderas ça en C dans un module ultérieur ; ici c'est le **modèle** qui compte : qui fait \`bind/listen/accept\` (serveur), qui fait \`connect\` (client).

### Le voir en vrai

\`\`\`bash
# Quels ports écoutent sur ma machine, par quel process ?
ss -tlnp
#   LISTEN 0  511  *:3000  *:*  users:(("node",pid=4821,fd=23))   ← ton Fastify
#   LISTEN 0  128  *:22    *:*  users:(("sshd",pid=900,fd=3))

# Qui occupe le port 3000 ? (utile quand "EADDRINUSE")
lsof -i :3000

# Parler à un service à la main via une socket brute :
nc example.com 80
\`\`\`

### ⚠️ Pièges
- **EADDRINUSE = le port est déjà pris.** Un autre process écoute déjà sur (IP, port) ; \`lsof -i :PORT\` pour le trouver.
- **Le port < 1024 demande root.** D'où le réflexe d'écouter sur 3000/8080 en dev et de mettre un reverse-proxy devant en prod.
- **Le client n'a pas de port "fixe".** Il en prend un éphémère au hasard à chaque connexion ; ne code jamais en dur le port source.
- **Socket ≠ port.** Le port est un numéro ; la socket est l'abstraction complète (IP + port + état de connexion).
`,

  "dns-deep": `## DNS, c'est l'annuaire téléphonique d'Internet

Tu connais le nom (\`wikipedia.org\`) mais le réseau ne sait router que des numéros (\`185.15.59.224\`). DNS fait la traduction nom → IP. C'est tellement intégré que tu l'oublies — mais chaque \`fetch\` commence par une résolution DNS silencieuse. Ouvrir cette boîte noire, c'est comprendre la moitié des "pourquoi mon site ne répond pas".

### La hiérarchie : personne ne connaît tout, chacun délègue

\`\`\`
                    . (root, 13 serveurs racine "logiques")
                    │  "pour .org, demande aux serveurs TLD .org"
                    ▼
              .org (TLD)
                    │  "pour wikipedia.org, demande à ns0.wikimedia.org"
                    ▼
       wikipedia.org (serveur AUTORITATIF)
                    │  "wikipedia.org = 185.15.59.224"
                    ▼
                réponse finale
\`\`\`

### Récursif vs itératif (la distinction clé)

- **Ton resolver** (celui de ta box, ou 1.1.1.1, 8.8.8.8) travaille en **récursif** : tu lui demandes, il se débrouille pour te ramener la réponse finale, quoi qu'il en coûte.
- **Les serveurs entre eux** parlent en **itératif** : chacun ne donne pas la réponse, mais *"je ne sais pas, va demander là-bas"*.

\`\`\`
 TOI ──(récursif: "trouve-moi tout")──► RESOLVER
                                          │ (itératif)
              "demande au root" ◄─────────┤──► ROOT
              "demande au TLD .org" ◄──────┤──► TLD .org
              "voici l'IP" ◄───────────────┤──► AUTORITATIF
 TOI ◄──────── réponse finale ─────────────┘
\`\`\`

### Les types d'enregistrements à connaître

| Type | Rôle |
|---|---|
| **A** | nom → IPv4 |
| **AAAA** | nom → IPv6 |
| **CNAME** | alias (ce nom pointe vers un autre nom) |
| **MX** | serveur de mail du domaine |
| **NS** | serveurs autoritatifs du domaine |
| **TXT** | texte libre (SPF, DKIM, vérifs) |
| **SOA** | infos d'autorité de la zone (serial, TTL…) |
| **PTR** | reverse : IP → nom |

### TTL et cache

Chaque réponse vient avec un **TTL** (en secondes) : combien de temps on a le droit de la garder en cache avant de redemander. C'est pourquoi un changement DNS "met du temps à se propager" — les caches gardent l'ancienne valeur jusqu'à expiration.

### DoH / DoT : la vie privée

Le DNS classique part **en clair** (UDP/53) : ton FAI (ou un sniffer) voit tous les noms que tu résous. **DoT** (DNS over TLS, port 853) et **DoH** (DNS over HTTPS, port 443) chiffrent la requête. Compromis : c'est privé vis-à-vis du réseau local, mais le *resolver* (Cloudflare, Google…) voit toujours tes requêtes — tu déplaces la confiance, tu ne la supprimes pas.

### Lire un \`dig\` section par section

\`\`\`bash
dig wikipedia.org A
\`\`\`
\`\`\`
 ;; QUESTION SECTION:
 ;wikipedia.org.        IN  A              ← ce que tu as demandé

 ;; ANSWER SECTION:
 wikipedia.org.  300    IN  A  185.15.59.224   ← la réponse ; 300 = TTL (5 min)

 ;; AUTHORITY SECTION:
 wikipedia.org.  ...    IN  NS  ns0.wikimedia.org.   ← qui fait autorité

 ;; Query time: 24 msec
 ;; SERVER: 1.1.1.1#53(1.1.1.1)            ← le resolver utilisé
\`\`\`

\`\`\`bash
dig +trace wikipedia.org   # montre la résolution itérative root → TLD → autoritatif
dig -x 185.15.59.224       # reverse (PTR) : IP → nom
\`\`\`

### ⚠️ Pièges
- **Récursif (toi→resolver) vs itératif (resolver→serveurs)** : c'est l'erreur de QCM n°1.
- **Le TTL explique les "ça marche pas chez moi mais oui chez toi".** Cache local pas encore expiré.
- **CNAME ne peut pas coexister avec d'autres records** sur le même nom (notamment pas à l'apex/racine d'un domaine).
- **DoH cache le DNS au réseau, pas au resolver.** Le SNI de TLS révèle encore souvent le domaine visité (sauf ECH).
`,

  "http-versions": `## De la lettre manuscrite au gestionnaire de file optimisé

HTTP/1.1, c'est une caissière qui sert un client à la fois, intégralement, avant le suivant : si le premier est lent, toute la file attend. HTTP/2 ouvre plusieurs guichets sur une même caisse. HTTP/3 change carrément le tapis roulant pour qu'un blocage à un guichet ne fige plus les autres. Chaque version résout un problème de **blocage de file** (head-of-line blocking).

### HTTP/1.1 — texte, simple, mais bloquant

- **Lisible** : c'est du texte que tu peux taper à la main (\`GET / HTTP/1.1\`).
- **Keep-alive** : on réutilise la connexion TCP pour plusieurs requêtes (au lieu d'en rouvrir une à chaque fois).
- **Le défaut** : **head-of-line blocking** applicatif. Sur une connexion, les réponses sortent dans l'ordre des requêtes. Une réponse lente bloque toutes les suivantes. Les navigateurs contournaient en ouvrant ~6 connexions en parallèle (rustine).

\`\`\`
 HTTP/1.1 :  req1 ──► [....réponse1 lente....] ──► req2 ──► réponse2
             req2 doit ATTENDRE que réponse1 soit finie.
\`\`\`

### HTTP/2 — binaire et multiplexé

- **Binaire** (plus du texte) : plus compact, plus rapide à parser.
- **Multiplexing** : plusieurs "streams" entrelacés sur **une seule** connexion TCP. Les réponses reviennent dans le désordre, réassemblées par leur stream-id.
- **HPACK** : compression des en-têtes (qui sont très répétitifs).
- **Server push** : le serveur peut envoyer des ressources non encore demandées (peu utilisé, en voie d'abandon).

\`\`\`
 HTTP/2 :  ┌ stream1 ─┐
           ├ stream3 ─┤  entrelacés sur 1 connexion TCP
           └ stream5 ─┘  → plus d'attente applicative entre requêtes
\`\`\`

**Le résidu** : le multiplexing est applicatif, mais en dessous TCP reste **ordonné**. Si UN paquet TCP se perd, TCP bloque la livraison de TOUT ce qui suit, tous streams confondus → **head-of-line blocking au niveau TCP**.

### HTTP/3 — QUIC sur UDP

- Tourne sur **QUIC**, bâti sur **UDP** (voir leçon UDP).
- Chaque stream est **indépendant** : une perte sur le stream 1 ne bloque pas le stream 3 → fin du HOL blocking TCP.
- **Handshake fusionné** : QUIC intègre TLS 1.3 ; l'établissement de connexion + chiffrement se fait en moins d'allers-retours (parfois 0-RTT en reprise).

\`\`\`
                 HOL blocking      Transport       Chiffrement
 HTTP/1.1   :    applicatif        TCP             TLS séparé (si HTTPS)
 HTTP/2     :    réglé (appli)     TCP (HOL résid.) TLS séparé
 HTTP/3     :    réglé partout     QUIC/UDP        TLS 1.3 intégré
\`\`\`

### Le voir en vrai

\`\`\`bash
# Quelle version négocie ce serveur ?
curl -sI --http2 https://www.cloudflare.com | head -1
#   HTTP/2 200

curl -sI --http3 https://www.cloudflare.com | head -1   # si ton curl supporte HTTP/3
#   HTTP/3 200
\`\`\`
Dans Chrome DevTools → onglet Network → colonne "Protocol" : tu lis \`h2\`, \`h3\` ou \`http/1.1\` par requête.

### ⚠️ Pièges
- **HTTP/2 ≠ "fini le HOL blocking".** Il règle le blocage *applicatif* mais subit encore celui de *TCP*. C'est précisément ce que HTTP/3 corrige.
- **HTTP/2 et /3 sont quasi toujours sur TLS.** Les navigateurs ne les activent qu'en HTTPS ; "HTTP/2 en clair" existe mais est rarissime.
- **HTTP/3 = UDP.** Si un firewall bloque l'UDP/443, le client retombe sur HTTP/2 (TCP). Pas un bug, un fallback.
- **La sémantique HTTP ne change pas.** Méthodes, statuts, en-têtes sont identiques ; seul le *transport* évolue d'une version à l'autre.
`,

  "http-anatomy": `## Une requête HTTP, c'est juste du texte avec une grammaire stricte

Tu utilises \`fetch\` tous les jours, mais une requête HTTP/1.1 n'est rien d'autre que **du texte** envoyé sur une socket TCP : une ligne de commande, des en-têtes, une ligne vide, puis un corps optionnel. Rien de magique. Tu peux la taper à la main avec netcat. Comprendre cette grammaire, c'est pouvoir débugger n'importe quelle API sans Postman.

### Structure d'une REQUÊTE

\`\`\`
 GET /articles?page=2 HTTP/1.1     ◄── ligne de requête : MÉTHODE  URI  VERSION
 Host: api.exemple.com             ◄┐
 User-Agent: curl/8.4.0            ◄┤
 Accept: application/json          ◄┤ EN-TÊTES (clé: valeur)
 Cookie: session=abc123            ◄┤
 Content-Type: application/json    ◄┘
                                   ◄── LIGNE VIDE obligatoire (sépare en-têtes/corps)
 {"titre":"hello"}                 ◄── CORPS (pour POST/PUT ; absent en GET)
\`\`\`

- **Méthode** : ce que tu veux faire.
- **URI** : sur quelle ressource.
- **Host** : obligatoire en HTTP/1.1 (un serveur héberge plusieurs domaines → il faut dire lequel).

### Les méthodes

| Méthode | Sens | Corps ? | Idempotent ? |
|---|---|---|---|
| GET | lire | non | oui |
| POST | créer / action | oui | non |
| PUT | remplacer | oui | oui |
| PATCH | modifier partiellement | oui | non |
| DELETE | supprimer | parfois | oui |
| HEAD | comme GET mais en-têtes seuls | non | oui |
| OPTIONS | quelles méthodes sont permises (préflight CORS) | non | oui |

### Structure d'une RÉPONSE

\`\`\`
 HTTP/1.1 200 OK                   ◄── ligne de statut : VERSION  CODE  RAISON
 Content-Type: application/json    ◄┐
 Content-Length: 134               ◄┤ EN-TÊTES de réponse
 Cache-Control: max-age=3600       ◄┤
 Set-Cookie: session=xyz           ◄┘
                                   ◄── ligne vide
 {"data":[...]}                    ◄── CORPS
\`\`\`

### Les codes de statut (par classe)

\`\`\`
 1xx  Information     (100 Continue, 101 Switching Protocols)
 2xx  Succès          (200 OK, 201 Created, 204 No Content)
 3xx  Redirection     (301 Moved, 302 Found, 304 Not Modified)
 4xx  Erreur CLIENT   (400 Bad Request, 401, 403, 404, 429 Too Many Requests)
 5xx  Erreur SERVEUR  (500 Internal, 502 Bad Gateway, 503 Unavailable)
\`\`\`
Mnémo : **4xx = c'est toi**, **5xx = c'est le serveur**.

### Lire une requête brute avec curl -v

\`\`\`bash
curl -v https://example.com
#   > GET / HTTP/2                 ← '>' = ce que TU envoies
#   > Host: example.com
#   > User-Agent: curl/8.4.0
#   > Accept: */*
#   >
#   < HTTP/2 200                   ← '<' = ce que tu REÇOIS
#   < content-type: text/html
#   < content-length: 1256
\`\`\`

Et le faire **à la main**, sans client HTTP, pour bien voir que c'est juste du texte :

\`\`\`bash
printf 'GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' \\
  | nc example.com 80
\`\`\`

### ⚠️ Pièges
- **La ligne vide est obligatoire.** Oublier le \`\\r\\n\\r\\n\` final → le serveur attend la suite et ta requête "ne répond pas".
- **Les fins de ligne sont \`\\r\\n\` (CRLF), pas \`\\n\`.** En tapant à la main avec netcat, un \`\\n\` seul peut casser le parsing.
- **GET ne devrait pas avoir de corps.** Mets tes paramètres dans l'URL (query string), pas dans un body.
- **Le code de statut n'est qu'une convention.** Une API peut renvoyer 200 avec \`{"error":...}\` dans le corps — lis toujours le corps, pas juste le code.
`,

  "tls-pki": `## TLS, c'est mettre ta conversation dans un tube blindé… ET vérifier l'identité du destinataire

Sans TLS, HTTP voyage en clair : n'importe qui sur le chemin (souviens-toi de l'ARP spoofing) lit tes mots de passe. TLS apporte trois garanties d'un coup : **confidentialité** (chiffré, personne ne lit), **intégrité** (personne ne modifie sans que ça se voie), **authentification** (tu parles bien au vrai serveur, pas à un imposteur). Le HTTPS de ta barre d'adresse, c'est "HTTP transporté dans un tunnel TLS".

### Asymétrique vs symétrique (la base crypto)

- **Symétrique** (AES) : une seule clé partagée chiffre et déchiffre. Rapide, mais comment partager la clé sans que l'espion la voie ?
- **Asymétrique** (RSA, courbes elliptiques) : une paire **clé publique / clé privée**. Ce que la publique chiffre, seule la privée déchiffre. Lent, mais résout le partage.
- **L'astuce de TLS** : on utilise l'**asymétrique** juste pour se mettre d'accord sur une clé symétrique, puis on chiffre tout le reste en **symétrique** (rapide). Le meilleur des deux.

### Le handshake TLS (1.3, simplifié)

\`\`\`
 CLIENT                                            SERVEUR
   │  ClientHello                                     │  "TLS 1.3 ? voici mes cipher suites,
   │   (versions, cipher suites, clé ECDHE client)    │   et ma part d'échange de clé"
   │ ───────────────────────────────────────────────►│
   │                                                  │
   │  ServerHello + Certificat + part ECDHE serveur   │  "OK cette suite ; voici mon CERTIFICAT
   │ ◄───────────────────────────────────────────────│   (qui prouve mon identité) + ma part"
   │                                                  │
   │  [les deux dérivent la MÊME clé symétrique via    │   ECDHE : chacun combine sa part privée
   │   ECDHE — jamais transmise sur le réseau]        │   avec la part publique de l'autre
   │                                                  │
   │  Finished (chiffré) ◄═══════════════════════════►│  canal chiffré établi → HTTP passe dedans
\`\`\`

**ECDHE** (Elliptic Curve Diffie-Hellman Ephemeral) permet aux deux parties de calculer une clé commune **sans jamais l'envoyer** — un espion qui capture tout ne peut pas la reconstituer. Le "E" final (ephemeral) donne la *forward secrecy* : voler la clé privée du serveur ne déchiffre pas les sessions passées.

### Le certificat X.509 et la chaîne de confiance

Le certificat dit "cette clé publique appartient bien à \`example.com\`" — mais qui le garantit ? Une **autorité de certification (CA)** le signe. Et la CA elle-même est signée par une CA racine de confiance, pré-installée dans ton OS/navigateur. C'est la **PKI** (Public Key Infrastructure).

\`\`\`
 CA RACINE (de confiance, dans ton OS)
      │ signe
      ▼
 CA INTERMÉDIAIRE
      │ signe
      ▼
 CERTIFICAT FEUILLE (example.com)   ◄── celui que le serveur présente
\`\`\`

Ton navigateur remonte la chaîne jusqu'à une racine qu'il connaît. Si la chaîne casse, ou si le nom ne correspond pas, ou si c'est expiré → **erreur de certificat**.

### Les attaques que TLS contre (ou pas)

- **MITM sur HTTP clair** : sans TLS, l'attaquant lit/modifie tout. Avec TLS, il ne voit que du chiffré, et ne peut pas se faire passer pour le serveur (il n'a pas de certificat valide).
- **SSL stripping** : l'attaquant force la victime à rester en HTTP (rétrograde HTTPS→HTTP). Défense : **HSTS** (le serveur impose HTTPS pour les visites futures).
- **Certificat invalide** : un attaquant peut présenter un faux certif… mais il ne sera pas signé par une CA de confiance → le navigateur alerte. **Ne clique jamais "continuer quand même"** sur un site sensible.

### Inspecter un handshake en vrai

\`\`\`bash
openssl s_client -connect wikipedia.org:443 -servername wikipedia.org < /dev/null
#   SSL-Session:
#     Protocol  : TLSv1.3                          ← version négociée
#     Cipher    : TLS_AES_256_GCM_SHA384           ← cipher suite
#   Certificate chain
#    0 s:CN=*.wikipedia.org   i:CN=...CA intermédiaire   ← feuille + son émetteur
#    1 s:CN=...intermédiaire  i:CN=...CA racine           ← la chaîne remonte
\`\`\`
\`\`\`bash
curl -v https://example.com 2>&1 | grep -i 'SSL\\|subject\\|issuer\\|TLS'
\`\`\`

### 🔒 Cadre légal
- **Les démos MITM/stripping se font UNIQUEMENT sur ton réseau, ta VM, tes machines.** Intercepter le trafic TLS d'autrui (même "pour voir") est un délit.
- **Réflexe défensif** : HTTPS partout, **HSTS** activé, certificats valides (Let's Encrypt), vérifier la chaîne, ne jamais désactiver la validation de certificat en prod (\`curl -k\` / \`rejectUnauthorized:false\` = trou béant).

### ⚠️ Pièges
- **HTTPS ≠ "site de confiance".** Un site de phishing peut avoir un certificat valide. TLS prouve *l'identité du domaine* et chiffre — pas que le contenu est honnête.
- **Le SNI fuite encore le domaine.** Même chiffré, le nom du site demandé est souvent visible dans le ClientHello (sauf ECH) — d'où "le sniffing voit le SNI mais pas le contenu".
- **Certificat expiré = panne totale.** Surveille les dates d'expiration ; c'est la cause n°1 d'incident HTTPS.
- **Désactiver la vérification "pour que ça marche" = annuler l'authentification.** Tu te rends vulnérable au MITM. À ne JAMAIS faire ailleurs qu'en lab.
`,

  "nat-firewalls": `## Le NAT, c'est le standard téléphonique d'une entreprise

Toute l'entreprise a UN seul numéro public. En interne, chaque poste a une extension. Quand un employé appelle dehors, le standard remplace l'extension par le numéro public et note "le retour, c'est pour le poste 42". À l'extérieur, on ne voit qu'un numéro. C'est exactement le NAT : ta box a **une** IP publique, et derrière, tes appareils ont des IP privées que la box traduit à la volée.

### Pourquoi le NAT existe

La pénurie d'IPv4 (rappel : ~4,3 milliards seulement). Au lieu d'une IP publique par appareil, on partage **une** IP publique pour tout un réseau privé (RFC 1918 : \`192.168.x.x\`, \`10.x.x.x\`…).

### Comment : réécriture IP/port + table de traduction

\`\`\`
 RÉSEAU PRIVÉ                BOX (NAT)                   INTERNET
 192.168.1.20:52344  ──►  réécrit en  ──►  203.0.113.5:61000  ──►  93.184.x.x:443
                          \\__ table de traduction __/
                          203.0.113.5:61000  ↔  192.168.1.20:52344
 192.168.1.20:52344  ◄──  réécrit en  ◄──  203.0.113.5:61000  ◄──  réponse
\`\`\`

La box garde une **table** (IP:port interne ↔ IP:port externe) pour savoir à qui renvoyer les réponses. C'est du **PAT** (Port Address Translation), la forme courante du NAT : on multiplexe par port.

### La conséquence majeure : pas joignable de l'extérieur

Depuis Internet, on ne voit que l'IP publique de la box ; tes appareils internes sont **invisibles/inatteignables** sans configuration. Pour héberger un service (un serveur de jeu, ton Fastify), il faut du **port forwarding** : "tout ce qui arrive sur :8080 de la box, envoie-le vers 192.168.1.20:3000". C'est aussi un effet de bord *sécurité* (le NAT cache le réseau interne), mais le NAT n'est **pas** un firewall.

### Le pare-feu : stateless vs stateful

Un firewall décide *quels paquets passent* selon des règles (IP, port, flags).

- **Stateless** : juge chaque paquet **isolément** ("port 22 entrant → bloque"). Rapide, mais bête : il ne sait pas si un paquet fait partie d'une connexion légitime déjà ouverte.
- **Stateful** : **suit l'état** des connexions (le 3-way handshake, ESTABLISHED…). Il peut dire "autorise le retour d'une connexion QUE j'ai initiée", sans ouvrir le port en grand. C'est la norme moderne.

\`\`\`
 Règle stateful typique :
   sortant   : ALLOW tout (ou presque)
   entrant   : ALLOW si "related/established" (réponse à une connexion sortante)
               ELSE DROP   ← les sondes spontanées de l'extérieur tombent ici
\`\`\`

### Le lien direct avec un scan

Quand nmap dit :
- **open** : un service écoute, le firewall laisse passer (SYN → SYN/ACK).
- **closed** : pas de service, mais l'hôte répond (SYN → RST).
- **filtered** : un firewall **drop** la sonde silencieusement → aucune réponse, nmap ne peut pas conclure.

Lire un scan, c'est lire les règles de filtrage.

### Le voir en vrai

\`\`\`bash
# Ton IP privée (interne) :
ip addr | grep inet        # ex. 192.168.1.20
# Ton IP publique (ce que voit Internet, = celle de ta box) :
curl -s https://ifconfig.me
#   203.0.113.5

# Inspecter des règles de firewall (Linux) :
sudo iptables -L -n -v       # ou: sudo nft list ruleset
\`\`\`

### ⚠️ Pièges
- **NAT ≠ firewall.** Le NAT traduit des adresses ; il cache mais ne *filtre* pas par politique. Ne compte pas dessus comme sécurité.
- **\`filtered\` ≠ \`closed\`.** filtered = un firewall mange la sonde (silence) ; closed = l'hôte répond activement RST. Distinction clé.
- **IPv6 réduit le besoin de NAT.** Avec assez d'adresses, chaque appareil peut être public → d'où l'importance accrue d'un *vrai* firewall en IPv6.
- **Stateless laisse passer des paquets isolés piégés.** Un stateful empêche les paquets "hors connexion" (TCP forgés sans handshake).
`,

  "packet-analysis": `## Wireshark, c'est un microscope branché sur le câble

Jusqu'ici tu as appris la théorie des couches. La capture de paquets, c'est l'**observation au microscope** : tu vois passer chaque trame, chaque handshake, chaque requête DNS, en vrai. C'est l'outil qui transforme "je crois comprendre TCP" en "j'ai vu le SYN/ACK de mes yeux". Et c'est aussi la démonstration brutale de pourquoi TLS existe : **tout ce qui n'est pas chiffré, tu le lis en clair.**

### tcpdump (CLI) vs Wireshark (GUI)

- **tcpdump** : léger, sur le serveur, en SSH ; tu captures dans un \`.pcap\`.
- **Wireshark** : la GUI pour *analyser* (souvent le .pcap rapatrié) — coloration, "Follow TCP Stream", décodage des protocoles.

Combo typique : capturer avec tcpdump sur la machine, analyser avec Wireshark sur ton poste.

### Filtre de CAPTURE (BPF) vs filtre d'AFFICHAGE — à ne pas confondre

\`\`\`
 ┌──────────── flux réseau brut ────────────┐
 │  FILTRE DE CAPTURE (BPF)                  │  décide ce qui est ENREGISTRÉ
 │   ex tcpdump: host 1.2.3.4 and port 443   │  (irréversible : non capturé = perdu)
 └───────────────────┬──────────────────────┘
                     ▼   fichier .pcap
 ┌──────────────────────────────────────────┐
 │  FILTRE D'AFFICHAGE (Wireshark)           │  décide ce qui est MONTRÉ
 │   ex: tls.handshake.type == 1             │  (réversible : tout reste dans le .pcap)
 └──────────────────────────────────────────┘
\`\`\`
Les **syntaxes diffèrent** : BPF \`tcp port 443\` vs affichage Wireshark \`tcp.port == 443\`.

### Capturer en CLI

\`\`\`bash
# Lister les interfaces, puis capturer le trafic d'un hôte vers un fichier :
sudo tcpdump -D
sudo tcpdump -i any -n -w capture.pcap host example.com
#   -i any : toutes interfaces   -n : pas de résolution DNS (plus rapide/lisible)
#   -w     : écrit un .pcap (à ouvrir dans Wireshark)

# Lecture/résumé en CLI :
sudo tcpdump -n -r capture.pcap 'tcp[tcpflags] & tcp-syn != 0'
#   IP 192.168.1.20.52344 > 93.184.x.x.443: Flags [S], seq 12345      ← le SYN
#   IP 93.184.x.x.443 > 192.168.1.20.52344: Flags [S.], seq 67890     ← le SYN/ACK
\`\`\`

### Filtres d'affichage Wireshark utiles

\`\`\`
 tcp.flags.syn == 1 && tcp.flags.ack == 0   → repérer les débuts de connexion
 dns                                        → isoler les échanges DNS
 http.request                               → voir les requêtes HTTP en clair
 tls.handshake.type == 1                    → trouver le ClientHello
 ip.addr == 93.184.x.x                      → tout le trafic d'un hôte
\`\`\`
Clic droit sur un paquet → **Follow TCP Stream** : reconstitue toute la conversation d'une connexion (lisible en clair si non chiffrée).

### La leçon sécu : le chiffrement décide ce que tu vois

\`\`\`
 HTTP (clair)  → Follow TCP Stream montre la requête ENTIÈRE, mot de passe inclus
 HTTPS (TLS)   → tu vois le handshake et le SNI, mais le contenu = octets chiffrés illisibles
 DNS clair     → tu lis tous les noms résolus ; DoH/DoT → chiffré
\`\`\`
C'est la justification concrète de toute la leçon TLS.

### 🔒 Cadre légal
- **Capture UNIQUEMENT sur TON réseau / tes machines / ton lab.** Sniffer le trafic d'autrui (wifi partagé, réseau d'entreprise sans mandat) est un délit (France : art. 226-15, 323-1 et s.).
- **Le but est défensif/pédagogique** : voir ce qui fuite pour le corriger (forcer TLS, DoH).
- **Réflexe défensif** : chiffrer tout (TLS partout, DoH/DoT), segmenter le réseau, et savoir détecter un sniffer (interface en mode promiscuous, ARP suspect).

### ⚠️ Pièges
- **Filtre de capture vs d'affichage : syntaxes différentes.** \`tcp port 443\` (BPF) ≠ \`tcp.port == 443\` (Wireshark). Les mélanger = "aucun paquet".
- **Sur un switch, tu ne vois que TON trafic.** Le switch n'envoie pas le trafic des autres à ton port (sauf port mirroring / SPAN) — c'est normal, pas un bug.
- **Capturer sans filtre noie tout.** Sur une interface active, des milliers de paquets/s ; filtre dès la capture.
- **TLS ne déchiffre pas tout seul.** Wireshark ne lit le contenu HTTPS que si tu lui fournis les clés de session (variable \`SSLKEYLOGFILE\`) — en lab uniquement.
`,

  "network-scanning-nmap": `## nmap, c'est frapper à toutes les portes pour voir lesquelles s'ouvrent

Avant d'attaquer (ou de défendre) un hôte, on dresse sa **carte** : quelles portes (ports) sont ouvertes, quel service écoute derrière, quelle version. nmap est l'outil de référence. Mais frapper aux portes de quelqu'un sans permission, c'est de l'effraction — d'où le rappel **avant toute commande** : on ne scanne QUE ce qu'on a le droit de scanner.

### 🔒 Cadre légal (à lire en premier)
- **Cibles autorisées UNIQUEMENT** : \`scanme.nmap.org\` (fourni exprès par le projet nmap pour s'entraîner), ta propre machine (\`127.0.0.1\`), ton réseau, ou une VM en lab isolé.
- **Jamais un tiers sans autorisation écrite.** En France : art. 323-1 et s. du Code pénal (accès/maintien frauduleux). Un simple scan peut être qualifié.
- **La règle d'or du pentester : le scope avant le scan.** On définit par écrit ce qui est autorisé, *avant* de lancer quoi que ce soit.
- **Côté défense** : un scan est détectable (IDS/IPS, logs de connexions, pics de SYN). Comprendre le scan sert à le repérer chez soi.

### Découverte d'hôtes (ping scan)

\`\`\`bash
nmap -sn scanme.nmap.org        # "qui est up ?" sans scanner les ports
nmap -sn 192.168.1.0/24         # balaye TON sous-réseau local
\`\`\`

### Scan de ports : -sT vs -sS (le cœur)

\`\`\`
 -sT  CONNECT scan (handshake COMPLET, pas besoin de root) :
     nmap  ── SYN ──►  cible
     nmap  ◄ SYN/ACK   cible        port ouvert
     nmap  ── ACK ──►  cible        ← handshake FINI → loggé par la cible (bruyant)

 -sS  SYN scan / "half-open" (furtif, nécessite root) :
     nmap  ── SYN ──►  cible
     nmap  ◄ SYN/ACK   cible        port ouvert
     nmap  ── RST ──►  cible        ← coupe AVANT de finir → souvent non loggé (furtif)
\`\`\`

\`\`\`bash
nmap scanme.nmap.org            # scan par défaut (top 1000 ports TCP)
sudo nmap -sS scanme.nmap.org   # SYN scan (root requis)
nmap -p 22,80,443 scanme.nmap.org   # ports précis
nmap -sV scanme.nmap.org        # + détection de VERSION des services
sudo nmap -O scanme.nmap.org    # + empreinte de l'OS
\`\`\`

### Lire les états (à la lumière des firewalls)

\`\`\`
 PORT     STATE     SERVICE   ← état                interprétation
 22/tcp   open      ssh        SYN→SYN/ACK           un service écoute
 80/tcp   open      http       SYN→SYN/ACK           un service écoute
 25/tcp   closed    smtp       SYN→RST               hôte vivant, pas de service
 23/tcp   filtered  telnet     SYN→(silence)         un firewall DROP la sonde
\`\`\`
- **open** = service écoute.
- **closed** = pas de service mais l'hôte répond (RST).
- **filtered** = firewall avale la sonde → nmap ne peut pas conclure.

C'est exactement le lien avec la leçon TCP (flags) et NAT/firewalls.

### Le "ne te fie pas au ping"

\`\`\`bash
nmap -Pn cible    # saute la découverte ICMP (utile si la cible filtre le ping mais a des ports ouverts)
\`\`\`

### ⚠️ Pièges
- **\`filtered\` n'est pas \`closed\`.** filtered = firewall silencieux ; closed = RST actif. Conclure "fermé" sur du filtered est faux.
- **-sS nécessite root** (forge des paquets bruts) ; sans privilèges, nmap retombe sur -sT.
- **Un scan agressif est intrusif et détectable.** \`-T5\`, \`-A\` font du bruit et peuvent perturber des services fragiles. En vrai engagement, on adapte la furtivité au scope.
- **Le scan UDP (-sU) est lent et ambigu.** Pas de handshake UDP → "open|filtered" fréquent ; ne t'attends pas à la netteté du TCP.
`,

  "netcat": `## netcat, c'est un fil électrique entre deux sockets

Si TCP/sockets restaient abstraits, netcat les rend tangibles : tu ouvres un tube brut entre deux machines et tu y verses ce que tu veux — du texte, du HTTP tapé à la main, un fichier. Pas de protocole imposé, pas de chiffrement, pas de magie. C'est "le couteau suisse réseau" : parfait pour *comprendre* une socket en l'utilisant à la main, et pour tester n'importe quel service.

### Écouter d'un côté, se connecter de l'autre

\`\`\`
 TERMINAL A (serveur)              TERMINAL B (client)
   nc -l 4444                        nc 127.0.0.1 4444
   "écoute sur le port 4444"         "connecte-toi à A:4444"
        ▲                                  │
        └──────── socket TCP brute ────────┘
   tape un texte d'un côté → il apparaît de l'autre (mini-chat bidirectionnel)
\`\`\`

\`\`\`bash
# Serveur (écoute) :
nc -l 4444            # certains nc : nc -l -p 4444 ; ncat -l 4444
# Client (depuis un autre terminal) :
nc 127.0.0.1 4444
# Tape des lignes des deux côtés : c'est un chat sur une socket TCP en clair.
\`\`\`

### Parler un protocole "à la main"

Puisque netcat n'impose rien, tu peux taper toi-même la requête HTTP (et voir que c'est juste du texte) :

\`\`\`bash
printf 'GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' \\
  | nc example.com 80
#   HTTP/1.1 200 OK
#   Content-Type: text/html
#   ...   ← le serveur répond, tu as parlé HTTP sans navigateur ni curl
\`\`\`

Pareil pour tester un SMTP, un Redis, n'importe quel protocole texte.

### Transférer un fichier

\`\`\`
 RÉCEPTEUR :  nc -l 4444 > recu.txt        ← écoute et écrit ce qu'il reçoit
 ÉMETTEUR  :  nc 127.0.0.1 4444 < envoi.txt ← envoie le contenu du fichier
\`\`\`

\`\`\`bash
# Récepteur :
nc -l 4444 > recu.txt
# Émetteur (autre terminal) :
nc 127.0.0.1 4444 < envoi.txt
# diff envoi.txt recu.txt   → identiques : tu as transféré sur une socket brute
\`\`\`

### Vérifier rapidement si un port répond

\`\`\`bash
nc -vz 127.0.0.1 22        # -z : juste tester (scan d'un port), -v : verbeux
#   Connection to 127.0.0.1 22 port [tcp/ssh] succeeded!
nc -u 1.1.1.1 53           # -u : UDP (ex. tester un service DNS)
\`\`\`

### 🔒 Cadre légal
- **Sur TES propres machines / loopback / lab local UNIQUEMENT.** netcat est *dual-use* : utile en debug, mais une écoute ouverte ou un transfert vers un hôte tiers sans accord peut être abusif/illégal.
- **Tout passe en CLAIR** : ne fais jamais transiter de secret réel via netcat (mot de passe, clé). Pour du chiffré, utilise \`ncat --ssl\` ou \`openssl s_client\` — toujours en lab.
- **Réflexe défensif** : une écoute netcat inattendue sur un serveur est un signal d'alerte (backdoor possible) ; sache repérer un \`nc -l\` qui traîne dans \`ss -tlnp\`.

### ⚠️ Pièges
- **Plusieurs variantes incompatibles.** GNU netcat, BSD nc (macOS), \`ncat\` (projet nmap) ont des options différentes (\`-l -p\` vs \`-l\`). En cas de doute, \`ncat\` est le plus prévisible.
- **netcat ne chiffre RIEN.** Capture-le toi-même au tcpdump : tu lis tout (c'est l'exo qui démontre la valeur de TLS).
- **Une écoute ne se ferme pas toujours seule.** Selon la variante, le \`nc -l\` peut rester ouvert après déconnexion (\`-k\` pour rester en écoute) — pense à le tuer.
- **Port < 1024 = root requis** pour écouter, comme tout service.
`,
};
