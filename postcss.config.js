module.exports = {
  plugins: {
    /*
     * Consumes files by @import rule
     * https://github.com/postcss/postcss-import
     */
    'postcss-import': {},

    /*
     * Convert modern CSS into something most browsers can understand
     * https://github.com/csstools/postcss-preset-env
     */
    'postcss-preset-env': {
      /*
       * Polyfill CSS features
       * https://github.com/csstools/postcss-preset-env#stage
       *
       * List of features with levels: https://cssdb.org/
       */
      stage: 0,

      /*
       * Enable or disable specific polyfills
       * https://github.com/csstools/postcss-preset-env#features
       * List of available plugins
       * https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js
       */
      features: {
        'color-mod-function': {}
      }
    },
    /*
     * Nested rules unwrapper
     * https://github.com/postcss/postcss-nested
     * As you know 'postcss-preset-env' plugin has a 'postcss-nesting' feature
     * but it does not work with nested rules like BEM
     * Report: https://github.com/jonathantneal/postcss-nesting/issues/41
     */
    'postcss-nested': {},

    /*
     * Compression tool
     * https://github.com/cssnano/cssnano
     */
    'cssnano': {}
  }
};
