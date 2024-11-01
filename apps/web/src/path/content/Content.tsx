import { useMemo } from 'react'
import config from '../../config'
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
  Alert,
  AlertTitle,
} from '../../theme'
import { List as PathsList } from '../../paths'
import { groupResourcesByType } from '../utils'
import { usePathContext } from '../Provider'
import OrderedResources from './OrderedResources'
import UnorderedResources from './UnorderedResources'

const PathContent = () => {
  const { path } = usePathContext()

  const title = config.paths.topicsTitles[path.name]
  const pathResourcesGroups = useMemo(() => {
    if (!path.resources) return null

    return groupResourcesByType(path.resources).map(({ type, resources }) => ({
      type,
      resources,
    }))
  }, [path.resources])

  return (
    <main>
      <Stack spacing={8} pb={6}>
        <LayoutHero
          foreground={path.hero?.foreground}
          background={path.hero?.background}
        >
          {path.logo && <SvgImage svg={path.logo} />}
          <Typography variant="h1">
            The <Underline>{title}</Underline> path
          </Typography>
        </LayoutHero>

        {path.status !== 'published' && (
          <LayoutContainer>
            <aside aria-label="Status">
              <Alert severity="warning" variant="outlined">
                <AlertTitle>This path is in {path.status} state.</AlertTitle> It
                is incomplete, and its contents may change.
              </Alert>
            </aside>
          </LayoutContainer>
        )}

        <Stack spacing={12}>
          {path.prev && (
            <LayoutContainer>
              <aside aria-label="You want to come from">
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
                    <OrderedResources resources={path.main} />
                  </Grid>
                </Grid>
              </Stack>
            </LayoutContainer>
          )}

          {pathResourcesGroups && (
            <LayoutContainer>
              <section>
                <Stack spacing={7}>
                  <Typography variant="h3" component="h2">
                    Other trails
                  </Typography>
                  <Box>
                    <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={5}>
                      {pathResourcesGroups.map((group, index) => (
                        <Stack spacing={2} key={index}>
                          <Typography component="h3" variant="h5">
                            {config.resources.categoriesTitles[group.type]}
                          </Typography>
                          <UnorderedResources resources={group.resources} />
                        </Stack>
                      ))}
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
                            {config.paths.topicsTitles[childPath.name]}
                          </Typography>

                          {childPath.main && (
                            <OrderedResources resources={childPath.main} />
                          )}

                          {childPath.resources && (
                            <UnorderedResources
                              resources={childPath.resources}
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
              <aside aria-label="You could continue with">
                <Stack spacing={5}>
                  <Typography variant="h3" component="h2">
                    You could continue with
                  </Typography>
                  <PathsList paths={path.next} />
                </Stack>
              </aside>
            </LayoutContainer>
          )}
        </Stack>
      </Stack>
    </main>
  )
}

export default PathContent
