import {tinyArray as getArbitrary, tinyInteger} from '#arbitrary'
import {
  foldableLaws,
  monoArbitrary,
  monoEquivalence,
  unfoldMonomorphicGiven,
} from '#laws'
import {testLaws} from '#test'
import {Foldable as FO, Monoid as MO} from '@effect/typeclass'
import {
  Foldable as arrayFoldable,
  getMonoid,
} from '@effect/typeclass/data/Array'
import {MonoidSum} from '@effect/typeclass/data/Number'
import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import fc from 'fast-check'

type Instance = FO.Foldable<ReadonlyArrayTypeLambda>

const instance: Instance = arrayFoldable

const buildLaws =
  <A>(Monoid: MO.Monoid<A>, a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>) =>
  (instance: Instance) =>
    foldableLaws({
      ...unfoldMonomorphicGiven<ReadonlyArrayTypeLambda, A>({
        a,
        equalsA,
        getArbitrary,
        getEquivalence,
        Monoid,
      }),
      F: instance,
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
