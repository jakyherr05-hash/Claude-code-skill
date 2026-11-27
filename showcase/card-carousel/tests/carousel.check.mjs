// Playwright checks for the card carousel. Run: npm run build && npm run preview, then npm test.
// Usage: node tests/carousel.check.mjs [baseUrl] [shotsDir]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
// Uses the machine's Playwright (require resolves global installs; ESM import does not).
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4175/';
const SHOTS = process.argv[3] ?? 'test-results';
mkdirSync(SHOTS, { recursive: true });

// Reference numbers measured from the source recording (phone, 390 x 689 CSS px).
const REF = {
  period: 0.834, move: 0.731, bezier: [0.766, 0, 0.239, 1], pathExp: 0.82,
  spacing: 0.5, // neighbour centres at ±50% of the viewport width
  cardWidth: 0.704, neighbourScale: 0.93,
};

let failed = 0;
const check = (ok, label, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? `  (${extra})` : ''}`);
  if (!ok) failed++;
};
const idx = (page) => page.evaluate(() => window.__carousel.index);
const ready = (page) => page.waitForFunction(() => window.__carousel?.ready, null, { timeout: 8000 });
const settle = (page, ms = 1000) => page.waitForTimeout(ms);
const frontCard = (page) =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-card]')];
    return cards.reduce((best, c, i) => (+c.style.zIndex > +cards[best].style.zIndex ? i : best), 0);
  });
const cardX = (page, i) =>
  page.evaluate((i) => new DOMMatrix(getComputedStyle(document.querySelectorAll('[data-card]')[i]).transform).m41, i);

function bezier(x, [x1, y1, x2, y2]) {
  let t = x;
  for (let k = 0; k < 40; k++) {
    const bx = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3;
    const dx = 3 * (1 - t) ** 2 * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t ** 2 * (1 - x2);
    t = Math.min(1, Math.max(0, t - (bx - x) / (Math.abs(dx) < 1e-6 ? 1e-6 : dx)));
  }
  return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
}

const browser = await chromium.launch();

// ---------- Fidelity to the recording: same viewport as the source phone ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 689 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);

  await page.waitForFunction(() => window.__carousel, null, { timeout: 5000 });
  const readyEarly = await page.evaluate(() => window.__carousel.ready);
  check(!readyEarly, 'entry: input is locked while the entry plays');
  await ready(page);

  // Sample every card's centre on each animation frame for 4.5 s of autoplay.
  const samples = await page.evaluate(() => new Promise((res) => {
    const cards = [...document.querySelectorAll('[data-card]')];
    const out = []; const t0 = performance.now();
    const tick = () => {
      const t = performance.now() - t0;
      out.push([t / 1000, ...cards.map((c) => new DOMMatrix(getComputedStyle(c).transform).m41)]);
      if (t < 4500) requestAnimationFrame(tick); else res(out);
    };
    requestAnimationFrame(tick);
  }));
  const vw = 390;
  const speed = (k) => Math.max(...samples[k].slice(1).map((x, i) => Math.abs(x - samples[k - 1][i + 1])));
  const starts = [];
  for (let k = 2; k < samples.length; k++) if (speed(k) > 0.05 && speed(k - 1) <= 0.05) starts.push(samples[k - 1][0]);
  const gaps = starts.slice(1).map((s, i) => s - starts[i]);
  const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  check(gaps.length >= 3 && Math.abs(meanGap - REF.period) < 0.012, 'autoplay rhythm matches the recording', `${meanGap.toFixed(3)} s vs ${REF.period} s`);

  // Trajectory of the incoming card in one move vs the measured curve.
  const s0 = starts[1];
  const k0 = samples.findIndex((s) => s[0] >= s0) - 1;
  const xs0 = samples[k0].slice(1);
  const incoming = xs0.reduce((b, x, i) => (x > 1 && (b < 0 || x < xs0[b]) ? i : b), -1);
  let worst = 0, sum = 0, cnt = 0;
  for (const s of samples) {
    const u = (s[0] - s0) / REF.move;
    if (u < 0 || u > 1) continue;
    const P = bezier(u, REF.bezier);
    const model = REF.spacing * vw * (1 - P) ** REF.pathExp;
    const e = Math.abs(s[1 + incoming] - model);
    worst = Math.max(worst, e); sum += e * e; cnt++;
  }
  const rms = Math.sqrt(sum / cnt);
  check(rms < 3 && worst < 8, 'move follows the measured path and ease', `rms ${rms.toFixed(2)} px, max ${worst.toFixed(1)} px of ${REF.spacing * vw} px travel`);

  // Rest geometry.
  await page.evaluate(() => window.__carousel.pause());
  await settle(page, 1000);
  const geo = await page.evaluate(() => [...document.querySelectorAll('[data-card]')].map((c) => {
    const m = new DOMMatrix(getComputedStyle(c).transform);
    return { x: m.m41, s: m.m22, w: c.offsetWidth, h: c.offsetHeight };
  }));
  const sorted = [...geo].sort((a, b) => Math.abs(a.x) - Math.abs(b.x));
  check(Math.abs(sorted[0].w / vw - REF.cardWidth) < 0.005, 'front card width = 70.4% of the screen', `${(sorted[0].w / vw * 100).toFixed(1)}%`);
  check(sorted.slice(1, 3).every((g) => Math.abs(Math.abs(g.x) - REF.spacing * vw) < 2), 'neighbours sit on the screen edges', sorted.slice(1, 3).map((g) => g.x.toFixed(1)).join(', '));
  check(sorted.slice(1, 3).every((g) => Math.abs(g.s - REF.neighbourScale) < 0.003), 'neighbour scale 0.93', sorted[1].s.toFixed(3));
  check(geo.every((g) => Math.abs(g.w - g.h) <= 1), 'every card is 1:1', `${geo[0].w}x${geo[0].h}`);
  await page.screenshot({ path: `${SHOTS}/phone-rest.png` });

  // Pause control.
  const i0 = await idx(page); await settle(page, 1200);
  check((await idx(page)) === i0, 'pause stops the loop');
  await page.evaluate(() => window.__carousel.play()); await settle(page, 1000);
  check((await idx(page)) !== i0, 'play resumes the loop');
  check(errors.length === 0, 'no page errors', errors.join('; '));
  await ctx.close();
}

// ---------- Phone: touch swipe ----------
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await ready(page);
  await page.evaluate(() => window.__carousel.pause());
  await settle(page, 900);
  const cdp = await ctx.newCDPSession(page);
  const box = await page.locator('[data-stage]').boundingBox();
  const y = box.y + box.height / 2;
  const touch = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });

  const startIdx = await idx(page);
  const front0 = await cardX(page, startIdx);
  await touch('touchStart', 300);
  for (let i = 1; i <= 8; i++) { await touch('touchMove', 300 - i * 10); await page.waitForTimeout(30); }
  const frontMid = await cardX(page, startIdx);
  // Observer starts counting after its 3 px drag threshold, so allow a few px.
  check(Math.abs((front0 - frontMid) - 80) < 6, 'swipe: the card under the finger moves with it 1:1', `moved ${(front0 - frontMid).toFixed(1)} px for 80 px`);
  await page.screenshot({ path: `${SHOTS}/phone-mid-swipe.png` });
  await page.waitForTimeout(250);
  await touch('touchEnd');
  await settle(page);
  const after = await idx(page);
  check(after === (startIdx + 1) % 5, 'swipe: slow drag past 15% snaps to next', `index ${after}`);
  check((await frontCard(page)) === after, 'swipe: new card ends on top');

  await touch('touchStart', 200);
  for (let i = 1; i <= 3; i++) { await touch('touchMove', 200 - i * 3); await page.waitForTimeout(40); }
  await page.waitForTimeout(250);
  await touch('touchEnd');
  await settle(page);
  check((await idx(page)) === after, 'swipe: tiny drag snaps back');

  await touch('touchStart', 120);
  for (let i = 1; i <= 3; i++) { await touch('touchMove', 120 + i * 15); await page.waitForTimeout(8); }
  await touch('touchEnd');
  await settle(page);
  check((await idx(page)) === startIdx, 'swipe: short fast flick goes back one', `index ${await idx(page)}`);
  await ctx.close();
}

// ---------- Desktop: mouse drag, keys, quick repeated input, wheel ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, recordVideo: { dir: SHOTS, size: { width: 640, height: 430 } } });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await ready(page);
  await page.evaluate(() => window.__carousel.pause());
  await settle(page, 900);
  const i0 = await idx(page);
  const box = await page.locator('[data-stage]').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx + 100, cy);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + 100 - i * 18, cy); await page.waitForTimeout(25); }
  await page.waitForTimeout(250);
  await page.mouse.up();
  await settle(page);
  check((await idx(page)) === (i0 + 1) % 5, 'mouse drag: goes to next');

  await page.keyboard.press('ArrowRight'); await settle(page);
  check((await idx(page)) === (i0 + 2) % 5, 'ArrowRight key');
  await page.keyboard.press('ArrowLeft'); await settle(page);
  check((await idx(page)) === (i0 + 1) % 5, 'ArrowLeft key');

  for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(60); }
  await settle(page, 1600);
  check((await idx(page)) === (i0 + 5) % 5, '4 quick key presses move exactly 4 cards', `index ${await idx(page)}`);

  await page.mouse.move(cx, cy);
  const w0 = await idx(page);
  await page.mouse.wheel(80, 0); await settle(page);
  check((await idx(page)) === (w0 + 1) % 5, 'one sideways wheel gesture moves one card');
  const p = await page.evaluate(() => window.__carousel.progress);
  check(Math.abs(p - Math.round(p)) < 0.001, 'wheel settles exactly on a card');
  await page.screenshot({ path: `${SHOTS}/desktop.png` });
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 800, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await ready(page);
  const i0 = await idx(page); await page.waitForTimeout(1500);
  check((await idx(page)) === i0, 'reduced motion: no autoplay');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
  check((await idx(page)) === (i0 + 1) % 5, 'reduced motion: still navigable');
  await ctx.close();
}

await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
