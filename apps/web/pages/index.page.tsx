import type {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import { getTopic, type PopulatedPathData } from '@sherpa/data/path/index'
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

interface StaticProps {
  competitors: PopulatedPathData
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  _: GetStaticPropsContext,
) => {
  const competitors = await getTopic('competitors')

  if (!competitors) throw new Error('No competitors topic found')

  const populatedCompetitors = await competitors.get(true)

  return {
    props: {
      competitors: populatedCompetitors!,
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

export default function Home({ competitors }: Props) {
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
              <PathsList />
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
              {competitors.main && (
                <Box py={2}>
                  <AlternateSourcesList resources={competitors.main} />
                </Box>
              )}
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
