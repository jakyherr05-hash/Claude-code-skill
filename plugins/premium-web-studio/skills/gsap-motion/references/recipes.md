# GSAP recipes

Contents: 1 Hero sequence · 2 Text reveals · 3 Clip-path/mask · 4 Pinned scrub story · 5 Horizontal scroll · 6 Parallax · 7 Flip morphs · 8 Observer gestures · 9 Draggable + Inertia · 10 Magnetic & cursor · 11 SVG morph/draw · 12 Image distortion · 13 Page transitions · 14 3D scroll

Status key: **[demo]** = implemented and tested in `demo/` (see `assets/examples/`). **[doc]** = written against the official API (gsap 3.15.1 d.ts), not exercised in the demo; test it in your project.

All snippets assume `import { gsap, ScrollTrigger, SplitText, Flip, ... } from './registry'` and that they run inside `useGSAP(() => { ... }, { scope })`.

## 1. Cinematic hero sequence [demo]
```ts
const mm = gsap.matchMedia();
mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
  if (c.conditions!.reduce) return;               // final state is the CSS state
  const tl = gsap.timeline({ defaults: { ease: 'signature' } });
  tl.to(uniforms, { reveal: 1, duration: 2, onUpdate: () => renderer.set(uniforms) }, 0)   // light / media
    .add(() => litWords(h1, { y: 4 }), 0.35)                                            // headline
    .fromTo('[data-hero-sub]', { opacity: 0 }, { opacity: 1, stagger: 0.25, duration: 0.8 }, 1.1);
});
```
Keep the LCP element (usually the H1 text or a poster image) **visible in HTML** and animate only its subsidiary properties (colour or opacity from 0.08, not 0), so LCP isn't delayed.

## 2. Text reveals [demo: words/lines lit]
```ts
SplitText.create(el, {
  type: 'lines,words', mask: 'lines', aria: 'auto', autoSplit: true,
  onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1, stagger: 0.08, ease: 'expo.out' }),
});
```
- `mask: 'lines'` wraps lines in overflow-clip containers for the classic slide-up reveal.
- Returning the tween from `onSplit` makes `autoSplit` re-split on resize/font load and keep progress.
- `aria: 'auto'` keeps screen readers reading the original sentence.
- Never animate body paragraphs character by character.

## 3. Clip-path & mask transitions [demo: door slit]
```ts
gsap.fromTo(plate, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'signature' });
gsap.fromTo(img, { scale: 1.04 }, { scale: 1, duration: 1.3 }, '<');   // counter-scale the media
```
Both values must have the same shape (`inset` → `inset`, with matching units). For diagonal wipes use `polygon()` with the same point count.

## 4. Pinned scrub storytelling [demo: Method]
```ts
const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
  trigger: section, start: 'top top', end: desktop ? '+=300%' : '+=200%',
  pin: section.querySelector('.pin'), scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
  onUpdate: (self) => setActiveStep(Math.floor(self.progress * 3)),   // a11y: expose only the active step
}});
tl.addLabel('step1', 0).to(...).addLabel('step2', 4).to(...);
```
Think in timeline *units*, not seconds: scrub maps scroll distance onto total duration. Leave a short rest at the end so the last frame is readable before the pin releases. Provide a "skip" link before the pin.

## 5. Horizontal scroll section [doc]
```ts
const track = section.querySelector('.track');
const getX = () => -(track.scrollWidth - innerWidth);
const scroller = gsap.to(track, { x: getX, ease: 'none', scrollTrigger: {
  trigger: section, pin: true, scrub: 1, end: () => `+=${track.scrollWidth - innerWidth}`, invalidateOnRefresh: true } });
// child animations driven by horizontal position:
gsap.from(card, { opacity: 0, scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left 80%' } });
```
On mobile, prefer a native horizontal `overflow-x: auto` + `scroll-snap` row; pinned horizontal scroll on touch is fragile.

## 6. Parallax [doc]
```ts
gsap.to(layer, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
```
Apply only to decorative/media layers (≤ 8–15%), never to text. Wrap the moving element so its box doesn't change the layout.

## 7. Flip layout morphs [demo: index filter]
```ts
const state = Flip.getState(items, { props: 'opacity' });
setFilter(next);                         // React commits new DOM
useLayoutEffect(() => Flip.from(state, { targets: items, duration: 0.6, ease: 'power3.inOut',
  onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, delay: 0.2 }) }), [filter]);
```
Give each item a stable `data-flip-id`. Call `Flip.killFlipsOf(items)` before starting a new flip. Run `ScrollTrigger.refresh()` on complete if page height changed. For shared-element page transitions, use `Flip.getState` before the route swap and `Flip.from` after, with the same `data-flip-id` on both pages.

## 8. Observer-driven gesture sections [doc]
```ts
Observer.create({ target: window, type: 'wheel,touch,pointer', tolerance: 10, preventDefault: true,
  onDown: () => !animating && goTo(index + 1), onUp: () => !animating && goTo(index - 1) });
```
Only for deliberate "slide deck" experiences. You must provide keyboard (arrow/PageUp/PageDown) handlers and an escape to normal scroll, and disable Lenis while active (`lenis.stop()`).

## 9. Draggable + Inertia [doc]
```ts
Draggable.create(track, { type: 'x', bounds: wrapper, inertia: true, edgeResistance: 0.85,
  snap: (v) => gsap.utils.snap(cardWidth)(v), onPress() { lenis?.stop(); }, onRelease() { lenis?.start(); } });
```
Mirror the drag with buttons and arrow keys. Put `data-lenis-prevent` on horizontal draggers so Lenis doesn't consume the gesture.

## 10. Magnetic buttons & cursor followers [doc]
```ts
const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' }), yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
btn.addEventListener('pointermove', contextSafe((e) => { const r = btn.getBoundingClientRect();
  xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.3); }));
btn.addEventListener('pointerleave', contextSafe(() => { xTo(0); yTo(0); }));
```
Enable only under `(hover: hover) and (pointer: fine)` via matchMedia. Never hide the native cursor without a visible replacement, and never move the element's focus ring away from it.

## 11. SVG morph & draw [doc]
```ts
gsap.to('#shapeA', { morphSVG: '#shapeB', duration: 1, ease: 'power2.inOut' });       // MorphSVGPlugin
gsap.from('.line', { drawSVG: '0%', duration: 1.2, stagger: 0.1 });                 // DrawSVGPlugin
```
Register MorphSVGPlugin and DrawSVGPlugin in registry.ts only if used. They're free, but tree-shaking only removes what isn't imported.

## 12. Image distortion [doc]
CSS can't distort images convincingly. Hand off to WebGL (`webgl-three` skill): a plane with the image texture and a displacement uniform driven by `gsap.to(uniforms.uProgress, { value: 1 })` or by scroll velocity (`lenis.velocity`). Keep the `<img>` in the DOM for accessibility/SEO and hide it visually only when the canvas has rendered.

## 13. Page transitions [demo: Dim/Rise veil]
Exit tween → swap route → `ScrollTrigger.refresh()` after layout → enter tween → move focus to the new `h1`. Lock scroll during the swap (`lenis.stop()`). Use ≤ 1.2 s total. For Next.js App Router, run exit animations in a client component that intercepts link clicks, or use the View Transitions API with GSAP for the inner choreography.

## 14. 3D scroll interactions [doc]
Drive a camera or model from a scrubbed tween on a plain object; the WebGL module reads it on the shared ticker:
```ts
const cam = { t: 0 };
gsap.to(cam, { t: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: '+=200%', scrub: 1, pin: true } });
gsap.ticker.add(() => stage.setProgress(cam.t));
```
