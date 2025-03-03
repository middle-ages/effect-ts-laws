import {tinyInteger} from '#arbitrary'
import {semigroupLaws} from '#laws'
import {testLaws} from '#test'
import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import fc from 'fast-check'
import {testFailure} from './helpers.js'

const intArray = fc.array(tinyInteger),
  instance = getSemigroup<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: SG.Semigroup<readonly number[]>) =>
    semigroupLaws({F: instance, equalsA, a: intArray})

describe('Semigroup laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    'fail: “array intersection” is not associative',
    laws({
      combine: (a: readonly number[], b: readonly number[]) =>
        AR.intersection(a, b),
      combineMany: instance.combineMany,
    }),
  )
})
