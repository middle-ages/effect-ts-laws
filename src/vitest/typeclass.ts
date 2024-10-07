import {TypeLambda} from 'effect/HKT'
import {ParameterOverrides} from '../law.js'
import {buildTypeclassLawsFor} from '../laws/typeclass/build.js'
import {TypeclassInstances, GivenConcerns} from '../laws/typeclass/harness.js'
import {testLaws} from './runner.js'

/**
 * Test typeclass laws for the given instances of some datatype.
 *
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Monad: Option.Monad }` will run
 * the monad typeclass laws on `Option`.
 * @param given - The union of all options required for testing the instances
 * given in the `instances` argument. The specific options depend on the list
 * of instances being tested, but they are all either equalities, arbitraries,
 * or functions on the underlying types, that are required for testing the laws.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testTypeclassLawsFor = <
  F extends TypeLambda,
  Ins extends TypeclassInstances<F, A, In1, Out2, Out1>,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  instances: Ins,
  given: GivenConcerns<F, A, B, C, In1, Out2, Out1>,
  parameters?: ParameterOverrides,
) => {
  for (const lawSet of buildTypeclassLawsFor<F, Ins, A, B, C, In1, Out2, Out1>(
    instances,
    given,
  )) {
    testLaws(lawSet, parameters)
  }
}
