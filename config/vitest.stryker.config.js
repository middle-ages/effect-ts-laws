import fc from 'fast-check'
import {defineConfig} from 'vitest/config'

fc.configureGlobal({numRuns: 100})

export default defineConfig({
  test: {
    globals: true,
    include: ['./tests/**/*.spec.ts'],
  },
})
