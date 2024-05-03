import {configDefaults, defineConfig} from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      "**/prisma/**",
    ],
    coverage: {
      exclude: [...configDefaults.coverage.exclude, '**/prisma/**', '**/src/utils/swagger/**'],
      provider: 'v8',
    },
  },
});
