-- ============================================================================
-- Sprints livrés nuit 25→26 mai 2026 — toutes les évolutions de schéma
-- appliquées en ALTER TABLE / CREATE TABLE direct pendant la session.
--
-- ⚠ Ce fichier est IDEMPOTENT : tu peux le re-run autant de fois que tu veux,
-- il ne touche que ce qui n'existe pas encore. Les nouveaux clones le pickent
-- via docker-compose init ; les DBs existantes : `psql -d porterfield -f
-- infra/postgres/init/06-sprints-may-2026.sql`.
--
-- Source de vérité = packages/db/src/schema/*.ts (Drizzle). Une fois
-- `pnpm db:generate` lancé pour la prochaine vraie migration, ce fichier
-- pourra être supprimé.
-- ============================================================================

-- --- Sprint A : dépendances entre skills ---------------------------------
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS prereq_skill_slugs jsonb NOT NULL DEFAULT '[]'::jsonb;

-- --- Sprint B : leçon markdown embarquée par skill -----------------------
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS content_markdown text;

-- skills.videos était ajouté lors d'un sprint précédent — au cas où la DB
-- d'Erwin ne l'aurait jamais reçue (la session a montré que c'était
-- manquant) :
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS videos jsonb NOT NULL DEFAULT '[]'::jsonb;

-- --- Sprint C : ressources externes + junction skill ↔ resource ----------
CREATE TABLE IF NOT EXISTS external_resources (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind              varchar(16) NOT NULL,
  provider          varchar(64) NOT NULL,
  title             text NOT NULL,
  url               text NOT NULL,
  language          varchar(8)  NOT NULL DEFAULT 'en',
  level             varchar(16) NOT NULL DEFAULT 'beginner',
  why_this_one      text,
  estimated_minutes integer,
  last_verified_at  timestamp with time zone,
  http_status       integer,
  created_at        timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resources_provider ON external_resources(provider);
CREATE INDEX IF NOT EXISTS idx_resources_kind     ON external_resources(kind);

CREATE TABLE IF NOT EXISTS skill_resources (
  skill_id      uuid NOT NULL REFERENCES skills(id)            ON DELETE CASCADE,
  resource_id   uuid NOT NULL REFERENCES external_resources(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (skill_id, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_skill_resources_skill ON skill_resources(skill_id);

-- --- Sprint Notes : ancrage vidéo dans les notes -------------------------
ALTER TABLE notebook_entries
  ADD COLUMN IF NOT EXISTS video_youtube_id        varchar(32);
ALTER TABLE notebook_entries
  ADD COLUMN IF NOT EXISTS video_timestamp_seconds integer;
CREATE INDEX IF NOT EXISTS idx_notebook_video ON notebook_entries(video_youtube_id);

-- --- Sprint Code Noir paroxysme : killtimer + best time + achievements --
ALTER TABLE code_noir_progress
  ADD COLUMN IF NOT EXISTS first_kill_at timestamp with time zone;
ALTER TABLE code_noir_progress
  ADD COLUMN IF NOT EXISTS best_time_ms integer;
ALTER TABLE code_noir_progress
  ADD COLUMN IF NOT EXISTS kill_count   integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS code_noir_achievements (
  slug        text PRIMARY KEY,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  context     text
);
