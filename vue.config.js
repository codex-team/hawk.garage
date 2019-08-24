const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackInlineSVGPlugin({
        runPreEmit: true
      })
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader');
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
