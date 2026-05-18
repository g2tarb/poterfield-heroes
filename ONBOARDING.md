# Onboarding — Porterfield Heroes

Atelier privé d'apprentissage dev fullstack. Cette doc décrit le premier usage,
de l'arrivée sur l'app à l'enchaînement de M01 → M25.

> Pour le setup technique (env vars, déploiement), voir [DEPLOY.md](DEPLOY.md).

---

## 1. Premier login

1. Va sur ton URL (en prod : `https://poterfield.online`)
2. Tu arrives sur `/login` → tape ton `ACCESS_PASSWORD`
3. Redirection vers `/` (Atelier)

Si tu vois le warning **"Password forms should have username fields"** dans la
console, c'est cosmétique — Chrome préfère un input email avant le password.
Pas bloquant.

---

## 2. Le Dashboard (`/`)

C'est ta page d'accueil quotidienne. Tu y vois :

- **Staircase 25 stations** (colonne principale) : tes modules en escalier.
  - Le module ACTIF a des hachures ambre + tampon "EN COURS".
  - Les modules FAITS ont un tampon "TERMINÉ" vert.
  - Les modules VERROUILLÉS sont grisés.
- **Panel sidebar** (à droite desktop, en haut mobile) :
  - Palier actuel + jauge XP industrielle
  - Compteurs Série + Modules
  - Panel SRS (cliquable si cartes due)
- **CodeRain en fond** : snippets de code thématiques au module hover
- **Easter egg Code Noir** : scroll vers le haut au max + maintiens 3s

---

## 3. Faire un module (M01 par défaut)

### a. Clique sur la station EN COURS

Tu arrives sur `/modules/m01-comment-fonctionne-le-web`.

### b. Lis la section "Pourquoi"

C'est la motivation du module. À lire honnêtement, pas survoler.

### c. Regarde la vidéo principale

YouTube embed. Take notes dans le carnet (`/notebook`) ou directement dans ton
éditeur.

### d. Ouvre la sidebar "Compétences à valider"

Pour chaque skill listé :

1. Coche la case quand tu sens que tu maîtrises
2. Claude génère **UNE question pointue** sur ce skill (basée sur la persona
   du module — pédagogue sur M01, senior strict sur M16+)
3. Tu réponds dans la textarea
4. Claude évalue : **✓ Acquis** / **≈ À retravailler** / **✗ Non acquis**
5. Si Acquis → checkbox cochée définitivement, ligne barrée

### e. Fais les Étapes (exercices)

Section "Étapes du parcours". Clique sur une étape :

- **Quiz** (activation ou vérification) : radio buttons, correction locale
- **Code exercise** : textarea avec starterCode pré-rempli + bouton
  **▶ corriger via IA**
- **Project validation** : énoncé large, textarea, IA corrige

Chaque correction donne un verdict + feedback markdown + suggestions.

### f. Module complété

Quand tous les skills sont mastered + toutes les étapes pass threshold, le
module passe en `completed` (statut DB). Le suivant se débloque automatiquement
au prochain refresh du dashboard.

---

## 4. SRS quotidien (`/srs`)

Quand tu valides un skill (verdict "mastered"), des **flashcards** sont
générées automatiquement. Elles arrivent à échéance selon l'algo FSRS-4.

Routine du matin :

1. Va sur `/srs`
2. Lis la question (front de la carte)
3. Clique "Voir la réponse"
4. Évalue ton rappel : **Raté / Difficile / Bon / Facile** (clavier 1-4)
5. L'algorithme calcule le prochain intervalle

Cible quotidienne dans Settings → "Cartes SRS / jour" (défaut 20).

---

## 5. Coach IA (drawer ?)

Bouton flottant en bas à droite. Cliquable depuis n'importe où :

- Drawer s'ouvre à droite
- Contexte injecté automatiquement : module courant + skills + 5 notes
  récentes du carnet + 5 chunks RAG les plus pertinents
- Streaming (réponse mot par mot via SSE)
- Markdown rendu avec code blocks colorés

Le coach ne fait pas l'exercice à ta place. Si tu insistes, il te recadre.

---

## 6. Code Noir (`/code-noir`)

**Module secret de sécurité offensive + défensive.**

Accès :

- Scroll vers le haut au max sur le dashboard + maintiens 3 secondes
- OU URL directe `https://poterfield.online/code-noir`

Contenu :

- **Techniques** débloquées selon ta progression dans les modules normaux
- **Black Hat Mentor** chat dédié avec persona offensive senior

Cadre éthique strict : CTF / tes propres systèmes / bug bounty avec scope.

---

## 7. Carnet (`/notebook`)

Notes markdown indexées automatiquement (embedding pour RAG coach).

- Crée une note → "+ Note"
- Édite : titre + body markdown
- Aperçu en cliquant "Aperçu"
- Auto-save toutes les 1.2s
- Source `user` par défaut. Le coach peut aussi y déposer des notes.

---

## 8. Sandbox (`/sandbox`)

Bac à sable pour expérimenter du code :

- **JS / TS** : Web Worker isolé, timeout 5s
- **Python** : Pyodide (WebAssembly, 6 MB au premier chargement)
- `console.log` capturé dans la console droite

Pas d'accès DOM, pas d'accès réseau (sécurité).

---

## 9. Examen hebdomadaire (`/exams`)

Tous les dimanches soir, Claude génère **automatiquement** un examen basé sur
ton activité de la semaine :

- 10 QCM (concepts)
- 1 exercice code
- 60 min
- **Pas de coach pendant l'examen**

C'est l'**anti-triche**. Si tu zappes la pratique, tu rates l'examen.

Notification push envoyée quand l'examen est prêt (si tu as activé les push
dans Settings).

---

## 10. GitHub Review (`/github`)

Si tu connectes ton GitHub App + webhook (voir [DEPLOY.md](DEPLOY.md)) :

- Chaque push sur un repo tracké → Claude review le diff
- Annotations inline sur les fichiers modifiés
- Score sur 7 critères (lisibilité, sécurité, perf, etc.)
- Notification push quand la review est prête

---

## 11. Settings (`/settings`)

- Préférences (reduced-motion, voix TTS, cible SRS quotidienne)
- Push notifications (s'abonner, tester, désabonner)
- **Budget IA mensuel** : tu vois `dépensé / limite` (config via env
  `MONTHLY_AI_BUDGET_CENTS`)
- Actions destructives (reset progression)

---

## 12. Profil public (`/p/erwin`)

Page non-auth, indexable, partageable. Vitrine de ta progression :

- Hero + bio + tagline
- Palier actuel + XP + jauge industrielle
- Radar 12 axes
- Stations validées avec dates
- Pitch markdown (sur l'atelier)

Configurable dans la table `public_profile` (DB).

---

## 13. Le cycle hebdomadaire idéal

```
Lundi → Vendredi :
  - 1 vidéo + 1 exo + 1 skill validé par jour
  - SRS du matin (~10 min)
  - Coach IA si bloqué

Vendredi soir :
  - Cron Coolify → Claude génère l'examen S+0
  - Push notif "Ton examen est prêt"

Dimanche soir :
  - Tu fais l'examen (60 min)
  - Bilan + radar mis à jour
  - Profil public actualisé

Lundi suivant : on recommence avec M+1 si M validé.
```

---

## 14. Quand tu décroches

C'est le risque #1. Le système prévoit :

- **Streak** : compteur jours consécutifs (au moins 1 SRS ou 1 exo)
- **Push "streak_at_risk"** quand tu n'as rien fait depuis 24h
- **Push "weekly_exam"** le vendredi
- Le coach est proactif : si tu reviens après 5j, il le voit

Pas de pénalité officielle. C'est mono-user, t'es ton propre boss.

---

## 15. Documentation technique

- [README.md](README.md) — stack technique + setup local
- [DEPLOY.md](DEPLOY.md) — déploiement Coolify, secrets, backups
- `apps/api/src/services/` — services métier (coach, srs, exam, github, etc.)
- `packages/db/src/schema/` — schéma Drizzle complet
