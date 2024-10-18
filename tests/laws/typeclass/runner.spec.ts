import {
  Covariant as identityCovariant,
  IdentityTypeLambda,
} from '@effect/typeclass/data/Identity'
import {identity, Number as NU} from 'effect'
import {tinyInteger} from 'effect-ts-laws'
import {
  testConcreteTypeclassLaws,
  testParameterizedTypeclassLaws,
} from 'effect-ts-laws/vitest'
import {numericGiven} from './helpers.js'

describe('typeclass test runners', () => {
  describe('testConcreteTypeclassLaw', () => {
    testConcreteTypeclassLaws(
      {Equivalence: NU.Equivalence, Order: NU.Order},
      {a: tinyInteger, equalsA: NU.Equivalence},
      {verbose: false},
    )
  })

  describe('testParametrizedTypeclassLaws', () => {
    testParameterizedTypeclassLaws<IdentityTypeLambda, number>()(
      {Covariant: identityCovariant},
      {...numericGiven, getEquivalence: identity, getArbitrary: identity},
      {verbose: false},
    )
  })
})
