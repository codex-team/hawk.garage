const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
// const HawkWebpackPlugin = require('@hawk.so/webpack-plugin');

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
 * Connect plugin of errors tracking system
 * It will send source-maps after build
 */
const hawkToken = process.env.VUE_APP_HAWK_TOKEN;

if (hawkToken) {
  // plugins.push(new HawkWebpackPlugin({
  //   integrationToken: hawkToken,
  // }));
}

module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval',
    plugins,
    devServer: {
      progress: false,
    },
  },
  devServer: {
    progress: false,
  },
  chainWebpack: config => {
    config
      .plugins
      .delete('progress');
  },
  pwa: {
    name: 'hawk.so',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js'
    }
  },
  assetsDir: 'static'
};
