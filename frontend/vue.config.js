const path = require('path');

module.exports = {
  outputDir: path.join(__dirname, '/build/garage'),
  publicPath: '/garage/',
  configureWebpack: {
    devServer: {
      proxy: process.env.SERVER_URL || 'http://localhost:3000',
      headers: {
        'Access-Control-Allow-Origin': process.env.SERVER_URL || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
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