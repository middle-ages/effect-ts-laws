/** Typeclass law tests for `Either` data type. */
import {Covariant, Invariant, Monad} from '@effect/typeclass/data/Either'
import {Either as EI, String as STR} from 'effect'
import {EitherTypeLambda} from 'effect/Either'
import fc from 'fast-check'
import * as Arbitraries from '../../src/arbitraries.js'
import {GetArbitrary, GetEquivalence} from '../../src/law.js'
import {monoEquivalence, testTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/Either', () => {
  const getEquivalence: GetEquivalence<
    EitherTypeLambda,
    never,
    unknown,
    string
  > = equivalenceO =>
    EI.getEquivalence({left: STR.Equivalence, right: equivalenceO})

  const getArbitrary: GetArbitrary<
    EitherTypeLambda,
    never,
    unknown,
    string
  > = arbitraryA => Arbitraries.either(fc.string(), arbitraryA)

  testTypeclassLaws<EitherTypeLambda, never, unknown, string>(
    {
      Equivalence: getEquivalence(monoEquivalence),
      Invariant,
      Covariant,
      Monad,
    },
    {getEquivalence, getArbitrary},
  )
})
