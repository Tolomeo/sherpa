import { defineConfig } from 'cypress'

import * as pathsReadUtils from '@sherpa/data/paths/read'
import * as resourcesReadUtils from '@sherpa/data/resources/read'

export default defineConfig({
  video: false,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, _config) {
      on('task', {
        ...pathsReadUtils,
        ...resourcesReadUtils,
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
