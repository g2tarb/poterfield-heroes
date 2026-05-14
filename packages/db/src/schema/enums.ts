import { pgEnum } from "drizzle-orm/pg-core";

// === Module / progression ===
export const moduleStatusEnum = pgEnum("module_status", [
  "locked",
  "active",
  "completed",
]);

export const skillStatusEnum = pgEnum("skill_status", [
  "discovering",
  "practicing",
  "mastered",
]);

// === Exercises ===
export const exerciseKindEnum = pgEnum("exercise_kind", [
  "quiz_activation", // avant pratique : "que penses-tu qu'il va se passer si..."
  "quiz_verification", // après pratique : 8-12 questions concept
  "code_exercise", // exercice de code en sandbox
  "project_validation", // projet pratique du module
]);

export const sandboxKindEnum = pgEnum("sandbox_kind", [
  "browser", // Pyodide / WebWorker / PGlite / WebContainers
  "docker", // serveur Docker éphémère (Bash, Node natif, etc.)
  "external", // GitHub repo, pas de sandbox
]);

export const programmingLanguageEnum = pgEnum("programming_language", [
  "html",
  "css",
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "sql",
  "bash",
  "glsl",
  "json",
  "markdown",
  "plaintext",
]);

// === Coach / IA ===
export const coachRoleEnum = pgEnum("coach_role", [
  "user",
  "assistant",
  "system",
  "tool_call",
  "tool_result",
]);

export const memorySourceEnum = pgEnum("memory_source", [
  "error", // erreur récurrente de l'apprenant
  "note", // entrée du carnet
  "exercise", // tentative d'exercice
  "exam", // réponse de contrôle vendredi
  "code_push", // commit GitHub
  "summary", // résumé de session générée par le coach
]);

// === SRS ===
export const srsCardStateEnum = pgEnum("srs_card_state", [
  "new",
  "learning",
  "review",
  "mature", // interval >= 21 jours, considéré ancré
  "suspended",
]);

// === Notebook ===
export const notebookSourceEnum = pgEnum("notebook_source", [
  "coach", // entrée proposée par le coach, validée
  "user", // entrée libre rédigée par l'apprenant
  "system", // entrée préformatée depuis la roadmap (pièges classiques, etc.)
]);

// === GitHub ===
export const codeReviewSeverityEnum = pgEnum("code_review_severity", [
  "info",
  "suggestion",
  "warning",
  "critical",
]);

// === Notifications ===
export const notificationKindEnum = pgEnum("notification_kind", [
  "srs_due",
  "weekly_exam",
  "streak_at_risk",
  "level_up",
  "coach_proactive",
  "github_review_ready",
  "module_unlocked",
]);

// === XP events ===
export const xpEventKindEnum = pgEnum("xp_event_kind", [
  "module_completed",
  "skill_mastered",
  "exam_passed",
  "exam_perfect",
  "streak_milestone",
  "project_validated",
  "github_push_reviewed",
]);
