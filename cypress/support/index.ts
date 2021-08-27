// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      visitHawk(path?: string): Chainable<Cypress.AUTWindow>;
      createUser(email: string, password: string): Chainable<Cypress.Response<string>>
      login(email?: string, password?: string): Chainable<void>;
      register(email: string): Chainable<void>;
      deleteUser(email: string): Chainable<Cypress.Response<boolean>>;
      clearStorage(): Chainable<void>;
    }
  }
}


// Alternatively you can use CommonJS syntax:
// require('./commands')
