/** Helpers for dealing with equality. */
import {Array as AR, Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

/**
 * The type of a function that given any equivalence of type `A`, returns an
 * equivalence for `F<A>`. For example:
 * @example
 * ```ts
 * const makeOptionEquivalence: LiftEquivalence<OptionTypeLambda> = liftEquivalence<OptionTypeLambda>
 * ```
 * @category lifting
 */
export interface LiftEquivalence<
  F extends TypeLambda,
  In1 = never,
  Out1 = unknown,
  Out2 = unknown,
> {
  <T>(equals: EQ.Equivalence<T>): EQ.Equivalence<Kind<F, In1, Out1, Out2, T>>
}

/**
 * Given a {@link LiftEquivalence} function, and 1..n `Equivalence`s for
 * different types `A₁, A₂, ...Aₙ`, returns the given list except every
 * equivalence for type `Aᵢ` has been replaced by an equivalence for type
 * `Kind<F,In1,Out2,Out1,Aᵢ>`. For example:
 * @example
 * ```ts
 * const [eqOptionString, eqOptionNumber] = lifeEquivalences<OptionTypeLambda>(
 *   OP.getEquivalence,
 * )(
 *   numberEquals,
 *   stringEquals,
 * )
 * // eqOptionString ≡ Equivalence<Option<string>>
 * // eqOptionNumber ≡ Equivalence<Option<number>>
 * ```
 * @category lifting
 */
export const liftEquivalences =
  <F extends TypeLambda, In1 = never, Out2 = unknown, Out1 = unknown>(
    liftEquivalence: LiftEquivalence<F, In1, Out2, Out1>,
  ) =>
  <const Eqs extends EQ.Equivalence<never>[]>(...eqs: Eqs) =>
    AR.map(eqs, liftEquivalence) as LiftedEquivalences<Eqs, F, In1, Out2, Out1>

/**
 * Given the tuple of equalities for types `A₁, A₂, ...Aₙ`, returns the tuple of
 * equalities for types `F<A₁>, F<A₂>, ...F<Aₙ>`.
 * @category lifting
 */
export type LiftedEquivalences<
  Eqs extends EQ.Equivalence<never>[],
  F extends TypeLambda,
  In1,
  Out2,
  Out1,
> = {
  [K in keyof Eqs]: EQ.Equivalence<
    Kind<F, In1, Out2, Out1, Eqs[K] extends EQ.Equivalence<infer T> ? T : never>
  >
}
