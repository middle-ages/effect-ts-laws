import * as EF from 'effect/Effect'
import fc from 'fast-check'
import {LiftArbitrary} from './types.js'

/**
 * Convert an arbitrary of `T` into a successful effect of `T`.
 * @category arbitraries
 */
export const succeed: LiftArbitrary<EF.EffectTypeLambda, never, never> = a =>
  a.map(a => EF.succeed(a))

/**
 * Convert an arbitrary of a string error message into a fail effect.
 * @category arbitraries
 */
export const fail = (
  message: fc.Arbitrary<string>,
): fc.Arbitrary<EF.Effect<never, Error>> =>
  message.map(m => EF.fail(new Error(m)))

/**
 * Convert an arbitrary of a string error message and an arbitrary of `T`
 * into a sync effect, possibly suspended.
 * @category arbitraries
 */
export const sync = <T>(
  a: fc.Arbitrary<T>,
  message: fc.Arbitrary<string>,
): fc.Arbitrary<EF.Effect<T, Error>> =>
  fc
    .oneof(succeed(a), fail(message))
    .map(sync => EF.suspend(() => sync as EF.Effect<T, Error>))
