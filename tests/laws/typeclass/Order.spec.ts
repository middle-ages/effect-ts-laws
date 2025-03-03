import {tinyInteger} from '#arbitrary'
import {orderLaws} from '#laws'
import {testLaws} from '#test'
import {Number as NU, Order as OD, pipe} from 'effect'
import {testFailure} from './helpers.js'

const instance = NU.Order,
  equalsA = NU.Equivalence,
  laws = (instance: OD.Order<number>) =>
    orderLaws({F: instance, equalsA, a: tinyInteger})

describe('Order laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    '“less than” is not symmetric',
    laws((a, b) => (a < b ? -1 : 1)),
  )
})
