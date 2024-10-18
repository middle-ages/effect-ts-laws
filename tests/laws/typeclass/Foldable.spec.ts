import {Foldable as FO, Monoid as MO} from '@effect/typeclass'
import {
  Foldable as arrayFoldable,
  getMonoid,
} from '@effect/typeclass/data/Array'
import {MonoidSum} from '@effect/typeclass/data/Number'
import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {
  foldableLaws,
  tinyArray as getArbitrary,
  monoArbitrary,
  monoEquivalence,
  tinyInteger,
  unfoldGivenConcerns,
} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import fc from 'fast-check'

type Instance = FO.Foldable<ReadonlyArrayTypeLambda>

const instance: Instance = arrayFoldable

const buildLaws =
  <A>(Monoid: MO.Monoid<A>, a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>) =>
  (instance: Instance) =>
    foldableLaws({
      F: instance,
      ...unfoldGivenConcerns(a, equalsA),
      getEquivalence,
      getArbitrary,
      Monoid,
    })

describe('Foldable laws self-test', () => {
  describe('on number', () => {
    pipe(instance, buildLaws(MonoidSum, tinyInteger, NU.Equivalence), testLaws)
  })

  describe('on readonly number[]', () => {
    pipe(
      instance,
      buildLaws(getMonoid<number>(), monoArbitrary, monoEquivalence),
      testLaws,
    )
  })
})
