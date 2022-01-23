import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  paths,
  populatePath,
  PopulatedPath,
  hasPrevPaths,
  hasNextPaths,
} from '../../data'
import { Header, Main, Container, Box, Typography, Grid } from '../../src/theme'
import { List as PathsList } from '../../src/paths'
import { Timeline as ResourcesTimeline } from '../../src/resources'

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
                  The <u>{path.title}</u> learning&nbsp;path
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {hasPrevPaths(path) && (
          <Box py={4}>
            <Container>
              <aside>
                <Typography variant="h3" component="h2">
                  You want to come from
                </Typography>
                <PathsList paths={path.prev} />
              </aside>
            </Container>
          </Box>
        )}

        <Box py={4}>
          <Container>
            <Grid container>
              <Grid item xs={12} md={8} xl={6}>
                <ResourcesTimeline resources={path.resources} />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {hasNextPaths(path) && (
          <Box py={4}>
            <Container>
              <aside>
                <Typography variant="h3" component="h2">
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
// after={path.asides.map((aside, index) => (
//   <>
//     <H2>{aside.title}</H2>
//     <ResourcesList key={index} aside={aside} />
//   </>
// ))}
