import { stepsM00 } from "./m00.js";
import { stepsM01 } from "./m01.js";
import { stepsM02 } from "./m02.js";
import { stepsM03 } from "./m03.js";
import { stepsM04 } from "./m04.js";
import type { CodeNoirLabStep, CodeNoirStepsByTechnique } from "./types.js";

const stepsByModule: Record<number, CodeNoirStepsByTechnique> = {
  0: stepsM00,
  1: stepsM01,
  2: stepsM02,
  3: stepsM03,
  4: stepsM04,
};

export function getStepsForTechnique(
  moduleNumber: number,
  slug: string,
): CodeNoirLabStep[] {
  return stepsByModule[moduleNumber]?.[slug] ?? [];
}
