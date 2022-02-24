import { paths, deserializePath } from '../../../data'

describe('Path resources', () => {
  // Object.entries(paths).forEach(([_, serialisedPath]) => {
  Object.entries({ htmlcss: paths.htmlcss }).forEach(([_, serialisedPath]) => {
    const path = deserializePath(serialisedPath)

    describe('Path resources', () => {
      path.resources.forEach((pathResource) => {
        it(`"${pathResource.title}" [${pathResource.url}]`, () => {
          cy.checkResourceHealth(pathResource)
        })
      })
    })

    describe('Additional resources', () => {
      path.extras.forEach((pathExtra) => {
        describe(`"${pathExtra.title}" additional resources`, () => {
          pathExtra.resources.forEach((pathExtraResource) => {
            it(`"${pathExtraResource.title}" [${pathExtraResource.url}]`, () => {
              cy.checkResourceHealth(pathExtraResource)
            })
          })
        })
      })
    })
  })
})
