import React from 'react'
import { ResourceTypes } from '../../data'
import { Box, Chip, Typography, Stack } from '../theme'
import { ResourceTypeLabel } from '../resourceTypes'

type Props = {
  resourceTypes: ResourceTypes
}

const ResourcesHelp = ({ resourceTypes }: Props) => (
  <Stack spacing={1}>
    <Typography>
      Every resource is labelled based on its type, giving indication on the
      organisation of the resource itself.
      <br /> Many resources have more than one type.
    </Typography>
    <Typography>
      There are several resource types, for different formats:
    </Typography>
    {Object.entries(resourceTypes).map(([resourceTypeId, resourceType]) => (
      <Box key={resourceTypeId}>
        <ResourceTypeLabel
          // data-testid={timelineItemTypeTestId}
          resourceType={resourceType.title}
        />{' '}
        <Typography component="span">{resourceType.description}</Typography>
      </Box>
    ))}
    <Typography>
      <b>There&apos;s more</b> offers valid alternatives to the default
      resources of each path. Feel free to choose what works best and shape your
      very own learning journey.
    </Typography>
  </Stack>
)

export default ResourcesHelp
