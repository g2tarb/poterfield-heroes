import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

/**
 * M01 — Réseau & Protocoles (du paquet au TLS).
 *
 * Réécriture complète de l'ancien "Comment fonctionne le web" pour une
 * orientation offensive-security / bas niveau réseau. L'ID est conservé
 * (m01-comment-fonctionne-le-web) car d'autres fichiers de seed et le
 * chaînage des modules le référencent.
 *
 * Particularités :
 * - moduleNumber: 1, phase: 1 → premier module chaîné du cursus.
 * - prereqModuleId: null → point d'entrée de la roadmap.
 * - ~16 skills : on descend sous l'abstraction "le web", jusqu'à la trame
 *   Ethernet, le 3-way handshake TCP, le handshake TLS et la capture de
 *   paquets. Les skills à teneur sécu (ARP spoofing/MITM, nmap, sniffing,
 *   netcat, attaques TLS) se répartissent networking 50 / security 50 ;
 *   tout le reste est networking 100.
 *
 * CADRE LÉGAL : tous les exercices offensifs (scan, capture, MITM) se font
 * EXCLUSIVEMENT sur des cibles que tu possèdes ou pour lesquelles tu as une
 * autorisation écrite (ton propre réseau, scanme.nmap.org, un lab local en VM).
 * Scanner / sniffer un réseau tiers sans accord est un délit (en France :
 * art. 323-1 et s. du Code pénal). Comprendre l'attaque sert à défendre.
 */
export const M01_ID = "m01-comment-fonctionne-le-web";

export const m01Module: NewModule = {
  id: M01_ID,
  moduleNumber: 1,
  phase: 1,
  title: "Réseau & Protocoles (du paquet au TLS)",
  subtitle:
    "Le socle invisible de tout ce que tu coderas — décortiqué jusqu'à la trame, pour le comprendre, le défendre et l'attaquer légalement.",
  pourquoi: `Tout ce que tu vas coder pendant les 12 prochains mois circule sur un réseau : un client ouvre une socket, fait une résolution DNS, monte une connexion TCP, négocie TLS, puis échange du HTTP. La plupart des devs traitent cette couche comme une boîte noire — ils copient des solutions sans savoir *pourquoi* ça marche, et ils sont incapables de diagnostiquer quand ça casse.

**Ce module ouvre la boîte noire.** On ne s'arrête pas à "le navigateur envoie une requête au serveur". On descend jusqu'à la trame Ethernet, l'octet de flags TCP, le ClientHello TLS. Tu apprends à *lire* le réseau avec Wireshark et tcpdump, à le *cartographier* avec nmap, à le *bricoler* avec netcat.

**Orientation sécurité offensive (cadre défensif).** Tu ne peux pas défendre ce que tu ne comprends pas. Un pare-feu, c'est de la sélection de paquets selon des règles IP/port/flags — incompréhensible sans la couche transport. Un certificat TLS, c'est une chaîne de confiance PKI — inattaquable et indéfendable sans comprendre l'asymétrique. Ce module t'apprend l'attaque (ARP spoofing, scan, sniffing, MITM) **pour la pédagogie et la défense**, sur tes propres labs uniquement.

**Le cadre légal n'est pas négociable.** Scanner ou intercepter un réseau qui ne t'appartient pas, sans autorisation écrite, est un délit. Tous les exos offensifs ici se font sur ta machine, ton réseau, une VM locale, ou des cibles publiquement autorisées (scanme.nmap.org). C'est la première règle d'un pentester : *scope* avant *scan*.

**C'est le socle de tout le reste.** Les sockets BSD que tu verras ici en concept, tu les coderas en C plus tard. Le HTTP que tu dissèques au paquet, tu le serviras avec Fastify. Le TLS que tu observes au handshake, tu le configureras en prod. Comprends le voyage du paquet une fois, et tout le reste devient lisible.`,
  objectives: [
    "Placer chaque protocole dans le modèle OSI (7 couches) et TCP/IP (4 couches)",
    "Expliquer l'encapsulation : segment → paquet → trame, et chaque PDU",
    "Décoder une trame Ethernet et expliquer le rôle de l'adresse MAC",
    "Expliquer ARP, et décrire ARP spoofing / MITM dans un cadre défensif",
    "Manipuler IPv4/IPv6, calculer un sous-réseau en CIDR (masque, broadcast, plage)",
    "Comprendre ICMP et lire un echo request/reply (ping, traceroute)",
    "Tracer le 3-way handshake TCP, les flags, les états et le teardown",
    "Distinguer TCP et UDP et choisir le bon transport selon le besoin",
    "Expliquer le modèle socket BSD (ports, bind, listen, accept, connect)",
    "Détailler la résolution DNS récursive vs itérative, les types d'enregistrements, DoH",
    "Comparer HTTP/1.1, HTTP/2 (multiplexing) et HTTP/3 (QUIC sur UDP)",
    "Lire une requête / réponse HTTP brute et ses en-têtes",
    "Décortiquer le handshake TLS, les certificats, la chaîne de confiance et la PKI",
    "Expliquer le NAT et le filtrage par pare-feu (stateful vs stateless)",
    "Capturer et lire du trafic avec Wireshark et tcpdump",
    "Cartographier un hôte autorisé avec nmap (SYN scan vs connect scan, découverte)",
    "Utiliser netcat pour écouter, se connecter et transférer des données",
  ],
  prerequisites:
    "Aucun. Premier module du cursus. Un terminal Unix (macOS/Linux) et un accès admin local pour installer Wireshark/nmap. Curiosité et respect strict du cadre légal requis.",
  estimatedHours: 60,
  estimatedWeeks: 4,
  stackAllowed: [
    "Terminal (dig, nslookup, host, traceroute/tracert, ping, curl, ss, netstat, ip/ifconfig, arp)",
    "Wireshark (capture & analyse graphique)",
    "tcpdump (capture CLI)",
    "nmap (découverte & scan de ports — cibles autorisées uniquement)",
    "netcat / ncat (écoute, connexion, transfert)",
    "Chrome DevTools (onglet Network, Security)",
    "OpenSSL (s_client pour inspecter un handshake/certificat TLS)",
  ],
  prereqModuleId: null,
  unlockSrsMatureRatio: 80,
};

export const m01Skills: NewSkill[] = [
  {
    moduleId: M01_ID,
    slug: "osi-tcpip-models",
    label: "Modèles OSI (7 couches) et TCP/IP (4 couches)",
    description:
      "Les 7 couches OSI (physique, liaison, réseau, transport, session, présentation, application) vs les 4 couches TCP/IP (accès réseau, internet, transport, application). À quelle couche vit chaque protocole. Pourquoi le découpage en couches rend le réseau remplaçable couche par couche.",
    displayOrder: 1,
    weight: 3,
    prereqSkillSlugs: [],
  },
  {
    moduleId: M01_ID,
    slug: "encapsulation-pdu",
    label: "Encapsulation, désencapsulation et PDU",
    description:
      "Comment la donnée descend la pile : données → segment (TCP) → paquet/datagramme (IP) → trame (Ethernet) → bits. Chaque couche ajoute son en-tête (PDU). Le chemin inverse en réception. Le concept clé pour lire n'importe quelle capture.",
    displayOrder: 2,
    weight: 3,
    prereqSkillSlugs: ["osi-tcpip-models"],
  },
  {
    moduleId: M01_ID,
    slug: "ethernet-arp",
    label: "Ethernet, adresse MAC et ARP (+ ARP spoofing défensif)",
    description:
      "La trame Ethernet, l'adresse MAC (48 bits, unicité OUI), le switch et sa table CAM. ARP : résoudre une IP locale en MAC. Le risque : ARP spoofing / cache poisoning → attaque MITM (man-in-the-middle). Cadrage strictement DÉFENSIF/pédagogique : comprendre l'attaque pour la détecter (arpwatch, entrées statiques, DAI).",
    displayOrder: 3,
    weight: 3,
    prereqSkillSlugs: ["encapsulation-pdu"],
  },
  {
    moduleId: M01_ID,
    slug: "ipv4-ipv6-subnetting",
    label: "IPv4 / IPv6 et sous-réseaux (CIDR)",
    description:
      "Structure d'une IPv4 (32 bits) et d'une IPv6 (128 bits). Adresses privées (RFC 1918) vs publiques. Notation CIDR (/24), masque de sous-réseau, calcul de l'adresse réseau, du broadcast et de la plage d'hôtes. Pourquoi IPv6 et son écriture abrégée.",
    displayOrder: 4,
    weight: 3,
    prereqSkillSlugs: ["osi-tcpip-models"],
  },
  {
    moduleId: M01_ID,
    slug: "icmp-diagnostics",
    label: "ICMP : ping, traceroute et diagnostics",
    description:
      "ICMP comme protocole de signalisation de la couche réseau. Echo request/reply (ping). Time Exceeded et le mécanisme du TTL exploité par traceroute. Destination Unreachable. Pourquoi certains hôtes/firewalls bloquent l'ICMP.",
    displayOrder: 5,
    weight: 2,
    prereqSkillSlugs: ["ipv4-ipv6-subnetting"],
  },
  {
    moduleId: M01_ID,
    slug: "tcp-handshake-states",
    label: "TCP : handshake 3-way, flags, états et teardown",
    description:
      "Le 3-way handshake (SYN → SYN/ACK → ACK), les flags (SYN, ACK, FIN, RST, PSH, URG), les numéros de séquence/acquittement, la machine à états (LISTEN, SYN_SENT, ESTABLISHED, FIN_WAIT, TIME_WAIT…), le teardown (FIN/ACK) et le RST. La fiabilité : retransmission, contrôle de flux (fenêtre), contrôle de congestion.",
    displayOrder: 6,
    weight: 3,
    prereqSkillSlugs: ["encapsulation-pdu", "ipv4-ipv6-subnetting"],
  },
  {
    moduleId: M01_ID,
    slug: "udp-transport",
    label: "UDP : transport sans connexion",
    description:
      "UDP face à TCP : pas de handshake, pas de fiabilité, pas d'ordre, mais une latence minimale. En-tête minuscule. Cas d'usage : DNS, VoIP, jeux, QUIC/HTTP3. Quand la perte d'un paquet est acceptable vs quand elle ne l'est pas.",
    displayOrder: 7,
    weight: 2,
    prereqSkillSlugs: ["tcp-handshake-states"],
  },
  {
    moduleId: M01_ID,
    slug: "ports-sockets",
    label: "Ports et sockets (modèle BSD)",
    description:
      "Le port comme multiplexeur de la couche transport (0-65535, well-known/registered/ephemeral). Le socket comme abstraction (IP, port). Le modèle BSD côté serveur (socket/bind/listen/accept) et client (socket/connect). Concept ici, implémentation en C dans un module ultérieur.",
    displayOrder: 8,
    weight: 2,
    prereqSkillSlugs: ["tcp-handshake-states", "udp-transport"],
  },
  {
    moduleId: M01_ID,
    slug: "dns-deep",
    label: "DNS approfondi : récursif/itératif, enregistrements, DoH",
    description:
      "La hiérarchie root → TLD → autoritatif. Résolution récursive (resolver) vs itérative (serveurs). Types d'enregistrements (A, AAAA, CNAME, MX, NS, TXT, SOA, PTR). TTL et cache. DNS over HTTPS (DoH) / DNS over TLS (DoT) et le compromis vie privée. Lecture d'un `dig` complet section par section.",
    displayOrder: 9,
    weight: 3,
    prereqSkillSlugs: ["ports-sockets", "udp-transport"],
  },
  {
    moduleId: M01_ID,
    slug: "http-versions",
    label: "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)",
    description:
      "HTTP/1.1 : texte, keep-alive, head-of-line blocking. HTTP/2 : binaire, multiplexing sur une connexion, compression d'en-têtes (HPACK), server push. HTTP/3 : QUIC sur UDP, suppression du HOL blocking TCP, handshake fusionné avec TLS 1.3. Pourquoi chaque saut.",
    displayOrder: 10,
    weight: 2,
    prereqSkillSlugs: ["tcp-handshake-states", "udp-transport"],
  },
  {
    moduleId: M01_ID,
    slug: "http-anatomy",
    label: "Anatomie d'une requête / réponse HTTP",
    description:
      "Ligne de requête (méthode, URI, version), en-têtes (Host, User-Agent, Accept, Cookie, Content-Type…), corps. Ligne de statut et codes (1xx-5xx). En-têtes de réponse clés. Méthodes (GET, POST, PUT, DELETE, HEAD, OPTIONS). Lecture d'une requête brute via `curl -v`.",
    displayOrder: 11,
    weight: 2,
    prereqSkillSlugs: ["http-versions"],
  },
  {
    moduleId: M01_ID,
    slug: "tls-pki",
    label: "TLS : handshake, certificats, chaîne de confiance, PKI",
    description:
      "Pourquoi TLS (confidentialité, intégrité, authentification). Le handshake (ClientHello/ServerHello, négociation de cipher suite, échange de clés ECDHE, dérivation des clés). Cryptographie asymétrique vs symétrique. Certificat X.509, chaîne de confiance, autorités de certification (CA), PKI. Attaques abordées : MITM sur HTTP clair, stripping, certificat invalide — d'où l'intérêt de la teneur sécu.",
    displayOrder: 12,
    weight: 3,
    prereqSkillSlugs: ["http-anatomy", "tcp-handshake-states"],
  },
  {
    moduleId: M01_ID,
    slug: "nat-firewalls",
    label: "NAT et pare-feux",
    description:
      "NAT : pourquoi (pénurie IPv4), comment (réécriture IP/port, table de traduction), conséquences (pas joignable de l'extérieur sans port forwarding). Pare-feu : filtrage stateless (par paquet) vs stateful (suivi de connexion). Règles par IP/port/flags. Lien direct avec ce qu'un scan révèle.",
    displayOrder: 13,
    weight: 2,
    prereqSkillSlugs: ["ipv4-ipv6-subnetting", "ports-sockets"],
  },
  {
    moduleId: M01_ID,
    slug: "packet-analysis",
    label: "Analyse de paquets : Wireshark & tcpdump",
    description:
      "Capturer du trafic en CLI (tcpdump) et en GUI (Wireshark). Filtres de capture (BPF) vs filtres d'affichage. Suivre un flux TCP, repérer un handshake, lire un échange DNS, isoler du HTTP. Lire un .pcap. Teneur sécu : le sniffing révèle tout ce qui n'est pas chiffré — d'où l'importance de TLS. Capture sur TON réseau uniquement.",
    displayOrder: 14,
    weight: 3,
    prereqSkillSlugs: ["encapsulation-pdu", "tcp-handshake-states", "dns-deep"],
  },
  {
    moduleId: M01_ID,
    slug: "network-scanning-nmap",
    label: "Scan réseau avec nmap (cadre légal)",
    description:
      "Découverte d'hôtes (ping scan) et de ports. TCP connect scan (-sT, handshake complet) vs SYN scan (-sS, half-open, furtif). Détection de services (-sV) et d'OS (-O). Interprétation des états (open/closed/filtered) à la lumière des pare-feux. CADRE LÉGAL strict : scanme.nmap.org, ton réseau, ou un lab en VM — jamais un tiers sans autorisation écrite.",
    displayOrder: 15,
    weight: 3,
    prereqSkillSlugs: ["tcp-handshake-states", "ports-sockets", "nat-firewalls"],
  },
  {
    moduleId: M01_ID,
    slug: "netcat",
    label: "netcat : écoute, connexion, transfert",
    description:
      "Le couteau suisse réseau. Écouter sur un port (-l), se connecter à un service, parler HTTP/SMTP à la main, transférer un fichier, monter un mini chat client/serveur. Comprendre concrètement une socket en interactif. Cadre légal : sur tes propres machines / lab local uniquement.",
    displayOrder: 16,
    weight: 2,
    prereqSkillSlugs: ["ports-sockets", "tcp-handshake-states"],
  },
];

// =============================================================
// SKILL ↔ MASTERY AXES
// Par défaut : networking 100. Les skills à teneur sécurité (ARP/MITM,
// sniffing, scan nmap, netcat, TLS+attaques) se répartissent
// networking 50 / security 50.
// Axes valides : networking, shell_systems, c_lowlevel, algorithms, python, security.
// =============================================================
const M01_SECURITY_SLUGS = new Set<string>([
  "ethernet-arp", // ARP spoofing / MITM
  "tls-pki", // attaques MITM / stripping / certificat invalide
  "packet-analysis", // sniffing
  "network-scanning-nmap", // scan offensif
  "netcat", // outil dual-use
]);

export const m01SkillAxisRules: Array<{
  skillSlug: string;
  axisId: string;
  contribution: number;
}> = m01Skills.flatMap((s) =>
  M01_SECURITY_SLUGS.has(s.slug)
    ? [
        { skillSlug: s.slug, axisId: "networking", contribution: 50 },
        { skillSlug: s.slug, axisId: "security", contribution: 50 },
      ]
    : [{ skillSlug: s.slug, axisId: "networking", contribution: 100 }],
);

// IDs YouTube vérifiés au mieux ; si pas sûr d'un ID, youtubeId: null +
// externalUrl (recherche/playlist YouTube), comme dans m00-algo.
export const m01Videos: NewVideo[] = [
  {
    moduleId: M01_ID,
    isPrimary: 1,
    title: "Networking Fundamentals (série complète)",
    creator: "Practical Networking",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/playlist?list=PLIFyRwBY_4bRLmKfP1KnZA6rZbRHtxmXi",
    language: "en",
    durationSeconds: 4 * 60 * 60,
    whyThisOne:
      "LA référence pédagogique réseau gratuite. Practical Networking construit la pile couche par couche (Ethernet → ARP → IP → TCP → DNS) avec des schémas d'une clarté rare. Le socle de tout ce module. (Playlist — vérifie l'ordre des épisodes.)",
    coversSkills: [
      "osi-tcpip-models",
      "encapsulation-pdu",
      "ethernet-arp",
      "ipv4-ipv6-subnetting",
      "tcp-handshake-states",
      "ports-sockets",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "OSI Model & TCP/IP — animations",
    creator: "PowerCert Animated Videos",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=powercert+OSI+model+explained",
    language: "en",
    durationSeconds: 11 * 60,
    whyThisOne:
      "Les animations PowerCert ancrent visuellement le modèle OSI, le NAT, le DNS et le sous-réseautage. Parfait en complément rapide après la théorie. (ID à confirmer, plusieurs vidéos pertinentes.)",
    coversSkills: ["osi-tcpip-models", "nat-firewalls", "ipv4-ipv6-subnetting"],
    displayOrder: 2,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "How DNS Works",
    creator: "Computerphile",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=computerphile+how+dns+works",
    language: "en",
    durationSeconds: 16 * 60,
    whyThisOne:
      "Computerphile explique la hiérarchie DNS et la résolution récursive avec rigueur académique mais accessible. À coupler avec un Computerphile sur TLS/HTTPS pour la couche sécu. (ID à confirmer.)",
    coversSkills: ["dns-deep", "tls-pki"],
    displayOrder: 3,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "Networking tutorials (ARP, subnetting, lab pratique)",
    creator: "NetworkChuck",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=networkchuck+networking+arp+subnetting",
    language: "en",
    durationSeconds: 20 * 60,
    whyThisOne:
      "NetworkChuck rend le réseau concret et orienté hands-on (subnetting, ARP, premiers pas sécu) avec une énergie qui motive. Idéal pour passer de la théorie au terminal. (ID à confirmer.)",
    coversSkills: ["ethernet-arp", "ipv4-ipv6-subnetting", "icmp-diagnostics"],
    displayOrder: 4,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "Le réseau expliqué simplement (FR)",
    creator: "Cookie connecté / Underscore_",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=cookie+connect%C3%A9+r%C3%A9seau+TCP+IP+DNS",
    language: "fr",
    durationSeconds: 15 * 60,
    whyThisOne:
      "Source FR pour réviser les concepts (TCP/IP, DNS, HTTP) dans ta langue après la théorie EN. Vérifie l'ID quand tu trouves une vidéo qui couvre bien la pile.",
    coversSkills: ["osi-tcpip-models", "dns-deep", "http-anatomy"],
    displayOrder: 5,
  },
];

// Les exos offensifs rappellent EXPLICITEMENT le cadre légal.
export const m01Exercises: NewExercise[] = [
  // 1) Quiz d'activation
  {
    moduleId: M01_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de plonger : tes intuitions sur le réseau",
    statement:
      "Quiz d'activation pour situer ce que tu sais déjà du réseau avant la théorie. Pas de mauvaise réponse — c'est pour calibrer.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Quand ton navigateur charge une page, qu'est-ce qui circule physiquement sur le câble/wifi ?",
        options: [
          "Le fichier HTML complet, envoyé en un bloc",
          "Des trames qui encapsulent des paquets IP qui encapsulent des segments TCP, découpés et routés saut par saut",
          "Une connexion permanente type ligne téléphonique dédiée",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "C'est tout l'objet du module : la donnée descend la pile (segment → paquet → trame), chaque couche ajoute son en-tête, et l'ensemble est routé par sauts. On va décortiquer chaque couche.",
      },
      {
        question:
          "À ton avis, à quoi sert une adresse MAC face à une adresse IP ?",
        options: [
          "Elles font la même chose, MAC c'est l'ancien nom",
          "La MAC identifie une carte réseau sur le réseau LOCAL (couche liaison) ; l'IP identifie un hôte à l'échelle d'Internet (couche réseau)",
          "La MAC chiffre, l'IP route",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "MAC = local (couche 2, résolue par ARP). IP = global (couche 3, routée). Comprendre ce duo est la clé de l'encapsulation et d'ARP.",
      },
      {
        question:
          "Tu lances un scan nmap sur un serveur qui n'est pas à toi, par curiosité. C'est :",
        options: [
          "Sans problème, scanner ne fait rien de mal",
          "Potentiellement un délit selon le pays/contexte — il faut une autorisation",
          "Légal seulement la nuit",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Règle n°1 du module : on ne scanne/sniffe QUE ce qu'on possède ou pour quoi on a une autorisation écrite (ton réseau, une VM, scanme.nmap.org). Sinon c'est un délit. Le scope avant le scan.",
      },
    ],
    skillSlugs: ["encapsulation-pdu", "ethernet-arp", "network-scanning-nmap"],
    passThresholdPct: 0,
    estimatedMinutes: 5,
    displayOrder: 1,
  },

  // 2) Quiz de vérification (seuil 80%, 8 questions)
  {
    moduleId: M01_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : as-tu intégré la pile réseau ?",
    statement:
      "Quiz post-pratique couvrant OSI/TCP-IP, encapsulation, TCP, DNS, TLS, scan et cadre légal. Seuil de passage : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Dans quel ordre la donnée est-elle encapsulée en émission (de l'application vers le câble) ?",
        options: [
          "Trame → Paquet → Segment → Données",
          "Données → Segment (TCP) → Paquet (IP) → Trame (Ethernet)",
          "Paquet → Segment → Trame → Données",
          "Segment → Trame → Paquet → Données",
        ],
        correctIndex: 1,
        explanation:
          "On descend la pile : l'app produit des données, TCP les met en segments, IP les met en paquets, Ethernet en trames. Chaque couche ajoute son en-tête (son PDU).",
      },
      {
        question: "Que fait exactement le protocole ARP ?",
        options: [
          "Il traduit un nom de domaine en IP",
          "Il résout une adresse IP locale en adresse MAC",
          "Il chiffre la couche liaison",
          "Il route les paquets entre réseaux",
        ],
        correctIndex: 1,
        explanation:
          "ARP (couche 2/3) résout IP locale → MAC. C'est ce mécanisme que l'ARP spoofing détourne pour faire du MITM — d'où l'intérêt de comprendre l'attaque pour la détecter.",
      },
      {
        question:
          "Quelle séquence de flags constitue le 3-way handshake TCP ?",
        options: [
          "SYN → ACK → FIN",
          "SYN → SYN/ACK → ACK",
          "ACK → SYN → ACK",
          "RST → SYN → ACK",
        ],
        correctIndex: 1,
        explanation:
          "SYN (client) → SYN/ACK (serveur) → ACK (client). Un SYN scan nmap (-sS) s'arrête après le SYN/ACK (half-open) pour rester furtif au lieu de finir le handshake.",
      },
      {
        question:
          "Pourquoi le DNS utilise-t-il majoritairement UDP plutôt que TCP ?",
        options: [
          "Parce qu'UDP est chiffré",
          "Parce qu'une requête DNS est petite et la rapidité (pas de handshake) prime sur la fiabilité",
          "Parce que TCP ne supporte pas le port 53",
          "Parce qu'UDP garantit l'ordre des paquets",
        ],
        correctIndex: 1,
        explanation:
          "UDP : pas de handshake, latence minimale, parfait pour une petite requête/réponse. DNS bascule sur TCP pour les grosses réponses (zone transfer, DNSSEC). DoH/DoT ajoutent le chiffrement.",
      },
      {
        question: "Qu'apporte HTTPS par rapport à HTTP ?",
        options: [
          "C'est un protocole totalement différent qui n'utilise pas TCP",
          "C'est HTTP transporté dans une session TLS : confidentialité, intégrité et authentification du serveur",
          "Uniquement de la vitesse",
          "Un autre format de cookies",
        ],
        correctIndex: 1,
        explanation:
          "HTTPS = HTTP sur TLS. Le handshake TLS négocie une cipher suite, échange des clés (ECDHE) et valide le certificat via la chaîne de confiance (PKI). Sans TLS, le sniffing révèle tout en clair.",
      },
      {
        question:
          "En CIDR, combien d'adresses d'hôtes utilisables compte un réseau /24 ?",
        options: ["256", "254", "255", "512"],
        correctIndex: 1,
        explanation:
          "/24 = 256 adresses totales (2^8), moins l'adresse réseau (.0) et le broadcast (.255) = 254 hôtes utilisables.",
      },
      {
        question:
          "Dans un résultat nmap, un port marqué `filtered` signifie le plus souvent :",
        options: [
          "Le service est planté",
          "Un pare-feu bloque/ignore les sondes : nmap ne peut pas conclure open ou closed",
          "Le port est ouvert et un service répond",
          "Le port n'existe pas",
        ],
        correctIndex: 1,
        explanation:
          "`filtered` = un pare-feu (stateful/stateless) drop ou rejette les sondes. `closed` = pas de service mais l'hôte répond (RST). `open` = un service écoute. Lire un scan, c'est lire les règles de filtrage.",
      },
      {
        question:
          "Tu veux t'entraîner à scanner légalement. Quelle cible est explicitement autorisée ?",
        options: [
          "Le site de ta banque",
          "scanme.nmap.org (autorisé par le projet nmap pour l'apprentissage)",
          "Une IP au hasard sur Internet",
          "Le wifi du café d'en face",
        ],
        correctIndex: 1,
        explanation:
          "scanme.nmap.org est fourni par le projet nmap pour s'entraîner. Sinon : ta machine, ton réseau, ou une VM en lab isolé. Jamais un tiers sans autorisation écrite — c'est un délit.",
      },
    ],
    skillSlugs: [
      "encapsulation-pdu",
      "ethernet-arp",
      "tcp-handshake-states",
      "udp-transport",
      "dns-deep",
      "tls-pki",
      "ipv4-ipv6-subnetting",
      "network-scanning-nmap",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 2,
  },

  // 3) Exercice pratique — disséquer DNS + TCP + TLS via curl/dig/openssl + capture
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Disséquer une requête HTTPS : DNS → TCP → TLS",
    statement: `**Objectif :** observer en vrai le voyage d'une requête HTTPS, du DNS au handshake TLS, et l'expliquer.

> **Cadre légal :** toutes ces commandes ciblent des sites publics que tu consultes normalement (example.com, wikipedia.org). Tu n'attaques rien : tu observes TON propre trafic sortant. Aucune capture sur un réseau qui n'est pas le tien.

**1. Résolution DNS**
\`\`\`bash
dig wikipedia.org A
dig wikipedia.org AAAA
dig wikipedia.org MX
dig +trace wikipedia.org   # observe la résolution itérative root → TLD → autoritatif
\`\`\`
Note dans \`reponse.md\` : l'IP renvoyée, le TTL, et explique chaque section d'un \`dig\` (QUESTION, ANSWER, AUTHORITY).

**2. Connexion TCP + requête HTTP brute**
\`\`\`bash
curl -v https://example.com -o /dev/null
\`\`\`
Repère dans la sortie : l'établissement TCP, le handshake TLS, la ligne de requête, les en-têtes envoyés et reçus, le code de statut.

**3. Handshake & certificat TLS**
\`\`\`bash
openssl s_client -connect wikipedia.org:443 -servername wikipedia.org < /dev/null
\`\`\`
Note : la version TLS négociée, la cipher suite, l'émetteur (Issuer) et le sujet (Subject) du certificat, la chaîne de certificats (qui signe qui jusqu'à la CA racine).

**4. (Optionnel, sur TON réseau) capture du handshake**
\`\`\`bash
sudo tcpdump -i any -w handshake.pcap host example.com
# dans un autre terminal : curl https://example.com
# puis Ctrl+C, ouvre handshake.pcap dans Wireshark
\`\`\`
Dans Wireshark, isole le 3-way handshake (filtre \`tcp.flags.syn==1\`) et le \`ClientHello\` (filtre \`tls.handshake.type==1\`).

**À produire dans \`reponse.md\` :**
- L'IP et le TTL de wikipedia.org
- Le rôle de chaque section d'un \`dig\`
- La version TLS et la cipher suite négociées
- La chaîne de confiance du certificat (feuille → intermédiaire → racine)
- 3 phrases : pourquoi le sniffing voit-il le DNS et le SNI mais PAS le contenu HTTP chiffré ?

**Critères de validation :**
- \`reponse.md\` complet
- Tu sais expliquer oralement les étapes DNS → TCP → TLS → HTTP
- Tu identifies la cipher suite et l'autorité de certification`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "dns-deep",
      "tcp-handshake-states",
      "tls-pki",
      "http-anatomy",
      "packet-analysis",
    ],
    passThresholdPct: 100,
    estimatedMinutes: 90,
    displayOrder: 3,
  },

  // 4) Exercice pratique — scan nmap + lecture tcpdump sur cible autorisée
  {
    moduleId: M01_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "bash",
    title: "Scan nmap + lecture de capture (cible AUTORISÉE)",
    statement: `**Objectif :** cartographier un hôte avec nmap, et corréler le scan avec une capture de paquets pour comprendre ce qui se passe au niveau TCP.

> **⚠️ CADRE LÉGAL — à lire avant toute commande :**
> - Cibles autorisées UNIQUEMENT : \`scanme.nmap.org\` (fourni par le projet nmap pour l'entraînement), ta propre machine (\`127.0.0.1\`), ou une VM dans un lab isolé.
> - **Ne scanne JAMAIS** un hôte ou un réseau tiers sans autorisation écrite. En France, c'est puni par les art. 323-1 et suivants du Code pénal.
> - Le scope avant le scan : c'est la première discipline d'un pentester.

**1. Découverte (host discovery)**
\`\`\`bash
nmap -sn scanme.nmap.org        # l'hôte est-il up ? (ping scan)
\`\`\`

**2. Scan de ports**
\`\`\`bash
nmap scanme.nmap.org            # scan par défaut (top 1000 ports TCP)
sudo nmap -sS scanme.nmap.org   # SYN scan (half-open) — nécessite root
nmap -sV scanme.nmap.org        # détection de versions de services
\`\`\`
Note dans \`scan.md\` : les ports \`open\` et le service associé, et explique la différence entre \`-sS\` (SYN/half-open) et \`-sT\` (connect, handshake complet).

**3. Corréler avec une capture (sur ta machine, ton trafic)**
\`\`\`bash
sudo tcpdump -i any -w scan.pcap host scanme.nmap.org &
nmap -p 22,80 scanme.nmap.org
# attends la fin, puis : sudo kill %1
\`\`\`
Ouvre \`scan.pcap\` dans Wireshark. Pour un port \`open\` : repère SYN → SYN/ACK. Pour un port \`closed\` : repère SYN → RST. Filtre utile : \`tcp.flags.syn==1 || tcp.flags.reset==1\`.

**4. Explique le lien**
Relie ce que nmap rapporte (open/closed/filtered) à ce que tu vois dans la capture (SYN/ACK, RST, ou aucune réponse = filtré par pare-feu).

**À produire dans \`scan.md\` :**
- La liste des ports ouverts de scanme.nmap.org + service détecté
- La différence -sS vs -sT, illustrée par ta capture
- L'explication de open / closed / filtered au niveau des flags TCP observés
- Une phrase sur la légalité : quelle cible as-tu scannée et pourquoi c'était autorisé

**Critères de validation :**
- \`scan.md\` complet, cible explicitement autorisée
- Tu corrèles correctement états nmap ↔ flags TCP dans la capture
- Tu peux expliquer pourquoi un SYN scan est plus furtif`,
    starterCode: null,
    solutionCode: null,
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
    passThresholdPct: 100,
    estimatedMinutes: 120,
    displayOrder: 4,
  },

  // 5) Projet de validation — cartographie complète + lab netcat/Wireshark
  {
    moduleId: M01_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title: "Projet : cartographier une requête HTTPS + monter un lab réseau",
    statement: `**Objectif :** prouver que tu maîtrises le voyage complet d'un paquet, de la résolution DNS à TLS, ET monter un petit lab réseau de bout en bout (client/serveur netcat observé à la capture).

> **Cadre légal :** le lab tourne entièrement sur TA machine (loopback / ton réseau local) ou une VM. Aucune cible tierce.

---

### Partie A — Cartographie d'une requête HTTPS (document)

Dans \`carte-requete.md\`, retrace le voyage complet de \`https://wikipedia.org\` :

1. **Résolution DNS** : récursif vs itératif, root → TLD → autoritatif, l'enregistrement A obtenu (preuve via \`dig +trace\`).
2. **Couche liaison/réseau** : trame Ethernet, ARP pour atteindre la passerelle, paquet IP, routage et TTL (preuve via \`traceroute\`).
3. **Couche transport** : 3-way handshake TCP vers le port 443 (séquence de flags).
4. **TLS** : ClientHello/ServerHello, cipher suite, certificat et chaîne de confiance (preuve via \`openssl s_client\`).
5. **HTTP** : requête (méthode, en-têtes), réponse (statut, en-têtes).
6. **NAT** : ce que ta box réécrit en sortie.

Inclus **un schéma** (dessin scanné ou ASCII) reliant les 6 étapes aux couches OSI.

---

### Partie B — Lab client/serveur netcat + capture

1. **Lance un serveur netcat** qui écoute :
   \`\`\`bash
   nc -l 4444        # (ou: ncat -l 4444)
   \`\`\`
2. **Connecte un client** depuis un autre terminal :
   \`\`\`bash
   nc 127.0.0.1 4444
   \`\`\`
   Tape des messages dans les deux sens : tu as un mini chat sur une socket TCP brute.
3. **Capture l'échange** pendant que ça discute :
   \`\`\`bash
   sudo tcpdump -i lo0 -w lab.pcap port 4444     # lo0 (macOS) ou lo (Linux)
   \`\`\`
4. **Analyse \`lab.pcap\` dans Wireshark** : repère le 3-way handshake, "Follow TCP Stream" pour reconstituer la conversation (en clair, car netcat ne chiffre rien), puis le teardown FIN/ACK.
5. **Bonus transfert de fichier** :
   \`\`\`bash
   nc -l 4444 > recu.txt          # récepteur
   nc 127.0.0.1 4444 < envoi.txt  # émetteur
   \`\`\`

Documente le tout dans \`lab.md\`.

---

### Critères de validation
- \`carte-requete.md\` couvre les 6 étapes avec preuves de commandes + schéma OSI
- \`lab.md\` montre le chat netcat fonctionnel et l'analyse de \`lab.pcap\`
- Tu identifies dans la capture : handshake (SYN/SYN-ACK/ACK), données en clair (Follow TCP Stream), teardown (FIN)
- Tu sais expliquer pourquoi le contenu netcat est lisible alors que le contenu HTTPS ne l'est pas (= valeur de TLS)
- Tu peux réexpliquer oralement tout le voyage à quelqu'un, sans notes

**Durée estimée :** 8-12h sur la dernière semaine du module.`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "osi-tcpip-models",
      "encapsulation-pdu",
      "ethernet-arp",
      "dns-deep",
      "tcp-handshake-states",
      "tls-pki",
      "nat-firewalls",
      "packet-analysis",
      "netcat",
    ],
    passThresholdPct: 100,
    estimatedMinutes: 10 * 60,
    displayOrder: 5,
  },
];
