import { paths } from '../../../data'

const baseUrl = Cypress.config('baseUrl')

describe('Path pages', () => {
  Object.entries(paths).forEach(([pathKey, path]) => {
    describe(`The ${path.title} path page`, () => {
      before(() => {
        const pathUrl = `${baseUrl}/paths/${pathKey}`
        cy.visit(pathUrl)
      })

      it(`Renders a heading1 title, with "The ${path.title} path" title as text`, () => {
        cy.get('h1').should('have.text', `The ${path.title} path`)
      })

      describe('Path resources', () => {
        beforeEach(() => {
          cy.get('[data-testid="resources.timeline"]')
            .find(
              '[data-testid="resources.timeline.item"] a[data-testid="resources.timeline.item.link"]',
            )
            .as('pathResources')
        })

        path.main.forEach((pathResource, pathResourceIndex) => {
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

        path.extra.forEach((pathExtra, pathExtraIndex) => {
          describe(`"${pathExtra.title}" additional resources`, () => {
            beforeEach(() => {
              cy.get('@extras')
                .eq(pathExtraIndex)
                .find('h2')
                .as('extraResourcesTitle')
            })

            it(`Renders a heading2 with "${pathExtra.title}" text`, () => {
              cy.get('@extraResourcesTitle').should(
                'have.text',
                pathExtra.title,
              )
            })

            describe(`"${pathExtra.title}" main resources`, () => {
              beforeEach(() => {
                cy.get('@extras')
                  .eq(pathExtraIndex)
                  .find(
                    '[data-testid="resources.timeline"] [data-testid="resources.timeline.item.link"]',
                  )
                  .as('extraResourcesMain')
              })

              pathExtra.main.forEach(
                (pathExtraMainResource, pathExtraMainResourceIndex) => {
                  describe(`"${pathExtraMainResource.title}" main resource`, () => {
                    beforeEach(() => {
                      cy.get('@extraResourcesMain')
                        .eq(pathExtraMainResourceIndex)
                        .as('extraMainResource')
                    })

                    it(`Renders "${
                      pathExtraMainResource.title
                    }" as resource title,
										and renders ${pathExtraMainResource.source} as resource source
										and renders "${pathExtraMainResource.type.join(
                      '", "',
                    )}" as resource types`, () => {
                      cy.get('@extraMainResource')
                        .find('[data-testid="resources.timeline.item.title"]')
                        .should('have.text', pathExtraMainResource.title)

                      cy.get('@extraMainResource')
                        .find('[data-testid="resources.timeline.item.source"]')
                        .should('have.text', pathExtraMainResource.source)

                      cy.get('@extraMainResource')
                        .find('[data-testid="resources.timeline.item.type"]')
                        .each(($timelineItemType, timelineItemTypeIndex) => {
                          expect($timelineItemType.text()).to.equal(
                            pathExtraMainResource.type[timelineItemTypeIndex],
                          )
                        })
                    })
                  })
                },
              )
            })

            describe(`"${pathExtra.title}" extra resources`, () => {
              beforeEach(() => {
                cy.get('@extras')
                  .eq(pathExtraIndex)
                  .find(
                    '[data-testid="resources.list"] [data-testid="resources.list.item.link"]',
                  )
                  .as('extraResourcesExtra')
              })

              pathExtra.extra.forEach((pathExtraExtraResource) => {
                describe(`"${pathExtraExtraResource.title}" extra resource`, () => {
                  beforeEach(() => {
                    cy.get('@extraResourcesExtra')
                      .filter(`[href="${pathExtraExtraResource.url}"]`)
                      .as('extraExtraResource')
                  })

                  it(`Renders "${
                    pathExtraExtraResource.title
                  }" as resource title,
									and renders ${pathExtraExtraResource.source} as resource source
									and renders "${pathExtraExtraResource.type.join(
                    '", "',
                  )}" as resource types`, () => {
                    cy.get('@extraExtraResource')
                      .find('[data-testid="resources.list.item.title"]')
                      .should('have.text', pathExtraExtraResource.title)

                    cy.get('@extraExtraResource')
                      .find('[data-testid="resources.list.item.source"]')
                      .should('have.text', pathExtraExtraResource.source)

                    cy.get('@extraExtraResource')
                      .find('[data-testid="resources.list.item.type"]')
                      .each(($timelineItemType, timelineItemTypeIndex) => {
                        expect($timelineItemType.text()).to.equal(
                          pathExtraExtraResource.type[timelineItemTypeIndex],
                        )
                      })
                  })
                })
              })
            })
          })
        })
      })

      /* describe('Help drawer', () => {
        before(() => {
          cy.get('[data-testid="help-drawer-toggle"]')
            .click()
            .get('[data-testid="help-drawer"]')
            .find('[data-testid="paths.list"]')
            .find(
              '[data-testid="paths.list.item"] a[data-testid="paths.list.item.link"]',
            )
            .as('pathLinks')
        })

        it(`Renders a list of all the available paths links`, () => {
          Object.entries(paths).forEach(([pathKey, path], pathIndex) => {
            const pathUrl = `/paths/${pathKey}`
            const pathLinkText = `The ${path.title} path`

            cy.get('@pathLinks')
              .eq(pathIndex)
              .should('have.attr', 'href', pathUrl)
              .should('have.text', pathLinkText)
          })
        })
      }) */
    })
  })
})
