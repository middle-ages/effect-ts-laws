/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
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
> {
  /**
   * The higher-kinded type `Class<F>` is the typeclass instance under
   * test. For example when testing the `Monad` laws on an
   * `Either<number, string>`, this would be `Monad<Either>`.
   */
  F: Kind<Class, In1, Out2, Out1, F>

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

  /**
   * A function that will build an arbitrary for the datatype under test
   * from an  arbitrary for the underlying type. For example, when testing
   * the `Either` datatype for `Either<A, string>`, this would be a
   * function of the type
   * `<A>(a: fc.Arbitrary<A>) ⇒ fc.Arbitrary<Either<A, string>>`.
   */
  getArbitrary: LiftArbitrary<F, In1, Out2, Out1>

  /**
   * An arbitrary for the underlying type. For example, when testing `Option`
   * instances, and the type parameter `A` is `number`, this type would be
   * set at `fc.Arbitrary<number>`. The monomorphic runner set this type,
   * and the other two underlying type arbitraries, to `readonly number[]`.
   */
  a: fc.Arbitrary<A>

  /**
   * An arbitrary for the second underlying type `B`. Used for generating
   * functions in composition tests.
   */
  b: fc.Arbitrary<B>

  /**
   * An arbitrary for the third underlying type `C`. Used for generating
   * functions in composition tests.
   */
  c: fc.Arbitrary<C>
}

/**
 * The typeclass test options in the form they are given to typeclass laws,
 * with every arbitrary value, function, or equality required by every law
 * test available as a field.
 * @category options
 */
export interface UnfoldedGiven<
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> extends Given<Class, F, A, B, C, In1, Out2, Out1> {
  equalsFa: EQ.Equivalence<Kind<F, In1, Out2, Out1, A>>
  equalsFb: EQ.Equivalence<Kind<F, In1, Out2, Out1, B>>
  equalsFc: EQ.Equivalence<Kind<F, In1, Out2, Out1, C>>

  fa: fc.Arbitrary<Kind<F, In1, Out2, Out1, A>>
  fb: fc.Arbitrary<Kind<F, In1, Out2, Out1, B>>
  fc: fc.Arbitrary<Kind<F, In1, Out2, Out1, C>>

  ab: fc.Arbitrary<(a: A) => B>
  bc: fc.Arbitrary<(b: B) => C>

  ba: fc.Arbitrary<(a: B) => A>
  cb: fc.Arbitrary<(b: C) => B>

  afb: fc.Arbitrary<(a: A) => Kind<F, In1, Out2, Out1, B>>
  bfc: fc.Arbitrary<(b: B) => Kind<F, In1, Out2, Out1, C>>
}

/**
 * Unfold an {@link ParameterizedGiven} into an {@link UnfoldedGiven} so
 * that typeclass laws don't have to.
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
  given: Given<Class, F, A, B, C, In1, Out2, Out1>,
): UnfoldedGiven<Class, F, A, B, C, In1, Out2, Out1> => {
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
  <K extends ComposeKey, Os extends Given<Class, F>>(
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
     * encoding type of the _inner_ value.
     */
    {F, getEquivalence, getArbitrary, ...given}: Os,
  ) =>
  (
    /**
     * An instance of `Class` for the _outer_ value.
     */
    G: Os extends Given<
      Class,
      F,
      any,
      any,
      any,
      infer In1,
      infer Out2,
      infer Out1
    >
      ? Kind<Class, In1, Out2, Out1, G>
      : never,
    /**
     * A function that will lift equivalences into the outer value `G`.
     */
    getEquivalenceG: Os extends Given<
      Class,
      F,
      any,
      any,
      any,
      infer In1,
      infer Out2,
      infer Out1
    >
      ? LiftEquivalence<G, In1, Out2, Out1>
      : never,
    /**
     * A function that will lift arbitraries into the outer value `G`.
     */
    getArbitraryG: Os extends Given<
      Class,
      F,
      any,
      any,
      any,
      infer In1,
      infer Out2,
      infer Out1
    >
      ? LiftArbitrary<G, In1, Out2, Out1>
      : never,
  ) => {
    type P<A, B = any, C = any, In1 = any, Out2 = any, Out1 = any> = Given<
      Class,
      F,
      A,
      B,
      C,
      In1,
      Out2,
      Out1
    >

    type A = Os extends P<infer A> ? A : never
    type B = Os extends P<A, infer B> ? B : never
    type C = Os extends P<A, B, infer C> ? C : never

    type In1 = Os extends P<A, B, C, infer In1> ? In1 : never
    type Out2 = Os extends P<A, B, C, In1, infer Out2> ? Out2 : never
    type Out1 = Os extends P<A, B, C, In1, Out2, infer Out1> ? Out1 : never

    type FG = ComposeTypeLambda<G, F, In1, Out2, Out1>

    const FG = composeMap[key](G as never, F as never) as Kind<
      Class,
      In1,
      Out2,
      Out1,
      FG
    >

    const composedGiven: ParameterizedGiven<
      Class,
      FG,
      A,
      B,
      C,
      In1,
      Out2,
      Out1
    > = {
      ...given,
      F: FG,
      getEquivalence: <T>(equalA: EQ.Equivalence<T>) =>
        getEquivalenceG(getEquivalence(equalA)),
      getArbitrary: <T>(a: fc.Arbitrary<T>) => getArbitraryG(getArbitrary(a)),
    }

    return [`${key}Composition.${suffix}`, composedGiven] as const
  }

/**
 * Return the given options transformed into options for a composed
 * typeclass test, where the outer composed datatype is an `Option`.
 * This is a version of {@link liftGen} fixed on composing with the
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
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
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
  given: Given<Class, F, A, B, C, In1, Out2, Out1>,
  /**
   * The instance of `Option` for the typeclass under test.
   */
  optionInstance: Kind<Class, In1, Out2, Out1, OptionTypeLambda>,
) =>
  liftGiven<Class, F, OptionTypeLambda>()(key, 'Option<F>', given)(
    optionInstance,
    OP.getEquivalence,
    option,
  )

type Given<
  Class extends TypeLambda,
  F extends TypeLambda,
  A = any,
  B = any,
  C = any,
  In1 = any,
  Out2 = any,
  Out1 = any,
> = ParameterizedGiven<Class, F, A, B, C, In1, Out2, Out1>

/**
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses. Used to map from typeclass name to
 * its various test types.
 * @internal
 * @category model
 */
export interface ParameterizedMap<
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {}
