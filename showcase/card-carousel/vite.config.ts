import { defineConfig } from 'vite';

// Relative base so dist/ works from any folder (static host, claude.ai artifact).
export default defineConfig({ base: './' });
