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
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('webpack-graphql-loader')
      .loader('webpack-graphql-loader')
      .end();
  },
  assetsDir: 'static'
};
