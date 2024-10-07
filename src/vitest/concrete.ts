import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ} from 'effect'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {ParameterOverrides} from '../law.js'
import {
  buildConcreteTypeclassLaw,
  buildConcreteTypeclassLaws,
  Concrete,
  ConcreteClass,
  ConcreteGiven,
  ConcreteLambdas,
} from '../laws/typeclass/harness.js'
import {testLaws, testLawSets} from './runner.js'

/**
 * Run a single instance through the given typeclass laws.
 * @category vitest
 */
export const testConcreteTypeclassLaw =
  <Typeclass extends ConcreteClass>(typeclass: Typeclass) =>
  <A>(
    given: ConcreteGiven<ConcreteLambdas[Typeclass], A>,
    parameters?: ParameterOverrides,
  ) => {
    testLaws(buildConcreteTypeclassLaw<Typeclass>(typeclass)(given), parameters)
  }

/**
 * Test [concrete type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
 * typeclass laws for the given instances of some datatype.
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Equivalence: Number.Equivalence }` will run
 * the instance through the `Equivalence` typeclass laws.
 * @param given - The common concrete options: equivalence and an arbitrary
 * for the underlying type of the test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testConcreteTypeclassLaws = <A>(
  instances: Partial<Concrete<A>>,
  given: Omit<ConcreteGiven<TypeLambda, A>, 'F'>,
  parameters?: ParameterOverrides,
) => {
  testLawSets({verbose: true, ...parameters})(
    ...buildConcreteTypeclassLaws(instances, given),
  )
}

/**
 * Run the given monoid/semigroup instance through their respective typeclass
 * law tests.
 * @param a - An arbitrary for the underlying type `A`.
 * @param equalsA - Equivalence for the underlying type `A`.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testMonoid =
  <A>(
    a: fc.Arbitrary<A>,
    equalsA: EQ.Equivalence<A>,
    parameters?: ParameterOverrides,
  ) =>
  (
    /**
     * The monoid/semigroup instance under test.
     */
    Monoid: MO.Monoid<A>,
    /**
     * Optional suffix will be added to `description()` block label.
     */
    suffix = '',
  ) => {
    testConcreteTypeclassLaws(
      {Monoid},
      {suffix, a, equalsA},
      {verbose: true, ...parameters},
    )
  }

/**
 * Run the given monoid/semigroup instances through their respective typeclass
 * law tests.
 * @param a - An arbitrary for the underlying type `A`.
 * @param equalsA - Equivalence for the underlying type `A`.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testMonoids =
  <A>(
    a: fc.Arbitrary<A>,
    equalsA: EQ.Equivalence<A>,
    parameters?: ParameterOverrides,
  ) =>
  /**
   * Named list of `Monoid` instances to test in the form of an object where
   * the keys are the instances names and the values the instances themselves.
   */
  (namedInstances: Record<string, MO.Monoid<A>>) => {
    const test = testMonoid(a, equalsA, parameters)
    for (const [suffix, Monoid] of Object.entries(namedInstances))
      test(Monoid, suffix)
  }
