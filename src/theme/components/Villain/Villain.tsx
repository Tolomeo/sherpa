import camp from './camp.svg'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Container from '../Container'

type Props = {
  children: React.ReactNode
}

const Backdrop = styled('div')``

const Content = styled('div')(
  ({ theme }) => `
	${theme.breakpoints.up('xl')} {
		margin-block-end: -20vh;
	}
`,
)

const Graphics = styled('img')`
  position: relative;
  display: block;
  width: 100%;
  z-index: -1;
`

const Villain = ({ children }: Props) => (
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
    <Graphics src={camp.src} alt="" />
  </Backdrop>
)

export default Villain
