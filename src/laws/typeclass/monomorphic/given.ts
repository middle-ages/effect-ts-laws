import type {LiftArbitrary} from '#arbitrary'
import {predicate} from '#arbitrary'
import type {LiftEquivalence} from '#law'
import {monoRecord} from '#util'
import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {GivenConcerns} from '../parameterized/given.js'

/**
 * Options for the monomorphic typeclass test runner.
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

/**
 * Options for the monomorphic typeclass test runner on the underlying type `A`.
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
  ...monoRecord(a)('a', 'b', 'c'),
  ...monoRecord(equalsA)('equalsA', 'equalsB', 'equalsC'),
  ...monoRecord(predicate<A>())('predicateA', 'predicateB', 'predicateC'),
  getArbitrary,
  getEquivalence,
  Monoid,
})
