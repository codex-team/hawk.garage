import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // The default glob also picks up cypress/integration.
    include: ['src/**/*.test.ts'],
    environment: 'jsdom'
  }
})
