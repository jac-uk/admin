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

const admin = require('firebase-admin');
const cypressFirebasePlugin = require('cypress-firebase').plugin;

/**
 * @param on - Used to hook into various events Cypress emits
 * @param config - The resolved Cypress config
 * @return {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {

  on('before:browser:launch', (browser = {}, launchOptions) => {

    // allow Chrome to use more than 64 MB of RAM when running in a Docker container
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage');
    } else if (browser.name === 'electron') {
      launchOptions.args['disable-dev-shm-usage'] = true;
    }

    return launchOptions;

  });

  // add our own config options
  config.ignoreTestFiles = '**/__examples__/*.spec.js';

  // the cypress-firebase plugin extends the normal Cypress config
  const extendedConfig = cypressFirebasePlugin(on, config, admin);

  return extendedConfig;

};
