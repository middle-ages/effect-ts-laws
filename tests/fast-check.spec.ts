/** Typeclass law tests for the fast-check `Arbitrary` datatype. */
import {
  ArbitraryTypeLambda,
  getEquivalence,
  Monad,
  monoEquivalence,
} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import fc from 'fast-check'

describe('fast-check Arbitrary datatype typeclass laws', () => {
  testTypeclassLaws<ArbitraryTypeLambda>({
    getEquivalence: equalsA => getEquivalence(equalsA),
    getArbitrary: fc.constant,
  })({
    Equivalence: getEquivalence(monoEquivalence),
    Monad,
  })
})
