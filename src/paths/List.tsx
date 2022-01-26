import React from 'react'
import NextLink from 'next/link'
import { Paths } from '../../data'
import { List, Link, Typography } from '../theme'

type Props = {
  paths: Paths
}

const PathsList = ({ paths }: Props) => (
  <List>
    {Object.entries(paths).map(([pathName, path]) => (
      <NextLink key={pathName} href={`/paths/${pathName}`} passHref>
        <Link>
          <Typography variant="h6">The {path.title} learning path</Typography>
        </Link>
      </NextLink>
    ))}
  </List>
)

export default PathsList