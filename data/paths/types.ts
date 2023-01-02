import { Resource, Resources } from '../resources'

export type SerializedPathExtra = {
  title: string
  resources: Array<keyof Resources>
}

export interface SerializedPath<PathNames = string> {
  title: string
  main: Array<keyof Resources>
  next?: Array<PathNames>
  prev?: Array<PathNames>
  other?: Array<SerializedPathExtra>
}

export type SerializedPaths<PathNames = string> = Record<
  string,
  SerializedPath<PathNames>
>

export type PathExtra = {
  title: string
  resources: Resource[]
}

export interface Path<PathNames = string> {
  title: string
  main: Resource[]
  other: Array<PathExtra>
  next: SerializedPaths<PathNames>
  prev: SerializedPaths<PathNames>
}

export type Paths<PathNames = string> = Record<string, Path<PathNames>>
