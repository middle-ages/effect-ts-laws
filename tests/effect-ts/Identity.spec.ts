/** Typeclass law tests for the `Identity` data type. */
import {
  Applicative,
  Covariant,
  Invariant,
  Monad,
} from '@effect/typeclass/data/Identity'
import {identity as id} from 'effect'
import {testTypeclassLaws} from 'effect-ts-laws'

describe('@effect/typeclass/data/Identity', () => {
  testTypeclassLaws(
    {Invariant, Covariant, Monad, Applicative},
    {getEquivalence: id, getArbitrary: id},
  )
})
