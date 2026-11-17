#!/usr/bin/env node
/**
 * Penumbra — procedural light-study renderer.
 *
 * Every plate is computed (ray-cast / analytic light model, no photographs, no AI) in a headless
 * Chromium page via Playwright and written as a PNG master to assets-src/.
 *
 *   NODE_PATH=$(npm root -g) node scripts/render-assets.mjs [scene ...] [--out assets-src] [--scale 1]
 *
 * Scenes: capela museu casa hotel brass glass plate hero grain   (default: all)
 * --from-shader captures hero-landscape/hero-portrait/hour-* PNGs from the live shader (lab capture mode) instead.
 * --scale 0.25 renders quarter-size previews (for iteration).
 * Deterministic: fixed seeds, no Math.random.
 *
 * Shared light model (CREATIVE_DIRECTION > Image & video direction):
 *   one source from the upper left (~35 deg), soft penumbra on every shadow, >= 60% of frame in shadow,
 *   shadows #0d0c0b..#171513 (never pure black), highlights capped at limewash #ece6da (tone-mapped
 *   shoulder, nothing clips to white), warm 2700 K family; cool only in the two daylight plates
 *   (capela dawn, museu 4000 K display light), faint bounce light, static baked grain.
 *
 * Optimise afterwards with plugins/premium-web-studio/skills/ai-visual-pipeline/scripts/optimize-images.mjs
 * (see studio/ASSET_MANIFEST.md for the exact commands).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(opt('out', path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'assets-src')));
const scale = parseFloat(opt('scale', '1'));
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));

// id -> [width, height] at scale 1 (2400px wide masters)
const SCENES = {
  'capela-do-silencio': ['capela', 2400, 3000],
  // wide variant for the >= 1024 px detail hero (strip ~2.6:1): the portrait plate's subject spans ~65% of its height
  'capela-do-silencio-wide': ['capela', 2880, 1120],
  'museu-das-mares': ['museu', 2400, 3000],
  'museu-das-mares-wide': ['museu', 2880, 1120],
  'casa-sombra': ['casa', 2400, 3000],
  'hotel-alva': ['hotel', 2400, 3000],
  'atelier-brass': ['brass', 2400, 2400],
  'atelier-glass': ['glass', 2400, 2400],
  'atelier-plate': ['plate', 2400, 2400],
  'hero-poster': ['hero', 2400, 1350],
  'grain': ['grain', 256, 256],
};

/* ------------------------------------------------------------------------------------------------
 * Browser side. This function is serialised into the page, so it must be self-contained.
 * ---------------------------------------------------------------------------------------------- */
function browserLib() {
  const TAU = Math.PI * 2;
  // ---- math / noise
  const ss = (a, b, x) => { let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
  const cl = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const mix = (a, b, t) => a + (b - a) * t;
  function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function h2(x, y, s) { let n = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
  function vn(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return h2(xi, yi, s) * (1 - u) * (1 - v) + h2(xi + 1, yi, s) * u * (1 - v) + h2(xi, yi + 1, s) * (1 - u) * v + h2(xi + 1, yi + 1, s) * u * v; }
  function fbm(x, y, o, s) { let a = 0.5, f = 1, t = 0, n = 0; for (let i = 0; i < o; i++) { t += a * vn(x * f, y * f, s + i * 17); n += a; a *= 0.5; f *= 2.03; } return t / n; }

  // ---- colour temperature tints (light-layer multipliers)
  const T2200 = [1.0, 0.60, 0.32], T2400 = [1.0, 0.69, 0.42], T2700 = [1.0, 0.76, 0.50], T3000 = [1.0, 0.81, 0.58], T4000 = [0.78, 0.88, 1.0];

  // ---- tone mapping + grade + baked grain
  const GROUND = [15, 14, 12], CEIL = [236, 230, 218], LO = [13, 12, 11];
  function finish(L, W, H, o) {
    o = Object.assign({ k: 2.0, grain: 1.0, seed: 1 }, o || {});
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H); const d = img.data; const rnd = mulberry(o.seed * 7919 + 13);
    const hi = [CEIL[0], CEIL[1], CEIL[2]];
    for (let i = 0, n = W * H; i < n; i++) {
      const n1 = (rnd() + rnd() + rnd() - 1.5) * 2; // ~unit-variance
      let lum = 0;
      for (let c = 0; c < 3; c++) {
        const t = 1 - Math.exp(-o.k * Math.max(0, L[3 * i + c]));
        const col = GROUND[c] + (CEIL[c] - GROUND[c]) * t;
        lum += col;
      }
      lum /= 3;
      const sg = (1.15 + 0.024 * lum) * o.grain;
      for (let c = 0; c < 3; c++) {
        const t = 1 - Math.exp(-o.k * Math.max(0, L[3 * i + c]));
        let col = GROUND[c] + (CEIL[c] - GROUND[c]) * t + n1 * sg + (rnd() - 0.5) * sg * 0.35;
        col = col < LO[c] ? LO[c] : col > hi[c] ? hi[c] : col;
        d[4 * i + c] = col + 0.5;
      }
      d[4 * i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
  function pixels(W, H, fn) { const L = new Float32Array(W * H * 3); const o = [0, 0, 0]; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { o[0] = o[1] = o[2] = 0; fn(x, y, o); const i = 3 * (y * W + x); L[i] = o[0]; L[i + 1] = o[1]; L[i + 2] = o[2]; } return L; }
  const ssdir = (x, y, z) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };

  const scenes = {};

  /* ================= CAPELA DO SILENCIO: barrel vault, dawn blade on apse wall ================= */
  scenes.capela = (W, H, S) => {
    // focal length from the frame's short side (portrait 2400x3000: W = H*0.8, so unchanged); landscape keeps the vertical view
    const f = 1.5 * Math.min(W, H * 0.8), cx = W / 2, cy = H * (W > H ? 0.66 : 0.575), ch = 1.7, hw = 3, D = 19, SY = 6, R = 3;
    const el = 35 * Math.PI / 180, az = 35 * Math.PI / 180;
    const ldx = Math.cos(el) * Math.sin(az), ldy = -Math.sin(el), ldz = Math.cos(el) * Math.cos(az);
    const slitZ = 15.3, slitW = 1.0, slitY0 = 2.5, slitY1 = 5.8, slope = 1.25;
    const beam = (x, y, z) => {
      const s = (x + hw) / ldx; if (s < 0) return 0;
      const qy = y - s * ldy, qz = z - s * ldz;
      const zc = slitZ + slope * (qy - 4.2);
      const e = 0.03 + 0.045 * s;
      const mz = ss(zc - slitW / 2 - e, zc - slitW / 2 + e, qz) * ss(zc + slitW / 2 + e, zc + slitW / 2 - e, qz);
      const my = ss(slitY0 - e, slitY0 + e, qy) * ss(slitY1 + e, slitY1 - e, qy);
      return mz * my;
    };
    const warm = T2400, cool = [0.80, 0.90, 1.0];
    const Pc = [-0.6, 2.4, D]; // approx blade centre on apse wall (bounce origin)
    return pixels(W, H, (px, py, o) => {
      const rx = (px + 0.5 - cx) / f, ry = -(py + 0.5 - cy) / f;
      let t = D, kind = 3;
      if (ry < 0) { const tf = -ch / ry; if (tf < t) { t = tf; kind = 0; } }
      let ts = 1e9, ks = 1;
      if (Math.abs(rx) > 1e-7) { const tw = hw / Math.abs(rx); if (ch + ry * tw <= SY) { ts = tw; ks = 1; } }
      if (ts === 1e9) {
        const oy = ch - SY, a = rx * rx + ry * ry, b = 2 * oy * ry, c = oy * oy - R * R, disc = b * b - 4 * a * c;
        if (disc > 0) { const tv = (-b + Math.sqrt(disc)) / (2 * a); if (ch + ry * tv >= SY - 1e-3) { ts = tv; ks = 2; } }
      }
      if (ts < t) { t = ts; kind = ks; }
      const x = rx * t, y = ch + ry * t, z = t;
      let nx = 0, ny = 0, nz = 0, alb = 1;
      if (kind === 0) { ny = 1; // floor: stone slabs, faint joints
        const jx = Math.abs(((x + 100) % 1.5) - 0.75), jz = Math.abs(((z + 100) % 2.2) - 1.1);
        alb = 0.62 * (1 - 0.35 * ss(0.72, 0.75, jx) - 0.35 * ss(1.08, 1.1, jz)) * (0.85 + 0.3 * fbm(x * 3, z * 3, 3, 4));
      } else if (kind === 1) { nx = x < 0 ? 1 : -1; alb = 0.8 * (0.9 + 0.2 * fbm(z * 1.4, y * 1.4, 3, 2)); }
      else if (kind === 2) { nx = -x / R; ny = -(y - SY) / R; const rib = ss(0.45, 0.5, Math.abs(((z + 100) % 6) - 3) / 3); alb = 0.8 * (1 + 0.9 * (1 - rib)); }
      else { nz = -1; alb = 0.92 * (0.88 + 0.22 * fbm(x * 1.7, y * 1.7, 4, 9)); } // limewashed apse wall
      let dir = 0;
      if (x > -hw + 0.01) { const m = beam(x, y, z); if (m > 0) dir = m * Math.max(0, -(nx * ldx + ny * ldy + nz * ldz)); }
      const dd = Math.hypot(x - Pc[0], y - Pc[1], z - Pc[2]);
      const bounce = 0.11 * Math.exp(-(dd * dd) / (2 * 6.0 * 6.0)) + 0.006;
      let I = dir * 2.6 * alb + bounce * alb;
      // slit itself, seen on the left wall
      let e0 = 0;
      if (kind === 1 && x < 0) { const zc = slitZ + slope * (y - 4.2); const m = ss(zc - slitW / 2 - 0.03, zc - slitW / 2 + 0.03, z) * ss(zc + slitW / 2 + 0.03, zc + slitW / 2 - 0.03, z) * ss(slitY0 - 0.03, slitY0 + 0.03, y) * ss(slitY1 + 0.03, slitY1 - 0.03, y); e0 = m * 1.7 + 0.35 * Math.exp(-(Math.pow((z - (slitZ + slope * (y - 4.2))) / 0.9, 2) + Math.pow((y - 4.2) / 1.7, 2))); }
      // airborne dust in the blade (volumetric, 30 steps)
      let sc = 0; const steps = 34; const jit = h2(px, py, 5);
      for (let i = 0; i < steps; i++) { const ti = t * (i + jit) / steps; sc += beam(rx * ti, ch + ry * ti, ti); }
      sc = sc / steps * t * Math.hypot(rx, ry, 1) * 0.02;
      // cool dawn fill in the shadow side (daylight scene only), warm blade
      const fill = 0.007 * (1 + 0.6 * ss(-3, 3, -x));
      o[0] = I * warm[0] + e0 * 1.0 + sc * 0.95 + fill * cool[0] * alb;
      o[1] = I * warm[1] + e0 * 0.88 + sc * 0.72 + fill * cool[1] * alb;
      o[2] = I * warm[2] + e0 * 0.74 + sc * 0.5 + fill * cool[2] * alb;
    });
  };

  /* ================= MUSEU DAS MARES: three low vitrines, 4000 K, polished floor ================= */
  scenes.museu = (W, H, S) => {
    // focal length from the frame's short side (portrait unchanged); landscape sits a little higher to keep the front vitrine clear of the edge
    const f = 1.55 * Math.min(W, H * 0.8), cx = W / 2, cy = H * (W > H ? 0.34 : 0.40), ch = 3.3, hw = 5.5, RH = 5, Dz = 34;
    const boxes = [
      { x: -1.2, z: 8.2, hx: 1.05, hz: 0.5, hy: 0.5, E: 1.0, seed: 3 },
      { x: 1.05, z: 11.6, hx: 1.05, hz: 0.5, hy: 0.5, E: 0.85, seed: 8 },
      { x: -0.55, z: 16.4, hx: 1.05, hz: 0.5, hy: 0.5, E: 0.62, seed: 21 },
    ];
    const cool = [0.60, 0.80, 1.0];
    // ray vs box: returns t and face (0 top, 1 -z front, 2 side) + local uv; mirror flips y about 0
    function hitBox(b, rx, ry, rz, mirror) {
      const oy = mirror ? -ch : ch; // mirrored camera == mirrored box
      const lo = [b.x - b.hx, 0, b.z - b.hz], hi = [b.x + b.hx, b.hy, b.z + b.hz];
      const o = [0, oy, 0], d = [rx, mirror ? -ry : ry, rz]; // mirror: reflect ray, keep box upright
      let tmin = 0, tmax = 1e9, face = -1;
      for (let a = 0; a < 3; a++) {
        if (Math.abs(d[a]) < 1e-9) { if (o[a] < lo[a] || o[a] > hi[a]) return null; continue; }
        let t1 = (lo[a] - o[a]) / d[a], t2 = (hi[a] - o[a]) / d[a], fa = a;
        if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; }
        if (t1 > tmin) { tmin = t1; face = a; }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) return null;
      }
      if (tmin <= 0) return null;
      const px = o[0] + d[0] * tmin, py = o[1] + d[1] * tmin, pz = o[2] + d[2] * tmin;
      return { t: tmin, face, px, py, pz };
    }
    function emit(b, h) { // emissive shading of a vitrine face, "rock pool" mottling
      const u = (h.px - (b.x - b.hx)) / (2 * b.hx), v = (h.pz - (b.z - b.hz)) / (2 * b.hz), w = h.py / b.hy;
      let e;
      if (h.face === 1) { // top
        const rim = Math.min(u, 1 - u, v * 2.1, (1 - v) * 2.1); const frame = ss(0.012, 0.055, rim);
        const pool = 0.35 + 1.76 * Math.pow(fbm(u * 4.5 + b.seed, v * 2.6 + b.seed, 4, b.seed), 1.6);
        e = b.E * 0.74 * pool * (0.2 + 0.8 * frame);
      } else if (h.face === 2) { // front / back (z faces)
        const gx = Math.min(u, 1 - u); e = b.E * 0.62 * (0.30 + 0.55 * ss(0.0, 0.6, w)) * (0.4 + 0.6 * ss(0.01, 0.07, gx)) * (0.75 + 0.5 * fbm(u * 6 + b.seed, w * 2, 3, b.seed + 1));
      } else { e = b.E * 0.16 * (0.3 + 0.7 * w); }
      return e;
    }
    // faces: tmin axis a: 0 -> x side, 1 -> y top/bottom, 2 -> z front/back ; remap
    return pixels(W, H, (px, py, o) => {
      const rx = (px + 0.5 - cx) / f, ry = -(py + 0.5 - cy) / f;
      let t = Dz, kind = 3;
      if (ry < 0) { const tf = -ch / ry; if (tf < t) { t = tf; kind = 0; } }
      if (ry > 0) { const tc = (RH - ch) / ry; if (tc < t) { t = tc; kind = 4; } }
      if (Math.abs(rx) > 1e-7) { const tw = hw / Math.abs(rx); if (tw < t) { t = tw; kind = 1; } }
      let hitB = null, hitI = -1;
      for (let i = 0; i < 3; i++) { const h = hitBox(boxes[i], rx, ry, 1, false); if (h && h.t < t) { t = h.t; hitB = h; hitI = i; } }
      const x = rx * t, y = ch + ry * t, z = t;
      let E = 0, R = 0, G = 0, B = 0;
      if (hitB) {
        const b = boxes[hitI]; const h = Object.assign({}, hitB); h.face = h.face === 1 ? 1 : h.face === 2 ? 2 : 0; // axis 1 = top, 2 = z-face, 0 = x-face
        h.face = hitB.face === 1 ? 1 : hitB.face === 2 ? 2 : 3;
        E = emit(b, { face: h.face, px: hitB.px, py: hitB.py, pz: hitB.pz });
        o[0] = E * cool[0]; o[1] = E * cool[1]; o[2] = E * cool[2]; return;
      }
      // spill light on room surfaces from the three vitrines (point sources above each box)
      let nx = 0, ny = 0, nz = 0, alb = 0.7;
      if (kind === 0) ny = 1; else if (kind === 1) nx = x < 0 ? 1 : -1; else if (kind === 3) nz = -1; else ny = -1;
      let sp = 0;
      for (let i = 0; i < 3; i++) {
        const b = boxes[i];
        const vx = b.x - x, vy = b.hy + 0.35 - y, vz = b.z - z; const d2 = vx * vx + vy * vy + vz * vz + 0.55;
        const dl = Math.sqrt(d2); const cs = Math.max(0, (nx * vx + ny * vy + nz * vz) / dl);
        sp += b.E * cs * (kind === 0 ? 3.4 : 1.1) / d2;
      }
      if (kind === 0) { // floor: matte pool + glossy reflection of vitrine faces
        const fl = 0.55 + 0.45 * fbm(x * 0.9, z * 0.9, 4, 31);
        sp *= 0.95 * fl;
        const cosT = -ry / Math.hypot(rx, ry, 1); const Fr = 0.20 + 0.65 * Math.pow(1 - cosT, 2.2);
        let refl = 0; const ns = 14;
        for (let s = 0; s < ns; s++) {
          const jy = (h2(px, py, 40 + s) - 0.5), jx = (h2(px, py, 90 + s) - 0.5);
          const blur = 0.0016 + 0.0035 * Math.min(1, z / 18);
          const rrx = rx + jx * blur * 0.6, rry = ry + jy * blur * 2.4;
          for (let i = 0; i < 3; i++) {
            const h = hitBox(boxes[i], rrx, rry, 1, true);
            if (h) { const hh = { face: h.face === 1 ? 1 : h.face === 2 ? 2 : 3, px: h.px, py: h.py, pz: h.pz }; if (hh.face === 1) hh.face = 3; refl += emit(boxes[i], hh) * (hh.face === 2 ? 1 : 0.5); }
          }
        }
        refl = refl / ns * Fr * 0.8;
        sp += refl; alb = 1;
      } else alb = (kind === 4 ? 0.2 : 0.45) + 0.4 * fbm(x * 1.2, y * 1.2 + z * 0.3, 3, 17);
      const amb = 0.012 + 0.008 * ss(1, 5, y);
      const I = sp * alb + amb;
      o[0] = I * cool[0]; o[1] = I * cool[1]; o[2] = I * cool[2];
    });
  };

  /* ================= CASA SOMBRA: horizontal louvres, late-afternoon stripes on floor + wall ================= */
  scenes.casa = (W, H, S) => {
    const f = 1.28 * W, cx = W * 0.50, cy = H * 0.50, ch = 1.35, ox = -0.6;
    const BW = 12.5, RW = 3.6, LW = -3.0, CH = 3.3;
    const el = 35 * Math.PI / 180, az = 30 * Math.PI / 180;
    const ldx = Math.cos(el) * Math.cos(az), ldy = -Math.sin(el), ldz = Math.cos(el) * Math.sin(az);
    const pitch = 0.46, open = 0.30, y0 = 0.9, y1 = 3.0;
    const tint = T3000;
    function sun(x, y, z) {
      const s = (x - LW) / ldx; if (s < 0) return 0;
      const qy = y - s * ldy, qz = z - s * ldz;
      const e = 0.03 + 0.062 * s; // penumbra widens with distance from the screen
      const u = qy / pitch; const tri = Math.abs(u - Math.floor(u) - 0.5) * 2; // 1 at blade centre... 0 at gap centre
      const ee = e / pitch;
      const m = ss(open + ee, open - ee, tri) ; // lit in the gaps
      const env = ss(y0 - 0.35, y0 + 0.35, qy) * ss(y1 + 0.35, y1 - 0.35, qy);
      return m * env;
    }
    return pixels(W, H, (px, py, o) => {
      const rx = (px + 0.5 - cx) / f, ry = -(py + 0.5 - cy) / f;
      let t = 1e9, kind = -1;
      if (ry < 0) { t = -ch / ry; kind = 0; }
      const tb = BW; if (tb < t) { t = tb; kind = 1; }
      if (rx > 1e-7) { const tr = (RW - ox) / rx; if (tr < t) { t = tr; kind = 2; } }
      if (rx < -1e-7) { const tl = (LW - ox) / rx; if (tl > 0 && tl < t) { t = tl; kind = 3; } }
      if (ry > 0) { const tc = (CH - ch) / ry; if (tc < t) { t = tc; kind = 4; } }
      const x = ox + rx * t, y = ch + ry * t, z = t;
      let nx = 0, ny = 0, nz = 0, alb = 0.8;
      // concrete: formwork panels, tie holes, mottling
      const mott = 0.78 + 0.34 * fbm((kind === 0 ? x : kind === 1 ? x : z) * 2.2, (kind === 0 ? z : y) * 2.2, 5, 11);
      if (kind === 0) { ny = 1; const j = Math.abs(((x + 100) % 2.4) - 1.2); alb = 0.74 * mott * (1 - 0.3 * ss(1.17, 1.2, j)); }
      else if (kind === 1) { nz = -1; const j = Math.abs(((y + 100) % 1.2) - 0.6), jx = Math.abs(((x + 100) % 2.4) - 1.2); alb = 0.8 * mott * (1 - 0.3 * ss(0.57, 0.6, j) - 0.3 * ss(1.17, 1.2, jx)); }
      else if (kind === 2) { nx = -1; alb = 0.8 * mott; }
      else if (kind === 3) { nx = 1; alb = 0.05; }
      else { ny = -1; alb = 0.6 * mott; }
      // fine surface relief catching the raking light
      const bump = 1 + 0.55 * (fbm(x * 9 + z * 5, y * 9 + 3, 3, 23) - 0.5);
      let m = (kind === 3) ? 0 : sun(x, y, z);
      let sky = 0;
      if (kind === 3) { const u = y / pitch; const tri = Math.abs(u - Math.floor(u) - 0.5) * 2; sky = 0.20 * ss(open + 0.05, open - 0.05, tri) * ss(y0 - 0.3, y0 + 0.3, y) * ss(y1 + 0.3, y1 - 0.3, y) * (0.5 + 0.5 * ss(25, 0, z)); }
      const ndl = Math.max(0, -(nx * ldx + ny * ldy + nz * ldz));
      let I = m * ndl * 1.9 * alb * bump;
      // inverse-square-ish: sun through a bay, strongest near the screen
      I *= 1 / (1 + 0.012 * (z - 0) * (z - 0) * 0.35) ;
      // bounce: broad low-pass of the stripe energy plus warm floor-to-wall spill
      const avg = 0.30 * ss(y0 - 0.5, y0 + 0.5, y - ldy * (x - LW) / ldx) * ss(y1 + 0.5, y1 - 0.5, y - ldy * (x - LW) / ldx);
      const bnc = (0.05 * avg * ndl) / (1 + 0.012 * z * z * 0.35) * alb + 0.013;
      const tot = I + bnc * (kind === 3 ? 0.2 : 1) + sky;
      o[0] = tot * tint[0]; o[1] = tot * tint[1]; o[2] = tot * tint[2];
    });
  };

  /* ================= HOTEL ALVA: one-point corridor, ankle-height grazing slots, 2200 K ================= */
  scenes.hotel = (W, H, S) => {
    const f = 1.0 * W, cx = W / 2, cy = H * 0.50, ch = 1.5, hw = 1.25, RH = 2.9, Lz = 44, P = 3.4;
    const tint = T2200, sy = 0.11;
    return pixels(W, H, (px, py, o) => {
      const rx = (px + 0.5 - cx) / f, ry = -(py + 0.5 - cy) / f;
      let t = Lz, kind = 3;
      if (ry < 0) { const tf = -ch / ry; if (tf < t) { t = tf; kind = 0; } }
      if (ry > 0) { const tc = (RH - ch) / ry; if (tc < t) { t = tc; kind = 4; } }
      if (Math.abs(rx) > 1e-7) { const tw = hw / Math.abs(rx); if (tw < t) { t = tw; kind = rx < 0 ? 1 : 2; } }
      const x = rx * t, y = ch + ry * t, z = t;
      let nx = 0, ny = 0, nz = 0;
      if (kind === 0) ny = 1; else if (kind === 4) ny = -1; else if (kind === 1) nx = 1; else if (kind === 2) nx = -1; else nz = -1;
      // stone relief: perturb the normal with noise so grazing light rakes across it
      const sc = kind === 0 ? 5 : 3.2;
      const a = kind === 0 ? x : z, b = kind === 0 ? z : y;
      const n0 = fbm(a * sc, b * sc, 4, 6), nA = fbm(a * sc + 0.06, b * sc, 4, 6) - n0, nB = fbm(a * sc, b * sc + 0.06, 4, 6) - n0;
      const rel = 1.0;
      let pnx = nx, pny = ny, pnz = nz;
      if (kind === 0) { pnx += -nA * rel * 2.2; pnz += -nB * rel * 2.2; }
      else if (kind === 1 || kind === 2) { pny += -nB * rel * 2.2; pnz += -nA * rel * 2.2; pnx += 0; }
      else if (kind === 4) { pnx += -nA * rel; pnz += -nB * rel; }
      // stone joints
      let alb = 0.78 * (0.8 + 0.4 * n0);
      if (kind === 0) { const j = Math.abs(((x + 100) % 1.2) - 0.6), jz = Math.abs(((z + 100) % 0.9) - 0.45); alb *= 1 - 0.45 * ss(0.57, 0.6, j) - 0.45 * ss(0.42, 0.45, jz); }
      else if (kind === 1 || kind === 2) { const j = Math.abs(((y + 100) % 0.6) - 0.3); alb *= 1 - 0.3 * ss(0.285, 0.3, j); }
      const k0 = Math.round(z / P);
      let acc = 0;
      for (let side = 0; side < 2; side++) {
        const sx = side === 0 ? -(hw - 0.045) : (hw - 0.045), snx = side === 0 ? 1 : -1;
        for (let k = k0 - 2; k <= k0 + 2; k++) {
          const z0 = (k < 1 ? 1 : k) * P;
          if (k < 1) continue;
          for (let s = -1; s <= 1; s++) {
            const zz = z0 + s * 0.45;
            const vx = sx - x, vy = sy - y, vz = zz - z; const d2 = vx * vx + vy * vy + vz * vz + 0.006; const dl = Math.sqrt(d2);
            const cr = Math.max(0, (pnx * vx + pny * vy + pnz * vz) / dl);
            const cs = Math.max(0, (-vx * snx) / dl);
            acc += cr * (0.32 + 0.68 * Math.sqrt(cs)) / d2;
          }
        }
      }
      const fall = Math.exp(-z / 38);
      let em = 0; if (kind === 1 || kind === 2) { const zk = Math.round(z / P) * P; if (zk >= P) em = ss(0.03, 0.012, Math.abs(y - sy)) * ss(0.62, 0.45, Math.abs(z - zk)) * 1.3; }
      const I = acc * 0.105 * alb * fall + 0.012 + (kind === 3 ? 0.012 : 0) + em;
      o[0] = I * tint[0]; o[1] = I * tint[1]; o[2] = I * tint[2];
    });
  };

  /* ================= ATELIER BRASS: spun reflector, concentric highlights ================= */
  scenes.brass = (W, H, S) => {
    const cxr = W * 0.60, cyr = H * 0.58, R0 = W * 0.64, hole = W * 0.075;
    const lightAng = Math.atan2(-0.62, -0.78); // towards light, upper-left
    const tint = [1.0, 0.70, 0.34];
    return pixels(W, H, (px, py, o) => {
      const dx = px - cxr, dy = py - cyr; const r = Math.hypot(dx, dy); const th = Math.atan2(dy, dx);
      const rn = r / R0;
      let I = 0.012;
      if (rn < 1.0) {
        // radial profile of a parabolic spun bowl: slope grows with radius, stepped spin ridges
        const rim = ss(0.94, 1.0, rn);
        const steps = 22; const ridge = (rn * steps) % 1; const ridgeI = ss(0.0, 0.08, ridge) * ss(0.35, 0.12, ridge); // bright lip then falls
        const fine = 0.55 + 0.45 * vn(r * 0.9, 0, 5) * 0 + 0.45 * h2(Math.floor(r * 0.55), 0, 7) ; // spin lines (hash per ring)
        const scratch = 0.7 + 0.3 * vn(r * 0.18, th * 40, 3);
        // anisotropic arc highlight: strongest where the facet normal bisects view and light
        let dth = Math.atan2(Math.sin(th - lightAng), Math.cos(th - lightAng));
        const arc = Math.exp(-(dth * dth) / (2 * 0.52 * 0.52));
        const opp = 0.22 * Math.exp(-((Math.abs(dth) - Math.PI) * (Math.abs(dth) - Math.PI)) / (2 * 0.5 * 0.5)); // faint counter-arc (interreflection)
        const band = 0.35 + 0.65 * ss(0.12, 0.55, rn) * (1 - 0.25 * ss(0.8, 1, rn));
        const gradL = 0.07 + 0.93 * ss(1.25, 0.1, Math.hypot(px - W * 0.10, py - H * 0.06) / W);
        I = (0.025 + (0.50 * arc + opp) * band * (0.55 + 0.9 * ridgeI) * fine * scratch) * gradL;
        I += 0.65 * ridgeI * Math.exp(-(dth * dth) / (2 * 0.8 * 0.8)) * ss(0.2, 0.6, rn) * gradL * 0.5;
        I += 0.22 * rim * Math.exp(-(dth * dth) / (2 * 0.9 * 0.9)) * gradL;
        if (r < hole * 1.5) { const hh = ss(hole * 1.5, hole * 0.95, r); I = mix(I, 0.004, hh); if (r > hole * 0.95 && r < hole * 1.06) I += 0.9 * Math.exp(-(dth * dth) / (2 * 0.6 * 0.6)) * gradL; }
        I += 0.07 * Math.exp(-(r * r) / (2 * (R0 * 0.28) * (R0 * 0.28))) * gradL; // glow inside the bowl
      }
      // table plane around the reflector: faint
      I += 0.012 * ss(0.9, 0.0, Math.hypot(px - W * 0.05, py - H * 0.05) / W);
      o[0] = I * tint[0]; o[1] = I * tint[1]; o[2] = I * tint[2];
    });
  };

  /* ================= ATELIER GLASS: blown diffuser + soft caustic ================= */
  scenes.glass = (W, H, S) => {
    const cx = W * 0.45, cy = H * 0.43, Rg = W * 0.285;
    const Ld = ssdir(-0.55, -0.62, 0.56); // towards light (x right, y down, z toward viewer)
    const tint = T2700;
    const sdx = 0.74, sdy = 0.67; // shadow direction on the table (away from light)
    return pixels(W, H, (px, py, o) => {
      const dx = px - cx, dy = py - cy; const wob = 1 + 0.018 * (fbm(dx / Rg * 1.6 + 5, dy / Rg * 1.6, 3, 2) - 0.5) * 2;
      const r = Math.hypot(dx, dy * 1.0) / (Rg * wob);
      // table: light envelope from upper-left, falling away
      const env = 0.34 * Math.exp(-Math.hypot(px - W * 0.0, py - H * 0.0) / (W * 0.9));
      let I = 0.010 + env * 0.30;
      // soft elongated shadow of the sphere (penumbra widens with distance)
      const sh0x = cx + sdx * Rg * 1.15, sh0y = cy + sdy * Rg * 1.15;
      const ax = (px - sh0x) * sdx + (py - sh0y) * sdy, ay = -(px - sh0x) * sdy + (py - sh0y) * sdx;
      const along = ax / Rg, across = ay / Rg;
      const shW = 0.95 + 0.25 * Math.max(0, along); const shMask = ss(shW + 0.22 + 0.15 * Math.max(0, along), shW - 0.22, Math.abs(across)) * ss(-1.9, -0.9, along) * ss(3.3, 1.6, along);
      I *= 1 - 0.78 * shMask;
      // caustic: bright focused crescent inside the shadow, offset away from the light
      const cc = 1.12;
      const cax = (px - (cx + sdx * Rg * cc * 1.05)) / Rg, cay = (py - (cy + sdy * Rg * cc * 1.05)) / Rg;
      const cr = Math.hypot(cax * 0.95, cay * 1.0);
      const caus = 1.1 * Math.exp(-(cr * cr) / (2 * 0.26 * 0.26)) + 0.55 * Math.exp(-((cr - 0.52) * (cr - 0.52)) / (2 * 0.10 * 0.10)) * (0.55 + 0.45 * vn(Math.atan2(cay, cax) * 3.0, 0, 8)) + 0.12 * Math.exp(-(cr * cr) / (2 * 0.9 * 0.9));
      I += caus * 0.62 * ss(1.0, 0.5, cr * 0.9) * (1 + 0.4 * (fbm(cax * 5, cay * 5, 3, 12) - 0.5));
      if (r < 1.0) {
        const u = dx / (Rg * wob), v = dy / (Rg * wob); const nz = Math.sqrt(Math.max(0, 1 - u * u - v * v));
        const nL = u * Ld[0] + v * Ld[1] + nz * Ld[2];
        const fres = Math.pow(1 - nz, 2.8);
        // soft-box reflection streak (upper-left), elongated
        const rr = [2 * nz * u, 2 * nz * v, 2 * nz * nz - 1]; const rl = rr[0] * Ld[0] + rr[1] * Ld[1] + rr[2] * Ld[2];
        const spec = Math.pow(Math.max(0, rl), 36) * 1.9 + Math.pow(Math.max(0, rl), 7) * 0.22;
        // secondary window highlight (lower right, rim)
        const rl2 = rr[0] * 0.62 + rr[1] * 0.70 + rr[2] * 0.35; const spec2 = Math.pow(Math.max(0, rl2), 18) * 0.45;
        // interior: opal glow, the refracted light gathers lower-right
        const gx = (u - 0.30) / 0.60, gy = (v - 0.32) / 0.52;
        const inner = 0.17 * Math.exp(-(gx * gx + gy * gy)) + 0.03 * (0.5 + 0.5 * nL);
        const body = 0.014 + 0.75 * fres * (0.45 + 0.55 * ss(-0.2, 0.9, u * 0.7 + v * 0.7 + 0.2)) ;
        const bubbles = 0;
        const edge = ss(1.0, 0.985, r);
        const val = (body + inner + spec + spec2 * ss(0.4, 0.9, r) + bubbles) * edge * (0.9 + 0.2 * fbm(u * 3, v * 3, 3, 4));
        I = mix(I, val * 1.05, ss(1.0, 0.99, r));
      }
      { const nxn = dx / (Rg * 0.34), ny2 = dy / Rg; if (Math.abs(nxn) < 1 && ny2 > -1.27 && ny2 < -0.9) { const e1 = ss(1, 0.97, Math.abs(nxn)) * ss(-1.27, -1.25, ny2) * ss(-0.9, -0.92, ny2); const dif = 0.5 + 0.5 * (-nxn); const band = 0.55 + 0.45 * Math.sin(ny2 * 90); const m2 = (0.05 + 0.34 * Math.pow(dif, 2.2) * band + 0.5 * Math.exp(-Math.pow((nxn + 0.55) / 0.12, 2))) * 1.2; I = mix(I, m2, e1); } }
      o[0] = I * tint[0]; o[1] = I * tint[1]; o[2] = I * tint[2];
    });
  };

  /* ================= ATELIER PLATE: stamped serial plate ================= */
  scenes.plate = (W, H, S) => {
    const text = S.text; const K = W / 2400;
    // height field via canvas
    const hc = document.createElement('canvas'); hc.width = W; hc.height = H; const hx = hc.getContext('2d');
    hx.fillStyle = '#000'; hx.fillRect(0, 0, W, H);
    const pw = W * 0.80, ph = H * 0.42, px0 = W * 0.10, py0 = H * 0.31;
    hx.filter = 'blur(' + 5 * K + 'px)'; hx.fillStyle = '#c8c8c8'; hx.fillRect(px0, py0, pw, ph);
    // inner raised border (rolled edge)
    hx.filter = 'blur(' + 4 * K + 'px)'; hx.strokeStyle = '#ffffff'; hx.lineWidth = 8 * K; hx.strokeRect(px0 + 36 * K, py0 + 36 * K, pw - 72 * K, ph - 72 * K);
    // stamped text (depressed)
    hx.filter = 'blur(' + 3.2 * K + 'px)'; hx.fillStyle = '#6a6a6a'; hx.font = '600 ' + Math.round(H * 0.066) + 'px "DejaVu Sans Mono", "Liberation Mono", monospace'; hx.textAlign = 'center'; hx.textBaseline = 'middle';
    hx.fillText(text, W / 2, py0 + ph / 2 + 4 * K);
    // rivet holes
    hx.filter = 'blur(' + 2.5 * K + 'px)';
    for (const rxp of [px0 + 105 * K, px0 + pw - 105 * K]) { hx.fillStyle = '#383838'; hx.beginPath(); hx.arc(rxp, py0 + ph / 2, 30 * K, 0, TAU); hx.fill(); hx.fillStyle = '#ececec'; hx.beginPath(); hx.arc(rxp, py0 + ph / 2, 15 * K, 0, TAU); hx.fill(); }
    hx.filter = 'none';
    const hd = hx.getImageData(0, 0, W, H).data;
    const hgt = new Float32Array(W * H); for (let i = 0; i < W * H; i++) hgt[i] = hd[4 * i] / 255;
    // soft cast shadow of the plate onto the table (offset lower-right), penumbra via blur
    const sc = document.createElement('canvas'); sc.width = W; sc.height = H; const sx = sc.getContext('2d');
    sx.filter = 'blur(' + 38 * K + 'px)'; sx.fillStyle = '#fff'; sx.fillRect(px0 + 34 * K, py0 + 46 * K, pw, ph);
    const sd = sx.getImageData(0, 0, W, H).data;
    const tint = [1.0, 0.72, 0.42];
    const Lg = ssdir(-0.62, -0.58, 0.52), Hh = ssdir(Lg[0], Lg[1], Lg[2] + 1);
    const lp = [W * -0.12, H * -0.10];
    return pixels(W, H, (x, y, o) => {
      const i = y * W + x;
      const xm = x > 0 ? hgt[i - 1] : hgt[i], xp = x < W - 1 ? hgt[i + 1] : hgt[i], ym = y > 0 ? hgt[i - W] : hgt[i], yp = y < H - 1 ? hgt[i + W] : hgt[i];
      const k = 9 / K;
      let nx = -(xp - xm) * k, ny = -(yp - ym) * k, nz = 1; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      const onPlate = hgt[i] > 0.12;
      // brushed anisotropy (horizontal grain)
      const brush = 0.72 + 0.28 * vn(x * 0.012 / K, y * 2.1 / K, 3) + 0.15 * (vn(x * 0.05 / K, y * 5.0 / K, 5) - 0.5);
      const d = Math.hypot(x - lp[0], y - lp[1]) / W; const env = 1.0 / (1 + 1.0 * d * d) * ss(1.5, 0.15, d);
      const diff = Math.max(0, nx * Lg[0] + ny * Lg[1] + nz * Lg[2]);
      const sp = Math.pow(Math.max(0, nx * Hh[0] + ny * Hh[1] + nz * Hh[2]), 22);
      let I;
      if (onPlate) { I = (0.30 * diff * brush + 0.55 * sp * (0.6 + 0.8 * brush)) * env * 2.6 + 0.012; }
      else { const shadow = sd[4 * i] / 255; I = (0.075 * env) * (1 - 0.88 * shadow) + 0.011; }
      o[0] = I * tint[0]; o[1] = I * tint[1]; o[2] = I * tint[2];
    });
  };

  /* ================= HERO POSTER: one diagonal shaft across a limewashed wall ================= */
  scenes.hero = (W, H, S) => {
    const a = 57 * Math.PI / 180; const dxv = Math.cos(a), dyv = Math.sin(a); // shaft direction (down-right)
    const nxv = -dyv, nyv = dxv; // perpendicular
    const ox = W * 0.34, oy = H * 0.0; // origin on the shaft axis (upper left)
    const tint = T2700;
    return pixels(W, H, (x, y, o) => {
      const px = x - ox, py = y - oy; const along = px * dxv + py * dyv, perp = px * nxv + py * nyv;
      const tl = along / W;
      const halfW = W * (0.050 + 0.040 * Math.max(0, tl)); // shaft widens toward the far end (diverging light)
      const e = W * (0.012 + 0.120 * Math.max(0, tl)); // penumbra widens with distance
      const band = ss(halfW + e, halfW - e, Math.abs(perp)) * ss(-0.05 * W, 0.12 * W, along);
      // soft mullion shadow inside the shaft
      const mull = 1 - 0.20 * Math.exp(-((perp - halfW * 0.38) * (perp - halfW * 0.38)) / (2 * (W * 0.012 + e * 0.8) * (W * 0.012 + e * 0.8)));
      const fall = 1.0 / (1 + (Math.max(0, tl) / 0.85) * (Math.max(0, tl) / 0.85));
      // limewash: trowel strokes + mottling, revealed by the light
      const tr = fbm(x * 0.0022 + y * 0.0009, y * 0.0038 - x * 0.0006, 4, 5);
      const mot = fbm(x * 0.0050, y * 0.0050, 4, 14);
      const eps = 3.0; const t1 = fbm((x + eps) * 0.0022 + y * 0.0009, y * 0.0038 - x * 0.0006, 4, 5) - tr, t2 = fbm(x * 0.0022 + (y + eps) * 0.0009, (y + eps) * 0.0038 - x * 0.0006, 4, 5) - tr;
      const relief = 1 + 5 * (-t1 * 0.5 - t2 * 1.0);
      const alb = (0.62 + 0.55 * mot) * Math.max(0.55, Math.min(1.5, relief));
      // dust motes
      const dust = h2(Math.floor(x / 2), Math.floor(y / 2), 77) > 0.9992 ? 0.5 : 0;
      let I = band * mull * fall * 1.55 * alb * (1 + dust * band);
      const bounce = 0.060 * Math.exp(-(perp * perp) / (2 * (W * 0.18) * (W * 0.18))) * (0.5 + 0.5 * fall) * ss(-0.05 * W, 0.2 * W, along);
      I += bounce * (0.7 + 0.3 * mot) + 0.014;
      o[0] = I * tint[0]; o[1] = I * tint[1]; o[2] = I * tint[2];
    });
  };

  // ---- entry: render a scene into a canvas and return PNG data URL
  window.renderScene = (name, W, H, S) => {
    S = S || {};
    if (name === 'grain') {
      // 256x256 tileable neutral noise; 3x3 wrap-around blur => soft film grain, no seams
      const n = W, rnd = mulberry(424242); const a = new Float32Array(n * n); for (let i = 0; i < n * n; i++) a[i] = (rnd() + rnd() + rnd() - 1.5) * 2;
      const b = new Float32Array(n * n);
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let s = 0, w = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const k = (i === 0 && j === 0) ? 2.2 : 1.0; s += k * a[((y + j + n) % n) * n + ((x + i + n) % n)]; w += k; } b[y * n + x] = s / w; }
      let m = 0; for (let i = 0; i < n * n; i++) m += b[i] * b[i]; const sd = Math.sqrt(m / (n * n));
      const cv = document.createElement('canvas'); cv.width = n; cv.height = n; const ctx = cv.getContext('2d'); const img = ctx.createImageData(n, n);
      for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, 128 + (b[i] / sd) * 42)); img.data[4 * i] = img.data[4 * i + 1] = img.data[4 * i + 2] = v; img.data[4 * i + 3] = 255; }
      ctx.putImageData(img, 0, 0); return cv.toDataURL('image/png');
    }
    const L = scenes[name](W, H, S);
    const opts = { capela: { seed: 1, k: 2.0 }, museu: { seed: 2, k: 2.0 }, casa: { seed: 3, k: 2.0 }, hotel: { seed: 4, k: 2.0 }, brass: { seed: 5, k: 2.0 }, glass: { seed: 6, k: 2.0 }, plate: { seed: 7, k: 2.0 }, hero: { seed: 8, k: 2.0, grain: S.heroGrain } }[name] || {};
    const cv = finish(L, W, H, opts);
    return cv.toDataURL('image/png');
  };
}

// ----------------------------------------------------------------------------------------------
// --from-shader: capture the live shader's own settled frames (hero posters + six Hour stills).
//   npm run assets -- --from-shader   (starts `vite --port $ASSETS_PORT` (default 5179), captures, stops it)
// Posters must be the shader's frame so the light does not jump when the canvas takes over.
if (args.includes('--from-shader')) {
  const { spawn } = await import('node:child_process');
  const { chromium: pwc } = require('@playwright/test');
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const port = Number(process.env.ASSETS_PORT || 5179); // ASSETS_PORT: run beside other servers (port isolation, as PW_PORT does for tests)
  const vite = spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'ignore' });
  const SHOTS = [
    ['hero-landscape', 2400, 1350], ['hero-portrait', 1170, 2532],
    ['hour-0610', 1280, 720, 'hour-0'], ['hour-1000', 1280, 720, 'hour-1'], ['hour-1330', 1280, 720, 'hour-2'],
    ['hour-1820', 1280, 720, 'hour-3'], ['hour-2100', 1280, 720, 'hour-4'], ['hour-0000', 1280, 720, 'hour-5'],
  ];
  try {
    for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://localhost:${port}/lab/light.html`)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
    fs.mkdirSync(outDir, { recursive: true });
    const b = await pwc.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    for (const [id, w, h, shotName] of SHOTS) {
      const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await pg.goto(`http://localhost:${port}/lab/light.html?clean&shot=${shotName || id}&w=${w}&h=${h}`);
      await pg.waitForFunction('window.__ready === true', null, { timeout: 120000 });
      await pg.screenshot({ path: path.join(outDir, `${id}.png`) });
      await pg.close();
      console.log(`${id}.png ${w}x${h} (shader capture)`);
    }
    await b.close();
  } finally { vite.kill(); }
  process.exit(0);
}

const todo = positional.length ? positional : null;
const names = Object.keys(SCENES).filter((id) => !todo || todo.includes(id) || todo.includes(SCENES[id][0]));
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(0);
await page.setContent('<!doctype html><meta charset="utf-8"><title>render</title>');
await page.evaluate(browserLib);
for (const id of names) {
  const [scene, w0, h0] = SCENES[id];
  const w = scene === 'grain' ? w0 : Math.round(w0 * scale), h = scene === 'grain' ? h0 : Math.round(h0 * scale);
  const t0 = Date.now();
  // hero poster: the site overlays grain.png itself, so keep the baked grain at 60% to leave room for AVIF <= 60 KB
  const S = { text: 'PNB-014 · 2700 K', heroGrain: 0.6 };
  const url = await page.evaluate(([n, ww, hh, s]) => window.renderScene(n, ww, hh, s), [scene, w, h, S]);
  const buf = Buffer.from(url.split(',')[1], 'base64');
  const file = path.join(outDir, `${id}.png`);
  fs.writeFileSync(file, buf);
  console.log(`${id}.png ${w}x${h} ${(buf.length / 1024).toFixed(0)} KB (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}
const ver = browser.version();
fs.writeFileSync(path.join(outDir, 'render-info.json'), JSON.stringify({ chromium: ver, playwright: require('playwright/package.json').version, scenes: Object.keys(SCENES) }, null, 2));
await browser.close();
