// PLACEHOLDER ART for the T6b prototype. Not final art: shapes are blobs and scribbles whose job is to match
// proto/fidelity.json (halftone fill area per scene and rig, no live filters, red-all at real extent under
// eraser-mask, rendered nodes per frame including <use> targets). Everything is built at load from a seeded PRNG
// so numbers are reproducible. Production art is prerendered, not generated; that difference does not affect
// what the browser has to paint, but it is a difference.
import type { Rig } from './config';

export const C = {
  ink: '#101014', char: '#19191F', burg: '#481C2A', red: '#F04452',
  paper: '#F1EBDD', grey: '#77747B', yellow: '#F5D547', skin: '#B87A5E', night: '#1B1A26',
} as const;
export type Col = 'ink' | 'burg' | 'red' | 'grey' | 'yellow' | 'skin';
export type Dens = 15 | 35 | 60;
const NS = 'http://www.w3.org/2000/svg';

export function el<K extends keyof SVGElementTagNameMap>(
  tag: K, attrs: Record<string, string | number> = {}, parent?: Element | null,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent?.appendChild(e);
  return e;
}

export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const count = (n: Element) => n.querySelectorAll('*').length;

// ---- geometry ---------------------------------------------------------------------------------
export interface Rect { x: number; y: number; w: number; h: number }

/** World-space frame of a hold: scale s, camera centre (cx, cy). Screen fractions map to world units. */
export class Frame {
  constructor(readonly W: number, readonly H: number, readonly s: number, readonly cx: number, readonly cy: number) {}
  x(f: number) { return this.cx + (f - 0.5) * this.W / this.s; }
  y(f: number) { return this.cy + (f - 0.5) * this.H / this.s; }
  w(f: number) { return f * this.W / this.s; }
  h(f: number) { return f * this.H / this.s; }
  rect(f: Rect): Rect { return { x: this.x(f.x), y: this.y(f.y), w: this.w(f.w), h: this.h(f.h) }; }
  get bounds(): Rect { return { x: this.x(0), y: this.y(0), w: this.w(1), h: this.h(1) }; }
}

export const HOLD_SCALE = { s3: 3.2, s4: 2.0, s5: 0.45, s6: 1.3 } as const;

// ---- planes -----------------------------------------------------------------------------------
export interface Plane { id: string; scene: string; depth: number; g: SVGGElement }
export interface Art {
  rig: Rig; W: number; H: number; narrow: boolean; pitchPx: number;
  defs: SVGDefsElement;
  planes: Plane[];
  byScene: Record<string, Plane[]>;
  plane(id: string): Plane;
  frames: { f3: Frame; f4: Frame; f5: Frame; f6: Frame };
  c5: { x: number; y: number }; c6: { x: number; y: number };
  palm: { x: number; y: number };
  rigG: SVGGElement; walkFrames: SVGGElement[]; poses: Record<string, SVGGElement>;
  rigHome: { x: number; y: number };
  eraser: SVGCircleElement; redAll: SVGGElement; roughs: { g: SVGGElement; x: number; y: number }[];
  redBox: Rect; maskRect: Rect;
  lights: SVGElement[]; sky: SVGRectElement; wallL: SVGGElement; wallR: SVGGElement;
  crumbs: SVGElement[]; flash: SVGElement[]; jacket: SVGElement[]; window5: SVGGElement;
  mullion: SVGGElement; s6Interior: SVGGElement;
  htGroups: Record<string, SVGGElement[]>;
  stats: { regions: Record<string, Rect[]>; tierFlat: boolean };
}

export interface ArtOptions { rig: Rig; W: number; H: number; lite: boolean; cuts: number[]; filters: boolean }

// ---- budgets ----------------------------------------------------------------------------------
// Targets from proto/fidelity.json. Node split differs from `sceneSplitGuide` where the per-frame gate
// (0.9-1.0x of nodes.perFrame at EVERY sampled frame, panels included) cannot be met with the guide: see report.
const NODES = {
  wide: { s3: 980, s4: 1200, s5: 2000, s6: 1000, s7: 1200, overhead: 200 },
  narrow: { s3: 560, s4: 720, s5: 1560, s6: 800, s7: 480, overhead: 140 },
};
const HALFTONE = {
  // share of viewport at the hold (fidelity.json halftoneFillArea)
  wide: { s3: 0.35, s4: 0.35, s4Red: 0.04, s5: 0.30, s6: 0.25 },
  narrow: { s3: 0.35, s4: 0.35, s4Red: 0.07, s5: 0.40, s6: 0.20 },
};
/** Aim slightly above target so hold-drift and clipping stay inside the 0.9-1.3x gate. */
const AIM = 1.0;

// ---- patterns ---------------------------------------------------------------------------------
function densStep(d: Dens, cuts: number[]): Dens {
  if (!cuts.includes(2)) return d;
  return d === 60 ? 35 : 15;
}

class PatternBook {
  private ids = new Set<string>();
  constructor(private defs: SVGDefsElement, private pitchPx: number) {}
  /** Production spec: round dots, 45 degrees, densities 15/35/60 %, world pitch = on-screen pitch at the hold / hold scale. */
  get(scene: keyof typeof HOLD_SCALE, col: Col, dens: Dens): string {
    const id = `ht-${scene}-${col}-${dens}`;
    if (!this.ids.has(id)) {
      this.ids.add(id);
      const p = this.pitchPx / HOLD_SCALE[scene];
      const r = p * Math.sqrt(dens / 100 / Math.PI);
      const pat = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: p, height: p, patternTransform: 'rotate(45)' }, this.defs);
      el('circle', { cx: p / 2, cy: p / 2, r, fill: C[col] }, pat);
    }
    return id;
  }
}

// ---- helpers ----------------------------------------------------------------------------------
function blob(r: Rect, rnd: () => number, k = 16): string {
  const pts: string[] = [];
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    const f = i % 4 === 0 ? 1 : 0.86 + 0.14 * rnd();
    pts.push(`${(cx + Math.cos(a) * (r.w / 2) * f).toFixed(1)},${(cy + Math.sin(a) * (r.h / 2) * f).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

interface Spec { plane: string; cx: number; cy: number; aspect: number; wt: number; dens: Dens; col: Col }

/** Move `r` (screen fractions) out of `avoid` by the smallest shift that stays inside the frame. */
function pushOut(r: Rect, avoid: Rect): Rect {
  const ox = Math.min(r.x + r.w, avoid.x + avoid.w) - Math.max(r.x, avoid.x);
  const oy = Math.min(r.y + r.h, avoid.y + avoid.h) - Math.max(r.y, avoid.y);
  if (ox <= 0 || oy <= 0) return r;
  const cands = [
    { x: avoid.x - r.w, y: r.y }, { x: avoid.x + avoid.w, y: r.y },
    { x: r.x, y: avoid.y - r.h }, { x: r.x, y: avoid.y + avoid.h },
  ].filter((c) => c.x >= 0.01 && c.y >= 0.01 && c.x + r.w <= 0.99 && c.y + r.h <= 0.99);
  if (!cands.length) return r;
  cands.sort((a, b) => Math.hypot(a.x - r.x, a.y - r.y) - Math.hypot(b.x - r.x, b.y - r.y));
  return { ...r, x: cands[0].x, y: cands[0].y };
}

/** Lay out region rects (screen fractions) so that their areas sum to `target` of the viewport. */
function fit(specs: Spec[], target: number, avoid?: Rect): Rect[] {
  const wsum = specs.reduce((a, s) => a + s.wt, 0);
  let k = target;
  let rects: Rect[] = [];
  for (let it = 0; it < 24; it++) {
    rects = specs.map((s) => {
      const area = (s.wt / wsum) * k;
      let w = Math.sqrt(area * s.aspect), h = Math.sqrt(area / s.aspect);
      w = Math.min(w, 0.98); h = Math.min(h, 0.98);
      const x = Math.min(Math.max(s.cx - w / 2, 0.01), 0.99 - w);
      const y = Math.min(Math.max(s.cy - h / 2, 0.01), 0.99 - h);
      const r = { x, y, w, h };
      return avoid ? pushOut(r, avoid) : r;
    });
    const A = rects.reduce((a, r) => a + r.w * r.h, 0);
    if (Math.abs(A - target) < 1e-4) break;
    k *= target / A;
  }
  return rects;
}

function leaf(parent: Element, rnd: () => number, r: Rect, sc: number, cols: string[]) {
  const t = rnd();
  const col = cols[Math.floor(rnd() * cols.length)];
  const x = r.x + rnd() * r.w, y = r.y + rnd() * r.h;
  const L = (4 + rnd() * 14) / sc;
  if (t < 0.55) {
    const a = rnd() * Math.PI * 2;
    el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(a) * L).toFixed(1)} ${(Math.sin(a) * L).toFixed(1)}`, stroke: col, 'stroke-width': (1.2 / sc).toFixed(2), 'stroke-linecap': 'round', fill: 'none' }, parent);
  } else if (t < 0.75) {
    el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: ((1 + rnd() * 2.5) / sc).toFixed(2), fill: col }, parent);
  } else if (t < 0.9) {
    el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: (L * 0.6).toFixed(1), height: (L * 0.4).toFixed(1), fill: col }, parent);
  } else {
    el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)}l${L.toFixed(1)} ${(rnd() * L).toFixed(1)}l${(-rnd() * L).toFixed(1)} ${L.toFixed(1)}z`, fill: col }, parent);
  }
}

/** Exactly n new elements (groups of <=24 leaves, group nodes included in n). */
function detail(parent: Element, n: number, r: Rect, sc: number, rnd: () => number, cols: string[]) {
  let left = n;
  while (left > 0) {
    if (left <= 2) { leaf(parent, rnd, r, sc, cols); left--; continue; }
    const k = Math.min(24, left - 1);
    const g = el('g', {}, parent);
    for (let i = 0; i < k; i++) leaf(g, rnd, r, sc, cols);
    left -= 1 + k;
  }
}

function fillPlanes(planes: Plane[], rects: Rect[], sc: number, budget: number, rnd: () => number, cols: string[]) {
  const have = planes.reduce((a, p) => a + 1 + count(p.g), 0);
  let n = budget - have;
  if (n < 0) { console.warn('[proto] over node budget', planes[0]?.id, have, budget); return; }
  planes.forEach((p, i) => {
    const share = i === planes.length - 1 ? n : Math.floor((n * (1 / planes.length)));
    detail(p.g, share, rects[i % rects.length], sc, rnd, cols);
    n -= share;
  });
}

// ---- main builder -----------------------------------------------------------------------------
export function buildArt(o: ArtOptions): Art {
  const { rig, W, H, lite, cuts } = o;
  const narrow = rig === 'S' || rig === 'P';
  const pitchPx = narrow ? 4 : 6;
  const NB = narrow ? NODES.narrow : NODES.wide;
  const HT = narrow ? HALFTONE.narrow : HALFTONE.wide;
  const rnd = mulberry(0x0201 + (narrow ? 7 : 0));

  const defs = el('defs');
  const book = new PatternBook(defs, pitchPx);

  const f4 = new Frame(W, H, HOLD_SCALE.s4, 0, 0);
  const c5 = { x: 0.35 * W, y: 0 };
  const f5 = new Frame(W, H, HOLD_SCALE.s5, c5.x, c5.y);
  const c6 = { x: c5.x + (0.82 - 0.5) * W / HOLD_SCALE.s5, y: c5.y + (0.78 - 0.5) * H / HOLD_SCALE.s5 };
  const f6 = new Frame(W, H, HOLD_SCALE.s6, c6.x, c6.y);
  const f3 = new Frame(W, H, HOLD_SCALE.s3, -1.25 * W, 0);

  // planes in z order (back to front)
  const planeDefs: [string, string, number][] = [
    ['s3-mid', '3', 1], ['s5-far', '5', 0.3], ['s5-mid', '5', 1], ['s6-mid', '6', 1], ['s4-wall', '4', 1.8],
    ['s4-mid', '4', 1], ['red-all', 'red', 1], ['s5-near', '5', 1.6], ['rig', 'rig', 1], ['fx', 'fx', 1], ['s6-near', '6', 3],
  ];
  const planes: Plane[] = planeDefs.map(([id, scene, depth]) => ({
    id, scene, depth, g: el('g', { 'data-plane': id, 'data-depth': depth, 'data-scene': scene }),
  }));
  const byScene: Record<string, Plane[]> = {};
  for (const p of planes) (byScene[p.scene] ??= []).push(p);
  const plane = (id: string) => planes.find((p) => p.id === id)!;

  // halftone groups (fill swapped between pattern and flat tint at hand-over)
  const htGroups: Record<string, SVGGElement[]> = {};
  const htCache = new Map<string, SVGGElement>();
  const regionsLog: Record<string, Rect[]> = {};

  function htGroup(parent: Element, key: string, scene: keyof typeof HOLD_SCALE, col: Col, dens0: Dens, flat: boolean): SVGGElement {
    const dens = densStep(dens0, cuts);
    const ck = `${key}|${scene}|${col}|${dens}`;
    const hit = htCache.get(ck);
    if (hit) return hit;
    const id = book.get(scene, col, dens);
    const g = el('g', {
      'data-ht': scene, 'data-dens': dens, 'data-pat': `url(#${id})`, 'data-flat': C[col], 'data-op': dens / 100,
      fill: `url(#${id})`, 'data-fm': flat ? 1 : 0,
    }, parent);
    g.style.setProperty('--flat', C[col]);
    g.style.setProperty('--op', String(dens / 100));
    (htGroups[scene] ??= []).push(g);
    htCache.set(ck, g);
    return g;
  }

  function addRegions(scene: keyof typeof HOLD_SCALE, f: Frame, specs: Spec[], target: number, aim = AIM, avoid?: Rect) {
    const nonRed = fit(specs, target * aim, avoid);
    const log: Rect[] = [];
    specs.forEach((s, i) => {
      const fr = nonRed[i];
      const wr = f.rect(fr);
      const p = plane(s.plane);
      const liteFlat = lite && p.depth < 0.5;
      const flat = liteFlat || (scene === 's5' && narrow);
      const g = htGroup(p.g, s.plane, scene, s.col, s.dens, flat);
      if (liteFlat) g.setAttribute('data-keepflat', '1');
      el('path', { d: blob(wr, rnd) }, g);
      log.push(fr);
    });
    regionsLog[scene] = log;
  }

  const dy = narrow ? 0.24 : 0; // S/P framing: chest-led crop, figure lower in the hold
  const darkCols = [C.ink, C.char, '#2C2B38', C.burg, '#4A4852'];

  // ============================ S3 stand-in (mounted neighbour at s4 hold) ============================
  el('rect', { ...rectAttrs(f3.rect({ x: 0, y: 0, w: 1, h: 1 })), fill: C.char, opacity: 0.9, 'data-layer': 's3-wall' }, plane('s3-mid').g);
  addRegions('s3', f3, [
    { plane: 's3-mid', cx: 0.72, cy: 0.4, aspect: 0.8, wt: 0.45, dens: 35, col: 'skin' },
    { plane: 's3-mid', cx: 0.45, cy: 0.72, aspect: 1.1, wt: 0.2, dens: 35, col: 'skin' },
    { plane: 's3-mid', cx: 0.18, cy: 0.4, aspect: 0.5, wt: 0.2, dens: 60, col: 'ink' },
    { plane: 's3-mid', cx: 0.4, cy: 0.2, aspect: 2.5, wt: 0.15, dens: 15, col: 'burg' },
  ], HT.s3);
  fillPlanes(byScene['3'], [f3.bounds], HOLD_SCALE.s3, NB.s3, rnd, darkCols);

  // ============================ S4 =====================================================================
  // alley walls (slide out in t45), beam, organs, jacket
  const wallL = el('g', { 'data-layer': 's4-wall-l' }, plane('s4-wall').g);
  const wallR = el('g', { 'data-layer': 's4-wall-r' }, plane('s4-wall').g);
  el('rect', { ...rectAttrs(f4.rect({ x: -0.6, y: -0.1, w: 0.72, h: 1.2 })), fill: C.char }, wallL);
  el('rect', { ...rectAttrs(f4.rect({ x: 0.88, y: -0.1, w: 0.72, h: 1.2 })), fill: C.char }, wallR);
  el('rect', { ...rectAttrs(f4.rect({ x: 0.1, y: 0.82, w: 0.8, h: 0.2 })), fill: C.ink }, plane('s4-mid').g);
  el('rect', { ...rectAttrs(f4.rect({ x: 0.34, y: 0.1, w: 0.2, h: 0.8 })), fill: C.paper, opacity: 0.16, 'data-layer': 's4-beam' }, plane('s4-mid').g);
  const jacketFlat = [
    el('path', { d: blob(f4.rect({ x: 0.42, y: 0.52 + dy, w: 0.24, h: 0.3 }), rnd, 12), fill: C.char, 'data-layer': 's4-jacket-a' }, plane('s4-mid').g),
    el('path', { d: blob(f4.rect({ x: 0.43, y: 0.54 + dy, w: 0.22, h: 0.26 }), rnd, 12), fill: C.burg, opacity: 0, 'data-layer': 's4-jacket-b' }, plane('s4-mid').g),
  ];
  // Split specs between walls and mid. Red-dot halftone goes into red-all (below).
  const s4NonRed = HT.s4 - HT.s4Red;
  const specs4: Spec[] = [
    { plane: 's4-wall', cx: 0.1, cy: 0.5, aspect: 0.4, wt: 0.05, dens: 35, col: 'ink' },
    { plane: 's4-wall', cx: 0.92, cy: 0.5, aspect: 0.4, wt: 0.05, dens: 35, col: 'ink' },
    { plane: 's4-mid', cx: 0.36, cy: 0.5, aspect: 0.12, wt: 0.04, dens: 15, col: 'grey' },
    { plane: 's4-mid', cx: 0.40, cy: 0.5, aspect: 0.12, wt: 0.03, dens: 35, col: 'grey' },
    { plane: 's4-mid', cx: 0.44, cy: 0.5, aspect: 0.12, wt: 0.03, dens: 15, col: 'grey' },
    { plane: 's4-mid', cx: 0.47, cy: 0.40 + dy, aspect: 0.9, wt: 0.05, dens: 35, col: 'burg' },
    { plane: 's4-mid', cx: 0.60, cy: 0.40 + dy, aspect: 0.8, wt: 0.05, dens: 35, col: 'burg' },
    { plane: 's4-mid', cx: 0.54, cy: 0.5 + dy, aspect: 1, wt: 0.035, dens: 60, col: 'burg' },
    { plane: 's4-mid', cx: 0.54, cy: 0.68 + dy * 0.5, aspect: 1.1, wt: 0.06, dens: 60, col: 'ink' },
  ];
  // S4 aims below target: t45's cap (35 %) equals S4's target and t45 shows the S4 hold for its first third
  addRegions('s4', f4, specs4, s4NonRed, 0.95);
  fillPlanes(byScene['4'], [f4.rect({ x: 0.05, y: 0.1, w: 0.9, h: 0.85 })], HOLD_SCALE.s4, NB.s4, rnd, darkCols);

  // ============================ S5 =====================================================================
  const s5spec: Spec[] = narrow ? [
    { plane: 's5-mid', cx: 0.5, cy: 0.74, aspect: 2.5, wt: 0.5, dens: 60, col: 'ink' },
    { plane: 's5-far', cx: 0.1, cy: 0.45, aspect: 0.35, wt: 0.12, dens: 35, col: 'ink' },
    { plane: 's5-far', cx: 0.9, cy: 0.45, aspect: 0.35, wt: 0.12, dens: 35, col: 'ink' },
    { plane: 's5-far', cx: 0.5, cy: 0.42, aspect: 12, wt: 0.04, dens: 15, col: 'burg' },
    { plane: 's5-mid', cx: 0.25, cy: 0.62, aspect: 1, wt: 0.03, dens: 35, col: 'yellow' },
    { plane: 's5-mid', cx: 0.75, cy: 0.62, aspect: 1, wt: 0.03, dens: 35, col: 'yellow' },
    { plane: 's5-mid', cx: 0.18, cy: 0.55, aspect: 0.5, wt: 0.06, dens: 35, col: 'ink' },
  ] : [
    { plane: 's5-mid', cx: 0.5, cy: 0.86, aspect: 5, wt: 0.30, dens: 60, col: 'ink' },
    { plane: 's5-far', cx: 0.12, cy: 0.55, aspect: 0.5, wt: 0.12, dens: 35, col: 'ink' },
    { plane: 's5-far', cx: 0.88, cy: 0.55, aspect: 0.5, wt: 0.12, dens: 35, col: 'ink' },
    { plane: 's5-far', cx: 0.5, cy: 0.72, aspect: 14, wt: 0.05, dens: 15, col: 'burg' },
    { plane: 's5-mid', cx: 0.3, cy: 0.78, aspect: 1, wt: 0.02, dens: 35, col: 'yellow' },
    { plane: 's5-mid', cx: 0.62, cy: 0.76, aspect: 1, wt: 0.02, dens: 35, col: 'yellow' },
    { plane: 's5-mid', cx: 0.2, cy: 0.62, aspect: 0.6, wt: 0.06, dens: 35, col: 'ink' },
    { plane: 's5-mid', cx: 0.8, cy: 0.62, aspect: 0.6, wt: 0.06, dens: 35, col: 'ink' },
  ];
  // sky (flat, grows in t45), horizon, moon, avenue lights (switch on toward the horizon), distant window
  const sky = el('rect', { ...rectAttrs({ x: f5.x(-0.3), y: f5.y(-0.3), w: f5.w(1.6), h: f5.h(0.3 + 0.72) }), fill: C.night, 'data-layer': 's5-sky' }, plane('s5-far').g);
  el('circle', { cx: f5.x(0.84), cy: f5.y(0.15), r: f5.w(0.03), fill: C.paper, opacity: 0.85 }, plane('s5-far').g);
  // S5 halftone stays out of the zone that is the S4 hold's view (world +-0.29 viewport) so it is never on screen at s4
  const av5: Rect = { x: 0.5 + (-0.29 * W - c5.x) * HOLD_SCALE.s5 / W, y: 0.5 + (-0.29 * H - c5.y) * HOLD_SCALE.s5 / H, w: 0.58 * HOLD_SCALE.s5, h: 0.58 * HOLD_SCALE.s5 };
  addRegions('s5', f5, s5spec, HT.s5, narrow ? 0.93 : 1.02, av5);
  const lights: SVGElement[] = [];
  const lg = el('g', { 'data-layer': 's5-lights' }, plane('s5-mid').g);
  const nl = narrow ? 18 : 28;
  const horizon = narrow ? 0.40 : 0.72;
  for (let i = 0; i < nl; i++) {
    const t = i / (nl - 1); // 0 near, 1 at the horizon
    const side = i % 2 ? 1 : -1;
    const fx = 0.5 + side * (0.03 + 0.34 * (1 - t));
    const fy = (narrow ? 0.9 : 0.88) - (narrow ? 0.9 : 0.88 - horizon) * t - (narrow ? 0.5 * t : 0);
    lights.push(el('circle', { cx: f5.x(fx).toFixed(1), cy: f5.y(Math.max(fy, horizon)).toFixed(1), r: f5.w(0.004 + 0.007 * (1 - t)).toFixed(1), fill: C.yellow, opacity: 0, 'data-i': i }, lg));
  }
  const window5 = el('g', { 'data-layer': 's5-window-far' }, plane('s5-mid').g);
  el('rect', { ...rectAttrs(f5.rect({ x: 0.8, y: 0.74, w: 0.07, h: 0.07 })), fill: C.yellow, opacity: 0.8 }, window5);
  el('rect', { ...rectAttrs(f5.rect({ x: 0.8, y: 0.74, w: 0.07, h: 0.07 })), fill: 'none', stroke: C.ink, 'stroke-width': 2 / HOLD_SCALE.s5 }, window5);
  const nearG = plane('s5-near').g;
  for (let i = 0; i < 10; i++) el('path', { d: `M${f5.x(0.05 + i * 0.1)} ${f5.y(0.93)}v${f5.h(0.07)}`, stroke: C.ink, 'stroke-width': 3 / HOLD_SCALE.s5, fill: 'none' }, nearG);
  fillPlanes(byScene['5'], [f5.bounds], HOLD_SCALE.s5, NB.s5, rnd, darkCols);

  // ============================ S6 (interior sits at the window; flat tint while small) ==================
  const s6Interior = el('g', { 'data-layer': 's6-interior' }, plane('s6-mid').g);
  el('rect', { ...rectAttrs(f6.bounds), fill: C.ink }, s6Interior); // flat black shelves
  el('rect', { ...rectAttrs(f6.rect({ x: 0, y: 0.78, w: 1, h: 0.22 })), fill: C.char }, s6Interior);
  el('rect', { ...rectAttrs(f6.rect({ x: 0.55, y: 0.5, w: 0.1, h: 0.07 })), fill: C.paper }, s6Interior); // ID card
  addRegions('s6', f6, [
    { plane: 's6-mid', cx: 0.68, cy: 0.55, aspect: 0.7, wt: 0.45, dens: 35, col: 'ink' },
    { plane: 's6-mid', cx: 0.4, cy: 0.42, aspect: 1.8, wt: 0.25, dens: 15, col: 'yellow' },
    { plane: 's6-mid', cx: 0.2, cy: 0.72, aspect: 1.5, wt: 0.2, dens: 15, col: 'burg' },
    { plane: 's6-mid', cx: 0.5, cy: 0.84, aspect: 8, wt: 0.1, dens: 60, col: 'ink' },
  ], HT.s6, 1.04);
  // mullion + sign plane (fg, depth 3) sweeps the lens in t56
  const mullion = el('g', { 'data-layer': 's6-mullion' }, plane('s6-near').g);
  el('rect', { ...rectAttrs({ x: c6.x - f6.w(0.06), y: f6.y(-0.1), w: f6.w(0.12), h: f6.h(1.2) }), fill: C.ink }, mullion);
  el('rect', { ...rectAttrs({ x: c6.x - f6.w(0.4), y: f6.y(-0.1), w: f6.w(0.8), h: f6.h(0.16) }), fill: C.ink }, mullion);
  fillPlanes(byScene['6'], [f6.bounds, f6.bounds], HOLD_SCALE.s6, NB.s6, rnd, darkCols);

  // ============================ rig + fx ================================================================
  const figH = 0.32 * H;
  const rigHome = { x: f4.x(0.58), y: f4.y(0.52 + dy) };
  const rigPlane = plane('rig');
  const rigG = el('g', { 'data-rig': 'teen' }, rigPlane.g);
  const poses: Record<string, SVGGElement> = {};
  const walkFrames: SVGGElement[] = [];
  const palm = { x: rigHome.x + figH * 0.22, y: rigHome.y - figH * 0.12 };

  function figure(pose: string, walkIdx: number, visible: boolean): SVGGElement {
    const g = el('g', { 'data-pose': pose, style: visible ? '' : 'visibility:hidden' }, rigG);
    const u = figH / 10;
    el('circle', { cx: 0, cy: -4.3 * u, r: 0.8 * u, fill: C.skin }, g);
    el('path', { d: `M${-0.85 * u} ${-4.5 * u}q${0.85 * u} ${-1.1 * u} ${1.7 * u} 0z`, fill: C.ink }, g);
    el('path', { d: `M${-1 * u} ${-3.4 * u}h${2 * u}l${0.35 * u} ${3.4 * u}h${-2.7 * u}z`, fill: pose === 'sayno' || pose === 'front' ? C.char : C.burg, 'data-jacket': '1' }, g);
    const sw = Math.sin((walkIdx / 8) * Math.PI * 2);
    el('path', { d: `M${-0.5 * u} 0l${(-0.2 + sw * 0.9) * u} ${3.4 * u}`, stroke: C.ink, 'stroke-width': 0.7 * u, fill: 'none', 'stroke-linecap': 'round' }, g);
    el('path', { d: `M${0.5 * u} 0l${(0.2 - sw * 0.9) * u} ${3.4 * u}`, stroke: C.ink, 'stroke-width': 0.7 * u, fill: 'none', 'stroke-linecap': 'round' }, g);
    el('path', { d: `M${-1 * u} ${-3.2 * u}l${(-0.5 - sw * 0.5) * u} ${2.6 * u}`, stroke: C.skin, 'stroke-width': 0.45 * u, fill: 'none', 'stroke-linecap': 'round' }, g);
    if (pose === 'sayno') {
      el('path', { d: `M${1 * u} ${-3.2 * u}l${1.7 * u} ${-0.6 * u}`, stroke: C.skin, 'stroke-width': 0.45 * u, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: 2.8 * u, cy: -3.9 * u, r: 0.45 * u, fill: C.skin, 'data-layer': 'palm' }, g);
    } else {
      el('path', { d: `M${1 * u} ${-3.2 * u}l${(0.5 + sw * 0.5) * u} ${2.6 * u}`, stroke: C.skin, 'stroke-width': 0.45 * u, fill: 'none', 'stroke-linecap': 'round' }, g);
    }
    return g;
  }
  poses.front = figure('front', 0, true);
  poses.sayno = figure('sayno', 0, false);
  for (let i = 0; i < 8; i++) walkFrames.push(figure(`walk-${i + 1}`, i, false));
  // headphones: neck, then ears
  const hpNeck = el('g', { 'data-layer': 'hp-neck' }, rigG);
  el('path', { d: `M${-0.9 * (figH / 10)} ${-3.6 * (figH / 10)}q${0.9 * (figH / 10)} ${0.9 * (figH / 10)} ${1.8 * (figH / 10)} 0`, stroke: C.yellow, 'stroke-width': 0.3 * (figH / 10), fill: 'none' }, hpNeck);
  const hpEars = el('g', { 'data-layer': 'hp-ears', style: 'visibility:hidden' }, rigG);
  el('path', { d: `M${-0.85 * (figH / 10)} ${-4.3 * (figH / 10)}q${0.85 * (figH / 10)} ${-1.5 * (figH / 10)} ${1.7 * (figH / 10)} 0`, stroke: C.yellow, 'stroke-width': 0.3 * (figH / 10), fill: 'none' }, hpEars);
  poses.hpNeck = hpNeck; poses.hpEars = hpEars;

  const fx = plane('fx').g;
  const nCrumb = lite ? 6 : 12;
  const crumbs: SVGElement[] = [];
  for (let i = 0; i < nCrumb; i++) crumbs.push(el('circle', { cx: palm.x, cy: palm.y, r: 2.4 / HOLD_SCALE.s4 + rnd() * 2, fill: C.grey, opacity: 0, 'data-layer': 'crumb' }, fx));
  const flash = [
    el('circle', { cx: rigHome.x - figH * 0.085, cy: rigHome.y - figH * 0.43, r: figH * 0.05, fill: C.yellow, opacity: 0, 'data-layer': 'ear-flash' }, fx),
    el('circle', { cx: rigHome.x + figH * 0.085, cy: rigHome.y - figH * 0.43, r: figH * 0.05, fill: C.yellow, opacity: 0, 'data-layer': 'ear-flash' }, fx),
  ];
  // pad rig to its budget (overhead = camera g + rig + fx), with figure-local hatching
  const overheadUsed = 1 /* camera g, svg mode */ + 1 + count(fx) + 1 + 1;
  const rigRemain = NB.overhead - overheadUsed - count(rigG);
  detail(poses.front, Math.max(0, rigRemain), { x: -figH * 0.12, y: -figH * 0.45, w: figH * 0.24, h: figH * 0.9 }, HOLD_SCALE.s4, rnd, [C.ink, C.grey]);

  // ============================ red-all (own budget, ~600 nodes, real extent) ============================
  const redPlane = plane('red-all');
  const redAll = el('g', { id: 'red-all', 'data-layer': 'red-all' }, redPlane.g);
  const clusters = [
    { name: 's2', x0: -0.95 * W, x1: -0.5 * W, y0: -0.34 * H, y1: 0.3 * H, total: 200, nRough: 16, kind: 'scribble' },
    { name: 's3', x0: -0.5 * W, x1: -0.2 * W, y0: -0.3 * H, y1: 0.3 * H, total: 150, nRough: 12, kind: 'tally' },
    { name: 's4', x0: -0.2 * W, x1: 0.26 * W, y0: -0.2 * H, y1: 0.22 * H, total: 249, nRough: 20, kind: 'hatch' },
  ];
  const roughs: { g: SVGGElement; x: number; y: number }[] = [];
  const rr = mulberry(77);
  const redStroke = { stroke: C.red, 'stroke-linecap': 'round', fill: 'none' };
  for (const cl of clusters) {
    const cg = el('g', { 'data-cluster': cl.name }, redAll);
    let budget = cl.total - 1;
    let redDotNodes = 0;
    if (cl.name === 's4') {
      // red-dot halftone regions (4 % L / 7 % S of the viewport at the s4 hold), inside red-all, so they are masked
      const specsR: Spec[] = [
        { plane: 'red-all', cx: 0.47, cy: 0.58 + dy, aspect: 1.3, wt: 0.6, dens: 35, col: 'red' },
        { plane: 'red-all', cx: 0.6, cy: 0.5 + dy, aspect: 0.8, wt: 0.4, dens: 35, col: 'red' },
      ];
      const rr2 = fit(specsR, HT.s4Red * 0.95);
      const hg = htGroup(cg, 'red-all', 's4', 'red', 35, false);
      regionsLog['s4Red'] = rr2;
      rr2.forEach((r) => el('path', { d: blob(f4.rect(r), rnd) }, hg));
      redDotNodes = 1 + rr2.length;
      budget -= redDotNodes;
    }
    for (let i = 0; i < cl.nRough; i++) {
      const per = Math.floor(budget / (cl.nRough - i));
      const g = el('g', { 'data-rough': `${cl.name}-${i}` }, cg);
      const rx = cl.x0 + rr() * (cl.x1 - cl.x0), ry = cl.y0 + rr() * (cl.y1 - cl.y0);
      for (let k = 0; k < per - 1; k++) {
        const sw = (1.4 + rr()).toFixed(2);
        if (cl.kind === 'scribble') {
          let d = `M${(rx + rr() * 60 - 30).toFixed(1)} ${(ry + rr() * 60 - 30).toFixed(1)}`;
          for (let j = 0; j < 4; j++) d += `l${(rr() * 80 - 40).toFixed(1)} ${(rr() * 80 - 40).toFixed(1)}`;
          el('path', { d, ...redStroke, 'stroke-width': sw }, g);
        } else if (cl.kind === 'tally') {
          const tx = rx + (k % 5) * 14, ty = ry + Math.floor(k / 5) * 40;
          el('path', { d: `M${tx.toFixed(1)} ${ty.toFixed(1)}v30`, ...redStroke, 'stroke-width': sw }, g);
        } else {
          const hx = rx + (k % 8) * 9 - 36, hy = ry + Math.floor(k / 8) * 11;
          el('path', { d: `M${hx.toFixed(1)} ${hy.toFixed(1)}l14 -10`, ...redStroke, 'stroke-width': (1.1 + rr() * 0.8).toFixed(2) }, g);
        }
      }
      budget -= per;
      roughs.push({ g, x: rx, y: ry });
    }
  }
  // bounding box is only measurable once attached; computed from the generation extents (+ small margin)
  const redBox: Rect = { x: -0.95 * W - 40, y: -0.34 * H - 40, w: 1.21 * W + 80 + 0.0, h: 0.64 * H + 80 };
  const maskRect: Rect = { ...redBox };
  if (!cuts.includes(1)) redAll.setAttribute('mask', 'url(#eraser-mask)');
  const mask = el('mask', { id: 'eraser-mask', maskUnits: 'userSpaceOnUse', x: maskRect.x, y: maskRect.y, width: maskRect.w, height: maskRect.h }, defs);
  el('rect', { x: maskRect.x, y: maskRect.y, width: maskRect.w, height: maskRect.h, fill: '#fff' }, mask);
  const R = Math.hypot(Math.max(Math.abs(palm.x - maskRect.x), Math.abs(palm.x - maskRect.x - maskRect.w)), Math.max(Math.abs(palm.y - maskRect.y), Math.abs(palm.y - maskRect.y - maskRect.h)));
  const eraser = el('circle', { cx: palm.x, cy: palm.y, r: R, fill: '#000', 'data-layer': 'eraser' }, mask);

  // optional report-only live filters (NOT part of the fidelity gate; filteredLayers must be [] otherwise)
  if (o.filters) {
    const fl = el('filter', { id: 'ink-edge', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.04, numOctaves: 2, result: 'n' }, fl);
    el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 3 }, fl);
    for (const id of ['s4-mid', 's5-mid', 's6-mid']) plane(id).g.setAttribute('filter', 'url(#ink-edge)');
  }

  // ============================ sN-panel groups (low detail, flat, <= 300 nodes each) ===================
  const panelCols = [C.ink, C.char, C.burg, C.grey, C.night, C.yellow, C.red, C.paper];
  for (let i = 1; i <= 6; i++) {
    const g = el('g', { id: `s${i}-panel` }, defs);
    const pr = mulberry(900 + i);
    el('rect', { x: 0, y: 0, width: 400, height: 300, fill: i % 2 ? C.night : C.burg }, g);
    el('rect', { x: 0, y: 200, width: 400, height: 100, fill: C.ink }, g);
    // 297 more children: flat blocks with tints, so exactly 300 including the root
    for (let k = 0; k < 297; k++) {
      const t = pr();
      const col = panelCols[Math.floor(pr() * panelCols.length)];
      const x = pr() * 380, y = pr() * 280;
      if (t < 0.5) el('rect', { x: x.toFixed(0), y: y.toFixed(0), width: (6 + pr() * 40).toFixed(0), height: (6 + pr() * 40).toFixed(0), fill: col, 'fill-opacity': (0.25 + pr() * 0.5).toFixed(2) }, g);
      else if (t < 0.8) el('circle', { cx: x.toFixed(0), cy: y.toFixed(0), r: (2 + pr() * 10).toFixed(0), fill: col, 'fill-opacity': (0.3 + pr() * 0.5).toFixed(2) }, g);
      else el('path', { d: `M${x.toFixed(0)} ${y.toFixed(0)}l${(pr() * 40).toFixed(0)} ${(pr() * 30 - 15).toFixed(0)}`, stroke: col, 'stroke-width': 1.5, fill: 'none' }, g);
    }
  }

  const art: Art = {
    rig, W, H, narrow, pitchPx, defs, planes, byScene, plane,
    frames: { f3, f4, f5, f6 }, c5, c6, palm, rigG, walkFrames, poses, rigHome,
    eraser, redAll, roughs, redBox, maskRect, lights, sky, wallL, wallR, crumbs, flash,
    jacket: jacketFlat, window5, mullion, s6Interior, htGroups,
    stats: { regions: regionsLog, tierFlat: lite },
  };
  return art;
}

function rectAttrs(r: Rect) { return { x: r.x.toFixed(1), y: r.y.toFixed(1), width: r.w.toFixed(1), height: r.h.toFixed(1) }; }

// ---- page (S7) --------------------------------------------------------------------------------
export interface PageArt {
  svg: SVGSVGElement; paper: SVGGElement; panelsG: SVGGElement; borders: SVGRectElement[]; uses: SVGUseElement[];
  rects: Rect[]; p7: Rect; group: SVGGElement;
}

export function buildPage(art: Art): PageArt {
  const { W, H, narrow, rig } = art;
  const NB = narrow ? NODES.narrow : NODES.wide;
  const svg = el('svg', { class: 'page', viewBox: `${-W / 2} ${-H / 2} ${W} ${H}`, 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMid slice' });
  const group = el('g', { 'data-scene': '7', 'data-plane': 's7-page' }, svg);
  const paper = el('g', { 'data-layer': 's7-paper' }, group);
  el('rect', { x: -W / 2, y: -H / 2, width: W, height: H, fill: C.paper }, paper);
  const px = (x: number) => x - W / 2, py = (y: number) => y - H / 2;
  const rects: Rect[] = [];
  let p7: Rect;
  if (!narrow) {
    const pw = 0.19 * W, ph = 0.30 * H, gx = 0.015 * W, gy = 0.015 * H, x0 = 0.05 * W, y0 = 0.06 * H;
    for (let i = 0; i < 6; i++) rects.push({ x: px(x0 + (i % 3) * (pw + gx)), y: py(y0 + Math.floor(i / 3) * (ph + gy)), w: pw, h: ph });
    p7 = { x: px(0.68 * W), y: py(y0), w: 0.27 * W, h: 2 * ph + gy };
  } else {
    const pw = 0.28 * W, ph = 0.15 * H, gx = 0.015 * W, gy = 0.012 * H, x0 = 0.065 * W, y0 = 0.04 * H;
    for (let i = 0; i < 6; i++) rects.push({ x: px(x0 + (i % 3) * (pw + gx)), y: py(y0 + Math.floor(i / 3) * (ph + gy)), w: pw, h: ph });
    p7 = { x: px(0.05 * W), y: py(y0 + 2 * ph + gy + 0.015 * H), w: 0.9 * W, h: 0.29 * H };
  }
  const panelsG = el('g', { 'data-layer': 's7-panels' }, group);
  const borders: SVGRectElement[] = [];
  [...rects, p7].forEach((r) => {
    borders.push(el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: 'none', stroke: C.ink, 'stroke-width': 2, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, panelsG));
  });
  const uses: SVGUseElement[] = rects.map((r, i) => {
    const u = el('use', { href: `#s${i + 1}-panel`, transform: `translate(${r.x} ${r.y}) scale(${r.w / 400} ${r.h / 300})`, 'data-panel': i + 1, style: 'display:none' }, panelsG);
    return u;
  });
  // fill the S7 page art to its mounted-neighbour budget with flat gutter linework (paper layer)
  const rnd = mulberry(4242);
  const have = count(group) + 1;
  const n = NB.s7 - have;
  detail(paper, Math.max(0, n), { x: -W / 2, y: -H / 2, w: W, h: H }, 1, rnd, ['#B9B3A4', '#D8D1C0', C.ink]);
  void rig;
  return { svg, paper, panelsG, borders, uses, rects, p7, group };
}

/** Call once the art is attached: the mask box becomes the real bounding box of red-all (+2 %), the eraser circle covers it from the palm. */
export function finalizeMask(art: Art) {
  const b = art.redAll.getBBox();
  const padX = b.width * 0.01, padY = b.height * 0.01;
  const r: Rect = { x: b.x - padX, y: b.y - padY, w: b.width + 2 * padX, h: b.height + 2 * padY };
  art.redBox = { x: b.x, y: b.y, w: b.width, h: b.height };
  art.maskRect = r;
  const mask = art.defs.querySelector('#eraser-mask')!;
  for (const [k, v] of [['x', r.x], ['y', r.y], ['width', r.w], ['height', r.h]] as const) mask.setAttribute(k, String(v));
  const rect = mask.querySelector('rect')!;
  for (const [k, v] of [['x', r.x], ['y', r.y], ['width', r.w], ['height', r.h]] as const) rect.setAttribute(k, String(v));
  const R = Math.hypot(Math.max(Math.abs(art.palm.x - r.x), Math.abs(art.palm.x - r.x - r.w)), Math.max(Math.abs(art.palm.y - r.y), Math.abs(art.palm.y - r.y - r.h)));
  art.eraser.setAttribute('r', String(R));
}
