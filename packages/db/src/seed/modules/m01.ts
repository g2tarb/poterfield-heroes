import type {
  NewModule,
  NewSkill,
  NewSkillAxis,
  NewVideo,
  NewExercise,
} from "../../schema/content.js";

// Helper IDs (slugs) so we can reference skills across tables.
export const M01_ID = "m01-comment-fonctionne-le-web";

export const m01Module: NewModule = {
  id: M01_ID,
  moduleNumber: 1,
  phase: 1,
  title: "Comment fonctionne le web",
  subtitle:
    "Tout ce que tu vas coder pendant 12 mois s'appuie sur ce socle invisible.",
  pourquoi:
    "Tout ce que tu vas coder pendant les 12 prochains mois s'appuie sur le même socle invisible : un client envoie une requête HTTP à un serveur via TCP/IP, après une résolution DNS, et reçoit une réponse. Si tu ne comprends pas ce voyage, tu seras un dev qui copie des solutions sans savoir pourquoi elles marchent. Ce module pose la fondation conceptuelle de tout le reste.",
  objectives: [
    "Expliquer la différence entre internet et le web",
    "Décrire le modèle client/serveur en 30 secondes",
    "Lister les couches du modèle TCP/IP (4 couches) et OSI (7 couches)",
    "Tracer le voyage d'une requête https://google.com étape par étape",
    "Comprendre adresse IP (v4/v6), adresse MAC, port",
    "Expliquer le DNS et la résolution récursive vs itérative",
    "Distinguer HTTP/1.1, HTTP/2, HTTP/3",
    "Lire une requête HTTP brute et une réponse",
    "Comprendre HTTPS, TLS, certificats SSL et autorités de certification",
    "Utiliser les DevTools Chrome (Network) pour inspecter une page",
    "Comprendre FAI, routeur, switch, passerelle",
    "Différencier hébergement, nom de domaine, registrar",
  ],
  prerequisites: "Aucun. Curiosité requise.",
  estimatedHours: 12,
  estimatedWeeks: 1,
  stackAllowed: ["Chrome DevTools", "Terminal natif (nslookup, dig, traceroute, curl)"],
  prereqModuleId: null,
  unlockSrsMatureRatio: 80,
};

export const m01Skills: NewSkill[] = [
  {
    moduleId: M01_ID,
    slug: "internet-vs-web",
    label: "Distinguer Internet (infrastructure) et Web (service)",
    displayOrder: 1,
    weight: 1,
  },
  {
    moduleId: M01_ID,
    slug: "client-server-model",
    label: "Décrire le modèle client / serveur",
    displayOrder: 2,
    weight: 1,
  },
  {
    moduleId: M01_ID,
    slug: "tcp-ip-layers",
    label: "Maîtriser les 4 couches TCP/IP et 7 couches OSI",
    displayOrder: 3,
    weight: 2,
  },
  {
    moduleId: M01_ID,
    slug: "request-journey",
    label: "Tracer le voyage complet d'une requête HTTPS",
    displayOrder: 4,
    weight: 3,
  },
  {
    moduleId: M01_ID,
    slug: "ip-mac-port",
    label: "Comprendre IP, MAC, port, URL",
    displayOrder: 5,
    weight: 2,
  },
  {
    moduleId: M01_ID,
    slug: "dns-resolution",
    label: "Expliquer la résolution DNS hiérarchique",
    displayOrder: 6,
    weight: 2,
  },
  {
    moduleId: M01_ID,
    slug: "http-versions",
    label: "Distinguer HTTP/1.1, HTTP/2, HTTP/3",
    displayOrder: 7,
    weight: 1,
  },
  {
    moduleId: M01_ID,
    slug: "http-anatomy",
    label: "Lire une requête / réponse HTTP brute",
    displayOrder: 8,
    weight: 2,
  },
  {
    moduleId: M01_ID,
    slug: "https-tls",
    label: "Comprendre HTTPS, TLS, certificats, CA",
    displayOrder: 9,
    weight: 2,
  },
  {
    moduleId: M01_ID,
    slug: "devtools-network",
    label: "Utiliser DevTools (onglet Network) pour inspecter",
    displayOrder: 10,
    weight: 1,
  },
  {
    moduleId: M01_ID,
    slug: "network-hardware",
    label: "Distinguer FAI, routeur, switch, passerelle",
    displayOrder: 11,
    weight: 1,
  },
  {
    moduleId: M01_ID,
    slug: "domain-vs-hosting",
    label: "Différencier hébergement, nom de domaine, registrar",
    displayOrder: 12,
    weight: 1,
  },
];

// Skill -> Mastery axes (all M01 skills are 100% "fundamentals")
export const m01SkillAxisRules: Array<{
  skillSlug: string;
  axisId: string;
  contribution: number;
}> = m01Skills.map((s) => ({
  skillSlug: s.slug,
  axisId: "fundamentals",
  contribution: 100,
}));

export const m01Videos: NewVideo[] = [
  {
    moduleId: M01_ID,
    isPrimary: 1,
    title: "How does the internet work? (Full Course)",
    creator: "freeCodeCamp.org / Ian Frost",
    youtubeId: "zN8YNNHcaZc",
    language: "en",
    durationSeconds: 1 * 60 * 60 + 57 * 60,
    whyThisOne:
      "Meilleure vidéo gratuite from scratch sur le sujet. Ian Frost dessine tout au tableau, accessible total débutant.",
    coversSkills: [
      "internet-vs-web",
      "client-server-model",
      "tcp-ip-layers",
      "ip-mac-port",
      "network-hardware",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "What happens when you type a URL into your browser?",
    creator: "ByteByteGo",
    youtubeId: "AlkDbnbv7dk",
    language: "en",
    durationSeconds: 4 * 60,
    whyThisOne:
      "Couvre le pipeline complet (URL → DNS → TCP → TLS → HTTP → rendering). Question d'entretien tech permanente.",
    coversSkills: ["request-journey", "https-tls", "dns-resolution"],
    displayOrder: 2,
  },
  {
    moduleId: M01_ID,
    isPrimary: 0,
    title: "What happens when you type google.com (Detailed Analysis)",
    creator: "Hussein Nasser",
    youtubeId: "dh406O2v_1c",
    language: "en",
    durationSeconds: 22 * 60,
    whyThisOne:
      "Pipeline complet en profondeur par un ingénieur backend très carré. Hussein détaille avec cas concrets.",
    coversSkills: ["request-journey", "http-anatomy", "dns-resolution"],
    displayOrder: 3,
  },
];

export const m01Exercises: NewExercise[] = [
  // Quiz d'activation (avant pratique)
  {
    moduleId: M01_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de regarder : qu'est-ce que tu sais déjà ?",
    statement:
      "Petit quiz d'activation pour situer ton niveau actuel avant la vidéo principale. Pas de mauvaise réponse — c'est juste pour calibrer.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "À ton avis, qu'est-ce qui voyage entre ton navigateur et le serveur Wikipedia quand tu charges une page ?",
        options: [
          "Des fichiers HTML complets envoyés d'un coup",
          "Des paquets de données découpés qui transitent par plusieurs routeurs",
          "Une connexion permanente comme un appel téléphonique",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Les données sont fragmentées en paquets (TCP/IP) qui traversent l'infrastructure mondiale par sauts successifs.",
      },
      {
        question: "Que penses-tu que fait le DNS exactement ?",
        options: [
          "Il accélère les pages web",
          "Il traduit un nom de domaine en adresse IP",
          "Il chiffre les communications",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "DNS = annuaire mondial qui traduit `wikipedia.org` en `198.35.26.96`. Avant ça, ton navigateur ne sait pas où aller.",
      },
    ],
    skillSlugs: ["request-journey", "dns-resolution"],
    passThresholdPct: 0, // activation: pas de seuil
    estimatedMinutes: 5,
    displayOrder: 1,
  },
  // Quiz de vérification (après pratique)
  {
    moduleId: M01_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : as-tu intégré ?",
    statement:
      "Quiz post-pratique sur les concepts du carnet. Seuil de passage : 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question: "Quelle est la différence entre HTTP et HTTPS ?",
        options: [
          "HTTPS est un protocole différent de HTTP",
          "HTTPS = HTTP au-dessus de TLS (chiffrement et authentification du serveur)",
          "HTTPS est plus rapide",
          "HTTPS n'utilise pas TCP",
        ],
        correctIndex: 1,
        explanation:
          "HTTPS n'est pas un protocole différent : c'est HTTP qui passe à travers une couche TLS pour le chiffrement.",
      },
      {
        question: "Que signifie un status code 301 ?",
        options: [
          "Erreur serveur",
          "Non autorisé",
          "Redirection permanente",
          "Service indisponible",
        ],
        correctIndex: 2,
        explanation:
          "301 = Moved Permanently. 401 = Unauthorized. 503 = Service Unavailable.",
      },
      {
        question:
          "Pourquoi y a-t-il plusieurs niveaux de DNS (root, TLD, authoritative) ?",
        options: [
          "Pour rendre Internet plus lent",
          "Pour distribuer la charge et déléguer la responsabilité",
          "Pour chiffrer les requêtes",
          "Pour éviter les hackers",
        ],
        correctIndex: 1,
        explanation:
          "Hiérarchie = scalabilité. Le root délègue aux TLD (.com, .fr), qui délèguent aux serveurs autoritatifs du domaine.",
      },
    ],
    skillSlugs: ["http-versions", "http-anatomy", "https-tls", "dns-resolution"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 2,
  },
  // Exercice pratique : projet de validation
  {
    moduleId: M01_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title: "Décortique 3 pages web (projet de validation)",
    statement: `Choisir 3 sites différents (simple type example.com, moyen type wikipedia.org, complexe type twitter.com) et produire un document d'analyse.

**À faire pour chaque site :**

1. Ouvrir Chrome DevTools (F12) → Network → recharger (Ctrl+Shift+R)
2. Documenter dans \`analyse-sites.md\` :
   - Nombre total de requêtes HTTP
   - Taille totale transférée
   - Temps de chargement total
   - Première requête : URL, méthode, status code, content-type
   - 5 headers de réponse de la page principale + ce qu'ils font
3. En CLI pour chaque domaine :
   - \`nslookup [domaine]\` → noter l'IP
   - \`dig [domaine]\` → expliquer chaque section
   - \`traceroute [domaine]\` → compter les sauts
4. Dessiner à la main (stylo, carnet) le voyage complet d'une requête https://wikipedia.org

**Critères de validation :**
- analyse-sites.md complet pour 3 sites
- Tu sais expliquer oralement à un proche non-tech ce que fait chaque commande
- Schéma au stylo couvre les 6 étapes : DNS → TCP → TLS → HTTP req → HTTP resp → rendering`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["request-journey", "devtools-network", "dns-resolution"],
    passThresholdPct: 100, // auto-déclaratif après review coach
    estimatedMinutes: 4 * 60,
    displayOrder: 3,
  },
];
