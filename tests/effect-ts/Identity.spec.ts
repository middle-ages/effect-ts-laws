/** Typeclass law tests for the `Identity` datatype. */
import {SemiAlternative as SA} from '@effect/typeclass'
import {
  Applicative,
  Foldable,
  getSemiAlternative,
  IdentityTypeLambda,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Identity'
import {identity as id} from 'effect'
import {monoSemigroup} from '#effect-ts-laws'
import {testTypeclassLaws} from '#test'

describe('@effect/typeclass/data/Identity', () => {
  testTypeclassLaws<IdentityTypeLambda>({getEquivalence: id, getArbitrary: id})(
    {
      Applicative,
      Foldable,
      Monad,
      Traversable,
      SemiAlternative: getSemiAlternative(
        monoSemigroup,
      ) as SA.SemiAlternative<IdentityTypeLambda>,
    },
  )
})
