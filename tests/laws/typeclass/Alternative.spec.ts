import {Alternative as AL} from '@effect/typeclass'
import {
  Alternative as optionAlternative,
  Applicative as optionApplicative,
} from '@effect/typeclass/data/Option'
import {Option as OP, pipe} from 'effect'

import {
  alternativeLaws,
  checkLaws,
  option as getArbitrary,
  unfoldMonoGiven,
} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {constant} from 'effect/Function'
import {getEquivalence, OptionTypeLambda} from 'effect/Option'

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

  test('unlawful instance', () => {
    const instance: Instance = {
      ...optionAlternative,
      coproduct: constant(OP.none()),
    }
    expect(pipe(instance, laws, checkLaws).length).toBeGreaterThan(0)
  })
})
