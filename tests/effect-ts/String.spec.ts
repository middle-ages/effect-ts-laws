/** Typeclass law tests for the `String` datatype. */
import {Monoid} from '@effect/typeclass/data/String'
import {String as STR} from 'effect'
import {testConcreteTypeclassLaws} from 'effect-ts-laws'
import {Equivalence} from 'effect/String'
import fc from 'fast-check'

describe('@effect/typeclass/data/String', () => {
  testConcreteTypeclassLaws(
    {Monoid, Equivalence},
    {
      a: fc.string(),
      equalsA: STR.Equivalence,
    },
  )
})
