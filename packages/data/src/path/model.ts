import ResourcesStore from '../resource/store'
import type { ResourceData } from '../resource/schema'
import PathsStore, { type PathDocument } from './store'
import type { Path, PopulatedPath } from './schema'

type Maybe<T> = T | undefined

export const getTopic = async (topic: string) => {
  const doc = await PathsStore.findOneByTopic(topic)

  if (!doc) return null

  return new PathModel(doc)
}

export const getAll = async () => {
  const docs = await PathsStore.findAll()
  const paths = docs.map((p) => new PathModel(p))

  return paths
}

export const getRootPaths = async () => {
  const docs = await PathsStore.findAllByTopic(/^[^.]+$/)
  const paths = docs.map((p) => new PathModel(p))

  return paths
}

export interface ResourceGroup {
  type: ResourceData['type']
  resources: ResourceData[]
}

const populate = async (path: Path): Promise<PopulatedPath> => {
  const populatedPath: PopulatedPath = {
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

class PathModel {
  topic: string

  data: Maybe<PathDocument>

  constructor(path: string | PathDocument) {
    if (typeof path === 'string') {
      this.topic = path
    } else {
      this.topic = path.topic
      this.data = path
    }
  }

  private async read() {
    if (this.data) return this.data

    const data = await PathsStore.findOneByTopic(this.topic)

    if (data) this.data = data

    return this.data
  }

  private async update(update: Partial<Path>) {
    const data = await this.read()

    if (!data) return

    const { _id: id, ...path } = data

    this.data = await PathsStore.updateOne(id, {
      ...path,
      ...update,
    })

    return this.data
  }

  public async exists() {
    return Boolean(await this.read())
  }

  public async get(populated?: false): Promise<Maybe<Path>>
  public async get(populated: true): Promise<Maybe<PopulatedPath>>
  public async get(populated?: boolean): Promise<Maybe<Path | PopulatedPath>> {
    const data = await this.read()

    if (!data) return

    const { _id, ...pathData } = data

    if (populated) return populate(pathData)

    return pathData
  }

  public async getResources(): Promise<string[]> {
    const data = await this.get()

    if (!data) return []

    const resources = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const topic of data.children) {
      const child = new PathModel(topic)
      const childResources = await child.getResources()

      resources.push(...childResources)
    }

    return resources
  }

  public async change(update: Partial<Path>) {
    const updated = await this.update(update)

    if (!updated) return

    const { _id, ...data } = updated
    return data
  }
}

export default PathModel
