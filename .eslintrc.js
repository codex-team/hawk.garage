module.exports = {
  extends: [
    'codex',
    'plugin:vue/recommended',
    '@vue/typescript',
  ],
  rules: {
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
      files: [ '*.vue' ],
      rules: {
        /**
         * Vue files should be written on ts so
         *  - the return type is not needed in jsdoc
         *  - params type is not needed in jsdoc
         */
        'jsdoc/require-returns': 0,
        'jsdoc/require-param-type': 0,
      },
    },
  ],
};
