import React from 'react'
import NextLink from 'next/link'
import { Paths } from '../../data'
import { List, Link } from '../theme'

type Props = {
  paths: Paths
}

const PathsList = ({ paths }: Props) => (
  <List>
    {Object.entries(paths).map(([pathName, path]) => (
      <NextLink key={pathName} href={`/paths/${pathName}`}>
        <Link>The {path.title} learning path</Link>
      </NextLink>
    ))}
  </List>
)

export default PathsList
