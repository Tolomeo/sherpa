import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import ThemeDarkModeIcon from '@mui/icons-material/BrightnessLow'
import ThemeLightModeIcon from '@mui/icons-material/BrightnessHigh'
import { useThemeContext } from '../../../Provider'

const ThemeModeToggle = () => {
  const { mode, setMode } = useThemeContext()

  switch (mode) {
    case 'dark':
      return (
        <IconButton
          aria-label="Switch to light theme"
          color="primary"
          onClick={() => setMode('light')}
        >
          <ThemeDarkModeIcon />
        </IconButton>
      )
    case 'light':
    default:
      return (
        <IconButton
          aria-label="Switch to dark theme"
          color="primary"
          onClick={() => setMode('dark')}
        >
          <ThemeLightModeIcon />
        </IconButton>
      )
  }
}

export default ThemeModeToggle
