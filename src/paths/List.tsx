import React from 'react'
import NextLink from 'next/link'
import { SerializedPaths } from '../../data'
import { List, Link, Typography } from '../theme'
import { Underline } from '../theme'

type Props = {
  paths: SerializedPaths
}

const PathsList = ({ paths }: Props) => (
  <List>
    {Object.entries(paths).map(([pathName, path]) => (
      <NextLink key={pathName} href={`/paths/${pathName}`} passHref>
        <Link>
          <Typography variant="h6">
            The <Underline>{path.title}</Underline> path
          </Typography>
        </Link>
      </NextLink>
    ))}
  </List>
)

export default PathsList
