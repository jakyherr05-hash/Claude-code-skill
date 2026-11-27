// Playwright checks for the card carousel. Run: npm run build && npm run preview, then npm test.
// Usage: node tests/carousel.check.mjs [baseUrl] [shotsDir]
import { createRequire } from 'node:module';
// Uses the machine's Playwright (require resolves global installs; ESM import does not).
const { chromium, devices } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4175/';
const SHOTS = process.argv[3] ?? 'test-results';
mkdirSync(SHOTS, { recursive: true });

let failed = 0;
const check = (ok, label, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? `  (${extra})` : ''}`);
  if (!ok) failed++;
};
const idx = (page) => page.evaluate(() => window.__carousel.index);
const ready = (page) => page.waitForFunction(() => window.__carousel?.ready, null, { timeout: 8000 });
const settle = (page) => page.waitForTimeout(1300);
const frontCard = (page) =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-card]')];
    return cards.reduce((best, c, i) => (+c.style.zIndex > +cards[best].style.zIndex ? i : best), 0);
  });
const cardX = (page, i) =>
  page.evaluate((i) => { const r = document.querySelectorAll('[data-card]')[i].getBoundingClientRect(); return r.x + r.width / 2; }, i);

const browser = await chromium.launch();

// ---------- Phone: entry + touch swipe ----------
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);

  // Entry: early on, the cards are stacked near the centre; swiping is not live yet.
  await page.waitForFunction(() => window.__carousel, null, { timeout: 5000 });
  await page.waitForTimeout(450);
  const spreadEarly = await page.evaluate(() => {
    const xs = [...document.querySelectorAll('[data-card]')].map((c) => c.getBoundingClientRect().x);
    return Math.max(...xs) - Math.min(...xs);
  });
  const readyEarly = await page.evaluate(() => window.__carousel.ready);
  await page.screenshot({ path: `${SHOTS}/phone-entry-early.png` });
  await ready(page);
  await page.waitForTimeout(300);
  const spreadEnd = await page.evaluate(() => {
    const xs = [...document.querySelectorAll('[data-card]')].filter((c) => c.style.visibility !== 'hidden').map((c) => c.getBoundingClientRect().x);
    return Math.max(...xs) - Math.min(...xs);
  });
  check(!readyEarly, 'entry: swipe is locked while the entry plays');
  check(spreadEnd > spreadEarly * 2 && spreadEnd > 150, 'entry: deck fans out from a stack', `spread ${spreadEarly.toFixed(0)} -> ${spreadEnd.toFixed(0)} px`);
  await page.screenshot({ path: `${SHOTS}/phone-ready.png` });

  // 1:1 ratio.
  const sq = await page.evaluate(() => [...document.querySelectorAll('[data-card]')].map((c) => [c.offsetWidth, c.offsetHeight]));
  check(sq.every(([w, h]) => Math.abs(w - h) <= 1), 'every card is 1:1', JSON.stringify(sq[0]));

  // Touch swipe left, step by step, via CDP touch events.
  const cdp = await ctx.newCDPSession(page);
  const box = await page.locator('[data-stage]').boundingBox();
  const y = box.y + box.height / 2;
  const touch = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  const startIdx = await idx(page);
  const incoming = (startIdx + 1) % 5;
  const x0 = await cardX(page, incoming);
  await touch('touchStart', 300);
  for (let i = 1; i <= 8; i++) { await touch('touchMove', 300 - i * 12); await page.waitForTimeout(30); }
  const xMid = await cardX(page, incoming);
  check(xMid < x0 - 40, 'swipe: next card follows the finger during the drag', `${x0.toFixed(0)} -> ${xMid.toFixed(0)} px`);
  await page.screenshot({ path: `${SHOTS}/phone-mid-swipe.png` });
  await page.waitForTimeout(250); // pause so the release is slow (no flick)
  await touch('touchEnd');
  await settle(page);
  check((await idx(page)) === incoming, 'swipe: slow drag past 15% snaps to next', `index ${await idx(page)}`);
  check((await frontCard(page)) === incoming, 'swipe: new card ends on top of the stack');

  // A tiny slow drag snaps back.
  const before = await idx(page);
  await touch('touchStart', 200);
  for (let i = 1; i <= 3; i++) { await touch('touchMove', 200 - i * 4); await page.waitForTimeout(40); }
  await page.waitForTimeout(250);
  await touch('touchEnd');
  await settle(page);
  check((await idx(page)) === before, 'swipe: tiny drag snaps back');

  // A short fast flick to the right goes back one.
  await touch('touchStart', 120);
  for (let i = 1; i <= 3; i++) { await touch('touchMove', 120 + i * 15); await page.waitForTimeout(8); }
  await touch('touchEnd');
  await settle(page);
  check((await idx(page)) === (before + 4) % 5, 'swipe: short fast flick changes slide', `index ${await idx(page)}`);
  check(errors.length === 0, 'phone: no page errors', errors.join('; '));
  await ctx.close();
}

// ---------- Desktop: mouse drag, buttons, keys, dots, loop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, recordVideo: { dir: SHOTS, size: { width: 640, height: 430 } } });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await ready(page);
  const box = await page.locator('[data-stage]').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

  await page.mouse.move(cx + 100, cy);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + 100 - i * 18, cy); await page.waitForTimeout(25); }
  await page.screenshot({ path: `${SHOTS}/desktop-mid-drag.png` });
  await page.waitForTimeout(250);
  await page.mouse.up();
  await settle(page);
  check((await idx(page)) === 1, 'mouse drag: goes to next', `index ${await idx(page)}`);

  await page.click('[data-next]'); await settle(page);
  check((await idx(page)) === 2, 'next button');
  check((await page.locator('[data-caption-title]').textContent()) === 'Analog digital', 'caption changes with the slide');
  check(await page.evaluate(() => [...document.querySelectorAll('[data-card] img')].length === 5), 'every card still holds its image');
  await page.click('[data-prev]'); await settle(page);
  check((await idx(page)) === 1, 'prev button');
  await page.keyboard.press('ArrowRight'); await settle(page);
  check((await idx(page)) === 2, 'ArrowRight key');
  await page.keyboard.press('ArrowLeft'); await settle(page);
  check((await idx(page)) === 1, 'ArrowLeft key');
  await page.click('.dot >> nth=4'); await settle(page);
  check((await idx(page)) === 4, 'dot jumps to slide 5');
  await page.click('[data-next]'); await settle(page);
  check((await idx(page)) === 0, 'loops from last to first');
  check((await page.locator('[data-caption-title]').textContent()) === 'Prompt guide', 'caption follows the active slide');
  await page.screenshot({ path: `${SHOTS}/desktop.png` });
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 800, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await ready(page);
  await page.click('[data-next]'); await page.waitForTimeout(400);
  check((await idx(page)) === 1, 'reduced motion: still navigable');
  await ctx.close();
}

await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
