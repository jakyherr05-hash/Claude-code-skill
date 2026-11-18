// T6b placeholder-fidelity measurement against proto/fidelity.json (TEST_PLAN §3.1 inputs; QA owns the real spec).
// Measures at the s4/s5/s6 holds and mid-t45/mid-t67 (plus 10 % sweeps of t45 and t67 for the span caps), for 1440x900 (rig L)
// and 390x844 (rig S). Prints actual vs target and writes JSON. This is DOM measurement only: NOT a performance result.
//
// usage: node fidelity-measure.mjs [--url http://localhost:4174/] [--query "?art=full"] [--out ../reports/proto/fidelity-placeholder.json]
//        PLAYWRIGHT=/path/to/playwright/index.mjs overrides the Playwright import (default /opt/node-tools/..., else 'playwright')
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const url = arg('--url', 'http://localhost:4174/');
const query = arg('--query', '');
const out = path.resolve(here, arg('--out', '../reports/proto/fidelity-placeholder.json'));
const fid = JSON.parse(readFileSync(path.join(here, 'fidelity.json'), 'utf8'));
const pw = await import(process.env.PLAYWRIGHT ?? '/opt/node-tools/node_modules/playwright/index.mjs').catch(() => import('playwright'));

const configs = [
  { key: 'L', viewport: { width: 1440, height: 900 }, mobile: false },
  { key: 'S', viewport: { width: 390, height: 844 }, mobile: true },
];

// ---- in-page measurement ---------------------------------------------------------------------------------------
function measureInPage() {
  const vw = innerWidth, vh = innerHeight, va = vw * vh;
  const SKIP = new Set(['defs', 'mask', 'pattern', 'clipPath', 'symbol', 'linearGradient', 'radialGradient', 'filter', 'style', 'title']);
  const isHidden = (e) => e.style && e.style.display === 'none';
  // rendered node count: no display:none ancestors, plus <use> targets
  const redAllEl = document.getElementById('red-all');
  const count = (root, skipRed) => {
    let n = 0, red = 0;
    const walk = (e, inRed) => {
      for (const c of e.children) {
        if (SKIP.has(c.localName) || isHidden(c)) continue;
        const isRed = inRed || c === redAllEl;
        if (isRed) red++; else n++;
        if (c.localName === 'use') {
          const t = document.querySelector(c.getAttribute('href'));
          if (t) n += 1 + t.querySelectorAll('*').length; // target root + descendants
          continue;
        }
        walk(c, isRed);
      }
    };
    walk(root, false);
    return skipRed ? n : n + red;
  };
  const roots = [...document.querySelectorAll('.worldwrap svg, .page-layer svg')];
  let perFrame = 0, redAll = 0;
  for (const r of roots) {
    // wrapper divs (cut-line 6) hidden by display:none also count as hidden
    const wrap = r.closest('.plane');
    if (wrap && wrap.style.display === 'none') continue;
    perFrame += count(r, true);
  }
  if (redAllEl && !isHidden(redAllEl) && !isHidden(redAllEl.parentElement)) redAll = 1 + redAllEl.querySelectorAll('*').length;
  // halftone fill area: sum of the bounding boxes of pattern-filled elements, each clipped to the viewport, overlaps counted twice
  let ht = 0, htRed = 0, minPitch = Infinity;
  const byPlane = {};
  const seenGroups = new Set();
  for (const g of document.querySelectorAll('g[data-ht]')) {
    if (g.closest('[style*="display: none"]')) continue;
    for (const e of g.children) {
      const cs = getComputedStyle(e);
      if (!cs.fill.startsWith('url(') || cs.visibility === 'hidden') continue;
      const r = e.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const a = (w * h) / va;
      if (a === 0) continue;
      ht += a;
      { const pl = (g.closest('[data-plane]') || g).dataset.plane || 'page'; const k = pl + (/ht-[^-]+-red-/.test(cs.fill) ? '(red)' : ''); byPlane[k] = (byPlane[k] || 0) + a; }
      if (/ht-[^-]+-red-/.test(cs.fill)) htRed += a;
      if (!seenGroups.has(g)) {
        seenGroups.add(g);
        const id = /#([^")]+)/.exec(cs.fill)[1];
        const pat = document.getElementById(id);
        const s = g.getScreenCTM();
        if (pat && s) minPitch = Math.min(minPitch, parseFloat(pat.getAttribute('width')) * s.a);
      }
    }
  }
  // filters
  const filtered = [];
  for (const e of document.querySelectorAll('.stage *')) {
    if (e.hasAttribute('filter') || (e.style && e.style.filter)) { filtered.push(e.getAttribute('data-plane') || e.localName); continue; }
  }
  const stageFiltered = [...document.querySelectorAll('.stage, .worldwrap, .page-layer, .plane, svg')].filter((e) => getComputedStyle(e).filter !== 'none').length;
  // mask and red-all extent
  const mask = document.getElementById('eraser-mask');
  let maskInfo = null, redInfo = null;
  if (redAllEl) {
    const bb = redAllEl.getBBox();
    const mr = mask ? { x: +mask.getAttribute('x'), y: +mask.getAttribute('y'), w: +mask.getAttribute('width'), h: +mask.getAttribute('height') } : null;
    redInfo = { bboxW: bb.width, bboxH: bb.height, extentViewportWidths: bb.width / vw, nodes: 1 + redAllEl.querySelectorAll('*').length, display: redAllEl.style.display || 'inline' };
    maskInfo = { id: mask ? mask.id : null, appliedTo: redAllEl.getAttribute('mask'), box: mr, boxVsBBox: mr ? { w: mr.w / bb.width, h: mr.h / bb.height } : null };
  }
  const circle = document.querySelector('[data-layer="eraser"]');
  const cam = document.querySelector('[data-cam]');
  return {
    htShare: ht, htRedShare: htRed, htByPlane: Object.fromEntries(Object.entries(byPlane).map(([k, v]) => [k, +(v * 100).toFixed(2)])), minPitch: minPitch === Infinity ? null : minPitch,
    nodesPerFrame: perFrame, nodesRedAll: redAll, nodesIncludingRedAll: perFrame + redAll,
    nodesDocument: document.querySelectorAll('svg *').length,
    filteredAttr: filtered, filteredComputed: stageFiltered,
    mask: maskInfo, red: redInfo,
    eraserTransform: circle ? circle.getAttribute('transform') : null,
    camTransform: cam ? (cam.getAttribute('transform') || cam.style.transform) : null,
    playhead: window.__playhead,
  };
}

// ---- driver -----------------------------------------------------------------------------------------------------
const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const result = { _note: 'MEASUREMENTS of the PLACEHOLDER art against fidelity.json TARGETS. DOM measurement only; not a performance result.', generated: new Date().toISOString(), url: url + query, targets: 'proto/fidelity.json', rigs: {} };
result.notes = [
  'Halftone share = sum of bounding boxes of pattern-filled elements (computed fill url(#ht-...)), each clipped to the viewport, overlaps counted twice, as a share of the viewport (fidelity.json unit).',
  'Nodes per frame = SVG elements without an inline display:none ancestor (defs/mask/pattern/clipPath excluded, visibility:hidden still counted) + 1 + descendants of each rendered <use> target; red-all is counted separately (G-4) and reported as nodesRedAll / nodesIncludingRedAll. The s3 stand-in is sized so that even WITH red-all the s4 hold stays within the 5,000 / 3,600 caps.',
  'Per-scene node split differs from fidelity.json sceneSplitGuide (S rig: s3 560, s4 720, s5 1560, s6 800, page 480; L: s3 980, rest as the guide): the guide cannot satisfy 0.9-1.0x of nodes.perFrame at s6 and mid-t67 at 390 once the six sN-panel <use> targets (1,800) are rendered.',
  'S4 halftone aims below its target (0.95x) because t45 caps (35 % L) equal the S4 target and t45 shows the S4 hold for its first third.',
  'Rig S/P only: S5 halftone is flat until 95 % of t45 (hand-in), because the S5 road at pull-back scale would exceed the 40 % t45 cap. Frames 70-90 % of t45 at 390 therefore carry no halftone.',
  'S5 groups hand over to flat tint at t56 45 % (behind the mullion wipe) so only the street/interior carries halftone at s6.',
  'The fill-area measure counts bounding boxes, so cut-line 2 (density step) does not change it; it changes raster cost only.',
  'This is DOM measurement of placeholder art. It is not a performance result.',
];
const rows = [];
for (const c of configs) {
  const ctx = await browser.newContext({ viewport: c.viewport, deviceScaleFactor: 1, isMobile: c.mobile, hasTouch: c.mobile });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.__OZONE_QA__ = true; });
  const logs = [];
  page.on('console', (m) => logs.push(m.text()));
  page.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message));
  await page.goto(url + query);
  await page.waitForFunction(() => window.__labels && document.fonts.status === 'loaded');
  const L = await page.evaluate(() => window.__labels);
  const px = (u) => Math.round(L.stStart + (u / L.masterDuration) * (L.stEnd - L.stStart));
  const U = L.units;
  const at = (a, b, p) => U[a] + p * (U[b] - U[a]);
  const tg = fid.halftoneFillArea[c.key];
  const nodesT = fid.nodes.perFrame[c.key];
  const samples = [
    { name: 's4', u: at('s4', 't45', 0.5), ht: tg.s4, red: tg.s4RedDots, kind: 'hold' },
    { name: 'mid-t45', u: at('t45', 's5', 0.5), cap: fid.halftoneFillArea.spanCaps[c.key].t45, kind: 'mid' },
    { name: 's5', u: at('s5', 't56', 0.5), ht: tg.s5, kind: 'hold' },
    { name: 's6', u: at('s6', 't67', 0.5), ht: tg.s6, kind: 'hold' },
    { name: 'mid-t67', u: at('t67', 'end', 0.5), cap: fid.halftoneFillArea.spanCaps[c.key].t67, kind: 'mid' },
    { name: 'end', u: U.end - 0.5, ht: tg.s7, kind: 'end' },
  ];
  for (let p = 10; p <= 90; p += 10) {
    samples.push({ name: `t45-${p}`, u: at('t45', 's5', p / 100), cap: fid.halftoneFillArea.spanCaps[c.key].t45, kind: 'sweep45' });
    samples.push({ name: `t67-${p}`, u: at('t67', 'end', p / 100), cap: fid.halftoneFillArea.spanCaps[c.key].t67, kind: 'sweep67' });
  }
  const out_samples = [];
  for (const s of samples) {
    const y = px(s.u);
    // approach from 60 px below the target in two steps so the scrub (0.5 s) lands without a fling
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y - 60));
    await page.waitForTimeout(500);
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForFunction((t) => Math.abs(window.__playhead - t) < 0.6, s.u, { timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(150);
    const m = await page.evaluate(measureInPage);
    const rec = { name: s.name, kind: s.kind, units: +s.u.toFixed(2), scrollY: y, playhead: +m.playhead.toFixed(2), ...m };
    if (s.ht !== undefined) { rec.htTarget = s.ht; rec.htRatio = s.ht ? m.htShare / s.ht : null; rec.htPass = s.ht === 0 ? m.htShare === 0 : rec.htRatio >= 0.9 && rec.htRatio <= 1.3; }
    if (s.red !== undefined) { rec.redTarget = s.red; rec.redRatio = m.htRedShare / s.red; }
    if (s.cap !== undefined) { rec.htCap = s.cap; rec.capPass = m.htShare <= s.cap; }
    if (['hold', 'mid'].includes(s.kind)) { rec.nodesTarget = nodesT; rec.nodesRatio = m.nodesPerFrame / nodesT; rec.nodesPass = rec.nodesRatio >= 0.9 && rec.nodesRatio <= 1.0; }
    rec.nodesCapPass = m.nodesPerFrame <= fid.nodes.perFrameCap[c.key];
    rec.minPitchPass = m.minPitch === null || m.minPitch >= fid.halftoneFillArea.minDotPitchCssPx - 0.01;
    out_samples.push(rec);
  }
  const first = out_samples.find((r) => r.name === 's4');
  const flags = {
    filteredLayers: Math.max(...out_samples.map((r) => r.filteredAttr.length + r.filteredComputed)),
    redAllNodes: first.red.nodes, redAllExtentViewportWidths: +first.red.extentViewportWidths.toFixed(3),
    redAllExtentPass: first.red.extentViewportWidths >= fid.redAllExtentViewportWidths[0] && first.red.extentViewportWidths <= fid.redAllExtentViewportWidths[1],
    redAllNodesPass: first.red.nodes <= fid.nodes.redAll && first.red.nodes >= 0.9 * fid.nodes.redAll,
    maskId: first.mask.id, maskTarget: first.mask.appliedTo, maskPass: first.mask.id === fid.maskId && first.mask.appliedTo === `url(#${fid.maskId})`,
    maskBoxVsBBox: first.mask.boxVsBBox, maskBoxPass: first.mask.boxVsBBox.w >= 0.9 && first.mask.boxVsBBox.w <= 1.1 && first.mask.boxVsBBox.h >= 0.9 && first.mask.boxVsBBox.h <= 1.1,
    documentNodes: first.nodesDocument, documentNodesPass: first.nodesDocument <= fid.nodes.document,
    panelNodes: await page.evaluate(() => [1, 2, 3, 4, 5, 6].map((i) => 1 + document.getElementById(`s${i}-panel`).querySelectorAll('*').length)),
  };
  const art = await page.evaluate(() => window.__art);
  result.rigs[c.key] = { viewport: c.viewport, rig: L.rig, art: { tier: art.tier, source: art.source, cuts: art.cuts, filters: art.filters }, flags, samples: out_samples, consoleErrors: logs.filter((l) => /error|PAGEERROR/i.test(l)) };
  for (const r of out_samples.filter((r) => ['hold', 'mid', 'end'].includes(r.kind))) {
    rows.push({ rig: c.key, sample: r.name, halftone: `${(r.htShare * 100).toFixed(1)}%`, target: r.htTarget !== undefined ? `${(r.htTarget * 100).toFixed(0)}%` : `cap ${(r.htCap * 100).toFixed(0)}%`, ratio: r.htRatio != null ? r.htRatio.toFixed(2) : (r.htCap ? (r.htShare / r.htCap).toFixed(2) + ' of cap' : '-'), redDots: r.htRedShare ? `${(r.htRedShare * 100).toFixed(1)}%` : '-', nodes: r.nodesPerFrame, nodesT: r.nodesTarget ?? '-', nodesRatio: r.nodesRatio ? r.nodesRatio.toFixed(3) : '-', minPitch: r.minPitch ? r.minPitch.toFixed(2) : '-' });
  }
  const sweep = (k) => out_samples.filter((r) => r.kind === k || (k === 'sweep45' && r.name === 'mid-t45') || (k === 'sweep67' && r.name === 'mid-t67'));
  result.rigs[c.key].spanMax = {
    t45: { maxHalftone: Math.max(...sweep('sweep45').map((r) => r.htShare)), cap: fid.halftoneFillArea.spanCaps[c.key].t45, maxNodes: Math.max(...sweep('sweep45').map((r) => r.nodesPerFrame)), minNodes: Math.min(...sweep('sweep45').map((r) => r.nodesPerFrame)) },
    t67: { maxHalftone: Math.max(...sweep('sweep67').map((r) => r.htShare)), cap: fid.halftoneFillArea.spanCaps[c.key].t67, maxNodes: Math.max(...sweep('sweep67').map((r) => r.nodesPerFrame)), minNodes: Math.min(...sweep('sweep67').map((r) => r.nodesPerFrame)) },
  };
  await ctx.close();
}
await browser.close();
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2));
console.table(rows);
for (const k of Object.keys(result.rigs)) {
  const r = result.rigs[k];
  console.log(`\n[${k}] ${JSON.stringify(r.viewport)} rig=${r.rig} art=${JSON.stringify(r.art)}`);
  console.log('  flags:', JSON.stringify(r.flags));
  console.log('  span max halftone vs cap:', JSON.stringify(r.spanMax));
  console.log('  sweep samples (name, halftone %, nodes, minPitch):');
  console.log('   ' + r.samples.filter((s) => s.kind.startsWith('sweep')).map((s) => `${s.name}:${(s.htShare * 100).toFixed(1)}%/${s.nodesPerFrame}/${s.minPitch ? s.minPitch.toFixed(1) : '-'}`).join('  '));
  if (r.consoleErrors.length) console.log('  console errors:', r.consoleErrors);
}
console.log('\nwrote', out);
