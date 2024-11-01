import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Backdrop from '../../Backdrop'
import Container from '../container'
import Graphics from './Graphics'

interface Props {
  children: React.ReactNode
  foreground?: string
  background?: string[]
}

const Content = styled(Box)(
  ({ theme }) => `
	padding-block-end: ${theme.spacing(6)};

	${theme.breakpoints.up('md')} {
		padding-block-end: 0;
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

const Hero = ({ children, foreground, background }: Props) => {
  const theme = useTheme()
  const backdrop = background || [
    theme.palette.primary.dark,
    theme.palette.primary.main,
  ]
  const textColor = foreground || theme.palette.primary.contrastText

  return (
    <Backdrop
      backdrop={backdrop}
      sx={{ position: 'relative', paddingBlockStart: 6 }}
    >
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
