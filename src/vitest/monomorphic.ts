import {getMonoid} from '@effect/typeclass/data/Array'
import {pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import type {ParameterOverrides} from '../law.js'
import type {
  MonomorphicGiven,
  TypeclassInstances,
} from '../laws/typeclass/harness.js'
import {
  buildContravariantLaws,
  buildTypeclassLaws,
} from '../laws/typeclass/harness.js'
import type {ContravariantGiven} from '../laws/typeclass/monomorphic/contravariant.js'
import type {Mono} from '../laws/typeclass/monomorphic/helpers.js'
import {
  monoArbitrary,
  monoEquivalence,
} from '../laws/typeclass/monomorphic/helpers.js'
import {testLawSets} from './testLaws.js'

/**
 * Test typeclass laws for the given instances of some datatype.
 * All functions monomorphic on an underlying type of `readonly number[]`.
 * At_the `contravariant` key of this function, you will find the
 * version of this function for contravariant datatypes.
 * @param given - Test options for the datatype under test.
 * @category vitest
 */
export const testTypeclassLaws =
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: MonomorphicGiven<F, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /** Optional runtime `fast-check` parameters. */
    parameters?: ParameterOverrides,
  ) => {
    testLawSets({verbose: true, ...parameters})(
      ...buildTypeclassLaws<F, R, O, E>({
        a: monoArbitrary,
        equalsA: monoEquivalence,
        Monoid: getMonoid<number>(),
        ...given,
      })(instances),
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
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: ContravariantGiven<F, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Invariant: Predicate.Invariant }`
     * will run the Invariant typeclass laws on the datatype `Predicate`.
     */
    instances: Ins,
    /** Optional runtime `fast-check` parameters. */
    parameters?: ParameterOverrides,
  ) => {
    testLawSets(parameters)(...pipe(instances, buildContravariantLaws(given)))
  }

testTypeclassLaws.contravariant = testContravariantLaws
