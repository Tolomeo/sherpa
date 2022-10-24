import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Container from '../Container'
import Graphics from './Graphics'

type Props = {
  children: React.ReactNode
}

const Backdrop = styled('div')(
  ({ theme }) => `
  position: relative;
  padding-block-start: ${theme.spacing(4)};
  background: linear-gradient(360deg, ${theme.palette.primary.dark} 0%, ${
    theme.palette.primary.main
  } 100%);
`,
)

const Content = styled('div')(
  ({ theme }) => `
	margin-block-end: ${theme.spacing(2)};

	${theme.breakpoints.up('sm')} {
		margin-block-end: 0;
		position: absolute;
		top: ${theme.spacing(4)};
		width: 100%;
	}
	
	${theme.breakpoints.up('md')} {
		top: 33%;
		transform: translateY(-50%);
	}
`,
)

const Hero = ({ children }: Props) => (
  <Backdrop>
    <Content>
      <Container>
        <Grid container>
          <Grid item sm={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Content>
    <Graphics />
  </Backdrop>
)

export default Hero
