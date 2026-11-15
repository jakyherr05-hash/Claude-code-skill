import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { litWords } from '../motion/lit';
import { motionTokens } from '../motion/tokens';
import { site } from '../data/content';
import { Picture } from '../components/Picture';
import { LightCanvas, type LightHandle } from '../components/LightCanvas';
import { HERO_STATE } from '../webgl/lightRenderer';

/** S1 · Threshold — the shaft "warms on" while the headline words are lit (ANIMATION_SPECIFICATION §S1). */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const light = useRef<LightHandle>(null);
  const uniforms = useRef({ reveal: 0 });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      if (ctx.conditions!.reduce) { light.current?.set({ reveal: 1 }); return; }
      const u = uniforms.current;
      u.reveal = 0;
      light.current?.set({ reveal: 0 });
      gsap.to(u, { reveal: 1, duration: motionTokens.dur.xl, ease: motionTokens.ease.enter, onUpdate: () => light.current?.set({ reveal: u.reveal }) });
      litWords(root.current!.querySelector('h1')!, { delay: 0.35, y: 4 });
      const sub = root.current!.querySelectorAll('[data-hero-sub]');
      const tl = gsap.timeline({ delay: 1.1 });
      // "Lit, not shown": start dim (0.08) like the headline instead of invisible. Elements at opacity 0
      // are excluded from LCP, so a 0→1 fade here pushed mobile LCP to ~5.3 s (PERFORMANCE_REPORT).
      tl.fromTo(sub, { opacity: 0.08 }, { opacity: 1, duration: motionTokens.dur.m, ease: motionTokens.ease.reveal, stagger: 0.25 });
    });
  }, { scope: root });

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <Picture id="hero-poster" widths={[960, 1920]} sizes="100vw" alt="" width={1920} height={1080} priority className="hero__poster" />
        <LightCanvas ref={light} className="hero__canvas" initial={{ ...HERO_STATE, reveal: 0 }} label="" />
        <div className="hero__scrim" />
      </div>
      <div className="hero__content grid">
        <p className="kicker mono" data-hero-sub>Atelier de Luz · Lisbon</p>
        <h1 id="hero-title" className="hero__title" tabIndex={-1}>{site.h1}</h1>
        <div className="hero__foot">
          <p className="hero__sub" data-hero-sub>{site.sub}</p>
          <a className="cta" href={`mailto:${site.email}`} data-hero-sub>{site.cta}<span aria-hidden="true"> →</span></a>
        </div>
      </div>
    </section>
  );
}
