-- ⚠ BOOTSTRAP UNIQUEMENT pour les nouveaux clones (premier `docker-compose up`).
-- Source de vérité : packages/db/src/schema/codeNoir.ts (Drizzle).
-- Cette table sera intégrée à la prochaine migration `drizzle-kit generate`.
-- IF NOT EXISTS garantit qu'on ne casse rien si Drizzle l'a déjà créée.

CREATE TABLE IF NOT EXISTS code_noir_progress (
  id            serial PRIMARY KEY,
  technique_slug text NOT NULL UNIQUE,
  status        text NOT NULL CHECK (status IN ('in_progress', 'mastered')),
  quiz_score    integer,
  mastered_at   timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_code_noir_progress_status
  ON code_noir_progress (status);
