import ResourcesStore, { type ResourceDocument } from './store'
import type { ResourceData } from './schema'

type Maybe<T> = T | undefined

// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// type ResourceData = PartialBy<ResourceDocument, '_id'>
export const getAll = async () => {
  const docs = await ResourcesStore.findAll()
  const resources = docs.map((d) => new ResourceModel(d))

  return resources
}

export const getAllByType = async (type: string) => {
  const docs = await ResourcesStore.findAll({ type })
  const resources = docs.map((d) => new ResourceModel(d))

  return resources
}

export const getAllByUrl = async (...urls: string[]) => {
  const docs = []

  for (const url of urls) {
    const doc = await ResourcesStore.findOneByUrl(url)

    if (!doc) throw new Error(`Resource ${url} not found`)

    docs.push(doc)
  }

  return docs.map((doc) => new ResourceModel(doc))
}

class ResourceModel {
  url: string

  private data: Maybe<ResourceDocument>

  constructor(resource: string | ResourceDocument) {
    if (typeof resource === 'string') {
      this.url = resource
    } else {
      this.url = resource.url
      this.data = resource
    }
  }

  private async read() {
    if (this.data) return this.data

    const data = await ResourcesStore.findOneByUrl(this.url)

    if (data) this.data = data

    return this.data
  }

  private async update(update: Partial<ResourceData>) {
    const data = await this.read()

    if (!data) return

    const { _id: id, ...resource } = data

    this.data = await ResourcesStore.updateOne(id, {
      ...resource,
      ...update,
    })

    return this.data
  }

  public async exists() {
    return Boolean(await this.read())
  }

  public async get() {
    const data = await this.read()

    if (!data) return

    const { _id, ...resourcedata } = data
    return resourcedata
  }

  public async change(update: Partial<ResourceData>) {
    const updated = await this.update(update)

    if (!updated) return

    const { _id, ...resourceData } = updated
    return resourceData
  }
}

export default ResourceModel
