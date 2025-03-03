import {monadLaws} from '#laws'
import {testLaws} from '#test'
import {Monad as MD} from '@effect/typeclass'
import {Monad as arrayMonad} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual, flow} from 'effect/Function'
import {numericGiven, testFailure} from './helpers.js'

type Instance = MD.Monad<ReadonlyArrayTypeLambda>

const instance = arrayMonad,
  laws = (instance: Instance) => monadLaws({F: instance, ...numericGiven})

describe('Monad laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    'failure: “removing an element” breaks identity law',
    laws({...instance, flatMap: dual(2, flow(AR.flatMap, AR.drop(1)))}),
  )
})
