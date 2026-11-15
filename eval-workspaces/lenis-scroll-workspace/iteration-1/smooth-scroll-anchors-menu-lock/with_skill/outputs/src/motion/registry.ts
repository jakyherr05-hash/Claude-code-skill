/** Single place where GSAP plugins are registered. Import gsap/ScrollTrigger/useGSAP from here. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;
export function registerGSAP() {
  if (registered) return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  // Mobile URL-bar show/hide fires resize; ignore it to avoid jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}
registerGSAP();

export { gsap, ScrollTrigger, useGSAP };
