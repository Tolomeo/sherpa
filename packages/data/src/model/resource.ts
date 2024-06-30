import ResourcesStore, { type ResourceDocument } from '../store/resource'
import type { Resource } from '../store/resource/schema'

type Maybe<T> = T | undefined

// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// type ResourceData = PartialBy<ResourceDocument, '_id'>

export const getAllByType = async (type: string) => {
  const docs = await ResourcesStore.findAll({ type })
  const resources = docs.map((r) => new ResourceModel(r.url))

  return resources
}

class ResourceModel {
  url: string

  private data: Maybe<ResourceDocument>

  constructor(url: string) {
    this.url = url
  }

  private async read() {
    if (this.data) return this.data

    const data = await ResourcesStore.findOneByUrl(this.url)

    if (data) this.data = data

    console.log('Data read')
    console.log(data)

    return this.data
  }

  private async update(update: Partial<Resource>) {
    const data = await this.read()

    if (!data) return

    const { _id: id, ...resource } = data

    this.data = await ResourcesStore.updateOne(id, {
      ...resource,
      ...update,
    })

    console.log('Data update')
    console.log(this.data)

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

  public async change(update: Partial<Resource>) {
    const updated = await this.update(update)

    if (!updated) return

    const { _id, ...resourceData } = updated
    return resourceData
  }
}

export default ResourceModel
