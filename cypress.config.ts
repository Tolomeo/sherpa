import { defineConfig } from 'cypress'
import {
  getPath,
  getPaths,
  getSerializedPath,
  getPathsList,
} from './data/paths/utils'
import { getSerializedResources, getResources } from './data/resources/utils'

export default defineConfig({
  video: false,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, _config) {
      on('task', {
        getPath(topicName: string) {
          return getPath(topicName)
        },
        getPaths(topicNames: string[]) {
          return getPaths(topicNames)
        },
        getSerializedPath(topicName: string) {
          return getSerializedPath(topicName)
        },
        getPathsList(topicNames: string[]) {
          return getPathsList(topicNames)
        },
        getResouces(topicName: string) {
          return getResources(topicName)
        },
        getSerializedResources(topicName: string) {
          return getSerializedResources(topicName)
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
