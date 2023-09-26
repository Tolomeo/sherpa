import React, { useEffect, useState, type ChangeEvent } from 'react'
import { Resource } from '../../data'
import { Link, Typography, Box, List, ListItem } from '../theme'
import { useResourceCompletion } from '../user'

type Props = {
  resources: Array<Resource>
}

const UnorderedResources = ({ resources }: Props) => {
  const { areCompleted, setCompleted } = useResourceCompletion()
  const [resourcesCompletion, setResourcesCompletion] = useState<boolean[]>(
    resources.map(() => false),
  )

  useEffect(() => {
    syncResourcesCompletion()
  }, [resources, areCompleted])

  const syncResourcesCompletion = async () => {
    const resourcesUrls = resources.map(({ url }) => url)
    setResourcesCompletion(await areCompleted(resourcesUrls))
  }

  const setResourceCompleted = async (url: string) => {
    await setCompleted(url, 'docker')
    await syncResourcesCompletion()
  }

  return (
    <Box>
      <List>
        {resources.map((resource, resourceIndex) => (
          <ListItem
            marker={
              <ListItem.Checkbox
                onChange={(_, checked) => setResourceCompleted(resource.url)}
                checked={resourcesCompletion[resourceIndex]}
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
