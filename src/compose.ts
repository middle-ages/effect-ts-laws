import {
  Applicative as AP,
  Covariant as CO,
  Foldable as FO,
  Invariant as IN,
  Of as OF,
  Traversable as TA,
} from '@effect/typeclass'
import {mapComposition} from '@effect/typeclass/Covariant'
import {imapComposition} from '@effect/typeclass/Invariant'
import {ofComposition} from '@effect/typeclass/Of'
import {
  productComposition,
  productManyComposition,
} from '@effect/typeclass/SemiProduct'
import {traverseComposition} from '@effect/typeclass/Traversable'
import {dual, pipe} from 'effect/Function'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * Compose an `Of` instance by nesting a pair of `Of` instances, the
 * first on the outside and the second on the inside.
 * @category composition
 */
export const composeOf = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: OF.Of<F>,
  G: OF.Of<G>,
): OF.Of<ComposeTypeLambda<F, G, R, O, E>> => ({
  of: ofComposition(F, G) as OF.Of<ComposeTypeLambda<F, G, R, O, E>>['of'],
})

/**
 * Compose an `Invariant` instance by nesting a pair of `Invariants`s, the
 * first on the outside and the second on the inside.
 * @category composition
 */
export const composeInvariant = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: IN.Invariant<F>,
  G: IN.Invariant<G>,
): IN.Invariant<ComposeTypeLambda<F, G, R, O, E>> => ({
  imap: dual(3, imapComposition(F, G)),
})

/**
 * Compose a `Covariant` instance by nesting a pair of `Covariant`s, the first
 * on the outside and the second on the inside.
 * @category composition
 */
export const composeCovariant = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: CO.Covariant<F>,
  G: CO.Covariant<G>,
): CO.Covariant<ComposeTypeLambda<F, G, R, O, E>> => ({
  ...composeInvariant(F, G),
  map: dual(2, mapComposition(F, G)),
})

/**
 * Compose a pair of applicatives. Their composition is an applicative of their
 * nested types. Useful when testing traversable composition laws.
 * @category composition
 */
export const composeApplicative = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: AP.Applicative<F>,
  G: AP.Applicative<G>,
): AP.Applicative<ComposeTypeLambda<F, G, R, O, E>> => ({
  ...composeCovariant(F, G),
  ...composeOf(F, G),
  product: productComposition(F, G),
  productMany: productManyComposition(F, G),
  productAll: collection => pipe(collection, F.productAll, F.map(G.productAll)),
})

/**
 * Compose a pair of traversables. Their composition is a traversable of their
 * nested types.
 * @category composition
 */
export const composeTraversable = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: TA.Traversable<F>,
  G: TA.Traversable<G>,
): TA.Traversable<ComposeTypeLambda<F, G, R, O, E>> => ({
  traverse: <P extends TypeLambda>(P: AP.Applicative<P>) =>
    dual(2, traverseComposition(F, G)(P)),
})

/**
 * Compose a pair of foldables. Their composition is a foldable of their
 * nested types.
 * @category composition
 */
export const composeFoldable = <
  F extends TypeLambda,
  G extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: FO.Foldable<F>,
  G: FO.Foldable<G>,
): FO.Foldable<ComposeTypeLambda<F, G>> => ({
  reduce: dual(
    3,
    <A, B>(
      self: Kind<F, R, O, E, Kind<G, R, O, E, A>>,
      b: B,
      f: (b: B, a: A) => B,
    ): B => FO.reduceComposition(F, G)(self, b, f),
  ),
})

/**
 * A type lambda for a nested pair of type lambdas. Nests the given type lambdas
 * with the first as the outer layer, and the the second as the inner one. The
 * kind of a nested type lambda is the nesting of the kinds of the given type
 * lambdas. For example:
 * @example
 * import {ComposeTypeLambda} from 'effect-ts-laws'
 * import {OptionTypeLambda} from 'effect/Option'
 * import {Kind} from 'effect/HKT'
 * import {ReadonlyArrayTypeLambda} from 'effect/Array'
 *
 * // A type lambda for the higher-kinded type `Option<ReadonlyArray>`:
 * export type OptionArrayLambda = ComposeTypeLambda<
 *   OptionTypeLambda,
 *   ReadonlyArrayTypeLambda
 * >
 * // Applying the new type lambda to the type `number`:
 * export type NumericOptionArray = Kind<
 *   OptionArrayLambda,
 *   never,
 *   unknown,
 *   unknown,
 *   number
 * >
 * // NumericOptionArray ≡ Option<ReadonlyArray<number>>
 * @category composition
 */
export interface ComposeTypeLambda<
  F extends TypeLambda,
  G extends TypeLambda,
  R1 = unknown,
  O1 = never,
  E1 = never,
  R2 = R1,
  O2 = O1,
  E2 = E1,
> extends TypeLambda {
  readonly type: Kind<F, R1, O1, E1, Kind<G, R2, O2, E2, this['Target']>>
}

/**
 * Map of typeclass name to the function that can compose a pair of the
 * typeclass instances to create a new instance of the typeclass.
 * @category composition
 */
export const composeMap = {
  Of: composeOf,
  Invariant: composeInvariant,
  Covariant: composeCovariant,
  Applicative: composeApplicative,
  Foldable: composeFoldable,
  Traversable: composeTraversable,
}

/**
 * Literal string union of typeclasses with a `compose*` function.
 * @category composition
 */
export type ComposeKey = keyof typeof composeMap
