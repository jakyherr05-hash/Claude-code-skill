/** Motion tokens for the card carousel (adapted from the gsap-motion skill's assets/tokens.ts). */
export const motionTokens = {
  dur: { xs: 0.2, s: 0.4, m: 0.75, l: 1.1 },
  ease: {
    ring: 'power3.inOut', // turning the ring: eases in, then eases out into the slot
    reveal: 'power3.out',
  },
  stagger: { words: 0.08, cards: 0.09 },
  customEases: {} as Record<string, string>,
} as const;

/** True when the user asked the OS for reduced motion. Read live (it can change). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
