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
  Checkbox,
} from '../../theme'
import { usePathResourcesCompletion } from '../Provider'

type Props = {
  resources: Resource[]
}

const PathTimeline = ({ resources }: Props) => {
  const [resourcesCompletion, { complete, uncomplete }] =
    usePathResourcesCompletion(resources)

  const isCompleted = (resource: string) => !!resourcesCompletion[resource]

  const toggleCompletion = (resource: string, completed: boolean) => {
    return completed ? complete(resource) : uncomplete(resource)
  }

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
            <TimelineDot variant="outlined">
              <Checkbox
                onChange={(_, checked) =>
                  toggleCompletion(resource.url, checked)
                }
                checked={isCompleted(resource.url)}
                value={resource.url}
                inputProps={{ 'aria-label': resource.title }}
                size="small"
                color="secondary"
              />
            </TimelineDot>
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
