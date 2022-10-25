import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from './emotion'
import createTheme, { ThemeMode } from './theme'

type ThemeContextValue = {
  setMode: (mode: ThemeMode) => void
  theme: Theme
} | null

const ThemeContext = createContext<ThemeContextValue>(null)

type Props = {
  cache: EmotionCache
}

const getUserThemeModePreference = () => {
  if (typeof window === 'undefined') return null

  const modePreference = window.localStorage.getItem('theme.preferences.mode')

  if (!modePreference) return null

  return modePreference as ThemeMode
}

const setUserThemeModePreference = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem('theme.preferences.mode', mode)
}

const ThemeProvider: React.FC<Props> = ({ children, cache }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setModeValue] = useState<ThemeMode>(
    prefersDarkMode ? 'dark' : 'light',
  )
  const theme = useMemo(() => createTheme(mode), [mode])

  const setMode = useCallback((mode: ThemeMode) => {
    setModeValue(mode)
    setUserThemeModePreference(mode)
  }, [])

  useEffect(() => {
    const userThemeModePreference = getUserThemeModePreference()

    if (userThemeModePreference) setModeValue(userThemeModePreference)
  }, [])

  useEffect(() => {
    const userThemeModePreference = getUserThemeModePreference()

    if (userThemeModePreference) return

    const themeMode = prefersDarkMode ? 'dark' : 'light'

    if (mode !== themeMode) setModeValue(themeMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersDarkMode])

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
