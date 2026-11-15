import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { motionTokens, prefersReducedMotion } from '../motion/tokens';
import { site, kelvinToHex } from '../data/content';
import { LightCanvas, type LightHandle } from '../components/LightCanvas';
import { HOUR_PRESETS, stateAtMinutes, readoutAtMinutes } from '../webgl/lightRenderer';

const wrap24 = (v: number) => ((v % 1440) + 1440) % 1440;
const fmt = (m: number) => {
  const r = Math.round(wrap24(m));
  return `${String(Math.floor(r / 60) % 24).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`;
};
const nearestPreset = (m: number) =>
  HOUR_PRESETS.reduce((best, p) => {
    const d = Math.abs(((p.minutes - m + 720 + 1440) % 1440) - 720);
    return d < best.d ? { p, d } : best;
  }, { p: HOUR_PRESETS[0], d: Infinity }).p;

const START = 18 * 60 + 20; // the handover hour — the most telling state

/** S4 · The Hour — a day in the chapel; where the sun stops and Penumbra begins (ANIMATION_SPECIFICATION §S4). */
export function TheHour() {
  const root = useRef<HTMLElement>(null);
  const light = useRef<LightHandle>(null);
  const slider = useRef<HTMLInputElement>(null);
  const state = useRef({ minutes: START });
  // Where the light is GOING (slider/preset/key target). Keys step from this, never from the animated value.
  const target = useRef(START);
  const shown = useRef({ minutes: -1 });
  const quick = useRef<((v: number) => void) | null>(null);
  // a running/finished preset tween uses overwrite:true, which kills the quickTo tween → recreate only then
  const presetTween = useRef<gsap.core.Tween | null>(null);
  const out = useRef<Record<string, HTMLElement | null>>({});
  const [intent, setIntent] = useState(nearestPreset(START).intent);
  const [active, setActive] = useState(nearestPreset(START).time);
  const [glFailed, setGlFailed] = useState(false);
  const fallback = useRef<HTMLDivElement>(null);

  // Per frame: if minutes moved, push light state + update readout text (no React re-render per frame).
  useEffect(() => {
    const tick = () => {
      const m = wrap24(state.current.minutes);
      if (Math.abs(m - shown.current.minutes) < 0.05) return;
      shown.current.minutes = m;
      light.current?.set(stateAtMinutes(m));
      const r = readoutAtMinutes(m);
      const o = out.current;
      if (o.time) o.time.textContent = fmt(m);
      slider.current?.setAttribute('aria-valuetext', fmt(Number(slider.current.value)));
      if (o.day) o.day.textContent = r.daylightK ? `${r.daylightK}\u00a0K` : '—';
      if (o.art) o.art.textContent = r.artificialK ? `${r.artificialK}\u00a0K` : 'off';
      if (o.altar) o.altar.textContent = `${r.altarLux}`;
      if (o.nave) o.nave.textContent = `${r.naveLux}`;
      if (fallback.current) {
        fallback.current.style.setProperty('--day', r.daylightK ? kelvinToHex(r.daylightK) : '#0d0c0b');
        fallback.current.style.setProperty('--art', r.artificialK ? kelvinToHex(r.artificialK) : '#0d0c0b');
        fallback.current.style.setProperty('--day-a', String(Math.min(1, r.naveLux / 140)));
        fallback.current.style.setProperty('--art-a', String(r.artificialK ? Math.min(1, 0.25 + r.altarLux / 80) : 0));
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const { contextSafe } = useGSAP(() => {
    quick.current = gsap.quickTo(state.current, 'minutes', { duration: motionTokens.hour.quick, ease: 'power3.out' });
  }, { scope: root });

  const announce = (m: number) => {
    const p = nearestPreset(m);
    setIntent(p.intent);
    setActive(p.time);
  };

  const onInput = contextSafe((e: React.FormEvent<HTMLInputElement>) => {
    const v = Number(e.currentTarget.value);
    target.current = v;
    if (presetTween.current) {
      presetTween.current.kill();
      presetTween.current = null;
      quick.current = gsap.quickTo(state.current, 'minutes', { duration: motionTokens.hour.quick, ease: 'power3.out' });
    }
    if (prefersReducedMotion()) { gsap.killTweensOf(state.current); state.current.minutes = v; crossfade(); return; }
    // keep quickTo on the shortest path when crossing midnight
    const cur = wrap24(state.current.minutes);
    if (Math.abs(v - cur) > 720) state.current.minutes = cur + (v > cur ? 1440 : -1440);
    quick.current!(v);
  });

  const crossfade = contextSafe(() => {
    gsap.fromTo(root.current!.querySelector('.hour__stage'), { opacity: 0.4 }, { opacity: 1, duration: motionTokens.hour.cross, ease: 'none' });
  });

  const goTo = contextSafe((to: number) => {
    target.current = to;
    gsap.killTweensOf(state.current);
    const cur = wrap24(state.current.minutes);
    state.current.minutes = cur;
    const d = ((to - cur + 720 + 1440) % 1440) - 720;
    if (prefersReducedMotion()) {
      state.current.minutes = to; slider.current!.value = String(to); crossfade(); announce(to); return;
    }
    presetTween.current = gsap.to(state.current, {
      minutes: cur + d, duration: motionTokens.hour.preset, ease: 'power3.inOut', overwrite: true,
      onUpdate: () => { slider.current!.value = String(wrap24(Math.round(wrap24(state.current.minutes) / 5) * 5)); },
      onComplete: () => { state.current.minutes = wrap24(to); slider.current!.value = String(wrap24(to)); announce(to); },
    });
  });

  const reg = (k: string) => (el: HTMLElement | null) => { out.current[k] = el; };

  return (
    <section id="the-hour" ref={root} className="hour section" aria-labelledby="hour-title">
      <div className="grid hour__grid">
        <header className="hour__head">
          <h2 id="hour-title" className="kicker mono">The Hour</h2>
          <p className="hour__intro">{site.hourIntro}</p>
        </header>

        <figure className="hour__figure">
        <div className="hour__stage">
          {!glFailed && (
            <LightCanvas
              ref={light}
              className="hour__canvas"
              initial={stateAtMinutes(START)}
              label="Rendered view of the chapel interior at the selected hour"
              onReady={(ok) => setGlFailed(!ok)}
            />
          )}
          <div ref={fallback} className="hour__fallback" data-active={glFailed} aria-hidden="true" />
        </div>
          <figcaption className="hour__intent" aria-live="polite">{intent}</figcaption>
        </figure>

        <div className="hour__controls">
          <label htmlFor="hour-range" className="hour__label mono">
            Time of day <output ref={reg('time')} className="hour__time" htmlFor="hour-range">{fmt(START)}</output>
          </label>
          <input
            ref={slider}
            id="hour-range"
            className="hour__range"
            type="range"
            min={0}
            max={1439}
            step={5}
            defaultValue={START}
            onInput={onInput}
            onChange={(e) => announce(Number(e.currentTarget.value))}
            onKeyDown={(e) => {
              // step=5 so every preset (06:10, 18:20…) is an exact slider value; keys move in design units:
              // arrows ±15 min, Page Up/Down ±1 h, Home/End native. Values wrap around midnight.
              const deltas: Record<string, number> = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 60, PageDown: -60 };
              const delta = deltas[e.key];
              if (delta !== undefined) {
                e.preventDefault();
                // step from the TARGET (where the light is going), never from the animated value a running tween lags behind
                const v = wrap24(target.current + delta);
                e.currentTarget.value = String(v);
                e.currentTarget.dispatchEvent(new Event('input', { bubbles: true }));
                announce(v);
              }
            }}
          />
          <div className="hour__presets" role="group" aria-label="Jump to an hour">
            {HOUR_PRESETS.map((p) => (
              <button key={p.time} type="button" className="chip mono" aria-pressed={active === p.time} onClick={() => goTo(p.minutes)}>
                {p.time}
              </button>
            ))}
          </div>
        </div>

        <dl className="hour__readout mono">
          <div><dt>Daylight</dt><dd ref={reg('day')} className="is-cool">—</dd></div>
          <div><dt>Penumbra</dt><dd ref={reg('art')} className="is-warm">—</dd></div>
          <div><dt>Altar lux</dt><dd ref={reg('altar')}>—</dd></div>
          <div><dt>Nave lux</dt><dd ref={reg('nave')}>—</dd></div>
        </dl>

      </div>
    </section>
  );
}
