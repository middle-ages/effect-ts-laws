/** Typeclass law tests for the `Option` datatype. */
import {monoEquivalence, monoOrder, monoMonoid, option} from '#effect-ts-laws'
import {testTypeclassLaws} from '#test'
import {RightFoldable} from '#typeclass/data/Option'
import {
  Alternative,
  Applicative,
  Filterable,
  getOptionalMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
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
    Monoid: getOptionalMonoid(monoMonoid),
    Order: OP.getOrder(monoOrder),
    RightFoldable,
    Traversable,
  })
})
