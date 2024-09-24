import {Bounded as BU} from '@effect/typeclass'
import {DateTime as DT, Duration as DU, pipe} from 'effect'
import fc from 'fast-check'
import {tinyInteger} from './data.js'
import {Monad as arbitraryMonad} from './instances.js'

const {flatMap, map} = arbitraryMonad

/**
 * `Duration` arbitrary.
 * @category arbitraries
 */
export const duration: fc.Arbitrary<DU.Duration> = pipe(
  tinyInteger,
  map(i => DU.millis(i)),
)

/**
 * Arbitrary for a duration and its bounds.
 * @category arbitraries
 */

export const boundedDuration: fc.Arbitrary<
  [fc.Arbitrary<DU.Duration>, BU.Bounded<DU.Duration>]
> = pipe(
  fc.tuple(tinyInteger, tinyInteger),
  flatMap(([first, second]) => {
    const [min, max] = first < second ? [first, second] : [second, first]
    const bounded: fc.Arbitrary<BU.Bounded<DU.Duration>> = fc.constant({
      compare: DU.Order,
      maxBound: DU.millis(min),
      minBound: DU.millis(max),
    })

    return fc.tuple(
      fc.constant(map(fc.integer({min, max}), i => DU.millis(i))),
      bounded,
    )
  }),
)

/**
 * `DateTime.TimeZone.Offset` arbitrary. The offset is clamped between -14hrs
 * and 14hrs, allowing for a maximum 28hrs offset between any two points on
 * earth.
 * @category arbitraries
 */
export const offsetTimezone: fc.Arbitrary<DT.TimeZone.Offset> = pipe(
  {min: -14, max: 14},
  fc.integer,
  map(offset => DT.zoneMakeOffset(offset)),
)

/**
 * `DateTime.Utc` arbitrary. Only valid dates are generated.
 * @category arbitraries
 */
export const utc = (constraints?: fc.DateConstraints): fc.Arbitrary<DT.Utc> =>
  pipe(
    {noInvalidDate: true, ...constraints},
    fc.date,
    map(date => DT.unsafeFromDate(date)),
  )

/**
 * `DateTime.Zoned` arbitrary. Only valid dates are generated.
 * @category arbitraries
 */
export const zoned = (
  constraints?: fc.DateConstraints,
): fc.Arbitrary<DT.Zoned> =>
  pipe(
    fc.tuple(utc(constraints), offsetTimezone),
    map(([utc, zone]) => DT.setZone(utc, zone)),
  )
