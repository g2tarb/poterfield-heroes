// Tutoriels Code Noir "A→Z" — étapes de lab exécutables dans le sandbox intégré.
// Une technique Code Noir peut porter un tableau d'étapes (steps) formant un lab
// guidé : reproduire la vulnérabilité → l'observer → (exploitation pédagogique)
// → corriger → vérifier le fix. Toujours en cadre légal (labs isolés).

export type CodeNoirStepTarget =
  | "read" // pas d'exécution : lecture/explication seulement
  | "browser-js" // exécuté dans le Web Worker JS du navigateur
  | "browser-python" // exécuté dans Pyodide (navigateur)
  | "docker-bash" // exécuté dans le conteneur lab éphémère (bash + outils)
  | "docker-c"; // compilé + exécuté en C dans le conteneur lab

export type CodeNoirLabStep = {
  /** Ordre de l'étape (1-based). */
  n: number;
  /** Titre court de l'étape. */
  title: string;
  /** But de l'étape, en une phrase. */
  goal: string;
  /** Explication (markdown court) : pourquoi / comment. */
  explain: string;
  /** Où s'exécute cette étape. "read" = pas de bouton Lancer. */
  target: CodeNoirStepTarget;
  /** Code / commande à exécuter (absent si target = "read"). */
  code?: string;
  /** Sortie ou observation attendue (sert d'auto-check et d'explication). */
  expected?: string;
};

export type CodeNoirStepsByTechnique = Record<string, CodeNoirLabStep[]>;
