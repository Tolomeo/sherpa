import React, { useState, useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from './emotion'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import createTheme, { ThemeMode } from './theme'

type Props = {
  cache: EmotionCache
}

const ThemeProvider: React.FC<Props> = ({ children, cache }) => {
  const [mode, setMode] = useState<ThemeMode>('light')
  const theme = useMemo(() => createTheme(mode), [mode])

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}

export default ThemeProvider
