import {Monad as MD} from '@effect/typeclass'
import {Monad as arrayMonad} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU, pipe} from 'effect'
import {checkLaws, Monad, testLaws, tinyInteger} from 'effect-ts-laws'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual, flow} from 'effect/Function'
import fc from 'fast-check'

type Instance = MD.Monad<ReadonlyArrayTypeLambda>

const instance = arrayMonad,
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

describe('Monad laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('failure: “removing an element” breaks identity law', () => {
    expect(
      pipe(
        {
          ...instance,
          flatMap: dual(2, flow(AR.flatMap, AR.drop(1))),
        },
        laws,
        checkLaws,
      )[0],
    ).toMatch(/left identity/)
  })
})
