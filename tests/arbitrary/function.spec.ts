import {flow, Option as OP, pipe, String as STR} from 'effect'
import {
  findCounterexample,
  tinyInteger,
  unaryFromKind,
  unaryInKind,
} from '#effect-ts-laws'
import {constFalse, constTrue} from 'effect/Function'
import {isNumber} from 'effect/Number'
import {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'

describe('function', () => {
  describe('sampleUnaryEquivalence', () => {
    test('=', () => {
      expect(
        findCounterexample(tinyInteger, STR.Equivalence)(
          (a: number) => (a + a).toString(),
          (a: number) => (2 * a).toString(),
        ),
      ).toEqual(OP.none())
    })

    test('≠', () => {
      const actual = pipe(
        findCounterexample(tinyInteger, STR.Equivalence)(
          (a: number) => (a > 5 ? a : a + a).toString(),
          (a: number) => (2 * a).toString(),
        ),
        OP.match({onNone: constFalse, onSome: constTrue}),
      )

      expect(actual).toBeTruthy()
    })
  })

  test('unaryFromKind', () => {
    const arbitrary: fc.Arbitrary<(fa: OP.Option<number>) => number> =
      unaryFromKind<number, OptionTypeLambda>()(tinyInteger)

    fc.assert(fc.property(arbitrary, f => pipe(42, OP.some, f, isNumber)))
  })

  test('unaryInKind', () => {
    const arbitrary: fc.Arbitrary<OP.Option<(a: number) => number>> = pipe(
      tinyInteger,
      unaryInKind<number>()<OptionTypeLambda>(OP.some),
    )

    fc.assert(
      fc.property(
        arbitrary,
        flow(
          OP.map(constTrue),
          OP.match({onNone: constFalse, onSome: constTrue}),
        ),
      ),
    )
  })
})
