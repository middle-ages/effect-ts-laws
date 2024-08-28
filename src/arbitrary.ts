export {either, liftArbitraries, option, tinyInteger} from './arbitrary/data.js'
export {
  predicate,
  unary,
  unaryFromKind,
  unaryInKind,
  unaryToKind,
} from './arbitrary/function.js'
export {duration, offsetTimezone, utc, zoned} from './arbitrary/time.js'

export type {
  ArbitraryToEquivalence,
  EquivalenceToArbitrary,
  LiftArbitrary,
} from './arbitrary/types.js'

export {instances} from './arbitrary/instances.js'
export type {ArbitraryTypeLambda} from './arbitrary/instances.js'

import fastCheck from 'fast-check'
import {either, option, tinyInteger} from './arbitrary/data.js'
import {predicate, unary, unaryToKind} from './arbitrary/function.js'
import {Covariant, Monad} from './arbitrary/instances.js'
import {duration, offsetTimezone, utc, zoned} from './arbitrary/time.js'

/**
 * The `fast-check` default import, except all arbitraries from this package
 * have been injected into it for import ergonomics.
 * @category fast-check
 */
export const fc = {
  ...fastCheck,
  tinyInteger,
  either,
  option,
  predicate,
  unary,
  unaryToKind,
  duration,
  offsetTimezone,
  utc,
  zoned,
  Covariant,
  Monad,
}
