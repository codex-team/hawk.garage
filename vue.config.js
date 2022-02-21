const HawkWebpackPlugin = require('@hawk.so/webpack-plugin');
const path = require('path');
const fs = require('fs');

/**
 * Parse .env
 */
require('dotenv').config();

/**
 * Extendable plugins list
 */
const plugins = [];

/**
 * Current build revision id
 * @type {number}
 */
const buildRevision = Date.now();

/**
 * Connect plugin of errors tracking system
 * It will send source-maps after build
 */
const hawkToken = process.env.VUE_APP_HAWK_TOKEN;

if (hawkToken) {
  plugins.push(new HawkWebpackPlugin({
    integrationToken: hawkToken,
    release: buildRevision,
  }));
}

module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval',
    plugins,
    devServer: {
      progress: false,
    },
  },
  /**
   * Disable progress to boost bundling speed
   */
  devServer: {
    progress: false,
  },
  chainWebpack: config => {
    /**
     * Use DefinePlugin to pass some variables to the sources
     */
    config.plugin('define').tap((definitions) => {

      const iconsAvailable = fs
        .readdirSync(path.resolve('src', 'assets', 'sprite-icons'), { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => item.name.includes('.svg'))
        .map(item => item.name.replace('.svg', ''));


      definitions[0] = Object.assign(definitions[0], {
        /**
         * Current bundle version will be passed to the Hawk Catcher
         */
        buildRevision,

        /**
         * Available icons list
         * @type {string[]}
         */
        iconsAvailable: JSON.stringify(iconsAvailable)
      });

      return definitions;
    });

    config.module.rule('svg-sprite').use('svgo-loader')
      .loader('svgo-loader');

    /**
     * Get tsconfig based on NODE_ENV
     */
    const tsConfigFile = process.env.NODE_ENV === 'production' ? 'tsconfig.production.json' : 'tsconfig.json';

    config.module.rule('ts').use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.configFile = tsConfigFile;

        return options;
      });
    config.module.rule('tsx').use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.configFile = tsConfigFile;

        return options;
      });

    config.plugin('fork-ts-checker').tap(options => {
      options[0].tsconfig = path.resolve(tsConfigFile);

      return options;
    });
  },
  pwa: {
    name: 'hawk.so',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
    },
    themeColor: '#242732',
    msTileColor: '#000000',
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    }
  },
  assetsDir: 'static',
  pluginOptions: {
    storybook: {
      allowedPlugins: ['define', 'svg-sprite'],
    },
    svgSprite: {
      dir: 'src/assets/sprite-icons',
      test: /\.(svg)(\?.*)?$/,
      loaderOptions: {
        spriteFilename: 'img/icons.[hash:8].svg',
      },
      pluginOptions: {
        plainSprite: true,
      },
    },
  },
};
