import { paths } from '../../../data'

describe('Resources', () => {
  Object.entries(paths).forEach(([_, path]) => {
    describe(`"${path.title}" path resources`, () => {
      path.resources.forEach((pathResource) => {
        // this event will automatically be unbound when this test ends
        // returning false here prevents Cypress from
        // failing the test when an uncaught exception is thrown by the resource page
        cy.on('uncaught:exception', () => false)

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
              // this event will automatically be unbound when this test ends
              // returning false here prevents Cypress from
              // failing the test when an uncaught exception is thrown by the resource page
              cy.on('uncaught:exception', () => false)

              cy.checkResourceHealth(pathExtraResource)
            })
          })
        })
      })
    })
  })
})
