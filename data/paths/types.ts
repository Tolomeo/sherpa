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
  notes: PathNotes
  resources: Array<SubTopic>
  main: Resource[]
  extras: Array<Path>
  extra: Array<SubTopic | SubPath>
  next: SerializedPaths<PathNames>
  prev: SerializedPaths<PathNames>
}

export type Paths<PathNames = string> = Record<string, Path<PathNames>>
