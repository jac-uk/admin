context('Window', () => {

  before(() => {
    cy.visit('/').wait(5000);
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

  it('login auto-redirect', () => {
    cy.login();
    cy.reload();
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`); 
  });

  // it('logout auto-redirect', () => {
  //   cy.logout();
  //   cy.reload();
  //   cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`); 
  // });

});
