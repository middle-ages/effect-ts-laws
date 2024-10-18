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
  Option as OP,
  Predicate as PR,
  Record as RC,
} from 'effect'
import fc from 'fast-check'
import {
  option,
  predicate,
  stringKeyRecord,
  testUnaryEquivalence,
  tinyInteger,
} from '../../../arbitrary.js'

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
export const monoOptionArbitrary: fc.Arbitrary<OP.Option<Mono>> =
  option(monoArbitrary)

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
 * Equivalence for `Option<Mono>`.
 * @category monomorphic
 */
export const monoOptionEquivalence: EQ.Equivalence<OP.Option<Mono>> =
  OP.getEquivalence(monoEquivalence)

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
 * Build an equivalence between functions of type
 * `(numArray: Mono) ⇒ A`.
 * @category monomorphic
 */
export const getMonoUnaryEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
): EQ.Equivalence<(numArray: Mono) => A> =>
  testUnaryEquivalence(monoArbitrary, equalsA)
