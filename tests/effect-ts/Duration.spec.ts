/** Typeclass law tests for `Duration` datatype. */
import {MonoidMax, MonoidMin, MonoidSum} from '@effect/typeclass/data/Duration'
import {Duration as DU} from 'effect'
import {duration, testConcreteTypeclassLaws, testMonoid} from 'effect-ts-laws'

describe('@effect/typeclass/data/Number', () => {
  const a = duration(),
    equalsA = (a: DU.Duration, b: DU.Duration) =>
      DU.toMillis(a) === DU.toMillis(b)

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws(
      {
        Equivalence: DU.Equivalence,
        Order: DU.Order,
      },
      {a, equalsA},
    )
  })

  describe('Semigroup/monoid', () => {
    const testDuration = testMonoid<DU.Duration>(a, equalsA)

    describe('sum', () => {
      testDuration(MonoidSum)
    })

    describe('min', () => {
      testDuration(MonoidMin)
    })

    describe('max', () => {
      testDuration(MonoidMax)
    })
  })
})
