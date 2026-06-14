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
      { youtubeId: "P7gV2HuunVk", title: "Big O expliqué en 1 minute – Comprendre la complexité sans prise de tête", lang: "fr" },
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
      { youtubeId: "vIZ6bY48kWk", title: "Internet vs Web : Comprendre la différence", lang: "fr" },
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work? (Full Course)", channel: "freeCodeCamp / Ian Frost", lang: "en" },
    ],
    "client-server-model": [
      { youtubeId: "toMtdE3Usyo", title: "Connaître la relation client/serveur", channel: "video2brain", lang: "fr" },
      { youtubeId: "sz3gXm5v_G0", title: "Le protocole HTTP — Dialogue client / serveur web", lang: "fr" },
      { youtubeId: "0w6GXuVHz1Y", title: "Client-Server Architecture Explained", lang: "en" },
    ],
    "tcp-ip-layers": [
      { youtubeId: "HuxCOWxQudU", title: "Les fondamentaux du réseau (Partie 1)", lang: "fr" },
      { youtubeId: "26jazyc7VNk", title: "Comprendre les modèles OSI et TCP/IP", lang: "fr" },
      { youtubeId: "P_hVprfTgls", title: "COMPRENDRE ENFIN le modèle OSI", lang: "fr" },
      { youtubeId: "L1pFhn1Uxx4", title: "Les modèles OSI & TCP/IP", lang: "fr" },
    ],
    "request-journey": [
      { youtubeId: "abrLW6QnWF8", title: "Le parcours d'une requête HTTP (Comprendre Internet, ép. 8)", lang: "fr" },
      { youtubeId: "AlkDbnbv7dk", title: "What happens when you type a URL into your browser?", channel: "ByteByteGo", lang: "en" },
      { youtubeId: "dh406O2v_1c", title: "What happens when you type google.com (Detailed)", channel: "Hussein Nasser", lang: "en" },
    ],
    "ip-mac-port": [
      { youtubeId: "BzPgtMSvZFE", title: "Les adresses IP (Comprendre comment marche Internet, ép. 4)", lang: "fr" },
      { youtubeId: "k0wLoHYC8IQ", title: "Les bases des réseaux IP expliquées", lang: "fr" },
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work?", channel: "freeCodeCamp", lang: "en" },
    ],
    "dns-resolution": [
      { youtubeId: "qzWdzAvfBoo", title: "Comprendre le DNS en 5 minutes", lang: "fr" },
      { youtubeId: "46m72I4s-zo", title: "Les noms de domaines / Les serveurs DNS (Comprendre Internet, ép. 16)", lang: "fr" },
      { youtubeId: "BvrUi26ShzI", title: "Comprendre les serveurs DNS en 3 minutes", lang: "fr" },
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
    "https-tls": [
      { youtubeId: "k_ScPsb3WSk", title: "SSL/TLS pour les nuls", channel: "Julien Aubert", lang: "fr" },
      { youtubeId: "WIMKeyJ60Rw", title: "Comprendre HTTPS et le chiffrement SSL TLS en animation 3D", lang: "fr" },
      { youtubeId: "7W7WPMX7arI", title: "Comprendre le chiffrement SSL/TLS avec des emojis (et le HTTPS)", lang: "fr" },
      { youtubeId: "-dHbXLR-Mao", title: "Qu'est-ce qu'un certificat SSL/TLS ? (Cryptographie, PKI, OpenSSL)", lang: "fr" },
    ],
    "devtools-network": [
      { youtubeId: "y4MpceWoeCY", title: "Chrome Devtools : Onglet Network", lang: "fr" },
      { youtubeId: "K_gZPUVY4tE", title: "Échanges requête / réponse HTTP via l'inspecteur (F12) du navigateur", lang: "fr" },
      { youtubeId: "6QfJWYonU8I", title: "Afficher les requêtes HTTP sur Google Chrome", lang: "fr" },
    ],
    "network-hardware": [
      { youtubeId: "rHHVzhUmLqQ", title: "Comprends enfin la différence entre routeur et switch !", lang: "fr" },
      { youtubeId: "iQbS-eNQXzY", title: "Qu'est-ce qu'un routeur ?", lang: "fr" },
      { youtubeId: "zN8YNNHcaZc", title: "How does the internet work?", channel: "freeCodeCamp", lang: "en" },
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
      { youtubeId: "Yfcso39FUc8", title: "Tâches planifiées crontab sous Linux (en français)", lang: "fr" },
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
      { youtubeId: "E0xhJLJxgaY", title: "Git merge vs Git rebase", channel: "Grafikart", lang: "fr" },
      { youtubeId: "cjSjlHUmaBU", title: "Git Merge vs Rebase Explained Visually", lang: "en" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    conflicts: [
      { youtubeId: "ecyc6GQNgRc", title: "Git : résoudre un merge conflict sans paniquer (cas pratique)", lang: "fr" },
      { youtubeId: "GKsQwKQ5img", title: "Savoir résoudre un conflit Git", lang: "fr" },
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
      { youtubeId: "92_DY3eb4lc", title: "Git : revenir en arrière sur un commit", lang: "fr" },
      { youtubeId: "Ayr17xFKMHU", title: "Git : stash, revert, restore, rebase, reset, cherry-pick", lang: "fr" },
      { youtubeId: "BHfI9BMiK3E", title: "Git Tutorial : undo (amend, cherry-pick, reset, reflog, revert)", lang: "en" },
    ],
    reflog: [
      { youtubeId: "92_DY3eb4lc", title: "Git : revenir en arrière sur un commit", lang: "fr" },
      { youtubeId: "BHfI9BMiK3E", title: "Git Tutorial : undo (reflog)", lang: "en" },
    ],
    "rewrite-history": [
      { youtubeId: "Ayr17xFKMHU", title: "Git : reset, rebase, cherry-pick (réécrire l'historique)", lang: "fr" },
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals (rebase interactif)", channel: "freeCodeCamp", lang: "en" },
    ],
    "stash-cherry": [
      { youtubeId: "a_yIuISiJb4", title: "Comprendre Git : le remisage (stash)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "QOxMdW3UNrg", title: "Astuce de développeur : la commande git stash", lang: "fr" },
      { youtubeId: "Ayr17xFKMHU", title: "Git : stash, revert, restore, rebase, reset, cherry-pick", lang: "fr" },
    ],
    "ssh-keys": [
      { youtubeId: "Zzqtj0sRB1k", title: "Easy SSH Key Setup for GitHub on Ubuntu", lang: "en" },
    ],
    gitignore: [
      { youtubeId: "Uszj_k0DGsg", title: "Git for Professionals", channel: "freeCodeCamp", lang: "en" },
    ],
    "remove-secrets": [
      { youtubeId: "s-z6kJxdNJw", title: "How to Remove Leaked Secrets from Git History FAST!", lang: "en" },
      { youtubeId: "Rrs-CAolDKY", title: "Fix Leaked Secrets on GitHub Before Hackers Find Them", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M04 — Env dev (VS Code, Node, pnpm, nvm)
  // -----------------------------------------------------------
  "m04-env-dev": {
    "vscode-config": [
      { youtubeId: "GFmE5_8xypY", title: "Ma configuration Visual Studio Code", channel: "Grafikart", lang: "fr" },
      { youtubeId: "1Z1JCuwXmiQ", title: "Visual Studio Code : installation et astuces indispensables", lang: "fr" },
      { youtubeId: "ifTF3ags0XI", title: "25 VS Code Productivity Tips and Speed Hacks", channel: "Fireship", lang: "en" },
    ],
    shortcuts: [
      { youtubeId: "0fSl95ziJYs", title: "38 raccourcis à connaître sur Visual Studio Code", lang: "fr" },
      { youtubeId: "ba_eVrOZesU", title: "Top 20 des raccourcis VS Code pour coder plus vite", lang: "fr" },
      { youtubeId: "ifTF3ags0XI", title: "25 VS Code Productivity Tips and Speed Hacks", channel: "Fireship", lang: "en" },
    ],
    extensions: [
      { youtubeId: "80rrqS2QuBY", title: "Top 10 VS Code Extensions You Need RIGHT NOW", channel: "Fireship", lang: "en" },
    ],
    debugger: [
      { youtubeId: "_imeD5H-yCw", title: "Le débogueur JavaScript (VS Code, Google Chrome)", lang: "fr" },
      { youtubeId: "AJrfNRddtgo", title: "Utiliser le debugger de VS Code avec une application Node.js", lang: "fr" },
      { youtubeId: "2rSIEgV_XfM", title: "Débugger son site web avec Visual Studio Code", lang: "fr" },
    ],
    snippets: [
      { youtubeId: "SuxytcxLF68", title: "Booster sa productivité avec ses propres snippets VS Code", lang: "fr" },
      { youtubeId: "OMqIXDKko_g", title: "Snippets personnalisés avec Visual Studio Code", lang: "fr" },
    ],
    "node-vs-npm": [
      { youtubeId: "rdD6ruS7K7k", title: "NPM : qu'est-ce que le gestionnaire de paquets Node.js ?", lang: "fr" },
      { youtubeId: "hZ7PibaAInk", title: "Les bases de NPM en 10 minutes", lang: "fr" },
      { youtubeId: "E_a6JwCRCaU", title: "Node Version Manager (NVM) Tutorial", lang: "en" },
    ],
    "nvm-fnm": [
      { youtubeId: "uthUCaWYT88", title: "Comment changer la version de Node.js rapidement (NVM)", lang: "fr" },
      { youtubeId: "q3wRsMr2Iv0", title: "Changer la version de Node.js avec NVM", lang: "fr" },
      { youtubeId: "tjp-oNksxF4", title: "Switch Node.js Versions Like a Pro | NVM Tutorial", lang: "en" },
    ],
    "pkg-json": [
      { youtubeId: "3Y4Bw7_xXIc", title: "NPM : le fichier package.json et le dossier node_modules", lang: "fr" },
      { youtubeId: "XUe6yIp8noQ", title: "Comment fonctionnent les devDependencies (package.json) ?", lang: "fr" },
      { youtubeId: "BdtXNNFBvPg", title: "Créer un package.json pour son projet Node.js", lang: "fr" },
    ],
    semver: [
      { youtubeId: "u-GU7EkZksA", title: "Semantic Versioning & Conventional Commits Explained", lang: "en" },
    ],
    lockfile: [
      { youtubeId: "x5Nt-B1DoNs", title: "Qu'est-ce que pnpm ? (store, lockfile)", lang: "fr" },
      { youtubeId: "V8JYzO_zQjo", title: "pnpm vs npm : pourquoi tu fais le mauvais choix ?", lang: "fr" },
    ],
    "global-vs-local": [
      { youtubeId: "hZ7PibaAInk", title: "Les bases de NPM : install local vs global", lang: "fr" },
    ],
    scripts: [
      { youtubeId: "0npQNKMvrzM", title: "Tout savoir sur les scripts NPM du package.json", lang: "fr" },
    ],
    "format-lint": [
      { youtubeId: "lGCHjQl6XLw", title: "VS Code + ESLint + Prettier : bien configurer le tout", lang: "fr" },
      { youtubeId: "IRdPRIPd9FM", title: "Prettier & ESLint in VS Code: The Ultimate Guide", lang: "en" },
    ],
    dotfiles: [
      { youtubeId: "LI_Tv5dJkkk", title: "How I manage my dotfiles with git", lang: "en" },
      { youtubeId: "5oXy6ktYs7I", title: "Dotfiles! Here's how I organize them", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M05 — HTML5
  // -----------------------------------------------------------
  "m05-html5": {
    structure: [
      { youtubeId: "3KAG6clVs-8", title: "Structure d'une page HTML5", lang: "fr" },
      { youtubeId: "KSg2WJ6QK4g", title: "Cours complet HTML/CSS — Structure d'une page HTML", channel: "Pierre Giraud", lang: "fr" },
    ],
    semantic: [
      { youtubeId: "RFdsBUppiE8", title: "Les bases du HTML : Les balises sémantiques", lang: "fr" },
      { youtubeId: "0uQv6HpAcpk", title: "Comprendre les balises sémantiques | HTML", lang: "fr" },
    ],
    headings: [
      { youtubeId: "nm9fYYHRTiQ", title: "Apprendre les balises h1, h2, h3… (en-têtes HTML)", lang: "fr" },
      { youtubeId: "a_M4FTazc2Q", title: "Balises H1, H2, H3… Comment structurer un texte ?", lang: "fr" },
    ],
    "block-inline": [
      { youtubeId: "I3aczivx4KU", title: "Cours complet HTML/CSS — Les types block et inline", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "aF2e_XM638g", title: "Maîtriser la propriété display : block, inline et inline-block", lang: "fr" },
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
    media: [
      { youtubeId: "N-aiPrb1rOM", title: "Tutoriel HTML : les images responsives (srcset, picture)", channel: "Grafikart", lang: "fr" },
    ],
    tables: [
      { youtubeId: "0EcCdgq5gM0", title: "Tutoriel HTML : les tableaux (table, tr, td)", lang: "fr" },
      { youtubeId: "Ut5ofe-S3zs", title: "HTML : les tableaux (thead, tbody, tfoot)", lang: "fr" },
    ],
    "inline-content": [
      { youtubeId: "a_M4FTazc2Q", title: "Structurer un texte : titres et balises de texte (strong, em…)", lang: "fr" },
    ],
    "meta-seo": [
      { youtubeId: "ksAoV4UHjHc", title: "Métadonnées HTML : Twitter Cards et Open Graph", channel: "Grafikart", lang: "fr" },
      { youtubeId: "9BQePrpK2_I", title: "Open Graph & Twitter Cards : maîtrisez vos partages", lang: "fr" },
    ],
    a11y: [
      { youtubeId: "e2nkq3h1P68", title: "Learn Accessibility – Full a11y Tutorial", channel: "Kevin Powell / freeCodeCamp", lang: "en" },
    ],
    "validation-w3c": [
      { youtubeId: "nRig0Kx5M1w", title: "Validez vos pages avec le validateur officiel W3C", lang: "fr" },
      { youtubeId: "hdU50hibrUU", title: "W3C Validator : comment faire valider son code HTML/CSS ?", lang: "fr" },
    ],
    "dom-tree": [
      { youtubeId: "2EUbeU5zHXg", title: "JavaScript : l'arbre du DOM", lang: "fr" },
      { youtubeId: "LBB9kMPKP5U", title: "JS-DOM : introduction et accès aux nœuds", lang: "fr" },
    ],
  },

  // -----------------------------------------------------------
  // M06 — CSS3 fondamentaux
  // -----------------------------------------------------------
  "m06-css3-fondamentaux": {
    selectors: [
      { youtubeId: "EM8UlPeBfuk", title: "Découverte du CSS (2/31) : Les sélecteurs", channel: "Grafikart", lang: "fr" },
      { youtubeId: "fEgYZlDKCyI", title: "Les sélecteurs CSS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "DymZtovzd4o", title: "Tutoriel CSS : Le sélecteur :nth-child", channel: "Grafikart", lang: "fr" },
    ],
    cascade: [
      { youtubeId: "JpRzRx1cLXs", title: "Cascade, spécificité et héritage en CSS !", lang: "fr" },
      { youtubeId: "4T4vRdhkCxw", title: "Découverte du CSS (12/31) : La spécificité des sélecteurs", channel: "Grafikart", lang: "fr" },
      { youtubeId: "c0kfcP_nD9E", title: "CSS Specificity explained", channel: "Kevin Powell", lang: "en" },
    ],
    inheritance: [
      { youtubeId: "LtzlrIpd2JU", title: "L'héritage en CSS [CHTS27]", lang: "fr" },
      { youtubeId: "JpRzRx1cLXs", title: "Cascade, spécificité et héritage en CSS !", lang: "fr" },
    ],
    "box-model": [
      { youtubeId: "pw5esyQmuqs", title: "Cours Complet CSS - Box model", lang: "fr" },
      { youtubeId: "uCJxtO5b7Mw", title: "Découverte du CSS (10/31) : Le box-sizing", channel: "Grafikart", lang: "fr" },
      { youtubeId: "ZaiIDH0qp1c", title: "CSS box model explained (padding, border, margin)", channel: "Kevin Powell", lang: "en" },
    ],
    units: [
      { youtubeId: "AshVbhPOEAU", title: "REM, EM, VH... : les unités que tu dois absolument connaître en CSS", lang: "fr" },
      { youtubeId: "ZV6N6w5bMDU", title: "Tutoriel CSS : px, em et rem", channel: "Grafikart", lang: "fr" },
    ],
    display: [
      { youtubeId: "aF2e_XM638g", title: "Maîtriser la propriété display en CSS : block, inline et inline-block", lang: "fr" },
      { youtubeId: "I3aczivx4KU", title: "Cours complet HTML et CSS [25/71] : les types block et inline", channel: "Pierre Giraud", lang: "fr" },
    ],
    position: [
      { youtubeId: "jGtp9KjSO2c", title: "Les positions CSS en 20 minutes : absolute, relative, fixed, sticky", lang: "fr" },
      { youtubeId: "lHrF4Yq9gAc", title: "Comprendre la propriété position en CSS", lang: "fr" },
      { youtubeId: "86nTToBm2uQ", title: "Stop fighting with CSS positioning", channel: "Kevin Powell", lang: "en" },
    ],
    flexbox: [
      { youtubeId: "9gZugKEczJ0", title: "Découverte du CSS (11/31) : Flexbox", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Pl7LbpGr2uU", title: "Apprendre les Flexbox CSS en 20 minutes !", lang: "fr" },
      { youtubeId: "CMxFjX3mdXs", title: "Cours complet CSS Flexbox : maîtrisez l'alignement en CSS", lang: "fr" },
    ],
    grid: [
      { youtubeId: "2H602-zG62w", title: "Tutoriel CSS : display: grid;", channel: "Grafikart", lang: "fr" },
      { youtubeId: "9kr8eWz5S8w", title: "CSS Grid Layouts : maîtriser CSS Grid facilement (tutoriel complet débutants)", lang: "fr" },
      { youtubeId: "rg7Fvvl3taU", title: "Learn CSS Grid the easy way", channel: "Kevin Powell", lang: "en" },
    ],
    "flex-vs-grid": [
      { youtubeId: "KAn-6wUnRPQ", title: "CSS FLEX ou GRID : lequel utiliser ?", lang: "fr" },
      { youtubeId: "DmFkrYbnFwY", title: "Découverte du CSS : Float, Flex ou Grid ?", channel: "Grafikart", lang: "fr" },
    ],
    responsive: [
      { youtubeId: "1TmxQpcIbUs", title: "Les media queries en 6 minutes (+1 exercice)", lang: "fr" },
      { youtubeId: "_cueUCN9XtA", title: "Tutoriel CSS : Responsive, Mobile First", channel: "Grafikart", lang: "fr" },
      { youtubeId: "wu1Sk8iOPnE", title: "Découverte du CSS (18/31) : Media query et le responsive", channel: "Grafikart", lang: "fr" },
    ],
    "responsive-images": [
      { youtubeId: "CZzrXadXsJo", title: "Comment rendre une image responsive ?", lang: "fr" },
      { youtubeId: "6704SPPbFb4", title: "Utiliser CSS object-fit pour le redimensionnement d'images", lang: "en" },
    ],
    typography: [
      { youtubeId: "vzD9vZDyevo", title: "Importer une font Google en CSS", lang: "fr" },
      { youtubeId: "uDV2hUA9OwU", title: "CSS3 : utilisation de Google Fonts pour intégrer des polices", lang: "fr" },
    ],
    colors: [
      { youtubeId: "IWA83HNkyz8", title: "Les bases du CSS - 3 : comprendre les couleurs (HEX, RGB, HSL)", lang: "fr" },
      { youtubeId: "bzfFGpl5Fd0", title: "Les dégradés en CSS", lang: "fr" },
      { youtubeId: "VInSzHOeFkE", title: "Switch to HSL color format", channel: "Kevin Powell", lang: "en" },
    ],
    "css-vars": [
      { youtubeId: "IUPgwXZhQhg", title: "Découverte du CSS (30/31) : Les variables CSS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "JJ63aDt48uE", title: "Les variables CSS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "W8LlgS9YCP4", title: "How to use CSS variables like a pro", channel: "Kevin Powell", lang: "en" },
    ],
    "devtools-css": [
      { youtubeId: "enm7_fYIu4s", title: "Utiliser l'inspecteur d'élément et le modifier en CSS", lang: "fr" },
      { youtubeId: "VXfsKtl0EzE", title: "Tutoriel CSS : comment dominer l'inspecteur Chrome", channel: "Grafikart", lang: "fr" },
    ],
  },

  // -----------------------------------------------------------
  // M07 — CSS avancé + Tailwind
  // -----------------------------------------------------------
  "m07-css-avance-tailwind": {
    transitions: [
      { youtubeId: "KOH-SnAn1K8", title: "Cours complet HTML/CSS [57/71] - Les transitions CSS", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "JOBlm6kWsMM", title: "Decouverte du CSS (17/31) : Animation & Transition", channel: "Grafikart", lang: "fr" },
      { youtubeId: "hleg4zmjQ-o", title: "MASTER CSS Transitions in 2024", channel: "Online Tutorials", lang: "en" },
    ],
    keyframes: [
      { youtubeId: "qFgg9DRdfmc", title: "Cours complet HTML/CSS [58/71] - Les animations CSS (@keyframes)", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "JOBlm6kWsMM", title: "Decouverte du CSS (17/31) : Animation & Transition", channel: "Grafikart", lang: "fr" },
      { youtubeId: "y8-F5-2EIcg", title: "10 CSS animation tips and tricks", channel: "Kevin Powell", lang: "en" },
    ],
    transforms: [
      { youtubeId: "jQG3hAbXQVY", title: "Decouverte du CSS (16/31) : Transform", channel: "Grafikart", lang: "fr" },
      { youtubeId: "rzD-cPhq02E", title: "Learn CSS Transform In 15 Minutes", channel: "Web Dev Simplified", lang: "en" },
      { youtubeId: "Y9LGaoz5IEY", title: "CSS 3D transform in 20 minutes!", lang: "en" },
    ],
    "perf-animations": [
      { youtubeId: "N5EW4HnF6FU", title: "The Only 2 CSS Properties You Should Animate", lang: "en" },
      { youtubeId: "39K1C92TkWo", title: "CSS Animatable Properties & Performance: What to Animate (and What to Avoid)", lang: "en" },
      { youtubeId: "4PStxeSIL9I", title: "How To Create Performant CSS Animations", lang: "en" },
    ],
    "reduced-motion": [
      { youtubeId: "Kws6l0Rp1Yg", title: "WTF is prefers-reduced-motion!?!", lang: "en" },
      { youtubeId: "r6W1hf7xcrs", title: "Designing accessible animation and movement on your website", lang: "en" },
    ],
    "modern-animations": [
      { youtubeId: "UmzFk68Bwdk", title: "Incredible scroll-based animations with CSS-only", channel: "Kevin Powell", lang: "en" },
      { youtubeId: "bBh8fpb3h5c", title: "Scroll-driven animations without any JS", lang: "en" },
      { youtubeId: "Fb-RNqiDoiw", title: "View Transition API Tutorial | New CSS Animation Power", lang: "en" },
    ],
    bem: [
      { youtubeId: "6qlDR6yhm0I", title: "Notation BEM en CSS !", lang: "fr" },
      { youtubeId: "40FjRuIXlKg", title: "La methodologie BEM en CSS et SCSS", lang: "fr" },
      { youtubeId: "aKenj9ZQwJg", title: "CSS BEM - The What, How, and Why", lang: "en" },
    ],
    "utility-first": [
      { youtubeId: "Fix0niR6Hm8", title: "Qu'est-ce que Tailwind CSS ? (philosophie utility-first)", lang: "fr" },
      { youtubeId: "izLmft39ySU", title: "CSS, preprocesseurs, BEM, CSS Modules, CSS-in-JS... comment choisir ?", lang: "fr" },
      { youtubeId: "ab8RePo5ZYU", title: "Why you don't need BEM with utility-first CSS", lang: "en" },
    ],
    "tailwind-classes": [
      { youtubeId: "_YfBHwGH4j8", title: "Tailwind CSS v4 je t'explique", lang: "fr" },
      { youtubeId: "P1x9b1_0I2U", title: "Tailwind CSS en 1h : Maitriser ce puissant framework CSS", lang: "fr" },
      { youtubeId: "RMe5LYEnfy8", title: "Apprendre Tailwind CSS v4 en 2026 : la formation complete", lang: "fr" },
      { youtubeId: "9I3JQ1q4IMk", title: "Tailwind CSS for Beginners | Full Course", channel: "Net Ninja", lang: "en" },
    ],
    "tailwind-states": [
      { youtubeId: "lVPc4bH-dxY", title: "TailwindCSS v4 Tutorial 2026 #005 - Hover, Focus, Active, Disabled, States Variants", lang: "en" },
      { youtubeId: "M0umy5gvO1w", title: "Tailwind CSS Group Utilities | Style Child Elements on Hover", lang: "en" },
      { youtubeId: "V0jAgtjYq5c", title: "How to use TailwindCSS group-hover to coordinate multiple hover states", lang: "en" },
    ],
    "tailwind-config": [
      { youtubeId: "pBGiaI0qNgo", title: "TailwindCSS 4, une configuration via du CSS (@theme)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "bupetqS1SMU", title: "The NEW CSS-first configuration with Tailwind CSS v4 (No more tailwind.config.js)", lang: "en" },
      { youtubeId: "MAtaT8BZEAo", title: "Theming Tailwind with CSS Variables", lang: "en" },
    ],
    shadcn: [
      { youtubeId: "MzpYa8vfmXg", title: "shadcn explique en 60 secondes (+ exemple concret)", lang: "fr" },
      { youtubeId: "sIKGWcLB2nY", title: "TUTO Shadcn UI avec TailwindCSS : Tout comprendre en 30 minutes", lang: "fr" },
      { youtubeId: "oVS9wR-lpGQ", title: "Ma librairie UI preferee pour React (shadcn/ui)", lang: "fr" },
    ],
    "design-system": [
      { youtubeId: "vs8DjsdOroc", title: "Introduction aux Design Tokens et Design API", lang: "fr" },
      { youtubeId: "kOdLc7WPVNI", title: "Organiser les couleurs d'un Design System avec les tokens semantiques", lang: "fr" },
      { youtubeId: "CJyJN0ZdEGA", title: "Design Tokens for Dummies | A Complete Guide", lang: "en" },
    ],
    "css-perf-prod": [
      { youtubeId: "A5TED2RiuVo", title: "Eliminate Unused CSS: Optimize Your Build with PurgeCSS", lang: "en" },
      { youtubeId: "txAE6yT0Eu8", title: "What is Critical CSS and How Do You Optimize it?", lang: "en" },
      { youtubeId: "ma1pLG6bcws", title: "Setup Tailwind CSS as PostCSS (Purge and Minification for Production)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M08 — JavaScript fondamental
  // -----------------------------------------------------------
  "m08-javascript-fondamental": {
    "types-primitifs": [
      { youtubeId: "9OBKC5EQlZU", title: "Variables | Partie 4 - Les Types Primitifs et les Objets", channel: "Grafikart", lang: "fr" },
      { youtubeId: "w6dXNYW7BTY", title: "COURS COMPLET JAVASCRIPT [19/65] - Valeurs primitives et objets natifs", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "PkZNo7MFNFg", title: "Learn JavaScript - Full Course for Beginners", channel: "freeCodeCamp", lang: "en" },
    ],
    "null-undefined": [
      { youtubeId: "w6dXNYW7BTY", title: "COURS COMPLET JAVASCRIPT [19/65] - Valeurs primitives et objets natifs (null/undefined)", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "jgc48OS9wEA", title: "null vs. undefined in JavaScript / TypeScript", lang: "en" },
    ],
    coercion: [
      { youtubeId: "I5daUpU5_A4", title: "== vs === en JavaScript", lang: "fr" },
      { youtubeId: "RXMYIog5xmU", title: "JavaScript == vs === Explained: Coercion Demystified", lang: "en" },
    ],
    operators: [
      { youtubeId: "SyXyWYucDkM", title: "Apprendre JavaScript - Les opérateurs (affectation, arithmétiques, comparaison, logiques)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "3Qsq1nXBYBA", title: "JS idiomatique : Optional Chaining (?.) et Nullish Coalescing (??)", lang: "fr" },
    ],
    "control-flow": [
      { youtubeId: "zwLmRotDdu8", title: "Apprendre le JavaScript : Les conditions (if/else/switch)", channel: "Grafikart", lang: "fr" },
    ],
    loops: [
      { youtubeId: "kLdQAsrcyvk", title: "Apprendre le JavaScript : Les boucles (for, while, for...of, for...in)", channel: "Grafikart", lang: "fr" },
    ],
    functions: [
      { youtubeId: "EvHAiskwHvE", title: "Apprendre le JavaScript : Les fonctions", channel: "Grafikart", lang: "fr" },
      { youtubeId: "UF2a9holPpg", title: "JavaScript les fonctions fléchées | arrow function", lang: "fr" },
      { youtubeId: "wVuJTS8aQyA", title: "Apprendre le JavaScript : Pratiquons les fonctions", channel: "Grafikart", lang: "fr" },
    ],
    "value-vs-reference": [
      { youtubeId: "LpJa-NRQiXA", title: "Valeur primitive VS valeur par référence en JavaScript !", lang: "fr" },
      { youtubeId: "9OBKC5EQlZU", title: "Variables | Partie 4 - Les Types Primitifs et les Objets", channel: "Grafikart", lang: "fr" },
    ],
    strings: [
      { youtubeId: "q287HJv10Rc", title: "JavaScript : 9 méthodes pour manipuler les chaînes de caractères (string)", lang: "fr" },
      { youtubeId: "_nPykgMCIlQ", title: "Strings en JavaScript | Template literals - backticks", lang: "fr" },
    ],
    numbers: [
      { youtubeId: "lIkXktOFJIM", title: "COURS COMPLET JAVASCRIPT [8/65] - Opérations entre variables", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "GgSDt28k-ak", title: "COURS COMPLET JAVASCRIPT [27/65] - L'objet Math et ses méthodes", channel: "Pierre Giraud", lang: "fr" },
    ],
    scope: [
      { youtubeId: "qYuvcK8QU4c", title: "Apprendre le JavaScript : La portée des variables", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes", lang: "en" },
    ],
    "var-let-const": [
      { youtubeId: "A9sD9GOkMdQ", title: "Tutoriel JavaScript - var, let ou const ?", lang: "fr" },
      { youtubeId: "sc4lJ9nv8oU", title: "Variables | Partie 6 - Let, Const ou Var ?", channel: "Grafikart", lang: "fr" },
      { youtubeId: "ZUk6RppaEYE", title: "What's the Difference Between var, let and const?", lang: "en" },
    ],
    hoisting: [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et... hoisting ?)", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes (TDZ)", lang: "en" },
    ],
    "truthy-falsy": [
      { youtubeId: "Xp60QbXRAPI", title: "One Of the Most IMPORTANT Parts of JavaScript - Truthy and Falsy EXPLAINED", lang: "en" },
      { youtubeId: "eo-IS8-hcYI", title: "JavaScript Truthy and Falsy Values - Explained in Detail", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M09 — JavaScript & le DOM
  // -----------------------------------------------------------
  "m09-javascript-dom": {
    "dom-tree": [
      { youtubeId: "qsBX7lV60fY", title: "Cours complet JavaScript [32/65] - Présentation du DOM HTML", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "sXwPfnsKGiE", title: "JavaScript côté navigateur : Manipuler le DOM", channel: "Grafikart", lang: "fr" },
      { youtubeId: "LBB9kMPKP5U", title: "JS-DOM : 1 - Introduction, accès aux noeuds", lang: "fr" },
    ],
    "selectors-js": [
      { youtubeId: "trO063YQbCs", title: "Cours complet JavaScript [33/65] - Accéder à des éléments HTML en JavaScript", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "1pfpASxlbm0", title: "JavaScript et le DOM | Partie 7 - Sélectionner avec querySelector", lang: "fr" },
      { youtubeId: "i_KXcwr7PYc", title: "How to Access HTML Elements Using JavaScript (getElementById, querySelector)", lang: "en" },
    ],
    "content-modification": [
      { youtubeId: "g0YPzvGBvQk", title: "Cours complet JavaScript [34/65] - Modifier du contenu HTML en JavaScript", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "P1iOrkhhfL8", title: "Comprendre innerText vs innerHTML", lang: "fr" },
      { youtubeId: "fHs6FS7yRHM", title: "DOM XSS in innerHTML sink (pourquoi innerHTML est dangereux)", lang: "en" },
    ],
    attributes: [
      { youtubeId: "trO063YQbCs", title: "Cours complet JavaScript [33/65] - Accéder aux éléments et leurs attributs", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "V0S0LXvnW-o", title: "JavaScript Tutorial For Beginners #35 - Changing Element Attributes", channel: "The Net Ninja", lang: "en" },
    ],
    classlist: [
      { youtubeId: "I_UnFEkJsC8", title: "Comment faire un toggle d'une classe en JavaScript (classList)", lang: "fr" },
      { youtubeId: "62qN2RcpIAE", title: "Learn the JavaScript classList property easy!", channel: "Bro Code", lang: "en" },
    ],
    "tree-nav": [
      { youtubeId: "ZLhhMiIbNtE", title: "DOM : Naviguer dans les éléments HTML (parentNode, firstChild, nextSibling)", lang: "fr" },
      { youtubeId: "0eug_OgmXag", title: "JavaScript DOM Traversal Methods (parentElement, children, siblings)", lang: "en" },
    ],
    "create-insert-remove": [
      { youtubeId: "8ewtg1AVblQ", title: "JavaScript et le DOM | Partie 9 - Créer des éléments", lang: "fr" },
      { youtubeId: "g8znXUnkZvc", title: "Cours complet JavaScript [35/65] - Ajouter et insérer des éléments HTML", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "o7gVp33dLDE", title: "Cours complet JavaScript [36/65] - Modifier ou supprimer des éléments HTML", channel: "Pierre Giraud", lang: "fr" },
    ],
    events: [
      { youtubeId: "3Qin-KZN1dE", title: "Cours complet JavaScript [38/65] - Introduction aux événements", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "ierLz3rZ0Vk", title: "Cours complet JavaScript [39/65] - La méthode addEventListener", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "55EXq7ZjL4Q", title: "JavaScript côté navigateur : Les écouteurs d'événements", channel: "Grafikart", lang: "fr" },
    ],
    "event-object": [
      { youtubeId: "mqS2ACKTjTU", title: "Cours complet JavaScript [41/65] - Présentation de l'objet Event", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "0cYZjrUkZ5o", title: "The difference between event.target and event.currentTarget", channel: "CodeSketched", lang: "en" },
    ],
    bubbling: [
      { youtubeId: "q10j1QGGjq4", title: "Cours complet JavaScript [40/65] - La propagation des événements (bubbling/capturing)", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "DS0ax95yQcc", title: "Apprendre JavaScript #20 - Event Bubbling & stopPropagation", lang: "fr" },
      { youtubeId: "NXXTLu2UnLE", title: "JavaScript Event Propagation - Bubbling and Capturing", lang: "en" },
    ],
    delegation: [
      { youtubeId: "4Z1qFyxcOco", title: "JavaScript #14 - Propagation d'événements & Délégation", lang: "fr" },
      { youtubeId: "tWJxQqMYJJE", title: "La propagation des événements en JavaScript", lang: "fr" },
    ],
    forms: [
      { youtubeId: "GzG7vNUKEMY", title: "Gérer la soumission d'un formulaire grâce à FormData", lang: "fr" },
      { youtubeId: "gbahruFwnAc", title: "JavaScript et Formulaires #2 - Valider les données d'un formulaire", lang: "fr" },
    ],
    storage: [
      { youtubeId: "PmrHg7q5raw", title: "JavaScript côté navigateur : Local Storage", channel: "Grafikart", lang: "fr" },
      { youtubeId: "NX_YpaAL_Ec", title: "Apprendre JavaScript #21 - Local Storage & Session Storage", lang: "fr" },
      { youtubeId: "zmFDvFwj6-8", title: "JavaScript LocalStorage and Session Storage API Tutorial", lang: "en" },
    ],
    "script-loading": [
      { youtubeId: "3Qin-KZN1dE", title: "Cours complet JavaScript [38/65] - Introduction aux événements (DOMContentLoaded)", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "SIbJIfQOS5c", title: "Scripts: async & defer with DOMContentLoaded", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M10 — JavaScript moderne ES6+
  // -----------------------------------------------------------
  "m10-javascript-moderne-es6": {
    "arrow-functions": [
      { youtubeId: "-WvmzxOVeL0", title: "Les fonctions fléchées (Arrow Functions) en JavaScript ES6", channel: "Grafikart", lang: "fr" },
      { youtubeId: "TVpsLBPytI0", title: "JavaScript ES6 : Les fonctions fléchées", lang: "fr" },
      { youtubeId: "SVS1_sQua08", title: "JavaScript Arrow Functions & this Explained Simply", channel: "Web Dev Simplified", lang: "en" },
    ],
    "template-literals": [
      { youtubeId: "ADlEiHC2Lt8", title: "JavaScript ES6 : Les template strings", channel: "Grafikart", lang: "fr" },
    ],
    "defaults-rest": [
      { youtubeId: "hLEmoS4-wBI", title: "JavaScript ES6 : Paramètres et arguments des fonctions (defaults + rest)", lang: "fr" },
    ],
    spread: [
      { youtubeId: "u9M4qToqfvI", title: "Débuter en JavaScript : l'opérateur de décomposition (Spread Operator)", lang: "fr" },
      { youtubeId: "cnjlBdGboYs", title: "JavaScript ES6 : Comprendre destructuring et spread operator", channel: "Grafikart", lang: "fr" },
    ],
    "destructuring-obj": [
      { youtubeId: "cnjlBdGboYs", title: "JavaScript ES6 : Comprendre destructuring et spread operator", channel: "Grafikart", lang: "fr" },
      { youtubeId: "eKDGKz1bvlw", title: "Astuce JavaScript : déstructuration d'objet avec valeurs par défaut et alias", lang: "fr" },
    ],
    "destructuring-arr": [
      { youtubeId: "kACyI51stO0", title: "JavaScript : Maîtrisez la destructuration de tableaux et d'objets", lang: "fr" },
    ],
    "map-filter-reduce": [
      { youtubeId: "r0xv0uZM5V4", title: "Manipuler les tableaux avec map, reduce et filter", channel: "Grafikart", lang: "fr" },
      { youtubeId: "qkPwQv1w8-0", title: "Apprendre la méthode JavaScript REDUCE en 20 minutes", lang: "fr" },
      { youtubeId: "snhaYhafUXE", title: "JavaScript reduce() : 3 exemples utiles en 10 min", lang: "fr" },
    ],
    "find-some-every": [
      { youtubeId: "rehuXwBEE0A", title: "Trouver un élément dans un tableau en JS avec find et findIndex", lang: "fr" },
      { youtubeId: "4sgugU_QV54", title: "Tableau JavaScript : les méthodes some & every", lang: "fr" },
    ],
    "flat-flatmap": [
      { youtubeId: "12vf2GwKHN4", title: "Protip JS : flat et flatMap", lang: "fr" },
      { youtubeId: "LkGCDD0tXQI", title: "JavaScript Array sort() vs toSorted() (new in ES2023)", lang: "en" },
    ],
    "mutating-vs-not": [
      { youtubeId: "KkQSNNs_L9g", title: "Tableau en JavaScript : 7 méthodes pour manipuler un Array (ajout, suppression, inversion)", lang: "fr" },
      { youtubeId: "LkGCDD0tXQI", title: "JavaScript Array sort() vs toSorted() : muter vs ne pas muter (ES2023)", lang: "en" },
    ],
    "object-methods": [
      { youtubeId: "kk7FWl-46P4", title: "5 façons d'itérer à travers un objet en JS (keys / values / entries)", lang: "fr" },
    ],
    "modules-es": [
      { youtubeId: "DJewHNOFqD0", title: "Apprendre le JavaScript : Les modules (import / export)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "42E7iLumsE8", title: "JavaScript ES6 : Apprendre import et export", lang: "fr" },
    ],
    "cjs-vs-esm": [
      { youtubeId: "I3DrifH-rJE", title: "ESM vs CommonJS in your Node Projects", lang: "en" },
    ],
    "classes-es6": [
      { youtubeId: "2HAPViIAYjc", title: "Apprendre le JavaScript : Les classes", channel: "Grafikart", lang: "fr" },
      { youtubeId: "WdDJA3MrgyQ", title: "Comment créer une class en JavaScript ? (constructor, getter, extends...)", lang: "fr" },
    ],
    "modern-operators": [
      { youtubeId: "3Qsq1nXBYBA", title: "JS idiomatique : Optional Chaining et Nullish Coalescing", lang: "fr" },
    ],
    "map-set": [
      { youtubeId: "vv4_a60aoO0", title: "Apprendre le JavaScript : Set & Map", channel: "Grafikart", lang: "fr" },
      { youtubeId: "kzuvppEWm88", title: "JavaScript Map, Set, WeakMap, WeakSet - When & Why to Use Them", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M11 — JavaScript asynchrone
  // -----------------------------------------------------------
  "m11-javascript-async": {
    "single-threaded": [
      { youtubeId: "4RCK8CYm63I", title: "JavaScript Async en français [1/4] : Synchrone vs Asynchrone", lang: "fr" },
      { youtubeId: "7Gevq7rZIPI", title: "Javascript asynchrone, pourquoi et comment ?", lang: "fr" },
      { youtubeId: "8aGhZQkoFbQ", title: "What the heck is the event loop anyway?", channel: "Philip Roberts (JSConf EU)", lang: "en" },
    ],
    "event-loop": [
      { youtubeId: "H7uVLPPRKZI", title: "JAVASCRIPT - C'est quoi l'EVENT LOOP", channel: "Cocadmin", lang: "fr" },
      { youtubeId: "OFnSq_0_Pyc", title: "Event loop et asynchronisme en JavaScript", channel: "Benjamin Cavy", lang: "fr" },
      { youtubeId: "8aGhZQkoFbQ", title: "What the heck is the event loop anyway?", channel: "Philip Roberts (JSConf EU)", lang: "en" },
      { youtubeId: "eiC58R16hb8", title: "JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue", channel: "Lydia Hallie", lang: "en" },
    ],
    callbacks: [
      { youtubeId: "VAw4-umCOck", title: "Javascript asynchrone, Callback hell ?", lang: "fr" },
      { youtubeId: "NOlOw03qBfw", title: "What is JavaScript CALLBACK HELL?", channel: "Fireship", lang: "en" },
    ],
    promises: [
      { youtubeId: "05mKXSdkCJg", title: "Apprendre le JavaScript : Promise", channel: "Grafikart", lang: "fr" },
      { youtubeId: "MQRQkyx6rJg", title: "JavaScript Promise : then() - async/await - fetch() en français", lang: "fr" },
      { youtubeId: "Xs1EMmBLpn4", title: "JavaScript Visualized - Promise Execution", channel: "Lydia Hallie", lang: "en" },
      { youtubeId: "RvYYCGs45L4", title: "JavaScript Promise in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "promise-static": [
      { youtubeId: "merGSVXAFLI", title: "Promise.all, Promise.any et Promise.race", lang: "fr" },
      { youtubeId: "L5aCbiYhGa8", title: "Javascript de A à Z - La méthode Promise.all", channel: "La minute de code", lang: "fr" },
      { youtubeId: "tt1KxvkuTkU", title: "Promise.all, Promise.allSettled, Promise.any, and Promise.race", lang: "en" },
    ],
    "async-await": [
      { youtubeId: "DBKb_v1jf4E", title: "JavaScript Async en français [4/4] : Async / Await", lang: "fr" },
      { youtubeId: "WNFNEe4bc5A", title: "Comment utiliser async & await ?", lang: "fr" },
      { youtubeId: "RvYYCGs45L4", title: "JavaScript Promise in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    fetch: [
      { youtubeId: "z9pcgJX1DdY", title: "Apprendre le JavaScript : Appel HTTP avec fetch()", channel: "Grafikart", lang: "fr" },
      { youtubeId: "60HllThTSLc", title: "Récupérer & traiter des données facilement avec l'API Fetch en JavaScript !", lang: "fr" },
      { youtubeId: "MQRQkyx6rJg", title: "JavaScript Promise : then() - async/await - fetch() en français", lang: "fr" },
    ],
    "fetch-post": [
      { youtubeId: "tMzybZOw3t4", title: "Utilisation de la méthode POST dans une requête HTTP avec fetch()", lang: "fr" },
      { youtubeId: "XHokFQeQ6Lk", title: "Fetch API in 4 Minutes (GET, POST, PUT, DELETE | JSON)", lang: "en" },
    ],
    "abort-controller": [
      { youtubeId: "GRAp6lJr0ZY", title: "Comment arrêter une requête fetch() en cours ? AbortController", lang: "fr" },
      { youtubeId: "bLpA9tvABb8", title: "How To Abort A Fetch Request With AbortController In JavaScript", lang: "en" },
    ],
    microtasks: [
      { youtubeId: "eiC58R16hb8", title: "JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue", channel: "Lydia Hallie", lang: "en" },
      { youtubeId: "cCOL7MC4Pl0", title: "Jake Archibald: In The Loop (microtasks vs tasks)", channel: "JSConf", lang: "en" },
    ],
    "retry-backoff": [
      { youtubeId: "zq97PFCftNA", title: "How to Implement Exponential Backoff & Retry Logic (429, 5xx)", lang: "en" },
      { youtubeId: "nDIxiea-eLg", title: "How to Add Automatic Retry Support to Fetch in Node.js", lang: "en" },
    ],
    "debounce-throttle": [
      { youtubeId: "JLrYtOgvuPk", title: "Tutoriel JavaScript : Debounce & Throttle", lang: "fr" },
      { youtubeId: "cjIswDCKgu0", title: "Debounce and Throttle in JavaScript", lang: "en" },
    ],
    timers: [
      { youtubeId: "5XvRiuBETiA", title: "Javascript et le temps - 2 : Timers (setInterval & setTimeout)", lang: "fr" },
      { youtubeId: "zucCjXApXOU", title: "Meet the Timers: setTimeout, setInterval, and requestAnimationFrame", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M12 — JavaScript avancé (closures, this, prototype)
  // -----------------------------------------------------------
  "m12-javascript-avance": {
    "execution-context": [
      { youtubeId: "qYuvcK8QU4c", title: "Apprendre le JavaScript : La portée des variables", channel: "Grafikart", lang: "fr" },
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et... hoisting ?)", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes, and Closures in JS", lang: "en" },
    ],
    "lexical-scope": [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (lexical scoping)", lang: "fr" },
      { youtubeId: "qYuvcK8QU4c", title: "Apprendre le JavaScript : La portée des variables", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Nt-qa_LlUH0", title: "Execution Contexts, Hoisting, Scopes, and Closures in JS", lang: "en" },
    ],
    hoisting: [
      { youtubeId: "LYvQWwsKiME", title: "Scope et closures en JS (et... hoisting ?)", lang: "fr" },
      { youtubeId: "bE7iQBNzRE8", title: "JavaScript Hoisting Explained Visually (var, let, const, TDZ)", lang: "en" },
    ],
    closures: [
      { youtubeId: "iwaXTY1bSqk", title: "Les Closures Expliquées Simplement, le secret des devs confirmés", lang: "fr" },
      { youtubeId: "ABFFm6a-DbE", title: "Cours complet JavaScript [31/65] - Les closures en JavaScript", channel: "Pierre Giraud", lang: "fr" },
      { youtubeId: "6Ixyltr8_R0", title: "JavaScript Visualized - Closures", lang: "en" },
      { youtubeId: "qikxEIxsXco", title: "Closures in JS | Namaste JavaScript Episode 10", channel: "Akshay Saini", lang: "en" },
    ],
    "closure-patterns": [
      { youtubeId: "d1mnTl51oJA", title: "Encapsulation, Module Pattern, IIFE, Closure en JavaScript", lang: "fr" },
      { youtubeId: "qikxEIxsXco", title: "Closures in JS | Namaste JavaScript Episode 10", channel: "Akshay Saini", lang: "en" },
    ],
    "this-contexts": [
      { youtubeId: "JPA3g46ozwQ", title: "JavaScript : enfin comprendre call() apply() bind()", lang: "fr" },
      { youtubeId: "9jjCZiz1UBc", title: "JavaScript ES6 : comprendre et utiliser call, apply et bind", lang: "fr" },
      { youtubeId: "Pv9flm-80vM", title: "JavaScript THIS keyword explained", lang: "en" },
    ],
    "arrow-vs-function": [
      { youtubeId: "DbJXmYwz0K8", title: "Fonction classique vs Fonction fléchée en JavaScript : la comparaison essentielle", lang: "fr" },
      { youtubeId: "C_kr3okAu1c", title: "La vérité sur le THIS dans les fonctions fléchées en JS", lang: "fr" },
    ],
    prototypes: [
      { youtubeId: "QEh3d6ltr1Q", title: "Prototype et chaîne de prototypes en JavaScript", lang: "fr" },
      { youtubeId: "GhJTy5-X3kA", title: "Understanding the JavaScript Prototype Chain", lang: "en" },
    ],
    "classes-prototypes": [
      { youtubeId: "2HAPViIAYjc", title: "Apprendre le JavaScript : Les classes", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Qvr6Nh7rtAI", title: "Apprendre le JavaScript : Le sucre syntaxique", channel: "Grafikart", lang: "fr" },
    ],
    inheritance: [
      { youtubeId: "KjXBPJZPmYU", title: "Classes et héritages en JavaScript (POO)", lang: "fr" },
      { youtubeId: "s75Z7pM84oM", title: "Composition over Inheritance : les mixins en JavaScript", lang: "fr" },
    ],
    currying: [
      { youtubeId: "SiYJITtSsCY", title: "Le currying en JavaScript", lang: "fr" },
      { youtubeId: "35OdU_TzXnI", title: "Tutoriel JavaScript : Curryfication", lang: "fr" },
    ],
    memoization: [
      { youtubeId: "TyWwJKMCKPY", title: "La mémoïsation en JavaScript", lang: "fr" },
      { youtubeId: "jmnI7PKsCVQ", title: "Memoization : gagnez en vitesse - Optimise ton JS ! #2", lang: "fr" },
    ],
    gc: [
      { youtubeId: "aBalAxmK1AY", title: "Réparer les fuites mémoire NodeJS : ma première expérience de plombier", lang: "fr" },
      { youtubeId: "IkoGmbNJolo", title: "JavaScript Memory Leaks and How To Fix Them", lang: "en" },
    ],
    functional: [
      { youtubeId: "z9ZTQZm2O0Q", title: "Programmation fonctionnelle avec JavaScript - 'A la ferme'", lang: "fr" },
      { youtubeId: "W-b_XK48vGE", title: "Les fonctions pures en JavaScript", lang: "fr" },
      { youtubeId: "BMUiFMZr7vk", title: "Functional Programming in JavaScript - Beau teaches JS", channel: "freeCodeCamp", lang: "en" },
    ],
    es2022: [
      { youtubeId: "ViihgYPIcFw", title: "Les 3 nouveautés principales d'ES2022 !", lang: "fr" },
      { youtubeId: "dwfUJRbGXX0", title: "ES2022 : Class Private Fields and Methods", lang: "en" },
    ],
    "read-libs": [
      { youtubeId: "Q9ATc3GEQO8", title: "Écris ta première librairie NPM avec TypeScript en 10 minutes", lang: "fr" },
      { youtubeId: "9pOm7xhgMlU", title: "JavaScript côté serveur : Utiliser npm", channel: "Grafikart", lang: "fr" },
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
      { youtubeId: "PtsTS2S8hZM", title: "Apprendre TypeScript : Syntaxe de base (tsconfig, compilation)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "eJXVEju3XLM", title: "The TSConfig Cheat Sheet (target, module, strict)", channel: "Matt Pocock", lang: "en" },
    ],
    primitives: [
      { youtubeId: "PtsTS2S8hZM", title: "Apprendre TypeScript : Syntaxe de base (types primitifs)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "x-ZSzC8Jbtc", title: "TypeScript AVANCÉ : any, unknown, undefined, never (void/never inclus)", channel: "Web FR", lang: "fr" },
    ],
    complex: [
      { youtubeId: "yxCOyCqy2Jw", title: "Apprendre TypeScript : Tuple & Enum", channel: "Grafikart", lang: "fr" },
      { youtubeId: "85pP2wvqKUo", title: "TypeScript pour Débutants : Tableaux et Tuples en détail", channel: "Web FR", lang: "fr" },
      { youtubeId: "d56mG7DezGs", title: "TypeScript Tutorial for Beginners (arrays, objects, functions)", channel: "Programming with Mosh", lang: "en" },
    ],
    "interface-vs-type": [
      { youtubeId: "sFNQeh5Oc08", title: "Apprendre TypeScript : Type ou Interface ?", channel: "Grafikart", lang: "fr" },
      { youtubeId: "crjIq7LEAJw", title: "Type vs Interface - Which Should You Use In TypeScript?", channel: "Web Dev Simplified", lang: "en" },
    ],
    "union-intersection": [
      { youtubeId: "dB_LbNMgVAA", title: "Apprendre TypeScript : Alias & Generics (unions & intersections)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "ozUaIWSFGX0", title: "Advanced TypeScript | Union and Intersection Types", channel: "ColorCode", lang: "en" },
    ],
    "literal-types": [
      { youtubeId: "F7JbpI6UKcQ", title: "TypeScript : 'as const' expliqué simplement (types littéraux précis)", channel: "Web FR", lang: "fr" },
      { youtubeId: "jxSh-RZTCws", title: "Literal types are SO USEFUL in TS - Advanced TypeScript", channel: "Matt Pocock", lang: "en" },
    ],
    narrowing: [
      { youtubeId: "HUZhBJL0Dv4", title: "TypeScript Crash Course Part 2 – Union Types & Type Narrowing", channel: "ColorCode", lang: "en" },
      { youtubeId: "jlj7_CWQymU", title: "Safer Type Narrowing in TypeScript with Discriminated Unions", channel: "Matt Pocock", lang: "en" },
    ],
    "any-unknown-never": [
      { youtubeId: "x-ZSzC8Jbtc", title: "TypeScript AVANCÉ : any, unknown, undefined, never (j'explique TOUT)", channel: "Web FR", lang: "fr" },
      { youtubeId: "aBoAjDz7ouo", title: "TypeScript : Any vs Unknown vs Never – comprendre leurs différences", channel: "Web FR", lang: "fr" },
      { youtubeId: "kWmUNChlzVw", title: "any vs unknown vs never: TypeScript demystified", channel: "ColorCode", lang: "en" },
    ],
    generics: [
      { youtubeId: "dB_LbNMgVAA", title: "Apprendre TypeScript : Alias & Generics", channel: "Grafikart", lang: "fr" },
      { youtubeId: "FIZilZ2KKbo", title: "TypeScript : Maîtriser la généricité en TypeScript", channel: "Web FR", lang: "fr" },
      { youtubeId: "Zz_Uf7JEddk", title: "TypeScript Generics with Matt Pocock", channel: "Learn With Jason", lang: "en" },
    ],
    "utility-types": [
      { youtubeId: "Hg9rPl7Z4zA", title: "Apprendre TypeScript : Types utilitaires (Partial, Pick, Omit, Record...)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "0p-VafFxuUE", title: "TypeScript Utility Types you must know - Pick, Omit, Partial, Record", channel: "Web Dev Simplified", lang: "en" },
    ],
    "advanced-types": [
      { youtubeId: "20QbmIAiw2c", title: "These TypeScript Tricks are POWERFUL (mapped, conditional, template literal)", channel: "Matt Pocock", lang: "en" },
      { youtubeId: "VBsKNKEZNnY", title: "Extracting React Props using CONDITIONAL TYPES - Advanced TypeScript", channel: "Matt Pocock", lang: "en" },
    ],
    "keyof-typeof": [
      { youtubeId: "F7JbpI6UKcQ", title: "TypeScript : 'as const' expliqué simplement", channel: "Web FR", lang: "fr" },
      { youtubeId: "Ckn7UrkonD4", title: "KEYOF + TYPEOF is an amazing combination in TypeScript", channel: "Matt Pocock", lang: "en" },
      { youtubeId: "Eat7AXkEtNs", title: "4 TypeScript tips: as const, typeof, keyof and template string types", channel: "Matt Pocock", lang: "en" },
    ],
    "ts-react": [
      { youtubeId: "R1MlRKjCOLU", title: "Apprendre TypeScript : Typer React", channel: "Grafikart", lang: "fr" },
      { youtubeId: "-jnV9cNSCS8", title: "Tutoriel TypeScript avec React en 1 HEURE (l'essentiel 2025)", channel: "MelvynxDev", lang: "fr" },
      { youtubeId: "Km1onb6Oe-Y", title: "Apprendre React avec TypeScript : composants, props, useState", channel: "Web FR", lang: "fr" },
    ],
    "lib-types": [
      { youtubeId: "JFrlqGoUtFU", title: "How to Provide Types for your Node.js/JavaScript NPM Package", channel: "Matt Pocock", lang: "en" },
      { youtubeId: "aKTSC4D1GL8", title: "The NPM Library Speedrun - build, CI and publish (avec types)", channel: "Matt Pocock", lang: "en" },
    ],
    "strict-mode": [
      { youtubeId: "qabYnswX3FY", title: "Crée ta première App React avec ViteJS | Prettier | ESLint", channel: "MelvynxDev", lang: "fr" },
      { youtubeId: "eJXVEju3XLM", title: "The TSConfig Cheat Sheet (strict, noUncheckedIndexedAccess)", channel: "Matt Pocock", lang: "en" },
      { youtubeId: "n58QJ_k0ITo", title: "Configuring ESLint to Minimize Bugs & Promote Type-Safety", channel: "Web Dev Simplified", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M14 — React hooks
  // -----------------------------------------------------------
  "m14-react-composants-hooks": {
    "react-concept": [
      { youtubeId: "Tn6-PIqc4UM", title: "React in 100 Seconds", channel: "Fireship", lang: "en" },
      { youtubeId: "NT0s0aOHu0Q", title: "Apprendre React : Introduction", channel: "Grafikart", lang: "fr" },
    ],
    "vite-react-setup": [
      { youtubeId: "qabYnswX3FY", title: "Crée ta première App React avec ViteJS | Prettier | ESLint | npm", lang: "fr" },
      { youtubeId: "RbZyQWOEmD0", title: "How To Setup Your First React + TypeScript Project With Vite", lang: "en" },
    ],
    jsx: [
      { youtubeId: "TAuiJHmvPAQ", title: "Apprendre React : La syntaxe JSX", channel: "Grafikart", lang: "fr" },
      { youtubeId: "hQAHSlTtcmY", title: "Learn React In 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    components: [
      { youtubeId: "8mPcI2Vj9Vw", title: "ReactJs pour débutants #2 LES COMPOSANTS | Tuto français", lang: "fr" },
      { youtubeId: "EqiNee6K_S8", title: "Apprendre React : Propriétés de rendu (composants)", channel: "Grafikart", lang: "fr" },
    ],
    props: [
      { youtubeId: "en0If_3jkRU", title: "Apprendre ReactJS | Passer des props à un composant", lang: "fr" },
      { youtubeId: "TMm8dYD5syc", title: "La différence entre PROPS et STATE en React expliqué simplement", lang: "fr" },
      { youtubeId: "EqiNee6K_S8", title: "Apprendre React : Propriétés de rendu", channel: "Grafikart", lang: "fr" },
    ],
    "use-state": [
      { youtubeId: "ilqxZiXnwD8", title: "Apprendre React : Le hook useState", channel: "Grafikart", lang: "fr" },
      { youtubeId: "O6P86uwfdR0", title: "Learn useState In 15 Minutes - React Hooks Explained", channel: "Web Dev Simplified", lang: "en" },
    ],
    "use-effect": [
      { youtubeId: "vNLwY2UlbQg", title: "Apprendre React : Le hook useEffect", channel: "Grafikart", lang: "fr" },
      { youtubeId: "fmsTYrfZdao", title: "Apprendre useEffect en 18 minutes | React Hooks 2024", lang: "fr" },
      { youtubeId: "dH6i3GurZW8", title: "Mastering React's useEffect", channel: "Jack Herrington", lang: "en" },
    ],
    "use-ref": [
      { youtubeId: "bBy8EO5S_go", title: "Apprendre React : Le hook useRef", channel: "Grafikart", lang: "fr" },
      { youtubeId: "t2ypzz6gJm0", title: "Learn useRef in 11 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "use-context": [
      { youtubeId: "CeyqosSakOQ", title: "Apprendre React : Le hook useContext", channel: "Grafikart", lang: "fr" },
      { youtubeId: "O179--nXRyc", title: "Communication entre composants : React Context", lang: "fr" },
    ],
    "memo-callback": [
      { youtubeId: "2Cs9H5kiNb4", title: "Apprendre React : Le hook useMemo", channel: "Grafikart", lang: "fr" },
      { youtubeId: "fhbBI_8s58s", title: "Apprendre React : Mémoisation et useCallback", channel: "Grafikart", lang: "fr" },
    ],
    "conditional-render": [
      { youtubeId: "H_dEaebG2u4", title: "Gérer l'affichage conditionnel en React", channel: "Dans Ton Code", lang: "fr" },
      { youtubeId: "7PcIYG7DXwM", title: "Le PIÈGE du rendu conditionnel en React", lang: "fr" },
    ],
    "lists-key": [
      { youtubeId: "0GzWbhPGdAs", title: "Pourquoi tu ne dois JAMAIS utiliser INDEX en tant que KEY dans React", lang: "fr" },
      { youtubeId: "xe9bvyzHRao", title: "Why React Keys Matter (and why index is dangerous)", lang: "en" },
    ],
    forms: [
      { youtubeId: "rhPIw9a1CxQ", title: "Apprendre React : Les formulaires", channel: "Grafikart", lang: "fr" },
      { youtubeId: "VyWKgNfqSiA", title: "Gérer les inputs avec React (Controlled vs Uncontrolled)", lang: "fr" },
    ],
    "react19-actions": [
      { youtubeId: "iNQbsdhOqGI", title: "React 19 Hooks - useTransition, useActionState, useFormStatus, useOptimistic in 20 mins", lang: "en" },
      { youtubeId: "NafMDSppo1M", title: "React 19 Form Actions Explained | useActionState Hook", lang: "en" },
    ],
    rerender: [
      { youtubeId: "Aykxy0-kgtI", title: "QUAND React Re-Render ? Ce qu'il faut absolument savoir", channel: "Melvynx", lang: "fr" },
      { youtubeId: "G8Mk6lsSOcw", title: "The Ultimate React Performance Guide (Part 1): Stop Useless Re-Renders!", lang: "en" },
    ],
    "hooks-rules": [
      { youtubeId: "rLYtXmIjHdA", title: "Les règles ESSENTIELLES pour les Hooks React", lang: "fr" },
      { youtubeId: "o_7wgRHBzeA", title: "This is Why You Can't Render React Hooks Conditionally", channel: "Web Dev Simplified", lang: "en" },
    ],
    "custom-hooks": [
      { youtubeId: "yzvh4utcEN8", title: "Apprendre React : Créer un hook personnalisé", channel: "Grafikart", lang: "fr" },
      { youtubeId: "6tiIphGAeD8", title: "Build Powerful Custom React Hooks | useToggle, useDebounce & useFetch", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M15 — React écosystème
  // -----------------------------------------------------------
  "m15-react-ecosysteme": {
    "tanstack-router": [
      { youtubeId: "s1kzDQccUS0", title: "TanStack Router - Full Tutorial for Beginners", lang: "en" },
      { youtubeId: "WyqxZniJk5w", title: "Complete TanStack Router Tutorial - Type-Safe File-Based Routing", lang: "en" },
      { youtubeId: "Ab01W6h4Giw", title: "TanStack Router - How to Become a Routing God in React", lang: "en" },
    ],
    "router-params": [
      { youtubeId: "xUrbLlcrIXY", title: "TanStack Router: Path Parameters & Loader", lang: "en" },
      { youtubeId: "fE0CeXZF7CY", title: "TanStack Router: Query Parameters & Validation (search params typés)", lang: "en" },
      { youtubeId: "4rTsQTD9Me4", title: "TanStack Router - Routing, Lazy Loading, Data Fetching, Params", lang: "en" },
    ],
    "tanstack-query": [
      { youtubeId: "38wJmjeJNAk", title: "Découverte de react-query (TanStack Query)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "8-6--06ptek", title: "Tutoriel React Query #1 - Initiation & Fetch Data avec useQuery", lang: "fr" },
      { youtubeId: "novnyCaa7To", title: "React Query Tutorial #1 - Intro & Setup", channel: "Net Ninja", lang: "en" },
      { youtubeId: "KkxPtimqaew", title: "TanStack Query - How to Master God-Tier React Query", channel: "Jack Herrington", lang: "en" },
    ],
    mutations: [
      { youtubeId: "_EuPZrr3faU", title: "TanStack React Query v5 - Full Guide (Mutations, Optimistic Updates)", lang: "en" },
      { youtubeId: "KkxPtimqaew", title: "TanStack Query - Mutations + Optimistic Updates (God-Tier)", channel: "Jack Herrington", lang: "en" },
    ],
    zustand: [
      { youtubeId: "YMXN-t4jXbU", title: "Zustand : la MEILLEURE librairie de state management en React", lang: "fr" },
      { youtubeId: "JRGMte2Zq0k", title: "TUTO / COURS sur Zustand avec React en 2024", lang: "fr" },
      { youtubeId: "_ngCLZ5Iz-0", title: "Zustand - Complete Tutorial", lang: "en" },
    ],
    rhf: [
      { youtubeId: "nk_65cL9-kA", title: "Gestion Pro des formulaires - Tuto React Hook Form", channel: "React Academy", lang: "fr" },
      { youtubeId: "Ipgf8PLRmY8", title: "Tutoriel React : Présentation de React Hook Form", channel: "Grafikart", lang: "fr" },
      { youtubeId: "4nXVitqJ8EM", title: "React Hook Form Tutorial - Advanced Validation", channel: "Web Dev Simplified", lang: "en" },
    ],
    "zod-forms": [
      { youtubeId: "haJq2YXLgmk", title: "Pourquoi il FAUT utiliser Zod dans ton application TypeScript", channel: "Melvynx", lang: "fr" },
      { youtubeId: "bZNwQ5Pvt2s", title: "Tuto react-hook-form et Zod combinés pour un formulaire efficace", lang: "fr" },
      { youtubeId: "L6BE-U3oy80", title: "Learn Zod in 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    shadcn: [
      { youtubeId: "oVS9wR-lpGQ", title: "Ma librairie UI préférée pour React (shadcn/ui)", channel: "Melvynx", lang: "fr" },
      { youtubeId: "VanmyVow1Ig", title: "Découverte de Shadcn, encore une librairie de composant ?", channel: "Grafikart", lang: "fr" },
      { youtubeId: "sIKGWcLB2nY", title: "TUTO Shadcn UI avec TailwindCSS : tout comprendre en 30 min", lang: "fr" },
      { youtubeId: "urlCrgNO0HY", title: "Shadcn UI Complete Guide", channel: "Code With Antonio", lang: "en" },
    ],
    "framer-motion": [
      { youtubeId: "gX4N44sPNHY", title: "Apprendre React : Animer avec Framer Motion", channel: "Grafikart", lang: "fr" },
      { youtubeId: "yAR0UJ28pO0", title: "Coder des animations avec React et Framer Motion (e-commerce) - Partie 1/2", lang: "fr" },
      { youtubeId: "2V1WK-3HQNk", title: "Framer Motion (for React) #1 - Introduction", channel: "Net Ninja", lang: "en" },
    ],
    "code-splitting": [
      { youtubeId: "SGSAPfjOHBM", title: "Use React.lazy and Suspense to Code-Split Your App", lang: "en" },
      { youtubeId: "wtW06D5MYbg", title: "React Lazy Loading Explained (Lazy, Suspense and Code Splitting)", lang: "en" },
    ],
    "error-boundaries": [
      { youtubeId: "POHZrI_WqXk", title: "Apprendre React : Capturer les erreurs avec ErrorBoundary", channel: "Grafikart", lang: "fr" },
      { youtubeId: "_FuDMEgIy7I", title: "Learn React Error Boundaries In 7 Minutes", lang: "en" },
    ],
    "devtools-profiler": [
      { youtubeId: "4U37IRrt_zQ", title: "React Developer Tools - Components & Profiler", lang: "en" },
      { youtubeId: "00RoZflFE34", title: "How to use the React Profiler to find and fix Performance Problems", lang: "en" },
    ],
    compiler: [
      { youtubeId: "I906IcXVrZ4", title: "Le nouveau compiler de React, la fin du memo ?", lang: "fr" },
      { youtubeId: "aJcburd0r2k", title: "React 19 Compiler Explained: Auto Optimisations vs Manual Memoization", lang: "en" },
    ],
    patterns: [
      { youtubeId: "MWD7qbFQf0E", title: "Créer des custom hooks avec React", channel: "Grafikart", lang: "fr" },
      { youtubeId: "RmtDfvlohfc", title: "5 custom hooks super utiles pour tes applications React !", lang: "fr" },
      { youtubeId: "qOH2X5hciiA", title: "React: How to Apply Clean Architecture", lang: "en" },
    ],
    "auth-flow": [
      { youtubeId: "l5rUTjUpABg", title: "[ReactJS FR] Authentification avec le Context Hook (Partie 1)", lang: "fr" },
      { youtubeId: "A__Mo3TyBKU", title: "[ReactJS FR] Authentification (dernière partie - routes protégées)", lang: "fr" },
      { youtubeId: "AcYF18oGn6Y", title: "Authentication in React with JWTs, Access & Refresh Tokens", lang: "en" },
    ],
    i18n: [
      { youtubeId: "woMYLIXKNOY", title: "React i18n : traduire intelligemment React avec i18next", channel: "Grafikart", lang: "fr" },
      { youtubeId: "LFaFPORPmeo", title: "Complete Guide - React Internationalization (i18n) with i18next", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M16 — Node.js
  // -----------------------------------------------------------
  "m16-nodejs-runtime": {
    "what-is-node": [
      { youtubeId: "97rRv9xy2iw", title: "Apprendre Node.js #2 - Node.js c'est quoi ?", lang: "fr" },
      { youtubeId: "mzX6DX1S7Fc", title: "C'est quoi Node.js et pourquoi l'apprendre ?", lang: "fr" },
      { youtubeId: "ahCwqrYpIuM", title: "Node.js in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "browser-vs-node": [
      { youtubeId: "t2KrvQPvWMs", title: "Apprendre Node.js #7 - Les différences avec le navigateur", lang: "fr" },
      { youtubeId: "ywpfVrJbN2w", title: "JavaScript et Node.JS : différence entre code client et code serveur", lang: "fr" },
    ],
    "cjs-vs-esm": [
      { youtubeId: "4QSx_g8itfE", title: "Node JS de A à Z #14 - Les modules ES et CommonJS", lang: "fr" },
      { youtubeId: "I3DrifH-rJE", title: "ESM vs CommonJS in your Node Projects", lang: "en" },
      { youtubeId: "lMWUqWKEGgQ", title: "Start Using ES Modules Now", lang: "en" },
    ],
    "package-json": [
      { youtubeId: "3Y4Bw7_xXIc", title: "NPM #6 - Qu'est-ce que le fichier package.json et le dossier node_modules ?", lang: "fr" },
      { youtubeId: "nkp_xhM0L0s", title: "Comprendre le dossier node_modules de NodeJS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "qcITXvs6shU", title: "package.json Demystified - The 'Type' Keyword", lang: "en" },
    ],
    "fs-promises": [
      { youtubeId: "BhB3HuJ9vq4", title: "Cours Node.js #5 - Gestion des fichiers (fs)", lang: "fr" },
      { youtubeId: "heDjstLEXS4", title: "Node JS de A à Z #27 - Le module fs/promises", lang: "fr" },
      { youtubeId: "A1vr8vtTHyk", title: "Node.js FS Module with Promises: Write, Read, Update & Delete Files", lang: "en" },
    ],
    path: [
      { youtubeId: "Uaj3ToRAuCM", title: "Path Module in Node.js : __filename, __dirname, path.join()", lang: "en" },
      { youtubeId: "9-lqk6GfdN4", title: "ES Modules in Node.js - __dirname & __filename Fixes, Top-Level Await", lang: "en" },
    ],
    "http-natif": [
      { youtubeId: "-u64j9SbMFI", title: "Node.js : Créer un serveur avec node:http", lang: "fr" },
      { youtubeId: "5oqK_ePpyYE", title: "Node.js - Créer un serveur HTTP et écouter les requêtes", lang: "fr" },
      { youtubeId: "qNDUQ-hLeoE", title: "How to Create a Simple HTTP Server in Node.js (HTTP Module Basics)", lang: "en" },
    ],
    process: [
      { youtubeId: "UUhqbcBs0-g", title: "Node.js #17 - process.argv (arguments en ligne de commande)", lang: "fr" },
      { youtubeId: "6qMn3ef_6oU", title: "How to Use Command Line Arguments (Flags) in NodeJS", lang: "en" },
      { youtubeId: "L0dNCfd0HTs", title: "Listen for SIGINT and SIGTERM Events in a Script", lang: "en" },
    ],
    "env-vars": [
      { youtubeId: "HkgKfzrP_kE", title: "Use Environment Files (.env) in Node.js 20.6+ (--env-file)", lang: "en" },
      { youtubeId: "T_OlUb5YwaU", title: "You DON'T NEED Dotenv to Handle Environment Variables Anymore!", lang: "en" },
      { youtubeId: "XBdoRrK8CrE", title: "How to use environment variables with Node.js - dotenv tutorial", lang: "en" },
    ],
    "event-loop-node": [
      { youtubeId: "eiC58R16hb8", title: "JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue", channel: "Lydia Hallie", lang: "en" },
      { youtubeId: "HlebgIgOfHM", title: "Phases of Event Loop in Node.js (Advanced Node.js)", lang: "en" },
      { youtubeId: "paI6J8my3Yw", title: "This is how the Node.js Event Loop really works", lang: "en" },
    ],
    "next-tick": [
      { youtubeId: "NhHXcsR2KN4", title: "setImmediate() vs setTimeout() vs process.nextTick()", lang: "en" },
      { youtubeId: "5FoIxj7GHxU", title: "Understanding setImmediate vs. process.nextTick in Node.js", lang: "en" },
    ],
    "event-emitter": [
      { youtubeId: "pQZ6zeBcBcs", title: "Comment utiliser emit pour gérer des événements", lang: "fr" },
      { youtubeId: "wINRm5arVlM", title: "Node.js \"Event Emitters\" Explained", lang: "en" },
    ],
    streams: [
      { youtubeId: "O2v_ghJlVAA", title: "JavaScript côté serveur : Les streams", channel: "Grafikart", lang: "fr" },
      { youtubeId: "iZCYQSq9IQM", title: "NodeJS (4/6) : Les Streams", channel: "Grafikart", lang: "fr" },
      { youtubeId: "p6A1q_uFeo4", title: "Node.js Streams Part 1 - Read/Write Streams, Backpressure and Pipes", lang: "en" },
    ],
    buffer: [
      { youtubeId: "QeFWvq7WW7s", title: "Buffers in Node.js EXPLAINED! Alloc, Encoding & Performance Tips", lang: "en" },
      { youtubeId: "WEGHqsF3xP8", title: "Character Sets and Encoding | UTF-8 in Node.js", lang: "en" },
    ],
    "error-async": [
      { youtubeId: "8PVc-9wfQ2A", title: "Écrire du code NodeJS sécurisé #4 - La gestion des erreurs", lang: "fr" },
      { youtubeId: "NlYxiALRkMQ", title: "Node.js Async/Await Error Handling: Try-Catch for Beginners", lang: "en" },
      { youtubeId: "wsoQ-fgaoyQ", title: "5 Async + Await Error Handling Strategies", lang: "en" },
    ],
    "node-prefix": [
      { youtubeId: "4N00XnEcNWE", title: "Modules in Node: CommonJS and ESM (node: builtin imports)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M17 — Fastify
  // -----------------------------------------------------------
  "m17-fastify-rest-api": {
    "framework-why": [
      { youtubeId: "YnWjki-M-7A", title: "Apprendre le JavaScript : Découverte de Fastify", channel: "Grafikart", lang: "fr" },
      { youtubeId: "a9uEhq1uwNk", title: "Fastify: The Node.js Framework You Didn't Know You Needed", lang: "en" },
    ],
    "fastify-vs-others": [
      { youtubeId: "eQgWsme6VdI", title: "Express.js or Fastify? Choose the Best in 2025", lang: "en" },
      { youtubeId: "EFoaqR_SKdQ", title: "Express vs Fastify vs Hono: Node.js Performance Comparison (2024)", lang: "en" },
      { youtubeId: "PUXW6UEAW7k", title: "Why aren't you using Fastify? Or Koa? Or NestJS?", lang: "en" },
    ],
    setup: [
      { youtubeId: "o2LqTcH8IhE", title: "LiveCoding NodeJS : Découverte de Fastify", channel: "Grafikart", lang: "fr" },
      { youtubeId: "GWPhASMhmVQ", title: "How To Set Up Fastify With TypeScript and Automatic Reload", lang: "en" },
      { youtubeId: "btGtOue1oDA", title: "Fastify Course - The Performant Node.js Web Framework (setup)", lang: "en" },
    ],
    routing: [
      { youtubeId: "7p6J6sCKh3E", title: "Building a REST API in Fastify | Node.js Tutorial", lang: "en" },
      { youtubeId: "xdzqcG5dS7Q", title: "Fastify Complete Course - learn how to build REST APIs", lang: "en" },
    ],
    "schemas-zod": [
      { youtubeId: "haJq2YXLgmk", title: "Pourquoi il FAUT utiliser Zod dans ton application TypeScript", lang: "fr" },
      { youtubeId: "L6BE-U3oy80", title: "Learn Zod in 30 Minutes", channel: "Web Dev Simplified", lang: "en" },
      { youtubeId: "IcyjtsAdKRs", title: "Zod Validation Tutorial for Beginners [FULL COURSE in 40 Minutes!]", lang: "en" },
    ],
    "ts-inference": [
      { youtubeId: "ZPa9I_pvRU0", title: "Stop Writing Types AND Validation (Use Zod)", lang: "en" },
      { youtubeId: "siQfpESFOhI", title: "Zod Tutorial: Auto-Generate Schemas & Validate API Responses in TypeScript", lang: "en" },
    ],
    "lifecycle-hooks": [
      { youtubeId: "9GmYxoEBqtg", title: "Master Fastify (Prisma, Hooks, Decorators, Plugins)", lang: "en" },
      { youtubeId: "ZHLB4StAqPM", title: "Learn Just Enough Fastify to be Productive", lang: "en" },
    ],
    plugins: [
      { youtubeId: "U_VTjYtALg4", title: "Fastify Plugins | Register and Decorate API", lang: "en" },
      { youtubeId: "9GmYxoEBqtg", title: "Master Fastify (Hooks, Decorators, Plugins)", lang: "en" },
      { youtubeId: "17qoZq2Eq5U", title: "Learning Fastify: Part 3 - Creating my first plugin", lang: "en" },
    ],
    "core-plugins": [
      { youtubeId: "QnAodcAz9kI", title: "Sécuriser une API - #4/6 - Le CORS", lang: "fr" },
      { youtubeId: "Qkd3gABsCtk", title: "Sécuriser une API - #5/6 - HELMET", lang: "fr" },
      { youtubeId: "mQWFVLBdhrs", title: "Fastify Plugins: Turbocharge Your REST API", lang: "en" },
    ],
    "error-handler": [
      { youtubeId: "GQ8RyFBCods", title: "Fastify - Error Handling", lang: "en" },
    ],
    "logger-pino": [
      { youtubeId: "4fD5vXljaSc", title: "Mastering Pino: The Definitive Guide to Logging in Node.js", lang: "en" },
      { youtubeId: "vUDH8OX5DTM", title: "Fastify Application Development | Logging with Pino.js", lang: "en" },
    ],
    "rest-conventions": [
      { youtubeId: "bqpXOT5mwW4", title: "Tutoriel REST : comprendre REST", channel: "Grafikart", lang: "fr" },
      { youtubeId: "UQwjytQzoqE", title: "API REST JSON - Explication et exemples", lang: "fr" },
      { youtubeId: "9rIFUDCcRm8", title: "HTTP Status Codes - API Course", lang: "en" },
    ],
    layers: [
      { youtubeId: "MFZi2dcm-QE", title: "Node JS : 4 architectures différentes de projet Node JS", lang: "fr" },
      { youtubeId: "ff62ijMbSLI", title: "Build Scalable Node.js Apps: Mastering the Repository Pattern with TypeScript", lang: "en" },
      { youtubeId: "cdnYINPRe3Y", title: "Enterprise Node.js Refactor: Routes, Controllers, Services (Deep Guide)", lang: "en" },
    ],
    swagger: [
      { youtubeId: "gBgO8XSW7GM", title: "Fastify - Swagger", lang: "en" },
      { youtubeId: "EV4Kv6O6FEA", title: "Easily Build Swagger Docs with Fastify Zod & Fastify Swagger", lang: "en" },
    ],
    "app-inject": [
      { youtubeId: "ppc9xxkGDM0", title: "This Testing Mistake Costs Node.js Developers Thousands", lang: "en" },
      { youtubeId: "gq8ZQrBJb2M", title: "Test your Fastify REST API With Node Tap", lang: "en" },
    ],
    deploy: [
      { youtubeId: "Nd1GJvj271Y", title: "Hosting Node.js Apps For Free | Render And Railway Tutorial", lang: "en" },
      { youtubeId: "-OjPhPV6Rjs", title: "Here's how to Gracefully Shutdown your apps (with Node.js examples)", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M18 — SQL / PostgreSQL
  // -----------------------------------------------------------
  "m18-sql-postgresql": {
    "relational-concept": [
      { youtubeId: "l3AM9_wRkLo", title: "SQL et bases de données relationnelles : tout comprendre depuis zéro", lang: "fr" },
      { youtubeId: "5X_g8MAESjg", title: "Clé étrangère d'une base de données (relations entre tables)", lang: "fr" },
      { youtubeId: "dKcJrVuYjig", title: "Transactions ACID pour les bases de données relationnelles", lang: "fr" },
    ],
    "setup-pg": [
      { youtubeId: "eHRCdpmf6m4", title: "PostgreSQL en 3 minutes", lang: "fr" },
      { youtubeId: "4M5P7HTVjjQ", title: "SQL & PostgreSQL : Tutoriel complet pour débutants (installation + psql)", channel: "WeWantCode", lang: "fr" },
      { youtubeId: "Hs9Fh1fr5s8", title: "Run Postgres in a Docker Container (Easiest PostgreSQL Setup)", lang: "en" },
    ],
    ddl: [
      { youtubeId: "jaNqlwlYzFM", title: "Création des tables via psql et pgAdmin 4 — PostgreSQL #5", lang: "fr" },
      { youtubeId: "Ivad1Wl2ios", title: "Modifier la structure d'une table — ALTER TABLE (pgAdmin 4) — PostgreSQL #27", lang: "fr" },
      { youtubeId: "qw--VYLpxG4", title: "Learn PostgreSQL Tutorial - Full Course (section DDL)", channel: "freeCodeCamp", lang: "en" },
    ],
    "dml-basic": [
      { youtubeId: "IS1e9tzkfaA", title: "SQL : apprenez les 4 requêtes magiques d'un CRUD (SELECT/INSERT/UPDATE/DELETE)", lang: "fr" },
      { youtubeId: "bjGCpGzAHCk", title: "Bases de Données — SQL : INSERT, DELETE & UPDATE", lang: "fr" },
      { youtubeId: "AHHGjL5ZPr0", title: "Tutoriel français SQL : requêtes SELECT et vues de base", lang: "fr" },
    ],
    types: [
      { youtubeId: "6alT6svFg4E", title: "Les types de données — Comprendre le SQL", lang: "fr" },
      { youtubeId: "kCK6VD1rzT0", title: "Understanding Data Types in PostgreSQL (CHAR, VARCHAR, TEXT, and More)", lang: "en" },
      { youtubeId: "gnTMq2E8X2Q", title: "Data Types in PostgreSQL: UUID Data Type", lang: "en" },
    ],
    constraints: [
      { youtubeId: "fBCKn9AHsKw", title: "Les contraintes en SQL : PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK", lang: "fr" },
      { youtubeId: "9qNXA7UVRQg", title: "Langage SQL — CREATE / types de données / contraintes SQL / DROP", lang: "fr" },
    ],
    joins: [
      { youtubeId: "hrHrvPQG4NI", title: "Apprendre SQL : les JOINTURES (INNER, LEFT, RIGHT, FULL, CROSS, SELF) — tutoriel complet", lang: "fr" },
      { youtubeId: "0vJoRP6_5tI", title: "Apprendre et maîtriser SQL : clés étrangères et jointures", channel: "Grafikart", lang: "fr" },
      { youtubeId: "i_aZCElvJxI", title: "Postgres : connaissez-vous les jointures LEFT et RIGHT JOIN ? (exemple concret)", lang: "fr" },
    ],
    aggregations: [
      { youtubeId: "SbSzh4HDrI4", title: "Apprendre SQL : fonctions d'agrégation & GROUP BY (SUM, AVG, COUNT, MIN, MAX, HAVING)", lang: "fr" },
      { youtubeId: "FhvTxTGGrQc", title: "Les fonctions d'agrégation — SQL (SUM/COUNT/AVG/MIN/MAX) via pgAdmin 4 — PostgreSQL #16", lang: "fr" },
    ],
    subqueries: [
      { youtubeId: "NkdBYPodiT4", title: "Apprendre et maîtriser SQL : requêtes imbriquées (sous-requêtes)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Cw-TlkPKKFk", title: "Langage SQL : les sous-requêtes dans les clauses SELECT et FROM", lang: "fr" },
    ],
    cte: [
      { youtubeId: "EQadZsOUSbk", title: "Sous-requêtes SQL & CTE (WITH) : écrire des requêtes propres et professionnelles", lang: "fr" },
      { youtubeId: "KSVeW55vuec", title: "Maîtriser les CTE SQL : expressions de table communes expliquées", lang: "fr" },
      { youtubeId: "K1WeoKxLZ5o", title: "Advanced SQL Tutorial | CTE (Common Table Expression)", lang: "en" },
    ],
    window: [
      { youtubeId: "pbyEWVvfQ20", title: "SQL pour les débutants : les fonctions de partition avec OVER PARTITION BY (exemple simple)", lang: "fr" },
      { youtubeId: "rIcB4zMYMas", title: "SQL Window Functions Clearly Explained (PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK)", lang: "en" },
      { youtubeId: "XO1WnmJs9RI", title: "The Magic of Window Functions in Postgres", lang: "en" },
    ],
    transactions: [
      { youtubeId: "dKcJrVuYjig", title: "Transactions ACID pour les bases de données relationnelles", lang: "fr" },
      { youtubeId: "Oy2NpxfV9ok", title: "Understand SQL Transactions in 5 Minutes (BEGIN, COMMIT, ROLLBACK)", lang: "en" },
      { youtubeId: "DvJq4L41ru0", title: "How to implement Transactions (COMMIT, ROLLBACK, Savepoint) in PostgreSQL", lang: "en" },
      { youtubeId: "oNCEXY83yuQ", title: "PostgreSQL Transaction Isolation Levels / Concurrency Explained", lang: "en" },
    ],
    indexes: [
      { youtubeId: "r4pTomhzeok", title: "Optimisation base de données #02 : index B-Tree", lang: "fr" },
      { youtubeId: "_HG2eB27j00", title: "PostgreSQL indexes — B-Tree, GIN, BRIN. What's the difference? Easy explanation", lang: "en" },
      { youtubeId: "3o1l9tGuIHQ", title: "How to create a GIN Index? — Deep Dive Into PostgreSQL Indexes", lang: "en" },
    ],
    explain: [
      { youtubeId: "Mll5SqR4RYk", title: "Understand PostgreSQL query plan in 10 minutes", lang: "en" },
      { youtubeId: "GmX8tjT7UcQ", title: "Understanding EXPLAIN and EXPLAIN ANALYZE in PostgreSQL", lang: "en" },
      { youtubeId: "whHvqayU38c", title: "Sequential vs Index Scan — PostgreSQL Performance Tuning", lang: "en" },
    ],
    normalization: [
      { youtubeId: "mAMOWvbxMkE", title: "Normalisation des bases de données relationnelles — Introduction", lang: "fr" },
      { youtubeId: "j1fB8RKAZJc", title: "Normalisation : première forme normale (1FN)", lang: "fr" },
      { youtubeId: "nzD-cXS3bcM", title: "Normalisation : deuxième forme normale (2FN)", lang: "fr" },
      { youtubeId: "ThuKCep7hwE", title: "Normalisation : troisième forme normale (3FN)", lang: "fr" },
    ],
    "pg-driver": [
      { youtubeId: "gMyLp2KyAhU", title: "NodeJS — Connect to Postgres (Pool, paramètres, Query, refactor)", lang: "en" },
      { youtubeId: "tS264hwZn0Y", title: "node-postgres Connection Pool", lang: "en" },
      { youtubeId: "Azo9tDUtC9s", title: "SQL Injection Explained by Example with Express and PostgreSQL", lang: "en" },
    ],
    jsonb: [
      { youtubeId: "nxeUiRz4G-M", title: "How to store and query JSON data in Postgres (JSONB)", lang: "en" },
      { youtubeId: "aYqZXa2byrI", title: "JSONB Tricks: Operators, Indexes, And When To (NOT) Use It", lang: "en" },
      { youtubeId: "EwFjETYge9I", title: "Faster queries with GIN index on JSONB columns in Postgres", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M19 — Drizzle ORM
  // -----------------------------------------------------------
  "m19-drizzle-orm": {
    "orm-concept": [
      { youtubeId: "3PbaEP7fpsM", title: "Qu'est-ce qu'un ORM ?", lang: "fr" },
      { youtubeId: "DXk73GfyV9I", title: "Prisma, Doctrine : Pourquoi utiliser un ORM ?", lang: "fr" },
      { youtubeId: "i_mAHOhpBSA", title: "Drizzle ORM in 100 Seconds", channel: "Fireship", lang: "en" },
      { youtubeId: "hIYNOiZXQ7Y", title: "Learn Drizzle ORM in 13 mins (crash course)", lang: "en" },
    ],
    "drizzle-vs-prisma": [
      { youtubeId: "dFmFBgroZa4", title: "Drizzle vs Prisma : Quel ORM TypeScript choisir ?", lang: "fr" },
      { youtubeId: "Fceni6cdYOk", title: "Drizzle vs Prisma: Which ORM is right for YOU?", lang: "en" },
      { youtubeId: "cTu9-C2rd-0", title: "Is Drizzle Really Better Than Prisma?", lang: "en" },
    ],
    "setup-drizzle": [
      { youtubeId: "mMv7nTf0qaw", title: "Drizzle ORM : comment l'installer et démarrer proprement", channel: "Mike Codeur", lang: "fr" },
      { youtubeId: "a1DPO7siG4s", title: "Drizzle ORM Tutorial - Project Setup (Part 1)", lang: "en" },
      { youtubeId: "7-NZ0MlPpJA", title: "Learn Drizzle In 60 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "schema-ts": [
      { youtubeId: "fDjZOZ1Hgf8", title: "Drizzle ORM #1 - Setup, Schema, Migrations", lang: "en" },
      { youtubeId: "ZYe-5wbLP4s", title: "Drizzle ORM Course Part 2 - Schema And Push Command", lang: "en" },
      { youtubeId: "vLze97zZKsU", title: "Complex Schema Design with Drizzle ORM | Common Patterns", lang: "en" },
    ],
    "query-builder": [
      { youtubeId: "UHx6-p_Touc", title: "Drizzle ORM Tutorial - Queries, Mutations, Joins [Crash Course 2024]", lang: "en" },
      { youtubeId: "R4ZgTB-1wEg", title: "Drizzle ORM #4 - All Query Filters", lang: "en" },
      { youtubeId: "vyU5mJGCJMw", title: "Drizzle ORM Tutorial - Full Course for Beginners", lang: "en" },
    ],
    "drizzle-joins": [
      { youtubeId: "HR8v8Y1UOnQ", title: "Drizzle ORM Complex Queries (Joins)", lang: "en" },
      { youtubeId: "uUryANJtv5c", title: "How to join tables and build a complex query using Drizzle ORM", lang: "en" },
    ],
    relations: [
      { youtubeId: "M79FrQdglUo", title: "Drizzle ORM #5 - One To One Relation", lang: "en" },
      { youtubeId: "PmCHk-ADJq8", title: "Drizzle ORM #6 - One To Many Relation", lang: "en" },
      { youtubeId: "QdKdvb6iIXs", title: "Drizzle ORM #7 - Many-To-Many Relations", lang: "en" },
    ],
    "relational-queries": [
      { youtubeId: "KqI1fkzIuQI", title: "Drizzle ORM Course Part 5 - Relational Queries", lang: "en" },
      { youtubeId: "szh7jdCwZW0", title: "Drizzle relations are amazing // Stop using manual joins", lang: "en" },
      { youtubeId: "N4-VDia4NcI", title: "Drizzle's new relational API is nuts!", lang: "en" },
    ],
    "transactions-drizzle": [
      { youtubeId: "fTQ4b61T28A", title: "Database Transactions: Safest Way to Insert Using Drizzle ORM", lang: "en" },
      { youtubeId: "A2a3jznxvUs", title: "Drizzle ORM Full Course (transactions)", lang: "en" },
    ],
    "drizzle-kit": [
      { youtubeId: "dHTGEQnogPw", title: "How database migrations work when using Drizzle ORM", lang: "en" },
      { youtubeId: "lmTlR0R8MQU", title: "Drizzle ORM Tutorial #6 - Schema Migrations with Drizzle", lang: "en" },
      { youtubeId: "wNygB8DhR3k", title: "Drizzle ORM Course Part 4 - SQL-like And Drizzle Studio", lang: "en" },
    ],
    "repo-pattern": [
      { youtubeId: "ff62ijMbSLI", title: "Build Scalable Node.js Apps: Mastering the Repository Pattern with TypeScript", lang: "en" },
      { youtubeId: "XU0w62XQjpA", title: "Service Repository Pattern in TypeScript (Build Cleaner Backends!)", lang: "en" },
    ],
    prepared: [
      { youtubeId: "O9zxsSl9zgE", title: "This Drizzle ORM feature is a game changer! (prepared statements)", lang: "en" },
    ],
    "drizzle-zod": [
      { youtubeId: "bg6KyucKd88", title: "Next.js with React-Hook-Form, Drizzle-Zod & ShadCN/ui", lang: "en" },
      { youtubeId: "1hafPV81jk4", title: "Zod Tutorial: The Ultimate Validation", lang: "en" },
    ],
    "logger-sql": [
      { youtubeId: "mJrrJEIQxOQ", title: "The N+1 Query Problem with ORM, explained", lang: "en" },
      { youtubeId: "wNygB8DhR3k", title: "Drizzle ORM Course Part 4 - SQL-like And Drizzle Studio", lang: "en" },
    ],
    "prisma-readonly": [
      { youtubeId: "0My0On3lvTc", title: "Tuto / Cours sur Prisma : L'ORM parfait pour tes applications", lang: "fr" },
      { youtubeId: "akP9E1vURBU", title: "Apprendre à utiliser Prisma avec Next.js", lang: "fr" },
      { youtubeId: "RebA5J-rlwg", title: "Learn Prisma In 60 Minutes", channel: "Web Dev Simplified", lang: "en" },
    ],
    "advanced-patterns": [
      { youtubeId: "yodr3CGaSos", title: "SQL Optimistic vs Pessimistic Locking", lang: "en" },
      { youtubeId: "3wdCi9E7EmY", title: "Mastering Data Integrity with Audit Trails and Soft Deletes", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M20 — Sécurité OWASP + Auth
  // -----------------------------------------------------------
  "m20-securite-auth": {
    "owasp-top10": [
      { youtubeId: "xe9LN2w7hfE", title: "OWASP Top 10 2021 : les 10 vulnérabilités web les plus critiques (exemples inclus)", lang: "fr" },
      { youtubeId: "Q5KB2KrNzlA", title: "Failles de sécurité expliquées - TOP 10 OWASP", lang: "fr" },
      { youtubeId: "jvHibPtVglw", title: "Top 10 OWASP 2023", lang: "fr" },
      { youtubeId: "hryt-rCLJUA", title: "OWASP Top 10 2021 - The List and How You Should Use It", lang: "en" },
    ],
    "auth-vs-authz": [
      { youtubeId: "UmKZ2ajPhKI", title: "Cybersécurité : Authentification vs Autorisation", lang: "fr" },
      { youtubeId: "oUz60SCrk9k", title: "Les concepts avancés d'authentification et d'autorisation expliqués simplement (Julien Topçu)", lang: "fr" },
      { youtubeId: "I48cIcCdII8", title: "Authentication vs Authorization explained", lang: "en" },
    ],
    "hash-passwords": [
      { youtubeId: "Kb4mAd9Kizc", title: "Comment les sites web sécurisent les mots de passe ? Hashage et salage expliqués", lang: "fr" },
      { youtubeId: "_XxrfGrdrB8", title: "Comment sécuriser des mots de passe avec Bcrypt ? (Node.js)", lang: "fr" },
      { youtubeId: "W56slyAbTo4", title: "Crypter son mot de passe en PHP avec Argon2id", lang: "fr" },
      { youtubeId: "8ZtInClXe1Q", title: "Password Hashing, Salts, Peppers | Explained!", lang: "en" },
    ],
    jwt: [
      { youtubeId: "5qNfPBcogCs", title: "C'est quoi un JWT ?", lang: "fr" },
      { youtubeId: "S-xBAo47W58", title: "Tutoriel : Découverte du JWT", channel: "Grafikart", lang: "fr" },
      { youtubeId: "V27fNfRNHkg", title: "Introduction au JWT (Json Web Token) : principe de fonctionnement", lang: "fr" },
      { youtubeId: "AmIo8UVQ2vI", title: "Les JWT et les bases de l'authentification avec Express", lang: "fr" },
    ],
    "token-storage": [
      { youtubeId: "vNxfPctMFf4", title: "Local Storage vs Http Only Cookies", lang: "en" },
      { youtubeId: "vq861XoZI9k", title: "Does Storing JWTs In HTTP Only Cookies Stop XSS Attacks?", lang: "en" },
      { youtubeId: "M6N7gEZ-IUQ", title: "Why LocalStorage is Vulnerable to XSS (and cookies are too)", lang: "en" },
    ],
    "refresh-tokens": [
      { youtubeId: "Tx2jTih_jr0", title: "JWT - Ajout d'un refresh token dans un projet Symfony 5", lang: "fr" },
      { youtubeId: "_vecyDnQJeo", title: "Refresh Tokens Explained", lang: "en" },
      { youtubeId: "s-4k5TcGKHg", title: "Refresh Token Rotation and Reuse Detection in Node.js JWT Authentication", lang: "en" },
    ],
    "oauth-oidc": [
      { youtubeId: "dnqccNyklPA", title: "Qu'est-ce que OAuth2 expliqué simplement ?", lang: "fr" },
      { youtubeId: "YdShQveywpo", title: "OAuth 2.1 expliqué simplement (même si tu n'es pas dev) (Julien Topçu)", lang: "fr" },
      { youtubeId: "y9gtJYETCe8", title: "OAuth : le protocole d'autorisation indispensable", lang: "fr" },
      { youtubeId: "996OiexHze0", title: "OAuth 2.0 Explained", lang: "en" },
    ],
    csp: [
      { youtubeId: "v4ODdfBujvM", title: "Tutoriel HTML/CSS/JS - Introduction aux CSP", lang: "fr" },
      { youtubeId: "uMsj7X3KQV0", title: "Protéger votre application avec l'en-tête Content Security Policy (L. Brunet)", lang: "fr" },
      { youtubeId: "-LjPRzFR5f0", title: "Content Security Policy Explained", lang: "en" },
    ],
    "headers-security": [
      { youtubeId: "XBuabJP7Jc4", title: "HTTPS vs HSTS", lang: "fr" },
      { youtubeId: "hNlPFCLcOZ4", title: "La sécurité avec les headers HTTP : tour d'horizon des attaques et défenses (Mathieu Humbert)", lang: "fr" },
      { youtubeId: "4bQeGUzHpOE", title: "HTTP Secure Headers for Web App Security | CORS, CSP, HSTS and more", lang: "en" },
    ],
    "cors-strict": [
      { youtubeId: "irpWV4effNE", title: "Comprendre le CORS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "seLMCPVZLgw", title: "Le problème des CORS... Comment résoudre l'erreur CORS", lang: "fr" },
      { youtubeId: "tcLW5d0KAYE", title: "CORS, Preflight Request, OPTIONS Method | Access Control Allow Origin Error Explained", lang: "en" },
    ],
    csrf: [
      { youtubeId: "UxmXhnrYv8k", title: "Tout ce qu'il faut savoir sur les failles CSRF en 5 minutes", lang: "fr" },
      { youtubeId: "xsnBRYZnBUc", title: "Sécuriser ses applications web : Attaques CSRF", channel: "Grafikart", lang: "fr" },
      { youtubeId: "58y6772MHKw", title: "Tutoriel PHP : Sécurité, Les Failles CSRF", lang: "fr" },
      { youtubeId: "vRBihr41JTo", title: "Cross Site Request Forgery", channel: "Computerphile", lang: "en" },
    ],
    xss: [
      { youtubeId: "Bkg7JoBs2ac", title: "Tout savoir sur la faille XSS - la faille la plus exploitée par les pirates", lang: "fr" },
      { youtubeId: "fbw_nkSlNco", title: "Sécuriser ses applications web : Les failles XSS", channel: "Grafikart", lang: "fr" },
      { youtubeId: "E47rY21gXSY", title: "Vulnérabilité XSS (Cross-site-scripting) : explication et démo", lang: "fr" },
      { youtubeId: "L5l9lSnNMxg", title: "Cracking Websites with Cross Site Scripting", channel: "Computerphile", lang: "en" },
    ],
    "sql-injection": [
      { youtubeId: "EjCiSmWKn-c", title: "Comprendre les injections SQL", lang: "fr" },
      { youtubeId: "bHmiPghYZtA", title: "Sécuriser ses applications web : Les injections SQL", channel: "Grafikart", lang: "fr" },
      { youtubeId: "tfFwY39wd94", title: "Base de données : Requêtes préparées", channel: "Grafikart", lang: "fr" },
      { youtubeId: "ciNHn38EyRc", title: "SQL Injection", channel: "Computerphile", lang: "en" },
    ],
    "rate-limit": [
      { youtubeId: "q4AYT6-onpw", title: "Sécuriser une API - #3/6 - 1/3 Rate Limit", lang: "fr" },
      { youtubeId: "EU4uLamrCi4", title: "Sécuriser une API - #3/6 - 2/3 Rate Limit", lang: "fr" },
      { youtubeId: "X3G8gdh9GKE", title: "System Design: Rate Limiting Algorithms | API Rate Limiter", lang: "en" },
    ],
    secrets: [
      { youtubeId: "xb28A3blj_k", title: "NodeJs : Les variables d'environnement | dotenv", lang: "fr" },
      { youtubeId: "C4cfTFglgJc", title: "Apprendre Node.js #11 - Les variables d'environnement", lang: "fr" },
      { youtubeId: "M5IkdUunf8g", title: "Stop putting secrets in .env", lang: "en" },
    ],
    "https-tls": [
      { youtubeId: "k_ScPsb3WSk", title: "SSL/TLS pour les nuls", channel: "Julien Aubert", lang: "fr" },
      { youtubeId: "XBuabJP7Jc4", title: "HTTPS vs HSTS", lang: "fr" },
    ],
    "2fa": [
      { youtubeId: "KnCeZvWSZjQ", title: "1 minute pour mieux comprendre le principe de la double authentification", lang: "fr" },
      { youtubeId: "SKtc5Lrh59Y", title: "Tutoriel PHP : Authentification 2 facteurs, TOTP", lang: "fr" },
      { youtubeId: "e-1Yh8iH8jk", title: "Double authentification en PHP (Google Authenticator TOTP)", lang: "fr" },
      { youtubeId: "0mvCeNsTa1g", title: "How TOTP / Two-Factor Authentication works", lang: "en" },
    ],
    audit: [
      { youtubeId: "TQeKvw2FBqU", title: "Secure Your Code: Auto-Fix Vulnerabilities with Dependabot (GitHub Tutorial)", lang: "en" },
      { youtubeId: "QflNpG3VuGY", title: "Find Security Vulnerabilities With npm audit", lang: "en" },
      { youtubeId: "ezfFg1sdDOY", title: "Secure Your Code from Dev to Deployment with Snyk: SAST, SCA & DAST", lang: "en" },
    ],
    "logs-redact": [
      { youtubeId: "hHaOxbyqy44", title: "PII data leaks: Identifying personal information in logs with CodeQL", lang: "en" },
      { youtubeId: "Zpj8pG2APJI", title: "PII Discovery and Remediation Best Practices", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M21 — Tests
  // -----------------------------------------------------------
  "m21-tests": {
    "why-test": [
      { youtubeId: "Nxbt6j5sSu0", title: "Tests Unitaires en JavaScript (1/11) : Présentation", channel: "Grafikart", lang: "fr" },
      { youtubeId: "XrXkbnfCYzU", title: "QU'EST CE QU'UN TEST UNITAIRE ? (exemple en JavaScript)", lang: "fr" },
      { youtubeId: "u6QfIXgjwGQ", title: "Why You Should Write Tests", lang: "en" },
    ],
    pyramid: [
      { youtubeId: "lbx0WzZsSwU", title: "Pyramide de test : les 4 niveaux de test", lang: "fr" },
      { youtubeId: "5Q2PHSEvU_w", title: "Test unitaire vs test fonctionnel vs test intégration (exemple réel)", lang: "fr" },
      { youtubeId: "Fha2bVoC8SE", title: "The Testing Pyramid Explained", lang: "en" },
    ],
    tdd: [
      { youtubeId: "W5vD3PQUp3U", title: "TDD en Action : Red, Green, Refactor expliqué !", lang: "fr" },
      { youtubeId: "9VVCUhcV2gA", title: "Unit Testing (Vitest) Tutorial #7 - Test Driven Development", channel: "Net Ninja", lang: "en" },
      { youtubeId: "Jv2uxzhPFl4", title: "Test Driven Development // Fun TDD Introduction with JavaScript", lang: "en" },
    ],
    "vitest-basics": [
      { youtubeId: "AqOTGi9UVLY", title: "Tester votre code JavaScript avec Vitest", lang: "fr" },
      { youtubeId: "kqBTL_YWbuE", title: "Comment setup des tests React avec Vitest - Guide pour débutants", lang: "fr" },
      { youtubeId: "XdDZKeM5_pQ", title: "Unit Testing (Vitest) Tutorial #1 - What is Unit Testing?", channel: "Net Ninja", lang: "en" },
      { youtubeId: "9Op6lK4wnRE", title: "Unit Testing (Vitest) Tutorial #2 - Writing Your First Test", channel: "Net Ninja", lang: "en" },
    ],
    assertions: [
      { youtubeId: "qj7nPbRgXNc", title: "Unit Testing (Vitest) Tutorial #3 - Using Different Matchers", channel: "Net Ninja", lang: "en" },
      { youtubeId: "cBHwPrWTh-8", title: "Unit Testing (Vitest) Tutorial #9 - Asymmetric Matchers", channel: "Net Ninja", lang: "en" },
    ],
    mocks: [
      { youtubeId: "dF_zUg7uCpA", title: "Tests Unitaires en JavaScript (6/11) : Spy, Mock et Stubs", channel: "Grafikart", lang: "fr" },
      { youtubeId: "uX5SF94RBNI", title: "Unit Testing (Vitest) Tutorial #11 - Mock Functions", channel: "Net Ninja", lang: "en" },
      { youtubeId: "XMk1sG6ndwY", title: "Unit Testing (Vitest) Tutorial #12 - Creating Spies", channel: "Net Ninja", lang: "en" },
    ],
    "testing-library": [
      { youtubeId: "ZRw-xeaxn9c", title: "Apprendre React : Tester du code React", channel: "Grafikart", lang: "fr" },
      { youtubeId: "BCNEkTIvIhk", title: "Formation React Testing Library : tester avec la méthode render", lang: "fr" },
      { youtubeId: "JBSUgDxICg8", title: "React Testing Library Tutorial - Jest, Testing Library Basics", channel: "Net Ninja", lang: "en" },
    ],
    "tl-philosophy": [
      { youtubeId: "YIVz3j9s1z4", title: "React Testing Library Tutorial #6 - Finding elements by role (getByRole)", lang: "en" },
      { youtubeId: "Veaql3noyyo", title: "React Testing Tutorial - getByRole (tester comme un user)", lang: "en" },
    ],
    msw: [
      { youtubeId: "HewTP74I-Nk", title: "Tester une application React avec Vitest, React Testing Library et MSW", lang: "fr" },
      { youtubeId: "Vsk0nDJ12VE", title: "MSW Mock Service Worker Tutorial", lang: "en" },
    ],
    "fastify-inject": [
      { youtubeId: "ppc9xxkGDM0", title: "How to Test Fastify & Node.js Applications", lang: "en" },
      { youtubeId: "gq8ZQrBJb2M", title: "Test your Fastify REST API With Node Tap", lang: "en" },
    ],
    playwright: [
      { youtubeId: "UgF2LwlNnC8", title: "Test end to end avec Playwright", channel: "Grafikart", lang: "fr" },
      { youtubeId: "BySKT0cBdvs", title: "Apprendre Playwright : écrire votre premier script de test - étape par étape", lang: "fr" },
      { youtubeId: "7ApphAma11A", title: "Playwright Crash Course", lang: "en" },
    ],
    "playwright-traces": [
      { youtubeId: "Ov9e_F8I5zc", title: "Playwright Tutorial Crash Course (Trace Viewer)", lang: "en" },
    ],
    "db-tests": [
      { youtubeId: "8yk7g9-Zq08", title: "Fastify Layers: A Deep Dive into Test Cases (DB & repositories)", lang: "en" },
    ],
    coverage: [
      { youtubeId: "67xWmbV7Hh4", title: "Le code coverage ne sert à rien ?", lang: "fr" },
      { youtubeId: "tv59vLKLNws", title: "Tutoriel tests unitaires #17 - Introduction au code coverage (istanbul)", lang: "fr" },
    ],
    "anti-patterns": [
      { youtubeId: "ByWnpZo4u1M", title: "Let's test: Unit testing antipatterns", lang: "en" },
      { youtubeId: "ykFcQf2EAzM", title: "Testing Anti-Patterns: Workshop", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M22 — DevOps déploiement
  // -----------------------------------------------------------
  "m22-devops-deploiement": {
    "docker-why": [
      { youtubeId: "J27puPcFFQo", title: "Docker, c'est quoi ? Tuto Docker pour les nuls - Explications", channel: "cocadmin", lang: "fr" },
      { youtubeId: "SXB6KJ4u5vg", title: "Docker : débuter de zéro avec Docker en français - Tutoriel 1/3", channel: "cocadmin", lang: "fr" },
      { youtubeId: "Gjnup-PuquQ", title: "Docker in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    dockerfile: [
      { youtubeId: "cWkmqZPWwiw", title: "Apprendre Docker #2 - Créer ses propres images Docker (Dockerfile)", channel: "cocadmin", lang: "fr" },
      { youtubeId: "Ik_mC7JSJ-A", title: "Docker - 7. Dockerfile : créer une image", channel: "Xavki", lang: "fr" },
      { youtubeId: "gAkwW2tuIqE", title: "Learn Docker in 7 Easy Steps - Full Beginner's Tutorial", channel: "Fireship", lang: "en" },
    ],
    "multi-stage": [
      { youtubeId: "tkfZGbYXVWc", title: "Docker - 17. Dockerfile : multistage build d'une image", channel: "Xavki", lang: "fr" },
      { youtubeId: "8vXoMqWgbQQ", title: "Docker Multi-stage Builds Tutorial", lang: "en" },
    ],
    "docker-cli": [
      { youtubeId: "IdMp7RhFVdA", title: "Docker : manipuler les conteneurs (run, ps, exec, logs)", lang: "fr" },
      { youtubeId: "akn4f0X9wnE", title: "Docker : maîtrisez les commandes de base - Run, Stop, Logs, Exec", lang: "fr" },
    ],
    compose: [
      { youtubeId: "pMAGe6nTkws", title: "Docker-compose - 1. Introduction et premier run", channel: "Xavki", lang: "fr" },
      { youtubeId: "nZBq_UAqLOg", title: "Créez un fichier docker compose pour orchestrer vos conteneurs", channel: "Grafikart", lang: "fr" },
      { youtubeId: "DM65_JyGxCo", title: "Docker Compose Tutorial - From Zero to Hero", channel: "TechWorld with Nana", lang: "en" },
    ],
    registries: [
      { youtubeId: "FsvVKa639BM", title: "Docker : créer une image avec Dockerfile et la partager sur Docker Hub", lang: "fr" },
      { youtubeId: "RgZyX-e6W9E", title: "Push Docker Images to GitHub Container Registry (GHCR)", lang: "en" },
    ],
    "github-actions": [
      { youtubeId: "DpAgmhwgnO8", title: "Devenez un héros de GitHub Actions", lang: "fr" },
      { youtubeId: "R8_veQiYBjI", title: "GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker", channel: "TechWorld with Nana", lang: "en" },
      { youtubeId: "Xwpi0ITkL3U", title: "Complete GitHub Actions Course - From BEGINNER to PRO", lang: "en" },
    ],
    "secrets-vars": [
      { youtubeId: "Ug3Gzk5NIJc", title: "GitHub Actions - Variables & Secrets", lang: "en" },
      { youtubeId: "1mKJjQStGmg", title: "Secrets & Environment Variables in GitHub Actions | Secure DevOps Tutorial", lang: "en" },
    ],
    "ci-pipeline": [
      { youtubeId: "RoBy0ZrCWSQ", title: "Intégration Continue et Couverture de Test avec GitHub Actions et Codecov.io", channel: "Grafikart", lang: "fr" },
      { youtubeId: "YLtlz88zrLg", title: "CI/CD Tutorial using GitHub Actions - Automated Testing & Deployments", lang: "en" },
    ],
    "cd-pipeline": [
      { youtubeId: "YLtlz88zrLg", title: "CI/CD Tutorial using GitHub Actions - Automated Testing & Deployments", lang: "en" },
      { youtubeId: "ejAuHlParNs", title: "Master GitHub Actions & GHCR: Auto-Push Docker Images (Zero to Hero DevOps)", lang: "en" },
    ],
    paas: [
      { youtubeId: "EqlLy9PfWLs", title: "Déployer vos services docker sans effort avec Coolify et Dokploy", lang: "fr" },
      { youtubeId: "lLg0WLTSLXo", title: "Vercel vs Netlify vs Render (2025) - Which One Is BEST?", lang: "en" },
    ],
    "deploy-fastify": [
      { youtubeId: "Nd1GJvj271Y", title: "Hosting Node.js Apps For Free | Render And Railway Tutorial", lang: "en" },
      { youtubeId: "EqlLy9PfWLs", title: "Déployer vos services docker sans effort avec Coolify (self-host VPS)", lang: "fr" },
      { youtubeId: "1dFto3Um4y8", title: "Deploying your Node.js (with Postgres DB) Application on Railway", lang: "en" },
    ],
    "deploy-nextjs": [
      { youtubeId: "EkI-ztdZTVs", title: "Next JS de A à Z - Déployer une application Next JS avec Vercel", lang: "fr" },
      { youtubeId: "kXtWjQowvVw", title: "How To Deploy A Next.js App To Vercel (Simple)", lang: "en" },
    ],
    "migrations-ci": [
      { youtubeId: "fDjZOZ1Hgf8", title: "Drizzle ORM #1 - Setup, Schema, Migrations", lang: "en" },
      { youtubeId: "cX4PeFKCMiI", title: "Automatiser les Migrations SQL de Drizzle en Production avec les GitHub Actions", lang: "fr" },
      { youtubeId: "dHTGEQnogPw", title: "How database migrations work when using Drizzle ORM", lang: "en" },
    ],
    environments: [
      { youtubeId: "J7X1iE3LEzs", title: "Understanding Deployment Environments: Dev, Test, Staging & Production Explained", lang: "en" },
      { youtubeId: "H2p4wowlD3Q", title: "Difference Between Development, Staging, and Prod Environment?", lang: "en" },
    ],
    "healthcheck-shutdown": [
      { youtubeId: "-BpUoATetQg", title: "Live Coding - Graceful shutdown in Node.js and Fastify", lang: "en" },
      { youtubeId: "-OjPhPV6Rjs", title: "Here's how to Gracefully Shutdown your apps (with Node.js examples)", lang: "en" },
    ],
    monitoring: [
      { youtubeId: "DzhVEK65eYg", title: "Sentry 101: Error Monitoring For Backend Applications", lang: "en" },
      { youtubeId: "cl8tPBI4qUc", title: "Sentry 101: Error Monitoring For Frontend Applications", lang: "en" },
    ],
    backups: [
      { youtubeId: "MKZC4Vt4PDE", title: "PostgreSQL - 21. Sauvegardes : pg_dump", channel: "Xavki", lang: "fr" },
      { youtubeId: "l46yS2G4kkg", title: "Postgres: automated Backup and Restore with Docker and Cron", lang: "en" },
    ],
    "12factor": [
      { youtubeId: "6R4lN8fo9zA", title: "Notions - 4. Twelve Factors", channel: "Xavki", lang: "fr" },
      { youtubeId: "Iuwt_wntVrs", title: "Les 12 facteurs dans une application SaaS - Geoffroy Dubruel", lang: "fr" },
      { youtubeId: "1OhmRmMsGdQ", title: "What is 12-Factor App? | Twelve Factor App Methodology Explained", channel: "KodeKloud", lang: "en" },
    ],
  },

  // -----------------------------------------------------------
  // M23 — Three.js / R3F (3D)
  // -----------------------------------------------------------
  "m23-threejs-r3f": {
    "webgl-threejs": [
      { youtubeId: "4IvhajhllFo", title: "ThreeJS expliqué en 3 minutes (JavaScript 3D)", lang: "fr" },
      { youtubeId: "-C5Tjbxicz8", title: "WebGL tutoriel 01 - Introduction", lang: "fr" },
      { youtubeId: "Y9Mn6FtZGpA", title: "Three.js in 100 Seconds", channel: "Fireship", lang: "en" },
    ],
    "pipeline-3d": [
      { youtubeId: "763XrkxwNuw", title: "Créer des scènes 3D dans un navigateur web avec Three.js", lang: "fr" },
      { youtubeId: "vhK6o26OV4Q", title: "Tuto THREE.JS [Javascript] (scene, camera, renderer)", lang: "fr" },
    ],
    basics: [
      { youtubeId: "vhK6o26OV4Q", title: "Tuto THREE.JS [Javascript] - les bases", lang: "fr" },
      { youtubeId: "HbhQpkKNjW0", title: "Three.js Scene, Camera, Renderer Explained (Beginner #2)", lang: "en" },
      { youtubeId: "x097KglSvWc", title: "Introduction to Three.js (Part 1) - scene, camera, renderer, animation loop", lang: "en" },
    ],
    geometries: [
      { youtubeId: "oqGmiVX973Y", title: "MESH et GEOMETRY en THREE.JS", lang: "fr" },
      { youtubeId: "q5EctYACcI4", title: "Three.js Tutorial Part 3: Geometry (Beginner)", lang: "en" },
      { youtubeId: "B16IJLW_WoI", title: "Meshes - React Three Fiber Tutorial for Beginners", channel: "Wael Yasmina", lang: "en" },
    ],
    materials: [
      { youtubeId: "HsE_7C1tRTo", title: "Three.js Part 4: Materials", lang: "en" },
      { youtubeId: "6XvqaokjuYU", title: "How To Create Realistic Scenes In Three.js (Tone Mapping, HDR, sRGB)", lang: "en" },
    ],
    textures: [
      { youtubeId: "VdnN5nuxj-s", title: "Learning three.js 04 :: Textures, Normal, and Bump Maps", lang: "en" },
      { youtubeId: "0QiBkKPHX4g", title: "Generate Environment Texture from HDRI in Three.js", lang: "en" },
      { youtubeId: "sH213Lt_MPY", title: "Load HDR Image In Three.js", lang: "en" },
    ],
    lights: [
      { youtubeId: "T6PhV4Hz0u4", title: "Three.js Lighting Tutorial | Light Types Explained!", lang: "en" },
      { youtubeId: "AUF15I3sy6s", title: "Three.js Shadows Explained | Tutorial for Beginners", lang: "en" },
      { youtubeId: "7GGNzryHfTw", title: "Three.js Realistic Lighting Setup Tutorial", lang: "en" },
    ],
    transforms: [
      { youtubeId: "WKSVa0Q2W4s", title: "Geometric Transformations - React Three Fiber", channel: "Wael Yasmina", lang: "en" },
    ],
    controls: [
      { youtubeId: "LbLOXsDVyaM", title: "Tutoriel JavaScript : Panorama 360° (Three.js + contrôles caméra)", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Nxd9L6X8quo", title: "Your Guide To The Orbit Controls Module In Three.js", lang: "en" },
      { youtubeId: "yoVWWKdG2eg", title: "MASTERING Orbit Controls With React Three Fiber", lang: "en" },
    ],
    raycasting: [
      { youtubeId: "CbUhot3K-gc", title: "Three.js Raycaster Tutorial | How to Handle Mouse Input", lang: "en" },
      { youtubeId: "WPGE4OvAdIA", title: "Hover Over Objects in ThreeJS - Raycast", lang: "en" },
    ],
    particles: [
      { youtubeId: "Uh7yvnBnLj0", title: "Particules 3D connectées avec Three.js", channel: "Grafikart", lang: "fr" },
      { youtubeId: "Zpo4xcDHAL4", title: "Tutoriel JavaScript : Particules 3D Three.js", channel: "Grafikart", lang: "fr" },
      { youtubeId: "gGVZt8rLZjY", title: "Three.js: Particles (BufferGeometry + ShaderMaterial + Points)", lang: "en" },
    ],
    glsl: [
      { youtubeId: "r5r1BLrg8y0", title: "Du CSS aux shaders WebGL - panorama des techniques d'animation", lang: "fr" },
      { youtubeId: "EntBBM6nqQA", title: "Three.js Shaders Tutorial (1/2) | Intro to GLSL Vertex and Fragment Shaders", lang: "en" },
      { youtubeId: "oKbCaj1J6EI", title: "Three.js Shaders (GLSL) Crash Course For Absolute Beginners", lang: "en" },
    ],
    "custom-shaders": [
      { youtubeId: "vowT_8oVFmM", title: "Customize ThreeJS Materials With Shaders (uniforms, injection)", lang: "en" },
      { youtubeId: "CepFdiDe3Lw", title: "Animated wave plane in React Three Fiber - Custom shader material", lang: "en" },
      { youtubeId: "jK4uXGY07vA", title: "Create Realistic Water with Three.js - GLSL Shader Tutorial", lang: "en" },
      { youtubeId: "qZ2VpOOD9-0", title: "Three.js fully interactive shader tutorial - Perlin noise", lang: "en" },
    ],
    r3f: [
      { youtubeId: "C1gp_WNCu3Y", title: "Des sites en 3D avec Three.js et React (VOD Coding Talk)", lang: "fr" },
      { youtubeId: "vTfMjI4rVSI", title: "React Three Fiber (R3F) - The Basics", lang: "en" },
      { youtubeId: "jKy2Rm7EVOk", title: "React Three Fiber Crash Course for Beginners", channel: "Wael Yasmina", lang: "en" },
      { youtubeId: "5wRiJU2DLxM", title: "React Three Fiber useFrame is the MOST IMPORTANT hook", lang: "en" },
    ],
    drei: [
      { youtubeId: "5TkuOGN0X_Y", title: "Helpers and Gizmos - React Three Fiber (drei)", channel: "Wael Yasmina", lang: "en" },
      { youtubeId: "dsjS3eFAby0", title: "Camera Controls - React Three Fiber Tutorial for Beginners", lang: "en" },
    ],
    postprocessing: [
      { youtubeId: "zjINoWzmr_s", title: "How To Use React Three Fiber Post Processing Shaders", lang: "en" },
      { youtubeId: "ZtK70Tb9uqg", title: "Unreal Bloom Pass - Three.js Post-Processing Tutorial", lang: "en" },
    ],
    "performance-3d": [
      { youtubeId: "dc5iJVInpPY", title: "Three.js Optimization - Best Practices and Techniques", lang: "en" },
      { youtubeId: "dKg5H1OtDK8", title: "Create 100,000+ Objects With Instancing - Three.js Instanced Rendering", lang: "en" },
      { youtubeId: "IsRBxh4Jb18", title: "Better Performance With LOD (Level Of Detail) In Three.js", lang: "en" },
    ],
    "gltf-workflow": [
      { youtubeId: "J3zQd_PRJC8", title: "Loading Models and the Primitive Component - R3F", channel: "Wael Yasmina", lang: "en" },
      { youtubeId: "l0kGZKfutFc", title: "3D Models in React App: converting glb to jsx with gltfjsx", lang: "en" },
      { youtubeId: "tBSbgRRpNzI", title: "Showcase your 3D model with three.js, R3F, drei and gltfjsx", lang: "en" },
    ],
    "blender-workflow": [
      { youtubeId: "b6oOBWjQFKc", title: "How to Bake Procedural Textures into GLTF/GLB in Blender", lang: "en" },
      { youtubeId: "utLy9sDv06U", title: "Three.js | Part 4: Import Model from Blender (GLB)", lang: "en" },
    ],
    "webgpu-tsl": [
      { youtubeId: "sVz-HV2myjQ", title: "Three.js: Introduction to WebGPU and TSL", lang: "en" },
      { youtubeId: "73quCt_NQMA", title: "TSL :: An Overview Of Three.js Shading Language", lang: "en" },
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

  // -----------------------------------------------------------
  // M25 — IA appliquée (Anthropic SDK, RAG, agents)
  // -----------------------------------------------------------
  "m25-ia-appliquee": {
    "llm-concept": [
      { youtubeId: "HOyapuA9UAw", title: "Next Token Prediction expliqué : Le secret des LLM (GPT, Claude)", lang: "fr" },
      { youtubeId: "zjkBMFhNj_g", title: "[1hr Talk] Intro to Large Language Models", channel: "Andrej Karpathy", lang: "en" },
    ],
    "model-families": [
      { youtubeId: "3Pe91mA-38E", title: "Quel LLM choisir ? GPT, Claude, Gemini ou Grok", lang: "fr" },
      { youtubeId: "tcf_hcihjDo", title: "DeepSeek / ChatGPT / Mistral / Claude, quel est le meilleur ? Le test !", lang: "fr" },
    ],
    sdks: [
      { youtubeId: "0SSwzadQ9E8", title: "Claude 3 d'Anthropic - Tuto pour utiliser l'API en Python", lang: "fr" },
      { youtubeId: "VxhrGyZJPPY", title: "Anthropic Claude API with Python", lang: "en" },
      { youtubeId: "TqC1qOfiVcQ", title: "Claude Agent SDK [Full Workshop]", channel: "Anthropic", lang: "en" },
    ],
    params: [
      { youtubeId: "MkaazQttbpc", title: "The Secret Controls for your LLM: Temperature, Top-K, Top-P", lang: "en" },
      { youtubeId: "9Joy5c_-Ldk", title: "Understanding LLM Parameters: Context Window, Temperature, Max Tokens", lang: "en" },
    ],
    "prompt-eng": [
      { youtubeId: "H89bSRvuY14", title: "Formation au Prompt Engineering (français) : le guide pour ChatGPT, Google", lang: "fr" },
      { youtubeId: "ysPbXH0LpIE", title: "Prompting 101 | Code w/ Claude", channel: "Anthropic", lang: "en" },
      { youtubeId: "dOxUroR57xs", title: "Prompt Engineering Tutorial", channel: "freeCodeCamp", lang: "en" },
    ],
    "xml-prompts": [
      { youtubeId: "n6MckKY_ZCA", title: "How XML tags improve your AI responses", lang: "en" },
      { youtubeId: "TBeZmQiZR5k", title: "Structured LLM Prompting with XML", lang: "en" },
    ],
    "structured-output": [
      { youtubeId: "cVEJaWgiudU", title: "Anthropic function calling for structured LLM outputs", lang: "en" },
      { youtubeId: "7r9DpUXj0JQ", title: "Instructor - Structured LLM Outputs (Hands-on Demo)", lang: "en" },
      { youtubeId: "PkQIREapb9o", title: "Pydantic Crash Course - Build Reliable Python & AI Applications", lang: "en" },
    ],
    embeddings: [
      { youtubeId: "8jgad3Vsf2k", title: "RAG et LLM : Comprendre les Embeddings et la Recherche Sémantique", channel: "Louis-François Bouchard", lang: "fr" },
      { youtubeId: "Q4ZMoV2XGjA", title: "RAG avec Python : Générer ses premiers Embeddings avec OpenAI", lang: "fr" },
      { youtubeId: "c6f6wcmm3fY", title: "Embeddings and Cosine Similarity", lang: "en" },
    ],
    "vector-db": [
      { youtubeId: "R6_4Bqm4bvc", title: "PostgreSQL, base de données vectorielle avec pgvector", lang: "fr" },
      { youtubeId: "klTvEwg3oJ4", title: "Vector Databases simply explained", lang: "en" },
      { youtubeId: "mke1V-2__D0", title: "pgvector vs Pinecone vs Redis - how to choose a vector database?", lang: "en" },
    ],
    rag: [
      { youtubeId: "ijX1cEdUf5U", title: "Qu'est-ce qu'un RAG (Retrieval-Augmented Generation) ?", lang: "fr" },
      { youtubeId: "_l6wAvZYJ6U", title: "Méthodes Avancées de Recherche RAG (Hybride, Embedding, Filtrage)", lang: "fr" },
      { youtubeId: "T-D1OfcDW1M", title: "What is Retrieval-Augmented Generation (RAG)?", channel: "IBM Technology", lang: "en" },
      { youtubeId: "sVcwVQRHIc8", title: "Learn RAG From Scratch – Python AI Tutorial (LangChain Engineer)", channel: "freeCodeCamp", lang: "en" },
    ],
    chunking: [
      { youtubeId: "Lk6D1huUK0s", title: "Why Your RAG Gives Wrong Answers (4 Chunking Strategies to Fix It)", lang: "en" },
      { youtubeId: "GYj4Ay7SdWw", title: "Text Chunking in RAG: Essential Guide with Anton from ChromaDB", lang: "en" },
    ],
    rerank: [
      { youtubeId: "Uh9bYiVrW_s", title: "RAG But Better: Rerankers with Cohere AI", lang: "en" },
      { youtubeId: "ZFbaA9eM0uo", title: "Advanced RAG: Reranking with Cross Encoders and Cohere API", lang: "en" },
    ],
    "agents-react": [
      { youtubeId: "ASFVBKuarls", title: "Comment fonctionnent réellement les agents d'IA : ReAct vs Plan-and-Execute", lang: "fr" },
      { youtubeId: "f8whjxDBcd8", title: "Building a ReAct AI Agent (Tutorial)", lang: "en" },
      { youtubeId: "5hnt-bWeeOM", title: "Build a ReAct AI Agent from Scratch in Python (No LangChain)", lang: "en" },
    ],
    mcp: [
      { youtubeId: "sfCBCyNyw7U", title: "The simplest MCP demo: what is Model Context Protocol (Claude / Anthropic)", lang: "en" },
      { youtubeId: "kQmXtrmQ5Zg", title: "Building Agents with Model Context Protocol - Full Workshop (Anthropic)", channel: "Anthropic", lang: "en" },
      { youtubeId: "N3vHJcHBS-w", title: "Model Context Protocol (MCP) Explained in 20 Minutes", lang: "en" },
    ],
    frameworks: [
      { youtubeId: "uJJ6uP5IViA", title: "Découvrez LangChain - la librairie open source pour applications LLM", lang: "fr" },
      { youtubeId: "cUfLrn3TM3M", title: "LangGraph Explained for Beginners", lang: "en" },
      { youtubeId: "I90xJlzAUW0", title: "CrewAI Tutorial: Multiple Agents Working Together in Python", lang: "en" },
    ],
    evaluation: [
      { youtubeId: "vAK0iqA6-QI", title: "RAG Tutorial: Complete Introduction to Retrieval Augmented Generation", lang: "en" },
      { youtubeId: "Rpg9TQtqqhE", title: "AI Structured Outputs & Evaluation with LlamaIndex & Pydantic", lang: "en" },
    ],
    "prod-strategies": [
      { youtubeId: "twXxb00w1_4", title: "Build a Streaming LLM API with FastAPI in Python (Real Time Responses)", lang: "en" },
      { youtubeId: "uIuY1GCckXM", title: "What you NEED to know about LLM rate limits", lang: "en" },
      { youtubeId: "4x4nM0uPmg0", title: "How I cut token costs by 90%: AI cost optimization guide", lang: "en" },
    ],
    "prompt-injection": [
      { youtubeId: "VdAPyfyR2Jw", title: "Prompt Injection Defense — A Four-Layer Security Strategy for LLMs", lang: "en" },
    ],
    "prompt-caching": [
      { youtubeId: "_0uiiJfsBPI", title: "How and When to Use Anthropic's Prompt Caching (with code examples)", lang: "en" },
      { youtubeId: "D8LqbR0mJ4M", title: "Use Claude Prompt Caching to reduce your AI cost up to 90%", lang: "en" },
    ],
    "vercel-ai-sdk": [
      { youtubeId: "_tBTfvQr38M", title: "Build a Real-Time Chatbot with Next.js 15, Vercel AI SDK, and Shadcn UI", lang: "en" },
      { youtubeId: "RRK3JJrzi_w", title: "Build AI Chatbot in minutes: Vercel AI SDK + Next.js Tutorial", lang: "en" },
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
