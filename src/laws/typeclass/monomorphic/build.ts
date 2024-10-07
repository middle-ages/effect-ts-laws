import {TypeLambda} from 'effect/HKT'
import {LawSet} from '../../../law.js'
import {buildTypeclassLawsFor, TypeclassInstances} from '../build.js'
import {
  ContravariantGiven,
  unfoldContravariantGiven,
} from '../monomorphic/contravariant.js'
import {Mono} from '../monomorphic/helpers.js'
import {
  MonomorphicGiven,
  unfoldMonomorphicGiven,
} from '../monomorphic/invariant.js'

export {unfoldContravariantGiven} from '../monomorphic/contravariant.js'
export type {ContravariantGiven} from '../monomorphic/contravariant.js'
export {
  getMonoUnaryEquivalence,
  monoArbitrary,
  monoEquivalence,
  monoOrder,
  monoSemigroup,
} from '../monomorphic/helpers.js'
export type {Mono} from '../monomorphic/helpers.js'
export {unfoldMonomorphicGiven} from '../monomorphic/invariant.js'
export type {MonomorphicGiven} from '../monomorphic/invariant.js'

/**
 * Build typeclass laws for the given instances of some datatype.
 * @param given - Test options for the datatype under test.
 * @category harness
 */
export const buildTypeclassLaws =
  <F extends TypeLambda>(given: MonomorphicGiven<F>) =>
  <Ins extends TypeclassInstances<F, Mono, never, unknown, string>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
  ): LawSet[] =>
    buildTypeclassLawsFor<F, Ins, Mono, Mono, Mono, never, unknown, string>(
      instances,
      unfoldMonomorphicGiven(given),
    )

/**
 * Build typeclass laws for the given instances of some _contravariant_
 * datatype: a higher-kinded datatype where the constructor type
 * parameter appears in the contravariant position, for example
 * `Predicate`. The underlying types used will all be
 * `readonly number[]`. This is a version of {@link buildTypeclassLaws}
 * for contravariant datatypes.
 * @param given - Contravariant test options for the datatype under
 * test.
 * @category harness
 */
export const buildContravariantLaws =
  <F extends TypeLambda>(given: ContravariantGiven<F>) =>
  <Ins extends TypeclassInstances<F, Mono, never, unknown, string>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Invariant: Predicate.Invariant }`
     * will run the Invariant typeclass laws on the datatype `Predicate`.
     */
    instances: Ins,
  ): LawSet[] =>
    buildTypeclassLawsFor<F, Ins, Mono, Mono, Mono, never, unknown, string>(
      instances,
      unfoldContravariantGiven(given),
    )

buildTypeclassLaws.contravariant = buildContravariantLaws
