import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/registry';
import { litWords } from '../motion/lit';
import { site } from '../data/content';
import { Picture } from '../components/Picture';
import { doorReveal } from './Rooms';

const DETAILS = [
  { id: 'atelier-brass', alt: 'Macro of a spun-brass reflector with concentric highlights.', cap: 'Spun brass · reflector' },
  { id: 'atelier-glass', alt: 'A blown-glass diffuser throwing a soft caustic.', cap: 'Blown glass · diffuser' },
  { id: 'atelier-plate', alt: 'A stamped serial plate reading PNB-014 · 2700 K.', cap: 'Serial plate · PNB-014' },
];

/** S7 · Atelier (craft) */
export function Atelier() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      litWords(root.current!.querySelector('.atelier__line')!, { type: 'lines', scrollTrigger: { trigger: root.current!, start: 'top 80%', once: true } });
      root.current!.querySelectorAll('.atelier__plate').forEach((el, i) => {
        doorReveal(el, [], 'top 80%', i * 0.14);
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="atelier section" aria-labelledby="atelier-title">
      <div className="grid">
        <h2 id="atelier-title" className="kicker mono">Atelier</h2>
        <p className="atelier__line">{site.atelier}</p>
        <ul className="atelier__plates">
          {DETAILS.map((d) => (
            <li key={d.id}>
              <figure>
                <div className="atelier__plate"><Picture id={d.id} widths={[480, 960]} sizes="(min-width: 64rem) 25vw, 80vw" alt={d.alt} width={960} height={960} /></div>
                <figcaption className="mono">{d.cap}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** S8 · Contact — static; the only lit thing is the pool under the CTA. */
export function Contact() {
  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="grid">
        <h2 id="contact-title" className="contact__title">{site.contact}</h2>
        <div className="contact__pool">
          <a className="cta cta--large" href={`mailto:${site.email}`}>{site.cta}<span aria-hidden="true"> →</span></a>
        </div>
        <address className="contact__address mono">
          Rua fictícia 12 · 1200-000 Lisbon<br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </address>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="grid">
        <p className="mono">{site.footer}</p>
        <a href="#main" className="mono">Back to top ↑</a>
      </div>
    </footer>
  );
}
