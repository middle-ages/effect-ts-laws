import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, Option as OP, pipe, Predicate as PR} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {LiftArbitrary} from '../../../arbitrary.js'
import {
  binary,
  liftArbitraries,
  option,
  unary,
  unaryToKind,
} from '../../../arbitrary.js'
import type {LiftEquivalence} from '../../../law.js'
import {liftEquivalences} from '../../../law.js'

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
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> extends GivenConcerns<F, A, B, C, R, O, E> {
  /**
   * The higher-kinded type `Typeclass<F>` is the typeclass instance under test.
   * For example when testing the `Monad` laws on an `Either<number, string>`,
   * this would be `Monad<Either>`.
   */
  F: Kind<Typeclass, R, O, E, F>
}

/**
 * Unfolded requirements for testing parameterized typeclass laws.
 * @typeParam Typeclass - The type lambda of the typeclass under tests. For
 * example when testing an instance of `Covariant<Array<string>>`, `Typeclass`
 * would be the type lambda of the higher-kinded type `Covariant`.
 * @typeParam F - The type lambda of the datatype under test. For example when
 * testing an instance of `Covariant<Array<string>>`, `F` would be the
 * type lambda of the higher-kinded type `Array`.
 */
export interface UnfoldedGiven<
  Typeclass extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> extends ParameterizedGiven<Typeclass, F, A, B, C, R, O, E> {
  equalsFa: EQ.Equivalence<Kind<F, R, O, E, A>>
  equalsFb: EQ.Equivalence<Kind<F, R, O, E, B>>
  equalsFc: EQ.Equivalence<Kind<F, R, O, E, C>>

  fa: fc.Arbitrary<Kind<F, R, O, E, A>>
  fb: fc.Arbitrary<Kind<F, R, O, E, B>>
  fc: fc.Arbitrary<Kind<F, R, O, E, C>>

  endoA: fc.Arbitrary<(a: A) => A>
  ab: fc.Arbitrary<(a: A) => B>
  bc: fc.Arbitrary<(a: B) => C>
  ba: fc.Arbitrary<(a: B) => A>
  cb: fc.Arbitrary<(a: C) => B>

  bab: fc.Arbitrary<(b: B, a: A) => B>

  afb: fc.Arbitrary<(a: A) => Kind<F, R, O, E, B>>
  bfc: fc.Arbitrary<(b: B) => Kind<F, R, O, E, C>>

  aob: fc.Arbitrary<(a: A) => OP.Option<B>>
  boc: fc.Arbitrary<(a: B) => OP.Option<C>>

  fabOf: (
    of: <T>(a: T) => Kind<F, R, O, E, T>,
  ) => fc.Arbitrary<Kind<F, R, O, E, (a: A) => B>>
  fbcOf: (
    of: <T>(a: T) => Kind<F, R, O, E, T>,
  ) => fc.Arbitrary<Kind<F, R, O, E, (a: B) => C>>
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
  /** An equivalence for the underlying type `A`. */
  a: fc.Arbitrary<A>
  /** An equivalence for the underlying type `B`. */
  b: fc.Arbitrary<B>
  /** An equivalence for the underlying type `C`. */
  c: fc.Arbitrary<C>
  /**
   * A function that will get an equivalence for the type under test from an
   * equivalence for the underlying type.
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
