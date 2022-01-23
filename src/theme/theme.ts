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
        root: {
          ['&::before']: {
            display: 'none',
          },
        },
      },
    },
  },
})

export default theme
