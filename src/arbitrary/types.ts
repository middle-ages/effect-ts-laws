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

/**
 * Extract the underlying type of the given arbitrary.
 * @category types
 */
export type UnderlyingArbitrary<Fa extends fc.Arbitrary<unknown>> =
  Fa extends fc.Arbitrary<infer A> ? A : never

/**
 * Extract the HKT type and its main underlying _covariant_ type from a type
 * that was built from an HKT.
 * @category types
 */
export type UnderlyingHkt<
  Fa extends Kind<TypeLambda, never, unknown, unknown, any>,
> = {
  Child: Fa extends Kind<TypeLambda, never, unknown, unknown, infer A>
    ? A
    : never
  Parent: Fa extends Kind<infer F, never, unknown, unknown, any> ? F : never
}

/**
 * Extract the underlying type of the given equivalence.
 * @category types
 */
export type UnderlyingEquivalence<Fa extends EQ.Equivalence<never>> =
  Fa extends EQ.Equivalence<infer A> ? A : never
