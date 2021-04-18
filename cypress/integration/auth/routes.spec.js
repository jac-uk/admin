/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

context('Routes', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('unauthenticated routes', () => {
    const routes = [
      '/sign-in',
    ];
    // check we can access each page when logged out
    cy.logout();
    routes.forEach((route) => {
      cy.visit(route).wait(1000);
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

  it('authenticated routes', () => {

    // Note: In the long run we may have to break this up into seperate tests,
    // because loading lots of pages within the same test uses a lot of memory

    // TODO - Get a random exercise id (that has applications)
    const exerciseId = '3CI2dLS5qaa0iaCKxFBD';
    // TODO - Get a random application id for the above exercise
    // const applicationId = '0pBRLO61xSjACuaCjnHb';

    const routes = [
      '/dashboard',
      '/notifications',
      '/candidates',
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
      `/exercises/${exerciseId}/edit/summary`,
      `/exercises/${exerciseId}/edit/vacancy`,
      `/exercises/${exerciseId}/edit/contacts`,
      `/exercises/${exerciseId}/edit/timeline`,
      `/exercises/${exerciseId}/edit/shortlisting`,
      `/exercises/${exerciseId}/edit/eligibility`,
      `/exercises/${exerciseId}/edit/working-preferences`,
      `/exercises/${exerciseId}/edit/assessment-options`,
      `/exercises/${exerciseId}/edit/downloads`,
      `/exercises/${exerciseId}/applications/draft`,
      `/exercises/${exerciseId}/applications/applied`,
      `/exercises/${exerciseId}/applications/withdrawn`,
      // `/exercises/${exerciseId}/applications/${applicationId}`,
    ];

    // TODO - Complete the list of authenticates routes (above)

    // check we can't access each page when logged out
    cy.logout();
    routes.forEach((route) => {
      cy.visit(route).wait(1000);
      cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
    });
    // check we can access each page when logged in
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    cy.visit('/').wait(3000);
    routes.forEach((route) => {
      cy.visit(route).wait(3000); // need to wait for data to load
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
