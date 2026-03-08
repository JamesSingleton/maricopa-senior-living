import sanityStudio from '@sanity/eslint-config-studio'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config} */

export default [
  ...sanityStudio,
  {
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Remove project option since this file isn't included in tsconfig
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['dist', 'node_modules', '.sanity'],
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/no-default-export': 'off',
    },
  },
]
