/** Typeclass law tests for the `BigInt` datatype. */
import {MonoidMultiply, MonoidSum} from '@effect/typeclass/data/BigInt'
import {pipe} from 'effect'
import {testMonoids} from 'effect-ts-laws/vitest'
import fc from 'fast-check'

describe('@effect/typeclass/data/BigInt', () => {
  describe('Semigroup/monoid', () => {
    pipe(
      {Σ: MonoidSum, Π: MonoidMultiply},
      testMonoids(fc.bigInt(), (a, b) => a === b),
    )
  })
})
