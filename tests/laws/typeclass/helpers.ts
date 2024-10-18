import {MonoidSum} from '@effect/typeclass/data/Number'
import {Number as NU} from 'effect'
import {
  GivenConcerns,
  option,
  tinyArray,
  tinyInteger,
  unfoldGivenConcerns,
} from 'effect-ts-laws'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {getEquivalence as optionEquivalence} from 'effect/Option'

export const numericGiven: GivenConcerns<ReadonlyArrayTypeLambda, number> = {
  ...unfoldGivenConcerns(tinyInteger, NU.Equivalence),
  Monoid: MonoidSum,
  getEquivalence,
  getArbitrary: tinyArray,
}

export const numericOptionGiven = {
  ...numericGiven,
  getEquivalence: optionEquivalence,
  getArbitrary: option,
}
