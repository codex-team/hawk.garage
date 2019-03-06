const path = require('path');

module.exports = {
  outputDir: path.join(__dirname, '/build/garage'),
  publicPath: '/garage/',
  configureWebpack: {
    devServer: {
      proxy: process.env.SERVER_URL || 'http://localhost:3000'
    },
    entry: {
      app: './garage/main.js'
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, '/garage/')
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = 'garage/index.html';
        args[0].favicon = 'garage/assets/favicon.ico';
        return args;
      });
  }
};
