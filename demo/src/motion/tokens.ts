/** Motion tokens — mirror of studio/CREATIVE_DIRECTION.md §Motion and ANIMATION_SPECIFICATION.md. */
export const motionTokens = {
  dur: { xs: 0.18, s: 0.4, m: 0.8, l: 1.3, xl: 2.0 },
  ease: {
    enter: 'dimmer',      // signature: filament warming, long settle
    reveal: 'expo.out',
    exit: 'power2.in',
    morph: 'power3.inOut',
    scrub: 'none',
  },
  scrub: 0.8,
  stagger: { words: 0.09, lines: 0.12, cards: 0.14 },
  hour: { quick: 0.6, preset: 1.3, cross: 0.2 },
  page: { dim: 0.45, rise: 0.7, reduced: 0.2 },
  customEases: {
    dimmer: 'M0,0 C0.32,0 0.12,1 1,1',
  } as Record<string, string>,
} as const;

/** True when the user asked the OS for reduced motion. Read live (it can change). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
