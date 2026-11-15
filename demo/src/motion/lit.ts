/**
 * "Lit, not moved": the studio's text-reveal primitive for Penumbra (ANIMATION_SPECIFICATION §S1/S2).
 * Splits text with SplitText (aria:'auto' keeps the accessible name), and returns the SplitText instance.
 * Must be called inside a useGSAP/matchMedia context so it's reverted on unmount.
 * autoSplit + returning the tween from onSplit lets SplitText re-split on resize/font load and keep progress.
 */
import { gsap, SplitText } from './registry';
import { motionTokens } from './tokens';

type LitOpts = {
  type?: 'words' | 'lines';
  delay?: number;
  stagger?: number;
  y?: number;
  scrollTrigger?: ScrollTrigger.Vars;
  /** Called with the reveal tween so callers can chain (e.g. the manifesto underline). */
  then?: (tween: gsap.core.Tween) => void;
};

export function litWords(el: Element, opts: LitOpts = {}) {
  const type = opts.type ?? 'words';
  return SplitText.create(el, {
    type,
    // words: aria 'auto' (label on the element, splits hidden) — fine on headings.
    // lines: 'none' — line wrappers don't break words, screen readers read them naturally, and an
    // aria-label on a <p> is prohibited (Lighthouse/axe 'aria-prohibited-attr').
    aria: type === 'words' ? 'auto' : 'none',
    autoSplit: true,
    wordsClass: 'w',
    linesClass: 'ln',
    onSplit(self) {
      const targets = type === 'words' ? self.words : self.lines;
      const tween = gsap.fromTo(
        targets,
        { opacity: 0.08, color: 'var(--ink-muted)', y: opts.y ?? 0 },
        {
          opacity: 1, color: 'var(--ink)', y: 0,
          duration: motionTokens.dur.m, ease: motionTokens.ease.enter,
          stagger: opts.stagger ?? (type === 'words' ? motionTokens.stagger.words : motionTokens.stagger.lines),
          delay: opts.delay ?? 0,
          scrollTrigger: opts.scrollTrigger,
          clearProps: 'color,transform',
        },
      );
      opts.then?.(tween);
      return tween;
    },
  });
}
