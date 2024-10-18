import {pipe} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import type {LawSet} from '../../../law.js'
import {boundedLaws} from './Bounded.js'
import {equivalenceLaws} from './Equivalence.js'
import {monoidLaws} from './Monoid.js'
import {orderLaws} from './Order.js'
import {semigroupLaws} from './Semigroup.js'
import type {ConcreteGiven, ConcreteLambdas} from './given.js'

/** Maps typeclass name to its laws, for typeclasses of concrete types. */
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

    results.push(
      pipe(
        {...given, F: instances[typeclass]} as ConcreteGiven<
          ConcreteLambdas[typeof typeclass],
          A
        >,
        concreteLawsFor(typeclass),
      ),
    )
  }

  return results
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
