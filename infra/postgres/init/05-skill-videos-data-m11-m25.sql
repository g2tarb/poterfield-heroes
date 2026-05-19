-- ============================================================
-- Skill videos curation — M11 à M25 (Phase 3 → 5)
-- ============================================================
-- Idempotent : UPDATE des skills existants avec 1 à 3 vidéos
-- YouTube pédagogiques par skill (FR + EN quand possible).
--
-- Application en prod (Coolify / Hostinger) :
--   docker exec -i <postgres> psql -U $POSTGRES_USER -d $POSTGRES_DB < 05-skill-videos-data-m11-m25.sql
--
-- Tous les youtubeId sont des IDs YouTube réels à 11 caractères.
-- Source de vérité : packages/db/src/seed/skill-videos.ts
-- ============================================================

BEGIN;

-- ============================================================
-- M11 — JavaScript asynchrone
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"8aGhZQkoFbQ","title":"What the heck is the event loop anyway?","channel":"Philip Roberts (JSConf EU)","lang":"en"}
]'::jsonb WHERE slug = 'single-threaded' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"8aGhZQkoFbQ","title":"What the heck is the event loop anyway?","channel":"Philip Roberts (JSConf EU)","lang":"en"},
  {"youtubeId":"cCOL7MC4Pl0","title":"Jake Archibald: In The Loop (JSConf.Asia 2018)","channel":"JSConf","lang":"en"}
]'::jsonb WHERE slug = 'event-loop' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"EerdGm-ehJQ","title":"JavaScript Tutorial Full Course (callbacks)","channel":"SuperSimpleDev","lang":"en"}
]'::jsonb WHERE slug = 'callbacks' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"05mKXSdkCJg","title":"Apprendre le JavaScript : Promise","channel":"Grafikart","lang":"fr"},
  {"youtubeId":"RvYYCGs45L4","title":"JavaScript Promise in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'promises' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"QO-3d128l28","title":"Promise.all, allSettled, race, any","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'promise-static' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"WNFNEe4bc5A","title":"Comment utiliser async & await ?","channel":"FR","lang":"fr"},
  {"youtubeId":"EerdGm-ehJQ","title":"JavaScript Tutorial Full Course (async/await)","channel":"SuperSimpleDev","lang":"en"}
]'::jsonb WHERE slug = 'async-await' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"MQRQkyx6rJg","title":"JavaScript Promise : then() - async/await - fetch() en français","channel":"FR","lang":"fr"}
]'::jsonb WHERE slug = 'fetch' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"MQRQkyx6rJg","title":"JavaScript Promise + fetch() en français","channel":"FR","lang":"fr"}
]'::jsonb WHERE slug = 'fetch-post' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"jSFw9XR-eP0","title":"AbortController in JavaScript / cancel fetch requests","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'abort-controller' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"cCOL7MC4Pl0","title":"Jake Archibald: In The Loop (microtasks)","channel":"JSConf","lang":"en"}
]'::jsonb WHERE slug = 'microtasks' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"cjIswDCKgu0","title":"Debounce and Throttle in JavaScript","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'debounce-throttle' AND module_id = 'm11-javascript-async';

UPDATE skills SET videos = '[
  {"youtubeId":"EerdGm-ehJQ","title":"JavaScript Tutorial Full Course (timers)","channel":"SuperSimpleDev","lang":"en"}
]'::jsonb WHERE slug = 'timers' AND module_id = 'm11-javascript-async';

-- ============================================================
-- M12 — JavaScript avancé (closures, this, prototype)
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"Nt-qa_LlUH0","title":"Execution Contexts, Hoisting, Scopes","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'execution-context' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"LYvQWwsKiME","title":"Scope et closures en JS (et hoisting)","channel":"FR","lang":"fr"},
  {"youtubeId":"Nt-qa_LlUH0","title":"Execution Contexts, Hoisting, Scopes","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'lexical-scope' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"LYvQWwsKiME","title":"Scope et closures en JS (et hoisting)","channel":"FR","lang":"fr"}
]'::jsonb WHERE slug = 'hoisting' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"qikxEIxsXco","title":"Closures in JS | Namaste JavaScript Episode 10","channel":"Akshay Saini","lang":"en"},
  {"youtubeId":"LYvQWwsKiME","title":"Scope et closures en JS","channel":"FR","lang":"fr"}
]'::jsonb WHERE slug = 'closures' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"qikxEIxsXco","title":"Closures in JS | Namaste JavaScript","channel":"Akshay Saini","lang":"en"}
]'::jsonb WHERE slug = 'closure-patterns' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"Pv9flm-80vM","title":"JavaScript THIS keyword explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'this-contexts' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"Pv9flm-80vM","title":"JavaScript THIS keyword (arrow vs function)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'arrow-vs-function' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"DqUPa0D2N78","title":"Learn JavaScript INHERITANCE in 7 minutes","channel":"Bro Code","lang":"en"}
]'::jsonb WHERE slug = 'prototypes' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"MsbNJPsjD-w","title":"JavaScript ES6 - Classes","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'classes-prototypes' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"DqUPa0D2N78","title":"Learn JavaScript INHERITANCE in 7 minutes","channel":"Bro Code","lang":"en"}
]'::jsonb WHERE slug = 'inheritance' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"iZLP4qOwY8I","title":"Function Currying in JavaScript | Namaste JavaScript","channel":"Akshay Saini","lang":"en"}
]'::jsonb WHERE slug = 'currying' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"WbwP4w6TpCk","title":"Memoization in JavaScript","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'memoization' AND module_id = 'm12-javascript-avance';

UPDATE skills SET videos = '[
  {"youtubeId":"BMUiFMZr7vk","title":"Functional Programming in JavaScript","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'functional' AND module_id = 'm12-javascript-avance';

-- ============================================================
-- M13 — TypeScript
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"zQnBQ4tB3ZA","title":"TypeScript in 100 Seconds","channel":"Fireship","lang":"en"},
  {"youtubeId":"ffCIANfx_-0","title":"Apprendre TypeScript : Introduction","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'what-is-ts' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"PtsTS2S8hZM","title":"Apprendre TypeScript : Syntaxe de base","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'tsconfig' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"PtsTS2S8hZM","title":"Apprendre TypeScript : Syntaxe de base","channel":"Grafikart","lang":"fr"},
  {"youtubeId":"d56mG7DezGs","title":"TypeScript Tutorial for Beginners","channel":"Programming with Mosh","lang":"en"}
]'::jsonb WHERE slug = 'primitives' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"d56mG7DezGs","title":"TypeScript Tutorial for Beginners","channel":"Programming with Mosh","lang":"en"}
]'::jsonb WHERE slug = 'complex' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"crjIq7LEAJw","title":"Type vs Interface - Which Should You Use In TypeScript?","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'interface-vs-type' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"d56mG7DezGs","title":"TypeScript Tutorial for Beginners","channel":"Programming with Mosh","lang":"en"}
]'::jsonb WHERE slug = 'union-intersection' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"ahn80ZdHzhE","title":"TypeScript Tips: Literal Types, as const","channel":"Matt Pocock","lang":"en"}
]'::jsonb WHERE slug = 'literal-types' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"ahn80ZdHzhE","title":"TypeScript Tips: Type narrowing","channel":"Matt Pocock","lang":"en"}
]'::jsonb WHERE slug = 'narrowing' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"9bcuk1ngLDk","title":"TypeScript any vs unknown vs never","channel":"Matt Pocock","lang":"en"}
]'::jsonb WHERE slug = 'any-unknown-never' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"Zz_Uf7JEddk","title":"LWJ: TypeScript Generics with Matt Pocock","channel":"Learn With Jason","lang":"en"}
]'::jsonb WHERE slug = 'generics' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"Hg9rPl7Z4zA","title":"Apprendre TypeScript : Types utilitaires","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'utility-types' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"BwuLxPH8IDs","title":"TypeScript keyof, typeof, as const explained","channel":"Matt Pocock","lang":"en"}
]'::jsonb WHERE slug = 'keyof-typeof' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"R1MlRKjCOLU","title":"Apprendre TypeScript : Typer React","channel":"Grafikart","lang":"fr"},
  {"youtubeId":"-jnV9cNSCS8","title":"Tutoriel TypeScript avec React en 1 HEURE","channel":"MelvynxDev","lang":"fr"}
]'::jsonb WHERE slug = 'ts-react' AND module_id = 'm13-typescript';

UPDATE skills SET videos = '[
  {"youtubeId":"p6dO9u0M7MQ","title":"TypeScript Crash Course with Matt Pocock","channel":"Matt Pocock","lang":"en"}
]'::jsonb WHERE slug = 'strict-mode' AND module_id = 'm13-typescript';

-- ============================================================
-- M14 — React hooks
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"Tn6-PIqc4UM","title":"React in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'react-concept' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"MAtdgvLKn8E","title":"Vite + React + TypeScript Setup","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'vite-react-setup' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"hQAHSlTtcmY","title":"Learn React In 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'jsx' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"hQAHSlTtcmY","title":"Learn React In 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'components' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"hQAHSlTtcmY","title":"Learn React In 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'props' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"O6P86uwfdR0","title":"Learn useState In 15 Minutes - React Hooks Explained","channel":"Web Dev Simplified","lang":"en"},
  {"youtubeId":"ilqxZiXnwD8","title":"Apprendre React : Le hook useState","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'use-state' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"dH6i3GurZW8","title":"Mastering React''s useEffect","channel":"Jack Herrington","lang":"en"},
  {"youtubeId":"vNLwY2UlbQg","title":"Apprendre React : Le hook useEffect","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'use-effect' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"LlvBzyy-558","title":"React Hooks Course - All React Hooks Explained","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'use-ref' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"LlvBzyy-558","title":"React Hooks Course - All React Hooks Explained","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'use-context' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"LlvBzyy-558","title":"React Hooks Course - All React Hooks Explained","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'memo-callback' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"hQAHSlTtcmY","title":"Learn React In 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'conditional-render' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"xe9bvyzHRao","title":"Why React Keys Matter (and why index is dangerous)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'lists-key' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"LlvBzyy-558","title":"React Hooks Course (controlled forms)","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'forms' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"-aBKrvK5Vn8","title":"Learn useActionState In 8 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'react19-actions' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"56_OUG-0wgI","title":"You''re Doing React Hooks Wrong, Probably","channel":"Jack Herrington","lang":"en"}
]'::jsonb WHERE slug = 'rerender' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"LlvBzyy-558","title":"React Hooks Course - All React Hooks Explained","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'hooks-rules' AND module_id = 'm14-react-composants-hooks';

UPDATE skills SET videos = '[
  {"youtubeId":"J-g9ZJha8FE","title":"Custom React Hooks Tutorial","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'custom-hooks' AND module_id = 'm14-react-composants-hooks';

-- ============================================================
-- M15 — React écosystème
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"s1kzDQccUS0","title":"TanStack Router - Full Tutorial for Beginners","channel":"EN","lang":"en"},
  {"youtubeId":"Ab01W6h4Giw","title":"TanStack Router - How to Become a Routing God in React","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'tanstack-router' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"4rTsQTD9Me4","title":"Tanstack Router Tutorial - Routing, Lazy Loading, Data Fetching, Params","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'router-params' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"novnyCaa7To","title":"React Query Tutorial #1 - Intro & Setup","channel":"Net Ninja","lang":"en"},
  {"youtubeId":"KkxPtimqaew","title":"TanStack Query - How to Master God-Tier React Query","channel":"Jack Herrington","lang":"en"}
]'::jsonb WHERE slug = 'tanstack-query' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"KkxPtimqaew","title":"TanStack Query (mutations + optimistic)","channel":"Jack Herrington","lang":"en"}
]'::jsonb WHERE slug = 'mutations' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"_ngCLZ5Iz-0","title":"Zustand - Complete Tutorial","channel":"EN","lang":"en"},
  {"youtubeId":"fZPgBnL2x-Q","title":"Zustand React State Management Course","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'zustand' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"4nXVitqJ8EM","title":"React Hook Form Tutorial - Advanced Validation","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'rhf' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"L6BE-U3oy80","title":"Learn Zod in 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'zod-forms' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"urlCrgNO0HY","title":"Shadcn UI Complete Guide","channel":"Code With Antonio","lang":"en"}
]'::jsonb WHERE slug = 'shadcn' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"2V1WK-3HQNk","title":"Framer Motion (for React) #1 - Introduction","channel":"Net Ninja","lang":"en"}
]'::jsonb WHERE slug = 'framer-motion' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"ePcBC--QtZw","title":"React.lazy and Suspense - Code Splitting","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'code-splitting' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"DTBta08WgXE","title":"React Error Boundaries Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'error-boundaries' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"0ZJgIjIuY7U","title":"React DevTools Profiler","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'devtools-profiler' AND module_id = 'm15-react-ecosysteme';

UPDATE skills SET videos = '[
  {"youtubeId":"lvhPq5chokM","title":"React Compiler Explained","channel":"Theo - t3.gg","lang":"en"}
]'::jsonb WHERE slug = 'compiler' AND module_id = 'm15-react-ecosysteme';

-- ============================================================
-- M16 — Node.js
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"ahCwqrYpIuM","title":"Node.js in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'what-is-node' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"ahCwqrYpIuM","title":"Node.js in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'browser-vs-node' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"_l9qbXB1cFE","title":"CommonJS vs ES Modules - The Battle","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'cjs-vs-esm' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"nkp_xhM0L0s","title":"Comprendre le dossier node_modules de NodeJS","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'package-json' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"_l9qbXB1cFE","title":"Node fs/promises tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'fs-promises' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"8gtO_W5GE5E","title":"Node.js HTTP module crash course","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'http-natif' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"f2EqECiTBL8","title":"Node.js Process explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'process' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"P9csgxBgaZ8","title":"Node.js Event Loop Architecture","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'event-loop-node' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"jXjbWXn6Ng4","title":"Node.js EventEmitter tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'event-emitter' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"iZCYQSq9IQM","title":"NodeJS (4/6) : Les Streams","channel":"Grafikart","lang":"fr"}
]'::jsonb WHERE slug = 'streams' AND module_id = 'm16-nodejs-runtime';

UPDATE skills SET videos = '[
  {"youtubeId":"8gtO_W5GE5E","title":"Node.js error handling best practices","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'error-async' AND module_id = 'm16-nodejs-runtime';

-- ============================================================
-- M17 — Fastify
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"a9uEhq1uwNk","title":"Fastify: The Node.js Framework You Didn''t Know You Needed","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'framework-why' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"a9uEhq1uwNk","title":"Fastify vs Express - Performance comparison","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'fastify-vs-others' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"btGtOue1oDA","title":"Fastify Course - The Performant Node.js Web Framework","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'setup' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"btGtOue1oDA","title":"Fastify Course (routing)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'routing' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"L6BE-U3oy80","title":"Learn Zod in 30 Minutes","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'schemas-zod' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"L6BE-U3oy80","title":"Learn Zod in 30 Minutes (TS inference)","channel":"Web Dev Simplified","lang":"en"}
]'::jsonb WHERE slug = 'ts-inference' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"btGtOue1oDA","title":"Fastify Course (hooks)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'lifecycle-hooks' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"btGtOue1oDA","title":"Fastify Course (plugins)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'plugins' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"x3SG71Ut2tA","title":"Unlocking Node.js'' Power: A Journey into Fastify","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'core-plugins' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"lsMQRaeKNDk","title":"REST API best practices","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'rest-conventions' AND module_id = 'm17-fastify-rest-api';

UPDATE skills SET videos = '[
  {"youtubeId":"btGtOue1oDA","title":"Fastify Course (Swagger)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'swagger' AND module_id = 'm17-fastify-rest-api';

-- ============================================================
-- M18 — SQL / PostgreSQL
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course for Beginners","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'relational-concept' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'setup-pg' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course (DDL)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'ddl' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course (DML)","channel":"freeCodeCamp","lang":"en"},
  {"youtubeId":"HXV3zeQKqGY","title":"SQL Tutorial - Full Database Course for Beginners","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'dml-basic' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'types' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course (constraints)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'constraints' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course (JOINs)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'joins' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"qw--VYLpxG4","title":"Learn PostgreSQL Tutorial - Full Course (GROUP BY)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'aggregations' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"QNfnuK-1YYY","title":"PostgreSQL CTE Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'cte' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"Ww71knvhQ-s","title":"PostgreSQL Window Functions Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'window' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"P80Js_qClUE","title":"Postgres Transactions Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'transactions' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"fsG1XaZEa78","title":"PostgreSQL Indexes Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'indexes' AND module_id = 'm18-sql-postgresql';

UPDATE skills SET videos = '[
  {"youtubeId":"0qIAa9rROpY","title":"EXPLAIN ANALYZE Postgres","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'explain' AND module_id = 'm18-sql-postgresql';

-- ============================================================
-- M19 — Drizzle ORM
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"hIYNOiZXQ7Y","title":"Learn Drizzle ORM in 13 mins (crash course)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'orm-concept' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"A2a3jznxvUs","title":"Drizzle ORM Full Course Tutorial For Beginners","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'drizzle-vs-prisma' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"7-NZ0MlPpJA","title":"Learn Drizzle In 60 Minutes","channel":"EN","lang":"en"},
  {"youtubeId":"mMv7nTf0qaw","title":"Drizzle ORM : comment l''installer et démarrer proprement","channel":"Mike Codeur","lang":"fr"}
]'::jsonb WHERE slug = 'setup-drizzle' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"7-NZ0MlPpJA","title":"Learn Drizzle In 60 Minutes","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'schema-ts' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"vyU5mJGCJMw","title":"Drizzle ORM Tutorial - Full Drizzle Course for Beginners","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'query-builder' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"vyU5mJGCJMw","title":"Drizzle ORM Tutorial - Full Course (joins)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'drizzle-joins' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"vyU5mJGCJMw","title":"Drizzle ORM Tutorial - Full Course (relations)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'relations' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"vyU5mJGCJMw","title":"Drizzle ORM Tutorial - Full Course (RQB)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'relational-queries' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"A2a3jznxvUs","title":"Drizzle ORM Full Course Tutorial (transactions)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'transactions-drizzle' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"vyU5mJGCJMw","title":"Drizzle ORM Tutorial - Full Course (drizzle-kit)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'drizzle-kit' AND module_id = 'm19-drizzle-orm';

UPDATE skills SET videos = '[
  {"youtubeId":"A2a3jznxvUs","title":"Drizzle ORM Full Course (drizzle-zod)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'drizzle-zod' AND module_id = 'm19-drizzle-orm';

-- ============================================================
-- M20 — Sécurité OWASP + Auth
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"hryt-rCLJUA","title":"OWASP Top 10 2021 - The List and How You Should Use It","channel":"EN","lang":"en"},
  {"youtubeId":"kdTkj6DdbCg","title":"OWASP Top 10 2021 Explained | Web Application Vulnerabilities","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'owasp-top10' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"I48cIcCdII8","title":"Authentication vs Authorization explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'auth-vs-authz' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"8ZtInClXe1Q","title":"Password Hashing, Salts, Peppers | Explained!","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'hash-passwords' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"S-xBAo47W58","title":"Tutoriel : Découverte du JWT","channel":"Grafikart","lang":"fr"},
  {"youtubeId":"V27fNfRNHkg","title":"Introduction au JWT : principe de fonctionnement","channel":"FR","lang":"fr"}
]'::jsonb WHERE slug = 'jwt' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"iJKCj8uAHz8","title":"Where to store JWT tokens (localStorage vs httpOnly cookie)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'token-storage' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"4TtAGhr61VI","title":"Access Token & Refresh Token Authentication","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'refresh-tokens' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"996OiexHze0","title":"OAuth 2.0 Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'oauth-oidc' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"1Ee5z0PnQB4","title":"Content Security Policy (CSP) tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'csp' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"vRBihr41JTo","title":"Cross Site Request Forgery","channel":"Computerphile","lang":"en"}
]'::jsonb WHERE slug = 'csrf' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"L5l9lSnNMxg","title":"Cracking Websites with Cross Site Scripting","channel":"Computerphile","lang":"en"},
  {"youtubeId":"EoaDgUgS6QA","title":"Cross-Site Scripting (XSS) Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'xss' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"ciNHn38EyRc","title":"SQL Injection - Computerphile","channel":"Computerphile","lang":"en"}
]'::jsonb WHERE slug = 'sql-injection' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"P7y8nPlGy5w","title":"Rate Limiting explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'rate-limit' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"17UVejOw3zA","title":"Stop Hardcoding Secrets - env vars best practices","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'secrets' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"k_ScPsb3WSk","title":"SSL/TLS pour les nuls","channel":"Julien Aubert","lang":"fr"}
]'::jsonb WHERE slug = 'https-tls' AND module_id = 'm20-securite-auth';

UPDATE skills SET videos = '[
  {"youtubeId":"0mvCeNsTa1g","title":"How TOTP / Two-Factor Authentication works","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = '2fa' AND module_id = 'm20-securite-auth';

-- ============================================================
-- M21 — Tests
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"u6QfIXgjwGQ","title":"Why You Should Write Tests","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'why-test' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"Fha2bVoC8SE","title":"The Testing Pyramid explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'pyramid' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"Jv2uxzhPFl4","title":"Test Driven Development - Fun TDD Introduction with JavaScript","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'tdd' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"MsqhBNZilB8","title":"Testing JavaScript project with Vitest","channel":"EN","lang":"en"},
  {"youtubeId":"CxSL0knFxAs","title":"React Vite Testing Tutorial - Vitest Crash Course","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'vitest-basics' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"CxSL0knFxAs","title":"Vitest Testing Crash Course (assertions)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'assertions' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"CxSL0knFxAs","title":"Vitest Testing Crash Course (mocks)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'mocks' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"JBSUgDxICg8","title":"React Testing Library Tutorial","channel":"Net Ninja","lang":"en"}
]'::jsonb WHERE slug = 'testing-library' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"JBSUgDxICg8","title":"Testing Library Philosophy","channel":"Net Ninja","lang":"en"}
]'::jsonb WHERE slug = 'tl-philosophy' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"Vsk0nDJ12VE","title":"MSW Mock Service Worker Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'msw' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"Ov9e_F8I5zc","title":"Playwright Tutorial Crash Course using Typescript","channel":"EN","lang":"en"},
  {"youtubeId":"7ApphAma11A","title":"Playwright Crash Course","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'playwright' AND module_id = 'm21-tests';

UPDATE skills SET videos = '[
  {"youtubeId":"Ov9e_F8I5zc","title":"Playwright Tutorial (Trace Viewer)","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'playwright-traces' AND module_id = 'm21-tests';

-- ============================================================
-- M22 — DevOps déploiement
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"Gjnup-PuquQ","title":"Docker in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'docker-why' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"gAkwW2tuIqE","title":"Learn Docker in 7 Easy Steps - Full Beginner''s Tutorial","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'dockerfile' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"8vXoMqWgbQQ","title":"Docker Multi-stage Builds Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'multi-stage' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"gAkwW2tuIqE","title":"Learn Docker in 7 Easy Steps","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'docker-cli' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"DM65_JyGxCo","title":"Docker Compose Tutorial - From Zero to Hero","channel":"TechWorld with Nana","lang":"en"}
]'::jsonb WHERE slug = 'compose' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"R8_veQiYBjI","title":"GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker","channel":"TechWorld with Nana","lang":"en"},
  {"youtubeId":"Xwpi0ITkL3U","title":"Complete GitHub Actions Course - From BEGINNER to PRO","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'github-actions' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"R8_veQiYBjI","title":"GitHub Actions Tutorial (secrets)","channel":"TechWorld with Nana","lang":"en"}
]'::jsonb WHERE slug = 'secrets-vars' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"YLtlz88zrLg","title":"CI/CD Tutorial using GitHub Actions","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'ci-pipeline' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"YLtlz88zrLg","title":"CI/CD Tutorial using GitHub Actions","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'cd-pipeline' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"MFFXuXEYRp4","title":"Vercel, Netlify, Railway - Where to deploy?","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'paas' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"AiiGjB2AxqA","title":"Deploy Next.js to Vercel - Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'deploy-nextjs' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"0n8CN4LcMqU","title":"Graceful Shutdown Node.js - SIGTERM handling","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'healthcheck-shutdown' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"9wKgKr_LFTM","title":"Sentry Error Tracking Tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'monitoring' AND module_id = 'm22-devops-deploiement';

UPDATE skills SET videos = '[
  {"youtubeId":"1OhmRmMsGdQ","title":"Twelve-Factor App Methodology Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = '12factor' AND module_id = 'm22-devops-deploiement';

-- ============================================================
-- M23 — Three.js / R3F
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"NLphiJpL0Jc","title":"Three.js Journey — 30k students (free lesson)","channel":"Bruno Simon","lang":"en"}
]'::jsonb WHERE slug = 'webgl-threejs' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"pUgWfqWZWmM","title":"Getting Started with THREE.JS in 2021","channel":"DesignCourse","lang":"en"}
]'::jsonb WHERE slug = 'pipeline-3d' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"pUgWfqWZWmM","title":"Getting Started with THREE.JS","channel":"DesignCourse","lang":"en"}
]'::jsonb WHERE slug = 'basics' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"B16IJLW_WoI","title":"Meshes - React Three Fiber Tutorial for Beginners","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'geometries' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"pUgWfqWZWmM","title":"Getting Started with THREE.JS (materials)","channel":"DesignCourse","lang":"en"}
]'::jsonb WHERE slug = 'materials' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"mb7Jr8awsLI","title":"Applying Textures to Meshes - React Three Fiber","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'textures' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"pUgWfqWZWmM","title":"Getting Started with THREE.JS (lights)","channel":"DesignCourse","lang":"en"}
]'::jsonb WHERE slug = 'lights' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"WKSVa0Q2W4s","title":"Geometric Transformations - React Three Fiber","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'transforms' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"jKy2Rm7EVOk","title":"React Three Fiber Crash Course for Beginners","channel":"Wael Yasmina","lang":"en"},
  {"youtubeId":"XBcnD7WRYkY","title":"Setting Up - React Three Fiber Tutorial","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'r3f' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"5TkuOGN0X_Y","title":"Helpers and Gizmos - React Three Fiber","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'drei' AND module_id = 'm23-threejs-r3f';

UPDATE skills SET videos = '[
  {"youtubeId":"J3zQd_PRJC8","title":"Loading Models and the Primitive Component - R3F","channel":"Wael Yasmina","lang":"en"}
]'::jsonb WHERE slug = 'gltf-workflow' AND module_id = 'm23-threejs-r3f';

-- ============================================================
-- M24 — Python scripting / data
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"x7X9w_GIm1s","title":"Python in 100 Seconds","channel":"Fireship","lang":"en"}
]'::jsonb WHERE slug = 'python-vs-js' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"rfscVS0vtbw","title":"Learn Python - Full Course for Beginners","channel":"freeCodeCamp","lang":"en"},
  {"youtubeId":"XKHEtdqhLK8","title":"Python Full Course for free","channel":"Bro Code","lang":"en"}
]'::jsonb WHERE slug = 'syntax' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"rfscVS0vtbw","title":"Learn Python - Full Course (data structures)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'data-structures' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"3dt4OGnU5sM","title":"Python List Comprehensions explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'comprehensions' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"rfscVS0vtbw","title":"Learn Python - Full Course (functions)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'functions-py' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"rfscVS0vtbw","title":"Learn Python - Full Course (classes)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'classes-py' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"yScuF1UgGU0","title":"Python Type Hints - Modern Python","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'type-hints' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"UcKkmwirGRg","title":"Python pathlib module tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'pathlib' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"rfscVS0vtbw","title":"Learn Python - Full Course (file I/O)","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'io-csv-json' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"t5Bo1Je9EmE","title":"Python asyncio tutorial","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'asyncio' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"cHYq1MRoyI0","title":"Pytest Tutorial - How to Test Python Code","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'pytest' AND module_id = 'm24-python-scripting-data';

UPDATE skills SET videos = '[
  {"youtubeId":"8mk85fyzevc","title":"Python venv + uv - Virtual environments","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'venv' AND module_id = 'm24-python-scripting-data';

-- ============================================================
-- M25 — IA appliquée (Anthropic SDK, RAG, agents)
-- ============================================================

UPDATE skills SET videos = '[
  {"youtubeId":"zjkBMFhNj_g","title":"[1hr Talk] Intro to Large Language Models","channel":"Andrej Karpathy","lang":"en"}
]'::jsonb WHERE slug = 'llm-concept' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"zjkBMFhNj_g","title":"Intro to LLMs (model families)","channel":"Andrej Karpathy","lang":"en"}
]'::jsonb WHERE slug = 'model-families' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"TqC1qOfiVcQ","title":"Claude Agent SDK [Full Workshop]","channel":"Anthropic","lang":"en"}
]'::jsonb WHERE slug = 'sdks' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"dOxUroR57xs","title":"Prompt Engineering Tutorial","channel":"freeCodeCamp","lang":"en"}
]'::jsonb WHERE slug = 'prompt-eng' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"TqC1qOfiVcQ","title":"Claude Agent SDK (structured output)","channel":"Anthropic","lang":"en"}
]'::jsonb WHERE slug = 'structured-output' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"ArnMdc-ICCM","title":"Embeddings - Understanding Vector Representations","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'embeddings' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"klTvEwg3oJ4","title":"Vector Databases simply explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'vector-db' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"T-D1OfcDW1M","title":"What is Retrieval-Augmented Generation (RAG)?","channel":"IBM Technology","lang":"en"},
  {"youtubeId":"tKPSmn-urB4","title":"AI Explained: What is RAG - Retrieval Augmented Generation?","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'rag' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"8OJC21T2SL4","title":"Chunking Strategies for RAG","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'chunking' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"TqC1qOfiVcQ","title":"Claude Agent SDK Full Workshop (ReAct agents)","channel":"Anthropic","lang":"en"}
]'::jsonb WHERE slug = 'agents-react' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"7j_NE6Pjv-E","title":"Model Context Protocol (MCP) Explained","channel":"EN","lang":"en"}
]'::jsonb WHERE slug = 'mcp' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"zjkBMFhNj_g","title":"Intro to LLMs (prompt injection)","channel":"Andrej Karpathy","lang":"en"}
]'::jsonb WHERE slug = 'prompt-injection' AND module_id = 'm25-ia-appliquee';

UPDATE skills SET videos = '[
  {"youtubeId":"ASAaKhK1B5w","title":"Even Anthropic Engineers Use This Claude Code Workflow","channel":"Anthropic","lang":"en"}
]'::jsonb WHERE slug = 'prompt-caching' AND module_id = 'm25-ia-appliquee';

COMMIT;
