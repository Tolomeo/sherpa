import React from 'react'
import NextLink from 'next/link'
import { Path, Paths } from '../../data'
import { List, ListItem, Link, Typography, Box, Underline } from '../theme'
import config from '../config'

type Props = Omit<React.ComponentProps<typeof List>, 'children'> & {
  paths: Paths
}

const pathsListTestId = 'paths.list'
const pathsListItemTestId = 'paths.list.item'
const pathsListItemLinkTestId = 'paths.list.item.link'

const PathsList = ({ paths, ...props }: Props) => (
  <Box data-testid={pathsListTestId}>
    <List {...props}>
      {Object.entries(paths).map(([pathName, path]) => (
        <ListItem marker={<ListItem.Bullet />} key={pathName}>
          <Box data-testid={pathsListItemTestId} component="span">
            <NextLink href={`/paths/${pathName}`} passHref legacyBehavior>
              <Link data-testid={pathsListItemLinkTestId}>
                <Typography variant="h6" component="span">
                  The{' '}
                  <Underline>
                    {/*TODO*/}
                    {config.paths.topicsTitles[path.topic as Path['topic']]}
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
