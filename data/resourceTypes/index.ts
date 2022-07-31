import serializedResourceTypes from './resourceTypes.json'

export type ResourceType = {
  title: string
  description: string
}

export type ResourceTypes = Record<string, ResourceType>

const resourceTypes: ResourceTypes = serializedResourceTypes

export default resourceTypes
