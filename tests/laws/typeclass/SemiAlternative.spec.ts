import {SemiAlternative as SM} from '@effect/typeclass'
import {SemiAlternative as optionSemiAlternative} from '@effect/typeclass/data/Option'
import {Number as NU, Option as OP, pipe} from 'effect'

import {checkLaws, semiAlternativeLaws, tinyInteger} from 'effect-ts-laws'
import {option as getArbitrary} from 'effect-ts-laws/arbitrary'
import {testLaws} from 'effect-ts-laws/vitest'
import {constant} from 'effect/Function'
import {getEquivalence, OptionTypeLambda} from 'effect/Option'

type Instance = SM.SemiAlternative<OptionTypeLambda>

const laws = (instance: Instance) =>
  semiAlternativeLaws({
    F: instance,
    a: tinyInteger,
    b: tinyInteger,
    c: tinyInteger,
    equalsA: NU.Equivalence,
    equalsB: NU.Equivalence,
    equalsC: NU.Equivalence,
    getEquivalence,
    getArbitrary,
  })

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
