import {Equivalence as EQ, Option as OP, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import {LiftArbitrary, option} from '../../../../arbitrary.js'
import {ComposeKey, composeMap, ComposeTypeLambda} from '../../../../compose.js'
import {LiftEquivalence} from '../../../../law.js'
import {ParameterizedGiven} from '../given.js'

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

/**
 * @internal
 */
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
 * @internal
 */
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
