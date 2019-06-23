module.exports = {
  configureWebpack: {
    devtool: 'source-map'
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
