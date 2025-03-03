import {option as getArbitrary} from '#arbitrary'
import {alternativeLaws, unfoldMonoGiven} from '#laws'
import {testLaws} from '#test'
import {Alternative as AL} from '@effect/typeclass'
import {
  Alternative as optionAlternative,
  Applicative as optionApplicative,
} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {constant} from 'effect/Function'
import {getEquivalence, OptionTypeLambda} from 'effect/Option'
import {testFailure} from './helpers.js'

type Instance = AL.Alternative<OptionTypeLambda>

const laws = (instance: Instance) =>
  alternativeLaws({
    F: instance,
    ...unfoldMonoGiven<OptionTypeLambda>(getEquivalence, getArbitrary),
  })

describe('Alternative laws self-test', () => {
  describe('+applicative', () => {
    testLaws(laws(optionAlternative), {verbose: false})
  })
  describe('-applicative', () => {
    testLaws(laws({...optionAlternative, ...optionApplicative}), {
      verbose: false,
    })
  })

  testFailure(
    'unlawful instance',
    laws({...optionAlternative, coproduct: constant(OP.none())}),
  )
})
