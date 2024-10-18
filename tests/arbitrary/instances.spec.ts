import {Effect as EF, flow, Number as NU, pipe} from 'effect'
import {getEquivalence, Monad, tinyInteger} from 'effect-ts-laws/arbitrary'
import fc from 'fast-check'

describe('arbitrary instances', () => {
  test('Monad.flatMap', () => {
    const greaterThanOne = (i: number): EF.Effect<string, Error> =>
      i > 1 ? EF.succeed('OK') : EF.fail(new Error('KO'))

    const oneThirdFail: fc.Arbitrary<EF.Effect<string, Error>> = pipe(
      fc.integer({min: 1, max: 3}),
      Monad.flatMap(flow(greaterThanOne, fc.constant)),
    )

    fc.assert(
      fc.property(oneThirdFail, effect =>
        pipe(
          effect,
          EF.match({
            onSuccess: () => true,
            onFailure: () => true,
          }),
          EF.runSync,
        ),
      ),
    )
  })

  describe('getEquivalence', () => {
    const equals = getEquivalence(NU.Equivalence)

    test('≠', () => {
      expect(
        equals(tinyInteger, Monad.map(tinyInteger, NU.multiply(2))),
      ).toBeFalsy()
    })

    test('=', () => {
      expect(equals(tinyInteger, tinyInteger)).toBeTruthy()
    })
  })
})
