/* eslint-disable import/no-unresolved */
import { defineConfig } from 'cypress'
import * as pathsReadUtils from '@sherpa/data/paths/read.js'
import * as resourcesReadUtils from '@sherpa/data/resources/read.js'

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
