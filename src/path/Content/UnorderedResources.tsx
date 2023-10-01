import React from 'react'
import { Resource } from '../../../data'
import { Link, Typography, Box, List, ListItem } from '../../theme'
import { usePathContext, usePathResourcesCompletion } from '../Provider'

type Props = {
  resources: Array<Resource>
}

const UnorderedResources = ({ resources }: Props) => {
  const [resourcesCompletion, { complete, uncomplete }] =
    usePathResourcesCompletion(resources)

  const isCompleted = (resource: string) => !!resourcesCompletion[resource]

  const toggleCompletion = (resource: string, completed: boolean) => {
    return completed ? complete(resource) : uncomplete(resource)
  }

  return (
    <Box>
      <List>
        {resources.map((resource) => (
          <ListItem
            marker={
              <ListItem.Checkbox
                onChange={(_, checked) =>
                  toggleCompletion(resource.url, checked)
                }
                checked={isCompleted(resource.url)}
                value={resource.url}
                inputProps={{ 'aria-label': resource.title }}
              />
            }
            key={resource.url}
          >
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
