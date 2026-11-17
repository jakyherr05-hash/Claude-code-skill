#!/usr/bin/env node
/**
 * capture-reference.mjs — inspect a live website and record VERIFIABLE evidence.
 *
 * Usage:
 *   node capture-reference.mjs <url> <outDir> [--id slug] [--no-mobile] [--tablet] [--filmstrip N]
 *   node capture-reference.mjs --batch urls.txt <outDir> [same flags]   (one "slug url" per line)
 *
 *   --filmstrip N   scroll through the page in N wheel steps (spread over the full page height, at least 0.85 viewport each; 1.2 s apart so scroll-driven
 *                   animation plays) and record one frame + measurements per step: what is pinned, which headings are
 *                   on screen and how big, visible canvases/videos. This is how you study a scroll STORY, not a hero.
 *                   Also works on your own build (http://localhost:…) for the render-critique loop.
 *   --tablet        also capture 768x1024 and 1024x768 at the top (tablet-portrait-0.jpg, tablet-landscape-0.jpg).
 *
 * Produces in <outDir>/<slug>/:
 *   capture.json        machine-readable evidence (measured values only)
 *   desktop-0.jpg       1440x900 viewport at top (after settle)
 *   desktop-1.jpg       after scrolling one viewport
 *   mobile-0.jpg        390x844 viewport at top
 *   scroll-NN.jpg       (--filmstrip) one frame per scroll step; measurements in capture.json → filmstrip[]
 *   tablet-*.jpg        (--tablet)
 *
 * Everything in capture.json is MEASURED from the running page. Nothing is inferred.
 * Interpretation belongs in the human/agent-written report, labelled as such.
 *
 * Requires: playwright (npm i -D playwright, or a global install). Chromium is used.
 */
import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  try { ({ chromium } = req('playwright')); } catch {
    console.error('playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const VALUE_OPTS = ['--id', '--filmstrip', '--batch'];
const positional = () => args.filter((a, i) => !a.startsWith('--') && !VALUE_OPTS.includes(args[i - 1]));
const FILMSTRIP = Math.max(0, Math.min(40, parseInt(opt('--filmstrip') || '0', 10) || 0));

function slugify(u) {
  return new URL(u).hostname.replace(/^www\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '');
}

async function inspect(browser, url, outDir, id, { mobile = true, tablet = false, filmstrip = 0 } = {}) {
  const dir = path.join(outDir, id);
  fs.mkdirSync(dir, { recursive: true });
  const result = { id, url, researchedAt: new Date().toISOString(), status: 'inspected', errors: [] };
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  const scriptUrls = new Set();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('request', (r) => { if (r.resourceType() === 'script') scriptUrls.add(r.url()); });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });

  let response;
  try {
    response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.httpStatus = response?.status() ?? null;
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch { result.errors.push('networkidle timeout (page kept loading; continued)'); }
    await page.waitForTimeout(4000); // let intro animations settle
    if (result.httpStatus >= 400) {
      // Bot walls / rate limits: the DOM we'd measure is an error or challenge page, not the site.
      result.status = 'blocked';
      const why = { 401: 'authentication required', 403: 'automated access refused', 404: 'page not found', 429: 'rate-limited', 451: 'unavailable for legal reasons' }[result.httpStatus]
        || (result.httpStatus >= 500 ? 'server error' : 'request refused');
      result.errors.push(`HTTP ${result.httpStatus} — ${why}; the page content is not the real site, nothing was measured`);
      await page.screenshot({ path: path.join(dir, 'blocked.jpg'), type: 'jpeg', quality: 50 });
      await ctx.close();
      fs.writeFileSync(path.join(dir, 'capture.json'), JSON.stringify(result, null, 2));
      return result;
    }
  } catch (e) {
    result.status = 'not-inspected';
    result.errors.push(`navigation failed: ${String(e.message).split('\n')[0]}`);
    await ctx.close();
    fs.writeFileSync(path.join(dir, 'capture.json'), JSON.stringify(result, null, 2));
    return result;
  }
  result.finalUrl = page.url();
  result.title = await page.title();

  await page.screenshot({ path: path.join(dir, 'desktop-0.jpg'), type: 'jpeg', quality: 60 });

  // ---- DOM / CSS / runtime evidence ----
  result.page = await page.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const typo = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = cs(el);
      const r = el.getBoundingClientRect();
      return {
        selector: sel,
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
        lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform,
        fontVariationSettings: s.fontVariationSettings, color: s.color,
        box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      };
    };
    // largest visible text element in first viewport (by font-size)
    let largest = null;
    for (const el of document.querySelectorAll('h1,h2,h3,p,span,a,div')) {
      if (!el.childNodes.length || el.children.length > 3) continue;
      const t = (el.textContent || '').trim();
      if (t.length < 2 || t.length > 120) continue;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0 || r.width === 0) continue;
      const fs = parseFloat(cs(el).fontSize);
      if (!largest || fs > largest.fs) largest = { fs, el };
    }
    const fonts = new Set();
    try { document.fonts.forEach((f) => { if (f.status === 'loaded') fonts.add(`${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`); }); } catch {}
    const html = document.documentElement;
    const body = document.body;
    const canvases = [...document.querySelectorAll('canvas')].map((c) => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), position: cs(c).position };
    });
    const videos = [...document.querySelectorAll('video')].map((v) => ({
      autoplay: v.autoplay, muted: v.muted, loop: v.loop, src: (v.currentSrc || '').split('?')[0].slice(-80),
    }));
    const imgs = [...document.querySelectorAll('img')];
    const fmt = {};
    for (const i of imgs) { const m = (i.currentSrc || i.src || '').split('?')[0].match(/\.(\w{3,4})$/); const k = m ? m[1].toLowerCase() : 'other'; fmt[k] = (fmt[k] || 0) + 1; }
    const w = window;
    const detected = {
      gsap: w.gsap?.version || null,
      scrollTriggerGlobal: !!w.ScrollTrigger,
      lenisClassOnHtml: html.classList.contains('lenis') || html.classList.contains('lenis-smooth'),
      lenisGlobal: !!w.Lenis || !!w.lenis,
      locomotiveScroll: html.classList.contains('has-scroll-smooth') || !!document.querySelector('[data-scroll-container]'),
      threeRevision: w.__THREE__ || null,
      barba: !!w.barba || !!document.querySelector('[data-barba]'),
      swup: !!w.swup || !!document.querySelector('#swup'),
      nextjs: !!w.__NEXT_DATA__ || !!document.querySelector('script[src*="/_next/"]') || !!w.next,
      nuxt: !!w.__NUXT__ || !!w.$nuxt,
      framer: !!document.querySelector('[data-framer-name], #__framer-badge-container') || /framer/i.test(document.querySelector('meta[name=generator]')?.content || ''),
      webflow: !!html.getAttribute('data-wf-page') || !!w.Webflow,
      astro: !!document.querySelector('astro-island, [data-astro-cid]') || /astro/i.test(document.querySelector('meta[name=generator]')?.content || ''),
      wordpress: !!document.querySelector('link[href*="wp-content"], script[src*="wp-content"]'),
      generatorMeta: document.querySelector('meta[name=generator]')?.content || null,
    };
    const nav = document.querySelector('header, nav');
    const navBox = nav ? nav.getBoundingClientRect() : null;
    return {
      lang: html.lang || null,
      viewport: { w: innerWidth, h: innerHeight },
      docHeight: document.documentElement.scrollHeight,
      htmlClasses: html.className.toString().slice(0, 200),
      bodyBackground: cs(body).backgroundColor, htmlBackground: cs(html).backgroundColor, bodyColor: cs(body).color,
      bodyFont: typo('body'), h1: typo('h1'), h2: typo('h2'), p: typo('p'), navLink: typo('nav a, header a'),
      largestVisibleText: largest ? { fontSize: cs(largest.el).fontSize, fontFamily: cs(largest.el).fontFamily, fontWeight: cs(largest.el).fontWeight, letterSpacing: cs(largest.el).letterSpacing, lineHeight: cs(largest.el).lineHeight, text: largest.el.textContent.trim().slice(0, 80) } : null,
      loadedFonts: [...fonts].slice(0, 30),
      nav: navBox ? { tag: nav.tagName.toLowerCase(), position: cs(nav).position, height: Math.round(navBox.height), linkCount: nav.querySelectorAll('a').length } : null,
      counts: { sections: document.querySelectorAll('section').length, images: imgs.length, videos: videos.length, canvases: canvases.length, svgs: document.querySelectorAll('svg').length, links: document.querySelectorAll('a[href]').length },
      canvases: canvases.slice(0, 5), videos: videos.slice(0, 5), imageFormats: fmt,
      landmarks: { header: !!document.querySelector('header'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer'), h1Count: document.querySelectorAll('h1').length, skipLink: !!document.querySelector('a[href^="#"][class*="skip" i]') },
      detected,
    };
  });

  // ---- scroll behaviour: sample scrollY after a single wheel gesture ----
  try {
    await page.mouse.move(720, 450);
    const t0 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 600);
    const samples = [];
    for (const ms of [16, 100, 250, 500, 900, 1500]) {
      await page.waitForTimeout(ms - (samples.at(-1)?.ms || 0));
      samples.push({ ms, y: Math.round(await page.evaluate(() => scrollY)) });
    }
    const final = samples.at(-1).y - t0;
    const at100 = samples.find((s) => s.ms === 100).y - t0;
    result.scroll = {
      wheelDelta: 600, start: t0, samples,
      interpretation_basis: 'native scroll reaches target within ~1 frame; smoothed scroll (Lenis/Locomotive/custom) interpolates over hundreds of ms',
      reachedAt100msPct: final ? Math.round((at100 / final) * 100) : null,
      likelySmoothed: final > 0 ? at100 / final < 0.9 : null,
      movedPx: final,
    };
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(dir, 'desktop-1.jpg'), type: 'jpeg', quality: 60 });
  } catch (e) { result.errors.push(`scroll probe failed: ${e.message.split('\n')[0]}`); }

  // ---- scroll filmstrip: the page as a sequence of scenes (opt-in) ----
  if (filmstrip > 0) {
    result.filmstrip = [];
    try {
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200);
      // spread the N frames over the whole page (never less than ~0.85 viewport per step), so long stories are sampled end to end
      const { docH, vh } = await page.evaluate(() => ({ docH: document.documentElement.scrollHeight, vh: innerHeight }));
      const delta = Math.round(Math.max(vh * 0.85, (docH - vh) / Math.max(1, filmstrip - 1)));
      result.filmstripStepPx = delta;
      for (let i = 0; i < filmstrip; i++) {
        if (i > 0) { await page.mouse.move(720, 450); await page.mouse.wheel(0, delta); await page.waitForTimeout(1200); }
        const name = `scroll-${String(i).padStart(2, '0')}.jpg`;
        await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 55 });
        const m = await page.evaluate(() => {
          const vis = (r) => r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
          const big = (r) => r.width * r.height > innerWidth * innerHeight * 0.25;
          const pinned = [...document.querySelectorAll('body *')].filter((e) => {
            const cs = getComputedStyle(e); if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
            const r = e.getBoundingClientRect(); return vis(r) && big(r);
          }).length;
          // GSAP pin-spacer wrappers are the reliable marker for ScrollTrigger pins
          const pinSpacers = [...document.querySelectorAll('.pin-spacer')].filter((e) => vis(e.getBoundingClientRect())).length;
          const heads = [...document.querySelectorAll('h1,h2,h3,[class*="title" i],[class*="heading" i]')]
            .map((e) => ({ e, r: e.getBoundingClientRect(), cs: getComputedStyle(e) }))
            .filter(({ r, cs }) => vis(r) && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05)
            .sort((a, b) => parseFloat(b.cs.fontSize) - parseFloat(a.cs.fontSize)).slice(0, 3)
            .map(({ e, cs }) => ({ text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60), fontSize: cs.fontSize, family: cs.fontFamily.split(',')[0].replace(/["']/g, '') }));
          const media = { canvases: [...document.querySelectorAll('canvas')].filter((c) => { const r = c.getBoundingClientRect(); return vis(r) && big(r); }).length,
            videos: [...document.querySelectorAll('video')].filter((v) => vis(v.getBoundingClientRect())).length };
          return { scrollY: Math.round(scrollY), docHeight: document.documentElement.scrollHeight, pinnedLargeFixedOrSticky: pinned, pinSpacersInView: pinSpacers, headings: heads, media };
        });
        result.filmstrip.push({ step: i, frame: name, ...m });
        if (i > 0 && m.scrollY === result.filmstrip[i - 1].scrollY && m.scrollY > 0) break; // reached the end
      }
      // a step where scrollY advanced but the frame's headings did not change and something large is pinned = a pinned scene
    } catch (e) { result.errors.push(`filmstrip failed: ${e.message.split('\n')[0]}`); }
  }

  // ---- performance (lab, single run, this container's network — indicative only) ----
  result.performance = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const by = {};
    for (const r of res) { const k = r.initiatorType; by[k] = by[k] || { count: 0, transferKB: 0 }; by[k].count++; by[k].transferKB += (r.transferSize || 0) / 1024; }
    for (const k in by) by[k].transferKB = Math.round(by[k].transferKB);
    return {
      note: 'single lab run from a cloud container; transferSize is 0 for cross-origin resources without Timing-Allow-Origin, so totals are lower bounds',
      domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadMs: nav ? Math.round(nav.loadEventEnd) : null,
      lcpMs: Math.round(window.__lcp || 0) || null,
      cls: Math.round((window.__cls || 0) * 1000) / 1000,
      requests: res.length, byInitiator: by,
    };
  });
  const libHints = [...scriptUrls].filter((u) => /gsap|scrolltrigger|splittext|lenis|locomotive|three|barba|swup|pixi|ogl|curtains|lottie|rive|spline|webflow|swiper|matter|cannon|rapier/i.test(u)).map((u) => u.split('?')[0].slice(-110));
  result.scripts = { total: scriptUrls.size, libraryHints: [...new Set(libHints)].slice(0, 25) };
  result.consoleErrors = consoleErrors.slice(0, 5);
  await ctx.close();

  if (mobile) {
    const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mp = await m.newPage();
    try {
      await mp.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      try { await mp.waitForLoadState('networkidle', { timeout: 12000 }); } catch {}
      await mp.waitForTimeout(3500);
      await mp.screenshot({ path: path.join(dir, 'mobile-0.jpg'), type: 'jpeg', quality: 60 });
      result.mobile = await mp.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        h1FontSize: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontSize : null,
        largestFontSize: Math.max(0, ...[...document.querySelectorAll('h1,h2,p,span,a,div')].filter((e) => e.children.length < 3 && e.getBoundingClientRect().top < innerHeight).map((e) => parseFloat(getComputedStyle(e).fontSize))),
        menuButton: !!document.querySelector('button[aria-expanded], [class*="burger" i], [class*="menu" i] button, button[class*="menu" i]'),
      }));
    } catch (e) { result.errors.push(`mobile pass failed: ${e.message.split('\n')[0]}`); }
    await m.close();
  }
  if (tablet) {
    for (const [nm, vp] of [['tablet-portrait-0.jpg', { width: 768, height: 1024 }], ['tablet-landscape-0.jpg', { width: 1024, height: 768 }]]) {
      const t = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const tp = await t.newPage();
      try {
        await tp.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        try { await tp.waitForLoadState('networkidle', { timeout: 12000 }); } catch {}
        await tp.waitForTimeout(3500);
        await tp.screenshot({ path: path.join(dir, nm), type: 'jpeg', quality: 60 });
        (result.tablet ||= {})[nm.replace('-0.jpg', '')] = await tp.evaluate(() => ({ horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1, h1FontSize: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontSize : null }));
      } catch (e) { result.errors.push(`${nm} failed: ${e.message.split('\n')[0]}`); }
      await t.close();
    }
  }
  fs.writeFileSync(path.join(dir, 'capture.json'), JSON.stringify(result, null, 2));
  return result;
}

const browser = await chromium.launch();
const passOpts = { mobile: !flag('--no-mobile'), tablet: flag('--tablet'), filmstrip: FILMSTRIP };
try {
  if (flag('--batch')) {
    const list = fs.readFileSync(opt('--batch'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const outDir = positional()[0];
    for (const line of list) {
      const [id, url] = line.split(/\s+/);
      process.stdout.write(`→ ${id} ${url} … `);
      const r = await inspect(browser, url, outDir, id, passOpts);
      console.log(r.status, r.httpStatus ?? '', r.errors.join('; '));
    }
  } else {
    const [url, outDir] = positional();
    if (!url || !outDir) { console.error('usage: capture-reference.mjs <url> <outDir> [--id slug] [--no-mobile] [--tablet] [--filmstrip N]'); process.exit(1); }
    const r = await inspect(browser, url, outDir, opt('--id') || slugify(url), passOpts);
    console.log(JSON.stringify({ id: r.id, status: r.status, errors: r.errors }, null, 2));
  }
} finally {
  await browser.close();
}
