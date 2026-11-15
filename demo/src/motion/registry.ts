/**
 * Single place where GSAP plugins are registered (idempotent).
 * Every plugin imported here ships in the public `gsap` npm package (verified for gsap@3.15.1)
 * under GSAP's Standard "no charge" licence.
 * Import gsap & plugins from THIS module so registration is guaranteed before use.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { motionTokens } from './tokens';

let registered = false;

export function registerGSAP() {
  if (registered) return;
  // Register only what the project uses (unused plugins still cost bytes). Add Draggable/InertiaPlugin/Observer/MorphSVG here when needed.
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase);
  for (const [name, path] of Object.entries(motionTokens.customEases)) CustomEase.create(name, path);
  gsap.defaults({ ease: motionTokens.ease.enter, duration: motionTokens.dur.m });
  // Mobile browsers fire resize when the URL bar shows/hides; ignore those to avoid pin jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

registerGSAP();

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP };
