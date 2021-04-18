/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

context('Login', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('page layout', () => {
    cy.title().should('include', 'JAC Digital Platform');
    cy.get('[data-cy="google-sign-in-button"]');
  });

  it('auth required for notifications link', () => {
    cy.get('[data-cy=nav-notifications-link]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  it('auth required for exercises link', () => {
    cy.get('[data-cy=nav-exercises-link]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  it('auth required for candidates link', () => {
    cy.get('[data-cy=nav-candidates-link]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  it('login (non-JAC)', () => {
    cy.login(Cypress.env('APPLY_TEST_UID'));
    cy.contains('This site is restricted to employees of the Judicial Appointments Commission');
  });

  it('login (JAC)', () => {
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    cy.visit('/dashboard').wait(3000); // in case the page content takes a while to render on the Browser
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`); //i.e. user was not redirected back to the login page
  });

});
