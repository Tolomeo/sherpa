import { paths } from '../../../data'

describe('Path pages', () => {
  Object.entries(paths).forEach(([pathKey, path]) => {
    describe(`The ${path.title} learning path page`, () => {
      before(() => {
        cy.visit(`${Cypress.config('baseUrl')}/paths/${pathKey}`)
      })

      it(`Renders a heading1 title, with the text "The ${path.title} learning path"`, () => {
        cy.get('h1').should('have.text', `The ${path.title} learning path`)
      })
    })
  })
})
