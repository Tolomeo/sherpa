import { paths, deserializePath } from '../../../data'

describe('Path resources', () => {
  // Object.entries(paths).forEach(([_, serialisedPath]) => {
  Object.entries({
    // htmlcss: paths.htmlcss,
    webaccessibility: paths.webaccessibility,
    /* javascript: paths.javascript,
    typescript: paths.typescript,
    react: paths.react,
    reacttypescript: paths.reacttypescript,
    next: paths.next,
    node: paths.node,
    git: paths.git,
    neovim: paths.neovim, */
  }).forEach(([_, serialisedPath]) => {
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
