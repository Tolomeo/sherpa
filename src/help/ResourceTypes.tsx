import React from 'react'
import { ResourceTypes } from '../../data'
import { Box, List, Stack, Chip, Typography } from '../theme'

type Props = {
  resourceTypes: ResourceTypes
}

const ResourceTypesList: React.FC<Props> = ({ resourceTypes }) => (
  <List bulleted={false}>
    {Object.entries(resourceTypes).map(([resourceTypeId, resourceType]) => (
      <Stack direction="column" spacing={1} key={resourceTypeId}>
        <Box>
          <Chip
            // data-testid={timelineItemTypeTestId}

            label={resourceType.title}
            size="small"
          />
        </Box>
        <Typography>{resourceType.description}</Typography>
      </Stack>
    ))}
  </List>
)

export default ResourceTypesList
