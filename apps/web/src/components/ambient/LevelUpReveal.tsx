"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  level: { id: number; name: string; icon: string | null } | null;
  onClose: () => void;
};

function Burst() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.3;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.5;
    const scale = Math.min(1 + t * 1.5, 3);
    ref.current.scale.setScalar(scale);
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = Math.max(0, 1 - t * 0.4);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4A24C"
        transparent
        opacity={1}
        toneMapped={false}
      />
    </points>
  );
}

export function LevelUpReveal({ level, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!level) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 3500);
    return () => clearTimeout(t);
  }, [level, onClose]);

  if (!level) return null;

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-[var(--color-bg-base)]/95 backdrop-blur transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
          <Burst />
        </Canvas>
      </div>

      <div className="relative z-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          Palier débloqué
        </p>
        <p className="mt-4 text-7xl">{level.icon ?? "★"}</p>
        <h2 className="mt-4 text-4xl font-semibold md:text-5xl">{level.name}</h2>
        <p className="mt-4 font-mono text-xs text-[var(--color-fg-muted)]">
          Palier {level.id}
        </p>
      </div>
    </div>
  );
}

// useMemo import inline because Burst needs it
import { useMemo } from "react";
