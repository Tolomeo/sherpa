import {
  hasSubPathExtraResources,
  isSubPath,
  isSubTopic,
  paths,
} from '../../../data'

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

      describe('Path extra resources', () => {
        beforeEach(() => {
          cy.get('[data-testid="path.extras"]').as('extras')
        })

        path.extra.forEach((pathExtra, pathExtraIndex) => {
          describe(`"${pathExtra.title}" extra resources`, () => {
            beforeEach(() => {
              cy.get('@extras').eq(pathExtraIndex).as('extra')
            })

            it(`Renders a heading2 with "${pathExtra.title}" text`, () => {
              cy.get('@extra').find('h2').should('have.text', pathExtra.title)
            })

            if (isSubPath(pathExtra)) {
              describe(`"${pathExtra.title}" sub path`, () => {
                beforeEach(() => {
                  cy.get('@extra')
                    .find(
                      '[data-testid="resources.timeline"] [data-testid="resources.timeline.item.link"]',
                    )
                    .as('extraResourcesMain')
                })

                describe(`"${pathExtra.title} subpath main resources"`, () => {
                  pathExtra.main.forEach(
                    (pathExtraMainResource, pathExtraMainResourceIndex) => {
                      it(`Renders "${
                        pathExtraMainResource.title
                      }" as resource title,
												and renders ${pathExtraMainResource.source} as resource source
												and renders "${pathExtraMainResource.type.join(
                          '", "',
                        )}" as resource types`, () => {
                        cy.get('@extraResourcesMain')
                          .eq(pathExtraMainResourceIndex)
                          .find('[data-testid="resources.timeline.item.title"]')
                          .should('have.text', pathExtraMainResource.title)

                        cy.get('@extraResourcesMain')
                          .eq(pathExtraMainResourceIndex)
                          .find(
                            '[data-testid="resources.timeline.item.source"]',
                          )
                          .should('have.text', pathExtraMainResource.source)

                        cy.get('@extraResourcesMain')
                          .eq(pathExtraMainResourceIndex)
                          .find('[data-testid="resources.timeline.item.type"]')
                          .each(($timelineItemType, timelineItemTypeIndex) => {
                            expect($timelineItemType.text()).to.equal(
                              pathExtraMainResource.type[timelineItemTypeIndex],
                            )
                          })
                      })
                    },
                  )
                })

                if (hasSubPathExtraResources(pathExtra)) {
                  describe(`"${pathExtra.title}" subpath extra resources`, () => {
                    beforeEach(() => {
                      cy.get('@extra')
                        .find(
                          '[data-testid="resources.list"] [data-testid="resources.list.item.link"]',
                        )
                        .as('subPathExtraResources')
                    })

                    pathExtra.extra.forEach((subPathExtraResource) => {
                      it(`Renders "${
                        subPathExtraResource.title
                      }" as resource title,
													and renders ${subPathExtraResource.source} as resource source
													and renders "${subPathExtraResource.type.join(
                            '", "',
                          )}" as resource types`, () => {
                        cy.get('@subPathExtraResources')
                          .filter(`[href="${subPathExtraResource.url}"]`)
                          .find('[data-testid="resources.list.item.title"]')
                          .should('have.text', subPathExtraResource.title)

                        cy.get('@subPathExtraResources')
                          .filter(`[href="${subPathExtraResource.url}"]`)
                          .find('[data-testid="resources.list.item.source"]')
                          .should('have.text', subPathExtraResource.source)

                        cy.get('@subPathExtraResources')
                          .filter(`[href="${subPathExtraResource.url}"]`)
                          .find('[data-testid="resources.list.item.type"]')
                          .each(($timelineItemType, timelineItemTypeIndex) => {
                            expect($timelineItemType.text()).to.equal(
                              subPathExtraResource.type[timelineItemTypeIndex],
                            )
                          })
                      })
                    })
                  })
                }
              })
            }

            if (isSubTopic(pathExtra)) {
              describe(`"${pathExtra.title}" sub topic`, () => {
                beforeEach(() => {
                  cy.get('@extra')
                    .find(
                      '[data-testid="resources.list"] [data-testid="resources.list.item.link"]',
                    )
                    .as('subtopicResources')
                })

                describe(`"${pathExtra.title} subtopic resources"`, () => {
                  pathExtra.resources.forEach((subtopicResource) => {
                    it(`Renders "${subtopicResource.title}" as resource title,
												and renders ${subtopicResource.source} as resource source
												and renders "${subtopicResource.type.join('", "')}" as resource types`, () => {
                      cy.get('@subtopicResources')
                        .filter(`[href="${subtopicResource.url}"]`)
                        .find('[data-testid="resources.list.item.title"]')
                        .should('have.text', subtopicResource.title)

                      cy.get('@subtopicResources')
                        .filter(`[href="${subtopicResource.url}"]`)
                        .find('[data-testid="resources.list.item.source"]')
                        .should('have.text', subtopicResource.source)

                      cy.get('@subtopicResources')
                        .filter(`[href="${subtopicResource.url}"]`)
                        .find('[data-testid="resources.list.item.type"]')
                        .each(($timelineItemType, timelineItemTypeIndex) => {
                          expect($timelineItemType.text()).to.equal(
                            subtopicResource.type[timelineItemTypeIndex],
                          )
                        })
                    })
                  })
                })
              })
            }
          })
        })
      })

      describe('Help drawer', () => {
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
      })
    })
  })
})
