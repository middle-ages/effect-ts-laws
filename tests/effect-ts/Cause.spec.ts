/** Typeclass law tests for the `Cause` datatype. */
import {cause} from '#effect-ts-laws'
import {CauseTypeLambda, Monad, getEquivalence} from '#typeclass/data/Cause'
import {testTypeclassLaws} from '#test'

describe('effect/Cause', () => {
  testTypeclassLaws<CauseTypeLambda>({
    getEquivalence,
    getArbitrary: cause,
  })({Monad})
})
