import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M25_ID = "m25-ia-appliquee";

export const m25Module: NewModule = {
  id: M25_ID,
  moduleNumber: 25,
  phase: 8,
  title: "IA appliquée (LLMs, RAG, agents, embeddings, MCP)",
  subtitle: "Le module le plus aligné business. Niveau Anthropic builder.",
  pourquoi:
    "IA générative en 2026 = ce que le web était en 2000. Infrastructure transformante. Boîtes sans IA core perdront leurs marchés 2-3 ans. Tu construis déjà avec : Flaynn V4 = Mistral OCR + Gemini + Claude + DeepSeek. ARCHITECT-PRIME v3 = meta-prompting. Mais empiriquement. Ce module systématise : comment LLMs marchent (tokens, embeddings, attention de loin), comment construire systèmes fiables (prompt eng, RAG, agents, eval), comment éviter les pièges (hallucinations, prompt injection, coûts).",
  objectives: [
    "Qu'est-ce qu'un LLM (transformer, next token prediction, paramètres, tokenizer, embeddings)",
    "Familles modèles 2026 : Claude, GPT, Gemini, Mistral, Llama, DeepSeek, Qwen — forces",
    "APIs principaux (Anthropic SDK, OpenAI SDK, Mistral, Google Gemini) + retry/streaming",
    "Paramètres clés (temperature, top_p, max_tokens, stop, JSON mode, tool use)",
    "Prompt engineering structuré (zero-shot, few-shot, chain-of-thought, ReAct, system vs user)",
    "Format XML-tag (style Anthropic) : <context>, <rubric>, <thinking>",
    "Output structuré (JSON mode, schemas Zod/Pydantic, tool calling)",
    "Embeddings (vecteurs sémantiques, cosine similarity, providers : OpenAI/Voyage/Cohere)",
    "Vector databases (pgvector, Qdrant, Pinecone) — quand quoi",
    "RAG complet (loader → chunker → embedder → store → retriever → reranker → LLM)",
    "Chunking patterns (fixed, recursive, semantic, par structure)",
    "Reranking (Cohere Rerank, Voyage rerank, cross-encoder)",
    "Agents (ReAct : Reason + Act, tool use, multi-step, planning)",
    "MCP (Model Context Protocol) — standard ouvert Anthropic",
    "LangGraph (agents complexes) vs SDK direct",
    "LlamaIndex (framework dédié RAG)",
    "Évaluation LLMs (faithfulness, relevance, hallucination, RAGAS, LangSmith)",
    "Stratégies prod (caching, fallback providers, streaming UX, coûts, rate limits)",
    "Prompt injection + défense (separation user/system, sanitization, sandboxing tools)",
    "Vercel AI SDK (TS, Next/React), CrewAI (multi-agents Python), Langroid, AutoGen",
  ],
  prerequisites: "Modules 8-22 (fullstack) + Module 24 (Python)",
  estimatedHours: 50,
  estimatedWeeks: 4,
  stackAllowed: [
    "Python 3.12+ + uv + Anthropic SDK + OpenAI SDK + Mistral SDK",
    "Voyage AI + pgvector + LlamaIndex + Instructor + Pydantic + RAGAS",
    "Streamlit pour UI test + MCP Python SDK",
  ],
  prereqModuleId: "m24-python-scripting-data",
  unlockSrsMatureRatio: 80,
};

export const m25Skills: NewSkill[] = [
  { moduleId: M25_ID, slug: "llm-concept", label: "LLM = next token predictor (transformer)", displayOrder: 1, weight: 3 },
  { moduleId: M25_ID, slug: "model-families", label: "Familles 2026 (Claude/GPT/Gemini/Mistral/Llama/DeepSeek)", displayOrder: 2, weight: 1 },
  { moduleId: M25_ID, slug: "sdks", label: "Anthropic/OpenAI/Mistral SDKs + retry/streaming", displayOrder: 3, weight: 3 },
  { moduleId: M25_ID, slug: "params", label: "temperature, top_p, max_tokens, JSON mode", displayOrder: 4, weight: 2 },
  { moduleId: M25_ID, slug: "prompt-eng", label: "Prompt engineering (zero/few-shot, CoT, ReAct)", displayOrder: 5, weight: 3 },
  { moduleId: M25_ID, slug: "xml-prompts", label: "XML-tag prompts (Anthropic style)", displayOrder: 6, weight: 2 },
  { moduleId: M25_ID, slug: "structured-output", label: "JSON mode + tool_use forcé + Pydantic/Zod", displayOrder: 7, weight: 3 },
  { moduleId: M25_ID, slug: "embeddings", label: "Embeddings + cosine similarity", displayOrder: 8, weight: 3 },
  { moduleId: M25_ID, slug: "vector-db", label: "pgvector / Qdrant / Pinecone — quand utiliser quoi", displayOrder: 9, weight: 3 },
  { moduleId: M25_ID, slug: "rag", label: "RAG : loader → chunker → embedder → retriever → reranker → LLM", displayOrder: 10, weight: 3 },
  { moduleId: M25_ID, slug: "chunking", label: "Chunking patterns (fixed/recursive/semantic/structure)", displayOrder: 11, weight: 2 },
  { moduleId: M25_ID, slug: "rerank", label: "Reranking (Cohere/Voyage rerank)", displayOrder: 12, weight: 2 },
  { moduleId: M25_ID, slug: "agents-react", label: "Agents ReAct (Reason + Act + tool use)", displayOrder: 13, weight: 3 },
  { moduleId: M25_ID, slug: "mcp", label: "MCP (Model Context Protocol) Anthropic", displayOrder: 14, weight: 2 },
  { moduleId: M25_ID, slug: "frameworks", label: "LangChain/LangGraph/LlamaIndex/CrewAI — quand utiliser", displayOrder: 15, weight: 1 },
  { moduleId: M25_ID, slug: "evaluation", label: "Évaluation (faithfulness, RAGAS, LangSmith, Braintrust)", displayOrder: 16, weight: 2 },
  { moduleId: M25_ID, slug: "prod-strategies", label: "Prod : caching, fallback, streaming, coûts, rate limits", displayOrder: 17, weight: 3 },
  { moduleId: M25_ID, slug: "prompt-injection", label: "Prompt injection + défense (sandboxing, validation)", displayOrder: 18, weight: 2 },
  { moduleId: M25_ID, slug: "prompt-caching", label: "Prompt caching (90% économies sur re-uses)", displayOrder: 19, weight: 2 },
  { moduleId: M25_ID, slug: "vercel-ai-sdk", label: "Vercel AI SDK (TS) + alternatives", displayOrder: 20, weight: 1 },
];

export const m25SkillAxisRules = m25Skills.map((s) => ({ skillSlug: s.slug, axisId: "backend", contribution: 100 }));

export const m25Videos: NewVideo[] = [
  {
    moduleId: M25_ID,
    isPrimary: 1,
    title: "Intro to Large Language Models — Andrej Karpathy",
    creator: "Andrej Karpathy",
    youtubeId: "zjkBMFhNj_g",
    language: "en",
    durationSeconds: 60 * 60,
    whyThisOne: "OBLIGATOIRE. Meilleur intro grand public par un des meilleurs chercheurs ML (ex OpenAI, Tesla).",
    coversSkills: ["llm-concept", "model-families"],
    displayOrder: 1,
  },
  {
    moduleId: M25_ID,
    isPrimary: 0,
    title: "Anthropic Prompt Engineering Tutorial (interactif gratuit)",
    creator: "Anthropic",
    externalUrl: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
    language: "en",
    whyThisOne: "OBLIGATOIRE. 9 chapitres officiels Anthropic. Méthodologie XML-tag, CoT, structured output.",
    coversSkills: ["prompt-eng", "xml-prompts", "structured-output"],
    displayOrder: 2,
  },
  {
    moduleId: M25_ID,
    isPrimary: 0,
    title: "Building Effective Agents (Anthropic engineering)",
    creator: "Anthropic Research",
    externalUrl: "https://www.anthropic.com/research/building-effective-agents",
    language: "en",
    whyThisOne: "OBLIGATOIRE pour ton cas Flaynn. Patterns d'agents efficaces selon Anthropic.",
    coversSkills: ["agents-react"],
    displayOrder: 3,
  },
  {
    moduleId: M25_ID,
    isPrimary: 0,
    title: "RAG From Scratch (LangChain)",
    creator: "LangChain team",
    externalUrl: "https://github.com/langchain-ai/rag-from-scratch",
    language: "en",
    whyThisOne: "Série vidéos qui couvre RAG en profondeur : indexing, query translation, routing, retrieval, generation.",
    coversSkills: ["rag", "chunking", "rerank"],
    displayOrder: 4,
  },
];

export const m25Exercises: NewExercise[] = [
  {
    moduleId: M25_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : RAG + agents + prompt caching",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "RAG vs juste long context — quand RAG ?",
        options: [
          "Toujours long context",
          "RAG quand : knowledge base évolue (vs recoder le prompt), citation des sources requise, coût (chunks ciblés = moins de tokens), latence",
          "Long context obsolète",
          "Identiques",
        ],
        correctIndex: 1,
        explanation: "Long context (1M tokens Gemini) = OK pour 1 doc. RAG = quand 1000s docs, mises à jour fréquentes, citations sourcées, coûts maîtrisés. Choix selon volume + dynamique des données.",
      },
      {
        question: "Anthropic prompt caching — gain ?",
        options: [
          "Aucun",
          "Cache_control: ephemeral sur system/context → 90% de réduction coût + latence sur re-uses dans 5 min",
          "Plus rapide à coder",
          "Obsolète",
        ],
        correctIndex: 1,
        explanation: "Tu marques system prompt + module context comme cachable. Si réutilisé dans les 5 min : cache_read_input_tokens à 10% du prix. Critique quand budget tendu (coach permanent).",
      },
      {
        question: "Agent ReAct — boucle ?",
        options: [
          "Linéaire",
          "Thought → Action (tool call) → Observation (résultat) → Thought → ... → Final Answer. Avec garde-fous max iterations + budget tokens.",
          "Récursif infini",
          "1 appel LLM",
        ],
        correctIndex: 1,
        explanation: "Agent = boucle LLM + tools. Sans garde-fou : runaway costs (100 itérations × 5k tokens). Toujours : max iterations (15), budget cap (1$), sandbox tools, logging step-by-step.",
      },
    ],
    skillSlugs: ["rag", "prompt-caching", "agents-react"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M25_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "python",
    title: "AI Forge — 3 systèmes IA progressifs (Flaynn-ready)",
    statement: `3 systèmes IA qui t'apportent direct de la valeur sur Flaynn.

**Système 1 — prompt-eng-lab** (10h)
- Python + uv + Anthropic + Instructor + Pydantic
- A/B test 3 versions de prompt sur scoring Flaynn (6 piliers)
  - V1 naïf, V2 structuré XML + few-shot, V3 CoT obligatoire + validation
- Forcer JSON output via Instructor (Pydantic models)
- Mesurer 10 dossiers : coût, temps, cohérence, qualité
- Tester Claude Opus, Sonnet, Haiku, GPT-4, Mistral Large → meilleur ratio qualité/prix
- RESULTS.md directement réutilisable Flaynn V5

**Système 2 — flaynn-rag** (15h) production-ready
- Use case : poser questions naturelles sur tous tes dossiers scorés
- Stack : Postgres + pgvector + Anthropic Claude + Voyage AI 1024d + LlamaIndex + Streamlit
- Pipeline RAG complet :
  - Loader : rapports scoring JSON Flaynn existants
  - Chunker : par section × pilier × dossier
  - Metadata : {startup_name, sector, score, date, pillar}
  - Embedder : voyage-3-large
  - Store : pgvector + HNSW index
  - Retriever : hybrid (vector + full-text Postgres) + filter metadata
  - Rerank : Voyage Rerank → top-5
  - Generation : Claude Sonnet + citations
- Évaluation RAGAS : 30 Q/A test, faithfulness ≥ 0.85, context recall ≥ 0.80
- UI Streamlit minimaliste

**Système 3 — flaynn-research-agent** (15h)
- Agent ReAct : nom startup → mini-rapport pré-screening auto
- Tools : search_web (Brave/Tavily), fetch_url, linkedin_lookup, crunchbase_lookup, query_flaynn_rag
- Stack : Anthropic SDK direct + tool_use natif (pas LangGraph V0)
- Boucle while + max 15 itérations + budget 1$ + sandbox tools
- Output : rapport markdown structuré (équipe, BM, traction, marché, signals, score préliminaire)
- Use case direct : "regarde cette startup" → rapport en 2 min vs 30 min manuel

**Système 4 (bonus) — mcp-server-flaynn** (5h)
- MCP server exposant 3-4 tools Flaynn via standard MCP
- MCP Python SDK
- Connecter à Claude Code local → "compare scoring X et Y" interroge ton MCP

**Critères**
- Système 1 : 3 prompts mesurés (coût/temps/qualité)
- Système 2 : RAGAS scores measurés, UI utilisable
- Système 3 : 5/5 sessions test sans crash, dans budget
- Python type-hinted, Ruff clean, ≥ 5 tests par système
- Coût total tests < 50$
- README + Loom 3min démo`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["prompt-eng", "structured-output", "rag", "embeddings", "agents-react", "evaluation"],
    passThresholdPct: 100,
    estimatedMinutes: 50 * 60,
    displayOrder: 2,
  },
];
