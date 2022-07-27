export const resourceTypes = {
  course: {
    title: 'course',
    description:
      'Resource which provides knowledge over an entire subject. It is assumed it will be consumed linearly from start to finish as its parts are often interdependent and organised in a defined order.',
  },
  tutorial: {
    title: 'tutorial',
    description:
      'Resource which helps solving a specific challenge. It is focused on demonstrating how to reach a goal rather than solely on explaining concepts.',
  },
  guide: {
    title: 'guide',
    description:
      'Resource which investigates on a narrow subject. It is scoped over a specific aspect of a larger topic, but designed to be enjoyed independently.',
  },
  book: {
    title: 'book',
    description:
      'Resource which provides knowledge over an entire subject. It is designed to be consumed as a printed work would. Thus, it is preferably presented in the text format and organised in chapters.',
  },
  example: {
    title: 'example',
    description:
      'Resource which showcases an executed project. It allows to take a look at its source, making it clearer how theory concepts come together when applied in a real scenario.',
  },
  collection: {
    title: 'collection',
    description:
      'A group of resources gathered in one place. Those resources can vary in type and be organised in different ways depending on the reason why they were collected.',
  },
  reference: {
    title: 'reference',
    description:
      'Rich resource which gives access to a variety of information on a subject. It is easy to go back to it when a quick refresher is needed or to rely on its updates to stay current.',
  },
  community: {
    title: 'community',
    description:
      'A resource which gives away insights on people in cultural niche or helps coming in contact with them. Not everything is about skills.',
  },
  exercise: {
    title: 'exercise',
    description:
      'Resource which showcases an executed project. It allows to take a look at its source, making it clearer how theory concepts come together when applied in a real scenario.',
  },
  generator: {
    title: 'generator',
    description:
      'A tool which helps in making one’s life easier when putting things into practice. It could range from a simple value calculator to a complex and feature rich automatic configurator.',
  },
  opinion: {
    title: 'opinion',
    description:
      'The world is beautiful because it is varied and everybody’s opinion counts because it could stimulate to look at things from a different point of view.',
  },
} as const

export type ResourceType = keyof typeof resourceTypes

export interface SerializedResource {
  title: string
  url: string
  type: ResourceType[]
  source?: string
}

export type SerializedResources = SerializedResource[]

export interface Resource {
  title: string
  url: string
  type: ResourceType[]
  source: string
}

export type Resources = {
  [resourceId: string]: Resource
}
