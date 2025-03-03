import {tinyInteger} from '#arbitrary'
import {equivalenceLaws} from '#laws'
import {testLaws} from '#test'
import {Equivalence as EQ, Number as NU, pipe} from 'effect'
import {testFailure} from './helpers.js'

const instance = NU.Equivalence

const laws = (instance: EQ.Equivalence<number>) =>
  equivalenceLaws({F: instance, equalsA: instance, a: tinyInteger})

describe('Equivalence laws self-test', () => {
  pipe(instance, laws, testLaws)

  describe('failure', () => {
    testFailure('“less than” is not symmetric', laws(NU.lessThan))
    testFailure(
      '“sum > 0” is not transitive',
      laws((a, b) => a + b > 0),
    )
  })
})
