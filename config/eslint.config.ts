import eslint from '@eslint/js'
import {Linter} from 'eslint'
import allRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

const {languageOptions: _, ...recommended} = allRecommended

const config = tseslint.config(
  {
    ignores: [
      '../node_modules/*',
      '../.dev',
      '../docs/catalog/js/poster-elements.js',
    ],
  },

  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
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
) as Linter.Config[]

export default config
