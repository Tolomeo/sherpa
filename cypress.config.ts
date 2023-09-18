import { defineConfig } from 'cypress'
import { getPath, getPaths, getPathsList } from './data/paths/utils'

export default defineConfig({
  video: false,
  chromeWebSecurity: false,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, _config) {
      on('task', {
        getPath(topicName: string) {
          return getPath(topicName)
        },
        getPaths(topicNames: string[]) {
          return getPaths(topicNames)
        },
        getPathsList(topicNames: string[]) {
          return getPathsList(topicNames)
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
    setupNodeEvents(on, _config) {
      on('task', {
        getPath(topicName: string) {
          return getPath(topicName)
        },
        getPaths(topicNames: string[]) {
          return getPaths(topicNames)
        },
        getPathsList(topicNames: string[]) {
          return getPathsList(topicNames)
        },
      })
    },
  },
})
