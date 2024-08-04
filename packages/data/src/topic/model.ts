import { getById } from '../resource'
import type {
  ResourceData,
  TopicData,
  PopulatedTopicData,
  TopicName,
} from '../../types'
import TopicsStore, { type TopicDocument } from './store'

export const getAll = async () => {
  const docs = await TopicsStore.getInstance().then((store) => store.findAll())
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export const getParents = async () => {
  const docs = await TopicsStore.getInstance().then((store) =>
    store.findAll({ topic: /^[^.]+$/ }),
  )
  const paths = docs.map((p) => new Topic(p))

  return paths
}

export const getByName = async (name: string) => {
  const topic = name as TopicName
  const doc = await TopicsStore.getInstance().then((store) =>
    store.findOne({ topic }),
  )

  if (!doc) throw new Error(`Topic named ${name} not found`)

  return new Topic(doc)
}

export const getAllByResourceId = async (resourceId: string) => {
  const docs = await TopicsStore.getInstance().then((store) =>
    store.findAll({
      $or: [
        { main: { $in: [resourceId] } },
        { resources: { $in: [resourceId] } },
      ],
    }),
  )

  return docs.map((t) => new Topic(t))
}

export interface ResourceGroup {
  type: ResourceData['type']
  resources: ResourceData[]
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
    const { _id: id, ...topic } = this.document

    this.document = await TopicsStore.getInstance().then((store) =>
      store.updateOne(id, {
        ...topic,
        ...update,
      }),
    )

    return this.document
  }

  public get topic() {
    return this.document.topic
  }

  public get data() {
    const { _id, ...topicData } = this.document

    return topicData
  }

  public async populate() {
    const data = this.data
    const populatedData: PopulatedTopicData = {
      ...data,
      main: null,
      resources: null,
      children: null,
    }

    if (data.main) {
      populatedData.main = []

      for (const mainUrl of data.main) {
        const resource = await getById(mainUrl)

        populatedData.main.push(resource.data)
      }
    }

    if (data.resources) {
      populatedData.resources = []

      for (const resourceUrl of data.resources) {
        const resource = await getById(resourceUrl)

        populatedData.resources.push(resource.data)
      }
    }

    if (data.children) {
      populatedData.children = []

      for (const child of data.children) {
        const childTopic = await getByName(child)

        populatedData.children.push(await childTopic.populate())
      }
    }

    return populatedData
  }

  public async getResources(): Promise<string[]> {
    const data = this.data
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
    await this.update(update)

    return this.data
  }
}

export default Topic
