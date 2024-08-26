/** Typeclass law tests for `Boolean` data type. */
import {
  MonoidMultiply,
  MonoidSum,
  SemigroupMultiply,
  SemigroupSum,
} from '@effect/typeclass/data/BigInt'
import {pipe} from 'effect'
import fc from 'fast-check'
import {testConcreteTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/BigInt', () => {
  const options = {a: fc.bigInt(), equalsA: (a: bigint, b: bigint) => a === b}

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
})
