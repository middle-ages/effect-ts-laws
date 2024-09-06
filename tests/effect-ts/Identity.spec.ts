/** Typeclass law tests for the `Identity` datatype. */
import {
  Applicative,
  IdentityTypeLambda,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Identity'
import {identity as id} from 'effect'
import {testTypeclassLaws} from 'effect-ts-laws'

describe('@effect/typeclass/data/Identity', () => {
  testTypeclassLaws<IdentityTypeLambda>({getEquivalence: id, getArbitrary: id})(
    {Applicative, Monad, Traversable},
  )
})
