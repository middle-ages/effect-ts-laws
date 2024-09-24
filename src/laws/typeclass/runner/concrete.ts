import {Monoid as MO} from '@effect/typeclass'
import {Equivalence as EQ, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {LawSet, Overrides, testLaws, testLawSets} from '#law'
import {ConcreteClass, concreteLawsFor} from '../concrete/catalog.js'
import {ConcreteGiven, ConcreteLambdas} from '../concrete/given.js'

/**
 * Run a single instance through the given typeclass laws.
 * @category harness
 */
export const testConcreteTypeclassLaw =
  <Typeclass extends ConcreteClass>(typeclass: Typeclass) =>
  <A>(
    given: ConcreteGiven<ConcreteLambdas[Typeclass], A>,
    parameters?: Overrides,
  ) => {
    testLaws(buildConcreteTypeclassLaw<Typeclass>(typeclass)(given), parameters)
  }

/**
 * Build a `LawSet` for the given concrete typeclass instance.
 * @category harness
 */
export const buildConcreteTypeclassLaw =
  <Typeclass extends ConcreteClass>(typeclass: Typeclass) =>
  <A>(given: ConcreteGiven<ConcreteLambdas[Typeclass], A>): LawSet =>
    pipe(given, concreteLawsFor(typeclass))

/**
 * Test [concrete type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
 * typeclass laws for the given instances of some datatype.
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Equivalence: Number.Equivalence }` will run
 * the instance through the `Equivalence` typeclass laws.
 * @param given - The common concrete options: equivalence and an arbitrary
 * for the underlying type of the test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category harness
 */
export const testConcreteTypeclassLaws = <A>(
  instances: Partial<Concrete<A>>,
  given: Omit<ConcreteGiven<TypeLambda, A>, 'F'>,
  parameters?: Overrides,
) => {
  testLawSets({verbose: true, ...parameters})(
    ...buildConcreteTypeclassLaws(instances, given),
  )
}

/**
 * Build [concrete type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
 * typeclass laws for the given instances of some datatype.
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Equivalence: Number.Equivalence }` will run
 * the instance through the `Equivalence` typeclass laws.
 * @param given - The common concrete options: equivalence and an arbitrary
 * for the underlying type of the test.
 * @category harness
 */
export const buildConcreteTypeclassLaws = <A>(
  instances: Partial<Concrete<A>>,
  given: Omit<ConcreteGiven<TypeLambda, A>, 'F'>,
): LawSet[] => {
  const results: LawSet[] = []
  for (const key of Object.keys(instances)) {
    const typeclass = key as ConcreteClass

    results.push(
      buildConcreteTypeclassLaw(typeclass)({
        ...given,
        F: instances[typeclass],
      } as ConcreteGiven<ConcreteLambdas[typeof typeclass], A>),
    )
  }

  return results
}

/**
 * Run the given monoid/semigroup instance through their respective typeclass
 * law tests.
 * @param a - An arbitrary for the underlying type `A`.
 * @param equalsA - Equivalence for the underlying type `A`.
 * @param parameters - Optional runtime `fast-check` parameters.
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
 * @param parameters - Optional runtime `fast-check` parameters.
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

/**
 * Maps typeclass name to its instance type. For example to get
 * the type of `Monoid` instance for `readonly number[]`:
 * @example
 * ```ts
 * type MyMonoidInstance = Instances<readonly number[]>['Monoid']
 * // MyMonoidInstance ≡ Monoid<readonly number[]>
 * ```
 * @category model
 */
export type Concrete<A> = {
  [Key in ConcreteClass]: Kind<ConcreteLambdas[Key], never, unknown, unknown, A>
}
