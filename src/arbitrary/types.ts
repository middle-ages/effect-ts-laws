import {Equivalence as EQ} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * The type of a function that given any arbitrary of type `A`, returns an
 * arbitrary for `F<A>`.
 * @category lifting
 */
export interface LiftArbitrary<
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
> {
  <A>(a: fc.Arbitrary<A>): fc.Arbitrary<Kind<F, R, O, E, A>>
}

/**
 * Convert an equivalence of `A` to an arbitrary of `A`.
 * @category lifting
 */
export type EquivalenceToArbitrary<Eq extends EQ.Equivalence<never>> = (
  eq: Eq,
) => Eq extends EQ.Equivalence<infer A> ? fc.Arbitrary<A> : never

/**
 * Convert an arbitrary of `A` to an equivalence of `A`.
 * @category lifting
 */
export type ArbitraryToEquivalence<Arb extends fc.Arbitrary<never>> = (
  arb: Arb,
) => Arb extends fc.Arbitrary<infer A> ? fc.Arbitrary<A> : never
