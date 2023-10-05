import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import { Paths } from '../data/paths'
import { getPathsList } from '../data/paths/utils'
import { Resource } from '../data/resources'
import { readResources } from '../data/resources/utils'
import {
  LayoutProvider,
  LayoutHeader,
  LayoutHero,
  LayoutContainer,
  Typography,
  Box,
  Grid,
} from '../src/theme'
import { AlternateSourcesList } from '../src/resources'
import { List as PathsList } from '../src/paths'
import config from '../src/config'

interface StaticProps {
  paths: Paths
  alternateSources: Resource[]
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  _: GetStaticPropsContext,
) => {
  const paths = getPathsList(config.topics as unknown as string[])
  const alternateSources = readResources('alternatives')

  return {
    props: {
      paths,
      alternateSources,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const PageHead = () => (
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
    <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#5bbad5" />
    <link rel="shortcut icon" href="/favicon.ico?v=1" />
    <meta name="msapplication-TileColor" content="#ff6bdf" />
    <meta name="theme-color" content="#ffffff" />
  </Head>
)

export default function Home({ paths, alternateSources }: Props) {
  return (
    <>
      <PageHead />
      <LayoutProvider>
        <LayoutHeader />

        <main>
          <LayoutHero>
            <Typography variant="h1" color="primary.contrastText">
              Climbing the learning curve
            </Typography>
          </LayoutHero>

          <LayoutContainer>
            <Box py={2}>
              <Grid container>
                <Grid item sm={9}>
                  <Typography variant="body1" component="p" gutterBottom>
                    Learning new things is amazing!
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Did you know there are lots of stunning online free
                    resources which can help you do that?
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Sherpa collects hundreds of those to create learning paths
                    and guide on the discovery of different topics. No
                    subscription required.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    All resources are free, hand-picked to create open and
                    comprehensive collections.
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
          </LayoutContainer>

          <Box py={6}>
            <LayoutContainer>
              <Box py={2}>
                <Typography variant="h2">
                  There are many paths to the top of the mountain
                </Typography>
              </Box>
              <Box py={2}>
                <Typography variant="body1" component="p" gutterBottom>
                  Not happy with what you found here? You can try to have a look
                  at other similar projects.
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
            </LayoutContainer>
          </Box>
        </main>
      </LayoutProvider>
    </>
  )
}
