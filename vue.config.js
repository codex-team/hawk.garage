module.exports = {
  configureWebpack: {
    devtool: 'source-map'
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
