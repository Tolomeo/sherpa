import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import paths from '../data/paths'
import { Header, Main, Typography, Container, Box, Grid } from '../src/theme'
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
        <title>The Learning Path</title>
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

      <Main>
        <Container>
          <Typography variant="h1">
            Welcome to <br />
            The Learning Path
          </Typography>
        </Container>

        <Box py={8}>
          <Container>
            <Grid container spacing={4}>
              <Grid item md={5}>
                <Box py={2}>
                  <Typography variant="body1" component="p" gutterBottom>
                    You are possibly here because of realising how valuable it
                    is to acquire new skills and to make the most out of those
                    you already master.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Although there are some amazing platforms providing high
                    quality paid educational content, the web is a wild place
                    and there is some equally stunning learning material
                    provided entirely for free.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    A challenge you may face is to find the right content among
                    hundreds of resources. <br /> You may not always know what
                    to start from or what to progress with. <br /> You may be
                    unsure about how newly acquired shiny pieces of knowledge
                    fit together.
                  </Typography>
                  <Typography variant="body1" component="p">
                    This project tries to solve those issues, providing you with
                    ordered lists of resources useful to learn on different
                    topics.
                    <br /> All of the resources are free and hand-picked to
                    create learning paths which aim to be as comprehensive and
                    consistent as possible.
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={5}>
                <PathsList paths={paths} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Main>
    </Box>
  )
}
