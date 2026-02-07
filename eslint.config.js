import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const flatCompat = new FlatCompat();

export default tseslint.config(
  { ignores: ['dist'] },
  ...fixupConfigRules(flatCompat.extends('eslint-config-airbnb')),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'prettier/prettier': ['error'],
      'import/named': 'error',
      'import/no-named-default': 'error',
      'import/default': 'error',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['multiline-block-like', 'return', 'multiline-expression', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['multiline-block-like', 'export', 'multiline-expression', 'switch', 'try'],
          next: '*',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'src/*',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc',
            'accumulator',
            'e',
            'ctx',
            'context',
            'req',
            'request',
            'res',
            'response',
            '$scope',
            'staticContext',
            'draft',
            'state',
          ],
        },
      ],
      'func-style': ['error', 'expression'],
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.test.{ts,tsx}', 'tests/**/*'] },
      ],
      'max-len': ['warn', { code: 100, ignorePattern: '^import .*' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info', 'groupCollapsed', 'groupEnd'] }],
      'jsx-a11y/img-redundant-alt': 'error',
      'react/jsx-props-no-spreading': 'off',
      'template-curly-spacing': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'import/prefer-default-export': 'off',
      'no-nested-ternary': 'error',
      curly: ['error', 'all'],
      'import/no-default-export': 'error',
      'no-underscore-dangle': 'error',
      'react/forbid-prop-types': 'error',
      'react/no-array-index-key': 'error',
      'no-alert': 'error',
      'react/forbid-component-props': [
        'warn',
        {
          forbid: ['style'],
        },
      ],
      'react/function-component-definition': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['*.config.*'],
    rules: {
      'import/no-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    // файл содержит виртуальный модуль из vite-pwa
    files: ['./src/app/App.tsx'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
  {
    // Нужно для простой и корректной типизации дженерика
    files: ['./tests/helpers/renderWithForm.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['./src/shared/providers/RecordsProvider/useRecords.test.tsx'],
    rules: {
      'react/jsx-no-useless-fragment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
);
