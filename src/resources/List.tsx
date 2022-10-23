import React from 'react'
import { Resource } from '../../data'
import { Link, Typography, List, Box, Stack } from '../theme'
import { ResourceTypeIcon, ResourceTypeLabel } from '../resourceTypes'

type Props = {
  resources: Array<Resource>
}

const resourcesListTestId = 'resources.list'
const resourcesListItemTestId = 'resources.list.item'
const resourcesListItemLinkTestId = 'resources.list.item.link'
const resourcesListItemTitleTestId = 'resources.list.item.title'
const resourcesListItemSourceTestId = 'resources.list.item.source'

const ResourcesList = ({ resources }: Props) => {
  return (
    <Box data-testid={resourcesListTestId}>
      <List>
        {resources.map((resource) => (
          <Box data-testid={resourcesListItemTestId} key={resource.url}>
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
              <Stack direction="row" spacing={1.5} component="span">
                {resource.type.map((type) => (
									<ResourceTypeLabel resourceType={type} key={type} />
                ))}
              </Stack>
            </Link>
          </Box>
        ))}
      </List>
    </Box>
  )
}

export default ResourcesList
