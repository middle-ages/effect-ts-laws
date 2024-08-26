/** Typeclass law tests for `Predicate` data type. */
import {Monoid, Semigroup} from '@effect/typeclass/data/String'
import {pipe, String as STR} from 'effect'
import {Equivalence} from 'effect/String'
import fc from 'fast-check'
import {testConcreteTypeclassLaws} from '../../src/laws.js'

describe('@effect/typeclass/data/String', () => {
  pipe(
    {
      a: fc.string(),
      equalsA: STR.Equivalence,
    },

    testConcreteTypeclassLaws({Semigroup, Monoid, Equivalence}),
  )
})
