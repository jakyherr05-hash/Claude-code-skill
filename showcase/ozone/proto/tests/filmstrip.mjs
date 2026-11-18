// T6b filmstrip (TEST_PLAN 3.4): 12 evenly spaced scroll positions across each span at the REAL DPR, composed into one contact sheet.
// Not a measurement. Run after the measured runs (it must not perturb them). usage: node filmstrip.mjs [--variant default] [--query ""]
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CONFIGS, SPANS, REPORTS } from './protocol.mjs';
const pw = await import(process.env.PLAYWRIGHT ?? '/opt/node-tools/node_modules/playwright/index.mjs').catch(() => import('playwright'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const url = arg('--url', 'http://localhost:4174/'), query = arg('--query', ''), variant = arg('--variant', 'default');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
mkdirSync(path.join(REPORTS, 'filmstrip'), { recursive: true });
for (const cn of ['A', 'B', 'C']) {
  const cfg = CONFIGS[cn];
  const ctx = await browser.newContext({ viewport: cfg.viewport, deviceScaleFactor: cfg.dpr, isMobile: cfg.mobile, hasTouch: cfg.mobile });
  await ctx.addInitScript(() => { window.__OZONE_QA__ = true; });
  const page = await ctx.newPage();
  await page.goto(`${url}?audioprofile=${cfg.profile}${query ? '&' + query : ''}`);
  await page.waitForFunction(() => window.__labels && document.fonts.status === 'loaded');
  const L = await page.evaluate(() => window.__labels);
  for (const [sk, sp] of Object.entries(SPANS)) {
    const from = L.px[sp.from] + sp.padFrom, to = L.px[sp.to] + sp.padTo, shots = [];
    for (let i = 0; i < 12; i++) {
      const y = Math.round(from + ((to - from) * i) / 11);
      await page.evaluate((v) => window.scrollTo(0, v), y); await sleep(1100);
      shots.push({ y, b64: (await page.screenshot()).toString('base64') });
    }
    const cols = cfg.mobile ? 6 : 3, tw = cfg.mobile ? 190 : 480;
    const sheet = await ctx.newPage(); await sheet.setViewportSize({ width: cols * (tw + 6) + 6, height: 100 });
    await sheet.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:6px;padding:6px;font:11px sans-serif;color:#fff">${shots.map((s, i) => `<figure style="margin:0"><img style="width:${tw}px;display:block" src="data:image/png;base64,${s.b64}"><figcaption>${i + 1}/12 y=${s.y}</figcaption></figure>`).join('')}</body>`);
    await sheet.waitForTimeout(500);
    const out = path.join(REPORTS, 'filmstrip', `${sk}-${variant === 'default' ? '' : variant + '-'}${cn}-${cfg.viewport.width}x${cfg.viewport.height}@${cfg.dpr}x.jpg`);
    await sheet.screenshot({ path: out, fullPage: true }); await sheet.close();
    console.log('wrote', out);
  }
  await ctx.close();
}
await browser.close();
