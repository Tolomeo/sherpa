import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['default', 'tap'],
    setupFiles: ['dotenv/config'],
    watch: false,
    isolate: false,
    chaiConfig: {
      truncateThreshold: 120,
    },
  },
})
