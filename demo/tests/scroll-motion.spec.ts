import { test, expect } from '@playwright/test';
import { open, settle, stats, wheelTo, watchConsole } from './helpers';

test.describe('Lenis + GSAP integration', () => {
  test('one wheel gesture is smoothed (interpolated), not instant', async ({ page }) => {
    await open(page);
    // sample in-page with timestamps (Playwright-side waits stretch under CPU load)
    await page.evaluate(() => {
      const w = window as any; w.__samples = []; const t0 = performance.now();
      const loop = () => { w.__samples.push([performance.now() - t0, scrollY]); if (performance.now() - t0 < 1500) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1700);
    const samples: [number, number][] = await page.evaluate(() => (window as any).__samples);
    const final = samples.at(-1)![1];
    const moving = samples.filter(([, y]) => y > 0 && y < final - 1);   // frames caught mid-glide
    test.info().annotations.push({ type: 'scroll-samples', description: JSON.stringify({ final, frames: samples.length, midGlideFrames: moving.length, first: samples.slice(0, 12).map(([t, y]) => `${t.toFixed(0)}ms:${y}`) }) });
    expect(final).toBeGreaterThan(400);
    expect(moving.length).toBeGreaterThanOrEqual(3);                     // interpolated over several frames → smoothed
    const ys = samples.map(([, y]) => y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));                   // monotonic, no jitter
    await expect(page.locator('html')).toHaveClass(/lenis/);
  });

  test('exactly one Lenis instance and it drives ScrollTrigger during the glide', async ({ page }) => {
    await open(page);
    const lenisCount = await page.evaluate(() => document.querySelectorAll('html.lenis').length);
    expect(lenisCount).toBe(1);
    // Method pin trigger progress must update WHILE Lenis animates, not only at the end
    const methodTop = await page.locator('#method').evaluate((el) => el.getBoundingClientRect().top + scrollY);
    // sample the pinned trigger's progress on EVERY frame, in-page (Playwright-side polling misses frames under load)
    const progress: number[] = await page.evaluate(async (y) => {
      const st = (window as any).__ScrollTrigger.getAll().find((t: any) => t.pin);
      if (!st) return [-1];
      const out: number[] = [];
      (window as any).__lenis.scrollTo(y + 900, { duration: 1.6 });
      const t0 = performance.now();
      await new Promise<void>((done) => {
        const loop = () => { out.push(Math.round(st.progress * 1000) / 1000); performance.now() - t0 < 2000 ? requestAnimationFrame(loop) : done(); };
        requestAnimationFrame(loop);
      });
      return out;
    }, methodTop);
    test.info().annotations.push({ type: 'pin-progress', description: JSON.stringify({ frames: progress.length, distinct: new Set(progress).size, sample: progress.filter((_, k) => k % 6 === 0) }) });
    expect(progress[0]).toBeGreaterThanOrEqual(0);
    expect(new Set(progress).size).toBeGreaterThan(3); // many intermediate values = synced per frame
  });

  test('anchor navigation applies header offset and moves focus', async ({ page }) => {
    await open(page);
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'The Hour' }).click();
    await settle(page);
    const top = await page.locator('#the-hour').evaluate((el) => el.getBoundingClientRect().top);
    const header = await page.locator('.site-header').evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(top - header)).toBeLessThanOrEqual(3);
    await expect(page.locator('#the-hour')).toBeFocused();
    await expect(page).toHaveURL(/#the-hour$/);
  });

  test('pinned Method sequence: beams appear and step text swaps as scroll progresses', async ({ page }) => {
    await open(page);
    const method = page.locator('[data-method]');
    const start = await method.evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const vh = 900;
    const at = async (units: number) => {
      await page.evaluate((y) => (window as any).__lenis.scrollTo(y, { immediate: true }), start + (units / 12) * 3 * vh);
      await page.waitForTimeout(1200); // scrub 0.8s catch-up
      return page.evaluate(() => ({
        beams: [...document.querySelectorAll('[data-method] [data-beam]')].map((b) => Math.round(parseFloat(getComputedStyle(b).opacity) * 100) / 100),
        active: [...document.querySelectorAll('[data-method] [data-step]')].findIndex((s) => s.getAttribute('aria-hidden') === 'false'),
        closing: parseFloat(getComputedStyle(document.querySelector('[data-closing]')!).opacity),
        pinned: getComputedStyle(document.querySelector('.method__pin')!).position,
      }));
    };
    const s1 = await at(2);
    expect(s1.active).toBe(0);
    expect(s1.beams.every((o) => o === 0)).toBe(true);
    expect(s1.pinned).toBe('fixed');
    const s2 = await at(7.6);
    expect(s2.active).toBe(1);
    expect(s2.beams.filter((o) => o > 0.9).length).toBeGreaterThanOrEqual(2);
    const s3 = await at(11.8);
    expect(s3.active).toBe(2);
    expect(s3.closing).toBeGreaterThan(0.9);
    test.info().annotations.push({ type: 'method-states', description: JSON.stringify({ s1, s2, s3 }) });
  });

  test('hero headline is split into words and all words end fully lit', async ({ page }) => {
    await open(page);
    await page.waitForTimeout(2200);
    const words = page.locator('.hero__title .w');
    await expect(words).toHaveCount(5);
    const ops = await words.evaluateAll((ws) => ws.map((w) => getComputedStyle(w).opacity));
    expect(ops.every((o) => o === '1')).toBe(true);
    await expect(page.locator('.hero__title')).toHaveAccessibleName('We design the dark first.');
  });
});

test.describe('lifecycle & cleanup across routes', () => {
  test('ScrollTriggers, tweens and WebGL contexts return to baseline after Home → Detail → Home (×3)', async ({ page }) => {
    const c = watchConsole(page);
    await open(page);
    await wheelTo(page, 1200); // let some triggers fire
    await page.waitForTimeout(1500);
    const home = await stats(page);
    expect(home.lightRenderers).toBe(2);   // hero + The Hour
    const history: unknown[] = [home];
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => (window as any).__lenis.scrollTo('#work', { immediate: true }));
      await page.waitForTimeout(400);
      await page.locator('.room__plate').nth(i).click();
      await expect(page.locator('main h1')).toBeFocused({ timeout: 5000 });
      const detail = await stats(page);
      expect(detail.lightRenderers).toBe(0);
      expect(detail.scrollTriggers).toBeLessThanOrEqual(3);
      history.push(detail);
      await page.goBack();
      await expect(page.locator('.hero__title')).toBeVisible();
      await page.waitForTimeout(1500);
      const back = await stats(page);
      history.push(back);
      expect(back.lightRenderers).toBe(2);
      expect(back.scrollTriggers).toBeLessThanOrEqual(home.scrollTriggers + 8); // once-triggers re-created, never accumulating
    }
    const homes = history.filter((_, i) => i % 2 === 0) as { scrollTriggers: number }[];
    // no growth across cycles: last home visit has no more triggers than the second one
    expect(homes.at(-1)!.scrollTriggers).toBeLessThanOrEqual(homes[1].scrollTriggers);
    test.info().annotations.push({ type: 'stats', description: JSON.stringify(history) });
    await expect(page.locator('html.lenis')).toHaveCount(1);
    c.assertClean();
  });

  test('strict leak check: Link round trips at the top keep EXACT trigger, renderer and DOM counts (×5)', async ({ page }) => {
    // goBack() restores a scroll position where once-only triggers have already fired and been removed, so the
    // test above can only bound growth. Navigating via Links at y=0 recreates the identical page each time.
    const c = watchConsole(page);
    await open(page);
    await page.waitForTimeout(1200);
    const counts = async () => ({ ...(await stats(page)), nodes: await page.evaluate(() => document.querySelectorAll('*').length) });
    const first = await counts();
    expect(first.lightRenderers).toBe(2);
    const seen = [first];
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => (document.querySelector('.room__plate') as HTMLElement).click()); // no scroll-into-view
      await expect(page.locator('main h1')).toHaveAccessibleName('Capela do Silêncio', { timeout: 15000 });
      await page.locator('.wordmark').click();
      await expect(page.locator('main h1#hero-title')).toBeFocused({ timeout: 15000 });
      await page.waitForTimeout(1200);
      seen.push(await counts());
    }
    test.info().annotations.push({ type: 'round-trips', description: JSON.stringify(seen) });
    for (const s of seen) {
      expect(s.scrollTriggers).toBe(first.scrollTriggers);
      expect(s.lightRenderers).toBe(2);
      expect(s.nodes).toBe(first.nodes);
    }
    c.assertClean();
  });

  test('back/forward restores scroll position', async ({ page }) => {
    await open(page);
    await page.evaluate(() => (window as any).__lenis.scrollTo('#work', { immediate: true }));
    await page.waitForTimeout(300);
    const y = await page.evaluate(() => scrollY);
    expect(y).toBeGreaterThan(1000);
    // Playwright's click() scrolls the target into view first, so the position the app saves is the
    // one at click time; read it back from history.state rather than assuming `y`.
    await page.locator('.room__plate').first().click();
    await expect(page.locator('main h1')).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBeLessThan(5);
    await page.goBack();
    await page.waitForTimeout(1500);
    const { saved, now } = await page.evaluate(() => ({ saved: history.state?.y as number, now: scrollY }));
    test.info().annotations.push({ type: 'restore', description: JSON.stringify({ before: y, saved, now }) });
    expect(Math.abs(saved - y)).toBeLessThan(400);   // saved where the user actually was
    expect(Math.abs(now - saved)).toBeLessThanOrEqual(2);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('no smoothing, no pin, static method steps, everything visible', async ({ page }) => {
    const c = watchConsole(page);
    await open(page);
    // reduced motion = NO interpolation: the wheel jump lands in a single frame (sampled in-page with
    // timestamps; a fixed Playwright-side wait is unreliable when frames are slow under CPU load)
    await page.evaluate(() => {
      const w = window as any; w.__s = []; const t0 = performance.now();
      const loop = () => { w.__s.push(scrollY); if (performance.now() - t0 < 1500) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1700);
    const ys: number[] = await page.evaluate(() => (window as any).__s);
    const final = ys.at(-1)!;
    const intermediate = ys.filter((y) => y > 0 && y < final);
    test.info().annotations.push({ type: 'reduced-scroll', description: JSON.stringify({ final, frames: ys.length, intermediate }) });
    expect(final).toBeGreaterThanOrEqual(550);
    expect(intermediate.length).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => (window as any).__lenis.prefersReducedMotion)).toBe(true);
    // method renders three static articles and no pin
    await expect(page.locator('.method--static .method__static-step')).toHaveCount(3);
    await expect(page.locator('.method__pin')).toHaveCount(0);
    const s = await stats(page);
    expect(s.scrollTriggers).toBe(0);
    // headline not split, fully visible
    await expect(page.locator('.hero__title .w')).toHaveCount(0);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => {
      const cs = getComputedStyle(el);
      return (cs.opacity === '0' || cs.visibility === 'hidden') && (el.textContent || '').trim().length > 0 && !el.closest('.visually-hidden, .hour__fallback, [hidden]');
    }).length);
    expect(hidden).toBe(0);
    c.assertClean();
  });
});
