export enum ResourceType {
  basics = 'basics',
  advanced = 'advanced',
  'how-to' = 'how-to',
  curiosity = 'curiosity',
  tool = 'tool',
  reference = 'reference',
  feed = 'feed',
}

export interface SerializedResource {
  title: string
  url: string
  source?: string
  type: ResourceType
}

export type SerializedResources = SerializedResource[]

export interface Resource {
  title: string
  url: string
  source: string
  type: ResourceType
}

export enum PathTopic {
  'commandline.cliapps' = 'commandline.cliapps',
  'commandline.dotfiles' = 'commandline.dotfiles',
  'commandline.fish' = 'commandline.fish',
  commandline = 'commandline',
  'commandline.powershell' = 'commandline.powershell',
  'commandline.tmux' = 'commandline.tmux',
  'commandline.wsl' = 'commandline.wsl',
  'commandline.zsh' = 'commandline.zsh',
  docker = 'docker',
  'docker.withkubernetes' = 'docker.withkubernetes',
  git = 'git',
  'htmlcss.bem' = 'htmlcss.bem',
  htmlcss = 'htmlcss',
  javascript = 'javascript',
  'javascript.testing' = 'javascript.testing',
  lua = 'lua',
  'lua.luarocks' = 'lua.luarocks',
  'lua.lve' = 'lua.lve',
  'lua.openresty' = 'lua.openresty',
  neovim = 'neovim',
  next = 'next',
  'node.express' = 'node.express',
  node = 'node',
  'node.nestjs' = 'node.nestjs',
  'node.security' = 'node.security',
  'node.testing' = 'node.testing',
  npm = 'npm',
  'npm.vite' = 'npm.vite',
  'npm.webpack' = 'npm.webpack',
  'python.django' = 'python.django',
  'python.flask' = 'python.flask',
  python = 'python',
  'python.numpy' = 'python.numpy',
  'python.packaging' = 'python.packaging',
  'python.pygame' = 'python.pygame',
  'python.testing' = 'python.testing',
  'python.webscraping' = 'python.webscraping',
  react = 'react',
  'react.redux' = 'react.redux',
  'react.testing' = 'react.testing',
  'react.withtypescript' = 'react.withtypescript',
  regex = 'regex',
  typescript = 'typescript',
  'uidesign.colortheory' = 'uidesign.colortheory',
  'uidesign.designprinciples' = 'uidesign.designprinciples',
  'uidesign.designsystems' = 'uidesign.designsystems',
  'uidesign.designtools' = 'uidesign.designtools',
  'uidesign.iconography' = 'uidesign.iconography',
  uidesign = 'uidesign',
  'uidesign.layout' = 'uidesign.layout',
  'uidesign.typography' = 'uidesign.typography',
  webaccessibility = 'webaccessibility',
  'webaccessibility.testing' = 'webaccessibility.testing',
}

export interface PathHero {
  foreground: string
  background: string[]
}

export type PathNotes = string[]

export interface SerializedPath {
  logo?: string
  hero?: PathHero
  notes?: PathNotes
  resources?: string[]
  main?: string[]
  children?: string[]
  next?: PathTopic[]
  prev?: PathTopic[]
}

export interface Path {
  topic: PathTopic
  logo: string | null
  hero: PathHero | null
  notes: PathNotes | null
  resources: Resource['url'][] | null
  main: Resource['url'][] | null
  children: Path[] | null
  next: PathTopic[] | null
  prev: PathTopic[] | null
}
