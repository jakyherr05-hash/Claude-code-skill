# Audio Specification — OZONE — "Your Ink" (original score and SFX, live Web Audio)
_Owner: audio (composer / sound designer) · 2026-11-18 (T5; revised for Gate A round 1) · Inputs: PROJECT_BRIEF; CREATIVE_DIRECTION §5–§7, §9; ANIMATION_SPECIFICATION §1, §2, §5, §8 (labels); TECHNICAL_ARCHITECTURE §3, §5, §6, §8 (AudioDirector contract, budgets); DESIGN_SPECIFICATION §3.2, §5; GATE_A_REVIEW_R1; DECISIONS D1, A-3, A-4, AU-1…AU-5, TD3, TD5, TD7, TD10, G-1, G-3. This file has no code. Nothing here has been rendered yet: every level and check is a target, verified by §6–§7._

**Contract.** The only triggers are the master-timeline labels `cue:sN`, `cue:t45:lowpass-open`, `sfx:tNM:<id>` and `sfx:footstep` (A-4), plus the internal hand-off event `loader:bloom` (AU-4, G-1). §5 maps every one. Sound start follows the four G-1 cases in §4:
- Autoplay is probed once at init (D1).
- The loader itself never makes a sound.
- The score's first audible frame coincides with a visible, operable sound toggle (WCAG 1.4.2).

Under A-3, scroll unlocks at the hand-off and the score fades in at the same time; audio never gates anything. The piece is one score in one tempo that never restarts. Scroll chooses *where in the score* we are, not *whether* it plays.
**Never heard (CD §7):** beeps, scanner/register/card-reader tones, chimes, notifications, whooshes, lighter, inhale/exhale, coughing, heartbeats, horror stingers, laughter, sirens, words, bare test-tone oscillators, audible loops.

## 1 · Musical form
**Global.** 12-TET, A4 = 440 Hz, C4 = middle C. **72 BPM in 4/4 for the whole visit** (beat 0.833 s, bar 3.333 s, 16th 0.208 s). Tempo never changes, so one bar grid serves all seven scenes; pressure is written as subdivision, not tempo. **Key plan: D major (S1) → D Dorian/minor (S2–S4, Phrygian ♭II in S3) → F major (S5–S6, the uplift, a minor third up) → D major (S7, home, resolved).**

**Leitmotif "the walk".** Four notes rising P4–M2–M2, with a short–long–short–LONG rhythm that moves like a step and a stride. In D: **A3 D4 E4 \| F♯4**. Rhythm: n1 is an 8th on beat 2, n2 a quarter on beat 2.5, n3 an 8th on beat 3.5, and n4 falls on the next downbeat (its length is set per scene). Base velocities 0.55 / 0.70 / 0.60 / 0.75. **The 4th note tells the story:** F♯ is the teen's own; F♮ is pressure; silence is harm; in the future it returns as A (F major), and finally as F♯ again.

| Cue | Motif statements (cue bars; "b2→3" = n1–n3 in bar 2, n4 on bar 3) | Voice | Meaning |
|---|---|---|---|
| s1 | b2→3 A3 D4 E4 \| F♯4 (2 beats) · b6→7 the same, n4 held 4 beats with an E4 grace 60 ms before · b10→11 pluck 8va A4 D5 E5 \| F♯5 · b14→15 piano over Bm7 (questioning) | felt piano, pluck | stated simply |
| s2 | b2→3 A3 D4 E4 \| **F4** staccato (¼ beat), swallowed by a murmur swell · b6 A3 D4 E4, then a rest the pulse fills · b10 A3 D4, A3 D4 (the first step repeated, stuck) · b14 D4 E4 only | pluck mp → p | interrupted |
| s3 | b1 A3 D4 E4, then nothing: E4 rings into the reverb (pedal 4 bars) · b5 D4 E4 · b7, b13, b15 E4 alone, pp | felt piano | stops on its 3rd note |
| s4 | none; the cello lament D3–C3–B♭2–A2 takes its place | — | absent |
| s5 | b2→3 in F: C4 F4 G4 \| **A4** (4 beats), pluck + piano in unison · b6→7 harmonised 8va, SATB: S C5 F5 G5 \| A5 · A G4 C5 C5 \| C5 · T E4 F4 E4 \| F4 · B C3 C3 C3 \| F2 | pluck + piano; choir, high strings | completed, harmonised |
| s6 | b4→5 and b8→9 in the bass: C3 F3 G3 \| A3 (low pluck, locked to the pulse), with felt piano in diatonic 10ths above: E4 A4 B♭4 \| C5 | low pluck, piano | steady |
| s7 | b2→3 A4 D5 E5 \| F♯5 (4 beats) · answer b4→5 G5 F♯5 E5 \| D5 · b7→8 SATB tutti: S A4 D5 E5 \| F♯5 · A E4 A4 A4 \| A4 · T C♯4 D4 C♯4 \| D4 · B A2 A2 A2 \| D2 · b9→10 bright mallet A5 D6 E6 \| F♯6, left to ring into silence | all | full |

**Harmony.** Voicings are written bass / upper voices, low to high (pad and strings share the upper voices; the melody sits above them). Bars 9–16 are the continuation phrase.

| Cue | Bars 1–8: Roman → chord (voicing) | Bars 9–16 |
|---|---|---|
| s1 (16) | I(add9) D(add9) (D2 / A2 E3 F♯3 A3) · IV/I Gmaj7/D (D2 / G2 B2 D3 F♯3) · I⁶ D/F♯ (F♯2 / A2 D3 E3 A3) · IVmaj7(♯11) Gmaj7(♯11) (G1 / D2 B2 F♯3 C♯4) · ii9 Em9 (E2 / B2 D3 F♯3 G3) · V7sus4 A7sus4 (A1 / E2 G2 D3 E3) · I(add9) (as b1) · vi7(add11) Bm7(add11) (B1 / F♯2 A2 D3 E3) | IV · V7sus4 · I⁶ · IV(♯11) · ii9 · vi7 · IV · V7sus4 |
| s2 (16) | i9 Dm9 (D2 / A2 C3 E3 F3) · i/♭VII Dm(add9)/C (C2 / A2 D3 E3 F3) · ♭VImaj9 B♭maj9 (B♭1 / F2 A2 C3 D3) · IV⁶ (Dorian) G6/B (B1 / D2 G2 B2 E3) · i⁶₄ Dm/A (A1 / F2 A2 D3 E3) · ♭VII(sus2) Csus2 (C2 / G2 C3 D3 G3) · ♭VImaj7(♯11) (B♭1 / F2 A2 D3 E3) · V7(♭13) A7(♭13) (A1 / E2 G2 C♯3 F3) | same chords; bass in 8ths |
| s3 (16) | i (sub D2 / cello F3 for b1–2 only, high A5) · i · ♭II E♭ (sub E♭2 / high B♭5) · i (D2 / A5) · ♭VI B♭ (B♭1 / A5, now the maj7) · ♭VI · V A (A1 / A5, piano E4) · V | i · ♭II · i · ♭II · ♭VI · ♭VI · V · V (the semitone grind comes closer) |
| s4 (16) | 2-bar harmonic rhythm over a D pedal: i9 Dm9 (D1+D2 / A2 F3 C4 E4) · ♭VI(add9)/i B♭(add9)/D (D2 / B♭2 F3 C4 D4) · iv9/i Gm9/D (D2 / G2 B♭2 F3 A3) · V7sus4/i A7sus4/D (D2 / A2 G3 D4 E4). Cello lament D3 · C3 · B♭2 · A2, one note per chord | i9 · ♭VImaj7/i (D2 / B♭2 F3 A3 D4) · iv6/i Gm6/D (D2 / G2 B♭2 E3 D4) · V7sus4/i; lament repeats, doubled by basses at x > 0.5 |
| s5 (16) | IVmaj9 B♭maj9 (B♭1 / F2 D3 A3 C4) · Vsus4 Csus4 (C2 / G2 C3 F3 G3) · I(add9) F(add9) (F1 F2 / C3 G3 A3) · vi7 Dm7 (D2 / A2 C3 F3) · IVmaj7 B♭maj7 (B♭1 / F2 A2 D3) · Vsus4→V (C2 / G2 C3 F3→E3 G3) · I F (F1 F2 / C3 F3 A3) · IV/V B♭/C (C2 / B♭2 D3 F3) | IVmaj9 · V · I(add9) · vi7 · ii7 Gm7 (G1 / F2 B♭2 D3) · V⁶ C/E (E2 / G2 C3) · I · IV/V |
| s6 (16) | I F (F2 / A3 C4 F4) · V⁶ C/E (E2 / G3 C4 E4) · vi7 Dm7 (D2 / F3 A3 C4) · IV(add9) B♭(add9) (B♭1 / F3 B♭3 C4 D4) · I⁶ F/A (A1 / F3 A3 C4) · ii7 Gm7 (G1 / F3 B♭3 D4) · Vsus4 (C2 / F3 G3 C4) · V C (C2 / E3 G3 C4) | same chords; the mallet pattern inverts; piano off-beats go up 8va from b13 |
| s7 (12, once) | ♭VI(add9) B♭(add9) (B♭1 B♭2 / F3 C4 D4) · ♭VII(add9) C(add9) (C2 C3 / G3 D4 E4) · I(add9) (D2 D3 / A3 E4 F♯4) · IVmaj7 Gmaj7 (G1 G2 / D3 B3 F♯4) · I⁶ D/F♯ (F♯2 / D3 A3 E4) · ii9 Em9 (E2 / G3 B3 D4 F♯4) · Vsus4→V (A1 A2 / E3 A3 D4→C♯4) · I(add9) (D2 D3 / F♯3 A3 E4) | b9 IV/I G/D (D2 / G3 B3 D4) · b10 I(add9) held (D1 D2 / A2 F♯3 E4 A4, choir D4 F♯4 A4 E5) · b11–12 tails only, then silence |

**Modulations.**
- **S1 → S2** is a parallel-mode shift: V7sus4 resolves to i9, and the F♯ simply becomes F.
- **Uplift (T4 → S5), D minor → F major.** The near-silence leaves one held **A4**, the 5th of D minor. S5 bar 1 puts B♭maj9 under it, so the A becomes the maj7 of B♭. This works as a pivot because Dm is vi in F and B♭ is ♭VI in D and IV in F. IV–Vsus4–I then lands the motif's n4 (A4) on F(add9), a minor third above S1's F♯. It is the first time since S1 that the 4th note arrives in a major key. The ear filter opens at `cue:t45:lowpass-open`, before bar 1.
- **Resolution (S6 → S7), F major → D major.** B♭ and C are IV and V in F, and also ♭VI and ♭VII in D. S7 reuses them as the Aeolian approach ♭VI–♭VII–I, so F slides home to D. F♮, the pressure note, turns into F♯ on bar 3 under the motif's n4. The final cadence is plagal (IV/I → I), not dominant: it reads as rest, not triumph.

## 2 · Arrangement per cue
Here x is the progress through a cue's scroll span (0 → 1, §4). Levels are music-bus short-term RMS in dBFS, post-master.

| Cue | Voices (register) | Level | Density / texture | What follows x |
|---|---|---|---|---|
| s1 | felt piano (D2–F♯4; rolled chords plus 3–6 arpeggio notes per bar) · warm pad (pp) · low strings pedal D2/A2 from b3 (ppp) · air tuned to the chord (10 grains/s) · ambience: city hum, lamp hum | −30…−24 | sparse, ≤ 7 notes per bar | piano notes per bar 3 → 6 · pad LPF 1.6 → 2.2 kHz · lamp hum −54 → −60 dBFS, panning R → L as the lamp passes (t12 20–45 %) |
| s2 | sub pulse on roots · pluck (motif) · fewer piano notes · darker pad · low strings 8ths from x 0.5 · murmur (3 talkers, right) · air 12/s | −27…−21 | pulse: quarters for x < 0.33, 8ths for 0.33–0.66, then 8ths with 16th pickups, accents grouped 3+3+2. **Never paired short–long hits (no heartbeat)** | murmur −40 → −30 dBFS · ear filter 3.6 → 3.0 kHz · pad LPF 1.4 → 1.0 kHz |
| s3 | high strings holding one line A5 → B♭5 → A5 (two alternating desks) · sustained sub on roots · piano fragment · cello F3 b1–2. The s2 pulse ends on the bar line | −34…−27 | thin: 3 voices | high strings pp → mp (x 0.6) → pp · vibrato 2 → 10 cents · ear filter 2.6 → 2.1 kHz · sub −30 → −26 dBFS |
| s4 | low strings ensemble · cello lament · low warm pad · sub pedal D1/D2 ppp · dark air 6/s · **no pulse, no motif** | −31…−25 | slow: one chord per 2 bars | strings p → mp (x 0.5) → p · basses double the lament from x 0.5 · ear filter 2.0 → 1.6 kHz |
| near-silence | from `sfx:t45:eraser-rub` to `cue:s5`. On the next beat every music voice releases over 1.5 s except high strings on **A4 pp** (desk change every 2 bars) and air tuned to A5/E6. After 4 bars without `cue:s5`, the A4 fades and only air remains | −50…−40 | the eraser is the only foreground | — |
| s5 | full bandwidth. B♭maj9 swell: brass-like swell (F2 B♭2 D3), choir pad, warm pad, low strings · then pluck + piano motif · high-string octaves from x 0.4 · harmonised motif at b6→7 · tuned mallet 8ths pp from x 0.7 (foreshadowing S6) · streetlight plucks (SFX, pitched) | −24…−18 | widening, 4 → 7 voices; the widest stereo of the piece | choir vowel "oo" → "ah" · air 14 → 22 grains/s · string octave doubling |
| s6 | tuned mallet 8th pulse (root/5th in F4–C5, pattern 1-5-8-5) · felt piano off-beat chords (A3–F4) · low pluck motif · steady warm pad mp · soft sub quarters · room tone (ambience) | −27…−22 | steady, mid-density; nothing grows | room tone 0 → −50 dBFS by x 0.2, out by x 0.75 (the camera leaves the shop). Nothing else changes: steadiness is the point |
| s7 | tutti, warm rather than loud: piano, pluck, choir "ah", high and low strings, brass swell in b6–8 only, pad, bright mallet b9–10, sub b8–10 only | −22…−16 peak (b7–8), then tails to −60 | 12 bars once, then silence under the back matter | time-driven; x is ignored |

- **The "muffled → full" ear filter.** In S1–S4 the score is heard *from outside the headphones* (they hang around the neck), so the music bus runs through: 2 cascaded lowpass biquads (Q 0.6 and 0.5, about 24 dB/oct) at the per-cue cutoffs above, which close as pressure grows · M/S width 0.6 · low shelf 80 Hz at −2 dB. At `cue:t45:lowpass-open` (the headphones `set`) the cutoff ramps exponentially 1.6 kHz → 20 kHz over 0.9 s, width 0.6 → 1.0 and the shelf −2 → +2 dB. This happens **immediately, not quantised**: it is the one musical event locked to a picture frame. Reverse: everything closes over 1.2 s. Ambience and SFX are diegetic and bypass the filter.
- **The restrained warning accent (S4).** `sfx:t34:hatch1` arms it; it plays once on the next bar line. It is a brass-like swell on the open fifth D3+A3, pp → mp → pp over 4.5 s (the fifth fits every S4 chord), plus felt-piano octave D1+D2 at velocity 0.45. Peak −20 dBFS. No hit, no stinger, no percussion. It re-arms only when S4 is next entered forward from S3.
- **Retail room tone (S6).** Brown noise LPF 350 Hz at −50 dBFS with a 0.07 Hz ±2 dB drift (air handling), plus pink noise BP 1.2 kHz Q 0.4 at −58 dBFS through the room IR (presence). No tones, no hum lines, no electronics.
- **Holds longer than 16 bars.** Extension groups of 4 bars cycle through variations: (a) upper voices inverted up one chord tone; (b) motif-free bars with a seeded piano counter-line on chord tones (stepwise, ≤ 1 leap per bar); (c) one layer dropped; (d) pad top voice ±8va. The same variation never falls on the same chord group twice in a row. After 32 bars in one cue with no scroll (≈ 107 s), the cue thins to pad + air at −6 dB until the next scroll, matching the idle stop in ANIMATION §1.

## 3 · Instrument designs
**Rendered voices (TD10).** Felt piano, plucked string, tuned mallet, the noise buffers and both reverb IRs are computed in a **file-based Worker**:
- **Worker.** `new Worker(new URL('./renderWorker.ts', import.meta.url), {type:'module'})`, allowed by CSP `worker-src 'self'` (TD7); no blob Worker.
- **Recurrence oscillators.** Each partial is y[n] = 2cos(ω)·y[n−1] − y[n−2] with Float64 state: one multiply-add per sample, no `Math.sin` per sample. Decays are running multipliers.
- **Hand-over.** The Worker transfers one Float32Array per root. The main thread copies each into an AudioBuffer of the **one production AudioContext** (`createBuffer` + `copyToChannel`), one root per task. Every main-thread task is ≤ 16 ms and is queued with `MessageChannel`/`setTimeout(0)`; `requestIdleCallback` is not used (Safari lacks it).
- **No OfflineAudioContext in production.** It exists only on the dev-only QA page (§6).
- **Half-rate buffers.** Piano and mallet buffers are rendered at `ctx.sampleRate / 2`: every partial they use stays below 0.45 × that rate, and higher partials are omitted. The plucked string, noise and IRs are rendered at the full rate.
- **Playback** uses playbackRate (≤ ±2 semitones, roots a major third apart).
- **`audio-buffers` loader item (TD3).** Non-critical, 4000 ms timeout, no retry. On timeout it is marked skipped for the progress count, but rendering continues. Each rendered voice joins on the first bar line after its buffers arrive; until then its notes are skipped, never substituted. The live voices carry the score meanwhile, so it is never silent.

Live voices are built from OscillatorNode, BiquadFilter and Gain. Humanisation uses a seeded PRNG (mulberry32, seed = cue·1000 + bar·10 + voice), so renders are deterministic.

| Voice | Source / oscillator stack | Filter | Envelope A / D / S / R (ms) | Modulation | Stereo · humanise | Hall send |
|---|---|---|---|---|---|---|
| Felt piano (rendered; 13 roots C2–C6, 3.5 s) | additive partials n = 1…8 at fₙ = n·f₀·√(1+B·n²), B = 0.0002 below C3 / 0.0004 / 0.0009 above C5 · amplitude 1/n^1.6, n ≥ 5 ×0.5 · each partial doubled at +0.8 cent (unison beating) · decay τₙ = T₁/(1+0.6(n−1)), T₁ = 3.2 s·√(261.6/f₀), two-stage 0.7e^(−t/τ) + 0.3e^(−t/3τ) · felt hammer: 12 ms noise, LPF 1.8 kHz, −18 dB · key-release noise BP 600 Hz 40 ms −36 dB | per note LPF 900 + 5200·v² Hz, Q 0.5 | 4 / baked / — / 350 (τ 120) | — | pan −0.35 (D2) → +0.35 (F♯6) · onset ±8 ms · velocity ±7 % · chords rolled upward 15–30 ms | −12 dB |
| Plucked string, motif (rendered; 10 roots C3–C6, 2.5 s) | Karplus–Strong: delay N = sr/f₀ plus first-order allpass for the fraction · excitation N samples of noise → one-pole LPF (a 0.5) → pick-position comb at N/7 · loop 0.5(x[n−N] + x[n−N−1])·s, s 0.996 (0.993 above C5) | body bus: peak 220 Hz +3 dB Q 1 · 1.1 kHz −2 dB · high shelf 5 kHz −4 dB | natural / — / — / 250 | — | 2 copies ±4 cents, pan ±0.2 · onset ±6 ms · velocity ±6 % | −10 |
| Low strings ensemble (live) | per note 3 saws at −9 / 0 / +8 cents (±2 cents random per note) | per note 12 dB LPF at 6·f₀ + 400 Hz, +30 % during the attack (bow bite) · section bus: HPF 45 Hz, peak 250 Hz +2 dB, 2.8 kHz +1.5 dB, LPF 7 kHz | 350 / 400 / 0.85 / 900, legato overlap 120 | vibrato 5.2 Hz 6 cents, delayed 450 ms, faded in over 600 ms · bow noise BP 2.5 kHz Q 0.8 at −30 dB riding the section envelope | saws panned −0.3 / 0 / +0.3 · onset ±12 ms | −9 |
| High strings (live) | 3 saws ±7 cents · a held note is played by **2 desks** (±3 cents apart) that hand over every 2 bars with a 1.2 s crossfade, so no tone is ever static | LPF 4·f₀ + 800 Hz | 600 / 500 / 0.8 / 1200 | vibrato 5.6 Hz, 2–10 cents (S3: follows x) | desks at −0.25 / +0.25 | −7 |
| Warm pad (live) | 2 saws ±6 cents + sine at f₀ (−6 dB) | 2 lowpass biquads (24 dB/oct) at the per-cue cutoff, Q 0.6 · LFO 0.08 Hz ±25 % on cutoff | 1800 / 1000 / 0.8 / 2500 | bus chorus: 2 delays 7 ± 2 ms at 0.31 / 0.37 Hz, mix 30 % (desktop only) | saws at −0.5 / +0.5 | −8 |
| Choir-like pad (live) | 2 saws ±5 cents + shared breath noise (HPF 3 kHz, −28 dB) | choir-bus formant bank, 3 parallel BPs: "oo" 350/850/2300 Hz ↔ "ah" 750/1150/2600 Hz, Q 6/8/10, gains 0/−4/−12 dB, glide τ 1.5 s · dry LPF 2.5 kHz path at −10 dB | 1500 / 800 / 0.9 / 3000 | vibrato 4.8 Hz (±0.3 Hz random per note), 5 cents | notes spread −0.4…+0.4 | −6 |
| Brass-like swell (live) | 2 saws ±4 cents + square at f₀ (−12 dB) | LPF tracks the amplitude envelope: 300 + 2400·env Hz, Q 1.2 (brass bloom) | 1200 / 600 / 0.7 / 1400; swells only, never stabs | pitch scoop −15 cents → 0 over 180 ms · late vibrato 5 Hz, 4 cents | ±0.15 | −10 |
| Sub (live) | sine f₀ + sine 2f₀ at −8 dB (keeps the line audible on phones) | bus LPF 180 Hz, HPF 28 Hz | pulse 6 / 260 → 0.25 / — / 180 · sustained 2000 / — / 1 / 3000 | sustained: amplitude drift 0.06 Hz ±1.5 dB | mono | none |
| Tuned mallet (rendered; 9 roots F3–C6, 2 s) | partials 1 (τ 0.9 s), 3.98 (τ 0.25 s, −10 dB), 9.2 (τ 0.08 s, −20 dB) · felt mallet noise 3 ms LPF 3 kHz −20 dB · "bright" S7 variant adds partial 2.0 (τ 1.4 s, −12 dB) | — | 2 / baked | — | pan by pitch ±0.3 · onset ±5 ms · velocity ±8 % | −14 (bright −8) |
| Air, granular-ish (live) | 6 s stereo pink-noise buffer · grains are AudioBufferSourceNodes of 60–180 ms with a 16-point Hann curve, playbackRate 0.8–1.25, random offset, 6–22 grains/s | air bus: 3 resonant BPs (Q 18) on chord tones in octaves 5–6 (e.g. D(add9) → A5 E6 F♯6), retuned at every chord change (τ 0.8 s) · parallel HPF 6 kHz shimmer at −18 dB | Hann per grain | density follows x | grain pan random ±0.8 | −4 |
| Murmur, S2 (live) | 3 talker streams from one brown-noise buffer, each BP F1 (random walk 350–750 Hz, Q 4) + BP F2 (900–1700 Hz, Q 6), ≤ 2 formant moves/s · syllable AM 3–5.5 Hz random, depth 70 % · phrase gaps 0.4–1.2 s | LPF 1.4 kHz (no intelligible vowels) | stream fades 800 / 1200 | no periodic bursts and no rising glides (rules out laughter) | pans +0.3 / +0.5 / +0.7 (the peers) | −4 |
| Ambience (S1) | city: brown noise LPF 220 Hz at −50 dBFS + pink LPF 800 Hz swells every 6–12 s · lamp: noise BP 120 Hz Q 30 + 240 Hz Q 30 (−6 dB) at −54 dBFS (noise-based, no oscillator) | — | follows cue | — | lamp pans with the lamp | −16 |

- **Reverb (IRs generated in the render Worker; the `audio-ir` loader item).**
  - **Hall** (music and featured SFX): stereo, 3.2 s long, RT60 2.6 s. L and R are independent seeded white noise × e^(−6.91t/2.6). HF damping: the noise runs through a one-pole LPF whose cutoff glides 9 kHz → 1.8 kHz from t 0 to 2.5 s. Early reflections: taps at 7/11/17/23/31/41 ms, −6…−16 dB, alternating L/R. Pre-delay 18 ms (a DelayNode before the ConvolverNode). Normalised to −3 dB energy. Return HPF 120 Hz and LPF 8 kHz.
  - **Room** (S6 room tone, card tap, footsteps behind glass): 0.6 s, RT60 0.45 s, damping 6 → 2.5 kHz, pre-delay 4 ms. Desktop only; mobile sends these to the hall at −10 dB.
- **Master chain.**
  - Routing: music bus → ear filter → music gain (duck automation) ─┐ · ambience bus ─┤ · SFX bus ─┤ · reverb returns ─┘ → mix.
  - Mix → HPF 25 Hz (Q 0.707; DC and rumble) → glue DynamicsCompressor (threshold −20 dB, knee 12, ratio 2.5, attack 0.03 s, release 0.35 s) → trim A → limiter DynamicsCompressor (threshold −4 dB, knee 0, ratio 20, attack 0.002 s, release 0.12 s) → trim B → soft clipper (WaveShaper, linear up to |x| 0.70 with a tanh knee above, ceiling 0.891 = −1 dBFS, 4096 points, oversample `2x`) → destination.
  - DynamicsCompressorNode applies automatic make-up gain, so trims A and B are **calibrated from the offline renders**, not guessed.
- **Headroom.** Music bus pre-master peaks ≤ −6 dBFS. Limiter gain reduction ≤ 3 dB on S7 peaks and ≤ 1 dB elsewhere. **Sample peak ≤ −1.0 dBFS, true peak ≤ −0.5 dBTP. Integrated loudness −20 LUFS ±2** for the forward run-through: a story bed, below streaming loudness. Short-term max −14 LUFS; near-silence ≤ −45 LUFS short-term.

## 4 · Scroll ↔ music sync
| Cue | Enters at label | Desktop / 390 units | x span (desktop / 390) | Ear filter |
|---|---|---|---|---|
| s1 | hand-off calls `setCue(1,+1)` | 0 / 0 | 0–100 / 0–80 | 4.5 kHz |
| s2 | `cue:s2` (t12 50 %) | 100 / 80 | 100–265 / 80–215 | 3.6 → 3.0 |
| s3 | `cue:s3` (t23 50 %) | 265 / 215 | 265–455 / 215–375 | 2.6 → 2.1 |
| s4 | `cue:s4` (t34 50 %); near-silence from `sfx:t45:eraser-rub` (694 / 583) | 455 / 375 | 455–715 / 375–600 | 2.0 → 1.6 |
| s5 | `cue:t45:lowpass-open` + `cue:s5` (t45 50 %) | 715 / 600 | 715–915 / 600–765 | open |
| s6 | `cue:s6` (t56 50 %) | 915 / 765 | 915–1135 / 765–950 | open |
| s7 | `cue:s7` (t67 50 %) | 1135 / 950 | time-driven | open |
Audio reads labels and the playhead, never raw scroll, so rigs M and P (A-2) need no audio change.

- **Look-ahead scheduler ("two clocks").**
  - **Timing.** A file-based Worker (`new Worker(new URL('./clockWorker.ts', import.meta.url), {type:'module'})`, CSP `worker-src 'self'`) posts a tick every 25 ms. The Worker only keeps time, so its ticks are not clamped like background timers.
  - **Scheduling runs on the main thread.** On each tick it schedules every event due before `currentTime` + look-ahead (**120 ms desktop, 200 ms mobile**) with sample-accurate `start(t)` / `setValueAtTime`.
  - **Effect of jank.** Once scheduled, an event plays on time. But a main-thread task longer than the look-ahead (scroll work, parsing, GC) delays the scheduling of the notes behind it.
  - **Late events.** A late event ≤ 50 ms late starts at once. A later rendered one-shot is skipped. A later sustained note starts at once with its attack. Every late event is counted in the QA log.
  - **Grid.** `barZero` is set at the hand-off (below), and bar k falls at `barZero` + k·3.333 s. The score is data (bars × voices × events), not timers.
- **Direction comes from `master.ts` (finding 22).**
  - GSAP fires `tl.call` in both directions, so `master.ts` derives `dir` from the playhead delta and passes it everywhere: `sfx(id, {direction: dir})`, `setPlayhead(units, dir)` (AU-1, one call per frame).
  - For cues `master.ts` also computes the target itself: `setCue(N, +1)` when `cue:sN` is crossed forward, `setCue(N−1, −1)` when it is crossed backward.
  - The director never infers direction and plays nothing for `direction: −1`.
- **Quantised cue changes.**
  - `setCue(N, dir)` sets `pending`, and the latest call wins. It applies at the first bar line ≥ now + look-ahead + 150 ms.
  - At that bar the incoming voices start on their own attacks. Outgoing sustained voices (pad, strings, choir, brass, sub) ramp to 0 over **1.5 s**, thinned to their centre oscillator (§6). Rendered voices (piano, pluck, mallet) ring out and are never cut, except by the voice stealer. The outgoing pulse simply stops (its last note was beat 4).
  - Air retunes (τ 0.8 s) and the ear filter glides (τ 1.0 s), so the texture stays continuous. The bar grid, reverb tails, air and ear-filter state never reset: **no restarts**.
- **Where a cue resumes.**
  - First forward entry: bar 1.
  - Any later entry: the cue's own bar cursor, at its next 4-bar group (5, 9, 13, then extensions). Returning to a scene continues its music.
  - Exceptions: s5 and s7 always start at bar 1 on forward entry, because the uplift and the cadence are the payoff (the clock still does not reset).
  - A reverse entry with no cursor (after a deep link) starts at bar 9.
- **Intensity.** x = (playhead − span start)/(span length) from `setPlayhead`, clamped to 0–1. Continuous parameters use `setTargetAtTime` (τ 0.3 s for filters, 0.6 s for levels). Discrete ones (pulse subdivision, a layer in or out, grain step) change on the next beat, with ±0.03 hysteresis at each threshold.
- **Reverse.**
  - `cue:sN` crossed backward arrives as `setCue(N−1, −1)` from `master.ts`. The earlier cue returns at its resume point on the next bar, with the 1.5 s crossfade.
  - x runs backward, so density unwinds the way it built (the S2 pulse thins again).
  - Backward across t45 50 %: the ear filter closes immediately, and s4 resumes, minor and muffled, on the next bar. The near-silence is not replayed in reverse.
  - **All SFX are silent in reverse**; only the bed plays (ANIMATION §5, CD §7).
  - A latch re-arms once the playhead is ≥ 8 units back before its label.
- **Fast scroll and jumps.**
  - Several labels inside one bar: only the last cue plays; the cues in between are skipped, never queued.
  - A jump of ≥ 2 cues (anchor, "Skip to the message", fling) lands on the next bar with a 0.8 s crossfade, marked by one soft piano landing chord (the cue's first chord, velocity 0.4).
  - A single frame that crosses > 60 units skips its SFX and keeps only the latest cue (ANIMATION §5).
  - Ear-filter state is a function of the playhead (open iff playhead ≥ t45 50 %), so it stays correct even when its label is skipped.
  - **Reload and hash restoration (TD10, `history.scrollRestoration='manual'`).** After the hand-off, `master.ts` seeks to the stored scene or hash, sends no `sfx()` calls during the seek, and sends one `setCue(target, +1)` in place of `setCue(1, +1)`. The score's first bar is then the restored scene's cue: no s1 bar is heard first.
- **Toggle truth (TD10, finding 18).**
  - **Effective preference (G-13, N1):** `pref = localStorage['ozone-sound'] ?? 'on'`. No stored key means the brief's default ON.
  - The toggle reads **ON iff `pref === 'on'` AND `ctx.state === 'running'` AND master gain > 0**. Any other state reads OFF at once (`statechange`).
  - The key is written only by a click on the toggle, ENTER, CONTINUE or Escape (TD5). Case b writes nothing.
- **Mute / unmute (toggle; AU-2).**
  - **Mute:** the preference becomes `off` and the toggle reads OFF at once. Then a master linear ramp to 0 over **0.4 s**, stop all sources, `suspend()`.
  - **Unmute, inside the toggle click:** unlock (below) → on `running`, re-anchor the grid → the current cue re-enters on the next bar at its resume point → master 0 → 1 over **0.4 s**. The piece does not restart.
- **Unlock (TD10, finding 19).**
  - The unlock is `resume()` plus a 1-frame silent buffer started synchronously in the same handler. It happens **only inside the ENTER WITH SOUND and toggle click handlers**: never on `pointerdown`, `touchstart`, scroll or keys.
  - `src/audio/unlock.ts` (tiny, in the initial bundle) owns the one AudioContext (N2) and exports two functions:
    - `getContext()`: get-or-create the singleton, without resuming it.
    - `unlock()`: get-or-create, then `resume()` and the 1-frame silent buffer, all synchronously; called only from the click handlers above.
  - D1's boot probe (cases b and c) is `getContext().resume()` once at boot. It is not an unlock and is never repeated.
  - `AudioDirector.prepare()` also calls `getContext()`, so it gets the same object. Production never has a second context.
- **Lifecycle listeners.** Registered in `cleanup.ts`: `visibilitychange`, `pagehide`, `pageshow`, AudioContext `statechange`.
  - **Hidden / `pagehide`:** master to 0 (0.4 s on hide, at once on `pagehide`) → stop sources → clear the queue → `suspend()`.
  - **Visible / `pageshow` (incl. bfcache), when `pref === 'on'` (G-13; this includes case b, where no key is stored):** one best-effort `resume()`. If it is not `running` within 1 s the toggle stays OFF, with no prompt, and the next toggle click unlocks. On `running`: re-anchor (`barZero` = now + 0.1 s), the current cue re-enters at its resume point, and the master rises 0 → 1 over 1.0 s. **This 1.0 s rise is the visibility fade, not a toggle ramp.** Cursors, motif history and ear-filter state are kept.
  - **`statechange`:** `interrupted` (Safari) counts as suspended. A return to `running` re-anchors as on visible.
- **Sound start: the four cases (G-1, G-3).**

| Case | Condition | What audio does | Toggle |
|---|---|---|---|
| a · first visit, autoplay blocked | no `ozone-sound` key (`pref` = `on`); the boot `resume()` is not `running` within 300 ms | The loader is silent and the prompt shows. **ENTER WITH SOUND** unlocks in its click and writes `on`, then the hand-off start. **CONTINUE WITHOUT SOUND** or **Escape** sets master gain to 0, calls `suspend()` and writes `off` (G-3), so a `resume()` that resolves late can neither sound nor read ON | OFF until the truth rule holds |
| b · first visit, autoplay allowed | no key (`pref` = `on`); the boot `resume()` reaches `running` | The loader is silent (master gain 0, no sources) and there is no prompt. **No key is written** (G-13). Hand-off start | appears at the hand-off, visible, focusable and ON, on the first audible frame |
| c · returning, `ozone-sound=on` | — | as (b) if the boot `resume()` runs, else as (a) | as (b) / (a) |
| d · returning, `ozone-sound=off` | — | No context, no probe, no prompt. `audio-engine`, `audio-ir` and `audio-buffers` are not loaded and are left out of the loader count (TD3). On the **first toggle ON** (`aria-busy`): `unlock()` creates and resumes the context inside the click, then the audio items load. The score enters at the current cue on the next bar once engine and IR are ready; buffer voices join when rendered | OFF, then ON by the truth rule |

**Hand-off start (cases a–c).**
- `loader:bloom` (§5) plays as the score's opening gesture (AU-4, moved here by G-1).
- `barZero` = bloom start + 0.4 s (its peak).
- `setCue(1, +1)`, or the restored scene (TD10).
- **Duration (G-11).** The hand-off lasts **1.65 s**, or **1.95 s** when the prompt shows (+0.3 s for the prompt un-ink, which comes first and is silent).
- At the hand-off's first frame after any un-ink, the bloom and a master fade 0 → 1 over 1.5 s start together, so the fade ends inside the hand-off.
- Scroll is already unlocked (A-3), and the toggle is visible from that same frame.
- **The loader never plays a sound.**
- After S7 the context stays running in silence (no sources, negligible CPU), so the toggle stays truthful.

- **Static comic / reduced motion (TD10, finding 26).**
  - An IntersectionObserver with `rootMargin: '-45% 0px -45% 0px', threshold: 0` reports the panels touching the viewport's central 10 % band, so even panels taller than the viewport fire.
  - That band (57–90 px) is wider than the gutter, so two panels can touch it at once (N11). **The panel covering the centre line (`innerHeight / 2`) wins.**
  - Ties (an edge exactly on the line) go to the panel further in the scroll direction. If the line sits in a gutter, the current panel stays.
  - On a change it calls `setCue(panel, dir)`, with a 1.5 s crossfade. x is fixed at 0.5, the ear filter is open iff the panel ≥ 5, and there are no SFX.

## 5 · SFX: every label → sound
Classes: **accent** (short; obeys the global rule of ≤ 1 accent per 400 ms, and a later accent is dropped, not delayed) · **featured** (wins over the global rule; the earlier accent fades in 50 ms) · **series** (members after the first are exempt from the global rule) · **swell** (exempt from it) · **footstep** (has its own channel). All SFX are forward-only and silent in reverse. Levels are peak dBFS, post-master.

| Label | Trigger | Recipe | Class · cooldown | Peak |
|---|---|---|---|---|
| `sfx:footstep` | contact frames 0 and 4 (t12 15–80 %, t45 55–100 %, t56 0–55 %, t67 40–100 %) | heel: sine 95 → 55 Hz exponential over 40 ms, decay 70 ms, + noise BP 1.6 kHz Q 1.2, 30 ms · toe 24 ms later at −6 dB, BP 2.4 kHz · rubber sole LPF 6 kHz · random BP ±15 %, gain ±2 dB, pan ±0.08 around the teen's screen x. Variant chosen from the playhead: t12 street · t45 avenue, hall +6 dB · t56 through glass after 40 % (LPF 1.2 kHz, room IR) · t67 inside a panel (LPF 2.5 kHz) | footstep · 180 ms | −24 · −26 · −25 → −32 · −34 |
| `sfx:t12:flick1` | t12 92 % | paper flick: white noise → HPF 2.5 kHz → BP sweep 3 → 6 kHz in 25 ms (Q 2) · AD 2 / 45 ms · 35 Hz flutter AM over 30 ms (50 %) · pan +0.45 | accent | −28 |
| `sfx:t23:flick1..4` | t23 32 / 42 / 52 / 62 % | same flick, each +1 dB and 8 % brighter, plus a fast LPF sweep 8 → 2 kHz over 120 ms as the balloon passes the lens · pans +0.5 / −0.3 / +0.6 / −0.6 | series · 140 ms | −28 → −25 |
| `sfx:t23:car-swell` | t23 45 % | car approaching from behind-left, no engine caricature: brown + pink noise (−6 dB) → LPF 300 Hz → 2.2 kHz (exponential, 3.2 s) · tyre hiss BP 4 kHz (−14 dB) over the last 1.2 s · 45 Hz sine rumble −18 dB · peak at 3.0 s, then a 1.5 s fade handed over to beam-air · pan −0.6 → −0.1 | swell · 6 s | −24 |
| `sfx:t23:tally1` | t23 92 % | pencil tally: 3 strokes of 70 ms (40 ms gaps), noise → BP 3.2 kHz Q 3 + HPF 1.5 kHz, friction AM random 80–160 Hz · pan +0.35 · dry | accent · 400 ms | −32 |
| `sfx:t34:beam-air` | t34 35 % | the passing headlight: pink noise → BP 600 Hz → 3 kHz (Q 0.9) over 2 s · attack 1.6 s, release 2.4 s · pan −0.7 → +0.5, following the beam · resonant BP on A4/A5 (Q 6) at −12 dB beneath, so the air sits in the key | swell · 5 s | −24 |
| `sfx:t34:hatch1` | t34 78 % | dry pencil hatching: 8 strokes of 45 ms, spacing 60 → 45 ms (accelerating), BP 2.6 kHz Q 2.5, stroke gain ±3 dB, dry · **also arms the S4 warning accent** (§2) | accent · 2 s | −32 |
| `sfx:t45:eraser-rub` | t45 36 % | rubber on paper: 5 strokes of 180 ms (40 ms gaps), noise → LPF 1.4 kHz → BP Q 1.5 moving 600 Hz (pull) ↔ 900 Hz (push) · grit: sparse impulses 60/s → HPF 5 kHz at −18 dB · stereo spread 0 → 1 over 1.1 s as the eraser front grows from the palm · **starts the near-silence** on the next beat | featured · 3 s | −20 |
| `sfx:t45:crumbs` | t45 45 % | 12 crumbs, one per grey speck: 3–6 ms clicks, BP 4–7 kHz random, spread over 600 ms with falling density, pans random ±0.7, −6…−14 dB within the group | accent · 2 s | −34 |
| `cue:t45:lowpass-open` | t45 50 % (headphones `set`) | music ear filter 1.6 → 20 kHz over 0.9 s, width 0.6 → 1.0, low shelf −2 → +2 dB; immediate | — · reverse closes it over 1.2 s | — |
| `sfx:t45:pluck1..5` | t45 68 / 74 / 80 / 86 / 92 % | the streetlights arrive: plucked-string voice on **C5 D5 F5 G5 C6** (F-major pentatonic, rising toward the horizon), fired on the label, not quantised (decision AU-3: the light is scroll-bound and cannot wait up to 208 ms) · each one farther away: −1 dB, +2 dB hall send · pans +0.10 / +0.15 / +0.20 / +0.22 / +0.25 (toward the vanishing point) | series · 120 ms; extras inside the cooldown dropped | −20 → −24 |
| `sfx:t56:card-tap` | t56 90 % | the card meets the counter: 2 ms noise click → BP 1.1 kHz Q 4 (plastic) + 320 Hz sine knock, 25 ms decay, −10 dB (wood) · room IR −14 · music ducks −3 dB for 600 ms. Nothing electronic | featured · 2 s | −24 |
| `sfx:t67:rule-pen1..6` | t67 44 / 50 / 56 / 62 / 68 / 74 % | ruled pen stroke: noise → BP 4.5 kHz Q 1.8 gliding to 5 kHz · A 10 / sustain 160 / R 60 ms · pan = panel centre x × 0.6, reading order · each −0.5 dB | series · 120 ms | −30 |
| `sfx:t67:paper-settle` | t67 98 % | one page settling: noise → LPF 900 Hz, A 15 / D 350 ms · flutter AM 22 Hz decaying over 200 ms · 120 Hz sine thump at −18 dB | accent · 3 s | −24 |
| `cue:s2` … `cue:s7` | t12…t67 at 50 % | music cue changes, §4 | quantised to the bar | — |

Label notes (AU-4, AU-5, G-1; nothing renamed):
- `sfx:footstep` keeps its single id.
- There is no `cue:s1`.
- Headline ink reveals and any "page turn" have no labels and no sound.

**`loader:bloom`** is an internal AudioDirector event. It fires at the hand-off as the score's opening gesture, and the loader itself never sounds. Recipe: pink noise → BP 400 Hz Q 1.2, plus resonant BPs on D4/A4 (Q 8, −6 dB) so the ink settles into the key · attack 400 ms, release 1200 ms · peak −32 dBFS · once per page load, at the first audible start (any G-1 case, including the first toggle ON in case d).

## 6 · Mobile constraints, budgets and offline-render plan
- **Profile.** The mobile profile applies when `(pointer:coarse)`, `hardwareConcurrency ≤ 4` or `html[data-art=lite]`.
- **Caps** (mirrored in TECH §8):
  - **Source nodes** (OscillatorNode + AudioBufferSourceNode, LFOs and SFX included): ≤ 140 desktop / ≤ 70 mobile.
  - **Sounding notes:** ≤ 48 / ≤ 36. This is the voice stealer's threshold.
- **Mobile reductions.** 2 saws per string note · 2 oscillators per pad note · 1 saw per choir note, with one shared vibrato LFO · brass without its square · 1 pluck copy · ≤ 8 ringing piano notes · 2 grains · 2 murmur talkers · no pad chorus · one ConvolverNode (hall).
- **Crossfade tails.** At the start of an outgoing crossfade each outgoing live note keeps only its centre oscillator: the detuned partners fade over 80 ms and stop, and per-note LFOs stop.
- **Voice stealing.** Released notes first (oldest), then the lowest velocity of the same instrument; rendered tails are cut with a 120 ms release. The motif voice is never stolen.
- **Worst-case source nodes per cue (finding 21).**
  - These are counted from §2–§3 with the reductions and tail rule above. They are design counts, checked by the render node log (below).
  - "Into this cue" = the incoming cue's first bar plus the outgoing tail during the 1.5 s crossfade (0.8 s for jumps).

| Cue | Peak bars | Peak desktop / mobile | Into this cue: incoming + tail = total, desktop · mobile |
|---|---|---|---|
| s1 | b2–3 | 46 / 31 | hand-off: 31 + bloom 1 = 32 · 22 + 1 = 23 |
| s2 | b9–16 (x > 0.66) | 59 / 40 | 38 + 18 = 56 · 26 + 16 = 42 |
| s3 | b1–4 | 27 / 20 | 24 + 27 = 51 · 17 + 21 = 38 |
| s4 | b9–16 + warning accent | 54 / 38 | 43 + 7 = 50 · 30 + 7 = 37 |
| s5 | b6–7 | 93 / 59 | after the near-silence 63 + 2 = 65 · 39 + 2 = 41; **fling skipping it 63 + 19 = 82 · 39 + 15 = 54** |
| s6 | b4–5 | 41 / 30 | 30 + 35 = 65 · 23 + 29 = 52 |
| s7 | b7–8 | 95 / 61 | 56 + 27 = 83 · 33 + 17 = 50 |
| jumps | s5 b6 → s7 · s2 dense → s5 | — | 56 + 35 = 91 · 33 + 29 = 62 · 63 + 27 = 90 · 39 + 21 = 60 |

- **Sample rate is never forced.**
  - Everything follows `ctx.sampleRate` (44.1 or 48 kHz). Piano and mallet buffers are rendered at `ctx.sampleRate / 2`; the rest at the full rate.
  - Filter frequencies are clamped to 0.45·sr.
  - `latencyHint` is `interactive` on desktop and `balanced` on mobile.
- **Budgets (TD10, the same rows as TECH §8).**
  - **Buffer memory ≤ 17 MB desktop / ≤ 12 MB mobile** (Float32 at 48 kHz). Desktop ≈ 14.4 MB: piano 13 × 3.5 s at half rate 4.4 MB, pluck 10 × 2.5 s 4.8 MB, mallet 9 × 2 s at half rate 1.7 MB, noise 2.1 MB, IRs 1.4 MB. Mobile ≈ 11.2 MB: piano 2.5 s without the unison doubling 3.1 MB, pluck 1.8 s 3.5 MB, mallet 1.5 s 1.3 MB, noise 2.1 MB, hall IR 1.2 MB.
  - **Render time ≤ 400 ms** from Worker start to the last buffer, in the lab, mobile profile. Desktop work is ≈ 17.5 M multiply-adds for the piano.
  - **Throttling and the Worker (G-17).** The tech lead measured, under CDP `Emulation.setCPUThrottlingRate` 4 in Chromium 153: main thread ×4 (≈ 48 → 195 ms), dedicated Worker ×1 (≈ 47 → 48 ms). The Worker is not throttled.
  - The budget is therefore judged on **`max(measured, measured_unthrottled × 4)`, labelled "estimated"**.
  - Each run also runs a calibration loop (the same busy loop) in the Worker and on the main thread, and records their ratio next to the result.
  - The main-thread copy and graph-build chunks are still measured throttled, ≤ 16 ms each.
  - **No long task from audio.** No `longtask` or LoAF entry is attributable to audio scripts. Main-thread copy and graph-build chunks are each ≤ 16 ms.
  - **`AudioContext.renderCapacity` ≤ 25 %** (Chromium, where available) at the densest bars (S5 b6–7, S7 b7–8) and during the S4→S5 and S6→S7 crossfades.
  - **Node caps** as above.
- **iOS and activation (TD10, finding 19).**
  - The unlock happens only in the ENTER and toggle click handlers (§4). Nothing unlocks on `pointerdown` or touch.
  - The lifecycle listeners `visibilitychange`, `pagehide`, `pageshow` and `statechange` are registered in `cleanup.ts`.
  - `navigator.audioSession.type = 'ambient'` is set where supported; never `playback`.
  - **Known limit, NOT TESTED:** with the hardware silent switch on, iOS mutes Web Audio while the context still reports `running`, so the toggle can read ON while nothing is heard. No API reports the switch. Real iOS and Android devices are NOT TESTED (brief).
- **Offline renders** (finding 15: evidence goes under `showcase/ozone/reports/audio/`).
  - The graph builder takes a `BaseAudioContext`. A dev-only `?audio-qa` page renders the same code in `OfflineAudioContext(2, len, 48000)`; it is not shipped, so production keeps one AudioContext.
  - Playwright Chromium writes 24-bit WAV, JSON metrics and a per-render node-count log to `showcase/ozone/reports/audio/`.
  - (1) Each cue alone: 16 bars + 5 s tail (s7: 12 + 8 s) at x = 0, 0.5 and 1.
  - (2) Forward run-throughs with a scripted playhead at 8 units/s (≈ 151 s) and 20 units/s, firing every label, SFX included.
  - (3) A reverse run-through at 15 units/s.
  - (4) A fast-scroll script: 0 → 455 → 1135 → 300 within 4 s, plus "Skip to the message".
  - (5) Each SFX alone and over its scene bed, plus the t45 chain as one file.
  - (6) Mute, unmute, hidden and visible simulated with the same ramps and re-anchoring (suspend cannot be rendered offline).
  - (7) **At the mobile profile:** S4→S5 both normally and as a fling that skips the near-silence, S6→S7, and the s5 → s7 jump. The node log must stay ≤ 70.
- **Objective checks.** The script fails on any of:
  - NaN or Inf
  - sample peak > −1.0 dBFS or true peak (4× oversampled) > −0.5 dBTP
  - |DC mean| > 1e−4 per channel per 1 s window
  - cue RMS outside the §2 range (3 s windows, ±2 dB)
  - run-through (2) at 20 units/s not at −20 ±2 LUFS integrated (BS.1770-4, gated), or short-term > −14 LUFS
  - a click: |Δsample| > 0.25 while local RMS < −40 dBFS
  - unplanned silence > 1.5 s (outside the near-silence and the post-S7 rest)
  - a spectral line ≥ 18 dB above its ±⅓-octave neighbourhood for > 2 s that is not a note of the current chord (catches beeps, stuck oscillators and hum)
  - source nodes above the profile cap
  - two renders with the same seed that are not bit-identical
  - L/R correlation ≤ 0 in any 3 s window (mono and phone safety)
- **Live checks** (Playwright, evidence under `showcase/ozone/reports/audio/`):
  - each G-1 case a–d, including that the toggle is visible and ON on the first audible frame of case b;
  - **blocked → CONTINUE → after 2 s the toggle is still OFF and `state !== 'running'`** (finding 18);
  - Escape behaves like CONTINUE;
  - the mute and unmute ramps are each 0.4 s (± 1 render quantum);
  - Worker render time against its budget;
  - no long task from audio;
  - `renderCapacity` against its budget;
  - exactly one AudioContext (an instrumented constructor count).

## 7 · Acceptance criteria (listening to the renders, on headphones and a phone speaker)
1. It sounds composed and cinematic: voice-led chords, phrased melody, real dynamics. No bar sounds like a test tone, UI sound or bare drone, and no two identical 4-bar groups play back to back.
2. The motif is recognisable within S1's first 3 bars, then heard bent (F♮, cut short) in S2, stopping on E in S3, absent in S4, completed in F in S5, in the bass in S6, and full and harmonised in S7.
3. The run-through is one piece: no restart, every cue change lands on a bar line, and no change has a gap or a > 3 dB loudness bump that the score doesn't call for.
4. S1–S4 sound "outside the headphones" yet clear. At lowpass-open the bandwidth, width and low end open within about 1 s, and S5 is plainly fuller.
5. T4: the eraser is alone, then at least 1 bar of near-silence on the slow render, the held A carries into the S5 uplift, and the plucks land with the lights and in key.
6. S4 is grave, not horror: no stinger, nothing heartbeat-like, and the warning accent is one soft swell. The S2 pulse quickens only by subdivision, and the murmur has no words, vowels or laughter.
7. S6 is steady and grounded; the room tone is felt more than heard; the card tap is one physical tap; nothing beeps.
8. SFX never stack (≤ 1 accent per 400 ms), sit under the music except the featured eraser and card tap, and are absent from the reverse render.
9. The fast-scroll render skips cues cleanly, with no pile-up. The mute/unmute render resumes the current cue, not the opening.
10. S7 ends at rest: plagal cadence, held chord, silence. No fade-loop.
11. Every §6 objective check passes on every render. The bass line stays audible on a phone speaker (2f₀).

## 8 · Open questions and label flags
**Resolved; the text above already applies these:**
- AU-1 `setPlayhead`.
- AU-2 0.4 s toggle ramps.
- AU-3 plucks fire on their label.
- AU-4 with G-1: `loader:bloom` at the hand-off, never in the loader.
- AU-5: `sfx:footstep` keeps one id, there is no `cue:s1`, and the near-silence stays on `sfx:t45:eraser-rub`.
- TD3 loader items.
- TD10: render Worker, one AudioContext, unlock, toggle truth, static observer, restoration.
- Gate A round 2: G-13 effective `pref` (N1), `getContext()` / `unlock()` (N2), centre-line winner (N11), hand-off 1.65 s (G-11), Worker ×4 estimate (G-17).
- Gate A findings 3, 4, 13, 15, 17–22 and 26.

**Still open:**
1. G-1 and G-3 are orchestrator defaults pending client confirmation: no prompt when autoplay is allowed, and a persistent "without sound".
2. Headline ink reveals and any "page turn" get no sound by design (no labels exist). `sfx:tNM:ink-l1` is added only if the creative director asks.
3. Settled by G-17: the Worker is measured unthrottled and judged on the ×4 estimate (§6). Sending the throttle command to the Worker's own CDP target was NOT TESTED (tech lead) and is not relied on.
4. iOS Safari and Android Chrome are NOT TESTED, including the iOS silent-switch limit (§6).
5. Final approval of the music rests with the client (Gate A client decision 14).

## 9 · The musical idea in plain words
One unbroken piece walks home with the teen. A gentle four-note tune, step–stride–step–arrive, is theirs from the first bar. As the pressure builds, the music narrows: the tune's last note goes sour, then breaks off, then disappears, and the sound itself gets duller, as if heard through the headphones hanging around their neck. When they say no, an eraser rubs the red away into near-silence. Only one note is left hanging. They put the headphones on, the sound opens to full width, and that same note becomes the first chord of a brighter key, where the tune finally finishes. It stays steady past OZONE's counter, then comes home to the key it started in, sung in full by everything at once, and settles into silence.
