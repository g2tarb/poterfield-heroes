import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M20_ID = "m20-securite-auth";

export const m20Module: NewModule = {
  id: M20_ID,
  moduleNumber: 20,
  phase: 7,
  title: "Authentification & Sécurité web",
  subtitle: "Ne pas se faire pirater. Discipline, pas option.",
  pourquoi:
    "Une seule ' OR 1=1, un JWT mal vérifié, un mot de passe en clair → Have I Been Pwned avec 1000 users leakés. Piège 1 : sécurité = HTTPS. Non, discipline (validation, hash adaptatif, rate limit, CORS, headers, sessions, audit). Piège 2 : reconstruire l'auth à la main → 30% de cas oubliés. Préfère un service ou lib éprouvée (Better Auth en 2026).",
  objectives: [
    "OWASP Top 10 2021/2025 (Access Control, Crypto, Injection, etc.)",
    "Authentication vs authorization",
    "Hash password (bcrypt cost 12, Argon2id mieux, salt, constant-time compare)",
    "JWT (header.payload.signature, HS256/RS256, claims, alg: none piège)",
    "Stockage token client : localStorage (XSS) vs httpOnly cookie (CSRF)",
    "Refresh tokens (access court 15min + refresh long 30j en cookie httpOnly)",
    "OAuth 2.0 + OIDC (Authorization Code + PKCE, scopes)",
    "Sessions vs JWT",
    "Headers sécurité (CSP, HSTS, X-Frame-Options, Referrer-Policy)",
    "CORS strict (origin, credentials, preflight)",
    "CSRF (double-submit, SameSite=Strict/Lax)",
    "XSS (reflected, stored, DOM-based, échappement, sanitization)",
    "SQL injection (paramètres préparés)",
    "Rate limiting (par IP/user/endpoint, Redis-backed)",
    "Secrets management (.env, vault, rotation)",
    "HTTPS/TLS (Let's Encrypt, HSTS preload)",
    "2FA/MFA (TOTP, WebAuthn, backup codes)",
    "Services auth 2026 : Better Auth, Clerk, Auth0, Supabase Auth",
    "Audit (pnpm audit, Snyk, Dependabot, secret scanning)",
    "Logs sécurisés (redact passwords/tokens/PII)",
  ],
  prerequisites: "Modules 16-19",
  estimatedHours: 40,
  estimatedWeeks: 3,
  stackAllowed: [
    "Fastify + plugins sécurité (@fastify/helmet, cors, rate-limit, jwt, cookie, oauth2)",
    "Argon2 ou bcrypt",
    "Redis pour rate limit",
    "PortSwigger Web Security Academy (labs)",
  ],
  prereqModuleId: "m19-drizzle-orm",
  unlockSrsMatureRatio: 80,
};

export const m20Skills: NewSkill[] = [
  { moduleId: M20_ID, slug: "owasp-top10", label: "OWASP Top 10 (10 catégories de failles)", displayOrder: 1, weight: 3 },
  { moduleId: M20_ID, slug: "auth-vs-authz", label: "Authentication vs authorization", displayOrder: 2, weight: 2 },
  { moduleId: M20_ID, slug: "hash-passwords", label: "Hash adaptatif (bcrypt/argon2, salt, constant-time)", displayOrder: 3, weight: 3 },
  { moduleId: M20_ID, slug: "jwt", label: "JWT (structure, claims, alg: none piège)", displayOrder: 4, weight: 3 },
  { moduleId: M20_ID, slug: "token-storage", label: "localStorage (XSS) vs httpOnly cookie (CSRF)", displayOrder: 5, weight: 3 },
  { moduleId: M20_ID, slug: "refresh-tokens", label: "Access 15min + Refresh 30j cookie httpOnly + rotation", displayOrder: 6, weight: 3 },
  { moduleId: M20_ID, slug: "oauth-oidc", label: "OAuth 2.0 + OIDC (Authorization Code + PKCE)", displayOrder: 7, weight: 2 },
  { moduleId: M20_ID, slug: "csp", label: "CSP (Content Security Policy)", displayOrder: 8, weight: 2 },
  { moduleId: M20_ID, slug: "headers-security", label: "HSTS, X-Frame-Options, Referrer-Policy via helmet", displayOrder: 9, weight: 2 },
  { moduleId: M20_ID, slug: "cors-strict", label: "CORS strict (origin, credentials, preflight)", displayOrder: 10, weight: 2 },
  { moduleId: M20_ID, slug: "csrf", label: "CSRF (SameSite=Strict, double-submit)", displayOrder: 11, weight: 3 },
  { moduleId: M20_ID, slug: "xss", label: "XSS (reflected, stored, DOM, sanitization)", displayOrder: 12, weight: 3 },
  { moduleId: M20_ID, slug: "sql-injection", label: "SQL injection (paramètres préparés)", displayOrder: 13, weight: 2 },
  { moduleId: M20_ID, slug: "rate-limit", label: "Rate limiting par IP/endpoint", displayOrder: 14, weight: 3 },
  { moduleId: M20_ID, slug: "secrets", label: "Secrets (.env never commit, rotation, vault)", displayOrder: 15, weight: 3 },
  { moduleId: M20_ID, slug: "https-tls", label: "HTTPS, TLS, Let's Encrypt, HSTS preload", displayOrder: 16, weight: 1 },
  { moduleId: M20_ID, slug: "2fa", label: "2FA/MFA (TOTP, WebAuthn)", displayOrder: 17, weight: 1 },
  { moduleId: M20_ID, slug: "audit", label: "pnpm audit, Snyk, Dependabot, secret scanning", displayOrder: 18, weight: 2 },
  { moduleId: M20_ID, slug: "logs-redact", label: "Logs sécurisés (redact passwords/tokens/PII)", displayOrder: 19, weight: 2 },
];

export const m20SkillAxisRules = m20Skills.map((s) => ({ skillSlug: s.slug, axisId: "security", contribution: 100 }));

export const m20Videos: NewVideo[] = [
  {
    moduleId: M20_ID,
    isPrimary: 1,
    title: "PwnFunction (chaîne YouTube)",
    creator: "PwnFunction",
    externalUrl: "https://www.youtube.com/@PwnFunction",
    language: "en",
    durationSeconds: 6 * 60 * 60,
    whyThisOne: "OBLIGATOIRE. Vidéos courtes/animées sur XSS, CSRF, SQL injection, JWT attacks. Pédagogie inégalée.",
    coversSkills: ["xss", "csrf", "sql-injection", "jwt"],
    displayOrder: 1,
  },
  {
    moduleId: M20_ID,
    isPrimary: 0,
    title: "OWASP Cheat Sheet Series",
    creator: "OWASP",
    externalUrl: "https://cheatsheetseries.owasp.org",
    language: "en",
    whyThisOne: "La bible. Articles courts par sujet (REST Security, JWT, Auth, Password Storage). À mettre en signet.",
    coversSkills: ["owasp-top10", "hash-passwords", "jwt"],
    displayOrder: 2,
  },
  {
    moduleId: M20_ID,
    isPrimary: 0,
    title: "PortSwigger Web Security Academy (labs)",
    creator: "PortSwigger",
    externalUrl: "https://portswigger.net/web-security",
    language: "en",
    whyThisOne: "OBLIGATOIRE. Labs gratuits pour pratiquer (XSS, SQLi, CSRF, Auth). Faire 5 labs minimum.",
    coversSkills: ["xss", "sql-injection", "csrf"],
    displayOrder: 3,
  },
];

export const m20Exercises: NewExercise[] = [
  {
    moduleId: M20_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : hash, JWT, CORS/CSRF, CSP",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Pourquoi bcrypt/argon2 et pas SHA256 pour les mots de passe ?",
        options: [
          "Identique",
          "SHA256 trop rapide → brute-forçable en quelques heures GPU. bcrypt/argon2 = adaptatifs (cost factor), salt auto, lents par design.",
          "SHA256 plus rapide",
          "Obsolète",
        ],
        correctIndex: 1,
        explanation: "Le but d'un hash de password = LENT à calculer. bcrypt cost 12 = ~250ms. argon2id = encore mieux (résistant GPU/ASIC). SHA256 = 0.001ms, attaquable en quelques heures.",
      },
      {
        question: "Access token 15min + Refresh 30j — pourquoi 2 tokens ?",
        options: [
          "Sur-ingénierie",
          "Access courte vie = limite l'impact du vol. Refresh long = pas re-login quotidien. Rotation refresh = anti-replay.",
          "Plus rapide",
          "Obligatoire HTTPS",
        ],
        correctIndex: 1,
        explanation: "JWT volé valable 15min max. Refresh stocké en cookie httpOnly+secure. À chaque refresh, l'ancien est invalidé (rotation). Compromis revoquable.",
      },
      {
        question: "CORS vs CSRF — quel protège quoi ?",
        options: [
          "Identiques",
          "CORS = côté navigateur (empêche un site malicieux d'appeler ton API depuis JS). CSRF = empêche un site malicieux d'utiliser le cookie de session de l'user pour une action.",
          "CORS protège du CSRF",
          "Aucun rapport",
        ],
        correctIndex: 1,
        explanation: "CORS bloque les fetch cross-origin sauf si autorisé. Mais un curl ignore CORS. CSRF utilise les cookies que le navigateur envoie automatiquement — SameSite=Strict + double-submit token le bloquent.",
      },
    ],
    skillSlugs: ["hash-passwords", "refresh-tokens", "cors-strict", "csrf"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M20_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "Security Forge — durcissement complet de MiniBoard",
    statement: `Transformer l'API MiniBoard (M17+M19) en API prod-ready, prête audit sécurité.

**A. Hash passwords**
- Migrer vers Argon2id (cost factor 2026)
- bcrypt.compare → constant-time

**B. Refresh tokens**
- Access JWT 15min + Refresh UUID 30j en DB (table refresh_tokens)
- Cookie httpOnly + secure + SameSite=Strict + signed
- Rotation à chaque /auth/refresh
- /auth/logout-all (invalide tous les RT user)

**C. Permissions strictes**
- IDOR : jamais userId du client, toujours request.user.id
- Deny by default (preHandler obligatoire sauf public: true commenté)

**D. Headers**
- @fastify/helmet + CSP custom (script-src 'self', img-src 'self' data: https:)
- HSTS prod : max-age=63072000; includeSubDomains; preload
- X-Frame-Options DENY

**E. CORS**
- origin: liste prod, jamais '*' avec credentials

**F. Rate limit**
- 100/min global, 5/min /auth/login, 3/heure /forgot-password
- Redis backend

**G. OAuth Google + 2FA TOTP (bonus)**

**H. Logs Pino redaction**
- Redact : authorization, cookie, password, token

**I. Audit**
- pnpm audit 0 critique
- Dependabot activé
- Snyk scan
- Mozilla Observatory ≥ A
- 5 attaques manuelles testées (SQLi, IDOR, JWT tamper, brute-force, XSS)
- 5 labs PortSwigger complétés

**J. Documentation security.md**`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["hash-passwords", "refresh-tokens", "csp", "cors-strict", "rate-limit", "secrets"],
    passThresholdPct: 100,
    estimatedMinutes: 45 * 60,
    displayOrder: 2,
  },
];
