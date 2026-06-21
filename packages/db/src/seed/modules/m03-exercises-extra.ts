import type { NewExercise } from "../../schema/content";
import { M03_ID } from "./m03-c-bas-niveau";

/**
 * M03 — Exercices SUPPLÉMENTAIRES (module C & bas niveau).
 *
 * Ce fichier COMPLÈTE m03Exercises (déjà livré dans m03-c-bas-niveau.ts) sans
 * rien dupliquer :
 * - Le fichier d'origine occupe displayOrder 1..5 (quiz_activation, 1 quiz de
 *   vérification, 2 code_exercise — my_strdup & popcount — et le projet final).
 *   Ici on commence à displayOrder 20 pour ne jamais entrer en collision.
 * - Aucun exo ne reprend my_strdup ni popcount : on couvre d'autres skills et
 *   d'autres patterns (strlen/strcpy maison, tableau via pointeurs, parsing,
 *   linked list, flags de bits).
 *
 * Contrainte plateforme : pas de sandbox C en navigateur. Donc :
 * - quiz_verification → sandbox "browser" (tourne in-app, QCM).
 * - code_exercise → sandbox "external", language "c" : tu compiles en LOCAL
 *   avec ton gcc/clang. Chaque énoncé rappelle :
 *     gcc -Wall -Wextra -fsanitize=address
 *
 * Cadre éthique : on reste sur la MAÎTRISE mémoire (défensif/pédagogique).
 * Aucun exploit offensif clé en main.
 *
 * Tous les skillSlugs ci-dessous existent dans m03Skills (m03-c-bas-niveau.ts).
 */
export const m03ExtraExercises: NewExercise[] = [
  // ===========================================================
  // QUIZ 1 — compilation, modèle mémoire, pointeurs, tableaux
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title:
      "Vérif (bonus) : compilation, mémoire, pointeurs & arithmétique de pointeurs",
    statement:
      "Deuxième passe de vérification, orientée fondations : chaîne de compilation, taille des types, modèle mémoire, pointeurs et arithmétique de pointeurs. Questions concrètes (sizeof, déréférencement, p+1, équivalence tableau/pointeur). Seuil 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "Tu lances `gcc -E main.c`. Qu'obtiens-tu en sortie ?",
        options: [
          "Le binaire exécutable final",
          "Le code source après passage du préprocesseur (#include et macros résolus)",
          "Le code assembleur x86-64",
          "Le fichier objet .o non lié",
        ],
        correctIndex: 1,
        explanation:
          "-E s'arrête après le PRÉPROCESSEUR : #include est remplacé par le contenu du header, les #define sont substitués, les #ifdef tranchés. Pas encore d'assembleur (ça, c'est -S) ni de .o (-c).",
      },
      {
        question:
          "Sur une plateforme x86-64 LP64 typique, que vaut `sizeof(char)` et `sizeof(int)` ?",
        options: [
          "1 et 2",
          "1 et 4",
          "4 et 4",
          "1 et 8",
        ],
        correctIndex: 1,
        explanation:
          "sizeof(char) vaut TOUJOURS 1 par définition (c'est l'unité). sizeof(int) vaut presque toujours 4 sur x86-64. Un pointeur, lui, fait 8 octets (64 bits d'adresse).",
      },
      {
        question:
          "Dans quel segment mémoire vit une variable globale `int compteur = 0;` ?",
        options: [
          "Sur la pile (stack)",
          "Sur le tas (heap)",
          "Dans le segment BSS (globales/statiques initialisées à zéro)",
          "Dans le segment text (le code)",
        ],
        correctIndex: 2,
        explanation:
          "Une globale initialisée à 0 (ou non initialisée) va dans le BSS, qui est mis à zéro au démarrage. Une globale initialisée à une valeur non nulle irait dans data. La pile sert aux locales, le tas à malloc, le text au code machine.",
      },
      {
        question:
          "`int x = 42; int *p = &x; *p = 99;` — que vaut `x` ensuite ?",
        options: [
          "42 (p ne touche pas x)",
          "99 (p pointe vers x, *p = 99 écrit DANS x)",
          "L'adresse de x",
          "Undefined Behavior",
        ],
        correctIndex: 1,
        explanation:
          "p contient l'ADRESSE de x. `*p` déréférence : il accède à la boîte pointée. `*p = 99` écrit donc 99 directement dans x. C'est tout l'intérêt d'un pointeur : modifier une variable à distance.",
      },
      {
        question:
          "Soit `long *p;` (sizeof(long) = 8). Si `p` vaut l'adresse 0x1000, que vaut `p + 2` ?",
        options: [
          "0x1002",
          "0x1008",
          "0x1010",
          "Ça dépend de la valeur pointée",
        ],
        correctIndex: 2,
        explanation:
          "L'arithmétique de pointeurs avance par PAS de sizeof(*p). Pour un long*, chaque +1 = +8 octets. p + 2 = 0x1000 + 2*8 = 0x1000 + 16 = 0x1010. C'est exactement ce qui fait marcher `tab[i]`.",
      },
      {
        question:
          "Pour un tableau `int arr[10];`, l'expression `arr[3]` est strictement équivalente à :",
        options: [
          "`*(arr + 3 * sizeof(int))`",
          "`*(arr + 3)`",
          "`arr + 3`",
          "`&arr[3]`",
        ],
        correctIndex: 1,
        explanation:
          "Par définition du C, `arr[i]` est du sucre pour `*(arr + i)`. Pas besoin de multiplier par sizeof à la main : l'arithmétique de pointeurs le fait pour toi (arr+3 avance de 3 int). `arr + 3` est l'adresse, `*(arr + 3)` la valeur.",
      },
    ],
    skillSlugs: [
      "compilation-pipeline",
      "memory-model-types",
      "pointers-fundamentals",
      "pointer-arithmetic-arrays",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 20,
  },

  // ===========================================================
  // QUIZ 2 — chaînes, struct/union/enum, UB, manipulation de bits
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title:
      "Vérif (bonus) : chaînes C, struct/union/enum, UB & bits",
    statement:
      "Vérification orientée structures de données bas niveau et pièges : chaînes terminées par '\\0', struct/union/enum et padding, Undefined Behavior, et opérations bit à bit (masques, shifts). Questions concrètes (résultat d'un décalage, où est l'UB, sizeof d'une union). Seuil 80%.",
    starterCode: null,
    solutionCode: null,
    expectedOutput: null,
    testsCode: null,
    quizQuestions: [
      {
        question:
          "`char buf[5] = \"hello\";` — quel est le problème ?",
        options: [
          "Aucun, ça tient pile",
          "Il manque la place du terminateur '\\0' : \"hello\" demande 6 octets, pas 5",
          "Il faut un char* à la place",
          "\"hello\" fait 4 caractères",
        ],
        correctIndex: 1,
        explanation:
          "\"hello\" = 5 caractères + le '\\0' final = 6 octets. Un buf[5] ne stocke pas le terminateur, donc strlen et tout ce qui s'appuie sur '\\0' partira en lecture hors limites. Réflexe : taille = longueur + 1.",
      },
      {
        question:
          "Tu copies une chaîne avec `strcpy(dst, src)` où dst est plus petit que src. Que se passe-t-il ?",
        options: [
          "strcpy tronque automatiquement à la taille de dst",
          "strcpy écrit au-delà de dst (débordement) : il ne connaît pas la taille de dst",
          "strcpy renvoie une erreur",
          "Rien, c'est sûr",
        ],
        correctIndex: 1,
        explanation:
          "strcpy copie jusqu'au '\\0' de src sans JAMAIS vérifier la taille de dst : c'est un débordement de buffer classique. Préfère une copie bornée (et n'oublie pas de garantir toi-même le '\\0' final, strncpy ne le fait pas toujours).",
      },
      {
        question:
          "Une `union { int i; char c; }` sur x86-64 : que vaut typiquement son `sizeof` ?",
        options: [
          "5 (4 pour int + 1 pour char)",
          "4 (la taille du plus grand membre)",
          "1 (la taille du plus petit membre)",
          "8 (toujours aligné sur 8)",
        ],
        correctIndex: 1,
        explanation:
          "Une union fait la taille de son PLUS GRAND membre (ici int = 4) : tous les membres partagent la même mémoire. C'est la différence clé avec une struct, qui ADDITIONNE ses champs (+ padding).",
      },
      {
        question:
          "Lequel de ces codes contient un Undefined Behavior ?",
        options: [
          "`int x = 0; x = x + 1;`",
          "`int a; int b = a + 1;` (a non initialisé, lu avant écriture)",
          "`int t[3]; t[2] = 5;`",
          "`int *p = NULL; if (p == NULL) return;`",
        ],
        correctIndex: 1,
        explanation:
          "Lire une variable locale non initialisée est un UB : sa valeur est indéterminée et le compilo peut optimiser comme bon lui semble. Les autres lignes sont parfaitement définies (comparer un pointeur à NULL est légal, t[2] est dans les bornes).",
      },
      {
        question:
          "Que vaut `1 << 4` (décalage à gauche de 4) ?",
        options: ["5", "8", "16", "32"],
        correctIndex: 2,
        explanation:
          "Décaler à gauche de n bits = multiplier par 2^n. 1 << 4 = 1 * 2^4 = 16. Les shifts sont la base des masques de flags et une optimisation classique du *2 / /2.",
      },
      {
        question:
          "Pour TESTER si le bit numéro 3 d'un `unsigned int flags` est à 1, on écrit :",
        options: [
          "`flags & (1u << 3)`",
          "`flags | (1u << 3)`",
          "`flags ^ (1u << 3)`",
          "`flags << 3`",
        ],
        correctIndex: 0,
        explanation:
          "Le ET (&) avec un masque qui n'a que le bit 3 à 1 isole ce bit : résultat non nul = bit allumé. Le OU (|) sert à POSER un bit, le XOR (^) à le BASCULER. C'est le trio masque de base.",
      },
    ],
    skillSlugs: [
      "c-strings",
      "structs-unions-enums",
      "undefined-behavior",
      "bit-manipulation",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 21,
  },

  // ===========================================================
  // CODE 1 (facile) — my_strlen + my_strcpy à la main
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title: "my_strlen & my_strcpy (C) — chaînes à la main, le terminateur nul",
    statement: `Réimplémente deux briques de \`<string.h>\` à la main : \`my_strlen\` (longueur d'une chaîne) et \`my_strcpy\` (copie d'une chaîne, '\\0' compris). C'est l'exo qui ancre l'équivalence tableau/pointeur et le rôle du terminateur nul.

**Compile en local (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -fsanitize=address -g strings.c -o strings
./strings
\`\`\`

**Contraintes :**
- Signatures exactes :
  - \`size_t my_strlen(const char *s);\`
  - \`char *my_strcpy(char *dst, const char *src);\` (renvoie \`dst\`)
- INTERDIT d'appeler \`strlen\`, \`strcpy\` ou \`memcpy\` : tu codes la boucle toi-même.
- \`my_strcpy\` doit copier le terminateur \`'\\0'\` (sinon la chaîne destination est cassée).
- L'appelant garantit que \`dst\` est assez grand (déjà vrai dans le \`main\` fourni).
- Pas de lecture/écriture hors limites.

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra\` (et \`-Werror\` si tu veux serrer la vis).
- 0 erreur sous AddressSanitizer (\`-fsanitize=address\`) ou valgrind.
- La sortie correspond exactement à expectedOutput.
- Tu sais expliquer pourquoi la condition de boucle de strcpy doit aussi recopier le \`'\\0'\`.`,
    starterCode: `#include <stdio.h>
#include <string.h>

size_t my_strlen(const char *s)
{
    /* Avance un pointeur jusqu'au '\\0', compte les pas.
       Le '\\0' NE compte PAS dans la longueur. */
    (void)s;
    return 0;
}

char *my_strcpy(char *dst, const char *src)
{
    /* Recopie chaque char de src dans dst, '\\0' compris.
       Renvoie dst. */
    (void)src;
    return dst;
}

int main(void)
{
    char dst[64];

    printf("%zu\\n", my_strlen("porterfield"));
    printf("%zu\\n", my_strlen(""));

    my_strcpy(dst, "heroes");
    printf("%s\\n", dst);
    printf("%zu\\n", my_strlen(dst));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <string.h>

size_t my_strlen(const char *s)
{
    size_t len = 0;
    while (s[len] != '\\0')
        len++;
    return len;
}

char *my_strcpy(char *dst, const char *src)
{
    size_t i = 0;
    /* <= n'est pas necessaire : on copie src[i] puis on s'arrete
       APRES avoir copie le '\\0'. */
    while (src[i] != '\\0') {
        dst[i] = src[i];
        i++;
    }
    dst[i] = '\\0'; /* recopie explicite du terminateur */
    return dst;
}

int main(void)
{
    char dst[64];

    printf("%zu\\n", my_strlen("porterfield"));
    printf("%zu\\n", my_strlen(""));

    my_strcpy(dst, "heroes");
    printf("%s\\n", dst);
    printf("%zu\\n", my_strlen(dst));
    return 0;
}
`,
    expectedOutput: "11\n0\nheroes\n6",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "c-strings",
      "pointer-arithmetic-arrays",
      "pointers-fundamentals",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 30,
    displayOrder: 22,
  },

  // ===========================================================
  // CODE 2 (facile-moyen) — inverser un tableau via pointeurs
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title: "reverse_array (C) — manipuler un tableau via deux pointeurs",
    statement: `Inverse un tableau d'\`int\` SUR PLACE (in-place) en n'utilisant QUE des pointeurs (pas d'indexation \`arr[i]\`). Deux pointeurs partent des deux bouts et se croisent au milieu. C'est l'exo qui rend l'arithmétique de pointeurs concrète.

**Compile en local (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -fsanitize=address -g reverse.c -o reverse
./reverse
\`\`\`

**Contraintes :**
- Signature exacte : \`void reverse_array(int *arr, size_t n);\`
- Travaille en place : ne crée PAS de second tableau.
- Utilise un pointeur \`left\` (début) et un pointeur \`right\` (\`arr + n - 1\`), échange \`*left\` et \`*right\`, avance \`left++\`, recule \`right--\`, tant que \`left < right\`.
- Pas d'indexation \`arr[i]\` : déréférence des pointeurs.
- Gère le cas \`n == 0\` (ne touche à rien, ne décrémente pas un pointeur en-dessous du tableau).

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra\`.
- 0 erreur sous AddressSanitizer (le piège classique : \`arr + n - 1\` quand n vaut 0 sort du tableau — d'où le garde \`n == 0\`).
- La sortie correspond exactement à expectedOutput.
- Tu sais expliquer pourquoi \`left < right\` (et pas \`<=\`) suffit.`,
    starterCode: `#include <stdio.h>
#include <stddef.h>

void reverse_array(int *arr, size_t n)
{
    /* Deux pointeurs : left = arr, right = arr + n - 1.
       Echange *left et *right, puis left++, right--, tant que left < right.
       Attention au cas n == 0. */
    (void)arr;
    (void)n;
}

static void print_array(const int *arr, size_t n)
{
    for (size_t i = 0; i < n; i++)
        printf("%d%s", arr[i], (i + 1 < n) ? " " : "\\n");
    if (n == 0)
        printf("(vide)\\n");
}

int main(void)
{
    int a[] = {1, 2, 3, 4, 5};
    int b[] = {10, 20};
    int c[] = {42};

    reverse_array(a, 5);
    print_array(a, 5);

    reverse_array(b, 2);
    print_array(b, 2);

    reverse_array(c, 1);
    print_array(c, 1);

    reverse_array(c, 0); /* doit etre un no-op sans deborder */
    print_array(c, 1);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <stddef.h>

void reverse_array(int *arr, size_t n)
{
    if (n == 0)
        return; /* sinon arr + n - 1 sortirait du tableau */

    int *left = arr;
    int *right = arr + n - 1;
    while (left < right) {
        int tmp = *left;
        *left = *right;
        *right = tmp;
        left++;
        right--;
    }
}

static void print_array(const int *arr, size_t n)
{
    for (size_t i = 0; i < n; i++)
        printf("%d%s", arr[i], (i + 1 < n) ? " " : "\\n");
    if (n == 0)
        printf("(vide)\\n");
}

int main(void)
{
    int a[] = {1, 2, 3, 4, 5};
    int b[] = {10, 20};
    int c[] = {42};

    reverse_array(a, 5);
    print_array(a, 5);

    reverse_array(b, 2);
    print_array(b, 2);

    reverse_array(c, 1);
    print_array(c, 1);

    reverse_array(c, 0); /* doit etre un no-op sans deborder */
    print_array(c, 1);
    return 0;
}
`,
    expectedOutput: "5 4 3 2 1\n20 10\n42\n42",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "pointer-arithmetic-arrays",
      "pointers-fundamentals",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 35,
    displayOrder: 23,
  },

  // ===========================================================
  // CODE 3 (moyen) — compter les mots d'une chaîne (parsing)
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title: "count_words (C) — parser une chaîne, gérer les états",
    statement: `Écris \`count_words\` qui compte le nombre de mots dans une chaîne. Un mot = une suite de caractères non-espaces. Les séparateurs : espace, tabulation, saut de ligne. C'est l'exo qui apprend le parsing à un seul passage avec une machine à états minimale (dans un mot / hors d'un mot).

**Compile en local (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -fsanitize=address -g words.c -o words
./words
\`\`\`

**Contraintes :**
- Signature exacte : \`int count_words(const char *s);\`
- Un seul passage sur la chaîne (parcours pointeur, jusqu'au \`'\\0'\`).
- Gère proprement : espaces en début/fin, espaces multiples entre mots, chaîne vide, chaîne d'espaces uniquement (→ 0).
- Tu peux utiliser \`isspace\` de \`<ctype.h>\` pour détecter un séparateur.
- Astuce d'état : incrémente le compteur à chaque TRANSITION séparateur → non-séparateur (entrée dans un nouveau mot).

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra\`.
- 0 erreur sous AddressSanitizer.
- La sortie correspond exactement à expectedOutput.
- Tu sais expliquer pourquoi compter les transitions évite de sur-compter les espaces doublés.`,
    starterCode: `#include <stdio.h>
#include <ctype.h>

int count_words(const char *s)
{
    /* Parcours pointeur. Garde un drapeau "dans un mot".
       Compte +1 a chaque passage separateur -> non-separateur. */
    (void)s;
    return 0;
}

int main(void)
{
    printf("%d\\n", count_words("porterfield heroes"));
    printf("%d\\n", count_words("   espaces   en   trop   "));
    printf("%d\\n", count_words(""));
    printf("%d\\n", count_words("       "));
    printf("%d\\n", count_words("un\\tdeux\\ntrois"));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <ctype.h>

int count_words(const char *s)
{
    int count = 0;
    int in_word = 0;

    for (const char *p = s; *p != '\\0'; p++) {
        if (isspace((unsigned char)*p)) {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;   /* transition separateur -> mot */
            count++;
        }
    }
    return count;
}

int main(void)
{
    printf("%d\\n", count_words("porterfield heroes"));
    printf("%d\\n", count_words("   espaces   en   trop   "));
    printf("%d\\n", count_words(""));
    printf("%d\\n", count_words("       "));
    printf("%d\\n", count_words("un\\tdeux\\ntrois"));
    return 0;
}
`,
    expectedOutput: "2\n3\n0\n0\n3",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "c-strings",
      "pointer-arithmetic-arrays",
      "undefined-behavior",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 40,
    displayOrder: 24,
  },

  // ===========================================================
  // CODE 4 (moyen-difficile) — linked list, malloc/free sans fuite
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title:
      "Linked list (C) — push_front, print, free_list : malloc/free sans fuite",
    statement: `Construis une liste chaînée simple d'\`int\` : \`push_front\` (ajout en tête, avec \`malloc\`), \`print_list\` (affiche les valeurs), \`free_list\` (libère TOUS les nœuds sans fuite ni double-free). C'est l'exo qui consolide struct + pointeurs + allocation dynamique + ownership.

**Compile en local (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -fsanitize=address -g list.c -o list
./list
\`\`\`

**Structures et signatures (déjà dans le squelette) :**
\`\`\`c
typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push_front(Node *head, int value); /* renvoie la nouvelle tete */
void  print_list(const Node *head);
void  free_list(Node *head);
\`\`\`

**Contraintes :**
- \`push_front\` : \`malloc\` un \`Node\`, VÉRIFIE \`!= NULL\` (renvoie \`head\` inchangé si malloc échoue), chaîne \`new->next = head\`, renvoie le nouveau nœud.
- \`free_list\` : libère chaque nœud en gardant le \`next\` AVANT le \`free\` (sinon use-after-free). 1 malloc = 1 free, aucune fuite.
- INTERDIT de \`free\` deux fois le même nœud ou de déréférencer un nœud déjà libéré.
- Pas de variable globale ; la liste se passe par pointeur.

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra\`.
- AddressSanitizer / valgrind : 0 fuite, 0 use-after-free, 0 double-free ("All heap blocks were freed").
- La sortie correspond exactement à expectedOutput.
- Tu sais expliquer pourquoi il faut sauver \`next\` avant de \`free\` le nœud courant.`,
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push_front(Node *head, int value)
{
    /* malloc un Node, verifie != NULL, chaine sur head, renvoie la tete. */
    (void)value;
    return head;
}

void print_list(const Node *head)
{
    /* Parcours et affiche : v0 -> v1 -> ... -> NULL */
    (void)head;
}

void free_list(Node *head)
{
    /* Libere chaque noeud. Sauve next AVANT le free. */
    (void)head;
}

int main(void)
{
    Node *head = NULL;
    head = push_front(head, 3);
    head = push_front(head, 2);
    head = push_front(head, 1);

    print_list(head);   /* 1 -> 2 -> 3 -> NULL */
    free_list(head);    /* aucune fuite */
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push_front(Node *head, int value)
{
    Node *node = malloc(sizeof(*node));
    if (node == NULL)
        return head; /* allocation echouee : on ne casse pas la liste */
    node->value = value;
    node->next = head;
    return node;     /* le nouveau noeud devient la tete */
}

void print_list(const Node *head)
{
    for (const Node *cur = head; cur != NULL; cur = cur->next)
        printf("%d -> ", cur->value);
    printf("NULL\\n");
}

void free_list(Node *head)
{
    Node *cur = head;
    while (cur != NULL) {
        Node *next = cur->next; /* sauver AVANT le free, sinon use-after-free */
        free(cur);
        cur = next;
    }
}

int main(void)
{
    Node *head = NULL;
    head = push_front(head, 3);
    head = push_front(head, 2);
    head = push_front(head, 1);

    print_list(head);   /* 1 -> 2 -> 3 -> NULL */
    free_list(head);    /* aucune fuite */
    return 0;
}
`,
    expectedOutput: "1 -> 2 -> 3 -> NULL",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "structs-unions-enums",
      "dynamic-allocation",
      "pointers-fundamentals",
      "use-after-free",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 50,
    displayOrder: 25,
  },

  // ===========================================================
  // CODE 5 (difficile) — flags de permission via masques de bits
  // ===========================================================
  {
    moduleId: M03_ID,
    kind: "code_exercise",
    sandbox: "external",
    language: "c",
    title:
      "Flags de bits (C) — set/clear/toggle/test des permissions dans un int",
    statement: `Implémente une mini API de permissions stockées dans un seul \`unsigned int\` (style \`chmod\`) à coups de masques de bits. Quatre opérations : POSER un bit, EFFACER un bit, BASCULER un bit, TESTER un bit. C'est l'exo qui transforme \`& | ^ ~ << >>\` en outil concret et défensif (un bitfield compact au lieu de plusieurs booléens).

**Compile en local (sandbox externe, ton gcc) :**
\`\`\`bash
gcc -Wall -Wextra -fsanitize=address -g flags.c -o flags
./flags
\`\`\`

**Permissions (déjà définies dans le squelette) :**
\`\`\`c
#define PERM_READ  (1u << 0)   /* 0b001 */
#define PERM_WRITE (1u << 1)   /* 0b010 */
#define PERM_EXEC  (1u << 2)   /* 0b100 */
\`\`\`

**Signatures exactes :**
\`\`\`c
unsigned int flag_set(unsigned int flags, unsigned int mask);    /* pose */
unsigned int flag_clear(unsigned int flags, unsigned int mask);  /* efface */
unsigned int flag_toggle(unsigned int flags, unsigned int mask); /* bascule */
int          flag_test(unsigned int flags, unsigned int mask);   /* 1 si TOUS les bits du mask sont a 1, sinon 0 */
\`\`\`

**Contraintes :**
- \`flag_set\` : \`flags | mask\`. \`flag_clear\` : \`flags & ~mask\`. \`flag_toggle\` : \`flags ^ mask\`.
- \`flag_test\` : renvoie 1 SEULEMENT si tous les bits du masque sont présents (\`(flags & mask) == mask\`), 0 sinon (jamais une autre valeur).
- Travaille uniquement sur du NON signé (les shifts/masques sur signé peuvent être UB).
- Aucune branche \`if\` n'est nécessaire dans set/clear/toggle : ce sont des opérations bit à bit pures.

**Critères de validation :**
- Compile SANS warning sous \`-Wall -Wextra\`.
- 0 erreur sous AddressSanitizer.
- La sortie correspond exactement à expectedOutput.
- Tu sais expliquer pourquoi \`& ~mask\` efface précisément les bits du masque sans toucher aux autres, et pourquoi \`flag_test\` compare à \`mask\` (et pas juste \`!= 0\`).`,
    starterCode: `#include <stdio.h>

#define PERM_READ  (1u << 0)   /* 0b001 */
#define PERM_WRITE (1u << 1)   /* 0b010 */
#define PERM_EXEC  (1u << 2)   /* 0b100 */

unsigned int flag_set(unsigned int flags, unsigned int mask)
{
    (void)mask;
    return flags;
}

unsigned int flag_clear(unsigned int flags, unsigned int mask)
{
    (void)mask;
    return flags;
}

unsigned int flag_toggle(unsigned int flags, unsigned int mask)
{
    (void)mask;
    return flags;
}

int flag_test(unsigned int flags, unsigned int mask)
{
    /* 1 si TOUS les bits de mask sont a 1 dans flags, sinon 0. */
    (void)flags;
    (void)mask;
    return 0;
}

int main(void)
{
    unsigned int p = 0;

    p = flag_set(p, PERM_READ);
    p = flag_set(p, PERM_WRITE);
    printf("%u\\n", p);                       /* 3 (read|write) */
    printf("%d\\n", flag_test(p, PERM_READ)); /* 1 */
    printf("%d\\n", flag_test(p, PERM_EXEC)); /* 0 */

    p = flag_toggle(p, PERM_EXEC);
    printf("%u\\n", p);                       /* 7 (read|write|exec) */

    p = flag_clear(p, PERM_WRITE);
    printf("%u\\n", p);                       /* 5 (read|exec) */
    printf("%d\\n", flag_test(p, PERM_READ | PERM_EXEC)); /* 1 (les deux) */
    printf("%d\\n", flag_test(p, PERM_READ | PERM_WRITE)); /* 0 (write absent) */
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

#define PERM_READ  (1u << 0)   /* 0b001 */
#define PERM_WRITE (1u << 1)   /* 0b010 */
#define PERM_EXEC  (1u << 2)   /* 0b100 */

unsigned int flag_set(unsigned int flags, unsigned int mask)
{
    return flags | mask;
}

unsigned int flag_clear(unsigned int flags, unsigned int mask)
{
    return flags & ~mask; /* ~mask = tout sauf les bits a effacer */
}

unsigned int flag_toggle(unsigned int flags, unsigned int mask)
{
    return flags ^ mask;
}

int flag_test(unsigned int flags, unsigned int mask)
{
    /* TOUS les bits du mask doivent etre presents. */
    return (flags & mask) == mask;
}

int main(void)
{
    unsigned int p = 0;

    p = flag_set(p, PERM_READ);
    p = flag_set(p, PERM_WRITE);
    printf("%u\\n", p);                       /* 3 (read|write) */
    printf("%d\\n", flag_test(p, PERM_READ)); /* 1 */
    printf("%d\\n", flag_test(p, PERM_EXEC)); /* 0 */

    p = flag_toggle(p, PERM_EXEC);
    printf("%u\\n", p);                       /* 7 (read|write|exec) */

    p = flag_clear(p, PERM_WRITE);
    printf("%u\\n", p);                       /* 5 (read|exec) */
    printf("%d\\n", flag_test(p, PERM_READ | PERM_EXEC)); /* 1 (les deux) */
    printf("%d\\n", flag_test(p, PERM_READ | PERM_WRITE)); /* 0 (write absent) */
    return 0;
}
`,
    expectedOutput: "3\n1\n0\n7\n5\n1\n0",
    testsCode: null,
    quizQuestions: null,
    skillSlugs: [
      "bit-manipulation",
      "memory-model-types",
      "structs-unions-enums",
    ],
    passThresholdPct: 80,
    estimatedMinutes: 45,
    displayOrder: 26,
  },
];
