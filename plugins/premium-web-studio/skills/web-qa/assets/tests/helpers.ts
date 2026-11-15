import { expect, type Page, type ConsoleMessage } from '@playwright/test';

export const VIEWPORTS = [
  { name: 'phone-s', width: 360, height: 740 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
] as const;

/** Collects console errors + uncaught exceptions; call assertClean() at the end of a test. */
export function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (m: ConsoleMessage) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return { errors, assertClean: () => expect(errors, errors.join('\n')).toEqual([]) };
}

/** Load a route and wait for fonts + React mount + first ScrollTrigger refresh. */
export async function open(page: Page, path = '/', { debug = true } = {}) {
  const url = debug ? `${path}${path.includes('?') ? '&' : '?'}debug` : path;
  await page.goto(url);
  await page.waitForFunction(() => document.fonts.status === 'loaded' && !!document.querySelector('main h1'));
  await page.waitForTimeout(300);
}

export const stats = (page: Page) =>
  page.evaluate(() => (window as unknown as { __gsapStats: () => { scrollTriggers: number; globalChildren: number; lightRenderers: number } }).__gsapStats());

/** Scroll with Lenis-aware settle: wheel in steps, then wait until scrollY stops changing. */
export async function wheelTo(page: Page, deltaTotal: number, step = 400) {
  await page.mouse.move(600, 400);
  for (let d = 0; d < Math.abs(deltaTotal); d += step) await page.mouse.wheel(0, Math.sign(deltaTotal) * step);
  await settle(page);
}
export async function settle(page: Page) {
  // A stalled frame under CPU load looks like "stopped" for one sample, so require: Lenis reports it is
  // not scrolling AND scrollY is unchanged across 3 consecutive samples (≈300 ms).
  let last = -1, stable = 0;
  for (let i = 0; i < 80; i++) {
    const { y, moving } = await page.evaluate(() => ({ y: scrollY, moving: !!(window as any).__lenis?.isScrolling }));
    stable = y === last && !moving ? stable + 1 : 0;
    if (stable >= 3) return y;
    last = y;
    await page.waitForTimeout(100);
  }
  return last;
}
