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
  R = never,
  O = unknown,
  E = unknown,
> {
  <T>(equals: EQ.Equivalence<T>): EQ.Equivalence<Kind<F, R, O, E, T>>
}

/**
 * Given a {@link LiftEquivalence} function, and 1..n `Equivalence`s for
 * different types `A₁, A₂, ...Aₙ`, returns the given list except every
 * equivalence for type `Aᵢ` has been replaced by an equivalence for type
 * `Kind<F,R,O,E,Aᵢ>`. For example:
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
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    liftEquivalence: LiftEquivalence<F, R, O, E>,
  ) =>
  <const Eqs extends EQ.Equivalence<never>[]>(...eqs: Eqs) =>
    AR.map(eqs, liftEquivalence) as LiftedEquivalences<Eqs, F, R, O, E>

/**
 * Given the tuple of equalities for types `A₁, A₂, ...Aₙ`, returns the tuple of
 * equalities for types `F<A₁>, F<A₂>, ...F<Aₙ>`.
 * @category lifting
 */
export type LiftedEquivalences<
  Eqs extends EQ.Equivalence<never>[],
  F extends TypeLambda,
  R,
  O,
  E,
> = {
  [K in keyof Eqs]: EQ.Equivalence<
    Kind<F, R, O, E, Eqs[K] extends EQ.Equivalence<infer T> ? T : never>
  >
}
