import Grid from '@mui/material/Grid'
import Container from '../Container'

type Props = {
  children?: React.ReactNode
}

const Villain = ({ children }: Props) => (
  <Container>
    <Grid container>
      <Grid item sm={9}>
        {children}
      </Grid>
    </Grid>
  </Container>
)

export default Villain
