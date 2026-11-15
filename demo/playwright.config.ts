import { defineConfig, devices } from '@playwright/test';

/**
 * QA suite for the Penumbra demo (template: plugins/premium-web-studio/skills/web-qa/assets).
 * Runs against the PRODUCTION build (vite preview), never the dev server.
 * Only Chromium is installed in the studio's verification environment; add firefox/webkit projects
 * where those browsers are available.
 */
const PORT = 4173;
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' } },
  fullyParallel: true,
  // 1 worker by default: without a GPU, Chromium rasterises WebGL on the CPU (SwiftShader, ~120-220 ms per
  // full frame). With 3 parallel workers on a 4-core box, route-transition tests intermittently exceeded
  // their timeouts (verified: the same suite is 39/39 green at 1 worker). Raise via PW_WORKERS on GPU machines.
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
    command: 'npm run build && npm run preview',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
