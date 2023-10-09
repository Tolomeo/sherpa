import config from '../../../src/config'

describe('Paths', () => {
  config.paths.topics.forEach((topicName) => {
    describe(topicName, () => {
      it(`Renders the ${topicName} path page with no errors`, () => {
        const pathUrl = `${Cypress.config('baseUrl')}/paths/${topicName}`
        cy.visit(pathUrl)
      })
    })
  })
})
