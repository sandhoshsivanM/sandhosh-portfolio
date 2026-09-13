"use client";

import Link from "next/link";
import { memo } from "react";
import type { ArchNode, LayoutId } from "@/lib/architecture/types";
import { DESIGN } from "@/lib/architecture/types";

interface Props {
  node: ArchNode;
  layoutId: LayoutId;
  active: boolean;
  dimmed: boolean;
  onActivate: (id: string | null) => void;
  onOpen: (node: ArchNode, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const NodeCard = memo(function NodeCard({
  node,
  layoutId,
  active,
  dimmed,
  onActivate,
  onOpen,
}: Props) {
  const { w: W, h: H } = DESIGN[layoutId];
  const pos = node.layout[layoutId];
  const Icon = node.icon;
  const tipId = `tip-${node.id}`;
  const accent = `var(--color-${node.accent})`;

  // Sized in --u so the data's size.w/h means the same thing to the port
  // router and to the DOM. Never hard-code a Tailwind width here.
  const wrapperStyle: React.CSSProperties = {
    left: `${(pos.x / W) * 100}%`,
    top: `${(pos.y / H) * 100}%`,
    width: `calc(${node.size.w} * var(--u))`,
    height: `calc(${node.size.h} * var(--u))`,
  };

  const body = (
    <>
      <span className="flex items-center gap-2">
        <Icon
          aria-hidden="true"
          className="shrink-0"
          style={{ color: accent, width: "calc(18 * var(--u))", height: "calc(18 * var(--u))" }}
        />
        <span className="arch-node__label font-display font-semibold tracking-tight text-fg">
          {node.label}
        </span>
      </span>
      <span className="arch-node__sublabel block truncate font-mono text-muted">
        {node.sublabel}
      </span>
      {node.badge && (
        <span
          className="arch-node__badge inline-flex w-fit rounded-full px-2 py-0.5 font-mono uppercase tracking-widest"
          style={{ color: accent, background: `color-mix(in oklab, ${accent} 14%, transparent)` }}
        >
          {node.badge}
        </span>
      )}
    </>
  );

  const shell =
    "flex h-full w-full flex-col justify-center gap-1 rounded-xl border px-3 transition-[border-color,box-shadow,opacity,transform] duration-200";

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={wrapperStyle}>
      {node.kind === "hub" ? (
        // Decorative centre of gravity: carries the headline metric without
        // stealing a nav slot, so it is excluded from the a11y tree.
        <div
          aria-hidden="true"
          className={`${shell} border-dashed`}
          style={{
            background: "var(--color-surface)",
            borderColor: active ? accent : "var(--color-wire)",
            opacity: dimmed ? 0.4 : 1,
          }}
        >
          {body}
        </div>
      ) : (
        <Link
          href={node.href}
          aria-label={node.srHint}
          aria-describedby={tipId}
          onClick={(e) => onOpen(node, e)}
          onPointerEnter={() => onActivate(node.id)}
          onPointerLeave={() => onActivate(null)}
          onFocus={() => onActivate(node.id)}
          onBlur={() => onActivate(null)}
          className={`${shell} group outline-none focus-visible:outline-2 focus-visible:outline-offset-4`}
          style={{
            background: "var(--color-surface)",
            borderColor: active ? accent : "var(--color-wire)",
            boxShadow: active ? `0 0 0 1px ${accent}, 0 8px 30px -12px ${accent}` : "none",
            outlineColor: accent,
            opacity: dimmed ? 0.4 : 1,
            transform: active ? "translateY(-2px)" : "none",
          }}
        >
          {body}
        </Link>
      )}

      {/* Always in the DOM (hidden by opacity, never display:none) so
          aria-describedby resolves regardless of visual state. */}
      <div
        id={tipId}
        role="tooltip"
        data-side={node.tooltip.side}
        className={`pointer-events-none absolute z-20 w-max max-w-[240px] rounded-lg border border-wire bg-surface-2 px-3 py-2 shadow-xl transition-opacity duration-150 ${
          active ? "opacity-100" : "opacity-0"
        } ${
          node.tooltip.side === "top"
            ? "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2"
            : node.tooltip.side === "bottom"
              ? "left-1/2 top-[calc(100%+10px)] -translate-x-1/2"
              : node.tooltip.side === "left"
                ? "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"
                : "left-[calc(100%+10px)] top-1/2 -translate-y-1/2"
        }`}
      >
        <p className="font-display text-xs font-semibold text-fg">{node.tooltip.title}</p>
        <p className="mt-0.5 font-mono text-[11px] leading-relaxed text-muted">
          {node.tooltip.body}
        </p>
      </div>
    </div>
  );
});
