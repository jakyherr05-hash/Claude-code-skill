// Summarise reports/proto/<span>-<variant>-<cfg>-run<N>[-only].json into markdown tables (median / worst of the runs). usage: node summarize.mjs [variant=default]
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { REPORTS } from './protocol.mjs';
const variant = process.argv[2] || 'default';
const tag = variant === 'default' ? '' : variant + '-';
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const files = readdirSync(REPORTS).filter((f) => /^t(45|67)-.*\.json$/.test(f));
const rows = [];
for (const f of files) {
  const m = new RegExp(`^(t45|t67)-${tag}(A|B|C)-run(\\d)\\.json$`).exec(f);
  if (!m) continue;
  if (!tag && /^t(45|67)-(cut|notrace|probe)/.test(f)) continue;
  const d = JSON.parse(readFileSync(path.join(REPORTS, f), 'utf8'));
  for (const e of d.entries) rows.push({ span: m[1], cfg: m[2], input: e.input, speed: e.speed, run: e.run, e });
}
// *sensitivity only, not the gate: frame over-50 means an interval > 50.5 ms and p95 <= 33.5 ms (a 3-vsync interval is 50.0-50.1 ms, a 2-vsync one 33.3-33.4 ms); long tasks / LoAF unchanged; audio/cue/target criteria as strict.
const tol = (r) => { const e = r.e; if (e.blocked || !e.directions) return false; const slow = e.speed === 'slow';
  return e.criteria.audioPrecondition && e.criteria.cueFired && e.criteria.noFilters && e.criteria.reachedTarget && ['forward', 'reverse'].every((k) => { const d = e.directions[k]; return d.worstIntervals.filter((x) => x > 50.5).length === 0 && d.frameP95Ms <= 33.5 && (!slow || (d.longTasks === 0 && d.loafOver50 === 0)); }); };
const groups = {};
for (const r of rows) (groups[`${r.span}|${r.cfg}|${r.input}|${r.speed}`] ||= []).push(r);
const f1 = (x) => (x == null ? 'n/a' : (+x).toFixed(1));
const out = [];
for (const span of ['t45', 't67']) {
  out.push(`\n#### ${span} (${variant})\n`);
  out.push('| cfg | input | speed | runs | pass runs strict / vsync-tolerant* | achieved px/s (fwd) | frame max ms med/worst | p95 ms med/worst | frames>50 (sum) | long tasks (sum) | LoAF>50 (sum) | audio late max ms | raster p95 ms/frame med/worst (reported) | Worker est. ms (budget 400, mobile gating) |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const k of Object.keys(groups).filter((k) => k.startsWith(span)).sort()) {
    const g = groups[k], [, cfg, input, speed] = k.split('|');
    const dirs = (r) => ['forward', 'reverse'].map((x) => r.e.directions?.[x]).filter(Boolean);
    const mx = g.map((r) => Math.max(...dirs(r).map((d) => d.frameMaxMs)));
    const p95 = g.map((r) => Math.max(...dirs(r).map((d) => d.frameP95Ms)));
    const ras = g.map((r) => r.e.traceMetrics?.rasterPerFrameP95Ms).filter((x) => x != null);
    const sum = (fn) => g.reduce((s, r) => s + dirs(r).reduce((a, d) => a + fn(d), 0), 0);
    const blocked = g.filter((r) => r.e.blocked).length;
    out.push(`| ${cfg} | ${input} | ${speed} | ${g.length}${blocked ? ` (${blocked} BLOCKED)` : ''} | ${g.filter((r) => r.e.pass).length}/${g.length} / ${g.filter(tol).length}/${g.length} | ${g[0].e.directions?.forward?.achievedPxPerS ?? 'n/a'} | ${f1(med(mx))} / ${f1(Math.max(...mx))} | ${f1(med(p95))} / ${f1(Math.max(...p95))} | ${sum((d) => d.framesOver50)} | ${sum((d) => d.longTasks)} | ${sum((d) => d.loafOver50)} | ${f1(Math.max(...g.map((r) => r.e.audio?.late?.maxMs ?? 0)))} | ${ras.length ? f1(med(ras)) + ' / ' + f1(Math.max(...ras)) : 'n/a'} | ${g[0].e.workerRender ? g.map((r) => r.e.workerRender.estimatedMs).join(', ') : 'n/a'} |`);
  }
}
console.log(out.join('\n'));
