module.exports = {
  extends: [
    'codex',
    'plugin:vue/recommended',
    '@vue/typescript',
  ],
  parserOptions: {
    project: `./tsconfig.json`,
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars-experimental': [1, {
      ignoreArgsIfArgsAfterAreUsed: true,
    }],

    'no-shadow': ['error', {
      /**
       * Adjust for vuex
       */
      allow: ['state', 'getters'],
    } ],
    /**
     * We widely use TS types in .js files` jsdoc, so we disable this rule to prevent reporting such cases
     */
    'jsdoc/no-undefined-types': 0,
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        /**
         * Vue files should be written on ts so
         *  - the return type is not needed in jsdoc
         *  - params type is not needed in jsdoc
         */
        'jsdoc/require-returns': 0,
        'jsdoc/require-param-type': 0
      },
    }
  ]
};
