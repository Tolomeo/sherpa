import { paths } from '../../../data'

describe('Resources', () => {
  Object.entries(paths).forEach(([_, path]) => {
    describe(`"${path.title}" path resources`, () => {
      path.resources.forEach((pathResource) => {
        it(`"${pathResource.title}" [ ${pathResource.url} ]`, () => {
          cy.checkResourceHealth(pathResource)
        })
      })
    })

    describe(`"${path.title}" additional resources`, () => {
      path.extras.forEach((pathExtra) => {
        describe(`"${pathExtra.title}" additional resources`, () => {
          pathExtra.resources.forEach((pathExtraResource) => {
            it(`"${pathExtraResource.title}" [ ${pathExtraResource.url} ]`, () => {
              cy.checkResourceHealth(pathExtraResource)
            })
          })
        })
      })
    })
  })
})
