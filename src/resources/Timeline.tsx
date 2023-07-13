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
  TimelineDot,
} from '../theme'

type Props = {
  resources: Resource[]
}

const timelineTestId = 'resources.timeline'
const timelineItemTestId = 'resources.timeline.item'
const timelineItemLinkTestId = 'resources.timeline.item.link'
const timelineItemTitleTestId = 'resources.timeline.item.title'
const timelineItemSourceTestId = 'resources.timeline.item.source'

const ResourcesTimeline = ({ resources }: Props) => {
  return (
    <Timeline position="right" data-testid={timelineTestId}>
      {Object.values(resources).map((resource, index) => (
        <TimelineItem key={resource.url} data-testid={timelineItemTestId}>
          <TimelineSeparator>
            <TimelineConnector
              sx={{
                backgroundColor:
                  index === 0 ? 'background.default' : 'text.grey.400',
              }}
            />
            <TimelineDot variant="outlined" />
            <TimelineConnector
              sx={{
                backgroundColor:
                  index === resources.length - 1
                    ? 'background.default'
                    : 'text.grey.400',
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Link
              data-testid={timelineItemLinkTestId}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                data-testid={timelineItemSourceTestId}
                variant="overline"
                color="text.secondary"
              >
                {resource.source}
              </Typography>
              <Typography
                data-testid={timelineItemTitleTestId}
                component="span"
                variant="h6"
                paddingBottom={1}
                display="block"
              >
                {resource.title}
              </Typography>
            </Link>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export default ResourcesTimeline
