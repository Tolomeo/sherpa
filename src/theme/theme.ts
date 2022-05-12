import { createTheme } from '@mui/material/styles'
// import { red } from '@mui/material/colors'

let theme = createTheme({
  palette: {
    primary: {
      main: '#ff6bdf',
      dark: '#da72ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9b51e0',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontSize: 'clamp(3rem, 2.0310rem + 4.1344vw, 6rem)',
      textTransform: 'uppercase',
      lineHeight: 1.1,
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

theme = createTheme(theme, {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiTimelineItem: {
      styleOverrides: {
        positionRight: {
          ['&::before']: {
            display: 'none',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          /* paddingTop: 0,
          paddingBottom: 0, */
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
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
          minWidth: 28,
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
          fontSize: theme.typography.overline.fontSize,
        },
      },
    },
  },
})

export default theme
