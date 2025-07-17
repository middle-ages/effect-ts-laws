import * as eslint from '@eslint/js'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import * as globals from 'globals'
import {globalIgnores} from 'eslint/config'
import tslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs'

const config = tslint.config(
  globalIgnores([
    '../node_modules',
    '../dist',
    './dependency-cruiser.cjs',
    './storybook-static',
  ]),

  eslint.configs.recommended,
  ...tslint.configs.recommended,
  eslint.configs.recommended,
  tslint.configs.strictTypeChecked,
  eslintPluginUnicorn.configs.recommended,
  sonarjs.configs.recommended,
  prettierRecommended,

  {
    ignores: ['../test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        warnOnUnsupportedTypeScriptVersion: false,
        tsconfigRootDir: import.meta.dirname + '/..',
      },
      globals: globals.node,
    },
    rules: {
      // Unicorn gets confused between methods and functions.
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/consistent-function-scoping': 'off',

      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            Args: true,
            Props: true,
            args: true,
            props: true,
            cb: true,
            ab: true,
            bc: true,
            i: true,
            numRuns: true,
          },
        },
      ],

      'unicorn/filename-case': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/no-array-reduce': 'off',

      'sonarjs/arguments-order': 'off',
      'sonarjs/no-empty-test-file': 'off',

      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['../tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
)

export default config
