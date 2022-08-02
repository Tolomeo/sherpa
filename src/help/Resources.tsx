import React from 'react'
import { ResourceTypes } from '../../data'
import { Box, Chip, Typography, Stack } from '../theme'

type Props = {
  resourceTypes: ResourceTypes
}

const ResourcesHelp = ({ resourceTypes }: Props) => (
  <Stack spacing={1}>
    <Typography>
      Every resource is marked with a label indicating its type.
      <br />
      That is useful to have an idea of the structure of the resource itself and
      the learning goals it provides help with. A resource can have more than
      one type assigned.
    </Typography>
    <Typography>
      The resource type provides indication of how a resource can help:
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
      As an advice to beginners: the paths’s core resources are just suggestions
      and there are plenty of alternatives found in the <b>There&apos;s more</b>{' '}
      section of every path. One could find themselves more comfortable swapping
      one or more core resources with alternative ones.
    </Typography>
    <Typography>
      Finally, some resources could present overlapping or repetition at times.
      One could decide to take only what fit best with their learning needs.
    </Typography>
  </Stack>
)

export default ResourcesHelp
