import {
  contravariantLaws,
  ContravariantTypeLambda,
  unfoldPropsGiven,
} from '#laws'
import {testLawSets} from '#test'
import {Contravariant as lawful} from '@effect/typeclass/data/Predicate'
import {Predicate as PR} from 'effect'
import {flow, pipe} from 'effect/Function'

const laws = flow(
  unfoldPropsGiven.contravariant<
    ContravariantTypeLambda,
    PR.PredicateTypeLambda
  >,
  contravariantLaws,
)

const numRuns = 2

describe('Contravariant laws with underlyingProps', () => {
  pipe(lawful, laws, testLawSets({numRuns}))
})
