import type { Database } from "@ph/db";
import { asc, eq, sql } from "drizzle-orm";
import { masteryAxes, skills, skillAxes, skillProgress } from "@ph/db";

export type MasteryAxisScore = {
  id: string;
  label: string;
  colorHex: string;
  displayOrder: number;
  score: number; // 0..100
  skillsTotal: number;
  skillsMastered: number;
};

/**
 * Compute mastery score for each of the 12 axes, weighted by skill contribution
 * and current skill mastery percentage.
 */
export async function computeMasteryRadar(
  db: Database,
): Promise<MasteryAxisScore[]> {
  const rows = await db
    .select({
      axisId: masteryAxes.id,
      axisLabel: masteryAxes.label,
      axisColor: masteryAxes.colorHex,
      displayOrder: masteryAxes.displayOrder,
      skillsTotal: sql<number>`count(distinct ${skills.id})::int`,
      skillsMastered: sql<number>`count(distinct ${skills.id}) filter (where ${skillProgress.status} = 'mastered')::int`,
      weightedScore: sql<number>`
        coalesce(
          sum(
            ${skillAxes.contribution} * coalesce(${skillProgress.masteryPct}, 0)::float / 100.0
          ) / nullif(sum(${skillAxes.contribution}), 0),
          0
        )::float
      `,
    })
    .from(masteryAxes)
    .leftJoin(skillAxes, eq(skillAxes.axisId, masteryAxes.id))
    .leftJoin(skills, eq(skills.id, skillAxes.skillId))
    .leftJoin(skillProgress, eq(skillProgress.skillId, skills.id))
    .groupBy(
      masteryAxes.id,
      masteryAxes.label,
      masteryAxes.colorHex,
      masteryAxes.displayOrder,
    )
    .orderBy(asc(masteryAxes.displayOrder));

  return rows.map((r) => ({
    id: r.axisId,
    label: r.axisLabel,
    colorHex: r.axisColor,
    displayOrder: r.displayOrder,
    score: Math.round(r.weightedScore),
    skillsTotal: r.skillsTotal,
    skillsMastered: r.skillsMastered,
  }));
}
