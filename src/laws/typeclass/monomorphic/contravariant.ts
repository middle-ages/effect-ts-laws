import {Equivalence as EQ} from 'effect'
import {constant} from 'effect/Function'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {LiftArbitrary} from '../../../arbitrary.js'
import type {LiftEquivalence} from '../../../law.js'
import {monoRecord} from '../../../util.js'
import type {GivenConcerns} from '../parameterized/given.js'
import type {Mono} from './helpers.js'
import {
  monoArbitrary,
  monoEquivalence,
  monoMonoid,
  monoPredicateArbitrary,
} from './helpers.js'

/**
 * Options for the monomorphic typeclass test runner on datatypes where
 * the underlying datatype is in _contravariant position, for example
 * `Predicate`. Not to be confused with the Contravariant
 * _typeclass_ tests.
 * @category monomorphic
 */
export interface ContravariantGiven<
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
> {
  /** An arbitrary for the datatype under test of type `F<Mono>`.  */
  Arbitrary: fc.Arbitrary<Kind<F, R, O, E, Mono>>

  /** Equivalence for the datatype under test of type `F<Mono>`.  */
  Equivalence: EQ.Equivalence<Kind<F, R, O, E, Mono>>
}

/**
 * Unfolds the given `ContravariantGiven` options for testing
 * contravariant datatypes into the `GivenConcerns` required for
 * typeclass law tests.
 * @param given Test options for contravariant typeclass laws building.
 * @category monomorphic
 */
export const unfoldContravariantGiven = <
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>({
  Equivalence,
  Arbitrary,
}: ContravariantGiven<F, R, O, E>): GivenConcerns<
  F,
  Mono,
  Mono,
  Mono,
  R,
  O,
  E
> => ({
  ...monoRecord(monoArbitrary)('a', 'b', 'c'),
  ...monoRecord(monoEquivalence)('equalsA', 'equalsB', 'equalsC'),
  ...monoRecord(monoPredicateArbitrary)(
    'predicateA',
    'predicateB',
    'predicateC',
  ),

  // These functions will always be called with a single type: Mono.
  // Only in the monomorphic tests is this maneuver safe.
  getEquivalence: constant(Equivalence) as LiftEquivalence<F, R, O, E>,
  getArbitrary: constant(Arbitrary) as LiftArbitrary<F, R, O, E>,
  Monoid: monoMonoid,
})
