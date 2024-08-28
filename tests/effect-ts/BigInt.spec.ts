/** Typeclass law tests for `BigInt` datatype. */
import {MonoidMultiply, MonoidSum} from '@effect/typeclass/data/BigInt'
import {testMonoid} from 'effect-ts-laws'
import fc from 'fast-check'

describe('@effect/typeclass/data/BigInt', () => {
  const testBigInt = testMonoid(fc.bigInt(), (a, b) => a === b)

  describe('sum', () => {
    testBigInt(MonoidSum)
  })

  describe('multiply', () => {
    testBigInt(MonoidMultiply)
  })
})
