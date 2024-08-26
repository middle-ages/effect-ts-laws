/** Typeclass law tests for `BigInt` data type. */
import {
  MonoidMultiply,
  MonoidSum,
  SemigroupMultiply,
  SemigroupSum,
} from '@effect/typeclass/data/BigInt'
import {testMonoid} from 'effect-ts-laws'
import fc from 'fast-check'

describe('@effect/typeclass/data/BigInt', () => {
  const testBigInt = testMonoid(fc.bigInt(), (a, b) => a === b)

  describe('sum', () => {
    testBigInt(MonoidSum, SemigroupSum)
  })

  describe('multiply', () => {
    testBigInt(MonoidMultiply, SemigroupMultiply)
  })
})
