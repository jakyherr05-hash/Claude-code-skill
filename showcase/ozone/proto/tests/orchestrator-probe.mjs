// Orchestrator spot-check (not the TEST_PLAN §3 protocol): no CPU throttle, no trace, one wheel pass, rAF intervals. Usage: node orchestrator-probe.mjs <span> [query] [w h dpr]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const [,, span='t45', q='', w='1440', h='900', dpr='1'] = process.argv;
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width:+w, height:+h }, deviceScaleFactor:+dpr });
await ctx.addInitScript(() => { window.__OZONE_QA__ = true; });
const p = await ctx.newPage();
await p.goto('http://localhost:4174/' + (q ? '?' + q : ''));
await p.waitForFunction(() => window.__labels && performance.getEntriesByName('story-ready').length, null, { timeout: 30000 });
const L = await p.evaluate(() => window.__labels.px);
const keys = Object.keys(L); const i = keys.indexOf(span);
const from = L[span], to = L[keys[i+1]] ?? (L[span] + 1500);
await p.evaluate(y => window.scrollTo(0, y - 50), from); await p.waitForTimeout(1500);
await p.mouse.move(400, 400);
await p.evaluate(() => { window.__f = []; let t = performance.now(); const f = n => { window.__f.push(n - t); t = n; requestAnimationFrame(f); }; requestAnimationFrame(f); });
const steps = Math.ceil((to - from + 100) / 60);
for (let k = 0; k < steps; k++) { p.mouse.wheel(0, 60); await new Promise(r => setTimeout(r, 16)); }
await p.waitForTimeout(800);
const f = await p.evaluate(() => window.__f.slice(1));
f.sort((a, b) => a - b);
const p95 = f[Math.floor(f.length * .95)], over50 = f.filter(x => x > 50.5).length;
console.log(JSON.stringify({ span, q, vp: `${w}x${h}@${dpr}`, scrollPx: to - from, frames: f.length, p50: f[f.length>>1].toFixed(1), p95: p95.toFixed(1), max: f.at(-1).toFixed(1), over50 }));
await b.close();
