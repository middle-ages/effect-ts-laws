import {Invariant as IN} from '@effect/typeclass'
import {Invariant as arrayInvariant} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {checkLaws, invariantLaws} from 'effect-ts-laws'
import {testLaws} from 'effect-ts-laws/vitest'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import {numericGiven} from './helpers.js'

type Instance = IN.Invariant<ReadonlyArrayTypeLambda>

const instance = arrayInvariant,
  laws = (instance: Instance) => invariantLaws({F: instance, ...numericGiven})

describe('Invariant laws self-test', () => {
  pipe(instance, laws, testLaws)

  test('failure: “removing an element” breaks identity law', () => {
    const unlawful: IN.Invariant<ReadonlyArrayTypeLambda> = {
      imap: dual(
        3,
        <A, B>(
          self: readonly A[],
          to: (a: A) => B,
          from: (b: B) => A,
        ): readonly B[] => pipe(instance.imap(self, to, from), AR.drop(1)),
      ),
    }

    expect(pipe(unlawful, laws, checkLaws)[0]).toMatch(/identity/)
  })
})
