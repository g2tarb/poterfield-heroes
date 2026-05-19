import { PorterfieldLoader } from "@/components/ambient/PorterfieldLoader";

export function StaircaseSkeleton() {
  return (
    <div className="ph-panel relative overflow-hidden">
      <PorterfieldLoader label="> staircase.load()" />
    </div>
  );
}

export function ProgressionPanelSkeleton() {
  return (
    <aside className="ph-panel relative overflow-hidden">
      <PorterfieldLoader label="> progression.fetch()" size="sm" />
    </aside>
  );
}
