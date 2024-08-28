/** Helpers for dealing with equality. */
import {Array as AR, Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

/**
 * The type of a function that given any equivalence of type `A`, returns an
 * equivalence for `F<A>`. For example:
 *
 * @example
 * ```ts
 * const makeOptionEquivalence: LiftEquivalence<OptionTypeLambda> = liftEquivalence<OptionTypeLambda>
 * ```
 *
 * @category Equivalence Combinators
 */
export interface LiftEquivalence<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  <O>(equals: EQ.Equivalence<O>): EQ.Equivalence<Kind<F, In1, Out2, Out1, O>>
}

/**
 * Given a {@link LiftEquivalence} function, and 1..n `Equivalence`s for
 * different types `A₁, A₂, ...Aₙ`, returns the given list except every
 * equivalence for type `Aᵢ` has been replaced by an equivalence for type
 * `Kind<F,In1,Out2,Out1,Aᵢ>`. For example:
 *
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
 *
 * @category Equivalence Combinators
 */
export const liftEquivalences = <
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  liftEquivalence: LiftEquivalence<F, In1, Out2, Out1>,
) => {
  type Data<T> = Kind<F, In1, Out2, Out1, T>

  return <const Eqs extends EQ.Equivalence<never>[]>(...eqs: Eqs) =>
    AR.map(eqs, liftEquivalence) as {
      [K in keyof Eqs]: EQ.Equivalence<
        Data<Eqs[K] extends EQ.Equivalence<infer T> ? T : never>
      >
    }
}
