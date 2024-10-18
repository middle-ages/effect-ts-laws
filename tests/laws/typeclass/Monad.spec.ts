import {Monad as MD} from '@effect/typeclass'
import {Monad as arrayMonad} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {checkLaws, monadLaws} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual, flow} from 'effect/Function'
import {numericGiven} from './helpers.js'

type Instance = MD.Monad<ReadonlyArrayTypeLambda>

const instance = arrayMonad,
  laws = (instance: Instance) => monadLaws({F: instance, ...numericGiven})

describe('Monad laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('failure: “removing an element” breaks identity law', () => {
    expect(
      pipe(
        {...instance, flatMap: dual(2, flow(AR.flatMap, AR.drop(1)))},
        laws,
        checkLaws,
      )[0],
    ).toMatch(/left identity/)
  })
})
