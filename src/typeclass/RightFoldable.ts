import {Foldable as FO} from '@effect/typeclass'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * @category type lambda
 */
export interface RightFoldableTypeLambda extends TypeLambda {
  readonly type: RightFoldable<this['Target'] & TypeLambda>
}

/**
 * The type of the `reduceRight` function for the foldable instance of the
 * higher-kinded datatype `F`.
 *
 * Not included in the `effect-ts`
 * [Foldable](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/src/Foldable.ts)
 * typeclass but implemented for several datatypes, for example
 * [Array](https://github.com/Effect-TS/effect/blob/main/packages/effect/src/Array.ts#L2505).
 * @category typeclass
 */
export interface ReduceRight<F extends TypeLambda> {
  <A, B, R = never, O = unknown, E = unknown>(
    zero: B,
    f: (accumulator: B, value: A) => B,
  ): (self: Kind<F, R, O, E, A>) => B
  <A, B, R = never, O = unknown, E = unknown>(
    self: Kind<F, R, O, E, A>,
    zero: B,
    f: (accumulator: B, value: A) => B,
  ): B
}

/**
 * Adds a `reduceRight` function to
 * [Foldable](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/src/Foldable.ts).
 * @category typeclass
 */
export interface RightFoldable<F extends TypeLambda> extends FO.Foldable<F> {
  readonly reduceRight: ReduceRight<F>
}
