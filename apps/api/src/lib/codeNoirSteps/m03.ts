// Tutoriels Code Noir "A→Z" — Module 03 (C & bas niveau).
//
// Cadre DÉFENSIF / pédagogique : chaque lab fait écrire un programme C de DÉMO
// vulnérable, le compiler, OBSERVER le comportement (crash / UB détecté),
// comprendre POURQUOI, puis CORRIGER + recompiler avec les protections et
// VÉRIFIER. Aucun shellcode ni exploit fonctionnel clé en main : on s'arrête à
// la compréhension de la faille et à sa mitigation.
//
// **À pratiquer EXCLUSIVEMENT dans une VM jetable / un conteneur de lab isolé,
// jamais sur des cibles tierces.**
//
// Convention : pour `target: "docker-c"`, le champ `code` contient le source C
// complet (un `main` de démo) ; la (les) commande(s) de compilation pertinente(s)
// sont indiquées dans `explain`.

import type { CodeNoirStepsByTechnique } from "./types";

export const stepsM03: CodeNoirStepsByTechnique = {
  // ======================================================================
  // 1) STACK BUFFER OVERFLOW
  // ======================================================================
  "buffer-overflow-stack": [
    {
      n: 1,
      title: "Écrire le programme vulnérable",
      goal: "Coder un `strcpy` non borné dans un buffer de pile de taille fixe.",
      target: "docker-c",
      explain:
        "**Cadre légal : VM jetable / conteneur de lab uniquement.**\n\n" +
        "On écrit la faille classique : `strcpy(buf, input)` sans vérifier la taille de `input`. " +
        "`buf` fait 64 octets sur la **pile** ; juste après lui se trouvent la sauvegarde de RBP " +
        "puis l'**adresse de retour**. Écrire plus de 64 octets déborde et finit par écraser cette adresse.\n\n" +
        "Compilation (volontairement sans protections, pour *voir* la faille) :\n" +
        "```bash\ngcc -g -O0 -fno-stack-protector -no-pie -z execstack vuln.c -o vuln\n```\n" +
        "On lit le source ici ; on l'exécute à l'étape suivante.",
      code: [
        "#include <stdio.h>",
        "#include <string.h>",
        "",
        "void vuln(const char *input) {",
        "  char buf[64];",
        "  strcpy(buf, input);   // BUG: aucune borne -> déborde si input > 63 + NUL",
        '  printf("buf = %s\\n", buf);',
        "}",
        "",
        "int main(int argc, char **argv) {",
        "  if (argc < 2) {",
        '    fprintf(stderr, "usage: %s <chaine>\\n", argv[0]);',
        "    return 1;",
        "  }",
        "  vuln(argv[1]);",
        '  puts("retour normal de main");',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Le programme compile (peut afficher un warning sur strcpy). Avec une entrée courte, il affiche " +
        "`buf = ...` puis `retour normal de main`.",
    },
    {
      n: 2,
      title: "Entrée saine vs entrée trop longue",
      goal: "Observer que l'overflow corrompt la pile et provoque un crash.",
      target: "docker-bash",
      explain:
        "On exécute le binaire avec une entrée normale, puis avec une entrée bien plus grande que 64 octets. " +
        "L'overflow écrase la sauvegarde de RBP et l'adresse de retour : au `ret`, le CPU saute vers une " +
        "adresse invalide → **Segmentation fault**. (On ne *contrôle* pas encore où il saute, et c'est " +
        "volontaire : le but est de constater la corruption, pas d'écrire un exploit.)",
      code:
        './vuln "AAAA"\n' +
        'echo "--- maintenant 200 octets ---"\n' +
        './vuln "$(python3 -c \'print("A"*200)\')"; echo "code de sortie: $?"',
      expected:
        "Entrée courte : sortie normale. Entrée de 200 'A' : `Segmentation fault` (code de sortie 139). " +
        "L'adresse de retour a été écrasée par 0x4141414141414141.",
    },
    {
      n: 3,
      title: "Localiser l'écrasement avec gdb",
      goal: "Confirmer que RIP/l'adresse de retour vaut bien nos octets de débordement.",
      target: "docker-bash",
      explain:
        "Sous gdb, on rejoue le crash. Au moment du `SIGSEGV`, on regarde l'adresse fautive : si le `ret` " +
        "essaie de sauter sur `0x41414141...` (le code ASCII de 'A'), c'est la **preuve** que l'adresse de " +
        "retour a été remplacée par notre buffer. C'est le diagnostic, pas une exploitation.",
      code:
        "gdb -q -batch \\\n" +
        '  -ex \'run "$(python3 -c "print(chr(65)*200)")"\' \\\n' +
        "  -ex 'info registers rip rsp' \\\n" +
        "  -ex 'bt' \\\n" +
        "  ./vuln",
      expected:
        "gdb signale `Program received signal SIGSEGV`. RIP (ou l'adresse dans la backtrace) contient " +
        "`0x4141414141414141` → l'adresse de retour a été écrasée par le débordement.",
    },
    {
      n: 4,
      title: "Pourquoi c'est dangereux (et ce qui le bloque aujourd'hui)",
      goal: "Comprendre la chaîne overflow → contrôle du flux, et les 3 barrières modernes.",
      target: "read",
      explain:
        "Contrôler l'adresse de retour = potentiellement **contrôler le flux d'exécution**. Historiquement " +
        "on plaçait du shellcode dans `buf` et on faisait pointer le `ret` dessus. Trois protections cassent " +
        "cet exploit naïf :\n\n" +
        "- **Stack canary** (`-fstack-protector`) : une valeur aléatoire posée juste avant l'adresse de retour. " +
        "Un overflow linéaire l'écrase ; le prologue vérifie sa valeur au retour et fait `abort()` → " +
        "**stack smashing detected** au lieu d'un détournement.\n" +
        "- **NX / DEP** : la pile n'est plus exécutable → impossible d'y exécuter du shellcode (d'où l'apparition " +
        "du ROP, cf. `rop-intro`).\n" +
        "- **ASLR / PIE** : pile, libs et binaire sont à des adresses randomisées → plus d'adresse en dur sans " +
        "fuite d'info préalable.\n\n" +
        "Comprendre ces trois barrières, c'est comprendre l'essentiel de la sécu mémoire moderne.",
    },
    {
      n: 5,
      title: "Corriger : borner la copie",
      goal: "Remplacer `strcpy` par une copie bornée qui ne peut plus déborder.",
      target: "docker-c",
      explain:
        "La correction de fond : ne jamais copier sans connaître la taille de destination. On utilise " +
        "`snprintf` (ou `strncpy` + NUL forcé, ou `fgets`). La famille `gets/strcpy/strcat/sprintf/scanf(\"%s\")` " +
        "est à bannir.\n\n" +
        "On recompile **avec toutes les protections** :\n" +
        "```bash\ngcc -g -O2 -D_FORTIFY_SOURCE=2 -fstack-protector-strong -fPIE -pie vuln_fix.c -o vuln_fix\n" +
        './vuln_fix "$(python3 -c \'print("A"*200)\')"\n```',
      code: [
        "#include <stdio.h>",
        "#include <string.h>",
        "",
        "void safe(const char *input) {",
        "  char buf[64];",
        '  snprintf(buf, sizeof buf, "%s", input); // borné par sizeof buf, NUL garanti',
        '  printf("buf = %s\\n", buf);',
        "}",
        "",
        "int main(int argc, char **argv) {",
        "  if (argc < 2) {",
        '    fprintf(stderr, "usage: %s <chaine>\\n", argv[0]);',
        "    return 1;",
        "  }",
        "  safe(argv[1]);",
        '  puts("retour normal de main");',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Même avec 200 'A', le programme tronque proprement à 63 caractères et affiche `retour normal de main`. " +
        "Plus de Segmentation fault : l'adresse de retour n'est jamais atteinte par la copie.",
    },
    {
      n: 6,
      title: "Vérifier les protections du binaire",
      goal: "Confirmer canary / NX / PIE activés, et voir le canary attraper un overflow.",
      target: "docker-bash",
      explain:
        "`checksec` (ou `readelf`) liste les protections d'un binaire. On compare le binaire vulnérable de " +
        "l'étape 1 (no canary, no PIE) et le binaire durci. Pour la démo du canary, on recompile la version " +
        "vulnérable **avec** `-fstack-protector-all` : l'overflow déclenche désormais une mort contrôlée.\n" +
        "```bash\ngcc -g -O0 -fstack-protector-all vuln.c -o vuln_canary\n" +
        './vuln_canary "$(python3 -c \'print("A"*200)\')"\n```',
      code:
        "checksec --file=./vuln_fix 2>/dev/null || readelf -d ./vuln_fix | head\n" +
        'gcc -g -O0 -fstack-protector-all vuln.c -o vuln_canary\n' +
        './vuln_canary "$(python3 -c \'print("A"*200)\')"; echo "code de sortie: $?"',
      expected:
        "checksec montre `Canary found`, `NX enabled`, `PIE enabled` pour vuln_fix. " +
        "Le binaire vuln_canary affiche `*** stack smashing detected ***` puis `Aborted` (SIGABRT) : " +
        "le canary a stoppé le programme avant le `ret`.",
    },
  ],

  // ======================================================================
  // 2) USE-AFTER-FREE (UAF)
  // ======================================================================
  "use-after-free": [
    {
      n: 1,
      title: "Écrire le programme avec un UAF",
      goal: "Libérer un objet puis déréférencer le pointeur dangling.",
      target: "docker-c",
      explain:
        "**Cadre légal : VM jetable / lab isolé uniquement.**\n\n" +
        "Un objet contient un pointeur de fonction `handler`. On `free(o)` puis, plus loin, on oublie qu'il " +
        "est libre et on appelle `o->handler()`. C'est un **use-after-free** : on lit/exécute le contenu d'une " +
        "zone que l'allocateur peut avoir recyclée.\n\n" +
        "Compilation simple d'abord :\n```bash\ngcc -g -O0 uaf.c -o uaf\n./uaf\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "",
        "struct obj {",
        "  void (*handler)(void);",
        "  char data[32];",
        "};",
        "",
        'static void real_handler(void) { puts("handler legitime"); }',
        "",
        "int main(void) {",
        "  struct obj *o = malloc(sizeof *o);",
        "  o->handler = real_handler;",
        '  strcpy(o->data, "objet vivant");',
        "  o->handler();",
        "",
        "  free(o);            // o est libéré ...",
        "  // ... mais on garde et on réutilise le pointeur dangling :",
        '  printf("data apres free: %s\\n", o->data); // BUG: use-after-free (lecture)',
        "  o->handler();                              // BUG: use-after-free (appel)",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Sans instrumentation, le comportement est **indéfini** : souvent l'ancienne valeur est encore là et " +
        "le programme semble marcher — ce qui rend le bug sournois. Parfois crash. C'est cette imprévisibilité " +
        "qui est dangereuse.",
    },
    {
      n: 2,
      title: "Rendre le bug visible (la zone est recyclée)",
      goal: "Montrer qu'une allocation intercalée change ce que lit le pointeur dangling.",
      target: "docker-c",
      explain:
        "Le danger réel du UAF : entre le `free` et l'usage, **une autre allocation de même taille recycle la " +
        "zone**. C'est le principe du heap grooming. On le simule ici en réallouant juste après le `free` et en " +
        "y écrivant d'autres octets : la lecture via le pointeur dangling renvoie alors des données *étrangères*.\n" +
        "```bash\ngcc -g -O0 uaf_recycle.c -o uaf_recycle\n./uaf_recycle\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "",
        "struct obj { void (*handler)(void); char data[32]; };",
        'static void real_handler(void) { puts("handler legitime"); }',
        "",
        "int main(void) {",
        "  struct obj *o = malloc(sizeof *o);",
        "  o->handler = real_handler;",
        '  strcpy(o->data, "objet vivant");',
        "",
        "  free(o);  // zone liberee",
        "",
        "  // une allocation de meme taille recupere tres probablement la zone :",
        "  char *attacker = malloc(sizeof *o);",
        "  memset(attacker, 0x42, sizeof *o); // remplit de 'B'",
        "",
        '  printf("data via pointeur dangling: %.8s\\n", o->data); // lit les octets de \'attacker\'',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "La lecture via `o->data` affiche des `B` (0x42) au lieu de `objet vivant` : la zone a été recyclée par " +
        "`attacker`. Si `o->handler` était appelé, il sauterait vers une valeur contrôlée par l'allocation " +
        "intercalée → détournement de flux.",
    },
    {
      n: 3,
      title: "Détecter avec AddressSanitizer",
      goal: "Faire pointer le doigt par ASan exactement sur le use-after-free.",
      target: "docker-c",
      explain:
        "ASan place la mémoire libérée en **quarantaine** (poison) : tout accès ultérieur est intercepté avec " +
        "la pile d'allocation, de libération et d'accès. C'est l'outil n°1 pour trouver ces bugs en dev/CI.\n" +
        "On recompile le programme de l'étape 1 :\n" +
        "```bash\ngcc -g -O1 -fsanitize=address uaf.c -o uaf_asan\n./uaf_asan\n```\n" +
        "(Le `code` ci-dessous est identique au lab UAF, rejoué sous ASan.)",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "",
        "struct obj { void (*handler)(void); char data[32]; };",
        'static void real_handler(void) { puts("handler legitime"); }',
        "",
        "int main(void) {",
        "  struct obj *o = malloc(sizeof *o);",
        "  o->handler = real_handler;",
        '  strcpy(o->data, "objet vivant");',
        "  free(o);",
        '  printf("data apres free: %s\\n", o->data); // ASan stoppe ici',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "ASan affiche `ERROR: AddressSanitizer: heap-use-after-free` avec `READ of size ...`, la pile du `free` " +
        "(`freed by thread ...`) et celle de l'allocation. Le processus s'arrête sur le bug.",
    },
    {
      n: 4,
      title: "Pourquoi ça mène à du contrôle de flux",
      goal: "Relier UAF, double-free et corruption d'allocateur.",
      target: "read",
      explain:
        "Le UAF est une brique : en contrôlant ce qui réoccupe la zone libérée, l'attaquant contrôle un champ " +
        "lu par le programme — souvent un **pointeur de fonction** ou un vtable → détournement de flux. En " +
        "lecture seule, il fuit des données (fuite d'info, défait l'ASLR). Le **double-free** est un cousin : " +
        "libérer deux fois corrompt les listes libres de l'allocateur (cf. `heap-exploitation`). Cette classe " +
        "domine les CVE des **navigateurs** (objets DOM/JS référencés après libération) et des noyaux.",
    },
    {
      n: 5,
      title: "Corriger : free + NULL et ownership clair",
      goal: "Annuler le pointeur après free pour transformer tout réusage en crash net.",
      target: "docker-c",
      explain:
        "Idiome défensif : **`free(p); p = NULL;`**. Un réusage déréférence alors NULL → crash immédiat et " +
        "déterministe (pas une zone recyclée contrôlable). On clarifie aussi le *propriétaire* de l'allocation. " +
        "On garde ASan pour vérifier qu'il n'a plus rien à signaler.\n" +
        "```bash\ngcc -g -O1 -fsanitize=address uaf_fix.c -o uaf_fix\n./uaf_fix\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "",
        "struct obj { void (*handler)(void); char data[32]; };",
        'static void real_handler(void) { puts("handler legitime"); }',
        "",
        "// macro defensive : libere ET annule le pointeur",
        "#define FREE_NULL(p) do { free(p); (p) = NULL; } while (0)",
        "",
        "int main(void) {",
        "  struct obj *o = malloc(sizeof *o);",
        "  o->handler = real_handler;",
        '  strcpy(o->data, "objet vivant");',
        "  o->handler();",
        "",
        "  FREE_NULL(o); // o vaut NULL apres liberation",
        "",
        "  if (o != NULL) {        // garde : on ne reutilise plus un dangling",
        "    o->handler();",
        "  } else {",
        '    puts("objet deja libere -> aucun reusage (correct)");',
        "  }",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Sortie : `handler legitime` puis `objet deja libere -> aucun reusage (correct)`. ASan ne signale " +
        "**aucune** erreur : le UAF est éliminé.",
    },
    {
      n: 6,
      title: "Vérifier aussi avec Valgrind",
      goal: "Confirmer 'aucune fuite, aucune erreur' sur la version corrigée.",
      target: "docker-bash",
      explain:
        "Second filet : Valgrind/memcheck détecte les `Invalid read/write` après free et les fuites. On le passe " +
        "sur la version corrigée (compilée sans ASan, car les deux ne se combinent pas) pour confirmer un " +
        "rapport propre.\n" +
        "```bash\ngcc -g -O0 uaf_fix.c -o uaf_fix_dbg\n```",
      code:
        "gcc -g -O0 uaf_fix.c -o uaf_fix_dbg\n" +
        "valgrind --error-exitcode=1 --leak-check=full ./uaf_fix_dbg",
      expected:
        "Valgrind affiche `All heap blocks were freed -- no leaks are possible` et " +
        "`ERROR SUMMARY: 0 errors from 0 contexts`. Code de sortie 0.",
    },
  ],

  // ======================================================================
  // 3) FORMAT STRING
  // ======================================================================
  "format-string": [
    {
      n: 1,
      title: "Écrire le programme avec format non maîtrisé",
      goal: "Passer une chaîne utilisateur DIRECTEMENT comme format de printf.",
      target: "docker-c",
      explain:
        "**Cadre légal : VM jetable / lab isolé uniquement.**\n\n" +
        "Le bug : `printf(input)` au lieu de `printf(\"%s\", input)`. Si `input` contient des spécificateurs " +
        "(`%x`, `%s`, `%p`, `%n`), `printf` les interprète et va lire des arguments **qui n'existent pas** " +
        "(pris sur la pile / les registres).\n\n" +
        "On désactive FORTIFY pour voir la faille telle quelle :\n" +
        "```bash\ngcc -g -O0 -U_FORTIFY_SOURCE -Wno-format-security fmt.c -o fmt\n```",
      code: [
        "#include <stdio.h>",
        "",
        "void log_user(const char *input) {",
        "  printf(input);   // BUG: input est utilise comme FORMAT",
        '  printf("\\n");',
        "}",
        "",
        "int main(int argc, char **argv) {",
        '  const char *msg = (argc > 1) ? argv[1] : "bonjour";',
        "  log_user(msg);",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Avec une entrée normale (`bonjour`), tout semble normal — le bug est latent et ne se voit qu'avec des " +
        "spécificateurs de format.",
    },
    {
      n: 2,
      title: "Fuir la pile (lecture mémoire)",
      goal: "Constater que des %p font dumper des mots de la pile non passés en argument.",
      target: "docker-bash",
      explain:
        "On donne une suite de `%p` comme entrée. `printf` croit qu'on lui a passé autant d'arguments et " +
        "**affiche le contenu de la pile**. C'est une primitive de **lecture** : utile en pratique pour fuiter " +
        "un canary ou une adresse et défaire l'ASLR. (On observe la fuite ; on ne construit pas d'exploit.) " +
        "La syntaxe positionnelle `%7$p` lit directement le 7e mot.",
      code:
        './fmt "%p %p %p %p %p %p %p %p"\n' +
        'echo "--- positionnel ---"\n' +
        './fmt "AAAA %6$p %7$p"',
      expected:
        "Au lieu d'afficher littéralement `%p`, le programme imprime des adresses hexadécimales (`0x...`) " +
        "lues sur la pile. Preuve de la fuite mémoire (info leak).",
    },
    {
      n: 3,
      title: "Pourquoi %n est une primitive d'écriture",
      goal: "Comprendre comment %x/%n combinés donnent un write-what-where.",
      target: "read",
      explain:
        "Au-delà de la lecture, `%n` **écrit** : il stocke le *nombre d'octets déjà imprimés* à l'adresse " +
        "pointée par l'argument correspondant. En contrôlant cet argument (une adresse posée sur la pile via " +
        "l'entrée) et le compteur (largeur de champ `%100x`), on écrit une **valeur choisie à une adresse " +
        "choisie** : c'est un *write-what-where* complet → on peut écraser une entrée GOT ou un pointeur de " +
        "fonction, donc souvent RCE.\n\n" +
        "On ne construit pas la chaîne d'exploitation ici : retenir que `printf(input)` = écriture mémoire " +
        "arbitraire, et que c'est la raison de bannir le format non littéral. Outils d'étude : `pwntools " +
        "fmtstr_payload`, gdb+pwndbg.",
    },
    {
      n: 4,
      title: "Corriger : format littéral",
      goal: "Toujours fournir le format en dur, l'entrée devient un simple argument.",
      target: "docker-c",
      explain:
        "La correction est triviale et totale : `printf(\"%s\", input)` (ou `fputs(input, stdout)` / " +
        "`puts(input)`). L'entrée n'est plus interprétée, juste affichée. Même règle pour `fprintf`, " +
        "`sprintf`, `snprintf`, `syslog`, `err/warn`.\n" +
        "```bash\ngcc -g -O0 fmt_fix.c -o fmt_fix\n./fmt_fix \"%p %p %n\"\n```",
      code: [
        "#include <stdio.h>",
        "",
        "void log_user(const char *input) {",
        '  printf("%s\\n", input); // FIX: format litteral, input = simple argument',
        "}",
        "",
        "int main(int argc, char **argv) {",
        '  const char *msg = (argc > 1) ? argv[1] : "bonjour";',
        "  log_user(msg);",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "L'entrée `%p %p %n` est désormais affichée **littéralement** : `%p %p %n`. Plus aucune interprétation, " +
        "plus de fuite ni d'écriture.",
    },
    {
      n: 5,
      title: "Faire échouer la compilation du code dangereux",
      goal: "Transformer le format non littéral en erreur de build.",
      target: "docker-bash",
      explain:
        "Mieux que corriger après coup : empêcher le bug d'exister. `-Wformat -Wformat-security` avertit, et " +
        "`-Werror=format-security` **refuse de compiler** un format non constant. `-D_FORTIFY_SOURCE=2` durcit " +
        "en plus les `*printf` et neutralise `%n` dans les formats inscriptibles. On le prouve sur le source " +
        "vulnérable de l'étape 1.",
      code:
        "echo '--- le code vulnerable est maintenant rejete a la compilation ---'\n" +
        "gcc -O2 -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security fmt.c -o fmt_strict; \\\n" +
        'echo "code de sortie gcc: $?"',
      expected:
        "gcc échoue avec `error: format not a string literal and no format arguments " +
        "[-Werror=format-security]` et un code de sortie non nul. Le binaire `fmt_strict` n'est pas produit.",
    },
  ],

  // ======================================================================
  // 4) INTEGER OVERFLOW / UNDERFLOW EN C
  // ======================================================================
  "integer-overflow-c": [
    {
      n: 1,
      title: "Écrire le calcul de taille qui déborde",
      goal: "Faire wrapper `n + 1` puis sous-allouer avant une copie pleine taille.",
      target: "docker-c",
      explain:
        "**Cadre légal : VM jetable / lab isolé uniquement.**\n\n" +
        "Les entiers C ont une taille fixe et **bouclent silencieusement**. Le danger naît quand un entier " +
        "**dimensionne une allocation**. Ici `malloc(n + 1)` : si `n == 65535` (uint16_t max), `n + 1` " +
        "promu/tronqué donne 0 → `malloc(0)`, puis `memcpy` copie 65535 octets dans ~rien → **heap overflow**. " +
        "L'integer overflow ne casse pas seul : il *fabrique* le bug mémoire suivant.\n" +
        "```bash\ngcc -g -O0 intof.c -o intof\n./intof\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "#include <stdint.h>",
        "",
        "char *copy(uint16_t n, const char *src) {",
        "  uint16_t sz = (uint16_t)(n + 1);   // BUG: 65535 + 1 -> 0 (wrap)",
        '  printf("n=%u  taille allouee=%u\\n", (unsigned)n, (unsigned)sz);',
        "  char *buf = malloc(sz);",
        "  if (!buf) return NULL;",
        "  memcpy(buf, src, n);               // copie n octets dans un buffer trop petit",
        "  return buf;",
        "}",
        "",
        "int main(void) {",
        "  static char src[65536];",
        "  memset(src, 'A', sizeof src);",
        "  char *p = copy(65535, src);        // declenche le wrap",
        '  printf("copie effectuee, p=%p\\n", (void *)p);',
        "  free(p);",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Le programme affiche `taille allouee=0` alors qu'il copie 65535 octets. Selon l'allocateur : crash, " +
        "corruption silencieuse, ou message glibc type `malloc(): corrupted ...` / `free(): invalid pointer`.",
    },
    {
      n: 2,
      title: "Le piège signed/unsigned",
      goal: "Voir une longueur négative passer une borne puis exploser memcpy.",
      target: "docker-c",
      explain:
        "Variante très courante : une longueur **signée** négative contrôlée par l'extérieur. `if (len > MAX)` " +
        "est faux pour `len = -1`, donc la garde passe ; mais `memcpy` prend un `size_t` → `-1` devient " +
        "`SIZE_MAX` (≈ 18 exaoctets) → copie gigantesque. Toujours valider les bornes **avant** la conversion " +
        "et en cohérence de signe.\n" +
        "```bash\ngcc -g -O0 signedness.c -o signedness\n./signedness\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "",
        "#define MAX 1024",
        "",
        "void handle(int len, const char *src) {",
        "  char dst[MAX];",
        "  if (len > MAX) {                 // BUG: garde inefficace si len < 0",
        '    puts("trop long, rejete");',
        "    return;",
        "  }",
        '  printf("memcpy de %d octets (vu comme %zu)\\n", len, (size_t)len);',
        "  memcpy(dst, src, len);            // len negatif -> size_t enorme",
        "}",
        "",
        "int main(void) {",
        "  static char src[4096];",
        "  memset(src, 'B', sizeof src);",
        "  handle(-1, src);                  // attaquant: len = -1",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "La garde `len > MAX` ne déclenche pas (`-1 > 1024` est faux). `memcpy` reçoit une taille gigantesque " +
        "(`18446744073709551615`) → `Segmentation fault`.",
    },
    {
      n: 3,
      title: "Détecter avec UBSan",
      goal: "Faire signaler l'overflow d'entier à l'instant où il se produit.",
      target: "docker-c",
      explain:
        "UndefinedBehaviorSanitizer attrape les débordements arithmétiques et les conversions douteuses. On " +
        "compile avec `-fsanitize=undefined` (et `,integer` côté Clang pour les wraps unsigned, qui sont " +
        "définis mais souvent non voulus). Ici on instrumente un calcul `count * size` qui déborde.\n" +
        "```bash\n# clang -fsanitize=undefined,integer ubsan.c -o ub   (ou)\n" +
        "gcc -g -fsanitize=undefined ubsan.c -o ub\n./ub\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "",
        "int main(void) {",
        "  int count = 1 << 30;   // ~1 milliard",
        "  int size  = 16;",
        "  int total = count * size;   // BUG: overflow signe (UB)",
        '  printf("total (errone) = %d\\n", total);',
        "  void *p = malloc((size_t)total);",
        '  printf("malloc(%d) = %p\\n", total, p);',
        "  free(p);",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "UBSan affiche `runtime error: signed integer overflow: 1073741824 * 16 cannot be represented in type " +
        "'int'`, pointant la ligne exacte du calcul.",
    },
    {
      n: 4,
      title: "Pourquoi c'est si répandu",
      goal: "Comprendre la chaîne integer overflow → heap overflow / OOB.",
      target: "read",
      explain:
        "Un overflow d'entier produit une **taille fausse** : allocation trop petite (puis heap overflow), " +
        "index hors borne, ou garde de longueur contournée. C'est rarement exploitable seul, mais c'est la " +
        "*source* d'un bug mémoire en aval. La classe domine les **parseurs** (images, polices, médias, " +
        "réseau) où les longueurs viennent d'un fichier/paquet hostile. Pièges récurrents : `a * b` non " +
        "vérifié, `a - b` qui underflow en `size_t`, et le mélange signé/non signé.",
    },
    {
      n: 5,
      title: "Corriger : vérifs d'overflow explicites",
      goal: "Utiliser __builtin_*_overflow / calloc et des types cohérents.",
      target: "docker-c",
      explain:
        "Deux outils sûrs :\n" +
        "- `__builtin_add_overflow` / `__builtin_mul_overflow` (GCC/Clang) renvoient `true` si le calcul " +
        "déborde → on refuse l'opération.\n" +
        "- `calloc(count, size)` / `reallocarray` vérifient `count*size` en interne.\n\n" +
        "On utilise `size_t` pour les tailles et on valide les bornes **avant** toute alloc/copie.\n" +
        "```bash\ngcc -g -O2 -fsanitize=undefined intof_fix.c -o intof_fix\n./intof_fix\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "#include <string.h>",
        "#include <stdint.h>",
        "",
        "char *copy_safe(size_t n, const char *src) {",
        "  size_t sz;",
        "  if (__builtin_add_overflow(n, (size_t)1, &sz)) { // detecte le wrap",
        '    fprintf(stderr, "taille invalide (overflow)\\n");',
        "    return NULL;",
        "  }",
        "  char *buf = malloc(sz);",
        "  if (!buf) return NULL;",
        "  memcpy(buf, src, n);",
        "  buf[n] = '\\0';",
        "  return buf;",
        "}",
        "",
        "int main(void) {",
        "  static char src[8] = \"hello!!\";",
        "  char *ok = copy_safe(7, src);",
        '  if (ok) { printf("ok: %s\\n", ok); free(ok); }',
        "  // demo : un n qui ferait deborder est refuse proprement",
        "  char *ko = copy_safe(SIZE_MAX, src);",
        '  printf("copy_safe(SIZE_MAX) = %p (refus attendu)\\n", (void *)ko);',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Sortie : `ok: hello!!` puis `taille invalide (overflow)` et `copy_safe(SIZE_MAX) = (nil) (refus " +
        "attendu)`. UBSan ne signale rien : aucun overflow non maîtrisé.",
    },
    {
      n: 6,
      title: "Vérifier avec les warnings de conversion",
      goal: "Repérer à la compilation les conversions implicites signé/non signé.",
      target: "docker-bash",
      explain:
        "`-Wconversion -Wsign-conversion` (avec `-Wall -Wextra`) signalent les conversions implicites " +
        "dangereuses — la source du piège signed/unsigned de l'étape 2. On compile le source vulnérable pour " +
        "voir le compilateur lever le drapeau, puis le source corrigé pour confirmer qu'il est propre.",
      code:
        "echo '--- code vulnerable : conversions signalees ---'\n" +
        "gcc -Wall -Wextra -Wconversion -Wsign-conversion -c signedness.c -o /dev/null\n" +
        "echo '--- code corrige : silencieux ---'\n" +
        "gcc -Wall -Wextra -Wconversion -Wsign-conversion -c intof_fix.c -o /dev/null && echo OK",
      expected:
        "Le source vulnérable produit des warnings `-Wsign-conversion` / `-Wconversion` sur la longueur passée " +
        "à `memcpy`. Le source corrigé compile sans warning et affiche `OK`.",
    },
  ],

  // ======================================================================
  // 5) HEAP EXPLOITATION (intro conceptuelle)
  // ======================================================================
  "heap-exploitation": [
    {
      n: 1,
      title: "Le modèle de l'allocateur",
      goal: "Comprendre chunks, métadonnées inline et listes libres (bins/tcache).",
      target: "read",
      explain:
        "**Cadre légal : binaires de challenge / lab isolé uniquement. Ce sont des primitives d'intrusion.**\n\n" +
        "`malloc`/`free` (glibc `ptmalloc`) gèrent des **chunks** porteurs de **métadonnées inline** : taille, " +
        "flags, et — une fois libéré — des **pointeurs de chaînage** vers les listes libres (« bins », et la " +
        "**tcache** par taille en glibc moderne). Point clé : le pointeur de chaînage d'un chunk libre est " +
        "stocké **dans sa propre zone de données réutilisable**. Donc si on peut **écrire dans un chunk " +
        "libéré** (via un UAF ou un overflow), on peut **mentir à l'allocateur** sur ce que `malloc` rendra " +
        "ensuite. Tout le reste découle de là.",
    },
    {
      n: 2,
      title: "Observer le tas en pratique",
      goal: "Allouer / libérer et voir l'adresse réutilisée par l'allocateur.",
      target: "docker-c",
      explain:
        "Avant la théorie de corruption, on *constate* le recyclage : on `malloc` un chunk, on note son " +
        "adresse, on le `free`, puis on `malloc` à nouveau **la même taille** → souvent la **même adresse** " +
        "revient. C'est exactement ce qui rend UAF/double-free dangereux : l'allocateur réutilise les zones de " +
        "façon prévisible.\n" +
        "```bash\ngcc -g -O0 heap_observe.c -o heap_observe\n./heap_observe\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "",
        "int main(void) {",
        "  void *a = malloc(64);",
        '  printf("a       = %p\\n", a);',
        "  free(a);",
        "  void *b = malloc(64);   // meme taille",
        '  printf("b       = %p\\n", b);',
        '  printf("a == b ? %s\\n", (a == b) ? "OUI (zone recyclee)" : "non");',
        "  free(b);",
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "`a` et `b` affichent (le plus souvent) **la même adresse** → `a == b ? OUI (zone recyclee)`. " +
        "Démonstration concrète du recyclage de la tcache.",
    },
    {
      n: 3,
      title: "Double-free : la détection moderne",
      goal: "Provoquer un double-free et voir glibc le refuser.",
      target: "docker-c",
      explain:
        "**Double-free** = libérer deux fois le même chunk → corruption de la liste libre. Conceptuellement, " +
        "ça permet de faire revenir le même chunk deux fois puis d'orienter un `malloc` ultérieur. On NE " +
        "construit PAS l'exploit : on observe que la glibc moderne **détecte** le double-free de la tcache et " +
        "avorte. C'est précisément la protection à connaître.\n" +
        "```bash\ngcc -g -O0 doublefree.c -o doublefree\n./doublefree\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "",
        "int main(void) {",
        "  void *p = malloc(32);",
        '  printf("alloue %p\\n", p);',
        "  free(p);",
        "  free(p);   // BUG: double-free du meme chunk",
        '  puts("si vous lisez ceci, le double-free n\\x27a pas ete detecte");',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "La glibc moderne avorte avec `free(): double free detected in tcache 2` puis `Aborted` (SIGABRT). " +
        "La détection intégrée à l'allocateur a stoppé la corruption.",
    },
    {
      n: 4,
      title: "Tcache poisoning & safe-linking (concept)",
      goal: "Comprendre comment un fd corrompu donne un write-what-where, et ce qui le freine.",
      target: "read",
      explain:
        "**Tcache poisoning (intro)** : après un UAF/overflow sur un chunk libéré, on écrase son pointeur `next` " +
        "(`fd`). Le prochain `malloc` de cette taille suit ce `fd` corrompu et renvoie une **adresse choisie " +
        "par l'attaquant** → primitive *write-what-where* (écraser `__free_hook`, une entrée GOT, un pointeur " +
        "de fonction).\n\n" +
        "Enchaînement typique en CTF : *fuite d'adresse (cf. `format-string`) → ASLR défait → tcache poisoning " +
        "→ contrôle d'un pointeur → exécution*.\n\n" +
        "Ce qui le freine : la glibc récente ajoute le **safe-linking** (le `fd` est XORé avec une valeur " +
        "dérivée de l'adresse du chunk), des **alignment checks** et la détection de double-free. Écrire un " +
        "`fd` arbitraire ne suffit donc plus sans connaître ces secrets. Outils d'étude : gdb+pwndbg (`heap`, " +
        "`bins`), how2heap (shellphish), HeapLAB.",
    },
    {
      n: 5,
      title: "Corriger : tuer la cause racine + ASan",
      goal: "Éliminer le UAF/double-free source ; ASan attrape ce qui reste.",
      target: "docker-c",
      explain:
        "Ces exploits ne partent **que** d'un UAF / double-free / overflow. La mitigation #1 est de corriger " +
        "ces bugs (cf. `use-after-free`, `integer-overflow-c`) : `free(p); p = NULL;`, ownership clair, bornes. " +
        "ASan en CI les fait sauter immédiatement, y compris le double-free.\n" +
        "```bash\ngcc -g -O1 -fsanitize=address heap_fix.c -o heap_fix\n./heap_fix\n```",
      code: [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "",
        "#define FREE_NULL(p) do { free(p); (p) = NULL; } while (0)",
        "",
        "static void release(void **pp) {",
        "  if (*pp) FREE_NULL(*pp);   // free idempotent : pas de double-free possible",
        "}",
        "",
        "int main(void) {",
        "  void *p = malloc(32);",
        '  printf("alloue %p\\n", p);',
        "  release(&p);",
        "  release(&p);   // 2e appel : p est deja NULL -> no-op (correct)",
        '  puts("aucun double-free : pointeur annule apres liberation");',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Sortie normale : `alloue ...` puis `aucun double-free : pointeur annule apres liberation`. " +
        "ASan ne signale aucune erreur (ni UAF, ni double-free).",
    },
    {
      n: 6,
      title: "Durcir le binaire : RELRO, allocateur, glibc",
      goal: "Vérifier full RELRO et connaître les allocateurs durcis.",
      target: "docker-bash",
      explain:
        "Couches de défense en profondeur, même si un bug résiduel subsiste :\n" +
        "- **Full RELRO** (`-Wl,-z,relro,-z,now`) : la GOT passe en lecture seule → coupe une cible classique " +
        "des primitives d'écriture.\n" +
        "- **Allocateurs durcis** : `hardened_malloc` (GrapheneOS), `scudo` (LLVM) — guard pages, isolation des " +
        "classes de taille, quarantaine anti-double-free.\n" +
        "- **glibc à jour** : tcache double-free detection, **safe-linking**, alignment checks.\n\n" +
        "On compile en full RELRO et on le vérifie avec checksec.",
      code:
        "gcc -O2 -fPIE -pie -Wl,-z,relro,-z,now heap_fix.c -o heap_hard\n" +
        "checksec --file=./heap_hard 2>/dev/null || readelf -d ./heap_hard | grep -Ei 'bind_now|flags'",
      expected:
        "checksec montre `Full RELRO`, `NX enabled`, `PIE enabled` (ou readelf affiche `BIND_NOW` / " +
        "`FLAGS NOW`). La GOT est protégée en lecture seule.",
    },
  ],

  // ======================================================================
  // 6) RETURN-ORIENTED PROGRAMMING (intro)
  // ======================================================================
  "rop-intro": [
    {
      n: 1,
      title: "Pourquoi le ROP existe",
      goal: "Comprendre que NX/DEP interdit d'exécuter la pile, d'où la réutilisation de code.",
      target: "read",
      explain:
        "**Cadre légal : challenges / lab isolé uniquement. Techniques d'exploitation offensive.**\n\n" +
        "Historiquement, après un overflow (cf. `buffer-overflow-stack`), on plaçait du shellcode sur la pile " +
        "et on y sautait. **NX / DEP** marque la pile comme **non exécutable** → ce plan échoue. Le " +
        "contournement, le **ROP** (Return-Oriented Programming) : ne pas injecter de code, mais **réutiliser " +
        "des bouts de code déjà présents** dans le binaire et ses bibliothèques. On reste donc en territoire " +
        "« données », ce que NX autorise.",
    },
    {
      n: 2,
      title: "Confirmer que NX est actif",
      goal: "Vérifier qu'un binaire moderne a une pile non exécutable.",
      target: "docker-bash",
      explain:
        "On vérifie la présence de NX (la raison d'être du ROP). `checksec` le résume ; `readelf -l` montre le " +
        "segment `GNU_STACK` : s'il est `RW` (et non `RWE`), la pile n'est pas exécutable. (On suppose qu'un " +
        "binaire `vuln` du lab existe ; sinon, compiler n'importe quel `.c`.)",
      code:
        "checksec --file=./vuln 2>/dev/null || true\n" +
        "echo '--- segment GNU_STACK ---'\n" +
        "readelf -l ./vuln | grep -A1 GNU_STACK",
      expected:
        "checksec indique `NX enabled`. `GNU_STACK` apparaît avec les flags `RW ` (lecture/écriture, pas " +
        "d'exécution) → impossible d'exécuter du shellcode sur la pile.",
    },
    {
      n: 3,
      title: "Qu'est-ce qu'un gadget",
      goal: "Comprendre gadget, chaînage par ret, et ret2libc.",
      target: "read",
      explain:
        "Un **gadget** = une courte séquence d'instructions terminée par `ret` (ex. `pop rdi ; ret`). En " +
        "contrôlant la pile via un overflow, on y empile une suite d'**adresses de gadgets** : chaque `ret` " +
        "dépile et saute au gadget suivant → on enchaîne un mini-programme sans jamais injecter de code.\n\n" +
        "Le plus simple à comprendre est **ret2libc** : au lieu de gadgets, on fait retourner la fonction " +
        "directement dans une fonction de la libc (conceptuellement `system(\"/bin/sh\")`).\n" +
        "```\n# layout de pile (x86-64), CONCEPTUEL, non fonctionnel :\n" +
        "[ overflow ... ][ &(pop rdi; ret) ][ &\"/bin/sh\" ][ &system ]\n" +
        "#   bourrage      gadget pour arg1   adresse str    fonction cible\n```\n" +
        "Les conventions d'appel imposent de mettre les arguments dans des registres (`rdi`, `rsi`, `rdx`) → " +
        "d'où les gadgets `pop rdi/rsi/rdx ; ret`.",
    },
    {
      n: 4,
      title: "Énumérer les gadgets (sans exploiter)",
      goal: "Voir combien de gadgets un binaire/libc offre à un attaquant.",
      target: "docker-bash",
      explain:
        "Outils d'**étude** : `ROPgadget` / `ropper` listent les séquences `... ; ret` disponibles. On les " +
        "exécute juste pour *mesurer la surface d'attaque* (plus de code lié = plus de gadgets), pas pour " +
        "construire une chaîne. C'est aussi un argument pour des binaires minimaux.",
      code:
        "ROPgadget --binary ./vuln --only 'pop|ret' | head -n 20\n" +
        "echo '--- nombre total de gadgets ---'\n" +
        "ROPgadget --binary ./vuln | grep -c ' : '",
      expected:
        "Une liste de gadgets type `0x... : pop rdi ; ret`, et un total (souvent plusieurs centaines même pour " +
        "un petit binaire). Illustre la surface de gadgets exploitable.",
    },
    {
      n: 5,
      title: "Le prérequis : la fuite d'adresse",
      goal: "Comprendre pourquoi ASLR/PIE force un leak avant tout ROP fiable.",
      target: "read",
      explain:
        "Une chaîne ROP utilise des **adresses absolues** de gadgets/fonctions. Avec **ASLR + PIE**, ces " +
        "adresses changent à chaque exécution → impossible de les coder en dur. Il faut d'abord une **fuite " +
        "d'adresse** (info leak) — typiquement via un `format-string` (cf. technique) ou un autre primitive — " +
        "pour calculer les adresses réelles à l'exécution. D'où l'enchaînement classique : *leak → calcul de " +
        "base → ROP*. C'est aussi pourquoi un ASLR fort est une mitigation majeure : sans leak, pas de chaîne " +
        "fiable.",
    },
    {
      n: 6,
      title: "Mitiger : CET / shadow stack & RELRO",
      goal: "Compiler avec CF-protection et vérifier les marquages anti-ROP.",
      target: "docker-c",
      explain:
        "Mitigations modernes contre le ROP :\n" +
        "- **Corriger l'overflow** d'entrée (canaries, bornes, ASan) — pas d'overflow ⇒ pas de contrôle de " +
        "pile.\n" +
        "- **Intel CET** : `-fcf-protection=full` active IBT et surtout la **shadow stack** — une copie " +
        "protégée des adresses de retour ; si le `ret` ne correspond pas, le CPU faute. La chaîne ROP est " +
        "cassée.\n" +
        "- **CFI** (Clang `-fsanitize=cfi`), **ASLR fort + PIE + full RELRO**, surface de gadgets réduite, " +
        "**seccomp** pour bloquer `execve`.\n\n" +
        "Compilation :\n```bash\ngcc -O2 -fcf-protection=full -fstack-protector-strong -fPIE -pie " +
        "-Wl,-z,relro,-z,now rop_demo.c -o rop_demo\n```",
      code: [
        "#include <stdio.h>",
        "",
        "// Programme banal : ici on ne demontre PAS un exploit ROP (interdit cle en main),",
        "// on produit un binaire pour VERIFIER les marquages anti-ROP a l'etape suivante.",
        "int main(void) {",
        '  puts("binaire compile avec CET (shadow stack) + full RELRO");',
        "  return 0;",
        "}",
      ].join("\n"),
      expected:
        "Le binaire compile et affiche son message. Il porte les protections CET (sur toolchain/CPU " +
        "compatibles) — vérifiées à l'étape suivante.",
    },
    {
      n: 7,
      title: "Vérifier les marquages anti-ROP",
      goal: "Confirmer la présence des notes CET (IBT/shadow stack) et de full RELRO.",
      target: "docker-bash",
      explain:
        "On inspecte le binaire durci : `readelf -n` montre les notes de propriété GNU `IBT` / `SHSTK` quand " +
        "CET est actif ; checksec confirme `Full RELRO`, `NX`, `PIE`, `Canary`. C'est la preuve que les " +
        "barrières anti-ROP sont en place.",
      code:
        "checksec --file=./rop_demo 2>/dev/null || true\n" +
        "echo '--- notes de propriete (CET: IBT / SHSTK) ---'\n" +
        "readelf -n ./rop_demo | grep -Ei 'IBT|SHSTK|stack|property' || \\\n" +
        '  echo "(notes CET absentes : CPU/toolchain sans support — autres protections actives)"',
      expected:
        "checksec affiche `Full RELRO`, `Canary found`, `NX enabled`, `PIE enabled`. `readelf -n` montre les " +
        "propriétés `x86 feature: IBT, SHSTK` si CET est supporté.",
    },
  ],
};
