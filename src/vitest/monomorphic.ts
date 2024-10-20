import {pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {ParameterOverrides} from '../law.js'
import {
  buildContravariantLaws,
  buildTypeclassLaws,
  TypeclassInstances,
} from '../laws/typeclass/harness.js'
import {ContravariantGiven} from '../laws/typeclass/monomorphic/contravariant.js'
import {Mono} from '../laws/typeclass/monomorphic/helpers.js'
import {MonomorphicGiven} from '../laws/typeclass/monomorphic/invariant.js'
import {testLawSets} from './runner.js'

/**
 * Test typeclass laws for the given instances of some datatype.
 * This is just like {@link testTypeclassLawsFor}, but with all
 * functions monomorphic on an underlying type of `readonly number[]`.
 * At the `contravariant` key of this function, you will find the
 * version of this function for contravariant datatypes.
 * @example
 * ```ts
 * // Test “Traversable” typeclass laws on “Identity” datatype.
 * import {
 *   IdentityTypeLambda,
 *   Traversable
 * } from '@effect/typeclass/data/Identity'
 * import {identity as id} from 'effect'
 * import {testTypeclassLaws, predicate} from 'effect-ts-laws'
 * testTypeclassLaws<IdentityTypeLambda>({
 *   getEquivalence: identity,
 *   getArbitrary: identity,
 * })({ Traversable })
 * ```
 * @param given - Test options for the datatype under test.
 * @category vitest
 */
export const testTypeclassLaws =
  <F extends TypeLambda>(given: MonomorphicGiven<F>) =>
  <Ins extends TypeclassInstances<F, Mono, never, unknown, string>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /**
     * Optional runtime `fast-check` parameters.
     */
    parameters?: ParameterOverrides,
  ) => {
    testLawSets({verbose: true, ...parameters})(
      ...buildTypeclassLaws(given)(instances),
    )
  }

/**
 * Test typeclass laws for the given instances of some _contravariant_
 * datatype: a higher-kinded datatype where the constructor type
 * parameter appears in the contravariant position, for example
 * `Predicate`. The underlying types used will all be
 * `readonly number[]`. This is a version of {@link testTypeclassLaws}
 * for contravariant datatypes.
 * @param given - Contravariant test options for the datatype under
 * test.
 * @category vitest
 */
export const testContravariantLaws =
  <F extends TypeLambda>(given: ContravariantGiven<F>) =>
  <Ins extends TypeclassInstances<F, Mono, never, unknown, string>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Invariant: Predicate.Invariant }`
     * will run the Invariant typeclass laws on the datatype `Predicate`.
     */
    instances: Ins,
    /**
     * Optional runtime `fast-check` parameters.
     */
    parameters?: ParameterOverrides,
  ) => {
    testLawSets(parameters)(...pipe(instances, buildContravariantLaws(given)))
  }

testTypeclassLaws.contravariant = testContravariantLaws
