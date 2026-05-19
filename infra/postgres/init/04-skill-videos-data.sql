-- ============================================================
-- Skill videos curation — M01 à M10 (Phase 1 & 2)
-- ============================================================
-- Idempotent : UPDATE des skills existants (déjà seedés) avec
-- 1 à 3 vidéos YouTube pédagogiques par skill (FR + EN quand
-- possible).
--
-- Application en prod (Coolify / Hostinger) :
--   docker exec -i <postgres> psql -U $POSTGRES_USER -d $POSTGRES_DB < 04-skill-videos-data.sql
--
-- Tous les youtubeId sont des IDs YouTube réels à 11 caractères.
-- IDs récupérés depuis :
--  - Les vidéos déjà validées dans packages/db/src/seed/modules/m0X.ts
--  - Recherches WebSearch ciblées (chaînes pédagogiques)
-- ============================================================

BEGIN;

-- ============================================================
-- M01 — Comment fonctionne le web
-- module_id = 'm01-comment-fonctionne-le-web'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "vIZ6bY48kWk", "title": "Internet vs Web : Comprendre la différence", "channel": "FR", "lang": "fr"},
  {"youtubeId": "zN8YNNHcaZc", "title": "How does the internet work? (Full Course)", "channel": "freeCodeCamp / Ian Frost", "lang": "en"}
]'::jsonb WHERE slug = 'internet-vs-web' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "toMtdE3Usyo", "title": "Connaître la relation client/serveur", "channel": "video2brain", "lang": "fr"},
  {"youtubeId": "0w6GXuVHz1Y", "title": "Client-Server Architecture Explained", "channel": "ByteByteGo / equivalent", "lang": "en"}
]'::jsonb WHERE slug = 'client-server-model' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "26jazyc7VNk", "title": "Comprendre les modèles OSI et TCP/IP", "channel": "FR", "lang": "fr"},
  {"youtubeId": "P_hVprfTgls", "title": "COMPRENDRE ENFIN le modèle OSI", "channel": "FR", "lang": "fr"},
  {"youtubeId": "L1pFhn1Uxx4", "title": "Les modèles OSI & TCP/IP", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'tcp-ip-layers' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "AlkDbnbv7dk", "title": "What happens when you type a URL into your browser?", "channel": "ByteByteGo", "lang": "en"},
  {"youtubeId": "dh406O2v_1c", "title": "What happens when you type google.com (Detailed Analysis)", "channel": "Hussein Nasser", "lang": "en"}
]'::jsonb WHERE slug = 'request-journey' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "zN8YNNHcaZc", "title": "How does the internet work? (Full Course)", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'ip-mac-port' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "qzWdzAvfBoo", "title": "Comprendre le DNS en 5 minutes", "channel": "FR", "lang": "fr"},
  {"youtubeId": "tyDxzzdKnsU", "title": "Le DNS pour les débutants", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'dns-resolution' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "AlkDbnbv7dk", "title": "What happens when you type a URL into your browser?", "channel": "ByteByteGo", "lang": "en"}
]'::jsonb WHERE slug = 'http-versions' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "dh406O2v_1c", "title": "What happens when you type google.com (Detailed Analysis)", "channel": "Hussein Nasser", "lang": "en"}
]'::jsonb WHERE slug = 'http-anatomy' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "k_ScPsb3WSk", "title": "SSL/TLS pour les nuls", "channel": "Julien Aubert", "lang": "fr"},
  {"youtubeId": "WIMKeyJ60Rw", "title": "Comprendre HTTPS et le chiffrement SSL TLS en animation 3D", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'https-tls' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "y4MpceWoeCY", "title": "Chrome Devtools : Onglet Network", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'devtools-network' AND module_id = 'm01-comment-fonctionne-le-web';

UPDATE skills SET videos = '[
  {"youtubeId": "zN8YNNHcaZc", "title": "How does the internet work? (Full Course)", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'network-hardware' AND module_id = 'm01-comment-fonctionne-le-web';

-- domain-vs-hosting : pas de vidéo curée fiable -> laisser le fallback "chercher sur YouTube"
-- (le composant SkillVideos affiche une recherche YouTube par défaut)

-- ============================================================
-- M02 — Terminal & Shell (Bash)
-- module_id = 'm02-terminal-shell'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'navigation' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'files' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "yCTnihfbPCo", "title": "Intermediate Bash Commands (grep, sed, awk, tar, less, gzip)", "channel": "Bash Course", "lang": "en"}
]'::jsonb WHERE slug = 'text' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Z3_4RmYTO7s", "title": "Linux File Permissions Explained (chmod, chown, umask, SUID)", "channel": "TechWorld with Nana", "lang": "en"}
]'::jsonb WHERE slug = 'permissions' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'pipes-redirect' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'env' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "K5sxW4PR_b4", "title": "BASH : Des scripts solides", "channel": "FR", "lang": "fr"},
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'scripting' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'args' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "Sx9zG7wa4FA", "title": "The Complete Bash Scripting Course", "channel": "Dave Eddy / ysap.sh", "lang": "en"}
]'::jsonb WHERE slug = 'exit-codes' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "oPEnvuj9QrI", "title": "Linux Crash Course - awk", "channel": "Learn Linux TV", "lang": "en"},
  {"youtubeId": "nXLnx8ncZyE", "title": "Linux Crash Course - The sed Command", "channel": "Learn Linux TV", "lang": "en"}
]'::jsonb WHERE slug = 'text-tools' AND module_id = 'm02-terminal-shell';

-- processes : pas de curated -> fallback
-- ssh
UPDATE skills SET videos = '[
  {"youtubeId": "Zzqtj0sRB1k", "title": "Easy SSH Key Setup for GitHub on Ubuntu", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'ssh' AND module_id = 'm02-terminal-shell';

UPDATE skills SET videos = '[
  {"youtubeId": "QZJ1drMQz1A", "title": "Linux/Mac Tutorial: Cron Jobs - Schedule with crontab", "channel": "Corey Schafer", "lang": "en"},
  {"youtubeId": "7cbP7fzn0D8", "title": "Linux Crash Course - Scheduling Tasks with Cron", "channel": "Learn Linux TV", "lang": "en"}
]'::jsonb WHERE slug = 'cron' AND module_id = 'm02-terminal-shell';

-- shortcuts : fallback

-- ============================================================
-- M03 — Git & GitHub
-- module_id = 'm03-git-github'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "rP3T0Ee6pLU", "title": "Comprendre Git (1/18) : Qu''est ce que git ?", "channel": "Grafikart", "lang": "fr"}
]'::jsonb WHERE slug = 'git-vs-github' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "chhVBZfRFgI", "title": "Comprendre Git (5/18) : Premiers commits", "channel": "Grafikart", "lang": "fr"},
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals – Free Version Control Course", "channel": "freeCodeCamp / Tobias Günther", "lang": "en"}
]'::jsonb WHERE slug = 'three-zones' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "chhVBZfRFgI", "title": "Comprendre Git (5/18) : Premiers commits", "channel": "Grafikart", "lang": "fr"},
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals – Free Version Control Course", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'basic-cycle' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "JlfCRlFHmd8", "title": "Conventional Commits - Git Tutorial part 15", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'commit-messages' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "ZQAQ4HcskAY", "title": "Comprendre Git (12/18) : Git Flow", "channel": "Grafikart", "lang": "fr"},
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'branches' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "cjSjlHUmaBU", "title": "Git Merge vs Rebase Explained Visually", "channel": "EN", "lang": "en"},
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'merge-vs-rebase' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "cjSjlHUmaBU", "title": "Git Merge vs Rebase Explained Visually", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'conflicts' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals", "channel": "freeCodeCamp / Tobias Günther", "lang": "en"}
]'::jsonb WHERE slug = 'remotes' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "nCKdihvneS0", "title": "What is a pull request & how to create one", "channel": "EN", "lang": "en"},
  {"youtubeId": "a_FLqX3vGR4", "title": "GitHub Forks and Pull Requests | Step by Step", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'pull-requests' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "BHfI9BMiK3E", "title": "Git Tutorial : undo (amend, cherry-pick, reset, reflog, revert)", "channel": "EN", "lang": "en"},
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'undo' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "BHfI9BMiK3E", "title": "Git Tutorial : undo (amend, cherry-pick, reset, reflog, revert)", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'reflog' AND module_id = 'm03-git-github';

UPDATE skills SET videos = '[
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals (rebase interactif)", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'rewrite-history' AND module_id = 'm03-git-github';

-- stash-cherry : fallback
-- ssh-keys
UPDATE skills SET videos = '[
  {"youtubeId": "Zzqtj0sRB1k", "title": "Easy SSH Key Setup for GitHub on Ubuntu", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'ssh-keys' AND module_id = 'm03-git-github';

-- gitignore : fallback (intégré dans le cours pro)
UPDATE skills SET videos = '[
  {"youtubeId": "Uszj_k0DGsg", "title": "Git for Professionals", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'gitignore' AND module_id = 'm03-git-github';

-- remove-secrets : fallback

-- ============================================================
-- M04 — Env dev (VS Code, Node, pnpm, nvm)
-- module_id = 'm04-env-dev'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "ifTF3ags0XI", "title": "25 VS Code Productivity Tips and Speed Hacks", "channel": "Fireship", "lang": "en"}
]'::jsonb WHERE slug = 'vscode-config' AND module_id = 'm04-env-dev';

UPDATE skills SET videos = '[
  {"youtubeId": "ifTF3ags0XI", "title": "25 VS Code Productivity Tips and Speed Hacks", "channel": "Fireship", "lang": "en"},
  {"youtubeId": "u21W_tfPVrY", "title": "VS Code Top-Ten Pro Tips", "channel": "Fireship", "lang": "en"}
]'::jsonb WHERE slug = 'shortcuts' AND module_id = 'm04-env-dev';

UPDATE skills SET videos = '[
  {"youtubeId": "80rrqS2QuBY", "title": "Top 10 VS Code Extensions You Need RIGHT NOW", "channel": "Fireship", "lang": "en"}
]'::jsonb WHERE slug = 'extensions' AND module_id = 'm04-env-dev';

-- debugger : fallback
-- snippets : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "E_a6JwCRCaU", "title": "Node Version Manager (NVM) Tutorial", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'node-vs-npm' AND module_id = 'm04-env-dev';

UPDATE skills SET videos = '[
  {"youtubeId": "E_a6JwCRCaU", "title": "Node Version Manager (NVM) Tutorial", "channel": "EN", "lang": "en"},
  {"youtubeId": "tjp-oNksxF4", "title": "Switch Node.js Versions Like a Pro | NVM Tutorial", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'nvm-fnm' AND module_id = 'm04-env-dev';

-- pkg-json : fallback (couvert dans tutoriels nvm)
-- semver
UPDATE skills SET videos = '[
  {"youtubeId": "u-GU7EkZksA", "title": "Semantic Versioning & Conventional Commits Explained", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'semver' AND module_id = 'm04-env-dev';

-- lockfile, global-vs-local, scripts, dotfiles : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "IRdPRIPd9FM", "title": "Prettier & ESLint in VS Code: The Ultimate Guide", "channel": "EN", "lang": "en"},
  {"youtubeId": "lGCHjQl6XLw", "title": "VSCode + ESLint + Prettier. Comment bien configurer le tout", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'format-lint' AND module_id = 'm04-env-dev';

-- ============================================================
-- M05 — HTML5 (sémantique, formulaires, accessibilité)
-- module_id = 'm05-html5'
-- ============================================================

-- structure : fallback (cours Pierre Giraud externe)
UPDATE skills SET videos = '[
  {"youtubeId": "RFdsBUppiE8", "title": "Les bases du HTML : Les balises sémantiques", "channel": "FR", "lang": "fr"},
  {"youtubeId": "0uQv6HpAcpk", "title": "Comprendre les balises sémantiques | HTML", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'semantic' AND module_id = 'm05-html5';

-- headings, block-inline : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "EQrUGEvnCzY", "title": "10 Form Validation Tips Every Web Developer SHOULD KNOW", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'forms' AND module_id = 'm05-html5';

UPDATE skills SET videos = '[
  {"youtubeId": "EQrUGEvnCzY", "title": "10 Form Validation Tips Every Web Developer SHOULD KNOW", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'input-types' AND module_id = 'm05-html5';

UPDATE skills SET videos = '[
  {"youtubeId": "EQrUGEvnCzY", "title": "10 Form Validation Tips Every Web Developer SHOULD KNOW", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'validation' AND module_id = 'm05-html5';

-- media, tables, inline-content, meta-seo : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "e2nkq3h1P68", "title": "Learn Accessibility – Full a11y Tutorial", "channel": "Kevin Powell / freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'a11y' AND module_id = 'm05-html5';

-- validation-w3c, dom-tree (M05) : fallback

-- ============================================================
-- M06 — CSS3 fondamentaux + responsive
-- module_id = 'm06-css3-fondamentaux'
-- ============================================================

-- selectors : fallback Pierre Giraud
UPDATE skills SET videos = '[
  {"youtubeId": "c0kfcP_nD9E", "title": "CSS Specificity explained", "channel": "Kevin Powell", "lang": "en"},
  {"youtubeId": "jhjVKZB9yc0", "title": "These CSS features give us more control on the cascade and specificity", "channel": "Kevin Powell", "lang": "en"}
]'::jsonb WHERE slug = 'cascade' AND module_id = 'm06-css3-fondamentaux';

-- inheritance : fallback
-- box-model, units, display, position : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "86nTToBm2uQ", "title": "Stop fighting with CSS positioning", "channel": "Kevin Powell", "lang": "en"}
]'::jsonb WHERE slug = 'position' AND module_id = 'm06-css3-fondamentaux';

UPDATE skills SET videos = '[
  {"youtubeId": "ixG2m6Nuxh0", "title": "Apprendre CSS Flexbox en 15 Minutes", "channel": "FR", "lang": "fr"},
  {"youtubeId": "Pl7LbpGr2uU", "title": "Apprendre les Flexbox CSS en 20 minutes", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'flexbox' AND module_id = 'm06-css3-fondamentaux';

UPDATE skills SET videos = '[
  {"youtubeId": "rg7Fvvl3taU", "title": "Learn CSS Grid the easy way", "channel": "Kevin Powell", "lang": "en"}
]'::jsonb WHERE slug = 'grid' AND module_id = 'm06-css3-fondamentaux';

-- flex-vs-grid : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "9vZ7n5ylat0", "title": "CSS Media Queries for Beginners (Mobile First)", "channel": "EN", "lang": "en"},
  {"youtubeId": "aook54SsfhY", "title": "Learn CSS Media Queries by Building 3 Projects", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'responsive' AND module_id = 'm06-css3-fondamentaux';

-- responsive-images, typography, colors : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "i8bOsdnt0fI", "title": "Introduction to CSS variables (CSS custom properties) [full tutorial]", "channel": "EN", "lang": "en"},
  {"youtubeId": "W8LlgS9YCP4", "title": "How to use CSS variables like a pro", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'css-vars' AND module_id = 'm06-css3-fondamentaux';

-- devtools-css : fallback

-- ============================================================
-- M07 — CSS avancé : animations, Tailwind
-- module_id = 'm07-css-avance-tailwind'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "hleg4zmjQ-o", "title": "MASTER CSS Transitions in 2024", "channel": "Online Tutorials", "lang": "en"}
]'::jsonb WHERE slug = 'transitions' AND module_id = 'm07-css-avance-tailwind';

UPDATE skills SET videos = '[
  {"youtubeId": "hleg4zmjQ-o", "title": "MASTER CSS Transitions in 2024", "channel": "Online Tutorials", "lang": "en"},
  {"youtubeId": "y8-F5-2EIcg", "title": "10 CSS animation tips and tricks", "channel": "Kevin Powell", "lang": "en"}
]'::jsonb WHERE slug = 'keyframes' AND module_id = 'm07-css-avance-tailwind';

UPDATE skills SET videos = '[
  {"youtubeId": "hleg4zmjQ-o", "title": "MASTER CSS Transitions in 2024", "channel": "Online Tutorials", "lang": "en"}
]'::jsonb WHERE slug = 'transforms' AND module_id = 'm07-css-avance-tailwind';

-- perf-animations, reduced-motion, modern-animations : fallback
-- bem : fallback
-- utility-first

UPDATE skills SET videos = '[
  {"youtubeId": "P1x9b1_0I2U", "title": "Tailwind CSS en 1h : Maîtriser ce puissant framework", "channel": "FR", "lang": "fr"},
  {"youtubeId": "9I3JQ1q4IMk", "title": "Tailwind CSS for Beginners | Full Course", "channel": "Net Ninja", "lang": "en"}
]'::jsonb WHERE slug = 'utility-first' AND module_id = 'm07-css-avance-tailwind';

UPDATE skills SET videos = '[
  {"youtubeId": "P1x9b1_0I2U", "title": "Tailwind CSS en 1h : Maîtriser ce puissant framework", "channel": "FR", "lang": "fr"},
  {"youtubeId": "9I3JQ1q4IMk", "title": "Tailwind CSS for Beginners | Full Course", "channel": "Net Ninja", "lang": "en"},
  {"youtubeId": "lCxcTsOHrjo", "title": "Tailwind CSS Full Course for Beginners (3 hours)", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'tailwind-classes' AND module_id = 'm07-css-avance-tailwind';

UPDATE skills SET videos = '[
  {"youtubeId": "9I3JQ1q4IMk", "title": "Tailwind CSS for Beginners | Full Course", "channel": "Net Ninja", "lang": "en"}
]'::jsonb WHERE slug = 'tailwind-states' AND module_id = 'm07-css-avance-tailwind';

UPDATE skills SET videos = '[
  {"youtubeId": "9I3JQ1q4IMk", "title": "Tailwind CSS for Beginners | Full Course", "channel": "Net Ninja", "lang": "en"}
]'::jsonb WHERE slug = 'tailwind-config' AND module_id = 'm07-css-avance-tailwind';

-- shadcn, design-system, css-perf-prod : fallback

-- ============================================================
-- M08 — JavaScript fondamental
-- module_id = 'm08-javascript-fondamental'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course – Beginner to Pro", "channel": "SuperSimpleDev", "lang": "en"},
  {"youtubeId": "PkZNo7MFNFg", "title": "Learn JavaScript - Full Course for Beginners", "channel": "freeCodeCamp", "lang": "en"}
]'::jsonb WHERE slug = 'types-primitifs' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'null-undefined' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "RXMYIog5xmU", "title": "JavaScript == vs === Explained: Primitives, Objects, and Coercion", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'coercion' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'operators' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'control-flow' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'loops' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'functions' AND module_id = 'm08-javascript-fondamental';

-- value-vs-reference, strings, numbers : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "LYvQWwsKiME", "title": "Scope et closures en JS (et... hoisting ?)", "channel": "FR", "lang": "fr"},
  {"youtubeId": "Nt-qa_LlUH0", "title": "The Ultimate Guide to Execution Contexts, Hoisting, Scopes", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'scope' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "ZUk6RppaEYE", "title": "What''s the Difference Between var, let and const? | JS Pro Tips #2", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'var-let-const' AND module_id = 'm08-javascript-fondamental';

UPDATE skills SET videos = '[
  {"youtubeId": "LYvQWwsKiME", "title": "Scope et closures en JS (et... hoisting ?)", "channel": "FR", "lang": "fr"},
  {"youtubeId": "Nt-qa_LlUH0", "title": "Execution Contexts, Hoisting, Scopes", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'hoisting' AND module_id = 'm08-javascript-fondamental';

-- truthy-falsy : fallback

-- ============================================================
-- M09 — JavaScript & le DOM
-- module_id = 'm09-javascript-dom'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course (DOM sections)", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'dom-tree' AND module_id = 'm09-javascript-dom';

UPDATE skills SET videos = '[
  {"youtubeId": "i_KXcwr7PYc", "title": "How to Access HTML Elements Using JavaScript", "channel": "EN", "lang": "en"},
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'selectors-js' AND module_id = 'm09-javascript-dom';

-- content-modification, attributes, classlist, tree-nav, create-insert-remove : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course (DOM sections)", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'events' AND module_id = 'm09-javascript-dom';

UPDATE skills SET videos = '[
  {"youtubeId": "NXXTLu2UnLE", "title": "JavaScript Event Propagation - Bubbling and Capturing Explained", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'event-object' AND module_id = 'm09-javascript-dom';

UPDATE skills SET videos = '[
  {"youtubeId": "NXXTLu2UnLE", "title": "JavaScript Event Propagation - Bubbling and Capturing Explained", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'bubbling' AND module_id = 'm09-javascript-dom';

UPDATE skills SET videos = '[
  {"youtubeId": "NXXTLu2UnLE", "title": "Event Propagation : Bubbling and Capturing Explained", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'delegation' AND module_id = 'm09-javascript-dom';

-- forms : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "zmFDvFwj6-8", "title": "JavaScript LocalStorage and Session Storage API Tutorial", "channel": "EN", "lang": "en"},
  {"youtubeId": "CsoknB_0TW8", "title": "The Ins and Outs of localStorage and sessionStorage", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'storage' AND module_id = 'm09-javascript-dom';

-- script-loading : fallback

-- ============================================================
-- M10 — JavaScript moderne (ES6+) & méthodes tableaux
-- module_id = 'm10-javascript-moderne-es6'
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course (Arrays + Advanced Functions)", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'arrow-functions' AND module_id = 'm10-javascript-moderne-es6';

-- template-literals, defaults-rest : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "9BaqW4mlCXk", "title": "Destructuring and REST/SPREAD operator. Modern JavaScript ES6", "channel": "EN", "lang": "en"},
  {"youtubeId": "SFplA5KrAmQ", "title": "JavaScript Destructuring, Spread & Rest Operators Explained", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'spread' AND module_id = 'm10-javascript-moderne-es6';

UPDATE skills SET videos = '[
  {"youtubeId": "0EgAQUjRTdU", "title": "Learn JavaScript Destructuring in 20 minutes (For Beginners)", "channel": "EN", "lang": "en"},
  {"youtubeId": "9BaqW4mlCXk", "title": "Destructuring and REST/SPREAD operator", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'destructuring-obj' AND module_id = 'm10-javascript-moderne-es6';

UPDATE skills SET videos = '[
  {"youtubeId": "0EgAQUjRTdU", "title": "Learn JavaScript Destructuring in 20 minutes", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'destructuring-arr' AND module_id = 'm10-javascript-moderne-es6';

UPDATE skills SET videos = '[
  {"youtubeId": "EerdGm-ehJQ", "title": "JavaScript Tutorial Full Course (Arrays)", "channel": "SuperSimpleDev", "lang": "en"}
]'::jsonb WHERE slug = 'map-filter-reduce' AND module_id = 'm10-javascript-moderne-es6';

-- find-some-every, flat-flatmap, mutating-vs-not, object-methods : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "_xL2dmzdCz8", "title": "ES6 Tutorial #10 Modules (import & export)", "channel": "EN", "lang": "en"},
  {"youtubeId": "42E7iLumsE8", "title": "JavaScript ES6 : Apprendre import et export", "channel": "FR", "lang": "fr"}
]'::jsonb WHERE slug = 'modules-es' AND module_id = 'm10-javascript-moderne-es6';

-- cjs-vs-esm : fallback

UPDATE skills SET videos = '[
  {"youtubeId": "DqUPa0D2N78", "title": "Learn JavaScript INHERITANCE in 7 minutes", "channel": "Bro Code", "lang": "en"},
  {"youtubeId": "MsbNJPsjD-w", "title": "JavaScript ES6 - Classes", "channel": "EN", "lang": "en"}
]'::jsonb WHERE slug = 'classes-es6' AND module_id = 'm10-javascript-moderne-es6';

-- modern-operators, map-set : fallback

COMMIT;
