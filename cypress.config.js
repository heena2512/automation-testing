const { defineConfig } = require('cypress');
// const eyesPlugin = require('@applitools/eyes-cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    defaultCommandTimeout: 10000,
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      // eyesPlugin(on, config);

      return config;
    },
  },
});