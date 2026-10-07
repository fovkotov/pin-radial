/**
 * Three.js volumetric view of annular sectors.
 * Orbit: drag · Option/Alt-drag: rotate model in 10° steps · Zoom: scroll · Depth varies ±~15% per segment.
 * Arc text removed — solid extruded segments (+ edge helpers in view).
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { FBXExporter } from "./vendor/fbx-exporter/FBXExporter.js";

const BG = 0xdbdfe7;
const BASE_DEPTH = 22;
const SCALE = 0.01; // SVG units → scene units
/** Screen-space edge width in px — fine hairline like the Alice HUD ref */
const EDGE_LINEWIDTH_PX = 0.75;
/**
 * Fill → outline (Alice HUD ref):
 * light plates → thin charcoal stroke;
 * saturated accents → very soft same-hue edge (almost no contrast).
 */
const EDGE_BY_FILL = {
  // white / grey plates — muted cool charcoal (white outline ~2× lighter)
  "#ffffff": { color: 0x9c9fa3, opacity: 0.55 },
  "#c6cdd7": { color: 0x3a3f48, opacity: 0.42 },
  // accents — subtle darker twin, low opacity (solid color leads)
  "#a38aff": { color: 0x4829b0, opacity: 0.38 },
  "#7a54ff": { color: 0x3a20a8, opacity: 0.36 },
  "#5385fd": { color: 0x2a4fc0, opacity: 0.28 },
  "#5284fd": { color: 0x2a4fc0, opacity: 0.28 },
  "#f86049": { color: 0x8a2e24, opacity: 0.38 },
  "#302b31": { color: 0x1a181a, opacity: 0.45 },
};
const EDGE_FALLBACK = { color: 0x3a3f48, opacity: 0.4 };
/**
 * Dihedral threshold for EdgesGeometry (°).
 * Keeps radial + extrusion creases; skips gentle arc-facet chords.
 */
const EDGE_THRESHOLD_DEG = 22;

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let root = null;
let animId = 0;
let containerEl = null;
let resizeObs = null;

function svgAngleToRad(deg) {
  // SVG polarAngle grows clockwise with Y-down; Three.js XY is Y-up CCW.
  return (-deg * Math.PI) / 180;
}

function normalizeAngle(deg) {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

function angleInArc(deg, a0, a1) {
  const a = normalizeAngle(deg);
  const start = normalizeAngle(a0);
  let span = a1 - a0;
  while (span <= 0) span += 360;
  while (span > 360) span -= 360;
  if (span >= 360) return true;
  let d = a - start;
  if (d < 0) d += 360;
  return d <= span + 1e-6;
}

function hash01(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function segmentDepth(seg) {
  if (typeof seg.depth === "number" && seg.depth > 0) return seg.depth;
  const v = 0.85 + hash01(seg.id || String(seg.a0)) * 0.3; // ±15%
  return BASE_DEPTH * v;
}

function segmentMidRadius(seg) {
  return (Number(seg.rIn) + Number(seg.rOut)) / 2;
}

function annularSectorShape(rIn, rOut, a0Deg, a1Deg) {
  let span = a1Deg - a0Deg;
  while (span <= 0) span += 360;
  while (span > 360) span -= 360;

  const shape = new THREE.Shape();
  const steps = Math.max(6, Math.ceil(span / 4));
  const a0 = svgAngleToRad(a0Deg);
  const a1 = svgAngleToRad(a0Deg + span);

  // Outer arc a0 → a1 (in Three.js angle space this goes the short way matching SVG clockwise)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 + (a1 - a0) * t;
    const x = rOut * Math.cos(a) * SCALE;
    const y = rOut * Math.sin(a) * SCALE;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  // Inner arc a1 → a0
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a1 + (a0 - a1) * t;
    const x = rIn * Math.cos(a) * SCALE;
    const y = rIn * Math.sin(a) * SCALE;
    shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function normalizeHex(color) {
  if (!color) return "";
  let s = String(color).trim().toLowerCase();
  if (!s.startsWith("#")) s = `#${s}`;
  if (s.length === 4) {
    // #rgb → #rrggbb
    s = `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
  }
  return s;
}

function edgeStyleForFill(fill) {
  const key = normalizeHex(fill);
  return EDGE_BY_FILL[key] ?? EDGE_FALLBACK;
}

function buildSegmentMesh(seg) {
  const depth = segmentDepth(seg) * SCALE;
  const shape = annularSectorShape(seg.rIn, seg.rOut, seg.a0, seg.a1);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geo.translate(0, 0, -depth / 2);

  // Unlit flat fill — Wipeout / technical CAD (no lights / shadows / specular)
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(seg.fill),
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `mesh-${seg.id}`;

  // Full hard-edge outlines on creases; color from fill palette
  const edgesGeo = new THREE.EdgesGeometry(geo, EDGE_THRESHOLD_DEG);
  const lineGeo = new LineSegmentsGeometry();
  lineGeo.setPositions(edgesGeo.attributes.position.array);
  edgesGeo.dispose();

  const edgeStyle = edgeStyleForFill(seg.fill);
  const edgeMat = new LineMaterial({
    color: edgeStyle.color,
    linewidth: EDGE_LINEWIDTH_PX,
    transparent: true,
    opacity: edgeStyle.opacity,
    depthTest: true,
    worldUnits: false,
  });
  if (renderer) {
    edgeMat.resolution.set(
      renderer.domElement.width || 800,
      renderer.domElement.height || 800,
    );
  } else {
    edgeMat.resolution.set(800, 800);
  }

  const edges = new LineSegments2(lineGeo, edgeMat);
  edges.computeLineDistances();
  edges.renderOrder = 1;
  edges.name = `edges-${seg.id}`;

  const group = new THREE.Group();
  group.name = `seg-${seg.id}`;
  group.userData.segmentId = seg.id;
  group.userData.depth = depth;
  group.add(mesh);
  group.add(edges);
  return group;
}

function updateEdgeResolutions() {
  if (!root || !renderer) return;
  const w = renderer.domElement.width || 800;
  const h = renderer.domElement.height || 800;
  root.traverse((obj) => {
    if (obj.isLineSegments2 && obj.material?.isLineMaterial) {
      obj.material.resolution.set(w, h);
    }
  });
}

/** Option/Alt-drag: rotate the model about world Y (horizontal drag) and X (vertical drag) in 10° detents. */
const SNAP_STEP_DEG = 10;
const SNAP_DEG_PER_PX = 0.5;
let modelYaw = 0;
let modelPitch = 0;

function applyModelRotation() {
  if (!root) return;
  const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(modelPitch));
  const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(modelYaw));
  root.quaternion.copy(qx.multiply(qy));
}

const snapDeg = (deg) => {
  const s = Math.round(deg / SNAP_STEP_DEG) * SNAP_STEP_DEG;
  return ((s % 360) + 360) % 360;
};

function onSnapRotateDown(e) {
  if (!e.altKey || e.button !== 0 || !root) return;
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const x0 = e.clientX;
  const y0 = e.clientY;
  const yaw0 = modelYaw;
  const pitch0 = modelPitch;
  el.setPointerCapture?.(e.pointerId);
  el.style.cursor = "grabbing";

  const move = (ev) => {
    if (ev.pointerId !== e.pointerId) return;
    ev.preventDefault();
    ev.stopPropagation();
    modelYaw = snapDeg(yaw0 + (ev.clientX - x0) * SNAP_DEG_PER_PX);
    modelPitch = snapDeg(pitch0 + (ev.clientY - y0) * SNAP_DEG_PER_PX);
    applyModelRotation();
  };
  const up = (ev) => {
    if (ev.pointerId !== e.pointerId) return;
    el.removeEventListener("pointermove", move, true);
    el.removeEventListener("pointerup", up, true);
    el.removeEventListener("pointercancel", up, true);
    el.releasePointerCapture?.(e.pointerId);
    el.style.cursor = "";
  };
  el.addEventListener("pointermove", move, true);
  el.addEventListener("pointerup", up, true);
  el.addEventListener("pointercancel", up, true);
}

function ensureScene(container) {
  if (renderer) return;

  containerEl = container;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);

  const w = container.clientWidth || 800;
  const h = container.clientHeight || 800;
  camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 100);
  camera.position.set(0, -4.2, 5.2);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(BG, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = false;
  renderer.domElement.className = "view3d-canvas";
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 14;
  controls.target.set(0, 0, 0);

  // No lights — MeshBasicMaterial only
  root = new THREE.Group();
  root.name = "pin-radial-root";
  scene.add(root);

  container.addEventListener("pointerdown", onSnapRotateDown, { capture: true });

  resizeObs = new ResizeObserver(() => {
    if (!renderer || !containerEl) return;
    const cw = containerEl.clientWidth;
    const ch = containerEl.clientHeight;
    if (cw < 2 || ch < 2) return;
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    renderer.setSize(cw, ch);
    updateEdgeResolutions();
  });
  resizeObs.observe(container);

  const loop = () => {
    animId = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  };
  loop();
}

export function setView3dVisible(visible) {
  if (!containerEl) return;
  containerEl.hidden = !visible;
  if (visible && renderer) {
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateEdgeResolutions();
  }
}

export function initView3d(container) {
  ensureScene(container);
  setView3dVisible(false);
}

export function syncView3d(state) {
  if (!root) return;
  while (root.children.length) {
    const ch = root.children.pop();
    ch.traverse?.((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      }
    });
  }

  const segments = state.segments || [];
  for (const seg of segments) {
    root.add(buildSegmentMesh(seg));
  }
  updateEdgeResolutions();
  // Arc texts intentionally omitted from volume view.
}

export function resetView3dCamera() {
  if (!camera || !controls) return;
  camera.position.set(0, -4.2, 5.2);
  controls.target.set(0, 0, 0);
  controls.update();
}

/** Render once with transparent clear (no gray stage bg). Restores afterward. */
function renderTransparentFrame() {
  if (!renderer || !scene || !camera) return false;
  const prevBg = scene.background;
  const prevClear = new THREE.Color();
  const prevAlpha = renderer.getClearAlpha();
  renderer.getClearColor(prevClear);

  scene.background = null;
  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, camera);

  scene.background = prevBg;
  renderer.setClearColor(prevClear, prevAlpha);
  return true;
}

function canvasToPngBlob() {
  return new Promise((resolve, reject) => {
    renderer.domElement.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}

/** PNG of current 3D framebuffer (with stage background). */
export function exportView3dPng(filename = "pin-radial-3d.png") {
  if (!renderer) return false;
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  return true;
}

/**
 * High-res capture size matching the viewport aspect (same framing).
 * long edge = min(4096, max(2880, 2×CSS×devicePR)), both dims capped to GPU max.
 */
function computeCaptureSize(cssW, cssH) {
  const aspect = cssW / Math.max(cssH, 1);
  const devicePR = Math.min(window.devicePixelRatio || 1, 2);
  const cssLong = Math.max(cssW, cssH);
  const desiredLong = Math.max(2880, Math.round(cssLong * devicePR * 2));

  let maxDim = 4096;
  try {
    const gl = renderer.getContext();
    const gpuMax = Math.min(
      gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 4096,
      gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096,
    );
    if (Number.isFinite(gpuMax) && gpuMax > 0) maxDim = Math.min(4096, gpuMax);
  } catch (_) {
    /* keep 4096 */
  }

  const longEdge = Math.min(maxDim, desiredLong);
  let captureW;
  let captureH;
  if (cssW >= cssH) {
    captureW = longEdge;
    captureH = Math.max(1, Math.round(longEdge / aspect));
  } else {
    captureH = longEdge;
    captureW = Math.max(1, Math.round(longEdge * aspect));
  }
  if (captureW > maxDim) {
    captureW = maxDim;
    captureH = Math.max(1, Math.round(maxDim / aspect));
  }
  if (captureH > maxDim) {
    captureH = maxDim;
    captureW = Math.max(1, Math.round(maxDim * aspect));
  }
  return { captureW, captureH };
}

/**
 * Copy volume view to clipboard as PNG with transparent background (no gray).
 * Same composition/framing as the on-screen viewport, rendered at a safe high res.
 * @returns {Promise<boolean>}
 */
export async function copyView3dTransparentPng() {
  if (!renderer || !scene || !camera || !containerEl) return false;
  const cssW = containerEl.clientWidth || renderer.domElement.clientWidth;
  const cssH = containerEl.clientHeight || renderer.domElement.clientHeight;
  if (cssW < 2 || cssH < 2) return false;

  const prevPR = renderer.getPixelRatio();
  const prevAspect = camera.aspect;
  const cssSize = new THREE.Vector2();
  renderer.getSize(cssSize);
  const { captureW, captureH } = computeCaptureSize(cssW, cssH);
  let resized = false;

  try {
    // Pixel-for-pixel capture buffer; keep CSS canvas size unchanged (updateStyle=false).
    renderer.setPixelRatio(1);
    renderer.setSize(captureW, captureH, false);
    camera.aspect = captureW / captureH; // === cssW/cssH → identical frustum
    camera.updateProjectionMatrix();
    updateEdgeResolutions();
    resized = true;

    if (!renderTransparentFrame()) return false;
    const blob = await canvasToPngBlob();

    renderer.setPixelRatio(prevPR);
    renderer.setSize(cssSize.x, cssSize.y, false);
    camera.aspect = prevAspect;
    camera.updateProjectionMatrix();
    updateEdgeResolutions();
    resized = false;
    renderer.render(scene, camera);

    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      console.error("Clipboard image write not supported");
      return false;
    }
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch (err) {
    console.error("Copy volume PNG failed", err);
    try {
      if (resized) {
        renderer.setPixelRatio(prevPR);
        renderer.setSize(cssSize.x, cssSize.y, false);
        camera.aspect = prevAspect;
        camera.updateProjectionMatrix();
        updateEdgeResolutions();
      }
      renderer.render(scene, camera);
    } catch (_) {
      /* ignore */
    }
    return false;
  }
}

/**
 * Build a clean export group: solid segment meshes only (no edge LineSegments).
 * World transforms baked for reliable FBX import in Blender/DCC.
 */
function buildExportMeshRoot() {
  const exportRoot = new THREE.Group();
  exportRoot.name = "pin-radial";
  if (!root) return exportRoot;

  root.updateWorldMatrix(true, true);
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    const geo = obj.geometry?.clone?.();
    if (!geo) return;
    geo.applyMatrix4(obj.matrixWorld);

    const srcMat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    const color = srcMat?.color ? srcMat.color.clone() : new THREE.Color(0xffffff);
    const mat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = obj.name || "segment";
    exportRoot.add(mesh);
  });
  return exportRoot;
}

/** Binary FBX download of current volume meshes (Blender-friendly preset). */
export function exportView3dFbx(filename = "pin-radial.fbx") {
  if (!root) return false;
  try {
    const exportRoot = buildExportMeshRoot();
    if (!exportRoot.children.length) return false;

    const exporter = new FBXExporter();
    const bytes = exporter.parseSync(exportRoot, {
      preset: "blender",
      embedTextures: false,
    });

    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.click();
    URL.revokeObjectURL(url);

    exportRoot.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    return true;
  } catch (err) {
    console.error("FBX export failed", err);
    return false;
  }
}

export function disposeView3d() {
  cancelAnimationFrame(animId);
  resizeObs?.disconnect();
  controls?.dispose();
  renderer?.dispose();
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  root = null;
  containerEl = null;
}
