import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { Path, PathsList as TPathsList } from '../../data/paths'
import { getPath, getPathsList } from '../../data/paths/utils'
import {
  Layout,
  LayoutHeader,
  LayoutHero,
  LayoutContainer,
  LayoutDrawer,
  LayoutDrawerToggle,
  useLayoutContext,
  Box,
  Typography,
  Grid,
  Stack,
  Masonry,
  SvgImage,
  Underline,
} from '../../src/theme'
import { List as PathsList } from '../../src/paths'
import {
  Timeline as ResourcesTimeline,
  List as ResourcesList,
  groupResourcesByType,
  sortResources,
} from '../../src/resources'
import config from '../../src/config'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  path: Path
  paths: TPathsList
}

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths = config.topics.map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const path = getPath(params!.pathName)
  const paths = getPathsList(config.topics)

  return {
    props: {
      path,
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const PageHead = ({ path }: Pick<Props, 'path'>) => (
  <Head>
    <title>{`Sherpa: the ${path.title} path`}</title>
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

const CloseLayoutDrawerOnRouteChange = () => {
  const router = useRouter()
  const layout = useLayoutContext()

  useEffect(() => {
    router.events.on('routeChangeComplete', layout.closeDrawer)

    return () => {
      router.events.off('routeChangeComplete', layout.closeDrawer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

const drawerTestId = 'help-drawer'
const toggleDrawerTestId = 'help-drawer-toggle'
const pathResourcesTestId = 'path.resources'
const pathExtrasTestId = 'path.extras'
const pathLogo = 'path.logo'

export default function PathPage({ path, paths }: Props) {
  return (
    <>
      <PageHead path={path} />
      <Layout>
        <LayoutHeader>
          <LayoutDrawerToggle data-testid={toggleDrawerTestId} />
        </LayoutHeader>

        <main>
          <LayoutHero
            foreground={path.hero?.foreground}
            background={path.hero?.background}
          >
            {path.logo && <SvgImage svg={path.logo} data-testid={pathLogo} />}
            <Typography variant="h1">
              The <Underline>{path.title}</Underline> path
            </Typography>
          </LayoutHero>

          <Stack spacing={12} pt={5} pb={8}>
            {path.prev && (
              <LayoutContainer>
                <aside>
                  <Stack spacing={5}>
                    <Typography variant="h3" component="h2">
                      You want to come from
                    </Typography>
                    <PathsList paths={path.prev} bulleted spaced />
                  </Stack>
                </aside>
              </LayoutContainer>
            )}

            {path.main && (
              <LayoutContainer data-testid={pathResourcesTestId}>
                <Stack spacing={5}>
                  <Typography variant="h3" component="h2">
                    The path
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} md={8} xl={6}>
                      <ResourcesTimeline resources={path.main} />
                    </Grid>
                  </Grid>
                </Stack>
              </LayoutContainer>
            )}

            {path.resources && (
              <LayoutContainer>
                <section>
                  <Stack spacing={7}>
                    <Typography variant="h3" component="h2">
                      Other trails
                    </Typography>
                    <Box>
                      <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={5}>
                        {groupResourcesByType(path.resources).map(
                          (group, index) => (
                            <Stack
                              spacing={2}
                              data-testid={pathExtrasTestId}
                              key={index}
                            >
                              <Typography component="h3" variant="h5">
                                {group.title}
                              </Typography>
                              <ResourcesList
                                resources={sortResources(group.resources)}
                              />
                            </Stack>
                          ),
                        )}
                      </Masonry>
                    </Box>
                  </Stack>
                </section>
              </LayoutContainer>
            )}

            {path.children && (
              <LayoutContainer>
                <section>
                  <Stack spacing={7}>
                    <Typography variant="h3" component="h2">
                      Short hikes
                    </Typography>
                    <Box>
                      <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
                        {path.children.map((childPath, index) => (
                          <Stack spacing={2} key={index}>
                            <Typography variant="h5" component="h3">
                              {childPath.title}
                            </Typography>

                            {childPath.main && (
                              <ResourcesTimeline resources={childPath.main} />
                            )}

                            {childPath.resources && (
                              <ResourcesList
                                resources={sortResources(childPath.resources)}
                              />
                            )}
                          </Stack>
                        ))}
                      </Masonry>
                    </Box>
                  </Stack>
                </section>
              </LayoutContainer>
            )}

            {path.next && (
              <LayoutContainer>
                <aside>
                  <Stack spacing={5}>
                    <Typography variant="h3" component="h2">
                      You could continue with
                    </Typography>
                    <PathsList paths={path.next} bulleted spaced />
                  </Stack>
                </aside>
              </LayoutContainer>
            )}

            {path.notes && (
              <LayoutContainer>
                <footer>
                  {path.notes.map((note, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="text.disabled"
                      sx={{
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {note}
                    </Typography>
                  ))}
                </footer>
              </LayoutContainer>
            )}
          </Stack>

          <LayoutDrawer data-testid={drawerTestId}>
            <Stack spacing={12}>
              <nav>
                <Stack spacing={5}>
                  <Typography variant="h5" component="p">
                    Need a compass?
                  </Typography>
                  <PathsList paths={paths} spaced={false} />
                </Stack>
              </nav>

              <Stack spacing={7}>
                <Typography variant="h5" component="p">
                  About paths
                </Typography>
                <Stack spacing={1}>
                  <Typography>
                    Every path in Sherpa could vary slightly depending on the
                    differences among subjects and on their resources being
                    designed by different authors, in different times and with
                    different objectives in mind.
                    <br />
                    There are some recurring patterns nonetheless.
                  </Typography>
                  <Typography>
                    When possible, paths will start with a{' '}
                    <b>You want to come from</b> section, listing preparatory
                    paths.
                  </Typography>
                  <Typography>
                    <b>The path</b> is a list of resources, ordered in such a
                    way to cover all the essentials, from beginner to
                    intermediate/advanced level.
                  </Typography>
                  <Typography>
                    The number of additional sections coming straight after can
                    vary, but one will generally be able to find:
                  </Typography>
                  <Typography>
                    <b>Fundamentals</b> with alternative resources to the ones
                    in the path
                  </Typography>
                  <Typography>
                    <b>Beyond basics</b> with advanced topics and in-depth
                    analyses
                  </Typography>
                  <Typography>
                    <b>How do they do it?</b> with example projects and
                    practical tutorials
                  </Typography>
                  <Typography>
                    <b>Nice to know</b> with curiosities and contextual
                    information
                  </Typography>
                  <Typography>
                    <b>Work smarter, not harder</b> with helpers and utility
                    tools
                  </Typography>
                  <Typography>
                    <b>Great bookmarks</b> with useful references and
                    cheatsheets
                  </Typography>
                  <Typography>
                    <b>Stay in the loop</b> with blogs, newletters and feeds to
                    stay up to date
                  </Typography>
                  <Typography>
                    When available, additional sub-paths will appear in a
                    following <b>Short hikes</b> section
                  </Typography>
                  <Typography>
                    Finally, paths will conclude with a{' '}
                    <b>You could continue with</b> section, recommending paths
                    to tackle next, when applicable
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <CloseLayoutDrawerOnRouteChange />
          </LayoutDrawer>
        </main>
      </Layout>
    </>
  )
}
