import { Boxes, Cloud, Database, Layers, MessageSquare, Send, Server } from "lucide-react";
import type { ArchGraph, ArchNode, ViewId } from "./types";

/**
 * The homepage navigation, expressed as the system Sandhosh actually builds.
 * Every badge is a real metric from the résumé — so the nav doubles as the
 * headline summary.
 *
 * Coordinates are hand-authored, not force-directed. For seven nodes that is
 * strictly better: it lets us choose which wires cross.
 *
 * Spacing rule: every gap between two card edges is >= 105 design units. The
 * router burns 30 at each end on stubs, so anything tighter leaves no straight
 * run and the edge label ends up sitting on top of a card.
 */
export const ARCH_GRAPH: ArchGraph = {
  nodes: [
    {
      kind: "nav",
      id: "client",
      order: 1,
      label: "React UI",
      sublabel: "TypeScript · SignalR",
      badge: "500+ users",
      icon: Layers,
      accent: "accent",
      size: { w: 180, h: 82 },
      layout: { lg: { x: 120, y: 340 } },
      view: "about",
      href: "/about",
      srHint: "React front end — open the About section",
      tooltip: {
        side: "bottom",
        title: "Who's at the keyboard",
        body: "Sandhoshsivan M · Full Stack Software Engineer",
      },
    },
    {
      kind: "nav",
      id: "gateway",
      order: 2,
      label: "Envoy Gateway",
      sublabel: "JWT · MFA · RBAC",
      badge: "3+ yrs",
      icon: Cloud,
      accent: "accent",
      size: { w: 190, h: 82 },
      layout: { lg: { x: 430, y: 340 } },
      view: "experience",
      href: "/experience",
      srHint: "API gateway — open the Experience section",
      tooltip: {
        side: "bottom",
        title: "Three years at the edge",
        body: "Envoy, Docker, Bitbucket CI/CD, zero-downtime IIS deploys",
      },
    },
    {
      kind: "hub",
      id: "api",
      order: 99,
      label: ".NET 9 Core API",
      sublabel: "28+ projects",
      badge: "975+ controllers",
      icon: Server,
      accent: "accent",
      size: { w: 220, h: 100 },
      layout: { lg: { x: 760, y: 340 } },
      tooltip: {
        side: "top",
        title: "The monolith that behaves",
        body: "HRMS · Finance/GL · Procurement · CAFM · HSE · Inventory",
      },
    },
    {
      kind: "nav",
      id: "redis",
      order: 3,
      label: "Redis",
      sublabel: "L1 / L2 FusionCache",
      badge: "30% faster",
      icon: Boxes,
      accent: "cache",
      size: { w: 180, h: 82 },
      layout: { lg: { x: 760, y: 130 } },
      view: "skills",
      href: "/skills",
      srHint: "Redis cache — open the Skills section",
      tooltip: {
        side: "left",
        title: "Hybrid cache",
        body: "L1 in-process + L2 Redis, circuit breakers, proactive refresh",
      },
    },
    {
      kind: "nav",
      id: "sql",
      order: 4,
      label: "SQL Server",
      sublabel: "Double-entry GL",
      badge: "1,170+ entities",
      icon: Database,
      accent: "store",
      size: { w: 190, h: 82 },
      layout: { lg: { x: 1140, y: 340 } },
      view: "cases",
      href: "/case-studies",
      srHint: "SQL Server — open the Case Studies section",
      tooltip: {
        side: "left",
        title: "System of record",
        body: "Four deep-dives: semantic search, workflow, caching, notifications",
      },
    },
    {
      kind: "nav",
      id: "rabbit",
      order: 5,
      label: "RabbitMQ",
      sublabel: "Event bus · 25+ jobs",
      badge: "async",
      icon: MessageSquare,
      accent: "async",
      size: { w: 190, h: 82 },
      layout: { lg: { x: 1140, y: 580 } },
      view: "projects",
      href: "/projects",
      srHint: "RabbitMQ event bus — open the Projects section",
      tooltip: {
        side: "left",
        title: "Things shipped",
        body: "ERP platform, a paid .NET API template, and a MonoGame platformer",
      },
    },
    {
      kind: "cta",
      id: "contact",
      order: 6,
      label: "say hi",
      sublabel: "SMTP · 202 Accepted",
      icon: Send,
      accent: "accent",
      size: { w: 196, h: 76 },
      layout: { lg: { x: 430, y: 590 } },
      view: "contact",
      href: "/contact",
      srHint: "Send a message — open the Contact section",
      tooltip: { side: "top", title: "Open a connection", body: "Available immediately" },
    },
  ],

  edges: [
    {
      id: "e-client-gw",
      from: "client",
      fromSide: "right",
      to: "gateway",
      toSide: "left",
      label: "HTTPS",
      packets: 2,
      speed: 190,
      accent: "accent",
    },
    {
      id: "e-gw-api",
      from: "gateway",
      fromSide: "right",
      to: "api",
      toSide: "left",
      label: "975 routes",
      packets: 2,
      speed: 200,
      accent: "accent",
    },

    // Anti-parallel pair. Redis sits directly above the API, so the slides are
    // chosen to land both ports on the same x — giving two clean parallel
    // verticals 64u apart rather than one wire drawn over the other.
    {
      id: "e-api-redis",
      from: "api",
      fromSide: "top",
      fromSlide: -32,
      to: "redis",
      toSide: "bottom",
      toSlide: 32,
      label: "GET",
      packets: 2,
      speed: 300,
      accent: "cache",
    },
    {
      id: "e-redis-api",
      from: "redis",
      fromSide: "bottom",
      fromSlide: -32,
      to: "api",
      toSide: "top",
      toSlide: 32,
      label: "HIT",
      packets: 1,
      speed: 300,
      accent: "cache",
      dashed: true,
    },

    {
      id: "e-api-sql",
      from: "api",
      fromSide: "right",
      to: "sql",
      toSide: "left",
      label: "T-SQL",
      packets: 2,
      speed: 150,
      accent: "store",
    },

    {
      id: "e-api-rabbit",
      from: "api",
      fromSide: "bottom",
      fromSlide: -70,
      to: "rabbit",
      toSide: "left",
      toSlide: -16,
      lane: 0,
      label: "publish",
      packets: 2,
      speed: 170,
      accent: "async",
    },

    {
      id: "e-api-contact",
      from: "api",
      fromSide: "bottom",
      fromSlide: 60,
      to: "contact",
      toSide: "top",
      label: "SMTP",
      packets: 1,
      speed: 120,
      accent: "accent",
      dashed: true,
    },
  ],
};

export const NODES_BY_ID: ReadonlyMap<string, ArchNode> = new Map(
  ARCH_GRAPH.nodes.map((n) => [n.id, n]),
);

/** Adjacency, built once at module scope — never in a hook. */
export const EDGES_BY_NODE: ReadonlyMap<string, readonly string[]> = (() => {
  const m = new Map<string, string[]>();
  const push = (k: string, v: string) => {
    const arr = m.get(k);
    if (arr) arr.push(v);
    else m.set(k, [v]);
  };
  for (const e of ARCH_GRAPH.edges) {
    push(e.from, e.id);
    push(e.to, e.id);
  }
  return m;
})();

/** Nodes in authored tab order — request order, not visual order. */
export const NODES_IN_ORDER: readonly ArchNode[] = [...ARCH_GRAPH.nodes].sort(
  (a, b) => a.order - b.order,
);

export const NODE_ID_BY_VIEW: ReadonlyMap<ViewId, string> = new Map(
  ARCH_GRAPH.nodes.flatMap((n) => (n.kind === "hub" ? [] : [[n.view, n.id] as const])),
);
