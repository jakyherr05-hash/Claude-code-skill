import { test, expect } from '@playwright/test';
import { open } from './helpers';

/**
 * Visual regression. Deterministic captures: reduced motion (final states, no smoothing),
 * WebGL canvases masked (GPU/driver-dependent pixels are covered by the WebGL functional tests instead).
 * Baselines live in tests/__screenshots__. Update ONLY after inspecting diffs: npm run test:update-snapshots
 */
test.use({ reducedMotion: 'reduce' });

const SHOTS: { name: string; path: string; selector: string }[] = [
  { name: 'hero', path: '/', selector: '.hero' },
  { name: 'method-static', path: '/', selector: '#method' },
  { name: 'the-hour', path: '/', selector: '#the-hour' },
  { name: 'schedule', path: '/', selector: '.sched' },
  { name: 'contact', path: '/', selector: '#contact' },
  { name: 'detail-head', path: '/work/capela-do-silencio', selector: '.detail__head' },
];

for (const width of [390, 1440]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: width < 800 ? 844 : 900 } });
    for (const s of SHOTS) {
      test(s.name, async ({ page }) => {
        await open(page, s.path);
        // Tall element captures are stitched by scrolling, which paints the FIXED header into the middle
        // of the image; hide it (header/nav have their own functional + responsive coverage). Hide WebGL
        // canvases rather than masking them so the deterministic poster underneath is what gets compared
        // (GPU pixels are covered by the WebGL functional tests).
        await page.addStyleTag({ content: '.site-header, .skip, .skip-link { visibility: hidden !important; } canvas { visibility: hidden !important; }' });
        const el = page.locator(s.selector).first();
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await expect(el).toHaveScreenshot(`${s.name}-${width}.png`);
      });
    }
  });
}
