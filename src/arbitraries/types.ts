import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * The type of a function that given any arbitrary of type `A`, returns an
 * arbitrary for `F<A>`.
 */
export interface LiftArbitrary<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  <A>(a: fc.Arbitrary<A>): fc.Arbitrary<Kind<F, In1, Out2, Out1, A>>
}

/** Convert an equivalence of `A` to an arbitrary of `A`. */
export type EquivalenceToArbitrary<Eq extends EQ.Equivalence<never>> = (
  eq: Eq,
) => Eq extends EQ.Equivalence<infer A> ? fc.Arbitrary<A> : never

/** Convert an arbitrary of `A` to an equivalence of `A`. */
export type ArbitraryToEquivalence<Arb extends fc.Arbitrary<never>> = (
  arb: Arb,
) => Arb extends fc.Arbitrary<infer A> ? fc.Arbitrary<A> : never
