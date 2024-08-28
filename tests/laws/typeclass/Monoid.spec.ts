import {Monoid as MO} from '@effect/typeclass'
import {getMonoid} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {checkLaws, Monoid, testLaws, tinyInteger} from 'effect-ts-laws'
import fc from 'fast-check'

const intArray = fc.array(tinyInteger),
  instance = getMonoid<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: MO.Monoid<readonly number[]>) =>
    Monoid({F: instance, equalsA, a: intArray})

describe('Monoid laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('fail: “non-empty zero” fails left-identity law', () => {
    expect(pipe({...instance, empty: [1]}, laws, checkLaws)[0]).toMatch(
      /leftIdentity/,
    )
  })
})
