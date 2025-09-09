export type Nullable<T> = Exclude<T, undefined> | null

export const nullable = <T>(value: T): Nullable<T> => {
  if (!value) return null

  return value as Nullable<T>
}

export type NullableValues<T> = {
  [K in keyof T]-?: Nullable<T[K]> | null
}

export const nullableValues = <T extends Record<string, unknown>>(
  obj: T,
): NullableValues<T> => {
  const withNullableValues: Partial<NullableValues<T>> = {}

  for (const key in obj) {
    if (!Object.hasOwnProperty.call(obj, key)) continue

    withNullableValues[key] = nullable(obj[key])
  }

  return withNullableValues as NullableValues<T>
}
