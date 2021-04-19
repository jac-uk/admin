/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

// TODO - Get a random application
const applicationId = 'bqtwu9opOL1yXwSnhesc';
// TODO - Read the exercise from the application
const exerciseId = '3CI2dLS5qaa0iaCKxFBD';

const routes = [
  `/exercises/${exerciseId}/applications/draft`,
  `/exercises/${exerciseId}/applications/applied`,
  `/exercises/${exerciseId}/applications/withdrawn`,
  `/exercises/${exerciseId}/applications/draft/application/${applicationId}`,
  // TODO - Complete the list of routes
];

context('Routes - Applications', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('when logged out', () => {
    cy.logout();
    routes.forEach((route) => {
      cy.visit(route).wait(1000);
      cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
    });
  });

  it('when logged in', () => {
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    routes.forEach((route) => {
      cy.visit(route);
      cy.get('.govuk-button').contains('Add to favourites'); // so the test pauses until the page has finished loading
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
