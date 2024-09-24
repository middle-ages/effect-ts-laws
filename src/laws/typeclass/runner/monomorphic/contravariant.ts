import {LiftArbitrary} from '#arbitrary'
import {LiftEquivalence} from '#law'
import {Equivalence as EQ} from 'effect'
import {constant} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {GivenConcerns} from '../../parameterized/given.js'
import {Mono, monoArbitrary, monoEquivalence} from './helpers.js'

/**
 * Options for the monomorphic typeclass test runner on datatypes where
 * the underlying datatype is in _contravariant position, for example
 * `Predicate`. Not to be confused with the Contravariant
 * _typeclass_ tests.
 * @category monomorphic
 */
export interface ContravariantGiven<F extends TypeLambda> {
  /**
   * An arbitrary for the datatype under test of type `F<Mono>`.
   */
  Arbitrary: fc.Arbitrary<Kind<F, never, unknown, string, Mono>>
  /**
   * Equivalence for the datatype under test of type `F<Mono>`.
   */
  Equivalence: EQ.Equivalence<Kind<F, never, unknown, string, Mono>>
}

/**
 * Unfolds the given `ContravariantGiven` options for testing
 * contravariant datatypes into the `GivenConcerns` required for
 * typeclass law tests.
 * @category monomorphic
 */
export const unfoldContravariantGiven = <F extends TypeLambda>({
  Equivalence,
  Arbitrary,
}: ContravariantGiven<F>): GivenConcerns<
  F,
  Mono,
  Mono,
  Mono,
  never,
  unknown,
  string
> => ({
  a: monoArbitrary,
  b: monoArbitrary,
  c: monoArbitrary,
  equalsA: monoEquivalence,
  equalsB: monoEquivalence,
  equalsC: monoEquivalence,
  // Only in the monomorphic tests is this maneuver safe.
  // These functions will always be called with a single type: Mono.
  getEquivalence: constant(Equivalence) as LiftEquivalence<
    F,
    never,
    unknown,
    string
  >,
  getArbitrary: constant(Arbitrary) as LiftArbitrary<F, never, unknown, string>,
})
