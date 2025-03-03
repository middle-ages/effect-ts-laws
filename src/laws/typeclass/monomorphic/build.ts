import {LawSet} from '#law'
import type {TypeLambda} from 'effect/HKT'
import type {TypeclassInstances} from '../build.js'
import {buildTypeclassLawsFor} from '../build.js'
import {MonomorphicGivenOf, unfoldMonomorphicGiven} from './given.js'

/**
 * Build monomorphic typeclass laws for the given instances of some
 * higher-kinded data type `F` with a single covariant underlying type `A`.
 * @param given - Test options for the datatype under test.
 * @returns Array of LawSets full of typeclass laws for the instance under test.
 * @property contravariant - Test contravariant typeclass laws on the given
 * instances.
 * @category harness
 */
export const buildMonomorphicLaws =
  <F extends TypeLambda, A, R = never, O = unknown, E = unknown>(
    given: MonomorphicGivenOf<F, A, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, A, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
  ): LawSet[] =>
    buildTypeclassLawsFor<F, Ins, A, A, A, R, O, E>(
      instances,
      unfoldMonomorphicGiven<F, A, R, O, E>(given),
    )
