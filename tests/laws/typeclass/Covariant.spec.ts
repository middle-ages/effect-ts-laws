import {Covariant as CO} from '@effect/typeclass'
import {Covariant as arrayCovariant} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {checkLaws, Covariant, testLaws, tinyInteger} from 'effect-ts-laws'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import fc from 'fast-check'

type Instance = CO.Covariant<ReadonlyArrayTypeLambda>

const instance = arrayCovariant,
  laws = (instance: Instance) =>
    Covariant({
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

describe('Covariant laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('failure: “removing an element” breaks identity law', () => {
    const unlawful: CO.Covariant<ReadonlyArrayTypeLambda> = {
      ...instance,
      map: dual(2, <A, B>(self: readonly A[], f: (a: A) => B) =>
        pipe(self, AR.map(f), AR.drop(1)),
      ),
    }

    expect(pipe(unlawful, laws, checkLaws)[0]).toMatch(/identity/)
  })
})
