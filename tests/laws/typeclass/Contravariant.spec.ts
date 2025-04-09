import {
  contravariantLaws,
  ContravariantTypeLambda,
  unfoldMonoGiven,
  unfoldPropsGiven,
} from '#laws'
import {testLawSets} from '#test'
import {Contravariant as lawful} from '@effect/typeclass/data/Predicate'
import {Boolean as BO, Predicate as PR} from 'effect'
import {dual, flow, pipe} from 'effect/Function'
import {Kind} from 'effect/HKT'
import {testFailure} from './helpers.js'

const numRuns = 2

describe('Contravariant laws self-test', () => {
  describe('underlying type=Option<number>', () => {
    const laws = flow(
      unfoldMonoGiven.contravariant<
        ContravariantTypeLambda,
        PR.PredicateTypeLambda
      >,
      contravariantLaws,
    )

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

  describe('underlying type={x:number; y:string}', () => {
    const laws = flow(
      unfoldPropsGiven.contravariant<
        ContravariantTypeLambda,
        PR.PredicateTypeLambda
      >,
      contravariantLaws,
    )

    pipe(lawful, laws, testLawSets({numRuns}))
  })
})
