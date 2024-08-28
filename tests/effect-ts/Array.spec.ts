/** Typeclass law tests for readonly array instances. */
import {
  Applicative,
  getMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Array'
import {Array as AR} from 'effect'
import {
  Mono,
  monoEquivalence,
  monoOrder,
  testTypeclassLaws,
} from 'effect-ts-laws'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import fc from 'fast-check'

describe('@effect/typeclass/data/Array', () => {
  testTypeclassLaws<ReadonlyArrayTypeLambda>({
    getEquivalence: AR.getEquivalence,
    getArbitrary: arb => fc.array(arb, {maxLength: 4}),
  })({
    Equivalence: AR.getEquivalence(monoEquivalence),
    Order: AR.getOrder(monoOrder),
    Monoid: getMonoid<Mono>(),
    Applicative,
    Monad,
    Traversable,
  })
})
