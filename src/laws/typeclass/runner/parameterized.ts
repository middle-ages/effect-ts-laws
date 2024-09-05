import {Array as AR} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {lawSetTests, Overrides, testLaws} from '../../../law.js'
import {
  Parameterized,
  ParameterizedClass,
  parameterizedLawsFor,
} from '../parameterized/catalog.js'
import {ParameterizedGiven} from '../parameterized/given.js'

/**
 * Test [parameterized type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclass laws for the given instances of some datatype.
 *
 * @typeParam F - Type lambda of the datatype under test.
 * @typeParam A - Type lambda of first underlying type.
 * @typeParam B - Type lambda of second underlying type.
 * @typeParam C - Type lambda of third underlying type.
 * @category harness
 */
export const testParameterizedTypeclassLaws =
  <F extends TypeLambda, A, B = A, C = A>() =>
  <
    Ins extends Partial<Parameterized<F, In1, Out2, Out1>>,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /**
     * The union of all options required for testing the instances
     * given in the `instances` argument. The specific options depend on the list
     * of instances being tested, but they are all either equalities, arbitraries,
     * or functions on the underlying types, that are required for testing the laws.
     */
    options: Omit<ParameterizedGiven<never, F, A, B, C, In1, Out2, Out1>, 'F'>,

    /**
     * Optional runtime `fc-check` parameters.
     */
    parameters?: Overrides,
  ) => {
    const lawSets = lawSetTests(
      ...AR.map(
        Object.entries(instances) as {
          [K in keyof Ins]: [K & ParameterizedClass, Ins[K]]
        }[keyof Ins][],
        ([typeclass, F]) =>
          parameterizedLawsFor(typeclass)({...options, F} as never),
      ),
    )

    testLaws(lawSets, parameters)
  }
