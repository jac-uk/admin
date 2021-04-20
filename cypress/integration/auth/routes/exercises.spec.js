/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

// TODO - Get a random exercise perhaps?
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
      switch (route) {
        case '/dashboard':
          cy.get('.govuk-heading-xl').contains('Your exercises');
          break;
        case '/exercises/new':
          cy.get('.govuk-heading-xl').contains('Create an exercise');
          break;
        case `/exercises/${exerciseId}`:
          cy.get('.govuk-heading-xl').contains('Lauren Test March 2020');
          break;
        case `/exercises/${exerciseId}/summary`:
          cy.get('.govuk-heading-l').contains('Website listing');
          break;
        case `/exercises/${exerciseId}/vacancy`:
          cy.get('.govuk-heading-l').contains('Vacancy information');
          break;
        case `/exercises/${exerciseId}/contacts`:
          cy.get('.govuk-heading-l').contains('JAC contacts');
          break;
        case `/exercises/${exerciseId}/timeline`:
          cy.get('.govuk-heading-l').contains('Timeline');
          break;
        case `/exercises/${exerciseId}/shortlisting`:
          cy.get('.govuk-heading-l').contains('Shortlisting methods');
          break;
        case `/exercises/${exerciseId}/eligibility`:
          cy.get('.govuk-heading-l').contains('Eligibility information');
          break;
        case `/exercises/${exerciseId}/working-preferences`:
          cy.get('.govuk-heading-l').contains('Working preferences');
          break;
        case `/exercises/${exerciseId}/assessment-options`:
          cy.get('.govuk-heading-l').contains('Assessment options');
          break;
        case `/exercises/${exerciseId}/downloads`:
          cy.get('.govuk-heading-l').contains('Downloads');
          break;
        case `/exercises/${exerciseId}/edit/name`:
          cy.get('.govuk-heading-l').contains('Update exercise name');
          break;
        case `/exercises/${exerciseId}/edit/summary`:
          cy.get('.govuk-heading-xl').contains('Website listing');
          break;
        case `/exercises/${exerciseId}/edit/vacancy`:
          cy.get('.govuk-heading-xl').contains('Vacancy information');
          break;
        case `/exercises/${exerciseId}/edit/contacts`:
          cy.get('.govuk-heading-xl').contains('Contacts');
          break;
        case `/exercises/${exerciseId}/edit/timeline`:
          cy.get('.govuk-heading-xl').contains('Timeline');
          break;
        case `/exercises/${exerciseId}/edit/shortlisting`:
          cy.get('.govuk-heading-xl').contains('Shortlisting methods');
          break;
        case `/exercises/${exerciseId}/edit/eligibility`:
          cy.get('.govuk-heading-xl').contains('Eligibility');
          break;
        case `/exercises/${exerciseId}/edit/working-preferences`:
          cy.get('.govuk-heading-xl').contains('Working preferences');
          break;
        case `/exercises/${exerciseId}/edit/assessment-options`:
          cy.get('.govuk-heading-xl').contains('Assessment options');
          break;
        case `/exercises/${exerciseId}/edit/downloads`:
          cy.get('.govuk-heading-xl').contains('Downloads');
          break;
      }
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});
