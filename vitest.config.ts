import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // The default glob also picks up cypress/integration.
    include: ['src/**/*.test.ts'],
    environment: 'jsdom'
  },
  resolve: {
    // A vitest config replaces vite.config.ts rather than extending it.
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
