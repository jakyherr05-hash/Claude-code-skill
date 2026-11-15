import { useEffect, useRef, useState } from 'react';
import { site } from '../data/content';
import { Link, useRouter, href } from '../router/Router';
import { useScrollLock } from '../scroll/SmoothScroll';

const NAV = [
  { id: 'method', label: 'Method' },
  { id: 'the-hour', label: 'The Hour' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { route, navigate } = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useScrollLock(open);
  const onHome = route.name === 'home';

  // Escape closes; focus is trapped inside the open panel; focus returns to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>('a,button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [toggle.current!, ...panel.current.querySelectorAll<HTMLElement>('a,button')];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Off the home page, section links navigate home first, then land on the section.
  const sectionLink = (id: string, label: string) => (
    <a
      href={onHome ? `#${id}` : `${href('/')}#${id}`}
      onClick={(e) => {
        setOpen(false);
        if (!onHome) { e.preventDefault(); navigate(`${href('/')}#${id}`); }
      }}
    >
      {label}
    </a>
  );

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <Link to="/" className="wordmark" aria-label="Penumbra — home">PENUMBRA</Link>
      <nav className="nav-desktop" aria-label="Primary">
        <ul>{NAV.map((n) => <li key={n.id}>{sectionLink(n.id, n.label)}</li>)}</ul>
      </nav>
      <a className="nav-cta" href={`mailto:${site.email}`}>{site.cta}</a>
      <button
        ref={toggle}
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
      </button>
      <div id="mobile-menu" ref={panel} className="nav-panel" data-open={open} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>{NAV.map((n, i) => <li key={n.id}><span className="mono" aria-hidden="true">0{i + 1}</span>{sectionLink(n.id, n.label)}</li>)}</ul>
        </nav>
        <a className="nav-panel-cta" href={`mailto:${site.email}`}>{site.cta}</a>
      </div>
    </header>
  );
}
