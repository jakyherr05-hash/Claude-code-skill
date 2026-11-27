// Archivo (OFL-1.1) with its width axis, bundled so the page needs no font CDN.
import '@fontsource-variable/archivo/wdth.css';
import './style.css';
import { gsap } from './motion/registry';
import { createCarousel } from './carousel';

/**
 * Optional WebGL renderer (open the page with #webgl). Off by default: measured in headless Chromium, the
 * layered DOM cards held 59-60 fps under 4x CPU throttling, so the GPU path is offered for comparison on
 * real devices rather than forced. Loaded after first paint; resolves null (stay on DOM cards) on any failure.
 */
async function loadStage(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-gl]');
  if (!canvas || location.hash !== '#webgl') return null;
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return null;
    const { createCardStage } = await import('./stage/cardStage');
    const imgs = [...root.querySelectorAll<HTMLImageElement>('[data-card] img')];
    return await createCardStage(canvas, imgs, { ticker: gsap.ticker, maxDpr: 3 });
  } catch (err) {
    console.warn('WebGL stage unavailable, using DOM cards', err);
    return null;
  }
}

const root = document.getElementById('carousel');
if (root) {
  const carousel = createCarousel(root, { autoplay: true, stage: loadStage(root) });
  // Exposed for the Playwright checks in tests/.
  (window as unknown as { __carousel: typeof carousel }).__carousel = carousel;
}
