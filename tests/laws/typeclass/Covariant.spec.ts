import {Covariant as CO} from '@effect/typeclass'
import {Covariant as arrayCovariant} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {
  checkLaws,
  covariantLaws,
  GivenConcerns,
  Mono,
  tinyArray,
  unfoldMonoGiven,
} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'

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
