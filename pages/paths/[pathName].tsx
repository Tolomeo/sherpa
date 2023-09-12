import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { Path, PathsList as TPathsList } from '../../data/paths'
import { getPath, getPathsList } from '../../data/paths/data'
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
} from '../../src/resources'

const pathPages = [
  'uidesign',
  'htmlcss',
  'webaccessibility',
  'javascript',
  'typescript',
  'react',
  'next',
  'npm',
  'node',
  'commandline',
  'docker',
  'git',
  'python',
  'regex',
  'neovim',
  'lua',
]

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  path: Path
  paths: TPathsList
}

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths = pathPages.map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const path = getPath(params!.pathName)
  const paths = getPathsList(pathPages)

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
            {path.logo && <SvgImage svg={path.logo} />}
            <Typography variant="h1">
              The <Underline>{path.title}</Underline> path
            </Typography>
          </LayoutHero>

          <pre>{JSON.stringify(path, null, 2)}</pre>

          {path.prev && (
            <LayoutContainer pb={8}>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You want to come from
                </Typography>
                <PathsList paths={path.prev} />
              </aside>
            </LayoutContainer>
          )}

          {path.main && (
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
          )}

          {path.resources && (
            <LayoutContainer pb={4}>
              <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
                {groupResourcesByType(path.resources).map((group, index) => (
                  <Box data-testid={pathExtrasTestId} key={index}>
                    <aside>
                      <Typography component="h2" variant="h5" gutterBottom>
                        {group.title}
                      </Typography>
                      <ResourcesList resources={group.resources} />
                    </aside>
                  </Box>
                ))}
              </Masonry>
            </LayoutContainer>
          )}

          {path.next && (
            <LayoutContainer pt={4} pb={6}>
              <aside>
                <Typography variant="h3" component="h2" gutterBottom>
                  You could continue with
                </Typography>
                <PathsList paths={path.next} />
              </aside>
            </LayoutContainer>
          )}

          {path.notes && (
            <LayoutContainer pt={4} pb={6}>
              <footer>
                {path.notes.map((note, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.disabled"
                    dangerouslySetInnerHTML={{ __html: note }}
                  ></Typography>
                ))}
              </footer>
            </LayoutContainer>
          )}

          <pre>{JSON.stringify(paths, null, 2)}</pre>

          <LayoutDrawer data-testid={drawerTestId}>
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
                    The path itself is a list of resources, ordered in such a
                    way to cover all the essentials, from beginner to
                    intermediate/advanced level.
                  </Typography>
                  <Typography>
                    The number of additional sections coming straight after can
                    vary, but one will generally be able to find:
                  </Typography>
                  <Typography>
                    <b>There&apos;s more</b> with alternative resources to the
                    ones in the path
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
                    <b>Great bookmarks</b> with references, cheatsheets and
                    utility tools
                  </Typography>
                  <Typography>
                    <b>Stay in the loop</b> with blogs, newletters and feeds to
                    stay up to date
                  </Typography>
                  <Typography>
                    When possible, paths will conclude with a{' '}
                    <b>You could continue with</b> section, recommending next
                    steps.
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <CloseLayoutDrawerOnRouteChange />
          </LayoutDrawer>
        </main>
      </Layout>
    </>
  )
}
