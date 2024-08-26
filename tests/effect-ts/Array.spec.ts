/** Typeclass law tests for readonly array instances. */
import {
  Applicative,
  Covariant,
  getMonoid,
  getSemigroup,
  Invariant,
  Monad,
} from '@effect/typeclass/data/Array'
import {Array as AR} from 'effect'
import {
  Mono,
  monoEquivalence,
  monoOrder,
  testTypeclassLaws,
} from 'effect-ts-laws'
import fc from 'fast-check'

describe('@effect/typeclass/data/Array', () => {
  testTypeclassLaws(
    {
      Equivalence: AR.getEquivalence(monoEquivalence),
      Order: AR.getOrder(monoOrder),
      Semigroup: getSemigroup<Mono>(),
      Monoid: getMonoid<Mono>(),
      Invariant,
      Covariant,
      Applicative,
      Monad,
    },
    {getEquivalence: AR.getEquivalence, getArbitrary: fc.array},
  )
})
