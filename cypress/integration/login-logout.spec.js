context('Window', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('cy.title() - get the title', () => {
    // https://on.cypress.io/title
    cy.title().should('include', 'JAC Digital Platform')
  })
})
