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

export interface ParsedPath {
  topic: string
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

export type PathsList = Record<
  string,
  { topic: string; title: ParsedPath['title'] }
>
