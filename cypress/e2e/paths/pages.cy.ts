import config from '../../../src/config'

describe('Path pages smoke testing', () => {
  config.topics.forEach((topicName) => {
    it(`Renders the ${topicName} path page with no errors`, () => {
      const pathUrl = `${Cypress.config('baseUrl')}/paths/${topicName}`
      cy.visit(pathUrl)
    })
  })
})
