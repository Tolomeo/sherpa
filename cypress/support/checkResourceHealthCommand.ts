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

const resourceCheckStrategy = {
  visit(resource: Resource) {
    cy.visit(resource.url)
    cy.get('title').should('contain.text', resource.title)
  },
  request(resource: Resource) {
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
      return this.visit(resource)
    })
  },
  notImplemented(resource: Resource) {
    cy.log(`Resource check not implemented for ${resource.source}`)
  },
}

const checkResourceHealth = (resource: Resource) => {
  const host = new URL(resource.url).hostname.replace(/^www./, '')

  switch (host) {
    case 'youtube.com':
      // skipping consent check page
      // TODO: evaluate using youtube apis instead?
      cy.setCookie('CONSENT', 'YES+cb.20220215-09-p0.en-GB+F+903', {
        domain: '.youtube.com',
      })
      return resourceCheckStrategy.request(resource)
    case 'usehooks-ts.com': // this one weirdly gives 404 on first load
      return resourceCheckStrategy.visit(resource)
    case 'codepen.io':
    case 'udemy.com':
      return resourceCheckStrategy.notImplemented(resource)
    default:
      return resourceCheckStrategy.request(resource)
  }
}

Cypress.Commands.add('checkResourceHealth', checkResourceHealth)
