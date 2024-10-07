import {pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {LawSet} from '../../../../law.js'
import {boundedLaws} from '../Bounded.js'
import {equivalenceLaws} from '../Equivalence.js'
import {monoidLaws} from '../Monoid.js'
import {orderLaws} from '../Order.js'
import {semigroupLaws} from '../Semigroup.js'
import {ConcreteGiven, ConcreteLambdas} from './given.js'

/**
 * Map of typeclass name to their laws, for typeclasses of concrete types.
 * @category harness
 */
export const concreteLaws = {
  Bounded: boundedLaws,
  Equivalence: equivalenceLaws,
  Monoid: monoidLaws,
  Order: orderLaws,
  Semigroup: semigroupLaws,
} as const

/**
 * Union of all names of typeclasses for concrete types.
 * @category harness
 */
export type ConcreteClass = keyof typeof concreteLaws

/**
 * Maps typeclass name to its instance type. For example to get
 * the type of `Monoid` instance for `readonly number[]`:
 * @example
 * ```ts
 * type MyMonoidInstance = Instances<readonly number[]>['Monoid']
 * // MyMonoidInstance ≡ Monoid<readonly number[]>
 * ```
 * @category harness
 */
export type Concrete<A> = {
  [Key in ConcreteClass]: Kind<ConcreteLambdas[Key], never, unknown, unknown, A>
}

/**
 * Get the typeclass laws for the given typeclass name.
 * @category harness
 */
export const concreteLawsFor = <const Typeclass extends ConcreteClass>(
  name: Typeclass,
) =>
  concreteLaws[name] as <A>(
    options: ConcreteGiven<ConcreteLambdas[Typeclass], A>,
  ) => LawSet

/**
 * Build a `LawSet` for the given concrete typeclass instance.
 * @category harness
 */
export const buildConcreteTypeclassLaw =
  <Typeclass extends ConcreteClass>(typeclass: Typeclass) =>
  <A>(given: ConcreteGiven<ConcreteLambdas[Typeclass], A>): LawSet =>
    pipe(given, concreteLawsFor(typeclass))

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
