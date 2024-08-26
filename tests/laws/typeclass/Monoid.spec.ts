import {Monoid as MO} from '@effect/typeclass'
import {getMonoid} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import fc from 'fast-check'
import {tinyInteger} from '../../../src/arbitraries.js'
import {verboseLaws} from '../../../src/law.js'
import {Monoid} from '../../../src/laws.js'

const intArray = fc.array(tinyInteger),
  instance = getMonoid<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: MO.Monoid<readonly number[]>) =>
    Monoid({F: instance, equalsA, a: intArray})

const predicate =
  (instance: MO.Monoid<readonly number[]>) =>
  (a: readonly number[]): boolean => {
    const [leftIdentity, rightIdentity] = laws(instance).predicates
    return leftIdentity(a) && rightIdentity(a)
  }

const assertInstance = (instance: MO.Monoid<readonly number[]>) => {
  fc.assert(fc.property(intArray, predicate(instance)))
}

describe('Monoid laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Monoid pass', () => {
    assertInstance(instance)
  })

  test('Monoid fail: “non-empty zero” fails identity laws', () => {
    assert.throws(() => {
      assertInstance({...instance, empty: [1]})
    })
  })
})
