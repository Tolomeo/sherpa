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
  clone: <T extends JSONSerializable>(value: T): T =>
    JSON.parse(JSON.stringify(value)),
}

export default util
