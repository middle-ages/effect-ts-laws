import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {LawSet, Overrides, testLaws} from '../../../law.js'
import {
  Concrete,
  ConcreteClass,
  concreteLawsFor,
  ConcreteOptionsFor,
} from '../concrete/catalog.js'
import {ConcreteGiven} from '../concrete/given.js'

/**
 * Run a single instance through the given typeclass laws.
 * @category harness
 */
export const testConcreteTypeclassLaw =
  <Typeclass extends ConcreteClass>(typeclass: Typeclass) =>
  <A>(options: ConcreteOptionsFor<Typeclass, A>, parameters?: Overrides) => {
    const laws = pipe(options, concreteLawsFor(typeclass))
    testLaws(
      laws as LawSet<typeof laws extends LawSet<infer Args> ? Args : never>,
      parameters,
    )
  }

/**
 * Test [concrete type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
 * typeclass laws for the given instances of some datatype.
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Equivalence: Number.Equivalence }` will run
 * the instance through the `Equivalence` typeclass laws.
 * @param options - The common concrete options: equivalence and an arbitrary
 * for the underlying type of the test.
 * @param parameters - Optional runtime `fc-check` parameters.
 * @category harness
 */
export const testConcreteTypeclassLaws = <A>(
  instances: Partial<Concrete<A>>,
  options: Omit<ConcreteGiven<TypeLambda, A>, 'F'>,
  parameters?: Overrides,
) => {
  for (const key of Object.keys(instances)) {
    const typeclass = key as ConcreteClass

    testConcreteTypeclassLaw(typeclass)(
      {
        ...options,
        F: instances[typeclass],
      } as ConcreteOptionsFor<typeof typeclass, A>,
      {
        verbose: true,
        ...parameters,
      },
    )
  }
}

/**
 * Run the given monoid/semigroup instance through their respective typeclass
 * law tests.
 * @param a - An arbitrary for the underlying type `A`.
 * @param equalsA - Equivalence for the underlying type `A`.
 * @param parameters - Optional runtime `fc-check` parameters.
 * @category harness
 */
export const testMonoid =
  <A>(a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>, parameters?: Overrides) =>
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
 * @param parameters - Optional runtime `fc-check` parameters.
 * @category harness
 */
export const testMonoids =
  <A>(a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>, parameters?: Overrides) =>
  /**
   * Named list of `Monoid` instances to test in the form of an object where
   * the keys are the instances names and the values the instances themselves.
   */
  (namedInstances: Record<string, MO.Monoid<A>>) => {
    const test = testMonoid(a, equalsA, parameters)
    for (const [suffix, Monoid] of Object.entries(namedInstances))
      test(Monoid, suffix)
  }
