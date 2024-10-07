import {
  Covariant as identityCovariant,
  IdentityTypeLambda,
} from '@effect/typeclass/data/Identity'
import {identity, Number as NU} from 'effect'
import {tinyInteger} from 'effect-ts-laws'
import {
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
  testParameterizedTypeclassLaws,
} from 'effect-ts-laws/vitest'

describe('typeclass test runners', () => {
  describe('testConcreteTypeclassLaw', () => {
    testConcreteTypeclassLaw('Equivalence')(
      {a: tinyInteger, equalsA: NU.Equivalence, F: NU.Equivalence},
      {verbose: false},
    )
  })

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
      {
        a: tinyInteger,
        b: tinyInteger,
        c: tinyInteger,
        equalsA: NU.Equivalence,
        equalsB: NU.Equivalence,
        equalsC: NU.Equivalence,
        getEquivalence: identity,
        getArbitrary: identity,
      },
      {verbose: false},
    )
  })
})
