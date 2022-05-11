import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import paths from '../data/paths'
import { Header, Hero, Typography, Container, Box, Grid } from '../src/theme'
import { List as PathsList } from '../src/paths'

export const getStaticProps = async (_: GetStaticPropsContext) => {
  return {
    props: {
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ paths }: Props) {
  return (
    <Box>
      <Head>
        <title>Sherpa</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Header />

      <main>
        <Hero>
          <Typography variant="h1" color="primary.contrastText">
            Climbing is easier with a Sherpa
          </Typography>
        </Hero>

        <Box py={8}>
          <Container>
            <Grid container spacing={4}>
              <Grid item md={5}>
                <Box py={2}>
                  <Typography variant="body1" component="p" gutterBottom>
                    Learning new things is amazing.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    It is cool to know there are many platforms providing high
                    quality paid educational content. It is even cooler to know
                    there are equally stunning online resources provided for
                    free!
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    The web is a chaotic place though, and one could be
                    sometimes confused by the quantity and variety of available
                    materials.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Sherpa aims to solve that issue, providing you with paths to
                    follow and plenty of references to help you on your journey
                    on the discovery of different technologies.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    All resources are free and were hand-picked to create
                    collections aiming to be as comprehensive and consistent as
                    possible.
                  </Typography>
                  <Typography variant="body1" component="p">
                    Happy learning!
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={5}>
                <PathsList paths={paths} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
    </Box>
  )
}
