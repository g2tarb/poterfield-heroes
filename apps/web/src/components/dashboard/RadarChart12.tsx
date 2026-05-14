"use client";

import { useMemo } from "react";

export type RadarAxis = {
  id: string;
  label: string;
  colorHex: string;
  score: number; // 0..100
};

type Props = {
  axes: RadarAxis[];
  size?: number;
};

/**
 * SVG radar chart for 12 mastery axes.
 * Each vertex is colored after its axis, with a soft polygon fill.
 */
export function RadarChart12({ axes, size = 320 }: Props) {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.78;
  const labelRadius = (size / 2) * 0.95;

  const points = useMemo(() => {
    return axes.map((axis, i) => {
      const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2; // start at top
      const r = (axis.score / 100) * maxRadius;
      return {
        ...axis,
        angle,
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r,
        labelX: center + Math.cos(angle) * labelRadius,
        labelY: center + Math.sin(angle) * labelRadius,
        spokeX: center + Math.cos(angle) * maxRadius,
        spokeY: center + Math.sin(angle) * maxRadius,
      };
    });
  }, [axes, center, maxRadius, labelRadius]);

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative w-full max-w-md">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Radar des 12 axes de mastery"
      >
        {/* Concentric grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <circle
            key={ratio}
            cx={center}
            cy={center}
            r={maxRadius * ratio}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeDasharray={ratio === 1 ? "" : "2 4"}
          />
        ))}

        {/* Axis spokes */}
        {points.map((p) => (
          <line
            key={`spoke-${p.id}`}
            x1={center}
            y1={center}
            x2={p.spokeX}
            y2={p.spokeY}
            stroke="var(--color-border-subtle)"
            strokeWidth={0.5}
          />
        ))}

        {/* Filled polygon */}
        <polygon
          points={polygonPath}
          fill="var(--color-accent)"
          fillOpacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p) => (
          <g key={`pt-${p.id}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={p.colorHex}
              stroke="var(--color-bg-base)"
              strokeWidth={1.5}
            />
          </g>
        ))}

        {/* Labels */}
        {points.map((p) => {
          // Tilt to align with axis angle
          const angleDeg = (p.angle * 180) / Math.PI;
          const isLeftHalf = angleDeg > 90 || angleDeg < -90;
          return (
            <text
              key={`lbl-${p.id}`}
              x={p.labelX}
              y={p.labelY}
              textAnchor={
                Math.abs(Math.cos(p.angle)) < 0.2
                  ? "middle"
                  : isLeftHalf
                    ? "end"
                    : "start"
              }
              dominantBaseline="middle"
              className="fill-current font-mono text-[9px] uppercase tracking-wider"
              style={{ color: "var(--color-fg-secondary)" }}
            >
              {p.label}
            </text>
          );
        })}

        {/* Center label : avg */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono text-xs"
          style={{ fill: "var(--color-fg-muted)" }}
        >
          {Math.round(axes.reduce((s, a) => s + a.score, 0) / axes.length)}%
        </text>
      </svg>
    </div>
  );
}
