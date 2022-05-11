import { paths, deserializePath } from '../../../data'

const baseUrl = Cypress.config('baseUrl')

describe('Path pages', () => {
  Object.entries(paths).forEach(([pathKey, serialisedPath]) => {
    const path = deserializePath(serialisedPath)

    describe(`The ${path.title} learning path page`, () => {
      before(() => {
        const pathUrl = `${baseUrl}/paths/${pathKey}`
        cy.visit(pathUrl)
      })

      it(`Renders a heading1 title, with "The ${path.title} sherpa" title as text`, () => {
        cy.get('h1').should('have.text', `The ${path.title} sherpa`)
      })

      describe('Path resources', () => {
        beforeEach(() => {
          cy.get('[data-testid="resources.timeline"]')
            .find(
              '[data-testid="resources.timeline.item"] a[data-testid="resources.timeline.item.link"]',
            )
            .as('pathResources')
        })

        path.resources.forEach((pathResource, pathResourceIndex) => {
          const resourceOrder = pathResourceIndex + 1

          describe(`#${resourceOrder} "${pathResource.title}"`, () => {
            beforeEach(() => {
              cy.get('@pathResources').eq(pathResourceIndex).as('pathResource')
            })

            it(`Renders a link pointing at "${pathResource.url}",
						and renders "${pathResource.title}" as resource title,
						and renders "${pathResource.source}" as resource source,
						and renders "${pathResource.type.join('", "')}" as resource types`, () => {
              cy.get('@pathResource').should(
                'have.attr',
                'href',
                pathResource.url,
              )

              cy.get('@pathResource')
                .find('[data-testid="resources.timeline.item.title"]')
                .should('have.text', pathResource.title)

              cy.get('@pathResource')
                .find('[data-testid="resources.timeline.item.source"]')
                .should('have.text', pathResource.source)

              cy.get('@pathResource')
                .find('[data-testid="resources.timeline.item.type"]')
                .each(($timelineItemType, timelineItemTypeIndex) => {
                  expect($timelineItemType.text()).to.equal(
                    pathResource.type[timelineItemTypeIndex],
                  )
                })
            })
          })
        })
      })

      describe('Additional resources', () => {
        beforeEach(() => {
          cy.get('[data-testid="path.extras"]').as('extras')
        })

        path.extras.forEach((pathExtra, pathExtraIndex) => {
          describe(`"${pathExtra.title}" additional resources`, () => {
            beforeEach(() => {
              cy.get('@extras')
                .eq(pathExtraIndex)
                .find('h2')
                .as('extraResourcesTitle')
              cy.get('@extras')
                .eq(pathExtraIndex)
                .find(
                  '[data-testid="resources.list"] a[data-testid="resources.list.item.link"]',
                )
                .as('extraResources')
            })

            it(`Renders a heading2 with "${pathExtra.title}" text`, () => {
              cy.get('@extraResourcesTitle').should(
                'have.text',
                pathExtra.title,
              )
            })

            pathExtra.resources.forEach((pathExtraResource) => {
              describe(`"${pathExtraResource.title}"`, () => {
                beforeEach(() => {
                  cy.get('@extraResources')
                    .filter(`[href="${pathExtraResource.url}"]`)
                    .as('extraResource')
                })

                it(`Renders "${pathExtraResource.title}" as resource title,
								and renders ${pathExtraResource.source} as resource source`, () => {
                  cy.get('@extraResource')
                    .find('[data-testid="resources.list.item.title"]')
                    .should('have.text', pathExtraResource.title)

                  cy.get('@extraResource')
                    .find('[data-testid="resources.list.item.source"]')
                    .should('have.text', pathExtraResource.source)
                })
              })
            })
          })
        })
      })
    })
  })
})
