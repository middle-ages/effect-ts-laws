import {Effect as EF, flow, pipe} from 'effect'
import {Monad} from 'effect-ts-laws/arbitrary'
import fc from 'fast-check'

describe('arbitrary Monad instance', () => {
  test('flatMap', () => {
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
})
