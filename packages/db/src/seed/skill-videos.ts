// =============================================================
// Skill Videos — curation manuelle FR + EN pour M01 → M10.
// =============================================================
// Source de vérité : ce fichier (côté seed dev).
// En prod, voir infra/postgres/init/04-skill-videos-data.sql
// (mêmes données, mêmes IDs YouTube, idempotent).
//
// Format : Record<moduleId, Record<skillSlug, SkillVideo[]>>
// IDs YouTube : 11 caractères exacts, jamais inventés. Les
// vidéos sont curées pour leur qualité pédagogique (FR
// favorisé quand dispo, sinon EN de référence type Fireship,
// Kevin Powell, Web Dev Simplified, freeCodeCamp, Net Ninja).
//
// Les skills sans entrée laissent le fallback du composant
// SkillVideos ("Chercher sur YouTube") prendre le relais.
// =============================================================

export type SkillVideo = {
  youtubeId: string;
  title?: string;
  channel?: string;
  lang: "fr" | "en";
};

export const skillVideosByModule: Record<
  string,
  Record<string, SkillVideo[]>
> = {
  // -----------------------------------------------------------
  // M01 — Comment fonctionne le web
  // -----------------------------------------------------------
  "m01-comment-fonctionne-le-web": {
    "internet-vs-web": [
      { youtubeId: "vIZ6bY48kWk", title: "Internet vs Web : Comprendre la différence", lang: "fr" },
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work? (Full Course)", channel: "freeCodeCamp / Ian Frost", lang: "en" },
    ],
    "client-server-model": [
      { youtubeId: "toMtdE3Usyo", title: "Connaître la relation client/serveur", channel: "video2brain", lang: "fr" },
      { youtubeId: "0w6GXuVHz1Y", title: "Client-Server Architecture Explained", lang: "en" },
    ],
    "tcp-ip-layers": [
      { youtubeId: "26jazyc7VNk", title: "Comprendre les modèles OSI et TCP/IP", lang: "fr" },
      { youtubeId: "P_hVprfTgls", title: "COMPRENDRE ENFIN le modèle OSI", lang: "fr" },
      { youtubeId: "L1pFhn1Uxx4", title: "Les modèles OSI & TCP/IP", lang: "fr" },
    ],
    "request-journey": [
      { youtubeId: "AlkDbnbv7dk", title: "What happens when you type a URL into your browser?", channel: "ByteByteGo", lang: "en" },
      { youtubeId: "dh406O2v_1c", title: "What happens when you type google.com (Detailed)", channel: "Hussein Nasser", lang: "en" },
    ],
    "ip-mac-port": [
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work?", channel: "freeCodeCamp", lang: "en" },
    ],
    "dns-resolution": [
      { youtubeId: "qzWdzAvfBoo", title: "Comprendre le DNS en 5 minutes", lang: "fr" },
      { youtubeId: "tyDxzzdKnsU", title: "Le DNS pour les débutants", lang: "fr" },
    ],
    "http-versions": [
      { youtubeId: "AlkDbnbv7dk", title: "What happens when you type a URL", channel: "ByteByteGo", lang: "en" },
    ],
    "http-anatomy": [
      { youtubeId: "dh406O2v_1c", title: "Detailed Analysis: type google.com", channel: "Hussein Nasser", lang: "en" },
    ],
    "https-tls": [
      { youtubeId: "k_ScPsb3WSk", title: "SSL/TLS pour les nuls", channel: "Julien Aubert", lang: "fr" },
      { youtubeId: "WIMKeyJ60Rw", title: "Comprendre HTTPS et le chiffrement SSL TLS en animation 3D", lang: "fr" },
    ],
    "devtools-network": [
      { youtubeId: "y4MpceWoeCY", title: "Chrome Devtools : Onglet Network", lang: "fr" },
    ],
    "network-hardware": [
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work?", channel: "freeCodeCamp", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M02 — Terminal & Shell (Bash)
  // -----------------------------------------------------------
  "m02-terminal-shell": {
    navigation: [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy / ysap.sh", lang: "en" },
    ],
    files: [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy / ysap.sh", lang: "en" },
    ],
    text: [
      { youtubeId: "yCTnihfbPCo", title: "Intermediate Bash Commands (grep, sed, awk, tar, less, gzip)", lang: "en" },
    ],
    permissions: [
      { youtubeId: "Z3_4RmYTO7s", title: "Linux File Permissions Explained", channel: "TechWorld with Nana", lang: "en" },
    ],
    "pipes-redirect": [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    env: [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    scripting: [
      { youtubeId: "K5sxW4PR_b4", title: "BASH : Des scripts solides", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    args: [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    "exit-codes": [
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    "text-tools": [
      { youtubeId: "oPEnvuj9QrI", title: "Linux Crash Course - awk", channel: "Learn Linux TV", lang: "en" },
      { youtubeId: "nXLnx8ncZyE", title: "Linux Crash Course - The sed Command", channel: "Learn Linux TV", lang: "en" },
    ],
    ssh: [
      { youtubeId: "Zzqtj0sRB1k", title: "Easy SSH Key Setup for GitHub on Ubuntu", lang: "en" },
    ],
    cron: [
      { youtubeId: "QZJ1drMQz1A", title: "Linux/Mac Tutorial: Cron Jobs - Schedule with crontab", channel: "Corey Schafer", lang: "en" },
      { youtubeId: "7cbP7fzn0D8", title: "Linux Crash Course - Scheduling Tasks with Cron", channel: "Learn Linux TV", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M03 — Git & GitHub
  // -----------------------------------------------------------
  "m03-git-github": {
    "git-vs-github": [
      { youtubeId: "rP3T0Ee6pLU", title: "Comprendre Git (1/18) : Qu'est ce que git ?", channel: "Grafikart", lang: "fr" },
    ],
    "three-zones": [
      { youtubeId: "chhVBZfRFgI", title: "Comprendre Git (5/18) : Premiers commits", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    "basic-cycle": [
      { youtubeId: "chhVBZfRFgI", title: "Comprendre Git : Premiers commits", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    "commit-messages": [
      { youtubeId: "JlfCRlFHmd8", title: "Conventional Commits - Git Tutorial part 15", lang: "en" },
    ],
    branches: [
      { youtubeId: "ZQAQ4HcskAY", title: "Comprendre Git (12/18) : Git Flow", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    "merge-vs-rebase": [
      { youtubeId: "cjSjlHUmaBU", title: "Git Merge vs Rebase Explained Visually", lang: "en" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    conflicts: [
      { youtubeId: "cjSjlHUmaBU", title: "Git Merge vs Rebase Explained Visually", lang: "en" },
    ],
    remotes: [
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    "pull-requests": [
      { youtubeId: "nCKdihvneS0", title: "What is a pull request & how to create one", lang: "en" },
      { youtubeId: "a_FLqX3vGR4", title: "GitHub Forks and Pull Requests | Step by Step", lang: "en" },
    ],
    undo: [
      { youtubeId: "BHfI9BMiK3E", title: "Git Tutorial : undo (amend, cherry-pick, reset, reflog, revert)", lang: "en" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    reflog: [
      { youtubeId: "BHfI9BMiK3E", title: "Git Tutorial : undo (reflog)", lang: "en" },
    ],
    "rewrite-history": [
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals (rebase interactif)", channel: "freeCodeCamp", lang: "en" },
    ],
    "ssh-keys": [
      { youtubeId: "Zzqtj0sRB1k", title: "Easy SSH Key Setup for GitHub on Ubuntu", lang: "en" },
    ],
    gitignore: [
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M04 — Env dev (VS Code, Node, pnpm, nvm)
  // -----------------------------------------------------------
  "m04-env-dev": {
    "vscode-config": [
      { youtubeId: "ifTF3ags0XI", title: "25 VS Code Productivity Tips and Speed Hacks", channel: "Fireship", lang: "en" },
    ],
    shortcuts: [
      { youtubeId: "ifTF3ags0XI", title: "25 VS Code Productivity Tips and Speed Hacks", channel: "Fireship", lang: "en" },
      { youtubeId: "u21W_tfPVrY", title: "VS Code Top-Ten Pro Tips", channel: "Fireship", lang: "en" },
    ],
    extensions: [
      { youtubeId: "80rrqS2QuBY", title: "Top 10 VS Code Extensions You Need RIGHT NOW", channel: "Fireship", lang: "en" },
    ],
    "node-vs-npm": [
      { youtubeId: "E_a6JwCRCaU", title: "Node Version Manager (NVM) Tutorial", lang: "en" },
    ],
    "nvm-fnm": [
      { youtubeId: "E_a6JwCRCaU", title: "Node Version Manager (NVM) Tutorial", lang: "en" },
      { youtubeId: "tjp-oNksxF4", title: "Switch Node.js Versions Like a Pro | NVM Tutorial", lang: "en" },
    ],
    semver: [
      { youtubeId: "u-GU7EkZksA", title: "Semantic Versioning & Conventional Commits Explained", lang: "en" },
    ],
    "format-lint": [
      { youtubeId: "IRdPRIPd9FM", title: "Prettier & ESLint in VS Code: The Ultimate Guide", lang: "en" },
      { youtubeId: "lGCHjQl6XLw", title: "VSCode + ESLint + Prettier. Comment bien configurer le tout", lang: "fr" },
    ],
  },

  // -----------------------------------------------------------
  // M05 — HTML5
  // -----------------------------------------------------------
  "m05-html5": {
    semantic: [
      { youtubeId: "RFdsBUppiE8", title: "Les bases du HTML : Les balises sémantiques", lang: "fr" },
      { youtubeId: "0uQv6HpAcpk", title: "Comprendre les balises sémantiques | HTML", lang: "fr" },
    ],
    forms: [
      { youtubeId: "EQrUGEvnCzY", title: "10 Form Validation Tips Every Web Developer SHOULD KNOW", lang: "en" },
    ],
    "input-types": [
      { youtubeId: "EQrUGEvnCzY", title: "10 Form Validation Tips", lang: "en" },
    ],
    validation: [
      { youtubeId: "EQrUGEvnCzY", title: "10 Form Validation Tips", lang: "en" },
    ],
    a11y: [
      { youtubeId: "e2nkq3h1P68", title: "Learn Accessibility – Full a11y Tutorial", channel: "Kevin Powell / freeCodeCamp", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M06 — CSS3 fondamentaux
  // -----------------------------------------------------------
  "m06-css3-fondamentaux": {
    cascade: [
      { youtubeId: "c0kfcP_nD9E", title: "CSS Specificity explained", channel: "Kevin Powell", lang: "en" },
      { youtubeId: "jhjVKZB9yc0", title: "Cascade & specificity (modern features)", channel: "Kevin Powell", lang: "en" },
    ],
    position: [
      { youtubeId: "86nTToBm2uQ", title: "Stop fighting with CSS positioning", channel: "Kevin Powell", lang: "en" },
    ],
    flexbox: [
      { youtubeId: "ixG2m6Nuxh0", title: "Apprendre CSS Flexbox en 15 Minutes", lang: "fr" },
      { youtubeId: "Pl7LbpGr2uU", title: "Apprendre les Flexbox CSS en 20 minutes", lang: "fr" },
    ],
    grid: [
      { youtubeId: "rg7Fvvl3taU", title: "Learn CSS Grid the easy way", channel: "Kevin Powell", lang: "en" },
    ],
    responsive: [
      { youtubeId: "9vZ7n5ylat0", title: "CSS Media Queries for Beginners (Mobile First)", lang: "en" },
      { youtubeId: "aook54SsfhY", title: "Learn CSS Media Queries by Building 3 Projects", lang: "en" },
    ],
    "css-vars": [
      { youtubeId: "i8bOsdnt0fI", title: "Introduction to CSS variables (full tutorial)", lang: "en" },
      { youtubeId: "W8LlgS9YCP4", title: "How to use CSS variables like a pro", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M07 — CSS avancé + Tailwind
  // -----------------------------------------------------------
  "m07-css-avance-tailwind": {
    transitions: [
      { youtubeId: "hleg4zmjQ-o", title: "MASTER CSS Transitions in 2024", channel: "Online Tutorials", lang: "en" },
    ],
    keyframes: [
      { youtubeId: "hleg4zmjQ-o", title: "MASTER CSS Transitions in 2024", lang: "en" },
      { youtubeId: "y8-F5-2EIcg", title: "10 CSS animation tips and tricks", channel: "Kevin Powell", lang: "en" },
    ],
    transforms: [
      { youtubeId: "hleg4zmjQ-o", title: "MASTER CSS Transitions in 2024", lang: "en" },
    ],
    "utility-first": [
      { youtubeId: "P1x9b1_0I2U", title: "Tailwind CSS en 1h : Maîtriser ce framework", lang: "fr" },
      { youtubeId: "9I3JQ1q4IMk", title: "Tailwind CSS for Beginners | Full Course", channel: "Net Ninja", lang: "en" },
    ],
    "tailwind-classes": [
      { youtubeId: "P1x9b1_0I2U", title: "Tailwind CSS en 1h", lang: "fr" },
      { youtubeId: "9I3JQ1q4IMk", title: "Tailwind CSS Full Course", channel: "Net Ninja", lang: "en" },
      { youtubeId: "lCxcTsOHrjo", title: "Tailwind CSS Full Course for Beginners (3 hours)", lang: "en" },
    ],
    "tailwind-states": [
      { youtubeId: "9I3JQ1q4IMk", title: "Tailwind CSS Full Course", channel: "Net Ninja", lang: "en" },
    ],
    "tailwind-config": [
      { youtubeId: "9I3JQ1q4IMk", title: "Tailwind CSS Full Course", channel: "Net Ninja", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M08 — JavaScript fondamental
  // -----------------------------------------------------------
  "m08-javascript-fondamental": {
    "types-primitifs": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
      { youtubeId: "PkZNo7MFNFg", title: "Learn JavaScript - Full Course for Beginners", channel: "freeCodeCamp", lang: "en" },
    ],
    "null-undefined": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    coercion: [
      { youtubeId: "RXMYIog5xmU", title: "JavaScript == vs === Explained: Coercion Demystified", lang: "en" },
    ],
    operators: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    "control-flow": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    loops: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    functions: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    scope: [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et... hoisting ?)", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes", lang: "en" },
    ],
    "var-let-const": [
      { youtubeId: "ZUk6RppaEYE", title: "What's the Difference Between var, let and const?", lang: "en" },
    ],
    hoisting: [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et... hoisting ?)", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M09 — JavaScript & le DOM
  // -----------------------------------------------------------
  "m09-javascript-dom": {
    "dom-tree": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (DOM)", channel: "SuperSimpleDev", lang: "en" },
    ],
    "selectors-js": [
      { youtubeId: "i_KXcwr7PYc", title: "How to Access HTML Elements Using JavaScript", lang: "en" },
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course", channel: "SuperSimpleDev", lang: "en" },
    ],
    events: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (DOM)", channel: "SuperSimpleDev", lang: "en" },
    ],
    "event-object": [
      { youtubeId: "NXXTLu2UnLE", title: "JavaScript Event Propagation - Bubbling and Capturing", lang: "en" },
    ],
    bubbling: [
      { youtubeId: "NXXTLu2UnLE", title: "JavaScript Event Propagation - Bubbling and Capturing", lang: "en" },
    ],
    delegation: [
      { youtubeId: "NXXTLu2UnLE", title: "JavaScript Event Propagation", lang: "en" },
    ],
    storage: [
      { youtubeId: "zmFDvFwj6-8", title: "JavaScript LocalStorage and Session Storage API Tutorial", lang: "en" },
      { youtubeId: "CsoknB_0TW8", title: "The Ins and Outs of localStorage and sessionStorage", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M10 — JavaScript moderne ES6+
  // -----------------------------------------------------------
  "m10-javascript-moderne-es6": {
    "arrow-functions": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (Arrays + Advanced)", channel: "SuperSimpleDev", lang: "en" },
    ],
    spread: [
      { youtubeId: "9BaqW4mlCXk", title: "Destructuring and REST/SPREAD operator (ES6)", lang: "en" },
      { youtubeId: "SFplA5KrAmQ", title: "JS Destructuring, Spread & Rest Operators Explained", lang: "en" },
    ],
    "destructuring-obj": [
      { youtubeId: "0EgAQUjRTdU", title: "Learn JavaScript Destructuring in 20 minutes", lang: "en" },
      { youtubeId: "9BaqW4mlCXk", title: "Destructuring and REST/SPREAD operator", lang: "en" },
    ],
    "destructuring-arr": [
      { youtubeId: "0EgAQUjRTdU", title: "Learn JavaScript Destructuring in 20 minutes", lang: "en" },
    ],
    "map-filter-reduce": [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (Arrays)", channel: "SuperSimpleDev", lang: "en" },
    ],
    "modules-es": [
      { youtubeId: "_xL2dmzdCz8", title: "ES6 Tutorial #10 Modules (import & export)", lang: "en" },
      { youtubeId: "42E7iLumsE8", title: "JavaScript ES6 : Apprendre import et export", lang: "fr" },
    ],
    "classes-es6": [
      { youtubeId: "DqUPa0D2N78", title: "Learn JavaScript INHERITANCE in 7 minutes", channel: "Bro Code", lang: "en" },
      { youtubeId: "MsbNJPsjD-w", title: "JavaScript ES6 - Classes", lang: "en" },
    ],
  },
};

/**
 * Retourne les vidéos curées pour un (moduleId, skillSlug) donné.
 * Tableau vide si pas de curation → le composant SkillVideos
 * affichera le fallback "Chercher sur YouTube".
 */
export function getSkillVideos(
  moduleId: string,
  skillSlug: string,
): SkillVideo[] {
  return skillVideosByModule[moduleId]?.[skillSlug] ?? [];
}
