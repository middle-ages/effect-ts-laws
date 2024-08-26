import fc from 'fast-check'

import {pipe, Predicate as PR} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {LiftArbitrary} from './types.js'

/**
 * Given an arbitrary of `B` and the type `A`, returns an arbitrary idempotent
 * function that will take exactly a single argument of type `A` and return a
 * value of type `B`.
 *
 * The generated function will explicitly discard all its arguments except the
 * first.
 */
export const unaryFunction =
  <A>() =>
  <B>(b: fc.Arbitrary<B>) =>
    fc.func(b).map(f => (a: A) => f(a)) as fc.Arbitrary<(a: A) => B>

/**
 * Given an arbitrary of `B`, a function converting arbitraries of `A` to
 * arbitraries of `F<A>`, and the type `A`, returns an arbitrary idempotent
 * function that will take exactly a single argument of type `A` and return a
 * value of type `F<B>`.
 *
 * @returns An arbitrary of type `(a: A) => F<B>`.
 */
export const unaryKleisli =
  <A>() =>
  <F extends TypeLambda, In1, Out2, Out1>(
    getArbitrary: LiftArbitrary<F, In1, Out2, Out1>,
  ) =>
  <B>(
    b: fc.Arbitrary<B>,
  ): fc.Arbitrary<(a: A) => Kind<F, In1, Out2, Out1, B>> =>
    pipe(b, getArbitrary, fc.func).map(f => (a: A) => f(a)) as fc.Arbitrary<
      (a: A) => Kind<F, In1, Out2, Out1, B>
    >

/** An arbitrary predicate of `A`. */
export const predicate = <A>(): fc.Arbitrary<PR.Predicate<A>> =>
  unaryFunction<A>()(fc.boolean())
