import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { litWords } from '../motion/lit';
import { motionTokens } from '../motion/tokens';
import { featured, stillFor, type Project } from '../data/content';
import { Picture } from '../components/Picture';
import { Link } from '../router/Router';
import { MethodDrawing } from '../sections/MethodDrawing';

/** Detail route /work/:slug — "Rise" entrance; exists to exercise route lifecycle cleanup. */
export function ProjectPage({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const i = featured.findIndex((p) => p.slug === project.slug);
  const prev = featured[(i - 1 + featured.length) % featured.length];
  const next = featured[(i + 1) % featured.length];

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline();
      tl.fromTo('.detail__hero', { opacity: 0 }, { opacity: 1, duration: motionTokens.page.rise, ease: motionTokens.ease.enter }, 0)
        .fromTo('.detail__hero img', { scale: 1.03 }, { scale: 1, duration: motionTokens.dur.l, ease: motionTokens.ease.enter }, 0)
        .fromTo('[data-detail-meta]', { opacity: 0 }, { opacity: 1, duration: motionTokens.dur.s }, 0.9);
      litWords(root.current!.querySelector('h1')!, { delay: 0.25 });
      gsap.fromTo('.detail__hour', { opacity: 0 }, {
        opacity: 1, duration: motionTokens.dur.s, stagger: motionTokens.stagger.cards,
        scrollTrigger: { trigger: '.detail__hours', start: 'top 85%', once: true },
      });
    });
  }, { scope: root, dependencies: [project.slug], revertOnUpdate: true });

  return (
    <article ref={root} className="detail" aria-labelledby="detail-title">
      <div className="detail__hero" style={{ ['--focus-y' as string]: `${project.focusY ?? 40}%` }}>
        <Picture id={project.plate!} widths={[720, 1280, 1920]} sizes="100vw" alt={project.alt!} width={1600} height={2000} priority />
      </div>
      <header className="detail__head grid">
        <p className="kicker mono" data-detail-meta><Link to="/">Penumbra</Link> / Work / {project.no}</p>
        <h1 id="detail-title" tabIndex={-1}>{project.name}</h1>
        <p className="detail__meta mono" data-detail-meta>{project.place} · {project.year} · {project.typeLabel} · {project.spec}</p>
      </header>
      <div className="detail__body grid">
        <p className="detail__intent">{project.intent}</p>
        <div className="detail__narrative">{project.narrative?.map((t) => <p key={t}>{t}</p>)}</div>
      </div>
      <section className="detail__hours grid" aria-labelledby="hours-title">
        <h2 id="hours-title" className="kicker mono">The hours</h2>
        <ol className="detail__strip">
          {project.hours?.map((h) => (
            <li key={h.time} className="detail__hour">
              {/* a real render of the room at the nearest designed hour — light AND darkness, not a colour chip (CD fix 4) */}
              <Picture id={stillFor(h.time).id} widths={[640, 1280]} sizes="(min-width: 64rem) 16vw, 45vw" alt="" width={1280} height={720} className="detail__still" />
              <span className="mono">{h.time}</span>
              <span className="mono">{h.k ? `${h.k}\u00a0K` : 'off'}</span>
              <span>{h.note}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="detail__paper" aria-labelledby="drawings-title">
        <div className="grid">
          <h2 id="drawings-title" className="kicker mono">Drawings · lighting schedule excerpt</h2>
          <figure className="paper__drawing">
            <MethodDrawing step={3} idPrefix="paper" />
            <figcaption className="mono">Section A–A · lighting layout and protected dark zones</figcaption>
          </figure>
          <table className="paper__table">
            <thead><tr className="mono"><th scope="col">Ref.</th><th scope="col">Location</th><th scope="col">Source</th><th scope="col">CCT</th><th scope="col">Level</th></tr></thead>
            <tbody>
              <tr><td className="mono">L-01</td><td>Altar</td><td>Concealed spot, 12°</td><td className="mono">2700 K</td><td className="mono">40 lux</td></tr>
              <tr><td className="mono">L-02</td><td>Threshold</td><td>Recessed step light</td><td className="mono">2200 K</td><td className="mono">8 lux</td></tr>
              <tr><td className="mono">L-03</td><td>Niche</td><td>Linear grazer, 8°</td><td className="mono">2700 K</td><td className="mono">25 lux</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <nav className="detail__pager grid" aria-label="More projects">
        <Link to={`/work/${prev.slug}`} className="link-arrow"><span aria-hidden="true">← </span>{prev.name}</Link>
        <Link to={`/work/${next.slug}`} className="link-arrow">{next.name}<span aria-hidden="true"> →</span></Link>
      </nav>
    </article>
  );
}

export function NotFound() {
  return (
    <section className="notfound section grid" aria-labelledby="nf-title">
      <h1 id="nf-title" tabIndex={-1}>This room is dark.</h1>
      <p>The page you were looking for doesn't exist. <Link to="/">Return to the threshold</Link>.</p>
    </section>
  );
}
