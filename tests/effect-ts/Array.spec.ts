/** Typeclass law tests for readonly array instances. */
import {
  Covariant,
  getMonoid,
  getSemigroup,
  Invariant,
  Monad,
} from '@effect/typeclass/data/Array'
import {Array as AR} from 'effect'
import fc from 'fast-check'
import {
  Mono,
  monoEquivalence,
  monoOrder,
  testTypeclassLaws,
} from '../../src/laws.js'

describe('@effect/typeclass/data/Array', () => {
  testTypeclassLaws(
    {
      Equivalence: AR.getEquivalence(monoEquivalence),
      Order: AR.getOrder(monoOrder),
      Semigroup: getSemigroup<Mono>(),
      Monoid: getMonoid<Mono>(),
      Invariant,
      Covariant,
      Monad,
    },
    {getEquivalence: AR.getEquivalence, getArbitrary: fc.array},
  )
})
