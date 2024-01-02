import { Resource, ResourceType, Path } from '../../data'

export type { Resource, Path }

export { ResourceType }

export interface PopulatedPath {
  topic: Path['topic']
  title: string
  logo: Path['logo']
  hero: Path['hero']
  notes: Path['notes']
  resources: Array<{ title: string; resources: Array<Resource> }> | null
  main: Array<Resource> | null
  children: Array<{
    title: string
    main: Array<Resource> | null
    resources: Array<Resource> | null
  }> | null
  next: Path['next']
  prev: Path['prev']
}
