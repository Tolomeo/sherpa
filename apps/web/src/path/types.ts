import type { Path } from '@sherpa/data/path/schema'
import { ResourceType, type ResourceData } from '@sherpa/data/resource/schema'

export type { ResourceData as Resource, Path }

export { ResourceType }

export interface PopulatedPath {
  topic: Path['topic']
  title: string
  logo: Path['logo']
  hero: Path['hero']
  notes: Path['notes']
  resources: { title: string; resources: ResourceData[] }[] | null
  main: ResourceData[] | null
  children:
    | {
        title: string
        main: ResourceData[] | null
        resources: ResourceData[] | null
      }[]
    | null
  next: Path['next']
  prev: Path['prev']
}
