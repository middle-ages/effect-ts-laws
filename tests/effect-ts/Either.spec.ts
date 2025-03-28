/** Typeclass law tests for the `Either` datatype. */
import {
  Applicative,
  Bicovariant,
  Foldable,
  Monad,
  SemiAlternative,
  Traversable,
} from '@effect/typeclass/data/Either'
import {Either as EI, String as STR} from 'effect'
import {
  either,
  LiftArbitrary,
  LiftEquivalence,
  monoEquivalence,
} from '#effect-ts-laws'
import {testTypeclassLaws} from '#test'
import {EitherTypeLambda} from 'effect/Either'
import fc from 'fast-check'

describe('@effect/typeclass/data/Either', () => {
  const getEquivalence: LiftEquivalence<
    EitherTypeLambda,
    never,
    unknown,
    string
  > = equivalenceO =>
    EI.getEquivalence({left: STR.Equivalence, right: equivalenceO})

  const getArbitrary: LiftArbitrary<
    EitherTypeLambda,
    never,
    unknown,
    string
  > = arbitraryA => either(fc.string(), arbitraryA)
  testTypeclassLaws({getEquivalence, getArbitrary})({
    Applicative,
    Bicovariant,
    Equivalence: getEquivalence(monoEquivalence),
    Foldable,
    Monad,
    SemiAlternative,
    Traversable,
  })
})
