import type {LawSet} from '#law'
import type {Kind, TypeLambda} from 'effect/HKT'
import {boundedLaws} from './Bounded.js'
import {equivalenceLaws} from './Equivalence.js'
import {monoidLaws} from './Monoid.js'
import {orderLaws} from './Order.js'
import {semigroupLaws} from './Semigroup.js'
import type {BuildConcrete, ConcreteGiven, ConcreteLambdas} from './given.js'

/** Maps typeclass name to its laws, for typeclasses of concrete types. */
export const concreteLaws = {
  Bounded: boundedLaws,
  Equivalence: equivalenceLaws,
  Monoid: monoidLaws,
  Order: orderLaws,
  Semigroup: semigroupLaws,
} as const

/**
 * Union of all typeclasses names for concrete types.
 * @category harness
 */
export type ConcreteClass = keyof typeof concreteLaws

/**
 * Maps typeclass name to its instance type. For example to get
 * the type of `Monoid` instance for `readonly number[]`:
 * @example
 * import {Concrete} from 'effect-ts-laws'
 * type MyMonoidInstance = Concrete<readonly number[]>['Monoid']
 * // MyMonoidInstance ≡ Monoid<readonly number[]>
 * @category harness
 */
export type Concrete<A> = {
  [Key in ConcreteClass]: Kind<ConcreteLambdas[Key], never, unknown, unknown, A>
}

/**
 * Build [concrete](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
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
    type Typeclass = ConcreteLambdas[typeof typeclass]

    const laws = concreteLaws[typeclass] as BuildConcrete<Typeclass>
    const args = {...given, F: instances[typeclass]} as ConcreteGiven<
      Typeclass,
      A
    >

    results.push(laws(args))
  }

  return results
}
