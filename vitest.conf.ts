import fc from 'fast-check'
import {defineConfig} from 'vitest/config'

fc.configureGlobal({numRuns: 10_000})

export default defineConfig({
  test: {
    globals: true,
    include: ['./tests/**/*.spec.ts'],
    typecheck: {
      enabled: true,
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './.dev',
      exclude: [
        'dist',
        'dev',
        'src/dev',
        'tests',
        'vitest.conf.ts',
        'eslint.config.js',
        '.dependency-cruiser.cjs',
      ],
    },
  },
  resolve: {
    conditions: ['test'],
  },
})
