# Project Brief — OZONE (cigarette-smoking prevention, interactive graphic novel)
_Owner: orchestrator · Last updated: 2026-11-18 · Supersedes the 2026-11-17 vaping brief (git history)._

## Business
- What it is: OZONE, a tobacco retailer in California.
- This page sells nothing. It is one continuous, cinematic, scroll-driven graphic-novel story with two purposes:
  1. Tell teenagers not to start smoking cigarettes: nicotine is addictive, peer pressure is not a reason, protect your health, independence and future, you can say no.
  2. State OZONE's responsible-retailing commitment: OZONE checks IDs and does not sell cigarettes to anyone under 21.
- Scope: **cigarettes only.** No vaping or e-cigarette content of any kind.

## Audience
- Primary: teenagers. Secondary: parents, community, adult customers.
- After visiting they must believe: starting is a choice they can refuse; nicotine is addictive; smoking does real damage; OZONE takes age restrictions seriously.

## The feeling
A premium illustrated story that respects its reader: dark, cinematic, never preachy, never glamorising smoking.

## Experience (client-specified)
- A cinematic loading sequence (7 stages: darkness, ink formation, color, OZONE identity, illustrated movement, real progress, enter the story) that transforms into Scene 1.
- Seven connected scenes with the client's headlines:
  1. EVERY STORY STARTS SOMEWHERE. / MAKE SURE YOURS STARTS RIGHT.
  2. THE PRESSURE TO FIT IN IS REAL. / BUT YOU NEVER HAVE TO SAY YES.
  3. IT MAY LOOK LIKE JUST ONE. / BUT NICOTINE CAN LEAD TO ADDICTION.
  4. THE DAMAGE ISN'T ALWAYS VISIBLE. / BUT THE RISKS ARE REAL.
  5. YOUR FUTURE IS BIGGER THAN A CIGARETTE. / BE STRONG ENOUGH TO SAY NO.
  6. OZONE / WE CHECK IDs. NO EXCEPTIONS.
  7. DON'T START. PROTECT YOUR FUTURE. · OZONE · WE CHECK IDs. WE FOLLOW THE LAW. WE PROTECT OUR COMMUNITY.
- Six choreographed, reversible transitions. One world, not seven sections.
- Sound ON by default (original Web Audio score and effects), with an honest autoplay fallback (ENTER WITH SOUND / CONTINUE WITHOUT SOUND) and an accurate toggle.

## Art direction (client-specified)
- Original hand-built SVG, dark graphic-novel style: ink outlines, halftone, dramatic shadow, cinematic light, red/yellow accents.
- One teenage protagonist, built as a reusable rig with consistent identity, never shown smoking.
- Palette: #101014 deep black · #19191F charcoal · #481C2A dark burgundy · #F04452 electric red · #F1EBDD warm off-white · #77747B muted gray · #F5D547 electric yellow.

## Constraints
- Native scroll (no Lenis), React + TS + GSAP 3 + ScrollTrigger; SVG/CSS only (no WebGL/Canvas/Three.js without approved justification).
- WCAG 2.2 AA; reduced-motion story complete; sound never needed to understand the story; readable without JS.
- Medical/legal sentences only from FACTS_AND_SOURCES.md. No statistics unless requested. No invented policies, procedures, certifications or equipment (no scanner).
- Budget: free/open licences only; all music, effects and art original.
- All files under `showcase/ozone/`. The demo and the plugin are not modified.

## Assumptions (revisit if wrong)
- No OZONE logo supplied: a typographic OZONE wordmark is designed and marked replaceable.
- No address/hours/phone supplied: omitted (not placeholders on the page).
- California-specific law: BLOCKED until a CDPH/leginfo source can be read; no CA claims meanwhile.
- Device testing: Chromium with emulation only. iOS Safari and Android Chrome are NOT TESTED unless the client tests on devices.
