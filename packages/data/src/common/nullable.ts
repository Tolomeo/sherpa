export type Nullable<T> = Exclude<T, undefined | null> | null

export const toNullable = <T>(value: T): Nullable<T> => {
  if (!value) return null

  return value as Nullable<T>
}

export type NullableValues<T> = {
  [K in keyof T]-?: Nullable<T[K]> | null
}

export type NullableItems<T> = Nullable<T>[]

export const toNullableObject = <T extends Record<string, unknown>>(
  obj: T,
): NullableValues<T> => {
  const withNullableValues: Partial<NullableValues<T>> = {}

  for (const key in obj) {
    if (!Object.hasOwnProperty.call(obj, key)) continue

    withNullableValues[key] = toNullable(obj[key])
  }

  return withNullableValues as NullableValues<T>
}

export const toNullableArray = <T>(...arr: T[]) => {
  const withNullableItems: NullableItems<T> = []

  arr.forEach((item) => {
    withNullableItems.push(toNullable(item))
  })

  return withNullableItems
}

export const mapNullable = <T, R>(
  value: Nullable<T>,
  fn: (value: NonNullable<T>) => R,
) => {
  if (!value) return null

  return fn(value)
}

export const coalesce = <T, F extends T>(
  items: NullableItems<T>,
  fallback: Nullable<F> = null,
): Nullable<T> => {
  for (const item of items) {
    if (item !== null) return item
  }

  return fallback
}
