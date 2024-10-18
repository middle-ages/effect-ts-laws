/** The object with the keys `keys` and all its values set to `value`. */
export const monoRecord =
  <V>(value: V) =>
  <KS extends readonly string[]>(...keys: KS): Record<KS[number], V> => {
    const result = {} as Record<KS[number], V>
    for (const key of keys) {
      result[key as KS[number]] = value
    }
    return result
  }
