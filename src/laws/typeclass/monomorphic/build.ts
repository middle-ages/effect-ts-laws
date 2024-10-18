import type {TypeLambda} from 'effect/HKT'
import {LawSet} from '../../../law.js'
import {buildTypeclassLawsFor} from '../build.js'
import type {TypeclassInstances} from '../build.js'
import type {ContravariantGiven} from './contravariant.js'
import {unfoldContravariantGiven} from './contravariant.js'
import {unfoldMonomorphicGiven} from './given.js'
import type {MonomorphicGivenOf} from './given.js'
import type {Mono} from './helpers.js'

/**
 * Build typeclass laws for the given instances of some datatype.
 * @param given - Test options for the datatype under test.
 * @returns Array of LawSets full of typeclass laws for the instance under test.
 * @property contravariant - Test contravariant typeclass laws on the given
 * instances.
 * @category harness
 */
export const buildTypeclassLaws =
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: MonomorphicGivenOf<F, Mono, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
  ): LawSet[] =>
    buildTypeclassLawsFor<F, Ins, Mono, Mono, Mono, R, O, E>(
      instances,
      unfoldMonomorphicGiven<F, Mono, R, O, E>(given),
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
 * @returns Array of LawSets full of contravariant typeclass laws for the
 * instance under test.
 * @category harness
 */
export const buildContravariantLaws =
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
  ): LawSet[] =>
    buildTypeclassLawsFor<F, Ins, Mono, Mono, Mono, R, O, E>(
      instances,
      unfoldContravariantGiven<F, R, O, E>(given),
    )

buildTypeclassLaws.contravariant = buildContravariantLaws
