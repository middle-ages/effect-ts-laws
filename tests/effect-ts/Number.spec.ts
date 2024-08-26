/** Typeclass law tests for `Number` data type. */
import {
  MonoidMax,
  MonoidMin,
  MonoidMultiply,
  MonoidSum,
  SemigroupMax,
  SemigroupMin,
  SemigroupMultiply,
  SemigroupSum,
} from '@effect/typeclass/data/Number'
import {Number as NU} from 'effect'
import {
  testConcreteTypeclassLaws,
  testMonoid,
  tinyInteger,
} from 'effect-ts-laws'

describe('@effect/typeclass/data/Number', () => {
  const a = tinyInteger,
    equalsA = (a: number, b: number) => a === b

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws(
      {
        Equivalence: NU.Equivalence,
        Order: NU.Order,
      },
      {a, equalsA},
    )
  })

  describe('Semigroup/monoid', () => {
    const testNumber = testMonoid(a, equalsA)

    describe('sum', () => {
      testNumber(MonoidSum, SemigroupSum)
    })

    describe('multiply', () => {
      testNumber(MonoidMultiply, SemigroupMultiply)
    })

    describe('min', () => {
      testNumber(MonoidMin, SemigroupMin)
    })

    describe('max', () => {
      testNumber(MonoidMax, SemigroupMax)
    })
  })
})
