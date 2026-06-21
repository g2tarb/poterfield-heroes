// Snippets de code thématiques par module — utilisés par CodeRain
// pour habiller l'ambiance du dashboard avec le contenu du module focused.

export const MODULE_SNIPPETS: Record<number, string[]> = {
  // 0 — Algorithmie & structures (transversal)
  0: [
    "O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
    "binary search → lo + (hi - lo) / 2",
    "fib(n) mémoïsé : O(2ⁿ) → O(n)",
    "BFS = queue · DFS = stack/récursion",
    "hashmap get/set → O(1) amorti",
    "merge sort : stable, O(n log n) garanti",
    "visited.add(node) // sinon cycle infini",
    "quicksort : pivot random, in-place",
  ],
  // 1 — Réseau & protocoles
  1: [
    "TCP 3-way: SYN → SYN/ACK → ACK",
    "dig +short erwin.io  →  1.2.3.4",
    "GET / HTTP/1.1\\r\\nHost: target",
    "TLS 1.3 · X25519 · ChaCha20-Poly1305",
    "nmap -sS -p- --min-rate 5000 10.0.0.0/24",
    "tcpdump -i eth0 'tcp port 443' -w cap.pcap",
    "nc -lvnp 4444   # listener",
    "OSI: L2 ARP · L3 IP · L4 TCP/UDP",
  ],
  // 2 — Shell & systèmes Unix
  2: [
    "set -euo pipefail",
    "grep -RIn 'TODO' . | awk -F: '{print $1}'",
    "for f in *.log; do gzip \"$f\"; done",
    "ps aux | sort -nrk3 | head",
    "find / -perm -4000 -type f 2>/dev/null",
    "cut -d: -f1 /etc/passwd | sort -u",
    "trap 'cleanup' EXIT INT TERM",
    "ssh -i key user@host 'uname -a'",
  ],
  // 3 — C & bas niveau
  3: [
    "int *p = malloc(n * sizeof *p);",
    "free(p); p = NULL; // évite l'UAF",
    "char buf[64]; // attention au débordement",
    "gcc -Wall -fsanitize=address main.c",
    "valgrind --leak-check=full ./a.out",
    "ptr + 1  →  +sizeof(*ptr) octets",
    "struct sockaddr_in addr; socket(AF_INET, ...)",
    "gdb -ex 'b main' -ex run ./a.out",
  ],
  // 4 — Python (outillage offensif/défensif)
  4: [
    "from scapy.all import IP, TCP, sr1",
    "async with httpx.AsyncClient() as c: ...",
    "with open(p) as f: data = f.read()",
    "[x for x in ports if is_open(x)]",
    "re.findall(r'\\d+\\.\\d+\\.\\d+\\.\\d+', log)",
    "socket.socket(AF_INET, SOCK_STREAM)",
    "asyncio.gather(*[scan(h) for h in hosts])",
    "typer.run(main)  # CLI en 1 ligne",
  ],
};

// Fallback générique si on n'a pas de mapping (ne devrait pas arriver)
export const GENERIC_SNIPPETS: string[] = [
  "// Porterfield Heroes · workshop n°1",
  "while (motivated) { learn(); ship(); }",
  "git commit -m 'feat: another step'",
  "const journey = [...modules].reduce(...)",
  "console.log('Day', streak, '· keep going')",
];

export function getSnippetsForModule(moduleNumber: number | null): string[] {
  if (moduleNumber === null) return GENERIC_SNIPPETS;
  return MODULE_SNIPPETS[moduleNumber] ?? GENERIC_SNIPPETS;
}
