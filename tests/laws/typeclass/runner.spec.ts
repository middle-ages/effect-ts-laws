import {
  Covariant as identityCovariant,
  IdentityTypeLambda,
} from '@effect/typeclass/data/Identity'
import {identity, Number as NU} from 'effect'
import {
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
  testParameterizedTypeclassLaws,
  tinyInteger,
} from 'effect-ts-laws'

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

  describe('testParametricTypeclassLaws', () => {
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
