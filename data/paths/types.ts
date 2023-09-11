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
  resources?: Array<keyof Resources>
  main?: Array<keyof Resources>
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

export interface Path<PathNames = string> {
  title: string
  logo: string | null
  hero: PathHero | null
  notes: PathNotes | null
  resources: Array<SubTopic> | null
  main: Array<Resource> | null
  extras: Array<Path> | null
  // TODO remove
  extra: Array<SubTopic | SubPath>
  next: PathsList | null
  prev: PathsList | null
}

export type PathsList = Record<string, Pick<Path, 'title'>>

export type Paths<PathNames = string> = Record<string, Path<PathNames>>
