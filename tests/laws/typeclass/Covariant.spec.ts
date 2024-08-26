import {Covariant as CO} from '@effect/typeclass'
import {
  Covariant as arrayCovariant,
  Invariant as arrayInvariant,
} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import fc from 'fast-check'
import {tinyInteger} from '../../../src/arbitraries.js'
import {Covariant} from '../../../src/laws.js'
import {verboseLaws} from '../../../src/law.js'

type Instance = CO.Covariant<ReadonlyArrayTypeLambda>

const intArray = fc.array(tinyInteger),
  instance = arrayCovariant,
  fab = NU.increment,
  fbc = NU.multiply(1_000),
  laws = (instance: Instance) =>
    Covariant({
      F: instance,
      a: tinyInteger,
      b: tinyInteger,
      c: tinyInteger,
      equalsA: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence,
      getArbitrary: fc.array,
    })

const predicate =
  (instance: Instance) =>
  (fa: readonly number[]): boolean => {
    const [identity, composition] = laws(instance).predicates
    return identity(fa) && composition(fa, fab, fbc)
  }

const assertInstance = (instance: Instance) => {
  fc.assert(fc.property(intArray, predicate(instance)))
}

describe('Covariant laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Covariant pass', () => {
    assertInstance(instance)
  })

  test('Covariant failure: “removing an element” breaks identity law', () => {
    assert.throws(() => {
      assertInstance({
        imap: arrayInvariant.imap,
        map: dual(2, <A, B>(self: readonly A[], f: (a: A) => B) =>
          pipe(self, AR.map(f), AR.drop(1)),
        ),
      })
    })
  })
})
