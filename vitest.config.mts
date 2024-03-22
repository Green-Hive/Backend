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
    environment:"node",
  },
  resolve: {
    alias: [
      {
        find: '@', // Define your alias here (e.g., '@')
        replacement: path.resolve(__dirname, 'src') // Specify the base URL or base directory here
      }
    ]
  }
});
