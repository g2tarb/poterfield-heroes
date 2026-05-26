import type { Database } from "@ph/db";
import { externalResources } from "@ph/db";
import { eq } from "drizzle-orm";

export type VerifyResult = {
  checked: number;
  broken: number;
  durationMs: number;
};

/**
 * Sprint D — vérifie la fraîcheur des ressources externes.
 * Fait un HEAD HTTP sur chaque URL avec timeout 8s, met à jour
 * last_verified_at + http_status. Pas de retry, pas de parallèle massif
 * pour ne pas se faire bloquer par les CDN.
 */
export async function verifyAllResources(
  db: Database,
): Promise<VerifyResult> {
  const start = Date.now();
  const rows = await db
    .select({ id: externalResources.id, url: externalResources.url })
    .from(externalResources);

  let broken = 0;

  // Concurrence limitée : 4 à la fois
  const CONCURRENCY = 4;
  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (r) => {
        const status = await headWithTimeout(r.url, 8000);
        if (status >= 400 || status === 0) broken += 1;
        await db
          .update(externalResources)
          .set({ lastVerifiedAt: new Date(), httpStatus: status })
          .where(eq(externalResources.id, r.id));
      }),
    );
  }

  return {
    checked: rows.length,
    broken,
    durationMs: Date.now() - start,
  };
}

/**
 * HEAD request avec timeout. Retourne 0 si l'URL est inaccessible.
 * Fallback en GET si HEAD est refusé (certains CDN comme YouTube).
 */
async function headWithTimeout(url: string, timeoutMs: number): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    // Si HEAD pas supporté (405), retry en GET avec timeout
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
      });
    }
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timer);
  }
}
