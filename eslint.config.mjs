import codex from 'eslint-config-codex';
import { plugin } from 'typescript-eslint';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...codex,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      // Отключаем no-unused-vars в пользу @typescript-eslint/no-unused-vars
      'no-unused-vars': 'off',
      
      // Используем правило для unused vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      
      // False positive of no-shadow rule with ENUMs in eslint
      // https://github.com/typescript-eslint/typescript-eslint/issues/2483
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error', { allow: ['state', 'getters'] }],
      
      // We widely use TS types in .js files` jsdoc, so we disable this rule to prevent reporting such cases
      'jsdoc/no-undefined-types': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      // We widely use TS types in .js files` jsdoc, so we disable this rule to prevent reporting such cases
      'jsdoc/no-undefined-types': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      /**
       * Vue files should be written on ts so
       *  - the return type is not needed in jsdoc
       *  - params type is not needed in jsdoc
       */
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-type': 'off',
    },
  },
];
