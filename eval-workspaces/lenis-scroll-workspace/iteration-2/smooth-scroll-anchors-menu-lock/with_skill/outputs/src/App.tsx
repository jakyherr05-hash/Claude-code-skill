import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from './motion/registry';
import { useScrollLock } from './scroll/SmoothScroll';

export default function App() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Block wheel/touch/keyboard scrolling of the page while the overlay is open.
  useScrollLock(open);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

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
        <button ref={toggle} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>Menu</button>
      </header>
      {open && (
        <div className="menu" id="mobile-menu">
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
