import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['default', 'tap'],
    setupFiles: ['dotenv/config', 'vitest.setup'],
    watch: false,
    isolate: false,
    chaiConfig: {
      truncateThreshold: 120,
    },
  },
})
