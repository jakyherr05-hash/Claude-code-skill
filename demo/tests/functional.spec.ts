import { test, expect } from '@playwright/test';
import { open, watchConsole } from './helpers';

test.describe('rendering & navigation', () => {
  test('home renders every section with correct landmarks and no console errors', async ({ page }) => {
    const c = watchConsole(page);
    await open(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveAccessibleName('We design the dark first.');
    for (const sel of ['header', 'main', 'footer', '#method', '#the-hour', '#work', '#contact']) {
      await expect(page.locator(sel).first(), sel).toBeAttached();
    }
    await expect(page.locator('.sched__row')).toHaveCount(10);
    c.assertClean();
  });

  test('every internal link and media URL resolves', async ({ page, request }) => {
    await open(page);
    const urls = await page.evaluate(() => {
      const out = new Set<string>();
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
        const u = new URL(a.href);
        if (u.origin === location.origin) out.add(u.pathname);
      });
      document.querySelectorAll<HTMLSourceElement | HTMLImageElement>('source[srcset], img[srcset], img[src]').forEach((el) => {
        const set = (el.getAttribute('srcset') || el.getAttribute('src') || '');
        set.split(',').map((s) => s.trim().split(' ')[0]).filter(Boolean).forEach((s) => out.add(new URL(s, location.href).pathname));
      });
      return [...out];
    });
    expect(urls.length).toBeGreaterThan(20);
    const bad: string[] = [];
    for (const u of urls) { const r = await request.get(u); if (r.status() !== 200) bad.push(`${r.status()} ${u}`); }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  test('project route renders, has its own h1, prev/next and back to home', async ({ page }) => {
    const c = watchConsole(page);
    await open(page);
    await page.locator('.room__plate').first().click();
    await expect(page).toHaveURL(/\/work\/capela-do-silencio$/);
    await expect(page.locator('main h1')).toHaveAccessibleName('Capela do Silêncio');
    await expect(page.locator('main h1')).toBeFocused();
    await page.getByRole('link', { name: /Museu das Marés/ }).click();
    await expect(page).toHaveURL(/museu-das-mares/);
    await page.goBack();
    await expect(page).toHaveURL(/capela-do-silencio/);
    c.assertClean();
  });

  test('deep link to a project and unknown route work (SPA fallback)', async ({ page }) => {
    await open(page, '/work/hotel-alva');
    await expect(page.locator('main h1')).toHaveAccessibleName('Hotel Alva');
    await open(page, '/does-not-exist');
    await expect(page.locator('main h1')).toHaveText('This room is dark.');
  });

  test('section nav from the project page lands on the home section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, '/work/casa-sombra');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.locator('#contact')).toBeFocused();
  });

  test('lighting schedule filter (Flip) shows only matching rows and announces count', async ({ page }) => {
    await open(page);
    await page.locator('.sched').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Museum', exact: true }).click();
    await expect(page.locator('.sched__row')).toHaveCount(3);
    await expect(page.getByRole('status').filter({ hasText: 'projects shown' })).toHaveText('3 projects shown');
    await expect(page.getByRole('button', { name: 'Museum', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(900); // Flip duration
    const opacities = await page.locator('.sched__row').evaluateAll((rows) => rows.map((r) => getComputedStyle(r).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.locator('.sched__row')).toHaveCount(10);
  });

  test('The Hour: presets drive readout + announce intent; keyboard works', async ({ page }) => {
    await open(page);
    const hour = page.locator('#the-hour');
    await hour.scrollIntoViewIfNeeded();
    await hour.getByRole('button', { name: '13:30' }).click();
    await expect(hour.locator('.hour__time')).toHaveText('13:30', { timeout: 4000 });
    await expect(hour.locator('[aria-live]')).toContainText('Noon flattens everything');
    await expect(hour.getByRole('button', { name: '13:30' })).toHaveAttribute('aria-pressed', 'true');
    const day = await hour.locator('.hour__readout dd').first().textContent();
    expect(day).toMatch(/5\d{3}\sK/); // number and unit joined by a no-break space
    // midnight: no daylight, door only
    await hour.getByRole('button', { name: '00:00' }).click();
    await expect(hour.locator('.hour__time')).toHaveText('00:00', { timeout: 4000 });
    await expect(hour.locator('.hour__readout dd').first()).toHaveText('—');
    // keyboard: focus slider, PageUp = +1h
    const slider = hour.getByRole('slider', { name: /Time of day/ });
    await slider.focus();
    await page.keyboard.press('PageUp');
    await expect(slider).toHaveValue('60');
    await expect(hour.locator('.hour__time')).toHaveText('01:00', { timeout: 4000 });
    await expect(slider).toHaveAttribute('aria-valuetext', '01:00');
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('75');
    await page.keyboard.press('PageDown'); await page.keyboard.press('PageDown');
    await expect(slider).toHaveValue('1395'); // wraps past midnight → 23:15
    // presets land on exact values (step=5 keeps 18:20 = 1100 unsnapped)
    await hour.getByRole('button', { name: '18:20' }).click();
    await expect(slider).toHaveValue('1100', { timeout: 4000 });
  });

  test('mobile menu: opens, traps focus, locks scroll, Escape closes and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/is-scroll-locked/);
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => scrollY)).toBe(y0);
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu, .nav-toggle'));
    expect(inside).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/is-scroll-locked/);
  });
});
