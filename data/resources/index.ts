import javascript from './javascript.json'


type ResourceType = "video" | "challenge" | "reading"
export interface Resource {
    title: string,
    description: string,
    url: string,
    type: ResourceType | ResourceType[],
    source: string,
}

export type Resources = {
    [resourceId: string]: Resource
}

const resources = <Resources>{
    ...javascript
}

export default resources