import React, { useState, useMemo, createContext, useContext } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from './emotion'
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import createTheme, { ThemeMode } from './theme'

type ThemeContextValue = {
  setMode: (mode: ThemeMode) => void
  theme: Theme
} | null

const ThemeContext = createContext<ThemeContextValue>(null)

type Props = {
  cache: EmotionCache
}

const ThemeProvider: React.FC<Props> = ({ children, cache }) => {
  const [mode, setMode] = useState<ThemeMode>('dark')
  const theme = useMemo(() => createTheme(mode), [mode])
  const themeContext = useMemo<ThemeContextValue>(
    () => ({
      setMode,
      theme,
    }),
    [setMode, theme],
  )

  return (
    <CacheProvider value={cache}>
      <ThemeContext.Provider value={themeContext}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  )
}

export const useTheme = () => {
  const themeContext = useContext(ThemeContext)

  if (!themeContext)
    throw new Error('UseTheme must be used inside a ThemeProvider')

  return themeContext
}

export default ThemeProvider
