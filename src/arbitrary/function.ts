import fc from 'fast-check'

import {flow, Predicate as PR} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Monad as arbitraryMonad} from './instances.js'
import {LiftArbitrary} from './types.js'

const {map} = arbitraryMonad

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
) => fc.Arbitrary<(a: A) => B> = () => flow(fc.func, map(applyF))

/**
 * An arbitrary for a function from `A` to `F<B>`. Requires an
 * arbitrary of `B`, a function converting arbitraries of `A` to
 * arbitraries of `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `(a: A) => F<B>`.
 * @category arbitraries
 */
export const unaryToKind =
  <A>() =>
  <F extends TypeLambda, In1, Out2, Out1>(
    getArbitrary: LiftArbitrary<F, In1, Out2, Out1>,
  ): (<B>(
    b: fc.Arbitrary<B>,
  ) => fc.Arbitrary<(a: A) => Kind<F, In1, Out2, Out1, B>>) =>
    flow(getArbitrary, fc.func, map(applyF))

/**
 * An arbitrary for a function from `F<A>` to `B`. Requires an
 * arbitrary of `B` and specifying the kind type parameters.
 * @returns An arbitrary of type `(a: F<A>) => B`.
 * @category arbitraries
 */
export const unaryFromKind = <
  A,
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(): (<B>(
  b: fc.Arbitrary<B>,
) => fc.Arbitrary<(fa: Kind<F, In1, Out2, Out1, A>) => B>) =>
  flow(fc.func, map(applyF))

/**
 * An arbitrary for the type `F<A⇒B>`. Requires an arbitrary of `B`, a
 * function lifting `A` to `F<A>`, and the _type_ `A`.
 * @returns An arbitrary of type `F<(a: A) => B>`.
 * @category arbitraries
 */
export const unaryInKind =
  <A>() =>
  <F extends TypeLambda, In1, Out2, Out1>(
    of: <T>(t: T) => Kind<F, In1, Out2, Out1, T>,
  ): (<B>(
    b: fc.Arbitrary<B>,
  ) => fc.Arbitrary<Kind<F, In1, Out2, Out1, (a: A) => B>>) =>
    flow(unary<A>(), map(of))

/**
 * An arbitrary predicate of `A`.
 * @category arbitraries
 */
export const predicate = <A>(): fc.Arbitrary<PR.Predicate<A>> =>
  unary<A>()(fc.boolean())
