import {
  contravariantLaws,
  ContravariantTypeLambda,
  unfoldMonoGiven,
} from '#laws'
import {testLawSets} from '#test'
import {Contravariant as lawful} from '@effect/typeclass/data/Predicate'
import {Boolean as BO, Predicate as PR} from 'effect'
import {dual, flow, pipe} from 'effect/Function'
import {Kind} from 'effect/HKT'
import {testFailure} from './helpers.js'

const laws = flow(
  unfoldMonoGiven.contravariant<
    ContravariantTypeLambda,
    PR.PredicateTypeLambda
  >,
  contravariantLaws,
)

const numRuns = 2

describe('Contravariant laws self-test', () => {
  pipe(lawful, laws, testLawSets({numRuns}))

  testFailure(
    'unlawful',
    laws({
      ...lawful,
      contramap: dual(
        2,
        <R, O, E, A, B>(
          self: Kind<PR.PredicateTypeLambda, R, O, E, A>,
          f: (b: B) => A,
        ): Kind<PR.PredicateTypeLambda, R, O, E, B> =>
          flow(lawful.contramap(self, f), BO.not),
      ),
    }),
  )
})
