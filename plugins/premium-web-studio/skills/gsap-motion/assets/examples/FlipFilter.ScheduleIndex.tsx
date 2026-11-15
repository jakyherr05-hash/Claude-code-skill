import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, Flip, ScrollTrigger, useGSAP } from '../motion/registry';
import { motionTokens, prefersReducedMotion } from '../motion/tokens';
import { projects, kelvinToHex, type ProjectType } from '../data/content';
import { Link } from '../router/Router';

const TYPES: (ProjectType | 'All')[] = ['All', 'Sacred', 'Museum', 'House', 'Hospitality'];

/** S6 · Lighting schedule — the full index, filtered with Flip (ANIMATION_SPECIFICATION §S6). */
export function ScheduleIndex() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof TYPES)[number]>('All');
  const flipState = useRef<Flip.FlipState | null>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const visible = projects.filter((p) => filter === 'All' || p.type === filter);

  const choose = contextSafe((t: (typeof TYPES)[number]) => {
    if (t === filter) return;
    const rows = root.current!.querySelectorAll('.sched__row');
    Flip.killFlipsOf(rows);
    flipState.current = prefersReducedMotion() ? null : Flip.getState(rows, { props: 'opacity' });
    setFilter(t);
  });

  // After React commits the filtered rows: animate survivors from their old positions, fade in newcomers.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) { ScrollTrigger.refresh(); return; }
    const ctx = gsap.context(() => {
      Flip.from(state, {
        targets: root.current!.querySelectorAll('.sched__row'),
        duration: 0.6, ease: motionTokens.ease.morph,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: motionTokens.dur.s, delay: 0.2 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }, root);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section ref={root} className="sched section" aria-labelledby="sched-title">
      <div className="grid">
        <div className="sched__head">
          <h2 id="sched-title" className="kicker mono">Lighting schedule · All work</h2>
          <div className="sched__filters" role="group" aria-label="Filter projects by type">
            {TYPES.map((t) => (
              <button key={t} type="button" className="chip mono" aria-pressed={filter === t} onClick={() => choose(t)}>{t}</button>
            ))}
          </div>
          <p className="visually-hidden" role="status">{visible.length} projects shown</p>
        </div>
        <table className="sched__table">
          <caption className="visually-hidden">Projects by Penumbra with place, year, type and colour-temperature range</caption>
          <thead>
            <tr className="mono"><th scope="col">No.</th><th scope="col">Project</th><th scope="col">Place</th><th scope="col">Year</th><th scope="col">Type</th><th scope="col">CCT range</th></tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.slug} className="sched__row" data-flip-id={p.slug}>
                <td className="mono">{p.no}</td>
                <th scope="row" className="sched__name">
                  {p.featured ? <Link to={`/work/${p.slug}`}>{p.name}</Link> : <span>{p.name}</span>}
                  <span className="sched__intent">{p.intent}</span>
                </th>
                <td>{p.place}</td>
                <td className="mono">{p.year}</td>
                <td>{p.typeLabel}</td>
                <td className="mono sched__cct">
                  <span className="sched__swatch" aria-hidden="true" style={{ background: `linear-gradient(90deg, ${kelvinToHex(p.cct[0])}, ${kelvinToHex(p.cct[1])})` }} />
                  {p.cct[0] === p.cct[1] ? `${p.cct[0]} K` : `${p.cct[0]}–${p.cct[1]} K`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
