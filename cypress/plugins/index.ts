/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * Cypress plugin configuration function
 * @param on - Cypress plugin events
 * @param config - Cypress plugin config options
 * @returns Cypress plugin config options
 */
export default function (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  return config;
}
