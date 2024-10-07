import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {checkLaws, semigroupLaws, tinyInteger} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import fc from 'fast-check'

const intArray = fc.array(tinyInteger),
  instance = getSemigroup<number>(),
  equalsA = AR.getEquivalence(NU.Equivalence),
  laws = (instance: SG.Semigroup<readonly number[]>) =>
    semigroupLaws({F: instance, equalsA, a: intArray})

describe('Semigroup laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('fail: “array intersection” is not associative', () => {
    expect(
      pipe(
        {
          combine: (a: readonly number[], b: readonly number[]) =>
            AR.intersection(a, b),
          combineMany: instance.combineMany,
        },
        laws,
        checkLaws,
      )[0],
    ).toMatch(/associativity/)
  })
})
