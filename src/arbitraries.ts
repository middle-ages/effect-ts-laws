import fc from 'fast-check'

import {Predicate as PR} from 'effect'

export {either} from './arbitraries/Either.js'
export {option} from './arbitraries/Option.js'

/**
 * An integer arbitrary small enough to avoid numeric overflows in
 * generated functions.
 */
export const tinyInteger = fc.integer({min: -100, max: 100})

/**
 * Given an arbitrary of `B` and the type `A, returns an idempotent arbitrary
 * function that will take exactly a single argument of type `A` and return a
 * value of type `B`.
 */
export const unaryFunction =
  <B>(arbitraryB: fc.Arbitrary<B>) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <A>() =>
    fc.func(arbitraryB).map(f => (a: A) => f(a)) as fc.Arbitrary<(a: A) => B>

/** An arbitrary predicate of `A`. */
export const predicate = <A>(): fc.Arbitrary<PR.Predicate<A>> =>
  unaryFunction(fc.boolean())<A>()
