import mountains from './mountains.svg'
import styles from './Hero.module.scss'
import { Container, Grid } from '@mui/material'

type Props = {
  children: React.ReactNode
}

const Hero = ({ children }: Props) => (
  <div className={styles.hero}>
    <div className={styles.hero__content}>
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={mountains.src} alt="" className={styles.hero__image} />
  </div>
)

export default Hero
