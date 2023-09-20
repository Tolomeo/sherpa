import { SerializedResource, Path, SerializedPath } from '../../../data'
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

describe("Paths' resources", () => {
  config.topics.forEach((topicName) => {
    describe(topicName, () => {
      it("Lists non overlapping urls in 'main' and 'resources'", () => {
        cy.task<SerializedPath>('getSerializedPath', topicName).then(
          ({ main, resources }) => {
            if (main && resources) {
              const overlappingUrls = main.filter((url) =>
                resources.includes(url),
              )
              expect(overlappingUrls).to.be.empty
            }
          },
        )
      })

      it("Uses all available topic's resources", () => {
        cy.task<Path>('getPath', topicName).then((path) =>
          cy
            .task<SerializedResource[]>('getSerializedResources', topicName)
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
    })
  })
})
