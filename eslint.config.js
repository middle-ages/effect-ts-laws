// @ts-check

import eslint from '@eslint/js'
import allRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

const {languageOptions: _, ...recommended} = allRecommended

export default tseslint.config(
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
      },
    },
  },

  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  recommended,

  {
    ignores: ['dist/*', 'node_modules/*', '.dependency-cruiser.mjs'],
  },

  {
    rules: {
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
)
