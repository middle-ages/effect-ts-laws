/** Typeclass law tests for the `Duration` datatype. */
import {MonoidMax, MonoidMin, MonoidSum} from '@effect/typeclass/data/Duration'
import {Duration as DU, pipe} from 'effect'
import {boundedDuration, duration} from 'effect-ts-laws'
import {testConcreteTypeclassLaws, testMonoids} from 'effect-ts-laws/vitest'
import {Equivalence, Order} from 'effect/Duration'
import fc from 'fast-check'

describe('@effect/typeclass/data/Duration', () => {
  const a = duration,
    equalsA = (a: DU.Duration, b: DU.Duration) =>
      DU.toMillis(a) === DU.toMillis(b)

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws({Equivalence, Order}, {a, equalsA})
  })

  describe('Bounded', () => {
    const [sampled] = fc.sample(boundedDuration, {numRuns: 1})
    if (sampled === undefined) throw new Error('Cannot sample')
    const [arbitrary, F] = sampled

    testConcreteTypeclassLaws({Bounded: F}, {a: arbitrary, equalsA})
  })

  describe('Semigroup/monoid', () => {
    pipe(
      {Σ: MonoidSum, min: MonoidMin, max: MonoidMax},
      testMonoids(a, equalsA),
    )
  })
})
