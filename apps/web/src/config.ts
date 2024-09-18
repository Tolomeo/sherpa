import { TopicName } from '@sherpa/data/topic'
import { ResourceType } from '@sherpa/data/resource'

const topics: TopicName[] = [
  TopicName.uidesign,
  TopicName.htmlcss,
  TopicName.webaccessibility,
  TopicName.javascript,
  TopicName.typescript,
  TopicName.react,
  TopicName.next,
  TopicName.npm,
  TopicName.node,
  TopicName.commandline,
  TopicName.docker,
  TopicName.git,
  TopicName.python,
  TopicName.regex,
  TopicName.neovim,
  TopicName.lua,
]

const topicsTitles: Record<TopicName, string> = {
  [TopicName.competitors]: 'Alternatives',
  [TopicName['commandline.cliapps']]: 'CLI apps',
  [TopicName['commandline.dotfiles']]: 'Dotfiles',
  [TopicName['commandline.fish']]: 'Fish',
  [TopicName.commandline]: 'Command line',
  [TopicName['commandline.powershell']]: 'Powershell',
  [TopicName['commandline.tmux']]: 'Tmux',
  [TopicName['commandline.wsl']]: 'WSL',
  [TopicName['commandline.zsh']]: 'Zsh',
  [TopicName.docker]: 'Docker',
  [TopicName['docker.withkubernetes']]: 'With Kubernetes',
  [TopicName.git]: 'Git',
  [TopicName['htmlcss.bem']]: 'BEM',
  [TopicName.htmlcss]: 'HTML and CSS',
  [TopicName.javascript]: 'Javascript',
  [TopicName['javascript.testing']]: 'Javascript testing',
  [TopicName.lua]: 'Lua',
  [TopicName['lua.luarocks']]: 'LuaRocks',
  [TopicName['lua.lve']]: 'Löve',
  [TopicName['lua.openresty']]: 'OpenResty',
  [TopicName.neovim]: 'Neovim',
  [TopicName.next]: 'Next.js',
  [TopicName['node.express']]: 'Express',
  [TopicName.node]: 'Node.js',
  [TopicName['node.nestjs']]: 'NestJS',
  [TopicName['node.security']]: 'Security',
  [TopicName['node.testing']]: 'Testing',
  [TopicName.npm]: 'NPM',
  [TopicName['npm.vite']]: 'Vite',
  [TopicName['npm.webpack']]: 'Webpack',
  [TopicName['python.django']]: 'Django',
  [TopicName['python.flask']]: 'Flask',
  [TopicName.python]: 'Python',
  [TopicName['python.numpy']]: 'NumPy',
  [TopicName['python.packaging']]: 'Packaging',
  [TopicName['python.pygame']]: 'Pygame',
  [TopicName['python.testing']]: 'Testing',
  [TopicName['python.webscraping']]: 'Web scraping',
  [TopicName.react]: 'React',
  [TopicName['react.redux']]: 'Redux',
  [TopicName['react.testing']]: 'Testing',
  [TopicName['react.withtypescript']]: 'With Typescript',
  [TopicName.regex]: 'Regular expressions',
  [TopicName.typescript]: 'Typescript',
  [TopicName['uidesign.colortheory']]: 'Color theory',
  [TopicName['uidesign.designprinciples']]: 'Design principles',
  [TopicName['uidesign.designsystems']]: 'Design systems',
  [TopicName['uidesign.designtools']]: 'Design tools',
  [TopicName['uidesign.iconography']]: 'Iconography',
  [TopicName.uidesign]: 'User Interface Design',
  [TopicName['uidesign.layout']]: 'Layout',
  [TopicName['uidesign.typography']]: 'Typography',
  [TopicName.webaccessibility]: 'Web Accessibility',
  [TopicName['webaccessibility.testing']]: 'Testing',
}

const paths = {
  topics,
  topicsTitles: topicsTitles as Record<string, string>,
}

const resourcesTypesOrder: NonNullable<ResourceType>[] = [
  ResourceType.basics,
  ResourceType.advanced,
  ResourceType['how-to'],
  ResourceType.curiosity,
  ResourceType.tool,
  ResourceType.reference,
  ResourceType.feed,
]

const resourceTypesTitles: Record<NonNullable<ResourceType>, string> = {
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
  paths,
  resources,
  db,
} as const

export default config
