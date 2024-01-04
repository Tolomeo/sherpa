import * as React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { EmotionCache } from '../src/theme';
import ThemeProvider, { createCache } from '../src/theme'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App(props: MyAppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO: check how to avoid
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <ThemeProvider cache={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
