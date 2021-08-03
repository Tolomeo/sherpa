import javascript from './javascript.json'
import { Resources } from './types'

const resources: { [resourceType: string]: Resources } = {
    javascript
}

export default resources
export * from './types'