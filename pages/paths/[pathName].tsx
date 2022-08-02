import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  paths,
  Path,
  Paths,
  hasPrevPaths,
  hasNextPaths,
  hasExtras,
  resourceTypes,
  ResourceTypes,
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
import { IconLink as GithubIconLink } from '../../src/github'
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
          <GithubIconLink />
        </LayoutHeader>

        <main>
          <LayoutHero>
            <Typography variant="h1" color="primary.contrastText">
              The <Underline>{path.title}</Underline> path
            </Typography>
          </LayoutHero>

          {hasPrevPaths(path) && (
            <LayoutContainer pb={4}>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You want to come from
                </Typography>
                <PathsList paths={path.prev} />
              </aside>
            </LayoutContainer>
          )}

          <LayoutContainer pb={4} data-testid={pathResourcesTestId}>
            <Grid container>
              <Grid item xs={12} md={8} xl={6}>
                <ResourcesTimeline resources={path.resources} />
              </Grid>
            </Grid>
          </LayoutContainer>

          {hasExtras(path) && (
            <LayoutContainer pb={4}>
              <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
                {path.extras.map((extra, index) => (
                  <Box data-testid={pathExtrasTestId} key={index}>
                    <aside>
                      <Typography component="h2" variant="h5" gutterBottom>
                        {extra.title}
                      </Typography>
                      <ResourcesList resources={extra.resources} />
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
            <Stack spacing={3}>
              <Typography variant="h5" component="p">
                Need a compass?
              </Typography>
              <PathsList paths={paths} spaced={false} />
              <Stack spacing={2}>
                <Typography variant="h6" component="p">
                  About paths
                </Typography>
                <PathsHelp />
                <Typography variant="h6" component="p">
                  About resources
                </Typography>
                <ResourcesHelp resourceTypes={resourceTypes} />
              </Stack>
            </Stack>
          </HelpDrawer>
        </main>
      </Layout>
    </>
  )
}
