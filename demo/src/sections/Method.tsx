import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { useReducedMotion } from '../motion/useReducedMotion';
import { site } from '../data/content';
import { MethodDrawing } from './MethodDrawing';

/**
 * S3 · Method — the pinned, scrubbed centrepiece (ANIMATION_SPECIFICATION §S3).
 * One ScrollTrigger, one pin, a 12-unit master timeline. Reduced motion renders three static steps instead.
 */
export function Method() {
  const reduced = useReducedMotion();
  return (
    <>
      <a href="#the-hour" className="skip skip--method">Skip method</a>
      {reduced ? <MethodStatic /> : <MethodPinned />}
    </>
  );
}

function Counter({ n }: { n: number }) {
  return <span className="method__counter mono" aria-hidden="true">0{n}<span className="method__of">/03</span></span>;
}

function MethodStatic() {
  return (
    <section id="method" className="method method--static section" aria-labelledby="method-title">
      <div className="grid">
        <h2 id="method-title" className="kicker mono">Method · Dark first</h2>
        {site.method.map((m, i) => (
          <article key={m.title} className="method__static-step">
            <Counter n={i + 1} />
            <h3 className="method__step-title">{m.title}</h3>
            <p>{m.text}</p>
            <MethodDrawing step={(i + 1) as 1 | 2 | 3} idPrefix={`ms${i}`} />
          </article>
        ))}
        <p className="method__closing">{site.methodClose}</p>
      </div>
    </section>
  );
}

function MethodPinned() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 64rem)', mobile: '(max-width: 63.999rem)' }, (ctx) => {
      const desktop = !!ctx.conditions!.desktop;
      const k = desktop ? 1 : 0.85; // compress beam spacing on mobile so the run fits 2 viewports
      const steps = q('[data-step]');
      const digits = q('[data-digit]');
      const beams = q('[data-beam]');
      const svg = root.current!.querySelector<SVGSVGElement>('.method-drawing')!;

      // initial states (motion branch only → no-JS / reduced users see final content)
      gsap.set(steps.slice(1), { autoAlpha: 0 });
      gsap.set(digits.slice(1), { autoAlpha: 0, yPercent: 40 });
      gsap.set(q('[data-layer="flood"]'), { opacity: 0 });
      gsap.set(q('[data-zone]'), { opacity: 0 });
      gsap.set(q('[data-layer="hatch"] [data-label]'), { opacity: 0 });
      gsap.set(beams, { opacity: 0, scaleY: 0, transformOrigin: '50% 0%' });
      gsap.set(q('[data-beam] [data-label]'), { opacity: 0 });
      gsap.set(q('[data-layer="cct"]'), { opacity: 0 });
      gsap.set(q('[data-closing]'), { autoAlpha: 0 });

      let active = -1; // write aria-hidden only when the active step changes, not on every scroll frame
      const setActive = (i: number) => { if (i === active) return; active = i; steps.forEach((s, j) => s.setAttribute('aria-hidden', String(j !== i))); };
      setActive(0);
      const tint = { k: 0 };
      const tintAt = gsap.utils.interpolate(['#d9a05b', '#9db4c6', '#d9a05b']);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: desktop ? '+=300%' : '+=200%',
          pin: q('.method__pin')[0],
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const u = self.progress * 12;
            setActive(u < 3.8 ? 0 : u < 7.8 ? 1 : 2);
          },
        },
      });
      tl.addLabel('s1', 0)
        .to(q('[data-layer="flood"]'), { opacity: 0.82, duration: 1.5 }, 0)
        .to(q('[data-zone]'), { opacity: 1, duration: 0.6, stagger: 0.5 }, 1)
        .to(q('[data-layer="hatch"] [data-label]'), { opacity: 1, duration: 0.6, stagger: 0.5 }, 1.3)
        .addLabel('s2', 3.6)
        .to(steps[0], { autoAlpha: 0, duration: 0.4 }, 3.6)
        .to(digits[0], { autoAlpha: 0, yPercent: -40, duration: 0.4 }, 3.6)
        .to(digits[1], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, 3.8)
        .to(steps[1], { autoAlpha: 1, duration: 0.4 }, 4.0);
      beams.forEach((b, i) => {
        const at = 4.4 + i * 1.2 * k;
        tl.to(b, { opacity: 1, scaleY: 1, duration: 1 }, at)
          .to(b.querySelector('[data-label]'), { opacity: 1, duration: 0.4 }, at + 0.6);
      });
      tl.addLabel('s3', 7.6)
        .to(steps[1], { autoAlpha: 0, duration: 0.4 }, 7.6)
        .to(digits[1], { autoAlpha: 0, yPercent: -40, duration: 0.4 }, 7.6)
        .to(digits[2], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, 7.8)
        .to(steps[2], { autoAlpha: 1, duration: 0.4 }, 8.0)
        .to(q('[data-layer="cct"]'), { opacity: 1, duration: 0.6 }, 8.0)
        .fromTo(q('[data-cct-marker]'), { x: 0 }, { x: 740, duration: 2.4 }, 8.6)
        .to(tint, { k: 1, duration: 2.8, onUpdate: () => svg.style.setProperty('--beam-tint', tintAt(tint.k)) }, 8.2)
        .addLabel('close', 11)
        .to(q('[data-closing]'), { autoAlpha: 1, duration: 0.6 }, 11)
        .to({}, { duration: 0.4 }, 11.6); // rest so the line is readable before the pin releases
    });
  }, { scope: root });

  return (
    <section id="method" ref={root} className="method" data-method aria-labelledby="method-title">
      <div className="method__pin">
        <div className="method__text">
          <h2 id="method-title" className="kicker mono">Method · Dark first</h2>
          <span className="method__counter mono" aria-hidden="true">
            <span className="method__digits">{[1, 2, 3].map((n) => <span key={n} data-digit>0{n}</span>)}</span>
            <span className="method__of">/03</span>
          </span>
          <div className="method__steps">
            {site.method.map((m, i) => (
              <div key={m.title} className="method__step" data-step={i + 1}>
                <h3 className="method__step-title">{m.title}</h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <p className="method__closing" data-closing>{site.methodClose}</p>
        </div>
        <div className="method__figure">
          <MethodDrawing step={3} idPrefix="mp" animated />
        </div>
      </div>
    </section>
  );
}
