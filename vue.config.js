module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('webpack-graphql-loader')
      .loader('webpack-graphql-loader')
      .end();
  }
};
