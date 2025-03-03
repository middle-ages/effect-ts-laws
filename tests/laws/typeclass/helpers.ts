import {option, tinyArray, tinyInteger} from '#arbitrary'
import {checkLaws, LawSet} from '#law'
import {type GivenConcerns, unfoldMonomorphicGiven} from '#laws'
import {MonoidSum} from '@effect/typeclass/data/Number'
import {Number as NU} from 'effect'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {getEquivalence as optionEquivalence} from 'effect/Option'

export const numericGiven: GivenConcerns<ReadonlyArrayTypeLambda, number> =
  unfoldMonomorphicGiven({
    a: tinyInteger,
    equalsA: NU.Equivalence,
    Monoid: MonoidSum,
    getEquivalence,
    getArbitrary: tinyArray,
  })

export const numericOptionGiven = {
  ...numericGiven,
  getEquivalence: optionEquivalence,
  getArbitrary: option,
}

export const expectFailure = (laws: LawSet) => {
  expect(checkLaws(laws).length).toBeGreaterThan(0)
}

export const testFailure = (name: string, laws: LawSet) => {
  test(name, () => {
    expectFailure(laws)
  })
}
