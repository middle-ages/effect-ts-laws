import {Monoid as MO, Semigroup as SE} from '@effect/typeclass'
import {identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import * as FN from './Function.js'

/**
 * A unary function where argument type is return type.
 * @category datatype
 */
export interface Endo<A> extends FN.FunctionIn<A, A> {}

/**
 * @category type lambda
 */
export interface EndoTypeLambda extends TypeLambda {
  readonly type: Endo<this['Target']>
}

const combine =
  <A>(self: Endo<A>, that: Endo<A>): Endo<A> =>
  a =>
    pipe(a, self, that)

/**
 * @category instances
 */
export const getSemigroup = <A>(): SE.Semigroup<Endo<A>> => ({
  combine,
  combineMany: (self, collection) =>
    Array.from(collection).reduce(
      (accumulator, value) => combine(accumulator, value),
      self,
    ),
})

/**
 * @category instances
 */
export const getMonoid = <A>(): MO.Monoid<Endo<A>> =>
  MO.fromSemigroup(getSemigroup<A>(), identity)
