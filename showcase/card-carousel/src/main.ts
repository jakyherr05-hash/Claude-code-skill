// Archivo (OFL-1.1) with its width axis, bundled so the page needs no font CDN.
import '@fontsource-variable/archivo/wdth.css';
import './style.css';
import { createCarousel } from './carousel';

const root = document.getElementById('carousel');
if (root) {
  const carousel = createCarousel(root, { autoplay: false });
  // Exposed for the Playwright checks in tests/.
  (window as unknown as { __carousel: typeof carousel }).__carousel = carousel;
}
