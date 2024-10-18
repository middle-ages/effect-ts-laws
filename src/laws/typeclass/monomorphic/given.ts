import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {predicate} from '../../../arbitrary.js'
import type {LiftArbitrary} from '../../../arbitrary.js'
import type {LiftEquivalence} from '../../../law.js'
import {monoRecord} from '../../../util.js'
import type {GivenConcerns} from '../parameterized/given.js'
import {monoArbitrary, monoEquivalence, monoMonoid} from './helpers.js'
import type {Mono} from './helpers.js'

/**
 * Options for the monomorphic typeclass test runner on the underlying type
 * `Mono`.
 * @category monomorphic
 */
export interface MonomorphicGiven<
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
> {
  /**
   * A function that will lift arbitraries from any underlying type
   * to arbitraries of `F<A>`.
   */
  getArbitrary: LiftArbitrary<F, R, O, E>
  /**
   * A function that will lift an equivalence for any underlying type
   * info an equivalence of `F<A>`.
   */
  getEquivalence: LiftEquivalence<F, R, O, E>
}

/** * Options for the monomorphic typeclass test runner on the underlying type `A`.
 * @category monomorphic
 */
export interface MonomorphicGivenOf<
  F extends TypeLambda,
  A,
  R = never,
  O = unknown,
  E = unknown,
> extends MonomorphicGiven<F, R, O, E> {
  /** An arbitrary for the underlying type `A`. */
  a: fc.Arbitrary<A>
  /** An equivalence for the underlying type `A`. */
  equalsA: EQ.Equivalence<A>
  /** A monoid for the underlying type `A`. */
  Monoid: MO.Monoid<A>
}

/**
 * Build the `GivenConcerns` for monomorphic typeclass law tests on the
 * underlying type `A`.
 * @category monomorphic
 */
export const unfoldGivenConcerns = <A>(
  a: fc.Arbitrary<A>,
  equalsA: EQ.Equivalence<A>,
) => ({
  ...monoRecord(a)('a', 'b', 'c'),
  ...monoRecord(equalsA)('equalsA', 'equalsB', 'equalsC'),
  ...monoRecord(predicate<A>())('predicateA', 'predicateB', 'predicateC'),
})

/**
 * Build the options for monomorphic typeclass law tests on the underlying type
 * `A`.
 * @category monomorphic
 */
export const unfoldMonomorphicGiven = <
  F extends TypeLambda,
  A,
  R = never,
  O = unknown,
  E = unknown,
>({
  a,
  equalsA,
  getEquivalence,
  getArbitrary,
  Monoid,
}: MonomorphicGivenOf<F, A, R, O, E>): GivenConcerns<F, A, A, A, R, O, E> => ({
  ...unfoldGivenConcerns(a, equalsA),
  getArbitrary,
  getEquivalence,
  Monoid,
})

/**
 * Build the options for monomorphic typeclass law tests on the underlying type
 * `Mono` from a function that will lift equivalence in the higher-kinded type
 * under test, and one that will lift an arbitrary.
 * @category monomorphic
 */
export const unfoldMonoGiven = <
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  getEquivalence: LiftEquivalence<F, R, O, E>,
  getArbitrary: LiftArbitrary<F, R, O, E>,
): GivenConcerns<F, Mono, Mono, Mono, R, O, E> =>
  unfoldMonomorphicGiven<F, Mono, R, O, E>({
    a: monoArbitrary,
    equalsA: monoEquivalence,
    Monoid: monoMonoid,
    getEquivalence,
    getArbitrary,
  })
