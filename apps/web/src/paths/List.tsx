import NextLink from 'next/link'
import type { TopicMetadata } from '@sherpa/data/topic'
import {
  List,
  ListItem,
  Link,
  Typography,
  Box,
  Underline,
  Card,
  CardContent,
  CardMedia,
  SvgImage,
  Backdrop,
} from '../theme'
import config from '../config'
import { usePathsContext } from './Provider'

interface PathsListItemProps {
  path: TopicMetadata
}

const PathsListItem = ({ path }: PathsListItemProps) => (
  <NextLink href={`/paths/${path.name}`} passHref legacyBehavior>
    <Link>
      <Card sx={{ display: 'flex' }}>
        {path.logo && (
          <CardMedia sx={{ display: 'flex', aspectRatio: 1 }}>
            <Backdrop
              backdrop={path.hero?.background}
              sx={{ display: 'flex', alignItems: 'center', padding: 2 }}
            >
              <SvgImage svg={path.logo} size="medium" />
            </Backdrop>
          </CardMedia>
        )}
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span">
            The <Underline>{config.paths.topicsTitles[path.name]}</Underline>{' '}
            path
          </Typography>
        </CardContent>
      </Card>
    </Link>
  </NextLink>
)

type Props = Omit<React.ComponentProps<typeof List>, 'children'> & {
  paths?: string[]
}

const PathsList = ({
  paths: pathNames = config.paths.topics,
  ...props
}: Props) => {
  const { paths } = usePathsContext()
  const pathsList = pathNames.map(
    (pathName) => paths.find((path) => path.name === pathName)!,
  )

  return (
    <Box>
      <List {...props}>
        {pathsList.map((path) => (
          <ListItem key={path.name} disableGutters>
            <PathsListItem path={path} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default PathsList
