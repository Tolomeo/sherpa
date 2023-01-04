import { Resource, Resources } from '../resources'

export enum SerializedPathExtraType {
  subtopic = 'subtopic',
  subpath = 'subpath',
}

interface SerializedPathExtra {
  title: string
}

export interface SerializedSubTopic extends SerializedPathExtra {
  type: SerializedPathExtraType.subtopic
  resources: Array<keyof Resources>
}

export interface SerializedSubPath extends SerializedPathExtra {
  type: SerializedPathExtraType.subpath
  main: Array<keyof Resources>
  extra?: Array<keyof Resources>
}

export interface SerializedPath<PathNames = string> {
  title: string
  main: Array<keyof Resources>
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
  main: Resource[]
  extra: Array<SubTopic | SubPath>
  next: SerializedPaths<PathNames>
  prev: SerializedPaths<PathNames>
}

export type Paths<PathNames = string> = Record<string, Path<PathNames>>
