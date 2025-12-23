import type { Config } from '@react-router/dev/config';

export default {
  prerender: true,
  ssr: false,

  appDirectory: './src',
  buildDirectory: './dist',
} satisfies Config;
