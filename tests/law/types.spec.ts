import fc from 'fast-check'
import {ArbitrariesFor, LawList, LawTest} from '../../src/law.js'

describe('types', () => {
  describe('ArbitrariesFor', () => {
    test('A same argument type twice', () => {
      expectTypeOf<ArbitrariesFor<[number, number, boolean]>>().toEqualTypeOf<
        [fc.Arbitrary<number>, fc.Arbitrary<number>, fc.Arbitrary<boolean>]
      >()
    })

    test('A single argument', () => {
      expectTypeOf<ArbitrariesFor<[RegExp]>>().toEqualTypeOf<
        [fc.Arbitrary<RegExp>]
      >()
    })
  })

  describe('LawList', () => {
    test('A single law', () => {
      expectTypeOf<LawList<[[number]]>['laws']>().toEqualTypeOf<
        [LawTest<[number]>]
      >()
    })

    test('Three laws', () => {
      expectTypeOf<
        LawList<[[number, string, boolean], [RegExp], [number, string]]>['laws']
      >().toEqualTypeOf<
        [
          LawTest<[number, string, boolean]>,
          LawTest<[RegExp]>,
          LawTest<[number, string]>,
        ]
      >()
    })
  })
})
