import React from 'react'
import { resourceTypes } from '../../data'
import { Stack, Typography } from '../theme'
import Icon from './Icon'

type Props = Omit<
  React.ComponentProps<typeof Stack>,
  'direction' | 'spacing'
> & {
  resourceType: keyof typeof resourceTypes
}
const ResourceTypeLabel = ({ resourceType, ...props }: Props) => {
  return (
    <Stack
      component="span"
      {...props}
      direction="row"
      alignItems="center"
      spacing={0.5}
    >
      <Icon resourceType={resourceType} />
      <Typography variant="body2" color="text.secondary">
        {resourceType}
      </Typography>
    </Stack>
  )
}

export default ResourceTypeLabel
