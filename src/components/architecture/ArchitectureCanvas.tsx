"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { useCanvasActivity } from "@/hooks/useCanvasActivity";
import { resolveEdge } from "@/lib/architecture/geometry";
import {
  ARCH_GRAPH,
  EDGES_BY_NODE,
  NODES_BY_ID,
  NODES_IN_ORDER,
  NODE_ID_BY_VIEW,
} from "@/lib/architecture/graph";
import { DESIGN, isNavNode, type ArchNode, type ViewId } from "@/lib/architecture/types";
import { NodeCard } from "./NodeCard";
import { PacketField, StaticPackets } from "./PacketField";
import { WireLayer } from "./WireLayer";

interface Props {
  openView: ViewId | null;
  onOpen: (node: ArchNode, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ArchitectureCanvas({ openView, onOpen }: Props) {
  // Single authored layout; below 1024px MobilePipeline replaces this whole
  // component, so there is no variant to resolve at runtime.
  const layoutId = "lg" as const;
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);
  const running = useCanvasActivity(canvasRef);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const { w: W, h: H } = DESIGN[layoutId];

  // Path generation runs once per layout variant, not per render.
  const edges = useMemo(
    () => ARCH_GRAPH.edges.map((e) => resolveEdge(e, NODES_BY_ID, layoutId)),
    [layoutId],
  );

  const activeEdgeIds = useMemo(
    () => new Set(activeNodeId ? (EDGES_BY_NODE.get(activeNodeId) ?? []) : []),
    [activeNodeId],
  );

  const pathRefs = useRef(new Map<string, SVGPathElement | null>());
  const registerPath = useCallback((id: string, el: SVGPathElement | null) => {
    pathRefs.current.set(id, el);
  }, []);

  // A hard freeze reads as a bug; 0.18x reads as "inspecting".
  const speedFor = useCallback(
    (edgeId: string) => (!activeNodeId ? 1 : activeEdgeIds.has(edgeId) ? 0.18 : 0.4),
    [activeNodeId, activeEdgeIds],
  );

  // Dimming stays inside the RAF loop rather than fighting inline opacity
  // with !important CSS.
  const dimFor = useCallback(
    (edgeId: string) => (!activeNodeId || activeEdgeIds.has(edgeId) ? 1 : 0.1),
    [activeNodeId, activeEdgeIds],
  );

  // Pan/zoom. framer composes translate(t) scale(s) about the origin, so a
  // point p maps to s*p + t. Solving s*focus + t = centre gives t = centre - s*focus.
  const S = 1.5;
  const focusNode = openView ? NODES_BY_ID.get(NODE_ID_BY_VIEW.get(openView) ?? "") : undefined;
  const focus = focusNode ? focusNode.layout[layoutId] : { x: W / 2, y: H / 2 };
  const s = openView ? S : 1;

  return (
    <div
      ref={canvasRef}
      className="arch-canvas arch-canvas-in relative w-full"
      /* ⚠️ Adding padding/border/min-height here desynchronises the SVG and
         HTML layers — every wire will miss every card. Style the parent. */
      style={{ aspectRatio: `${W} / ${H}`, ["--design-w" as string]: W }}
    >
      <motion.div
        className="absolute inset-0 origin-top-left"
        animate={{
          scale: s,
          x: `${(0.5 - (s * focus.x) / W) * 100}%`,
          y: `${(0.5 - (s * focus.y) / H) * 100}%`,
        }}
        transition={
          reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 30, mass: 0.9 }
        }
        style={{ willChange: openView !== null ? "transform" : "auto" }}
      >
        <WireLayer
          edges={edges}
          layoutId={layoutId}
          activeEdgeIds={activeEdgeIds}
          dimming={activeNodeId !== null}
          registerPath={registerPath}
        >
          {reduce ? (
            <StaticPackets edges={edges} />
          ) : (
            <PacketField
              edges={edges}
              pathRefs={pathRefs}
              speedFor={speedFor}
              dimFor={dimFor}
              running={running}
              packetScale={1}
            />
          )}
        </WireLayer>

        {/* Semantics live here, not in the SVG. Authored order === tab order. */}
        <nav aria-labelledby="arch-nav-title" aria-describedby="arch-nav-desc">
          <h2 id="arch-nav-title" className="sr-only">
            Site sections
          </h2>
          <p id="arch-nav-desc" className="sr-only">
            Presented as a system architecture diagram. Each component links to a section. Six
            links follow, in request order from the browser to the database.
          </p>
          <ul role="list" className="absolute inset-0">
            {NODES_IN_ORDER.map((node) => {
              const card = (
                <NodeCard
                  node={node}
                  layoutId={layoutId}
                  active={activeNodeId === node.id}
                  dimmed={activeNodeId !== null && activeNodeId !== node.id}
                  onActivate={setActiveNodeId}
                  onOpen={onOpen}
                />
              );
              return isNavNode(node) ? (
                <li key={node.id}>{card}</li>
              ) : (
                <li key={node.id} aria-hidden="true">
                  {card}
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </div>
  );
}
