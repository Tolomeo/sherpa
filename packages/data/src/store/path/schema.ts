/* eslint-disable prefer-regex-literals -- TODO: fix */
import { z } from 'zod'
import { ResourceSchema } from '../resource/schema'

type RequiredNullable<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? Exclude<T[K], undefined> | null
    : T[K]
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

export const SerializedPathSchema = z.object({
  topic: z.string(),
  logo: z.string().regex(new RegExp('^<svg.+/svg>$')).optional(),
  hero: z
    .object({
      foreground: z
        .string()
        .regex(new RegExp('^#([a-fa-f0-9]{6}|[a-fa-f0-9]{3})$')),
      background: z.array(
        z.string().regex(new RegExp('^#([a-fa-f0-9]{6}|[a-fa-f0-9]{3})$')),
      ),
    })
    .optional(),
  notes: z.array(z.string()).optional(),
  resources: z.array(ResourceSchema.shape.url).optional(),
  main: z.array(ResourceSchema.shape.url).optional(),
  next: z.array(z.string()).optional(),
  prev: z.array(z.string()).optional(),
  children: z.array(z.string()).optional(),
})

export type SerializedPath = z.infer<typeof SerializedPathSchema>

export type Path = RequiredNullable<Omit<SerializedPath, 'children'>> & {
  children: Path[] | null
}

export const PathSchema: z.ZodType<Path> = SerializedPathSchema.extend({
  logo: z.string().regex(new RegExp('^<svg.+/svg>$')).nullable(),
  hero: z
    .object({
      foreground: z
        .string()
        .regex(new RegExp('^#([a-fa-f0-9]{6}|[a-fa-f0-9]{3})$')),
      background: z.array(
        z.string().regex(new RegExp('^#([a-fa-f0-9]{6}|[a-fa-f0-9]{3})$')),
      ),
    })
    .nullable(),
  notes: z.array(z.string()).nullable(),
  resources: z.array(ResourceSchema.shape.url).nullable(),
  main: z.array(ResourceSchema.shape.url).nullable(),
  next: z.array(z.string()).nullable(),
  prev: z.array(z.string()).nullable(),
  children: z.array(z.lazy(() => PathSchema)).nullable(),
})
