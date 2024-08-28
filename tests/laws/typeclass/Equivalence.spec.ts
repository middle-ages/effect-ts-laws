import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {checkLaws, Equivalence, testLaws, tinyInteger} from 'effect-ts-laws'

const instance = NU.Equivalence

const laws = (instance: EQ.Equivalence<number>) =>
  Equivalence({F: instance, equalsA: instance, a: tinyInteger})

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
