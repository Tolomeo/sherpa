import type { ResourceData } from '@sherpa/data/resource'
import type { ResourceTypeName } from '../config'

export const getResourceTypeName = (resource: ResourceData) => {
  const { type } = resource

  let typeName: ResourceTypeName

  switch (type.name) {
    case 'knowledge':
      typeName = `${type.name}.${type.variant}`
      break
    case 'reference':
      typeName = `${type.name}.${type.variant}`
      break
    default:
      typeName = type.name
  }

  return typeName
}
