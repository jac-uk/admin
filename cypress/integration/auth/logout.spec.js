/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

context('Logout', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('auto-redirect after session timeout', () => {
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    cy.visit('/dashboard').wait(3000); // in case the page content takes a while to render on the Browser
    cy.logout(); // simulate a timeout, by logging the user out programatically
    cy.reload().wait(3000);
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  // TODO - The 'click' operation in the test below doesn't work for some reason

  // it('auto-redirect after logout', () => {
    // cy.login(Cypress.env('ADMIN_TEST_UID'));
    // cy.visit('/dashboard').wait(3000); // in case the page content takes a while to render on the Browser
    // cy.get('[data-cy=nav-sign-out-link]').click();
    // cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  // });

});
