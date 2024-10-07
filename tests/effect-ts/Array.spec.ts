/** Typeclass law tests for readonly array instances. */
import {
  Applicative,
  getMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Array'
import {Array as AR} from 'effect'
import {Mono, monoEquivalence, monoOrder, tinyArray} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {ReadonlyArrayTypeLambda} from 'effect/Array'

describe('@effect/typeclass/data/Array', () => {
  testTypeclassLaws<ReadonlyArrayTypeLambda>({
    getEquivalence: AR.getEquivalence,
    getArbitrary: tinyArray,
  })({
    Equivalence: AR.getEquivalence(monoEquivalence),
    Order: AR.getOrder(monoOrder),
    Monoid: getMonoid<Mono>(),
    Applicative,
    Monad,
    Traversable,
  })
})
