import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { litWords } from '../motion/lit';
import { motionTokens } from '../motion/tokens';
import { site } from '../data/content';

/** S2 · Manifesto — a breathing section; lines are lit once, then the warm underline is drawn. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const [before, after] = site.manifesto.split(site.manifestoMark);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const p = root.current!.querySelector('p')!;
      const uline = p.querySelector('.uline');
      gsap.set(uline, { backgroundSize: '0% 1px' });
      litWords(p, {
        type: 'lines',
        scrollTrigger: { trigger: p, start: 'top 75%', once: true },
        then: (tween) => {
          tween.eventCallback('onComplete', () => {
            gsap.to(uline, { backgroundSize: '100% 1px', duration: motionTokens.dur.l, ease: motionTokens.ease.enter });
          });
        },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="manifesto section" aria-label="Manifesto">
      <div className="grid">
        <p className="manifesto__text">
          {before}<span className="uline">{site.manifestoMark}</span>{after}
        </p>
      </div>
    </section>
  );
}
