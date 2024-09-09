/** Typeclass law tests for the `Option` datatype. */
import {
  Applicative,
  getOptionalMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  option,
  testTypeclassLaws,
} from 'effect-ts-laws'
import {OptionTypeLambda} from 'effect/Option'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws<OptionTypeLambda>({
    getEquivalence: OP.getEquivalence,
    getArbitrary: option,
  })({
    Equivalence: OP.getEquivalence(monoEquivalence),
    Order: OP.getOrder(monoOrder),
    Monoid: getOptionalMonoid(monoSemigroup),
    Applicative,
    Monad,
    Traversable,
  })
})
