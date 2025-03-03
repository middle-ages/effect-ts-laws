import {semiAlternativeLaws} from '#laws'
import {testLaws} from '#test'
import {SemiAlternative as SM} from '@effect/typeclass'
import {SemiAlternative as optionSemiAlternative} from '@effect/typeclass/data/Option'
import {Option as OP, pipe} from 'effect'
import {constant} from 'effect/Function'
import {OptionTypeLambda} from 'effect/Option'
import {numericOptionGiven, testFailure} from './helpers.js'

type Instance = SM.SemiAlternative<OptionTypeLambda>

const laws = (instance: Instance) =>
  semiAlternativeLaws({F: instance, ...numericOptionGiven})

describe('SemiAlternative laws self-test', () => {
  pipe(optionSemiAlternative, laws, testLaws)

  testFailure(
    'unlawful instance',
    laws({...optionSemiAlternative, coproduct: constant(OP.none())}),
  )
})
