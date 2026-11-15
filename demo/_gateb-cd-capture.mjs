import { chromium } from '@playwright/test';

const OUT = '/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/gate-b-cd/shots';
const BASE = 'http://localhost:4185';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function scrollTo(page, y) {
  await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y);
  await wait(1500);
}
async function topOf(page, sel, idx = 0) {
  return page.evaluate(([sel, idx]) => {
    const el = document.querySelectorAll(sel)[idx];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, h: r.height };
  }, [sel, idx]);
}

async function run(tag, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.push(`[${tag}] ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => log.push(`[${tag}] pageerror: ${e.message}`));
  await page.goto(`${BASE}/?debug`, { waitUntil: 'networkidle' });
  await wait(2500);
  const shot = (name) => page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
  await shot('01-hero');

  const sections = {};
  for (const [k, sel] of Object.entries({ manifesto: '.manifesto', method: '#method', hour: '#the-hour', rooms: '#work', sched: '.sched', atelier: '.atelier', contact: '#contact' })) {
    sections[k] = await topOf(page, sel);
  }
  log.push(`[${tag}] sections ${JSON.stringify(sections)}`);

  await scrollTo(page, sections.manifesto.top);
  await shot('02-manifesto');

  if (!opts.reduced) {
    const pinLen = viewport.height * (viewport.width >= 1024 ? 3 : 2);
    for (const p of [0.2, 0.55, 0.9]) {
      await scrollTo(page, sections.method.top + pinLen * p);
      await shot(`03-method-${Math.round(p * 100)}`);
    }
  } else {
    // static method: stacked drawings — walk through it
    let i = 0;
    for (let y = sections.method.top; y < sections.method.top + sections.method.h; y += viewport.height) {
      await scrollTo(page, y);
      await shot(`03-method-static-${i++}`);
    }
  }

  // The Hour
  const hour = await topOf(page, '#the-hour');
  await scrollTo(page, hour.top);
  await shot('04-hour-initial');
  for (const t of ['06:10', '13:30', '21:00', '00:00']) {
    await page.locator('.hour__presets button', { hasText: t }).click();
    await wait(1600);
    // keep section aligned (click may scroll focus)
    await scrollTo(page, hour.top);
    await shot(`04-hour-${t.replace(':', '')}`);
    if (hour.h > viewport.height * 1.05) {
      await scrollTo(page, hour.top + viewport.height * 0.85);
      await shot(`04-hour-${t.replace(':', '')}-lower`);
    }
  }

  // Rooms
  const rk = await topOf(page, '#work');
  await scrollTo(page, rk.top);
  await shot('05-rooms-top');
  for (const idx of [0, 1]) {
    const r = await topOf(page, '.room', idx);
    await scrollTo(page, r.top - viewport.height * 0.08);
    await shot(`05-room-${idx + 1}`);
    if (r.h > viewport.height) {
      await scrollTo(page, r.top + r.h - viewport.height);
      await shot(`05-room-${idx + 1}-bottom`);
    }
  }

  for (const [k, sel, n] of [['06-sched', '.sched'], ['07-atelier', '.atelier'], ['08-contact', '#contact']]) {
    const s = await topOf(page, sel);
    await scrollTo(page, s.top);
    await shot(k);
    if (s.h > viewport.height * 1.1) {
      await scrollTo(page, s.top + viewport.height * 0.9);
      await shot(`${k}-b`);
    }
  }
  // page bottom (footer)
  await page.evaluate(() => window.__lenis.scrollTo(document.documentElement.scrollHeight, { immediate: true }));
  await wait(1500);
  await shot('09-footer');

  if (!opts.reduced) {
    // hover on schedule row (desktop only)
    if (viewport.width >= 1024) {
      const s = await topOf(page, '.sched');
      await scrollTo(page, s.top);
      const row = page.locator('.sched__row').nth(2);
      await row.hover();
      await wait(600);
      await shot('06-sched-hover');
    }
    // detail route, via direct load
    await page.goto(`${BASE}/work/capela-do-silencio?debug`, { waitUntil: 'networkidle' });
    await wait(2200);
    await shot('10-detail-top');
    const dh = await page.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = viewport.height * 0.9; y < dh - 50 && i < 6; y += viewport.height * 0.9) {
      await scrollTo(page, y);
      await shot(`10-detail-${++i}`);
    }
  }
  await ctx.close();
}

await run('d1440', { width: 1440, height: 900 });
await run('m390', { width: 390, height: 844 });
await run('rm1440', { width: 1440, height: 900 }, { reduced: true });
await run('rm390', { width: 390, height: 844 }, { reduced: true });

// No-WebGL poster fallback at 390 + 1440
for (const [tag, vp] of [['nogl390', { width: 390, height: 844 }], ['nogl1440', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...a) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
      return orig.call(this, type, ...a);
    };
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => log.push(`[${tag}] pageerror: ${e.message}`));
  await page.goto(`${BASE}/?debug`, { waitUntil: 'networkidle' });
  await wait(2500);
  await page.screenshot({ path: `${OUT}/${tag}-01-hero.png` });
  const hour = await topOf(page, '#the-hour');
  await scrollTo(page, hour.top);
  await page.locator('.hour__presets button', { hasText: '21:00' }).click();
  await wait(1600);
  await scrollTo(page, hour.top);
  await page.screenshot({ path: `${OUT}/${tag}-04-hour-2100.png` });
  await ctx.close();
}

await browser.close();
console.log(log.join('\n'));
