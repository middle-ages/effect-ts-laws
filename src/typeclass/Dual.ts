import {Monoid as MO} from '@effect/typeclass'
import type {TypeLambda} from 'effect/HKT'

/**
 * @category type lambda
 */
export interface DualTypeLambda extends TypeLambda {
  readonly type: Dual<this['Target']>
}

/**
 * A [Monoid](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/src/Monoid.ts)
 * with the `combine` arguments flipped.
 * @category typeclass
 */
export interface Dual<A> extends MO.Monoid<A> {}

/**
 * Build the `Dual<A>` of a `Monoid<A>`.
 * @category typeclass
 */
export const fromMonoid = <A>(monoid: MO.Monoid<A>): Dual<A> =>
  MO.reverse(monoid)
