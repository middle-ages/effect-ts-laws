import {boundedDuration, duration, zoned} from '#effect-ts-laws'
import fc from 'fast-check'

describe('time', () => {
  test('boundedDuration', () => {
    fc.assert(
      fc.property(
        fc.tuple(boundedDuration, duration, duration),
        ([[, bounded], left, right]) =>
          Math.abs(bounded.compare(left, right)) < 2,
      ),
    )
  })

  test('zoned', () => {
    fc.assert(
      fc.property(
        zoned({min: new Date(0), max: new Date(3600)}),
        z => z.epochMillis <= 3600 * 1000,
      ),
    )
  })
})
