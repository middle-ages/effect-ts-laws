/** Typeclass law tests for the `effect-ts` linked-list type. */
import {list as getArbitrary, monoEquivalence} from 'effect-ts-laws'
import {
  ListTypeLambda,
  Monad,
  RightFoldable,
} from 'effect-ts-laws/typeclass/data/List'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {getEquivalence} from 'effect/List'

describe('effect/List', () => {
  testTypeclassLaws<ListTypeLambda>({
    getEquivalence,
    getArbitrary,
  })({
    Equivalence: getEquivalence(monoEquivalence),
    Monad,
    RightFoldable,
  })
})
