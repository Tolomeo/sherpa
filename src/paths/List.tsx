import React from 'react'
import NextLink from 'next/link'
import { PathsList as TPathsList } from '../../data'
import { List, Link, Typography, Box, Underline } from '../theme'

type Props = Omit<React.ComponentProps<typeof List>, 'children'> & {
  paths: TPathsList
}

const pathsListTestId = 'paths.list'
const pathsListItemTestId = 'paths.list.item'
const pathsListItemLinkTestId = 'paths.list.item.link'

const PathsList = ({ paths, ...props }: Props) => (
  <Box data-testid={pathsListTestId}>
    <List bulleted={false} {...props}>
      {Object.entries(paths).map(([pathName, path]) => (
        <Box key={pathName} data-testid={pathsListItemTestId} component="span">
          <NextLink href={`/paths/${pathName}`} passHref legacyBehavior>
            <Link data-testid={pathsListItemLinkTestId}>
              <Typography variant="h6">
                The <Underline>{path.title}</Underline> path
              </Typography>
            </Link>
          </NextLink>
        </Box>
      ))}
    </List>
  </Box>
)

export default PathsList
