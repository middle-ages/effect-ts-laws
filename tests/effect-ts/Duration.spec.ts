/** Typeclass law tests for `Boolean` data type. */
import {
  MonoidMax,
  MonoidMin,
  MonoidSum,
  SemigroupMax,
  SemigroupMin,
  SemigroupSum,
} from '@effect/typeclass/data/Duration'
import {Duration as DU, pipe} from 'effect'
import fc from 'fast-check'
import {testConcreteTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/Number', () => {
  const options = {
    a: fc.integer().map(i => DU.millis(i)),
    equalsA: (a: DU.Duration, b: DU.Duration) =>
      DU.toMillis(a) === DU.toMillis(b),
  }

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws({
      Equivalence: DU.Equivalence,
      Order: DU.Order,
    })(options)
  })

  describe('Semigroup/monoid', () => {
    describe('Sum semigroup/monoid', () => {
      pipe(
        options,
        testConcreteTypeclassLaws({Semigroup: SemigroupSum, Monoid: MonoidSum}),
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
