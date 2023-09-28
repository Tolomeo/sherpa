import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Paths } from '../../data/paths'
import {
  LayoutHeader,
  LayoutDrawer,
  LayoutDrawerToggle,
  useLayoutContext,
  Stack,
  Typography,
} from '../../src/theme'
import { List as PathsList } from '../../src/paths'

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

interface Props {
  paths: Paths
}

const PathHeader = ({ paths }: Props) => {
  return (
    <>
      <LayoutHeader>
        <LayoutDrawerToggle />
      </LayoutHeader>

      <LayoutDrawer>
        <Stack spacing={12}>
          <nav>
            <Stack spacing={5}>
              <Typography variant="h5" component="p">
                Need a compass?
              </Typography>
              <PathsList paths={paths} />
            </Stack>
          </nav>

          <Stack spacing={7}>
            <Typography variant="h5" component="p">
              About paths
            </Typography>
            <Stack spacing={1}>
              <Typography>
                Every path in Sherpa could vary slightly depending on the
                differences among subjects and on their resources being designed
                by different authors, in different times and with different
                objectives in mind.
                <br />
                There are some recurring patterns nonetheless.
              </Typography>
              <Typography>
                When possible, paths will start with a{' '}
                <b>You want to come from</b> section, listing preparatory paths.
              </Typography>
              <Typography>
                <b>The path</b> is a list of resources, ordered in such a way to
                cover all the essentials, from beginner to intermediate/advanced
                level.
              </Typography>
              <Typography>
                The number of additional sections coming straight after can
                vary, but one will generally be able to find:
              </Typography>
              <Typography>
                <b>Fundamentals</b> with alternative resources to the ones in
                the path
              </Typography>
              <Typography>
                <b>Beyond basics</b> with advanced topics and in-depth analyses
              </Typography>
              <Typography>
                <b>How do they do it?</b> with example projects and practical
                tutorials
              </Typography>
              <Typography>
                <b>Nice to know</b> with curiosities and contextual information
              </Typography>
              <Typography>
                <b>Work smarter, not harder</b> with helpers and utility tools
              </Typography>
              <Typography>
                <b>Great bookmarks</b> with useful references and cheatsheets
              </Typography>
              <Typography>
                <b>Stay in the loop</b> with blogs, newletters and feeds to stay
                up to date
              </Typography>
              <Typography>
                When available, additional sub-paths will appear in a following{' '}
                <b>Short hikes</b> section
              </Typography>
              <Typography>
                Finally, paths will conclude with a{' '}
                <b>You could continue with</b> section, recommending paths to
                tackle next, when applicable
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <CloseLayoutDrawerOnRouteChange />
      </LayoutDrawer>
    </>
  )
}

export default PathHeader
