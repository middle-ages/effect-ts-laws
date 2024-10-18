import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    typecheck: {
      enabled: false,
    },
    globals: true,
    include: ['./tests/**/*.spec.ts'],
    setupFiles: ['./tests/vitest.setup.ts'],
  },
})
