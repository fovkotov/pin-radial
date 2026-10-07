import {
  annularSectorPath,
  annularSectorsOverlap,
  angleDelta,
  angleInArc,
  angularRangesOverlap,
  arcParams,
  circlePath,
  clampRadius,
  clockwiseClearance,
  counterClockwiseClearance,
  normalizeAngle,
  pointOnCircle,
  polarAngle,
  polarRadius,
  radialRangesOverlap,
  uid,
} from "./geometry.js";
import { initAuth } from "./auth.js";
import {
  initView3d,
  setView3dVisible,
  syncView3d,
  resetView3dCamera,
  exportView3dPng,
  exportView3dFbx,
  copyView3dTransparentPng,
} from "./view3d.js";
import opentype from "./vendor/opentype/opentype.module.js";
const STORAGE_KEY = "pin-ring-constructor-v2";
const PREFS_KEY = "pin-ring-constructor-prefs";
const CX = 400;
const CY = 400;
/** Minimum segment angular span (degrees). Not a snap grid. */
const MIN_SPAN = 2;
/** Hairline needle wedges may be narrower than MIN_SPAN (random only). */
const NEEDLE_SPAN_MIN = 0.6;
const NEEDLE_SPAN_MAX = 2.2;
const MIN_R = 40;
const MAX_R = 390;
const MIN_THICKNESS = 4;
const RANDOM_INNER = 110; // clearer empty center for random packs
/** Fixed arc-text кегль (px in SVG viewBox units). */
const ARC_TEXT_SIZE = 6;
/** Match canvas `letter-spacing: 0.12em` (×3 kept as optional visual match). */
const ARC_LETTER_SPACING_EM = 0.12;
/** YS Compressed Medium — canvas / SVG / video / 3D arc labels only. */
const ARC_FONT_FAMILY = "YS Compressed";
const ARC_FONT_URL = "./fonts/YSCompressed-Medium.ttf";
const ARC_FONT_URL_FALLBACK = "./fonts/YSCompressed-Medium.otf";
const ARC_FONT_CSS = `"${ARC_FONT_FAMILY}", sans-serif`;
/** «широкие» scrubber: radial tall/thin contrast (0–120, default 120). */
/** Startup defaults (locked — every refresh resets to these; not restored from storage). */
const DEFAULT_WIDE_PIECES = 66;
const MAX_WIDE_PIECES = 120;
/** Internal strength of wide/tall radial contrast (slider 0–100; peak ≈3× prior). */
const WIDE_STRENGTH = 6;
/** Default randomness (0=guides/diametric, 100=wild free). */
const DEFAULT_RANDOMNESS = 69;
/** Default object density (0=sparse, 100=dense). */
const DEFAULT_OBJECT_COUNT = 90;
/** Default «длинные» (0=no thin ribbons / short-biased chunks, 100=longer arcs + rare ribbons). */
const DEFAULT_LONG_PIECES = 83;
/** Default «размер»: 0=маленькие, 100=большие. */
const DEFAULT_SIZE_MIX = 100;
/** Live re-roll debounce for composition sliders (ms). */
const SLIDER_REROLL_MS = 45;
/** Visible hairline gap between adjacent segments on a band (degrees). */
const OVERLAP_GAP = 0.275;
/** @type {number} 0–100 — session only, reset on refresh */
let randomness = DEFAULT_RANDOMNESS;
/** @type {number} 0–100 — session only, reset on refresh */
let objectCount = DEFAULT_OBJECT_COUNT;
/** @type {number} 0–120 — tall/wide radial contrast; session only */
let widePieces = DEFAULT_WIDE_PIECES;
/** @type {number} 0–100 — long angular arcs; session only */
let longPieces = DEFAULT_LONG_PIECES;
/** @type {number} 0–100 — tiny-chip (0) ↔ giant-chunk (100); session only */
let sizeMix = DEFAULT_SIZE_MIX;

const COLORS = {
  purple: "#7a54ff",
  white: "#ffffff",
  grey: "#c6cdd7",
  blue: "#5385fd",
  coral: "#f86049",
  dark: "#302b31",
  lilac: "#a38aff",
};

/** Global arc-text colors only (mass control). */
const TEXT_COLORS = {
  white: "#FFFFFF",
  dark: "#302B31",
  /** @deprecated legacy prefs key → same as dark */
  accent: "#302B31",
};
const DEFAULT_TEXT_COLOR_KEY = "dark";
/** @type {'white'|'dark'|'accent'} */
let textColorKey = DEFAULT_TEXT_COLOR_KEY;

function currentTextColor() {
  return TEXT_COLORS[textColorKey] || TEXT_COLORS.dark;
}

function applyGlobalTextColorToState() {
  const c = currentTextColor();
  if (!state?.texts) return;
  for (const t of state.texts) t.color = c;
}

const FILLS = [
  { id: "white", color: COLORS.white, label: "White ~52%" },
  { id: "grey", color: COLORS.grey, label: "Grey ~26%" },
  { id: "purple", color: COLORS.purple, label: "Purple ~10%" },
  { id: "dark", color: COLORS.dark, label: "Dark ~9%" },
  { id: "lilac", color: COLORS.lilac, label: "Lilac ~9%" },
  { id: "blue", color: COLORS.blue, label: "Blue ~2%" },
  { id: "coral", color: COLORS.coral, label: "Coral ~2%" },
];

const DEFAULT_RINGS = [146, 224, 302, 380];

const FILL_WEIGHTS = [
  { color: COLORS.white, w: 1000 },
  { color: COLORS.grey, w: 500 },
  { color: COLORS.purple, w: 188 },
  { color: COLORS.lilac, w: 174 },
  { color: COLORS.blue, w: 36 },
  { color: COLORS.coral, w: 36 },
];

const RANDOM_PHRASES = [
  "МОДЕЛЬ: YNDX-00212",
  "ВАШ ДНЕВНИК, КОТОРЫЙ НЕ НУЖНО ВЕСТИ",
  "ВСЁ ВАЖНОЕ — В МОЕЙ ПАМЯТИ",
  "PIN",
  "ЗАПОМИНАЕТ ЗА ТЕБЯ",
  "СЛОЙ / RING",
  "ПАМЯТЬ",
  "RING / 02",
  "YNDX",
  "DIAL",
];

/** @type {{ uri: string, fmt: string } | null} */
let arcFontDataUri = null;
/** @type {ArrayBuffer | null} */
let arcFontBuffer = null;
/** @type {import("opentype.js").Font | null} */
let arcOpentypeFont = null;

function normalizeArcText(s) {
  return String(s ?? "").toLocaleUpperCase("ru-RU");
}

function clampWidePieces(v) {
  return Math.max(0, Math.min(MAX_WIDE_PIECES, Math.round(Number(v) || 0)));
}

function normalizeTextItem(t) {
  if (!t || typeof t !== "object") return t;
  t.content = normalizeArcText(t.content);
  t.size = ARC_TEXT_SIZE;
  t.color = currentTextColor();
  return t;
}

function normalizeAllTexts(s) {
  if (!s?.texts) return s;
  for (const t of s.texts) normalizeTextItem(t);
  return s;
}

async function ensureArcFontBuffer() {
  if (arcFontBuffer) return arcFontBuffer;
  let res = await fetch(ARC_FONT_URL);
  let fmt = "truetype";
  if (!res.ok) {
    res = await fetch(ARC_FONT_URL_FALLBACK);
    fmt = ARC_FONT_URL_FALLBACK.endsWith(".otf") ? "opentype" : "truetype";
  }
  if (!res.ok) throw new Error(`font fetch ${res.status}`);
  arcFontBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arcFontBuffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const mime = fmt === "opentype" ? "font/otf" : "font/ttf";
  arcFontDataUri = { uri: `data:${mime};base64,${btoa(binary)}`, fmt };
  return arcFontBuffer;
}

async function ensureArcFontDataUri() {
  if (arcFontDataUri) return arcFontDataUri;
  await ensureArcFontBuffer();
  return arcFontDataUri;
}

async function ensureArcOpentypeFont() {
  if (arcOpentypeFont) return arcOpentypeFont;
  const buf = await ensureArcFontBuffer();
  arcOpentypeFont = opentype.parse(buf.slice(0));
  return arcOpentypeFont;
}

/**
 * Convert arc text to SVG path outlines along the same clockwise circle as textPath.
 * Pure geometry — no live font dependency in the exported file.
 */
function arcTextOutlinePaths(font, t) {
  const content = normalizeArcText(t.content);
  if (!content || !font) return [];
  const fontSize = ARC_TEXT_SIZE;
  const radius = Math.max(1, Number(t.radius) || 1);
  const letterSpacing = ARC_LETTER_SPACING_EM * fontSize;
  const fill = t.color || currentTextColor();
  const scale = fontSize / font.unitsPerEm;
  let angleRad = ((Number(t.angle) || 0) * Math.PI) / 180;
  const out = [];

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const glyph = font.charToGlyph(ch);
    const advance = (glyph.advanceWidth || 0) * scale;
    if (ch !== " ") {
      const x = CX + radius * Math.cos(angleRad);
      const y = CY + radius * Math.sin(angleRad);
      // CW tangent matches circlePath(..., clockwise=true).
      // getPath already flips font y-up → SVG y-down (-cmd.y); do not scale(1,-1).
      const rot = (angleRad * 180) / Math.PI + 90;
      const gPath = glyph.getPath(0, 0, fontSize);
      const d = gPath.toPathData(3);
      if (d && d !== "M0 0Z" && d !== "M0,0Z") {
        out.push({
          d,
          fill,
          transform: `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${rot.toFixed(3)})`,
        });
      }
    }
    angleRad += (advance + letterSpacing) / radius;
  }
  return out;
}

function arcFontFaceStyle(fontInfo) {
  const uri = typeof fontInfo === "string" ? fontInfo : fontInfo?.uri;
  const fmt = typeof fontInfo === "string" ? "truetype" : fontInfo?.fmt || "truetype";
  if (!uri) {
    return `@font-face{font-family:'${ARC_FONT_FAMILY}';font-weight:500;font-style:normal;src:url('${ARC_FONT_URL}') format('truetype'),url('${ARC_FONT_URL_FALLBACK}') format('opentype');}`;
  }
  return `@font-face{font-family:'${ARC_FONT_FAMILY}';font-weight:500;font-style:normal;src:url('${uri}') format('${fmt}');}`;
}

function applyArcTextAttrs(textEl, t) {
  const fill = t.color || currentTextColor();
  textEl.setAttribute("fill", fill);
  textEl.style.fill = fill;
  textEl.setAttribute("font-family", ARC_FONT_CSS);
  textEl.setAttribute("font-weight", "500");
  // Unitless font-size = SVG user units (scales with viewBox in standalone files)
  textEl.setAttribute("font-size", String(ARC_TEXT_SIZE));
  textEl.style.fontSize = `${ARC_TEXT_SIZE}px`;
  textEl.style.textTransform = "uppercase";
  textEl.setAttribute("letter-spacing", "0.12em");
}

/** Bind textPath to a path id for both SVG2 and legacy viewers. */
function bindTextPathHref(tp, pathId) {
  const ref = `#${pathId}`;
  tp.setAttribute("href", ref);
  tp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", ref);
  tp.setAttribute("startOffset", "0%");
}

async function warmArcFont() {
  try {
    await ensureArcOpentypeFont();
    if (document.fonts?.load) {
      await document.fonts.load(`500 ${ARC_TEXT_SIZE}px "${ARC_FONT_FAMILY}"`);
    }
  } catch (err) {
    console.warn("YS Compressed load failed", err);
  }
}

const ANIM_SPEEDS = {
  slow: 220,
  norm: 150,
  fast: 90,
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, maxInclusive) {
  return Math.floor(rand(min, maxInclusive + 1));
}

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.w;
    if (r <= 0) return item.color;
  }
  return items[0].color;
}

function depthForId(id) {
  let h = 2166136261;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const v = 0.85 + ((h >>> 0) % 1000) / 1000 * 0.3;
  return Math.round(22 * v * 10) / 10;
}

/**
 * Dense HUD pack without annular overlaps.
 * Prefer voluminous multi-band chunks (angular bulk + radial height).
 * wideAmt («широкие») → radial thickness (multi-band / large rOut−rIn); may exceed 1 (slider to 120).
 * longAmt («длинные») → angular span on chunks; thin 1-band ribbons only at high values (never at 0).
 * sizeAmt («размер» 0–1) → mix of tiny chips (0) vs multi-band giants (1).
 * Accents denser toward tiny. Low randomness → angle grid + diametric guides.
 */
function createRandomComposition(
  wideAmt = widePieces01(),
  randomnessAmt = randomness01(),
  densityAmt = objectCount01(),
  longAmt = longPieces01(),
  sizeAmt = sizeMix01(),
) {
  // wide may be >1 (scrubber max 120); spreadT can exceed 1 via WIDE_STRENGTH (6).
  const wide = Math.max(0, wideAmt);
  const long = clamp01(longAmt);
  /** 0 = max tiny / min giant (old «маленькие»), 1 = max giant (old «большие»). */
  const chunky = clamp01(sizeAmt);
  const tiny = 1 - chunky;
  const spreadT = wide * WIDE_STRENGTH;
  const contrast = clamp01(spreadT);
  const chaos = clamp01(randomnessAmt);
  const density = clamp01(densityAmt);
  const order = 1 - chaos;

  const gridStep =
    order >= 0.75 ? 15 : order >= 0.45 ? 22.5 : order >= 0.2 ? 7.5 : 0;

  const tierCount = randInt(
    Math.round(lerp(7, 10, chaos)),
    Math.round(lerp(9, 12, chaos)),
  );
  const rings = [];
  let r = RANDOM_INNER;
  for (let i = 0; i < tierCount; i++) {
    const gap =
      order > 0.55
        ? lerp(18, 22, Math.random()) + rand(-2, 2) * chaos
        : rand(12, 28);
    r = Math.min(MAX_R - 4, r + gap);
    rings.push(Math.round(r));
  }
  if (rings[rings.length - 1] < MAX_R - 20) rings.push(MAX_R - 8);

  const bands = [];
  let prev = RANDOM_INNER;
  for (const ring of rings) {
    bands.push([prev, ring]);
    prev = ring;
  }

  const guides = [];
  const seedCount = Math.round(lerp(6, 0, chaos));
  if (gridStep > 0 && seedCount > 0) {
    const base = rand(0, gridStep);
    for (let i = 0; i < seedCount; i++) {
      const a = normalizeAngle(base + (i * 180) / seedCount);
      const snapped = snapToGrid(a, gridStep);
      if (!guides.some((g) => angleNear(g, snapped, 0.01))) guides.push(snapped);
    }
  }

  function rememberGuide(a) {
    const n = normalizeAngle(a);
    if (!guides.some((g) => angleNear(g, n, 0.5))) guides.push(n);
  }

  function pickStartAngle() {
    if (guides.length && Math.random() < order * 0.92) {
      const g = guides[randInt(0, guides.length - 1)];
      if (Math.random() < 0.55 + order * 0.35) {
        return Math.random() < 0.5 ? g : normalizeAngle(g + 180);
      }
      if (Math.random() < order * 0.4) {
        return normalizeAngle(g + (Math.random() < 0.5 ? 90 : -90));
      }
    }
    let a0 = rand(0, 360);
    if (gridStep > 0 && Math.random() < order) a0 = snapToGrid(a0, gridStep);
    return normalizeAngle(a0);
  }

  /**
   * Ordinary chips stay short-to-mid. Thick chunks get real angular bulk.
   * Thin ribbon arcs (kind "long") only at high «длинные» — not the default language.
   */
  const MAX_ARC_SPAN = Math.round(lerp(18, 32, long));
  /** Voluminous multi-band blocks: meaningful arc even at long=0; grows with длинные. */
  const MAX_THICK_ARC_SPAN = Math.round(lerp(34, 78, long));
  /** Thin flat ribbons along the circle — high angular, 1-band radial. */
  const MAX_LONG_ARC_SPAN = 86;
  /** Ribbons only when длинные is intentionally high (not mid default). */
  const RIBBON_LONG_GATE = 0.55;

  function snapSpanDegrees(desired, maxSpan = MAX_ARC_SPAN) {
    if (!(gridStep > 0) || order < 0.15) return desired;
    if (Math.random() > order * 0.9) return desired;
    const minSteps = Math.max(1, Math.round(NEEDLE_SPAN_MIN / gridStep));
    const maxSteps = Math.max(minSteps, Math.floor(maxSpan / gridStep));
    const steps = Math.min(
      maxSteps,
      Math.max(minSteps, Math.round(desired / gridStep)),
    );
    return steps * gridStep;
  }

  /** Short/mid chips & needles — never stroke-like ribbons. */
  function pickAngularSpan(fill) {
    const roll = Math.random();
    if (fill === COLORS.blue || fill === COLORS.coral) {
      return rand(NEEDLE_SPAN_MIN, 5);
    }
    if (roll < 0.38) return rand(NEEDLE_SPAN_MIN, NEEDLE_SPAN_MAX);
    if (roll < 0.78) return rand(3, Math.round(lerp(10, 14, long)));
    return rand(8, Math.min(MAX_ARC_SPAN, Math.round(lerp(14, 28, long))));
  }

  /**
   * Chunky annular sectors (широкие): tall radially AND substantial arc.
   * «длинные» lengthens these blocks; at 0 they stay mid-length volumes, not ribbons.
   */
  function pickThickAngularSpan(fill) {
    if (fill === COLORS.blue || fill === COLORS.coral) {
      return rand(NEEDLE_SPAN_MIN, 6);
    }
    // Tiny end: short/mid leftovers; chunky end: full tall wedges.
    const minThick = Math.round(
      lerp(lerp(8, 16, long), lerp(14, 32, long), chunky),
    );
    const maxThickTiny = Math.max(minThick + 2, Math.round(lerp(16, 28, long)));
    const maxThickChunky = Math.max(minThick + 2, MAX_THICK_ARC_SPAN);
    const maxThick = Math.max(
      minThick + 2,
      Math.round(lerp(maxThickTiny, maxThickChunky, chunky)),
    );
    return rand(minThick, maxThick);
  }

  /**
   * Long thin ribbons (только высокий «длинные»).
   * Extremity scales with long slider — at peak, spans approach MAX_LONG_ARC_SPAN.
   */
  function pickLongAngularSpan(fill) {
    if (fill === COLORS.blue || fill === COLORS.coral) {
      return rand(10, Math.round(lerp(16, 30, long)));
    }
    const t = clamp01((long - RIBBON_LONG_GATE) / (1 - RIBBON_LONG_GATE));
    const minLong = Math.round(lerp(28, 42, t));
    const maxLong = Math.round(lerp(40, MAX_LONG_ARC_SPAN, t));
    return rand(minLong, Math.max(minLong + 1, maxLong));
  }

  /**
   * Radial extent by kind (axes must not swap):
   * - thick (широкие) → multi-band / large rOut−rIn
   * - long (длинные) → single thin band (long along arc, not tall)
   * - thin / normal → contrast from широкие only
   */
  function pickRadialExtent(kind) {
    let startBand;
    let spanBands = 1;

    if (kind === "thick") {
      // Leave room to grow outward across multiple bands — prefer voluminous stacks.
      // Tiny end caps to 1–2 bands; chunky end keeps tall multi-band stacks.
      const startRoom = Math.round(lerp(1, 2, chunky));
      const maxStart = Math.max(0, bands.length - startRoom);
      startBand = randInt(0, maxStart);
      const maxExtra = bands.length - startBand - 1;
      if (chunky < 0.35) {
        const twoChance =
          lerp(0.2, 0.45, clamp01(wide)) * lerp(0.35, 1, chunky / 0.35 || 0);
        spanBands = maxExtra >= 1 && Math.random() < twoChance ? 2 : 1;
      } else {
        // Peak stack height scales with WIDE_STRENGTH; bias toward 2–4+ bands.
        const thickPeakExtra = 4.2 * (WIDE_STRENGTH / 2);
        const preferExtra = Math.min(
          maxExtra,
          Math.max(
            1,
            Math.round(
              lerp(
                1,
                lerp(2.0, Math.min(thickPeakExtra, maxExtra), clamp01(wide)),
                clamp01((chunky - 0.35) / 0.65),
              ),
            ),
          ),
        );
        const lo = Math.max(1, preferExtra - 1);
        const hi = Math.max(lo, preferExtra);
        spanBands = 1 + randInt(lo, hi);
        spanBands = Math.min(bands.length - startBand, spanBands);
      }
    } else if (kind === "long") {
      // Long = angular length; keep radially thin (1 band, often shrunk).
      startBand = randInt(0, bands.length - 1);
      spanBands = 1;
    } else {
      startBand = randInt(0, bands.length - 1);
      if (startBand < bands.length - 1) {
        // Prefer occasional 2-band normals when широкие is up (chunkier pack).
        // Tiny end suppresses multi-band normals almost entirely.
        const multiTiny =
          lerp(0.02, 0.1, contrast) * lerp(0.05, 0.35, clamp01(wide));
        const multiChunky =
          kind === "normal"
            ? lerp(0.28, 0.62, contrast) * lerp(0.12, 1, clamp01(wide))
            : lerp(0.02, 0.08, contrast);
        const multiChance = lerp(multiTiny, multiChunky, chunky);
        if (Math.random() < multiChance) {
          const room = bands.length - startBand;
          spanBands =
            chunky > 0.4 &&
            room >= 3 &&
            Math.random() < lerp(0.2, 0.48, contrast) * chunky
              ? randInt(2, Math.min(3, room))
              : 2;
        }
      }
    }

    let rIn = bands[startBand][0];
    let rOut = bands[startBand + spanBands - 1][1];
    const bandThick = rOut - rIn;

    if (kind === "thin") {
      const mid = (rIn + rOut) / 2;
      // Higher spreadT → thinner needles; full effect at slider 100 (wide≈1).
      const frac = lerp(0.38, 0.1, clamp01(spreadT / WIDE_STRENGTH));
      const half = Math.max(MIN_THICKNESS / 2, (bandThick * frac) / 2);
      rIn = mid - half;
      rOut = mid + half;
    } else if (kind === "long") {
      // Relatively thin radially — tapering ribbon along the circle.
      const mid = (rIn + rOut) / 2;
      const frac = lerp(0.36, 0.16, long);
      const half = Math.max(MIN_THICKNESS / 2, (bandThick * frac) / 2);
      rIn = mid - half;
      rOut = mid + half;
    } else if (kind === "normal" && spanBands === 1) {
      const midChance = lerp(0.03, 0.18, chaos) * (1 - contrast * 0.65);
      if (Math.random() < midChance) {
        const mid = (rIn + rOut) / 2;
        const half = rand(
          Math.max(5, bandThick * 0.32),
          Math.max(6, bandThick * 0.48),
        );
        rIn = mid - half;
        rOut = mid + half;
      }
    } else if (kind === "thick" && spanBands >= 2) {
      // Extra fat scales with WIDE_STRENGTH (3× prior peak at strength 6).
      const fatten = lerp(
        0,
        bandThick * 0.1 * (WIDE_STRENGTH / 2),
        clamp01(spreadT / WIDE_STRENGTH),
      );
      rOut = Math.min(MAX_R, rOut + fatten);
    }

    if (rOut - rIn < MIN_THICKNESS) rOut = rIn + MIN_THICKNESS;
    return { rIn, rOut };
  }

  function tryPlaceSegment(fill, kind) {
    const isLong = kind === "long";
    // Hard suppress thin ribbons when длинные is 0 or below the ribbon gate.
    if (isLong && (long <= 0 || long < RIBBON_LONG_GATE)) return false;
    const isThick = kind === "thick";
    const maxSpan = isLong
      ? MAX_LONG_ARC_SPAN
      : isThick
        ? MAX_THICK_ARC_SPAN
        : MAX_ARC_SPAN;
    const minLongKeep = Math.round(lerp(26, 36, long));
    for (let attempt = 0; attempt < 56; attempt++) {
      const { rIn, rOut } = pickRadialExtent(kind);
      let desired = isLong
        ? pickLongAngularSpan(fill)
        : isThick
          ? pickThickAngularSpan(fill)
          : pickAngularSpan(fill);
      desired = Math.max(desired, NEEDLE_SPAN_MIN);
      desired = Math.min(snapSpanDegrees(desired, maxSpan), maxSpan);

      const gap = OVERLAP_GAP;
      let a0 = pickStartAngle();
      const blockers = radialBlockers({ rIn, rOut }, segments);
      for (const b of blockers) {
        if (angleNear(a0, normalizeAngle(b.a1), 0.75)) {
          a0 = normalizeAngle(normalizeAngle(b.a1) + gap);
          break;
        }
      }
      const clear = clockwiseClearance(a0, blockers);
      let span = Math.min(desired, Math.max(0, clear - gap), maxSpan);
      if (gridStep > 0 && order > 0.25 && span >= gridStep) {
        span = Math.floor(span / gridStep) * gridStep;
        span = Math.min(span, Math.max(0, clear - gap), maxSpan);
      }
      if (span < NEEDLE_SPAN_MIN) continue;
      // Long jobs need a real longer arc; bail if clearance collapses them.
      if (isLong && span < minLongKeep) continue;

      const cand = {
        id: uid("seg"),
        rIn,
        rOut,
        a0,
        a1: a0 + span,
        fill,
        depth: 0,
      };
      cand.depth = depthForId(cand.id);
      if (segmentOverlapsAny(cand, segments)) continue;
      segments.push(cand);
      rememberGuide(cand.a0);
      rememberGuide(cand.a1);
      return true;
    }
    return false;
  }

  const segments = [];
  const targetCount = randInt(
    Math.round(lerp(5, 28, density)),
    Math.round(lerp(10, 58, density)),
  );

  // широкие → tall multi-band count; длинные → angular bulk on chunks.
  // Thin ribbon jobs only above RIBBON_LONG_GATE — never when длинные = 0.
  // «размер» (chunky 0–1) scales thick vs thin/chip job counts.
  const thickLo = Math.round(
    lerp(
      lerp(0, Math.max(1, targetCount * 0.06), clamp01(wide)),
      lerp(1, Math.max(3, targetCount * 0.28), clamp01(wide)),
      chunky,
    ),
  );
  const thickHi = Math.round(
    lerp(
      lerp(1, Math.max(2, targetCount * 0.16), clamp01(wide)),
      lerp(3, Math.max(8, targetCount * 0.55), clamp01(wide)),
      chunky,
    ),
  );
  const thickCount =
    wide < 0.03 ? 0 : randInt(thickLo, Math.max(thickLo, thickHi));
  const ribbonT =
    long <= 0
      ? 0
      : long < RIBBON_LONG_GATE
        ? 0
        : clamp01((long - RIBBON_LONG_GATE) / (1 - RIBBON_LONG_GATE));
  const longCount =
    ribbonT <= 0
      ? 0
      : randInt(
          Math.round(lerp(0, Math.max(1, targetCount * 0.06), ribbonT)),
          Math.round(lerp(1, Math.max(3, targetCount * 0.18), ribbonT)),
        );

  const thinTiny = Math.round(
    lerp(3, Math.max(6, targetCount * 0.48), Math.max(contrast, 0.4)),
  );
  const thinChunky =
    contrast < 0.12
      ? 0
      : Math.round(lerp(1, Math.max(2, targetCount * 0.22), contrast));
  const thinCount = Math.round(lerp(thinTiny, thinChunky, chunky));

  const jobs = [];
  for (let i = 0; i < thickCount; i++) jobs.push("thick");
  for (let i = 0; i < longCount; i++) jobs.push("long");
  for (let i = 0; i < thinCount; i++) jobs.push("thin");
  while (jobs.length < targetCount) {
    // Blend tiny-chip vs chunky fill strategies by size scrubber.
    if (Math.random() < tiny) {
      const roll = Math.random();
      if (roll < 0.55) jobs.push("thin");
      else if (wide >= 0.03 && roll < 0.62) jobs.push("thick");
      else jobs.push("normal");
    } else if (wide >= 0.03 && Math.random() < lerp(0.15, 0.45, clamp01(wide))) {
      jobs.push("thick");
    } else {
      jobs.push("normal");
    }
  }

  for (const kind of jobs) {
    tryPlaceSegment(pickWeighted(FILL_WEIGHTS), kind);
  }

  // Tiny blue + coral accent chips: denser toward маленькие, sparse toward большие.
  for (const fill of [COLORS.blue, COLORS.coral]) {
    const nLo = Math.round(lerp(2, 1, chunky));
    const nHi = Math.round(lerp(4, 2, chunky));
    const n = randInt(nLo, Math.max(nLo, nHi));
    for (let i = 0; i < n; i++) {
      tryPlaceSegment(
        fill,
        contrast >= 0.35 || tiny > 0.5 ? "thin" : "normal",
      );
    }
  }

  // Arc texts removed from product — compositions are segments-only.
  return { rings, segments, texts: [] };
}

function snapToGrid(angle, step) {
  if (!(step > 0)) return angle;
  return normalizeAngle(Math.round(angle / step) * step);
}

function angleNear(a, b, eps) {
  return Math.abs(angleDelta(a, b)) <= eps;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** «широкие» amount on 0–1+ scale (120 → 1.2). */
function widePieces01() {
  return clampWidePieces(widePieces) / 100;
}

function randomness01() {
  return clamp01((typeof randomness === "number" ? randomness : DEFAULT_RANDOMNESS) / 100);
}

function objectCount01() {
  return clamp01((typeof objectCount === "number" ? objectCount : DEFAULT_OBJECT_COUNT) / 100);
}

function longPieces01() {
  return clamp01((typeof longPieces === "number" ? longPieces : DEFAULT_LONG_PIECES) / 100);
}

/** «размер» 0–1: 0=маленькие, 1=большие. */
function sizeMix01() {
  return clamp01(clampSizeMix(sizeMix) / 100);
}

/** Accept legacy "small"/"large" or 0–100 number. */
function clampSizeMix(v) {
  if (v === "small") return 0;
  if (v === "large") return 100;
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return DEFAULT_SIZE_MIX;
  return Math.max(0, Math.min(100, n));
}

/**
 * Composition scrubbers are NOT restored from storage — every refresh uses
 * hardcoded startup defaults. Only text color preference is persisted.
 */
function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (
      data.textColorKey === "white" ||
      data.textColorKey === "dark" ||
      data.textColorKey === "accent"
    ) {
      // Map legacy coral accent → dark #302B31
      textColorKey =
        data.textColorKey === "accent" ? "dark" : data.textColorKey;
    }
  } catch {
    /* ignore */
  }
}

function persistPrefs() {
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({
        textColorKey,
      }),
    );
  } catch {
    /* ignore */
  }
}

function publishPrefsToScrubbers() {
  window.__radialPrefs = {
    randomness,
    objectCount,
    widePieces,
    longPieces,
    sizeMix,
  };
  window.dispatchEvent(
    new CustomEvent("radial-prefs-sync", {
      detail: { randomness, objectCount, widePieces, longPieces, sizeMix },
    }),
  );
}

function syncSpreadSlider() {
  publishPrefsToScrubbers();
}

/** Wire Fluid React scrubbers (рандомность / количество / размер / широкие / длинные). */
function wireSizeSpreadSlider() {
  publishPrefsToScrubbers();

  window.addEventListener("radial-scrubber-change", (e) => {
    const { key, value, phase } = e.detail || {};
    if (
      key !== "randomness" &&
      key !== "objectCount" &&
      key !== "widePieces" &&
      key !== "longPieces" &&
      key !== "sizeMix"
    ) {
      return;
    }

    if (phase === "start") {
      if (!spreadHistoryPushed) {
        pushHistory();
        spreadHistoryPushed = true;
      }
      return;
    }

    if (phase === "end") {
      spreadHistoryPushed = false;
      return;
    }

    const v =
      key === "widePieces"
        ? clampWidePieces(value)
        : key === "sizeMix"
          ? clampSizeMix(value)
          : Math.round(Number(value) || 0);

    if (key === "randomness") randomness = v;
    else if (key === "objectCount") objectCount = v;
    else if (key === "widePieces") widePieces = v;
    else if (key === "longPieces") longPieces = v;
    else if (key === "sizeMix") sizeMix = v;

    window.__radialPrefs = {
      randomness,
      objectCount,
      widePieces,
      longPieces,
      sizeMix,
    };
    if (spreadDebounce) clearTimeout(spreadDebounce);
    spreadDebounce = setTimeout(() => {
      spreadDebounce = null;
      applyRandom(false, { fromSlider: true });
    }, SLIDER_REROLL_MS);
  });
}

function syncTextColorUi() {
  document.querySelectorAll("[data-text-color]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.textColor === textColorKey);
  });
  document.documentElement.style.setProperty("--text-arc", currentTextColor());
}

function setGlobalTextColor(key, { pushHist = true } = {}) {
  if (key === "accent") key = "dark";
  if (key !== "white" && key !== "dark") return;
  if (key === textColorKey) {
    applyGlobalTextColorToState();
    syncTextColorUi();
    syncTextColorHint();
    render();
    return;
  }
  if (pushHist) pushHistory();
  textColorKey = key;
  applyGlobalTextColorToState();
  syncTextColorUi();
  syncTextColorHint();
  persistPrefs();
  render();
  persist();
}

/** Concentric orbits text may sit on. */
function orbitRadii() {
  const rings = state?.rings?.length ? state.rings : DEFAULT_RINGS;
  return rings.map(Number).filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
}

function nearestOrbit(radius) {
  const orbits = orbitRadii();
  if (!orbits.length) return clampRadius(radius, MIN_R, MAX_R);
  let best = orbits[0];
  let bestD = Math.abs(radius - best);
  for (const o of orbits) {
    const d = Math.abs(radius - o);
    if (d < bestD) {
      best = o;
      bestD = d;
    }
  }
  return best;
}

/** Snap to nearest ring; used by drag when pointer crosses midpoints. */
function orbitForPointerRadius(pointerR, currentOrbit) {
  const orbits = orbitRadii();
  if (!orbits.length) return nearestOrbit(pointerR);
  const cur = nearestOrbit(currentOrbit ?? pointerR);
  const idx = orbits.indexOf(cur);
  if (idx < 0) return cur;

  // Stay on current until past halfway to neighbor
  if (idx > 0) {
    const mid = (orbits[idx - 1] + cur) / 2;
    if (pointerR < mid) return orbits[idx - 1];
  }
  if (idx < orbits.length - 1) {
    const mid = (cur + orbits[idx + 1]) / 2;
    if (pointerR > mid) return orbits[idx + 1];
  }
  return cur;
}

/** Mid-radii of ring bands (for thickness-preserving segment drag). */
function bandMidRadii() {
  const orbits = orbitRadii();
  const edges = [RANDOM_INNER, ...orbits]
    .map(Number)
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  const uniq = [];
  for (const e of edges) {
    if (!uniq.length || Math.abs(uniq[uniq.length - 1] - e) > 0.5) uniq.push(e);
  }
  const mids = [];
  for (let i = 0; i < uniq.length - 1; i++) {
    mids.push((uniq[i] + uniq[i + 1]) / 2);
  }
  return mids;
}

function nearestBandMid(radius) {
  const mids = bandMidRadii();
  if (!mids.length) return clampRadius(radius, MIN_R, MAX_R);
  let best = mids[0];
  let bestD = Math.abs(radius - best);
  for (const m of mids) {
    const d = Math.abs(radius - m);
    if (d < bestD) {
      best = m;
      bestD = d;
    }
  }
  return best;
}

function bandMidForPointerRadius(pointerR, currentMid) {
  const mids = bandMidRadii();
  if (!mids.length) return nearestBandMid(pointerR);
  const cur = nearestBandMid(currentMid ?? pointerR);
  const idx = mids.findIndex((m) => Math.abs(m - cur) < 0.01);
  if (idx < 0) return cur;
  if (idx > 0) {
    const mid = (mids[idx - 1] + cur) / 2;
    if (pointerR < mid) return mids[idx - 1];
  }
  if (idx < mids.length - 1) {
    const mid = (cur + mids[idx + 1]) / 2;
    if (pointerR > mid) return mids[idx + 1];
  }
  return cur;
}

/* ——— text must sit on information segments ——— */

function segmentMidRadius(seg) {
  return (Number(seg.rIn) + Number(seg.rOut)) / 2;
}

function segmentMidAngle(seg) {
  const { start, span } = arcParams(seg.a0, seg.a1);
  return normalizeAngle(start + span / 2);
}

/** Clamp angle onto segment arc (nearest endpoint if outside). */
function clampAngleToSegment(angle, seg) {
  const { start, span } = arcParams(seg.a0, seg.a1);
  if (span >= 360 || angleInArc(angle, seg.a0, seg.a1)) {
    return normalizeAngle(angle);
  }
  const end = normalizeAngle(start + Math.max(span - 0.05, 0));
  const dStart = Math.abs(angleDelta(angle, start));
  const dEnd = Math.abs(angleDelta(angle, end));
  return dStart <= dEnd ? start : end;
}

function textLiesOnSegment(radius, angle, seg, epsR = 1) {
  const r = Number(radius);
  if (!(r >= seg.rIn - epsR && r <= seg.rOut + epsR)) return false;
  return angleInArc(angle, seg.a0, seg.a1);
}

function findSegmentUnderText(t, segments = state?.segments) {
  const segs = segments || [];
  for (const seg of segs) {
    if (textLiesOnSegment(t.radius, t.angle, seg)) return seg;
  }
  return null;
}

function poseOnSegment(seg, angle) {
  return {
    radius: segmentMidRadius(seg),
    angle: clampAngleToSegment(angle, seg),
    segmentId: seg.id,
  };
}

/** Polar proximity of (radius, angle) to a segment’s mid-band surface. */
function segmentProximityScore(seg, radius, angle) {
  const midR = segmentMidRadius(seg);
  const clampedA = clampAngleToSegment(angle, seg);
  const dR = Math.abs(Number(radius) - midR);
  const dA = Math.abs(angleDelta(angle, clampedA));
  const arcDist = (dA * Math.PI) / 180 * Math.max(midR, 1);
  return dR + arcDist;
}

/**
 * Snap text pose onto the nearest segment mid-band.
 * Optional preferSegId keeps sticky attachment while dragging nearby.
 */
function snapTextToNearestSegment(
  radius,
  angle,
  segments = state?.segments,
  preferSegId = null,
) {
  const segs = segments || [];
  if (!segs.length) return null;
  const r = Number(radius);
  const a = normalizeAngle(Number(angle) || 0);

  if (preferSegId) {
    const pref = segs.find((s) => s.id === preferSegId);
    if (pref) {
      const midR = segmentMidRadius(pref);
      const half = Math.max((pref.rOut - pref.rIn) / 2, 4);
      const clampedA = clampAngleToSegment(a, pref);
      if (
        Math.abs(r - midR) < half + 36 &&
        Math.abs(angleDelta(a, clampedA)) < 20
      ) {
        return poseOnSegment(pref, a);
      }
    }
  }

  let best = null;
  let bestScore = Infinity;
  for (const seg of segs) {
    const score = segmentProximityScore(seg, r, a);
    if (score < bestScore) {
      bestScore = score;
      best = poseOnSegment(seg, a);
    }
  }
  return best;
}

function applyTextPose(t, pose) {
  if (!t || !pose) return false;
  t.radius = pose.radius;
  t.angle = pose.angle;
  if (pose.segmentId) t.segmentId = pose.segmentId;
  return true;
}

/** Snap every text onto a segment mid-band; drop all text if no segments remain. */
function ensureTextsOnSegments() {
  if (!state?.texts) return;
  if (!state.segments?.length) {
    if (state.texts.length) {
      state.texts = [];
      if (selected?.type === "text") selected = null;
    }
    return;
  }
  for (const t of state.texts) {
    const preferId =
      t.segmentId ||
      findSegmentUnderText(t)?.id ||
      null;
    const pose = snapTextToNearestSegment(
      t.radius,
      t.angle,
      state.segments,
      preferId,
    );
    if (pose) applyTextPose(t, pose);
  }
}

function deleteSegmentById(id) {
  state.segments = state.segments.filter((s) => s.id !== id);
  ensureTextsOnSegments();
}

/** Pose a segment by mid-angle + mid-radius, preserving span & thickness. */
function poseFromMid(midA, midR, span, thick) {
  let rIn = midR - thick / 2;
  let rOut = midR + thick / 2;
  if (rIn < MIN_R) {
    rOut += MIN_R - rIn;
    rIn = MIN_R;
  }
  if (rOut > MAX_R) {
    rIn -= rOut - MAX_R;
    rOut = MAX_R;
  }
  if (rOut - rIn < MIN_THICKNESS) rOut = rIn + MIN_THICKNESS;
  const a0 = midA - span / 2;
  return { rIn, rOut, a0, a1: a0 + span };
}

function overlapsWithGap(cand, excludeId) {
  const g = OVERLAP_GAP / 2;
  return segmentOverlapsAny(
    { ...cand, a0: cand.a0 - g, a1: cand.a1 + g },
    state.segments,
    excludeId,
  );
}

/** Move segment to midA/midR; clamp against overlaps using lastGood. */
function resolveSegmentMove(seg, midA, midR, span, thick, lastGood) {
  const tryAt = (a, r) => {
    const pose = poseFromMid(a, r, span, thick);
    if (overlapsWithGap({ ...seg, ...pose }, seg.id)) return null;
    return pose;
  };

  let pose = tryAt(midA, midR);
  if (!pose) {
    const lastMidA = lastGood.a0 + segmentSpan(lastGood) / 2;
    const lastMidR = (lastGood.rIn + lastGood.rOut) / 2;
    let best = null;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 18; i++) {
      const t = (lo + hi) / 2;
      const a = lastMidA + angleDelta(lastMidA, midA) * t;
      const cand = tryAt(a, midR);
      if (cand) {
        best = cand;
        lo = t;
      } else {
        hi = t;
      }
    }
    pose = best;
    if (!pose) {
      lo = 0;
      hi = 1;
      for (let i = 0; i < 18; i++) {
        const t = (lo + hi) / 2;
        const a = lastMidA + angleDelta(lastMidA, midA) * t;
        const cand = tryAt(a, lastMidR);
        if (cand) {
          best = cand;
          lo = t;
        } else {
          hi = t;
        }
      }
      pose = best;
    }
  }
  if (!pose) pose = { ...lastGood };
  seg.a0 = pose.a0;
  seg.a1 = pose.a1;
  seg.rIn = pose.rIn;
  seg.rOut = pose.rOut;
  return pose;
}

const svg = document.getElementById("canvas");
const animRoot = document.getElementById("anim-root");
const layerGrid = document.getElementById("layer-grid");
const layerSegments = document.getElementById("layer-segments");
const layerTexts = document.getElementById("layer-texts");
const layerUi = document.getElementById("layer-ui");
const textDefs = document.getElementById("text-defs");
const view3dEl = document.getElementById("view3d");
const stageEl = document.querySelector(".stage");

const el = {
  propsSegment: document.getElementById("props-segment"),
  propsText: document.getElementById("props-text"),
  fillPalette: document.getElementById("fill-palette"),
  get segRin() {
    return document.getElementById("seg-rin");
  },
  get segRout() {
    return document.getElementById("seg-rout");
  },
  get segA0() {
    return document.getElementById("seg-a0");
  },
  get segA1() {
    return document.getElementById("seg-a1");
  },
  get textContent() {
    return document.getElementById("text-content");
  },
  get textRadius() {
    return document.getElementById("text-radius");
  },
  get textAngle() {
    return document.getElementById("text-angle");
  },
  animBar: document.getElementById("anim-section"),
};

function publishPropsSync(patch) {
  window.dispatchEvent(
    new CustomEvent("radial-props-sync", { detail: patch || {} }),
  );
}

function focusPropField(field) {
  window.dispatchEvent(
    new CustomEvent("radial-props-focus", { detail: { field } }),
  );
}

let state = createPreset();
let history = [];
/** Redo stack (cleared on new edits via pushHistory). */
let future = [];
let tool = "select";
let selected = null;
let interaction = null;
let activeFill = COLORS.white;
/** @type {'flat'|'volume'|'anim'} */
let viewMode = "flat";
let animSnapshot = null;
let animTimer = null;
let animPlaying = false;
let animSpeed = "norm"; // MOTION_DEFAULTS.speed

function createPreset() {
  const rings = [...DEFAULT_RINGS];
  const segs = [
    { rIn: rings[0], rOut: rings[1], a0: 200, a1: 255, fill: COLORS.purple },
    { rIn: rings[0], rOut: rings[1], a0: 255, a1: 320, fill: COLORS.white },
    { rIn: rings[1], rOut: rings[3], a0: 170, a1: 230, fill: COLORS.white },
    { rIn: rings[1], rOut: rings[2], a0: 230, a1: 290, fill: COLORS.grey },
    { rIn: rings[2], rOut: rings[3], a0: 90, a1: 150, fill: COLORS.grey },
    { rIn: rings[2], rOut: rings[3], a0: 150, a1: 195, fill: COLORS.white },
    { rIn: rings[1], rOut: rings[2], a0: -15, a1: 45, fill: COLORS.grey },
    { rIn: rings[2], rOut: rings[3], a0: 40, a1: 75, fill: COLORS.lilac },
    { rIn: rings[2], rOut: rings[3], a0: 300, a1: 335, fill: COLORS.purple },
    { rIn: rings[0], rOut: rings[1], a0: 100, a1: 112, fill: COLORS.blue },
  ].map((s) => {
    const id = uid("seg");
    return { ...s, id, depth: depthForId(id) };
  });

  return {
    rings,
    segments: segs,
    texts: [],
  };
}

function cloneState(s) {
  return structuredClone(s);
}

function pushHistory() {
  history.push(cloneState(state));
  if (history.length > 60) history.shift();
  future = [];
  persist();
}

function undo() {
  if (viewMode !== "flat") return;
  if (!history.length) return;
  future.push(cloneState(state));
  if (future.length > 60) future.shift();
  state = history.pop();
  selected = null;
  render();
  persist();
}

function redo() {
  if (viewMode !== "flat") return;
  if (!future.length) return;
  history.push(cloneState(state));
  if (history.length > 60) history.shift();
  state = future.pop();
  selected = null;
  render();
  persist();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data?.rings || !Array.isArray(data.segments)) return false;
    state = {
      rings: data.rings,
      segments: data.segments.map((s) => ({
        ...s,
        depth: s.depth ?? depthForId(s.id),
      })),
      texts: [],
    };
    return true;
  } catch {
    return false;
  }
}

function getSegment(id) {
  return state.segments.find((s) => s.id === id);
}

function getText(id) {
  return state.texts.find((t) => t.id === id);
}

function svgPoint(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: CX, y: CY };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

function segmentSpan(seg) {
  let span = seg.a1 - seg.a0;
  while (span <= 0) span += 360;
  while (span > 360) span -= 360;
  return span;
}

function segmentOverlapsAny(cand, list = state.segments, excludeId = null) {
  for (const s of list) {
    if (excludeId && s.id === excludeId) continue;
    if (annularSectorsOverlap(cand, s)) return true;
  }
  return false;
}

function radialBlockers(radial, list = state.segments, excludeId = null) {
  return list.filter(
    (s) =>
      (!excludeId || s.id !== excludeId) &&
      radialRangesOverlap(radial.rIn, radial.rOut, s.rIn, s.rOut),
  );
}

/** Shrink draft span against radially overlapping neighbors; keep gesture start. */
function clampDraftNoOverlap(draft, startAngle, goingPositive) {
  const blockers = radialBlockers(draft);
  const gap = OVERLAP_GAP;
  let span = segmentSpan(draft);
  if (goingPositive) {
    const clear = clockwiseClearance(startAngle, blockers);
    span = Math.min(span, Math.max(0, clear - gap));
    return {
      ...draft,
      a0: startAngle,
      a1: startAngle + Math.max(span, 0),
    };
  }
  const clear = counterClockwiseClearance(startAngle, blockers);
  span = Math.min(span, Math.max(0, clear - gap));
  return {
    ...draft,
    a0: startAngle - Math.max(span, 0),
    a1: startAngle,
  };
}

/**
 * After mutating one field on `seg`, binary-search back toward `before`
 * so the segment no longer overlaps others. Keeps as much of the gesture as possible.
 */
function resolveSegmentOverlap(seg, before, field) {
  if (!segmentOverlapsAny(seg, state.segments, seg.id)) return true;

  const lo = before[field];
  const hi = seg[field];
  // Restore first — if even original overlaps (legacy), keep proposed attempt's shrink
  seg[field] = lo;
  if (segmentOverlapsAny(seg, state.segments, seg.id)) {
    // Original already bad; try to keep minimal valid by not moving
    return false;
  }

  let best = lo;
  let a = lo;
  let b = hi;
  for (let i = 0; i < 18; i++) {
    const mid = (a + b) / 2;
    seg[field] = mid;
    if (field === "a0" && segmentSpan(seg) < MIN_SPAN) {
      seg.a0 = seg.a1 - MIN_SPAN;
    }
    if (field === "a1" && segmentSpan(seg) < MIN_SPAN) {
      seg.a1 = seg.a0 + MIN_SPAN;
    }
    if (field === "rIn" && seg.rOut - seg.rIn < MIN_THICKNESS) {
      seg.rIn = seg.rOut - MIN_THICKNESS;
    }
    if (field === "rOut" && seg.rOut - seg.rIn < MIN_THICKNESS) {
      seg.rOut = seg.rIn + MIN_THICKNESS;
    }
    if (!segmentOverlapsAny(seg, state.segments, seg.id)) {
      best = seg[field];
      a = mid;
    } else {
      b = mid;
    }
  }
  seg[field] = best;
  if (field === "a0" && segmentSpan(seg) < MIN_SPAN) seg.a0 = seg.a1 - MIN_SPAN;
  if (field === "a1" && segmentSpan(seg) < MIN_SPAN) seg.a1 = seg.a0 + MIN_SPAN;
  return !segmentOverlapsAny(seg, state.segments, seg.id);
}

/** Apply numeric edit; revert field if impossible. */
function trySetSegmentField(seg, field, value) {
  const before = { a0: seg.a0, a1: seg.a1, rIn: seg.rIn, rOut: seg.rOut };
  seg[field] = value;
  if (field === "rIn") {
    seg.rIn = clampRadius(Math.min(seg.rIn, seg.rOut - MIN_THICKNESS), MIN_R, MAX_R);
  }
  if (field === "rOut") {
    seg.rOut = clampRadius(Math.max(seg.rOut, seg.rIn + MIN_THICKNESS), MIN_R, MAX_R);
  }
  if (field === "a0" && segmentSpan(seg) < MIN_SPAN) seg.a0 = seg.a1 - MIN_SPAN;
  if (field === "a1" && segmentSpan(seg) < MIN_SPAN) seg.a1 = seg.a0 + MIN_SPAN;

  if (!segmentOverlapsAny(seg, state.segments, seg.id)) return true;
  resolveSegmentOverlap(seg, before, field);
  if (segmentOverlapsAny(seg, state.segments, seg.id)) {
    Object.assign(seg, before);
    return false;
  }
  return true;
}

/* ——— modes ——— */

/** Sync Fluid React chrome (mode tabs, fabs, anim, export). */
function publishChromeSync(partial = {}) {
  const detail = {
    viewMode,
    animPlaying,
    animSpeed,
    animStepped: stopMotion,
    animSpin: motionSpin,
    animSize: motionSize,
    animSound: motionSound,
    animParticles: motionParticles,
    animSizeW: sizeWidth,
    animSizeH: sizeHeight,
    animWaves: motionWaves,
    stripsBlocks: stripBlocks,
    stripsWidth: stripWidth,
    ...partial,
  };
  window.__radialChrome = { ...window.__radialChrome, ...detail };
  window.dispatchEvent(new CustomEvent("radial-chrome-sync", { detail }));
}

function setViewMode(mode) {
  if (mode === viewMode) return;

  if (viewMode === "anim") stopAnim(true);

  viewMode = mode;

  const isFlat = mode === "flat";
  const isVolume = mode === "volume";
  const isAnim = mode === "anim";
  const isStrips = mode === "strips";

  // SVGElement has no `.hidden` IDL property — toggle the attribute itself.
  svg.toggleAttribute("hidden", isVolume || isStrips);
  stripsSvg?.toggleAttribute("hidden", !isStrips);
  setView3dVisible(isVolume);
  if (el.animBar) el.animBar.hidden = !isAnim;
  if (stripsSection) stripsSection.hidden = !isStrips;
  // Hidden, not unmounted — scrubber values survive the mode switch.
  const compSection = document.getElementById("composition-section");
  if (compSection) compSection.hidden = isAnim || isStrips;
  stageEl?.classList.toggle("is-anim", isAnim);
  stageEl?.classList.toggle("is-volume", isVolume);
  stageEl?.classList.toggle("is-strips", isStrips);

  if (isStrips) {
    selected = null;
    interaction = null;
    loadStripIcons();
  }

  if (!isFlat) setTool("select");

  if (isVolume) {
    selected = null;
    interaction = null;
    ensureTextsOnSegments();
    ensureSegmentDepths();
    // Flat SVG text layer must not show above the 3D scene
    layerTexts?.replaceChildren();
    textDefs?.replaceChildren();
    layerUi?.replaceChildren();
    syncView3d(state);
    resetView3dCamera();
  }

  if (isAnim) {
    selected = null;
    interaction = null;
    startAnim();
  }

  publishChromeSync({ viewMode: mode });
  render();
}

/* ——— лента: one vertical strip of stacked palette blocks + one white icon ———
 * The strip is a pure function of (stripSeed, stripBlocks, stripWidth), so
 * export matches the screen. Nothing is drawn behind the icon or in the gaps.
 */
const STRIP_H = 1024;
const STRIP_PAD = 48;
const STRIP_WIDTH_MIN = 48;
const STRIP_WIDTH_MAX = 320;
const STRIP_WIDTH_DEFAULT = 128;
/** Icon slot never takes more of the strip than this (then the icon fits by height). */
const STRIP_ICON_MAX_SHARE = 0.45;
const STRIP_MIN_BLOCK = 24;
const STRIP_BLOCKS_MIN = 3;
const STRIP_BLOCKS_MAX = 12;
const STRIP_BLOCKS_DEFAULT = 6;
const STRIP_ACCENTS = [COLORS.blue, COLORS.coral, COLORS.purple, COLORS.lilac];
const STRIP_ICON_FILES = ["plus", "arrow-right", "arrow-down", "play", "triangle"];

let stripSeed = (Math.random() * 2 ** 32) >>> 0;
let stripBlocks = STRIP_BLOCKS_DEFAULT;
let stripWidth = STRIP_WIDTH_DEFAULT;
/** @type {{ name: string, w: number, h: number, paths: { d: string, rule: string }[] }[]} */
let stripIcons = [];
let stripIconsReady = null;
const stripsSvg = document.getElementById("strips-canvas");
const stripsSection = document.getElementById("strips-section");

/** Tight glyph bounds — the files' viewBoxes carry a little padding. */
function glyphBounds(paths, vb) {
  const ns = "http://www.w3.org/2000/svg";
  const probe = document.createElementNS(ns, "svg");
  probe.setAttribute("width", "0");
  probe.setAttribute("height", "0");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  const g = document.createElementNS(ns, "g");
  for (const p of paths) {
    const el = document.createElementNS(ns, "path");
    el.setAttribute("d", p.d);
    g.appendChild(el);
  }
  probe.appendChild(g);
  document.body.appendChild(probe);
  const b = g.getBBox();
  probe.remove();
  if (!(b.width > 0 && b.height > 0)) return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
  return { x: b.x, y: b.y, w: b.width, h: b.height };
}

function loadStripIcons() {
  if (stripIconsReady) return stripIconsReady;
  stripIconsReady = Promise.all(
    STRIP_ICON_FILES.map(async (name) => {
      const res = await fetch(`./icons/${name}.svg`);
      if (!res.ok) throw new Error(`icon ${name}: ${res.status}`);
      const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
      const root = doc.documentElement;
      const vb = (root.getAttribute("viewBox") || "0 0 20 20").split(/[\s,]+/).map(Number);
      const paths = [...root.querySelectorAll("path")].map((p) => ({
        d: p.getAttribute("d") || "",
        rule: p.getAttribute("fill-rule") || "nonzero",
      }));
      return { name, ...glyphBounds(paths, vb), paths };
    }),
  )
    .then((icons) => {
      stripIcons = icons;
      if (viewMode === "strips") renderStrips();
      return icons;
    })
    .catch((err) => {
      console.warn("strip icons failed to load", err);
      return [];
    });
  return stripIconsReady;
}

function pickWeightedRng(items, rng) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = rng() * total;
  for (const item of items) {
    r -= item.w;
    if (r <= 0) return item.color;
  }
  return items[0].color;
}

/** Rotation-aware glyph size (w, h) of a strip icon. */
function stripIconBox(icon, rotate) {
  if (!icon) return { w: 1, h: 1 };
  return rotate % 180 !== 0 ? { w: icon.h, h: icon.w } : { w: icon.w, h: icon.h };
}

/**
 * Blocks top→bottom with gaps. The icon's gap is sized from the glyph itself
 * (strip width × glyph h/w) so the glyph spans the width and meets the blocks
 * above and below; if that gap would be too tall, it is capped and the glyph
 * fits by height instead (still touching both neighbours).
 */
function buildStrip() {
  const seed = stripSeed;
  // Icon picks use their own stream so they survive «количество» / «ширина» changes.
  const iconRng = mulberry32(seed ^ 0x51ed270b);
  const iconPos = iconRng();
  const iconIndex = Math.floor(iconRng() * STRIP_ICON_FILES.length);
  const iconRotate = 90 * Math.floor(iconRng() * 4);
  const rng = mulberry32(seed);
  const n = stripBlocks;
  const iconGapAt = 1 + Math.floor(iconPos * (n - 1));
  // Blocks fill the strip top to bottom; the icon slot is the only opening.
  const top = 0;
  const bottom = 0;

  const blocks = [];
  for (let i = 0; i < n; i++) {
    const thin = i !== iconGapAt && i > 0 && rng() < 0.2;
    blocks.push({
      thin,
      weight: 0.6 + rng() * 1.6,
      h: thin ? 8 + Math.round(rng() * 6) : 0,
      gapBefore: 0,
      fill: "",
    });
  }
  // Blocks touch, so a block never repeats the colour right above it.
  let prev = "";
  blocks.forEach((b, i) => {
    if (i === iconGapAt) prev = "";
    const accents = STRIP_ACCENTS.filter((c) => c !== prev);
    b.fill = b.thin
      ? accents[Math.floor(rng() * accents.length)]
      : pickWeightedRng(FILL_WEIGHTS.filter((f) => f.color !== prev), rng);
    prev = b.fill;
  });

  const thick = blocks.filter((b) => !b.thin).length;
  const fixedNoIcon = top + bottom + blocks.reduce((s, b) => s + b.gapBefore + b.h, 0);
  const box = stripIconBox(stripIcons[iconIndex], iconRotate);
  const iconGap = Math.max(
    8,
    Math.min(stripWidth * (box.h / box.w), STRIP_H * STRIP_ICON_MAX_SHARE, STRIP_H - fixedNoIcon - thick * STRIP_MIN_BLOCK),
  );
  blocks[iconGapAt].gapBefore = iconGap;

  const weights = blocks.reduce((s, b) => s + (b.thin ? 0 : b.weight), 0);
  const free = Math.max(0, STRIP_H - fixedNoIcon - iconGap);
  let y = top;
  const rects = [];
  for (let i = 0; i < n; i++) {
    const b = blocks[i];
    y += b.gapBefore;
    const h = b.thin ? b.h : (free * b.weight) / weights;
    rects.push({ y: Math.round(y * 10) / 10, h: Math.round(h * 10) / 10, fill: b.fill });
    y += h;
  }

  // Slot edges come from the rounded rects so the glyph meets them exactly.
  const above = rects[iconGapAt - 1];
  const slotTop = Math.round((above.y + above.h) * 10) / 10;
  const slotH = Math.round((rects[iconGapAt].y - slotTop) * 10) / 10;
  return {
    rects,
    icon: { index: iconIndex, rotate: iconRotate, slotTop, slotH },
  };
}

function stripGroup(strip) {
  const ns = "http://www.w3.org/2000/svg";
  const g = document.createElementNS(ns, "g");
  g.setAttribute("id", "strip");
  for (const r of strip.rects) {
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("y", r.y);
    rect.setAttribute("width", stripWidth);
    rect.setAttribute("height", r.h);
    rect.setAttribute("fill", r.fill);
    g.appendChild(rect);
  }
  const icon = stripIcons[strip.icon.index];
  if (icon) {
    const box = stripIconBox(icon, strip.icon.rotate);
    const s = Math.min(stripWidth / box.w, strip.icon.slotH / box.h);
    const cy = strip.icon.slotTop + strip.icon.slotH / 2;
    const ig = document.createElementNS(ns, "g");
    ig.setAttribute("class", "strip-icon");
    ig.dataset.icon = icon.name;
    ig.setAttribute(
      "transform",
      `translate(${stripWidth / 2} ${+cy.toFixed(3)}) rotate(${strip.icon.rotate}) scale(${+s.toFixed(5)}) translate(${+(-icon.x - icon.w / 2).toFixed(3)} ${+(-icon.y - icon.h / 2).toFixed(3)})`,
    );
    for (const p of icon.paths) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", p.d);
      path.setAttribute("fill", "#ffffff");
      path.setAttribute("fill-rule", p.rule);
      ig.appendChild(path);
    }
    g.appendChild(ig);
  }
  return g;
}

function renderStrips() {
  if (!stripsSvg) return;
  const strip = stripGroup(buildStrip());
  strip.setAttribute("transform", `translate(${STRIP_PAD} ${STRIP_PAD})`);
  stripsSvg.setAttribute("viewBox", `0 0 ${stripWidth + 2 * STRIP_PAD} ${STRIP_H + 2 * STRIP_PAD}`);
  stripsSvg.replaceChildren(strip);
}

function regenerateStrips() {
  stripSeed = (Math.random() * 2 ** 32) >>> 0;
  renderStrips();
}

function setStripBlocks(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return;
  stripBlocks = Math.max(STRIP_BLOCKS_MIN, Math.min(STRIP_BLOCKS_MAX, v));
  publishChromeSync({ stripsBlocks: stripBlocks });
  renderStrips();
}

function setStripWidth(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return;
  stripWidth = Math.max(STRIP_WIDTH_MIN, Math.min(STRIP_WIDTH_MAX, v));
  publishChromeSync({ stripsWidth: stripWidth });
  renderStrips();
}

/** The single on-screen strip as a standalone SVG (transparent, no backing). */
async function exportStripsSvg() {
  await loadStripIcons();
  const ns = "http://www.w3.org/2000/svg";
  const root = document.createElementNS(ns, "svg");
  root.setAttribute("xmlns", ns);
  root.setAttribute("viewBox", `0 0 ${stripWidth} ${STRIP_H}`);
  root.setAttribute("width", stripWidth);
  root.setAttribute("height", STRIP_H);
  root.appendChild(stripGroup(buildStrip()));
  const source = new XMLSerializer().serializeToString(root);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pin-strip.svg";
  a.click();
  URL.revokeObjectURL(url);
}

if (stageEl) {
  new ResizeObserver(() => {
    if (viewMode === "strips") renderStrips();
  }).observe(stageEl);
}

function ensureSegmentDepths() {
  for (const seg of state.segments) {
    if (typeof seg.depth !== "number") seg.depth = depthForId(seg.id);
  }
}

/* ——— motion (моушн) ———
 * Pure function of motion time τ (in «norm» ms), looping every MOTION_CYCLE:
 * zones are born and die all the time at random spots; each empties as a quick
 * ripple from its center (instant pops, one after another), stays empty a
 * moment, refills with the same ripple and dies. A few anchors never vanish.
 * Optional per-segment orbit and sharp flash pieces run on top.
 * `state` is never mutated.
 */

const MOTION_FRAME = ANIM_SPEEDS.norm;
/** Loop length (motion-ms at norm speed) — also the video export duration. */
const MOTION_CYCLE = 8200;
/** Zone wave: empty hold, size (half-widths); ripple length comes from the take. */
const ZONE_EMPTY_MIN = 500;
const ZONE_EMPTY_MAX = 1300;
const ZONE_HALF_ARC_MIN = 12;
const ZONE_HALF_ARC_MAX = 60;
const ZONE_HALF_RAD_MIN = 25;
const ZONE_HALF_RAD_MAX = 150;
/** Target average share of the composition hidden by zones at any moment. */
const ZONE_HIDDEN_SHARE = 0.38;
/**
 * Neighbor waves: touching pieces (same band within NEIGHBOR_GAP°, or next ring
 * within NEIGHBOR_RING_GAP px with overlapping arcs) empty hop by hop.
 */
const NEIGHBOR_GAP = 12;
const NEIGHBOR_RING_GAP = 24;
const NEIGHBOR_SIZE_MIN = 3;
const NEIGHBOR_SIZE_MAX = 14;
const NEIGHBOR_HOLD_MIN = 400;
const NEIGHBOR_HOLD_MAX = 1000;
/**
 * Sectors (8 × 45°): every step four sectors' pieces pop out (parallel ripples
 * across each) while the other four pop back in; groupings vary between steps.
 */
/** Share of segments that never vanish. */
const WAVE_SURVIVORS = 0.12;
/** Sharp small pops: pool size, max piece size, off-time between pops (motion-ms). */
const POP_MAX_SPAN = 10;
const POP_MAX_THICK = 30;
const POP_GAP_MIN = 600;
const POP_GAP_MAX = 3200;
/** Particle sim step (motion-ms) and speeds: deg/ms along the ring, px/ms radially. */
const PARTICLE_DT = 25;
const PARTICLE_VA_MIN = 0.05;
const PARTICLE_VA_MAX = 0.14;
const PARTICLE_VR_MIN = 0.006;
const PARTICLE_VR_MAX = 0.03;
/** deg per motion-ms (old stop-motion averaged 5.5° per 150ms frame). */
const MOTION_SPIN_RATE = 5.5 / MOTION_FRAME;
/** Video always rotates: exactly one turn per loop so the clip closes seamlessly. */
const EXPORT_SPIN_RATE = 360 / MOTION_CYCLE;
/** Per-segment orbit speed range, × base spin. */
const ORBIT_RATE_MIN = 0.4;
const ORBIT_RATE_MAX = 2;
/** Max Gauss-Seidel passes that keep faster segments from driving through slower ones. */
const ORBIT_SOLVE_PASSES = 120;
const MOTION_SMOOTH_FPS = 30;
/** Size-change breathing: 5 cycles per loop, up to +60%, 3px from neighbors. */
const MOTION_PULSE_PERIOD = MOTION_CYCLE / 5;
const PULSE_GAIN = 0.6;
const PULSE_GAP = 3;
/** Small-piece thresholds [arc, thick, thin thick, thin arc] (px). */
const SMALL_TINY = [12, 14, 5, 24];
/**
 * The motion preset («по соседям»): neighbor-chain waves, 75ms hops.
 * pops / shuffle / free: flash and free-particle pool sizes; particles: tiny
 * pieces fly on their own (share shown = tinyShare); zoneRipple, sectors /
 * steps / ripple / group: timings of the «зоны» / «секторы» wave modes.
 */
const TAKES = [
  {
    id: "t7", name: "по соседям", waves: "neighbors", hop: 75, pops: 23, shuffle: 4,
    particles: true, small: SMALL_TINY, free: 1, tinyShare: 0.5,
    zoneRipple: [300, 600], sectors: 4, steps: 4, ripple: 600, group: "half",
  },
];
let take = TAKES[0];

/** Boot / take-select state of the left motion toggles. */
const MOTION_DEFAULTS = {
  stepped: false, spin: true, size: true, sizeW: false, sizeH: false,
  particles: true, sound: false, speed: "norm",
};

/** true = discrete puppet frames; false = smooth at display framerate. */
let stopMotion = MOTION_DEFAULTS.stepped;
/** false = segments hold their composition angles (waves still run). */
let motionSpin = MOTION_DEFAULTS.spin;
let motionSize = MOTION_DEFAULTS.size;
let motionSound = MOTION_DEFAULTS.sound;
let motionParticles = MOTION_DEFAULTS.particles;
let sizeWidth = MOTION_DEFAULTS.sizeW;
let sizeHeight = MOTION_DEFAULTS.sizeH;
/** Spin rate (deg/ms, 0 = off) of the motionFrame call in progress. */
let frameSpinRate = 0;
/** "quadrants" | "neighbors" | "zones". */
let motionWaves = take.waves;
let motion = null;
let motionTime = 0;
let motionRaf = 0;
let motionLastTs = 0;

const loopT = (tau) => ((tau % MOTION_CYCLE) + MOTION_CYCLE) % MOTION_CYCLE;

function hash01(a, b = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul((b | 0) + 0x9e3779b9, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function hashString01(s) {
  let h = 2166136261;
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return hash01(h >>> 0, 911);
}

/**
 * Transient pool for «перебор»: native random pieces that fit free space only
 * (free relative to `items`, padded by their inward breathing room).
 */
function buildShuffle(items, from, to, gapMin, gapMax, max) {
  const occupied = items.map((it) => ({
    rIn: it.rIn,
    rOut: it.rOut,
    a0: it.a0 - OVERLAP_GAP,
    a1: it.a1 + OVERLAP_GAP,
  }));
  const pool = [];
  for (let attempt = 0; attempt < 6 && pool.length < max; attempt++) {
    const comp = createRandomComposition();
    for (const s of comp.segments) {
      if (pool.length >= max) break;
      const cand = { rIn: s.rIn, rOut: s.rOut, a0: s.a0, a1: s.a0 + segmentSpan(s), fill: s.fill };
      if (segmentOverlapsAny(cand, occupied) || segmentOverlapsAny(cand, pool)) continue;
      pool.push(cand);
    }
  }
  scheduleFlashes(pool, from, to, gapMin, gapMax, 3);
  return pool;
}

/** On/off windows (frame-aligned, 1..maxFrames long) for each flash piece. */
function scheduleFlashes(pool, from, to, gapMin, gapMax, maxFrames) {
  const snap = (v) => Math.round(v / MOTION_FRAME) * MOTION_FRAME;
  for (const p of pool) {
    p.events = [];
    let t = from + snap(rand(0, Math.min(gapMax, to - from)));
    while (t < to) {
      const life = MOTION_FRAME * randInt(1, maxFrames);
      p.events.push([t, Math.min(t + life, to)]);
      t += life + snap(rand(gapMin, gapMax));
    }
  }
}

/** Small native chips (short arcs / thin bands) for sharp 1–2 frame pops everywhere. */
function buildPops() {
  const pool = [];
  for (let attempt = 0; attempt < 14 && pool.length < take.pops; attempt++) {
    const comp = createRandomComposition();
    for (const s of comp.segments) {
      if (pool.length >= take.pops) break;
      const span = segmentSpan(s);
      if (span > POP_MAX_SPAN || s.rOut - s.rIn > POP_MAX_THICK) continue;
      const cand = { rIn: s.rIn, rOut: s.rOut, a0: s.a0, a1: s.a0 + span, fill: s.fill };
      if (segmentOverlapsAny(cand, pool)) continue;
      pool.push(cand);
    }
  }
  scheduleFlashes(pool, 0, MOTION_CYCLE - MOTION_FRAME, POP_GAP_MIN, POP_GAP_MAX, 2);
  return pool;
}

function buildMotion(src) {
  const base = (src?.segments || []).map((s) => ({
    id: s.id,
    rIn: s.rIn,
    rOut: s.rOut,
    a0: s.a0,
    a1: s.a0 + segmentSpan(s),
    fill: s.fill,
  }));
  const n = base.length;
  const items = base.map((s, i) => {
    const span = s.a1 - s.a0;
    return {
      ...s,
      span,
      rate: lerp(ORBIT_RATE_MIN, ORBIT_RATE_MAX, hashString01(s.id ?? i) ** 1.4),
      survivor: false,
      hz: [],
      hn: [],
      idx: i,
    };
  });

  const particlesOn = take.particles && motionParticles;
  for (const it of items) it.small = particlesOn && isSmallPiece(it);
  // A few anchors stay on screen; everyone else is emptied by passing waves.
  const shuffled = items.slice().sort(() => Math.random() - 0.5);
  const nSurv = n ? Math.max(1, Math.round(n * WAVE_SURVIVORS)) : 0;
  shuffled.slice(0, nSurv).forEach((it) => {
    it.survivor = true;
    it.rate = 1;
  });
  const churn = shuffled.slice(nSurv);
  // Random zones until their hidden time adds up to the target share, then
  // spread their births evenly (jittered) over the loop.
  const zones = [];
  let mass = 0;
  const target = ZONE_HIDDEN_SHARE * churn.length * MOTION_CYCLE;
  for (let tries = 0; churn.length && mass < target && tries < 400; tries++) {
    const z = {
      angle: rand(0, 360),
      r: rand(RANDOM_INNER, MAX_R),
      wa: rand(ZONE_HALF_ARC_MIN, ZONE_HALF_ARC_MAX),
      wr: rand(ZONE_HALF_RAD_MIN, ZONE_HALF_RAD_MAX),
      ripple: rand(take.zoneRipple[0], take.zoneRipple[1]),
      empty: rand(ZONE_EMPTY_MIN, ZONE_EMPTY_MAX),
    };
    const members = [];
    for (const it of churn) {
      const da = angleDelta(z.angle, it.a0 + it.span / 2) / z.wa;
      const dr = ((it.rIn + it.rOut) / 2 - z.r) / z.wr;
      const d = Math.hypot(da, dr);
      if (d <= 1) members.push({ it, d });
    }
    if (members.length < 2) continue;
    members.sort((p, q) => p.d - q.d);
    z.members = members;
    zones.push(z);
    mass += members.length * (z.ripple + z.empty);
  }
  const nZones = zones.length;
  zones.forEach((z, k) => {
    const born = ((k + rand(0, 1)) / nZones) * MOTION_CYCLE;
    z.members.forEach(({ it }, rank) => {
      const f = z.members.length > 1 ? rank / (z.members.length - 1) : 0;
      const out = born + f * z.ripple;
      it.hz.push([out % MOTION_CYCLE, z.ripple + z.empty]);
    });
  });
  scheduleNeighborWaves(churn.filter((it) => !it.small));
  for (const it of items) it.quad = buildQuadPlan();

  // Small pieces leave the orbit solver and live as particles instead; only
  // half of them (picked by id) are shown in motion, the rest sit it out.
  const rng = mulberry32(randInt(1, 1e9));
  const tiny = items
    .filter((it) => it.small)
    .sort((a, b) => hashString01(a.id ?? a.idx) - hashString01(b.id ?? b.idx));
  const particles = tiny
    .slice(0, Math.ceil(tiny.length * take.tinyShare))
    .map((it) => makeParticle(it, it, rng));
  if (particlesOn) for (const p of buildFreeParticles(items)) particles.push(makeParticle(p, null, rng));

  // Orbit constraints between radially overlapping neighbors: o_i − o_j ≤ gap.
  const pairs = [];
  for (const a of items) {
    if (a.small) continue;
    for (const b of items) {
      if (b.small || a === b || annularSectorsOverlap(a, b)) continue;
      if (!radialRangesOverlap(a.rIn, a.rOut, b.rIn, b.rOut)) continue;
      const gap = Math.max(0, normalizeAngle(b.a0 - a.a1) - OVERLAP_GAP);
      pairs.push([a.idx, b.idx, gap]);
    }
  }

  const transients = [
    // A few mid-size shuffle pieces, free space only.
    ...buildShuffle(items, 0, MOTION_CYCLE - MOTION_FRAME, 600, 3000, take.shuffle),
    // Many small sharp pops; they may land on not-yet-built / dissolved spots
    // (frame-time check skips any that would cover a visible segment).
    ...buildPops(),
  ];
  return { items, pairs, particles, transients, seed: randInt(1, 1e9) };
}

/**
 * Sector plan: `take.sectors` equal sectors; each step hides one set while the
 * previous set comes back. "single" = one quadrant at a time (opposite ones
 * alternate); "half" = half the sectors, via changing splits into two halves.
 */
function buildQuadPlan() {
  const count = take.sectors;
  const nSteps = take.steps;
  let steps;
  if (take.group === "single") {
    const q0 = randInt(0, 3);
    const q1 = (q0 + (Math.random() < 0.5 ? 1 : 3)) % 4;
    steps = [[q0], [(q0 + 2) % 4], [q1], [(q1 + 2) % 4]];
  } else {
    const splits = (count === 4
      ? [[[0, 2], [1, 3]], [[0, 1], [2, 3]], [[1, 2], [3, 0]]]
      : [
          [[0, 2, 4, 6], [1, 3, 5, 7]],
          [[0, 1, 4, 5], [2, 3, 6, 7]],
          [[1, 2, 5, 6], [3, 4, 7, 0]],
          [[0, 1, 2, 3], [4, 5, 6, 7]],
          [[2, 3, 4, 5], [6, 7, 0, 1]],
        ]
    ).sort(() => Math.random() - 0.5);
    steps = Array.from({ length: nSteps / 2 }, (_, i) => splits[i % splits.length])
      .map((sp) => (Math.random() < 0.5 ? sp : [sp[1], sp[0]]))
      .flat();
  }
  return {
    steps,
    count,
    step: MOTION_CYCLE / steps.length,
    ripple: take.ripple,
    dir: Math.random() < 0.5 ? 1 : -1,
  };
}

function arcsOverlap(a, b) {
  return normalizeAngle(b.a0 - a.a0) < a.span || normalizeAngle(a.a0 - b.a0) < b.span;
}

/** Touching pieces: same band with a small angular gap, or stacked rings with shared arc. */
function areNeighbors(a, b) {
  if (radialRangesOverlap(a.rIn, a.rOut, b.rIn, b.rOut)) {
    const gap = Math.min(normalizeAngle(b.a0 - (a.a0 + a.span)), normalizeAngle(a.a0 - (b.a0 + b.span)));
    return arcsOverlap(a, b) || gap <= NEIGHBOR_GAP;
  }
  const ringGap = Math.min(Math.abs(a.rIn - b.rOut), Math.abs(b.rIn - a.rOut));
  return ringGap <= NEIGHBOR_RING_GAP && arcsOverlap(a, b);
}

/**
 * «по соседям»: waves start at one piece and spread hop by hop through touching
 * pieces (BFS), empty the cluster, hold, then refill along the same path.
 * Births are spread evenly over the loop; seeds prefer pieces visible then.
 */
function scheduleNeighborWaves(list) {
  if (list.length < 2) return;
  const adj = new Map(list.map((it) => [it, []]));
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (!areNeighbors(list[i], list[j])) continue;
      adj.get(list[i]).push(list[j]);
      adj.get(list[j]).push(list[i]);
    }
  }
  const hiddenAt = (it, t) => it.hn.some(([out, len]) => loopT(t - out) < len);
  const cluster = (seed, size, born) => {
    const order = [{ it: seed, depth: 0 }];
    const seen = new Set([seed]);
    for (let q = 0; q < order.length && order.length < size; q++) {
      const { it, depth } = order[q];
      const next = adj.get(it).filter((nb) => !seen.has(nb)).sort(() => Math.random() - 0.5);
      for (const nb of next) {
        if (order.length >= size) break;
        seen.add(nb);
        if (born != null && hiddenAt(nb, born + (depth + 1) * take.hop)) continue;
        order.push({ it: nb, depth: depth + 1 });
      }
    }
    return order;
  };
  const waveSpec = () => ({
    size: randInt(NEIGHBOR_SIZE_MIN, NEIGHBOR_SIZE_MAX),
    hold: rand(NEIGHBOR_HOLD_MIN, NEIGHBOR_HOLD_MAX),
  });
  // Dry run for the average hidden time per wave → how many births fit the target.
  let avgMass = 0;
  for (let k = 0; k < 24; k++) {
    const w = waveSpec();
    const c = cluster(list[randInt(0, list.length - 1)], w.size, null);
    const maxD = c[c.length - 1].depth;
    avgMass += (c.length * (maxD * take.hop + w.hold)) / 24;
  }
  // Overlapping waves skip already-hidden pieces, so aim a bit higher.
  const target = 1.15 * ZONE_HIDDEN_SHARE * list.length * MOTION_CYCLE;
  const nWaves = Math.max(3, Math.round(target / Math.max(1, avgMass)));
  for (let k = 0; k < nWaves; k++) {
    const born = ((k + rand(0.3, 0.7)) / nWaves) * MOTION_CYCLE;
    const w = waveSpec();
    let seed = null;
    for (let tries = 0; tries < 12 && !seed; tries++) {
      const cand = list[randInt(0, list.length - 1)];
      if (!hiddenAt(cand, born)) seed = cand;
    }
    if (!seed) continue;
    const c = cluster(seed, w.size, born);
    const maxD = c[c.length - 1].depth;
    const len = maxD * take.hop + w.hold;
    for (const { it, depth } of c) it.hn.push([(born + depth * take.hop) % MOTION_CYCLE, len]);
  }
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Visibly small: short arc chips / needles, or thin short ribbons. */
function isSmallPiece(s) {
  const span = s.a1 - s.a0;
  const thick = s.rOut - s.rIn;
  const arc = (span * Math.PI * (s.rIn + s.rOut)) / 360;
  const [maxArc, maxThick, thinThick, thinArc] = take.small;
  return (arc <= maxArc && thick <= maxThick) || (thick <= thinThick && arc <= thinArc);
}

/** Extra always-alive small particles from the native chip generator, in free space. */
function buildFreeParticles(items) {
  const pool = [];
  for (let attempt = 0; attempt < 8 && pool.length < take.free; attempt++) {
    for (const s of createRandomComposition().segments) {
      if (pool.length >= take.free) break;
      const cand = { rIn: s.rIn, rOut: s.rOut, a0: s.a0, a1: s.a0 + segmentSpan(s), fill: s.fill };
      if (!isSmallPiece(cand)) continue;
      if (segmentOverlapsAny(cand, items) || segmentOverlapsAny(cand, pool)) continue;
      pool.push(cand);
    }
  }
  return pool;
}

function makeParticle(src, item, rng) {
  const sign = () => (rng() < 0.5 ? -1 : 1);
  return {
    item,
    span: src.a1 - src.a0,
    thick: src.rOut - src.rIn,
    fill: src.fill,
    a0: src.a0,
    rOut: src.rOut,
    rMin: Math.min(RANDOM_INNER, src.rIn),
    va: sign() * lerp(PARTICLE_VA_MIN, PARTICLE_VA_MAX, rng()),
    vr: sign() * lerp(PARTICLE_VR_MIN, PARTICLE_VR_MAX, rng()),
  };
}

/** Hidden windows `[out, len]` of a piece for the current wave mode. */
function hiddenOf(it) {
  switch (motionWaves) {
    case "zones":
      return it.hz;
    default:
      return it.hn;
  }
}

/**
 * «секторы»: when step k fires, the piece is in one of that step's sectors (by
 * its angular midpoint, rotated by the shared spin at that moment) → pop-out time.
 */
function quadOutAt(it, k) {
  const { steps, count, step, ripple } = it.quad;
  const pair = steps[((k % steps.length) + steps.length) % steps.length];
  const T = k * step;
  const spin = frameSpinRate * T;
  const ang = normalizeAngle(it.a0 + it.span / 2 + spin);
  const w = 360 / count;
  const q = Math.floor(ang / w) % count;
  if (!pair.includes(q)) return null;
  let f = (ang - q * w) / w;
  if (it.quad.dir < 0) f = 1 - f;
  return T + f * ripple;
}

function quadHidden(it, tau) {
  const { step } = it.quad;
  const k = Math.floor(tau / step);
  for (const kk of [k, k - 1]) {
    const out = quadOutAt(it, kk);
    if (out != null && tau >= out && tau < out + step) return true;
  }
  return false;
}

function quadAge(it, tau) {
  const { step } = it.quad;
  const k = Math.floor(tau / step);
  for (let kk = k; kk > k - 9; kk--) {
    const out = quadOutAt(it, kk);
    if (out != null && out + step <= tau) return tau - out - step;
  }
  // Not back from a quadrant wave yet: on screen since motion start.
  return Math.max(0, tau);
}

/** Never vanishes in the current mode (anchor, or no wave reaches it). */
function isAnchor(it) {
  if (motionWaves === "quadrants") return !!it.small;
  return it.survivor || !hiddenOf(it).length;
}

/** Wave visibility of a composition piece at τ (instant pop out / in). */
function itemVisibleAt(it, tau) {
  if (isAnchor(it)) return true;
  if (motionWaves === "quadrants") return !quadHidden(it, tau);
  const t = loopT(tau);
  for (const [out, len] of hiddenOf(it)) if (loopT(t - out) < len) return false;
  return true;
}

/** Time since the piece last popped back in (motion-ms, within one loop). */
function itemAge(it, tau) {
  if (motionWaves === "quadrants") return quadAge(it, tau);
  const t = loopT(tau);
  let age = MOTION_CYCLE;
  for (const [out, len] of hiddenOf(it)) age = Math.min(age, loopT(t - out - len));
  return age;
}

/**
 * Visible large composition segments at τ (orbit applied when rotating).
 * Older pieces win. A piece whose spot is taken on refill retries every frame;
 * one squeezed out after it appeared sits out the rest of its turn (no blinking).
 */
function largeSegsAt(m, tau, spinOn) {
  if (!m.blocked || m.blocked.size > 20000) {
    m.blocked = new Set();
    m.appeared = new Set();
  }
  const { blocked, appeared } = m;
  const turn = (it) => `${it.idx}:${Math.round(tau - itemAge(it, tau))}`;
  const vis = m.items.filter(
    (it) => !it.small && itemVisibleAt(it, tau) && !(spinOn && blocked.has(turn(it))),
  );
  // Quadrant halves rotate as one piece: no per-segment orbit there.
  const orbit = spinOn && motionWaves !== "quadrants" ? orbitOffsets(m, tau, vis) : null;
  const age = (it) => (isAnchor(it) ? Infinity : itemAge(it, tau));
  vis.sort((a, b) => age(b) - age(a));
  const out = [];
  const owners = [];
  for (const it of vis) {
    const a0 = it.a0 + (orbit ? orbit[it.idx] : 0);
    const sec = { rIn: it.rIn, rOut: it.rOut, a0, a1: a0 + it.span, fill: it.fill };
    if (orbit && !isAnchor(it)) {
      const key = turn(it);
      if (segmentOverlapsAny(sec, out)) {
        if (appeared.has(key)) blocked.add(key);
        continue;
      }
      appeared.add(key);
    }
    out.push(sec);
    owners.push(it);
  }
  // «изменение размера»: ширина = arcs breathe wider, высота = thicker.
  if (motionSize && sizeWidth) widenArcs(out, owners, tau);
  if (motionSize && sizeHeight) pulseThicker(out, owners, tau);
  return out;
}

/**
 * «высота»: thickness breathes, never below the original. Both edges move out (half
 * the gain each), stopping PULSE_GAP short of whatever sits inside / outside.
 */
function pulseThicker(secs, owners, tau) {
  secs.forEach((sec, i) => {
    const it = owners[i];
    const thick = it.rOut - it.rIn;
    const k = 0.5 - 0.5 * Math.cos(2 * Math.PI * (tau / MOTION_PULSE_PERIOD + hash01(it.idx, 77)));
    let floor = MIN_R;
    let ceil = MAX_R;
    for (let j = 0; j < secs.length; j++) {
      const o = secs[j];
      if (j === i || !secArcsOverlap(sec, o)) continue;
      if (owners[j].rOut <= it.rIn + 0.5) floor = Math.max(floor, o.rOut + PULSE_GAP);
      else if (owners[j].rIn >= it.rOut - 0.5) ceil = Math.min(ceil, o.rIn - PULSE_GAP);
    }
    const grow = (thick * PULSE_GAIN * k) / 2;
    sec.rIn = Math.min(it.rIn, Math.max(floor, it.rIn - grow));
    sec.rOut = Math.max(it.rOut, Math.min(ceil, it.rOut + grow));
  });
}

/**
 * «ширина»: arcs breathe wider, never narrower. Both ends move out (half the
 * gain each), stopping PULSE_GAP px short of same-ring neighbors.
 */
function widenArcs(secs, owners, tau) {
  secs.forEach((sec, i) => {
    const it = owners[i];
    const k = 0.5 - 0.5 * Math.cos(2 * Math.PI * (tau / MOTION_PULSE_PERIOD + hash01(it.idx, 239)));
    const span = sec.a1 - sec.a0;
    const gapDeg = (PULSE_GAP * 180) / (Math.PI * ((sec.rIn + sec.rOut) / 2));
    let before = 360;
    let after = 360;
    for (let j = 0; j < secs.length; j++) {
      const o = secs[j];
      if (j === i || !radialRangesOverlap(sec.rIn, sec.rOut, o.rIn, o.rOut)) continue;
      after = Math.min(after, normalizeAngle(o.a0 - sec.a1));
      before = Math.min(before, normalizeAngle(sec.a0 - o.a1));
    }
    const grow = Math.min((span * PULSE_GAIN * k) / 2, (359 - span) / 2);
    sec.a0 -= Math.max(0, Math.min(grow, before - gapDeg));
    sec.a1 += Math.max(0, Math.min(grow, after - gapDeg));
  });
}

function secArcsOverlap(a, b) {
  return normalizeAngle(b.a0 - a.a0) < a.a1 - a.a0 || normalizeAngle(a.a0 - b.a0) < b.a1 - b.a0;
}

function createParticleSim(m) {
  const cur = m.particles.map((p) => ({ a: p.a0, r: p.rOut, va: p.va, vr: p.vr }));
  return { step: 0, cur, prev: cur.map((s) => ({ ...s })), rng: mulberry32(m.seed) };
}

function particleSector(p, a, r) {
  return { rIn: r - p.thick, rOut: r, a0: a, a1: a + p.span, fill: p.fill };
}

/**
 * One fixed step: particles fly in polar space, bounce off the ring frame,
 * large segments and each other. Hidden particles drift without colliding.
 */
function stepParticles(m, sim, spinOn) {
  const tau = (sim.step + 1) * PARTICLE_DT;
  const large = largeSegsAt(m, tau, spinOn);
  const { cur, rng } = sim;
  sim.prev = cur.map((s) => ({ ...s }));
  const alive = m.particles.map((p) => !p.item || itemVisibleAt(p.item, tau));
  const hits = (i, a, r) => {
    const sec = particleSector(m.particles[i], a, r);
    if (segmentOverlapsAny(sec, large)) return true;
    for (let j = 0; j < cur.length; j++) {
      if (j === i || !alive[j]) continue;
      if (annularSectorsOverlap(sec, particleSector(m.particles[j], cur[j].a, cur[j].r))) return true;
    }
    return false;
  };
  const kick = () => (rng() < 0.5 ? -1 : 1) * lerp(PARTICLE_VR_MIN, PARTICLE_VR_MAX, rng());

  const bump = (p, i, a, r) => {
    if (!segmentOverlapsAny(particleSector(p, a, r), large)) return;
    const pan = Math.cos(((a + p.span / 2 + frameSpinRate * tau) * Math.PI) / 180);
    (sim.hits ||= []).push({ tau, i, pan });
  };

  m.particles.forEach((p, i) => {
    const s = cur[i];
    let nr = s.r + s.vr * PARTICLE_DT;
    if (nr > MAX_R || nr - p.thick < p.rMin) {
      s.vr = -s.vr;
      nr = s.r;
    }
    const na = s.a + s.va * PARTICLE_DT;
    // Hidden, or just popped in on top of something: drift through until clear.
    if (!alive[i] || hits(i, s.a, s.r)) {
      s.a = na;
      s.r = nr;
      return;
    }
    if (!hits(i, na, nr)) {
      s.a = na;
      s.r = nr;
      return;
    }
    bump(p, i, na, nr);
    if (!hits(i, na, s.r)) {
      // Hit from above/below: bounce radially.
      s.a = na;
      s.vr = -s.vr;
    } else if (!hits(i, s.a, nr)) {
      // Hit head-on along the ring: bounce back, sometimes hop to another track.
      s.r = nr;
      s.va = -s.va;
      if (rng() < 0.5) s.vr = kick();
    } else {
      s.va = -s.va;
      s.vr = kick();
    }
  });
  sim.step++;
}

/**
 * Per-segment orbit offsets (deg, relative to the shared spin) at τ, for the
 * visible pieces. Offsets grow with a piece's own age, so they reset only while
 * it is hidden. Faster pieces queue behind slower ones; the younger piece of a
 * conflicting pair yields, survivors never move.
 */
function orbitOffsets(m, tau, vis) {
  const o = new Array(m.items.length).fill(0);
  const age = new Array(m.items.length).fill(-1);
  for (const it of vis) {
    age[it.idx] = isAnchor(it) ? Infinity : itemAge(it, tau);
    if (!isAnchor(it)) o[it.idx] = (it.rate - 1) * MOTION_SPIN_RATE * age[it.idx];
  }
  for (let pass = 0; pass < ORBIT_SOLVE_PASSES; pass++) {
    let worst = 0;
    for (const [i, j, gap] of m.pairs) {
      if (age[i] < 0 || age[j] < 0) continue;
      const v = o[i] - o[j] - gap;
      if (v <= 0) continue;
      worst = Math.max(worst, v);
      const fi = isAnchor(m.items[i]);
      const fj = isAnchor(m.items[j]);
      if (fi && fj) continue;
      if (fi || age[i] > age[j] + 1) o[j] += v;
      else if (fj || age[j] > age[i] + 1) o[i] -= v;
      else {
        o[i] -= v / 2;
        o[j] += v / 2;
      }
    }
    if (worst < 0.02) break;
  }
  return o;
}

/** Composition at motion time τ: `{ spin, segs }` with segs = plain annular sectors. */
function motionFrame(m, tau, stepped, spinOn = true, sim = null, spinRate = MOTION_SPIN_RATE) {
  if (!m) return { spin: 0, segs: [] };
  frameSpinRate = spinOn ? spinRate : 0;
  const t = ((tau % MOTION_CYCLE) + MOTION_CYCLE) % MOTION_CYCLE;
  const k = Math.round(tau / MOTION_FRAME);
  // Absolute τ: survivors stay on screen across waves, so spin must not reset.
  let spin = 0;
  if (spinOn) {
    spin = (spinRate * tau) % 360;
    if (stepped) spin += (hash01(m.seed, k) - 0.5) * 5;
  }
  // Large pieces pop in / out instantly at full shape; only timing is staggered.
  const segs = largeSegsAt(m, tau, spinOn);
  const solid = segs.slice();

  // Small particles: fixed-step seeded sim, interpolated between steps in smooth mode.
  if (sim && m.particles.length) {
    const s = tau / PARTICLE_DT;
    const target = Math.max(0, Math.ceil(s - 1e-9));
    if (target < sim.step) Object.assign(sim, createParticleSim(m));
    while (sim.step < target) stepParticles(m, sim, spinOn);
    const frac = target > 0 ? clamp01(1 - (target - s)) : 1;
    m.particles.forEach((p, i) => {
      if (p.item && !itemVisibleAt(p.item, tau)) return;
      const c = sim.cur[i];
      const q = sim.prev[i];
      let sec = particleSector(p, lerp(q.a, c.a, frac), lerp(q.r, c.r, frac));
      if (segmentOverlapsAny(sec, solid)) sec = particleSector(p, c.a, c.r);
      // Still overlapping (e.g. drifting clear after popping in): stay hidden.
      if (segmentOverlapsAny(sec, solid)) return;
      solid.push(sec);
      segs.push(sec);
    });
  }

  for (const p of m.transients) {
    const ev = p.events.find(([a, b]) => t >= a && t < b);
    if (!ev) continue;
    // Sharp on/off, no easing — in both stop-motion and smooth.
    const cand = { rIn: p.rIn, rOut: p.rOut, a0: p.a0, a1: p.a1, fill: p.fill };
    // Skip flashes that would cover a visible segment or another flash.
    if (segmentOverlapsAny(cand, solid)) continue;
    solid.push(cand);
    segs.push(cand);
  }
  return { spin, segs };
}

function currentMotionFrame() {
  if (motion && !motion.liveSim) motion.liveSim = createParticleSim(motion);
  const frame = motionFrame(motion, motionTime, stopMotion, motionSpin, motion?.liveSim);
  playLiveHits(motion?.liveSim);
  return frame;
}

/* ── Hi-hat on small-vs-large bounces (Web Audio, synthesized) ── */

const HAT_GAP = 0.05;
const HAT_MAX_AHEAD = 0.15;
const HAT_GAIN = 0.065;
const HAT_RATIOS = [2, 3, 4.16, 5.43, 6.79, 8.21];
let audioCtx = null;
let hatNext = 0;
const hatNoise = new WeakMap();

function ensureAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function noiseBuffer(ctx) {
  let buf = hatNoise.get(ctx);
  if (!buf) {
    buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.12), ctx.sampleRate);
    const d = buf.getChannelData(0);
    const rng = mulberry32(9173);
    for (let i = 0; i < d.length; i++) d[i] = rng() * 2 - 1;
    hatNoise.set(ctx, buf);
  }
  return buf;
}

/** Quiet closed hat at `t`; `v` (0..1) varies gain / pitch / decay per hit. */
function scheduleHat(ctx, dest, t, v, pan) {
  const gain = HAT_GAIN * (0.7 + 0.6 * hash01(v * 1e6, 1));
  const pitch = 0.9 + 0.25 * hash01(v * 1e6, 2);
  const decay = 0.03 + 0.03 * hash01(v * 1e6, 3);
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, t);
  env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7500 * pitch;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 10000 * pitch;
  bp.Q.value = 0.8;
  const out = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  if (out.pan) out.pan.value = Math.max(-1, Math.min(1, pan * 0.6));
  bp.connect(hp).connect(env).connect(out).connect(dest);

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx);
  noise.playbackRate.value = pitch;
  noise.connect(bp);
  noise.start(t);
  noise.stop(t + decay + 0.01);
  const metal = ctx.createGain();
  metal.gain.value = 0.35;
  metal.connect(bp);
  for (const r of HAT_RATIOS) {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 40 * r * pitch * 10;
    osc.connect(metal);
    osc.start(t);
    osc.stop(t + decay + 0.01);
  }
}

/** Hit → start time with the shared throttle (≥ HAT_GAP apart, dropped if too late). */
function hatSlot(now, next) {
  const t = Math.max(now, next);
  return t - now > HAT_MAX_AHEAD ? null : t;
}

function hitSeed(h) {
  return hash01(h.i * 7919 + Math.round(h.tau), 211);
}

function playLiveHits(sim) {
  const list = sim?.hits;
  if (!list?.length) return;
  sim.hits = [];
  if (!motionSound || viewMode !== "anim" || !animPlaying || document.hidden) return;
  const ctx = audioCtx;
  if (!ctx || ctx.state !== "running") return;
  for (const h of list) {
    // Sim catching up after a reset / seek: skip stale hits.
    if (h.tau < motionTime - 200) continue;
    const t = hatSlot(ctx.currentTime, hatNext);
    if (t == null) continue;
    hatNext = t + HAT_GAP;
    scheduleHat(ctx, ctx.destination, t, hitSeed(h), h.pan);
  }
}

/** Export: render the hits into a 16-bit stereo WAV of `dur` seconds. */
async function renderHitsWav(hits, dur, timeOf) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC || !hits.length) return null;
  const rate = 44100;
  const ctx = new OAC(2, Math.ceil(dur * rate), rate);
  let next = 0;
  for (const h of hits.slice().sort((a, b) => a.tau - b.tau)) {
    const at = timeOf(h.tau);
    const t = hatSlot(at, next);
    if (t == null || t >= dur - 0.07) continue;
    next = t + HAT_GAP;
    scheduleHat(ctx, ctx.destination, t, hitSeed(h), h.pan);
  }
  const buf = await ctx.startRendering();
  return encodeWav(buf);
}

function encodeWav(buf) {
  const ch = [buf.getChannelData(0), buf.getChannelData(1)];
  const n = buf.length;
  const view = new DataView(new ArrayBuffer(44 + n * 4));
  const str = (o, s) => [...s].forEach((c, k) => view.setUint8(o + k, c.charCodeAt(0)));
  str(0, "RIFF");
  view.setUint32(4, 36 + n * 4, true);
  str(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, buf.sampleRate, true);
  view.setUint32(28, buf.sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++) {
    for (const c of ch) {
      view.setInt16(o, Math.max(-1, Math.min(1, c[i])) * 0x7fff, true);
      o += 2;
    }
  }
  return new Uint8Array(view.buffer);
}

function setMotionSound(on) {
  motionSound = !!on;
  if (motionSound) ensureAudio();
  publishChromeSync({ animSound: motionSound });
}

function renderMotionFrame() {
  if (viewMode !== "anim" || !motion) return;
  renderSegments();
}

function startAnim() {
  stopAnim(false);
  animSnapshot = cloneState(state);
  motion = buildMotion(animSnapshot);
  motionTime = 0;
  animPlaying = true;
  updateAnimButtons();
  scheduleAnim();
}

function stopAnim(restore) {
  if (animTimer) {
    clearInterval(animTimer);
    animTimer = null;
  }
  if (motionRaf) {
    cancelAnimationFrame(motionRaf);
    motionRaf = 0;
  }
  animPlaying = false;
  if (restore) {
    if (animSnapshot) state = cloneState(animSnapshot);
    animSnapshot = null;
    motion = null;
  }
  setAnimSpin(0);
  updateAnimButtons();
}

/** Rebuild motion for a new composition; restart intro unless scrubbing. */
function rebuildMotion(resetTime) {
  animSnapshot = cloneState(state);
  motion = buildMotion(animSnapshot);
  if (resetTime) motionTime = 0;
}

function setStopMotion(on) {
  stopMotion = !!on;
  // ceil: never step back in time (the particle sim only runs forward cheaply).
  if (stopMotion) motionTime = Math.ceil(motionTime / MOTION_FRAME) * MOTION_FRAME;
  publishChromeSync({ animStepped: stopMotion, animSpin: motionSpin });
  if (viewMode === "anim") {
    scheduleAnim();
    renderMotionFrame();
  }
}

function setMotionWaves(mode) {
  motionWaves = ["quadrants", "neighbors", "zones"].includes(mode) ? mode : "neighbors";
  publishChromeSync({ animWaves: motionWaves });
  renderMotionFrame();
}

function setSizeAxis(axis, on) {
  if (axis === "w") sizeWidth = !!on;
  else sizeHeight = !!on;
  publishChromeSync({ animSizeW: sizeWidth, animSizeH: sizeHeight });
  renderMotionFrame();
}

/** «без частичек»: tiny pieces rejoin the composition (no free flight, no hits). */
function setMotionParticles(on) {
  motionParticles = !!on;
  if (viewMode === "anim" && animSnapshot) rebuildMotion(false);
  publishChromeSync({ animParticles: motionParticles });
  renderMotionFrame();
}

function setMotionSize(on) {
  motionSize = !!on;
  publishChromeSync({ animSize: motionSize });
  renderMotionFrame();
}

function setMotionSpin(on) {
  motionSpin = !!on;
  publishChromeSync({ animSpin: motionSpin });
  renderMotionFrame();
}

/** Rotate composition only — background stays fixed. */
function setAnimSpin(deg) {
  if (!animRoot) return;
  if (!deg) {
    animRoot.removeAttribute("transform");
    return;
  }
  animRoot.setAttribute("transform", `rotate(${deg} ${CX} ${CY})`);
}

function scheduleAnim() {
  if (animTimer) {
    clearInterval(animTimer);
    animTimer = null;
  }
  if (motionRaf) {
    cancelAnimationFrame(motionRaf);
    motionRaf = 0;
  }
  const ms = ANIM_SPEEDS[animSpeed] || ANIM_SPEEDS.norm;
  if (stopMotion) {
    // Discrete stepped jumps — no lerp
    animTimer = setInterval(() => {
      if (!animPlaying || viewMode !== "anim") return;
      motionTime += MOTION_FRAME;
      renderMotionFrame();
    }, ms);
    return;
  }
  const rate = MOTION_FRAME / ms;
  motionLastTs = 0;
  const loop = (ts) => {
    motionRaf = requestAnimationFrame(loop);
    if (!animPlaying || viewMode !== "anim") {
      motionLastTs = 0;
      return;
    }
    if (motionLastTs) motionTime += Math.min(100, ts - motionLastTs) * rate;
    motionLastTs = ts;
    renderMotionFrame();
  };
  motionRaf = requestAnimationFrame(loop);
}

function updateAnimButtons() {
  publishChromeSync({ animPlaying, animSpeed, animStepped: stopMotion, animSpin: motionSpin });
}

/* ——— render ——— */

function render() {
  if (viewMode === "strips") {
    renderStrips();
    updatePropsPanel();
    return;
  }
  if (viewMode === "volume") {
    ensureTextsOnSegments();
    ensureSegmentDepths();
    // Keep SVG text layer empty while volume is active (no floating 2D HUD)
    layerTexts?.replaceChildren();
    textDefs?.replaceChildren();
    layerUi?.replaceChildren();
    syncView3d(state);
    updatePropsPanel();
    return;
  }
  renderGrid();
  renderSegments();
  renderTexts();
  renderUi();
  updatePropsPanel();
}

function renderGrid() {
  layerGrid.replaceChildren();
}

function renderSegments() {
  layerSegments.replaceChildren();
  if (viewMode === "anim" && motion) {
    const frame = currentMotionFrame();
    setAnimSpin(frame.spin);
    for (const seg of frame.segs) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "segment");
      path.setAttribute("d", annularSectorPath(CX, CY, seg.rIn, seg.rOut, seg.a0, seg.a1));
      path.setAttribute("fill", seg.fill);
      layerSegments.appendChild(path);
    }
    return;
  }
  for (const seg of state.segments) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "segment");
    if (selected?.type === "segment" && selected.id === seg.id) {
      path.classList.add("is-selected");
    }
    path.setAttribute("d", annularSectorPath(CX, CY, seg.rIn, seg.rOut, seg.a0, seg.a1));
    path.setAttribute("fill", seg.fill);
    path.dataset.id = seg.id;
    layerSegments.appendChild(path);
  }

  if (interaction?.kind === "create-segment" && interaction.draft) {
    const d = interaction.draft;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "draft");
    path.setAttribute("d", annularSectorPath(CX, CY, d.rIn, d.rOut, d.a0, d.a1));
    layerSegments.appendChild(path);
  }
}

function renderTexts() {
  // Arc text feature removed — keep SVG layers empty.
  if (state) state.texts = [];
  if (selected?.type === "text") selected = null;
  layerTexts?.replaceChildren();
  textDefs?.replaceChildren();
}

function renderUi() {
  layerUi.replaceChildren();
  if (viewMode !== "flat" || !selected) return;

  if (selected.type === "segment") {
    const seg = getSegment(selected.id);
    if (!seg) return;
    const midR = (seg.rIn + seg.rOut) / 2;
    const midA = seg.a0 + segmentSpan(seg) / 2;
    const handles = [
      { id: "a0", ...pointOnCircle(CX, CY, midR, seg.a0), cursor: "ew-resize" },
      { id: "a1", ...pointOnCircle(CX, CY, midR, seg.a1), cursor: "ew-resize" },
      { id: "rIn", ...pointOnCircle(CX, CY, seg.rIn, midA), cursor: "ns-resize" },
      { id: "rOut", ...pointOnCircle(CX, CY, seg.rOut, midA), cursor: "ns-resize" },
    ];
    for (const h of handles) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("class", "handle");
      c.setAttribute("cx", h.x);
      c.setAttribute("cy", h.y);
      c.setAttribute("r", 6);
      c.dataset.handle = h.id;
      c.style.cursor = h.cursor;
      layerUi.appendChild(c);
    }
    return;
  }
}

function updatePropsPanel() {
  const editing = viewMode === "flat";
  if (selected?.type === "text") selected = null;
  const isSeg = editing && selected?.type === "segment";
  // Right column exists only while a segment is selected in «Плоский».
  document.getElementById("app")?.classList.toggle("has-props", isSeg);
  el.propsSegment.hidden = !isSeg;
  if (!isSeg) return;

  if (isSeg) {
    const seg = getSegment(selected.id);
    if (!seg) return;
    publishPropsSync({
      segRin: String(Math.round(seg.rIn)),
      segRout: String(Math.round(seg.rOut)),
      segA0: String(Math.round(normalizeAngle(seg.a0) * 10) / 10),
      segA1: String(Math.round(normalizeAngle(seg.a1) * 10) / 10),
    });
    highlightSwatch(seg.fill);
  }
}

function highlightSwatch(fill) {
  for (const btn of el.fillPalette.querySelectorAll(".swatch")) {
    btn.classList.toggle("is-active", colorsClose(btn.dataset.color, fill));
  }
}

function colorsClose(a, b) {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function buildPalette() {
  el.fillPalette.replaceChildren();
  for (const f of FILLS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.setProperty("--c", f.color);
    btn.dataset.color = f.color;
    btn.title = f.label;
    btn.addEventListener("click", () => {
      if (viewMode !== "flat") return;
      activeFill = f.color;
      if (selected?.type === "segment") {
        const seg = getSegment(selected.id);
        if (!seg) return;
        pushHistory();
        seg.fill = f.color;
        render();
        persist();
      } else {
        highlightSwatch(f.color);
      }
    });
    el.fillPalette.appendChild(btn);
  }
}

/* ——— tools ——— */

function setTool(next) {
  if (viewMode !== "flat" && next !== "select") return;
  // Text tool removed from product
  if (next === "text") {
    tool = "select";
    document.querySelectorAll("[data-tool]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tool === tool);
    });
    return;
  }
  if (next === "segment") {
    addSegmentObject();
    return;
  }
  tool = next;
  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tool === tool);
  });
}

function finishInstantAdd(kind, id) {
  selected = { type: kind, id };
  tool = "select";
  interaction = null;
  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tool === "select");
  });
  render();
  persist();
}

/** Instantly place a new annular segment (no canvas drag). Selected with handles. */
function addSegmentObject() {
  if (viewMode !== "flat") return;
  pushHistory();

  const rings = state.rings?.length
    ? state.rings
    : [146, 224, 302, 380];
  const bandIdx =
    rings.length >= 3 ? Math.floor(rings.length / 2) - 1 : 0;
  const rIn = bandIdx > 0 ? rings[bandIdx] : Math.max(MIN_R, (rings[0] || 146) * 0.55);
  const rOut = rings[Math.min(bandIdx + 1, rings.length - 1)] || rIn + 40;
  const desired = 28;
  const gap = OVERLAP_GAP;
  const blockers = radialBlockers({ rIn, rOut });

  let a0 = -20;
  let span = desired;
  let placed = false;
  const tries = [ -20, 40, 100, 160, 220, 280, 0, 90, 180, 270 ];
  for (const start of tries) {
    let startA = normalizeAngle(start);
    for (const b of blockers) {
      if (angleNear(startA, normalizeAngle(b.a1), 0.75)) {
        startA = normalizeAngle(normalizeAngle(b.a1) + gap);
        break;
      }
    }
    const clear = clockwiseClearance(startA, blockers);
    const s = Math.min(desired, Math.max(0, clear - gap));
    if (s < MIN_SPAN) continue;
    const cand = { rIn, rOut, a0: startA, a1: startA + s, fill: COLORS.grey };
    if (segmentOverlapsAny(cand)) continue;
    a0 = startA;
    span = s;
    placed = true;
    break;
  }
  if (!placed) {
    // Fallback: small mid-ring wedge (may sit in a sparse region)
    a0 = -20;
    span = MIN_SPAN + 10;
  }

  const id = uid("seg");
  const seg = {
    id,
    rIn,
    rOut: Math.max(rOut, rIn + MIN_THICKNESS),
    a0,
    a1: a0 + span,
    fill: COLORS.grey,
    depth: depthForId(id),
  };
  state.segments.push(seg);
  finishInstantAdd("segment", id);
}

/** Arc text feature removed — no-op. */
function addTextObject() {
  return;
}

function syncTextColorHint() {
  /* text color UI removed */
}

function exportSvg() {
  if (viewMode === "strips") {
    void exportStripsSvg();
    return;
  }
  // Outline text via opentype; fall back to empty paths if font fails.
  void ensureArcOpentypeFont()
    .catch((err) => {
      console.warn("opentype font load failed", err);
      return null;
    })
    .then(() => exportSvgSync());
}

/**
 * Build a clean standalone SVG (no UI chrome).
 * Arc labels are glyph outlines (<path>), not <text>/<textPath> — paste-ready in Figma/AI.
 * @param {{ includeBackground?: boolean }} [opts]
 */
function buildExportSvg(src, font, { includeBackground = true } = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const root = document.createElementNS(ns, "svg");
  root.setAttribute("xmlns", ns);
  root.setAttribute("viewBox", svg.getAttribute("viewBox") || "0 0 800 800");
  root.setAttribute("width", "800");
  root.setAttribute("height", "800");

  if (includeBackground) {
    const bgFill =
      document.getElementById("bg")?.getAttribute("fill") || "#dbdfe7";
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("width", "800");
    rect.setAttribute("height", "800");
    rect.setAttribute("fill", bgFill);
    root.appendChild(rect);
  }

  const texts = [];
  const segments = Array.isArray(src?.segments) ? src.segments : [];

  const gSeg = document.createElementNS(ns, "g");
  gSeg.setAttribute("id", "layer-segments");
  for (const seg of segments) {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", annularSectorPath(CX, CY, seg.rIn, seg.rOut, seg.a0, seg.a1));
    path.setAttribute("fill", seg.fill);
    gSeg.appendChild(path);
  }
  root.appendChild(gSeg);

  // Empty text layer kept for schema compatibility — no arc labels.
  const gTxt = document.createElementNS(ns, "g");
  gTxt.setAttribute("id", "layer-texts");
  root.appendChild(gTxt);

  return root;
}

/** Serialize export SVG string (same as D-key download payload). */
function serializeExportSvg(src, { includeBackground = true } = {}) {
  const root = buildExportSvg(src, arcOpentypeFont, { includeBackground });
  let source = new XMLSerializer().serializeToString(root);
  if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
    source = source.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return source;
}

function exportSvgSync() {
  const src = viewMode === "anim" && animSnapshot ? animSnapshot : state;
  const source = serializeExportSvg(src, { includeBackground: true });

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pin-radial.svg";
  a.click();
  URL.revokeObjectURL(url);

  if (viewMode === "volume") {
    exportView3dPng("pin-radial-3d.png");
  }
}

/**
 * Copy flat composition SVG to clipboard without page background (transparent).
 * Reuses D-key export geometry; does not mutate state.
 * @returns {Promise<boolean>}
 */
async function copyFlatSvgTransparent() {
  try {
    await ensureArcOpentypeFont().catch((err) => {
      console.warn("opentype font load failed", err);
      return null;
    });
    const source = serializeExportSvg(state, { includeBackground: false });
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      console.error("Clipboard SVG write not supported");
      return false;
    }
    const svgBlob = new Blob([source], { type: "image/svg+xml" });
    const plainBlob = new Blob([source], { type: "text/plain" });
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/svg+xml": svgBlob,
        "text/plain": plainBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error("Copy flat SVG failed", err);
    return false;
  }
}

/* ——— random + size spread ——— */

let spreadDebounce = null;
let spreadHistoryPushed = false;
let videoExporting = false;

function applyRandom(pushHist, { fromSlider = false } = {}) {
  if (pushHist) pushHistory();

  state = createRandomComposition(
    widePieces01(),
    randomness01(),
    objectCount01(),
    longPieces01(),
    sizeMix01(),
  );
  selected = null;

  if (viewMode === "anim") rebuildMotion(!fromSlider);
  if (viewMode === "volume") ensureSegmentDepths();
  if (!fromSlider) setTool("select");
  render();
  persist();
}

const VIDEO_LOGICAL = 800;
const VIDEO_EXPORT_SIZE = 1080;
const VIDEO_BG = "#DBDFE7";

/**
 * Lazy-loaded ffmpeg.wasm (single-thread — no COOP/COEP).
 * Root cause of prior breakage: classWorkerURL + toBlobURL(worker.js) — worker ESM
 * has relative imports (./const.js) that fail under blob: URLs.
 */
let ffmpegBundle = null;
let ffmpegLoadPromise = null;

const FFMPEG_CDN_BASES = [
  {
    label: "jsdelivr",
    ffmpeg: "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm",
    util: "https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm",
    core: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm",
  },
  {
    label: "unpkg",
    ffmpeg: "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm",
    util: "https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm",
    core: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm",
  },
];

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new Error(
              `${label}: превышено время ожидания (${Math.round(ms / 1000)}с)`
            )
          ),
        ms
      );
    }),
  ]);
}

function u8ForBlob(data) {
  if (data instanceof Uint8Array) return new Uint8Array(data);
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  return new Uint8Array(data?.buffer ?? data);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function setExportError(message) {
  const el = document.getElementById("export-video-error");
  if (!el) return;
  if (!message) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  el.hidden = false;
  el.textContent = message;
}

async function loadFfmpegVendor(onStatus) {
  onStatus?.("Загрузка ffmpeg…");
  const [{ FFmpeg }, { fetchFile }] = await withTimeout(
    Promise.all([
      import("./vendor/ffmpeg/ffmpeg/index.js"),
      import("./vendor/ffmpeg/util/index.js"),
    ]),
    45000,
    "Модули ffmpeg"
  );

  const ffmpeg = new FFmpeg();
  const coreURL = new URL(
    "./vendor/ffmpeg/core/ffmpeg-core.js",
    import.meta.url
  ).href;
  const wasmURL = new URL(
    "./vendor/ffmpeg/core/ffmpeg-core.wasm",
    import.meta.url
  ).href;

  onStatus?.("Инициализация ffmpeg…");
  // Do NOT pass classWorkerURL as a blob — worker.js relative imports break.
  await withTimeout(ffmpeg.load({ coreURL, wasmURL }), 180000, "Инициализация ffmpeg");
  return { ffmpeg, fetchFile, ready: true, source: "vendor" };
}

async function loadFfmpegCdn(onStatus, base) {
  onStatus?.(`Загрузка ffmpeg (${base.label})…`);
  const [{ FFmpeg }, { fetchFile, toBlobURL }] = await withTimeout(
    Promise.all([
      import(`${base.ffmpeg}/index.js`),
      import(`${base.util}/index.js`),
    ]),
    45000,
    `CDN ${base.label}`
  );

  const ffmpeg = new FFmpeg();
  // toBlobURL for core/wasm only. Worker must stay on CDN via import.meta.url
  // (never blob classWorkerURL — relative ESM imports fail).
  const coreURL = await toBlobURL(
    `${base.core}/ffmpeg-core.js`,
    "text/javascript"
  );
  const wasmURL = await toBlobURL(
    `${base.core}/ffmpeg-core.wasm`,
    "application/wasm"
  );

  onStatus?.(`Инициализация ffmpeg (${base.label})…`);
  await withTimeout(ffmpeg.load({ coreURL, wasmURL }), 180000, "Инициализация ffmpeg");
  return { ffmpeg, fetchFile, ready: true, source: base.label };
}

async function loadFfmpeg(onStatus) {
  if (ffmpegBundle?.ready) return ffmpegBundle;
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const errors = [];
    try {
      try {
        ffmpegBundle = await loadFfmpegVendor(onStatus);
        return ffmpegBundle;
      } catch (err) {
        console.warn("[ffmpeg] vendor failed", err);
        errors.push(`vendor: ${err?.message || err}`);
      }

      for (const base of FFMPEG_CDN_BASES) {
        try {
          ffmpegBundle = await loadFfmpegCdn(onStatus, base);
          return ffmpegBundle;
        } catch (err) {
          console.warn(`[ffmpeg] ${base.label} failed`, err);
          errors.push(`${base.label}: ${err?.message || err}`);
        }
      }

      throw new Error(
        `ffmpeg не загрузился.\n${errors.join("\n") || "нет деталей"}`
      );
    } catch (err) {
      ffmpegBundle = null;
      throw err;
    } finally {
      ffmpegLoadPromise = null;
    }
  })();

  return ffmpegLoadPromise;
}

function canvasToJpegBlob(canvas, quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality
    );
  });
}

/** WebM fallback via MediaRecorder when MP4/ffmpeg is unavailable. */
async function encodeWebmFromJpegFrames(frameBlobs, fps, size, onProgress) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("MediaRecorder недоступен в этом браузере");
  }

  const mimeCandidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  const mime =
    mimeCandidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
  if (!mime) throw new Error("Браузер не умеет писать WebM");

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0];
  const rec = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks = [];
  rec.ondataavailable = (e) => {
    if (e.data?.size) chunks.push(e.data);
  };
  const stopped = new Promise((resolve, reject) => {
    rec.onstop = resolve;
    rec.onerror = () => reject(new Error("MediaRecorder error"));
  });
  rec.start(100);

  const frameDelay = Math.max(16, Math.round(1000 / fps));
  for (let i = 0; i < frameBlobs.length; i++) {
    const bmp = await createImageBitmap(frameBlobs[i]);
    ctx.fillStyle = VIDEO_BG;
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(bmp, 0, 0, size, size);
    bmp.close();
    if (typeof track.requestFrame === "function") track.requestFrame();
    onProgress?.((i + 1) / frameBlobs.length);
    await new Promise((r) => setTimeout(r, frameDelay));
  }

  // Hold last frame briefly so the container finalizes.
  await new Promise((r) => setTimeout(r, frameDelay * 2));
  rec.stop();
  await stopped;
  stream.getTracks().forEach((t) => t.stop());

  if (!chunks.length) throw new Error("WebM: пустой результат");
  return new Blob(chunks, { type: "video/webm" });
}

/** Motion MP4 1080×1080: one full wave (build-up → hold → flicker-out → lull), fixed #DBDFE7 bg. */
async function exportVideo() {
  if (videoExporting) return;

  const frameMs = ANIM_SPEEDS[animSpeed] || ANIM_SPEEDS.norm;
  const stepped = stopMotion;
  const fps = stepped ? 1000 / frameMs : MOTION_SMOOTH_FPS;
  const nominalStep = stepped
    ? MOTION_FRAME
    : (1000 / MOTION_SMOOTH_FPS) * (MOTION_FRAME / frameMs);
  // Whole frames per loop, so frame N lands exactly on frame 0 (waves and spin).
  const frameCount = Math.round(MOTION_CYCLE / nominalStep);
  const tauStep = MOTION_CYCLE / frameCount;
  const logical = VIDEO_LOGICAL;
  const size = VIDEO_EXPORT_SIZE;
  const bg = VIDEO_BG;

  videoExporting = true;
  setExportError("");
  publishChromeSync({
    exportVideoBusy: true,
      exportVideoLabel: "кадры… 0%",
  });

  try {
    await ensureArcFontDataUri();
  } catch {
    /* fall back to relative @font-face URL */
  }

  const wasAnim = viewMode === "anim";
  const wasPlaying = animPlaying;
  if (wasAnim && animPlaying) {
    animPlaying = false;
    updateAnimButtons();
  }

  const srcState = cloneState(wasAnim && animSnapshot ? animSnapshot : state);
  const exportMotion = wasAnim && motion ? motion : buildMotion(srcState);
  const exportSim = createParticleSim(exportMotion);
  exportSim.hits = [];
  const withSound = motionSound;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const serializer = new XMLSerializer();
  const frameBlobs = [];

  function buildFrameSvg(segs, spinDeg) {
    const ns = "http://www.w3.org/2000/svg";
    const root = document.createElementNS(ns, "svg");
    root.setAttribute("xmlns", ns);
    root.setAttribute("viewBox", `0 0 ${logical} ${logical}`);
    root.setAttribute("width", String(size));
    root.setAttribute("height", String(size));

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("width", String(logical));
    rect.setAttribute("height", String(logical));
    rect.setAttribute("fill", bg);
    root.appendChild(rect);

    const g = document.createElementNS(ns, "g");
    if (spinDeg) g.setAttribute("transform", `rotate(${spinDeg} ${CX} ${CY})`);

    for (const seg of segs) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", annularSectorPath(CX, CY, seg.rIn, seg.rOut, seg.a0, seg.a1));
      path.setAttribute("fill", seg.fill);
      g.appendChild(path);
    }

    root.appendChild(g);
    return root;
  }

  const setBtn = (text) => {
    publishChromeSync({
      exportVideoBusy: true,
      exportVideoLabel: text,
    });
  };

  try {
    for (let i = 0; i < frameCount; i++) {
      // Export always rotates, whatever the «вращение» toggle says.
      const frame = motionFrame(exportMotion, i * tauStep, stepped, true, exportSim, EXPORT_SPIN_RATE);
      const svgEl = buildFrameSvg(frame.segs, frame.spin);
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      frameBlobs.push(await canvasToJpegBlob(canvas));
      setBtn(`кадры… ${Math.round(((i + 1) / frameCount) * 100)}%`);
    }

    let encoded = false;
    let ffmpegErr = null;

    try {
      const { ffmpeg, fetchFile } = await loadFfmpeg(setBtn);

      const onProgress = ({ progress }) => {
        const pct = Math.min(99, Math.round((progress || 0) * 100));
        setBtn(`кодирование mp4… ${pct}%`);
      };
      ffmpeg.on("progress", onProgress);

      try {
        setBtn("запись кадров…");
        for (let i = 0; i < frameBlobs.length; i++) {
          const name = `frame_${String(i).padStart(4, "0")}.jpg`;
          await ffmpeg.writeFile(name, await fetchFile(frameBlobs[i]));
        }

        // Hi-hat track: same seeded bounces, shown frame-by-frame in stop-motion.
        let audioArgs = [];
        if (withSound) {
          setBtn("звук…");
          const dur = frameCount / fps;
          const toSec = (tau) => ((stepped ? Math.ceil(tau / tauStep - 1e-9) * tauStep : tau) * frameMs) / MOTION_FRAME / 1000;
          const wav = await renderHitsWav(exportSim.hits, dur, toSec);
          if (wav) {
            await ffmpeg.writeFile("audio.wav", wav);
            audioArgs = ["-i", "audio.wav", "-c:a", "aac", "-b:a", "160k", "-shortest"];
          }
        }

        setBtn("кодирование mp4… 0%");
        await ffmpeg.exec([
          "-framerate",
          String(fps),
          "-i",
          "frame_%04d.jpg",
          ...audioArgs,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "out.mp4",
        ]);

        const data = await ffmpeg.readFile("out.mp4");
        downloadBlob(
          new Blob([u8ForBlob(data)], { type: "video/mp4" }),
          "pin-radial-1080.mp4"
        );
        encoded = true;

        for (let i = 0; i < frameBlobs.length; i++) {
          try {
            await ffmpeg.deleteFile(`frame_${String(i).padStart(4, "0")}.jpg`);
          } catch {
            /* ignore */
          }
        }
        for (const f of ["out.mp4", "audio.wav"]) {
          try {
            await ffmpeg.deleteFile(f);
          } catch {
            /* ignore */
          }
        }
      } finally {
        ffmpeg.off("progress", onProgress);
      }
    } catch (err) {
      ffmpegErr = err;
      console.warn("[export] MP4 failed, trying WebM", err);
    }

    if (!encoded) {
      setBtn("кодирование webm… 0%");
      try {
        const webm = await encodeWebmFromJpegFrames(
          frameBlobs,
          fps,
          size,
          (p) => setBtn(`кодирование webm… ${Math.round(p * 100)}%`)
        );
        downloadBlob(webm, "pin-radial-1080.webm");
        encoded = true;
        if (ffmpegErr) {
          setExportError(
            `MP4 недоступен (${ffmpegErr.message || "ffmpeg"}). Скачан WebM.`
          );
        }
      } catch (webmErr) {
        console.error(webmErr);
        const parts = [
          "Не удалось экспортировать видео.",
          ffmpegErr ? `MP4: ${ffmpegErr.message || ffmpegErr}` : null,
          `WebM: ${webmErr?.message || webmErr}`,
        ].filter(Boolean);
        setExportError(parts.join(" "));
        alert(parts.join("\n\n"));
      }
    }
  } catch (err) {
    console.error(err);
    const detail = err?.message ? String(err.message) : String(err);
    setExportError(`Ошибка экспорта: ${detail}`);
    alert(`Не удалось экспортировать видео.\n\n${detail}`);
  } finally {
    videoExporting = false;
    publishChromeSync({
      exportVideoBusy: false,
      exportVideoLabel: "экспорт видео",
    });
    if (wasAnim && wasPlaying) {
      animPlaying = true;
      updateAnimButtons();
      scheduleAnim();
    }
  }
}

function wireUi() {
  const accToggle = document.getElementById("anim-accordion-toggle");
  const accBody = document.getElementById("anim-accordion-body");
  accToggle?.addEventListener("click", () => {
    const open = accToggle.getAttribute("aria-expanded") !== "true";
    accToggle.setAttribute("aria-expanded", String(open));
    accBody.classList.toggle("is-open", open);
    accBody.inert = !open;
  });
  // Autoplay policy: the AudioContext may only start from a user gesture.
  const unlockAudio = () => {
    if (motionSound) ensureAudio();
  };
  window.addEventListener("pointerdown", unlockAudio, true);
  window.addEventListener("keydown", unlockAudio, true);
  window.addEventListener("radial-chrome-action", (e) => {
    const { action, mode, speed, stepped, spin, size, sound, particles, axis, on, waves, count } = e.detail || {};
    switch (action) {
      case "mode":
        if (mode) setViewMode(mode);
        break;
      case "random":
        if (viewMode === "strips") regenerateStrips();
        else applyRandom(true);
        break;
      case "strips-blocks":
        setStripBlocks(count);
        break;
      case "strips-width":
        setStripWidth(count);
        break;
      case "export-svg":
        exportSvg();
        break;
      case "export-fbx":
        if (viewMode === "volume") exportView3dFbx("pin-radial.fbx");
        break;
      case "export-video":
        exportVideo();
        break;
      case "add-text":
        break;
      case "add-segment":
        if (viewMode === "flat") addSegmentObject();
        break;
      case "delete-seg":
        if (selected?.type !== "segment") return;
        pushHistory();
        deleteSegmentById(selected.id);
        selected = null;
        render();
        persist();
        break;
      case "delete-text":
        break;
      case "anim-play":
        if (viewMode !== "anim") return;
        animPlaying = !animPlaying;
        updateAnimButtons();
        break;
      case "anim-speed":
        if (!speed) return;
        animSpeed = speed;
        updateAnimButtons();
        if (viewMode === "anim") scheduleAnim();
        break;
      case "anim-stepped":
        setStopMotion(stepped === "on");
        break;
      case "anim-spin":
        setMotionSpin(spin === "on");
        break;
      case "anim-particles":
        setMotionParticles(particles === "on");
        break;
      case "anim-size-axis":
        setSizeAxis(axis, on === "on");
        break;
      case "anim-sound":
        setMotionSound(sound === "on");
        break;
      case "anim-size":
        setMotionSize(size === "on");
        break;
      case "anim-waves":
        setMotionWaves(waves);
        break;
      default:
        break;
    }
  });

  wireSizeSpreadSlider();

  window.addEventListener("radial-props-change", (e) => {
    if (viewMode !== "flat") return;
    const { field, value, phase } = e.detail || {};
    if (!field) return;

    if (field === "textContent") {
      if (phase === "focus") {
        if (selected?.type === "text") pushHistory();
        return;
      }
      if (phase !== "input") return;
      const t = selected?.type === "text" && getText(selected.id);
      if (!t) return;
      const upper = normalizeArcText(value || "");
      t.content = upper;
      t.size = ARC_TEXT_SIZE;
      t.color = currentTextColor();
      if (String(value) !== upper) {
        publishPropsSync({ textContent: upper });
      }
      renderTexts();
      persist();
      return;
    }

    if (phase !== "change") return;
    const num = Number(value);
    if (!Number.isFinite(num)) return;

    if (field === "segRin" || field === "segRout" || field === "segA0" || field === "segA1") {
      const seg = selected?.type === "segment" && getSegment(selected.id);
      if (!seg) return;
      pushHistory();
      const map = { segRin: "rIn", segRout: "rOut", segA0: "a0", segA1: "a1" };
      trySetSegmentField(seg, map[field], num);
      ensureTextsOnSegments();
      render();
      persist();
      return;
    }

    if (field === "textRadius") {
      const t = selected?.type === "text" && getText(selected.id);
      if (!t) return;
      pushHistory();
      const pose = snapTextToNearestSegment(num, t.angle);
      if (pose) applyTextPose(t, pose);
      render();
      persist();
      return;
    }

    if (field === "textAngle") {
      const t = selected?.type === "text" && getText(selected.id);
      if (!t) return;
      pushHistory();
      const host = findSegmentUnderText(t);
      const pose = snapTextToNearestSegment(
        t.radius,
        num,
        state.segments,
        host?.id,
      );
      if (pose) applyTextPose(t, pose);
      render();
      persist();
    }
  });

  document.querySelectorAll("[data-text-color]").forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      const key =
        btn.getAttribute("data-text-color") || btn.dataset.textColor || "";
      setGlobalTextColor(key);
    });
  });
}

/* ——— pointer ——— */

function onDblClick(evt) {
  if (viewMode !== "flat") return;
  const target = evt.target;
  if (target.classList?.contains("arc-text__hit") || target.closest?.(".arc-text")) {
    const id = target.dataset.id || target.closest("[data-id]")?.dataset.id;
    if (!id) return;
    selected = { type: "text", id };
    render();
    focusPropField("textContent");
  }
}

function onPointerDown(evt) {
  if (viewMode !== "flat" || evt.button !== 0) return;
  const p = svgPoint(evt);
  const target = evt.target;

  if (target.classList?.contains("handle") && selected?.type === "segment") {
    const seg = getSegment(selected.id);
    if (!seg) return;
    pushHistory();
    interaction = {
      kind: "resize-segment",
      handle: target.dataset.handle,
      id: seg.id,
    };
    svg.setPointerCapture?.(evt.pointerId);
    return;
  }

  if (target.classList?.contains("handle") && selected?.type === "text") {
    const t = getText(selected.id);
    if (!t) return;
    pushHistory();
    interaction = {
      kind: "move-text",
      id: t.id,
      radiusOnly: true,
      segmentId: findSegmentUnderText(t)?.id || null,
    };
    svg.classList.add("is-dragging-text");
    svg.setPointerCapture?.(evt.pointerId);
    return;
  }

  if (tool === "segment") {
    pushHistory();
    const r = clampRadius(polarRadius(CX, CY, p.x, p.y), MIN_R, MAX_R);
    const a = polarAngle(CX, CY, p.x, p.y);
    const half = 18;
    let rIn = clampRadius(r - half, MIN_R, MAX_R);
    let rOut = clampRadius(r + half, MIN_R, MAX_R);
    if (rOut - rIn < MIN_THICKNESS) rOut = rIn + MIN_THICKNESS;
    interaction = {
      kind: "create-segment",
      startAngle: a,
      rIn,
      rOut,
      draft: { rIn, rOut, a0: a, a1: a + MIN_SPAN },
    };
    selected = null;
    render();
    return;
  }

  // select / drag segment body
  if (target.classList?.contains("segment")) {
    const id = target.dataset.id;
    selected = { type: "segment", id };
    const seg = getSegment(id);
    if (seg && tool === "select") {
      pushHistory();
      const span = segmentSpan(seg);
      const midA = seg.a0 + span / 2;
      const midR = (seg.rIn + seg.rOut) / 2;
      const pointerA = polarAngle(CX, CY, p.x, p.y);
      interaction = {
        kind: "move-segment",
        id,
        span,
        thick: seg.rOut - seg.rIn,
        angleOffset: angleDelta(pointerA, midA),
        lastMidR: midR,
        lastGood: {
          a0: seg.a0,
          a1: seg.a1,
          rIn: seg.rIn,
          rOut: seg.rOut,
        },
      };
      svg.classList.add("is-dragging-segment");
      svg.setPointerCapture?.(evt.pointerId);
    }
    render();
    return;
  }

  if (target.classList?.contains("arc-text__hit") || target.closest?.(".arc-text")) {
    const id = target.dataset.id || target.closest("[data-id]")?.dataset.id;
    if (id) {
      selected = { type: "text", id };
      pushHistory();
      const t = getText(id);
      interaction = {
        kind: "move-text",
        id,
        radiusOnly: false,
        segmentId: t ? findSegmentUnderText(t)?.id || null : null,
      };
      svg.classList.add("is-dragging-text");
      svg.setPointerCapture?.(evt.pointerId);
      render();
      return;
    }
  }

  selected = null;
  render();
}

function onPointerMove(evt) {
  if (!interaction || viewMode !== "flat") return;
  const p = svgPoint(evt);
  const shift = evt.shiftKey;
  const alt = evt.altKey;

  if (interaction.kind === "move-text") {
    const t = getText(interaction.id);
    if (!t) return;
    const pointerR = polarRadius(CX, CY, p.x, p.y);
    const pointerA = interaction.radiusOnly
      ? t.angle
      : polarAngle(CX, CY, p.x, p.y);
    const pose = snapTextToNearestSegment(
      pointerR,
      pointerA,
      state.segments,
      interaction.segmentId,
    );
    if (pose) {
      applyTextPose(t, pose);
      interaction.segmentId = pose.segmentId;
    }
    renderTexts();
    renderUi();
    updatePropsPanel();
    return;
  }

  if (interaction.kind === "move-segment") {
    const seg = getSegment(interaction.id);
    if (!seg) return;
    const pointerA = polarAngle(CX, CY, p.x, p.y);
    const pointerR = polarRadius(CX, CY, p.x, p.y);
    const midA = normalizeAngle(pointerA + interaction.angleOffset);
    const midR = bandMidForPointerRadius(pointerR, interaction.lastMidR);
    interaction.lastMidR = midR;
    interaction.lastGood = resolveSegmentMove(
      seg,
      midA,
      midR,
      interaction.span,
      interaction.thick,
      interaction.lastGood,
    );
    render();
    return;
  }

  if (interaction.kind === "create-segment") {
    const a = polarAngle(CX, CY, p.x, p.y);
    const r = clampRadius(polarRadius(CX, CY, p.x, p.y), MIN_R, MAX_R);
    let rIn = interaction.rIn;
    let rOut = interaction.rOut;
    const startAngle = interaction.startAngle;

    if (shift && !alt) {
      /* angle only */
    } else if (alt && !shift) {
      const mid = (interaction.rIn + interaction.rOut) / 2;
      if (r >= mid) {
        rOut = Math.max(r, rIn + MIN_THICKNESS);
        rIn = interaction.rIn;
      } else {
        rIn = Math.min(r, interaction.rOut - MIN_THICKNESS);
        rOut = interaction.rOut;
      }
    } else {
      if (r > rOut) rOut = r;
      if (r < rIn) rIn = r;
      if (rOut - rIn < MIN_THICKNESS) rOut = rIn + MIN_THICKNESS;
    }

    const delta = angleDelta(startAngle, a);
    const goingPositive = delta >= 0;
    const span = Math.max(Math.abs(delta), MIN_SPAN);
    let draft = {
      rIn: clampRadius(rIn, MIN_R, MAX_R),
      rOut: clampRadius(Math.max(rOut, rIn + MIN_THICKNESS), MIN_R, MAX_R),
      a0: goingPositive ? startAngle : startAngle - span,
      a1: goingPositive ? startAngle + span : startAngle,
    };
    draft = clampDraftNoOverlap(draft, startAngle, goingPositive);
    interaction.draft = draft;
    renderSegments();
    return;
  }

  if (interaction.kind === "resize-segment") {
    const seg = getSegment(interaction.id);
    if (!seg) return;
    const a = polarAngle(CX, CY, p.x, p.y);
    const r = clampRadius(polarRadius(CX, CY, p.x, p.y), MIN_R, MAX_R);
    const h = interaction.handle;
    const before = { a0: seg.a0, a1: seg.a1, rIn: seg.rIn, rOut: seg.rOut };

    if (h === "a0") {
      seg.a0 = a;
      if (segmentSpan(seg) < MIN_SPAN) seg.a0 = seg.a1 - MIN_SPAN;
      resolveSegmentOverlap(seg, before, "a0");
    } else if (h === "a1") {
      seg.a1 = a;
      if (segmentSpan(seg) < MIN_SPAN) seg.a1 = seg.a0 + MIN_SPAN;
      resolveSegmentOverlap(seg, before, "a1");
    } else if (h === "rIn") {
      seg.rIn = clampRadius(Math.min(r, seg.rOut - MIN_THICKNESS), MIN_R, MAX_R);
      resolveSegmentOverlap(seg, before, "rIn");
    } else if (h === "rOut") {
      seg.rOut = clampRadius(Math.max(r, seg.rIn + MIN_THICKNESS), MIN_R, MAX_R);
      resolveSegmentOverlap(seg, before, "rOut");
    }
    render();
  }
}

function onPointerUp() {
  if (!interaction) return;
  const kind = interaction.kind;

  if (kind === "create-segment" && interaction.draft) {
    const d = interaction.draft;
    if (
      segmentSpan(d) >= MIN_SPAN &&
      d.rOut - d.rIn >= MIN_THICKNESS &&
      !segmentOverlapsAny(d, state.segments)
    ) {
      const id = uid("seg");
      const seg = {
        id,
        rIn: d.rIn,
        rOut: d.rOut,
        a0: d.a0,
        a1: d.a1,
        fill: activeFill,
        depth: depthForId(id),
      };
      state.segments.push(seg);
      selected = { type: "segment", id: seg.id };
      setTool("select");
    }
  }

  svg.classList.remove("is-dragging-text");
  svg.classList.remove("is-dragging-segment");
  if (kind === "move-segment" || kind === "resize-segment") {
    ensureTextsOnSegments();
  }
  interaction = null;
  render();
  persist();
}

/** Briefly animate the micro keycap as if physically pressed (Fluid chrome). */
function flashShortcutKbd(btnId) {
  if (typeof window.__flashShortcutKbd === "function") {
    window.__flashShortcutKbd(btnId);
  }
}

window.addEventListener("keydown", (evt) => {
  const tag = evt.target?.tagName;
  // Let native undo/redo work inside form fields
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || evt.target?.isContentEditable) {
    return;
  }

  // Cmd/Ctrl+\: hide / show the whole tool UI, canvas only.
  if ((evt.metaKey || evt.ctrlKey) && evt.code === "Backslash") {
    evt.preventDefault();
    const app = document.getElementById("app");
    app?.classList.toggle("is-chrome-hidden");
    window.dispatchEvent(new Event("resize"));
    return;
  }

  // Layout-independent: KeyZ covers EN Z and RU Я
  if ((evt.metaKey || evt.ctrlKey) && evt.code === "KeyZ") {
    evt.preventDefault();
    if (evt.shiftKey) redo();
    else undo();
    return;
  }

  if (viewMode === "flat") {
    if (evt.key === "v" || evt.key === "V" || evt.code === "KeyV") setTool("select");
    if (evt.key === "s" || evt.key === "S" || evt.code === "KeyS") setTool("segment");
  }

  // Plain letter keys only — avoid Cmd/Ctrl+R reload, Cmd/Ctrl+D bookmark, etc.
  // Prefer evt.code so RU layout still hits physical R/D keys.
  if (!evt.metaKey && !evt.ctrlKey && !evt.altKey && !evt.repeat) {
    if (evt.code === "KeyR" || evt.key === "r" || evt.key === "R") {
      evt.preventDefault();
      // Shift+R = undo (same as Cmd+Z); plain R = random
      if (evt.shiftKey) {
        undo();
        return;
      }
      flashShortcutKbd("btn-random");
      if (viewMode === "strips") regenerateStrips();
      else applyRandom(true);
      return;
    }
    if (evt.code === "KeyD" || evt.key === "d" || evt.key === "D") {
      evt.preventDefault();
      flashShortcutKbd("btn-export");
      exportSvg();
      return;
    }
    if (evt.code === "KeyC" || evt.key === "c" || evt.key === "C") {
      if (viewMode === "volume") {
        evt.preventDefault();
        copyView3dTransparentPng().then((ok) => {
          if (!ok) {
            alert("Не удалось скопировать картинку без фона (нужен доступ к буферу).");
          }
        });
        return;
      }
      if (viewMode === "flat") {
        evt.preventDefault();
        copyFlatSvgTransparent().then((ok) => {
          if (!ok) {
            alert("Не удалось скопировать SVG без фона (нужен доступ к буферу).");
          }
        });
        return;
      }
    }
  }

  if (evt.key === "Escape") {
    selected = null;
    interaction = null;
    if (viewMode === "flat") setTool("select");
    render();
  }

  if ((evt.key === "Backspace" || evt.key === "Delete") && selected && viewMode === "flat") {
    evt.preventDefault();
    pushHistory();
    if (selected.type === "segment") {
      deleteSegmentById(selected.id);
    } else {
      state.texts = state.texts.filter((t) => t.id !== selected.id);
    }
    selected = null;
    render();
    persist();
  }
});

function bootApp() {
  loadPrefs();
  // Always start in плоский with locked composition scrubber defaults.
  viewMode = "flat";
  randomness = DEFAULT_RANDOMNESS;
  objectCount = DEFAULT_OBJECT_COUNT;
  widePieces = DEFAULT_WIDE_PIECES;
  longPieces = DEFAULT_LONG_PIECES;
  sizeMix = DEFAULT_SIZE_MIX;

  buildPalette();
  wireUi();
  // Fresh composition from startup scrubber defaults (ignore saved drawing).
  state = createRandomComposition(
    widePieces01(),
    randomness01(),
    objectCount01(),
    longPieces01(),
    sizeMix01(),
  );
  state.texts = [];

  initView3d(view3dEl);
  setView3dVisible(false);

  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("dblclick", onDblClick);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  render();
  persist();
  highlightSwatch(activeFill);
  updateAnimButtons();
  publishChromeSync({
    viewMode,
    animPlaying,
    animSpeed,
    exportVideoBusy: false,
    exportVideoLabel: "экспорт видео",
  });
  syncSpreadSlider();
  setTool("select");
}

const unlocked = initAuth();
if (unlocked) {
  bootApp();
} else {
  window.addEventListener("pin-unlocked", () => bootApp(), { once: true });
}
