import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('section h2').forEach((h) => {
      gsap.from(h, { opacity: 0, y: 30, scrollTrigger: { trigger: h, start: 'top 80%' } });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      <header>
        <strong>Acme</strong>
        <nav>
          <a href="#features">Features</a> <a href="#pricing">Pricing</a> <a href="#faq">FAQ</a>
        </nav>
        <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>Menu</button>
      </header>
      {open && (
        <div className="menu">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
        </div>
      )}
      <main>
        <section id="features"><h2>Features</h2></section>
        <section id="pricing"><h2>Pricing</h2></section>
        <section id="faq"><h2>FAQ</h2></section>
      </main>
    </div>
  );
}
