import {Applicative as AP, Product as PD} from '@effect/typeclass'
import {
  Applicative as arrayApplicative,
  Product,
} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {Applicative, checkLaws, testLaws, tinyInteger} from 'effect-ts-laws'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import fc from 'fast-check'

type Instance = AP.Applicative<ReadonlyArrayTypeLambda>

const a = tinyInteger,
  instance = arrayApplicative,
  laws = (instance: Instance) =>
    Applicative({
      F: instance,
      a,
      b: a,
      c: a,
      equalsA: NU.Equivalence,
      equalsB: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence,
      getArbitrary: fc.array,
    })

describe('Applicative laws self-test', () => {
  testLaws(laws(instance), {verbose: false})

  test('failure: “product crops to min” breaks identity', () => {
    const product: PD.Product<ReadonlyArrayTypeLambda>['product'] = <A, B>(
      self: ReadonlyArray<A>,
      that: ReadonlyArray<B>,
    ): ReadonlyArray<[A, B]> => {
      if (AR.isEmptyReadonlyArray(self) || AR.isEmptyReadonlyArray(that))
        return AR.empty()

      const length = Math.min(self.length, that.length)
      return Product.product(self.slice(0, length), that.slice(0, length))
    }

    expect(pipe({...instance, product}, laws, checkLaws)[0]).toMatch(/identity/)
  })
})
