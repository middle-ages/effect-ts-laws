import {invariantLaws} from '#laws'
import {testLaws} from '#test'
import {Invariant as IN} from '@effect/typeclass'
import {Invariant as arrayInvariant} from '@effect/typeclass/data/Array'
import {Array as AR, pipe} from 'effect'
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {dual} from 'effect/Function'
import {numericGiven, testFailure} from './helpers.js'

type Instance = IN.Invariant<ReadonlyArrayTypeLambda>

const instance = arrayInvariant,
  laws = (instance: Instance) => invariantLaws({F: instance, ...numericGiven})

describe('Invariant laws self-test', () => {
  pipe(instance, laws, testLaws)

  testFailure(
    'failure: “removing an element” breaks identity law',
    laws({
      imap: dual(
        3,
        <A, B>(
          self: readonly A[],
          to: (a: A) => B,
          from: (b: B) => A,
        ): readonly B[] => pipe(instance.imap(self, to, from), AR.drop(1)),
      ),
    }),
  )
})
