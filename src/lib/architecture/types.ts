import type { LucideIcon } from "lucide-react";

export type LayoutId = "lg" | "md";
export type Side = "left" | "right" | "top" | "bottom";

/** Wire semantics. Colour carries meaning here — it is not decoration. */
export type AccentKey = "accent" | "cache" | "async" | "store";

export type ViewId = "about" | "experience" | "skills" | "projects" | "cases" | "contact";

export interface Pt {
  x: number;
  y: number;
}

/**
 * Design-space canvas dimensions, one per layout variant.
 *
 * ⚠️ The rendered canvas box's aspect-ratio MUST equal w/h exactly, or the
 * SVG wire layer and the HTML card layer stop being registered. See the
 * `.arch-canvas` comment in globals.css.
 */
export const DESIGN: Record<LayoutId, { w: number; h: number }> = {
  lg: { w: 1200, h: 760 },
  md: { w: 900, h: 1120 },
};

interface ArchNodeBase {
  id: string;
  /** Visible label, e.g. "Redis". */
  label: string;
  /** Visible sublabel, e.g. "L1 / L2 FusionCache". */
  sublabel: string;
  /** Small chip — usually a real metric. */
  badge?: string;
  icon: LucideIcon;
  accent: AccentKey;
  /** Half-extents drive port placement; the card renders at this size in --u. */
  size: { w: number; h: number };
  /** Centre point, per layout variant. */
  layout: Record<LayoutId, Pt>;
  /** Authored tab order. Deliberately independent of x/y. */
  order: number;
  tooltip: { side: Side; title: string; body: string };
}

export interface ArchNavNode extends ArchNodeBase {
  kind: "nav" | "cta";
  view: ViewId;
  href: string;
  /**
   * Full accessible name. The visible label alone is jargon — "Redis" tells a
   * screen-reader user nothing about where the link goes.
   */
  srHint: string;
}

/** Decorative centre-of-gravity node. Not focusable, not a link. */
export interface ArchHubNode extends ArchNodeBase {
  kind: "hub";
}

export type ArchNode = ArchNavNode | ArchHubNode;

export function isNavNode(n: ArchNode): n is ArchNavNode {
  return n.kind !== "hub";
}

export interface ArchEdge {
  id: string;
  from: string;
  fromSide: Side;
  /** Slides the port along the node's edge, separating anti-parallel pairs. */
  fromSlide?: number;
  to: string;
  toSide: Side;
  toSlide?: number;
  /** Perpendicular offset applied to the mid-segment. */
  lane?: number;
  /** Escape hatch: hand-authored waypoints bypass the router entirely. */
  waypoints?: Partial<Record<LayoutId, Pt[]>>;
  /** Overrides the automatic "longest straight run" label placement. */
  labelAt?: Partial<Record<LayoutId, Pt>>;
  label?: string;
  /** Packets in flight at lg. Halved at md, zero below. */
  packets: 0 | 1 | 2 | 3;
  /** Design units per second. 1200u ≈ one full canvas width at lg. */
  speed: number;
  accent: AccentKey;
  dashed?: boolean;
}

export interface ArchGraph {
  nodes: ArchNode[];
  edges: ArchEdge[];
}
