import PathsStore from '../store/path'

class Path {
  topic: string

  constructor(topic: string) {
    this.topic = topic
  }

  public get() {
    return PathsStore.getOne(this.topic)
  }

  public async getResources(): Promise<string[]> {
    const data = await this.get()

    const resources = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const { topic } of data.children) {
      const child = new Path(topic)
      const childResources = await child.getResources()

      resources.push(...childResources)
    }

    return resources
  }
}

export default Path
