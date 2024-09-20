/** Typeclass law tests for the `Duration` datatype. */
import {MonoidMax, MonoidMin, MonoidSum} from '@effect/typeclass/data/Duration'
import {Duration as DU, pipe} from 'effect'
import {duration, testConcreteTypeclassLaws, testMonoids} from 'effect-ts-laws'
import {Equivalence, Order} from 'effect/Duration'

describe('@effect/typeclass/data/Number', () => {
  const a = duration(),
    equalsA = (a: DU.Duration, b: DU.Duration) =>
      DU.toMillis(a) === DU.toMillis(b)

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws({Equivalence, Order}, {a, equalsA})
  })

  describe('Semigroup/monoid', () => {
    pipe(
      {'+': MonoidSum, min: MonoidMin, max: MonoidMax},
      testMonoids(a, equalsA),
    )
  })
})
