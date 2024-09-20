import {getMonoid} from '@effect/typeclass/data/Array'
import {TypeLambda} from 'effect/HKT'
import {LiftArbitrary} from '../../../../arbitrary.js'
import {LiftEquivalence} from '../../../../law.js'
import {GivenConcerns} from '../../parameterized/given.js'
import {Mono, monoArbitrary, monoEquivalence} from './helpers.js'

/**
 * Options for the monomorphic typeclass test runner.
 * @category monomorphic
 */
export interface MonomorphicGiven<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = string,
> {
  /**
   * A function that will lift arbitraries from any underlying type
   * to arbitraries of `F<A>`.
   */
  getArbitrary: LiftArbitrary<F, In1, Out2, Out1>
  /**
   * A function that will lift an equivalence for any underlying type
   * info an equivalence of `F<A>`.
   */
  getEquivalence: LiftEquivalence<F, In1, Out2, Out1>
}

/**
 * Unfolds the given `InvariantGiven` options for testing covariant
 * datatypes into the `GivenConcerns` required for typeclass law tests.
 * @category monomorphic
 */
export const unfoldMonomorphicGiven = <
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = string,
>(
  given: MonomorphicGiven<F, In1, Out2, Out1>,
): GivenConcerns<F, Mono, Mono, Mono, In1, Out2, Out1> => ({
  ...given,
  a: monoArbitrary,
  b: monoArbitrary,
  c: monoArbitrary,
  equalsA: monoEquivalence,
  equalsB: monoEquivalence,
  equalsC: monoEquivalence,
  Monoid: getMonoid<number>(),
})
