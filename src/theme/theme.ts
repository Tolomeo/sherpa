import { createTheme } from '@mui/material/styles'
// import { red } from '@mui/material/colors'

let theme = createTheme({
  palette: {
    primary: {
      main: '#da72ff',
    },
    secondary: {
      main: '#9b51e0',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    overline: {
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
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:first-child': {
            paddingTop: 0,
          },
          '&:last-child': {
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
  },
})

export default theme
