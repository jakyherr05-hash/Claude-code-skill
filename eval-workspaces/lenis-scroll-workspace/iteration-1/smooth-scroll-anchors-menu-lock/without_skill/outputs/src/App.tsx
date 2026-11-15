import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HEADER_HEIGHT, useLenis } from './useLenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Lock page scroll while the mobile menu is open (Lenis + native overflow lock).
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis]);

  // In-page anchors: offset by the fixed header; Lenis when active, native otherwise.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = e.currentTarget.hash;
    const target = hash && document.querySelector<HTMLElement>(hash);
    if (!target) return;
    e.preventDefault();
    setOpen(false); // effect cleanup restarts Lenis
    history.pushState(null, '', hash);
    requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(target, { offset: -HEADER_HEIGHT });
      else target.scrollIntoView(); // scroll-margin-top handles the offset
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  };

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
          <a href="#features" onClick={goTo}>Features</a> <a href="#pricing" onClick={goTo}>Pricing</a> <a href="#faq" onClick={goTo}>FAQ</a>
        </nav>
        <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>Menu</button>
      </header>
      {open && (
        <div className="menu">
          <a href="#features" onClick={goTo}>Features</a>
          <a href="#pricing" onClick={goTo}>Pricing</a>
          <a href="#faq" onClick={goTo}>FAQ</a>
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
