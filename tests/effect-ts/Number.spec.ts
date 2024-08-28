/** Typeclass law tests for `Number` datatype. */
import {
  MonoidMax,
  MonoidMin,
  MonoidMultiply,
  MonoidSum,
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
      testNumber(MonoidSum)
    })

    describe('multiply', () => {
      testNumber(MonoidMultiply)
    })

    describe('min', () => {
      testNumber(MonoidMin)
    })

    describe('max', () => {
      testNumber(MonoidMax)
    })
  })
})
