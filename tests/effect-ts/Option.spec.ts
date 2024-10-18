/** Typeclass law tests for the `Option` datatype. */
import {
  Alternative,
  Applicative,
  Filterable,
  getOptionalMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {monoEquivalence, monoOrder, monoSemigroup, option} from 'effect-ts-laws'
import {RightFoldable} from 'effect-ts-laws/typeclass/data/Option'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {OptionTypeLambda} from 'effect/Option'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws<OptionTypeLambda>({
    getEquivalence: OP.getEquivalence,
    getArbitrary: option,
  })({
    Alternative,
    Applicative,
    Equivalence: OP.getEquivalence(monoEquivalence),
    Filterable,
    Monad,
    Monoid: getOptionalMonoid(monoSemigroup),
    Order: OP.getOrder(monoOrder),
    RightFoldable,
    Traversable,
  })
})
