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
      // Переопределяем все ошибки на предупреждения
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-jsdoc': 'warn',
      'jsdoc/informative-docs': 'warn',
      'jsdoc/no-undefined-types': 'warn',
      'jsdoc/require-param-type': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      'n/no-missing-import': 'warn',
      'n/no-unsupported-features/node-builtins': 'warn',

      /**
       * @todo remove after migration to Vue and Vite
       */
      'n/prefer-global/process': 'off',
      'n/prefer-global/buffer': 'off',

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
      '@typescript-eslint/no-shadow': ['warn', { allow: ['state', 'getters'] }],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.vue'],
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      // We widely use TS types in .js files` jsdoc, so we disable this rule to prevent reporting such cases
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/require-jsdoc': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/informative-docs': 'warn',
      'jsdoc/require-returns-type': 'warn',
      'jsdoc/require-param-type': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/check-types': 'warn',
      'n/no-missing-import': 'warn',
      'n/no-unsupported-features/node-builtins': 'warn',
      'n/no-extraneous-import': 'warn',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'warn',

      /**
       * @todo remove after migration to Vite
       */
      'n/prefer-global/process': 'off',
      'n/prefer-global/buffer': 'off',
    },
  },
  {
    files: ['**/*.vue'],

    /**
     * @todo remove after migration to Vite
     */
    languageOptions: {
      globals: {
        require: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      /**
       * Vue files should be written on ts so
       *  - the return type is not needed in jsdoc
       *  - params type is not needed in jsdoc
       */
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-type': 'off',
      '@typescript-eslint/require-await': 'off',

      /**
       * @todo remove after migration to Vue3
       */
      'vue/no-deprecated-filter': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-deprecated-props-default-this': 'off',
      'vue/require-slots-as-functions': 'off',
      'vue/no-deprecated-destroyed-lifecycle': 'off',
      // Отключаем no-unused-vars в пользу @typescript-eslint/no-unused-vars
      'no-unused-vars': 'off',
    },
  },
];
