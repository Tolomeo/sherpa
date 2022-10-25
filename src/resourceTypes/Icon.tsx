import React from 'react'
import { resourceTypes } from '../../data'
import {
  Icon,
  SquareIcon,
  CourseIcon,
  TutorialIcon,
  GuideIcon,
  BookIcon,
  ExampleIcon,
  CollectionIcon,
  ReferenceIcon,
  CommunityIcon,
  ExcerciseIcon,
  GeneratorIcon,
  OpinionIcon,
} from '../theme'

const resourceTypeIcons: Record<keyof typeof resourceTypes, typeof Icon> = {
  course: CourseIcon,
  tutorial: TutorialIcon,
  guide: GuideIcon,
  book: BookIcon,
  example: ExampleIcon,
  collection: CollectionIcon,
  reference: ReferenceIcon,
  community: CommunityIcon,
  exercise: ExcerciseIcon,
  generator: GeneratorIcon,
  opinion: OpinionIcon,
}

type Props = React.ComponentProps<typeof Icon> & {
  resourceType: string
}
const ResourceTypeIcon = ({ resourceType, ...props }: Props) => {
  const ResourceIcon = resourceTypeIcons[resourceType] || SquareIcon

  return <ResourceIcon fontSize="small" color="disabled" {...props} />
}

export default ResourceTypeIcon
