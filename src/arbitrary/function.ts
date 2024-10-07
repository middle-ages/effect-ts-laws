import {
  Equivalence as EQ,
  flow,
  Option as OP,
  pipe,
  Predicate as PR,
} from 'effect'
import {constFalse, constTrue} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Monad as arbitraryMonad} from './monad.js'
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
  <F extends TypeLambda, In1 = never, Out2 = unknown, Out1 = unknown>(
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

/**
 * Attempt to find an example input where the pair of given unary functions
 * is not equal. Given an arbitrary of `A`, an equivalence for `B` and a
 * pair of functions, check the functions compute the same `B` given the
 * same `A`, for `numRuns` values. Returns none or some value found.
 * @param a - An arbitrary for the function argument type `A`.
 * @param equalsB - Equivalence for the function return value type `B`.
 * @param parameters - Optional [fast-check parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @returns `none` if no counter-example to the equivalence was found, else
 * `some` of the `A` that was found to produce different values.
 * @category arbitraries
 */
export const sampleUnaryEquivalence =
  <A, B>(
    a: fc.Arbitrary<A>,
    equalsB: EQ.Equivalence<B>,
    parameters: fc.Parameters<A> = {numRuns: 100},
  ) =>
  (
    /**
     * First function to sample.
     */
    self: (a: A) => B,
    /**
     * Second function to sample.
     */
    that: typeof self,
  ): OP.Option<A> => {
    const samples: A[] = fc.sample(a, parameters)
    /* v8 ignore next 1 */
    if (samples.length === 0) throw new Error('Empty sample.')
    for (const a of samples) if (!equalsB(self(a), that(a))) return OP.some(a)
    return OP.none()
  }

/**
 * Attempt to find an example input where the pair of given unary functions
 * is not equal. Given an arbitrary of `A`, an equivalence for `B` and a
 * pair of functions, check the functions compute the same `B` given the
 * same `A`, for `numRuns` values. Returns a boolean flag indicating
 * equivalence.
 * @param a - An arbitrary for the function argument type `A`.
 * @param equalsB - Equivalence for the function return value type `B`.
 * @param parameters - Optional [fast-check parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @returns True if no counter-example found, else false.
 * @category arbitraries
 */
export const testUnaryEquivalence =
  <A, B>(
    a: fc.Arbitrary<A>,
    equalsB: EQ.Equivalence<B>,
    parameters: fc.Parameters<A> = {},
  ) =>
  (
    /**
     * First function to sample.
     */
    self: (a: A) => B,
    /**
     * Second function to sample.
     */
    that: typeof self,
  ): boolean =>
    pipe(
      sampleUnaryEquivalence(a, equalsB, parameters)(self, that),
      OP.match({
        onNone: constTrue,
        onSome: constFalse,
      }),
    )
