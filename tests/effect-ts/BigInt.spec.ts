/** Typeclass law tests for `BigInt` datatype. */
import {MonoidMultiply, MonoidSum} from '@effect/typeclass/data/BigInt'
import {pipe} from 'effect'
import {testMonoids} from 'effect-ts-laws'
import fc from 'fast-check'

describe('@effect/typeclass/data/BigInt', () => {
  describe('Semigroup/monoid', () => {
    pipe(
      {'+': MonoidSum, '⨯': MonoidMultiply},
      testMonoids(fc.bigInt(), (a, b) => a === b),
    )
  })
})
