import { defineConfig, devices } from '@playwright/test';

/**
 * QA suite for the Penumbra demo (template: plugins/premium-web-studio/skills/web-qa/assets).
 * Runs against the PRODUCTION build (vite preview), never the dev server.
 * Only Chromium is installed in the studio's verification environment; add firefox/webkit projects
 * where those browsers are available.
 */
// PW_PORT / PW_OUT let several reviewers run the suite concurrently without sharing a server or dist/.
const PORT = Number(process.env.PW_PORT || 4173);
const OUT = process.env.PW_OUT || 'dist';
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  // Visual tolerance: 0.1% of pixels. The earlier 1% let a moved 11px label pass unnoticed (QA D-5).
  expect: { timeout: 10_000, toHaveScreenshot: { maxDiffPixelRatio: 0.001, threshold: 0.2, animations: 'disabled', caret: 'hide' } },
  fullyParallel: true,
  // 1 worker by default. Route-transition tests were flaky at 3 workers; the tech-lead traced the root cause
  // to the app (WebGL destroy() calling loseContext() synchronously, blocking the main thread 0.8-10 s), not
  // to the runner — fixed by deferring loseContext to idle. Raise via PW_WORKERS once re-verified on your host.
  workers: Number(process.env.PW_WORKERS || 1),
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }], ['json', { outputFile: 'reports/results.json' }]],
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npx tsc --noEmit && node scripts/build.mjs ${OUT} && npx vite preview --outDir ${OUT} --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
