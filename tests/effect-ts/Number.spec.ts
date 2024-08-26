/** Typeclass law tests for `Boolean` data type. */
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
import {Number as NU, pipe} from 'effect'
import {tinyInteger} from '../../src/arbitraries.js'
import {testConcreteTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/Number', () => {
  const options = {a: tinyInteger, equalsA: (a: number, b: number) => a === b}

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws({
      Equivalence: NU.Equivalence,
      Order: NU.Order,
    })(options)
  })

  describe('Semigroup/monoid', () => {
    describe('Sum semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({Semigroup: SemigroupSum, Monoid: MonoidSum}),
      )
    })

    describe('Multiply semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({
          Semigroup: SemigroupMultiply,
          Monoid: MonoidMultiply,
        }),
      )
    })

    describe('Minimum semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({Semigroup: SemigroupMin, Monoid: MonoidMin}),
      )
    })

    describe('Maximum semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({Semigroup: SemigroupMax, Monoid: MonoidMax}),
      )
    })
  })
})
