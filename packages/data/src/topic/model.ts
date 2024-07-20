import { getById } from '../resource'
import type { ResourceData, TopicData, PopulatedTopicData } from '../../types'
import TopicsStore, { type TopicDocument } from './store'

export const getAll = async () => {
  const docs = await TopicsStore.findAll()
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export const getParents = async () => {
  const docs = await TopicsStore.findAllByTopic(/^[^.]+$/)
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export const getByName = async (topic: string) => {
  const doc = await TopicsStore.findOne({ topic })

  if (!doc) throw new Error(`Topic named ${topic} not found`)

  return new Topic(doc)
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

      populatedPath.main.push(resource.get())
    }
  }

  if (path.resources) {
    populatedPath.resources = []

    for (const resourceUrl of path.resources) {
      const resource = await getById(resourceUrl)

      populatedPath.resources.push(resource.get())
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
  document: TopicDocument

  constructor(path: TopicDocument) {
    this.document = path
  }

  /* private async read() {
    const data = await TopicsStore.findOneByTopic(this.topic)

    if (!data) {
      throw new Error(`Path ${this.topic} data not found`)
    }

    this.data = data

    return this.data
  } */

  private async update(update: Partial<TopicData>) {
    const { _id: id, ...path } = this.document

    this.document = await TopicsStore.updateOne(id, {
      ...path,
      ...update,
    })

    return this.document
  }

  public get topic() {
    return this.document.topic
  }

  public get data() {
    const { _id, ...topicData } = this.document

    return topicData
  }

  public get(populated?: false): TopicData
  public get(populated: true): Promise<PopulatedTopicData>
  public get(populated?: boolean): TopicData | Promise<PopulatedTopicData> {
    if (!populated) return this.data

    return populate(this.data)
  }

  public async getResources(): Promise<string[]> {
    const data = this.get()

    if (!data) return []

    const resources: string[] = []

    data.main && resources.push(...data.main)

    data.resources && resources.push(...data.resources)

    if (!data.children) return resources

    for (const topic of data.children) {
      const child = await getByName(topic)

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
