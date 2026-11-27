/**
 * Single place where GSAP plugins are registered (idempotent), as in the gsap-motion skill.
 * Only what this page uses: Observer (swipe / drag / wheel) and CustomEase.
 */
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { CustomEase } from 'gsap/CustomEase';
import { motionTokens } from './tokens';

let registered = false;

export function registerGSAP() {
  if (registered) return;
  gsap.registerPlugin(Observer, CustomEase);
  for (const [name, path] of Object.entries(motionTokens.customEases)) CustomEase.create(name, path);
  gsap.defaults({ ease: motionTokens.ease.strip, duration: motionTokens.dur.move });
  registered = true;
}

registerGSAP();

export { gsap, Observer, CustomEase };
