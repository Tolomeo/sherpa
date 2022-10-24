import React, { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from './emotion'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import theme from './theme'

type ThemeMode = 'light' | 'dark'

type Props = {
  cache: EmotionCache
}

const ThemeProvider: React.FC<Props> = ({ children, cache }) => {
  const [mode, setMode] = useState<ThemeMode>('light')
  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}

export default ThemeProvider
