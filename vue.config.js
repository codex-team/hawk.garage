const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval',
    plugins: [
      new HtmlWebpackInlineSVGPlugin({
        runPreEmit: true
      })
    ]
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
