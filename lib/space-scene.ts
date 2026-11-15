import { clamp, lerp, mix3, rgb, smooth, type Palette } from "./space-palette";

const SVG_NS = "http://www.w3.org/2000/svg";
/** y of the flat terrace: the car drives on it and the footer building stands on it. */
const GROUND = 834;

type Attrs = Record<string, string | number>;
type Point = readonly [number, number];

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Attrs,
  parent?: Element
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const key of Object.keys(attrs)) node.setAttribute(key, String(attrs[key]));
  parent?.appendChild(node);
  return node;
}

/** Writes only when the value differs, so a frame that changes nothing restyles nothing. */
function put(node: Element, name: string, value: string) {
  if (node.getAttribute(name) !== value) node.setAttribute(name, value);
}

/**
 * A palette colour shared by many shapes. Recolouring a group through an inherited `fill` restyles every
 * shape inside it; a one-stop gradient paints a solid colour, and recolouring its stop only repaints.
 */
function solid(defs: Element, id: string): SVGStopElement {
  const gradient = el("linearGradient", { id, gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  return el("stop", {}, gradient);
}

function createRandom(seed: number) {
  let state = seed >>> 0;
  const next = (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return { next, range: (a: number, b: number): number => a + (b - a) * next() };
}

/** Everything is measured in viewBox units (1440 x 900, sliced to fill the screen). */
export interface SceneLayout {
  scale: number;
  visibleWidth: number;
  visibleHeight: number;
  /** viewBox y of the top edge of the screen (the view is anchored to the bottom). */
  top: number;
  left: number;
  right: number;
  wallLeft: number;
  wallRight: number;
  leftMid: number;
  rightMid: number;
  charminar: number;
  sun: number;
  groundPx: number;
}

function computeLayout(wall: HTMLElement): SceneLayout {
  const scale = Math.max(window.innerWidth / 1440, window.innerHeight / 900);
  const visibleWidth = window.innerWidth / scale;
  const visibleHeight = window.innerHeight / scale;
  const left = (1440 - visibleWidth) / 2;
  const right = left + visibleWidth;
  const rect = wall.getBoundingClientRect();
  const wallLeft = left + rect.left / scale;
  const wallRight = left + rect.right / scale;
  return {
    scale,
    visibleWidth,
    visibleHeight,
    top: 900 - visibleHeight,
    left,
    right,
    wallLeft,
    wallRight,
    leftMid: Math.max(left + 66, (left + wallLeft) / 2),
    rightMid: Math.min(right - 66, (wallRight + right) / 2),
    charminar: left + visibleWidth * 0.69,
    sun: left + visibleWidth * 0.61,
    groundPx: (900 - GROUND) * scale,
  };
}

export interface SceneFrame {
  /** Scroll progress, 0 at the top of the page and 1 at the bottom. */
  t: number;
  scrollY: number;
  /** 0..1, how hard the page is being scrolled right now. */
  energy: number;
  /** Signed px per frame. */
  velocity: number;
  palette: Palette;
}

export interface SpaceSceneOptions {
  back: SVGSVGElement;
  fore: SVGSVGElement;
  wall: HTMLElement;
  reducedMotion: boolean;
  requestFrame: () => void;
  onLayout: (groundPx: number) => void;
}

export interface SpaceScene {
  update: (frame: SceneFrame) => void;
  rebuild: () => void;
  setReducedMotion: (reduced: boolean) => void;
  /** True while something (a tipped king) is still easing and needs more frames. */
  readonly animating: boolean;
  destroy: () => void;
}

interface ChessPiece {
  e: SVGGElement;
  x: number;
  y: number;
  segs: { from: Point; to: Point; t0: number; t1: number }[];
}

interface Chess {
  pieces: ChessPiece[];
  arms: { upper: SVGGElement; arm: SVGPathElement; hipY: number }[];
  moves: { t0: number; t1: number; side: 0 | 1 }[];
  king: ChessPiece | null;
  tip: number;
  tipTo: number;
}

interface Cloud {
  e: SVGGElement;
  bodyColor: SVGStopElement;
  glow: SVGEllipseElement;
  x: number;
  y: number;
  depth: number;
  /** 0 high in the sky, 1 sitting on the horizon. */
  low: number;
}

interface Lantern {
  e: SVGGElement;
  glow: SVGCircleElement;
  x: number;
  y: number;
  depth: number;
}

/** Windows that light up at the same moment share one group, so a frame writes a few dozen opacities. */
interface LitGroup {
  e: SVGGElement;
  th: number;
  last: string;
}

interface SceneRefs {
  layout: SceneLayout;
  skyStops: SVGStopElement[];
  paint: { far: SVGStopElement; mid: SVGStopElement; near: SVGStopElement; charminar: SVGStopElement };
  farGroup: SVGGElement;
  midGroup: SVGGElement;
  strokers: SVGElement[];
  canvas: { top: SVGRectElement; mid: SVGRectElement; hor: SVGRectElement; sky: SVGPathElement };
  sun: SVGCircleElement;
  glow: SVGCircleElement;
  moon: SVGCircleElement;
  stars: SVGGElement;
  twinkle: (readonly [SVGCircleElement, number])[];
  lit: LitGroup[];
  clouds: Cloud[];
  lanterns: Lantern[];
  birdsGroup: SVGGElement;
  birds: { e: SVGGElement; dx: number; y: number; scale: number }[];
  kite: SVGGElement;
  kiteBody: SVGGElement;
  kiteString: SVGPathElement;
  bulbs: (readonly [SVGCircleElement, number])[];
  chess: Chess;
  brush: SVGGElement;
  cat: SVGGElement;
  catTail: SVGGElement;
  catEyes: SVGGElement;
  catX: number;
  car: SVGGElement;
  wheels: SVGGElement[];
  carDash: number;
  carBusy: boolean;
  shootGroup: SVGGElement;
  shootLine: SVGLineElement;
}

interface BuildContext {
  opts: SpaceSceneOptions;
  later: (fn: () => void, ms: number) => void;
  nextFrame: (fn: FrameRequestCallback) => void;
  isAlive: () => boolean;
  currentT: () => number;
}

interface SkylineOptions {
  base: number;
  x0: number;
  x1: number;
  wmin: number;
  wmax: number;
  hmin: number;
  hmax: number;
  features?: boolean;
  lit?: number;
  skip?: readonly Point[];
}

function buildScene(ctx: BuildContext, layout: SceneLayout): SceneRefs {
  const { back, fore } = ctx.opts;
  back.textContent = "";
  fore.textContent = "";
  const { next: R, range: rr } = createRandom(7);
  const L = layout;

  const LIT_STEPS = 28;
  const litGroups: LitGroup[] = [];
  const litByParent = new Map<Element, (SVGGElement | undefined)[]>();
  const litGroup = (parent: Element, th: number): SVGGElement => {
    const index = Math.min(LIT_STEPS - 1, Math.max(0, Math.round((th / 0.72) * (LIT_STEPS - 1))));
    let groups = litByParent.get(parent);
    if (!groups) {
      groups = [];
      litByParent.set(parent, groups);
    }
    let group = groups[index];
    if (!group) {
      group = el("g", { opacity: 0 }, parent);
      groups[index] = group;
      litGroups.push({ e: group, th: (index / (LIT_STEPS - 1)) * 0.72, last: "0.00" });
    }
    return group;
  };

  const lit = (parent: Element, x: number, y: number, w: number, h: number, th = rr(0.05, 0.7)) =>
    el("rect", { x: x.toFixed(1), y: y.toFixed(1), width: w, height: h, rx: 1 }, litGroup(parent, th));

  const hit = (parent: Element, x: number, y: number, w: number, h: number) =>
    el("rect", { x, y, width: w, height: h, fill: "transparent", class: "space-hit" }, parent);

  function skyline(g: Element, windows: Element | null, o: SkylineOptions) {
    let x = o.x0;
    while (x < o.x1) {
      const w = rr(o.wmin, o.wmax);
      let h = rr(o.hmin, o.hmax);
      if (o.skip?.some(([a, b]) => x < b && x + w > a)) h = rr(16, 30);
      el("rect", { x, y: o.base - h, width: w + 4, height: h + 80 }, g);
      if (o.features && h > 40) {
        const f = R();
        if (f < 0.28) {
          const mw = w * rr(0.28, 0.42);
          const mh = rr(14, 24);
          el("rect", { x: x + w * rr(0.08, 0.5), y: o.base - h - mh, width: mw, height: mh + 1 }, g);
        } else if (f < 0.5) {
          const tx = x + w * rr(0.15, 0.7);
          el("rect", { x: tx, y: o.base - h - 6, width: 2.2, height: 7 }, g);
          el("rect", { x: tx + 13, y: o.base - h - 6, width: 2.2, height: 7 }, g);
          el("rect", { x: tx - 1, y: o.base - h - 26, width: 18, height: 21, rx: 3 }, g);
          el("ellipse", { cx: tx + 8, cy: o.base - h - 26, rx: 9, ry: 3.2 }, g);
        } else if (f < 0.62) {
          const len = rr(26, 46);
          const ax = x + w * rr(0.2, 0.8);
          el("rect", { x: ax, y: o.base - h - len, width: 1.8, height: len + 1 }, g);
          el("rect", { x: ax - 6, y: o.base - h - len + 6, width: 13, height: 1.6 }, g);
        } else if (f < 0.74) {
          el("rect", { x: x - 1, y: o.base - h - 5, width: w + 3.5, height: 6 }, g);
        }
      }
      if (o.lit && windows && h > 40) {
        const cols = Math.max(1, Math.floor((w - 8) / 17));
        const rows = Math.floor((h - 14) / 24);
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (R() < o.lit) lit(windows, x + 7 + c * 17, o.base - h + 12 + r * 24, 6, 8);
          }
        }
      }
      x += w - 1 + rr(-2, 2);
    }
  }

  function tree(g: Element, cx: number, cy: number, s: number) {
    const blobs: readonly (readonly [number, number, number])[] = [
      [0, 0, 24],
      [-22, 8, 18],
      [22, 6, 19],
      [-8, -14, 17],
      [12, -12, 16],
    ];
    for (const [dx, dy, r] of blobs) el("circle", { cx: cx + dx * s, cy: cy + dy * s, r: r * s }, g);
  }

  function charminar(g: Element, windows: Element, cx: number, base: number) {
    const body = el("g", { transform: `translate(${cx},${base})` }, g);
    el("rect", { x: -62, y: -86, width: 124, height: 96 }, body);
    el("rect", { x: -46, y: -108, width: 92, height: 24 }, body);
    for (const side of [-1, 1]) {
      const x = side * 62;
      el("path", { d: `M${x - 8},8 L${x - 5},-132 L${x + 5},-132 L${x + 8},8 Z` }, body);
      el("rect", { x: x - 10, y: -98, width: 20, height: 4.5, rx: 1.5 }, body);
      el("rect", { x: x - 9, y: -134, width: 18, height: 5, rx: 1.5 }, body);
      el("ellipse", { cx: x, cy: -143, rx: 7, ry: 10 }, body);
      el("rect", { x: x - 0.9, y: -164, width: 1.8, height: 14 }, body);
      el("circle", { cx: x, cy: -165, r: 2.3 }, body);
    }
    for (let i = -3; i <= 3; i++) el("ellipse", { cx: i * 14, cy: -111, rx: 4.6, ry: 6 }, body);
    el("ellipse", { cx: 0, cy: -119, rx: 12, ry: 13 }, body);
    el("rect", { x: -0.9, y: -152, width: 1.8, height: 26 }, body);
    const arches = el("g", { transform: `translate(${cx},${base})` }, windows);
    for (let i = -2; i <= 2; i++) {
      el(
        "path",
        { d: `M${i * 22 - 5},-34 v-16 a5,5 0 0 1 10,0 v16 z` },
        litGroup(arches, 0.1 + Math.abs(i) * 0.05)
      );
    }
    el("path", { d: "M-11,10 v-30 a11,11 0 0 1 22,0 v30 z" }, litGroup(arches, 0.2));
  }

  function stander(g: Element, x: number, dir: number) {
    const person = el("g", { transform: `translate(${x},0) scale(${dir},1)` }, g);
    el("rect", { x: -4.6, y: -17, width: 3.9, height: 17, rx: 1.6 }, person);
    el("rect", { x: 0.8, y: -17, width: 3.9, height: 17, rx: 1.6 }, person);
    el("path", { d: "M-6,-15 C-6.2,-27 -4.4,-33.5 0,-35 C4.4,-33.5 6.2,-27 6,-15 Z" }, person);
    el("circle", { cx: 0.6, cy: -40, r: 5 }, person);
  }

  /* ---------- sky ---------- */
  const defs = el("defs", {}, back);
  const skyGradient = el(
    "linearGradient",
    { id: "space-sky", gradientUnits: "userSpaceOnUse", x1: 0, y1: -200, x2: 0, y2: 800 },
    defs
  );
  /* sky stops 0.85 and 1 share one colour, and a gradient pads past its last stop, so one stop covers both */
  const skyStops = [0, 0.45, 0.85].map((offset) => el("stop", { offset }, skyGradient));
  const paint = {
    far: solid(defs, "space-fill-far"),
    mid: solid(defs, "space-fill-mid"),
    near: solid(defs, "space-fill-near"),
    charminar: solid(defs, "space-fill-charminar"),
  };
  const sunGradient = el("radialGradient", { id: "space-sun-glow" }, defs);
  el("stop", { offset: 0, "stop-color": "#fff1c9", "stop-opacity": 0.8 }, sunGradient);
  el("stop", { offset: 0.35, "stop-color": "#ffc27a", "stop-opacity": 0.32 }, sunGradient);
  el("stop", { offset: 1, "stop-color": "#ff9f4a", "stop-opacity": 0 }, sunGradient);
  const moonMask = el("mask", { id: "space-moon-mask" }, defs);
  el("rect", { x: -100, y: -70, width: 200, height: 140, fill: "#fff" }, moonMask);
  el("circle", { cx: -19, cy: 4, r: 22, fill: "#000" }, moonMask);
  el("rect", { x: -600, y: -600, width: 2640, height: 1800, fill: "url(#space-sky)" }, back);

  const stars = el("g", {}, back);
  const twinkle: (readonly [SVGCircleElement, number])[] = [];
  for (let i = 0; i < 170; i++) {
    const star = el(
      "circle",
      {
        cx: rr(L.left - 60, L.right + 60).toFixed(1),
        cy: rr(-40, 600).toFixed(1),
        r: (R() < 0.1 ? rr(1.3, 1.9) : rr(0.5, 1.2)).toFixed(2),
        fill: "#eaf0ff",
      },
      stars
    );
    const opacity = rr(0.35, 1);
    star.setAttribute("opacity", opacity.toFixed(2));
    if (i % 4 === 0) twinkle.push([star, opacity]);
  }
  const moon = el("circle", { cx: 0, cy: 0, r: 25, fill: "#f4efdf", mask: "url(#space-moon-mask)" }, back);
  const glow = el("circle", { cx: L.sun, cy: 650, r: 430, fill: "url(#space-sun-glow)" }, back);
  const sun = el("circle", { cx: L.sun, cy: 650, r: 42, fill: "#ffe9c4" }, back);
  /* ---------- evening clouds: long banks lit from below, thinner once it is dark ---------- */
  const sky = createRandom(29);
  const flat = el("clipPath", { id: "space-cloud-flat" }, defs);
  el("rect", { x: -900, y: -500, width: 1800, height: 500 }, flat);
  const cloudLayer = el("g", {}, back);
  const clouds: Cloud[] = [];
  const CLOUD_SPECS: readonly (readonly [number, number, number, number, number])[] = [
    // share of the visible width, share of the visible height, width, height, depth
    [0.3, 0.6, 380, 26, 0.9],
    [0.74, 0.605, 430, 24, 1],
    [0.88, 0.37, 300, 22, 0.6],
    [0.8, 0.2, 250, 16, 0.4],
    [0.56, 0.095, 320, 14, 0.35],
  ];
  for (const [fx, fy, w, h, depth] of CLOUD_SPECS) {
    const low = clamp((fy - 0.1) / 0.5);
    const bodyId = `space-fill-cloud-${clouds.length}`;
    const bodyColor = solid(defs, bodyId);
    const e = el("g", {}, cloudLayer);
    const sway = el(
      "g",
      {
        class: "space-cloud",
        style: `--dur:${sky.range(55, 95).toFixed(0)}s;animation-delay:-${sky.range(0, 40).toFixed(0)}s`,
      },
      e
    );
    const shape = el("g", { "clip-path": "url(#space-cloud-flat)" }, sway);
    const body = el("g", { fill: `url(#${bodyId})` }, shape);
    const puffs = Math.max(4, Math.round(w / 64));
    for (let i = 0; i < puffs; i++) {
      const u = i / (puffs - 1);
      const taper = 1 - Math.pow(Math.abs(u - 0.5) * 2, 1.7);
      const r = h * (0.4 + 0.6 * taper) * sky.range(0.82, 1.1);
      el("circle", { cx: ((u - 0.5) * w * 0.88).toFixed(1), cy: (-r * 0.5).toFixed(1), r: r.toFixed(1) }, body);
    }
    const glowBase = el(
      "ellipse",
      {
        cx: 0,
        cy: (-h * 0.1).toFixed(1),
        rx: (w * 0.45).toFixed(1),
        ry: (h * 0.3).toFixed(1),
        fill: rgb(mix3([255, 176, 150], [255, 205, 140], low)),
      },
      shape
    );
    clouds.push({
      e,
      bodyColor,
      glow: glowBase,
      x: L.left + fx * L.visibleWidth,
      y: L.top + fy * L.visibleHeight,
      depth,
      low,
    });
  }

  /* ---------- sky lanterns: they glow brighter as it gets dark ---------- */
  const lanternGlow = el("radialGradient", { id: "space-lantern-glow" }, defs);
  el("stop", { offset: 0, "stop-color": "#ffc46b", "stop-opacity": 0.6 }, lanternGlow);
  el("stop", { offset: 1, "stop-color": "#ff8a3d", "stop-opacity": 0 }, lanternGlow);
  const lanternLayer = el("g", {}, back);
  const lanterns: Lantern[] = [];
  const LANTERN_SPECS: readonly (readonly [number, number, number])[] = [
    // share of the visible width, share of the visible height, size
    [0.36, 0.5, 1],
    [0.26, 0.56, 0.8],
    [0.46, 0.6, 0.9],
    [0.52, 0.5, 0.7],
    [0.8, 0.3, 1.1],
    [0.9, 0.46, 0.85],
    [0.84, 0.58, 0.75],
    [0.94, 0.22, 0.9],
  ];
  for (const [fx, fy, size] of LANTERN_SPECS) {
    const e = el("g", {}, lanternLayer);
    const rise = el(
      "g",
      {
        class: "space-lantern",
        style: `--dur:${sky.range(60, 100).toFixed(0)}s;animation-delay:-${sky.range(0, 60).toFixed(0)}s`,
      },
      e
    );
    const lantern = el("g", { transform: `scale(${size})` }, rise);
    const halo = el("circle", { r: 26, fill: "url(#space-lantern-glow)" }, lantern);
    el("path", { d: "M-5.5,-7 Q0,-9.5 5.5,-7 L6.6,5 Q0,8.4 -6.6,5 Z", fill: "#ffa94a" }, lantern);
    el("ellipse", { cx: 0, cy: -0.8, rx: 3.6, ry: 5, fill: "#fff0c4", opacity: 0.9 }, lantern);
    el("rect", { x: -3, y: -10.4, width: 6, height: 2.2, rx: 0.8, fill: "#8a3f1c" }, lantern);
    lanterns.push({ e, glow: halo, x: L.left + fx * L.visibleWidth, y: L.top + fy * L.visibleHeight, depth: size });
  }

  /* ---------- birds: already in the sky when the page opens ---------- */
  const birdsGroup = el("g", {}, back);
  const birds: SceneRefs["birds"] = [];
  for (let i = 0; i < 11; i++) {
    const far = i >= 7;
    /* the first seven keep drawing from the shared random stream so the skyline below stays as approved */
    const dx = i < 7 ? rr(-170, 40) : sky.range(-170, 40);
    const level = ((i < 7 ? rr(300, 470) : sky.range(300, 470)) - 300) / 170;
    const e = el("g", {}, birdsGroup);
    el(
      "path",
      {
        d: "M0,0 q9,-8 18,0 q9,-8 18,0",
        fill: "none",
        stroke: "#2a1a22",
        "stroke-width": far ? 1.2 : 1.7,
        "stroke-linecap": "round",
        class: "space-bird",
        style: `animation-duration:${sky.range(0.7, 1.1).toFixed(2)}s;animation-delay:-${sky.range(0, 1).toFixed(2)}s`,
      },
      e
    );
    birds.push({
      e,
      dx: (dx + 170) * 0.95 - 15,
      y: L.top + L.visibleHeight * (far ? 0.44 + level * 0.06 : 0.5 + level * 0.14),
      scale: far ? 0.6 : sky.range(0.9, 1.25),
    });
  }
  const kite = el("g", {}, back);
  const kiteString = el(
    "path",
    { fill: "none", stroke: "#2a1a22", "stroke-width": 0.9, opacity: 0.5 },
    kite
  );
  const kiteBody = el("g", {}, kite);
  const kiteSway = el("g", { class: "space-kite" }, kiteBody);
  el("path", { d: "M0,-27 L15,-3 L0,27 L-15,-3 Z", fill: "#e8432a" }, kiteSway);
  el(
    "path",
    { d: "M0,-27 V27 M-15,-3 H15", stroke: "#fff1dc", "stroke-width": 0.8, opacity: 0.7, fill: "none" },
    kiteSway
  );
  el(
    "path",
    {
      d: "M0,27 q-6,10 0,18 q6,8 0,16",
      fill: "none",
      stroke: "#2a1a22",
      "stroke-width": 1,
      opacity: 0.7,
    },
    kiteSway
  );
  const shootGroup = el("g", {}, back);
  const shootLine = el(
    "line",
    { x1: 0, y1: 0, x2: -64, y2: -27, stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round", opacity: 0 },
    shootGroup
  );

  /* ---------- far skyline, slowest layer ---------- */
  const farGroup = el("g", {}, back);
  const far = el("g", { fill: "url(#space-fill-far)" }, farGroup);
  skyline(far, null, {
    base: 790,
    x0: L.left - 60,
    x1: L.right + 60,
    wmin: 24,
    wmax: 58,
    hmin: 30,
    hmax: 118,
  });

  /* ---------- mid layer: buildings, the Charminar, the two rooftop scenes ---------- */
  const midGroup = el("g", {}, back);
  const charminarFill = el("g", { fill: "url(#space-fill-charminar)" }, midGroup);
  const mid = el("g", { fill: "url(#space-fill-mid)" }, midGroup);
  const midWindows = el("g", { fill: "#ffd27a", opacity: 0.8 }, midGroup);
  const silhouettes = el("g", { fill: "url(#space-fill-near)" }, midGroup);
  const lights = el("g", { fill: "#ffd27a" }, midGroup);
  skyline(mid, midWindows, {
    base: 850,
    x0: L.left - 60,
    x1: L.right + 60,
    wmin: 38,
    wmax: 92,
    hmin: 46,
    hmax: 150,
    features: true,
    lit: 0.3,
    skip: [
      [L.leftMid - 118, L.leftMid + 118],
      [L.rightMid - 88, L.rightMid + 88],
      [L.charminar - 80, L.charminar + 80],
    ],
  });
  tree(mid, L.left + 30, 812, 0.9);
  tree(mid, L.leftMid + 136, 818, 0.8);
  tree(mid, L.rightMid - 106, 812, 0.9);
  tree(mid, L.right - 26, 820, 0.8);
  charminar(charminarFill, midWindows, L.charminar, 846);

  const roof = (x0: number, x1: number, y: number, density: number) => {
    el("rect", { x: x0, y, width: x1 - x0, height: 170 }, mid);
    el("rect", { x: x0 - 2, y: y - 5, width: x1 - x0 + 4, height: 6, rx: 1.5 }, mid);
    const cols = Math.floor((x1 - x0 - 14) / 24);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 4; r++) {
        if (R() < density) lit(midWindows, x0 + 9 + c * 24, y + 14 + r * 26, 6, 9);
      }
    }
  };

  const strokers: SVGElement[] = [];
  const bulbs: (readonly [SVGCircleElement, number])[] = [];

  /* chess on the left roof */
  const chess: Chess = { pieces: [], arms: [], moves: [], king: null, tip: 0, tipTo: 0 };
  {
    const x0 = L.leftMid - 114;
    const x1 = L.leftMid + 114;
    const y = 744;
    roof(x0, x1, y, 0.32);
    const g = el("g", { transform: `translate(${L.leftMid},${y}) scale(1.2)` }, silhouettes);
    el("rect", { x: -1.6, y: -26, width: 3.2, height: 26 }, g);
    el("rect", { x: -18.5, y: -29, width: 37, height: 3.2, rx: 1.4 }, g);
    const frontY = -29.2;
    const backY = -35;
    const frontW = 16.5;
    const backW = 12.6;
    el(
      "polygon",
      { points: `${-frontW},${frontY} ${frontW},${frontY} ${backW},${backY} ${-backW},${backY}`, fill: "#e9dcc0" },
      g
    );
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 0) continue;
        const f0 = r / 3;
        const f1 = (r + 1) / 3;
        const y0 = lerp(frontY, backY, f0);
        const y1 = lerp(frontY, backY, f1);
        const w0 = lerp(frontW, backW, f0);
        const w1 = lerp(frontW, backW, f1);
        const quad: Point[] = [
          [-w0 + (c * 2 * w0) / 8, y0],
          [-w0 + ((c + 1) * 2 * w0) / 8, y0],
          [-w1 + ((c + 1) * 2 * w1) / 8, y1],
          [-w1 + (c * 2 * w1) / 8, y1],
        ];
        el(
          "polygon",
          { points: quad.map((q) => q.map((v) => v.toFixed(2)).join(",")).join(" "), fill: "#4b3a52" },
          g
        );
      }
    }
    const piece = (x: number, py: number, white: boolean, knight = false) => {
      const e = el("g", {}, g);
      const color = white ? "#f6f0e4" : "#241a2a";
      if (knight) {
        el("path", { d: "M-1.7,0 h3.4 l-.3,-3 l1.6,-1.5 l-1.3,-2.4 l-2,.5 l-1.2,2 z", fill: color }, e);
      } else {
        el("circle", { cx: 0, cy: -4, r: 1.3, fill: color }, e);
        el("path", { d: "M-1.4,0 h2.8 l-.5,-3 h-1.8 z", fill: color }, e);
      }
      const p: ChessPiece = { e, x, y: py, segs: [] };
      chess.pieces.push(p);
    };
    /* white sits on the left, black on the right */
    piece(-9, -30.2, true, true);
    piece(-3.5, -31.6, true);
    piece(-7, -33.6, true);
    piece(5, -31.6, false);
    piece(10, -33.4, false);
    piece(3, -34.2, false);
    const plan: readonly (readonly [number, number, number, number, number, 0 | 1])[] = [
      [0, -4.5, -33.6, 0.06, 0.12, 0],
      [4, 8, -30.6, 0.2, 0.26, 1],
      [1, -1.5, -34.2, 0.36, 0.42, 0],
      [3, 6.5, -34, 0.52, 0.58, 1],
      [2, -7.5, -30.8, 0.68, 0.74, 0],
      [5, 2, -31, 0.84, 0.9, 1],
    ];
    for (const [index, tx, ty, t0, t1, side] of plan) {
      const p = chess.pieces[index];
      const previous = p.segs[p.segs.length - 1];
      p.segs.push({ from: previous ? previous.to : [p.x, p.y], to: [tx, ty], t0, t1 });
      chess.moves.push({ t0, t1, side });
    }
    const player = (x: number, dir: number) => {
      const seatY = -13;
      const person = el("g", { transform: `translate(${x},0) scale(${dir},1)` }, g);
      el("rect", { x: -6.5, y: seatY, width: 13, height: 2.4, rx: 1.1 }, person);
      el("rect", { x: -5.2, y: seatY + 2, width: 1.5, height: 11 }, person);
      el("rect", { x: 3.7, y: seatY + 2, width: 1.5, height: 11 }, person);
      el("rect", { x: -3, y: seatY - 4.6, width: 15, height: 4.8, rx: 2.2 }, person);
      el("rect", { x: 8, y: seatY - 3, width: 4.6, height: 16, rx: 2 }, person);
      const upper = el("g", {}, person);
      el(
        "path",
        {
          d: `M-5.2,${seatY} C-5.4,${seatY - 10} -4.4,${seatY - 18} 0,${seatY - 19.5} C4.4,${seatY - 18} 5.2,${seatY - 10} 5.2,${seatY} Z`,
        },
        upper
      );
      el("circle", { cx: 1.4, cy: seatY - 25, r: 4.8 }, upper);
      const arm = el("path", { fill: "none", "stroke-width": 2.4, "stroke-linecap": "round" }, upper);
      strokers.push(arm);
      chess.arms.push({ upper, arm, hipY: seatY });
    };
    player(-31, 1);
    player(31, -1);
    chess.king = chess.pieces[4];
    hit(g, -50, -54, 100, 56).addEventListener("click", () => {
      chess.tipTo = chess.tipTo ? 0 : 1;
      ctx.opts.requestFrame();
    });
    el("rect", { x: x0 + 8, y: y - 26, width: 1.6, height: 26 }, silhouettes);
    el("rect", { x: x1 - 9.6, y: y - 26, width: 1.6, height: 26 }, silhouettes);
    const ax = x0 + 9;
    const bx = x1 - 9;
    const sagY = y - 6;
    el(
      "path",
      {
        d: `M${ax},${y - 26} Q${L.leftMid},${sagY} ${bx},${y - 26}`,
        fill: "none",
        stroke: "#2a1a22",
        "stroke-width": 0.8,
        opacity: 0.45,
      },
      silhouettes
    );
    for (let k = 1; k < 9; k++) {
      const u = k / 9;
      const px = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * L.leftMid + u * u * bx;
      const py = (1 - u) * (1 - u) * (y - 26) + 2 * (1 - u) * u * sagY + u * u * (y - 26);
      bulbs.push([el("circle", { cx: px.toFixed(1), cy: (py + 1.5).toFixed(1), r: 1.7 }, lights), 0.1 + k * 0.03]);
    }
  }

  /* a painter on the right roof */
  const paintedStars = el("g", {});
  const canvas = {} as SceneRefs["canvas"];
  const brush = el("g", {});
  {
    const x0 = L.rightMid - 80;
    const x1 = L.rightMid + 80;
    const y = 752;
    roof(x0, x1, y, 0.3);
    const g = el("g", { transform: `translate(${L.rightMid},${y}) scale(1.2)` }, silhouettes);
    el("polygon", { points: "-21,-52 -18,-52 -8,0 -11,0" }, g);
    el("polygon", { points: "-21,-52 -18,-52 -26,0 -29,0" }, g);
    el("polygon", { points: "-20,-50 -18,-50 -15,-2 -17,-2" }, g);
    el("rect", { x: -33, y: -54, width: 26, height: 34, rx: 1.5 }, g);
    const picture = el("g", { transform: "translate(-31,-52)" }, g);
    canvas.top = el("rect", { x: 0, y: 0, width: 22, height: 11, fill: "#888" }, picture);
    canvas.mid = el("rect", { x: 0, y: 11, width: 22, height: 10, fill: "#888" }, picture);
    canvas.hor = el("rect", { x: 0, y: 21, width: 22, height: 9, fill: "#888" }, picture);
    canvas.sky = el(
      "path",
      { d: "M0,30 V25 h4 v-4 h4 v3 h3 v-6 h4 v7 h3 v-3 h4 v8 Z", fill: "#222" },
      picture
    );
    picture.appendChild(paintedStars);
    stander(g, 13, -1);
    g.appendChild(brush);
    strokers.push(el("path", { d: "M9,-30 L-3,-36", fill: "none", "stroke-width": 2.6, "stroke-linecap": "round" }, brush));
    el("rect", { x: -13, y: -6, width: 6, height: 6, rx: 1 }, g);
    hit(g, -34, -56, 28, 38).addEventListener("click", () => {
      const star = el(
        "circle",
        {
          cx: rr(1, 21).toFixed(1),
          cy: rr(1, 20).toFixed(1),
          r: 1.1,
          fill: "#fff7d8",
          opacity: 0,
        },
        paintedStars
      );
      star.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });
      if (paintedStars.childNodes.length > 9 && paintedStars.firstChild) {
        paintedStars.removeChild(paintedStars.firstChild);
      }
    });
  }

  /* ---------- near layer: flat terrace (no parallax), windows, a cat ---------- */
  const near = el("g", { fill: "url(#space-fill-near)" }, back);
  const nearWindows = el("g", { fill: "#ffd27a" }, back);
  el("rect", { x: L.left - 80, y: GROUND, width: L.visibleWidth + 160, height: 160 }, near);
  for (let x = L.left - 60; x < L.right + 60; x += rr(70, 130)) {
    const w = rr(14, 34);
    const h = rr(4, 9);
    el("rect", { x: x.toFixed(1), y: GROUND - h, width: w.toFixed(1), height: h + 1 }, near);
  }
  for (let x = L.left - 50; x < L.right + 50; x += 22) {
    for (let r = 0; r < 3; r++) {
      if (R() < 0.45) lit(nearWindows, x, GROUND + 14 + r * 22, 6, 9);
    }
  }
  const catX = Math.min(L.right - 26, L.rightMid + 96);
  const cat = el("g", {}, back);
  const catBody = el("g", { fill: "url(#space-fill-near)" }, cat);
  el("ellipse", { cx: 0, cy: -6, rx: 7, ry: 6.5 }, catBody);
  el("circle", { cx: 6.5, cy: -12, r: 4.6 }, catBody);
  el("path", { d: "M3.4,-15 L4,-20.5 L7.4,-16.4 Z M7.6,-16.6 L10.6,-20.5 L10.4,-14.8 Z" }, catBody);
  const catTail = el("g", {}, cat);
  strokers.push(
    el("path", { d: "M-6,-3 C-14,-2 -15,-10 -11,-13", fill: "none", "stroke-width": 2.2, "stroke-linecap": "round" }, catTail)
  );
  const catEyes = el("g", { fill: "#ffe27a" }, cat);
  el("circle", { cx: 7.6, cy: -12.6, r: 0.95 }, catEyes);
  el("circle", { cx: 9.6, cy: -12.6, r: 0.95 }, catEyes);

  /* ---------- the F1 car, in front of everything ---------- */
  const car = el("g", {}, fore);
  el("ellipse", { cx: 6, cy: 0.5, rx: 46, ry: 3, fill: "rgba(0,0,0,.28)" }, car);
  const body = el("g", { transform: "scale(.92)" }, car);
  el("rect", { x: -33, y: -25, width: 10, height: 2.6, rx: 1, fill: "#b52a10" }, body);
  el("rect", { x: -29.5, y: -23, width: 2.2, height: 11, fill: "#6e1807" }, body);
  el(
    "path",
    { d: "M-28,-7 L-25,-15 L-9,-16.5 L1,-20 L12,-20 L19,-14 L40,-10.5 L43,-6.5 L40,-5 L-28,-5 Z", fill: "#e03516" },
    body
  );
  el("path", { d: "M-15,-16 L-10,-23 L-2,-23 L0,-16.5 Z", fill: "#c42c10" }, body);
  el("rect", { x: 3, y: -19, width: 11, height: 3.2, rx: 1.4, fill: "#241418" }, body);
  el("circle", { cx: 8.5, cy: -22, r: 3.8, fill: "#ffe8c0" }, body);
  el("rect", { x: 6, y: -23.2, width: 5, height: 1.8, rx: 0.9, fill: "#241418" }, body);
  el("rect", { x: 37, y: -4.4, width: 13, height: 2.4, rx: 1, fill: "#b52a10" }, body);
  el("path", { d: "M-20,-9.5 L36,-8.5", stroke: "#fff3e0", "stroke-width": 1.3, fill: "none" }, body);
  const wheels = [-17, 27].map((cx) => {
    const wheel = el("g", { transform: `translate(${cx},-6.2)` }, body);
    el("circle", { r: 6.2, fill: "#14101a" }, wheel);
    el("circle", { r: 2.7, fill: "#8c8794" }, wheel);
    el("path", { d: "M-2.7,0 H2.7 M0,-2.7 V2.7", stroke: "#14101a", "stroke-width": 0.9 }, wheel);
    return wheel;
  });
  const gantry = el("g", { opacity: 0 }, car);
  for (let i = 0; i < 5; i++) {
    el("circle", { cx: (i - 2) * 8 + 8, cy: -44, r: 3.2, fill: "#2a1418" }, gantry);
  }
  hit(car, -36, -32, 90, 36);

  const refs: SceneRefs = {
    layout,
    skyStops,
    paint,
    farGroup,
    midGroup,
    strokers,
    canvas,
    sun,
    glow,
    moon,
    stars,
    twinkle,
    lit: litGroups,
    clouds,
    lanterns,
    birdsGroup,
    birds,
    kite,
    kiteBody,
    kiteString,
    bulbs,
    chess,
    brush,
    cat,
    catTail,
    catEyes,
    catX,
    car,
    wheels,
    carDash: 0,
    carBusy: false,
    shootGroup,
    shootLine,
  };

  car.addEventListener("click", () => {
    if (refs.carBusy) return;
    refs.carBusy = true;
    gantry.setAttribute("opacity", "1");
    const lamps = Array.from(gantry.children);
    lamps.forEach((lamp, i) => ctx.later(() => lamp.setAttribute("fill", "#ff2d14"), i * 230));
    ctx.later(() => {
      lamps.forEach((lamp) => lamp.setAttribute("fill", "#2a1418"));
      gantry.setAttribute("opacity", "0");
      const start = performance.now();
      const go = (now: number) => {
        if (!ctx.isAlive()) return;
        const k = (now - start) / 2200;
        refs.carDash = k < 0.28 ? 440 * Math.pow(k / 0.28, 3) : 440 * (1 - smooth(clamp((k - 0.28) / 0.72)));
        placeCar(refs, ctx.currentT());
        if (k < 1) {
          ctx.nextFrame(go);
        } else {
          refs.carDash = 0;
          refs.carBusy = false;
          placeCar(refs, ctx.currentT());
        }
      };
      go(start);
    }, 5 * 230 + 420);
  });

  return refs;
}

function carX(s: SceneRefs, t: number): number {
  const L = s.layout;
  return L.left + 34 + (L.visibleWidth - 34 - 130) * t + s.carDash;
}

function placeCar(s: SceneRefs, t: number) {
  const x = carX(s, t);
  s.car.setAttribute("transform", `translate(${x.toFixed(1)},${(GROUND - Math.abs(Math.sin(x / 9)) * 0.5).toFixed(1)})`);
  s.wheels.forEach((wheel, i) => {
    wheel.setAttribute("transform", `translate(${i ? 27 : -17},-6.2) rotate(${((x / 6) * 57.3).toFixed(0)})`);
  });
}

function piecePosition(p: ChessPiece, t: number): Point {
  let x = p.x;
  let y = p.y;
  let lift = 0;
  for (const seg of p.segs) {
    if (t >= seg.t1) {
      [x, y] = seg.to;
      continue;
    }
    if (t > seg.t0) {
      const u = smooth((t - seg.t0) / (seg.t1 - seg.t0));
      x = lerp(seg.from[0], seg.to[0], u);
      y = lerp(seg.from[1], seg.to[1], u);
      lift = Math.sin(u * Math.PI) * 4;
    }
    break;
  }
  return [x, y - lift];
}

function applyFrame(s: SceneRefs, f: SceneFrame, reduced: boolean) {
  const { layout: L } = s;
  const { t, energy, velocity, palette: p } = f;
  /* the phase that drives every wiggle; frozen when motion is reduced */
  const phase = reduced ? 0 : f.scrollY;

  put(s.skyStops[0], "stop-color", rgb(p.top));
  put(s.skyStops[1], "stop-color", rgb(p.mid));
  put(s.skyStops[2], "stop-color", rgb(p.hor));
  put(s.paint.far, "stop-color", rgb(p.far));
  put(s.paint.mid, "stop-color", rgb(p.midL));
  const near = rgb(p.near);
  put(s.paint.near, "stop-color", near);
  put(s.paint.charminar, "stop-color", rgb(mix3(mix3(p.far, p.midL, 0.55), [201, 150, 92], p.win * 0.5)));
  for (const stroker of s.strokers) put(stroker, "stroke", near);
  put(s.canvas.top, "fill", rgb(p.top));
  put(s.canvas.mid, "fill", rgb(p.mid));
  put(s.canvas.hor, "fill", rgb(p.hor));
  put(s.canvas.sky, "fill", near);
  /* windows light up one by one as it gets dark */
  for (const group of s.lit) {
    const value = clamp((t - group.th) * 22).toFixed(2);
    if (value === group.last) continue;
    group.last = value;
    group.e.setAttribute("opacity", value);
  }

  /* depth: the farther the layer, the less it drifts as you scroll */
  const drift = reduced ? 0 : 1;
  put(s.farGroup, "transform", `translate(0,${(t * 12 * drift).toFixed(1)})`);
  const sink = t * 24 * drift;
  put(s.midGroup, "transform", `translate(0,${sink.toFixed(1)})`);

  /* what is out of sight is left alone: the sun after dusk, the moon and the stars by day */
  if (p.sun > 0.002) {
    put(s.sun, "cy", String(p.sunY));
    put(s.glow, "cy", String(p.sunY));
  }
  put(s.sun, "opacity", String(p.sun));
  put(s.glow, "opacity", String(Math.min(1, p.sun * 1.1)));
  if (p.moon > 0.002) {
    put(
      s.moon,
      "transform",
      `translate(${(L.rightMid + 8).toFixed(1)},${lerp(340, 150, smooth(clamp((t - 0.4) / 0.6))).toFixed(1)})`
    );
  }
  put(s.moon, "opacity", String(p.moon));
  put(s.stars, "opacity", String(p.stars));
  if (!reduced && p.stars > 0.002) {
    s.twinkle.forEach(([star, base], i) => {
      put(star, "opacity", (base * (0.55 + 0.45 * Math.sin(phase / 46 + i * 2.1))).toFixed(2));
    });
  }

  /* clouds: warm along the underside while the sun is up, then they cool and thin out */
  const light = clamp(p.sun / 0.9);
  s.clouds.forEach((cloud) => {
    const x = cloud.x - t * 130 * cloud.depth * drift;
    put(cloud.e, "transform", `translate(${x.toFixed(1)},${cloud.y.toFixed(1)})`);
    const base = mix3(p.mid, p.hor, 0.2 + 0.4 * cloud.low);
    put(cloud.bodyColor, "stop-color", rgb(mix3(base, [255, 226, 205], 0.1 + 0.18 * light)));
    put(cloud.glow, "opacity", (0.85 * light).toFixed(2));
    put(cloud.e, "opacity", lerp(0.4, 0.92, light).toFixed(2));
  });

  /* lanterns drift up with the scroll and glow brighter as it gets dark */
  s.lanterns.forEach((lantern) => {
    const y = lantern.y - t * 150 * lantern.depth * drift;
    put(lantern.e, "transform", `translate(${lantern.x.toFixed(1)},${y.toFixed(1)})`);
    put(lantern.glow, "opacity", lerp(0.45, 1, 1 - light).toFixed(2));
  });

  /* birds cross the sky by day: from the left as the page opens, off to the right as you scroll */
  put(s.birdsGroup, "opacity", String(p.birds));
  if (p.birds > 0.004) {
    const flockX = lerp(L.left + L.visibleWidth * 0.16, L.right + 120, clamp(t / 0.55));
    s.birds.forEach((bird, i) => {
      const x = flockX + bird.dx;
      const y = bird.y + Math.sin(phase / 90 + i) * 4 * drift;
      put(bird.e, "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${bird.scale.toFixed(2)})`);
    });
  }

  /* kite: climbs as the evening goes, bobs with the scroll, leans with a fast one */
  const tilt = reduced ? 0 : clamp(velocity * 0.5, -12, 12);
  const kx = L.leftMid + 20 + Math.sin(phase / 190) * 14;
  const ky = lerp(560, 430, smooth(t)) + Math.sin(phase / 140) * 9;
  put(s.kiteBody, "transform", `translate(${kx.toFixed(1)},${ky.toFixed(1)}) rotate(${tilt.toFixed(1)})`);
  const ax = L.leftMid + 46;
  const ay = 744 + sink;
  put(
    s.kiteString,
    "d",
    `M${ax.toFixed(1)},${ay.toFixed(1)} Q${((ax + kx) / 2 - 14 - tilt).toFixed(1)},${((ay + ky) / 2 + 22).toFixed(1)} ${kx.toFixed(1)},${(ky + 27).toFixed(1)}`
  );
  put(s.kite, "opacity", (1 - clamp((t - 0.3) * 1.3) * 0.55).toFixed(2));

  /* string lights and cat eyes come on as it gets dark */
  s.bulbs.forEach(([bulb, threshold], i) => {
    const flicker = reduced ? 1 : 0.72 + 0.28 * Math.sin(phase / 38 + i * 1.6);
    put(bulb, "opacity", (clamp((t - threshold) * 22) * flicker).toFixed(2));
  });
  put(s.catEyes, "opacity", clamp((t - 0.32) * 6).toFixed(2));

  /* chess: pieces travel with the scroll, the player whose move it is leans in */
  const chess = s.chess;
  const reach: [number, number] = [0, 0];
  for (const move of chess.moves) {
    const b = Math.sin(clamp((t - move.t0) / (move.t1 - move.t0)) * Math.PI);
    if (b > reach[move.side]) reach[move.side] = b;
  }
  chess.tip += (chess.tipTo - chess.tip) * 0.18;
  if (Math.abs(chess.tipTo - chess.tip) < 0.002) chess.tip = chess.tipTo;
  for (const piece of chess.pieces) {
    const [x, y] = piecePosition(piece, t);
    const angle = piece === chess.king ? chess.tip * 84 : 0;
    put(piece.e, "transform", `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(1)})`);
  }
  chess.arms.forEach((a, i) => {
    const b = reach[i];
    put(a.upper, "transform", `rotate(${(15 * b).toFixed(1)},0,${a.hipY})`);
    put(
      a.arm,
      "d",
      `M1.6,${a.hipY - 17} L${(11 + 6 * b).toFixed(1)},${(a.hipY - 16.2 + 0.8 * b).toFixed(1)}`
    );
  });

  /* painter: the brush strokes as long as you scroll */
  put(s.brush, "transform", `rotate(${(Math.sin(phase / 15) * (2 + 14 * energy)).toFixed(1)},9,-30)`);

  /* cat: watches the car go by, tail swishes with the scroll */
  const facing = carX(s, t) < s.catX - 8 ? -1 : 1;
  put(s.cat, "transform", `translate(${s.catX.toFixed(1)},${GROUND - 1}) scale(${(facing * 1.3).toFixed(2)},1.3)`);
  put(s.catTail, "transform", `rotate(${(Math.sin(phase / 34) * (5 + 16 * energy)).toFixed(1)},-6,-3)`);

  placeCar(s, t);
}

export function createSpaceScene(opts: SpaceSceneOptions): SpaceScene {
  let reduced = opts.reducedMotion;
  let alive = true;
  let refs: SceneRefs | null = null;
  let lastFrame: SceneFrame | null = null;
  const timers = new Set<number>();
  const frames = new Set<number>();

  const ctx: BuildContext = {
    opts,
    later: (fn, ms) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (alive) fn();
      }, ms);
      timers.add(id);
    },
    nextFrame: (fn) => {
      const id = window.requestAnimationFrame((now) => {
        frames.delete(id);
        fn(now);
      });
      frames.add(id);
    },
    isAlive: () => alive,
    currentT: () => lastFrame?.t ?? 0,
  };

  const build = () => {
    refs = buildScene(ctx, computeLayout(opts.wall));
    opts.onLayout(refs.layout.groundPx);
    if (lastFrame) applyFrame(refs, lastFrame, reduced);
  };
  build();

  const shootTimer = window.setInterval(() => {
    if (!refs || reduced || (lastFrame?.t ?? 0) < 0.6) return;
    const { left, right } = refs.layout;
    const x = left + 80 + Math.random() * Math.max(0, right - left - 380);
    const y = 40 + Math.random() * 190;
    refs.shootGroup.setAttribute("transform", `translate(${x.toFixed(0)},${y.toFixed(0)})`);
    refs.shootLine.animate(
      [
        { transform: "translate(0px,0px)", opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: "translate(250px,106px)", opacity: 0 },
      ],
      { duration: 1000, easing: "ease-in" }
    );
  }, 11000);

  return {
    update(frame) {
      lastFrame = frame;
      if (refs) applyFrame(refs, frame, reduced);
    },
    rebuild: build,
    setReducedMotion(next) {
      reduced = next;
      if (refs && lastFrame) applyFrame(refs, lastFrame, reduced);
    },
    get animating() {
      return refs ? refs.chess.tip !== refs.chess.tipTo : false;
    },
    destroy() {
      alive = false;
      window.clearInterval(shootTimer);
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      timers.clear();
      frames.clear();
      opts.back.textContent = "";
      opts.fore.textContent = "";
      refs = null;
    },
  };
}
