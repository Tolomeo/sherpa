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
} from '../../theme'
import { List as PathsList } from '../../paths'
import { usePathContext } from '../Provider'
import OrderedResources from './OrderedResources'
import UnorderedResources from './UnorderedResources'

const PathContent = () => {
  const {
    path: { hero, logo, title, prev, main, resources, children, next },
  } = usePathContext()

  return (
    <Stack spacing={8} pb={6}>
      <LayoutHero foreground={hero?.foreground} background={hero?.background}>
        {logo && <SvgImage svg={logo} />}
        <Typography variant="h1">
          The <Underline>{title}</Underline> path
        </Typography>
      </LayoutHero>

      <Stack spacing={12}>
        {prev && (
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
        )}

        {main && (
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
        )}

        {resources && (
          <LayoutContainer>
            <section>
              <Stack spacing={7}>
                <Typography variant="h3" component="h2">
                  Other trails
                </Typography>
                <Box>
                  <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={5}>
                    {resources.map((group, index) => (
                      <Stack spacing={2} key={index}>
                        <Typography component="h3" variant="h5">
                          {group.title}
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

        {children && (
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
                          <UnorderedResources resources={childPath.resources} />
                        )}
                      </Stack>
                    ))}
                  </Masonry>
                </Box>
              </Stack>
            </section>
          </LayoutContainer>
        )}

        {next && (
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
        )}
      </Stack>
    </Stack>
  )
}

export default PathContent
