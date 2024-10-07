import {Number as NU, Order as OD, pipe} from 'effect'
import {checkLaws, orderLaws, tinyInteger} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'

const instance = NU.Order,
  equalsA = NU.Equivalence,
  laws = (instance: OD.Order<number>) =>
    orderLaws({F: instance, equalsA, a: tinyInteger})

describe('Order laws self-test', () => {
  pipe(instance, laws, testLaws)

  describe('failure', () => {
    test('“less than” is not symmetric', () => {
      expect(
        pipe((a: number, b: number) => (a < b ? -1 : 1), laws, checkLaws)[0],
      ).toMatch(/reflexivity/)
    })
  })
})
