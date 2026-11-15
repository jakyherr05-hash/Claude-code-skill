import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { goToHash, initSmoothScroll, lockScroll, unlockScroll } from './smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // One Lenis instance, cleaned up properly under StrictMode.
  useEffect(() => initSmoothScroll(), []);

  // Anchor links (delegated): offset for the fixed header, update hash, manage focus.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      if (goToHash(a.getAttribute('href')!)) e.preventDefault();
    };
    const onPop = () => location.hash && goToHash(location.hash, { push: false });
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    // Deep link on load (after layout settles).
    if (location.hash) requestAnimationFrame(() => goToHash(location.hash, { push: false, immediate: true }));
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  // Lock page scroll while the menu overlay is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
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
        <button ref={menuButton} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>Menu</button>
      </header>
      {open && (
        <div className="menu" id="menu">
          {/* Close handler only; the delegated click handler does the scrolling. */}
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
