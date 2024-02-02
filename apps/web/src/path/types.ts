import type { Resource, Path } from '@sherpa/data/types'
import { ResourceType } from '@sherpa/data/types'

export type { Resource, Path }

export { ResourceType }

export interface PopulatedPath {
  topic: Path['topic']
  title: string
  logo: Path['logo']
  hero: Path['hero']
  notes: Path['notes']
  resources: { title: string; resources: Resource[] }[] | null
  main: Resource[] | null
  children:
    | {
        title: string
        main: Resource[] | null
        resources: Resource[] | null
      }[]
    | null
  next: Path['next']
  prev: Path['prev']
}
