import {Number as NU, Order as OD, pipe} from 'effect'
import {checkLaws, Order, testLaws, tinyInteger} from 'effect-ts-laws'

const instance = NU.Order,
  equalsA = NU.Equivalence,
  laws = (instance: OD.Order<number>) =>
    Order({F: instance, equalsA, a: tinyInteger})

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
