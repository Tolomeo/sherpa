import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

const createGradient = (colors: string[]) =>
  `linear-gradient(360deg, ${colors.reduce((colorStops, color, colorIndex) => {
    if (colorIndex === 0) return `${color} 0%,`

    if (colorIndex === colors.length - 1) return `${colorStops} ${color} 100%`

    return `${colorStops} ${color} ${
      ((colorIndex + 1) / colors.length) * 100
    }%,`
  }, '')})`

interface BackdropProps extends React.ComponentProps<typeof Box> {
  backdrop?: string[]
}

const Backdrop = ({ backdrop, children, sx, ...props }: BackdropProps) => {
  const theme = useTheme()
  const backgroundColors = backdrop || [
    theme.palette.primary.dark,
    theme.palette.primary.main,
  ]
  const backgroundGradient = createGradient(backgroundColors)

  return (
    <Box sx={{ ...sx, background: backgroundGradient }} {...props}>
      {children}
    </Box>
  )
}

export default Backdrop
