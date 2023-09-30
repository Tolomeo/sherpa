import { Resource } from '../../../data'
import {
  Link,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '../../theme'

type Props = {
  resources: Resource[]
}

const PathTimeline = ({ resources }: Props) => {
  return (
    <Timeline position="right">
      {Object.values(resources).map((resource, index) => (
        <TimelineItem key={resource.url}>
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
            <Link href={resource.url} target="_blank" rel="noreferrer">
              <Typography variant="overline" color="text.secondary">
                {resource.source}
              </Typography>
              <Typography
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

export default PathTimeline
