import fc from 'fast-check'
import {defineConfig} from 'vitest/config'

fc.configureGlobal({numRuns: 1_000})

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
        '.dev',
        'dev',
        'conf',
        'src/dev',
        'tests',
      ],
    },
  },
})
