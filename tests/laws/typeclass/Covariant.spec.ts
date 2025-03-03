import {tinyArray} from '#arbitrary'
import {
  covariantLaws,
  type GivenConcerns,
  type Mono,
  unfoldMonoGiven,
} from '#laws'
import {testLaws} from '#test'
import {Covariant as CO} from '@effect/typeclass'
import {Covariant as arrayCovariant} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import {testFailure} from './helpers.js'

type Instance = CO.Covariant<ReadonlyArrayTypeLambda>

const given: GivenConcerns<AR.ReadonlyArrayTypeLambda, Mono> = unfoldMonoGiven(
  AR.getEquivalence,
  tinyArray,
)

const instance = arrayCovariant,
  laws = (instance: Instance) =>
    covariantLaws<ReadonlyArrayTypeLambda, Mono>({F: instance, ...given})

describe('Covariant laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    'failure: “removing an element” breaks identity law',
    laws({
      ...instance,
      map: dual(2, <A, B>(self: readonly A[], f: (a: A) => B) =>
        pipe(self, AR.map(f), AR.drop(1)),
      ),
    }),
  )
})
