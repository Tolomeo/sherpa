import { Resource, Resources } from '../resources'

export type SerializedPathExtra = {
  title: string
  resources: Array<keyof Resources>
}

export interface SerializedPath<PathNames> {
  title: string
  resources: Array<keyof Resources>
  next?: Array<PathNames>
  prev?: Array<PathNames>
  extras?: Array<SerializedPathExtra>
}

export type SerializedPaths<PathNames> = Record<
  string,
  SerializedPath<PathNames>
>

export type PathExtra = {
  title: string
  resources: Resource[]
}

export interface Path<PathNames> {
  title: string
  resources: Resource[]
  extras: Array<PathExtra>
  next: SerializedPaths<PathNames>
  prev: SerializedPaths<PathNames>
}

export type Paths<PathNames> = Record<string, Path<PathNames>>
