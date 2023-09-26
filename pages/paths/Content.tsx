import { Path } from '../../data/paths'
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
import { PathProvider } from '../../src/path'
import {
  Timeline as ResourcesTimeline,
  List as ResourcesList,
  groupResourcesByType,
  sortResources,
} from '../../src/resources'
import config from '../../src/config'

interface Props {
  topic: (typeof config.topics)[number]
  path: Path
}

const PageContent = ({ path, topic }: Props) => {
  return (
    <PathProvider topic={topic} path={path}>
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

        <Stack spacing={12} pt={5} pb={8}>
          {path.prev && (
            <LayoutContainer>
              <aside>
                <Stack spacing={5}>
                  <Typography variant="h3" component="h2">
                    You want to come from
                  </Typography>
                  <PathsList paths={path.prev} />
                </Stack>
              </aside>
            </LayoutContainer>
          )}

          {path.main && (
            <LayoutContainer>
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
                          <Stack spacing={2} key={index}>
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
                  <PathsList paths={path.next} />
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
      </main>
    </PathProvider>
  )
}

export default PageContent
