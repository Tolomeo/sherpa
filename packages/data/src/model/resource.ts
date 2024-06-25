import ResourcesStore from '../store/resource'
import type { Resource as TResource } from '../store/resource/schema'

export const getAllByType = async (type: string) => {
  const docs = await ResourcesStore.findAll({ type })
  const resources = docs.map((r) => new Resource(r.url, r))

  return resources
}

class Resource {
  url: string

  private data?: TResource

  constructor(url: string, data?: TResource) {
    this.url = url
    this.data = data
  }

  public async exists() {
    return Boolean(await this.get())
  }

  public async get() {
    if (this.data) return this.data

    const resourceData = await ResourcesStore.findOne(this.url)

    if (resourceData) {
      const { _id, ...data } = resourceData
      this.data = data
    }

    return this.data
  }
}

export default Resource
