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
      reportsDirectory: './.dev/coverage',
      exclude: [
        '.dev',
        'dev',
        'config',
        'docs',
        'tests',
        'src/index.ts',
        'src/vitest.ts',
        'src/typeclass.ts',
        'src/arbitrary.ts',
        'src/laws.ts',
        'src/laws/typeclass/harness.ts',
        'src/law.ts',
      ],
    },
  },
})
