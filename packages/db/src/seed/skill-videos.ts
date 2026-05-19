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

  // -----------------------------------------------------------
  // M11 — JavaScript asynchrone
  // -----------------------------------------------------------
  "m11-javascript-async": {
    "single-threaded": [
      { youtubeId: "8aGhZQkoFbQ", title: "What the heck is the event loop anyway?", channel: "Philip Roberts (JSConf EU)", lang: "en" },
    ],
    "event-loop": [
      { youtubeId: "8aGhZQkoFbQ", title: "What the heck is the event loop anyway?", channel: "Philip Roberts (JSConf EU)", lang: "en" },
      { youtubeId: "cCOL7MC4Pl0", title: "Jake Archibald: In The Loop (JSConf.Asia 2018)", channel: "JSConf", lang: "en" },
    ],
    callbacks: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (callbacks)", channel: "SuperSimpleDev", lang: "en" },
    ],
    promises: [
      { youtubeId: "05mKXSdkCJg", title: "Apprendre le JavaScript : Promise", channel: "Grafikart", lang: "fr" },
      { youtubeId: "RvYYCGs45L4", title: "JavaScript Promise in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "promise-static": [
      { youtubeId: "QO-3d128l28", title: "Promise.all, allSettled, race, any", lang: "en" },
    ],
    "async-await": [
      { youtubeId: "WNFNEe4bc5A", title: "Comment utiliser async & await ?", lang: "fr" },
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (async/await)", channel: "SuperSimpleDev", lang: "en" },
    ],
    fetch: [
      { youtubeId: "MQRQkyx6rJg", title: "JavaScript Promise : then() - async/await - fetch() en français", lang: "fr" },
    ],
    "fetch-post": [
      { youtubeId: "MQRQkyx6rJg", title: "JavaScript Promise + fetch() en français", lang: "fr" },
    ],
    "abort-controller": [
      { youtubeId: "jSFw9XR-eP0", title: "AbortController in JavaScript / cancel fetch requests", lang: "en" },
    ],
    microtasks: [
      { youtubeId: "cCOL7MC4Pl0", title: "Jake Archibald: In The Loop (microtasks)", channel: "JSConf", lang: "en" },
    ],
    "debounce-throttle": [
      { youtubeId: "cjIswDCKgu0", title: "Debounce and Throttle in JavaScript", lang: "en" },
    ],
    timers: [
      { youtubeId: "EerdGm-ehJQ", title: "JavaScript Tutorial Full Course (timers)", channel: "SuperSimpleDev", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M12 — JavaScript avancé (closures, this, prototype)
  // -----------------------------------------------------------
  "m12-javascript-avance": {
    "execution-context": [
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes", lang: "en" },
    ],
    "lexical-scope": [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et hoisting)", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes", lang: "en" },
    ],
    hoisting: [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et hoisting)", lang: "fr" },
    ],
    closures: [
      { youtubeId: "qikxEIxsXco", title: "Closures in JS | Namaste JavaScript Episode 10", channel: "Akshay Saini", lang: "en" },
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS", lang: "fr" },
    ],
    "closure-patterns": [
      { youtubeId: "qikxEIxsXco", title: "Closures in JS | Namaste JavaScript", channel: "Akshay Saini", lang: "en" },
    ],
    "this-contexts": [
      { youtubeId: "Pv9flm-80vM", title: "JavaScript THIS keyword explained", lang: "en" },
    ],
    "arrow-vs-function": [
      { youtubeId: "Pv9flm-80vM", title: "JavaScript THIS keyword (arrow vs function)", lang: "en" },
    ],
    prototypes: [
      { youtubeId: "DqUPa0D2N78", title: "Learn JavaScript INHERITANCE in 7 minutes", channel: "Bro Code", lang: "en" },
    ],
    "classes-prototypes": [
      { youtubeId: "MsbNJPsjD-w", title: "JavaScript ES6 - Classes", lang: "en" },
    ],
    inheritance: [
      { youtubeId: "DqUPa0D2N78", title: "Learn JavaScript INHERITANCE in 7 minutes", channel: "Bro Code", lang: "en" },
    ],
    currying: [
      { youtubeId: "iZLP4qOwY8I", title: "Function Currying in JavaScript | Namaste JavaScript", channel: "Akshay Saini", lang: "en" },
    ],
    memoization: [
      { youtubeId: "WbwP4w6TpCk", title: "Memoization in JavaScript", lang: "en" },
    ],
    functional: [
      { youtubeId: "BMUiFMZr7vk", title: "Functional Programming in JavaScript - Beau teaches JS", channel: "freeCodeCamp", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M13 — TypeScript
  // -----------------------------------------------------------
  "m13-typescript": {
    "what-is-ts": [
      { youtubeId: "zQnBQ4tB3ZA", title: "TypeScript in 100 Seconds", channel: "Fireship", lang: "en" },
      { youtubeId: "ffCIANfx_-0", title: "Apprendre TypeScript : Introduction", channel: "Grafikart", lang: "fr" },
    ],
    tsconfig: [
      { youtubeId: "PtsTS2S8hZM", title: "Apprendre TypeScript : Syntaxe de base", channel: "Grafikart", lang: "fr" },
    ],
    primitives: [
      { youtubeId: "PtsTS2S8hZM", title: "Apprendre TypeScript : Syntaxe de base", channel: "Grafikart", lang: "fr" },
      { youtubeId: "d56mG7DezGs", title: "TypeScript Tutorial for Beginners", channel: "Programming with Mosh", lang: "en" },
    ],
    complex: [
      { youtubeId: "d56mG7DezGs", title: "TypeScript Tutorial for Beginners", channel: "Programming with Mosh", lang: "en" },
    ],
    "interface-vs-type": [
      { youtubeId: "crjIq7LEAJw", title: "Type vs Interface - Which Should You Use In TypeScript?", channel: "Web Dev Simplified", lang: "en" },
    ],
    "union-intersection": [
      { youtubeId: "d56mG7DezGs", title: "TypeScript Tutorial for Beginners", channel: "Programming with Mosh", lang: "en" },
    ],
    "literal-types": [
      { youtubeId: "ahn80ZdHzhE", title: "TypeScript Tips: Literal Types, as const", channel: "Matt Pocock", lang: "en" },
    ],
    narrowing: [
      { youtubeId: "ahn80ZdHzhE", title: "TypeScript Tips: Type narrowing", channel: "Matt Pocock", lang: "en" },
    ],
    "any-unknown-never": [
      { youtubeId: "9bcuk1ngLDk", title: "TypeScript any vs unknown vs never", channel: "Matt Pocock", lang: "en" },
    ],
    generics: [
      { youtubeId: "Zz_Uf7JEddk", title: "LWJ: TypeScript Generics with Matt Pocock", channel: "Learn With Jason", lang: "en" },
    ],
    "utility-types": [
      { youtubeId: "Hg9rPl7Z4zA", title: "Apprendre TypeScript : Types utilitaires", channel: "Grafikart", lang: "fr" },
    ],
    "keyof-typeof": [
      { youtubeId: "BwuLxPH8IDs", title: "TypeScript keyof, typeof, as const explained", channel: "Matt Pocock", lang: "en" },
    ],
    "ts-react": [
      { youtubeId: "R1MlRKjCOLU", title: "Apprendre TypeScript : Typer React", channel: "Grafikart", lang: "fr" },
      { youtubeId: "-jnV9cNSCS8", title: "Tutoriel TypeScript avec React en 1 HEURE", channel: "MelvynxDev", lang: "fr" },
    ],
    "strict-mode": [
      { youtubeId: "p6dO9u0M7MQ", title: "TypeScript Crash Course with Matt Pocock", channel: "Matt Pocock", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M14 — React hooks
  // -----------------------------------------------------------
  "m14-react-composants-hooks": {
    "react-concept": [
      { youtubeId: "Tn6-PIqc4UM", title: "React in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "vite-react-setup": [
      { youtubeId: "MAtdgvLKn8E", title: "Vite + React + TypeScript Setup", lang: "en" },
    ],
    jsx: [
      { youtubeId: "hQAHSlTtcmY", title: "Learn React In 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    components: [
      { youtubeId: "hQAHSlTtcmY", title: "Learn React In 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    props: [
      { youtubeId: "hQAHSlTtcmY", title: "Learn React In 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "use-state": [
      { youtubeId: "O6P86uwfdR0", title: "Learn useState In 15 Minutes - React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
      { youtubeId: "ilqxZiXnwD8", title: "Apprendre React : Le hook useState", channel: "Grafikart", lang: "fr" },
    ],
    "use-effect": [
      { youtubeId: "dH6i3GurZW8", title: "Mastering React's useEffect", channel: "Jack Herrington", lang: "en" },
      { youtubeId: "vNLwY2UlbQg", title: "Apprendre React : Le hook useEffect", channel: "Grafikart", lang: "fr" },
    ],
    "use-ref": [
      { youtubeId: "LlvBzyy-558", title: "React Hooks Course - All React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
    ],
    "use-context": [
      { youtubeId: "LlvBzyy-558", title: "React Hooks Course - All React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
    ],
    "memo-callback": [
      { youtubeId: "LlvBzyy-558", title: "React Hooks Course - All React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
    ],
    "conditional-render": [
      { youtubeId: "hQAHSlTtcmY", title: "Learn React In 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "lists-key": [
      { youtubeId: "xe9bvyzHRao", title: "Why React Keys Matter (and why index is dangerous)", lang: "en" },
    ],
    forms: [
      { youtubeId: "LlvBzyy-558", title: "React Hooks Course (controlled forms)", channel: "Web Dev Simplified", lang: "en" },
    ],
    "react19-actions": [
      { youtubeId: "-aBKrvK5Vn8", title: "Learn useActionState In 8 Minutes - React Hooks Simplified", channel: "Web Dev Simplified", lang: "en" },
    ],
    rerender: [
      { youtubeId: "56_OUG-0wgI", title: "You're Doing React Hooks Wrong, Probably", channel: "Jack Herrington", lang: "en" },
    ],
    "hooks-rules": [
      { youtubeId: "LlvBzyy-558", title: "React Hooks Course - All React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
    ],
    "custom-hooks": [
      { youtubeId: "J-g9ZJha8FE", title: "Custom React Hooks Tutorial", channel: "Web Dev Simplified", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M15 — React écosystème
  // -----------------------------------------------------------
  "m15-react-ecosysteme": {
    "tanstack-router": [
      { youtubeId: "s1kzDQccUS0", title: "TanStack Router - Full Tutorial for Beginners", lang: "en" },
      { youtubeId: "Ab01W6h4Giw", title: "TanStack Router - How to Become a Routing God in React", lang: "en" },
    ],
    "router-params": [
      { youtubeId: "4rTsQTD9Me4", title: "Tanstack Router Tutorial - Routing, Lazy Loading, Data Fetching, Params", lang: "en" },
    ],
    "tanstack-query": [
      { youtubeId: "novnyCaa7To", title: "React Query Tutorial #1 - Intro & Setup", channel: "Net Ninja", lang: "en" },
      { youtubeId: "KkxPtimqaew", title: "TanStack Query - How to Master God-Tier React Query", channel: "Jack Herrington", lang: "en" },
    ],
    mutations: [
      { youtubeId: "KkxPtimqaew", title: "TanStack Query (mutations + optimistic)", channel: "Jack Herrington", lang: "en" },
    ],
    zustand: [
      { youtubeId: "_ngCLZ5Iz-0", title: "Zustand - Complete Tutorial", lang: "en" },
      { youtubeId: "fZPgBnL2x-Q", title: "Zustand React State Management Course", lang: "en" },
    ],
    rhf: [
      { youtubeId: "4nXVitqJ8EM", title: "React Hook Form Tutorial - Advanced Validation", channel: "Web Dev Simplified", lang: "en" },
    ],
    "zod-forms": [
      { youtubeId: "L6BE-U3oy80", title: "Learn Zod in 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    shadcn: [
      { youtubeId: "urlCrgNO0HY", title: "Shadcn UI Complete Guide", channel: "Code With Antonio", lang: "en" },
    ],
    "framer-motion": [
      { youtubeId: "2V1WK-3HQNk", title: "Framer Motion (for React) #1 - Introduction", channel: "Net Ninja", lang: "en" },
    ],
    "code-splitting": [
      { youtubeId: "ePcBC--QtZw", title: "React.lazy and Suspense - Code Splitting", lang: "en" },
    ],
    "error-boundaries": [
      { youtubeId: "DTBta08WgXE", title: "React Error Boundaries Explained", lang: "en" },
    ],
    "devtools-profiler": [
      { youtubeId: "0ZJgIjIuY7U", title: "React DevTools Profiler", lang: "en" },
    ],
    compiler: [
      { youtubeId: "lvhPq5chokM", title: "React Compiler Explained", channel: "Theo - t3.gg", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M16 — Node.js
  // -----------------------------------------------------------
  "m16-nodejs-runtime": {
    "what-is-node": [
      { youtubeId: "ahCwqrYpIuM", title: "Node.js in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "browser-vs-node": [
      { youtubeId: "ahCwqrYpIuM", title: "Node.js in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "cjs-vs-esm": [
      { youtubeId: "_l9qbXB1cFE", title: "CommonJS vs ES Modules - The Battle", lang: "en" },
    ],
    "package-json": [
      { youtubeId: "nkp_xhM0L0s", title: "Comprendre le dossier node_modules de NodeJS", channel: "Grafikart", lang: "fr" },
    ],
    "fs-promises": [
      { youtubeId: "_l9qbXB1cFE", title: "Node fs/promises tutorial", lang: "en" },
    ],
    "http-natif": [
      { youtubeId: "8gtO_W5GE5E", title: "Node.js HTTP module crash course", lang: "en" },
    ],
    process: [
      { youtubeId: "f2EqECiTBL8", title: "Node.js Process explained", lang: "en" },
    ],
    "event-loop-node": [
      { youtubeId: "P9csgxBgaZ8", title: "Node.js Event Loop Architecture", lang: "en" },
    ],
    "event-emitter": [
      { youtubeId: "jXjbWXn6Ng4", title: "Node.js EventEmitter tutorial", lang: "en" },
    ],
    streams: [
      { youtubeId: "iZCYQSq9IQM", title: "NodeJS (4/6) : Les Streams", channel: "Grafikart", lang: "fr" },
    ],
    "error-async": [
      { youtubeId: "8gtO_W5GE5E", title: "Node.js error handling best practices", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M17 — Fastify
  // -----------------------------------------------------------
  "m17-fastify-rest-api": {
    "framework-why": [
      { youtubeId: "a9uEhq1uwNk", title: "Fastify: The Node.js Framework You Didn't Know You Needed", lang: "en" },
    ],
    "fastify-vs-others": [
      { youtubeId: "a9uEhq1uwNk", title: "Fastify vs Express - Performance comparison", lang: "en" },
    ],
    setup: [
      { youtubeId: "btGtOue1oDA", title: "Fastify Course - The Performant Node.js Web Framework", lang: "en" },
    ],
    routing: [
      { youtubeId: "btGtOue1oDA", title: "Fastify Course (routing)", lang: "en" },
    ],
    "schemas-zod": [
      { youtubeId: "L6BE-U3oy80", title: "Learn Zod in 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "ts-inference": [
      { youtubeId: "L6BE-U3oy80", title: "Learn Zod in 30 Minutes (TS inference)", channel: "Web Dev Simplified", lang: "en" },
    ],
    "lifecycle-hooks": [
      { youtubeId: "btGtOue1oDA", title: "Fastify Course (hooks)", lang: "en" },
    ],
    plugins: [
      { youtubeId: "btGtOue1oDA", title: "Fastify Course (plugins)", lang: "en" },
    ],
    "core-plugins": [
      { youtubeId: "x3SG71Ut2tA", title: "Unlocking Node.js' Power: A Journey into Fastify", lang: "en" },
    ],
    "rest-conventions": [
      { youtubeId: "lsMQRaeKNDk", title: "REST API best practices", lang: "en" },
    ],
    swagger: [
      { youtubeId: "btGtOue1oDA", title: "Fastify Course (Swagger)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M18 — SQL / PostgreSQL
  // -----------------------------------------------------------
  "m18-sql-postgresql": {
    "relational-concept": [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course for Beginners", channel: "freeCodeCamp", lang: "en" },
    ],
    "setup-pg": [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course", channel: "freeCodeCamp", lang: "en" },
    ],
    ddl: [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (DDL)", channel: "freeCodeCamp", lang: "en" },
    ],
    "dml-basic": [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (DML)", channel: "freeCodeCamp", lang: "en" },
      { youtubeId: "HXV3zeQKqGY", title: "SQL Tutorial - Full Database Course for Beginners", channel: "freeCodeCamp", lang: "en" },
    ],
    types: [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course", channel: "freeCodeCamp", lang: "en" },
    ],
    constraints: [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (constraints)", channel: "freeCodeCamp", lang: "en" },
    ],
    joins: [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (JOINs)", channel: "freeCodeCamp", lang: "en" },
    ],
    aggregations: [
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (GROUP BY)", channel: "freeCodeCamp", lang: "en" },
    ],
    cte: [
      { youtubeId: "QNfnuK-1YYY", title: "PostgreSQL CTE Tutorial", lang: "en" },
    ],
    window: [
      { youtubeId: "Ww71knvhQ-s", title: "PostgreSQL Window Functions Tutorial", lang: "en" },
    ],
    transactions: [
      { youtubeId: "P80Js_qClUE", title: "Postgres Transactions Tutorial", lang: "en" },
    ],
    indexes: [
      { youtubeId: "fsG1XaZEa78", title: "PostgreSQL Indexes Explained", lang: "en" },
    ],
    explain: [
      { youtubeId: "0qIAa9rROpY", title: "EXPLAIN ANALYZE Postgres", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M19 — Drizzle ORM
  // -----------------------------------------------------------
  "m19-drizzle-orm": {
    "orm-concept": [
      { youtubeId: "hIYNOiZXQ7Y", title: "Learn Drizzle ORM in 13 mins (crash course)", lang: "en" },
    ],
    "drizzle-vs-prisma": [
      { youtubeId: "A2a3jznxvUs", title: "Drizzle ORM Full Course Tutorial For Beginners", lang: "en" },
    ],
    "setup-drizzle": [
      { youtubeId: "7-NZ0MlPpJA", title: "Learn Drizzle In 60 Minutes", lang: "en" },
      { youtubeId: "mMv7nTf0qaw", title: "Drizzle ORM : comment l'installer et démarrer proprement", channel: "Mike Codeur", lang: "fr" },
    ],
    "schema-ts": [
      { youtubeId: "7-NZ0MlPpJA", title: "Learn Drizzle In 60 Minutes", lang: "en" },
    ],
    "query-builder": [
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Drizzle Course for Beginners", lang: "en" },
    ],
    "drizzle-joins": [
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Course (joins)", lang: "en" },
    ],
    relations: [
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Course (relations)", lang: "en" },
    ],
    "relational-queries": [
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Course (RQB)", lang: "en" },
    ],
    "transactions-drizzle": [
      { youtubeId: "A2a3jznxvUs", title: "Drizzle ORM Full Course Tutorial (transactions)", lang: "en" },
    ],
    "drizzle-kit": [
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Course (drizzle-kit)", lang: "en" },
    ],
    "drizzle-zod": [
      { youtubeId: "A2a3jznxvUs", title: "Drizzle ORM Full Course (drizzle-zod)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M20 — Sécurité OWASP + Auth
  // -----------------------------------------------------------
  "m20-securite-auth": {
    "owasp-top10": [
      { youtubeId: "hryt-rCLJUA", title: "OWASP Top 10 2021 - The List and How You Should Use It", lang: "en" },
      { youtubeId: "kdTkj6DdbCg", title: "OWASP Top 10 2021 Explained | Web Application Vulnerabilities", lang: "en" },
    ],
    "auth-vs-authz": [
      { youtubeId: "I48cIcCdII8", title: "Authentication vs Authorization explained", lang: "en" },
    ],
    "hash-passwords": [
      { youtubeId: "8ZtInClXe1Q", title: "Password Hashing, Salts, Peppers | Explained!", lang: "en" },
    ],
    jwt: [
      { youtubeId: "S-xBAo47W58", title: "Tutoriel : Découverte du JWT", channel: "Grafikart", lang: "fr" },
      { youtubeId: "V27fNfRNHkg", title: "Introduction au JWT : principe de fonctionnement", lang: "fr" },
    ],
    "token-storage": [
      { youtubeId: "iJKCj8uAHz8", title: "Where to store JWT tokens (localStorage vs httpOnly cookie)", lang: "en" },
    ],
    "refresh-tokens": [
      { youtubeId: "4TtAGhr61VI", title: "Access Token & Refresh Token Authentication", lang: "en" },
    ],
    "oauth-oidc": [
      { youtubeId: "996OiexHze0", title: "OAuth 2.0 Explained", lang: "en" },
    ],
    csp: [
      { youtubeId: "1Ee5z0PnQB4", title: "Content Security Policy (CSP) tutorial", lang: "en" },
    ],
    csrf: [
      { youtubeId: "vRBihr41JTo", title: "Cross Site Request Forgery", channel: "Computerphile", lang: "en" },
    ],
    xss: [
      { youtubeId: "L5l9lSnNMxg", title: "Cracking Websites with Cross Site Scripting", channel: "Computerphile", lang: "en" },
      { youtubeId: "EoaDgUgS6QA", title: "Cross-Site Scripting (XSS) Explained", lang: "en" },
    ],
    "sql-injection": [
      { youtubeId: "ciNHn38EyRc", title: "SQL Injection - Computerphile", channel: "Computerphile", lang: "en" },
    ],
    "rate-limit": [
      { youtubeId: "P7y8nPlGy5w", title: "Rate Limiting explained", lang: "en" },
    ],
    secrets: [
      { youtubeId: "17UVejOw3zA", title: "Stop Hardcoding Secrets - env vars best practices", lang: "en" },
    ],
    "https-tls": [
      { youtubeId: "k_ScPsb3WSk", title: "SSL/TLS pour les nuls", channel: "Julien Aubert", lang: "fr" },
    ],
    "2fa": [
      { youtubeId: "0mvCeNsTa1g", title: "How TOTP / Two-Factor Authentication works", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M21 — Tests
  // -----------------------------------------------------------
  "m21-tests": {
    "why-test": [
      { youtubeId: "u6QfIXgjwGQ", title: "Why You Should Write Tests", lang: "en" },
    ],
    pyramid: [
      { youtubeId: "Fha2bVoC8SE", title: "The Testing Pyramid explained", lang: "en" },
    ],
    tdd: [
      { youtubeId: "Jv2uxzhPFl4", title: "Test Driven Development // Fun TDD Introduction with JavaScript", lang: "en" },
    ],
    "vitest-basics": [
      { youtubeId: "MsqhBNZilB8", title: "Testing JavaScript project with Vitest", lang: "en" },
      { youtubeId: "CxSL0knFxAs", title: "React Vite Testing Tutorial - Vitest Crash Course", lang: "en" },
    ],
    assertions: [
      { youtubeId: "CxSL0knFxAs", title: "Vitest Testing Crash Course (assertions)", lang: "en" },
    ],
    mocks: [
      { youtubeId: "CxSL0knFxAs", title: "Vitest Testing Crash Course (mocks)", lang: "en" },
    ],
    "testing-library": [
      { youtubeId: "JBSUgDxICg8", title: "React Testing Library Tutorial - Jest, Testing Library Basics", channel: "Net Ninja", lang: "en" },
    ],
    "tl-philosophy": [
      { youtubeId: "JBSUgDxICg8", title: "Testing Library Philosophy (test behavior, not implementation)", lang: "en" },
    ],
    msw: [
      { youtubeId: "Vsk0nDJ12VE", title: "MSW Mock Service Worker Tutorial", lang: "en" },
    ],
    playwright: [
      { youtubeId: "Ov9e_F8I5zc", title: "Playwright Tutorial Crash Course using Typescript", lang: "en" },
      { youtubeId: "7ApphAma11A", title: "Playwright Crash Course", lang: "en" },
    ],
    "playwright-traces": [
      { youtubeId: "Ov9e_F8I5zc", title: "Playwright Tutorial (Trace Viewer)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M22 — DevOps déploiement
  // -----------------------------------------------------------
  "m22-devops-deploiement": {
    "docker-why": [
      { youtubeId: "Gjnup-PuquQ", title: "Docker in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    dockerfile: [
      { youtubeId: "gAkwW2tuIqE", title: "Learn Docker in 7 Easy Steps - Full Beginner's Tutorial", channel: "Fireship", lang: "en" },
    ],
    "multi-stage": [
      { youtubeId: "8vXoMqWgbQQ", title: "Docker Multi-stage Builds Tutorial", lang: "en" },
    ],
    "docker-cli": [
      { youtubeId: "gAkwW2tuIqE", title: "Learn Docker in 7 Easy Steps", channel: "Fireship", lang: "en" },
    ],
    compose: [
      { youtubeId: "DM65_JyGxCo", title: "Docker Compose Tutorial - From Zero to Hero", channel: "TechWorld with Nana", lang: "en" },
    ],
    "github-actions": [
      { youtubeId: "R8_veQiYBjI", title: "GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker", channel: "TechWorld with Nana", lang: "en" },
      { youtubeId: "Xwpi0ITkL3U", title: "Complete GitHub Actions Course - From BEGINNER to PRO", lang: "en" },
    ],
    "secrets-vars": [
      { youtubeId: "R8_veQiYBjI", title: "GitHub Actions Tutorial (secrets)", channel: "TechWorld with Nana", lang: "en" },
    ],
    "ci-pipeline": [
      { youtubeId: "YLtlz88zrLg", title: "CI/CD Tutorial using GitHub Actions - Automated Testing & Deployments", lang: "en" },
    ],
    "cd-pipeline": [
      { youtubeId: "YLtlz88zrLg", title: "CI/CD Tutorial using GitHub Actions", lang: "en" },
    ],
    paas: [
      { youtubeId: "MFFXuXEYRp4", title: "Vercel, Netlify, Railway - Where to deploy?", lang: "en" },
    ],
    "deploy-nextjs": [
      { youtubeId: "AiiGjB2AxqA", title: "Deploy Next.js to Vercel - Tutorial", lang: "en" },
    ],
    "healthcheck-shutdown": [
      { youtubeId: "0n8CN4LcMqU", title: "Graceful Shutdown Node.js - SIGTERM handling", lang: "en" },
    ],
    monitoring: [
      { youtubeId: "9wKgKr_LFTM", title: "Sentry Error Tracking Tutorial", lang: "en" },
    ],
    "12factor": [
      { youtubeId: "1OhmRmMsGdQ", title: "Twelve-Factor App Methodology Explained", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M23 — Three.js / R3F (3D)
  // -----------------------------------------------------------
  "m23-threejs-r3f": {
    "webgl-threejs": [
      { youtubeId: "NLphiJpL0Jc", title: "Three.js Journey — 30k students (free lesson)", channel: "Bruno Simon", lang: "en" },
    ],
    "pipeline-3d": [
      { youtubeId: "pUgWfqWZWmM", title: "Getting Started with THREE.JS in 2021!", channel: "DesignCourse", lang: "en" },
    ],
    basics: [
      { youtubeId: "pUgWfqWZWmM", title: "Getting Started with THREE.JS", channel: "DesignCourse", lang: "en" },
    ],
    geometries: [
      { youtubeId: "B16IJLW_WoI", title: "Meshes - React Three Fiber Tutorial for Beginners", channel: "Wael Yasmina", lang: "en" },
    ],
    materials: [
      { youtubeId: "pUgWfqWZWmM", title: "Getting Started with THREE.JS (materials)", channel: "DesignCourse", lang: "en" },
    ],
    textures: [
      { youtubeId: "mb7Jr8awsLI", title: "Applying Textures to Meshes - React Three Fiber", channel: "Wael Yasmina", lang: "en" },
    ],
    lights: [
      { youtubeId: "pUgWfqWZWmM", title: "Getting Started with THREE.JS (lights)", channel: "DesignCourse", lang: "en" },
    ],
    transforms: [
      { youtubeId: "WKSVa0Q2W4s", title: "Geometric Transformations - React Three Fiber", channel: "Wael Yasmina", lang: "en" },
    ],
    r3f: [
      { youtubeId: "jKy2Rm7EVOk", title: "React Three Fiber Crash Course for Beginners", channel: "Wael Yasmina", lang: "en" },
      { youtubeId: "XBcnD7WRYkY", title: "Setting Up - React Three Fiber Tutorial", channel: "Wael Yasmina", lang: "en" },
    ],
    drei: [
      { youtubeId: "5TkuOGN0X_Y", title: "Helpers and Gizmos - React Three Fiber", channel: "Wael Yasmina", lang: "en" },
    ],
    "gltf-workflow": [
      { youtubeId: "J3zQd_PRJC8", title: "Loading Models and the Primitive Component - R3F", channel: "Wael Yasmina", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M24 — Python scripting / data
  // -----------------------------------------------------------
  "m24-python-scripting-data": {
    "python-vs-js": [
      { youtubeId: "x7X9w_GIm1s", title: "Python in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    syntax: [
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course for Beginners", channel: "freeCodeCamp", lang: "en" },
      { youtubeId: "XKHEtdqhLK8", title: "Python Full Course for free 🐍", channel: "Bro Code", lang: "en" },
    ],
    "data-structures": [
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course (data structures)", channel: "freeCodeCamp", lang: "en" },
    ],
    comprehensions: [
      { youtubeId: "3dt4OGnU5sM", title: "Python List Comprehensions explained", lang: "en" },
    ],
    "functions-py": [
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course (functions)", channel: "freeCodeCamp", lang: "en" },
    ],
    "classes-py": [
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course (classes)", channel: "freeCodeCamp", lang: "en" },
    ],
    "type-hints": [
      { youtubeId: "yScuF1UgGU0", title: "Python Type Hints - Modern Python", lang: "en" },
    ],
    pathlib: [
      { youtubeId: "UcKkmwirGRg", title: "Python pathlib module tutorial", lang: "en" },
    ],
    "io-csv-json": [
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course (file I/O)", channel: "freeCodeCamp", lang: "en" },
    ],
    asyncio: [
      { youtubeId: "t5Bo1Je9EmE", title: "Python asyncio tutorial", lang: "en" },
    ],
    pytest: [
      { youtubeId: "cHYq1MRoyI0", title: "Pytest Tutorial - How to Test Python Code", lang: "en" },
    ],
    venv: [
      { youtubeId: "8mk85fyzevc", title: "Python venv + uv - Virtual environments", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M25 — IA appliquée (Anthropic SDK, RAG, agents)
  // -----------------------------------------------------------
  "m25-ia-appliquee": {
    "llm-concept": [
      { youtubeId: "zjkBMFhNj_g", title: "[1hr Talk] Intro to Large Language Models", channel: "Andrej Karpathy", lang: "en" },
    ],
    "model-families": [
      { youtubeId: "zjkBMFhNj_g", title: "Intro to LLMs (model families)", channel: "Andrej Karpathy", lang: "en" },
    ],
    sdks: [
      { youtubeId: "TqC1qOfiVcQ", title: "Claude Agent SDK [Full Workshop]", channel: "Anthropic", lang: "en" },
    ],
    "prompt-eng": [
      { youtubeId: "dOxUroR57xs", title: "Prompt Engineering Tutorial", channel: "freeCodeCamp", lang: "en" },
    ],
    "structured-output": [
      { youtubeId: "TqC1qOfiVcQ", title: "Claude Agent SDK (structured output)", channel: "Anthropic", lang: "en" },
    ],
    embeddings: [
      { youtubeId: "ArnMdc-ICCM", title: "Embeddings - Understanding Vector Representations", lang: "en" },
    ],
    "vector-db": [
      { youtubeId: "klTvEwg3oJ4", title: "Vector Databases simply explained", lang: "en" },
    ],
    rag: [
      { youtubeId: "T-D1OfcDW1M", title: "What is Retrieval-Augmented Generation (RAG)?", channel: "IBM Technology", lang: "en" },
      { youtubeId: "tKPSmn-urB4", title: "AI Explained: What is RAG - Retrieval Augmented Generation?", lang: "en" },
    ],
    chunking: [
      { youtubeId: "8OJC21T2SL4", title: "Chunking Strategies for RAG", lang: "en" },
    ],
    "agents-react": [
      { youtubeId: "TqC1qOfiVcQ", title: "Claude Agent SDK Full Workshop (ReAct agents)", channel: "Anthropic", lang: "en" },
    ],
    mcp: [
      { youtubeId: "7j_NE6Pjv-E", title: "Model Context Protocol (MCP) Explained", lang: "en" },
    ],
    "prompt-injection": [
      { youtubeId: "zjkBMFhNj_g", title: "Intro to LLMs (prompt injection)", channel: "Andrej Karpathy", lang: "en" },
    ],
    "prompt-caching": [
      { youtubeId: "ASAaKhK1B5w", title: "Even Anthropic Engineers Use This Claude Code Workflow", channel: "Anthropic", lang: "en" },
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
