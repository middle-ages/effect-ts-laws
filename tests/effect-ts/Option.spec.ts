/** Typeclass law tests for `Option` data type. */
import {
  Covariant,
  getOptionalMonoid,
  Invariant,
  Monad,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import * as Arbitraries from '../../src/arbitraries.js'
import {
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  testTypeclassLaws,
} from '../../src/laws.js'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws(
    {
      Equivalence: OP.getEquivalence(monoEquivalence),
      Order: OP.getOrder(monoOrder),
      Monoid: getOptionalMonoid(monoSemigroup),
      Invariant,
      Covariant,
      Monad,
    },
    {getEquivalence: OP.getEquivalence, getArbitrary: Arbitraries.option},
  )
})
