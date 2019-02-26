const path = require('path');

module.exports = {
  outputDir: path.join(__dirname, '/build_garage'),
  configureWebpack: {
    devServer: {
      proxy: process.env.SERVER_URL || 'http://localhost:3000'
    },
    entry: {
      app: './garage/src/main.js'
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, '/garage/src')
      }
    }
  }
};