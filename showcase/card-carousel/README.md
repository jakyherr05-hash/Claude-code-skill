# Card carousel (GSAP)

A swipeable stacked-card carousel. The next card slides in from the right, grows and lands on top of the current one. The page opens with a "dealt deck" entry: the cards start as a stack and fan out. Slides are 1:1.

- `src/carousel.ts`: every card's pose comes from one continuous `progress` value, so a swipe moves the deck 1:1 with the finger, then snaps (flick = one slide, hard flick = two). Buttons, dots and arrow keys tween the same value. Uses GSAP `Observer` and `CustomEase` (registered in `src/motion/registry.ts`, the pattern from the `gsap-motion` skill).
- Autoplay is off; `createCarousel(root, { autoplay: true })` turns on the self-running loop.
- Reduced motion: no entry choreography, short crossfade-like snaps.
- `public/slides/`: the five images, pre-cropped to 1080×1080.

```bash
npm install
npm run dev            # local
npm run build && npm run preview   # serves dist/ on :4175
npm test               # Playwright checks against :4175 (phone swipe, mouse drag, entry, 1:1, keys, dots, reduced motion)
```
