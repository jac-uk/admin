/// <reference types="cypress" />

context('Actions', () => {
  // beforeEach(() => {
  //   cy.visit('https://admin-staging.judicialappointments.digital/dashboard')
  // })



  // it('tests whether a user can sign in', () => {
  // })
  //
  // it('clicks on Create an Exercise button', () => {
  //   cy.visit('https://admin-staging.judicialappointments.digital/sign-in')
  //   // cy.get('.govuk-grid-column-full > :nth-child(2) > .govuk-button').click()
  //   // cy.get('.text-right > .govuk-!-margin-right-1').click()
  //   cy.get('#main-content > div > div:nth-child(1) > div > div > a').click()
  //   cy.get('.govuk-heading-xl').should('have.text', ' Create an exercise ')
  // })

  it('clicks on what needs to be added and save and continue', () => {
    // cy.get('.text-right > .govuk-\!-margin-right-1').click()
    cy.visit('https://admin-staging.judicialappointments.digital/dashboard')
    cy.get('#main-content > div > div:nth-child(1) > div > div > a').click()
    cy.get('#exercise-name').type('Legal exercise test')
    cy.get('#is-more-info-needed__1').click()
    cy.get('#select-more-info__5').click()
    cy.get('.govuk-grid-column-two-thirds > .govuk-button').click()
    cy.get('.govuk-heading-xl').should('have.text', ' Vacancy information ')
  })

  it('fills out details of legal application', () => {
    cy.get('#type-of-exercise__3').click()
    cy.get('#is-court-or-tribunal__7').click()
    cy.get('#jurisdiction__11').click()
    cy.get('#is-statutory-consultation-waived__10').click()
    cy.get('#appointment-type__13').click()
    cy.get('#immediate-start').type('1')
    cy.get('#future-start').type('1')
    cy.get('#future-start').click()
    cy.get('#location').type('Here')
    cy.get('#welsh-requirement__15').click()
    cy.get('#role-summary').type('Something')
    cy.get("#main-content > div > div > form > div > div:nth-child(15) > div.ck.ck-reset.ck-editor.ck-rounded-corners > div.ck.ck-editor__main > div").type('Please work')
    // cy.get('.govuk-grid-column-two-thirds > .govuk-button').click()
    // cy.get('form > .govuk-grid-column-two-thirds').children
    cy.get('.govuk-grid-column-two-thirds > .govuk-button').click()
  })

})
