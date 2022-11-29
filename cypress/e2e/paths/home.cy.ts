import { paths, alternateSources } from '../../../data'

describe('Index page', () => {
  before(() => {
    cy.visit(Cypress.config('baseUrl')!)
  })

  describe('Paths list', () => {
    beforeEach(() => {
      cy.get('[data-testid="paths.list"]')
        .find(
          '[data-testid="paths.list.item"] a[data-testid="paths.list.item.link"]',
        )
        .as('pathLinks')
    })

    it('Renders a list of all the available paths links', () => {
      cy.get('@pathLinks').should('have.length', Object.keys(paths).length)

      Object.entries(paths).forEach(([pathKey, path], pathIndex) => {
        const pathUrl = `/paths/${pathKey}`
        const pathLinkText = `The ${path.title} path`

        cy.get('@pathLinks')
          .eq(pathIndex)
          .should('have.attr', 'href', pathUrl)
          .should('have.text', pathLinkText)
      })
    })
  })

  describe('Alternate sources list', () => {
    beforeEach(() => {
      cy.get('[data-testid="alternatives.list"]')
        .find(
          '[data-testid="alternatives.list.item"] a[data-testid="alternatives.list.item.link"]',
        )
        .as('alternativeLinks')
    })

    it('Renders a list of all the alternative sources links', () => {
      cy.get('@alternativeLinks').should(
        'have.length',
        Object.keys(alternateSources).length,
      )

      Object.entries(alternateSources).forEach(([_, source], sourceIndex) => {
        cy.get('@alternativeLinks')
          .eq(sourceIndex)
          .should('have.attr', 'href', source.url)
          .should('have.text', source.title)
      })
    })
  })
})
