/**
 * Predicates for statistical testing of equality between functions.
 * @module
 */
import {Boolean as BO, Equivalence as EQ, Option as OP, pipe} from 'effect'
import {constFalse, constTrue} from 'effect/Function'
import fc from 'fast-check'

/**
 * Attempt to find an example input where the pair of given unary functions
 * is not equal. Given an arbitrary of `A`, an equivalence for `B` and a
 * pair of functions, check the functions compute the same `B` given the
 * same `A`, for `numRuns` values. Returns none or some value found.
 * @param a - An arbitrary for the function argument type `A`.
 * @param equalsB - Equivalence for the function return value type `B`.
 * @param parameters - Optional [fast-check parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @returns `none` if no counterexample to the equivalence was found, else
 * `some` of the `A` that was found to produce different values.
 * @category equivalence
 */
export const findCounterexample =
  <A, B>(
    a: fc.Arbitrary<A>,
    equalsB: EQ.Equivalence<B>,
    parameters?: fc.Parameters<A>,
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
 * @returns True if no counterexample found, else false.
 * @category equivalence
 */
export const testUnaryEquivalence =
  <A, B>(
    a: fc.Arbitrary<A>,
    equalsB: EQ.Equivalence<B>,
    parameters?: fc.Parameters<A>,
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
      findCounterexample(a, equalsB, parameters)(self, that),
      OP.match({
        onNone: constTrue,
        onSome: constFalse,
      }),
    )

/**
 * Same as `testUnaryEquivalence` but for functions of type `Endo<A>`.
 * @param a - An arbitrary for the function argument type `A`.
 * @param equalsA - Equivalence for the type `A`.
 * @param parameters - Optional [fast-check parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @returns True if no counterexample found, else false.
 * @category equivalence
 */
export const testEndoEquivalence =
  <A>(
    a: fc.Arbitrary<A>,
    equalsA: EQ.Equivalence<A>,
    parameters?: fc.Parameters<A>,
  ) =>
  (
    /**
     * First function to sample.
     */
    self: (a: A) => A,
    /**
     * Second function to sample.
     */
    that: typeof self,
  ): boolean =>
    testUnaryEquivalence(a, equalsA, parameters)(self, that)

/**
 * Same as `testUnaryEquivalence` but for functions of type `Predicate<A>`.
 * @param a - An arbitrary for the function argument type `A`.
 * @param equalsA - Equivalence for the type `A`.
 * @param parameters - Optional [fast-check parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @returns True if no counterexample found, else false.
 * @category equivalence
 */
export const testPredicateEquivalence = <A>(
  a: fc.Arbitrary<A>,
  parameters?: fc.Parameters<A>,
) => testUnaryEquivalence(a, BO.Equivalence, parameters)
