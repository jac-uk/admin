/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

const candidateId = 'Sle6D6hfxAZfinrTCJvBlZA9tGJ2';
// TODO - Get a random candidate ID

const routes = [
  '/candidates',
  `/candidates/${candidateId}`,
  // TODO - Complete the list of routes
];

context('Routes - Candidates', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it ('when logged out', () => {
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
      if (route == '/candidates') {
        cy.wait(1000);
      } else {
        cy.get('.govuk-heading-xl').contains('Candidate:'); // so the test pauses until the page has finished loading
      }
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
