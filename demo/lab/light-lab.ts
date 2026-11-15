/**
 * Verification harness for src/webgl/lightRenderer.ts.
 * Serve with `npx vite --port 5179` from demo/ and open /lab/light.html.
 * `?clean` hides the UI (for screenshots). Exposes window.__lab.
 */
import { gsap } from 'gsap';
import {
  createLightRenderer,
  supportsWebGL2,
  stateAtMinutes,
  readoutAtMinutes,
  HOUR_PRESETS,
  HERO_STATE,
  type LightRenderer,
  type LightState,
} from '../src/webgl/lightRenderer';

type Stats = {
  meanLuma: number; // mean sRGB luma 0..255 (Rec.709 weights on encoded values)
  meanY: number; // mean relative luminance (linear) 0..1
  shadowPct: number; // % of pixels with luma < 40 (reads as "in shadow")
  minLuma: number;
  maxLuma: number;
  minChannel: number;
  maxChannel: number;
  meanRGB: [number, number, number];
};

if (new URLSearchParams(location.search).has('clean')) document.body.classList.add('clean');

let canvas = document.getElementById('c') as HTMLCanvasElement;
let renderer: LightRenderer | null = null;
const readout = document.getElementById('readout')!;
const range = document.getElementById('min') as HTMLInputElement;

const tick = () => renderer?.render();

function mount(): LightRenderer | null {
  renderer = createLightRenderer(canvas, { maxDpr: 1.5 });
  renderer?.set(HERO_STATE);
  renderer?.render();
  return renderer;
}

function describe(min: number, label: string): void {
  const r = readoutAtMinutes(min);
  const preset = HOUR_PRESETS.find((p) => p.minutes === min);
  readout.textContent =
    `${label} · daylight ${r.daylightK ?? '—'} K · artificial ${r.artificialK ?? '—'} K · ` +
    `altar ${r.altarLux} lux · nave ${r.naveLux} lux${r.doorLux !== undefined ? ` · door ${r.doorLux} lux` : ''}` +
    (preset ? `\n${preset.intent}` : '');
}

function apply(state: LightState): void {
  if (!renderer) return;
  renderer.set(state);
  renderer.resize(); // forces a redraw even if the state is unchanged
  renderer.render(true); // forced + synchronous, so stats() can read the frame in the same task
}

function setPreset(i: number): void {
  if (i < 0) {
    apply(HERO_STATE);
    readout.textContent = 'hero · We design the dark first.';
    return;
  }
  const p = HOUR_PRESETS[i]!;
  apply(p.state);
  describe(p.minutes, p.time);
}

function setMinutes(min: number): void {
  apply(stateAtMinutes(min));
  const hh = String(Math.floor(min / 60)).padStart(2, '0');
  const mm = String(Math.round(min % 60)).padStart(2, '0');
  describe(min, `${hh}:${mm}`);
}

const scratch = document.createElement('canvas');
function stats(): Stats {
  // Must run in the same task as render(): the drawing buffer is not preserved.
  const w = 320, h = Math.round((320 * canvas.height) / canvas.width);
  scratch.width = w;
  scratch.height = h;
  const c2 = scratch.getContext('2d', { willReadFrequently: true })!;
  c2.drawImage(canvas, 0, 0, w, h);
  const d = c2.getImageData(0, 0, w, h).data;
  let sum = 0, sumY = 0, shadow = 0, minL = 255, maxL = 0, minC = 255, maxC = 0, r = 0, g = 0, b = 0;
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const n = w * h;
  for (let i = 0; i < d.length; i += 4) {
    const R = d[i]!, G = d[i + 1]!, B = d[i + 2]!;
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    sum += L;
    sumY += 0.2126 * lin(R) + 0.7152 * lin(G) + 0.0722 * lin(B);
    if (L < 40) shadow++;
    minL = Math.min(minL, L);
    maxL = Math.max(maxL, L);
    minC = Math.min(minC, R, G, B);
    maxC = Math.max(maxC, R, G, B);
    r += R; g += G; b += B;
  }
  const f = (x: number) => Math.round(x * 100) / 100;
  return {
    meanLuma: f(sum / n),
    meanY: Math.round((sumY / n) * 10000) / 10000,
    shadowPct: f((shadow / n) * 100),
    minLuma: f(minL),
    maxLuma: f(maxL),
    minChannel: minC,
    maxChannel: maxC,
    meanRGB: [f(r / n), f(g / n), f(b / n)],
  };
}

/** Destroy + recreate. `fresh` swaps in a new canvas element (React remount);
 *  otherwise the same element is reused (StrictMode double effect). `waitMs` > 0
 *  lets destroy()'s idle-deferred loseContext run first (exercises restore). */
async function cycle(
  times: number,
  fresh: boolean,
  waitMs = 0,
): Promise<{ ok: boolean; lostAfterDestroy: boolean[]; destroyMs: number[]; contextLostBeforeMount: boolean[]; stats: Stats[] }> {
  const destroyMs: number[] = [];
  const contextLostBeforeMount: boolean[] = [];
  const lostAfterDestroy: boolean[] = [];
  const out: Stats[] = [];
  for (let i = 0; i < times; i++) {
    const r = renderer;
    const t0 = performance.now();
    r?.destroy();
    destroyMs.push(Math.round((performance.now() - t0) * 10) / 10);
    lostAfterDestroy.push(r?.lost ?? false);
    if (waitMs > 0) await new Promise((res) => setTimeout(res, waitMs));
    contextLostBeforeMount.push(!fresh && !!canvas.getContext('webgl2')?.isContextLost());
    if (fresh) {
      const next = document.createElement('canvas');
      next.id = 'c';
      next.setAttribute('aria-hidden', 'true');
      canvas.replaceWith(next);
      canvas = next;
    }
    mount();
    // Same-canvas restore is asynchronous (webglcontextrestored).
    for (let k = 0; k < 60 && renderer?.lost; k++) await new Promise((res) => setTimeout(res, 16));
    setPreset(i % HOUR_PRESETS.length);
    out.push(stats());
  }
  return { ok: out.every((s) => s.maxLuma > 40), lostAfterDestroy, destroyMs, contextLostBeforeMount, stats: out };
}

document.getElementById('ui')!.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest('button');
  if (b) setPreset(Number(b.dataset.p));
});
range.addEventListener('input', () => setMinutes(Number(range.value)));
window.addEventListener('resize', () => renderer?.resize());

const supported = supportsWebGL2();
mount();
gsap.ticker.add(tick);
setPreset(-1);

declare global {
  interface Window {
    __lab: {
      supported: boolean;
      readonly renderer: LightRenderer | null;
      setPreset: typeof setPreset;
      setMinutes: typeof setMinutes;
      stats: typeof stats;
      cycle: typeof cycle;
      stateAtMinutes: typeof stateAtMinutes;
      readoutAtMinutes: typeof readoutAtMinutes;
      presets: typeof HOUR_PRESETS;
    };
  }
}

window.__lab = {
  supported,
  get renderer() {
    return renderer;
  },
  setPreset,
  setMinutes,
  stats,
  cycle,
  stateAtMinutes,
  readoutAtMinutes,
  presets: HOUR_PRESETS,
};
