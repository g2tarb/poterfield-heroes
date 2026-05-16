import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M23_ID = "m23-threejs-r3f";

export const m23Module: NewModule = {
  id: M23_ID,
  moduleNumber: 23,
  phase: 8,
  title: "Three.js & React Three Fiber (3D dans le navigateur)",
  subtitle: "Compétence différenciante rare. Sites premium luxe/créatif/jeu/retail haut de gamme.",
  pourquoi:
    "Web standard = 2D. Three.js casse ce plafond : 3D temps réel navigateur. En 2026 : compétence rare différenciante. Majorité des devs ne touchent jamais à WebGL. Boîtes premium (luxe, créatif, jeu, immobilier, retail) paient 2-3x plus. Tu as déjà bricolé (Digital Museum, bonbon brain) mais ce module te rend dev qui comprend la pipeline 3D : géométrie/matériau/maillage, caméras, lumières, ombres, textures, shaders GLSL, post-processing, perf.",
  objectives: [
    "WebGL et le rôle de Three.js (couche abstraction)",
    "Pipeline rendu 3D : scene → camera → renderer → écran",
    "Briques de base : Scene, PerspectiveCamera, WebGLRenderer, animation loop",
    "Géométries (built-in BoxGeometry, SphereGeometry, custom, GLTF/GLB)",
    "Matériaux (MeshBasicMaterial, Standard PBR, Physical, Shader, transparency)",
    "Textures (load, wrapping, normal map, displacement, HDR environment)",
    "Lumières (Ambient, Directional, Point, Spot, ombres shadowMap)",
    "Transformations (position, rotation, scale, quaternion, hiérarchie)",
    "Contrôles (OrbitControls, PointerLockControls, custom)",
    "Raycasting + interactions souris (hover, click sur mesh)",
    "Particules (Points, BufferGeometry)",
    "GLSL shaders (vertex, fragment, uniforms, attributes, varyings)",
    "Shaders custom (ondulation, displacement, gradient, noise Perlin)",
    "@react-three/fiber (Canvas, useFrame, useThree, JSX)",
    "@react-three/drei (helpers : OrbitControls, Environment, Text, useGLTF)",
    "@react-three/postprocessing (Bloom, DOF, Vignette, Glitch)",
    "Performance 3D (draw calls, instancing, frustum culling, LOD, baking)",
    "GLTF/GLB workflow + gltfjsx (générer JSX R3F depuis .glb)",
    "TSL (Three Shading Language) + WebGPU (2026)",
    "Workflow Blender → bake → GLB → Three.js",
  ],
  prerequisites: "Modules 8-14",
  estimatedHours: 75,
  estimatedWeeks: 5,
  stackAllowed: [
    "Vite + React 19 + TS + R3F + drei + R3F Postprocessing",
    "Three.js + leva pour debug GUI + custom shaders GLSL",
    "Blender pour assets, gltfjsx pour conversion",
  ],
  prereqModuleId: "m22-devops-deploiement",
  unlockSrsMatureRatio: 80,
};

export const m23Skills: NewSkill[] = [
  { moduleId: M23_ID, slug: "webgl-threejs", label: "WebGL + rôle de Three.js (abstraction)", displayOrder: 1, weight: 1 },
  { moduleId: M23_ID, slug: "pipeline-3d", label: "Pipeline : scene → camera → renderer", displayOrder: 2, weight: 2 },
  { moduleId: M23_ID, slug: "basics", label: "Scene, Camera, WebGLRenderer, animation loop", displayOrder: 3, weight: 3 },
  { moduleId: M23_ID, slug: "geometries", label: "Géométries (built-in, custom, GLTF/GLB)", displayOrder: 4, weight: 2 },
  { moduleId: M23_ID, slug: "materials", label: "Matériaux (Basic, PBR Standard, Physical, Shader)", displayOrder: 5, weight: 3 },
  { moduleId: M23_ID, slug: "textures", label: "Textures (normal, displacement, HDR environment)", displayOrder: 6, weight: 2 },
  { moduleId: M23_ID, slug: "lights", label: "Lumières (Ambient/Directional/Point/Spot) + ombres", displayOrder: 7, weight: 3 },
  { moduleId: M23_ID, slug: "transforms", label: "Position/rotation/scale + hiérarchie parent/enfant", displayOrder: 8, weight: 2 },
  { moduleId: M23_ID, slug: "controls", label: "OrbitControls, PointerLockControls", displayOrder: 9, weight: 1 },
  { moduleId: M23_ID, slug: "raycasting", label: "Raycasting + interactions souris", displayOrder: 10, weight: 2 },
  { moduleId: M23_ID, slug: "particles", label: "Particules (Points, BufferGeometry)", displayOrder: 11, weight: 1 },
  { moduleId: M23_ID, slug: "glsl", label: "GLSL (vertex, fragment, uniforms, varyings)", displayOrder: 12, weight: 3 },
  { moduleId: M23_ID, slug: "custom-shaders", label: "Shaders custom (ondulation, gradient, noise)", displayOrder: 13, weight: 3 },
  { moduleId: M23_ID, slug: "r3f", label: "@react-three/fiber (Canvas, useFrame, useThree)", displayOrder: 14, weight: 3 },
  { moduleId: M23_ID, slug: "drei", label: "@react-three/drei helpers", displayOrder: 15, weight: 2 },
  { moduleId: M23_ID, slug: "postprocessing", label: "@react-three/postprocessing (Bloom, DOF)", displayOrder: 16, weight: 1 },
  { moduleId: M23_ID, slug: "performance-3d", label: "Perf : draw calls, instancing, LOD, baking, KTX2", displayOrder: 17, weight: 3 },
  { moduleId: M23_ID, slug: "gltf-workflow", label: "GLTF/GLB + gltfjsx (.glb → composant R3F)", displayOrder: 18, weight: 2 },
  { moduleId: M23_ID, slug: "blender-workflow", label: "Blender → bake → GLB → Three.js", displayOrder: 19, weight: 1 },
  { moduleId: M23_ID, slug: "webgpu-tsl", label: "WebGPU + TSL (2026 future)", displayOrder: 20, weight: 1 },
];

export const m23SkillAxisRules = m23Skills.map((s) => ({ skillSlug: s.slug, axisId: "graphics_3d", contribution: 100 }));

export const m23Videos: NewVideo[] = [
  {
    moduleId: M23_ID,
    isPrimary: 1,
    title: "Three.js Journey (Bruno Simon, payant ~95$)",
    creator: "Bruno Simon",
    externalUrl: "https://threejs-journey.com",
    language: "en",
    durationSeconds: 95 * 60 * 60,
    whyThisOne: "LE cours référence absolue. Français WebGL specialist (créateur bruno-simon.com). Pédagogie exceptionnelle. ~25h coeur essentiel (Basics 1-10, Classic 11-20, R3F 50-65).",
    coversSkills: ["basics", "materials", "lights", "glsl", "r3f"],
    displayOrder: 1,
  },
  {
    moduleId: M23_ID,
    isPrimary: 0,
    title: "Documentation officielle R3F + drei",
    creator: "pmndrs",
    externalUrl: "https://r3f.docs.pmnd.rs",
    language: "en",
    whyThisOne: "Doc R3F officielle. Excellente, structurée, exemples.",
    coversSkills: ["r3f", "drei"],
    displayOrder: 2,
  },
  {
    moduleId: M23_ID,
    isPrimary: 0,
    title: "The Book of Shaders (GLSL gratuit)",
    creator: "Patricio Gonzalez Vivo + Jen Lowe",
    externalUrl: "https://thebookofshaders.com",
    language: "en",
    whyThisOne: "Référence absolue pour apprendre GLSL pas à pas. Gratuit en ligne.",
    coversSkills: ["glsl", "custom-shaders"],
    displayOrder: 3,
  },
];

export const m23Exercises: NewExercise[] = [
  {
    moduleId: M23_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : R3F + shaders + perf",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "MeshBasicMaterial vs MeshStandardMaterial ?",
        options: [
          "Identiques",
          "Basic = pas de lumière (couleur plate). Standard = PBR, réagit aux lumières (rougeoirie, métal, lisse vs rugueux). 99% du temps : Standard.",
          "Basic est plus récent",
          "Standard est obsolète",
        ],
        correctIndex: 1,
        explanation: "Si ta scène est noire : oubli des lumières ou Basic au lieu de Standard. PBR = Physically Based Rendering, simule la physique réelle de la lumière.",
      },
      {
        question: "Vertex shader vs fragment shader ?",
        options: [
          "Identiques",
          "Vertex = par sommet (position finale écran, déformations). Fragment = par pixel visible (couleur finale).",
          "Aucune différence",
          "Synonymes",
        ],
        correctIndex: 1,
        explanation: "Vertex exécuté N fois (N = nombre de vertices), Fragment exécuté W×H fois (pixels visibles). Données : attributes (par vertex), uniforms (constants), varyings (vertex → fragment, interpolés).",
      },
      {
        question: "60fps mobile — quelles optimisations 3D ?",
        options: [
          "Aucune nécessaire",
          "Reduce draw calls (InstancedMesh), polygon count (LOD), texture size (KTX2 compressé), bake lighting, désactiver postprocessing sur mobile",
          "Plus de RAM",
          "Désactiver R3F",
        ],
        correctIndex: 1,
        explanation: "Budget = 16.7ms par frame pour 60fps. Mesurer avec Stats panel R3F. Mobile : -50% poly + textures compressées + baked lighting. Performance is craft.",
      },
    ],
    skillSlugs: ["materials", "glsl", "performance-3d"],
    passThresholdPct: 80,
    estimatedMinutes: 12,
    displayOrder: 1,
  },
  {
    moduleId: M23_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "tsx",
    title: "Scory Museum 2.0 — portfolio R3F (4 scènes immersives)",
    statement: `Refonte du Digital Museum existant en vraie pipeline R3F propre. 4 scènes immersives qui montrent ton niveau.

**Setup**
- Vite + R3F + drei + R3F Postprocessing + leva + vite-plugin-glsl
- TS strict, 0 any

**Scène 1 — Hall d'entrée**
- Sol Plane + shader gradient noir → bleu nuit
- Plafond étoilé : Points + ShaderMaterial (scintillement)
- Disc carousel central qui tourne (useFrame, easing)
- 1 Directional + 1 Ambient + 2 Point lights violet/bleu
- Textures KTX2 compressées
- 60fps desktop, ≥30fps mobile

**Scène 2 — Salle bonbon brain**
- Import brain.glb (déjà sculpté Blender) via gltfjsx
- Float Drei (flotte doucement)
- MeshPhysicalMaterial (transmission, thickness pour subsurface scattering)
- Hover glitch animation
- Bloom postprocessing rose
- Légendes Drei <Html> au click sur zones
- Audio ambiant Web Audio API

**Scène 3 — Salle des projets**
- Long couloir, 4 panneaux 3D (Flaynn, 4Dayvelopment, ANIMUS, MiniBoard)
- Plans avec texture écran d'accueil
- Shader noise sur bordures (matière vivante)
- Au click : caméra lerp vers le panneau + overlay HTML descrip
- Drei <MeshReflectorMaterial> sol reflection blur
- Drei <Environment preset="night"> HDR

**Scène 4 — Salle shaders (bonus avancé)**
- Eau ondulante (ShaderMaterial + noise + uniforms time)
- Hologramme (scanlines + fresnel edge glow)
- Reveal effect (dissolve + perlin)
- Particules réactives souris (5000 particles)
- GUI leva pour ajuster uniforms en temps réel
- Code GLSL dans fichiers .glsl séparés

**Critères**
- 4 scènes navigables
- ≥ 3 shaders custom écrits à la main (pas copy)
- 60fps desktop, ≥30fps mobile
- Lighthouse Performance ≥ 70 (3D = lourd)
- TS strict, 0 any
- Déployé sur scory.dev custom domain
- Analytics Plausible/Umami`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["r3f", "drei", "custom-shaders", "performance-3d", "gltf-workflow"],
    passThresholdPct: 100,
    estimatedMinutes: 60 * 60,
    displayOrder: 2,
  },
];
