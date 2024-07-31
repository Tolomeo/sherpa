import type { ResourceData } from '../../types'
import ResourcesStore, { type ResourceDocument } from './store'

export const getAll = async () => {
  const docs = await ResourcesStore.findAll()
  const resources = docs.map((d) => new Resource(d))

  return resources
}

export const getByUrl = async (url: string) => {
  const doc = await ResourcesStore.findOne({ url })

  if (!doc) return null

  return new Resource(doc)
}

export const getById = async (id: string) => {
  const doc = await ResourcesStore.findOne({ _id: id })

  if (!doc) throw new Error(`Resource with id ${id} not found`)

  return new Resource(doc)
}

class Resource {
  public document: ResourceDocument

  constructor(resource: ResourceDocument) {
    this.document = resource
  }

  /* private async read() {
    const data = await ResourcesStore.findOneByUrl(this.url)

    if (!data) throw new Error(`Resource ${this.url} data not found`)

    this.document = data

    return this.document
  } */

  private async update(update: Partial<ResourceData>) {
    const { _id: id, ...resource } = this.document

    this.document = await ResourcesStore.updateOne(id, {
      ...resource,
      ...update,
    })

    return this.document
  }

  public get id() {
    return this.document._id
  }

  public get url() {
    return this.document.url
  }

  public get data() {
    const { _id, healthcheck, ...resourcedata } = this.document
    return resourcedata
  }

  public get healthcheck(): NonNullable<ResourceData['healthcheck']> {
    if (!this.document.healthcheck)
      return {
        runner: 'Http',
        config: {
          titleSelector: 'title:not(:empty)',
        },
      }

    return this.document.healthcheck
  }

  public async change(update: Partial<ResourceData>) {
    const updated = await this.update(update)

    const { _id, ...resourceData } = updated
    return resourceData
  }
}

export default Resource
