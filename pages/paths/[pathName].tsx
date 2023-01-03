import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  paths,
  Path,
  Paths,
  hasPrevPaths,
  hasNextPaths,
  hasOtherResources,
  resourceTypes,
  ResourceTypes,
  hasExtraResourcesMain,
  hasExtraResourcesExtra,
} from '../../data'
import {
  Layout,
  LayoutHeader,
  LayoutHero,
  LayoutVillain,
  LayoutContainer,
  Box,
  Typography,
  Grid,
  Stack,
  Masonry,
  Underline,
} from '../../src/theme'
import { List as PathsList } from '../../src/paths'
import {
  HelpDrawer,
  HelpDrawerToggle,
  Resources as ResourcesHelp,
  Paths as PathsHelp,
} from '../../src/help'
import {
  Timeline as ResourcesTimeline,
  List as ResourcesList,
} from '../../src/resources'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  paths: Paths
  path: Path
  resourceTypes: ResourceTypes
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

  return {
    props: {
      paths,
      path,
      resourceTypes,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const PageHead = ({ path }: Pick<Props, 'path'>) => (
  <Head>
    <title>Sherpa: the {path.title} path</title>
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

const pathResourcesTestId = 'path.resources'
const pathExtrasTestId = 'path.extras'

export default function PathPage({ path, paths, resourceTypes }: Props) {
  return (
    <>
      <PageHead path={path} />
      <Layout>
        <LayoutHeader>
          <HelpDrawerToggle />
        </LayoutHeader>

        <main>
          <LayoutHero>
            <Typography variant="h1" color="primary.contrastText">
              The <Underline>{path.title}</Underline> path
            </Typography>
          </LayoutHero>

          {hasPrevPaths(path) && (
            <LayoutContainer pb={8}>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You want to come from
                </Typography>
                <PathsList paths={path.prev} />
              </aside>
            </LayoutContainer>
          )}

          <LayoutContainer pb={8} data-testid={pathResourcesTestId}>
            <Typography component="h2" variant="h5" gutterBottom>
              The path
            </Typography>
            <Grid container>
              <Grid item xs={12} md={8} xl={6}>
                <ResourcesTimeline resources={path.main} />
              </Grid>
            </Grid>
          </LayoutContainer>

          {hasOtherResources(path) && (
            <LayoutContainer pb={4}>
              <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
                {path.extra.map((extra, index) => (
                  <Box data-testid={pathExtrasTestId} key={index}>
                    <aside>
                      <Typography component="h2" variant="h5" gutterBottom>
                        {extra.title}
                      </Typography>
                      {hasExtraResourcesMain(extra) && (
                        <ResourcesTimeline resources={extra.main} />
                      )}
                      {hasExtraResourcesExtra(extra) && (
                        <ResourcesList resources={extra.extra} />
                      )}
                    </aside>
                  </Box>
                ))}
              </Masonry>
            </LayoutContainer>
          )}

          <LayoutVillain>
            {hasNextPaths(path) && (
              <Box py={4}>
                <aside>
                  <Typography variant="h3" component="h2" gutterBottom>
                    You could continue with
                  </Typography>
                  <PathsList paths={path.next} />
                </aside>
              </Box>
            )}
          </LayoutVillain>

          <HelpDrawer>
            <Stack spacing={4}>
              <Typography variant="h5" component="p">
                Need a compass?
              </Typography>
              <Box pb={3}>
                <PathsList paths={paths} spaced={false} />
              </Box>
              <Typography variant="h5" component="p">
                About paths
              </Typography>
              <Box pb={3}>
                <PathsHelp />
              </Box>
              <Typography variant="h5" component="p">
                About resources
              </Typography>
              <Box>
                <ResourcesHelp resourceTypes={resourceTypes} />
              </Box>
            </Stack>
          </HelpDrawer>
        </main>
      </Layout>
    </>
  )
}
