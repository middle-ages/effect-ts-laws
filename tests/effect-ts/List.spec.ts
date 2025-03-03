/** Typeclass law tests for the `effect-ts` linked-list type. */
import {list as getArbitrary, monoEquivalence} from '#effect-ts-laws'
import {testTypeclassLaws} from '#test'
import {ListTypeLambda, Monad, RightFoldable} from '#typeclass/data/List'
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
