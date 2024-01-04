import React, { useMemo, createContext, useContext } from 'react'
import type { Theme } from '@mui/material/styles'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { EmotionCache } from './emotion'
import { CacheProvider } from './emotion'
import type { ThemeMode } from './theme'
import { useTheme } from './theme'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (_: ThemeMode) => void
  theme: Theme
} | null

const ThemeContext = createContext<ThemeContextValue>(null)

interface Props {
  cache: EmotionCache
  children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children, cache }) => {
  const { theme, mode, setMode } = useTheme()

  const themeContext = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      theme,
    }),
    [mode, setMode, theme],
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

export const useThemeContext = () => {
  const themeContext = useContext(ThemeContext)

  if (!themeContext)
    throw new Error('UseTheme must be used inside a ThemeProvider')

  return themeContext
}

export default ThemeProvider
