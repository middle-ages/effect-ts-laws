import type {LiftArbitrary} from '#arbitrary'
import {binary, liftArbitraries, option, unary, unaryToKind} from '#arbitrary'
import type {LawSet, LiftEquivalence} from '#law'
import {liftEquivalences} from '#law'
import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, Option as OP, pipe, Predicate as PR} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * Options for testing
 * [parameterized-type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclasses. All the typeclass laws here expect their arguments to be of
 * this type.
 * @typeParam Typeclass - The type lambda of the typeclass under tests. For
 * example when testing an instance of `Covariant<Array<string>>`, `Typeclass`
 * would be the type lambda of the higher-kinded type `Covariant`.
 * @typeParam F - The type lambda of the datatype under test. For example when
 * testing an instance of `Covariant<Array<string>>`, `F` would be the
 * type lambda of the higher-kinded type `Array`.
 * @category harness
 */
export interface ParameterizedGiven<
  Typeclass extends TypeLambda,
  F1 extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> extends GivenConcerns<F1, A, B, C, R, O, E> {
  /**
   * The higher-kinded type `Typeclass<F>` is the typeclass instance under test.
   * For example when testing the `Monad` laws on an `Either<number, string>`,
   * this would be `Monad<Either>`.
   */
  F: Kind<Typeclass, R, O, E, F1>
}

/**
 * Unfolded requirements for testing parameterized typeclass laws.
 * These are set as the union of all arguments required by the law predicates
 * for parameterized typeclass laws.
 *
 * For example, the field `aob` is required by the {@link Filterable}
 * _composition_ typeclass law, and `bab` by the {@link Foldable} _reduce_ law.
 *
 * The nomenclature is based on the types of expressions, and is designed to
 * make it easy, or at least easy as possible, for the author of law tests
 * to find the correct arguments required by the predicates they are checking:
 *
 * 1. `A`, `B`, and `C` are the underlying types. There are no predicates in any
 * parameterized typeclass law that require _more_ than three type parameters.
 * 2. Arbitraries
 *     1. Lower case `a`, `b`, and `c` are the names of arbitraries for the three
 *     underlying types.
 *     2. The arbitraries for the data type under test are called `fa`, `fb`,
 *     and `fc`, standing for arbitraries of `F<A>`, `F<B>`, and `F<C>`
 *     respectively.
 *     3. For simple unary arbitrary functions between two different underlying
 *     types, for example `A ⇒ B`, we use the lower case type names of argument
 *     followed by return value. For example an arbitrary for a function of type
 *     `C ⇒ B` we use the field name `cb`.
 *     4. Binary functions use the same pattern, so an arbitrary for a function
 *     of type `(b: B, a: A) => B` will be called `bab`.
 *     5. Unary function from a type to itself are named `endo[TYPE]`, for
 *     example `endoA` is the name of an arbitrary a function `A ⇒ A`.
 *     6. Arbitraries for functions that lift an underlying type into the data
 *     type under test, also use the same naming pattern, except the return type
 *     is prefixed with a lowercase `f`. For example, `afb` is an arbitrary for
 *     a function of the type `A ⇒ F<B>`, where `F` is the higher-kinded
 *     datatype under test.
 *     7. Arbitraries that lift an underlying type into the `Option` data type
 *     are also named in this way, except the `f` is replaced by an `o`. `aob`,
 *     for example, is the field where you will find an arbitrary function of
 *     type `A ⇒ Option<B>`.
 *     8. `Applicative` laws, for example, require a function of the type:
 *     `(of: <T>(a: T) => F<T>>) => Arbitrary<F<(a: A) => B>>>`. I.e.:
 *     a function tht takes a _lifting_ function, and returns an arbitrary
 *     for the unary function `(a: A) => B`. These are called just like
 *     the lifted function argument would have been called (`afb`), but with
 *     an `Of` suffix, and the `f` is moved to the head position. The function
 *     above, for example, would be found in a field called `fabOf`.
 * 3. Equivalences
 *     1. The equivalences for the underlying types are called `equalsA`,
 *     `equalsB`, and `equalsC`.
 *     2. The equivalences for the data type under test are called `equalsFa`,
 *     `equalsFb`, and `equalsFc`.
 * 4. For laws that require predicates, we have fields `predicateA`,
 * `predicateB`, and `predicateC`, for functions that take a value of the
 * underlying type and returns a boolean.
 *
 * Having _all_ given arguments for all predicates in a central place is less
 * [open-closed](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle).
 * We still do it though, as it massively simplifies the code unfolding
 * law predicate arguments.
 * @typeParam Typeclass - The type lambda of the typeclass under tests. For
 * example when testing an instance of `Covariant<Array<string>>`, `Typeclass`
 * would be the type lambda of the higher-kinded type `Covariant`.
 * @typeParam F - The type lambda of the datatype under test. For example when
 * testing an instance of `Covariant<Array<string>>`, `F` would be the
 * type lambda of the higher-kinded type `Array`.
 * @typeParam A - First underlying type for the typeclass tests.
 * @typeParam B - second underlying type for the typeclass tests.
 * @typeParam C - Third underlying type for the typeclass tests. _Three_ is the
 * maximum number of type parameters required by any predicate of the parameterized
 * typeclass laws.
 */
export interface UnfoldedGiven<
  Typeclass extends TypeLambda,
  F1 extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> extends ParameterizedGiven<Typeclass, F1, A, B, C, R, O, E> {
  equalsFa: EQ.Equivalence<Kind<F1, R, O, E, A>>
  equalsFb: EQ.Equivalence<Kind<F1, R, O, E, B>>
  equalsFc: EQ.Equivalence<Kind<F1, R, O, E, C>>

  fa: fc.Arbitrary<Kind<F1, R, O, E, A>>
  fb: fc.Arbitrary<Kind<F1, R, O, E, B>>
  fc: fc.Arbitrary<Kind<F1, R, O, E, C>>

  endoA: fc.Arbitrary<(a: A) => A>
  ab: fc.Arbitrary<(a: A) => B>
  bc: fc.Arbitrary<(a: B) => C>
  ba: fc.Arbitrary<(a: B) => A>
  cb: fc.Arbitrary<(a: C) => B>

  bab: fc.Arbitrary<(b: B, a: A) => B>

  afb: fc.Arbitrary<(a: A) => Kind<F1, R, O, E, B>>
  bfc: fc.Arbitrary<(b: B) => Kind<F1, R, O, E, C>>

  aob: fc.Arbitrary<(a: A) => OP.Option<B>>
  boc: fc.Arbitrary<(a: B) => OP.Option<C>>

  fabOf: (
    of: <T>(a: T) => Kind<F1, R, O, E, T>,
  ) => fc.Arbitrary<Kind<F1, R, O, E, (a: A) => B>>
  fbcOf: (
    of: <T>(a: T) => Kind<F1, R, O, E, T>,
  ) => fc.Arbitrary<Kind<F1, R, O, E, (a: B) => C>>
}

/**
 * Unfold a {@link ParameterizedGiven} into all arguments required by predicates
 * of parameterized typeclass laws.
 * @param given - The options to unfold.
 * @category harness
 */
export const unfoldGiven = <
  Typeclass extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: ParameterizedGiven<Typeclass, F, A, B, C, R, O, E>,
): UnfoldedGiven<Typeclass, F, A, B, C, R, O, E> => {
  const {a, b, c, equalsA, equalsB, equalsC, getArbitrary, getEquivalence} =
      given,
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    [fa, fb, fc] = liftArbitraries(getArbitrary)(a, b, c),
    endoA = unary<A>()(a),
    ab = unary<A>()(b),
    bc = unary<B>()(c),
    ba = unary<B>()(a),
    cb = unary<C>()(b)

  return {
    ...given,

    equalsFa,
    equalsFb,
    equalsFc,

    fa,
    fb,
    fc,

    endoA,
    ab,
    bc,
    ba,
    cb,

    bab: binary<B, A>()(b),

    afb: pipe(b, unaryToKind<A>()(getArbitrary)),
    bfc: pipe(c, unaryToKind<B>()(getArbitrary)),

    aob: pipe(b, option, unary<A>()),
    boc: pipe(c, option, unary<B>()),

    fabOf: (of: <T>(a: T) => Kind<F, R, O, E, T>) => ab.map(of),
    fbcOf: (of: <T>(a: T) => Kind<F, R, O, E, T>) => bc.map(of),
  }
}

/**
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses. Used to map from typeclass
 * name to the typeclass type lambda.
 * @internal
 * @category model
 */
export interface ParameterizedLambdas {}

/**
 * The _equivalence_ and _arbitrary_ concerns of typeclass test options,
 * together with an optional `Monoid` for the underlying type `A`
 *
 * Everything required to build laws for a typeclass except the instances under
 * test.
 * @category model
 */
export interface GivenConcerns<
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> extends GivenArbitraries<F, A, B, C, R, O, E>,
    GivenEquivalence<F, A, B, C, R, O, E>,
    GivenPredicates<A, B, C> {
  /**
   * Required `Monoid` for the underlying type `A`, useful for typeclasses
   * like `Applicative` that can build their own `Monoid` instance from it.
   */
  Monoid: MO.Monoid<A>
}

// The _equivalence_ concern of typeclass test options.
// @category model
interface GivenEquivalence<F extends TypeLambda, A, B, C, R, O, E> {
  /** An equivalence for the underlying type `A`. */
  equalsA: EQ.Equivalence<A>
  /** An equivalence for the underlying type `B`. */
  equalsB: EQ.Equivalence<B>
  /** An equivalence for the underlying type `C`. */
  equalsC: EQ.Equivalence<C>
  /**
   * A function that will get an equivalence for the type under test from an
   * equivalence for the underlying type.
   */
  getEquivalence: LiftEquivalence<F, R, O, E>
}

// The _arbitrary_ concern of typeclass test options.
// @category model
export interface GivenArbitraries<F extends TypeLambda, A, B, C, R, O, E> {
  /** An arbitrary for the underlying type `A`. */
  a: fc.Arbitrary<A>
  /** An arbitrary for the underlying type `B`. */
  b: fc.Arbitrary<B>
  /** An arbitrary for the underlying type `C`. */
  c: fc.Arbitrary<C>
  /**
   * A function that will get an arbitrary for the type under test from an
   * arbitrary for the underlying type.
   */
  getArbitrary: LiftArbitrary<F, R, O, E>
}

// The _predicate_ concern of typeclass test options. For each of the three
// underlying types, an arbitrary for its predicate.
interface GivenPredicates<A, B, C> {
  /** Predicate for values of type `A`. */
  predicateA: fc.Arbitrary<PR.Predicate<A>>
  /** Predicate for values of type `B`. */
  predicateB: fc.Arbitrary<PR.Predicate<B>>
  /** Predicate for values of type `C`. */
  predicateC: fc.Arbitrary<PR.Predicate<C>>
}

/**
 * Interface for functions that build typeclass laws.
 * @category harness
 */
export interface BuildParameterized<Typeclass extends TypeLambda> {
  <F extends TypeLambda, A, B = A, C = A, R = never, O = unknown, E = unknown>(
    given: ParameterizedGiven<Typeclass, F, A, B, C, R, O, E>,
    suffix?: string,
  ): LawSet
}
