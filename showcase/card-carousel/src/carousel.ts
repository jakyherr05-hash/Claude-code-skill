import { gsap, Observer } from './motion/registry';
import { motionTokens, prefersReducedMotion } from './motion/tokens';

export interface CarouselOptions {
  /** Self-running loop like the reference recording. Off by default: the carousel moves when you swipe. */
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface CarouselHandle {
  readonly index: number;
  readonly progress: number;
  readonly ready: boolean;
  goTo(index: number): void;
  next(): void;
  prev(): void;
  destroy(): void;
}

/*
 * The cards sit on the outside of a vertical cylinder (a 3D ring) that turns around its centre.
 * Each card's place on the ring comes from ONE continuous number, `progress`:
 * card i sits at angle (i - progress) * STEP. Drag, wheel, buttons, keys and the entry all
 * just move `progress`, so every input produces the same circular motion.
 */
const STEP = 36; // degrees between neighbouring cards on the ring
const RADIUS = 1.4; // ring radius, in card widths (leaves a small gap between neighbours)
const FADE_FROM = 76; // cards past this angle (going round the back) fade out...
const FADE_TO = 100; // ...and are fully hidden here
const FOLLOW_TIME = 0.11; // drag/wheel smoothing: the ring eases toward the finger (seconds, time constant)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Signed distance from the front position, wrapped so the ring loops: result in [-n/2, n/2). */
function wrapOffset(raw: number, n: number) {
  return ((((raw + n / 2) % n) + n) % n) - n / 2;
}

export function createCarousel(root: HTMLElement, options: CarouselOptions = {}): CarouselHandle {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root);
  const dims = cards.map((c) => c.querySelector<HTMLElement>('.dim')!);
  const imgs = cards.map((c) => c.querySelector<HTMLImageElement>('img')!);
  const titleEl = root.querySelector<HTMLElement>('[data-caption-title]')!;
  const tagEl = root.querySelector<HTMLElement>('[data-caption-tag]')!;
  const dotsEl = root.querySelector<HTMLElement>('[data-dots]')!;
  const n = cards.length;

  let reduced = prefersReducedMotion();
  let width = cards[0].offsetWidth;
  const state = { progress: 0 }; // what is on screen
  let target = 0; // where the ring is heading (whole number when at rest)
  let following = false; // true while drag/wheel smoothing runs on the ticker
  let ready = false;
  let shownIndex = -1;
  let dir = 1;
  let tween: gsap.core.Tween | null = null;
  let captionTl: gsap.core.Timeline | null = null;
  // Entry values: `spread` 0 = all cards stacked on one spot of the ring, 1 = spaced out; `spin` = extra ring turn.
  const entry = { spread: 0, spin: 0 };

  const idx = (p: number) => ((Math.round(p) % n) + n) % n;

  // --- accessibility scaffolding ---
  cards.forEach((card, i) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${i + 1} of ${n}`);
  });
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(b);
    return b;
  });

  // --- rendering: one pass places every card on the ring from state.progress ---
  const setters = cards.map((c) => ({
    x: gsap.quickSetter(c, 'x', 'px'),
    z: gsap.quickSetter(c, 'z', 'px'),
    rotY: gsap.quickSetter(c, 'rotationY', 'deg'),
  }));

  function render() {
    const R = width * RADIUS;
    for (let i = 0; i < n; i++) {
      const o = wrapOffset(i - state.progress, n);
      const angle = o * STEP * entry.spread + entry.spin;
      const a = Math.abs(angle);
      const cos = Math.cos(rad(angle));
      const alpha = 1 - clamp01((a - FADE_FROM) / (FADE_TO - FADE_FROM));
      const s = setters[i];
      s.x(R * Math.sin(rad(angle)));
      s.z(R * (cos - 1));
      s.rotY(angle);
      // Painter's order by depth; while stacked in the entry, the front card stays on top.
      cards[i].style.zIndex = String(1000 + Math.round(cos * 500) + Math.round((1 - entry.spread) * (20 - Math.abs(o) * 4)));
      cards[i].style.opacity = String(alpha);
      cards[i].style.visibility = alpha <= 0.001 ? 'hidden' : 'visible';
      dims[i].style.opacity = String(Math.min(0.72, (1 - cos) * 1.6));
    }
    const active = idx(state.progress);
    if (active !== shownIndex) showIndex(active);
  }

  function showIndex(active: number) {
    const first = shownIndex === -1;
    shownIndex = active;
    cards.forEach((c, i) => c.setAttribute('aria-hidden', String(i !== active)));
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === active)));
    const title = cards[active].dataset.title ?? '';
    const tag = cards[active].dataset.tag ?? '';
    captionTl?.kill(); // a half-finished swap must never write stale text later
    if (first || reduced) {
      gsap.set([titleEl, tagEl], { clearProps: 'all' });
      titleEl.textContent = title;
      tagEl.textContent = tag;
      return;
    }
    const d = dir || 1;
    captionTl = gsap.timeline()
      .to([titleEl, tagEl], { xPercent: -30 * d, autoAlpha: 0, duration: 0.18, ease: 'power2.in' })
      .add(() => { titleEl.textContent = title; tagEl.textContent = tag; })
      .fromTo([titleEl, tagEl], { xPercent: 30 * d, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', stagger: 0.05 });
  }

  // --- smoothing loop for drag and wheel: exponential ease toward `target` ---
  function onTick(_t: number, deltaMs: number) {
    if (!following) return;
    const k = 1 - Math.exp(-deltaMs / 1000 / (reduced ? 0.04 : FOLLOW_TIME));
    state.progress += (target - state.progress) * k;
    if (!dragging && !wheeling && Math.abs(target - state.progress) < 0.0004) {
      state.progress = target;
      following = false;
      scheduleAutoplay();
    }
    render();
  }
  gsap.ticker.add(onTick);

  function stopMotion() {
    tween?.kill();
    tween = null;
    following = false;
  }

  // --- discrete moves (buttons, keys, dots, taps): ease in AND out around the ring ---
  function tweenTo(t: number) {
    stopMotion();
    target = t;
    const dist = Math.abs(t - state.progress);
    if (dist < 0.0004) { state.progress = t; render(); return; }
    dir = Math.sign(t - state.progress);
    tween = gsap.to(state, {
      progress: t,
      duration: reduced ? motionTokens.dur.xs : Math.min(1.6, 0.75 + 0.25 * dist),
      ease: reduced ? 'power1.out' : motionTokens.ease.ring,
      onUpdate: render,
      onComplete: () => { tween = null; scheduleAutoplay(); },
    });
  }

  // Steps are counted from where the ring is HEADING, so quick repeated taps all count.
  function goTo(i: number) {
    if (!ready) return;
    const base = Math.round(target);
    tweenTo(base + Math.round(wrapOffset(i - idx(base), n)));
  }
  const next = () => { if (ready) tweenTo(Math.round(target) + 1); };
  const prev = () => { if (ready) tweenTo(Math.round(target) - 1); };

  // --- swipe / drag: the ring turns with the finger, smoothed, then settles on the nearest card ---
  const pxPerCard = () => width * 0.8;
  let pressed = false; // Observer reports releases anywhere on the page; only handle presses that began on the ring
  let dragging = false;
  let dragged = false;
  let startTarget = 0;
  const pointer = Observer.create({
    target: stage,
    type: 'pointer,touch',
    dragMinimum: 3,
    lockAxis: true,
    preventDefault: false,
    onPress: () => {
      if (!ready) return;
      pressed = true;
      stopMotion();
      target = state.progress;
      startTarget = target;
      dragged = false;
      autoplayCall?.kill();
    },
    onDragStart: (self) => {
      if (!ready || self.axis === 'y') return;
      dragging = true;
      stage.classList.add('is-dragging');
    },
    onDrag: (self) => {
      if (!ready || !dragging || self.axis === 'y') return;
      dragged = true;
      const dp = -self.deltaX / pxPerCard();
      if (dp) dir = Math.sign(dp);
      target = Math.max(startTarget - 2, Math.min(startTarget + 2, target + dp));
      following = true;
    },
    onRelease: (self) => {
      stage.classList.remove('is-dragging');
      const wasDragging = dragging;
      dragging = false;
      if (!ready || !pressed) return;
      pressed = false;
      if (!dragged || !wasDragging) {
        // A tap on a side card turns it to the front.
        const hit = (self.event?.target as Element | null)?.closest<HTMLElement>('[data-card]');
        const i = hit ? cards.indexOf(hit) : -1;
        if (i >= 0 && i !== idx(state.progress)) goTo(i);
        else tweenTo(Math.round(state.progress));
        return;
      }
      const v = self.velocityX; // px/s; negative = finger moving left = next card
      const moved = target - startTarget;
      let snap: number;
      if (Math.abs(v) > 300) {
        snap = v < 0 ? Math.floor(target) + 1 : Math.ceil(target) - 1;
        if (Math.abs(v) > 2200) snap += v < 0 ? 1 : -1; // a hard flick carries one more card
      } else if (Math.abs(moved) > 0.15) {
        snap = moved > 0 ? Math.ceil(target) : Math.floor(target);
      } else {
        snap = Math.round(startTarget);
      }
      const base = Math.round(startTarget);
      target = Math.max(base - 2, Math.min(base + 2, snap));
      following = true; // glide on from the current speed into the slot (no stop-start)
    },
  });

  // --- wheel / trackpad: horizontal (or vertical) scroll turns the ring, then it settles ---
  let wheeling = false;
  let wheelEnd: gsap.core.Tween | null = null;
  const wheel = Observer.create({
    target: stage,
    type: 'wheel',
    wheelSpeed: 1,
    preventDefault: true,
    onWheel: (self) => {
      if (!ready) return;
      const d = Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY;
      if (!d) return;
      if (tween) { stopMotion(); target = state.progress; }
      wheeling = true;
      dir = Math.sign(d);
      target += d / (pxPerCard() * 1.4);
      following = true;
      wheelEnd?.kill();
      wheelEnd = gsap.delayedCall(0.14, () => {
        wheeling = false;
        target = Math.round(target);
      });
    },
  });
  pointer.disable();
  wheel.disable();

  // --- buttons and keyboard ---
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-next]');
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  root.tabIndex = 0;
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };
  document.addEventListener('keydown', onKey);

  // --- optional autoplay (off by default) ---
  let autoplayCall: gsap.core.Tween | null = null;
  let hovering = false;
  function scheduleAutoplay() {
    autoplayCall?.kill();
    if (!options.autoplay || !ready || reduced || hovering || dragging || document.hidden) return;
    autoplayCall = gsap.delayedCall(options.autoplayDelay ?? 1.8, next);
  }
  root.addEventListener('pointerenter', () => { hovering = true; autoplayCall?.kill(); });
  root.addEventListener('pointerleave', () => { hovering = false; scheduleAutoplay(); });
  const onVisibility = () => (document.hidden ? autoplayCall?.kill() : scheduleAutoplay());
  document.addEventListener('visibilitychange', onVisibility);

  // --- resize + reduced-motion changes ---
  const applySize = () => {
    width = cards[0].offsetWidth;
    stage.style.perspective = `${Math.round(width * 3.4)}px`;
    render();
  };
  const ro = new ResizeObserver(applySize);
  ro.observe(stage);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMq = () => { reduced = mq.matches; render(); };
  mq.addEventListener('change', onMq);

  // --- entry: the stacked deck swings round the ring, then fans out into place ---
  function finishEntry() {
    ready = true;
    pointer.enable();
    wheel.enable();
    document.documentElement.classList.add('motion-ready');
    scheduleAutoplay();
  }

  function playEntry() {
    const header = gsap.utils.toArray<HTMLElement>('.masthead .word > span');
    const after = ['.caption', '.controls', '.hint'];
    if (reduced) {
      entry.spread = 1;
      entry.spin = 0;
      render();
      gsap.set(header, { visibility: 'visible' });
      gsap.fromTo([stage, ...after], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out', onComplete: finishEntry });
      return;
    }
    entry.spread = 0;
    entry.spin = -78; // start round the side of the ring, just coming into view
    render();
    const front = idx(state.progress);

    gsap.timeline({ onComplete: finishEntry, defaults: { ease: 'power3.inOut' } })
      .set(header, { visibility: 'visible' })
      .fromTo(header, { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: motionTokens.stagger.words }, 0)
      .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0.1)
      .to(entry, { spin: 0, duration: 1.3, onUpdate: render }, 0.1) // deck swings round to the front
      .to(entry, { spread: 1, duration: 1.1, onUpdate: render }, 0.75) // then fans out around the ring
      .fromTo(imgs[front], { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 0.3)
      .fromTo(after, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }, 1.35);
  }

  // Start once fonts and the first images are ready (with a cap so a slow network never blocks it).
  applySize();
  const loaded = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    ...imgs.slice(0, 3).map((im) => im.decode().catch(() => undefined)),
  ]);
  Promise.race([loaded, new Promise((r) => setTimeout(r, 1500))]).then(() => {
    applySize();
    playEntry();
  });

  return {
    get index() { return idx(state.progress); },
    get progress() { return state.progress; },
    get ready() { return ready; },
    goTo, next, prev,
    destroy() {
      pointer.kill();
      wheel.kill();
      stopMotion();
      captionTl?.kill();
      autoplayCall?.kill();
      wheelEnd?.kill();
      gsap.ticker.remove(onTick);
      ro.disconnect();
      mq.removeEventListener('change', onMq);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
