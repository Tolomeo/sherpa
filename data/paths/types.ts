import { Resource, Resources } from '../resources'

export type SerializedSubPath = {
  title: string
  main?: Array<keyof Resources>
  extra?: Array<keyof Resources>
}

export interface SerializedPath<PathNames = string> {
  title: string
  main: Array<keyof Resources>
  extra?: Array<SerializedSubPath>
  next?: Array<PathNames>
  prev?: Array<PathNames>
}

export type SerializedPaths<PathNames = string> = Record<
  string,
  SerializedPath<PathNames>
>

export type SubPath = {
  title: string
  main: Resource[]
  extra: Resource[]
}

export interface Path<PathNames = string> {
  title: string
  main: Resource[]
  extra: Array<SubPath>
  next: SerializedPaths<PathNames>
  prev: SerializedPaths<PathNames>
}

export type Paths<PathNames = string> = Record<string, Path<PathNames>>
