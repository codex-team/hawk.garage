const path = require('path');
const outputDir = path.join(__dirname, '/build/garage');

module.exports = {
  outputDir: outputDir,
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
        return args;
      });

    config
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [ [ {
        from: './garage/public',
        to: outputDir
      } ] ]);
  }
};
