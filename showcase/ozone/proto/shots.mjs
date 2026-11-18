// Screenshots at s4, mid-t45, s5, mid-t67 and s7 for 1440x900 and 390x844. Placeholder art: shows composition only.
// usage: node shots.mjs [baseUrl=http://localhost:4174/] [outDir=../reports/proto]   (PLAYWRIGHT=path/to/playwright/index.mjs)
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const pw = await import(process.env.PLAYWRIGHT ?? '/opt/node-tools/node_modules/playwright/index.mjs').catch(() => import('playwright'));
const base = process.argv[2] ?? 'http://localhost:4174/';
const out = path.resolve(here, process.argv[3] ?? '../reports/proto');
mkdirSync(out, { recursive: true });
const query = process.env.QUERY ?? '';
const tag = process.env.TAG ?? '';
const configs = [
  { name: '1440x900', viewport: { width: 1440, height: 900 }, dpr: 1, mobile: false },
  { name: '390x844', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true },
];
const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const c of configs) {
  const ctx = await browser.newContext({ viewport: c.viewport, deviceScaleFactor: c.dpr, isMobile: c.mobile, hasTouch: c.mobile });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.__OZONE_QA__ = true; });
  await page.goto(base + query);
  await page.waitForFunction(() => window.__labels && document.fonts.status === 'loaded');
  const L = await page.evaluate(() => window.__labels);
  const u = (n) => L.units[n], span = (a, b) => L.units[b] - L.units[a];
  const px = (units) => Math.round(L.stStart + (units / L.masterDuration) * (L.stEnd - L.stStart));
  const shots = {
    's4': (u('s4') + u('t45')) / 2,
    'mid-t45': u('t45') + 0.5 * span('t45', 's5'),
    't45-70': u('t45') + 0.7 * span('t45', 's5'),
    's5': (u('s5') + u('t56')) / 2,
    'mid-t67': u('t67') + 0.5 * span('t67', 'end'),
    't67-88': u('t67') + 0.88 * span('t67', 'end'),
    's7': L.masterDuration + 100 / 9, // end + 100 px of free scroll, in units of 9 px (approximate)
  };
  for (const [name, units] of Object.entries(shots)) {
    // approach from just below so the scrub catches up from a nearby position (no fling)
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, px(units) - 40));
    await page.waitForTimeout(250);
    await page.evaluate((y) => window.scrollTo(0, y), px(units));
    await page.waitForTimeout(1200);
    const file = path.join(out, `${tag}${c.name}-${name}.png`);
    await page.screenshot({ path: file });
    console.log('wrote', file, 'scrollY', await page.evaluate(() => Math.round(scrollY)), 'playhead', (await page.evaluate(() => window.__playhead)).toFixed(1));
  }
  await ctx.close();
}
await browser.close();
