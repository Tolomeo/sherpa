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

  public async get() {
    if (this.data) return this.data

    this.data = await ResourcesStore.findOne(this.url)

    return this.data
  }
}

export default Resource
