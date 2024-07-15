import ResourcesStore from '../resource/store'
import type { ResourceData, PathData, PopulatedPathData } from '../../types'
import PathsStore, { type PathDocument } from './store'

type Maybe<T> = T | undefined

export const getTopic = async (topic: string) => {
  const doc = await PathsStore.findOneByTopic(topic)

  if (!doc) return null

  return new Path(doc)
}

export const getAll = async () => {
  const docs = await PathsStore.findAll()
  const paths = docs.map((p) => new Path(p))

  return paths
}

export const getRootPaths = async () => {
  const docs = await PathsStore.findAllByTopic(/^[^.]+$/)
  const paths = docs.map((p) => new Path(p))

  return paths
}

export interface ResourceGroup {
  type: ResourceData['type']
  resources: ResourceData[]
}

const populate = async (path: PathData): Promise<PopulatedPathData> => {
  const populatedPath: PopulatedPathData = {
    ...path,
    main: null,
    resources: null,
    children: null,
  }

  if (path.main) {
    populatedPath.main = []

    for (const mainUrl of path.main) {
      const resourceDoc = await ResourcesStore.findOneByUrl(mainUrl)

      if (!resourceDoc)
        throw new Error(`Path "${path.topic}" resource ${mainUrl} not found`)

      const { _id, ...resourceData } = resourceDoc

      populatedPath.main.push(resourceData)
    }
  }

  if (path.resources) {
    populatedPath.resources = []

    for (const resourceUrl of path.resources) {
      const resourceDoc = await ResourcesStore.findOneByUrl(resourceUrl)

      if (!resourceDoc)
        throw new Error(
          `Path "${path.topic}" resource ${resourceUrl} not found`,
        )

      const { _id, ...resourceData } = resourceDoc

      populatedPath.resources.push(resourceData)
    }

    /* populatedPath.resources.sort((resourceA, resourceB) => {
      const titleA = resourceA.title.toUpperCase()
      const titleB = resourceB.title.toUpperCase()

      if (titleA > titleB) return 1
      else if (titleA < titleB) return -1

      return 0
    }) */
  }

  if (path.children) {
    populatedPath.children = []

    for (const child of path.children) {
      const childPathData = await PathsStore.findOneByTopic(child)

      if (!childPathData) throw new Error(`Child path ${child} not found`)

      populatedPath.children.push(await populate(childPathData))
    }
  }

  return populatedPath
}

class Path {
  data: PathDocument

  constructor(path: PathDocument) {
    this.data = path
  }

  private async read() {
    const data = await PathsStore.findOneByTopic(this.topic)

    if (!data) {
      throw new Error(`Path ${this.topic} data not found`)
    }

    this.data = data

    return this.data
  }

  private async update(update: Partial<PathData>) {
    const { _id: id, ...path } = data

    this.data = await PathsStore.updateOne(id, {
      ...path,
      ...update,
    })

    return this.read()
  }

  public get topic() {
    return this.data.topic
  }

  public async get(populated?: false): Promise<Maybe<PathData>>
  public async get(populated: true): Promise<Maybe<PopulatedPathData>>
  public async get(
    populated?: boolean,
  ): Promise<Maybe<PathData | PopulatedPathData>> {
    const data = await this.read()

    const { _id, ...pathData } = data

    if (populated) return populate(pathData)

    return pathData
  }

  public async getResources(): Promise<string[]> {
    const data = await this.get()

    if (!data) return []

    const resources: string[] = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const topic of data.children) {
      const child = await getTopic(topic)

      if (!child) throw new Error(`Child path ${topic} data not found`)

      const childResources = await child.getResources()

      resources.push(...childResources)
    }

    return resources
  }

  public async change(update: Partial<PathData>) {
    const updated = await this.update(update)

    const { _id, ...data } = updated
    return data
  }
}

export default Path
