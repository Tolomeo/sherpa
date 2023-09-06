import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Container from '../Container'
import Graphics from './Graphics'

type Props = {
  children: React.ReactNode
  backgroundGradient?: string[]
  textColor?: string
}

const Backdrop = styled(Box)(
  ({ theme }) => `
  position: relative;
  padding-block-start: ${theme.spacing(6)};
`,
)

const Content = styled(Box)(
  ({ theme }) => `
	margin-block-end: ${theme.spacing(2)};

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

const Hero = ({ children, backgroundGradient, textColor }: Props) => {
  const theme = useTheme()
  const gradient = backgroundGradient || [
    theme.palette.primary.dark,
    theme.palette.primary.main,
  ]
  const background = `linear-gradient(360deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`
  const color = textColor || theme.palette.primary.contrastText

  return (
    <Backdrop sx={{ background }}>
      <Content sx={{ color }}>
        <Container>
          <Grid container>
            <Grid item md={9}>
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
