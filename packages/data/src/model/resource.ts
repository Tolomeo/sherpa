import ResourcesStore from '../store/resource'

class Resource {
  url: string

  constructor(url: string) {
    this.url = url
  }

  public get() {
    return ResourcesStore.getOne(this.url)
  }
}

export default Resource
