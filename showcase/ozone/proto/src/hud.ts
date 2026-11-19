// ?hud=1 : on-screen frame meter for the client's real-device check (G-27). Prototype only.
// Counts requestAnimationFrame intervals while the page is scrolling inside t45 (S4→S5) and t67 (S6→end), and
// applies the T6b frame gates as ruled in G-24: no interval > 50.5 ms and p95 ≤ 33.5 ms.
import type { LabelName } from './config';

type Span = 't45' | 't67';
interface Bucket { f: number[] }

export function mountHud(tl: gsap.core.Timeline, units: Record<LabelName, number>) {
  const total = units.end;
  const dur = tl.duration();
  const at = (n: LabelName) => (units[n] / total) * dur;
  const spans: Record<Span, [number, number]> = { t45: [at('t45'), at('s5')], t67: [at('t67'), dur + 1e-6] };
  const b: Record<Span, Bucket> = { t45: { f: [] }, t67: { f: [] } };
  const idle: number[] = [];

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.style.cssText = 'position:fixed;z-index:9999;top:max(8px,env(safe-area-inset-top));right:8px;max-width:min(330px,calc(100vw - 16px));' +
    'background:rgba(0,0,0,.82);color:#fff;font:12px/1.35 ui-monospace,Menlo,monospace;padding:8px 10px;border-radius:6px;white-space:pre-wrap;contain:content';
  const out = document.createElement('div');
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:6px;margin-top:6px';
  const btn = (label: string, fn: () => void) => {
    const x = document.createElement('button');
    x.type = 'button'; x.textContent = label;
    x.style.cssText = 'font:inherit;min-height:44px;min-width:44px;padding:0 12px;background:#fff;color:#000;border:0;border-radius:4px';
    x.addEventListener('click', fn); row.append(x); return x;
  };
  btn('Reset', () => { b.t45.f = []; b.t67.f = []; });
  const copy = btn('Copy', () => { void navigator.clipboard?.writeText(text()).then(() => { copy.textContent = 'Copied'; setTimeout(() => (copy.textContent = 'Copy'), 1200); }); });
  el.append(out, row);
  document.body.append(el);

  let lastScroll = -1e9;
  addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });

  const pct = (a: number[], p: number) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
  const line = (k: Span) => {
    const f = b[k].f;
    if (f.length < 20) return `${k === 't45' ? 'Scene 4→5' : 'Scene 6→7'}: scroll through it (${f.length} frames so far)`;
    const over = f.filter((x) => x > 50.5).length, p95 = pct(f, 0.95), max = Math.max(...f);
    const ok = over === 0 && p95 <= 33.5;
    return `${k === 't45' ? 'Scene 4→5' : 'Scene 6→7'}: ${ok ? 'SMOOTH' : 'STUTTER'}\n  frames ${f.length} · p95 ${p95.toFixed(1)} ms · max ${max.toFixed(1)} ms · >50 ms ${over}`;
  };
  const text = () => {
    const hz = idle.length > 30 ? Math.round(1000 / pct(idle, 0.5)) : 0;
    return `OZONE prototype frame meter\n${innerWidth}×${innerHeight} @${devicePixelRatio}x · ${hz ? hz + ' Hz' : 'measuring Hz'}\n${line('t45')}\n${line('t67')}\n${navigator.userAgent}`;
  };

  let prev = performance.now(), prevHead = tl.time(), lastPaint = 0;
  const frame = (now: number) => {
    const dt = now - prev, head = tl.time();
    const moving = head !== prevHead || now - lastScroll < 250;
    if (!moving && dt < 100 && idle.length < 240) idle.push(dt);
    if (moving && !document.hidden) {
      for (const k of ['t45', 't67'] as Span[]) {
        const [a, z] = spans[k];
        if ((head >= a && head < z) || (prevHead >= a && prevHead < z)) { b[k].f.push(dt); break; }
      }
    }
    prev = now; prevHead = head;
    if (now - lastPaint > 250) { out.textContent = text(); lastPaint = now; }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { prev = performance.now(); });
}
