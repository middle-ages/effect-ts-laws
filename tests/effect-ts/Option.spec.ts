/** Typeclass law tests for `Option` data type. */
import {
  Applicative,
  Covariant,
  getOptionalMonoid,
  Invariant,
  Monad,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  option,
  testTypeclassLaws,
} from 'effect-ts-laws'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws(
    {
      Equivalence: OP.getEquivalence(monoEquivalence),
      Order: OP.getOrder(monoOrder),
      Semigroup: getOptionalMonoid(monoSemigroup),
      Monoid: getOptionalMonoid(monoSemigroup),
      Invariant,
      Covariant,
      Applicative,
      Monad,
    },
    {getEquivalence: OP.getEquivalence, getArbitrary: option},
  )
})
