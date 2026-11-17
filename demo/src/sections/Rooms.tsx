import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { motionTokens } from '../motion/tokens';
import { featured, site } from '../data/content';
import { Picture } from '../components/Picture';
import { Link } from '../router/Router';

/** Shared "door opening" reveal: a vertical slit widens like light spilling from an opened door. */
export function doorReveal(plate: Element, extra: Element[] = [], start = 'top 80%', delay = 0) {
  // Clip the picture, not the link: clip-path also clips hit-testing, so clipping the <a> would make
  // an unrevealed plate unclickable (taps fall through the 0-width slit).
  const target = plate.querySelector('picture') ?? plate;
  const media = plate.querySelector('img');
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(target, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: motionTokens.dur.l, ease: motionTokens.ease.enter })
    .fromTo(media, { scale: 1.04 }, { scale: 1, duration: motionTokens.dur.l, ease: motionTokens.ease.enter }, 0);
  if (extra.length) tl.fromTo(extra, { opacity: 0.08 }, { opacity: 1, duration: motionTokens.dur.m, stagger: motionTokens.stagger.cards, ease: motionTokens.ease.enter }, 0.8);
  return gsap.timeline({ scrollTrigger: { trigger: plate, start, once: true, onEnter: () => { gsap.delayedCall(delay, () => { tl.play(); }); } } });
}

/** S5 · Four rooms — project showcase (ANIMATION_SPECIFICATION §S5). */
export function Rooms() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 64rem) and (prefers-reduced-motion: no-preference)', mobile: '(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)' }, (ctx) => {
      const start = ctx.conditions!.desktop ? 'top 80%' : 'top 88%';
      root.current!.querySelectorAll('.room').forEach((room) => {
        doorReveal(room.querySelector('.room__plate')!, [...room.querySelectorAll('[data-lit]')], start);
      });
    });
  }, { scope: root });

  return (
    <section id="work" ref={root} className="rooms section" aria-labelledby="rooms-title">
      <div className="grid">
        <h2 id="rooms-title" className="kicker mono rooms__kicker">Four rooms</h2>
      </div>
      <ol className="rooms__list">
        {featured.map((p, i) => (
          <li key={p.slug} className="room grid" data-side={i % 2 ? 'right' : 'left'}>
            <Link to={`/work/${p.slug}`} className="room__plate" aria-label={`${p.name} — ${site.secondaryCta}`}>
              <Picture id={p.plate!} widths={[720, 1280, 1920]} sizes="(min-width: 64rem) 50vw, 100vw" alt={p.alt!} width={1600} height={2000} />
            </Link>
            <div className="room__text">
              <p className="room__no mono" data-lit>{p.no}</p>
              <h3 className="room__name" data-lit>{p.name}</h3>
              <p className="room__meta mono" data-lit>{[p.place, String(p.year), p.typeLabel].flatMap((t, k) => [k ? ' ' : null, <span key={t}>{t}</span>])}</p>
              <p className="room__intent">{p.intent}</p>
              <p className="room__spec mono" data-lit>{p.spec}</p>
              <Link to={`/work/${p.slug}`} className="link-arrow" data-lit>{site.secondaryCta}<span aria-hidden="true"> →</span></Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
