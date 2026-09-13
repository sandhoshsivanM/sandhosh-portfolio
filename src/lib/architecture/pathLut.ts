import type { Pt } from "./types";

/**
 * Arc-length lookup table for a wire.
 *
 * `getPointAtLength` on a path inside a viewBox returns *user units*, so a LUT
 * built once stays valid across every resize — no ResizeObserver anywhere in
 * this feature. Sampling by arc length also gives constant packet speed around
 * corners for free, which a naive bezier `t` parameterisation would not.
 */
export interface PathLUT {
  /** Interleaved x,y — (samples + 1) points. */
  pts: Float32Array;
  length: number;
  samples: number;
}

export function buildLUT(path: SVGPathElement, samples = 192): PathLUT | null {
  // jsdom and some SSR shims don't implement SVG geometry.
  if (typeof path.getTotalLength !== "function") return null;

  let length: number;
  try {
    length = path.getTotalLength();
  } catch {
    return null;
  }
  if (!Number.isFinite(length) || length <= 0) return null;

  const pts = new Float32Array((samples + 1) * 2);
  for (let i = 0; i <= samples; i++) {
    const p = path.getPointAtLength((i / samples) * length);
    pts[i * 2] = p.x;
    pts[i * 2 + 1] = p.y;
  }
  return { pts, length, samples };
}

/** Reused across every sample — no per-frame allocation, so no GC sawtooth. */
const shared: Pt = { x: 0, y: 0 };

/**
 * Sample at `t` in [0,1] by arc length.
 * Mutates and returns a shared object — copy it if you need to retain it.
 */
export function samplePathAt(lut: PathLUT, t: number): Pt {
  const c = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const pos = c * lut.samples;
  const i = Math.min(pos | 0, lut.samples - 1);
  const frac = pos - i;
  const j = i * 2;
  const x0 = lut.pts[j];
  const y0 = lut.pts[j + 1];
  const x1 = lut.pts[j + 2];
  const y1 = lut.pts[j + 3];
  shared.x = x0 + (x1 - x0) * frac;
  shared.y = y0 + (y1 - y0) * frac;
  return shared;
}
