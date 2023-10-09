import React from 'react'
import { Resource } from '../../../data'
import { Link, Typography, Box, List, ListItem } from '../../theme'

type Props = {
  resources: Array<Resource>
}

const UnorderedResources = ({ resources }: Props) => {
  return (
    <Box>
      <List>
        {resources.map((resource) => (
          <ListItem marker={<ListItem.Bullet />} key={resource.url}>
            <Box>
              <Link href={resource.url} target="_blank" rel="noreferrer">
                <Typography variant="overline" color="text.secondary">
                  {resource.source}
                </Typography>
                <Typography
                  component="span"
                  variant="h6"
                  display="block"
                  gutterBottom
                >
                  {resource.title}
                </Typography>
              </Link>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default UnorderedResources
