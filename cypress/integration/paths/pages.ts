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

      it(`Renders a heading1 title, with the text "The ${path.title} learning path"`, () => {
        cy.get('h1').should('have.text', `The ${path.title} learning path`)
      })

      describe('Resources timeline', () => {
        let $timelineItems: Cypress.Chainable<JQuery<HTMLLIElement>>
        before(() => {
          $timelineItems = cy
            .get('[data-testid="resources.timeline"]')
            .find('[data-testid="resources.timeline.item"]')
        })

        path.resources.forEach((pathResource, pathResourceIndex) => {
          const resourceOrder = pathResourceIndex + 1

          it(`Renders "${pathResource.title}" as resource #${resourceOrder},
					and renders a link pointing at the resource url,
					and renders the title of the resource,
					and renders the source of the resource,
					and renders the types of the resource`, () => {
            const $timelineItem = $timelineItems.eq(pathResourceIndex)
            const $timelineItemLink = $timelineItem.find(
              `a[data-testid="resources.timeline.item.link"][href="${pathResource.url}"]`,
            )
            const $timelineItemTitle = $timelineItemLink.find(
              '[data-testid="resources.timeline.item.title"]',
            )
            const $timelineItemSource = $timelineItemLink.find(
              '[data-testid="resources.timeline.item.source"]',
            )
            const $timelineItemTypes = $timelineItemLink.find(
              '[data-testid="resources.timeline.item.type"]',
            )

            $timelineItemTitle.should('have.text', pathResource.title)
            $timelineItemSource.should('have.text', pathResource.source)
            $timelineItemTypes.each(
              ($timelineItemType, timelineItemTypeIndex) => {
                expect($timelineItemType.text()).to.equal(
                  pathResource.type[timelineItemTypeIndex],
                )
              },
            )
          })
        })
      })

      describe('Additional resources', () => {
        let $extras: Cypress.Chainable<JQuery<HTMLDivElement>>
        before(() => {
          $extras = cy.get('[data-testid="path.extras"]')
        })

        path.extras.forEach((pathExtra, pathExtraIndex) => {
          const pathExtraOrder = pathExtraIndex + 1

          it(`Renders "${pathExtra.title}" as additional resources group #${pathExtraOrder},
						and renders a heading2 with "${pathExtra.title}" text,
						and renders the related list of additional links`, () => {
            const $pathExtra = $extras.eq(pathExtraIndex)
            const $pathExtraTitle = $pathExtra.find('h2')
            const $pathExtraResources = $pathExtra
              .find('[data-testid="resources.list"]')
              .find('[data-testid="resources.list.item"]')

            $pathExtraTitle.should('have.text', pathExtra.title)

            pathExtra.resources.forEach((pathExtraResource) => {
              const $pathExtraResourceLink = $pathExtraResources.find(
                `[data-testid="resources.list.item.link"][href="${pathExtraResource.url}"]`,
              )
              const $pathExtraResourceTitle = $pathExtraResourceLink.find(
                '[data-testid="resources.list.item.title"]',
              )
              const $pathExtraResourceSource = $pathExtraResourceLink.find(
                '[data-testid="resources.list.item.source"]',
              )

              $pathExtraResourceSource.should(
                'contain.text',
                pathExtraResource.source,
              )
              $pathExtraResourceTitle.should(
                'contain.text',
                pathExtraResource.title,
              )
            })
          })
        })
      })
    })
  })
})
