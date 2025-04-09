import type {LiftArbitrary} from '#arbitrary'
import {
  option,
  predicate,
  stringKeyRecord,
  testPredicateEquivalence,
  testUnaryEquivalence,
  tinyInteger,
} from '#arbitrary'
import type {LiftEquivalence} from '#law'
import {Monoid} from '@effect/typeclass'
import {MonoidSum} from '@effect/typeclass/data/Number'
import {getOptionalMonoid} from '@effect/typeclass/data/Option'
import {Number as NU, Order as OD, Predicate as PR, Record as RC} from 'effect'
import {type Equivalence} from 'effect/Equivalence'
import {constant} from 'effect/Function'
import type {Kind, TypeLambda} from 'effect/HKT'
import {getEquivalence, getOrder, type Option} from 'effect/Option'
import fc from 'fast-check'
import type {GivenConcerns, ParameterizedGiven} from '../parameterized/given.js'
import {unfoldMonomorphicGiven} from './given.js'

/**
 * The underlying type used for monomorphic typeclass law tests.
 * This means that, for example, if we are testing the `Array`
 * datatype, the actual type used in the tests will be
 * `Array<Mono> ≡ Option<Option<number>>`.
 * @category monomorphic
 */
export type Mono = Option<number>

/**
 * An arbitrary for the underlying type of the
 * {@link vitest.testTypeclassLaws} unit under test.
 * @category monomorphic
 */
export const monoArbitrary: fc.Arbitrary<Mono> = option(tinyInteger)

/**
 * Arbitrary for a record with string keys and `Mono` values.
 * @category monomorphic
 */
export const monoRecordArbitrary: fc.Arbitrary<
  RC.ReadonlyRecord<string, Mono>
> = stringKeyRecord(monoArbitrary)

/** @category monomorphic */
export const monoPredicateArbitrary: fc.Arbitrary<PR.Predicate<Mono>> =
  predicate<Mono>()

/**
 * The equivalence used for {@link vitest.testTypeclassLaws}.
 * @category monomorphic
 */
export const monoEquivalence: Equivalence<Mono> = getEquivalence(NU.Equivalence)

/**
 * Equivalence for a record with string keys and `Mono` values.
 * @category monomorphic
 */
export const monoRecordEquivalence: Equivalence<
  RC.ReadonlyRecord<string, Mono>
> = RC.getEquivalence(monoEquivalence)

/**
 * The order used for {@link vitest.testTypeclassLaws}.
 * @category monomorphic
 */
export const monoOrder: OD.Order<Mono> = getOrder(NU.Order)

/**
 * Monoid instance for the `Mono` type.
 * @category monomorphic
 */
export const monoMonoid: Monoid.Monoid<Mono> = getOptionalMonoid(MonoidSum)

/**
 * Build a sampling equivalence between functions of type
 * `(numArray: Mono) ⇒ A`.
 * @category monomorphic
 */
export const getMonoUnaryEquivalence = <A>(
  equalsA: Equivalence<A>,
): Equivalence<(numArray: Mono) => A> =>
  testUnaryEquivalence(monoArbitrary, equalsA)

/**
 * Build a sampling equivalence for predicates of the underlying `Mono` type.
 * @category monomorphic
 */
export const monoPredicateEquivalence: Equivalence<PR.Predicate<Mono>> =
  testPredicateEquivalence(monoArbitrary)

/**
 * Unfold the options for monomorphic typeclass law tests on the underlying type
 * `Mono` from a function that will lift equivalence in the higher-kinded type
 * under test, and one that will lift an arbitrary. This function is used inside
 * typeclass law test code to unfold the requirements of their law predicates.
 * @category monomorphic
 */
export const unfoldMonoGiven = <
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  getEquivalence: LiftEquivalence<F, R, O, E>,
  getArbitrary: LiftArbitrary<F, R, O, E>,
): GivenConcerns<F, Mono, Mono, Mono, R, O, E> =>
  unfoldMonomorphicGiven<F, Mono, R, O, E>({
    a: monoArbitrary,
    equalsA: monoEquivalence,
    Monoid: monoMonoid,
    getEquivalence,
    getArbitrary,
  })

const contravariant = <
  Typeclass extends TypeLambda,
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: Kind<Typeclass, R, O, E, F>,
): ParameterizedGiven<Typeclass, F, Mono, Mono, Mono, R, O, E> => ({
  F,
  ...unfoldMonoGiven(
    constant(monoPredicateEquivalence) as LiftEquivalence<F, R, O, E>,
    (<T>(_: fc.Arbitrary<T>) => monoPredicateArbitrary) as LiftArbitrary<
      F,
      R,
      O,
      E
    >,
  ),
})

unfoldMonoGiven.contravariant = contravariant
