/** Typeclass law tests for the `Record` datatype. */
import {Covariant, Traversable} from '@effect/typeclass/data/Record'
import {Record as RC} from 'effect'
import {monoEquivalence, stringKeyRecord} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {ReadonlyRecordTypeLambda} from 'effect/Record'

describe('@effect/typeclass/data/Record', () => {
  testTypeclassLaws<ReadonlyRecordTypeLambda>({
    getEquivalence: RC.getEquivalence,
    getArbitrary: stringKeyRecord,
  })({
    Equivalence: RC.getEquivalence(monoEquivalence),
    Covariant,
    Traversable,
  })
})
