import {SemiAlternative as SM} from '@effect/typeclass'
import {SemiAlternative as optionSemiAlternative} from '@effect/typeclass/data/Option'
import {Option as OP, pipe} from 'effect'
import {checkLaws, semiAlternativeLaws} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {constant} from 'effect/Function'
import {OptionTypeLambda} from 'effect/Option'
import {numericOptionGiven} from './helpers.js'

type Instance = SM.SemiAlternative<OptionTypeLambda>

const laws = (instance: Instance) =>
  semiAlternativeLaws({F: instance, ...numericOptionGiven})

describe('SemiAlternative laws self-test', () => {
  pipe(optionSemiAlternative, laws, testLaws)

  test('unlawful instance', () => {
    const instance: Instance = {
      ...optionSemiAlternative,
      coproduct: constant(OP.none()),
    }
    expect(pipe(instance, laws, checkLaws).length).toBeGreaterThan(0)
  })
})
