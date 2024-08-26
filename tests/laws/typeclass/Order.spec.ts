import {Number as NU, Order as OD, pipe} from 'effect'
import {Order, tinyInteger, verboseLaws} from 'effect-ts-laws'
import fc from 'fast-check'

const instance = NU.Order,
  equalsA = NU.Equivalence,
  laws = (instance: OD.Order<number>) =>
    Order({F: instance, equalsA, a: tinyInteger})

const predicate =
  (instance: OD.Order<number>) =>
  (a: number, b: number, c: number): boolean => {
    const [transitivity, antisymmetry, reflexivity, connectivity] =
      laws(instance).predicates

    return (
      transitivity(a, b, c) &&
      antisymmetry(a, b) &&
      reflexivity(a) &&
      connectivity(a, b)
    )
  }

const assertInstance = (instance: OD.Order<number>) => {
  fc.assert(
    fc.property(tinyInteger, tinyInteger, tinyInteger, predicate(instance)),
  )
}

describe('Order laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Order pass', () => {
    assertInstance(instance)
  })

  describe('Order failure', () => {
    test('“less than” is not symmetric', () => {
      assert.throws(() => {
        assertInstance((a, b) => (a < b ? -1 : 1))
      })
    })
  })
})
