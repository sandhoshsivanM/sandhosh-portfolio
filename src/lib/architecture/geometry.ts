import type { ArchEdge, ArchNode, LayoutId, Pt, Side } from "./types";

const SIDE_VEC: Record<Side, Pt> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};

/** Straight run leaving/entering a node before the first turn. */
const STUB = 30;
/** Corner radius, clamped per-corner to half the shorter adjacent segment. */
const RADIUS = 18;

/** 2dp keeps `d` strings short and byte-identical between server and client. */
const f = (n: number) => (Math.round(n * 100) / 100).toString();

export function portPoint(node: ArchNode, side: Side, layout: LayoutId, slide = 0): Pt {
  const c = node.layout[layout];
  const v = SIDE_VEC[side];
  const perp = { x: -v.y, y: v.x };
  return {
    x: c.x + v.x * (node.size.w / 2) + perp.x * slide,
    y: c.y + v.y * (node.size.h / 2) + perp.y * slide,
  };
}

function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.01 || Math.abs(last.y - p.y) > 0.01) {
      out.push(p);
    }
  }
  return out;
}

/**
 * Orthogonal router: stub out of the source, Z- or L-route across, stub in.
 * No obstacle avoidance — for the handful of edges where a wire clips a node,
 * bump `lane` or use the `waypoints` escape hatch on the edge.
 */
export function routeOrthogonal(s: Pt, sSide: Side, e: Pt, eSide: Side, lane = 0): Pt[] {
  const sv = SIDE_VEC[sSide];
  const ev = SIDE_VEC[eSide];
  const a: Pt = { x: s.x + sv.x * STUB, y: s.y + sv.y * STUB };
  const b: Pt = { x: e.x + ev.x * STUB, y: e.y + ev.y * STUB };

  const sHoriz = sv.y === 0;
  const eHoriz = ev.y === 0;
  const mid: Pt[] = [];

  if (sHoriz && eHoriz) {
    const mx = (a.x + b.x) / 2 + lane;
    mid.push({ x: mx, y: a.y }, { x: mx, y: b.y });
  } else if (!sHoriz && !eHoriz) {
    const my = (a.y + b.y) / 2 + lane;
    mid.push({ x: a.x, y: my }, { x: b.x, y: my });
  } else if (sHoriz) {
    mid.push({ x: b.x, y: a.y });
  } else {
    mid.push({ x: a.x, y: b.y });
  }

  return dedupe([s, a, ...mid, b, e]);
}

/** Polyline → path `d`, with quadratic fillets at every interior vertex. */
export function roundedPolyline(points: Pt[], radius = RADIUS): string {
  const p = dedupe(points);
  if (p.length < 2) return "";
  if (p.length === 2) return `M ${f(p[0].x)} ${f(p[0].y)} L ${f(p[1].x)} ${f(p[1].y)}`;

  let d = `M ${f(p[0].x)} ${f(p[0].y)}`;

  for (let i = 1; i < p.length - 1; i++) {
    const prev = p[i - 1];
    const cur = p[i];
    const next = p[i + 1];

    const dPrev = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const dNext = Math.hypot(next.x - cur.x, next.y - cur.y);
    const r = Math.min(radius, dPrev / 2, dNext / 2);

    if (r < 0.5) {
      d += ` L ${f(cur.x)} ${f(cur.y)}`;
      continue;
    }

    const u1 = { x: (prev.x - cur.x) / dPrev, y: (prev.y - cur.y) / dPrev };
    const u2 = { x: (next.x - cur.x) / dNext, y: (next.y - cur.y) / dNext };

    const c1 = { x: cur.x + u1.x * r, y: cur.y + u1.y * r };
    const c2 = { x: cur.x + u2.x * r, y: cur.y + u2.y * r };

    d += ` L ${f(c1.x)} ${f(c1.y)} Q ${f(cur.x)} ${f(cur.y)} ${f(c2.x)} ${f(c2.y)}`;
  }

  const last = p[p.length - 1];
  return `${d} L ${f(last.x)} ${f(last.y)}`;
}

export interface ResolvedEdge {
  edge: ArchEdge;
  d: string;
  points: Pt[];
  start: Pt;
  end: Pt;
  /** Midpoint of the longest straight run, unless overridden on the edge. */
  labelAt: Pt;
  labelAngle: 0 | 90;
}

export function resolveEdge(
  edge: ArchEdge,
  nodesById: ReadonlyMap<string, ArchNode>,
  layout: LayoutId,
): ResolvedEdge {
  const from = nodesById.get(edge.from);
  const to = nodesById.get(edge.to);
  if (!from || !to) throw new Error(`Edge ${edge.id} references a missing node`);

  const s = portPoint(from, edge.fromSide, layout, edge.fromSlide ?? 0);
  const e = portPoint(to, edge.toSide, layout, edge.toSlide ?? 0);

  const waypoints = edge.waypoints?.[layout];
  const points = waypoints
    ? dedupe([s, ...waypoints, e])
    : routeOrthogonal(s, edge.fromSide, e, edge.toSide, edge.lane ?? 0);

  let best = 0;
  let bi = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    if (len > best) {
      best = len;
      bi = i;
    }
  }
  const p0 = points[bi];
  const p1 = points[bi + 1];

  return {
    edge,
    d: roundedPolyline(points),
    points,
    start: s,
    end: e,
    labelAt: edge.labelAt?.[layout] ?? { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 },
    labelAngle: Math.abs(p1.x - p0.x) >= Math.abs(p1.y - p0.y) ? 0 : 90,
  };
}
