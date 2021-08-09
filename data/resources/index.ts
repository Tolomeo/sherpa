import javascript from './javascript.json'

export interface Resource {
    title: string,
    description: string,
    url: string,
    type: "video" | "challenge" | "reading",
    source: string,
}

export type Resources = {
    [resourceId: string]: Resource
}

const resources = <Resources>{
    ...javascript
}

export default resources