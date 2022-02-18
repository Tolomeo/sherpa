import { paths, resources, deserializeResource } from '../../../data'

describe('Path pages', () => {
  Object.entries(paths).forEach(([pathKey, path]) => {
    describe(`The ${path.title} learning path page`, () => {
      before(() => {
        cy.visit(`${Cypress.config('baseUrl')}/paths/${pathKey}`)
      })

      it(`Renders a heading1 title, with the text "The ${path.title} learning path"`, () => {
        cy.get('h1').should('have.text', `The ${path.title} learning path`)
      })

      describe('Resources timeline', () => {
        let $timelineItems: Cypress.Chainable<JQuery<HTMLLIElement>>
        before(() => {
          $timelineItems = cy
            .get('ul[data-testid="resources.timeline"]')
            .find('li[data-testid="resources.timeline.item"]')
        })

        path.resources.forEach((resourceId, resourceIndex) => {
          const resource = deserializeResource(resources[resourceId])
          const resourceOrder = resourceIndex + 1

          it(`Renders "${resource.title}" as resource #${resourceOrder},
					and renders a link pointing at the resource url,
					and renders the title of the resource,
					and renders the source of the resource,
					and renders the types of the resource`, () => {
            const $timelineItem = $timelineItems.eq(resourceIndex)

            $timelineItem
              .find('a[data-testid="resources.timeline.item.link"]')
              .should('have.attr', 'href', resource.url)

            $timelineItem
              .find('[data-testid="resources.timeline.item.title"]')
              .should('have.text', resource.title)

            $timelineItem
              .find('[data-testid="resources.timeline.item.source"]')
              .should('have.text', resource.source)

            $timelineItem
              .find('[data-testid="resources.timeline.item.type"]')
              .each(($timelineItemType, timelineItemTypeIndex) => {
                expect($timelineItemType.text()).to.equal(
                  resource.type[timelineItemTypeIndex],
                )
              })
          })
        })
      })
    })
  })
})
