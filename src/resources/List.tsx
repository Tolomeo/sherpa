import React from 'react'
import { PopulatedAside } from '../../data'
import { Link, Typography, List, Box } from '../theme'
import styles from './Resources.module.scss'

type Props = {
  resources: PopulatedAside['resources']
}

const ResourcesList = ({ resources }: Props) => {
  return (
    <List>
      {resources.map((resource) => (
        <Box key={resource.url}>
          <Link href={resource.url} target="_blank" rel="noreferrer">
            <Typography variant="overline" color="text.secondary">
              {resource.source}
            </Typography>
            <Typography component="span" variant="h6" display="block">
              {resource.title}
            </Typography>
          </Link>
        </Box>
      ))}
    </List>
  )
}

export default ResourcesList
