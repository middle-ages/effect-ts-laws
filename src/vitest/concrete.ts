import {Monoid as MO, Semigroup as SE} from '@effect/typeclass'
import {Equivalence as EQ} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {ParameterOverrides} from '../law.js'
import type {Concrete, ConcreteGiven} from '../laws.js'
import {buildConcreteTypeclassLaws} from '../laws.js'
import {testLawSets} from './testLaws.js'
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
 * Run the given Semigroup instance through the Semigroup typeclass laws tests.
 * @param a - An arbitrary for the underlying type `A`.
 * @param equalsA - Equivalence for the underlying type `A`.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testSemigroup =
  <A>(
    a: fc.Arbitrary<A>,
    equalsA: EQ.Equivalence<A>,
    parameters?: ParameterOverrides,
  ) =>
  (
    /**
     * The semigroup under test.
     */
    Semigroup: SE.Semigroup<A>,
    /**
     * Optional suffix will be added to `description()` block label.
     */
    suffix = '',
  ) => {
    testConcreteTypeclassLaws(
      {Semigroup},
      {suffix, a, equalsA},
      {verbose: true, ...parameters},
    )
  }

/**
 * Run the given monoid instance through the Monoid typeclass laws tests.
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
     * The monoid under test.
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
