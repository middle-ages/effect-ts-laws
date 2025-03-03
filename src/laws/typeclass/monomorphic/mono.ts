import type {LiftArbitrary} from '#arbitrary'
import {
  predicate,
  stringKeyRecord,
  testPredicateEquivalence,
  testUnaryEquivalence,
  tinyInteger,
} from '#arbitrary'
import type {LiftEquivalence} from '#law'
import {LawSet} from '#law'
import {Monoid as MO, Semigroup as SG} from '@effect/typeclass'
import {
  getMonoid as arrayMonoid,
  getSemigroup as arraySemigroup,
} from '@effect/typeclass/data/Array'
import {
  Array as AR,
  Equivalence as EQ,
  Number as NU,
  Order as OD,
  Predicate as PR,
  Record as RC,
} from 'effect'
import {constant} from 'effect/Function'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {TypeclassInstances} from '../build.js'
import type {GivenConcerns, ParameterizedGiven} from '../parameterized/given.js'
import {buildMonomorphicLaws} from './build.js'
import {MonomorphicGivenOf, unfoldMonomorphicGiven} from './given.js'

/**
 * The underlying type used for monomorphic typeclass law tests.
 * This means that, for example, if we are testing the `Option`
 * datatype, the actual type used in the tests will be
 * `Option<Mono> ≡ Option<readonly number[]>`.
 * @category monomorphic
 */
export type Mono = readonly number[]

/**
 * An arbitrary for the underlying type of the
 * {@link vitest.testTypeclassLaws} unit under test.
 * @category monomorphic
 */
export const monoArbitrary: fc.Arbitrary<Mono> = fc.array(tinyInteger, {
  minLength: 0,
  maxLength: 4,
})

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
export const monoEquivalence: EQ.Equivalence<Mono> = AR.getEquivalence(
  NU.Equivalence,
)

/**
 * Equivalence for a record with string keys and `Mono` values.
 * @category monomorphic
 */
export const monoRecordEquivalence: EQ.Equivalence<
  RC.ReadonlyRecord<string, Mono>
> = RC.getEquivalence(monoEquivalence)

/**
 * The order used for {@link vitest.testTypeclassLaws}.
 * @category monomorphic
 */
export const monoOrder: OD.Order<Mono> = AR.getOrder(NU.Order)

/**
 * The semigroup used for {@link vitest.testTypeclassLaws}.
 * @category monomorphic
 */
export const monoSemigroup: SG.Semigroup<Mono> = arraySemigroup<number>()

/**
 * Monoid instance for the `Mono` type.
 * @category monomorphic
 */
export const monoMonoid: MO.Monoid<Mono> = arrayMonoid<number>()

/**
 * Build a sampling equivalence between functions of type
 * `(numArray: Mono) ⇒ A`.
 * @category monomorphic
 */
export const getMonoUnaryEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
): EQ.Equivalence<(numArray: Mono) => A> =>
  testUnaryEquivalence(monoArbitrary, equalsA)

/**
 * Build a sampling equivalence for predicates of the underlying `Mono` type.
 * @category monomorphic
 */
export const monoPredicateEquivalence: EQ.Equivalence<PR.Predicate<Mono>> =
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

export const buildMonoLaws =
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: MonomorphicGivenOf<F, Mono, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, R, O, E>>(
    instances: Ins,
  ): LawSet[] =>
    buildMonomorphicLaws<F, Mono, R, O, E>(given)(instances)

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
