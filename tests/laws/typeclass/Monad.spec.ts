import {Monad as MD} from '@effect/typeclass'
import {Monad as arrayMonad} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual, flow} from 'effect/Function'
import fc from 'fast-check'
import {tinyInteger} from '../../../src/arbitraries.js'
import {verboseLaws} from '../../../src/law.js'
import {Monad} from '../../../src/laws.js'

type Instance = MD.Monad<ReadonlyArrayTypeLambda>

const intArray = fc.array(tinyInteger),
  instance = arrayMonad,
  faB = (n: number) => [n, n],
  fbC = (n: number) => (n > 3 ? [1, n] : [n, 1]),
  laws = (instance: Instance) =>
    Monad({
      F: instance,
      a: tinyInteger,
      b: tinyInteger,
      c: tinyInteger,
      equalsA: NU.Equivalence,
      equalsB: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence,
      getArbitrary: fc.array,
    })

const predicate =
  (instance: Instance) => (a: number, fa: readonly number[]) => {
    const [leftIdentity, rightIdentity, associative] = laws(instance).predicates
    return (
      leftIdentity(a, faB) && rightIdentity(fa) && associative(fa, faB, fbC)
    )
  }

const assertInstance = (instance: Instance) => {
  fc.assert(fc.property(tinyInteger, intArray, predicate(instance)))
}

describe('Monad laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Monad pass', () => {
    assertInstance(instance)
  })

  test('Monad failure: “removing an element” breaks identity law', () => {
    assert.throws(() => {
      assertInstance({
        ...instance,
        flatMap: dual(2, flow(AR.flatMap, AR.drop(1))),
      })
    })
  })
})
