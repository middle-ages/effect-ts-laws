import {testUnaryEquivalence, tinyInteger} from '#arbitrary'
import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup as arraySemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Equivalence as EQ, Number as NU, Order as OD} from 'effect'
import fc from 'fast-check'

/**
 * The underlying type used for monomorphic typeclass law tests.
 * This means that, for example, if we are testing the `Option`
 * datatype, the actual type used in the tests will be
 * `Option<Mono> ≡ Option<readonly number[]>`.
 * @category monomorphic
 */
export type Mono = readonly number[]

/**
 * The equivalence used for {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoEquivalence: EQ.Equivalence<Mono> = AR.getEquivalence(
  NU.Equivalence,
)

/**
 * An arbitrary for the underlying type of the
 * {@link testTypeclassLaws} unit under test.
 * @category monomorphic
 */
export const monoArbitrary: fc.Arbitrary<Mono> = fc.array(tinyInteger, {
  minLength: 0,
  maxLength: 4,
})

/**
 * The order used to {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoOrder: OD.Order<Mono> = AR.getOrder(NU.Order)

/**
 * The semigroup used to {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoSemigroup: SG.Semigroup<Mono> = arraySemigroup<number>()

/**
 * Build an equivalence between functions of type
 * `(numArray: Mono) ⇒ A`.
 * @category monomorphic
 */
export const getMonoUnaryEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
): EQ.Equivalence<(numArray: Mono) => A> =>
  testUnaryEquivalence(monoArbitrary, equalsA)
