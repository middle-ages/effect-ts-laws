/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, Option as OP, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import {
  liftArbitraries,
  LiftArbitrary,
  option,
  unary,
  unaryToKind,
} from '../../../arbitrary.js'
import {ComposeKey, composeMap, ComposeTypeLambda} from '../../../compose.js'
import {LiftEquivalence, liftEquivalences} from '../../../law.js'

/**
 * Options for testing
 * [parameterized-type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclasses. All the typeclass laws here expect their arguments to be of
 * this type.
 * @typeParam Class - The type lambda of the typeclass under tests.
 * @typeParam F - The type lambda of the datatype under test.
 * @category options
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
 * @category options
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
    [fa, fb, fc] = liftArbitraries(getArbitrary)(a, b, c)

  return {
    ...given,
    equalsFa,
    equalsFb,
    equalsFc,

    fa,
    fb,
    fc,

    ab: unary<A>()(b),
    bc: unary<B>()(c),

    ba: unary<B>()(a),
    cb: unary<C>()(b),

    afb: pipe(b, unaryToKind<A>()(getArbitrary)),
    bfc: pipe(c, unaryToKind<B>()(getArbitrary)),
  }
}

/**
 * Convert the `LawSet` options of a typeclass test into the options
 * of a composed typeclass test.
 *
 * For example if we are testing `Covariant` laws on `MyTuple`, and
 * the underlying types are all `number`, then the correct `given`
 * type required for these tests, is
 * `ParameterizedGiven<CovariantTypeLambda, MyTupleLambda, number>`.
 *
 * If we wanted to run the same law test but on a _composed instance_
 * of `MyTuple` inside an `Option`, then we could use this function
 * to convert the options to the required type. Then we can run these
 * new options to test typeclass laws on the composed instance.
 * @example
 * ```ts
 * const given: ParameterizedGiven< // Original options.
 *   CovariantTypeLambda,
 *   MyTupleLambda,
 *   number
 * > = …
 * const composedGiven = liftGiven<
 *   CovariantTypeLambda,
 *   MyTupleLambda,     // Wrapped data type.
 *   OptionTypeLambda   // Wrapper data type.
 * >()(
 *   'Covariant',       // Name of composed typeclass.
 *   'Option<F>'        // Will be used as test label suffix.
 *   options,           // The original options.
 * )(
 *   optionCovariant,   // covariant instance for wrapper.
 *   OP.getEquivalence, // LiftEquivalence for wrapper.
 *   option,            // LiftArbitrary for wrapper.
 * )
 * // Only the datatype type lambda is different between the
 * // input and output given:
 * // composedGiven: ParameterizedGiven<
 * //   CovariantTypeLambda, // Still testing same laws.
 * //   ComposeTypeLambda<OptionTypeLambda, MyTupleLambda>,
 * //   number, // Underlying type does not change.
 * // >
 * ```
 * @typeParam Class - Type lambda for the typeclass under test.
 * @typeParam F - Type lambda for _inner datatype.
 * @typeParam G - Type lambda for _outer datatype.
 * @category composition
 */
export const liftGiven =
  <Class extends TypeLambda, F extends TypeLambda, G extends TypeLambda>() =>
  <
    K extends ComposeKey,
    Os extends ParameterizedGiven<Class, F, any, any, any, any, any, any>,
  >(
    /**
     * Type of composition requested: `Of`, `Invariant`, `Covariant`,
     * `Applicative`, or `Traversable`.
     */
    key: K,
    /**
     * Suffix test label to indicate this is a composition test.
     */
    suffix: string,
    /**
     * Original options for testing the datatype known by the type lambda `F`,
     * encoding the _inner_ type of the composition.
     */
    {F, getEquivalence, getArbitrary, Monoid: _, ...given}: Os,
  ) =>
  ({G, getEquivalenceG, getArbitraryG}: FromGiven<Class, F, G, Os>) => {
    type Composed = ComposeGiven<Class, F, G, Os>

    const composedGiven: Composed['given'] = {
      ...given,
      F: composeMap[key](G as never, F as never) as Composed['instance'],
      getEquivalence: <T>(equalA: EQ.Equivalence<T>) =>
        getEquivalenceG(getEquivalence(equalA)),
      getArbitrary: <T>(a: fc.Arbitrary<T>) => getArbitraryG(getArbitrary(a)),
    }

    return [`${key}Composition.${suffix}`, composedGiven] as const
  }

/**
 * Return the given options transformed into options for a composed
 * typeclass test, where the outer composed datatype is an `Option`.
 * This is a version of {@link liftGiven} fixed on composing with the
 * `Option` as outer datatype.
 * @returns Typeclass test options for the `F` datatype when it is
 * wrapped in an `Option`.
 * @category composition
 */
export const withOuterOption = <
  K extends ComposeKey,
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  E = unknown,
>(
  /**
   * Type of composition requested: `Of`, `Invariant`, `Covariant`,
   * `Applicative`, or `Traversable`. The `Option` datatype can do
   * all of them.
   */
  key: K,
  /**
   * The original {@link ParameterizedGiven} for the typeclass under test as
   * it is _before_ composition.
   *
   */
  given: ParameterizedGiven<Class, F, A, B, C, any, any, E>,
  /**
   * The instance of `Option` for the typeclass under test.
   */
  optionInstance: Kind<Class, unknown, never, never, OptionTypeLambda>,
) =>
  pipe(
    {
      G: optionInstance,
      getEquivalenceG: OP.getEquivalence,
      getArbitraryG: option,
    },
    liftGiven<Class, F, OptionTypeLambda>()(key, 'Option<F>', given),
  )

export type FromGiven<
  Class extends TypeLambda,
  F extends TypeLambda,
  G extends TypeLambda,
  Os extends ParameterizedGiven<Class, F, any, any, any, any, any, any>,
> =
  Os extends ParameterizedGiven<
    Class,
    F,
    any,
    any,
    any,
    infer In1,
    infer Out2,
    infer Out1
  >
    ? {
        /**
         * An instance of `Class` for the _outer_ value.
         */
        G: Kind<Class, In1, Out2, Out1, G>
        /**
         * A function that will lift equivalences into the outer value `G`.
         */
        getEquivalenceG: LiftEquivalence<G, In1, Out2, Out1>
        /**
         * A function that will lift arbitraries into the outer value `G`.
         */
        getArbitraryG: LiftArbitrary<G, In1, Out2, Out1>
      }
    : never

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
 * The _arbitrary concern of typeclass test options.
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

export type ComposeGiven<
  Class extends TypeLambda,
  F extends TypeLambda,
  G extends TypeLambda,
  Os extends ParameterizedGiven<Class, F, any, any, any, any, any, any>,
> =
  Os extends ParameterizedGiven<
    Class,
    F,
    infer A,
    infer B,
    infer C,
    infer In1,
    infer Out2,
    infer Out1
  >
    ? {
        instance: Kind<
          Class,
          In1,
          Out2,
          Out1,
          ComposeTypeLambda<G, F, In1, Out2, Out1>
        >
        given: ParameterizedGiven<
          Class,
          ComposeTypeLambda<G, F, In1, Out2, Out1>,
          A,
          B,
          C,
          In1,
          Out2,
          Out1
        >
      }
    : never

/**
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses. Used to map from typeclass
 * name to the typeclass type lambda.
 * @internal
 * @category model
 */
export interface ParameterizedLambdas {}
