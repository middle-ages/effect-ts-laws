import {Array as AR, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {UnionToIntersection} from 'effect/Types'
import {lawSetTests, Overrides, testLaws} from '../../../law.js'
import {
  Parameterized,
  ParameterizedClass,
  parameterizedLawsFor,
} from '../parameterized/catalog.js'
import {GivenConcerns} from '../parameterized/given.js'

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
    Ins extends Partial<Parameterized<F>>,
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
     * Parameterized typeclass test options.
     */
    given: GivenConcerns<F, A, B, C, In1, Out2, Out1>,
    /**
     * Optional runtime `fc-check` parameters.
     */
    parameters?: Overrides,
  ) => {
    const mergedInstances = Object.assign(
      {},
      ...Object.values(instances),
    ) as UnionToIntersection<Ins[keyof Ins]>

    const lawSets = pipe(
      Object.keys(instances) as ParameterizedClass[],
      AR.map(<K extends ParameterizedClass>(key: K) =>
        parameterizedLawsFor(key)(
          Object.assign({F: mergedInstances}, given) as never,
        ),
      ),
    )

    testLaws(lawSetTests(...lawSets), parameters)
  }
