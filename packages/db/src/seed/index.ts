import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../schema/index";
import { masteryAxesSeed } from "./00-mastery-axes";
import { levelsSeed } from "./01-levels";
import {
  M01_ID,
  m01Module,
  m01Skills,
  m01SkillAxisRules,
  m01Videos,
  m01Exercises,
} from "./modules/m01";
import {
  M02_ID,
  m02Module,
  m02Skills,
  m02SkillAxisRules,
  m02Videos,
  m02Exercises,
} from "./modules/m02";
import {
  M03_ID,
  m03Module,
  m03Skills,
  m03SkillAxisRules,
  m03Videos,
  m03Exercises,
} from "./modules/m03";
import {
  M04_ID,
  m04Module,
  m04Skills,
  m04SkillAxisRules,
  m04Videos,
  m04Exercises,
} from "./modules/m04";
import {
  M05_ID,
  m05Module,
  m05Skills,
  m05SkillAxisRules,
  m05Videos,
  m05Exercises,
} from "./modules/m05";
import {
  M06_ID,
  m06Module,
  m06Skills,
  m06SkillAxisRules,
  m06Videos,
  m06Exercises,
} from "./modules/m06";
import {
  M07_ID,
  m07Module,
  m07Skills,
  m07SkillAxisRules,
  m07Videos,
  m07Exercises,
} from "./modules/m07";
import {
  M08_ID,
  m08Module,
  m08Skills,
  m08SkillAxisRules,
  m08Videos,
  m08Exercises,
} from "./modules/m08";
import {
  M09_ID,
  m09Module,
  m09Skills,
  m09SkillAxisRules,
  m09Videos,
  m09Exercises,
} from "./modules/m09";
import {
  M10_ID,
  m10Module,
  m10Skills,
  m10SkillAxisRules,
  m10Videos,
  m10Exercises,
} from "./modules/m10";
import {
  M11_ID,
  m11Module,
  m11Skills,
  m11SkillAxisRules,
  m11Videos,
  m11Exercises,
} from "./modules/m11";
import {
  M12_ID,
  m12Module,
  m12Skills,
  m12SkillAxisRules,
  m12Videos,
  m12Exercises,
} from "./modules/m12";
import {
  M13_ID,
  m13Module,
  m13Skills,
  m13SkillAxisRules,
  m13Videos,
  m13Exercises,
} from "./modules/m13";
import {
  M14_ID,
  m14Module,
  m14Skills,
  m14SkillAxisRules,
  m14Videos,
  m14Exercises,
} from "./modules/m14";
import {
  M15_ID,
  m15Module,
  m15Skills,
  m15SkillAxisRules,
  m15Videos,
  m15Exercises,
} from "./modules/m15";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for seeding");
}

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client, { schema });

async function seedMasteryAxes() {
  console.log(`→ Seeding ${masteryAxesSeed.length} mastery axes…`);
  await db
    .insert(schema.masteryAxes)
    .values(masteryAxesSeed)
    .onConflictDoNothing();
}

async function seedLevels() {
  console.log(`→ Seeding ${levelsSeed.length} levels…`);
  await db.insert(schema.levels).values(levelsSeed).onConflictDoNothing();
}

async function seedModule(
  moduleId: string,
  moduleData: typeof m01Module,
  skillsData: typeof m01Skills,
  skillAxisRules: typeof m01SkillAxisRules,
  videosData: typeof m01Videos,
  exercisesData: typeof m01Exercises,
) {
  console.log(`→ Seeding module ${moduleId}…`);

  await db.insert(schema.modules).values(moduleData).onConflictDoNothing();

  const insertedSkills = await db
    .insert(schema.skills)
    .values(skillsData)
    .onConflictDoNothing()
    .returning({ id: schema.skills.id, slug: schema.skills.slug });

  const skillsBySlug = new Map(insertedSkills.map((s) => [s.slug, s.id]));

  if (skillsBySlug.size === 0) {
    const existing = await db
      .select({ id: schema.skills.id, slug: schema.skills.slug })
      .from(schema.skills)
      .where(eq(schema.skills.moduleId, moduleId));
    for (const s of existing) skillsBySlug.set(s.slug, s.id);
  }

  const skillAxisRows = skillAxisRules
    .map((rule) => {
      const skillId = skillsBySlug.get(rule.skillSlug);
      if (!skillId) return null;
      return {
        skillId,
        axisId: rule.axisId,
        contribution: rule.contribution,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (skillAxisRows.length > 0) {
    await db
      .insert(schema.skillAxes)
      .values(skillAxisRows)
      .onConflictDoNothing();
  }

  await db.insert(schema.videos).values(videosData).onConflictDoNothing();
  await db.insert(schema.exercises).values(exercisesData).onConflictDoNothing();
}

async function seedUserState() {
  console.log("→ Seeding user state (single row)…");
  await db
    .insert(schema.userState)
    .values({
      id: 1,
      displayName: "Erwin",
      currentLevelId: 1,
      preferences: {
        voiceTts: false,
        reducedMotion: false,
        dailySrsTarget: 20,
      },
    })
    .onConflictDoNothing();
}

async function seedPublicProfile() {
  console.log("→ Seeding public profile…");
  await db
    .insert(schema.publicProfile)
    .values({
      id: 1,
      slug: "erwin",
      tagline: "Dev fullstack en formation autodidacte.",
      bio: "Je traverse 25 modules pour passer de dev JS confirmé à créateur de SaaS IA. Outil construit pour moi-même, transparent par choix.",
      pitchMarkdown: `**Porterfield Heroes** est mon atelier privé d'apprentissage dev fullstack.

25 modules verrouillés, ~1500h, du fondamental web jusqu'à l'IA appliquée (RAG, agents, MCP). Un coach IA permanent qui me connaît. Une sandbox multi-langage. Un contrôle hebdomadaire qui m'empêche de tricher avec moi-même.

Ce que tu vois ici, c'est mon état d'avancement. Pas le contenu, juste les preuves de progression.`,
      isPublished: true,
      showRadar: true,
      showStreak: true,
      showStack: true,
      showProjects: false,
    })
    .onConflictDoNothing();
}

async function main() {
  console.log("Seeding Porterfield Heroes database…\n");
  await seedMasteryAxes();
  await seedLevels();
  await seedModule(
    M01_ID,
    m01Module,
    m01Skills,
    m01SkillAxisRules,
    m01Videos,
    m01Exercises,
  );
  await seedModule(
    M02_ID,
    m02Module,
    m02Skills,
    m02SkillAxisRules,
    m02Videos,
    m02Exercises,
  );
  await seedModule(
    M03_ID,
    m03Module,
    m03Skills,
    m03SkillAxisRules,
    m03Videos,
    m03Exercises,
  );
  await seedModule(
    M04_ID,
    m04Module,
    m04Skills,
    m04SkillAxisRules,
    m04Videos,
    m04Exercises,
  );
  await seedModule(
    M05_ID,
    m05Module,
    m05Skills,
    m05SkillAxisRules,
    m05Videos,
    m05Exercises,
  );
  await seedModule(
    M06_ID,
    m06Module,
    m06Skills,
    m06SkillAxisRules,
    m06Videos,
    m06Exercises,
  );
  await seedModule(
    M07_ID,
    m07Module,
    m07Skills,
    m07SkillAxisRules,
    m07Videos,
    m07Exercises,
  );
  await seedModule(
    M08_ID,
    m08Module,
    m08Skills,
    m08SkillAxisRules,
    m08Videos,
    m08Exercises,
  );
  await seedModule(
    M09_ID,
    m09Module,
    m09Skills,
    m09SkillAxisRules,
    m09Videos,
    m09Exercises,
  );
  await seedModule(
    M10_ID,
    m10Module,
    m10Skills,
    m10SkillAxisRules,
    m10Videos,
    m10Exercises,
  );
  await seedModule(
    M11_ID,
    m11Module,
    m11Skills,
    m11SkillAxisRules,
    m11Videos,
    m11Exercises,
  );
  await seedModule(
    M12_ID,
    m12Module,
    m12Skills,
    m12SkillAxisRules,
    m12Videos,
    m12Exercises,
  );
  await seedModule(
    M13_ID,
    m13Module,
    m13Skills,
    m13SkillAxisRules,
    m13Videos,
    m13Exercises,
  );
  await seedModule(
    M14_ID,
    m14Module,
    m14Skills,
    m14SkillAxisRules,
    m14Videos,
    m14Exercises,
  );
  await seedModule(
    M15_ID,
    m15Module,
    m15Skills,
    m15SkillAxisRules,
    m15Videos,
    m15Exercises,
  );
  await seedUserState();
  await seedPublicProfile();
  console.log("\nDone.");
}

await main();
await client.end();
process.exit(0);
