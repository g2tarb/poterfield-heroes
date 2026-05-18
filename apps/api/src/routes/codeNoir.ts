import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { modules, moduleProgress } from "@ph/db";
import { MODEL_SONNET } from "../lib/anthropic.js";
import { callClaude } from "../lib/claudeCall.js";
import {
  CODE_NOIR_TECHNIQUES,
  getUnlockedTechniques,
  getLockedTechniques,
} from "../lib/codeNoirData.js";
import { buildCodeNoirSystemPrompt } from "../lib/codeNoirPersona.js";

// Détermine le module actif d'Erwin via la cascade
async function getCurrentModuleNumber(app: any): Promise<number> {
  const rows = await app.db
    .select({
      moduleNumber: modules.moduleNumber,
      status: moduleProgress.status,
    })
    .from(modules)
    .leftJoin(moduleProgress, eq(moduleProgress.moduleId, modules.id))
    .orderBy(asc(modules.moduleNumber));

  // Le module actif = le premier non-completed
  for (const r of rows) {
    if (r.status === "completed") continue;
    return r.moduleNumber;
  }
  return rows.length; // tout fini → tout débloqué
}

const codeNoirRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /code-noir/state — techniques débloquées + verrouillées (téasers)
  a.get(
    "/code-noir/state",
    { preHandler: [app.authenticate] },
    async () => {
      const currentModule = await getCurrentModuleNumber(app);
      const unlocked = getUnlockedTechniques(currentModule);
      const locked = getLockedTechniques(currentModule);
      return {
        currentModule,
        totalTechniques: CODE_NOIR_TECHNIQUES.length,
        unlocked,
        locked,
      };
    },
  );

  // POST /code-noir/ask — chat one-shot avec Black Hat Mentor
  a.post(
    "/code-noir/ask",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          question: z.string().min(1).max(2000),
        }),
      },
    },
    async ({ body }) => {
      const currentModule = await getCurrentModuleNumber(app);
      const unlocked = getUnlockedTechniques(currentModule);
      const system = buildCodeNoirSystemPrompt({
        currentModuleNumber: currentModule,
        unlocked,
      });

      const { text } = await callClaude({
        db: app.db,
        category: "code_noir",
        model: MODEL_SONNET,
        system,
        messages: [{ role: "user", content: body.question }],
        maxTokens: 1200,
      });

      return {
        answer: text,
        currentModule,
        unlockedCount: unlocked.length,
      };
    },
  );
};

export default codeNoirRoutes;
