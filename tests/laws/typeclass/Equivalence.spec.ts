import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {Equivalence, tinyInteger, verboseLaws} from 'effect-ts-laws'
import fc from 'fast-check'

const instance = NU.Equivalence,
  laws = (instance: EQ.Equivalence<number>) =>
    Equivalence({F: instance, equalsA: instance, a: tinyInteger})

const predicate =
  (instance: EQ.Equivalence<number>) =>
  (a: number, b: number, c: number): boolean => {
    const [transitivity, symmetry, reflexivity] = laws(instance).predicates
    return transitivity(a, b, c) && symmetry(a, b) && reflexivity(a)
  }

const assertInstance = (instance: EQ.Equivalence<number>) => {
  fc.assert(
    fc.property(tinyInteger, tinyInteger, tinyInteger, predicate(instance)),
  )
}

describe('Equivalence laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Equivalence pass', () => {
    assertInstance(NU.Equivalence)
  })

  describe('Equivalence failure', () => {
    test('“less than” is not symmetric', () => {
      assert.throws(() => {
        assertInstance(NU.lessThan)
      })
    })

    test('“sum is positive” is not transitive', () => {
      assert.throws(() => {
        assertInstance((a, b) => a + b > 0)
      })
    })
  })
})
