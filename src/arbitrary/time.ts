import {DateTime as DT, Duration as DU} from 'effect'
import fc from 'fast-check'

/**
 * `Duration` arbitrary. The unit of the optional `min`/`max` constraints is
 * milliseconds.
 * @category arbitraries
 */
export const duration = (
  options?: fc.IntegerConstraints,
): fc.Arbitrary<DU.Duration> => fc.integer(options).map(i => DU.millis(i))

/**
 * `DateTime.TimeZone.Offset` arbitrary. The offset is clamped between -14hrs
 * and 14hrs, allowing for a maximum 28hrs offset between any two points on
 * earth.
 * @category arbitraries
 */
export const offsetTimezone: fc.Arbitrary<DT.TimeZone.Offset> = fc
  .integer({min: -14, max: 14})
  .map(offset => DT.zoneMakeOffset(offset))

/**
 * `DateTime.Utc` arbitrary. Only valid dates are generated.
 * @category arbitraries
 */
export const utc = (constraints?: fc.DateConstraints): fc.Arbitrary<DT.Utc> =>
  fc
    .date({noInvalidDate: true, ...constraints})
    .map(date => DT.unsafeFromDate(date))

/**
 * `DateTime.Zoned` arbitrary. Only valid dates are generated.
 * @category arbitraries
 */
export const zoned = (
  constraints?: fc.DateConstraints,
): fc.Arbitrary<DT.Zoned> =>
  fc
    .tuple(utc(constraints), offsetTimezone)
    .map(([utc, zone]) => DT.setZone(utc, zone))
