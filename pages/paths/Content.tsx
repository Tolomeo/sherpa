import { Path } from '../../data/paths'
import { Resource } from '../../data/resources'
import {
  LayoutHero,
  LayoutContainer,
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
  OrderedResources,
  UnorderedResources,
  usePathContext,
} from '../../src/path'
import { groupResourcesByType, sortResources } from '../../src/resources'
import config from '../../src/config'

interface Props {
  topic: (typeof config.topics)[number]
  path: Path
  resources: Resource[]
}

const PathHero = () => {
  const { hero, logo, title } = usePathContext()

  return (
    <LayoutHero foreground={hero?.foreground} background={hero?.background}>
      {logo && <SvgImage svg={logo} />}
      <Typography variant="h1">
        The <Underline>{title}</Underline> path
      </Typography>
    </LayoutHero>
  )
}

const PathPrev = () => {
  const { prev } = usePathContext()

  if (!prev) return null

  return (
    <LayoutContainer>
      <aside>
        <Stack spacing={5}>
          <Typography variant="h3" component="h2">
            You want to come from
          </Typography>
          <PathsList paths={prev} />
        </Stack>
      </aside>
    </LayoutContainer>
  )
}

const PathMain = () => {
  const { main } = usePathContext()

  if (!main) return null

  return (
    <LayoutContainer>
      <Stack spacing={5}>
        <Typography variant="h3" component="h2">
          The path
        </Typography>
        <Grid container>
          <Grid item xs={12} md={8} xl={6}>
            <OrderedResources resources={main} />
          </Grid>
        </Grid>
      </Stack>
    </LayoutContainer>
  )
}

const PathResources = () => {
  const { resources } = usePathContext()

  if (!resources) return null

  return (
    <LayoutContainer>
      <section>
        <Stack spacing={7}>
          <Typography variant="h3" component="h2">
            Other trails
          </Typography>
          <Box>
            <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={5}>
              {groupResourcesByType(resources).map((group, index) => (
                <Stack spacing={2} key={index}>
                  <Typography component="h3" variant="h5">
                    {group.title}
                  </Typography>
                  <UnorderedResources
                    resources={sortResources(group.resources)}
                  />
                </Stack>
              ))}
            </Masonry>
          </Box>
        </Stack>
      </section>
    </LayoutContainer>
  )
}

const PathChildren = () => {
  const { children } = usePathContext()

  if (!children) return null

  return (
    <LayoutContainer>
      <section>
        <Stack spacing={7}>
          <Typography variant="h3" component="h2">
            Short hikes
          </Typography>
          <Box>
            <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
              {children.map((childPath, index) => (
                <Stack spacing={2} key={index}>
                  <Typography variant="h5" component="h3">
                    {childPath.title}
                  </Typography>

                  {childPath.main && (
                    <OrderedResources resources={childPath.main} />
                  )}

                  {childPath.resources && (
                    <UnorderedResources
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
  )
}

const PathNext = () => {
  const { next } = usePathContext()

  if (!next) return null

  return (
    <LayoutContainer>
      <aside>
        <Stack spacing={5}>
          <Typography variant="h3" component="h2">
            You could continue with
          </Typography>
          <PathsList paths={next} />
        </Stack>
      </aside>
    </LayoutContainer>
  )
}

const PageContent = ({ path }: Props) => {
  return (
    <main>
      <PathHero />

      <Stack spacing={12} pt={5} pb={8}>
        <PathPrev />

        {path.main && (
          <LayoutContainer>
            <Stack spacing={5}>
              <Typography variant="h3" component="h2">
                The path
              </Typography>
              <Grid container>
                <Grid item xs={12} md={8} xl={6}>
                  <OrderedResources resources={path.main} />
                </Grid>
              </Grid>
            </Stack>
          </LayoutContainer>
        )}

        <PathMain />

        <PathResources />

        <PathChildren />

        <PathNext />
      </Stack>
    </main>
  )
}

export default PageContent
