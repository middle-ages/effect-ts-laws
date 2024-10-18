import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      enabled: true,
    },
    include: ['./tests/**/*.spec.ts'],
    setupFiles: ['./tests/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './.dev',
      exclude: ['.dev', 'dev', 'config', 'docs', 'tests'],
    },
  },
})
