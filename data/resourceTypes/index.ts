import serializedResourceTypes from './resourceTypes.json'

export type ResourceType = {
  title: string
  description: string
}

const resourceTypes: Record<string, ResourceType> = serializedResourceTypes

export default resourceTypes
