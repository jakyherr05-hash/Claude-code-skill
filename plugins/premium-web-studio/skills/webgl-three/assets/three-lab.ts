/**
 * Verification harness for lab/threeStage.ts (the webgl-three skill template).
 * Serve with `npx vite --port 5179` from demo/ and open /lab/three.html (`?clean` hides UI).
 * Exposes window.__three = { stage, info, mount, unmount, stats }.
 */
import { gsap } from 'gsap';
import type { ThreeStage } from './threeStage';

if (new URLSearchParams(location.search).has('clean')) document.body.classList.add('clean');

const host = document.getElementById('host')!;
const range = document.getElementById('p') as HTMLInputElement;
let stage: ThreeStage | null = null;
let lastInfo = { geometries: 0, textures: 0 };

async function mount(): Promise<ThreeStage> {
  // Lazy-load: three.js is fetched only when the stage is actually needed.
  const { createThreeStage } = await import('./threeStage');
  let canvas = host.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    host.append(canvas);
  }
  stage = createThreeStage(canvas, { maxDpr: 1.5, ticker: gsap.ticker });
  stage.setProgress(Number(range.value));
  return stage;
}

/** Dispose and remove the canvas (a force-lost canvas can't host a new context). */
function unmount(): { geometries: number; textures: number } {
  if (!stage) return lastInfo;
  const r = stage.renderer;
  stage.dispose();
  lastInfo = { geometries: r.info.memory.geometries, textures: r.info.memory.textures };
  host.querySelector('canvas')?.remove();
  stage = null;
  return lastInfo;
}

/** Render synchronously and sample the frame (same task as the draw). */
function stats(): { meanLuma: number; maxLuma: number; litPct: number } {
  if (!stage) return { meanLuma: 0, maxLuma: 0, litPct: 0 };
  stage.resize();
  stage.render();
  const src = stage.renderer.domElement;
  const c = document.createElement('canvas');
  c.width = 240;
  c.height = Math.round((240 * src.height) / src.width);
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.drawImage(src, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let sum = 0, max = 0, lit = 0;
  for (let i = 0; i < d.length; i += 4) {
    const L = 0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]!;
    sum += L;
    max = Math.max(max, L);
    if (L > 30) lit++;
  }
  const n = d.length / 4;
  return { meanLuma: Math.round((sum / n) * 100) / 100, maxLuma: Math.round(max), litPct: Math.round((lit / n) * 1000) / 10 };
}

range.addEventListener('input', () => stage?.setProgress(Number(range.value)));

declare global {
  interface Window {
    __three: {
      readonly stage: ThreeStage | null;
      info: () => { geometries: number; textures: number };
      mount: typeof mount;
      unmount: typeof unmount;
      stats: typeof stats;
      ready: Promise<ThreeStage>;
    };
  }
}

const ready = mount();
window.__three = {
  get stage() {
    return stage;
  },
  info: () => (stage ? { ...stage.renderer.info.memory } : lastInfo),
  mount,
  unmount,
  stats,
  ready,
};
