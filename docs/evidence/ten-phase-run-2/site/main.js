(function () {
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) return;

  /* == SCROLL == */
  let lenis = null; // shared contract: null under reduced motion
  gsap.registerPlugin(ScrollTrigger); // defensive; idempotent (MOTION also registers)
  const rmq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lenisTick = (time) => { if (lenis) lenis.raf(time * 1000); };
  const startLenis = () => {
    if (lenis) return;
    lenis = new Lenis({ lerp: 0.1, autoRaf: false, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
  };
  const stopLenis = () => {
    if (!lenis) return;
    gsap.ticker.remove(lenisTick);
    lenis.destroy();
    lenis = null;
  };
  const syncMotion = () => { rmq.matches ? stopLenis() : startLenis(); };
  syncMotion();
  (rmq.addEventListener ? rmq.addEventListener('change', syncMotion) : rmq.addListener(syncMotion));

  // In-page anchors (header links, skip link, wordmark). One offset mechanism:
  // CSS scroll-margin-top when the target has it (Lenis and native both honor it);
  // otherwise header height + 16.
  const headerOffset = () => {
    const h = document.querySelector('.site-header');
    return (h ? h.offsetHeight : 0) + 16;
  };
  const focusTarget = (el) => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    const hasMargin = parseFloat(getComputedStyle(el).scrollMarginTop) > 0;
    const offset = hasMargin ? 0 : -headerOffset();
    if (lenis) {
      lenis.scrollTo(el, { offset });
    } else if (hasMargin) {
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
    }
    focusTarget(el);
    if (location.hash !== hash) history.pushState(null, '', hash);
  });

  // aria-current="location" on the nav link whose section is in view (no Lenis needed).
  const navLinks = [].slice.call(document.querySelectorAll('[data-nav-link]'))
    .filter((l) => (l.getAttribute('href') || '').charAt(0) === '#');
  const setCurrent = (name) => {
    navLinks.forEach((l) => {
      if (l.dataset.navLink === name) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const name = en.target.dataset.section;
        if (en.isIntersecting) setCurrent(name);
        else if (navLinks.some((l) => l.dataset.navLink === name && l.hasAttribute('aria-current'))) setCurrent(null);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('[data-section]').forEach((s) => io.observe(s));
  }
  /* == /SCROLL == */

  /* == MOTION == */
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  const NO_RM = '(prefers-reduced-motion: no-preference)';
  const EASE = 'power2.out';

  // Hero opening: h1 and CTA are y-only (opacity never below 1), only the eyebrow fades (+y); lede y-only.
  const opening = (withPlate) => {
    const q = (s) => document.querySelector(s);
    const eyebrow = q('.hero .label'), h1 = q('.hero h1'), lede = q('.hero .lede'), cta = q('.hero .cta');
    gsap.set(eyebrow, { opacity: 0, y: 16 });
    gsap.set(lede, { y: 16 });
    gsap.set(h1, { y: 16 });
    gsap.set(cta, { y: 8 });
    const tl = gsap.timeline({ defaults: { duration: 0.7, ease: EASE } });
    tl.to(eyebrow, { opacity: 1, y: 0, clearProps: 'transform,opacity' }, 0)
      .to(h1, { y: 0, clearProps: 'transform' }, 0.08)
      .to(lede, { y: 0, clearProps: 'transform' }, 0.16)
      .to(cta, { y: 0, clearProps: 'transform' }, 0.24);
    if (withPlate) {
      const plate = q('[data-plate]');
      tl.fromTo(plate, { opacity: 0.6 }, { opacity: 1, duration: 0.9, clearProps: 'opacity' }, 0.2);
    }
    return tl;
  };

  // Step and contact reveals: once, in reading order. dist/dur differ by branch.
  const reveals = (dist, dur) => {
    gsap.utils.toArray('[data-step]').forEach((step) => {
      const items = step.querySelectorAll('[data-reveal]');
      gsap.set(items, { opacity: 0, y: dist });
      ScrollTrigger.create({
        trigger: step, start: 'top 80%', once: true,
        onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: dur, ease: EASE, stagger: 0.08, clearProps: 'transform,opacity' }),
      });
    });
    const mat = document.querySelector('.contact'); // section top precedes the mat: text is present as the mat enters
    const h2 = document.querySelector('.contact h2[data-reveal]');
    const cta = document.querySelector('.contact .cta[data-reveal]');
    if (!mat || !h2 || !cta) return;
    gsap.set(h2, { opacity: 0, y: dist });
    gsap.set(cta, { y: dist }); // CTA y-only: email always legible
    ScrollTrigger.create({
      trigger: mat, start: 'top 100%', once: true,
      onEnter: () => {
        gsap.to(h2, { opacity: 1, y: 0, duration: dur, ease: EASE, clearProps: 'transform,opacity' });
        gsap.to(cta, { y: 0, duration: dur, delay: 0.08, ease: EASE, clearProps: 'transform' });
      },
    });
  };

  mm.add({
    desktop: '(min-width: 1024px) and ' + NO_RM,
    mobile: '(max-width: 1023px) and ' + NO_RM,
  }, (ctx) => {
    const { desktop } = ctx.conditions;
    opening(desktop);
    reveals(desktop ? 16 : 12, desktop ? 0.7 : 0.4);

    if (desktop) {
      const rings = document.querySelector('.plate__rings');
      const glaze = document.querySelector('.plate__glaze');
      const will = (on) => { [rings, glaze].forEach((e) => { e.style.willChange = on ? 'transform' : ''; }); };
      const scrub = {
        trigger: '.steps', start: 'top 70%', end: 'bottom 75%', scrub: 0.5, invalidateOnRefresh: true,
        onToggle: (self) => will(self.isActive),
      };
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: scrub });
      // Centring: rings sit off-centre inside the rim, then true (children only; plate never moves).
      // Two tweens at position 0: offset (transform) and blur (custom prop).
      tl.fromTo(rings, { xPercent: 3, yPercent: -1.5 }, { xPercent: 0, yPercent: 0, duration: 0.66 }, 0)
        .fromTo(rings, { '--ring-blur': '1px' }, { '--ring-blur': '0px', duration: 0.66 }, 0)
        // Glaze pools from the centre once 03 is centred (feathered radial, no hard edge).
        .fromTo(glaze, { scale: 0.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power1.inOut' }, 0.55);
      return () => will(false);
    }
  });
  // reduced motion: no branch, nothing created.

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh(); else window.addEventListener('load', refresh, { once: true });
  /* == /MOTION == */
})();
