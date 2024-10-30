import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ThemeOptions } from '@mui/material/styles'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export type ThemeMode = 'light' | 'dark'

const themePalette: Record<ThemeMode, ThemeOptions['palette']> = {
  light: {
    mode: 'light',
    primary: {
      main: '#9b51e0',
      dark: '#621AA8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6bdf',
      dark: '#da72ff',
      contrastText: '#ffffff',
    },
  },
  dark: {
    mode: 'dark',
    primary: {
      main: '#ff6bdf',
      dark: '#da72ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9b51e0',
      dark: '#621AA8',
      contrastText: '#ffffff',
    },
  },
}

const getThemeTokens = (mode: ThemeMode) =>
  createMuiTheme({
    palette: themePalette[mode],
    typography: {
      fontFamily: 'Poppins',
      h1: {
        fontSize: 'clamp(3rem, 2.0310rem + 4.1344vw, 6rem)',
        textTransform: 'uppercase',
        lineHeight: 1.1,
        textWrap: 'balance',
      },
      h2: {
        fontSize: 'clamp(1.875rem, 1.2694rem + 2.5840vw, 3.75rem)',
      },
      h3: {
        fontSize: 'clamp(1.5rem, 1.0155rem + 2.0672vw, 3rem)',
      },
      h4: {
        fontSize: 'clamp(1.35rem, 1.0997rem + 1.0680vw, 2.125rem)',
      },
      h5: {
        fontSize: 'clamp(1.125rem, 1.0039rem + 0.5168vw, 1.5rem)',
      },
      h6: {
        fontSize: 'clamp(1rem, 0.9596rem + 0.1723vw, 1.125rem)',
      },
      body1: {
        fontSize: 'clamp(0.875rem, 0.8346rem + 0.1723vw, 1rem)',
      },
      body2: {
        fontSize: 'clamp(0.75rem, 0.7096rem + 0.1723vw, 0.875rem)',
      },
      overline: {
        fontSize: 'clamp(0.6rem, 0.5516rem + 0.2067vw, 0.75rem)',
        lineHeight: 'normal',
      },
    },
  })

export const createTheme = (mode: ThemeMode) => {
  const themeTokens = getThemeTokens(mode)

  return createMuiTheme(themeTokens, {
    components: {
      MuiBackdrop: {
        defaultProps: {
          invisible: true,
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: themeTokens.palette.background.default,
            backgroundImage: 'none',
            color: themeTokens.palette.text.primary,
            zIndex: 1400,
          },
        },
      },
      MuiTimeline: {
        styleOverrides: {
          root: {
            margin: 0,
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
      MuiTimelineDot: {
        styleOverrides: {
          root: {
            '&:not(:empty)': {
              padding: 0,
            },
          },
        },
      },
      MuiTimelineItem: {
        styleOverrides: {
          positionRight: {
            '&::before': {
              display: 'none',
            },
          },
        },
      },
      MuiTimelineContent: {
        styleOverrides: {
          root: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
            '&:first-of-type': {
              paddingTop: 0,
            },
            '&:last-of-type': {
              paddingBottom: 0,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 36,
            justifyContent: 'center',
            marginInlineEnd: 16,
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            margin: 0,
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'none',
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: themeTokens.typography.overline.fontSize,
          },
          colorDefault: {
            borderColor: 'transparent',
          },
          iconColorDefault: {
            color: themeTokens.palette.grey[400],
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeSmall: {
            fontSize: '1rem',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            '&:last-child': {
              paddingBottom: themeTokens.spacing(2),
            },
          },
        },
      },
    },
  })
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

export const useThemeMode = (): [ThemeMode, (_: ThemeMode) => void] => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setModeValue] = useState<ThemeMode>(
    prefersDarkMode ? 'dark' : 'light',
  )

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeValue(newMode)
    setUserThemeModePreference(newMode)
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

  return [mode, setMode]
}

export const useTheme = () => {
  const [mode, setMode] = useThemeMode()
  const theme = useMemo(() => createTheme(mode), [mode])

  return {
    theme,
    mode,
    setMode,
  }
}
