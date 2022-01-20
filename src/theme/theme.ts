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
  },
})

export default theme
