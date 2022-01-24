import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  paths,
  populatePath,
  PopulatedPath,
  hasPrevPaths,
  hasNextPaths,
  hasAdditionalResources,
} from '../../data'
import {
  Header,
  Main,
  Container,
  Box,
  Typography,
  Grid,
  Masonry,
} from '../../src/theme'
import { List as PathsList } from '../../src/paths'
import {
  Timeline as ResourcesTimeline,
  List as ResourcesList,
} from '../../src/resources'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  path: PopulatedPath
}

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths = Object.keys(paths).map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const path = paths[params!.pathName]
  const populatedPath = populatePath(path)

  return {
    props: {
      path: populatedPath,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ path }: Props) {
  return (
    <Box>
      <Head>
        <title>The {path.title} learning path</title>
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
        <Box pb={4}>
          <Container>
            <Grid container>
              <Grid item xs={12} md={8} xl={6}>
                <Typography variant="h1">
                  The <br /> <u>{path.title}</u> <br /> learning path
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {hasPrevPaths(path) && (
          <Box py={4}>
            <Container>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You want to come from
                </Typography>
                <PathsList paths={path.prev} />
              </aside>
            </Container>
          </Box>
        )}

        <Box pb={4}>
          <Container>
            <Grid container>
              <Grid item xs={12} md={8} xl={6}>
                <ResourcesTimeline resources={path.resources} />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {hasAdditionalResources(path) && (
          <Box py={4}>
            <Container>
              <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
                {path.asides.map((aside, index) => (
                  <Box key={index}>
                    <aside>
                      <Typography component="h2" variant="h5" gutterBottom>
                        {aside.title}
                      </Typography>
                      <ResourcesList resources={aside.resources} />
                    </aside>
                  </Box>
                ))}
              </Masonry>
            </Container>
          </Box>
        )}

        {hasNextPaths(path) && (
          <Box py={4}>
            <Container>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You could continue with
                </Typography>
                <PathsList paths={path.next} />
              </aside>
            </Container>
          </Box>
        )}
      </Main>
    </Box>
  )
}
// after={}
