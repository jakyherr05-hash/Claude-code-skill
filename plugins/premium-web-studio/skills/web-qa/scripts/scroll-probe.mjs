#!/usr/bin/env node
/**
 * scroll-probe.mjs <url> [width=1440] [--reduced]
 * Scrolls the whole page with wheel events (so Lenis smoothing is exercised) while recording
 * rAF frame intervals and long tasks. Prints p50/p95 frame time, % frames > 20ms, long task count/total.
 * Requires playwright (global ok: NODE_PATH=$(npm root -g)).
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }
const [url, w = '1440'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const reduced = process.argv.includes('--reduced');
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: +w, height: +w < 600 ? 844 : Math.round(+w * 0.625) }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  window.__frames = []; window.__long = [];
  let last = performance.now();
  const loop = (t) => { window.__frames.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ type: 'longtask' });
});
await page.mouse.move(+w / 2, 300);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 240) { await page.mouse.wheel(0, 240); await page.waitForTimeout(60); }
await page.waitForTimeout(1500);
const r = await page.evaluate(() => { window.__stop = true; return { f: window.__frames.slice(5), l: window.__long, y: Math.round(scrollY), h: document.documentElement.scrollHeight, vh: innerHeight }; });
await browser.close();
const s = [...r.f].sort((a, b) => a - b); const p = (q) => s[Math.floor(s.length * q)];
console.log(JSON.stringify({
  url, width: +w, reducedMotion: reduced, frames: s.length,
  scrolledToPx: r.y, maxScrollPx: r.h - r.vh, reachedBottom: r.y >= r.h - r.vh - 4,
  p50ms: +p(0.5).toFixed(1), p95ms: +p(0.95).toFixed(1), over20msPct: +(100 * s.filter((x) => x > 20).length / s.length).toFixed(1),
  longTasks: r.l.length, longTaskTotalMs: Math.round(r.l.reduce((a, b) => a + b, 0)),
  note: 'measures steady-state scroll only (starts 2.5s after networkidle; load-time long tasks are NOT included). headless + SwiftShader software GL: relative comparisons only, not real-device FPS',
}, null, 2));
