context('Window', () => {

  before(() => {
    cy.visit('/').wait(5000);
  });

  it('cy.title() - get the title', () => {
    cy.title().should('include', 'JAC Digital Platform');
  });

  it('sign in button exists', () => {
    cy.get('[data-cy="google-sign-in-button"]');
  });
  
  it('check notifications link', () => {
    cy.get('[data-cy=nav-notifications-link]')
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  it('check exercises link', () => {
    cy.get('[data-cy=nav-exercises-link]')
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

  it('check candidates link', () => {
    cy.get('[data-cy=nav-candidates-link]')
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`);
  });

});
