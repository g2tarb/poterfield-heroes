import { PorterfieldLoader } from "@/components/ambient/PorterfieldLoader";

export default function RootLoading() {
  return <PorterfieldLoader fullscreen withProgress minDurationMs={2000} />;
}
