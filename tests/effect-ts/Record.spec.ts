/** Typeclass law tests for the `Record` datatype. */
import {
  Covariant,
  Filterable,
  getMonoidUnion,
  getSemigroupIntersection,
  Traversable,
} from '@effect/typeclass/data/Record'
import {Record as RC} from 'effect'
import {
  monoEquivalence,
  monoMonoid,
  monoRecordArbitrary,
  monoRecordEquivalence,
  stringKeyRecord,
} from 'effect-ts-laws'
import {
  testMonoid,
  testSemigroup,
  testTypeclassLaws,
} from 'effect-ts-laws/vitest'
import {ReadonlyRecordTypeLambda} from 'effect/Record'

describe('@effect/typeclass/data/Record', () => {
  testTypeclassLaws<ReadonlyRecordTypeLambda>({
    getEquivalence: RC.getEquivalence,
    getArbitrary: stringKeyRecord,
  })({
    Equivalence: RC.getEquivalence(monoEquivalence),
    Covariant,
    Filterable,
    Traversable,
  })

  testMonoid(monoRecordArbitrary, monoRecordEquivalence)(
    getMonoidUnion(monoMonoid),
    'union',
  )

  testSemigroup(monoRecordArbitrary, monoRecordEquivalence)(
    getSemigroupIntersection(monoMonoid),
    'intersection',
  )
})
