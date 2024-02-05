import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose', 'tap'],
    setupFiles: ['dotenv/config'],
    watch: false,
		isolate: false
  },
})
