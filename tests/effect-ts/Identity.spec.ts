/** Typeclass law tests for the `Identity` data type. */
import {Covariant, Invariant, Monad} from '@effect/typeclass/data/Identity'
import {identity as id} from 'effect'
import {testTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/Identity', () => {
  testTypeclassLaws(
    {Invariant, Covariant, Monad},
    {getEquivalence: id, getArbitrary: id},
  )
})
