import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import paths from '../data/paths'
import { alternateSources } from '../data/resources'
import { Layout, Typography, Box, Grid } from '../src/theme'
import { IconLink as GithubIconLink } from '../src/github'
import { AlternateSourcesList } from '../src/resources'
import { List as PathsList } from '../src/paths'

export const getStaticProps = async (_: GetStaticPropsContext) => {
  return {
    props: {
      paths,
      alternateSources,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ paths, alternateSources }: Props) {
  return (
    <>
      <Head>
        <title>Sherpa: Climbing the learning curve</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#ff6bdf" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Layout>
        <Layout.Header>
          <GithubIconLink />
        </Layout.Header>

        <main>
          <Layout.Hero>
            <Typography variant="h1" color="primary.contrastText">
              Climbing the learning curve
            </Typography>
          </Layout.Hero>

          <Layout.Container>
            <Box py={2}>
              <Grid container>
                <Grid item sm={9}>
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
                </Grid>
              </Grid>
            </Box>
            <Box py={2}>
              <PathsList paths={paths} />
            </Box>
          </Layout.Container>

          <Box pt={6}>
            <Layout.Villain>
              <Box py={2}>
                <Typography variant="h2">
                  There are many paths to the top of the mountain
                </Typography>
              </Box>
              <Box py={2}>
                <Typography variant="body1" component="p" gutterBottom>
                  You don&apos;t like what you found here?
                </Typography>
                <Typography variant="body1" component="p">
                  You can try to have a look at other similar projects. <br />{' '}
                  Some of them were direct inspiration in the creation of
                  Sherpa!
                </Typography>
              </Box>
              <Box py={2}>
                <AlternateSourcesList resources={alternateSources} />
              </Box>
              <Box py={2}>
                <Typography variant="body1" component="p">
                  And many others! <br /> All it takes is the effort to search
                  online for what sparks one&apos;s interest.
                </Typography>
              </Box>
            </Layout.Villain>
          </Box>
        </main>
      </Layout>
    </>
  )
}
