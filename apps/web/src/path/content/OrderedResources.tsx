import type { ResourceData } from '@sherpa/data/resource'
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

interface Props {
  resources: ResourceData[]
}

const PathTimeline = ({ resources }: Props) => {
  const [resourcesCompletion, { complete, uncomplete }] =
    usePathResourcesCompletion(resources)

  const isCompleted = (resource: string) =>
    Boolean(resourcesCompletion[resource])

  const toggleCompletion = (resource: string, completed: boolean) => {
    // TODO: handle a possible failure
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    completed ? complete(resource) : uncomplete(resource)
  }

  return (
    <Timeline position="right">
      {Object.values(resources).map((resource, index) => {
        const {
          url,
          data: { source, title },
        } = resource
        const completed = isCompleted(url)
        const label = `Mark "${title}" as ${
          completed ? 'uncompleted' : 'completed'
        }`

        return (
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
                  onChange={(_, checked) => toggleCompletion(url, checked)}
                  checked={completed}
                  value={url}
                  inputProps={{ 'aria-label': label }}
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
              <Link href={url} target="_blank" rel="noreferrer">
                <Typography variant="overline" color="text.secondary">
                  {source}
                </Typography>
                <Typography
                  component="span"
                  variant="h6"
                  paddingBottom={1}
                  display="block"
                >
                  {title}
                </Typography>
              </Link>
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}

export default PathTimeline
