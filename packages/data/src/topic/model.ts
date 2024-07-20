import { getById } from '../resource'
import type { ResourceData, TopicData, PopulatedTopicData } from '../../types'
import TopicsStore, { type TopicDocument } from './store'

export const getTopic = async (topic: string) => {
  const doc = await TopicsStore.findOneByTopic(topic)

  if (!doc) return null

  return new Topic(doc)
}

export const getAll = async () => {
  const docs = await TopicsStore.findAll()
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export const getRoots = async () => {
  const docs = await TopicsStore.findAllByTopic(/^[^.]+$/)
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export interface ResourceGroup {
  type: ResourceData['type']
  resources: ResourceData[]
}

const populate = async (path: TopicData): Promise<PopulatedTopicData> => {
  const populatedPath: PopulatedTopicData = {
    ...path,
    main: null,
    resources: null,
    children: null,
  }

  if (path.main) {
    populatedPath.main = []

    for (const mainUrl of path.main) {
      const resource = await getById(mainUrl)

      populatedPath.main.push(await resource.get())
    }
  }

  if (path.resources) {
    populatedPath.resources = []

    for (const resourceUrl of path.resources) {
      const resource = await getById(resourceUrl)

      populatedPath.resources.push(await resource.get())
    }
  }

  if (path.children) {
    populatedPath.children = []

    for (const child of path.children) {
      const childPathData = await TopicsStore.findOneByTopic(child)

      if (!childPathData) throw new Error(`Child path ${child} not found`)

      populatedPath.children.push(await populate(childPathData))
    }
  }

  return populatedPath
}

class Topic {
  data: TopicDocument

  constructor(path: TopicDocument) {
    this.data = path
  }

  private async read() {
    const data = await TopicsStore.findOneByTopic(this.topic)

    if (!data) {
      throw new Error(`Path ${this.topic} data not found`)
    }

    this.data = data

    return this.data
  }

  private async update(update: Partial<TopicData>) {
    const { _id: id, ...path } = this.data

    this.data = await TopicsStore.updateOne(id, {
      ...path,
      ...update,
    })

    return this.data
  }

  public get topic() {
    return this.data.topic
  }

  public async get(populated?: false): Promise<TopicData>
  public async get(populated: true): Promise<PopulatedTopicData>
  public async get(
    populated?: boolean,
  ): Promise<TopicData | PopulatedTopicData> {
    const data = await this.read()

    const { _id, ...pathData } = data

    if (populated) return populate(pathData)

    return pathData
  }

  public async getResources(): Promise<string[]> {
    const data = await this.get()

    if (!data) return []

    const resources: string[] = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const topic of data.children) {
      const child = await getTopic(topic)

      if (!child) throw new Error(`Child path ${topic} data not found`)

      const childResources = await child.getResources()

      resources.push(...childResources)
    }

    return resources
  }

  public async change(update: Partial<TopicData>) {
    const updated = await this.update(update)

    const { _id, ...data } = updated
    return data
  }
}

export default Topic
