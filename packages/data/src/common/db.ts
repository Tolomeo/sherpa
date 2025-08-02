/* eslint-disable @typescript-eslint/no-explicit-any -- Most of the typing is copy-pasted from mongodb types */
import NEDB, { type Document } from '@seald-io/nedb'
import type { ZodObject } from 'zod'

type Nullable<T> = T | null

/* type IsAny<Type, ResultIfAny, ResultIfNotAny> = true extends false & Type
  ? ResultIfAny
  : ResultIfNotAny */

/* type KeysOfAType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never
}[keyof TSchema] */

/* type KeysOfOtherType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? never : key
}[keyof TSchema] */

/* type NotAcceptedFields<TSchema, FieldType> = {
  readonly [key in KeysOfOtherType<TSchema, FieldType>]?: never
} */

/* type AcceptedFields<TSchema, FieldType, AssignableType> = {
  readonly [key in KeysOfAType<TSchema, FieldType>]?: AssignableType
} */

/* type OnlyFieldsOfType<
  TSchema,
  FieldType = any,
  AssignableType = FieldType,
> = IsAny<
  TSchema[keyof TSchema],
  AssignableType extends FieldType
    ? Record<string, FieldType>
    : Record<string, AssignableType>,
  AcceptedFields<TSchema, FieldType, AssignableType> &
    NotAcceptedFields<TSchema, FieldType> &
    Record<string, AssignableType>
> */

type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
    ? `${T[0]}`
    : T extends [string | number, ...infer R]
      ? `${T[0]}${D}${Join<R, D>}`
      : string

type NestedPaths<Type, Depth extends number[]> = Depth['length'] extends 8
  ? []
  : Type extends
        | string
        | number
        | bigint
        | boolean
        | Date
        | RegExp
        | Buffer
        | Uint8Array
        | ((...args: any[]) => any)
    ? /* | {
            _bsontype: string
          } */
      []
    : Type extends ReadonlyArray<infer ArrayType>
      ? [] | [number, ...NestedPaths<ArrayType, [...Depth, 1]>]
      : Type extends Map<string, any>
        ? [string]
        : Type extends object
          ? {
              [Key in Extract<keyof Type, string>]: Type[Key] extends Type
                ? [Key]
                : Type extends Type[Key]
                  ? [Key]
                  : Type[Key] extends ReadonlyArray<infer ArrayType>
                    ? Type extends ArrayType
                      ? [Key]
                      : ArrayType extends Type
                        ? [Key]
                        : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] // child is not structured the same as the parent
                    : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] | [Key]
            }[Extract<keyof Type, string>]
          : []

type WithId<TSchema> = Omit<TSchema, '_id'> & {
  _id: string
}

type RegExpOrString<T> = T extends string ? RegExp | T : T

type AlternativeType<T> =
  T extends ReadonlyArray<infer U> ? T | RegExpOrString<U> : RegExpOrString<T>

interface FilterOperators<TValue> {
  $eq?: TValue
  $gt?: TValue
  $gte?: TValue
  $in?: ReadonlyArray<TValue>
  $lt?: TValue
  $lte?: TValue
  $ne?: TValue
  $nin?: ReadonlyArray<TValue>
  $not?: TValue extends string
    ? FilterOperators<TValue> | RegExp
    : FilterOperators<TValue>
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean
  $regex?: TValue extends string ? RegExp | string : never
  $elemMatch?: Document<TValue>
  /*  $type?: BSONType | BSONTypeAlias;
    $expr?: Record<string, any>;
    $jsonSchema?: Record<string, any>;
    $mod?: TValue extends number ? [number, number] : never;
    $options?: TValue extends string ? string : never;
    $geoIntersects?: {
        $geometry: Document;
    };
    $geoWithin?: Document;
    $near?: Document;
    $nearSphere?: Document;
    $maxDistance?: number;
    $all?: ReadonlyArray<any>;
    $elemMatch?: Document;
    $size?: TValue extends ReadonlyArray<any> ? number : never;
    $bitsAllClear?: BitwiseFilter;
    $bitsAllSet?: BitwiseFilter;
    $bitsAnyClear?: BitwiseFilter;
    $bitsAnySet?: BitwiseFilter;
    $rand?: Record<string, never>; */
}

type PropertyType<Type, Property extends string> = string extends Property
  ? unknown
  : Property extends keyof Type
    ? Type[Property]
    : Property extends `${number}`
      ? Type extends ReadonlyArray<infer ArrayType>
        ? ArrayType
        : unknown
      : Property extends `${infer Key}.${infer Rest}`
        ? Key extends `${number}`
          ? Type extends ReadonlyArray<infer ArrayType>
            ? PropertyType<ArrayType, Rest>
            : unknown
          : Key extends keyof Type
            ? Type[Key] extends Map<string, infer MapType>
              ? MapType
              : PropertyType<Type[Key], Rest>
            : unknown
        : unknown

type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>

type Filter<TSchema> = {
  [P in keyof WithId<TSchema>]?: Condition<WithId<TSchema>[P]>
} & RootFilterOperators<WithId<TSchema>>

interface RootFilterOperators<TSchema> {
  $and?: Filter<TSchema>[]
  // $nor?: Filter<TSchema>[]
  $or?: Filter<TSchema>[]
  $where?: (this: TSchema) => boolean
  /* $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
  $where?: string | ((this: TSchema) => boolean)
  $comment?: string | Document */
}

type StrictFilter<TSchema> =
  | Partial<TSchema>
  | ({
      [Property in Join<NestedPaths<WithId<TSchema>, []>, '.'>]?: Condition<
        PropertyType<WithId<TSchema>, Property>
      >
    } & RootFilterOperators<WithId<TSchema>>)

export const migrate = async <
  From extends Db<DocumentSchema>,
  To extends Db<DocumentSchema>,
>(
  from: From,
  to: To,
  transformer: (
    fromDoc: Document<From['config']['schema']['_output']>,
  ) => Document<To['config']['schema']['_output']>,
) => {
  const fromDocuments = await from.findAll()

  for (const fromDocument of fromDocuments) {
    const toDocument = transformer(fromDocument)
    await to.insertOne(toDocument)
  }
}

type DocumentSchema = ZodObject<any>

interface NEDBOptions {
  filename: string
  // TODO: type unique as a valid keypath of S['_output']
  indexes: { unique: string }
}

class Db<S extends DocumentSchema> {
  public static async build<S extends DocumentSchema>(
    schema: S,
    options: NEDBOptions,
  ): Promise<Db<S>> {
    const { filename, indexes } = options
    const db = new NEDB({ filename, autoload: true })

    await db.ensureIndexAsync({
      fieldName: indexes.unique,
      unique: true,
      sparse: false,
    })
    await db.compactDatafileAsync()

    return new Db(db, { schema, options })
  }

  readonly config: {
    schema: S
    options: NEDBOptions
  }

  private db: NEDB<S['_output']>

  private constructor(
    db: NEDB<S['_output']>,
    config: { schema: S; options: NEDBOptions },
  ) {
    this.db = db
    this.config = config
  }

  async drop() {
    await this.db.dropDatabaseAsync()
  }

  async migrate<To extends DocumentSchema>(
    schema: To,
    transformer: (doc: Document<S['_output']>) => Document<To>,
  ) {
    const documents = await this.findAll()

    await this.drop()

    const db = await Db.build(schema, this.config.options)

    for (const document of documents) {
      await db.insertOne(transformer(document))
    }

    return db
  }

  async findAll(filter: StrictFilter<S['_output']> = {}) {
    const docs: Document<S['_output']>[] = await this.db.findAsync(filter)

    return docs
  }

  async findOne(filter: StrictFilter<S['_output']>) {
    const doc: Nullable<Document<S['_output']>> =
      await this.db.findOneAsync(filter)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- NEDB could return null when no doc is found
    if (!doc) return null

    return doc
  }

  async insertOne(insert: S['_output']) {
    const validation = this.config.schema.safeParse(insert)

    if (!validation.success) {
      throw validation.error
    }

    const doc = this.db.insertAsync<S['_output']>(insert)

    await this.db.compactDatafileAsync()

    return doc
  }

  async updateOne(
    id: string,
    update: S['_output'],
  ): Promise<Document<S['_output']>> {
    const validation = this.config.schema.safeParse(update)

    if (!validation.success) {
      throw validation.error
    }

    await this.db.updateAsync({ _id: id }, update)
    await this.db.compactDatafileAsync()

    return {
      ...update,
      _id: id,
    }
  }

  async removeOne(id: string) {
    await this.db.removeAsync({ _id: id }, {})
    await this.db.compactDatafileAsync()
  }
}

export { type Document }
export default Db
