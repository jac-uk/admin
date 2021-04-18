/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

// TODO - Get a random exercise id (that has applications)
const exerciseId = '3CI2dLS5qaa0iaCKxFBD';

const routes = [
  '/dashboard',
  '/exercises/new',
  `/exercises/${exerciseId}`,
  `/exercises/${exerciseId}/summary`,
  `/exercises/${exerciseId}/vacancy`,
  `/exercises/${exerciseId}/contacts`,
  `/exercises/${exerciseId}/timeline`,
  `/exercises/${exerciseId}/shortlisting`,
  `/exercises/${exerciseId}/eligibility`,
  `/exercises/${exerciseId}/working-preferences`,
  `/exercises/${exerciseId}/assessment-options`,
  `/exercises/${exerciseId}/downloads`,
  `/exercises/${exerciseId}/edit/name`,
  `/exercises/${exerciseId}/edit/summary`,
  `/exercises/${exerciseId}/edit/vacancy`,
  `/exercises/${exerciseId}/edit/contacts`,
  `/exercises/${exerciseId}/edit/timeline`,
  `/exercises/${exerciseId}/edit/shortlisting`,
  `/exercises/${exerciseId}/edit/eligibility`,
  `/exercises/${exerciseId}/edit/working-preferences`,
  `/exercises/${exerciseId}/edit/assessment-options`,
  `/exercises/${exerciseId}/edit/downloads`,
  // TODO - Complete the list of routes
];

context('Routes - Exercises', () => {

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
      // TODO - Instead of waiting 3 seconds for the page to load just do an assertion
      // on some content being present on-screen. This way Cypress will move onto the
      // next test case as soon as the assertion passes (i.e. tests will complete faster)
      cy.wait(3000);
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
