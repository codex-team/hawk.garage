// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import * as seedApi from '@/api/seed';

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

/**
 * Visits Hawk on localhost
 */
Cypress.Commands.add('visitHawk', (path = '') => {
  cy.visit(`http://localhost:8080/${path}`);
});

const API_ENDPOINT = 'http://localhost:4000';

/**
 * Creates new user using seed resolver
 *
 * @param email - user email
 * @param password - user password
 */
Cypress.Commands.add('createUser', (email: string, password: string) => {
  return cy.request(
    'POST',
    API_ENDPOINT + '/graphql',
    {
      // language=GraphQL
      query: `
        mutation createUser($email: String!, $password: String!) {
          createUser(email: $email, password: $password) {
            id
          }
        }
      `,
      variables: {
        email,
        password,
      },
    }
  ).then(response => {
    console.log(response);
    return response.body.data.createUser.id;
  });
});

/**
 * Deletes user by email using seed resolver
 *
 * @param email - user email
 */
Cypress.Commands.add('deleteUser', (email: string) => {
  return cy.request(
    'POST',
    API_ENDPOINT + '/graphql',
    {
      // language=GraphQL
      query: `
        mutation deleteUser($email: String!) {
          deleteUser(email: $email)
        }
      `,
      variables: { email },
    }
  ).then(response => {
    return response.body.data.deleteUser;
  });
});

/**
 * Fill data on login page and click the button
 *
 * @param [email] - user email
 * @param [password] - user password
 */
Cypress.Commands.add('login', (email?: string, password?: string) => {
  if (email) {
    cy.get('input#email')
      .type(email);
  }

  if (password) {
    cy.get('input#password')
      .type(password);
  }

  cy.contains('Log in')
    .click();
});

/**
 * Fills data on signup page and click Register button
 *
 * @param email - user email
 */
Cypress.Commands.add('register', (email: string) => {
  cy.get('input#email')
    .type(email);

  cy.contains('Register')
    .click();
});

/**
 * Clears localStorage
 */
Cypress.Commands.add('clearStorage', () => {
  cy.window()
    .then(win => {
      win.localStorage.clear();
    });
});
