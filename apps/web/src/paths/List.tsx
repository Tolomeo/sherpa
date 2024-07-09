import NextLink from 'next/link'
import type { PathTopic } from '@sherpa/data/path/schema'
import { List, ListItem, Link, Typography, Box, Underline } from '../theme'
import config from '../config'

type Props = Omit<React.ComponentProps<typeof List>, 'children'> & {
  paths?: string[]
}

const PathsList = ({ paths = config.paths.topics, ...props }: Props) => (
  <Box>
    <List {...props}>
      {paths.map((pathName) => (
        <ListItem marker={<ListItem.Bullet />} key={pathName}>
          <Box component="span">
            <NextLink href={`/paths/${pathName}`} passHref legacyBehavior>
              <Link>
                <Typography variant="h6" component="span">
                  The{' '}
                  <Underline>
                    {config.paths.topicsTitles[pathName as PathTopic]}
                  </Underline>{' '}
                  path
                </Typography>
              </Link>
            </NextLink>
          </Box>
        </ListItem>
      ))}
    </List>
  </Box>
)

export default PathsList
