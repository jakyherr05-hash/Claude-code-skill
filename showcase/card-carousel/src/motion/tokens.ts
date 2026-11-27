/** Motion tokens for the card carousel (adapted from the gsap-motion skill's assets/tokens.ts). */
export const motionTokens = {
  dur: { xs: 0.2, s: 0.4, m: 0.75, l: 1.1 },
  ease: {
    land: 'land',        // card slides over and settles onto the stack
    reveal: 'expo.out',
    snap: 'power3.out',
  },
  stagger: { words: 0.08, cards: 0.09 },
  customEases: {
    // Fast travel, a slight overshoot past the slot, then a soft settle (matches the recording).
    land: 'M0,0 C0.18,0.72 0.32,1.04 0.55,1.025 0.74,1.012 0.84,1 1,1',
  } as Record<string, string>,
} as const;

/** True when the user asked the OS for reduced motion. Read live (it can change). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
