-- Extensions Postgres requises par Porterfield Heroes.
-- Exécuté automatiquement au premier démarrage du container.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";  -- pgvector pour embeddings RAG
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- recherche trigram (carnet full-text fuzzy)
