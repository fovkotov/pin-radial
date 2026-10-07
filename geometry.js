/** Polar geometry helpers for annular sectors and circular text. */

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export function toRad(deg) {
  return deg * DEG;
}

export function toDeg(rad) {
  return rad / DEG;
}

/** Angle from +X axis, degrees, in [0, 360). SVG Y grows down. */
export function polarAngle(cx, cy, x, y) {
  let a = toDeg(Math.atan2(y - cy, x - cx));
  if (a < 0) a += 360;
  return a;
}

export function polarRadius(cx, cy, x, y) {
  return Math.hypot(x - cx, y - cy);
}

export function pointOnCircle(cx, cy, r, deg) {
  const a = toRad(deg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function normalizeAngle(deg) {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

/** Shortest signed delta a→b in degrees, in (-180, 180]. */
export function angleDelta(from, to) {
  let d = normalizeAngle(to) - normalizeAngle(from);
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

/** Clamp radius between two ring values (or free min/max). */
export function clampRadius(r, minR, maxR) {
  return Math.max(minR, Math.min(maxR, r));
}

/**
 * SVG path for an annular sector (ring brick).
 * Angles in degrees, 0 = +X, clockwise positive in screen space (SVG Y-down).
 * Sweep from startAngle toward endAngle following the shorter? No — we use
 * explicit start→end with signed sweep stored as a0→a1 with possible wrap.
 *
 * Convention: startAngle and endAngle are absolute; sweep goes CCW in math
 * but since SVG Y is down, cos/sin already match screen. Sweep flag = 1 if
 * going the long way (>180°) based on stored span.
 */
export function annularSectorPath(cx, cy, rIn, rOut, startAngle, endAngle) {
  const a0 = normalizeAngle(startAngle);
  let span = endAngle - startAngle;
  // Preserve intentional multi-turn? No — normalize span to (0, 360]
  while (span <= 0) span += 360;
  while (span > 360) span -= 360;
  const a1 = normalizeAngle(a0 + span);

  const large = span > 180 ? 1 : 0;
  // In SVG, positive sweep is clockwise when Y grows down? Actually:
  // SVG arc sweep-flag=1 means clockwise. Our angles increase CCW in math
  // (atan2), but with Y-down atan2 still increases clockwise visually... wait:
  // atan2(y,x) with Y-down: from +X, positive Y is down → clockwise.
  // So increasing angle = clockwise = SVG sweep 1.

  const p0o = pointOnCircle(cx, cy, rOut, a0);
  const p1o = pointOnCircle(cx, cy, rOut, a1);
  const p1i = pointOnCircle(cx, cy, rIn, a1);
  const p0i = pointOnCircle(cx, cy, rIn, a0);

  if (rIn <= 0.01) {
    // Pie slice
    return [
      `M ${cx} ${cy}`,
      `L ${p0o.x} ${p0o.y}`,
      `A ${rOut} ${rOut} 0 ${large} 1 ${p1o.x} ${p1o.y}`,
      `Z`,
    ].join(" ");
  }

  return [
    `M ${p0o.x} ${p0o.y}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${p1o.x} ${p1o.y}`,
    `L ${p1i.x} ${p1i.y}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${p0i.x} ${p0i.y}`,
    `Z`,
  ].join(" ");
}

/** Full circle path for textPath (clockwise from angleStart). */
export function circlePath(cx, cy, r, startAngle = 0, clockwise = true) {
  const a0 = normalizeAngle(startAngle);
  const p0 = pointOnCircle(cx, cy, r, a0);
  const aMid = normalizeAngle(a0 + 180);
  const pMid = pointOnCircle(cx, cy, r, aMid);
  const sweep = clockwise ? 1 : 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${r} ${r} 0 1 ${sweep} ${pMid.x} ${pMid.y}`,
    `A ${r} ${r} 0 1 ${sweep} ${p0.x} ${p0.y}`,
  ].join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Half-open radial ranges overlap (touching edges OK). */
export function radialRangesOverlap(aIn, aOut, bIn, bOut) {
  return aIn < bOut && bIn < aOut;
}

/**
 * Arc as start + positive clockwise span (same convention as annularSectorPath).
 * Returns { start, span } with start in [0,360), span in (0,360].
 */
export function arcParams(a0, a1) {
  const start = normalizeAngle(a0);
  let span = a1 - a0;
  while (span <= 0) span += 360;
  while (span > 360) span -= 360;
  return { start, span };
}

/** True if angle `deg` lies in arc a0→a1 (half-open, clockwise). */
export function angleInArc(deg, a0, a1) {
  const { start, span } = arcParams(a0, a1);
  if (span >= 360) return true;
  const d = normalizeAngle(deg - start);
  return d < span;
}

/** Split arc into 1–2 linear intervals on [0, 360). */
export function arcToLinearIntervals(a0, a1) {
  const { start, span } = arcParams(a0, a1);
  if (span >= 360) return [[0, 360]];
  const end = start + span;
  if (end <= 360) return [[start, end]];
  return [
    [start, 360],
    [0, end - 360],
  ];
}

function linearOverlap(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1;
}

/** Angular ranges overlap (wrap-aware). Touching endpoints OK. */
export function angularRangesOverlap(a0, a1, b0, b1) {
  const A = arcToLinearIntervals(a0, a1);
  const B = arcToLinearIntervals(b0, b1);
  for (const [x0, x1] of A) {
    for (const [y0, y1] of B) {
      if (linearOverlap(x0, x1, y0, y1)) return true;
    }
  }
  return false;
}

/** Annular sectors overlap iff both radial and angular ranges overlap. */
export function annularSectorsOverlap(a, b) {
  return (
    radialRangesOverlap(a.rIn, a.rOut, b.rIn, b.rOut) &&
    angularRangesOverlap(a.a0, a.a1, b.a0, b.a1)
  );
}

/** Clockwise distance from `from` to `to` in [0, 360). */
export function clockwiseDist(from, to) {
  return normalizeAngle(to - from);
}

/**
 * Clearance sweeping clockwise from `from` before hitting any obstacle arc.
 * 0 if `from` is already inside an obstacle. Obstacles are {a0,a1}.
 */
export function clockwiseClearance(from, obstacles) {
  let best = 360;
  const f = normalizeAngle(from);
  for (const obs of obstacles) {
    if (angleInArc(f, obs.a0, obs.a1)) return 0;
    const { start, span } = arcParams(obs.a0, obs.a1);
    if (span >= 360) return 0;
    best = Math.min(best, clockwiseDist(f, start));
  }
  return best;
}

/** Counter-clockwise clearance from `from` (decreasing angle). */
export function counterClockwiseClearance(from, obstacles) {
  let best = 360;
  const f = normalizeAngle(from);
  for (const obs of obstacles) {
    if (angleInArc(f, obs.a0, obs.a1)) return 0;
    const { start, span } = arcParams(obs.a0, obs.a1);
    if (span >= 360) return 0;
    const end = normalizeAngle(start + span);
    // CCW from f hits the arc at its end edge first
    best = Math.min(best, normalizeAngle(f - end));
  }
  return best;
}
