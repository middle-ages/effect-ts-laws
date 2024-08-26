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
import {Boolean as BO, pipe} from 'effect'
import fc from 'fast-check'
import {testConcreteTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/Boolean', () => {
  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws({
      Equivalence: BO.Equivalence,
      Order: BO.Order,
    })({a: fc.boolean(), equalsA: (a: boolean, b: boolean) => a === b})
  })

  describe('Semigroup/monoid', () => {
    const options = {
      a: fc.boolean(),
      equalsA: (a: boolean, b: boolean) => a === b,
    }

    describe('Equivalence semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({Semigroup: SemigroupEqv, Monoid: MonoidEqv}),
      )
    })

    describe('Every semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({
          Semigroup: SemigroupEvery,
          Monoid: MonoidEvery,
        }),
      )
    })

    describe('Some semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({
          Semigroup: SemigroupSome,
          Monoid: MonoidSome,
        }),
      )
    })

    describe('Xor semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({
          Semigroup: SemigroupXor,
          Monoid: MonoidXor,
        }),
      )
    })
  })
})
