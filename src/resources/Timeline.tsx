import React from 'react'
import { Resource } from '../../data'
import {
  Link,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  Box,
  Stack,
  Chip,
} from '../theme'

type Props = {
  resources: Resource[]
}

const ResourcesTimeline = ({ resources }: Props) => {
  return (
    <Timeline>
      {Object.values(resources).map((resource) => (
        <TimelineItem key={resource.url}>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Box pt={1.5}>
              <Typography variant="overline" color="text.secondary">
                {resource.source}
              </Typography>
              <Box pb={1.5}>
                <Link href={resource.url} target="_blank" rel="noreferrer">
                  <Typography variant="h6">{resource.title}</Typography>
                </Link>
              </Box>
              <Stack direction="row" spacing={1}>
                {resource.type.map((type) => (
                  <Chip key={type} label={type} size="small" />
                ))}
              </Stack>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export default ResourcesTimeline
