import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Container from '../Container'
import Graphics from './Graphics'

interface Props {
  children: React.ReactNode
  foreground?: string
  background?: string[]
}

const Backdrop = styled(Box)(
  ({ theme }) => `
  position: relative;
  padding-block-start: ${theme.spacing(6)};
`,
)

const Content = styled(Box)(
  ({ theme }) => `
	margin-block-end: ${theme.spacing(6)};

	${theme.breakpoints.up('md')} {
		margin-block-end: 0;
		position: absolute;
		top: ${theme.spacing(4)};
		width: 100%;
	}

	${theme.breakpoints.up('lg')} {
		top: 33%;
		transform: translateY(-50%);
	}
`,
)

const createGradient = (colors: string[]) =>
  `linear-gradient(360deg, ${colors.reduce((colorStops, color, colorIndex) => {
    if (colorIndex === 0) return `${color} 0%,`

    if (colorIndex === colors.length - 1) return `${colorStops} ${color} 100%`

    return `${colorStops} ${color} ${
      ((colorIndex + 1) / colors.length) * 100
    }%,`
  }, '')})`

const Hero = ({ children, foreground, background }: Props) => {
  const theme = useTheme()
  const backgroundColors = background || [
    theme.palette.primary.dark,
    theme.palette.primary.main,
  ]
  const backgroundGradient = createGradient(backgroundColors)
  const textColor = foreground || theme.palette.primary.contrastText

  return (
    <Backdrop sx={{ background: backgroundGradient }}>
      <Content sx={{ color: textColor }}>
        <Container>
          <Grid container>
            <Grid item xs={12} md={9}>
              <Stack
                component="span"
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 4, sm: 4 }}
                alignItems="center"
              >
                {children}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Content>
      <Graphics />
    </Backdrop>
  )
}

export default Hero
