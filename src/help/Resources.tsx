import React from 'react'
import { ResourceTypes } from '../../data'
import { Box, Chip, Typography, Stack } from '../theme'

type Props = {
  resourceTypes: ResourceTypes
}

const ResourcesHelp = ({ resourceTypes }: Props) => (
  <Stack spacing={1}>
    <Typography>
      Every resource is marked with a label indicating its type, giving
      indication on the organisation of the resource itself.
      <br /> Many resources have more than one type.
    </Typography>
    <Typography>
      There are several resource types, for different formats:
    </Typography>
    {Object.entries(resourceTypes).map(([resourceTypeId, resourceType]) => (
      <Box key={resourceTypeId}>
        <Chip
          // data-testid={timelineItemTypeTestId}
          label={resourceType.title}
          size="small"
        />{' '}
        <Typography component="span">{resourceType.description}</Typography>
      </Box>
    ))}
    <Typography>
      The path’s resources are suggestions.
      <br />
      Feel free to swap any of them with alternatives found in the{' '}
      <b>There&apos;s more</b> section, if those happened to feel more
      enjoyable.
    </Typography>
    <Typography>
      Some resources could present overlapping or repetition at times. It&apos;s
      okay to take only what fits best in one&apos;s own learning journey.
    </Typography>
  </Stack>
)

export default ResourcesHelp
