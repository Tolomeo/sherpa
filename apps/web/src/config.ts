import { Resource, ResourceType, Path, PathTopic } from '../data'

const topics: Array<Path['topic']> = [
  PathTopic.uidesign,
  PathTopic.htmlcss,
  PathTopic.webaccessibility,
  PathTopic.javascript,
  PathTopic.typescript,
  PathTopic.react,
  PathTopic.next,
  PathTopic.npm,
  PathTopic.node,
  PathTopic.commandline,
  PathTopic.docker,
  PathTopic.git,
  PathTopic.python,
  PathTopic.regex,
  PathTopic.neovim,
  PathTopic.lua,
]

const topicsTitles: Record<PathTopic, string> = {
  'commandline.cliapps': 'CLI apps',
  'commandline.dotfiles': 'Dotfiles',
  'commandline.fish': 'Fish',
  commandline: 'Command line',
  'commandline.powershell': 'Powershell',
  'commandline.tmux': 'Tmux',
  'commandline.wsl': 'WSL',
  'commandline.zsh': 'Zsh',
  docker: 'Docker',
  'docker.withkubernetes': 'With Kubernetes',
  git: 'Git',
  'htmlcss.bem': 'BEM',
  htmlcss: 'HTML and CSS',
  javascript: 'Javascript',
  'javascript.testing': 'Javascript testing',
  lua: 'Lua',
  'lua.luarocks': 'LuaRocks',
  'lua.lve': 'Löve',
  'lua.openresty': 'OpenResty',
  neovim: 'Neovim',
  next: 'Next.js',
  'node.express': 'Express',
  node: 'Node.js',
  'node.nestjs': 'NestJS',
  'node.security': 'Security',
  'node.testing': 'Testing',
  npm: 'NPM',
  'npm.vite': 'Vite',
  'npm.webpack': 'Webpack',
  'python.django': 'Django',
  'python.flask': 'Flask',
  python: 'Python',
  'python.numpy': 'NumPy',
  'python.packaging': 'Packaging',
  'python.pygame': 'Pygame',
  'python.testing': 'Testing',
  'python.webscraping': 'Web scraping',
  react: 'React',
  'react.redux': 'Redux',
  'react.testing': 'Testing',
  'react.withtypescript': 'With Typescript',
  regex: 'Regular expressions',
  typescript: 'Typescript',
  'uidesign.colortheory': 'Color theory',
  'uidesign.designprinciples': 'Design principles',
  'uidesign.designsystems': 'Design systems',
  'uidesign.designtools': 'Design tools',
  'uidesign.iconography': 'Iconography',
  uidesign: 'User Interface Design',
  'uidesign.layout': 'Layout',
  'uidesign.typography': 'Typography',
  webaccessibility: 'Web Accessibility',
  'webaccessibility.testing': 'Testing',
} as const

const paths = {
  topics,
  topicsTitles,
}

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
  paths,
  resources,
  db,
} as const

export default config
