import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {
  liftArbitraries,
  LiftArbitrary,
  unary,
  unaryToKind,
} from '../../../arbitrary.js'
import {LiftEquivalence, liftEquivalences} from '../../../law.js'

/**
 * Options for testing
 * [parameterized-type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclasses. All the typeclass laws here expect their arguments to be of
 * this type.
 * @typeParam Class - The type lambda of the typeclass under tests.
 * @typeParam F - The type lambda of the datatype under test.
 * @category harness
 */
export interface ParameterizedGiven<
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> extends GivenConcerns<F, A, B, C, In1, Out2, Out1> {
  /**
   * The higher-kinded type `Class<F>` is the typeclass instance under
   * test. For example when testing the `Monad` laws on an
   * `Either<number, string>`, this would be `Monad<Either>`.
   */
  F: Kind<Class, In1, Out2, Out1, F>
}

/**
 * Unfold a {@link ParameterizedGiven} into an equivalence and arbitrary
 * required by typeclass tests.
 * @param given - The options to unfold.
 * @category harness
 */
export const unfoldGiven = <
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: ParameterizedGiven<Class, F, A, B, C, In1, Out2, Out1>,
) => {
  const {a, b, c, equalsA, equalsB, equalsC, getArbitrary, getEquivalence} =
      given,
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    [fa, fb, fc] = liftArbitraries(getArbitrary)(a, b, c),
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

    ab,
    bc,
    ba,
    cb,

    afb: pipe(b, unaryToKind<A>()(getArbitrary)),
    bfc: pipe(c, unaryToKind<B>()(getArbitrary)),

    fabOf: (of: <T>(a: T) => Kind<F, In1, Out2, Out1, T>) => ab.map(of),
    fbcOf: (of: <T>(a: T) => Kind<F, In1, Out2, Out1, T>) => bc.map(of),
  }
}

/**
 * The _equivalence_ concern of typeclass test options.
 * @category model
 */
export interface GivenEquivalence<
  F extends TypeLambda,
  A,
  B,
  C,
  In1,
  Out2,
  Out1,
> {
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
  getEquivalence: LiftEquivalence<F, In1, Out2, Out1>
}

/**
 * The _arbitrary_ concern of typeclass test options.
 * @category model
 */
export interface GivenArbitraries<
  F extends TypeLambda,
  A,
  B,
  C,
  In1,
  Out2,
  Out1,
> {
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
  getArbitrary: LiftArbitrary<F, In1, Out2, Out1>
}

/**
 * The _equivalence_ and _arbitrary_ concerns of typeclass test options, and an
 * optional `Monoid` for the underlying type `A`. Everything required to build
 * laws for a typeclass except the instances under test.
 * @category model
 */
export interface GivenConcerns<F extends TypeLambda, A, B, C, In1, Out2, Out1>
  extends GivenArbitraries<F, A, B, C, In1, Out2, Out1>,
    GivenEquivalence<F, A, B, C, In1, Out2, Out1> {
  /**
   * Optional `Monoid` for the underlying type `A`, useful for typeclasses
   * like `Applicative` that can build their own `Monoid` instance from it.
   */
  Monoid?: MO.Monoid<A>
}

/**
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses. Used to map from typeclass
 * name to the typeclass type lambda.
 * @internal
 * @category model
 */
export interface ParameterizedLambdas {}
