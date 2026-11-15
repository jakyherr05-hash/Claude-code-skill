import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { litWords } from '../motion/lit';
import { site } from '../data/content';

/** S2 · Manifesto — a breathing section; lines are lit once, then the warm underline is drawn. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const [before, after] = site.manifesto.split(site.manifestoMark);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const p = root.current!.querySelector('p')!;
      // The underline is driven by CLASSES on the paragraph, not by a tween on the .uline node:
      // SplitText (autoSplit) clones nested spans when it splits/re-splits lines, so a node reference or an
      // inline style would target stale elements (CD Gate B fix 3). CSS draws it via a transition.
      p.classList.add('uline-armed');
      litWords(p, {
        type: 'lines',
        scrollTrigger: { trigger: p, start: 'top 75%', once: true },
        then: (tween) => { tween.eventCallback('onComplete', () => p.classList.add('uline-drawn')); },
      });
      return () => p.classList.remove('uline-armed', 'uline-drawn');
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
