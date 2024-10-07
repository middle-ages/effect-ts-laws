import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {checkLaws, equivalenceLaws, tinyInteger} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'

const instance = NU.Equivalence

const laws = (instance: EQ.Equivalence<number>) =>
  equivalenceLaws({F: instance, equalsA: instance, a: tinyInteger})

describe('Equivalence laws self-test', () => {
  pipe(instance, laws, testLaws)

  describe('failure', () => {
    test('“less than” is not symmetric', () => {
      expect(pipe(NU.lessThan, laws, checkLaws)[0]).toMatch(/symmetry/)
    })

    test('“sum > 0” is not transitive', () => {
      expect(
        pipe((a: number, b: number) => a + b > 0, laws, checkLaws)[0],
      ).toMatch(/transitivity/)
    })
  })
})
