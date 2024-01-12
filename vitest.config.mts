import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      "**/prisma/**",
    ],
    coverage: {
      exclude: [...configDefaults.coverage.exclude, '**/prisma/**', '**/src/utils/swagger/**'],
      provider: 'v8',  // Configuration du fournisseur V8
    },
  },
});
