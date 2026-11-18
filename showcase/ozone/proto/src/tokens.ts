// Motion tokens: ANIMATION_SPECIFICATION §1. Only these values are used.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

let done = false;
/** Register once (plugin registry). ScrollTrigger and CustomEase only: no SplitText, no Flip. */
export function registerPlugins() {
  if (done) return;
  done = true;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('ink', 'M0,0 C0.22,0 0.14,1 1,1');
}

export const ease = {
  ink: 'ink',
  cam: 'power2.inOut',
  lift: 'power3.in',
  settle: 'power2.out',
  none: 'none',
} as const;

/** Hold drift: 2.5 % scale + 1 % x, linear. */
export const DRIFT = { scale: 0.025, x: 0.01 };
