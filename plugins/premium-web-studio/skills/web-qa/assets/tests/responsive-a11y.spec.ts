import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open, VIEWPORTS, watchConsole } from './helpers';

test.describe('responsive matrix', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.width}px: no horizontal overflow, nav pattern, type scale, full-page capture`, async ({ page }, info) => {
      const c = watchConsole(page);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await open(page);
      // scroll through so once-reveals complete, then back to top
      await page.evaluate(async () => {
        const l = (window as any).__lenis;
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { l.scrollTo(y, { immediate: true }); await new Promise((r) => setTimeout(r, 120)); }
        l.scrollTo(0, { immediate: true });
      });
      await page.waitForTimeout(1600);
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const offenders = [...document.querySelectorAll('main *, header *, footer *')]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !el.closest('.visually-hidden, .skip, .skip-link, .route-veil, svg'); })
          .slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${(el.className as any)?.toString?.().split(' ')[0]}`);
        const h1 = document.querySelector('h1')!;
        return {
          scrollWidth: doc.scrollWidth, innerWidth,
          offenders,
          h1Size: parseFloat(getComputedStyle(h1).fontSize),
          h1Right: h1.getBoundingClientRect().right,
          bodySize: parseFloat(getComputedStyle(document.querySelector('.hero__sub')!).fontSize),
          minTarget: Math.min(...[...document.querySelectorAll('header a, header button, .chip, .cta')]
            .filter((e) => { const r = e.getBoundingClientRect(); return (e as HTMLElement).offsetParent && r.bottom > 0 && !e.matches('.skip-link'); })
            .map((e) => e.getBoundingClientRect().height)),
        };
      });
      info.annotations.push({ type: 'metrics', description: JSON.stringify(m) });
      expect(m.scrollWidth, `overflow offenders: ${m.offenders.join(', ')}`).toBeLessThanOrEqual(vp.width);
      expect(m.h1Right).toBeLessThanOrEqual(vp.width);
      expect(m.bodySize).toBeGreaterThanOrEqual(16);
      expect(m.minTarget).toBeGreaterThanOrEqual(44);
      if (vp.width < 1024) await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
      else await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      await page.screenshot({ path: `test-results/responsive/${vp.width}-00-top.png` });
      // Full-page stitching is invalid with pinned sections + smooth scroll, so capture each section
      // as the user sees it: scrolled to the section top (Method mid-pin) one viewport at a time.
      const stops: [string, number][] = [['manifesto', 0], ['method', 0.55], ['the-hour', 0], ['work', 0], ['sched', 0], ['atelier', 0], ['contact', 0]];
      for (const [i, [id, pinFrac]] of stops.entries()) {
        await page.evaluate(([sel, frac]) => {
          const el = (document.getElementById(sel as string) || document.querySelector(`.${sel}`)) as HTMLElement;
          const top = el.getBoundingClientRect().top + scrollY + (frac as number) * innerHeight * 3;
          (window as any).__lenis.scrollTo(top - 64, { immediate: true });
        }, [id, pinFrac]);
        await page.waitForTimeout(1400);
        await page.screenshot({ path: `test-results/responsive/${vp.width}-0${i + 1}-${id}.png` });
      }
      c.assertClean();
    });
  }
});

test.describe('accessibility', () => {
  test.use({ reducedMotion: 'reduce' }); // final visual state for contrast checks
  for (const path of ['/', '/work/capela-do-silencio']) {
    test(`axe: no serious/critical violations on ${path}`, async ({ page }) => {
      await open(page, path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      test.info().annotations.push({ type: 'axe', description: JSON.stringify(results.violations.map((v) => `${v.impact} ${v.id} ×${v.nodes.length}`)) });
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }

  test('keyboard: skip link first, then logo, then primary nav; focus is visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe('none');
    const order: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      order.push(await page.evaluate(() => (document.activeElement?.textContent || '').trim().slice(0, 20)));
    }
    test.info().annotations.push({ type: 'tab-order', description: JSON.stringify(order) });
    expect(order).toEqual(['PENUMBRA', 'Method', 'The Hour', 'Work', 'Contact', 'Start a project']);
    // skip link works: Enter moves focus into main
    await page.reload(); await page.waitForTimeout(500);
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('resilience', () => {
  test('fonts and images blocked: content still renders and is readable', async ({ page }) => {
    const c = watchConsole(page);
    await page.route(/\.(woff2|avif|webp|png)$/, (r) => r.abort());
    await page.goto('/?debug');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveAccessibleName('We design the dark first.');
    // only the expected failed-resource console errors are allowed
    expect(c.errors.filter((e) => !/Failed to load resource/.test(e))).toEqual([]);
  });

  test('no WebGL2: canvases are skipped, poster + The Hour fallback render, readout still works', async ({ page }) => {
    const c = watchConsole(page);
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      // @ts-expect-error test override
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) { return type === 'webgl2' ? null : orig.call(this, type as any, ...(rest as [])); };
    });
    await open(page);
    await page.waitForTimeout(800);
    expect((await page.evaluate(() => (window as any).__gsapStats())).lightRenderers).toBe(0);
    await expect(page.locator('.hour__fallback')).toHaveAttribute('data-active', 'true');
    await page.locator('#the-hour').getByRole('button', { name: '21:00' }).click();
    await expect(page.locator('.hour__time')).toHaveText('21:00', { timeout: 4000 });
    c.assertClean();
  });
});
