/**
 * Penumbra light study — raw WebGL2, zero dependencies.
 *
 * One full-screen triangle, one fragment shader. The scene is an abstract
 * chapel interior seen frontally: a limewashed back wall (z = 0), a stone floor
 * (y = 0), a low altar plinth, a doorway (bottom-left) and, out of frame, a long
 * clerestory slit in the ceiling (y = H) through which a single "sun" shaft
 * enters from the upper left. The slit is projected analytically along the sun
 * direction, so the penumbra widens with distance from the aperture — the soft
 * edge is physical, not a blur.
 *
 * Contract: the caller drives `render()` from gsap.ticker (no rAF loop here),
 * pauses it off-screen, and only `set()` / `resize()` mark the frame dirty, so a
 * static scene costs ~0 GPU time.
 */

export type LightState = {
  /** Degrees of the shaft from vertical, ~20..60. */
  sunAngle: number;
  /** 0..1 horizontal position where the shaft lands on the floor. */
  sunX: number;
  /** Kelvin, e.g. 2400..5800. */
  daylightK: number;
  /** 0..1 intensity. */
  daylight: number;
  /** Artificial altar pool. */
  altarK: number;
  altar: number;
  /** Door pool (bottom-left). */
  thresholdK: number;
  threshold: number;
  /** Ambient nave wash. */
  naveK: number;
  nave: number;
  /** 0..1 global "warm-on" multiplier for the hero intro. */
  reveal: number;
  /** 0..1, default 1. Fades the doorway opening into plain limewashed wall (threshold pool stays as floor light). */
  doorway?: number;
  /** 0..1, default 1. Dissolves the altar block (altar light still falls on wall and floor). */
  altarBlock?: number;
};

export type HourReadout = {
  daylightK: number | null;
  artificialK: number | null;
  altarLux: number;
  naveLux: number;
  doorLux?: number;
};

export type HourPreset = {
  time: string;
  minutes: number;
  state: LightState;
  readout: HourReadout;
  intent: string;
};

export type LightRenderer = {
  /** Merge a partial state; marks dirty only if a value changed. Renders on next `render()`. */
  set(state: Partial<LightState>): void;
  /** Draw now if dirty (call from gsap.ticker). */
  render(): void;
  /** Re-read the canvas CSS size and DPR; always marks dirty. */
  resize(): void;
  /** Delete program/VAO, lose the context, remove listeners. Idempotent. */
  destroy(): void;
  readonly lost: boolean;
};

/** The Threshold hero: one raking dawn shaft, everything else unlit. Tween `reveal` 0 → 1. */
export const HERO_STATE: LightState = {
  sunAngle: 34,
  sunX: 0.62,
  daylightK: 3400,
  daylight: 1,
  altarK: 2700,
  altar: 0,
  thresholdK: 2200,
  threshold: 0.12,
  naveK: 2700,
  nave: 0, // 0.04 washed the wall to ~#35281c (13.6% of frame in shadow; CD needs >=60%)
  reveal: 1,
  doorway: 0, // no opening behind the kicker + H1
  altarBlock: 0, // pure "one shaft across a dark wall" frame
};

/**
 * The Hour — six designed states from CREATIVE_DIRECTION.md. Kelvin values of
 * sources that are off are set to their neighbours' values so the interpolation
 * never swings colour through an invisible source.
 */
export const HOUR_PRESETS: HourPreset[] = [
  {
    time: '06:10',
    minutes: 6 * 60 + 10,
    state: {
      sunAngle: 60, sunX: 0.74, daylightK: 2400, daylight: 0.42,
      altarK: 3000, altar: 0, thresholdK: 2200, threshold: 0, naveK: 2700, nave: 0, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: 2400, artificialK: null, altarLux: 30, naveLux: 6 },
    intent: 'Dawn does the work. We stay out of its way.',
  },
  {
    time: '10:00',
    minutes: 10 * 60,
    state: {
      sunAngle: 40, sunX: 0.6, daylightK: 5000, daylight: 0.8,
      altarK: 3000, altar: 0, thresholdK: 2200, threshold: 0, naveK: 2700, nave: 0, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: 5000, artificialK: null, altarLux: 220, naveLux: 90 },
    intent: 'The nave is bright enough. Nothing is added.',
  },
  {
    time: '13:30',
    minutes: 13 * 60 + 30,
    state: {
      sunAngle: 22, sunX: 0.44, daylightK: 5800, daylight: 0.95,
      altarK: 3000, altar: 0, thresholdK: 2200, threshold: 0, naveK: 2700, nave: 0, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: 5800, artificialK: null, altarLux: 300, naveLux: 140 },
    intent: 'Noon flattens everything, so the slit is shaded and the altar keeps its edge.',
  },
  {
    time: '18:20',
    minutes: 18 * 60 + 20,
    state: {
      sunAngle: 54, sunX: 0.7, daylightK: 3200, daylight: 0.2,
      altarK: 3000, altar: 0.2, thresholdK: 2200, threshold: 0, naveK: 2700, nave: 0, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: 3200, artificialK: 3000, altarLux: 60, naveLux: 15 },
    intent: 'As the sun leaves, the altar takes over, never brighter than the window was.',
  },
  {
    time: '21:00',
    minutes: 21 * 60,
    state: {
      sunAngle: 58, sunX: 0.74, daylightK: 2400, daylight: 0,
      altarK: 2700, altar: 0.42, thresholdK: 2200, threshold: 0, naveK: 2700, nave: 0.006, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: null, artificialK: 2700, altarLux: 40, naveLux: 2 },
    intent: 'The nave is allowed to be dark.',
  },
  {
    time: '00:00',
    minutes: 0,
    state: {
      sunAngle: 60, sunX: 0.74, daylightK: 2400, daylight: 0,
      altarK: 2700, altar: 0, thresholdK: 2200, threshold: 0.55, naveK: 2700, nave: 0, reveal: 1, doorway: 1, altarBlock: 1,
    },
    readout: { daylightK: null, artificialK: 2200, altarLux: 0, naveLux: 0, doorLux: 8 },
    intent: 'Only the door. Enough to find it.',
  },
];

const KEYS: readonly (keyof LightState)[] = [
  'sunAngle', 'sunX', 'daylightK', 'daylight', 'altarK', 'altar',
  'thresholdK', 'threshold', 'naveK', 'nave', 'reveal', 'doorway', 'altarBlock',
];

const DAY = 1440;
/** Presets sorted by minutes (00:00 first) for segment lookup. */
const SORTED = [...HOUR_PRESETS].sort((a, b) => a.minutes - b.minutes);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Find the segment around `min` on the 24 h circle; returns eased t. */
function segment(min: number): { a: HourPreset; b: HourPreset; t: number } {
  const m = ((min % DAY) + DAY) % DAY;
  const n = SORTED.length;
  for (let i = 0; i < n; i++) {
    const a = SORTED[i]!;
    const b = SORTED[(i + 1) % n]!;
    const start = a.minutes;
    const end = i + 1 < n ? b.minutes : b.minutes + DAY;
    if (m >= start && m < end) return { a, b, t: smooth((m - start) / (end - start)) };
  }
  return { a: SORTED[0]!, b: SORTED[0]!, t: 0 };
}

/**
 * Continuous light state at `min` minutes after midnight (wraps around 24 h).
 * Pass `out` to reuse an object (no allocation when scrubbing every frame).
 */
export function stateAtMinutes(min: number, out?: LightState): LightState {
  const { a, b, t } = segment(min);
  const o = out ?? ({} as LightState);
  for (const k of KEYS) o[k] = lerp(a.state[k] ?? 1, b.state[k] ?? 1, t);
  return o;
}

const roundLux = (v: number) => (v < 20 ? Math.round(v) : v < 100 ? Math.round(v / 2) * 2 : Math.round(v / 5) * 5);
const roundK = (v: number) => Math.round(v / 50) * 50;

function lerpK(a: number | null, b: number | null, t: number, onA: number, onB: number): number | null {
  if (a !== null && b !== null) return roundK(lerp(a, b, t));
  // One side is "none": keep the live side's value while it is still visibly on.
  const live = a ?? b;
  const level = a !== null ? onA * (1 - t) : onB * t;
  return live !== null && level > 0.015 ? roundK(live) : null;
}

/** Interpolated, rounded readout for the mono spec line. */
export function readoutAtMinutes(min: number): HourReadout {
  const { a, b, t } = segment(min);
  const art = (s: LightState) => Math.max(s.altar, s.threshold, s.nave);
  const r: HourReadout = {
    daylightK: lerpK(a.readout.daylightK, b.readout.daylightK, t, a.state.daylight, b.state.daylight),
    artificialK: lerpK(a.readout.artificialK, b.readout.artificialK, t, art(a.state), art(b.state)),
    altarLux: roundLux(lerp(a.readout.altarLux, b.readout.altarLux, t)),
    naveLux: roundLux(lerp(a.readout.naveLux, b.readout.naveLux, t)),
  };
  const door = lerp(a.readout.doorLux ?? 0, b.readout.doorLux ?? 0, t);
  if (door >= 0.5) r.doorLux = roundLux(door);
  return r;
}

let webgl2Support: boolean | undefined;
export function supportsWebGL2(): boolean {
  if (webgl2Support !== undefined) return webgl2Support;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    webgl2Support = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2Support = false;
  }
  return webgl2Support;
}

/* ------------------------------------------------------------------------ */
/* Shaders                                                                   */
/* ------------------------------------------------------------------------ */

const VERT = /* glsl */ `#version 300 es
precision highp float;
uniform vec4 uK;      // kelvin: sun, altar, door, nave
uniform vec4 uI;      // intensity (already * reveal): sun, altar, door, nave
uniform float uWarm;  // dim-to-warm factor from reveal (1 = nominal CCT)
flat out vec3 vSun;
flat out vec3 vAltar;
flat out vec3 vDoor;
flat out vec3 vNave;

// Tanner Helland's blackbody fit (sRGB-ish), linearised and normalised to unit luminance.
vec3 kelvin(float k) {
  float t = clamp(k, 1000.0, 12000.0) / 100.0;
  vec3 c;
  if (t <= 66.0) {
    c.r = 1.0;
    c.g = clamp(0.39008157876 * log(t) - 0.63184144378, 0.0, 1.0);
    c.b = t <= 19.0 ? 0.0 : clamp(0.54320678911 * log(t - 10.0) - 1.19625408914, 0.0, 1.0);
  } else {
    c.r = clamp(1.29293618606 * pow(t - 60.0, -0.1332047592), 0.0, 1.0);
    c.g = clamp(1.12989086089 * pow(t - 60.0, -0.0755148492), 0.0, 1.0);
    c.b = 1.0;
  }
  c = pow(c, vec3(2.2));
  c /= max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-4);
  // art direction: pull 18% toward neutral so 2200 K reads as tungsten, not sodium
  return mix(vec3(1.0), c, 0.82);
}

void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  vSun = kelvin(uK.x * uWarm) * uI.x;
  vAltar = kelvin(uK.y * uWarm) * uI.y;
  vDoor = kelvin(uK.z * uWarm) * uI.z;
  vNave = kelvin(uK.w * uWarm) * uI.w;
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform vec4 uGeo;    // tan(sunAngle), slit x, landing x, half-width of the view at the wall
uniform vec2 uLayout; // altar x, door x
uniform float uZoom;  // >1 widens the view on portrait frames so the room still reads
uniform vec2 uShow;   // doorway, altar block: 1 = built, 0 = plain wall / floor
flat in vec3 vSun;
flat in vec3 vAltar;
flat in vec3 vDoor;
flat in vec3 vNave;
out vec4 outColor;

const vec3 RO = vec3(0.0, 1.55, 7.5);
const float FOCAL = 1.12;
const float H = 5.4;        // ceiling plane holding the slit
const float SLIT_W = 0.5;  // slit width (m)
const float SLIT_L = 5.6;   // slit length along z (m)
const float KZ = 0.42;      // sun's lean toward the back wall per metre of drop
const float SOFTK = 0.05;   // penumbra growth per metre from the aperture (exaggerated sun disc)
const float DOOR_HW = 0.55;
const float DOOR_H = 2.35;
const vec3 FLOOR_LIN = vec3(0.0040, 0.0037, 0.0033);  // #0d0c0b
const vec3 CAP_LIN = vec3(0.8388, 0.7913, 0.7011);    // #ece6da

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
  return s;
}

// Fraction of the sun's disc visible from p through the slit (soft, analytic).
float sunLit(vec3 p) {
  float h = H - p.y;
  if (h <= 0.0) return 0.0;
  float u = p.x - uGeo.x * h - uGeo.y;        // across the slit
  float zs = p.z + KZ * h;                    // along the slit
  float soft = 0.02 + h * SOFTK;
  float hw = SLIT_W * 0.5;
  float a = smoothstep(-hw - soft, -hw + soft, u) * (1.0 - smoothstep(hw - soft, hw + soft, u));
  float b = smoothstep(-1.0 - soft, -1.0 + soft, zs) * (1.0 - smoothstep(SLIT_L - soft * 3.0, SLIT_L + soft * 3.0, zs));
  return a * b;
}

float spot(vec3 p, vec3 n, vec3 pos, vec3 dir, float cosIn, float cosOut, float r0) {
  vec3 L = pos - p;
  float r2 = dot(L, L);
  vec3 l = L * inversesqrt(r2);
  float cone = smoothstep(cosOut, cosIn, dot(-l, dir));
  return cone * max(dot(n, l), 0.0) / (r2 + r0);
}

float pointL(vec3 p, vec3 n, vec3 pos, float r0) {
  vec3 L = pos - p;
  float r2 = dot(L, L);
  return max(dot(n, L * inversesqrt(r2)), 0.0) / (r2 + r0);
}

bool boxHit(vec3 ro, vec3 rd, vec3 bmin, vec3 bmax, out float tN, out vec3 nrm) {
  vec3 inv = 1.0 / rd;
  vec3 t0 = (bmin - ro) * inv, t1 = (bmax - ro) * inv;
  vec3 tmin = min(t0, t1), tmax = max(t0, t1);
  tN = max(max(tmin.x, tmin.y), tmin.z);
  float tF = min(min(tmax.x, tmax.y), tmax.z);
  if (tF < max(tN, 0.0)) return false;
  nrm = tN == tmin.x ? vec3(-sign(rd.x), 0.0, 0.0) : tN == tmin.y ? vec3(0.0, -sign(rd.y), 0.0) : vec3(0.0, 0.0, -sign(rd.z));
  return true;
}

// Radiance leaving surface point p. surf: 0 wall, 1 floor, 2 altar block.
// aa: screen-space footprint of the background hit (fwidth taken in main, outside branches).
vec3 shade(vec3 p, vec3 n, int surf, vec2 aa, vec3 sd) {
  float tanA = uGeo.x;
  float xLand = uGeo.z;
  float xA = uLayout.x, xD = uLayout.y;

  // --- material ---------------------------------------------------------
  float alb;
  float door = 0.0;
  if (surf == 0) {
    // limewash: low-frequency mottling + relief that only raking light reveals
    vec2 q = p.xy * 1.6;
    float m = fbm(q);
    float e = 0.04;
    vec2 g = vec2(fbm(q + vec2(e, 0.0)) - m, fbm(q + vec2(0.0, e)) - m) / e;
    n = normalize(vec3(-g.x * 0.05, -g.y * 0.05, 1.0));
    alb = 0.74 * (0.88 + 0.24 * m);
    float a = aa.x * 1.5;
    door = uShow.x * (1.0 - smoothstep(DOOR_HW - a, DOOR_HW + a, abs(p.x - xD))) *
           (1.0 - smoothstep(DOOR_H - a, DOOR_H + a, p.y));
  } else if (surf == 1) {
    float m = fbm(p.xz * vec2(0.9, 1.6));
    alb = 0.36 * (0.86 + 0.28 * m);
    // faint slab joints, fading with distance so they never alias
    float a = aa.y + 0.004;
    float j = 1.0 - smoothstep(0.0, a * 1.5, abs(fract(p.z / 1.2 + 0.5) - 0.5) * 1.2);
    alb *= 1.0 - 0.08 * j * smoothstep(0.08, 0.02, a);
  } else {
    alb = 0.52 * (0.9 + 0.2 * fbm(p.xy * 3.0 + p.z));
  }

  // --- lighting (irradiance) ------------------------------------------
  float occl = surf == 0 ? smoothstep(-0.1, 1.1, p.y) : surf == 1 ? smoothstep(-0.1, 1.1, p.z) : 1.0;
  occl = 0.45 + 0.55 * occl;

  vec3 E = vec3(0.0);
  // sun through the slit
  float lit = sunLit(p);
  E += vSun * (lit * max(dot(n, -sd), 0.0) * 3.2);
  // sky fill from the slit side + bounce from the lit floor band and wall blade
  float sideFill = 0.35 + 0.65 * exp(-pow((p.x - uGeo.y) / (uGeo.w * 1.1), 2.0));
  float elev = pow(inversesqrt(1.0 + tanA * tanA), 4.0); // cos^4: high sun floods the nave
  E += vSun * ((0.0018 + 0.012 * elev) * sideFill * occl);
  float bandLen = 2.6;
  E += vSun * (0.07 * pointL(p, n, vec3(xLand, 0.02, bandLen), 2.5) * occl);
  E += vSun * (0.03 * pointL(p, n, vec3(xLand - tanA * 1.6, 1.6, 0.02), 1.8) * occl);

  // altar downlight: grazes the apse wall, leaves a scallop and a crisp top
  vec3 aPos = vec3(xA, 4.9, 1.45);
  vec3 aDir = normalize(vec3(xA, 0.85, 0.15) - aPos);
  E += vAltar * (26.0 * spot(p, n, aPos, aDir, 0.982, 0.935, 0.05));
  E += vAltar * (0.06 * pointL(p, n, vec3(xA, 1.1, 1.2), 1.5) * occl); // spill

  // threshold downlight over the door: pool on the floor in front of it
  vec3 dPos = vec3(xD, 2.7, 0.55);
  vec3 dDir = normalize(vec3(0.0, -1.0, 0.55));
  E += vDoor * (3.0 * spot(p, n, dPos, dDir, 0.95, 0.74, 0.08));

  // nave: broad soft overhead wash
  E += vNave * (34.0 * pointL(p, n, vec3(0.2, 7.5, 3.2), 8.0) * occl);

  // a breath of ambient so shadows are tinted, never crushed
  E += vec3(1.0, 0.92, 0.82) * (0.0026 * occl);

  vec3 rad = E * alb;
  // doorway: a void with a little warm light beyond it (faded into the wall by uShow.x)
  if (door > 0.0) {
    float glow = pow(smoothstep(DOOR_H + 0.4, 0.0, p.y), 2.0);
    vec3 inside = vDoor * (0.035 * glow) + vec3(1.0, 0.92, 0.82) * 0.0004;
    rad = mix(rad, inside, door);
  }
  return rad;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;
  vec3 rd = normalize(vec3(uv * uZoom, -FOCAL));

  float tanA = uGeo.x;
  vec3 sd = normalize(vec3(tanA, -1.0, -KZ));   // sun travel direction
  float xA = uLayout.x;

  // --- primary hit: wall / floor, then the altar block in front ----------
  float tW = RO.z / -rd.z;
  float tF = rd.y < 0.0 ? RO.y / -rd.y : 1e9;
  float tBg = min(tW, tF);
  vec3 nBg = tW < tF ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  int sBg = tW < tF ? 0 : 1;
  vec3 pBg = RO + rd * tBg;
  vec2 aa = vec2(fwidth(pBg.x), fwidth(pBg.z)); // uniform control flow

  float tHit = tBg;
  vec3 rad;
  float tB; vec3 nB;
  if (uShow.y > 0.001 &&
      boxHit(RO, rd, vec3(xA - 0.78, 0.0, 0.0), vec3(xA + 0.78, 1.02, 0.74), tB, nB) && tB > 0.0 && tB < tBg) {
    vec3 boxRad = shade(RO + rd * tB, nB, 2, aa, sd);
    // altarBlock < 1 dissolves the block into what is behind it
    rad = uShow.y >= 0.999 ? boxRad : mix(shade(pBg, nBg, sBg, aa, sd), boxRad, uShow.y);
    if (uShow.y >= 0.5) tHit = tB;
  } else {
    rad = shade(pBg, nBg, sBg, aa, sd);
  }

  // --- the shaft in the air: analytic slab interval, jittered march ------
  float c0 = tanA * H + uGeo.y;
  float u0 = RO.x + tanA * RO.y - c0;
  float du = rd.x + tanA * rd.y;
  float span = SLIT_W * 0.5 + 0.02 + (H + 1.0) * SOFTK;
  float haze = 0.0;
  if (abs(du) > 1e-5) {
    float ta = (-span - u0) / du, tb = (span - u0) / du;
    float t1 = max(min(ta, tb), 0.0), t2 = min(max(ta, tb), tHit);
    if (t2 > t1) {
      float jit = hash12(frag + 7.13);
      float dt = (t2 - t1) / 10.0;
      for (int i = 0; i < 10; i++) {
        vec3 s = RO + rd * (t1 + (float(i) + jit) * dt);
        float dens = 0.55 + 0.9 * vnoise(s.xy * 1.7 + s.z * 0.6) * vnoise(s.zy * 0.9 + 3.1);
        haze += sunLit(s) * dens;
      }
      haze *= dt;
    }
  }
  // dust motes: sparse specks, only where the beam is
  vec2 cell = floor(frag / max(uRes.y / 520.0, 1.0));
  float mote = step(0.9965, hash12(cell + 19.7)) * hash12(cell * 1.3 + 2.1);
  // saturating: a long grazing path (high sun) must not turn the air into a grey wedge
  rad += vSun * (0.03 * (1.0 - exp(-haze * 0.5)) + 0.3 * mote * min(haze, 0.6));

  // --- grade: soft shoulder, lifted to the ground, capped at limewash -----
  vec3 tm = 1.0 - exp(-rad * 2.4);
  vec3 lin = FLOOR_LIN + tm * (CAP_LIN - FLOOR_LIN);
  vec3 srgb = mix(lin * 12.92, 1.055 * pow(lin, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, lin));
  srgb += (hash12(frag) - 0.5) * (1.6 / 255.0); // dither: no banding in the dark
  outColor = vec4(srgb, 1.0);
}
`;

/* ------------------------------------------------------------------------ */
/* Renderer                                                                  */
/* ------------------------------------------------------------------------ */

let warned = false;
function warnOnce(msg: string, detail?: unknown): void {
  if (warned) return;
  warned = true;
  console.warn(`[lightRenderer] ${msg}`, detail ?? '');
}

/** Lose-context extensions per canvas, so a renderer re-created on the same
 *  canvas (React StrictMode, route re-entry) can restore the lost context. */
const loseExt = new WeakMap<HTMLCanvasElement, WEBGL_lose_context>();
/** Canvases that carry a permanent preventDefault on context loss. Without it a
 *  context lost by destroy() (listeners already removed) can never be restored. */
const restorable = new WeakSet<HTMLCanvasElement>();
/** loseContext() dispatches its event asynchronously; restoring before that
 *  event has been handled is refused, so a re-mount waits for it. */
const lossPending = new WeakSet<HTMLCanvasElement>();
const waitingRestore = new WeakMap<HTMLCanvasElement, () => void>();
const allowRestore = (e: Event) => {
  e.preventDefault();
  const canvas = e.target as HTMLCanvasElement;
  lossPending.delete(canvas);
  const restore = waitingRestore.get(canvas);
  if (restore) {
    waitingRestore.delete(canvas);
    setTimeout(restore, 0); // restoration is allowed only after the handler returns
  }
};

type GLRes = {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uRes: WebGLUniformLocation | null;
  uGeo: WebGLUniformLocation | null;
  uLayout: WebGLUniformLocation | null;
  uK: WebGLUniformLocation | null;
  uI: WebGLUniformLocation | null;
  uWarm: WebGLUniformLocation | null;
  uZoom: WebGLUniformLocation | null;
  uShow: WebGLUniformLocation | null;
};

function compile(gl: WebGL2RenderingContext): GLRes | null {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  const vao = gl.createVertexArray();
  if (!vs || !fs || !program || !vao) return null;
  gl.shaderSource(vs, VERT);
  gl.shaderSource(fs, FRAG);
  gl.compileShader(vs);
  gl.compileShader(fs);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (!ok && !gl.isContextLost()) {
    warnOnce('shader compile/link failed', {
      vs: gl.getShaderInfoLog(vs),
      fs: gl.getShaderInfoLog(fs),
      program: gl.getProgramInfoLog(program),
    });
  }
  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!ok) {
    gl.deleteProgram(program);
    gl.deleteVertexArray(vao);
    return null;
  }
  return {
    program,
    vao,
    uRes: gl.getUniformLocation(program, 'uRes'),
    uGeo: gl.getUniformLocation(program, 'uGeo'),
    uLayout: gl.getUniformLocation(program, 'uLayout'),
    uK: gl.getUniformLocation(program, 'uK'),
    uI: gl.getUniformLocation(program, 'uI'),
    uWarm: gl.getUniformLocation(program, 'uWarm'),
    uZoom: gl.getUniformLocation(program, 'uZoom'),
    uShow: gl.getUniformLocation(program, 'uShow'),
  };
}

const VIEW_HALF_H = 7.5 * 0.5 / 1.12; // half view height at the wall (matches RO.z / FOCAL)
const CEILING = 5.4;
const MIN_HALF_W = 2.6;

export function createLightRenderer(
  canvas: HTMLCanvasElement,
  opts: { maxDpr?: number } = {},
): LightRenderer | null {
  const maxDpr = opts.maxDpr ?? 1.5;
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    });
  } catch (e) {
    warnOnce('WebGL2 context creation threw', e);
  }
  if (!gl) {
    warnOnce('WebGL2 unavailable');
    return null;
  }
  const ctx = gl;

  const ext = ctx.getExtension('WEBGL_lose_context') ?? loseExt.get(canvas) ?? null;
  if (ext) loseExt.set(canvas, ext);
  if (!restorable.has(canvas)) {
    restorable.add(canvas);
    canvas.addEventListener('webglcontextlost', allowRestore, false);
  }

  // Optional geometry keys default to built (1) so callers that never mention them get the full room.
  const state: LightState = { ...HERO_STATE, doorway: 1, altarBlock: 1 };
  let res: GLRes | null = null;
  let dirty = true;
  let lost = ctx.isContextLost();
  let destroyed = false;

  if (!lost) {
    res = compile(ctx);
    if (!res) return null;
  }

  const onLost = (e: Event) => {
    e.preventDefault(); // allow restoration
    lost = true;
    res = null; // GPU objects are gone with the context
  };
  const onRestored = () => {
    if (destroyed) return;
    res = compile(ctx);
    lost = !res;
    dirty = true;
  };
  canvas.addEventListener('webglcontextlost', onLost, false);
  canvas.addEventListener('webglcontextrestored', onRestored, false);

  // Same canvas handed back after destroy(): ask for the context back.
  if (lost && ext) {
    const restore = () => {
      if (!destroyed && ctx.isContextLost()) ext.restoreContext();
    };
    if (lossPending.has(canvas)) waitingRestore.set(canvas, restore);
    else restore();
  }

  function resize(): void {
    if (destroyed) return;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    dirty = true;
  }

  function set(s: Partial<LightState>): void {
    for (const k of KEYS) {
      const v = s[k];
      if (v !== undefined && v !== state[k]) {
        state[k] = v;
        dirty = true;
      }
    }
  }

  function render(): void {
    if (!dirty || lost || destroyed || !res) return;
    dirty = false;
    const w = canvas.width, h = canvas.height;
    const aspect = w / h;
    // Portrait: pull back until ~5 m of wall is in frame (altar + door stay legible).
    const zoom = Math.max(1, MIN_HALF_W / (VIEW_HALF_H * aspect));
    const halfW = VIEW_HALF_H * aspect * zoom;
    const tanA = Math.tan((Math.min(75, Math.max(5, state.sunAngle)) * Math.PI) / 180);
    const xLand = (state.sunX - 0.5) * 2 * halfW * 0.85;
    const xSlit = xLand - tanA * CEILING;
    // Layout scales with the frame so portrait crops keep altar + door in view.
    const xAltar = Math.min(2.2, Math.max(0.5, halfW * 0.32));
    const xDoor = -Math.min(4.2, Math.max(0.95, halfW * 0.64));
    const r = Math.min(1, Math.max(0, state.reveal));
    const ri = r * r * (3 - 2 * r); // light rises like a dimmer, not a switch
    const warm = 0.72 + 0.28 * r;  // dim-to-warm while the filament warms

    ctx.viewport(0, 0, w, h);
    ctx.useProgram(res.program);
    ctx.bindVertexArray(res.vao);
    ctx.uniform2f(res.uRes, w, h);
    ctx.uniform4f(res.uGeo, tanA, xSlit, xLand, halfW);
    ctx.uniform2f(res.uLayout, xAltar, xDoor);
    ctx.uniform4f(res.uK, state.daylightK, state.altarK, state.thresholdK, state.naveK);
    ctx.uniform4f(res.uI, state.daylight * ri, state.altar * ri, state.threshold * ri, state.nave * ri);
    ctx.uniform1f(res.uWarm, warm);
    ctx.uniform1f(res.uZoom, zoom);
    ctx.uniform2f(res.uShow, clamp01(state.doorway ?? 1), clamp01(state.altarBlock ?? 1));
    ctx.drawArrays(ctx.TRIANGLES, 0, 3);
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    canvas.removeEventListener('webglcontextlost', onLost, false);
    canvas.removeEventListener('webglcontextrestored', onRestored, false);
    if (res && !ctx.isContextLost()) {
      ctx.bindVertexArray(null);
      ctx.useProgram(null);
      ctx.deleteProgram(res.program);
      ctx.deleteVertexArray(res.vao);
    }
    res = null;
    waitingRestore.delete(canvas);
    if (ext && !ctx.isContextLost()) {
      lossPending.add(canvas);
      ext.loseContext();
    }
    lost = true;
  }

  resize();

  return {
    set,
    render,
    resize,
    destroy,
    get lost() {
      return lost;
    },
  };
}
