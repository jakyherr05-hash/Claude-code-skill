/**
 * Motion tokens, measured frame by frame from the reference recording (30 fps source, 5 transitions,
 * fitted with 2.5 px RMS error over a 585 px travel).
 */
export const motionTokens = {
  dur: { xs: 0.25, move: 0.731, hold: 0.103, release: 0.55 },
  ease: {
    strip: 'strip',       // measured: cubic-bezier(0.766, 0, 0.239, 1) — strong ease-in, strong ease-out
    release: 'power3.out', // after a swipe: carries on from the finger's speed, then settles
    reveal: 'power3.out',
  },
  stagger: { words: 0.08 },
  customEases: {
    strip: 'M0,0 C0.766,0 0.239,1 1,1',
  } as Record<string, string>,
} as const;

/** True when the user asked the OS for reduced motion. Read live (it can change). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
