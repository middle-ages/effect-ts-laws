import fc from 'fast-check'

import {pipe, Predicate as PR} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {LiftArbitrary} from './types.js'

/**
 * Calls
 * [fc.function](https://fast-check.dev/docs/core-blocks/arbitraries/composites/function/#func)
 * but keeps only the first argument making it act as a function of a single
 * argument.
 * @category arbitraries
 */
export const unary =
  <A>() =>
  <B>(b: fc.Arbitrary<B>) =>
    fc.func(b).map(f => (a: A) => f(a)) as fc.Arbitrary<(a: A) => B>

/**
 * An arbitrary for a function from `A` to `F<B>`. Requires an
 * arbitrary of `B`, a function converting arbitraries of `A` to
 * arbitraries of `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `(a: A) => F<B>`.
 * @category arbitraries
 */
export const unaryToKind =
  <A>() =>
  <F extends TypeLambda, R, O, E>(getArbitrary: LiftArbitrary<F, R, O, E>) =>
  <B>(b: fc.Arbitrary<B>): fc.Arbitrary<(a: A) => Kind<F, R, O, E, B>> =>
    pipe(b, getArbitrary, fc.func).map(f => (a: A) => f(a)) as fc.Arbitrary<
      (a: A) => Kind<F, R, O, E, B>
    >

/**
 * An arbitrary for a function from `F<A>` to `B`. Requires an
 * arbitrary of `B` and specifying the kind type parameters.
 * @returns An arbitrary of type `(a: F<A>) => B`.
 * @category arbitraries
 */
export const unaryFromKind =
  <A, F extends TypeLambda, R = never, O = unknown, E = unknown>() =>
  <B>(b: fc.Arbitrary<B>): fc.Arbitrary<(fa: Kind<F, R, O, E, A>) => B> =>
    fc.func(b).map(f => (fa: Kind<F, R, O, E, A>) => f(fa))
/**
 * An arbitrary for the type `F<A⇒B>`. Requires an arbitrary of `B`, a
 * function lifting `A` to `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `F<(a: A) => B>`.
 * @category arbitraries
 */
export const unaryInKind =
  <A>() =>
  <F extends TypeLambda, R, O, E>(of: <T>(t: T) => Kind<F, R, O, E, T>) =>
  <B>(b: fc.Arbitrary<B>): fc.Arbitrary<Kind<F, R, O, E, (a: A) => B>> =>
    unary<A>()(b).map(of)

/**
 * An arbitrary predicate of `A`.
 * @category arbitraries
 */
export const predicate = <A>(): fc.Arbitrary<PR.Predicate<A>> =>
  unary<A>()(fc.boolean())
