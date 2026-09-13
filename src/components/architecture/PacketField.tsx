"use client";

import { memo, useEffect, useMemo, useRef, type RefObject } from "react";
import { useAnimationFrame } from "framer-motion";
import { buildLUT, samplePathAt, type PathLUT } from "@/lib/architecture/pathLut";
import type { ResolvedEdge } from "@/lib/architecture/geometry";

interface Packet {
  key: string;
  edgeId: string;
  phase: number;
  speed: number;
  radius: number;
  accent: string;
  start: { x: number; y: number };
}

interface Props {
  edges: ResolvedEdge[];
  pathRefs: RefObject<Map<string, SVGPathElement | null>>;
  /** 1 = full speed; 0.18 = slowed because its node is being inspected. */
  speedFor: (edgeId: string) => number;
  /** Multiplied into the computed fade so dimming stays owned by the loop. */
  dimFor: (edgeId: string) => number;
  running: boolean;
  /** 1 at lg, 0.5 at md. */
  packetScale: number;
}

/**
 * One RAF for every packet. Progress lives in refs and positions are written
 * straight to the DOM, so this loop triggers zero React renders — which is
 * exactly why the hover highlight above it can be plain React state.
 */
export const PacketField = memo(function PacketField({
  edges,
  pathRefs,
  speedFor,
  dimFor,
  running,
  packetScale,
}: Props) {
  const luts = useRef(new Map<string, PathLUT>());
  const nodes = useRef(new Map<string, SVGGElement | null>());
  const progress = useRef(new Map<string, number>());

  const packets = useMemo<Packet[]>(() => {
    const list: Packet[] = [];
    for (const re of edges) {
      const count = Math.max(0, Math.round(re.edge.packets * packetScale));
      for (let i = 0; i < count; i++) {
        list.push({
          key: `${re.edge.id}#${i}`,
          edgeId: re.edge.id,
          phase: i / count,
          speed: re.edge.speed,
          radius: i === 0 ? 4.5 : 3.2,
          accent: `var(--color-${re.edge.accent})`,
          start: re.start,
        });
      }
    }
    return list;
  }, [edges, packetScale]);

  // Rebuild LUTs only when the path geometry actually changes — not on resize,
  // because LUT coordinates are viewBox user units.
  const dSignature = useMemo(() => edges.map((e) => e.d).join("|"), [edges]);

  useEffect(() => {
    const next = new Map<string, PathLUT>();
    for (const re of edges) {
      const el = pathRefs.current?.get(re.edge.id);
      const lut = el ? buildLUT(el) : null;
      if (lut) next.set(re.edge.id, lut);
    }
    luts.current = next;
    // `edges`/`pathRefs` are intentionally omitted — dSignature is the real
    // dependency, and `edges` is a fresh array on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dSignature]);

  useEffect(() => {
    for (const p of packets) {
      if (!progress.current.has(p.key)) progress.current.set(p.key, p.phase);
    }
  }, [packets]);

  useAnimationFrame((_t, deltaMs) => {
    if (!running) return;
    // Clamp the spike a backgrounded tab produces on resume, or every packet
    // jumps a full lap at once.
    const dt = Math.min(deltaMs, 50) / 1000;

    for (const p of packets) {
      const lut = luts.current.get(p.edgeId);
      const g = nodes.current.get(p.key);
      if (!lut || !g) continue;

      // Delta-accumulated, never t = elapsed/period: changing the speed
      // multiplier must change velocity, never teleport the packet.
      let t = (progress.current.get(p.key) ?? p.phase) + (p.speed * speedFor(p.edgeId) * dt) / lut.length;
      if (t >= 1) t -= Math.floor(t);
      progress.current.set(p.key, t);

      const { x, y } = samplePathAt(lut, t);
      // CSS transform on an SVG child: px === user units. This wins the
      // cascade over the SSR `transform` attribute, so there is no hydration
      // mismatch. Never mix in setAttribute("transform") once this is set.
      g.style.transform = `translate(${x}px, ${y}px)`;

      const fade = Math.min(1, t / 0.05, (1 - t) / 0.05) * dimFor(p.edgeId);
      g.style.opacity = fade.toFixed(3);
    }
  });

  return (
    <g className="arch-packets" aria-hidden="true">
      {packets.map((p) => (
        <g
          key={p.key}
          ref={(el) => {
            nodes.current.set(p.key, el);
          }}
          // Deterministic first-paint position, derived from data.
          transform={`translate(${p.start.x} ${p.start.y})`}
          style={{ opacity: 0 }}
        >
          {/* Glow is a third concentric circle, not a drop-shadow filter —
              filter regions re-rasterise every frame. */}
          <circle r={p.radius * 3} fill={p.accent} opacity={0.14} />
          <circle r={p.radius} fill={p.accent} />
          <circle r={p.radius * 0.45} fill="#fff" opacity={0.85} />
        </g>
      ))}
    </g>
  );
});

/** Reduced-motion substitute: no RAF is ever registered. */
export const StaticPackets = memo(function StaticPackets({ edges }: { edges: ResolvedEdge[] }) {
  return (
    <g aria-hidden="true">
      {edges.map((re) => (
        <circle
          key={re.edge.id}
          cx={re.labelAt.x}
          cy={re.labelAt.y}
          r={4}
          fill={`var(--color-${re.edge.accent})`}
          opacity={0.9}
        />
      ))}
    </g>
  );
});
