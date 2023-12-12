import { defineConfig } from 'cypress'
import * as resourcesDataUtils from './data/resources/read'
import * as pathDataUtils from './data/paths/read'

export default defineConfig({
  video: false,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, _config) {
      on('task', {
        ...resourcesDataUtils,
        ...pathDataUtils,
        log(message) {
          console.log(message)

          return null
        },
        table(message) {
          console.table(message)

          return null
        },
      })
    },
    baseUrl: 'http://localhost:3000',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
