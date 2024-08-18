import open from 'open'

export type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | Array<JSONSerializable>
  | { [key: string]: JSONSerializable }

const util = {
  open,
  clone: <T extends JSONSerializable>(value: T) =>
    JSON.parse(JSON.stringify(value)) as T,
}

export default util
