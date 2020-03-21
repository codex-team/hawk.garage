const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const HawkWebpackPlugin = require('@hawk.so/webpack-plugin');
const path = require('path');

/**
 * Parse .env
 */
require('dotenv').config();

/**
 * Extendable plugins list
 */
const plugins = [
  new HtmlWebpackInlineSVGPlugin({
    runPreEmit: true,
  }),
];

/**
 * Current build revision id
 * @type {number}
 */
const buildRevision = Date.now();

/**
 * Connect plugin of errors tracking system
 * It will send source-maps after build
 */
const hawkToken = process.env.VUE_APP_HAWK_TOKEN;

if (hawkToken) {
  plugins.push(new HawkWebpackPlugin({
    integrationToken: hawkToken,
    release: buildRevision,
  }));
}

module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval',
    plugins,
    devServer: {
      progress: false,
    },
  },
  /**
   * Disable progress to boost bundling speed
   */
  devServer: {
    progress: false,
  },
  chainWebpack: config => {
    /**
     * Use DefinePlugin to pass some variables to the sources
     */
    config.plugin('define').tap((definitions) => {
      definitions[0] = Object.assign(definitions[0], {
        /**
         * Current bundle version will be passed to the Hawk Catcher
         */
        buildRevision,
      });

      return definitions;
    });
  },
  pwa: {
    name: 'hawk.so',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
    },
  },
  assetsDir: 'static',
};
