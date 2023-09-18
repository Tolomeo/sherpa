import { SerializedResource, Path } from '../../../data'
import config from '../../../src/config'

const flattenPathResources = (path: Path) => {
  let pathResources = []

  const { main, resources, children } = path

  main && pathResources.push(...main)

  resources && pathResources.push(...resources)

  if (!children) return pathResources

  children.forEach((child) => {
    child.main && pathResources.push(...child.main)
    child.resources && pathResources.push(...child.resources)
  })

  return pathResources
}

// TODO: https://github.com/cypress-io/cypress-example-todomvc/compare/master...NicholasBoll:cypress-example-todomvc:feat/type-safe-alias

describe('Paths', () => {
  config.topics.forEach((topicName) => {
    describe(topicName, () => {
      before(() => {
        cy.task('getPath', topicName).as('path')
        cy.task('getSerializedResources', topicName).as(
          'pathSerializedResources',
        )
      })

      it("Uses all available topic's resources", () => {
        cy.get<Path>('@path').then((path) =>
          cy
            .get<SerializedResource[]>('@pathSerializedResources')
            .then((pathSerializedResources) => {
              const pathResources = flattenPathResources(path)
              const unusedResources = pathSerializedResources.filter(
                ({ url }) =>
                  !pathResources.find(
                    (pathResource) => pathResource.url === url,
                  ),
              )

              expect(unusedResources).to.be.empty
              expect(pathResources).to.have.lengthOf(
                pathSerializedResources.length,
              )
            }),
        )
      })

      it(`Renders the ${topicName} path page with no errors`, () => {
        const pathUrl = `${Cypress.config('baseUrl')}/paths/${topicName}`
        cy.visit(pathUrl)
      })
    })
  })
})
