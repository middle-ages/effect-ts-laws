/* eslint-disable @typescript-eslint/no-explicit-any */
import {Equivalence as EQ, Option as OP, pipe} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import type {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import type {LiftArbitrary} from '../../../arbitrary.js'
import {option} from '../../../arbitrary.js'
import type {ComposeKey, ComposeTypeLambda} from '../../../compose.js'
import {composeMap} from '../../../compose.js'
import type {LiftEquivalence} from '../../../law.js'
import type {ParameterizedGiven} from './given.js'

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
 * @typeParam Class - Type lambda for the typeclass under test.
 * @typeParam F - Type lambda for _inner datatype.
 * @typeParam G - Type lambda for _outer datatype.
 * @category composition
 */
export const liftGiven =
  <
    Class extends TypeLambda,
    F extends TypeLambda,
    G extends TypeLambda,
    A,
    B = A,
    C = A,
    R = never,
    O = unknown,
    E = unknown,
  >() =>
  <
    K extends ComposeKey,
    Os extends ParameterizedGiven<Class, F, A, B, C, R, O, E>,
  >(
    /**
     * Type of composition requested: `Of`, `Invariant`, `Covariant`,
     * `Applicative`, `Traversable`, or `Foldable`.
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
    {F, getEquivalence, getArbitrary, ...given}: Os,
  ) =>
  ({G, getEquivalenceG, getArbitraryG}: FromGiven<Class, F, G, Os>) => {
    type Composed = ComposeGiven<Class, F, G, Os>

    const composedGiven = {
      ...given,
      F: composeMap[key](G as never, F as never) as Composed['instance'],
      getEquivalence: <T>(equalA: EQ.Equivalence<T>) =>
        getEquivalenceG(getEquivalence(equalA)),
      getArbitrary: <T>(a: fc.Arbitrary<T>) => getArbitraryG(getArbitrary(a)),
    } as Composed['given']

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
  R = never,
  O = unknown,
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
  given: ParameterizedGiven<Class, F, A, B, C, R, O, E>,
  /**
   * The instance of `Option` for the typeclass under test.
   */
  optionInstance: Kind<Class, R, O, E, OptionTypeLambda>,
) =>
  pipe(
    {
      G: optionInstance,
      getEquivalenceG: OP.getEquivalence,
      getArbitraryG: option,
    },
    liftGiven<Class, F, OptionTypeLambda, A, B, C, R, O, E>()(
      key,
      'Option<F>',
      given,
    ),
  )

type ComposeGiven<
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
    infer R,
    infer O,
    infer E
  >
    ? {
        instance: Kind<Class, R, O, E, ComposeTypeLambda<G, F, R, O, E>>
        given: ParameterizedGiven<
          Class,
          ComposeTypeLambda<G, F, R, O, E>,
          A,
          B,
          C,
          R,
          O,
          E
        >
      }
    : never

type FromGiven<
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
    infer R,
    infer O,
    infer E
  >
    ? {
        /**
         * An instance of `Class` for the _outer_ value.
         */
        G: Kind<Class, R, O, E, G>
        /**
         * A function that will lift equivalences into the outer value `G`.
         */
        getEquivalenceG: LiftEquivalence<G, R, O, E>
        /**
         * A function that will lift arbitraries into the outer value `G`.
         */
        getArbitraryG: LiftArbitrary<G, R, O, E>
      }
    : never
