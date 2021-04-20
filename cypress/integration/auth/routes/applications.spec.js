/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

// The IDs below need to be for suitable database records
// i.e. if the application document has no exerciseId defined all tests will fail anyway
// because of the bad data!
const applicationId = 'bqtwu9opOL1yXwSnhesc';
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

// The code below is experimental - the idea being to use database records selected at random
/*
import { getRandomString } from '../../../support/helpers';

// TODO - Get a random application
// const 30daysaYearInMS = 1000 * 60 * 60 * 24 * 365; // 1000 ms x 60 secs x 60 mins x 24 hours x 365 days
// const thirtyDatesInMS = 1000 * 60 * 60 * 24 * 30; // 1000 ms x 60 secs x 60 mins x 24 hours x 365 days
const getRoutes = (application) => {
  return [
    `/exercises/${application.exerciseId}/applications/draft`,
    `/exercises/${application.exerciseId}/applications/applied`,
    `/exercises/${application.exerciseId}/applications/withdrawn`,
    `/exercises/${application.exerciseId}/applications/draft/application/${application.Id}`,
    // TODO - Complete the list of routes
  ];
};

context('Routes - Applications', () => {

  before(() => {
    // before running our tests make sure we are logged out and on the homepage
    cy.logout();
    cy.visit('/').wait(3000); // in case the page content takes a while to render on the Browser
  });

  it('when logged out', () => {
    cy.logout();

    const randPrefix = getRandomString(1);
    cy.callFirestore('get', 'applications', {
      // where: ['exerciseId', '!=', ''], // just to exclude applications with no exerciseId
      // where: ['createdAt', '>=', new Date() - parseInt(Math.random() * aYearInMS)], // a random timestamp in the last 12 months
      // where: [
        // ['exerciseId', '!=', ''], // just to exclude applications with no exerciseId
        // ['createdAt', '>=', new Date() - parseInt(Math.random() * thirtyDatesInMS)], // a random timestamp in the last 30 days
      // ],
      where: ['id', '>=', randPrefix],
      orderByKey: ['id', 'DESC'],
      limit: 1,
    }).then((applications) => {

      // console.log('application', applications[0]);
      const routes = getRoutes(applications[0]);
      routes.forEach((route) => {
        cy.visit(route).wait(1000);
        cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
      });
    });
  });

  it('when logged in', () => {
    cy.login(Cypress.env('ADMIN_TEST_UID'));
    const routes = getRoutes();
    routes.forEach((route) => {
      cy.visit(route);
      cy.get('.govuk-button').contains('Add to favourites'); // so the test pauses until the page has finished loading
      cy.url().should('eq', `${Cypress.config().baseUrl}${route}`);
    });
  });

});

*/
