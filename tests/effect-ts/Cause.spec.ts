/** Typeclass law tests for the `Cause` datatype. */
import {cause} from 'effect-ts-laws'
import {
  CauseTypeLambda,
  Monad,
  getEquivalence,
} from 'effect-ts-laws/typeclass/data/Cause'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'

describe('effect/Cause', () => {
  testTypeclassLaws<CauseTypeLambda>({
    getEquivalence,
    getArbitrary: cause,
  })({Monad})
})
