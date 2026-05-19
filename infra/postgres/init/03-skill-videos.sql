-- ⚠ BOOTSTRAP UNIQUEMENT pour les fresh installs.
-- Source de vérité : packages/db/src/schema/content.ts (Drizzle).
-- À appliquer manuellement en prod si la colonne n'existe pas encore :
--   docker exec -i <postgres> psql -U $POSTGRES_USER -d $POSTGRES_DB < 03-skill-videos.sql

ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS videos jsonb NOT NULL DEFAULT '[]'::jsonb;
