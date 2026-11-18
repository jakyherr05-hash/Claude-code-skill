// OZONE T6b measurement protocol (TEST_PLAN §3). Shared by t45.mjs and t67.mjs.
// Plain node ESM scripts rather than a Playwright Test project: the protocol needs a fresh browser context per
// (config, input, speed, run), a browser-level CDP trace, and a custom evidence JSON per run, none of which
// @playwright/test fixtures help with. Playwright itself is the library (/opt/node-tools or global).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPORTS = path.resolve(here, '../../reports/proto');
const pw = await import(process.env.PLAYWRIGHT ?? '/opt/node-tools/node_modules/playwright/index.mjs').catch(() => import('playwright'));

export const CONFIGS = {
  A: { name: 'A', label: 'phone 390x844 DPR3 4x CPU', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true, throttle: 4, profile: 'mobile', inputs: ['touch', 'wheel'] },
  B: { name: 'B', label: 'desktop 1440x900 DPR1', viewport: { width: 1440, height: 900 }, dpr: 1, mobile: false, throttle: 1, profile: 'desktop', inputs: ['wheel'] },
  C: { name: 'C', label: 'retina desktop 1440x900 DPR2', viewport: { width: 1440, height: 900 }, dpr: 2, mobile: false, throttle: 1, profile: 'desktop', inputs: ['wheel'] },
};
// spans: [from label, pad px before, to label, pad px after, cue before, cue that must fire]
export const SPANS = {
  t45: { from: 's4', padFrom: -100, to: 's5', padTo: 100, cueBefore: 4, cueFires: 5 },
  t67: { from: 't67', padFrom: -100, to: 'end', padTo: 0, cueBefore: 6, cueFires: 7 },
};
const SPEEDS = { slow: { step: 60, gap: 16, touchSpeed: 3600 }, fast: { step: 400, gap: 16, touchSpeed: 24000 } };
const TRACE_CATS = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'cc', 'gpu', 'viz', 'benchmark', 'blink.user_timing', 'loading', 'v8'];
const TRACE = !process.argv.includes('--notrace');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const load = () => os.loadavg().map((x) => +x.toFixed(2));

const INIT = () => {
  window.__OZONE_QA__ = true;
  const P = (window.__qa = { lt: [], loaf: [], raf: [], on: false, errors: [] });
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.lt.push({ s: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true }); } catch {}
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) P.loaf.push({ s: e.startTime, d: e.duration, block: e.blockingDuration, render: e.renderStart ? e.startTime + e.duration - e.renderStart : null, scripts: (e.scripts || []).map((x) => ({ inv: x.invoker, type: x.invokerType, src: (x.sourceURL || '').split('/').pop(), fn: x.sourceFunctionName, d: x.duration })) });
    }).observe({ type: 'long-animation-frame', buffered: true });
  } catch {}
  const tick = (ts) => { if (P.on) P.raf.push(ts); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  addEventListener('error', (e) => P.errors.push(String(e.message)));
};

const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };
const r2 = (x) => (x == null ? null : +x.toFixed(2));

async function newPage(browser, cfg, url, throttle) {
  const ctx = await browser.newContext({ viewport: cfg.viewport, deviceScaleFactor: cfg.dpr, isMobile: cfg.mobile, hasTouch: cfg.mobile });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__labels && document.fonts.status === 'loaded' && performance.getEntriesByName('story-ready').length > 0, null, { timeout: 30000 });
  return { ctx, page, cdp, consoleErrors };
}

async function waitRenderDone(page) {
  await page.waitForFunction(() => window.__ozoneStats?.audio?.render?.done, null, { timeout: 30000 });
}

/** Unthrottled Worker render time for the same viewport/profile (fresh context, no throttle). */
async function unthrottledRender(browser, cfg, base) {
  const { ctx, page } = await newPage(browser, cfg, base, 1);
  await waitRenderDone(page);
  const r = await page.evaluate(() => window.__ozoneStats.audio.render);
  await ctx.close();
  return r;
}

async function calibrate(page) {
  return page.evaluate(async () => {
    const N = 60e6;
    const body = `const N=${N};let a=1.0001,s=0;for(let i=0;i<N;i++){s+=Math.sqrt(a*i)%7;a+=1e-9;}postMessage(s)`;
    const loop = () => { const t = performance.now(); let a = 1.0001, s = 0; for (let i = 0; i < N; i++) { s += Math.sqrt(a * i) % 7; a += 1e-9; } return { ms: performance.now() - t, s }; };
    const main = loop();
    const w = new Worker(URL.createObjectURL(new Blob([`self.onmessage=()=>{const t=performance.now();${body.replace('postMessage(s)', '')};postMessage(performance.now()-t)}`], { type: 'text/javascript' })));
    const wk = await new Promise((res) => { w.onmessage = (e) => res(e.data); w.postMessage(0); });
    w.terminate();
    return { mainMs: main.ms, workerMs: wk, ratio: main.ms / wk };
  });
}

async function settle(page, ms = 1200) { await sleep(ms); }

// Touch path. Input.synthesizeScrollGesture with gestureSourceType:'touch' dispatched touchstart/pointer events but
// never scrolled in this Chromium (153, verified: scrollY unchanged; 'default' produced wheel events, not touch), so the
// gesture is built from Input.dispatchTouchEvent drags: real touch events, native scroll by the compositor, one touchMove
// per 16 ms of `speed` px/s, lifted after a 80 ms dwell (no fling) and re-pressed for the next swipe (finger travel <= 60 % of the viewport).
async function touchScroll(cdp, cfg, dist, speed) {
  const H = cfg.viewport.height, x = cfg.viewport.width / 2, sgn = Math.sign(dist), step = (speed * 16) / 1000;
  const maxSwipe = H * 0.6, pend = [];
  const send = (type, y) => pend.push(cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] }));
  let remaining = Math.abs(dist), t = performance.now(), tick = 0;
  const wait = async () => { tick++; const w = t + tick * 16 - performance.now(); if (w > 0) await sleep(w); };
  while (remaining > 0.5) {
    const swipe = Math.min(remaining, maxSwipe);
    let y = sgn > 0 ? H * 0.8 : H * 0.2; // finger up = scroll down
    send('touchStart', y); await wait();
    let moved = 0;
    while (moved < swipe) { const d = Math.min(step, swipe - moved); moved += d; y -= sgn * d; send('touchMove', y); await wait(); }
    await sleep(80); send('touchEnd', y); tick = Math.round((performance.now() - t) / 16) + 1;
    remaining -= swipe; await sleep(20);
  }
  await Promise.all(pend);
}
async function wheelScroll(page, dist, step, gap) {
  // Real wheel input at a fixed schedule (one page.mouse.wheel per `gap` ms). Calls are NOT awaited one by one:
  // a janky main thread delays the renderer's ack, and awaiting it would slow the input down and flatter the result.
  const n = Math.ceil(Math.abs(dist) / step), sgn = Math.sign(dist);
  const t0 = performance.now(), pend = [];
  for (let i = 0; i < n; i++) {
    pend.push(page.mouse.wheel(0, sgn * Math.min(step, Math.abs(dist) - i * step)));
    const wait = t0 + (i + 1) * gap - performance.now();
    if (wait > 0) await sleep(wait);
  }
  await Promise.all(pend);
}

function analyseWindow(data, t0, t1) {
  const raf = data.raf.filter((t) => t >= t0 && t <= t1);
  const iv = [];
  const all = data.raf;
  for (let i = 1; i < all.length; i++) if (all[i] >= t0 && all[i] <= t1) iv.push(all[i] - all[i - 1]);
  const inW = (e) => e.s + e.d >= t0 && e.s <= t1;
  const lt = data.lt.filter(inW), loaf = data.loaf.filter(inW);
  return {
    frames: iv.length, frameMaxMs: r2(Math.max(...iv, 0)), frameP50Ms: r2(pct(iv, 0.5)), frameP95Ms: r2(pct(iv, 0.95)),
    framesOver50: iv.filter((x) => x > 50).length, framesOver33: iv.filter((x) => x > 33.4).length, worstIntervals: iv.slice().sort((a, b) => b - a).slice(0, 5).map(r2),
    longTasks: lt.length, longTaskList: lt.map((e) => ({ at: r2(e.s - t0), d: r2(e.d) })),
    loafOver50: loaf.filter((e) => e.d > 50).length, loafList: loaf.map((e) => ({ at: r2(e.s - t0), d: r2(e.d), block: r2(e.block), scripts: e.scripts })),
  };
}

// ---- trace analysis ------------------------------------------------------------------------------------
export function analyseTrace(events) {
  const meta = {};
  const thr = {};
  for (const e of events) if (e.ph === 'M' && e.name === 'thread_name') thr[`${e.pid}:${e.tid}`] = e.args.name;
  const counts = { Paint: 0, Layerize: 0, UpdateLayer: 0, ImageDecodeTask: 0, RasterTask: 0, CompositeLayers: 0 };
  const rasters = [];
  const threadsWithRaster = new Set();
  for (const e of events) {
    if (e.name in counts && (e.ph === 'X' || e.ph === 'B' || e.ph === 'I')) counts[e.name]++;
    if (e.name === 'RasterTask' && e.ph === 'X') { rasters.push({ ts: e.ts, dur: e.dur }); threadsWithRaster.add(thr[`${e.pid}:${e.tid}`] || '?'); }
  }
  // PipelineReporter is an async nestable event whose id2.local is reused: pair b/e with a stack per (pid,id)
  const frames = [], open = new Map();
  const pr = events.filter((e) => e.name === 'PipelineReporter' && (e.ph === 'b' || e.ph === 'e')).sort((x, y) => x.ts - y.ts);
  for (const e of pr) {
    const k = `${e.pid}:${e.id2?.local ?? e.id}`;
    if (e.ph === 'b') { const st = open.get(k) || []; st.push({ b: e.ts, state: e.args?.frame_reporter?.state }); open.set(k, st); }
    else { const f = open.get(k)?.pop(); if (f) { f.e = e.ts; frames.push(f); } }
  }
  const fr = frames.sort((x, y) => x.b - y.b);
  const perFrame = fr.map((f) => rasters.filter((r) => r.ts >= f.b && r.ts < f.e).reduce((sum, r) => sum + r.dur, 0) / 1000);
  const states = {};
  for (const f of fr) states[f.state ?? 'unknown'] = (states[f.state ?? 'unknown'] || 0) + 1;
  const dropped = fr.filter((f) => f.state === 'STATE_DROPPED' || f.state === 'STATE_PRESENTED_PARTIAL').length;
  return {
    counts, pipelineFrames: fr.length, frameStates: states, droppedOrMissed: dropped,
    rasterTasks: rasters.length, rasterTotalMs: r2(rasters.reduce((s, r) => s + r.dur, 0) / 1000), rasterThreads: [...threadsWithRaster],
    rasterPerFrameP50Ms: r2(pct(perFrame, 0.5)), rasterPerFrameP95Ms: r2(pct(perFrame, 0.95)), rasterPerFrameMaxMs: r2(Math.max(0, ...perFrame)),
    rasterTaskMaxMs: r2(Math.max(0, ...rasters.map((r) => r.dur / 1000))),
  };
}

// ---- one measured page -----------------------------------------------------------------------------------------------
async function measureOne({ browser, cfg, spanKey, input, speed, run, base, outDir, tag }) {
  const span = SPANS[spanKey];
  const hostBefore = { load: load(), nproc: os.cpus().length };
  const { ctx, page, cdp, consoleErrors } = await newPage(browser, cfg, base, cfg.throttle);
  const rec = { span: spanKey, config: cfg.name, input, speed, run, speedSpec: SPEEDS[speed], host: { before: hostBefore }, criteria: {}, blocked: null };
  try {
    await page.mouse.move(cfg.viewport.width / 2, cfg.viewport.height / 2);
    await waitRenderDone(page);
    // audio must be running (autoplay flag) else click ENTER
    let st = await page.evaluate(() => window.__ozoneStats.audio);
    if (st.ctxState !== 'running') { await page.click('#enter').catch(() => {}); await sleep(500); }
    const L = await page.evaluate(() => window.__labels);
    rec.rig = L.rig; rec.labels = { from: L.px[span.from], to: L.px[span.to] };
    const from = L.px[span.from] + span.padFrom, to = L.px[span.to] + span.padTo;
    rec.scrollSpanPx = { from, to, length: to - from };
    await page.evaluate((y) => window.scrollTo(0, y), from);
    await settle(page, 2500);
    // audio precondition (TEST_PLAN 3.3)
    const a0 = await page.evaluate(() => window.__ozoneStats.audio);
    rec.audioBefore = { ctxState: a0.ctxState, masterGain: a0.masterGain, rms: a0.rms, cue: a0.cue, mobileProfile: a0.mobileProfile, profileOverride: a0.profileOverride, cues: a0.cues, cueLogLen: a0.cueLog.length, renderMs: a0.render.ms };
    const pre = a0.ctxState === 'running' && a0.masterGain > 0 && a0.rms > 1e-4 && a0.cue === span.cueBefore && a0.mobileProfile === (cfg.profile === 'mobile');
    rec.criteria.audioPrecondition = pre;
    if (!pre) { rec.blocked = 'audio precondition failed: ' + JSON.stringify(rec.audioBefore); return rec; }
    // DOM facts at mid span (reported): filters, will-change
    await page.evaluate((y) => window.scrollTo(0, y), (from + to) / 2); await settle(page, 1200);
    rec.dom = await page.evaluate(() => {
      const stage = document.getElementById('stage');
      const filt = [], wc = [];
      for (const e of stage.querySelectorAll('*')) {
        const cs = getComputedStyle(e);
        if (cs.filter !== 'none' || e.hasAttribute('filter')) filt.push(e.tagName + '#' + e.id);
        if (cs.willChange !== 'auto') wc.push(`${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''}:${cs.willChange}`);
      }
      return { filteredElements: filt, willChange: wc.slice(0, 40), willChangeCount: wc.length, svgNodes: stage.querySelectorAll('*').length };
    });
    rec.criteria.noFilters = rec.dom.filteredElements.length === 0;
    await page.evaluate((y) => window.scrollTo(0, y), from); await settle(page, 2000);
    await page.evaluate(() => { window.__qa.raf.length = 0; window.__qa.on = true; });
    await sleep(300);
    if (TRACE) await browser.startTracing(page, { categories: TRACE_CATS, screenshots: false });
    const dist = to - from, windows = {};
    const tails = { wheel: 800, touch: 400 };
    for (const dir of ['forward', 'reverse']) {
      const sgn = dir === 'forward' ? 1 : -1;
      const y0 = await page.evaluate(() => scrollY);
      const t0 = await page.evaluate(() => performance.now());
      const w0 = performance.now();
      if (input === 'wheel') await wheelScroll(page, sgn * dist, SPEEDS[speed].step, SPEEDS[speed].gap);
      else await touchScroll(cdp, cfg, sgn * dist, SPEEDS[speed].touchSpeed);
      const elapsed = performance.now() - w0;
      await sleep(tails[input]);
      const t1 = await page.evaluate(() => performance.now());
      const y1 = await page.evaluate(() => scrollY);
      windows[dir] = { t0, t1, y0, y1, inputWallMs: r2(elapsed), achievedPxPerS: Math.round((Math.abs(y1 - y0) / elapsed) * 1000), reachedPx: y1 };
      await settle(page, 1200);
      if (dir === 'forward') {
        const a = await page.evaluate(() => window.__ozoneStats.audio);
        rec.audioAfterForward = { cue: a.cue, cueLogTail: a.cueLog.slice(a0.cueLog.length), rms: a.rms, ctxState: a.ctxState };
      }
    }
    const tr = TRACE ? await browser.stopTracing() : null;
    const data = await page.evaluate(() => ({ lt: window.__qa.lt, loaf: window.__qa.loaf, raf: window.__qa.raf, errors: window.__qa.errors }));
    if (tr) {
      const events = JSON.parse(tr.toString()).traceEvents;
      const gz = gzipSync(tr);
      const traceName = `${spanKey}-${tag}${cfg.name}-${input}-${speed}-run${run}.trace.json.gz`;
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, traceName), gz);
      rec.trace = { file: path.relative(REPORTS, path.join(outDir, traceName)), bytes: gz.length };
      rec.traceMetrics = analyseTrace(events);
    } else rec.trace = null;
    rec.traced = !!tr;
    rec.directions = {};
    for (const dir of ['forward', 'reverse']) {
      const w = windows[dir];
      const m = analyseWindow(data, w.t0, w.t1);
      rec.directions[dir] = { ...w, ...m, reachedTarget: dir === 'forward' ? (w.y1 >= to - 5 && w.y1 <= to + 80) : Math.abs(w.y1 - from) <= 5 };
    }
    // cue fired (setCue(5,+1) logged during the forward pass)
    const fired = rec.audioAfterForward.cueLogTail.some((c) => c.cue === span.cueFires);
    rec.criteria.cueFired = fired;
    const rmsEnd = await page.evaluate(() => window.__ozoneStats.audio.rms);
    rec.audioEnd = { rms: rmsEnd };
    // audio stats and worker budget
    const fin = await page.evaluate(() => ({ audio: window.__ozoneStats.audio, triggers: window.__ozoneStats.triggers, listeners: window.__ozoneStats.listeners, tweens: window.__ozoneStats.tweens }));
    rec.audio = { late: fin.audio.late, tickMaxMs: r2(fin.audio.tickMaxMs), mainCopyMaxMs: r2(fin.audio.render.mainCopyMaxMs), sources: fin.audio.sources, ticks: fin.audio.ticks, contexts: fin.audio.contexts, hardwareConcurrency: fin.audio.hardwareConcurrency };
    rec.stats = { triggers: fin.triggers, listeners: fin.listeners, tweens: fin.tweens };
    const cal = await calibrate(page);
    const un = cfg.throttle > 1 ? await unthrottledRender(browser, cfg, base) : fin.audio.render;
    const measured = fin.audio.render.ms, est = Math.max(measured, un.ms * 4);
    rec.workerRender = { measuredMs: r2(measured), unthrottledMs: r2(un.ms), estimatedMs: r2(est), rule: 'max(measured, unthrottled x4), estimated', budgetMs: 400, gatingProfile: 'mobile', profile: cfg.profile, withinBudget: est <= 400, calibration: { mainMs: r2(cal.mainMs), workerMs: r2(cal.workerMs), mainOverWorker: r2(cal.ratio) } };
    rec.consoleErrors = consoleErrors.concat(data.errors);
    // gating
    const slow = speed === 'slow';
    for (const dir of ['forward', 'reverse']) {
      const d = rec.directions[dir];
      d.gate = {
        noFrameOver50: d.framesOver50 === 0,
        p95Le33: d.frameP95Ms != null && d.frameP95Ms <= 33,
        noLongTaskSlow: slow ? d.longTasks === 0 : null,
        noLoafOver50Slow: slow ? d.loafOver50 === 0 : null,
        reachedTarget: d.reachedTarget,
      };
    }
    rec.criteria.frameTime = ['forward', 'reverse'].every((k) => rec.directions[k].gate.noFrameOver50 && rec.directions[k].gate.p95Le33);
    rec.criteria.longTasksSlow = slow ? ['forward', 'reverse'].every((k) => rec.directions[k].gate.noLongTaskSlow) : null;
    rec.criteria.loafSlow = slow ? ['forward', 'reverse'].every((k) => rec.directions[k].gate.noLoafOver50Slow) : null;
    rec.criteria.reachedTarget = ['forward', 'reverse'].every((k) => rec.directions[k].reachedTarget);
    rec.criteria.noConsoleErrors = rec.consoleErrors.length === 0;
    rec.criteria.workerBudget = cfg.profile === 'mobile' ? rec.workerRender.withinBudget : null;
    rec.pass = rec.criteria.audioPrecondition && rec.criteria.cueFired && rec.criteria.noFilters && rec.criteria.frameTime && (rec.criteria.longTasksSlow ?? true) && (rec.criteria.loafSlow ?? true) && rec.criteria.reachedTarget;
  } catch (e) {
    rec.blocked = rec.blocked || 'exception: ' + (e.stack || e).toString().slice(0, 600);
  } finally {
    rec.host.after = { load: load() };
    await ctx.close().catch(() => {});
    try { await browser.stopTracing(); } catch {}
  }
  return rec;
}

/** GPU backend: WebGL renderer string (SwiftShader/llvmpipe = software), /dev/dri presence. Raster backend is also read from the trace (threads/GPU raster events). */
async function gpuInfo(browser) {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  await p.goto('about:blank');
  const info = await p.evaluate(() => {
    const c = document.createElement('canvas'); const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { webgl: null };
    const e = gl.getExtension('WEBGL_debug_renderer_info');
    return { webgl: true, vendor: e ? gl.getParameter(e.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR), renderer: e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) };
  });
  await ctx.close();
  const { existsSync } = await import('node:fs');
  const software = !info.webgl || /swiftshader|llvmpipe|software/i.test(info.renderer || '');
  return { ...info, devDriPresent: existsSync('/dev/dri'), softwareRaster: software && !existsSync('/dev/dri') };
}

/** Control: an empty page, same viewport/DPR/throttle, rAF intervals over 4 s, so a starved host shows up as a bad control, not as a bad prototype. */
async function control(browser, cfg) {
  const ctx = await browser.newContext({ viewport: cfg.viewport, deviceScaleFactor: cfg.dpr, isMobile: cfg.mobile, hasTouch: cfg.mobile });
  const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
  if (cfg.throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cfg.throttle });
  await page.setContent('<body style="margin:0"><div id=a style="width:200px;height:200px;background:#c00"></div></body>');
  const iv = await page.evaluate(() => new Promise((res) => { const t = []; const f = (ts) => { t.push(ts); document.getElementById('a').style.transform = `translateX(${t.length % 100}px)`; if (ts - t[0] < 4000) requestAnimationFrame(f); else res(t.slice(1).map((x, i) => x - t[i])); }; requestAnimationFrame(f); }));
  await ctx.close();
  return { frames: iv.length, p50: r2(pct(iv, 0.5)), p95: r2(pct(iv, 0.95)), max: r2(Math.max(...iv)), over50: iv.filter((x) => x > 50).length, load: load() };
}

export async function runSpan(spanKey) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const url = arg('--url', process.env.PROTO_URL || 'http://localhost:4174/');
  const query = arg('--query', '');
  const variant = arg('--variant', 'default');
  const cfgs = arg('--configs', 'A,B,C').split(',');
  const runs = Number(arg('--runs', 3));
  const only = arg('--only', null); // e.g. wheel-slow
  const tag = (variant === 'default' ? '' : variant + '-') + (TRACE ? '' : 'notrace-');
  const outDir = path.join(REPORTS, spanKey);
  mkdirSync(REPORTS, { recursive: true });
  const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--enable-precise-memory-info'] });
  const gpu = await gpuInfo(browser);
  const results = [];
  for (const cn of cfgs) {
    const cfg = CONFIGS[cn];
    const ctl = await control(browser, cfg);
    console.log('control', cn, JSON.stringify(ctl));
    for (let run = 1; run <= runs; run++) {
      const entries = [];
      for (const input of cfg.inputs) for (const speed of ['slow', 'fast']) {
        if (only && only !== `${input}-${speed}`) continue;
        const base = `${url}?audioprofile=${cfg.profile}${query ? '&' + query.replace(/^[?&]/, '') : ''}`;
        const rec = await measureOne({ browser, cfg, spanKey, input, speed, run, base, outDir, tag });
        entries.push(rec);
        console.log(`${spanKey} ${variant} ${cn} run${run} ${input}-${speed}: ${rec.blocked ? 'BLOCKED ' + rec.blocked.slice(0, 200) : rec.pass ? 'pass' : 'FAIL'}  load ${rec.host.before.load.join('/')}->${rec.host.after.load.join('/')} ${rec.directions ? ['forward', 'reverse'].map((d) => `${d[0]}:max${rec.directions[d].frameMaxMs} p95 ${rec.directions[d].frameP95Ms} lt${rec.directions[d].longTasks} loaf${rec.directions[d].loafOver50}`).join(' ') : ''}`);
      }
      const doc = { protocol: 'TEST_PLAN §3 (T6b)', span: spanKey, variant, query, url, config: cfg, control: ctl, gpu, browserVersion: browser.version(), launchArgs: ['--autoplay-policy=no-user-gesture-required'], nproc: os.cpus().length, run, label: 'lab, software raster, emulated', entries };
      writeFileSync(path.join(REPORTS, `${spanKey}-${tag}${cn}-run${run}${only ? '-' + only : ''}.json`), JSON.stringify(doc, null, 1));
      results.push(doc);
    }
  }
  await browser.close();
  return results;
}
