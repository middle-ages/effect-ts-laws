import {Applicative as AP, Product as PD} from '@effect/typeclass'
import {
  Applicative as arrayApplicative,
  Product,
} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {numericGiven} from './helpers.js'

import {applicativeLaws, checkLaws} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {ReadonlyArrayTypeLambda} from 'effect/Array'

type Instance = AP.Applicative<ReadonlyArrayTypeLambda>

const instance = arrayApplicative,
  laws = (instance: Instance) => applicativeLaws({F: instance, ...numericGiven})

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
