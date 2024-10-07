import {Monad} from '@effect/typeclass/data/Option'
import {Boolean as BO, Number as NU, String as STR} from 'effect'
import {option, tinyInteger} from 'effect-ts-laws/arbitrary'
import {testTypeclassLawsFor} from 'effect-ts-laws/vitest'
import {getEquivalence, OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'

describe('testTypeclassLawsFor', () => {
  const instances = {Monad}

  testTypeclassLawsFor<
    OptionTypeLambda,
    typeof instances,
    number,
    string,
    boolean
  >(instances, {
    a: tinyInteger,
    b: fc.string(),
    c: fc.boolean(),
    equalsA: NU.Equivalence,
    equalsB: STR.Equivalence,
    equalsC: BO.Equivalence,
    getArbitrary: option,
    getEquivalence,
  })
})
