describe('Index page', () => {
  before(() => {
    cy.visit(Cypress.config('baseUrl')!)
    cy.injectAxe()
  })

  it('Passes automated accessibility checks', () => {
    cy.checkA11y()
  })
})
