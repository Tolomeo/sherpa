/// <reference types="cypress" />
import { Resource } from '../../data'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Validates the health of a specified resource
       * @example cy.checkResourceHealth({ title: "Title of the resource", "url": "https://resource.com", "resource.com" })
       */
      checkResourceHealth(value: Resource): void
    }
  }
}

const resourceHealthCheckStrategy = {
  default(resource: Resource) {
    cy.request(resource.url).then((response) => {
      const document = new DOMParser().parseFromString(
        response.body,
        'text/html',
      )

      // if we received the document title in the response we validate against that
      if (document.title) {
        return expect(document.title).to.contain(resource.title)
      }

      // if we didn't receive the title in the response body
      // maybe it's a SPA and the title gets filled after the first render
      // so we visit the url and try
      cy.visit(resource.url)
      cy.get('title').should('contain.text', resource.title)
    })
  },
  youtube(resource: Resource) {
    // TODO: evaluate using youtube apis instead
    cy.setCookie('CONSENT', 'YES+cb.20220215-09-p0.en-GB+F+903', {
      domain: '.youtube.com',
    })

    return this.default(resource)
  },
  codepen(_resource: Resource) {
    cy.log('CODEPEN HEALTHCHECK NOT YET IMPLEMENTED')
  },
  udemy(_resource: Resource) {
    cy.log('UDEMY HEALTHCHECK NOT YET IMPLEMENTED')
  },
}

const checkResourceHealth = (resource: Resource) => {
  if (resource.source.match(/youtube\.com/)) {
    return resourceHealthCheckStrategy.youtube(resource)
  }

  if (resource.source.match(/codepen\.io/)) {
    return resourceHealthCheckStrategy.codepen(resource)
  }

  if (resource.source.match(/udemy\.com/)) {
    return resourceHealthCheckStrategy.udemy(resource)
  }

  return resourceHealthCheckStrategy.default(resource)
}

Cypress.Commands.add('checkResourceHealth', checkResourceHealth)
