import { Resource } from '../resources'

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

export interface Path {
  topic: string
  title: string
  logo: string | null
  hero: PathHero | null
  notes: PathNotes | null
  resources: Array<Resource['url']> | null
  main: Array<Resource['url']> | null
  children: Array<Path> | null
  next: Paths | null
  prev: Paths | null
}

export type Paths = Record<string, { topic: string; title: Path['title'] }>
