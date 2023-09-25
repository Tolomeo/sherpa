import React, { useEffect, useState, type ChangeEvent } from 'react'
import { Resource } from '../../data'
import { Link, Typography, Box, List, ListItem } from '../theme'
import { useResourceCompletion } from '../user'

type Props = {
  resources: Array<Resource>
}

const resourcesListTestId = 'resources.list'
const resourcesListItemTestId = 'resources.list.item'
const resourcesListItemLinkTestId = 'resources.list.item.link'
const resourcesListItemTitleTestId = 'resources.list.item.title'
const resourcesListItemSourceTestId = 'resources.list.item.source'

const ResourcesList = ({ resources }: Props) => {
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
    <Box data-testid={resourcesListTestId}>
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
            <Box data-testid={resourcesListItemTestId}>
              <Link
                data-testid={resourcesListItemLinkTestId}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                <Typography
                  data-testid={resourcesListItemSourceTestId}
                  variant="overline"
                  color="text.secondary"
                >
                  {resource.source}
                </Typography>
                <Typography
                  data-testid={resourcesListItemTitleTestId}
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

export default ResourcesList
