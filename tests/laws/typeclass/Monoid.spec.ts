import {monoidLaws, tinyInteger} from '#effect-ts-laws'
import {testLaws} from '#test'
import {Monoid as MO} from '@effect/typeclass'
import {getMonoid} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import fc from 'fast-check'
import {testFailure} from './helpers.js'

const intArray = fc.array(tinyInteger),
  instance = getMonoid<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: MO.Monoid<readonly number[]>) =>
    monoidLaws({F: instance, equalsA, a: intArray})

describe('Monoid laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    'fail: “non-empty zero” fails left-identity law',
    laws({...instance, empty: [1]}),
  )
})
