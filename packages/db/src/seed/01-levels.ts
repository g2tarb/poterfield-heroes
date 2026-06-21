import type { NewLevel } from "../schema/content";

// Progression refondue — parcours "systèmes / offensive-security" en 5 modules.
// Réseau → Shell → C → Algo → Python, avec la Sécurité comme fil rouge transversal.
export const levelsSeed: NewLevel[] = [
  {
    id: 1,
    slug: "init",
    name: "Init",
    icon: "🌱",
    xpRequired: 0,
    description: "Point de départ. Curieux, motivé, un terminal et rien d'autre.",
    projectExamples: [
      "Installer son setup (Linux/WSL2, gcc, Wireshark)",
      "Lire des write-ups CTF",
      "Suivre LiveOverflow / IppSec",
    ],
  },
  {
    id: 2,
    slug: "operateur-reseau",
    name: "Opérateur réseau",
    icon: "🌐",
    xpRequired: 300,
    description:
      "Tu lis une capture, traces le voyage d'un paquet, comprends TCP/TLS/DNS et scannes un lab autorisé.",
    projectExamples: [
      "Analyser un handshake TLS dans Wireshark",
      "Scanner une cible locale avec nmap + lecture tcpdump",
      "Monter un client/serveur netcat et capturer le trafic",
    ],
  },
  {
    id: 3,
    slug: "operateur-shell",
    name: "Opérateur shell",
    icon: "🐚",
    xpRequired: 800,
    description:
      "Bash maîtrisé : scripting, processus, sed/awk/grep, SSH, automatisation et recon défensive.",
    projectExamples: [
      "Script de recon/automatisation robuste (set -euo pipefail)",
      "Pipeline d'analyse de logs (grep/awk/sort/uniq)",
      "Outil CLI d'inventaire système",
    ],
  },
  {
    id: 4,
    slug: "systemes-c",
    name: "Systèmes & C",
    icon: "⚙️",
    xpRequired: 1600,
    description:
      "Pointeurs, mémoire, pile/tas, malloc/free sans fuite (valgrind clean), sockets C. Tu comprends la corruption mémoire.",
    projectExamples: [
      "Mini-shell en C",
      "Scanner de ports en C (sockets BSD)",
      "Reproduire + corriger un buffer overflow en lab",
    ],
  },
  {
    id: 5,
    slug: "algorithmicien",
    name: "Algorithmicien",
    icon: "🧮",
    xpRequired: 2400,
    description:
      "Big-O instinctif, structures et algos classiques implémentés à la main. Prêt entretiens techniques et piscine 42.",
    projectExamples: [
      "30 LeetCode Easy en autonomie",
      "Tris + structures réimplémentés en C et Python",
      "Solveur de graphe (BFS/DFS) from scratch",
    ],
  },
  {
    id: 6,
    slug: "python-tooling",
    name: "Python tooling",
    icon: "🐍",
    xpRequired: 3300,
    description:
      "Python pro pour l'outillage : automatisation, parsing, scapy, httpx/asyncio, scripts offensifs/défensifs.",
    projectExamples: [
      "Scanner réseau en Python (scapy/sockets)",
      "Parser/analyseur de logs ou de captures",
      "CLI d'automatisation sécu (typer + httpx)",
    ],
  },
  {
    id: 7,
    slug: "security-practitioner",
    name: "Security practitioner",
    icon: "🛡️",
    xpRequired: 4500,
    description:
      "Tu enchaînes les techniques (Code Noir) sur les 5 axes, comprends les kill chains et sais durcir/détecter. Toujours en cadre légal.",
    projectExamples: [
      "Kill chain complète reproduite dans un lab",
      "Rapport de pentest sur cible autorisée",
      "Durcissement + détection d'un service exposé",
    ],
  },
];
