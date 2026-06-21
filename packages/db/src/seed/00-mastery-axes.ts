import type { NewMasteryAxis } from "../schema/content";

// Radar de maîtrise — refonte parcours "5 modules systèmes / offensive-security".
// 6 axes : Réseau, Shell & systèmes, C & bas niveau, Algorithmes, Python, Sécurité.
export const masteryAxesSeed: NewMasteryAxis[] = [
  {
    id: "networking",
    label: "Réseau & protocoles",
    description:
      "OSI/TCP-IP, IP/sous-réseaux, TCP/UDP, DNS, HTTP/1-2-3, TLS/PKI, NAT, capture (Wireshark/tcpdump), scan (nmap), netcat.",
    colorHex: "#60A5FA",
    displayOrder: 1,
  },
  {
    id: "shell_systems",
    label: "Shell & systèmes Unix",
    description:
      "Bash avancé, scripting, processus, permissions, sed/awk/grep, SSH, cron, automatisation, recon & analyse de logs.",
    colorHex: "#34D399",
    displayOrder: 2,
  },
  {
    id: "c_lowlevel",
    label: "C & bas niveau",
    description:
      "Pointeurs, modèle mémoire, pile/tas, allocation dynamique, compilation, gdb/valgrind/ASan, sockets BSD, corruption mémoire.",
    colorHex: "#F59E0B",
    displayOrder: 3,
  },
  {
    id: "algorithms",
    label: "Algorithmes & structures",
    description:
      "Complexité Big-O, structures (array/list/stack/queue/hash/tree/graph), tris, recherche, récursion, DP, BFS/DFS, prep entretiens et 42.",
    colorHex: "#10B981",
    displayOrder: 4,
  },
  {
    id: "python",
    label: "Python (outillage)",
    description:
      "Scripting, automatisation, parsing, requests/httpx, asyncio, scapy, outillage offensif/défensif, data wrangling.",
    colorHex: "#FACC15",
    displayOrder: 5,
  },
  {
    id: "security",
    label: "Sécurité offensive/défensive",
    description:
      "Reconnaissance, injections, exploitation mémoire, MITM, scanning, kill chains, hardening, détection — toujours en cadre légal.",
    colorHex: "#F472B6",
    displayOrder: 6,
  },
];
