"use client";

import { memo } from "react";
import type { ResolvedEdge } from "@/lib/architecture/geometry";
import type { LayoutId } from "@/lib/architecture/types";
import { DESIGN } from "@/lib/architecture/types";

interface WireProps {
  re: ResolvedEdge;
  active: boolean;
  registerPath: (id: string, el: SVGPathElement | null) => void;
}

const Wire = memo(function Wire({ re, active, registerPath }: WireProps) {
  const stroke = `var(--color-${re.edge.accent})`;
  return (
    <g>
      <path
        ref={(el) => registerPath(re.edge.id, el)}
        d={re.d}
        className="arch-wire"
        data-active={active || undefined}
        stroke={stroke}
        strokeWidth={active ? 3.25 : 1.75}
        strokeDasharray={re.edge.dashed ? "7 7" : undefined}
        opacity={active ? 1 : 0.55}
      />
      {/* Solder pads: they read as ports, and hide any sub-pixel overshoot
          where a wire meets a card. */}
      <circle cx={re.start.x} cy={re.start.y} r={3.5} fill={stroke} className="arch-port" />
      <circle cx={re.end.x} cy={re.end.y} r={3.5} fill={stroke} className="arch-port" />
    </g>
  );
});

interface Props {
  edges: ResolvedEdge[];
  layoutId: LayoutId;
  activeEdgeIds: ReadonlySet<string>;
  dimming: boolean;
  registerPath: (id: string, el: SVGPathElement | null) => void;
  children?: React.ReactNode;
}

export const WireLayer = memo(function WireLayer({
  edges,
  layoutId,
  activeEdgeIds,
  dimming,
  registerPath,
  children,
}: Props) {
  const { w, h } = DESIGN[layoutId];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full overflow-visible"
      data-dim={dimming || undefined}
      // All semantics live in the HTML card layer. focusable="false" keeps
      // legacy engines from putting the <svg> itself in the tab order.
      aria-hidden="true"
      focusable="false"
    >
      {edges.map((re) => (
        <Wire
          key={re.edge.id}
          re={re}
          active={activeEdgeIds.has(re.edge.id)}
          registerPath={registerPath}
        />
      ))}

      {children}

      {edges.map((re) =>
        re.edge.label ? (
          <g
            key={`lbl-${re.edge.id}`}
            transform={`translate(${re.labelAt.x} ${re.labelAt.y})${
              re.labelAngle === 90 ? " rotate(-90)" : ""
            }`}
          >
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className="font-mono"
              fontSize={11}
              letterSpacing={0.5}
              fill="var(--color-muted)"
            >
              {re.edge.label}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );
});
