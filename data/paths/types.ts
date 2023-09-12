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
  extras?: Array<string>
  extra?: Array<SerializedSubTopic | SerializedSubPath>
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
  extras: Array<Path> | null
  // TODO remove
  extra: Array<SubTopic | SubPath>
  next: PathsList | null
  prev: PathsList | null
}

export type PathsList = Record<string, Pick<Path, 'title'>>
