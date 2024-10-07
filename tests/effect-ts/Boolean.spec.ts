/** Typeclass law tests for the `Boolean` datatype. */
import {
  MonoidEqv,
  MonoidEvery,
  MonoidSome,
  MonoidXor,
} from '@effect/typeclass/data/Boolean'
import {pipe} from 'effect'
import {testConcreteTypeclassLaws, testMonoids} from 'effect-ts-laws/vitest'
import {Equivalence, Order} from 'effect/Boolean'
import fc from 'fast-check'

describe('@effect/typeclass/data/Boolean', () => {
  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws(
      {Equivalence, Order},
      {a: fc.boolean(), equalsA: (a, b) => a === b},
    )
  })

  describe('Semigroup/monoid', () => {
    pipe(
      {
        eqv: MonoidEqv,
        every: MonoidEvery,
        some: MonoidSome,
        xor: MonoidXor,
      },
      testMonoids(fc.boolean(), (a, b) => a === b),
    )
  })
})
