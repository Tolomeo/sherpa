import { Resource, ResourceType } from '../data'

const topics = [
  'uidesign',
  'htmlcss',
  'webaccessibility',
  'javascript',
  'typescript',
  'react',
  'next',
  'npm',
  'node',
  'commandline',
  'docker',
  'git',
  'python',
  'regex',
  'neovim',
  'lua',
] as const

const resourcesTypesOrder: Array<NonNullable<Resource['type']>> = [
  ResourceType.basics,
  ResourceType.advanced,
  ResourceType['how-to'],
  ResourceType.curiosity,
  ResourceType.tool,
  ResourceType.reference,
  ResourceType.feed,
]

const resourceTypesTitles: Record<NonNullable<Resource['type']>, string> = {
  basics: 'Fundamentals',
  advanced: 'Beyond basics',
  'how-to': 'How do they do it',
  curiosity: 'Nice to know',
  tool: 'Work smarter, not harder',
  reference: 'Great bookmarks',
  feed: 'Stay in the loop',
}

const resources = {
  categoriesOrder: resourcesTypesOrder,
  categoriesTitles: resourceTypesTitles,
} as const

const db = {
  name: 'sherpa',
  version: 1,
  store: {
    resourceCompletion: {
      name: 'user.resource-completion',
    },
  },
} as const

const config = {
  topics,
  resources,
  db,
} as const

export default config
