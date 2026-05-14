import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProfile, userState, levels, moduleProgress, modules } from "@ph/db";
import { computeMasteryRadar } from "../services/masteryRadar.js";
import { getProgressionSnapshot } from "../services/xpEngine.js";
import { NotFoundError } from "../lib/errors.js";

const publicRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/public/:slug — vue publique read-only, pas d'auth
  a.get(
    "/public/:slug",
    {
      schema: { params: z.object({ slug: z.string().min(1) }) },
    },
    async ({ params }) => {
      const [profile] = await app.db
        .select()
        .from(publicProfile)
        .where(eq(publicProfile.slug, params.slug))
        .limit(1);

      if (!profile || !profile.isPublished) {
        throw new NotFoundError("Profile");
      }

      const snapshot = await getProgressionSnapshot(app.db);
      const radar = await computeMasteryRadar(app.db);

      // Modules complétés (titres + numéros seulement, pas le contenu)
      const completedModules = await app.db
        .select({
          id: modules.id,
          moduleNumber: modules.moduleNumber,
          phase: modules.phase,
          title: modules.title,
          completedAt: moduleProgress.completedAt,
        })
        .from(moduleProgress)
        .innerJoin(modules, eq(modules.id, moduleProgress.moduleId))
        .where(eq(moduleProgress.status, "completed"))
        .orderBy(modules.moduleNumber);

      return {
        slug: profile.slug,
        bio: profile.bio,
        tagline: profile.tagline,
        pitchMarkdown: profile.pitchMarkdown,
        customAccentHex: profile.customAccentHex,
        displayName: snapshot?.user.displayName,
        avatarUrl: snapshot?.user.avatarUrl,
        currentLevel: snapshot?.currentLevel,
        nextLevel: snapshot?.nextLevel,
        currentXp: snapshot?.user.currentXp,
        streakDays: profile.showStreak ? snapshot?.user.streakDays : null,
        startedAt: snapshot?.user.startedAt,
        progressPct: snapshot?.progressPct,
        radar: profile.showRadar ? radar : null,
        completedModules: profile.showStack ? completedModules : [],
      };
    },
  );
};

export default publicRoutes;
