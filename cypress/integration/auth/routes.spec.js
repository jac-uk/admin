/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

context('Routes', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it ('unauthenticated routes', () => {
    const routes = [
      '/sign-in',
    ];
    // check we can access each page when logged out
    cy.logout();
    routes.forEach((route) => {
      cy.visit(route).wait(3000);
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

  it ('authenticated routes', () => {
    const routes = [
      '/dashboard',
      '/notifications',
      '/candidates',
    ];
    // check we can't access each page when logged out
    cy.logout();
    routes.forEach((route) => {
      cy.visit(route).wait(3000);
      cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
    });
    // check we can access each page when logged in
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    routes.forEach((route) => {
      cy.visit(route).wait(3000);
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
