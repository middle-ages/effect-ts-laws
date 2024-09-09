import {Option as OP, pipe, String as STR} from 'effect'
import {sampleUnaryEquivalence, tinyInteger} from 'effect-ts-laws'
import {constFalse, constTrue} from 'effect/Function'

describe('function', () => {
  describe('sampleUnaryEquivalence', () => {
    test('=', () => {
      expect(
        sampleUnaryEquivalence(tinyInteger, STR.Equivalence)(
          (a: number) => (a + a).toString(),
          (a: number) => (2 * a).toString(),
        ),
      ).toEqual(OP.none())
    })

    test('≠', () => {
      const actual = pipe(
        sampleUnaryEquivalence(tinyInteger, STR.Equivalence, {numRuns: 1_000})(
          (a: number) => (a > 5 ? a : a + a).toString(),
          (a: number) => (2 * a).toString(),
        ),
        OP.match({onNone: constFalse, onSome: constTrue}),
      )

      expect(actual).toBeTruthy()
    })
  })
})
