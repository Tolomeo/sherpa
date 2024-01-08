import createEmotionCache from '@emotion/cache'

// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export function createCache() {
  return createEmotionCache({ key: 'css', prepend: true })
}

export { CacheProvider } from '@emotion/react'
export type { EmotionCache } from '@emotion/react'
