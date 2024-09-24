/** Typeclass law tests for `Number` datatype. */
import {
  MonoidMax,
  MonoidMin,
  MonoidMultiply,
  MonoidSum,
} from '@effect/typeclass/data/Number'
import {Number as NU, pipe} from 'effect'
import {
  testConcreteTypeclassLaws,
  testMonoids,
  tinyInteger,
} from 'effect-ts-laws'

describe('@effect/typeclass/data/Number', () => {
  const a = tinyInteger,
    equalsA = (a: number, b: number) => a === b

  describe('Equivalence/order', () => {
    testConcreteTypeclassLaws(
      {Equivalence: NU.Equivalence, Order: NU.Order},
      {a, equalsA},
    )
  })

  describe('Semigroup/monoid', () => {
    pipe(
      {
        Σ: MonoidSum,
        Π: MonoidMultiply,
        min: MonoidMin,
        max: MonoidMax,
      },
      testMonoids(a, equalsA),
    )
  })
})
