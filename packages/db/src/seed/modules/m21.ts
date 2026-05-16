import type { NewModule, NewSkill, NewVideo, NewExercise } from "../../schema/content";

export const M21_ID = "m21-tests";

export const m21Module: NewModule = {
  id: M21_ID,
  moduleNumber: 21,
  phase: 7,
  title: "Tests (Vitest, Testing Library, Playwright)",
  subtitle: "Safety net pour refacto. Documentation vivante. Anti-régression.",
  pourquoi:
    "Quand tu push une feature, comment savoir que tu n'as pas cassé le login ? Sans tests, tu pries. Piège 1 : croire que tests 'ralentissent' → ils gagnent des semaines (refacto sans peur, onboarding rapide). Piège 2 : viser 100% coverage → tu testes du trivial. Pyramide saine 2026 : beaucoup d'unit + peu d'intégration + 20-30 E2E sur flows critiques. Stack : Vitest + Testing Library + Playwright.",
  objectives: [
    "Pourquoi tester (safety, doc vivante, anti-régression, confiance CI/CD)",
    "Pyramide tests (unit > integration > E2E)",
    "TDD (red → green → refactor) — savoir quand l'appliquer",
    "Vitest (describe, it, expect, before/after Each/All)",
    "Assertions (toBe, toEqual, toMatchObject, toContain, toThrow)",
    "Mocks (vi.fn, vi.mock, vi.spyOn, mock modules, fake timers)",
    "Testing Library + userEvent (render, screen, getByRole, user.click/type)",
    "Philosophie TL : tester comme un user, pas comme un dev (byRole > byTestId)",
    "MSW (Mock Service Worker, intercepter au niveau réseau)",
    "app.inject Fastify (tests intégration backend sans port)",
    "Playwright (test, expect, page, locators, fixtures)",
    "Playwright Trace Viewer (debug enregistrement complet)",
    "Tests intégration DB (transaction rollback ou schema dédié)",
    "Vitest Browser Mode (composants en browser réel)",
    "Coverage (c8/v8, focus chemins critiques, pas 100%)",
    "CI GitHub Actions (preview Module 22)",
    "Anti-patterns (détails implémentation, mocks excessifs, snapshot aveugles)",
  ],
  prerequisites: "Modules 8-20",
  estimatedHours: 35,
  estimatedWeeks: 3,
  stackAllowed: [
    "Vitest + @testing-library/react + userEvent + MSW",
    "Vitest + app.inject Fastify pour backend",
    "Playwright",
  ],
  prereqModuleId: "m20-securite-auth",
  unlockSrsMatureRatio: 80,
};

export const m21Skills: NewSkill[] = [
  { moduleId: M21_ID, slug: "why-test", label: "Pourquoi tester (refacto, doc, anti-régression)", displayOrder: 1, weight: 2 },
  { moduleId: M21_ID, slug: "pyramid", label: "Pyramide tests (unit > integration > E2E)", displayOrder: 2, weight: 2 },
  { moduleId: M21_ID, slug: "tdd", label: "TDD : red → green → refactor (quand appliquer)", displayOrder: 3, weight: 1 },
  { moduleId: M21_ID, slug: "vitest-basics", label: "Vitest (describe, it, expect, hooks)", displayOrder: 4, weight: 3 },
  { moduleId: M21_ID, slug: "assertions", label: "Assertions Vitest (toBe, toEqual, toThrow)", displayOrder: 5, weight: 2 },
  { moduleId: M21_ID, slug: "mocks", label: "vi.fn, vi.mock, vi.spyOn, fake timers", displayOrder: 6, weight: 3 },
  { moduleId: M21_ID, slug: "testing-library", label: "Testing Library + userEvent (render, screen, getByRole)", displayOrder: 7, weight: 3 },
  { moduleId: M21_ID, slug: "tl-philosophy", label: "Tester comportement, pas implémentation (byRole > byTestId)", displayOrder: 8, weight: 3 },
  { moduleId: M21_ID, slug: "msw", label: "MSW (intercepter HTTP au niveau réseau)", displayOrder: 9, weight: 2 },
  { moduleId: M21_ID, slug: "fastify-inject", label: "app.inject Fastify (tests intégration ultra-rapides)", displayOrder: 10, weight: 3 },
  { moduleId: M21_ID, slug: "playwright", label: "Playwright (test, expect, page, locators)", displayOrder: 11, weight: 3 },
  { moduleId: M21_ID, slug: "playwright-traces", label: "Trace Viewer pour debug visuel", displayOrder: 12, weight: 1 },
  { moduleId: M21_ID, slug: "db-tests", label: "Tests intégration DB (rollback ou schema test)", displayOrder: 13, weight: 2 },
  { moduleId: M21_ID, slug: "coverage", label: "Coverage = indicateur, pas objectif 100%", displayOrder: 14, weight: 1 },
  { moduleId: M21_ID, slug: "anti-patterns", label: "Anti-patterns (détails impl, mocks excessifs, snapshots)", displayOrder: 15, weight: 2 },
];

export const m21SkillAxisRules = m21Skills.map((s) => ({ skillSlug: s.slug, axisId: "testing", contribution: 100 }));

export const m21Videos: NewVideo[] = [
  {
    moduleId: M21_ID,
    isPrimary: 1,
    title: "Vitest Crash Course + Testing Library",
    creator: "Web Dev Simplified / Mayfield Tech",
    language: "en",
    durationSeconds: 3 * 60 * 60,
    whyThisOne: "Stack moderne 2026. Vitest = Jest moderne (10x plus rapide, Vite-native). TL = standard pour React.",
    coversSkills: ["vitest-basics", "testing-library", "mocks"],
    displayOrder: 1,
  },
  {
    moduleId: M21_ID,
    isPrimary: 0,
    title: "Don't Test Implementation Details (Kent C. Dodds)",
    creator: "Kent C. Dodds",
    externalUrl: "https://kentcdodds.com/blog/testing-implementation-details",
    language: "en",
    whyThisOne: "Erreur n°1 des juniors : tester useState interne. Réécrit ton mental model.",
    coversSkills: ["tl-philosophy", "anti-patterns"],
    displayOrder: 2,
  },
  {
    moduleId: M21_ID,
    isPrimary: 0,
    title: "Playwright Crash Course 2024",
    creator: "YouTube tutorials récents",
    language: "en",
    whyThisOne: "Framework E2E moderne, multi-browser, auto-wait, Trace Viewer = changement de game pour debug.",
    coversSkills: ["playwright", "playwright-traces"],
    displayOrder: 3,
  },
];

export const m21Exercises: NewExercise[] = [
  {
    moduleId: M21_ID,
    kind: "quiz_verification",
    sandbox: "browser",
    language: null,
    title: "Vérification : philosophie tests + queries TL",
    statement: "Seuil : 80%.",
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: [
      {
        question: "Pourquoi `getByRole` > `getByTestId` dans Testing Library ?",
        options: [
          "Aucune différence",
          "getByRole = accessibility-first → si ton test passe, ton composant est a11y. getByTestId = couplage au code, casse au premier refacto.",
          "getByRole plus rapide",
          "getByTestId obsolète",
        ],
        correctIndex: 1,
        explanation: "Tester comme un user. Un user voit un bouton (role='button', name='Submit'), pas data-testid='submit-btn'. Refacto interne = test casse pas si role/name préservés.",
      },
      {
        question: "Pyramide des tests — pourquoi ?",
        options: [
          "Au hasard",
          "Beaucoup d'unit (rapides, isolés, peu chers) + moyen d'intégration + peu d'E2E (lents, fragiles, mais haute valeur sur flows critiques)",
          "Inverse : beaucoup d'E2E",
          "Tester tout pareil",
        ],
        correctIndex: 1,
        explanation: "100 tests unit en 10s = OK. 100 tests E2E en 30min = CI bloquée. Concentre E2E sur les 5-10 flows critiques (login, paiement, suppression). Le reste en unit + intégration.",
      },
    ],
    skillSlugs: ["tl-philosophy", "pyramid"],
    passThresholdPct: 80,
    estimatedMinutes: 10,
    displayOrder: 1,
  },
  {
    moduleId: M21_ID,
    kind: "project_validation",
    sandbox: "external",
    language: "typescript",
    title: "Test Forge — couverture complète MiniBoard (front + back + E2E)",
    statement: `Couche tests complète sur MiniBoard. Pas 100% coverage, mais chemins critiques.

**A. Frontend (apps web)**
- Setup Vitest + jsdom + Testing Library + userEvent + MSW
- ≥ 30 tests unit (utils + hooks + composants)
- Custom hooks testés avec renderHook
- ≥ 5 composants testés via getByRole + userEvent
- MSW handlers pour intercepter API
- ≥ 5 tests intégration (login flow, search debounce, create+list, optimistic update)

**B. Backend (apps api)**
- Vitest + app.inject Fastify
- Stratégie isolation DB : schema test_* avec setup/teardown
- ≥ 20 tests intégration (1 par endpoint + auth + permissions + rate limit + 401/422)
- Tester edge cases (empty body, oversized, invalid types)

**C. E2E (Playwright)**
- pnpm dlx playwright install
- ≥ 5 tests sur flows critiques :
  1. Auth complet (login → dashboard → user info)
  2. Création board (form → submit → list)
  3. Drag-drop card entre lists
  4. Permissions (user A ne voit pas board user B → 403)
  5. Logout (clear cookie → redirect)
- storageState pour ne pas re-login dans chaque test
- chromium + firefox
- Trace Viewer testé (un test au moins)

**Critères**
- Tous tests passent en local (pnpm test && pnpm e2e)
- ≥ 50 tests au total
- Coverage rapport généré (sans viser 100%)
- TESTING.md documenté
- 0 it.skip sans commentaire justifiant`,
    starterCode: null, solutionCode: null, expectedOutput: null, testsCode: null,
    quizQuestions: null,
    skillSlugs: ["vitest-basics", "testing-library", "msw", "fastify-inject", "playwright"],
    passThresholdPct: 100,
    estimatedMinutes: 40 * 60,
    displayOrder: 2,
  },
];
