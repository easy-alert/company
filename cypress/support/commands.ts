/* eslint-disable @typescript-eslint/no-namespace */

// @ts-check
// <reference path="../global.d.ts" />

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('getByTestId', (selector, ...args) =>
  cy.get(`[data-testid="${selector}"]`, ...args),
);

Cypress.Commands.add('checkToastMessage', (toastId, message) => {
  cy.get(`[id=${toastId}]`).should('contain', message);
});

// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute
       * @example cy.getByTestId('selector')
       * @param {string} selector - data-testid attribute value
       * @returns {typeof getByTestId}
       * @memberof Cypress.Chainable
       * @see https://testing-library.com/docs/queries/bytestid/
       */
      getByTestId(selector: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check toast message
       * @example cy.checkToastMessage('toastId', 'message')
       * @param {string} toastId - toast id
       * @param {string} message - message to check
       * @returns {typeof checkToastMessage}
       * @memberof Cypress.Chainable
       */
      checkToastMessage(toastId: string, message: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
