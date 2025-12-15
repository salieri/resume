import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from "@react-router/dev/vite";

const requiresReactRouter = !process.env.VITEST && !process.argv[1]?.includes('storybook');

export default defineConfig({
  plugins: [requiresReactRouter ? reactRouter() : react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
