import {testTypeclassLaws} from '#test'
import {Covariant as ArrayCovariant} from '@effect/typeclass/data/Array'
import {
  getEquivalence as getArrayEquivalence,
  ReadonlyArrayTypeLambda,
} from 'effect/Array'
import {tinyArray} from '../../../src/arbitrary.js'

describe('Array covariant laws with underlyingProps', () => {
  testTypeclassLaws.underlyingProps<ReadonlyArrayTypeLambda>({
    getArbitrary: tinyArray,
    getEquivalence: getArrayEquivalence,
  })({
    Covariant: ArrayCovariant,
  })
})
