"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Star = {
  position: [number, number, number];
  status: "locked" | "active" | "completed";
  moduleNumber: number;
  phase: number;
};

type Props = {
  modules: Array<{
    moduleNumber: number;
    phase: number;
    status: "locked" | "active" | "completed";
  }>;
  reducedMotion?: boolean;
};

const STATUS_COLOR = {
  locked: new THREE.Color("#2A2A2E"),
  active: new THREE.Color("#D4A24C"),
  completed: new THREE.Color("#F5E6C4"),
};

/**
 * Constellation des 25 modules sur un dôme.
 * Chaque module = une étoile, position dérivée de (phase, moduleNumber).
 * - locked: petite, sombre, immobile
 * - active: pulse + glow ambré
 * - completed: brillante, scintille discrètement
 */
function Stars({ modules }: { modules: Star[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={groupRef}>
      {modules.map((star, i) => (
        <Star key={i} star={star} index={i} />
      ))}
    </group>
  );
}

function Star({ star, index }: { star: Star; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = STATUS_COLOR[star.status];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    if (star.status === "active") {
      // Pulse
      const s = 1 + Math.sin(t * 1.5 + index) * 0.15;
      ref.current.scale.set(s, s, s);
    } else if (star.status === "completed") {
      // Scintillement discret
      const s = 1 + Math.sin(t * 3 + index * 0.7) * 0.05;
      ref.current.scale.set(s, s, s);
    }
  });

  const size =
    star.status === "completed" ? 0.06 : star.status === "active" ? 0.08 : 0.025;

  return (
    <mesh ref={ref} position={star.position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
      {star.status !== "locked" && (
        <mesh>
          <sphereGeometry args={[size * 2.2, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}
    </mesh>
  );
}

/**
 * Génère les positions des 25 modules sur un dôme.
 * Distribution : Fibonacci spiral sur la moitié supérieure de la sphère.
 */
function generateStarPositions(
  modules: Props["modules"],
): Star[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const radius = 4;

  return modules.map((m, i) => {
    const total = Math.max(25, modules.length);
    const y = 1 - (i / (total - 1)) * 0.6; // top half only
    const r = Math.sqrt(1 - y * y) * radius;
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    return {
      position: [x, y * radius * 0.6, z] as [number, number, number],
      status: m.status,
      moduleNumber: m.moduleNumber,
      phase: m.phase,
    };
  });
}

export function ConstellationsBackground({ modules, reducedMotion }: Props) {
  const stars = useMemo(() => generateStarPositions(modules), [modules]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.4} />
        <Stars modules={stars} />
        <fog attach="fog" args={["#0A0A0B", 4, 12]} />
      </Canvas>
    </div>
  );
}
