import {Array as AR, Equivalence as EQ, Option as OP} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/** The base law type is a predicate with a name and a note. */
export interface Law<Args extends UnknownArgs> {
  /**
   * Law name to be used as test name. You can include a description of the
   * unit under test or anything else you wish to appear in the test name,
   * for example: `MyList.map:associative`.
   */
  name: string

  /** An optional note to shown only on failure or in verbose mode. */
  note: OP.Option<string>

  /** Predicate to be tested */
  predicate: NAryPredicate<Args>
}

/** The type of predicate that takes `Args` as arguments. */
export interface NAryPredicate<Args extends UnknownArgs> {
  (...args: Args): boolean
}

/** The exact type of unknown args used in `fast-check` types. */
export type UnknownArgs = AR.NonEmptyArray<unknown>

/**
 * Build a law from a name, a predicate, and optional note. Useful when you want
 * to reuse a law where you have test data already available.
 */
export const buildLaw = <Args extends UnknownArgs>(
  name: string,
  predicate: NAryPredicate<Args>,
  note?: string,
): Law<Args> => ({name, note: OP.fromNullable(note), predicate})

/**
 * A function that given any equivalence of type `A`, returns an equivalence
 * for `F<A>`.
 */
export interface GetEquivalence<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  <O>(equals: EQ.Equivalence<O>): EQ.Equivalence<Kind<F, In1, Out2, Out1, O>>
}

/**
 * A function that given any equivalence of type `A`, returns an arbitrary
 * for `F<A>`.
 */
export interface GetArbitrary<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  <A>(arbitraryA: fc.Arbitrary<A>): fc.Arbitrary<Kind<F, In1, Out2, Out1, A>>
}
