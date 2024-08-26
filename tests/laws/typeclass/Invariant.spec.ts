import {Invariant as IN} from '@effect/typeclass'
import {Invariant as arrayInvariant} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import fc from 'fast-check'
import {Invariant, tinyInteger, verboseLaws} from 'effect-ts-laws'

type Instance = IN.Invariant<ReadonlyArrayTypeLambda>

const intArray = fc.array(tinyInteger),
  instance = arrayInvariant,
  fab = NU.increment,
  fbc = NU.multiply(1_000),
  fba = (n: number) => n + (n > 3 ? 1 : -1),
  fcb = NU.multiply(-1),
  laws = (instance: Instance) =>
    Invariant({
      F: instance,
      a: tinyInteger,
      b: tinyInteger,
      c: tinyInteger,
      equalsA: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence,
      getArbitrary: fc.array,
    })

const predicate = (instance: Instance) => (fa: readonly number[]) => {
  const [identity, composition] = laws(instance).predicates
  return identity(fa) && composition(fa, fab, fbc, fba, fcb)
}
const assertInstance = (instance: Instance) => {
  fc.assert(fc.property(intArray, predicate(instance)))
}

describe('Invariant laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Invariant pass', () => {
    assertInstance(instance)
  })

  test('Invariant failure: “removing an element” breaks identity law', () => {
    assert.throws(() => {
      assertInstance({
        imap: dual(
          3,
          <A, B>(
            self: readonly A[],
            to: (a: A) => B,
            from: (b: B) => A,
          ): readonly B[] => pipe(instance.imap(self, to, from), AR.drop(1)),
        ),
      })
    })
  })
})
