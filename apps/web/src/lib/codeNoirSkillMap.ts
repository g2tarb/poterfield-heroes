/**
 * Mapping skill (M01-M25) → technique Code Noir à attaquer après maîtrise.
 *
 * Source de vérité = analyse pédagogique. Quand Erwin maîtrise un skill listé
 * en clé, on lui propose la technique correspondante au Code Noir (qui est
 * déjà unlocked au niveau du module mais qui devient *pertinente* maintenant).
 *
 * Pour V1 : mapping côté frontend uniquement (pas en DB), suffisant tant que
 * les techniques restent statiques. Si on les rend dynamiques plus tard,
 * on bouge ce mapping en DB sur la table code_noir.
 */
export type CodeNoirSkillLink = {
  /** Slug de la technique dans CODE_NOIR_TECHNIQUES (backend) */
  techniqueSlug: string;
  /** Titre affiché */
  techniqueTitle: string;
  /** "duo" | "offensive" | "defensive" */
  kind: "offensive" | "defensive" | "duo";
  /** Phrase d'invitation contextuelle (pédagogique) */
  invitation: string;
};

/**
 * Indexé par skill slug (cross-module — chaque skill est unique en slug
 * dans le seed M00-M25).
 */
export const CODE_NOIR_BY_SKILL: Record<string, CodeNoirSkillLink> = {
  // M01 — Comment fonctionne le web

  "http-anatomy": {
    techniqueSlug: "host-header-injection",
    techniqueTitle: "Host Header Poisoning",
    kind: "duo",
    invitation:
      "Tu sais lire une requête HTTP brute ? Tu peux attaquer une faille où le serveur fait confiance au header Host envoyé par le client (reset password vers evil.com).",
  },

  "dns-resolution": {
    techniqueSlug: "dns-rebinding",
    techniqueTitle: "DNS Rebinding",
    kind: "offensive",
    invitation:
      "TTL court + Same-Origin Policy = tu peux faire frapper le routeur local d'une victime depuis ton domaine. Attaque culte sur les services internes.",
  },

  "http-versions": {
    techniqueSlug: "http-smuggling",
    techniqueTitle: "HTTP Request Smuggling (CL.TE / TE.CL)",
    kind: "duo",
    invitation:
      "HTTP/1.1 et le désaccord entre proxy frontend et backend → tu injectes une 2e requête préfixée à celle de la victime suivante. Le bug bounty à 5 chiffres préféré de James Kettle.",
  },

  // Les skills M02-M25 seront mappés au fur et à mesure que tu débloques
  // ces modules. Mapping minimal V1 = M01 uniquement pour démarrer.
};

/** Helper : retourne le lien Code Noir d'un skill, ou null. */
export function getCodeNoirLink(skillSlug: string): CodeNoirSkillLink | null {
  return CODE_NOIR_BY_SKILL[skillSlug] ?? null;
}
