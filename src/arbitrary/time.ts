import {DateTime as DT, Duration as DU, flow, pipe} from 'effect'
import fc from 'fast-check'
import {Monad as arbitraryMonad} from './instances.js'

const {map} = arbitraryMonad

/**
 * `Duration` arbitrary. The unit of the optional `min`/`max` constraints is
 * milliseconds.
 * @category arbitraries
 */
export const duration: (
  options?: fc.IntegerConstraints,
) => fc.Arbitrary<DU.Duration> = flow(
  fc.integer,
  map(i => DU.millis(i)),
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
