import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/integration/**/*.test.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.ts',
    /**
     * Setup node event listeners
     * @param on - Cypress plugin events
     * @param config - Cypress plugin config options
     * @returns Cypress plugin config options
     */
    setupNodeEvents(on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      return config;
    },
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      API_ENDPOINT: process.env.API_ENDPOINT || 'http://localhost:4000',
    },
  },
});

