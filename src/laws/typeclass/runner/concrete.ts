import {pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {LawList, ParameterOverrides, verboseLaws} from '../../../law.js'
import {
  ConcreteInstances,
  concreteLawsFor,
  ConcreteOptionsFor,
  ConcreteTypeclass,
} from '../concrete/catalog.js'
import {ConcreteOptions} from '../concrete/options.js'

/** Run a single instance through the given typeclass laws. */
export const testConcreteTypeclassLaw =
  <Typeclass extends ConcreteTypeclass>(typeclass: Typeclass) =>
  <A>(
    options: ConcreteOptionsFor<Typeclass, A>,
    parameters?: ParameterOverrides,
  ) => {
    const laws = pipe(options, concreteLawsFor(typeclass))
    verboseLaws(
      laws as LawList<typeof laws extends LawList<infer Args> ? Args : never>,
      parameters,
    )
  }

/**
 * Test [concrete type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#concrete-types)
 * typeclass laws for the given instances of some data type.
 *
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Equivalence: Number.Equivalence }` will run
 * the instance through the `Equivalence` typeclass laws.
 * @param options - The common concrete options: equivalence and an arbitrary
 * for the underlying type of the test.
 * @param parameters - Optional run-time `fc-check` parameters.
 */
export const testConcreteTypeclassLaws =
  <A>(instances: Partial<ConcreteInstances<A>>) =>
  (
    options: Omit<ConcreteOptions<TypeLambda, A>, 'F'>,
    parameters?: ParameterOverrides,
  ) => {
    for (const key of Object.keys(instances)) {
      const typeclass = key as ConcreteTypeclass
      const instanceOptions = {
        ...options,
        F: instances[typeclass],
      } as ConcreteOptionsFor<typeof typeclass, A>
      testConcreteTypeclassLaw(typeclass)(instanceOptions, parameters)
    }
  }
