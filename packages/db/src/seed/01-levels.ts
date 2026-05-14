import type { NewLevel } from "../schema/content.js";

export const levelsSeed: NewLevel[] = [
  {
    id: 1,
    slug: "init",
    name: "Init",
    icon: "🌱",
    xpRequired: 0,
    description: "Point de départ. Curieux, motivé, rien d'autre.",
    projectExamples: [
      "Lire des tutos",
      "Suivre des YouTubers tech",
      "Installer son setup",
    ],
  },
  {
    id: 2,
    slug: "coder-debutant",
    name: "Coder débutant",
    icon: "🌿",
    xpRequired: 200,
    description:
      "Web, terminal, Git, environnement de dev maîtrisés. Première autonomie.",
    projectExamples: [
      "Scripts shell utiles au quotidien",
      "Automatisation de l'organisation des fichiers",
      "Premier site GitHub Pages",
    ],
  },
  {
    id: 3,
    slug: "frontend-novice",
    name: "Frontend novice",
    icon: "🍀",
    xpRequired: 600,
    description: "HTML sémantique + CSS pro + Tailwind. Sites vitrine propres.",
    projectExamples: [
      "Landing page responsive premium",
      "CV en ligne accessible (WCAG AA)",
      "Site vitrine pour un client",
    ],
  },
  {
    id: 4,
    slug: "dev-javascript",
    name: "Dev JavaScript",
    icon: "⚡",
    xpRequired: 1500,
    description:
      "JavaScript moderne maîtrisé (async, closures, prototypes). Prêt pour 42 / Epitech.",
    projectExamples: [
      "Mini-jeux interactifs (memory, juste prix)",
      "Dashboard data avec filtres dynamiques",
      "Todo app full localStorage",
    ],
  },
  {
    id: 5,
    slug: "dev-react",
    name: "Dev React opérationnel",
    icon: "🔥",
    xpRequired: 2200,
    description: "TypeScript strict + React 19 + écosystème (Router, Query).",
    projectExamples: [
      "Clone Trello drag-and-drop",
      "App Notion-like multi-pages",
      "Dashboard analytics temps réel",
    ],
  },
  {
    id: 6,
    slug: "fullstack-junior",
    name: "Dev fullstack junior",
    icon: "🛠️",
    xpRequired: 2800,
    description: "Node + Fastify + REST. Construction d'API complète.",
    projectExamples: [
      "Mini-Twitter avec auth + feed",
      "Marketplace basique multi-vendor",
      "API SaaS B2B avec quotas",
    ],
  },
  {
    id: 7,
    slug: "backend-solide",
    name: "Backend solide",
    icon: "🗄️",
    xpRequired: 3300,
    description: "SQL avancé + ORM Drizzle. Schémas normalisés, transactions.",
    projectExamples: [
      "ERP simple pour PME",
      "Plateforme multi-tenant SaaS",
      "Analytics avec time-series Postgres",
    ],
  },
  {
    id: 8,
    slug: "production-ready",
    name: "Production-ready",
    icon: "🛡️",
    xpRequired: 4200,
    description:
      "Sécurité + tests + DevOps. SaaS complet avec auth, paiement, monitoring. Niveau employabilité senior.",
    projectExamples: [
      "SaaS B2B complet avec Stripe + webhooks",
      "Marketplace avec OAuth + 2FA",
      "App critique avec SRE de base",
    ],
  },
  {
    id: 9,
    slug: "3d-specialist",
    name: "Spécialiste 3D",
    icon: "🎨",
    xpRequired: 4700,
    description: "Three.js + R3F + shaders GLSL. Expériences premium.",
    projectExamples: [
      "Site portfolio 3D immersif",
      "Configurateur produit 3D temps réel",
      "Visite virtuelle architecture",
    ],
  },
  {
    id: 10,
    slug: "python-ops",
    name: "Python ops",
    icon: "🐍",
    xpRequired: 5100,
    description: "Python pro : scraping, automation, data, scripts pro.",
    projectExamples: [
      "Pipeline ETL pour data marketing",
      "Scraper distribué légalement OK",
      "Outils CLI pour ses propres projets",
    ],
  },
  {
    id: 11,
    slug: "ai-builder",
    name: "Créateur d'IA appliquée",
    icon: "🤖",
    xpRequired: 5800,
    description:
      "LLMs, RAG, agents, MCP. Niveau Anthropic builder / Flaynn-ready.",
    projectExamples: [
      "Agent autonome multi-tools",
      "RAG production sur sa knowledge base",
      "SaaS IA défendable type Flaynn",
    ],
  },
  {
    id: 12,
    slug: "senior-fullstack-ai",
    name: "Senior fullstack + IA",
    icon: "👑",
    xpRequired: 6500,
    description: "Roadmap complète. Tu construis n'importe quoi, seul.",
    projectExamples: [
      "Lancer ton propre studio",
      "Devenir indépendant à €1000+/jour",
      "Construire ton propre SaaS profitable",
    ],
  },
];
