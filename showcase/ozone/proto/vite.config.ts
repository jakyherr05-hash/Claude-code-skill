import { defineConfig } from 'vite';

// Self-contained prototype build. Relative base so dist/ can be served from any path.
export default defineConfig({
  base: './',
  build: { target: 'es2022', sourcemap: false },
  worker: { format: 'es' },
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
