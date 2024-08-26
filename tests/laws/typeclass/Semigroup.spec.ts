import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {Semigroup, tinyInteger, verboseLaws} from 'effect-ts-laws'
import fc from 'fast-check'

const intArray = fc.array(tinyInteger),
  instance = getSemigroup<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: SG.Semigroup<readonly number[]>) =>
    Semigroup({F: instance, equalsA, a: intArray})

const predicate =
  (instance: SG.Semigroup<readonly number[]>) =>
  (
    a: readonly number[],
    b: readonly number[],
    c: readonly number[],
  ): boolean => {
    const [associativity, combineManyAssociativity] = laws(instance).predicates
    return associativity(a, b, c) && combineManyAssociativity(a, b, c)
  }

const assertInstance = (instance: SG.Semigroup<readonly number[]>) => {
  fc.assert(fc.property(intArray, intArray, intArray, predicate(instance)))
}

describe('Semigroup laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Semigroup pass', () => {
    assertInstance(instance)
  })

  test('Semigroup fail: “array intersection” is not associative', () => {
    assert.throws(() => {
      assertInstance({
        combine: (a: readonly number[], b: readonly number[]) =>
          AR.intersection(a, b),
        combineMany: instance.combineMany,
      })
    })
  })
})
