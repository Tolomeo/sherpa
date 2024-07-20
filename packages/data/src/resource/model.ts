import type { ResourceData } from '../../types'
import ResourcesStore, { type ResourceDocument } from './store'

// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// type ResourceData = PartialBy<ResourceDocument, '_id'>

export const getAll = async () => {
  const docs = await ResourcesStore.findAll()
  const resources = docs.map((d) => new Resource(d))

  return resources
}

//TODO: validate url
export const getUrl = async (url: string) => {
  const doc = await ResourcesStore.findOneByUrl(url)

  if (!doc) return null

  return new Resource(doc)
}

export const getById = async (id: string) => {
  const doc = await ResourcesStore.findOne({ _id: id })

  if (!doc) throw new Error(`Resource with id ${id} not found`)

  return new Resource(doc)
}

export const getAllByType = async (type: string) => {
  const docs = await ResourcesStore.findAll({ type })
  const resources = docs.map((d) => new Resource(d))

  return resources
}

export const getAllByUrl = async (...urls: string[]) => {
  const docs: ResourceDocument[] = []

  for (const url of urls) {
    const doc = await ResourcesStore.findOneByUrl(url)

    if (!doc) throw new Error(`Resource ${url} not found`)

    docs.push(doc)
  }

  return docs.map((doc) => new Resource(doc))
}

class Resource {
  public data: ResourceDocument

  constructor(resource: ResourceDocument) {
    this.data = resource
  }

  private async read() {
    const data = await ResourcesStore.findOneByUrl(this.url)

    if (!data) throw new Error(`Resource ${this.url} data not found`)

    this.data = data

    return this.data
  }

  private async update(update: Partial<ResourceData>) {
    const { _id: id, ...resource } = this.data

    this.data = await ResourcesStore.updateOne(id, {
      ...resource,
      ...update,
    })

    return this.read()
  }

  public get url() {
    return this.data.url
  }

  public async get() {
    const { _id, ...resourcedata } = this.data
    return resourcedata
  }

  public async change(update: Partial<ResourceData>) {
    const updated = await this.update(update)

    const { _id, ...resourceData } = updated
    return resourceData
  }
}

export default Resource
