/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

context('Dashboard', () => {

  before(() => {
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    cy.visit('/dashboard').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('check page layout', () => {
    cy.get('h1').should('contain', 'Your exercises');
    // TODO - check data table is present
    // TODO - check CTA buttons are visible
    // TODO - check there are no console errors
  });

});
