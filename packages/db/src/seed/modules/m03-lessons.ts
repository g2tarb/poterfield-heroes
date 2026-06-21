/**
 * M03 — C & bas niveau : contenu pédagogique markdown des leçons in-app.
 *
 * Une entrée par skill slug du module (cf. m03-c-bas-niveau.ts), appliquée
 * via UPDATE skills SET content_markdown WHERE slug = key.
 *
 * Public : dev JS/TS confirmé, jamais manipulé de pointeurs ni de mémoire
 * manuelle. Ton direct senior FR. Schémas ASCII de la mémoire systématiques.
 * Les skills sécu sont cadrés DÉFENSIF/pédagogique.
 */
export const m03LessonContent: Record<string, string> = {
  "compilation-pipeline": `## La chaîne de compilation, étape par étape

En JS tu lances \`node app.js\` et ça tourne. Le moteur lit, compile à la volée, exécute. Tu n'as jamais eu à penser au chemin entre ton texte et le CPU.

En C, ce chemin est **explicite** et tu peux le voir à chaque étape. \`gcc fichier.c -o prog\` cache en réalité **4 étapes** distinctes. Les comprendre, c'est savoir lire les messages d'erreur (et 80% des débutants confondent "erreur de compilation" et "erreur de linker").

### L'analogie de l'usine

Pense à une chaîne de montage :

\`\`\`
ton .c          texte humain (avec #include, #define)
   │ 1. PRÉPROCESSEUR  (gcc -E)  → colle les .h, déroule les macros
   ▼
.i              C "pur", plus aucune directive #
   │ 2. COMPILATION    (gcc -S)  → traduit en assembleur x86-64
   ▼
.s              assembleur (mov, call, ret...)
   │ 3. ASSEMBLAGE     (gcc -c)  → encode en code machine binaire
   ▼
.o              objet binaire, mais symboles non résolus
   │ 4. ÉDITION DE LIENS (ld)    → relie les .o + libs, place les adresses
   ▼
prog            exécutable
\`\`\`

### Voir chaque étape de tes yeux

\`\`\`c
// hello.c
#include <stdio.h>
#define ANNEE 2026

int main(void) {
    printf("Porterfield %d\\n", ANNEE);
    return 0;
}
\`\`\`

\`\`\`bash
gcc -E hello.c -o hello.i   # 1. préproc : ANNEE devient 2026, stdio.h est collé
gcc -S hello.c -o hello.s   # 2. compil  : tu vois l'assembleur (lis hello.s !)
gcc -c hello.c -o hello.o   # 3. assemb  : binaire, "nm hello.o" liste les symboles
gcc hello.o -o hello        # 4. link    : produit l'exécutable
./hello
\`\`\`

### Compilation vs linker : LE point qui débloque tout

\`\`\`c
void foo(void);          // déclaration : "foo existe quelque part"
int main(void) { foo(); return 0; }
// ... mais foo n'est défini NULLE PART
\`\`\`

\`\`\`bash
gcc -Wall -Wextra prog.c -o prog
# undefined reference to 'foo'        ← PAS une erreur de compilation
\`\`\`

Le \`.c\` a parfaitement compilé en \`.o\` : la syntaxe était bonne, \`foo\` était déclarée. C'est l'**étape 4 (linker)** qui échoue : il cherche le corps de \`foo\` et ne le trouve dans aucun \`.o\` ni aucune lib. En JS l'équivalent serait un import vers un module qui n'exporte pas la fonction — sauf qu'ici l'erreur arrive à la construction du binaire, pas à l'exécution.

> Règle mnémo : **"undefined reference" = linker. "expected ';'" = compilateur.**

### Lier une bibliothèque externe

\`\`\`bash
gcc prog.c -o prog -lm   # -lm relie la lib math (sqrt, pow...)
\`\`\`

Oublier \`-lm\` te donne \`undefined reference to 'sqrt'\` : le compilateur connaît la signature (via \`math.h\`) mais le linker n'a pas le code.

### ⚠️ Pièges

- **Confondre les deux familles d'erreurs** fait perdre des heures. Lis le message : il dit toujours quelle étape a planté.
- **Oublier \`-Wall -Wextra\`** : sans eux, gcc avale silencieusement des bugs réels (variable non utilisée, retour manquant). Active-les TOUJOURS, c'est ton premier reviewer gratuit.
- **\`#include\` un \`.c\`** au lieu d'un \`.h\` : ça "marche" mais crée des doubles définitions au link dès que le projet grossit.

### À écrire dans ton carnet

> Compile \`hello.c\` avec \`-E\`, \`-S\`, \`-c\` puis le link final. Ouvre le \`.s\` : repère la ligne \`call printf\`. Puis supprime un \`;\` et un appel de fonction non définie, et note quel message vient du compilateur, lequel vient du linker.
`,

  "memory-model-types": `## Modèle mémoire & types primitifs

En JS, un \`number\` est un \`number\` : tu ne sais pas (et tu t'en fiches) combien d'octets il occupe, ni où il est rangé. Le moteur gère tout. En C, **chaque valeur a une taille fixe en octets et une adresse**, et tu dois la connaître — parce que c'est elle qui décide combien de mémoire tu lis, écris et déplaces.

### La carte mémoire d'un programme

Quand ton binaire tourne, l'OS lui donne un espace d'adresses découpé en **segments** :

\`\`\`
adresses hautes
┌───────────────────────────┐
│   stack (pile)            │  variables locales, appels de fonctions
│        │                  │  ↓ grandit vers le BAS
│        ▼                  │
│                           │
│        ▲                  │
│        │                  │  ↑ grandit vers le HAUT
│   heap (tas)              │  mémoire allouée par malloc
├───────────────────────────┤
│   bss                     │  globales NON initialisées (= 0)
├───────────────────────────┤
│   data                    │  globales initialisées (int g = 5;)
├───────────────────────────┤
│   text                    │  le code machine lui-même (lecture seule)
└───────────────────────────┘
adresses basses
\`\`\`

- **text** : tes instructions. Read-only (écrire dedans = crash).
- **data / bss** : variables globales et \`static\`. \`data\` = celles avec une valeur initiale, \`bss\` = celles à zéro.
- **heap** : ce que tu réserves toi-même (skill malloc). Grandit vers le haut.
- **stack** : automatique, par fonction. Grandit vers le bas. Pile et tas se "courent après" : s'ils se touchent, c'est le débordement.

### La taille des types (et pourquoi ça compte)

\`\`\`c
#include <stdio.h>
int main(void) {
    printf("char   : %zu\\n", sizeof(char));    // 1  (toujours, par définition)
    printf("int    : %zu\\n", sizeof(int));     // 4  sur x86-64 typique
    printf("long   : %zu\\n", sizeof(long));    // 8  sur Linux 64 bits
    printf("float  : %zu\\n", sizeof(float));   // 4
    printf("double : %zu\\n", sizeof(double));  // 8
    printf("ptr    : %zu\\n", sizeof(void *));  // 8  (une adresse 64 bits)
    return 0;
}
\`\`\`

\`\`\`bash
gcc -Wall -Wextra -Werror sizes.c -o sizes && ./sizes
\`\`\`

Un \`int\` fait 4 octets = 32 bits = il peut stocker ~4,3 milliards de valeurs. **Pont JS** : en JS tout nombre est un double 64 bits flottant ; en C tu choisis, et ce choix fixe la plage et la mémoire consommée.

### Signé vs non signé

\`\`\`c
signed char   s = -1;   // plage -128 .. 127
unsigned char u = 255;  // plage    0 .. 255   (même 8 bits, interprétés autrement)
\`\`\`

Le même octet \`0xFF\` vaut \`-1\` en signé et \`255\` en non signé. Le type ne change pas les bits, il change leur **interprétation**.

### Endianness : l'ordre des octets

\`\`\`c
int x = 0x01020304;  // sur une machine little-endian (x86), en mémoire :
//  adresse:   p    p+1   p+2   p+3
//  octet:    0x04  0x03  0x02  0x01   ← octet de poids faible EN PREMIER
\`\`\`

x86-64 est **little-endian** : l'octet le moins significatif est rangé à l'adresse la plus basse. Surprenant, mais c'est crucial quand tu lis un fichier binaire ou un paquet réseau (qui, lui, est souvent big-endian).

### ⚠️ Pièges

- **Supposer \`sizeof(int) == sizeof(long)\`** : faux selon la plateforme. N'écris jamais de code qui dépend d'une taille non vérifiée ; utilise \`<stdint.h>\` (\`int32_t\`, \`uint8_t\`) quand la taille doit être garantie.
- **Mélanger signé/non signé** dans une comparaison : \`-1 < 1u\` est **faux** en C (le \`-1\` devient un énorme non signé). UB-adjacent et source de bugs sécu.
- **\`%d\` pour un \`size_t\`** : utilise \`%zu\`. Mauvais format = comportement indéfini à l'affichage.

### À écrire dans ton carnet

> Dessine la carte mémoire (text/data/bss/heap/stack) et place dessus : une globale \`int g = 5;\`, une globale \`int z;\`, une locale dans \`main\`, et un \`malloc\`. Puis lance le programme \`sizeof\` ci-dessus sur ta machine et note les tailles réelles.
`,

  "pointers-fundamentals": `## Pointeurs : l'adresse, pas la valeur

C'est **LE** saut conceptuel du module. Prends ton temps ici, tout le reste en dépend.

### L'analogie du casier

Imagine une consigne de gare : une rangée de casiers numérotés.

- Une **variable**, c'est un casier : il a un **numéro** (son adresse) et un **contenu** (sa valeur).
- Un **pointeur**, c'est un casier dont le contenu est *le numéro d'un autre casier*.

Quand tu as un pointeur, tu n'as pas la valeur — tu as *où la trouver*. "Va au casier 4096, ouvre-le, c'est là."

**Pont JS** : tu as déjà vécu ça sans le savoir. \`let a = [1,2,3]; let b = a;\` — \`b\` ne copie pas le tableau, il copie la *référence* (l'adresse). Modifier via \`b\` modifie ce que voit \`a\`. En C, cette adresse n'est plus cachée : tu la tiens dans la main.

### Les deux opérateurs : & et *

\`\`\`c
int x = 42;       // un casier "x" qui contient 42
int *p = &x;      // p contient l'ADRESSE de x   ( & = "adresse de" )
printf("%d\\n", x);    // 42  → la valeur
printf("%p\\n", (void *)&x);  // ex: 0x7ffd... → l'adresse de x
printf("%p\\n", (void *)p);   // la MÊME adresse (p pointe sur x)
printf("%d\\n", *p);   // 42  → * = "déréférence" = "la valeur AU casier pointé"
*p = 99;          // écrit 99 À TRAVERS le pointeur
printf("%d\\n", x);    // 99  ← x a changé, on l'a modifié via p
\`\`\`

### Schéma mémoire

\`\`\`
       adresse        contenu
      ┌─────────┐
 x →  │  0x1000 │ ──→ [   99   ]      x vit à l'adresse 0x1000
      └─────────┘
      ┌─────────┐
 p →  │  0x1008 │ ──→ [ 0x1000 ]      p vit à 0x1008, contient l'adresse de x
      └─────────┘
                          │
   *p signifie : "suis la flèche" → on retombe sur le casier de x
\`\`\`

\`&x\` = "donne-moi le numéro du casier de x" → \`0x1000\`.
\`*p\` = "suis l'adresse stockée dans p et lis/écris là" → la valeur de x.

### NULL : le pointeur qui ne pointe nulle part

\`\`\`c
int *p = NULL;     // p ne pointe sur rien (adresse 0, réservée)
if (p != NULL)     // toujours vérifier avant de déréférencer
    printf("%d\\n", *p);
\`\`\`

\`NULL\` est l'équivalent conceptuel de \`null\` en JS, mais déréférencer NULL ne te donne pas \`Cannot read property\` poli : ça donne un **segfault**.

### Le segfault expliqué

Un *segmentation fault* = tu as essayé d'accéder à une adresse que l'OS ne t'a pas autorisée (NULL, mémoire libérée, hors de tes segments). L'OS coupe le programme net.

\`\`\`c
int *p = NULL;
*p = 5;            // SEGFAULT : écriture à l'adresse 0
\`\`\`

### Pointeur de pointeur

\`\`\`c
int x = 42;
int *p = &x;       // p pointe sur x
int **pp = &p;     // pp pointe sur p
printf("%d\\n", **pp);  // 42  : suis 2 flèches
\`\`\`

\`\`\`
pp → [ &p ] → p → [ &x ] → x → [ 42 ]
\`\`\`

Utile pour qu'une fonction modifie *ton* pointeur (ex : \`malloc\` à travers un paramètre).

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g ptr.c -o ptr && ./ptr
\`\`\`

Si tu déréférences NULL, AddressSanitizer affiche \`SEGV on unknown address 0x000000000000\` avec la ligne exacte. valgrind dirait \`Invalid read/write of size 4 ... Address 0x0 is not stack'd, malloc'd or (recently) free'd\`.

### ⚠️ Pièges

- **Déréférencer un pointeur non initialisé** : \`int *p; *p = 5;\` — \`p\` contient une adresse garbage, tu écris n'importe où. UB. Initialise toujours (à \`NULL\` au minimum).
- **Confondre \`*p\` (la valeur) et \`p\` (l'adresse)** : l'erreur n°1 du débutant. \`*\` = "le contenu pointé".
- **\`int* a, b;\`** ne déclare PAS deux pointeurs : \`a\` est un \`int*\`, \`b\` est un \`int\`. Écris \`int *a, *b;\`.

### À écrire dans ton carnet

> Dessine 3 casiers : \`x\` (42), \`p\` (pointe sur x), \`pp\` (pointe sur p), avec des adresses inventées. Puis réponds sans coder : que valent \`x\`, \`&x\`, \`p\`, \`*p\`, \`pp\`, \`*pp\`, \`**pp\` ?
`,

  "pointer-arithmetic-arrays": `## Arithmétique de pointeurs & tableaux

Maintenant que tu tiens l'adresse, on va la déplacer. C'est ce qui fait fonctionner les tableaux, et c'est aussi par là que la mémoire du voisin se fait lire.

### La règle d'or : p + 1 avance de sizeof(*p)

\`\`\`c
int *p = ...;     // p pointe sur un int (4 octets)
p + 1             // n'avance PAS d'1 octet : avance de 4 octets
char *c = ...;
c + 1             // avance d'1 octet (sizeof(char) == 1)
\`\`\`

Le compilateur sait sur quoi tu pointes, donc \`+1\` veut dire "élément suivant", pas "octet suivant". C'est exactement ce qu'il faut pour parcourir un tableau.

### Schéma : un tableau d'int

\`\`\`c
int arr[4] = {10, 20, 30, 40};
\`\`\`

\`\`\`
 adresse:  0x1000   0x1004   0x1008   0x100C
          ┌───────┬───────┬───────┬───────┐
   arr →  │  10   │  20   │  30   │  40   │
          └───────┴───────┴───────┴───────┘
            arr     arr+1   arr+2   arr+3
          arr[0]   arr[1]  arr[2]  arr[3]
\`\`\`

\`arr\` "se dégrade" en pointeur vers son premier élément. Donc :

\`\`\`c
arr[2]  ≡  *(arr + 2)   // ces deux écritures sont IDENTIQUES
\`\`\`

Et comme l'addition est commutative, \`2[arr]\` compile aussi (curiosité à ne jamais écrire en vrai).

### Parcourir avec un pointeur

\`\`\`c
int arr[4] = {10, 20, 30, 40};
for (int *p = arr; p < arr + 4; p++)
    printf("%d ", *p);   // 10 20 30 40
\`\`\`

\`p++\` saute de 4 octets à chaque tour. \`arr + 4\` est l'adresse "un cran après le dernier" (légale à comparer, illégale à déréférencer).

### Un tableau N'EST PAS un pointeur

C'est subtil et ça piège tout le monde :

\`\`\`c
int arr[4];
int *p = arr;
printf("%zu\\n", sizeof(arr));  // 16  (4 int × 4 octets : le TABLEAU entier)
printf("%zu\\n", sizeof(p));    // 8   (juste un pointeur)
\`\`\`

Un tableau connaît sa taille totale (au moment de la compilation, dans son scope). Un pointeur ne connaît que lui-même : 8 octets. Dès que tu passes un tableau à une fonction, il devient un pointeur et **perd sa taille** — d'où la convention de passer la longueur en second paramètre.

\`\`\`c
size_t len(int t[]) { return sizeof(t); }  // renvoie 8, PAS la taille du tableau !
\`\`\`

**Pont JS** : en JS \`arr.length\` est toujours dispo. En C, le tableau ne porte pas sa longueur une fois passé ailleurs — c'est à toi de la trimballer.

### Out-of-bounds = lecture du voisin

\`\`\`c
int arr[4] = {10, 20, 30, 40};
printf("%d\\n", arr[7]);   // PAS d'erreur : lit la mémoire APRÈS le tableau
\`\`\`

\`\`\`
          ┌──┬──┬──┬──┐ ╳ ╳ ╳ ╳
   arr →  │10│20│30│40│ ?? ?? ?? ??   ← arr[7] lit ici : valeur garbage
          └──┴──┴──┴──┘
\`\`\`

En JS, \`arr[7]\` te rend \`undefined\`, poli. En C, tu lis (ou pire, tu écris) ce qui se trouve à côté : une autre variable, une adresse de retour... C'est le cœur du buffer overflow (skill dédié).

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g arr.c -o arr && ./arr
\`\`\`

ASan attrape le hors-limites : \`stack-buffer-overflow ... READ of size 4\` avec la ligne. valgrind dirait \`Invalid read of size 4\`.

### ⚠️ Pièges

- **Off-by-one** : \`for (i = 0; i <= 4; i++)\` sur un tableau de 4 accède à \`arr[4]\` qui n'existe pas. La condition est \`< taille\`, jamais \`<=\`.
- **\`sizeof\` sur un paramètre tableau** : renvoie la taille d'un pointeur (8), pas du tableau. Toujours passer la longueur séparément.
- **Arithmétique entre pointeurs de tableaux différents** : UB. Ne soustrais que des pointeurs du même tableau.

### À écrire dans ton carnet

> Avec \`int arr[5] = {2,4,6,8,10};\`, donne sans coder : la valeur de \`*(arr+3)\`, de \`arr[1]\`, de \`*arr\`, et explique pourquoi \`sizeof(arr)\` vaut 20 mais devient 8 dans une fonction.
`,

  "c-strings": `## Chaînes C : char* et le terminateur nul

En JS une string est un objet : elle connaît sa longueur, elle est immuable, tu ne penses jamais à sa fin. En C, **une chaîne est juste un tableau de \`char\` qui se termine par un octet zéro \`'\\0'\`**. Il n'y a pas de longueur stockée : la fin, c'est le \`'\\0'\`. Oublie-le, et toutes les fonctions de chaîne partent dans le mur.

### L'analogie du train de wagons

Une chaîne, c'est un train de wagons (chars) avec un **wagon de queue spécial vide** (\`'\\0'\`) qui dit "fin du train". Tant que tu ne vois pas ce wagon, tu continues à lire.

### Schéma mémoire

\`\`\`c
char s[] = "abc";   // tableau de 4 chars (pas 3 !)
\`\`\`

\`\`\`
 index:    0     1     2     3
          ┌─────┬─────┬─────┬──────┐
   s →    │ 'a' │ 'b' │ 'c' │ '\\0' │
          └─────┴─────┴─────┴──────┘
          0x61  0x62  0x63   0x00     ← le '\\0' = octet 0, invisible mais réel
\`\`\`

\`strlen(s)\` vaut **3** (les caractères avant le nul), mais le tableau occupe **4 octets**. Cette différence de 1 est responsable de la moitié des bugs de débutant en C.

\`\`\`c
#include <string.h>
strlen("abc");        // 3   : compte jusqu'au '\\0', sans le compter
sizeof("abc");        // 4   : inclut le '\\0'
\`\`\`

### char[] vs char*

\`\`\`c
char a[] = "hello";   // tableau MODIFIABLE, copié sur la pile
char *b  = "hello";   // pointeur vers un littéral en lecture seule (segment text)
a[0] = 'H';           // OK
b[0] = 'H';           // UB / crash : on écrit dans une zone read-only
\`\`\`

### Le danger : strcpy / strcat sans borne

\`\`\`c
char dst[8];
char src[] = "porterfield";   // 12 chars + '\\0' = 13 octets
strcpy(dst, src);             // CATASTROPHE : copie 13 octets dans 8
\`\`\`

\`\`\`
   dst (8 octets)        mémoire voisine
  ┌──┬──┬──┬──┬──┬──┬──┬──┐
  │p │o │r │t │e │r │f │i │ e l d \\0   ← déborde de 5 octets dans le voisin
  └──┴──┴──┴──┴──┴──┴──┴──┘ ▲▲▲▲▲▲
                            écrase ce qui suit dst
\`\`\`

\`strcpy\` copie jusqu'au \`'\\0'\` de la source **sans regarder la taille de la destination**. C'est exactement le mécanisme du buffer overflow.

### strncpy : mieux, mais piégeux

\`\`\`c
char dst[8];
strncpy(dst, src, sizeof(dst) - 1);  // copie au plus 7 octets
dst[sizeof(dst) - 1] = '\\0';         // OBLIGATOIRE : strncpy ne garantit PAS le '\\0' !
\`\`\`

Le piège : si la source est plus longue que \`n\`, \`strncpy\` **ne met pas** de terminateur. Tu dois le poser à la main, sinon ta chaîne n'a pas de fin → \`strlen\` part en vrille. Sur les libs modernes, \`snprintf(dst, sizeof(dst), "%s", src)\` est souvent un meilleur réflexe (toujours terminé).

### Pourquoi \`buffer[len] = '\\0'\`

Quand tu construis une chaîne à la main, après avoir écrit \`len\` caractères tu **dois** poser le terminateur :

\`\`\`c
char buf[16];
size_t i = 0;
for (; src[i] && i < 15; i++) buf[i] = src[i];
buf[i] = '\\0';   // sans ça, buf n'est pas une chaîne valide
\`\`\`

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g str.c -o str && ./str
\`\`\`

Le \`strcpy\` qui déborde déclenche ASan : \`stack-buffer-overflow ... WRITE of size N\`. valgrind dirait \`Invalid write of size 1\`.

### ⚠️ Pièges

- **Oublier le +1 du \`'\\0'\`** : \`malloc(strlen(s))\` au lieu de \`malloc(strlen(s) + 1)\` → débordement d'un octet à la copie.
- **\`strncpy\` non terminé** : copie tronquée sans \`'\\0'\` = chaîne sans fin = UB à la lecture suivante.
- **Écrire dans un littéral** (\`char *s = "x"; s[0]='y';\`) : zone read-only, crash.
- **\`==\` pour comparer des chaînes** : ça compare des adresses, pas le contenu. Utilise \`strcmp\`.

### À écrire dans ton carnet

> Pour \`char s[] = "hi";\` donne : \`strlen(s)\`, \`sizeof(s)\`, et dessine les octets en mémoire. Puis explique pourquoi \`strcpy(dst, src)\` est dangereux et ce que \`snprintf\` change.
`,

  "structs-unions-enums": `## struct, union, enum & alignement

En JS tu fais \`{ x: 1, y: 2 }\` sans penser à la disposition mémoire. En C, une \`struct\` est un **paquet d'octets contigus** dont tu contrôles (presque) la disposition — et où le compilateur ajoute parfois des trous invisibles pour l'alignement.

### struct : regrouper des données

\`\`\`c
struct Point { int x; int y; };

struct Point p = {3, 4};
p.x = 10;                 // accès par . sur une struct directe
struct Point *pp = &p;
pp->y = 20;               // accès par -> sur un POINTEUR de struct
// pp->y est juste du sucre pour (*pp).y
\`\`\`

\`\`\`
   struct Point p, en mémoire :
   ┌─────────┬─────────┐
   │   x=10  │   y=20  │     contigus : 4 + 4 = 8 octets
   └─────────┴─────────┘
\`\`\`

**Pont JS** : \`pp->y\` c'est l'équivalent de \`obj.y\` quand tu n'as que la référence. Le \`->\` existe parce que tu manipules souvent des structs via pointeur (pour éviter de copier tout le paquet).

### Padding & alignement : pourquoi sizeof surprend

Le CPU lit la mémoire plus vite si chaque champ est aligné sur un multiple de sa taille. Le compilateur insère donc des **octets de bourrage** (padding) :

\`\`\`c
struct Bad {
    char  c;   // 1 octet
    int   i;   // 4 octets, doit être aligné sur 4
    char  d;   // 1 octet
};
printf("%zu\\n", sizeof(struct Bad));  // 12, PAS 6 !
\`\`\`

\`\`\`
 offset:  0     1  2  3     4  5  6  7     8     9 10 11
         ┌────┬───────────┬────────────┬────┬──────────┐
         │ c  │  padding  │     i      │ d  │ padding  │
         └────┴───────────┴────────────┴────┴──────────┘
          1B    3B (trou)     4B          1B    3B (trou)
\`\`\`

3 octets perdus après \`c\` (pour aligner \`i\`), 3 après \`d\` (pour que le tableau de structs reste aligné). **Range les champs du plus grand au plus petit** pour minimiser les trous :

\`\`\`c
struct Good { int i; char c; char d; };  // sizeof == 8
\`\`\`

### union : partager la même mémoire

Une \`union\` range tous ses champs **au même endroit** : sa taille = celle du plus grand champ. Un seul champ est valide à la fois.

\`\`\`c
union Value {
    int    i;     // 4 octets
    float  f;     // 4 octets
    char   bytes[4];
};
union Value v;
v.i = 0x41424344;
printf("%c\\n", v.bytes[0]);  // 'D' (little-endian) : MÊME mémoire relue autrement
\`\`\`

\`\`\`
   union (4 octets, partagés) :
   ┌────────────────────┐
   │  i  /  f  /  bytes  │   les 3 vues regardent les MÊMES octets
   └────────────────────┘
\`\`\`

Utile (parser binaire, type-punning contrôlé), dangereux (écrire \`i\` puis lire \`f\` = interprétation hasardeuse). À utiliser en connaissance de cause.

### enum : nommer des états

\`\`\`c
enum State { IDLE, RUNNING, DONE };   // valent 0, 1, 2 automatiquement
enum State s = RUNNING;               // s vaut 1
\`\`\`

C'est juste des constantes entières nommées. Plus lisible qu'écrire \`1\` partout, et le compilateur peut t'avertir si un \`switch\` oublie un cas.

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -g struct.c -o struct && ./struct
\`\`\`

### ⚠️ Pièges

- **Supposer \`sizeof(struct) == somme des champs\`** : faux à cause du padding. Ne sérialise jamais une struct brute vers un fichier/réseau sans gérer le padding et l'endianness.
- **Lire un champ d'union autre que le dernier écrit** : interprétation indéfinie des octets.
- **Oublier \`->\` vs \`.\`** : \`.\` sur une struct, \`->\` sur un pointeur de struct. Mélanger = erreur de compilation (utile, elle).
- **Comparer deux structs avec \`==\`** : interdit. Compare champ par champ (ou \`memcmp\`, en se méfiant du padding non initialisé).

### À écrire dans ton carnet

> Calcule à la main \`sizeof\` de \`struct { char a; double b; char c; };\` en supposant alignement 8 pour le double, puis réordonne les champs pour minimiser la taille. Vérifie avec un \`printf\`.
`,

  "stack-vs-heap": `## Pile vs tas : où vivent tes données

En JS, tu ne décides jamais où vit une variable ni quand elle meurt : le moteur place, le garbage collector ramasse. En C, tu choisis entre deux territoires aux règles opposées — **la pile** (automatique) et **le tas** (manuel) — et confondre les deux est la source du bug "je renvoie un pointeur vers une variable locale".

### L'analogie du bureau vs l'entrepôt

- **La pile**, c'est ton bureau pendant une tâche : tu poses tes affaires, et **dès que la tâche finit, tout est balayé d'un coup**. Rapide, automatique, mais éphémère.
- **Le tas**, c'est un entrepôt : tu demandes un emplacement (\`malloc\`), il reste réservé **tant que tu ne le libères pas toi-même** (\`free\`). Durable, mais tu es responsable du ménage.

### La pile : un empilement de stack frames

À chaque appel de fonction, un **stack frame** est empilé : il contient les paramètres, les variables locales, et l'**adresse de retour** (où reprendre après le \`return\`). Au \`return\`, le frame est dépilé d'un coup.

\`\`\`c
void b(void) { int y = 2; /* ... */ }
void a(void) { int x = 1; b(); }
int main(void) { a(); return 0; }
\`\`\`

\`\`\`
  pendant l'exécution de b() :         après le return de b() :
  ┌───────────────────┐ ← sommet       ┌───────────────────┐
  │ frame b: y=2       │                │ frame a: x=1      │ ← y a disparu
  │   adresse retour → a                │   adresse retour → main
  ├───────────────────┤                ├───────────────────┤
  │ frame a: x=1       │                │ frame main        │
  │   adresse retour → main            └───────────────────┘
  ├───────────────────┤
  │ frame main         │
  └───────────────────┘
  la pile grandit vers le BAS
\`\`\`

Variables locales = automatiques : créées à l'entrée, **détruites au \`return\`**. Pas de \`free\` à faire, mais aussi pas de survie après la fonction.

### Le bug classique : renvoyer un pointeur vers la pile

\`\`\`c
int *broken(void) {
    int x = 42;
    return &x;      // ⛔ x meurt au return : le pointeur est "dangling"
}
int main(void) {
    int *p = broken();
    printf("%d\\n", *p);   // UB : on lit un frame déjà dépilé
}
\`\`\`

\`\`\`
  au return de broken(), son frame est dépilé :
  l'adresse renvoyée pointe vers une zone RÉUTILISABLE par le prochain appel.
  *p lit donc une valeur qui peut avoir été écrasée → use-after-return.
\`\`\`

### La solution : allouer sur le tas

\`\`\`c
int *ok(void) {
    int *x = malloc(sizeof *x);   // vit sur le TAS, survit au return
    if (!x) return NULL;
    *x = 42;
    return x;                     // l'appelant devra free()
}
\`\`\`

Le tas ignore le scope des fonctions : la mémoire reste tienne jusqu'au \`free\`. C'est le sujet du skill suivant (malloc/free).

### Tableau : pile vs tas

\`\`\`c
int small[1000];                       // pile : OK, détruit au return
int *big = malloc(1000000 * sizeof(int)); // tas : pour le gros / le durable
\`\`\`

La pile est petite (souvent ~8 Mo) : un énorme tableau local ou une récursion infinie = **stack overflow** (la pile percute le tas).

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g sh.c -o sh && ./sh
\`\`\`

Renvoyer \`&x\` puis l'utiliser déclenche souvent \`stack-use-after-return\` sous ASan (active \`ASAN_OPTIONS=detect_stack_use_after_return=1\`). gcc avertit aussi : \`warning: function returns address of local variable\`.

### ⚠️ Pièges

- **Renvoyer/stocker l'adresse d'une locale** au-delà de la fonction : UB silencieux qui "marche" parfois puis explose.
- **Gros tableau local** : risque de stack overflow. Au-delà de quelques Ko, passe par le tas.
- **Récursion profonde non bornée** : chaque appel empile un frame → la pile déborde.
- **Croire que la pile "se vide" comme un GC** : non, elle est automatique mais bornée et locale au scope ; le tas, lui, ne se vide JAMAIS tout seul.

### À écrire dans ton carnet

> Dessine la pile pendant \`main → a → b\` puis après le retour de \`b\`. Explique avec tes mots pourquoi \`return &x;\` sur une locale est un bug, et réécris la fonction pour qu'elle marche via \`malloc\`.
`,

  "dynamic-allocation": `## Allocation dynamique : malloc / free / realloc

Voici le territoire que JS te cachait entièrement. En JS, \`{}\`, \`[]\`, \`new\` réservent de la mémoire et le **garbage collector** la rend quand plus personne ne la référence. En C, **il n'y a pas de GC** : tu réserves avec \`malloc\`, tu rends avec \`free\`, et chaque oubli est une fuite, chaque double-rendu un crash.

### L'analogie de la location

\`malloc\` = tu loues un emplacement à l'entrepôt (le tas). On te donne une **clé** (un pointeur). Tant que tu ne rends pas la clé (\`free\`), l'emplacement est à toi — et te coûte de la mémoire. Si tu perds la clé sans rendre, l'emplacement reste loué pour toujours : **c'est la fuite**.

### malloc : réserver

\`\`\`c
#include <stdlib.h>
int *p = malloc(10 * sizeof(int));   // réserve 10 int sur le tas
if (p == NULL) {                     // TOUJOURS vérifier : malloc peut échouer
    perror("malloc");
    return 1;
}
for (int i = 0; i < 10; i++) p[i] = i * i;
free(p);                             // rend la mémoire
p = NULL;                            // réflexe : évite le dangling pointer
\`\`\`

\`\`\`
  pile :                    tas :
  ┌──────────┐             ┌────┬────┬────┬─── ... ──┐
  │ p = 0x55 │ ──────────→ │ 0  │ 1  │ 4  │  ...  81  │
  └──────────┘             └────┴────┴────┴───────────┘
  p (8 octets) vit sur la  40 octets (10 × 4) sur le tas, durables
  pile ; il pointe vers le tas
\`\`\`

\`malloc(n)\` rend de la mémoire **non initialisée** (contenu garbage). Ne lis jamais avant d'écrire.

### calloc : réserver + mettre à zéro

\`\`\`c
int *p = calloc(10, sizeof(int));   // 10 int, tous à 0
\`\`\`

\`calloc(nmemb, size)\` zéro-initialise ET protège contre l'integer overflow du produit (skill integer-overflow). Préfère-le quand tu veux du zéro.

### realloc : redimensionner

\`\`\`c
int *tmp = realloc(p, 20 * sizeof(int));  // agrandit à 20 int
if (tmp == NULL) { free(p); return 1; }   // p est INTACT si realloc échoue
p = tmp;                                   // n'écrase p qu'après succès
\`\`\`

\`realloc\` peut **déplacer** le bloc (et copier le contenu) : l'ancien pointeur devient invalide, n'utilise que celui renvoyé. Le piège mortel : \`p = realloc(p, ...)\` — si ça échoue, tu as écrasé \`p\` avec NULL et perdu l'ancien bloc (fuite). Passe par \`tmp\`.

### La règle d'or et l'ownership

> **1 malloc = 1 free. Pas plus, pas moins.**

Chaque bloc a un **propriétaire** : celui responsable de le libérer. Décide-le explicitement (qui alloue ? qui libère ?) et documente-le. En C, l'ownership n'est pas dans le langage — il est dans ta tête et tes commentaires.

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g mem.c -o mem && ./mem
# ou, sous Linux :
valgrind --leak-check=full ./mem
\`\`\`

- Oubli de \`free\` → valgrind : \`definitely lost: 40 bytes in 1 blocks\`. ASan : \`detected memory leaks\`.
- Lecture avant écriture → valgrind : \`Conditional jump ... uninitialised value\`.

### ⚠️ Pièges

- **Ne pas vérifier \`malloc != NULL\`** puis déréférencer : segfault sous pression mémoire.
- **Fuite** : perdre le dernier pointeur vers un bloc sans \`free\` (réassigner \`p\` à un nouveau malloc sans libérer l'ancien).
- **\`p = realloc(p, ...)\`** : fuite si échec. Toujours via une variable temporaire.
- **Lire de la mémoire \`malloc\`** non initialisée : valeurs garbage. Utilise \`calloc\` ou écris d'abord.
- **\`sizeof\` mal calculé** : préfère \`malloc(n * sizeof *p)\` (taille déduite du pointeur, sans répéter le type).

### À écrire dans ton carnet

> Écris une fonction qui alloue un tableau de \`n\` int, le remplit avec \`i*i\`, l'affiche, puis le libère — avec vérif NULL et \`p = NULL\` après free. Lance-la sous ASan/valgrind et confirme "0 leak".
`,

  "function-pointers": `## Pointeurs de fonction & callbacks

Tu as appris qu'une variable a une adresse. Surprise : **une fonction aussi**. Son code vit dans le segment \`text\`, à une adresse fixe. Un pointeur de fonction stocke cette adresse — et te permet de passer un comportement en paramètre, exactement comme un callback en JS.

### Pont JS direct

En JS tu fais ça tout le temps :

\`\`\`js
[3,1,2].sort((a, b) => a - b);   // tu passes une FONCTION en argument
arr.forEach(doSomething);
\`\`\`

En C, c'est pareil, mais tu dois écrire le **type** du pointeur de fonction explicitement.

### La syntaxe (qui fait peur, puis plus du tout)

\`\`\`c
int add(int a, int b) { return a + b; }

int (*fp)(int, int);   // fp = pointeur vers une fonction (int,int)->int
fp = add;              // une fonction se "dégrade" en son adresse (pas de &)
int r = fp(2, 3);      // appel via le pointeur : 5
\`\`\`

Lecture de \`int (*fp)(int, int)\` : "fp est un pointeur (\`*fp\`) vers une fonction qui prend (int, int) et renvoie int". Les parenthèses autour de \`*fp\` sont obligatoires.

\`\`\`
  segment text :                pile :
  ┌──────────────────┐         ┌──────────┐
  │ code de add()    │ ←────── │ fp=0x401 │   fp contient l'adresse du code de add
  │ à l'adresse 0x401│         └──────────┘
  └──────────────────┘
  fp(2,3) = "saute à 0x401 et exécute"
\`\`\`

### Callback : qsort, le cas d'école

\`\`\`c
#include <stdlib.h>
int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);   // -1, 0 ou 1 (sans overflow, contrairement à x-y)
}
int main(void) {
    int arr[] = {3, 1, 2};
    qsort(arr, 3, sizeof(int), cmp_int);   // on PASSE notre comparateur
    return 0;   // arr trié : {1,2,3}
}
\`\`\`

\`qsort\` ne connaît pas tes données ; tu lui donnes une fonction qui sait comparer. C'est le pattern du callback, en C.

### Table de dispatch : remplacer un switch géant

\`\`\`c
int add(int a, int b){return a+b;}
int sub(int a, int b){return a-b;}
int mul(int a, int b){return a*b;}

int (*ops[3])(int, int) = { add, sub, mul };  // tableau de pointeurs de fonction
int r = ops[1](10, 4);   // appelle sub → 6
\`\`\`

Au lieu d'un \`switch\` à rallonge, tu indexes un tableau de comportements. C'est la base des machines à états, des interpréteurs et du "plugin pattern" en C.

### Lien avec la sécu (à connaître)

Un pointeur de fonction dit au CPU **où sauter pour exécuter du code**. Si un attaquant arrive à écraser un pointeur de fonction (via un débordement), il peut **détourner le flux d'exécution** vers du code qu'il choisit. C'est pourquoi les pointeurs de fonction et les tables virtuelles sont des cibles classiques — et pourquoi les défenses modernes (CFI, RELRO) les protègent. Tu approfondiras côté défense dans les skills sécu.

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -g fp.c -o fp && ./fp
\`\`\`

### ⚠️ Pièges

- **Signature qui ne colle pas** : appeler via un pointeur de fonction dont le type ne correspond pas à la vraie fonction = UB. Le type doit être exact.
- **Oublier les parenthèses** : \`int *fp(int)\` déclare une fonction qui renvoie \`int*\`, pas un pointeur de fonction. C'est \`int (*fp)(int)\`.
- **Comparateur qsort en \`x - y\`** : peut déborder (integer overflow) pour de grandes valeurs. Préfère \`(x>y)-(x<y)\`.
- **Pointeur de fonction NULL** appelé : segfault. Initialise-les.

### À écrire dans ton carnet

> Déclare un type \`typedef int (*BinOp)(int,int);\`, écris add/sub/mul, range-les dans un tableau \`BinOp ops[]\`, et appelle chacun dans une boucle. Note pourquoi un tableau de pointeurs de fonction remplace avantageusement un gros switch.
`,

  "makefile-headers": `## Makefile, headers & compilation modulaire

En JS, tu \`import\`/\`export\` et le bundler s'occupe du reste. En C, tu découpes ton code en \`.c\` (les définitions) et \`.h\` (les déclarations), et tu orchestres la compilation toi-même avec un **Makefile**. C'est rustique mais limpide — et obligatoire à 42.

### Déclaration vs définition

\`\`\`c
int add(int, int);          // DÉCLARATION : "add existe, voici sa signature"
int add(int a, int b) { return a + b; }   // DÉFINITION : le corps
\`\`\`

Le \`.h\` contient les **déclarations** (le contrat), le \`.c\` contient les **définitions** (le code). Les autres fichiers \`#include\` le \`.h\` pour connaître le contrat sans voir le code.

### Le projet en 3 fichiers

\`\`\`c
/* math_utils.h */
#ifndef MATH_UTILS_H        // include guard : empêche la double inclusion
#define MATH_UTILS_H
int add(int a, int b);
#endif
\`\`\`

\`\`\`c
/* math_utils.c */
#include "math_utils.h"
int add(int a, int b) { return a + b; }
\`\`\`

\`\`\`c
/* main.c */
#include <stdio.h>
#include "math_utils.h"
int main(void) { printf("%d\\n", add(2, 3)); return 0; }
\`\`\`

### Include guards : pourquoi #ifndef

Sans garde, si deux fichiers incluent le même \`.h\`, ses déclarations apparaissent deux fois → erreurs de redéfinition. L'idiome \`#ifndef / #define / #endif\` (ou \`#pragma once\`) garantit qu'un header n'est inclus **qu'une fois** par unité de compilation.

\`\`\`
  main.c inclut math_utils.h  ──┐
                                 ├─→ sans guard : "add" déclaré 2× → erreur
  util.c inclut math_utils.h  ──┘   avec guard : la 2e inclusion est ignorée
\`\`\`

### Le Makefile minimal correct

\`\`\`make
CC      = gcc
CFLAGS  = -Wall -Wextra -Werror -g
OBJS    = main.o math_utils.o

all: prog

prog: $(OBJS)
	$(CC) $(CFLAGS) -o prog $(OBJS)

# règle générique : un .o dépend de son .c
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) prog

.PHONY: all clean
\`\`\`

⚠️ Les commandes sous une cible doivent être indentées par une **tabulation**, pas des espaces — erreur n°1 du Makefile.

### Compilation incrémentale : le pourquoi du Makefile

\`make\` compare les dates : il ne recompile un \`.o\` que si son \`.c\` (ou un \`.h\` dont il dépend) a changé. Sur un gros projet, tu ne recompiles que ce qui bouge.

\`\`\`
  main.c modifié  → main.o recompilé → prog relié
  math_utils.c inchangé → math_utils.o réutilisé tel quel
\`\`\`

### -Wall -Wextra -Werror : ton premier reviewer

\`\`\`bash
make            # compile tout proprement
\`\`\`

\`-Wall -Wextra\` activent un max d'avertissements (variable non utilisée, comparaison signé/non signé, retour manquant...). \`-Werror\` transforme chaque warning en erreur : **impossible de livrer du code qui "warne"**. C'est la norme 42 et une excellente habitude.

### ⚠️ Pièges

- **Espaces au lieu de tabulation** dans les recettes → \`Makefile:N: *** missing separator\`.
- **Mettre des définitions (du code) dans un \`.h\`** : si deux \`.c\` l'incluent, le linker voit la fonction deux fois → \`multiple definition\`. Le \`.h\` ne contient que des déclarations (et \`inline\`/macros).
- **Oublier les include guards** : double inclusion → redéfinitions.
- **Oublier de lister un \`.o\` dans le Makefile** : \`undefined reference\` au link.

### À écrire dans ton carnet

> Recrée ce projet 3 fichiers + Makefile. Lance \`make\`, modifie SEULEMENT \`main.c\`, relance \`make\` et observe que \`math_utils.o\` n'est PAS recompilé. Puis ajoute une fonction dans le \`.c\` sans la déclarer dans le \`.h\` et explique pourquoi \`main.c\` ne peut pas l'appeler.
`,

  "undefined-behavior": `## Undefined Behavior : le piège invisible

C'est le concept le plus déroutant pour un dev venu de JS. En JS, presque tout est défini : lire hors limites → \`undefined\`, diviser par zéro → \`Infinity\`. En C, certaines opérations sont **Undefined Behavior (UB)** : le standard ne dit RIEN sur ce qui se passe. Le compilateur a le droit de faire littéralement n'importe quoi — et il en profite pour optimiser.

### L'analogie du contrat

Le standard C est un contrat entre toi et le compilateur. Tu promets : "je ne ferai jamais d'UB". En échange, le compilateur promet d'optimiser agressivement **en supposant que ta promesse est tenue**. Si tu trahis (un seul UB), le contrat est rompu : tout le programme devient non spécifié, pas seulement la ligne fautive.

### "Ça marche en debug, ça explose en -O2"

C'est la signature de l'UB. En \`-O0\` le compilateur n'optimise pas, le bug passe inaperçu. En \`-O2\`, il exploite ta "promesse" et supprime du code que tu croyais utile :

\`\`\`c
int f(int *p) {
    int x = *p;          // déréférence p
    if (p == NULL)       // ... puis teste si p est NULL
        return -1;
    return x;
}
// Le compilo raisonne : "tu as déréférencé p ligne 1, donc p != NULL
// (sinon UB). Le test ligne 3 est donc TOUJOURS faux → je le SUPPRIME."
// Résultat en -O2 : le if disparaît, surprise au runtime.
\`\`\`

### Le bestiaire des UB courants

\`\`\`c
int a;
printf("%d", a);            // 1. lecture d'une variable NON initialisée

int x = INT_MAX;
x = x + 1;                  // 2. overflow d'un SIGNÉ (≠ unsigned, qui wrap proprement)

int *p = NULL;
*p = 5;                     // 3. déréférencement de NULL

free(ptr);
*ptr = 1;                   // 4. accès après free (use-after-free)

int arr[3];
arr[5] = 1;                 // 5. hors limites

int i = 0;
int y = i++ + i++;          // 6. ordre d'évaluation non spécifié sur même variable
\`\`\`

\`\`\`
  UB ≠ "valeur bizarre". UB = "le standard t'abandonne".
  Conséquences possibles : crash, valeur fausse, code supprimé,
  faille de sécu, ou rien... jusqu'au jour où ça casse en prod.
\`\`\`

### Signé vs non signé : la nuance qui compte

\`\`\`c
unsigned int u = 0;  u = u - 1;   // DÉFINI : wrap à 4294967295 (modulo 2^32)
int          s = INT_MAX; s + 1;  // UB : overflow signé, le compilo peut tout casser
\`\`\`

L'overflow non signé est garanti (utile pour les masques/hash). L'overflow signé est UB — d'où l'intérêt de \`-fsanitize=undefined\`.

### "Ça compile" ≠ "c'est correct"

Le compilateur vérifie la **syntaxe** et les **types**, pas la **validité runtime**. Un programme plein d'UB compile sans broncher. C'est pour ça que les sanitizers existent.

### Compiler et détecter

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address,undefined -g ub.c -o ub && ./ub
\`\`\`

\`-fsanitize=undefined\` (UBSan) attrape à l'exécution : overflow signé, déréf NULL, shift invalide... Exemple : \`runtime error: signed integer overflow: 2147483647 + 1\`. valgrind attrape les UB mémoire (non-init, hors limites, use-after-free).

### ⚠️ Pièges

- **Tester ta seule build debug** : l'UB peut dormir en \`-O0\` et se réveiller en \`-O2\`. Teste les deux + sanitizers.
- **Croire que "ça a marché 100 fois" = correct** : l'UB peut donner le bon résultat par chance, puis changer au prochain compilateur.
- **Overflow signé "pour faire un modulo"** : utilise du non signé si tu veux le wrap.
- **\`i++ + i++\`, \`a[i] = i++\`** : ordre d'évaluation non séquencé = UB. Une modification par expression sur une variable.

### À écrire dans ton carnet

> Liste 5 UB de mémoire (cite-les) et, pour chacun, l'outil qui le détecte (ASan/UBSan/valgrind). Puis explique avec tes mots pourquoi "déréférencer p avant de tester p == NULL" peut faire disparaître le test en -O2.
`,

  "debugging-gdb-valgrind": `## Débugger : gdb + valgrind + AddressSanitizer

En JS tu as la stack trace, le debugger du navigateur, \`console.log\`. En C, déboguer la mémoire demande des outils dédiés. Ce triptyque — **gdb** (inspecter l'exécution), **valgrind** (traquer fuites/corruptions), **ASan** (overflow exact) — te fait gagner des heures. C'est non négociable pour le module.

### gdb : piloter ton programme pas à pas

Compile toujours avec \`-g\` (symboles de debug) :

\`\`\`bash
gcc -Wall -Wextra -Werror -g prog.c -o prog
gdb ./prog
\`\`\`

Les commandes vitales :

\`\`\`
break main         (b)  pose un point d'arrêt sur main
run                (r)  lance le programme
next               (n)  ligne suivante (sans entrer dans les fonctions)
step               (s)  ligne suivante (EN entrant dans les fonctions)
print x            (p)  affiche la valeur de x
print *p           (p)  affiche ce que pointe p
backtrace          (bt) la pile d'appels au point courant
continue           (c)  reprend jusqu'au prochain break
x/4xw arr          examine 4 mots hexa à partir de arr (examine memory)
quit               (q)  sortir
\`\`\`

### Trouver QUI crashe avec backtrace

\`\`\`
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
0x... in process (p=0x0) at prog.c:8
8           return *p;
(gdb) backtrace
#0  process (p=0x0) at prog.c:8      ← le crash : p vaut NULL
#1  main () at prog.c:14             ← qui a appelé process
\`\`\`

\`backtrace\` te donne le chemin d'appels exact jusqu'au crash, et \`p=0x0\` te dit que \`p\` était NULL. Tu sais quoi corriger en 10 secondes.

### Examiner la mémoire brute

\`\`\`
(gdb) x/4xw arr
0x7fff...:  0x0000000a  0x00000014  0x0000001e  0x00000028
            (10)        (20)        (30)        (40)
\`\`\`

\`x\` = examine ; \`4\` = 4 unités ; \`x\` = format hexa ; \`w\` = word (4 octets). Tu vois les octets exacts d'un tableau ou d'une struct.

### valgrind : le détecteur de fuites et corruptions (Linux)

\`\`\`bash
valgrind --leak-check=full --track-origins=yes ./prog
\`\`\`

Il instrumente chaque accès mémoire :

\`\`\`
==1234== Invalid write of size 4
==1234==    at 0x...: main (prog.c:10)          ← l'écriture hors limites + ligne
==1234==  Address 0x... is 0 bytes after a block of size 16 alloc'd
...
==1234== LEAK SUMMARY:
==1234==    definitely lost: 40 bytes in 1 blocks   ← une fuite, non libérée
\`\`\`

Il voit : hors limites, lecture non initialisée, use-after-free, double-free, fuites. Plus lent (~10×) mais exhaustif.

### AddressSanitizer : plus rapide, intégré au compilo

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g prog.c -o prog && ./prog
\`\`\`

\`\`\`
==1234==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x...
WRITE of size 4 at 0x... thread T0
    #0 ... in main prog.c:10                     ← ligne exacte de l'overflow
0x... is located 0 bytes to the right of 16-byte region [..]
allocated by thread T0 here:
    #0 malloc
    #1 main prog.c:8                             ← où le bloc a été alloué
\`\`\`

ASan te donne l'adresse, la taille, l'opération (READ/WRITE) ET où la zone a été allouée. Sur macOS où valgrind est capricieux, ASan est ton outil principal.

### Quel outil pour quoi

\`\`\`
  symptôme                        outil
  ──────────────────────────────  ─────────────────────────
  ça crashe, je veux voir où      gdb + backtrace
  fuite mémoire suspecte          valgrind --leak-check=full
  overflow/use-after-free exact   ASan (ou valgrind)
  inspecter une valeur en live    gdb : print / x
\`\`\`

### ⚠️ Pièges

- **Oublier \`-g\`** : gdb/ASan te donnent des adresses sans noms de fonctions ni lignes. Toujours \`-g\` en debug.
- **Débugger une build \`-O2\`** : les optimisations réordonnent/suppriment du code → "valeur optimisée away". Débugue en \`-O0 -g\`.
- **Ignorer un warning ASan/valgrind comme "ça marche quand même"** : un \`Invalid read\` est un vrai bug latent.
- **Combiner valgrind ET ASan en même temps** : ils ne cohabitent pas. Choisis l'un OU l'autre.

### À écrire dans ton carnet

> Écris un programme qui déréférence NULL, lance-le sous gdb, et note la sortie de \`backtrace\`. Puis écris un \`malloc\` sans \`free\`, passe-le à valgrind/ASan et recopie la ligne "definitely lost" / "memory leaks".
`,

  "bit-manipulation": `## Manipulation de bits & masques

En JS tu as bien \`&\`, \`|\`, \`<<\`, mais tu t'en sers rarement (et JS convertit en 32 bits sous le capot). En C, manipuler les bits est partout : flags compactés, protocoles binaires, optimisations, crypto. C'est aussi là qu'on prend l'habitude de penser en représentation binaire — utile pour comprendre l'integer overflow et le réseau.

### Les opérateurs bitwise

\`\`\`c
unsigned int a = 0b1100;   // 12
unsigned int b = 0b1010;   // 10
a & b    // 0b1000 = 8   ET : 1 si les DEUX bits sont à 1
a | b    // 0b1110 = 14  OU : 1 si AU MOINS un bit à 1
a ^ b    // 0b0110 = 6   XOR : 1 si les bits DIFFÈRENT
~a       // inverse tous les bits (dépend de la largeur du type)
a << 1   // 0b11000 = 24 décalage gauche : ×2
a >> 1   // 0b0110 = 6   décalage droite : ÷2 (sur non signé)
\`\`\`

⚠️ Ne confonds pas \`&\`/\`|\` (bitwise, sur les bits) avec \`&&\`/\`||\` (logiques, sur vrai/faux).

### Les 3 opérations sur UN bit (les masques)

\`\`\`c
unsigned int flags = 0;
//             bit n :  ...3 2 1 0

flags |=  (1u << 2);   // POSER le bit 2     → 0b0100
flags &= ~(1u << 2);   // EFFACER le bit 2   → 0b0000
flags ^=  (1u << 2);   // BASCULER le bit 2
int on = (flags >> 2) & 1u;   // LIRE le bit 2 (0 ou 1)
\`\`\`

\`\`\`
  poser bit 2 :   flags |= (1<<2)
     1<<2 =  0 0 1 0 0   ← le masque, un seul bit allumé
     flags|=          → ce bit passe à 1, les autres inchangés

  effacer bit 2 : flags &= ~(1<<2)
    ~(1<<2)= 1 1 0 1 1   ← masque inversé, un seul bit éteint
     flags&=          → ce bit passe à 0, les autres inchangés
\`\`\`

### Flags compactés dans un int

Au lieu de 8 booléens (8 octets+), un seul \`int\` porte 32 flags :

\`\`\`c
#define PERM_READ   (1u << 0)
#define PERM_WRITE  (1u << 1)
#define PERM_EXEC   (1u << 2)

unsigned int perms = PERM_READ | PERM_WRITE;   // lecture + écriture
if (perms & PERM_WRITE) { /* a le droit d'écrire */ }
perms &= ~PERM_WRITE;                           // retire l'écriture
\`\`\`

C'est exactement comment Unix encode \`rwx\` (chmod 755).

### L'astuce culte : x & (x - 1)

\`\`\`c
x & (x - 1)   // efface le bit à 1 de poids le plus FAIBLE
\`\`\`

\`\`\`
  x      = 0 1 0 1 1 0 0   (le plus bas "1" est en position 2)
  x - 1  = 0 1 0 1 0 1 1   (emprunte : inverse tout après ce bit)
  x&(x-1)= 0 1 0 1 0 0 0   ← ce bit a disparu
\`\`\`

D'où le popcount efficace : boucle \`x &= (x-1); count++;\` autant de fois qu'il y a de bits à 1 (tu l'as codé dans l'exo popcount).

### ×2 / ÷2 = shift

\`\`\`c
n << 3   // n × 8   (décaler de k = ×2^k)
n >> 1   // n / 2   (sur non signé ; arrondi vers le bas)
\`\`\`

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -g bits.c -o bits && ./bits
\`\`\`

### ⚠️ Pièges

- **Décaler sur du SIGNÉ** : \`>>\` sur un négatif est défini par l'implémentation, et \`<<\` qui touche le bit de signe est UB. **Travaille sur du \`unsigned\`** pour les manips de bits.
- **Décaler de >= la largeur du type** (\`1u << 32\` sur un int 32 bits) : UB.
- **Oublier le \`u\`** : \`1 << 31\` est signé et peut être UB ; \`1u << 31\` est sûr.
- **\`&\` vs \`&&\`** : \`if (a & b)\` teste des bits, \`if (a && b)\` teste la véracité. Confusion classique.

### À écrire dans ton carnet

> Sans coder : pose le bit 5 et efface le bit 0 d'un \`unsigned int x\`. Puis explique pourquoi \`x & (x-1)\` efface le bit à 1 le plus bas, en déroulant l'exemple binaire \`x = 0b10110\`.
`,

  "integer-overflow": `## Integer overflow : quand un nombre déborde

🔒 Skill sécu (cadre défensif). En JS, les nombres sont des doubles : ils perdent en précision mais ne "wrappent" pas brutalement. En C, un entier a une largeur fixe (skill memory-model-types) : dépasse sa plage, et il **déborde** — soit en revenant à zéro (non signé), soit en UB pur (signé). Cette mécanique est derrière une classe entière de failles, dont le fameux \`malloc(n * size)\` qui alloue trop peu.

### L'analogie de l'odomètre

Un compteur kilométrique mécanique à 6 chiffres : arrivé à 999999, +1 le ramène à 000000. Il n'a pas la place pour le 7e chiffre. Un entier non signé fait pareil : il calcule **modulo 2^n**.

### Non signé : le wrap est DÉFINI

\`\`\`c
unsigned char c = 255;   // 8 bits : plage 0..255
c = c + 1;               // 256 ne rentre pas → repart à 0
// c vaut 0

unsigned int u = 0;
u = u - 1;               // 0 - 1 → 4294967295 (le plus grand sur 32 bits)
\`\`\`

\`\`\`
  255 = 1 1 1 1 1 1 1 1
   +1 = 1 0 0 0 0 0 0 0 0   ← le 9e bit n'existe pas, il tombe
        └ tronqué à 8 bits → 0 0 0 0 0 0 0 0 = 0
\`\`\`

C'est **défini** (modulo 2^n) — utile pour les masques/hash, dangereux quand non anticipé.

### Signé : le débordement est UB

\`\`\`c
#include <limits.h>
int x = INT_MAX;   // 2147483647
x = x + 1;         // UB : le standard ne garantit RIEN (skill undefined-behavior)
\`\`\`

Ne compte JAMAIS sur \`INT_MAX + 1 == INT_MIN\` : le compilateur peut optimiser en supposant que ça n'arrive pas.

### 🔒 Sécu (défensif) : la faille malloc(n * size)

Le scénario classique d'une CVE de corruption mémoire :

\`\`\`c
// VULNÉRABLE : n vient de l'utilisateur
void *buf = malloc(n * sizeof(int));    // si n est énorme, n*4 DÉBORDE
for (size_t i = 0; i < n; i++)
    ((int *)buf)[i] = 0;                // écrit n int dans un bloc trop petit
\`\`\`

\`\`\`
  Attendu :  n = 1 073 741 825 (≈1 milliard)
             n * 4 = 4 294 967 300 octets (~4 Go)
  Réalité (size_t 32 bits) : 4 294 967 300 mod 2^32 = 4 octets
  → malloc rend 4 octets, la boucle écrit 4 Go → heap overflow massif
\`\`\`

L'allocation réussit (petite), mais la boucle écrit bien au-delà → corruption du tas exploitable. **C'est pour COMPRENDRE et PRÉVENIR**, pas pour exploiter.

### Se défendre : vérifier AVANT de calculer

\`\`\`c
// 1. Borne explicite
if (n > SIZE_MAX / sizeof(int)) { /* refuse : produit déborderait */ return NULL; }
void *buf = malloc(n * sizeof(int));

// 2. calloc fait la vérif pour toi (et zéro-initialise)
void *buf2 = calloc(n, sizeof(int));    // renvoie NULL si n*size déborde

// 3. détecter avec les builtins
size_t total;
if (__builtin_mul_overflow(n, sizeof(int), &total)) return NULL;  // déborde ?
void *buf3 = malloc(total);
\`\`\`

Et pour le parsing d'entrées : valide la plage **avant** tout calcul (un port \`> 65535\`, une taille \`> limite\`...).

### Détecter à la compilation/exécution

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=undefined -g int.c -o int && ./int
# UBSan : "runtime error: signed integer overflow: 2147483647 + 1"
\`\`\`

\`-ftrapv\` fait crasher net sur overflow signé (utile en test). \`-fsanitize=undefined\` est plus complet.

### ⚠️ Pièges

- **\`n * size\` sans vérif** avant un \`malloc\` : la faille n°1. Utilise \`calloc\` ou \`__builtin_mul_overflow\`.
- **Comparer signé/non signé** : \`if (len - 1 >= 0)\` où \`len\` est non signé → toujours vrai (le \`-1\` wrap en énorme positif). Source de boucles infinies et de hors-limites.
- **Indexer avec un \`int\` qui a wrappé** en négatif/énorme : accès mémoire arbitraire.
- **Croire que le wrap signé est garanti** : c'est de l'UB, pas un modulo.

### À écrire dans ton carnet

> Explique pourquoi \`malloc(n * size)\` avec \`n\` contrôlé par l'utilisateur est dangereux, et donne 2 façons de t'en protéger. Puis montre pourquoi \`size_t i; for (i = len - 1; i >= 0; i--)\` est un bug si \`len\` vaut 0.
`,

  "buffer-overflow-stack": `## Buffer overflow de pile (compris pour s'en défendre)

🔒 Skill sécu, cadre strictement défensif/pédagogique. Objectif : **comprendre** comment un débordement de buffer corrompt la pile pour savoir l'éviter dans ton code, lire un avis CVE sans paniquer, et expliquer les protections modernes. On n'écrit pas un exploit clé en main — on observe le mécanisme dans une VM/conteneur jetable, sur du code que TU compiles.

### Cadre légal & éthique (non négociable)

Tu fais ça **uniquement sur ta machine / ta VM**, sur du code que tu as écrit pour l'étudier. Toucher au système d'autrui sans autorisation écrite est un délit. Ici on apprend la défense en regardant l'attaque, pas l'inverse.

### Rappel : la pile et l'adresse de retour

Quand une fonction est appelée, son stack frame contient ses variables locales **et** l'adresse de retour sauvegardée (saved RIP) : où le CPU reprend après le \`return\` (skill stack-vs-heap).

\`\`\`
  pile (grandit vers le BAS, mais on écrit du buffer vers le HAUT) :

  adresses hautes
  ┌───────────────────────────┐
  │ saved RIP (adresse retour) │  ← écrire ici détourne le flux d'exécution
  ├───────────────────────────┤
  │ saved RBP (base frame)     │
  ├───────────────────────────┤
  │ char buf[16]               │  ← l'écriture commence ici et MONTE
  └───────────────────────────┘
  adresses basses
\`\`\`

### Le mécanisme du débordement

\`\`\`c
#include <string.h>
void vuln(const char *input) {
    char buf[16];
    strcpy(buf, input);   // ⛔ aucune borne : copie tout, même > 16
}
\`\`\`

Si \`input\` fait 40 octets, \`strcpy\` écrit 40 octets dans 16 :

\`\`\`
  buf[16] rempli...        puis ÇA DÉBORDE vers le haut :
  ┌──────────────┐
  │ "AAAAAAAA..." │ buf (16)
  ├──────────────┤
  │ "AAAA"        │ saved RBP  ← écrasé
  ├──────────────┤
  │ "AAAA"        │ saved RIP  ← écrasé : au return, le CPU saute n'importe où
  └──────────────┘
\`\`\`

D'abord les variables voisines sont écrasées, puis le RBP sauvegardé, puis l'adresse de retour. Si elle est corrompue, \`return\` envoie le CPU vers une adresse contrôlée par l'entrée → exécution détournée. \`gets()\`, \`strcpy()\`, \`scanf("%s")\` sans borne sont les coupables historiques.

### Observer (lab, jamais armer)

\`\`\`bash
# AVEC protections (défaut moderne) : tu observes la défense AGIR
gcc -Wall -Wextra -g vuln.c -o vuln
printf 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' | ./vuln
# → *** stack smashing detected ***: terminated  (le canari t'a sauvé)

# SANS protections, en VM, pour VOIR la pile se corrompre sous gdb :
gcc -fno-stack-protector -g vuln.c -o vuln_obs
gdb ./vuln_obs   # backtrace montre une adresse de retour corrompue
\`\`\`

Sous gdb, après débordement, \`backtrace\` affiche un cadre incohérent (\`0x4141414141414141\` = "AAAA...") : preuve visuelle que le saved RIP a été écrasé. **But pédagogique : voir, comprendre, refermer la VM.**

### 🔒 Sécu (défensif) : les protections à connaître

- **Stack canary** : une valeur secrète placée entre \`buf\` et le saved RIP. Avant le \`return\`, le programme vérifie qu'elle est intacte ; sinon il abort (\`stack smashing detected\`). Activé par défaut (\`-fstack-protector\`).
- **NX / DEP** : la pile est marquée non-exécutable. Même si on y injecte du code, le CPU refuse de l'exécuter.
- **ASLR** : les adresses (pile, libs, tas) sont randomisées à chaque lancement → l'attaquant ne sait plus où sauter.
- **PIE** : l'exécutable lui-même est chargé à une adresse aléatoire (complète l'ASLR).

Ces 4 défenses sont actives par défaut sur un Linux moderne. Les désactiver (\`-fno-stack-protector -no-pie -z execstack\`) ne se fait QUE pour l'observation pédagogique en VM.

### Écrire du code qui ne déborde pas

\`\`\`c
void safe(const char *input) {
    char buf[16];
    snprintf(buf, sizeof(buf), "%s", input);  // borné par sizeof(buf), toujours '\\0'
    // ou : fgets(buf, sizeof(buf), stdin);
}
\`\`\`

Règles : **jamais \`gets\`**, jamais \`strcpy\`/\`strcat\`/\`sprintf\` sans borne ; utilise \`fgets\`, \`snprintf\`, \`strncat\` avec \`sizeof\` ; compile en \`-Wall -Wextra -Werror -fsanitize=address\`.

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g safe.c -o safe
# ASan : "stack-buffer-overflow WRITE of size N" + ligne exacte si tu débordes
\`\`\`

### ⚠️ Pièges

- **\`gets()\`** : supprimé du C moderne tellement il est dangereux. Ne l'utilise jamais, même en exemple sérieux.
- **Off-by-one** : écrire \`buf[len]\` au lieu de \`buf[len-1]\` déborde d'un octet — parfois suffisant pour écraser un octet critique.
- **Désactiver les protections "pour que ça marche"** : tu retires les filets pour rien.
- **Penser que ASLR/canary rendent ton code sûr** : ce sont des filets de dernier recours ; la vraie défense est de **borner tes copies**.

### À écrire dans ton carnet

> Dessine le stack frame de \`vuln\` (buf, saved RBP, saved RIP) et montre l'ordre dans lequel un débordement les écrase. Puis explique en une phrase chacun : canary, NX, ASLR, PIE — et réécris \`vuln\` en version sûre.
`,

  "use-after-free": `## Use-after-free & double-free (compris pour s'en défendre)

🔒 Skill sécu, cadre défensif/pédagogique. \`free(p)\` rend la mémoire à l'allocateur — mais **ne touche pas à \`p\`** : \`p\` continue de pointer vers une zone désormais recyclable. Réutiliser ce pointeur (use-after-free) ou libérer deux fois (double-free) corrompt le tas. Tu apprends ça pour acquérir le réflexe \`p = NULL\` et lire les CVE de corruption de tas.

### L'analogie de la clé d'hôtel

Tu rends ta chambre (\`free\`) mais tu gardes la carte magnétique (\`p\`). La chambre est relouée à quelqu'un d'autre. Si tu réutilises ta vieille carte, tu entres dans la chambre d'un inconnu — ou tu trouves ses affaires là où tu pensais retrouver les tiennes. Pire : si tu vas "rendre" une chambre déjà rendue, tu sèmes la pagaille à la réception.

### Dangling pointer : le pointeur qui survit à sa mémoire

\`\`\`c
int *p = malloc(sizeof *p);
*p = 42;
free(p);            // la mémoire est rendue... mais p garde l'adresse !
// p est maintenant "dangling" : il pointe vers une zone réutilisable
\`\`\`

\`\`\`
  avant free :              après free(p) :
  p → [ 42 ]  (bloc à toi)  p → [ ?? ]  (même adresse, bloc rendu à l'allocateur)
                                  └ peut être réalloué à un autre malloc à tout moment
\`\`\`

### Use-after-free (UAF)

\`\`\`c
free(p);
printf("%d\\n", *p);   // ⛔ UAF : lecture d'une zone libérée (UB)
*p = 7;               // ⛔ UAF : écriture qui peut corrompre un autre objet
\`\`\`

Si un \`malloc\` ultérieur a récupéré ce bloc, écrire via \`p\` **écrase l'autre objet**. C'est exploitable : un attaquant qui contrôle l'allocation peut faire pointer un objet "libéré mais réutilisé" vers des données qu'il maîtrise.

### Double-free

\`\`\`c
free(p);
free(p);              // ⛔ double-free : corrompt les métadonnées de l'allocateur
\`\`\`

L'allocateur tient des structures internes (listes de blocs libres) à côté de tes données sur le tas. Libérer deux fois les corrompt → comportement imprévisible, souvent exploitable pour rediriger une future allocation.

### 🔒 Sécu (défensif) : pourquoi c'est grave

Ces bugs permettent de corrompre des structures de l'allocateur ou des objets vivants, ce qui peut mener à l'écriture mémoire contrôlée. La défense ne dépend pas d'un outil magique : elle vient de **règles de discipline** que tu appliques systématiquement. C'est l'esprit du module : comprendre la mécanique pour ne pas la reproduire.

### Le réflexe : free puis NULL

\`\`\`c
free(p);
p = NULL;             // p ne pointe plus vers une zone recyclable
// désormais :
// - *p  → segfault NET (crash propre, détecté tôt) au lieu d'un UAF silencieux
// - free(p) → free(NULL) est défini et SANS EFFET : plus de double-free
\`\`\`

\`free(NULL)\` est garanti sans effet par le standard : mettre \`p = NULL\` après \`free\` neutralise d'un coup l'UAF (crash franc) ET le double-free.

### Discipline d'ownership

- Un seul propriétaire libère le bloc ; documente qui c'est.
- Après \`free\`, mets le pointeur à \`NULL\` (et les éventuels alias, si tu en as).
- Méfie-toi des **alias** : \`q = p; free(p); /* q est aussi dangling */\`. Mettre \`p = NULL\` ne sauve pas \`q\`.

### Détecter

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g uaf.c -o uaf && ./uaf
\`\`\`

ASan attrape immédiatement :

\`\`\`
==..==ERROR: AddressSanitizer: heap-use-after-free
READ of size 4 at 0x...                       ← l'accès fautif + ligne
freed by thread T0 here: ... free               ← où ça a été libéré
previously allocated by thread T0 here: ... malloc
\`\`\`

Et pour le double-free : \`AddressSanitizer: attempting double-free\`. valgrind dirait \`Invalid read of size 4 ... Address is N bytes inside a block of size M free'd\`.

### ⚠️ Pièges

- **Oublier \`p = NULL\` après \`free\`** : laisse un dangling pointer prêt à exploser silencieusement plus tard.
- **Alias non remis à NULL** : un deuxième pointeur vers le même bloc reste dangling.
- **Libérer dans une boucle puis réutiliser** : UAF facile à introduire en réutilisant un élément déjà libéré.
- **\`free\` d'un pointeur qui n'a pas été \`malloc\`** (pile, ou +offset au milieu d'un bloc) : UB/crash. On ne \`free\` que ce que \`malloc\`/\`calloc\`/\`realloc\` a rendu.

### À écrire dans ton carnet

> Explique pourquoi \`free(p)\` ne suffit pas à sécuriser \`p\`, et ce que \`p = NULL\` change concrètement pour l'UAF et le double-free. Puis écris un mini-programme qui déclenche un UAF, et confirme que ASan le détecte avec le message exact.
`,

  "format-string": `## Format string (compris pour s'en défendre)

🔒 Skill sécu, cadre défensif/pédagogique. Une seule ligne — \`printf(user_input)\` au lieu de \`printf("%s", user_input)\` — transforme un simple log en faille de lecture **et d'écriture** mémoire. Tu apprends le mécanisme pour appliquer la règle d'or : **le format est TOUJOURS une constante**.

### Le cœur du problème

Le premier argument de \`printf\` n'est pas "le texte à afficher" : c'est une **chaîne de format** que \`printf\` interprète. Chaque \`%\` y déclenche une action et **va chercher un argument** correspondant... même si tu n'en as pas passé.

\`\`\`c
printf("%s", user_input);   // ✅ SÛR : le format est fixe, user_input est une donnée
printf(user_input);         // ⛔ DANGER : user_input EST le format, interprété
\`\`\`

Si \`user_input\` vaut \`"bonjour"\`, les deux affichent pareil. Mais si l'utilisateur tape \`"%x %x %x"\`...

### Pourquoi %x lit la pile

\`\`\`c
printf("%x %x %x");   // 3 conversions, ZÉRO argument fourni
\`\`\`

\`printf\` croit qu'on lui a passé 3 arguments. Il va donc les chercher là où les arguments sont d'habitude (registres puis pile), et **affiche le contenu brut de la pile** :

\`\`\`
  printf attend des args ici :   il LIT et affiche ces emplacements
  ┌─────────────────────┐        même si tu n'as rien passé →
  │ [arg1 attendu] %x → │ ──→    fuite : adresses, canari, données voisines
  │ [arg2 attendu] %x → │ ──→
  │ [arg3 attendu] %x → │ ──→
  └─────────────────────┘
\`\`\`

Avec assez de \`%x\`/\`%p\`, un attaquant lit progressivement la pile : adresses (pour défaire l'ASLR), valeur du canari, secrets voisins. C'est une **fuite d'information**.

### Pourquoi %n écrit en mémoire

\`%n\` est le conversion-specifier le plus dangereux : il **n'affiche rien**, il **écrit** le nombre de caractères déjà imprimés à l'adresse pointée par l'argument correspondant. Couplé à un contrôle de la pile, \`%n\` permet une **écriture mémoire arbitraire** — donc potentiellement un détournement complet. (On ne détaille pas la construction d'un tel exploit ; ce qui compte est de savoir POURQUOI \`%n\` rend la faille critique.)

### La règle d'or, sans exception

\`\`\`c
// ✅ Le format est TOUJOURS un littéral constant écrit par TOI :
printf("%s", user_input);
fprintf(stderr, "%s", msg);
snprintf(buf, sizeof buf, "%s", name);

// ⛔ JAMAIS une donnée externe en position de format :
printf(user_input);              // non
fprintf(log, user_controlled);   // non
\`\`\`

Si tu veux juste afficher une chaîne sans formatage : \`fputs(user_input, stdout)\` (ou \`puts\`) — pas de format du tout, donc pas de risque.

### 🔒 Sécu (défensif) : se protéger

- **\`%s\` systématique** pour toute donnée non maîtrisée. C'est 99% de la défense.
- **\`-Wformat -Wformat-security\`** (inclus dans \`-Wall -Wextra\`) : le compilateur **te prévient** quand le format n'est pas un littéral.
- **\`-Werror=format-security\`** : transforme l'avertissement en erreur de build → impossible de livrer la faille.
- En revue de code, cherche tout \`printf\`/\`fprintf\`/\`syslog\` dont le 1er argument n'est pas une constante.

\`\`\`bash
gcc -Wall -Wextra -Werror -Wformat -Wformat-security -g fmt.c -o fmt
# warning: format not a string literal and no format arguments [-Wformat-security]
\`\`\`

### ⚠️ Pièges

- **\`printf(msg)\`** où \`msg\` vient d'un fichier, du réseau, d'un argv : même si "ça marche" en test, c'est une faille dès que l'entrée contient un \`%\`.
- **\`syslog(LOG_INFO, user_input)\`** : même problème que printf, souvent oublié.
- **Croire que \`%x\` est "juste un affichage moche"** : c'est une fuite de pile exploitable, et \`%n\` ajoute l'écriture.
- **Désactiver \`-Wformat-security\`** : tu retires l'alarme qui attrape exactement ce bug.

### À écrire dans ton carnet

> Explique la différence concrète entre \`printf(user_input)\` et \`printf("%s", user_input)\`, ce que \`%x\` permet de lire et pourquoi \`%n\` est pire. Puis active \`-Wformat-security\` et vérifie qu'il signale bien un \`printf(msg)\` fautif.
`,

  "bsd-sockets-c": `## Sockets BSD en C : le réseau à nu

🔒/🛠️ Skill systèmes & sécu. En JS tu fais \`fetch()\` ou \`net.createServer()\` et le runtime gère tout. En C, tu parles directement à l'API **sockets BSD** : la même que celle sous Node, nginx, curl. Tu vois la connexion octet par octet. C'est la base du module Réseau et d'un scanner de ports — à n'utiliser que sur **ta** machine / **ta** VM.

### L'analogie du standard téléphonique

Un socket, c'est un combiné téléphonique :

- **Serveur** : il installe une ligne (\`socket\`), lui attribue un numéro (\`bind\` sur un port), branche le répondeur (\`listen\`), puis décroche à chaque appel (\`accept\`).
- **Client** : il prend un combiné (\`socket\`) et compose le numéro (\`connect\`).

Une fois connectés, ils s'échangent des octets avec \`send\`/\`recv\` (comme \`read\`/\`write\` sur un fichier — sous Unix, un socket EST un descripteur de fichier).

### Le flux des appels

\`\`\`
  SERVEUR                              CLIENT
  socket()   créer le descripteur      socket()
  bind()     attacher IP:port
  listen()   file d'attente
  accept() ◄──────── connect() ──────  connect()  établit la connexion TCP
     │                                     │
  recv()/send() ◄═══ octets ═══► send()/recv()
     │                                     │
  close()                              close()
\`\`\`

### Squelette d'un client TCP

\`\`\`c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

int main(void) {
    int fd = socket(AF_INET, SOCK_STREAM, 0);   // IPv4, TCP
    if (fd < 0) { perror("socket"); return 1; }

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof addr);
    addr.sin_family = AF_INET;
    addr.sin_port   = htons(8080);              // htons : ordre réseau (big-endian)
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

    if (connect(fd, (struct sockaddr *)&addr, sizeof addr) < 0) {
        perror("connect");                       // port fermé → connect échoue
        close(fd);
        return 1;
    }
    char buf[256];
    ssize_t n = recv(fd, buf, sizeof buf - 1, 0);  // -1 : place pour le '\\0'
    if (n > 0) { buf[n] = '\\0'; printf("%s\\n", buf); }
    close(fd);                                    // toujours fermer le descripteur
    return 0;
}
\`\`\`

### htons : pourquoi convertir l'ordre des octets

Le réseau attend les nombres en **big-endian** ("network byte order"), mais x86 est little-endian (skill memory-model-types). \`htons\` (host-to-network-short) convertit le port, \`htonl\` les adresses 32 bits :

\`\`\`
  port 8080 = 0x1F90
  en mémoire x86 (little) : 90 1F      ← faux pour le réseau
  htons(8080) →             1F 90      ← ordre réseau correct
\`\`\`

Oublier \`htons\` = tu te connectes au mauvais port sans erreur visible.

### Gestion d'erreur : errno / perror

Chaque appel système renvoie un code et positionne \`errno\`. \`perror("connect")\` affiche \`connect: Connection refused\`. **Vérifie chaque retour** : un \`accept\`/\`recv\` non testé qui rend \`-1\` puis traité comme valide = bug à octets bruts.

### 🔒 Sécu (défensif & cadre légal)

Un scanner de ports = une boucle de \`connect\` sur une plage : si \`connect\` réussit → port ouvert. C'est ainsi que fonctionne \`nmap\`. **Scanner un hôte tiers sans autorisation écrite est illégal** (atteinte à un système de traitement automatisé). Tu scannes **uniquement \`127.0.0.1\` / ta propre VM**, dans un but pédagogique : comprendre comment un outil parle aux sockets, et donc comment durcir tes propres services (timeouts, limites de connexions, fermeture propre).

### Compiler et vérifier

\`\`\`bash
gcc -Wall -Wextra -Werror -fsanitize=address -g client.c -o client && ./client
\`\`\`

ASan attrape un \`buf[n]\` hors limites si tu oublies le \`-1\` ; valgrind signale un descripteur ou un buffer non libéré.

### ⚠️ Pièges

- **Oublier \`htons\`/\`htonl\`** : connexion au mauvais port, sans message clair.
- **Ne pas tester les retours** (\`socket\`, \`connect\`, \`recv\` < 0) : traiter \`-1\` comme un succès.
- **Oublier \`close(fd)\`** : fuite de descripteurs ; après quelques milliers, \`socket\` échoue (\`Too many open files\`).
- **Oublier le \`'\\0'\`** après \`recv\` : \`recv\` ne termine PAS la chaîne, c'est toi qui poses \`buf[n] = '\\0'\` (sinon \`printf("%s")\` lit hors limites).
- **\`send\`/\`recv\` partiels** : ils peuvent transférer MOINS que demandé. Pour des messages complets, boucle jusqu'au total voulu.

### À écrire dans ton carnet

> Liste dans l'ordre les appels d'un serveur TCP (socket → bind → listen → accept → recv/send → close) et ceux d'un client. Explique pourquoi \`htons\` est nécessaire et pourquoi il faut poser \`buf[n] = '\\0'\` après \`recv\`. Rappelle la règle légale : scanner UNIQUEMENT ta propre machine.
`,
};
