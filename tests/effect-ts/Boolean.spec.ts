/** Typeclass law tests for `Boolean` data type. */
import {
  MonoidEqv,
  MonoidEvery,
  MonoidSome,
  MonoidXor,
  SemigroupEqv,
  SemigroupEvery,
  SemigroupSome,
  SemigroupXor,
} from '@effect/typeclass/data/Boolean'
import {Boolean as BO} from 'effect'
import {testConcreteTypeclassLaws, testMonoid} from 'effect-ts-laws'
import fc from 'fast-check'

describe('@effect/typeclass/data/Boolean', () => {
  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws(
      {
        Equivalence: BO.Equivalence,
        Order: BO.Order,
      },
      {a: fc.boolean(), equalsA: (a, b) => a === b},
    )
  })

  describe('Semigroup/monoid', () => {
    const testBoolean = testMonoid(fc.boolean(), (a, b) => a === b)

    describe('eqv', () => {
      testBoolean(MonoidEqv, SemigroupEqv)
    })

    describe('every', () => {
      testBoolean(MonoidEvery, SemigroupEvery)
    })

    describe('some', () => {
      testBoolean(MonoidSome, SemigroupSome)
    })

    describe('xor', () => {
      testBoolean(MonoidXor, SemigroupXor)
    })
  })
})
