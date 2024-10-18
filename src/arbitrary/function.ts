/**
 * Arbitraries for various kinds of functions.
 * @module
 */
import {pipe, Predicate as PR} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {LiftArbitrary} from './types.js'

// flipped “apply”
const applyF =
  <A, B>(f: (a: A) => B) =>
  (a: A): B =>
    f(a)

/**
 * Calls
 * [fc.function](https://fast-check.dev/docs/core-blocks/arbitraries/composites/function/#func)
 * but keeps only the first argument making it act as a function of a single
 * argument.
 * @category arbitraries
 */
export const unary: <A>() => <B>(
  b: fc.Arbitrary<B>,
) => fc.Arbitrary<(a: A) => B> = () => b => fc.func(b).map(applyF)

/**
 * An arbitrary function from `A` to `A`.
 * @category arbitraries
 */
export const endo = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<(a: A) => A> =>
  fc.func(a).map(applyF)

/**
 * Build an arbitrary binary function of type `(a: A, b: B) => C` from an
 * arbitrary of `C`.
 * @category arbitraries
 */
export const binary =
  <A, B>() =>
  <C>(c: fc.Arbitrary<C>): fc.Arbitrary<(a: A, b: B) => C> =>
    fc.func(c).map(f => (a: A, b: B) => f(a, b))

/**
 * An arbitrary for a function from `A` to `F<B>`. Requires an
 * arbitrary of `B`, a function converting arbitraries of `A` to
 * arbitraries of `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `(a: A) => F<B>`.
 * @category arbitraries
 */
export const unaryToKind =
  <A>() =>
  <F extends TypeLambda, R, O, E>(
    getArbitrary: LiftArbitrary<F, R, O, E>,
  ): (<B>(b: fc.Arbitrary<B>) => fc.Arbitrary<(a: A) => Kind<F, R, O, E, B>>) =>
  b =>
    pipe(b, getArbitrary, fc.func).map(applyF)

/**
 * An arbitrary for a function from `F<A>` to `B`. Requires an
 * arbitrary of `B` and specifying the kind type parameters.
 * @returns An arbitrary of type `(a: F<A>) => B`.
 * @category arbitraries
 */
export const unaryFromKind =
  <A, F extends TypeLambda, R = never, O = unknown, E = unknown>(): (<B>(
    b: fc.Arbitrary<B>,
  ) => fc.Arbitrary<(fa: Kind<F, R, O, E, A>) => B>) =>
  b =>
    fc.func(b).map(applyF)

/**
 * An arbitrary for the type `F<A⇒B>`. Requires an arbitrary of `B`, a
 * function lifting `A` to `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `F<(a: A) => B>`.
 * @category arbitraries
 */
export const unaryInKind =
  <A>() =>
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    of: <T>(t: T) => Kind<F, R, O, E, T>,
  ): (<B>(b: fc.Arbitrary<B>) => fc.Arbitrary<Kind<F, R, O, E, (a: A) => B>>) =>
  b =>
    unary<A>()(b).map(of)

/**
 * An arbitrary predicate of `A`.
 * @category arbitraries
 */
export const predicate = <A>(): fc.Arbitrary<PR.Predicate<A>> =>
  unary<A>()(fc.boolean())
