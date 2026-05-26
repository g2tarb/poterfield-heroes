import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import * as schema from "../schema/index";
import { masteryAxesSeed } from "./00-mastery-axes";
import { levelsSeed } from "./01-levels";
import { skillVideosByModule } from "./skill-videos";
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
import { M16_ID, m16Module, m16Skills, m16SkillAxisRules, m16Videos, m16Exercises } from "./modules/m16";
import { M17_ID, m17Module, m17Skills, m17SkillAxisRules, m17Videos, m17Exercises } from "./modules/m17";
import { M18_ID, m18Module, m18Skills, m18SkillAxisRules, m18Videos, m18Exercises } from "./modules/m18";
import { M19_ID, m19Module, m19Skills, m19SkillAxisRules, m19Videos, m19Exercises } from "./modules/m19";
import { M20_ID, m20Module, m20Skills, m20SkillAxisRules, m20Videos, m20Exercises } from "./modules/m20";
import { M21_ID, m21Module, m21Skills, m21SkillAxisRules, m21Videos, m21Exercises } from "./modules/m21";
import { M22_ID, m22Module, m22Skills, m22SkillAxisRules, m22Videos, m22Exercises } from "./modules/m22";
import { M23_ID, m23Module, m23Skills, m23SkillAxisRules, m23Videos, m23Exercises } from "./modules/m23";
import { M24_ID, m24Module, m24Skills, m24SkillAxisRules, m24Videos, m24Exercises } from "./modules/m24";
import { M25_ID, m25Module, m25Skills, m25SkillAxisRules, m25Videos, m25Exercises } from "./modules/m25";
import { M00_ID, m00Module, m00Skills, m00SkillAxisRules, m00Videos, m00Exercises } from "./modules/m00-algo";
import {
  m00LessonContent,
  m00Resources,
  m00SkillResourceLinks,
} from "./modules/m00-extras";

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

  // Skill-level YouTube videos (FR + EN curation) — applied after
  // skill insert, idempotent UPDATE.
  const curated = skillVideosByModule[moduleId];
  if (curated) {
    for (const [slug, vids] of Object.entries(curated)) {
      if (!vids || vids.length === 0) continue;
      await db
        .update(schema.skills)
        .set({ videos: vids })
        .where(
          and(
            eq(schema.skills.moduleId, moduleId),
            eq(schema.skills.slug, slug),
          ),
        );
    }
  }
}

async function seedM00Extras() {
  console.log("→ Seeding M00 extras (lessons + external resources)…");

  // 1) UPDATE skills content_markdown
  for (const [slug, markdown] of Object.entries(m00LessonContent)) {
    await db
      .update(schema.skills)
      .set({ contentMarkdown: markdown })
      .where(
        and(
          eq(schema.skills.moduleId, M00_ID),
          eq(schema.skills.slug, slug),
        ),
      );
  }

  // 2) INSERT external_resources (idempotent par URL)
  const existing = await db
    .select({ url: schema.externalResources.url, id: schema.externalResources.id })
    .from(schema.externalResources);
  const byUrl = new Map(existing.map((r) => [r.url, r.id]));

  const toInsert = m00Resources.filter((r) => !byUrl.has(r.url));
  if (toInsert.length > 0) {
    const inserted = await db
      .insert(schema.externalResources)
      .values(toInsert)
      .returning({ id: schema.externalResources.id, url: schema.externalResources.url });
    for (const r of inserted) byUrl.set(r.url, r.id);
  }

  // 3) INSERT skill_resources (resolve by title + skill slug)
  const byTitle = new Map(
    m00Resources.map((r) => [r.title, byUrl.get(r.url)!]),
  );
  const skillRows = await db
    .select({ id: schema.skills.id, slug: schema.skills.slug })
    .from(schema.skills)
    .where(eq(schema.skills.moduleId, M00_ID));
  const skillIdBySlug = new Map(skillRows.map((s) => [s.slug, s.id]));

  for (const link of m00SkillResourceLinks) {
    const skillId = skillIdBySlug.get(link.skillSlug);
    if (!skillId) continue;
    for (let i = 0; i < link.resourceTitles.length; i++) {
      const title = link.resourceTitles[i]!;
      const resourceId = byTitle.get(title);
      if (!resourceId) {
        console.warn(`  ⚠ resource title not found: "${title}"`);
        continue;
      }
      await db
        .insert(schema.skillResources)
        .values({ skillId, resourceId, displayOrder: i })
        .onConflictDoNothing();
    }
  }

  console.log(
    `  → ${Object.keys(m00LessonContent).length} lessons, ${m00Resources.length} resources, ${m00SkillResourceLinks.length} skills with links`,
  );
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
  await seedModule(M16_ID, m16Module, m16Skills, m16SkillAxisRules, m16Videos, m16Exercises);
  await seedModule(M17_ID, m17Module, m17Skills, m17SkillAxisRules, m17Videos, m17Exercises);
  await seedModule(M18_ID, m18Module, m18Skills, m18SkillAxisRules, m18Videos, m18Exercises);
  await seedModule(M19_ID, m19Module, m19Skills, m19SkillAxisRules, m19Videos, m19Exercises);
  await seedModule(M20_ID, m20Module, m20Skills, m20SkillAxisRules, m20Videos, m20Exercises);
  await seedModule(M21_ID, m21Module, m21Skills, m21SkillAxisRules, m21Videos, m21Exercises);
  await seedModule(M22_ID, m22Module, m22Skills, m22SkillAxisRules, m22Videos, m22Exercises);
  await seedModule(M23_ID, m23Module, m23Skills, m23SkillAxisRules, m23Videos, m23Exercises);
  await seedModule(M24_ID, m24Module, m24Skills, m24SkillAxisRules, m24Videos, m24Exercises);
  await seedModule(M25_ID, m25Module, m25Skills, m25SkillAxisRules, m25Videos, m25Exercises);
  // Module transversal M00 (algorithmie) — seedé en dernier pour pas casser
  // l'ordre logique des dépendances, mais affiché en TÊTE côté frontend.
  await seedModule(M00_ID, m00Module, m00Skills, m00SkillAxisRules, m00Videos, m00Exercises);
  await seedM00Extras();
  await seedUserState();
  await seedPublicProfile();
  console.log("\nDone.");
}

await main();
await client.end();
process.exit(0);
