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
  "m00-algo-structures-donnees": {
    "big-o-intuition": [
      { youtubeId: "uqYY0nInx-8", title: "Complexité temporelle - Partie 1 : intuition (ALGO1)", lang: "fr" },
      { youtubeId: "gI4lX1EtGJw", title: "Notion de complexité temporelle pour un algorithme - Quelques exemples simples", lang: "fr" },
      { youtubeId: "XMUe3zFhM5c", title: "Learn Big O notation in 6 minutes", channel: "Bro Code", lang: "en" },
    ],
    "big-o-notation": [
      { youtubeId: "QaNwlm8AzMA", title: "Algorithmique #02 : Comparaison de l'efficacité des algorithmes (Notation Big O et exemples)", lang: "fr" },
      { youtubeId: "IHdf13wRhO0", title: "Complexité d'un algorithme : O(1), O(log n), O(n), O(n log n), O(2^n), O(n!)", lang: "fr" },
      { youtubeId: "__vX2sjlpXU", title: "Big-O Notation in 5 Minutes", channel: "Michael Sambol", lang: "en" },
      { youtubeId: "A03oI0znAoc", title: "1.8.1 Asymptotic Notations Big Oh - Omega - Theta", channel: "Abdul Bari", lang: "en" },
    ],
    "analyze-complexity": [
      { youtubeId: "9Oi0tQchkHg", title: "L'essentiel : estimation de la complexité sur un exemple", lang: "fr" },
      { youtubeId: "clZ4q5zPBlE", title: "Méthode de calcul de la complexité d'un algorithme", channel: "Rachid Guerraoui", lang: "fr" },
      { youtubeId: "hNgPd6cQsSM", title: "Complexité temporelle - Partie 4 : Exemples (ALGO1)", lang: "fr" },
    ],
    "recursion-mental-model": [
      { youtubeId: "6snxXOscP_A", title: "Récursivité - Introduction - NSI Terminale / PostBac", lang: "fr" },
      { youtubeId: "HMKsnbWWNIc", title: "Algorithmique (13/14) - La récursivité (fonctions récursives)", lang: "fr" },
      { youtubeId: "B0NtAFf4bvU", title: "Introduction to Recursion (Data Structures & Algorithms #6)", channel: "CS Dojo", lang: "en" },
    ],
    "recursion-patterns": [
      { youtubeId: "5KoTcO7LjhE", title: "Algorithme récursif : Les tours de Hanoï", lang: "fr" },
      { youtubeId: "YMECEWjAxTo", title: "Récursivité - Épisode 3 - Les tours de Hanoï (Python)", lang: "fr" },
      { youtubeId: "IJDJ0kBx2LM", title: "Recursion in Programming - Full Course", channel: "freeCodeCamp.org", lang: "en" },
    ],
    "memoization-basics": [
      { youtubeId: "spiTIpmXLEc", title: "What is Dynamic Programming, Memoization and Tabulation? | Fibonacci", lang: "en" },
      { youtubeId: "Qk0zUZW-U_M", title: "Recursion, the Fibonacci Sequence and Memoization (Python Tutorial)", channel: "Socratica", lang: "en" },
    ],
    "arrays-internals": [
      { youtubeId: "d-BR1CxFJVU", title: "Structure de Données Tableau/Array Expliqué | Tutoriel Débutants", lang: "fr" },
      { youtubeId: "xT70mHdAM74", title: "Design a Dynamic Array (Resizable Array)", channel: "NeetCode", lang: "en" },
      { youtubeId: "MTl8djZFWE0", title: "What is Amortized Time Complexity? - Dynamic Array", lang: "en" },
    ],
    "linked-lists": [
      { youtubeId: "BVJYOioKZr0", title: "[Algorithme] - 153. Les listes chaînées [Python]", lang: "fr" },
      { youtubeId: "5qZ2GwSgqm4", title: "Singly Linked List - Data Structures and Algorithms for Beginners", channel: "NeetCode", lang: "en" },
      { youtubeId: "58YbpRDc4yw", title: "Linked List Tutorial - Singly + Doubly + Circular (Theory + Code)", lang: "en" },
    ],
    stacks: [
      { youtubeId: "ZNs0TNMRpJo", title: "Structure de donnée de Pile LIFO (en Python)", lang: "fr" },
      { youtubeId: "0r-pSf3PwVQ", title: "Les structures de données : PILE, FILE et LISTE - NSI Terminale", lang: "fr" },
    ],
    queues: [
      { youtubeId: "2ryGsa7IP2s", title: "Comprendre la structure de données File d'attente (Queue)", lang: "fr" },
      { youtubeId: "nqXaPZi99JI", title: "Learn Queue data structures in 10 minutes", channel: "Bro Code", lang: "en" },
    ],
    hashmaps: [
      { youtubeId: "ZnikXPYMWKw", title: "Comprendre les Tables de Hashage - Structure de données - Algorithme", lang: "fr" },
      { youtubeId: "kY5ul5fEIG4", title: "Introduction aux tables de hachage", lang: "fr" },
      { youtubeId: "tKodEscMkSQ", title: "The Load Factor and Hash Table Resizing", lang: "en" },
    ],
    "binary-search": [
      { youtubeId: "EbPJjKYqXr8", title: "La recherche dichotomique - NSI Terminale", lang: "fr" },
      { youtubeId: "B7xcusKbsEQ", title: "Recherche dichotomique dans un tableau - Algorithme & programme Python", lang: "fr" },
      { youtubeId: "v9IWor4n0Ys", title: "Introduction to Binary Search", channel: "Abdul Bari", lang: "en" },
    ],
    "sorting-elementary": [
      { youtubeId: "ra79TDfotno", title: "Algorithmes de tri (tri à bulles, sélection, insertion)", lang: "fr" },
      { youtubeId: "QxrHEcvk5Q0", title: "Le tri par sélection - Explication facile - NSI Terminale", lang: "fr" },
      { youtubeId: "E3Xr4nErXH8", title: "Tri à bulles / Tri sélection / Tri insertion", lang: "fr" },
    ],
    "sorting-merge": [
      { youtubeId: "ADcIf8iBdng", title: "Algorithme Tri Fusion (Merge Sort) expliqué", lang: "fr" },
      { youtubeId: "6xdXQ_8Poxs", title: "Diviser pour régner : tri fusion (Vidéo 2)", lang: "fr" },
      { youtubeId: "mB5HXBb_HY8", title: "2.7.2 Merge Sort Algorithm", channel: "Abdul Bari", lang: "en" },
    ],
    "sorting-quick": [
      { youtubeId: "YNCKVNPI8Qs", title: "Algorithme Tri Rapide (Quick Sort) expliqué", lang: "fr" },
      { youtubeId: "Cubuk-9gzvk", title: "Quicksort (tri rapide)", lang: "fr" },
      { youtubeId: "7h1s2SojIRw", title: "2.8.1 QuickSort Algorithm", channel: "Abdul Bari", lang: "en" },
    ],
    "trees-bst": [
      { youtubeId: "e6m__g6Be9A", title: "Construire et parcourir un arbre binaire de recherche (ABR) - préfixe, postfixe, infixe, en largeur", lang: "fr" },
      { youtubeId: "z1K6YMJmr6s", title: "Parcourir un arbre binaire", lang: "fr" },
      { youtubeId: "wcIRPqTR3Kc", title: "Binary Search Trees (BSTs) - Insert and Remove Explained", channel: "NeetCode", lang: "en" },
    ],
    "bfs-dfs-trees": [
      { youtubeId: "Cz91zP1r_hs", title: "Les parcours d'arbre itératifs", lang: "fr" },
      { youtubeId: "9gQvDVsvGVo", title: "Algorithmes de parcours d'arbre (BFS, DFS, preorder, postorder, inorder)", lang: "fr" },
    ],
    "bfs-dfs-graphs": [
      { youtubeId: "472-NbPTe2k", title: "Algorithme sur les graphes : Parcours en largeur et en profondeur", lang: "fr" },
      { youtubeId: "qaWy47SfO9s", title: "Breadth First Search (BFS) et Depth First Search (DFS) pour les graphes", lang: "fr" },
      { youtubeId: "nfRsSozzAKY", title: "Parcours en PROFONDEUR (DFS) d'un graphe (version détaillée)", lang: "fr" },
    ],
  },
  // -----------------------------------------------------------
  // M01 — Comment fonctionne le web
  // -----------------------------------------------------------
  "m01-comment-fonctionne-le-web": {
    "internet-vs-web": [
      { youtubeId: "RHljpE7pZh8", title: "Le Web expliqué avec des emojis", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "1b06yz9ZAU0", title: "Internet vs Web : la base indispensable pour débuter en dév web", lang: "fr" },
      { youtubeId: "uTnBcEcQNHs", title: "Quelle est la différence entre Internet et le Web ?", lang: "fr" },
    ],
    "client-server-model": [
      { youtubeId: "ey8LtnsHjUg", title: "Architecture client-serveur et protocole HTTP", lang: "fr" },
      { youtubeId: "bDA9lQB7cmA", title: "Comprendre l'architecture client-serveur", lang: "fr" },
      { youtubeId: "sz3gXm5v_G0", title: "Le protocole HTTP — dialogue client/serveur web", lang: "fr" },
    ],
    "osi-tcpip-models": [
      { youtubeId: "HuxCOWxQudU", title: "Les fondamentaux du réseau (Partie 1)", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "26jazyc7VNk", title: "Comprendre les modèles OSI et TCP/IP", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "P_hVprfTgls", title: "COMPRENDRE ENFIN le modèle OSI", lang: "fr" },
      { youtubeId: "L1pFhn1Uxx4", title: "Les modèles OSI & TCP/IP", lang: "fr" },
    ],
    "request-journey": [
      { youtubeId: "RHljpE7pZh8", title: "Le Web expliqué avec des emojis", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "abrLW6QnWF8", title: "Le parcours d'une requête HTTP (Comprendre Internet, ép. 8)", lang: "fr" },
      { youtubeId: "AlkDbnbv7dk", title: "What happens when you type a URL into your browser?", channel: "ByteByteGo", lang: "en" },
      { youtubeId: "dh406O2v_1c", title: "What happens when you type google.com (Detailed)", channel: "Hussein Nasser", lang: "en" },
    ],
    "ipv4-ipv6-subnetting": [
      { youtubeId: "YSl6bordSh8", title: "Ports et protocoles : comprendre l'essentiel en 5 minutes", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "BzPgtMSvZFE", title: "Les adresses IP (Comprendre comment marche Internet, ép. 4)", lang: "fr" },
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work?", channel: "freeCodeCamp", lang: "en" },
    ],
    "dns-deep": [
      { youtubeId: "qzWdzAvfBoo", title: "Comprendre le DNS en 5 minutes", channel: "Cookie connecté", lang: "fr" },
      { youtubeId: "dcIrB8qRCbA", title: "Comment fonctionne le DNS ?", channel: "Afnic", lang: "fr" },
      { youtubeId: "tyDxzzdKnsU", title: "Le DNS pour les débutants", lang: "fr" },
    ],
    "http-versions": [
      { youtubeId: "tzndixsy51k", title: "Quelles sont les différences entre HTTP 1, 2 & 3 ?", lang: "fr" },
      { youtubeId: "AlkDbnbv7dk", title: "What happens when you type a URL", channel: "ByteByteGo", lang: "en" },
    ],
    "http-anatomy": [
      { youtubeId: "qcSGJkaA93M", title: "Qu'est-ce qu'il y a dans une requête HTTP ?", lang: "fr" },
      { youtubeId: "q4gFgV_UJ94", title: "Le protocole HTTP", lang: "fr" },
      { youtubeId: "dh406O2v_1c", title: "Detailed Analysis: type google.com", channel: "Hussein Nasser", lang: "en" },
    ],
    "tls-pki": [
      { youtubeId: "WIMKeyJ60Rw", title: "Comprendre HTTPS et le chiffrement SSL TLS en animation 3D", lang: "fr" },
      { youtubeId: "7W7WPMX7arI", title: "Comprendre le chiffrement SSL/TLS avec des emojis (et le HTTPS)", lang: "fr" },
      { youtubeId: "k_ScPsb3WSk", title: "SSL/TLS pour les nuls", channel: "Julien Aubert", lang: "fr" },
      { youtubeId: "-dHbXLR-Mao", title: "Qu'est-ce qu'un certificat SSL/TLS ? (Cryptographie, PKI, OpenSSL)", lang: "fr" },
    ],
    "devtools-network": [
      { youtubeId: "y4MpceWoeCY", title: "Chrome Devtools : Onglet Network", lang: "fr" },
      { youtubeId: "K_gZPUVY4tE", title: "Échanges requête / réponse HTTP via l'inspecteur (F12) du navigateur", lang: "fr" },
      { youtubeId: "6QfJWYonU8I", title: "Afficher les requêtes HTTP sur Google Chrome", lang: "fr" },
    ],
    "nat-firewalls": [
      { youtubeId: "Fopnr0IpwPM", title: "Comment fonctionne un routeur expliqué simplement", channel: "Formip", lang: "fr" },
      { youtubeId: "rHHVzhUmLqQ", title: "Comprends enfin la différence entre routeur et switch !", lang: "fr" },
      { youtubeId: "iQbS-eNQXzY", title: "Qu'est-ce qu'un routeur ?", lang: "fr" },
    ],
    "domain-vs-hosting": [
      { youtubeId: "j9IXwmA91iw", title: "Qu'est-ce qu'un nom de domaine, un hébergement et un hébergeur ?", lang: "fr" },
      { youtubeId: "qYuWKwGlk_0", title: "La différence entre un nom de domaine et un hébergeur", lang: "fr" },
    ],
  },

  // -----------------------------------------------------------
  // M02 — Terminal & Shell (Bash)
  // -----------------------------------------------------------
  "m02-terminal-shell": {
    navigation: [
      { youtubeId: "owHgnaq1mjk", title: "Commandes Linux — Navigation dans le système (pwd, ls, cd, man)", lang: "fr" },
      { youtubeId: "vX92aS1xsaE", title: "Commandes Linux de base — Chapitre 1 : La navigation", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy / ysap.sh", lang: "en" },
    ],
    files: [
      { youtubeId: "8zSn9Rngn_0", title: "Linux : gestion des fichiers (touch, cp, mv, rm…)", lang: "fr" },
      { youtubeId: "z07UZMTHsB4", title: "Linux : gestion des répertoires (mkdir, cd, rmdir)", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy / ysap.sh", lang: "en" },
    ],
    text: [
      { youtubeId: "HVLTQCCxlME", title: "Linux : filtrer des données dans des fichiers avec grep", lang: "fr" },
      { youtubeId: "ZwYfiQp1i8Y", title: "Afficher les premières (head) et dernières (tail) lignes d'un fichier", lang: "fr" },
      { youtubeId: "yCTnihfbPCo", title: "Intermediate Bash Commands (grep, sed, awk, tar, less, gzip)", lang: "en" },
    ],
    permissions: [
      { youtubeId: "WQCqDXD8FUw", title: "Linux : les droits sur les fichiers (chmod, chown, chgrp)", lang: "fr" },
      { youtubeId: "drra-38zZyk", title: "Maîtrisez les permissions Linux ! (chmod & chown)", lang: "fr" },
      { youtubeId: "Z3_4RmYTO7s", title: "Linux File Permissions Explained", channel: "TechWorld with Nana", lang: "en" },
    ],
    "pipes-redirect": [
      { youtubeId: "_1jGoFEt-n8", title: "Bash Piping & Output Redirection (stdin, stdout, stderr)", lang: "en" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    env: [
      { youtubeId: "6a-DoqQc_rQ", title: "L'environnement : variables, login, profile, bashrc, export", lang: "fr" },
      { youtubeId: "TPCRK0ypWoA", title: "Variables d'environnement — ligne de commande Linux", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    scripting: [
      { youtubeId: "gBCGeLjYBgQ", title: "Introduction au script Bash sur Linux", lang: "fr" },
      { youtubeId: "K5sxW4PR_b4", title: "BASH : Des scripts solides", lang: "fr" },
      { youtubeId: "5G6yJE1WeaY", title: "Scripting Bash : paramètres, boucles, fonctions et sourcing", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    args: [
      { youtubeId: "t7_7-BK66Xs", title: "Scripts Bash : conditions et arguments", lang: "fr" },
      { youtubeId: "LPbe-X1KXzM", title: "Linux Script Shell — les arguments", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    "exit-codes": [
      { youtubeId: "K5sxW4PR_b4", title: "BASH : Des scripts solides (set -euo pipefail, gestion d'erreurs)", lang: "fr" },
      { youtubeId: "Sx9zG7wa4FA", title: "The Complete Bash Scripting Course", channel: "Dave Eddy", lang: "en" },
    ],
    "text-tools": [
      { youtubeId: "llPJH1IuOIY", title: "Mini tuto — la commande sed pour remplacer du texte", lang: "fr" },
      { youtubeId: "oPEnvuj9QrI", title: "Linux Crash Course - awk", channel: "Learn Linux TV", lang: "en" },
      { youtubeId: "nXLnx8ncZyE", title: "Linux Crash Course - The sed Command", channel: "Learn Linux TV", lang: "en" },
    ],
    processes: [
      { youtubeId: "56F1_SCjTNs", title: "Maîtriser les processus Linux : top, ps, htop & kill", lang: "fr" },
      { youtubeId: "F-ZYtiHTvBk", title: "Mini tuto — lire les processus en cours et les arrêter", lang: "fr" },
      { youtubeId: "OjPVuY_dTqg", title: "Tuer un processus non réactif (kill, kill -9, killall)", lang: "fr" },
    ],
    ssh: [
      { youtubeId: "yKeJUdq_ZL0", title: "Tuto SSH : la connexion et scp pour copier des fichiers", lang: "fr" },
      { youtubeId: "a3JqmhqzgD0", title: "Copier un fichier à distance avec SSH et SCP", lang: "fr" },
      { youtubeId: "yA9IkQmUQpQ", title: "Synchroniser des répertoires distants (rsync + ssh)", lang: "fr" },
      { youtubeId: "Zzqtj0sRB1k", title: "Easy SSH Key Setup for GitHub on Ubuntu", lang: "en" },
    ],
    cron: [
      { youtubeId: "jiB5jScG0uE", title: "L'essentiel des tâches cron sous Linux (1/2)", lang: "fr" },
      { youtubeId: "QZJ1drMQz1A", title: "Cron Jobs - Schedule tasks with crontab", channel: "Corey Schafer", lang: "en" },
    ],
    shortcuts: [
      { youtubeId: "jjnJiEryOj0", title: "11 raccourcis clavier pour le terminal", lang: "fr" },
      { youtubeId: "Szg2niCqL3g", title: "GNU/Linux — raccourcis clavier du terminal", lang: "fr" },
      { youtubeId: "ZlrUAohCuYo", title: "Les commandes Terminal que tu devrais connaître (macOS & Linux)", lang: "fr" },
    ],
  },

  // -----------------------------------------------------------
  // M24 — Python scripting / data
  // -----------------------------------------------------------
  "m24-python-scripting-data": {
    "python-vs-js": [
      { youtubeId: "k_Xiov3dvfk", title: "Apprendre Python vs JavaScript (Developpeur Debutant)", lang: "fr" },
      { youtubeId: "khtqQblU7DI", title: "JavaScript / PHP / Python : quel langage apprendre en 2026 ?", lang: "fr" },
      { youtubeId: "x7X9w_GIm1s", title: "Python in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "uv-ruff": [
      { youtubeId: "otFi4KLMCXk", title: "uv : l'outil qui remplace pip en 10x plus rapide (tutoriel)", lang: "fr" },
      { youtubeId: "ctJzKEO4TIc", title: "uv vs Poetry : le nouveau package manager Python 10x plus rapide ?", lang: "fr" },
      { youtubeId: "828S-DMQog8", title: "Ruff - A Fast Linter & Formatter to Replace Multiple Tools", lang: "en" },
      { youtubeId: "AMdG7IjgSPM", title: "uv - A Faster, All-in-One Package Manager to Replace Pip and Venv", lang: "en" },
    ],
    syntax: [
      { youtubeId: "Uwhsok0dhMY", title: "Apprendre Python 3 - Les boucles For | range | enumerate", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "Sovw64eHe6o", title: "Parcourir une liste avec for, range, enumerate et zip", lang: "fr" },
      { youtubeId: "rfscVS0vtbw", title: "Learn Python - Full Course for Beginners", channel: "freeCodeCamp", lang: "en" },
    ],
    "data-structures": [
      { youtubeId: "Cx2vIe-lZwM", title: "Collections en Python : liste, tuple, set et dictionnaire", lang: "fr" },
      { youtubeId: "qFiK62vpmUw", title: "Tuple, Set et Dictionnaire en Python", lang: "fr" },
    ],
    comprehensions: [
      { youtubeId: "TzVQgK6RSXc", title: "Creer une liste en comprehension - Tutoriel Python #7/7", lang: "fr" },
      { youtubeId: "n2n-TTfqCA4", title: "Comprehension de liste en Python : guide complet pour debutants", lang: "fr" },
      { youtubeId: "3IDMOC6qhlM", title: "Les comprehensions de liste en 1 minute", lang: "fr" },
    ],
    "functions-py": [
      { youtubeId: "JYnSjlCYp2w", title: "Python - Fonctions : *args et **kwargs", lang: "fr" },
      { youtubeId: "nHWKmdp7EIY", title: "TUTO Python : utilisation de fonctions Lambda", lang: "fr" },
    ],
    "classes-py": [
      { youtubeId: "7p8yD__Qrwc", title: "Introduction a la Programmation Orientee Objet (POO) en Python", lang: "fr" },
      { youtubeId: "ot5WfAv534M", title: "POO en Python : heritage simple", lang: "fr" },
      { youtubeId: "6Ltk49YhrWY", title: "Python : les dataclasses", channel: "Docstring", lang: "fr" },
    ],
    "modules-py": [
      { youtubeId: "mSh4h-J0z1c", title: "Python : modules et packages (8/30)", lang: "fr" },
      { youtubeId: "Hrv5KjLPYpc", title: "Importer des modules Python (de la bonne facon)", lang: "fr" },
    ],
    "type-hints": [
      { youtubeId: "a5HGF_ELI1E", title: "Tutoriel Python - annotations de type", lang: "fr" },
      { youtubeId: "NiLXrK6WDPs", title: "TUTO Python : typage de vos fonctions et controle avec mypy", lang: "fr" },
      { youtubeId: "RwH2UzC2rIo", title: "Type Hints - From Basic Annotations to Advanced Generics", lang: "en" },
    ],
    pathlib: [
      { youtubeId: "L-YHtsPAv_8", title: "Pathlib en Python : guide complet pour debutants !", lang: "fr" },
      { youtubeId: "rXcNRPvhQuc", title: "Arrete de galerer avec tes fichiers Python : voici la vraie methode (pathlib)", lang: "fr" },
    ],
    "io-csv-json": [
      { youtubeId: "th8o3LdmdV4", title: "Lecture et ecriture dans un fichier en Python", lang: "fr" },
      { youtubeId: "G4vQR3LCQAA", title: "Lire et ecrire un fichier .CSV en Python", lang: "fr" },
      { youtubeId: "xwBsaaTGwX4", title: "Lecture / ecriture fichiers en Python : serialisation / deserialisation (JSON)", lang: "fr" },
    ],
    httpx: [
      { youtubeId: "d5pT-Ni6TRk", title: "Python - Requetes HTTP (24/30)", lang: "fr" },
      { youtubeId: "qAh5dDODJ5k", title: "HTTPX Tutorial - A next-generation HTTP client for Python", lang: "en" },
    ],
    asyncio: [
      { youtubeId: "A4oQEv3Ny1M", title: "Initiation aux fonctions asynchrones en Python avec asyncio", lang: "fr" },
      { youtubeId: "q_yk3oV14hE", title: "Python AsyncIO Explained in 9 Minutes", lang: "en" },
      { youtubeId: "t5Bo1Je9EmE", title: "Python Asynchronous Programming - AsyncIO & Async/Await", lang: "en" },
    ],
    scraping: [
      { youtubeId: "H2yBbKNzNK8", title: "Comment scraper un site web avec Python et BeautifulSoup", lang: "fr" },
      { youtubeId: "Wvc2ZqdIPpk", title: "Apprendre le Web Scraping avec Python - Partie 1", lang: "fr" },
      { youtubeId: "cO997sPYZ9U", title: "Playwright Python Browser Automation Crash Course", lang: "en" },
    ],
    "pandas-polars": [
      { youtubeId: "zZkNOdBWgFQ", title: "Pandas Python Francais - Introduction + Analyse du Titanic (17/30)", channel: "Machine Learnia", lang: "fr" },
      { youtubeId: "lWLs75O0bvw", title: "Gestion de tableaux de donnees avec pandas | Python pour la Science #6", lang: "fr" },
      { youtubeId: "9IrMz0wbp5Q", title: "Working With Python Polars: Getting Started with DataFrames", lang: "en" },
    ],
    pytest: [
      { youtubeId: "apgReCCAQr4", title: "Tutoriel Python - tests unitaires", lang: "fr" },
      { youtubeId: "L6N3BgZh2AA", title: "Unit Testing in Python with pytest | Getting Started", lang: "en" },
    ],
    venv: [
      { youtubeId: "Hs07URZ7TMo", title: "Apprendre le Python #13 - Les environnements virtuels (venv)", lang: "fr" },
      { youtubeId: "cLWJZ5XtuSM", title: "Mini tuto - Environnement virtuel Python", lang: "fr" },
    ],
    "typer-cli": [
      { youtubeId: "aaim2oCGedk", title: "Application CLI avec Python et processus de CI / CD (partie 1)", lang: "fr" },
      { youtubeId: "9VVYMXaZ0d4", title: "Build Python CLI Apps With Typer: Arguments, Options, and Commands", lang: "en" },
    ],
    jupyter: [
      { youtubeId: "6XsC0sD9u4M", title: "Apprendre Python | #07 - Jupyter Notebook", lang: "fr" },
      { youtubeId: "RYDPywqi_PE", title: "Python pour les debutants #4 : installer Jupyter Notebook", lang: "fr" },
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
