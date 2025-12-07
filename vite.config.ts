import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import fs from 'fs'
import hawkVitePlugin from '@hawk.so/vite-plugin'

// Parse .env
import dotenv from 'dotenv'
dotenv.config()

// Current build revision id
const buildRevision = Date.now()

// Get available icons
const iconsAvailable = fs
  .readdirSync(path.resolve('src', 'assets', 'sprite-icons'), { withFileTypes: true })
  .filter(item => !item.isDirectory())
  .filter(item => item.name.includes('.svg'))
  .map(item => item.name.replace('.svg', ''))

const plugins = [
  vue({
    template: {
      compilerOptions: {
        // Enable support for legacy components
        compatConfig: {
          MODE: 2
        }
      }
    }
  }),
  createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/sprite-icons')],
    symbolId: 'icon-[name]',
  }),
];

/**
 * Connect plugin of errors tracking system
 * It will send source-maps after build
 */
const hawkToken = process.env.VITE_HAWK_TOKEN;

if (hawkToken) {
  plugins.push(hawkVitePlugin({
    token: hawkToken
  }));
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json'] // Добавьте эту строку
  },
  define: {
    buildRevision,
    iconsAvailable: JSON.stringify(iconsAvailable)
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('postcss-simple-vars'),
        require('postcss-mixins'),
        require('postcss-nested-ancestors'),
        require('postcss-color-mod-function')({
          importFrom: 'src/styles/variables.css',
          unresolved: 'ignore',
        }),
        require('postcss-nested'),
        require('postcss-preset-env')({
          importFrom: 'src/styles/variables.css',
          stage: 0,
          features: {
            'color-function': {}
          }
        }),
        require('cssnano')()
      ]
    }
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]'
      }
    },
    transpileDependencies: ['marked'],
  },
  server: {
    port: 8080,
    headers: {
      'Cache-Control': 'private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    }
  }
})
