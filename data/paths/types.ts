import { Resource, Resources } from '../resources'

export interface SerializedPathExtra {
  title: string
}

export interface SerializedSubTopic extends SerializedPathExtra {
  resources: Array<keyof Resources>
}

export interface SerializedSubPath extends SerializedPathExtra {
  main: Array<keyof Resources>
  extra?: Array<keyof Resources>
}

export interface PathHero {
  foreground: string
  background: string[]
}

export type PathNotes = string[]

export interface SerializedPath<PathNames = string> {
  title: string
  logo?: string
  hero?: PathHero
  notes?: PathNotes
  resources?: Array<string>
  main?: Array<string>
  children?: Array<string>
  next?: Array<PathNames>
  prev?: Array<PathNames>
}

export type SerializedPaths<PathNames = string> = Record<
  string,
  SerializedPath<PathNames>
>

interface PathExtra {
  title: string
}

export interface SubTopic extends PathExtra {
  resources: Array<Resource>
}

export interface SubPath extends PathExtra {
  main: Resource[]
  extra: Resource[]
}

export interface Path {
  title: string
  logo: string | null
  hero: PathHero | null
  notes: PathNotes | null
  resources: Array<Resource> | null
  main: Array<Resource> | null
  children: Array<Path> | null
  next: PathsList | null
  prev: PathsList | null
}

export interface ParsedPath {
  title: string
  logo: string | null
  hero: PathHero | null
  notes: PathNotes | null
  resources: Array<Resource['url']> | null
  main: Array<Resource['url']> | null
  children: Array<ParsedPath> | null
  next: PathsList | null
  prev: PathsList | null
}

export type PathsList = Record<string, Pick<Path, 'title'>>
