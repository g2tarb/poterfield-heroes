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
} from "./modules/m03-c-bas-niveau";
import {
  M24_ID,
  m24Module,
  m24Skills,
  m24SkillAxisRules,
  m24Videos,
  m24Exercises,
} from "./modules/m24";
import {
  M00_ID,
  m00Module,
  m00Skills,
  m00SkillAxisRules,
  m00Videos,
  m00Exercises,
} from "./modules/m00-algo";
import {
  m00LessonContent,
  m00Resources,
  m00SkillResourceLinks,
} from "./modules/m00-extras";
import { m00LessonContentRest } from "./modules/m00-lessons-rest";
import { m01LessonContent } from "./modules/m01-lessons";
import { m02LessonContent } from "./modules/m02-lessons";
import { m03LessonContent } from "./modules/m03-lessons";
import { m24LessonContent } from "./modules/m24-lessons";
import { m00ExtraExercises } from "./modules/m00-exercises-extra";
import { m01ExtraExercises } from "./modules/m01-exercises-extra";
import { m02ExtraExercises } from "./modules/m02-exercises-extra";
import { m03ExtraExercises } from "./modules/m03-exercises-extra";
import { m24ExtraExercises } from "./modules/m24-exercises-extra";

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

async function seedLessons(
  moduleId: string,
  lessons: Record<string, string>,
) {
  let applied = 0;
  for (const [slug, markdown] of Object.entries(lessons)) {
    const res = await db
      .update(schema.skills)
      .set({ contentMarkdown: markdown })
      .where(
        and(
          eq(schema.skills.moduleId, moduleId),
          eq(schema.skills.slug, slug),
        ),
      )
      .returning({ id: schema.skills.id });
    applied += res.length;
  }
  console.log(
    `→ Lessons ${moduleId}: ${applied}/${Object.keys(lessons).length} appliquées`,
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
      tagline: "Dev systèmes & sécurité offensive, en formation autodidacte.",
      bio: "Je traverse 5 modules ultra-poussés — Réseau, Shell, C, Algorithmie, Python — pour passer de dev JS à profil systèmes / offensive-security. Outil construit pour moi-même, transparent par choix.",
      pitchMarkdown: `**Porterfield Heroes** est mon atelier privé d'apprentissage bas niveau & sécurité.

5 modules ultra-poussés — Réseau & protocoles, Shell & systèmes Unix, C & bas niveau, Algorithmie & structures, Python (outillage) — avec la feature **Code Noir** : techniques offensives/défensives mappées à chaque module, toujours en cadre légal. Un coach IA permanent qui me connaît. Une sandbox multi-langage. Un contrôle hebdomadaire qui m'empêche de tricher avec moi-même.

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
  // Chaîne principale : Réseau → Shell → C → Python.
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
    M24_ID,
    m24Module,
    m24Skills,
    m24SkillAxisRules,
    m24Videos,
    m24Exercises,
  );
  // Module transversal M00 (algorithmie) — seedé en dernier mais affiché en TÊTE
  // côté frontend (moduleNumber 0, phase 9, démarrable dès J1).
  await seedModule(
    M00_ID,
    m00Module,
    m00Skills,
    m00SkillAxisRules,
    m00Videos,
    m00Exercises,
  );
  await seedM00Extras();
  // Leçons in-app pré-écrites (content_markdown par compétence)
  await seedLessons(M01_ID, m01LessonContent);
  await seedLessons(M02_ID, m02LessonContent);
  await seedLessons(M03_ID, m03LessonContent);
  await seedLessons(M24_ID, m24LessonContent);
  await seedLessons(M00_ID, m00LessonContentRest);
  // Exercices pratiques supplémentaires (quiz + code, par compétence)
  const extraExercises = [
    ...m01ExtraExercises,
    ...m02ExtraExercises,
    ...m03ExtraExercises,
    ...m24ExtraExercises,
    ...m00ExtraExercises,
  ];
  await db
    .insert(schema.exercises)
    .values(extraExercises)
    .onConflictDoNothing();
  console.log(`→ ${extraExercises.length} exercices pratiques supplémentaires`);
  await seedUserState();
  await seedPublicProfile();
  console.log("\nDone.");
}

await main();
await client.end();
process.exit(0);
