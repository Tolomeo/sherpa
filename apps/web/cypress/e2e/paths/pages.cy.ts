import config from '../../../src/config'

describe('Paths', () => {
  config.paths.topics.forEach((topicName) => {
    const pathUrl = `${Cypress.config('baseUrl')}/paths/${topicName}`

    describe(`${topicName} page`, () => {
      before(() => {
        cy.visit(pathUrl)
        cy.injectAxe()
      })

      it('Passes automated accessibility checks', () => {
        // skipping path notes smalltext
        cy.checkA11y({ exclude: '[data-cy="path.notes"]' })
      })
    })
  })
})
