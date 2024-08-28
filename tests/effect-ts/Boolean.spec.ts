/** Typeclass law tests for `Boolean` datatype. */
import {
  MonoidEqv,
  MonoidEvery,
  MonoidSome,
  MonoidXor,
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
      testBoolean(MonoidEqv)
    })

    describe('every', () => {
      testBoolean(MonoidEvery)
    })

    describe('some', () => {
      testBoolean(MonoidSome)
    })

    describe('xor', () => {
      testBoolean(MonoidXor)
    })
  })
})
