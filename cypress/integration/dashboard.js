context('Window', () => {

  it('check auth is required', () => {
    cy.logout(); // make sure we are logged out first!
    cy.visit('/dashboard').wait(5000);
    cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`); 
  });

  it('check auth allows page to load', () => {
    cy.login(Cypress.config().loginEmail, Cypress.config().loginPassword);
    cy.visit('/dashboard').wait(5000);
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`);
  });

  it('check page layout', () => {
    cy.get('h1').should('contain', 'Your exercises');
    // TODO - check data table is present
    // TODO - check CTA buttons are visible
    // TODO - check there are no console errors
  });
  
});
  