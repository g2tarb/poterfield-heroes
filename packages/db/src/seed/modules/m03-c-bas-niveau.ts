import type {
  NewModule,
  NewSkill,
  NewVideo,
  NewExercise,
} from "../../schema/content";

/**
 * M03 — C & bas niveau (mémoire, pointeurs, systèmes).
 *
 * Particularités :
 * - moduleNumber: 3, phase: 3 — chaîné après M02 (terminal & shell).
 * - prereqModuleId: "m02-terminal-shell" → tu dois savoir piloter un terminal,
 *   compiler en ligne de commande et lire un manuel avant d'attaquer.
 * - 16 skills cette livraison (~120h sur ~10 semaines). Orientation
 *   offensive-security / systèmes : le C est l'endroit où tu VOIS la mémoire,
 *   donc l'endroit où tu comprends comment on la corrompt et comment on la
 *   protège. C'est aussi la prep directe à la piscine 42.
 *
 * Orientation sécu (cadrée DÉFENSIF/pédagogique) :
 * - Les skills d'exploitation (buffer overflow, use-after-free, format string,
 *   integer overflow) sont enseignés pour COMPRENDRE la corruption mémoire,
 *   savoir l'éviter dans ton propre code, et lire un rapport CVE sans
 *   paniquer. Labs en VM/conteneur jetable, jamais sur du code tiers en prod.
 *
 * Sandbox : la compilation C se fait en LOCAL avec ton gcc/clang (sandbox
 * "external" pour les exos code). Les quiz tournent en navigateur ("browser").
 * Compiler Explorer (godbolt.org) sert à voir l'assembleur sans rien installer.
 */
export const M03_ID = "m03-c-bas-niveau";

export const m03Module: NewModule = {
  id: M03_ID,
  moduleNumber: 3,
  phase: 3,
  title: "C & bas niveau (mémoire, pointeurs, systèmes)",
  subtitle:
    "Le langage où tu vois la mémoire à nu. Pointeurs, heap/stack, compilation, debugging — et la base de toute la sécu offensive.",
  pourquoi: `Tu as appris à faire fonctionner du code haut niveau. Maintenant tu vas descendre **sous** le code, là où il n'y a plus de garde-fou.

Le C, c'est le langage qui ne te ment pas. Pas de garbage collector qui ramasse derrière toi, pas de \`undefined\` poli quand tu lis hors limites : tu lis hors limites, tu lis la mémoire du voisin, point. Cette brutalité est exactement ce qui en fait **l'outil pédagogique le plus puissant pour comprendre une machine**. Quand tu auras tracé un \`malloc\` à la main, dessiné la pile pendant un appel récursif et regardé un \`free\` deux fois exploser sous gdb, tu ne coderas plus jamais comme avant — même en JS.

**Pourquoi le C est la clé de la sécu :**
La quasi-totalité des classes de vulnérabilités historiques (buffer overflow, use-after-free, format string, integer overflow, double free) **n'existent que parce que le C te donne le pointeur brut**. Apprendre à exploiter ces bugs dans un lab volontairement vulnérable, c'est apprendre à les voir venir dans ton propre code. Lis un avis CVE de \`glibc\`, d'\`OpenSSL\` ou du noyau Linux : c'est écrit en C, et 70% du temps c'est une corruption mémoire. Si tu ne lis pas le C, la moitié de l'écosystème sécurité te restera opaque.

**Cadre éthique, non négociable :** tout ce que tu vas faire ici se passe dans une VM ou un conteneur jetable, sur du code que TU as compilé pour le casser. On apprend l'attaque pour comprendre la défense. Jamais sur un système qui n'est pas le tien.

**Pourquoi maintenant (prep 42) :** la piscine 42 est en C pur. Pointeurs, gestion mémoire manuelle, Makefile, norme stricte, pas de fonctions interdites. Ce module te met le pied à l'étrier : à la fin, tu écris du C qui passe valgrind sans une fuite et compile sous \`-Wall -Wextra -Werror\`.

**Format** : 16 skills cette livraison (~120h sur ~10 semaines). gcc/clang + make + gdb + valgrind + AddressSanitizer + Compiler Explorer. Crayon-papier obligatoire pour dessiner la pile et le tas.`,
  objectives: [
    "Décrire les 4 étapes de la chaîne de compilation (préprocesseur, compilation, assemblage, édition de liens) et les inspecter avec gcc -E/-S/-c",
    "Lire un peu d'assembleur x86-64 généré par gcc sur Compiler Explorer",
    "Expliquer le modèle mémoire d'un programme : text, data, bss, heap, stack",
    "Manipuler des pointeurs : déclaration, déréférencement, &, *, pointeur de pointeur",
    "Maîtriser l'arithmétique de pointeurs et l'équivalence tableau/pointeur",
    "Manipuler des chaînes C en sécurité (terminaison nul, strlen, débordement)",
    "Définir et utiliser struct, union, enum, et comprendre le padding/alignement",
    "Gérer la mémoire dynamique : malloc / calloc / realloc / free sans fuite ni double free",
    "Distinguer pile et tas, comprendre la durée de vie et le scope des variables",
    "Utiliser des pointeurs de fonction (callbacks, tables de dispatch)",
    "Écrire un Makefile correct avec compilation incrémentale et headers/include guards",
    "Identifier les principaux Undefined Behavior et pourquoi le compilo en profite",
    "Débugger avec gdb (breakpoints, backtrace, examine memory) et traquer fuites/corruptions avec valgrind + AddressSanitizer",
    "Manipuler les bits : masques, shifts, flags, opérateurs bitwise",
    "Écrire un client/serveur TCP basique avec les sockets BSD en C",
    "Comprendre (pour s'en défendre) buffer overflow de pile, use-after-free/double-free, format string et integer overflow",
  ],
  prerequisites:
    "M02 (terminal & shell) validé : tu sais te déplacer en ligne de commande, lire un man, lancer un binaire et chaîner des commandes. Un éditeur que tu maîtrises. gcc ou clang installé (`gcc --version`). valgrind dispo (Linux ; sur macOS, utilise AddressSanitizer via clang). Crayon + papier pour dessiner pile/tas.",
  estimatedHours: 120,
  estimatedWeeks: 10,
  stackAllowed: [
    "gcc / clang (compilation locale)",
    "make (Makefile)",
    "gdb (debugger)",
    "valgrind (détection fuites & corruptions, Linux)",
    "AddressSanitizer (-fsanitize=address, gcc/clang)",
    "Compiler Explorer / godbolt.org (inspection assembleur)",
    "VM ou conteneur jetable pour les labs sécu",
  ],
  prereqModuleId: "m02-terminal-shell",
  unlockSrsMatureRatio: 80,
};

export const m03Skills: NewSkill[] = [
  {
    moduleId: M03_ID,
    slug: "compilation-pipeline",
    label: "La chaîne de compilation, étape par étape",
    description:
      "Du .c au binaire : préprocesseur (gcc -E) → compilation en assembleur (gcc -S) → assemblage en .o (gcc -c) → édition de liens. Pourquoi 'undefined reference' n'est PAS une erreur de compilation mais de linker.",
    displayOrder: 1,
    weight: 2,
    prereqSkillSlugs: [],
  },
  {
    moduleId: M03_ID,
    slug: "memory-model-types",
    label: "Modèle mémoire & types primitifs",
    description:
      "Segments text/data/bss/heap/stack. Taille réelle des types (sizeof), int/long/char/float, signé vs non signé, endianness. Pourquoi un int fait 4 octets et pourquoi ça compte. Lire l'octet brut.",
    displayOrder: 2,
    weight: 3,
    prereqSkillSlugs: ["compilation-pipeline"],
  },
  {
    moduleId: M03_ID,
    slug: "pointers-fundamentals",
    label: "Pointeurs : l'adresse, pas la valeur",
    description:
      "Une variable = une boîte avec une adresse. Un pointeur = une boîte qui contient une adresse. &, *, NULL, pointeur de pointeur. La métaphore du casier et du numéro de casier. Le segfault expliqué.",
    displayOrder: 3,
    weight: 3,
    prereqSkillSlugs: ["memory-model-types"],
  },
  {
    moduleId: M03_ID,
    slug: "pointer-arithmetic-arrays",
    label: "Arithmétique de pointeurs & tableaux",
    description:
      "p+1 avance de sizeof(*p) octets, pas de 1. Équivalence tableau/pointeur : arr[i] == *(arr + i). Pourquoi un tableau n'est PAS un pointeur (sizeof, &arr). Out-of-bounds = lecture du voisin.",
    displayOrder: 4,
    weight: 3,
    prereqSkillSlugs: ["pointers-fundamentals"],
  },
  {
    moduleId: M03_ID,
    slug: "c-strings",
    label: "Chaînes C : char* et le terminateur nul",
    description:
      "Une chaîne C = tableau de char terminé par '\\0'. strlen ne compte pas le nul, mais il occupe un octet. strcpy/strcat sans borne = la porte ouverte aux débordements. strncpy et ses pièges. Pourquoi 'buffer[len]' = '\\0'.",
    displayOrder: 5,
    weight: 3,
    prereqSkillSlugs: ["pointer-arithmetic-arrays"],
  },
  {
    moduleId: M03_ID,
    slug: "structs-unions-enums",
    label: "struct, union, enum & alignement",
    description:
      "Regrouper des données : struct. Partager la même mémoire : union (et pourquoi c'est dangereux/utile). enum pour les états. Padding et alignement : pourquoi sizeof(struct) > somme des champs. Accès via -> sur pointeur.",
    displayOrder: 6,
    weight: 2,
    prereqSkillSlugs: ["memory-model-types", "pointers-fundamentals"],
  },
  {
    moduleId: M03_ID,
    slug: "stack-vs-heap",
    label: "Pile vs tas : où vivent tes données",
    description:
      "La pile : automatique, rapide, LIFO, scope de fonction, détruite au return. Le tas : manuel, durable, alloué par malloc. Pourquoi 'return un pointeur vers une variable locale' = bug. Stack frame et adresse de retour.",
    displayOrder: 7,
    weight: 3,
    prereqSkillSlugs: ["pointers-fundamentals", "memory-model-types"],
  },
  {
    moduleId: M03_ID,
    slug: "dynamic-allocation",
    label: "Allocation dynamique : malloc / free / realloc",
    description:
      "malloc réserve sur le tas et rend un pointeur (ou NULL — vérifie toujours !). calloc = malloc + zéro. realloc redimensionne (et peut déplacer). free rend la mémoire. La règle d'or : 1 malloc = 1 free. Fuites et ownership.",
    displayOrder: 8,
    weight: 3,
    prereqSkillSlugs: ["stack-vs-heap", "c-strings"],
  },
  {
    moduleId: M03_ID,
    slug: "function-pointers",
    label: "Pointeurs de fonction & callbacks",
    description:
      "Une fonction a une adresse. int (*fp)(int, int) = pointeur vers fonction. Callbacks (qsort comparator), tables de dispatch (remplacer un switch géant), plugin pattern en C. Lien direct avec le détournement de flux d'exécution.",
    displayOrder: 9,
    weight: 2,
    prereqSkillSlugs: ["pointers-fundamentals"],
  },
  {
    moduleId: M03_ID,
    slug: "makefile-headers",
    label: "Makefile, headers & compilation modulaire",
    description:
      "Découper en .c/.h. Include guards (#ifndef) ou #pragma once. Déclaration vs définition. Makefile : cibles, dépendances, variables (CC, CFLAGS), compilation incrémentale. -Wall -Wextra -Werror : le compilo comme premier reviewer.",
    displayOrder: 10,
    weight: 2,
    prereqSkillSlugs: ["compilation-pipeline", "structs-unions-enums"],
  },
  {
    moduleId: M03_ID,
    slug: "undefined-behavior",
    label: "Undefined Behavior : le piège invisible",
    description:
      "Lecture non initialisée, débordement signé, déréférencement NULL, accès après free, ordre d'évaluation. Le compilo SUPPOSE qu'aucun UB n'arrive et optimise en conséquence : ton 'ça marche en debug' explose en -O2. Pourquoi 'ça compile' ≠ 'c'est correct'.",
    displayOrder: 11,
    weight: 3,
    prereqSkillSlugs: ["dynamic-allocation", "pointer-arithmetic-arrays"],
  },
  {
    moduleId: M03_ID,
    slug: "debugging-gdb-valgrind",
    label: "Débugger : gdb + valgrind + AddressSanitizer",
    description:
      "gdb : breakpoint, run, backtrace, print, x (examine memory), step/next. valgrind : fuites, lectures non initialisées, accès invalides. ASan (-fsanitize=address) : plus rapide, montre l'overflow exact. Le triptyque qui te fait gagner des heures.",
    displayOrder: 12,
    weight: 3,
    prereqSkillSlugs: ["dynamic-allocation", "undefined-behavior"],
  },
  {
    moduleId: M03_ID,
    slug: "bit-manipulation",
    label: "Manipulation de bits & masques",
    description:
      "&, |, ^, ~, <<, >>. Lire/poser/effacer un bit (masques). Flags compactés dans un int. Pourquoi x & (x-1) efface le bit le plus bas. Astuce : multiplier/diviser par 2 = shift. Base de la crypto, des protocoles binaires et des optimisations.",
    displayOrder: 13,
    weight: 2,
    prereqSkillSlugs: ["memory-model-types"],
  },
  {
    moduleId: M03_ID,
    slug: "integer-overflow",
    label: "Integer overflow : quand un nombre déborde",
    description:
      "SÉCU. Un unsigned int qui passe de 0 à 4 milliards en faisant -1. Un signed qui wrap = UB. La classe de bug derrière 'malloc(n * size)' qui alloue 4 octets au lieu de 4 Go. Vérifier AVANT de calculer. Détecter avec -ftrapv / __builtin_mul_overflow.",
    displayOrder: 14,
    weight: 2,
    prereqSkillSlugs: ["bit-manipulation", "dynamic-allocation"],
  },
  {
    moduleId: M03_ID,
    slug: "buffer-overflow-stack",
    label: "Buffer overflow de pile (compris pour s'en défendre)",
    description:
      "SÉCU. Écrire au-delà d'un buffer local écrase la pile : variables voisines, puis l'adresse de retour sauvegardée. Comprendre le stack frame, écraser saved RIP, voir comment gets()/strcpy() tuent. Défenses : stack canaries, NX, ASLR, PIE. Lab en VM, compilé -fno-stack-protector pour observer.",
    displayOrder: 15,
    weight: 3,
    prereqSkillSlugs: ["stack-vs-heap", "c-strings", "debugging-gdb-valgrind"],
  },
  {
    moduleId: M03_ID,
    slug: "use-after-free",
    label: "Use-after-free & double-free (compris pour s'en défendre)",
    description:
      "SÉCU. free() ne met pas le pointeur à NULL : un pointeur 'dangling' pointe vers de la mémoire recyclable. Réutiliser ce pointeur (UAF) ou la libérer deux fois (double-free) corrompt le tas. Pourquoi 'free puis ptr = NULL' est un réflexe. Détecter à l'ASan.",
    displayOrder: 16,
    weight: 3,
    prereqSkillSlugs: ["dynamic-allocation", "debugging-gdb-valgrind"],
  },
  {
    moduleId: M03_ID,
    slug: "format-string",
    label: "Format string (compris pour s'en défendre)",
    description:
      "SÉCU. printf(user_input) au lieu de printf(\"%s\", user_input) : l'attaquant injecte des %x pour lire la pile et %n pour écrire en mémoire. Une ligne qui transforme un log en faille de lecture/écriture arbitraire. La règle : le format est TOUJOURS une constante.",
    displayOrder: 17,
    weight: 2,
    prereqSkillSlugs: ["c-strings", "stack-vs-heap"],
  },
  {
    moduleId: M03_ID,
    slug: "bsd-sockets-c",
    label: "Sockets BSD en C : le réseau à nu",
    description:
      "SÉCU / SYSTÈMES. socket(), bind(), listen(), accept(), connect(), send()/recv(). Un client TCP et un serveur d'écho en C pur. Lien direct avec le module Réseau et base d'un scanner de ports. Gestion d'erreur (errno) et des octets bruts.",
    displayOrder: 18,
    weight: 2,
    prereqSkillSlugs: ["dynamic-allocation", "c-strings", "bit-manipulation"],
  },
];

// La majorité des skills C pointent à 100% vers l'axis "c_lowlevel".
// Les skills d'orientation sécu (exploitation/corruption mémoire) et les
// sockets se répartissent c_lowlevel 50 / security 50.
const M03_SECURITY_SKILLS = new Set([
  "buffer-overflow-stack",
  "use-after-free",
  "format-string",
  "integer-overflow",
  "bsd-sockets-c",
]);

export const m03SkillAxisRules: Array<{
  skillSlug: string;
  axisId: string;
  contribution: number;
}> = m03Skills.flatMap((s) =>
  M03_SECURITY_SKILLS.has(s.slug)
    ? [
        { skillSlug: s.slug, axisId: "c_lowlevel", contribution: 50 },
        { skillSlug: s.slug, axisId: "security", contribution: 50 },
      ]
    : [{ skillSlug: s.slug, axisId: "c_lowlevel", contribution: 100 }],
);

// =============================================================
// VIDÉOS — module principale + curation C / systèmes / sécu
// IDs YouTube : vérifiés au mieux mais à valider d'un coup d'œil.
// Si une vidéo ne charge pas, c'est qu'elle a été dépubliée — remplace
// par une autre du même créateur ou laisse youtubeId: null avec externalUrl.
// =============================================================
export const m03Videos: NewVideo[] = [
  {
    moduleId: M03_ID,
    isPrimary: 1,
    title: "C Programming Tutorial for Beginners - Full Course",
    creator: "freeCodeCamp.org",
    youtubeId: "KJgsSFOSQv0",
    language: "en",
    durationSeconds: 3 * 60 * 60 + 46 * 60, // ~3h46
    whyThisOne:
      "Le cours de référence gratuit qui couvre toute la syntaxe C, les pointeurs et la gestion mémoire de zéro. ~3h46. Tu peux le suivre une fois en entier puis y revenir skill par skill.",
    coversSkills: [
      "compilation-pipeline",
      "memory-model-types",
      "pointers-fundamentals",
      "pointer-arithmetic-arrays",
      "c-strings",
      "structs-unions-enums",
      "dynamic-allocation",
      "stack-vs-heap",
      "function-pointers",
    ],
    displayOrder: 1,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Pointers in C / C++ — playlist (mémoire, arithmétique, double pointeurs)",
    creator: "Jacob Sorber",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=jacob+sorber+pointers+in+c",
    language: "en",
    durationSeconds: 15 * 60,
    whyThisOne:
      "Jacob Sorber explique les pointeurs, le malloc/free et les pièges mémoire en vidéos courtes et chirurgicales. Parfait quand un concept précis bloque. Vérifie l'ID de la vidéo exacte que tu choisis.",
    coversSkills: [
      "pointers-fundamentals",
      "pointer-arithmetic-arrays",
      "dynamic-allocation",
      "stack-vs-heap",
    ],
    displayOrder: 2,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "How They Hack: Buffer Overflow & GDB Analysis",
    creator: "Low Level Learning",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=low+level+learning+buffer+overflow+gdb",
    language: "en",
    durationSeconds: 14 * 60,
    whyThisOne:
      "Démo concrète d'un buffer overflow de pile analysé sous gdb, du point de vue défensif. Tu vois la pile s'écraser en vrai. Cadré 'comprendre pour se protéger'. Vérifie l'ID avant de l'épingler.",
    coversSkills: [
      "buffer-overflow-stack",
      "stack-vs-heap",
      "debugging-gdb-valgrind",
    ],
    displayOrder: 3,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Buffer Overflow Attacks Explained",
    creator: "Computerphile",
    youtubeId: "1S0aBV-Waeo",
    language: "en",
    durationSeconds: 17 * 60 + 30,
    whyThisOne:
      "Explication académique et visuelle du buffer overflow par Computerphile : pourquoi ça arrive, comment la pile est organisée, pourquoi le C le permet. La théorie propre derrière la démo.",
    coversSkills: ["buffer-overflow-stack", "c-strings", "undefined-behavior"],
    displayOrder: 4,
  },
  {
    moduleId: M03_ID,
    isPrimary: 0,
    title: "Le langage C — bases, pointeurs et mémoire (FR)",
    creator: "Recherche FR (Graven / Le Professeur / autre chaîne FR)",
    youtubeId: null,
    externalUrl:
      "https://www.youtube.com/results?search_query=cours+langage+c+pointeurs+m%C3%A9moire+fran%C3%A7ais",
    language: "fr",
    durationSeconds: 30 * 60,
    whyThisOne:
      "Source FR pour réviser pointeurs et mémoire en français quand l'anglais te ralentit. Choisis une chaîne pédagogique récente et vérifie l'ID avant de l'épingler.",
    coversSkills: [
      "pointers-fundamentals",
      "memory-model-types",
      "c-strings",
    ],
    displayOrder: 5,
  },
];

// =============================================================
// EXERCISES — quiz + exos code (compilation locale gcc) + projet
// =============================================================
export const m03Exercises: NewExercise[] = [
  {
    moduleId: M03_ID,
    kind: "quiz_activation",
    sandbox: "browser",
    language: null,
    title: "Avant de lire : tes intuitions sur la mémoire",
    statement:
      "Petit quiz pour calibrer ton intuition avant de plonger dans les pointeurs et le tas. Pas de bonne ou mauvaise réponse — c'est pour situer où tu en es.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "En JS, `let a = [1,2,3]; let b = a; b.push(4);` modifie aussi `a`. Pourquoi, à ton avis ?",
        options: [
          "C'est un bug de JS",
          "`b` et `a` pointent vers le même objet en mémoire",
          "JS copie tout le tableau à chaque assignation",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "Une variable objet contient une référence (une adresse), pas l'objet lui-même. En C tu verras ça à CRU : c'est exactement la différence entre une valeur et un pointeur.",
      },
      {
        question:
          "Tu écris un mot de 20 lettres dans une boîte prévue pour 10. Que se passe-t-il, à ton avis, dans un langage sans garde-fou comme le C ?",
        options: [
          "Le programme affiche une erreur claire et s'arrête",
          "Les 10 lettres en trop écrasent ce qui était juste à côté en mémoire",
          "Rien, le langage agrandit la boîte automatiquement",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "C'est exactement le buffer overflow : en C, écrire hors limites déborde sur la mémoire voisine. C'est la base d'une classe entière de failles que tu vas comprendre pour t'en défendre.",
      },
      {
        question:
          "Tu réserves de la mémoire pour stocker une photo, puis tu oublies de la rendre. Tu refais ça 1000 fois par seconde. À ton avis ?",
        options: [
          "Aucun problème, l'OS nettoie tout",
          "La RAM se remplit jusqu'à faire ramer puis crasher le programme (fuite mémoire)",
          "Le programme va plus vite",
          "Aucune idée",
        ],
        correctIndex: 1,
        explanation:
          "C'est la fuite mémoire (memory leak). En C il n'y a pas de garbage collector : chaque malloc doit avoir son free. valgrind sera ton meilleur ami pour les traquer.",
      },
    ],
    skillSlugs: [
      "pointers-fundamentals",
      "buffer-overflow-stack",
      "dynamic-allocation",
    ],
    passThresholdPct: 0,
    estimatedMinutes: 5,
    displayOrder: 1,
  },
  {
    moduleId: M03_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : pointeurs, mémoire et pièges du C",
    statement:
      "Quiz post-pratique sur la chaîne de compilation, les pointeurs, la mémoire dynamique, l'UB et les classes de bugs sécu. Seuil 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu compiles et tu obtiens `undefined reference to 'foo'`. À quelle étape de la chaîne ça casse ?",
        options: [
          "Préprocesseur",
          "Compilation (.c → assembleur)",
          "Édition de liens (linker)",
          "Exécution",
        ],
        correctIndex: 2,
        explanation:
          "'undefined reference' = le linker n'a pas trouvé la définition d'un symbole déclaré. Le code a compilé en .o, mais l'édition de liens échoue (oubli d'un .c ou d'une lib).",
      },
      {
        question:
          "Sur une plateforme x86-64 typique, si `int *p`, de combien d'octets `p + 1` avance-t-il l'adresse ?",
        options: ["1 octet", "4 octets", "8 octets", "Ça dépend de la valeur pointée"],
        correctIndex: 1,
        explanation:
          "L'arithmétique de pointeurs se fait en unités de `sizeof(*p)`. Pour un `int*`, sizeof(int) = 4, donc p+1 avance de 4 octets. C'est ce qui fait fonctionner `arr[i]`.",
      },
      {
        question:
          "Quelle valeur renvoie `strlen(\"abc\")` et combien d'octets occupe réellement ce littéral en mémoire ?",
        options: [
          "3 et 3 octets",
          "3 et 4 octets",
          "4 et 4 octets",
          "4 et 3 octets",
        ],
        correctIndex: 1,
        explanation:
          "strlen compte les caractères AVANT le '\\0' : 3. Mais le littéral occupe 4 octets car le terminateur nul est stocké. Oublier le +1 pour le '\\0' = débordement classique.",
      },
      {
        question:
          "Une fonction fait `int x = 42; return &x;`. Quel est le problème ?",
        options: [
          "Aucun, c'est correct",
          "x est sur la pile et détruit au return : le pointeur renvoyé est dangling",
          "Il faut un cast",
          "&x ne compile pas",
        ],
        correctIndex: 1,
        explanation:
          "x vit dans le stack frame de la fonction, détruit dès le return. Le pointeur renvoyé pointe vers de la mémoire réutilisable = use-after-return, un UB classique. Pour survivre, alloue sur le tas (malloc).",
      },
      {
        question:
          "Tu fais `free(ptr);` puis `free(ptr);` un peu plus loin. Comment ça s'appelle et pourquoi c'est grave ?",
        options: [
          "Double-free : corruption du tas, potentiellement exploitable",
          "Rien, free est idempotent",
          "Memory leak",
          "Stack overflow",
        ],
        correctIndex: 0,
        explanation:
          "Double-free corrompt les structures internes de l'allocateur. Réflexe : après free, `ptr = NULL;` (free(NULL) est sans effet). AddressSanitizer le détecte immédiatement.",
      },
      {
        question:
          "`printf(user_input);` où user_input vient d'un utilisateur. Quel est le risque ?",
        options: [
          "Aucun, printf est sûr",
          "Format string : l'attaquant injecte %x (lecture pile) et %n (écriture mémoire)",
          "Juste un affichage moche",
          "Un buffer overflow uniquement",
        ],
        correctIndex: 1,
        explanation:
          "Le premier argument de printf est interprété comme format. Des %x permettent de lire la pile, %n d'écrire en mémoire. La règle absolue : `printf(\"%s\", user_input);` — le format est TOUJOURS une constante.",
      },
      {
        question:
          "`unsigned char c = 255; c = c + 1;` vaut quoi après ?",
        options: ["256", "0", "-1", "Undefined Behavior"],
        correctIndex: 1,
        explanation:
          "L'arithmétique non signée wrap modulo 2^n. 255 + 1 sur 8 bits = 0. (À l'inverse, l'overflow d'un type SIGNÉ est, lui, un Undefined Behavior.) C'est la base de l'integer overflow.",
      },
      {
        question:
          "Quel outil te montre l'adresse exacte d'un accès hors limites et la ligne fautive, le plus rapidement ?",
        options: [
          "printf partout",
          "gdb en pas-à-pas manuel",
          "AddressSanitizer (-fsanitize=address)",
          "Le compilateur seul avec -Wall",
        ],
        correctIndex: 2,
        explanation:
          "ASan instrumente la mémoire et stoppe sur l'accès invalide en montrant l'adresse, la taille et la stack trace. valgrind fait pareil (plus lent). -Wall aide en amont mais ne voit pas tous les accès à l'exécution.",
      },
    ],
    skillSlugs: [
      "compilation-pipeline",
      "pointer-arithmetic-arrays",
      "c-strings",
      "stack-vs-heap",
      "dynamic-allocation",
      "use-after-free",
      "format-string",
      "integer-overflow",
      "debugging-gdb-valgrind",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 15,
    displayOrder: 2,
  },
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title: "strdup maison (C) — alloc, copie et terminateur nul",
    statement: `Implémente \`my_strdup\`, la version maison de \`strdup\` : elle alloue sur le tas une copie d'une chaîne C et la renvoie. C'est l'exercice qui combine pointeurs, chaînes, malloc et le réflexe du '\\0'.

**Compilation locale (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g my_strdup.c -o my_strdup
./my_strdup
\`\`\`

**Contraintes :**
- Signature exacte : \`char *my_strdup(const char *s);\`
- Allouer EXACTEMENT \`strlen(s) + 1\` octets (le +1 pour le '\\0', ne l'oublie pas)
- Recopier tous les caractères ET le terminateur nul
- Si \`malloc\` échoue, renvoyer \`NULL\` (jamais déréférencer un malloc non vérifié)
- Ne pas utiliser \`strdup\` ni \`strcpy\` — tu codes la copie à la main (boucle)
- Le \`free\` du résultat est de la responsabilité de l'appelant (déjà fait dans le main fourni)

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra -Werror\`
- 0 fuite et 0 erreur sous AddressSanitizer (ou valgrind --leak-check=full)
- La sortie correspond exactement à expectedOutput
- Tu sais expliquer pourquoi le +1 est obligatoire`,
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *my_strdup(const char *s)
{
    /* Ton implem ici.
       1) calculer la longueur
       2) malloc(len + 1) et verifier != NULL
       3) recopier caractere par caractere, '\\0' compris
       4) renvoyer le pointeur */
    (void)s;
    return NULL;
}

int main(void)
{
    char *copy = my_strdup("porterfield");
    if (copy == NULL) {
        fprintf(stderr, "allocation echouee\\n");
        return 1;
    }
    printf("%s\\n", copy);
    printf("%zu\\n", strlen(copy));
    free(copy);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *my_strdup(const char *s)
{
    size_t len = strlen(s);
    char *dst = malloc(len + 1); /* +1 pour le terminateur nul */
    if (dst == NULL)
        return NULL;
    for (size_t i = 0; i <= len; i++) /* <= pour copier aussi le '\\0' */
        dst[i] = s[i];
    return dst;
}

int main(void)
{
    char *copy = my_strdup("porterfield");
    if (copy == NULL) {
        fprintf(stderr, "allocation echouee\\n");
        return 1;
    }
    printf("%s\\n", copy);
    printf("%zu\\n", strlen(copy));
    free(copy);
    return 0;
}
`,
    expectedOutput: "porterfield\n11",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "c-strings",
      "dynamic-allocation",
      "pointers-fundamentals",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 35,
    displayOrder: 3,
  },
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title: "popcount (C) — compter les bits à 1 (manipulation de bits)",
    statement: `Implémente \`count_bits\` qui renvoie le nombre de bits à 1 dans un \`unsigned int\` (popcount). C'est l'exercice canonique de manipulation de bits, et l'occasion de découvrir l'astuce \`n & (n - 1)\`.

**Compilation locale (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -Werror -g popcount.c -o popcount
./popcount
\`\`\`

**Contraintes :**
- Signature exacte : \`int count_bits(unsigned int n);\`
- Implémente la version naïve (shift + masque \`& 1\` dans une boucle) PUIS, en seconde fonction, la version \`n &= (n - 1)\` (qui efface le bit le plus bas à chaque tour, donc boucle autant de fois qu'il y a de bits à 1)
- Aucun \`__builtin_popcount\` (tu le codes à la main)
- Pas d'UB : travaille sur du non signé

**Tests attendus (déjà dans le main) :**
\`\`\`
count_bits(0)          -> 0
count_bits(1)          -> 1
count_bits(0b1011)     -> 3   (11 en décimal)
count_bits(255)        -> 8
count_bits(0xFFFFFFFF) -> 32
\`\`\`

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra -Werror\`
- La sortie correspond exactement à expectedOutput
- Tu sais expliquer pourquoi \`n & (n - 1)\` efface le bit de poids le plus faible parmi les bits à 1`,
    starterCode: `#include <stdio.h>

int count_bits(unsigned int n)
{
    /* Ton implem ici.
       Version naive : pour chaque bit, regarde (n & 1) puis n >>= 1.
       Bonus : version n &= (n - 1) qui boucle 1 fois par bit a 1. */
    (void)n;
    return 0;
}

int main(void)
{
    printf("%d\\n", count_bits(0));
    printf("%d\\n", count_bits(1));
    printf("%d\\n", count_bits(0b1011));
    printf("%d\\n", count_bits(255));
    printf("%d\\n", count_bits(0xFFFFFFFFu));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

/* Version naive : un tour par bit (jusqu'a 32 tours). */
int count_bits(unsigned int n)
{
    int count = 0;
    while (n) {
        count += (int)(n & 1u);
        n >>= 1;
    }
    return count;
}

/* Version Kernighan : un tour par bit a 1 seulement.
   n & (n - 1) efface le bit a 1 de poids le plus faible. */
int count_bits_fast(unsigned int n)
{
    int count = 0;
    while (n) {
        n &= (n - 1u);
        count++;
    }
    return count;
}

int main(void)
{
    printf("%d\\n", count_bits(0));
    printf("%d\\n", count_bits(1));
    printf("%d\\n", count_bits(0b1011));
    printf("%d\\n", count_bits(255));
    printf("%d\\n", count_bits(0xFFFFFFFFu));
    return 0;
}
`,
    expectedOutput: "0\n1\n3\n8\n32",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: ["bit-manipulation", "memory-model-types"],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 4,
  },
  {
    moduleId: M03_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "markdown",
    title:
      "Projet de validation : scanner de ports TCP en C + lab buffer overflow contrôlé",
    statement: `**Objectif :** prouver que tu sais écrire du C systèmes propre (sockets, gestion mémoire, Makefile) ET que tu comprends une corruption mémoire de bout en bout, le tout dans un cadre 100% éthique (sur TA machine / TA VM, sur du code que TU compiles).

---

### Partie 1 — Mini scanner de ports TCP (sockets BSD, ~12-15h)

Écris en C pur un programme \`portscan\` qui, pour un hôte et une plage de ports donnés, indique lesquels sont ouverts.

**Spécifications :**
- Usage : \`./portscan <ip> <port_debut> <port_fin>\` (ex : \`./portscan 127.0.0.1 1 1024\`)
- Pour chaque port : \`socket()\`, \`connect()\` (avec timeout raisonnable), affiche "OPEN" si la connexion réussit, ignore sinon
- Gestion d'erreur propre via \`errno\` / \`perror\` (jamais de crash silencieux)
- Validation des arguments (plage valide, ports 1-65535) AVANT de boucler — pense integer overflow sur le parsing
- \`Makefile\` avec \`CC\`, \`CFLAGS = -Wall -Wextra -Werror\`, cibles \`all\`, \`clean\`, compilation incrémentale
- Découpage en \`.c\` / \`.h\` avec include guards
- 0 fuite mémoire (valgrind / AddressSanitizer)

**Cadre éthique :** scanne UNIQUEMENT \`127.0.0.1\` / ta propre VM. Scanner un hôte tiers sans autorisation est illégal. Le but est pédagogique : comprendre comment un outil comme nmap parle aux sockets.

---

### Partie 2 — Lab buffer overflow contrôlé (compris pour s'en défendre, ~6-8h)

Écris un petit programme \`vuln.c\` volontairement vulnérable (un \`char buf[16]\` rempli par \`gets()\` ou \`strcpy()\` sans borne), à n'exécuter QUE dans une VM/conteneur jetable.

1. Compile-le **avec protections** : \`gcc vuln.c -o vuln\` (canaries, NX, PIE par défaut). Donne-lui une entrée trop longue → observe le \`*** stack smashing detected ***\` et le crash.
2. Compile-le **sans protections** pour observer la pile : \`gcc -fno-stack-protector -z execstack -no-pie -g vuln.c -o vuln_nopie\`. Sous gdb, montre comment l'entrée écrase les variables voisines puis l'adresse de retour sauvegardée (backtrace corrompu).
3. **Corrige** la vulnérabilité : remplace par \`fgets(buf, sizeof(buf), stdin)\`, recompile, prouve que l'overflow ne passe plus.

---

### Livrable — \`RAPPORT.md\`

- Le code du scanner (\`portscan\`) + son \`Makefile\`
- Le \`vuln.c\` vulnérable, la version corrigée, et 2-3 captures (texte) de gdb montrant la pile avant/après débordement
- Une section "Ce que j'ai compris" : explique avec tes mots stack frame, adresse de retour, stack canary, NX, ASLR/PIE
- Une section "Défenses" : liste les bonnes pratiques C qui auraient empêché le bug (bornes, fgets/strncpy, -Wall -Wextra -Werror, ASan en CI)

**Critères de validation :**
- \`portscan\` compile sous \`-Wall -Wextra -Werror\`, détecte les ports ouverts sur localhost, 0 fuite à valgrind/ASan
- Makefile propre (clean + incrémental + include guards)
- Lab buffer overflow : tu sais expliquer ORALEMENT pourquoi le débordement écrase l'adresse de retour et comment fgets le bloque
- Tout a été fait sur ta machine / VM, jamais sur un système tiers
- \`RAPPORT.md\` complet (code + captures gdb + section compréhension + section défenses)

**Durée estimée :** 18-25h sur ~3 semaines.`,
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "bsd-sockets-c",
      "dynamic-allocation",
      "c-strings",
      "makefile-headers",
      "debugging-gdb-valgrind",
      "buffer-overflow-stack",
      "integer-overflow",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 22 * 60,
    displayOrder: 5,
  },
];
