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
  pwa: {
    name: 'hawk.so',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js'
    }
  },
  assetsDir: 'static'
};
