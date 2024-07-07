import PathsStore, { type PathDocument } from './store'
// import { type Path } from './schema'

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

  /* private async update(update: Partial<Path>) {
    const data = await this.read()

    if (!data) return

    const { _id: id, ...path } = data

    this.data = await PathsStore.updateOne(id, {
      ...path,
      ...update,
    })

    return this.data
  } */

  public async exists() {
    return Boolean(await this.read())
  }

  public async get() {
    const data = await this.read()

    if (!data) return

    const { _id, ...pathData } = data
    return pathData
  }

  public async getResources(): Promise<string[]> {
    const data = await this.get()

    if (!data) return []

    const resources = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const { topic } of data.children) {
      const child = new PathModel(topic)
      const childResources = await child.getResources()

      resources.push(...childResources)
    }

    return resources
  }

  /* public async change(update: Partial<Path>) {
    const updated = await this.update(update)

    if (!updated) return

    const { _id, ...data } = updated
    return data
  } */
}

export default PathModel
