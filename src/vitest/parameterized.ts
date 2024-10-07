import {TypeLambda} from 'effect/HKT'
import {ParameterOverrides} from '../law.js'
import {
  buildParameterizedTypeclassLaws,
  GivenConcerns,
  Parameterized,
} from '../laws/typeclass/harness.js'
import {testLawSets} from './runner.js'

/**
 * Test [parameterized type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclass laws for the given instances of some datatype.
 *
 * @typeParam F - Type lambda of the datatype under test.
 * @typeParam A - Type lambda of first underlying type.
 * @typeParam B - Type lambda of second underlying type.
 * @typeParam C - Type lambda of third underlying type.
 * @category vitest
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
     * Optional runtime `fast-check` parameters.
     */
    parameters?: ParameterOverrides,
  ) => {
    const lawSets = buildParameterizedTypeclassLaws<F, A, B, C>()(
      instances,
      given,
    )

    testLawSets(parameters)(...lawSets)
  }
